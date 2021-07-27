import React, { useState, useEffect } from 'react'
import * as Yup from "yup";
import {useFormik} from "formik";
import arrowLong from "../static/img/arrow-long.svg";
import {calculateCartSum} from "../admin/helpers/orderFunctions";
import settings from "../helpers/settings";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const ShippingForm = () => {
    const [vat, setVat] = useState(false);
    const [shippingMethod, setShippingMethod] = useState(-1);
    const [paymentMethod, setPaymentMethod] = useState(-1);
    const [shippingCost, setShippingCost] = useState(0);
    const [amount, setAmount] = useState(calculateCartSum(JSON.parse(localStorage.getItem('hideisland-cart'))) + shippingCost);

    const shippingMethods = [1, 2, 3];

    useEffect(() => {
        setAmount(calculateCartSum(JSON.parse(localStorage.getItem('hideisland-cart'))) + shippingCost);
    }, [shippingMethod]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Podaj poprawny adres email")
            .required("Wpisz swój adres email"),
        firstName: Yup.string()
            .required("Wpisz swoje imię"),
        lastName: Yup.string()
            .required("Wpisz swoje nazwisko"),
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry')
            .required("Wpisz swój numer telefonu"),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy")
            .required("Wpisz swój kod pocztowy"),
        city: Yup.string()
            .required("Wpisz swoją miejscowość"),
        street: Yup.string()
            .required("Wpisz swoją ulicę"),
        building: Yup.string()
            .required("Wpisz numer budynku")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            postalCode: "",
            city: "",
            street: "",
            building: "",
            flat: "",
            companyName: "",
            nip: ""
        },
        validationSchema,
        onSubmit: (values) => {
            const sessionId = uuidv4();

            /* Add user */
            axios.post(`${settings.API_URL}/auth/add-user`, {
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                phoneNumber: formik.values.phoneNumber
            })
                .then(res => {
                    let insertedUserId = res.data.result;

                    /* Add order */
                    axios.post(`${settings.API_URL}/order/add`, {
                        paymentMethod: paymentMethod+1,
                        shippingMethod: shippingMethod+1,
                        city: formik.values.city,
                        street: formik.values.street,
                        building: formik.values.building,
                        flat: formik.values.flat,
                        postalCode: formik.values.postalCode,
                        user: insertedUserId !== -1 ? insertedUserId : null,
                        comment: formik.values.comment,
                        sessionId,
                        companyName: formik.values.companyName,
                        nip: formik.values.nip
                    })
                        .then(res => {
                            const orderId = res.data.result;

                            /* Add sells */
                            const cart = JSON.parse(localStorage.getItem('hideisland-cart'));
                            cart?.forEach((item, cartIndex) => {
                                /* Add sells */
                                axios.post(`${settings.API_URL}/order/add-sell`, {
                                    orderId,
                                    productId: item.id,
                                    size: item.size,
                                    quantity: item.amount
                                })
                                    .then(res => { console.log(res.data) })
                            });

                            /* PAYMENT PROCESS */
                            let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                            axios.post(`${settings.API_URL}/payment/payment`, {
                                sessionId,
                                email: formik.values.email,
                                amount
                            })
                                .then(res => {
                                    /* Remove cart from local storage */
                                    localStorage.removeItem('hideisland-cart');

                                    const token = res.data.result;
                                    window.location.href = `${paymentUri}${token}`;
                                });
                        });
        });
    }});

    return <section className="shippingForm">
        <h2 className="cart__header">
            Uzupełnij dane do wysyłki
        </h2>
        <form className="shippingForm__form" onSubmit={formik.handleSubmit}>
            <section className="shippingForm__section">
                <h3 className="clientForm__subheader">
                    Dane dostawy
                </h3>
                <span className="clientForm__row d-flex justify-content-between align-items-center">
                <label className={formik.errors.firstName && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="firstName"
                           type="text"
                           value={formik.values.firstName}
                           onChange={formik.handleChange}
                           placeholder="Imię"
                    />
                </label>
                <label className={formik.errors.lastName && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="lastName"
                           type="text"
                           value={formik.values.lastName}
                           onChange={formik.handleChange}
                           placeholder="Nazwisko"
                    />
                </label>
            </span>
                <label className={formik.errors.email && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="email"
                           type="text"
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           placeholder="Adres email"
                    />
                </label>
                <label className={formik.errors.phoneNumber && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="phoneNumber"
                           type="text"
                           value={formik.values.phoneNumber}
                           onChange={formik.handleChange}
                           placeholder="Numer telefonu"
                    />
                </label>
                <span className="clientForm__row d-flex justify-content-between align-items-center">
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-30 input--error" : "clientForm__label w-30"}>
                        <input className="clientForm__input"
                               name="postalCode"
                               type="text"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-68 input--error" : "clientForm__label w-68"}>
                        <input className="clientForm__input"
                               name="city"
                               type="text"
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               placeholder="Miejscowość"
                        />
                    </label>
                </span>
                <span className="clientForm__row d-flex justify-content-between align-items-center">
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-48 input--error" : "clientForm__label w-48"}>
                        <input className="clientForm__input"
                               name="street"
                               type="text"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="building"
                               type="text"
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Budynek"
                        />
                    </label>
                     <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="flat"
                               type="text"
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Mieszkanie"
                        />
                    </label>
                </span>


                <label className="clientForm__label clientForm__label--textArea">
                    <textarea placeholder="Komentarz do zamówienia (opcjonalnie)"
                              className="textarea" />
                </label>

            <label className="label--button">
                <button className="formBtn" onClick={(e) => { e.preventDefault(); setVat(!vat); }}>
                    <span className={vat ? "formBtn--checked" : "d-none"}></span>
                </button>
                Chcę otrzymać fakturę VAT
            </label>


                {vat ? <section className="clientForm--vat mt-4">
                    <h3 className="clientForm__subheader">
                        Dane do faktury
                    </h3>
                    <label className="clientForm__label">
                        <input className="clientForm__input"
                               name="companyName"
                               type="text"
                               value={formik.values.companyName}
                               onChange={formik.handleChange}
                               placeholder="Nazwa firmy"
                        />
                    </label>
                    <label className="clientForm__label">
                        <input className="clientForm__input"
                               name="nip"
                               type="text"
                               value={formik.values.nip}
                               onChange={formik.handleChange}
                               placeholder="NIP"
                        />
                    </label>
                </section> : ""}
            </section>

            <section className="shippingForm__section mt-5 mt-lg-0">
                <h3 className="clientForm__subheader">
                    Dostawa i płatność
                </h3>
                <h4 className="clientForm__shippingHeader">
                    Wybierz sposób dostawy:
                </h4>
                <section className="shippingMethods">
                    {shippingMethods.map((item, index) => {
                        return <label className="label--button mb-3">
                            <button className="formBtn" onClick={(e) => { e.preventDefault();
                            setShippingMethod(index);
                            setShippingCost(2);
                            }}>
                                <span className={shippingMethod === index ? "formBtn--checked" : "d-none"}></span>
                            </button>
                            Paczkomaty InPost (2 PLN)
                        </label>
                    })}
                </section>

                <h4 className="clientForm__shippingHeader mt-5">
                    Wybierz sposób płatności:
                </h4>
                <section className="paymentMethods">
                    <label className="label--button mb-3">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); setPaymentMethod(0); }}>
                            <span className={paymentMethod === 0 ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Płatności internetowe (Przelewy24)
                    </label>
                    <label className="label--button mb-3">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); setPaymentMethod(1); }}>
                            <span className={paymentMethod === 1 ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Płatność za pobraniem
                    </label>
                </section>

                <h4 className="clientForm__shippingHeader mt-5">
                    Łącznie do zapłaty: <b>{amount} PLN</b>
                </h4>

                <button className="addToCartBtn button--login button--payment mt-5" type="submit">
                    Przechodzę do płatności
                    <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                </button>

                <span className="error error--login mt-4">
                    {formik.errors.firstName && formik.submitCount ? <span className="newLine">{formik.errors.firstName}</span> : ""}
                    {formik.errors.lastName && formik.submitCount ? <span className="newLine">{formik.errors.lastName}</span> : ""}
                        {formik.errors.phoneNumber && formik.submitCount ? <span className="newLine">{formik.errors.phoneNumber}</span> : ""}
                        {formik.errors.postalCode && formik.submitCount ? <span className="newLine">{formik.errors.postalCode}</span> : ""}
                        {formik.errors.email && formik.submitCount ? <span className="newLine">{formik.errors.email}</span> : ""}
                        {formik.errors.city && formik.submitCount ? <span className="newLine">{formik.errors.city}</span> : ""}
                        {formik.errors.building && formik.submitCount ? <span className="newLine">{formik.errors.building}</span> : ""}
                        {formik.errors.street && formik.submitCount ? <span className="newLine">{formik.errors.street}</span> : ""}

                    {shippingMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę wysyłki</span> : ""}
                    {paymentMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę płatności</span> : "" }
                </span>
            </section>
        </form>
    </section>
}

export default ShippingForm;
