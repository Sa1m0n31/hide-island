import React, { useState, useEffect } from 'react'
import * as Yup from "yup";
import {useFormik} from "formik";
import arrowLong from "../static/img/arrow-long.svg";
import settings from "../helpers/settings";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import auth from "../admin/helpers/auth";
import GeolocationWidget from "./GeolocationWidget";
import Modal from "react-modal";
import closeImg from "../static/img/close.png";
import tickIcon from '../static/img/tick-sign.svg'

const ShippingForm = ({sum}) => {
    const [vat, setVat] = useState(false);
    const [shippingMethod, setShippingMethod] = useState(-1);
    const [paymentMethod, setPaymentMethod] = useState(-1);
    const [shippingCost, setShippingCost] = useState(0);
    const [amount, setAmount] = useState(sum + shippingCost);
    const [isAuth, setIsAuth] = useState(false);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [inPostModal, setInPostModal] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [flat, setFlat] = useState("");
    const [coupon, setCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponVerified, setCouponVerified] = useState(-1);
    const [discount, setDiscount] = useState("");
    const [accountExistsError, setAccountExistsError] = useState("");
    const [inPostAddress, setInPostAddress] = useState("");
    const [inPostCode, setInPostCode] = useState("");
    const [inPostCity, setInPostCity] = useState("");
    const [checkbox, setCheckbox] = useState(false);
    const [marketingCheckbox, setMarketingCheckbox] = useState(false);
    const [discountInPLN, setDiscountInPLN] = useState(0);

    useEffect(() => {
        window.easyPackAsyncInit = function () {
            window.easyPack.init({
                mapType: 'google',
                searchType: 'osm',
                map: {
                    googleKey: 'AIzaSyAS0nA7DChYpHzv5CVpXM1K4vqYaGNCElw'
                }
            });
            if(document.querySelector(".cart")) {
                const map = window.easyPack.mapWidget('paczkomatyMapa', function(point) {
                    /* Paczkomat zostal wybrany */
                    sessionStorage.setItem('paczkomat-id', point.name);
                    sessionStorage.setItem('paczkomat-miasto', point.address_details.city);
                    sessionStorage.setItem('paczkomat-kod', point.address_details.post_code);
                    sessionStorage.setItem('paczkomat-adres', point.address_details.street + " " + point.address_details.building_number);

                    const storage = new Event('storage');
                    document.dispatchEvent(storage);

                    const modal = document.querySelector(".bigModal");
                    if(modal) {
                      modal.style.opacity = "0";
                      setTimeout(() => {
                        modal.style.display = "none";
                      }, 500);
                    }
                });
            }
        };
    }, [inPostModal]);

    useEffect(() => {
        /* Check if login - then set form data */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
                if(res.data?.result) {
                    axios.post(`${settings.API_URL}/user/get-user`, {
                        id: parseInt(localStorage.getItem('sec-user-id'))
                    })
                        .then(res => {
                            const result = res.data?.result;
                            if(result) {
                                setIsAuth(true);
                                setEmail(result.email);
                                setFirstName(result.first_name);
                                setLastName(result.last_name);
                                setPhoneNumber(result.phone_number);
                                setCity(result.city);
                                setPostalCode(result.postal_code);
                                setStreet(result.street);
                                setBuilding(result.building);
                                setFlat(result.flat);
                            }
                        });
                }
            });

        /* Check shipping methods */
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
               if(res.data?.result) {
                   setShippingMethods(res.data.result);
               }
            });

        /* Listener */
        document.addEventListener("click", () => {
            setInPostAddress(sessionStorage.getItem('paczkomat-adres'));
            setInPostCode(sessionStorage.getItem('paczkomat-kod'));
            setInPostCity(sessionStorage.getItem('paczkomat-miasto'));
        })
    }, []);

    useEffect(() => {
        setAmount(sum + shippingCost);
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
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            postalCode: postalCode,
            city: city,
            street: street,
            building: building,
            flat: flat,
            companyName: "",
            nip: "",
            comment: ""
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if((shippingMethod !== -1)&&(paymentMethod !== -1)) {
                    const sessionId = uuidv4();

                    /* Add user */
                    if(!isAuth) {
                        axios.post(`${settings.API_URL}/auth/add-user`, {
                            firstName: formik.values.firstName,
                            lastName: formik.values.lastName,
                            email: formik.values.email,
                            phoneNumber: formik.values.phoneNumber,
                            street: formik.values.street,
                            building: formik.values.building,
                            flat: formik.values.flat,
                            city: formik.values.city,
                            postalCode: formik.values.postalCode
                           })
                            .then(res => {
                                if(res.data.result === -1) {
                                    setAccountExistsError("Istnieje konto o podanym adresie email. Aby dokonać zakupu, zaloguj się.");
                                }
                                else {
                                    addOrder(res, sessionId);
                                }
                            });
                    }
                    else {
                        addOrder(null, sessionId);
                    }
            }
    }});

    const addOrder = (res, sessionId) => {
        let insertedUserId = null;

        if(res) insertedUserId = res.data.userId;

        if(checkbox) {
            /* Add to newsletter */
            if(marketingCheckbox) {
                axios.post(`${settings.API_URL}/newsletter/add`, {
                    email: formik.values.email
                });
            }

            /* Decrement coupon code times_to_use */
            if(couponVerified === 1) {
                axios.post(`${settings.API_URL}/coupon/decrement`, {
                    couponContent: couponCode
                });
            }

            /* Add order */
            axios.post(`${settings.API_URL}/order/add`, {
                paymentMethod: paymentMethod,
                shippingMethod: shippingMethod,
                city: formik.values.city,
                street: formik.values.street,
                building: formik.values.building,
                flat: formik.values.flat,
                postalCode: formik.values.postalCode,
                user: insertedUserId !== -1 && insertedUserId ? insertedUserId : parseInt(localStorage.getItem('sec-user-id')),
                comment: formik.values.comment,
                sessionId,
                companyName: formik.values.companyName,
                nip: formik.values.nip,
                amount: sum + shippingCost - discountInPLN,
                inPostName: sessionStorage.getItem('paczkomat-id'),
                inPostAddress: sessionStorage.getItem('paczkomat-adres'),
                inPostCode: sessionStorage.getItem('paczkomat-kod'),
                inPostCity: sessionStorage.getItem('paczkomat-miasto'),
                amountBeforeDiscount: sum + shippingCost
            })
                .then(res => {
                    const orderId = res.data.result;

                    if(orderId) {
                        console.log(orderId);
                        /* Add sells */
                        const cart = JSON.parse(localStorage.getItem('hideisland-cart'));
                        cart?.forEach((item, cartIndex, cartArray) => {
                            /* Add sells */
                            axios.post(`${settings.API_URL}/order/add-sell`, {
                                orderId,
                                productId: item.id,
                                size: item.size,
                                quantity: item.amount,
                                paymentMethod: paymentMethod
                            })
                                .then(res => {
                                    if(cartIndex === cartArray.length-1) {
                                        if(paymentMethod === 2) {
                                            /* Platnosc za pobraniem */
                                            localStorage.setItem('hideisland-ty', 'true');
                                            window.location = "/dziekujemy";

                                            /* Remove cart from local storage */
                                            localStorage.removeItem('hideisland-cart');
                                        }
                                        else {
                                            /* PAYMENT PROCESS */
                                            let paymentUri = "https://secure.przelewy24.pl/trnRequest/";

                                            axios.post(`${settings.API_URL}/payment/payment`, {
                                                sessionId,
                                                email: formik.values.email,
                                                amount: sum + shippingCost - discountInPLN
                                            })
                                                .then(res => {
                                                    /* Remove cart from local storage */
                                                    localStorage.removeItem('hideisland-cart');

                                                    const token = res.data.result;
                                                    window.location.href = `${paymentUri}${token}`;
                                                });
                                        }

                                        axios.post(`https://hideisland.pl/order/send-order-info`, {
                                            orderId
                                        })
                                            .then((res) => {
                                                console.log("order info sended");

                                            })
                                    }
                                })
                        });
                    }
                    else {
                        window.location = "/";
                    }
                });
        }
    }

    const verifyCoupon = () => {
        axios.post(`${settings.API_URL}/coupon/verify`, {
            code: couponCode
        })
            .then(res => {
                const result = res.data;
                if(result) {
                    if(result.percent) {
                        setCouponVerified(1);
                        setAmount(Math.round(sum - sum * (result.percent / 100)));
                        setDiscount("-" + result.percent + "%");
                        setDiscountInPLN(Math.round(sum * (result.percent / 100)));
                    }
                    else if(result.amount) {
                        setCouponVerified(1);
                        setAmount(sum - result.amount);
                        setDiscount("-" + result.amount + " PLN");
                        setDiscountInPLN(result.amount);
                    }
                    else {
                        setCouponVerified(0);
                    }
                }
                else {
                    setCouponVerified(0);
                }
            });
    }

    useEffect(() => {
        if(shippingMethod === 1 || shippingMethod === 3) setPaymentMethod(1);
        else if(shippingMethod === 7) setPaymentMethod(2);
    }, [shippingMethod]);

    useEffect(() => {
        if(couponVerified === 0) {
            setTimeout(() => {
                setCouponVerified(-1);
            }, 2000);
        }
    }, [couponVerified]);

    return <section className="shippingForm">

        <Modal
            isOpen={inPostModal}
            portalClassName="smallModal bigModal"
            onRequestClose={() => { setInPostModal(false) }}
        >

            <button className="modalClose" onClick={() => { setInPostModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <GeolocationWidget />
        </Modal>

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
                           disabled={isAuth}
                           value={formik.values.firstName}
                           onChange={formik.handleChange}
                           placeholder="Imię"
                    />
                </label>
                <label className={formik.errors.lastName && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="lastName"
                           type="text"
                           disabled={isAuth}
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
                           disabled={isAuth}
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           placeholder="Adres email"
                    />
                </label>
                <label className={formik.errors.phoneNumber && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                    <input className="clientForm__input"
                           name="phoneNumber"
                           type="text"
                           disabled={isAuth}
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
                               disabled={isAuth}
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-68 input--error" : "clientForm__label w-68"}>
                        <input className="clientForm__input"
                               name="city"
                               type="text"
                               disabled={isAuth}
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
                               disabled={isAuth}
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                        />
                    </label>
                    <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="building"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Budynek"
                        />
                    </label>
                     <label className={formik.errors.postalCode && formik.submitCount ? "clientForm__label w-25 input--error" : "clientForm__label w-25"}>
                        <input className="clientForm__input"
                               name="flat"
                               type="text"
                               disabled={isAuth}
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Mieszkanie"
                        />
                    </label>
                </span>


                <label className="clientForm__label clientForm__label--textArea">
                    <textarea placeholder="Komentarz do zamówienia (opcjonalnie)"
                              name="comment"
                              value={formik.values.comment}
                              onChange={formik.handleChange}
                              className="textarea" />
                </label>

            <label className="label--button">
                <button className="formBtn" onClick={(e) => { e.preventDefault(); setVat(!vat); }}>
                    <span className={vat ? "formBtn--checked" : "d-none"}></span>
                </button>
                Chcę otrzymać fakturę
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
                        if(item.id < 8) {
                            return <><label className="label--button mb-3">
                                <button className="formBtn" onClick={(e) => { e.preventDefault();
                                    setShippingMethod(item.id);
                                    setShippingCost(sum >= 250 ? 0 : item.price);
                                    if(index === 0) {
                                        /* Paczkomaty */
                                        document.querySelector(".bigModal").style.display = "block";
                                        document.querySelector(".bigModal").style.opacity = "1";
                                        document.querySelector("#easypack-search")?.setAttribute('autocomplete', 'off');
                                        setInPostModal(true);
                                    }
                                }}>
                                    <span className={shippingMethod === item.id ? "formBtn--checked" : "d-none"}></span>
                                </button>
                                {item.name} ({sum < 250 ? item.price : 0} PLN)
                            </label>
                                {index === 0 && shippingMethod === item.id ? <address className="inPostAddress">
                                    {inPostAddress} <br/>
                                    {inPostCode} {inPostCity}
                                </address> : ""}
                            </>
                        }
                    })}
                </section>

                <h4 className="clientForm__shippingHeader mt-5">
                    Wybierz sposób płatności:
                </h4>
                <section className="paymentMethods">
                    <label className="label--button mb-3">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); }}>
                            <span className={paymentMethod === 1 ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Płatności internetowe (Przelewy24)
                    </label>
                    <label className="label--button mb-3">
                        <button className="formBtn" onClick={(e) => { e.preventDefault(); }}>
                            <span className={paymentMethod === 2 ? "formBtn--checked" : "d-none"}></span>
                        </button>
                        Płatność za pobraniem
                    </label>
                </section>

                <h3 className="clientForm__subheader mt-5 mb-4">
                    Kod rabatowy
                </h3>
                <label className="label--button mt-3">
                    <button className="formBtn" onClick={(e) => { e.preventDefault(); setCoupon(!coupon); }}>
                        <span className={coupon ? "formBtn--checked" : "d-none"}></span>
                    </button>
                    Mam kod rabatowy
                </label>

                {coupon ? <section className="clientForm--vat clientForm--coupon mt-4 d-flex justify-content-between align-items-center">
                    <label className="clientForm__label mb-0">
                        <input className="clientForm__input mb-0"
                               name="companyName"
                               type="text"
                               value={couponCode}
                               disabled={couponVerified === 1}
                               onChange={(e) => { setCouponCode(e.target.value); }}
                               placeholder="Tu wpisz kod rabatowy"
                        />
                    </label>
                    {couponVerified !== 1 && couponVerified !== 0 ? <button className="addToCartBtn button--login button--payment button--coupon mt-0"
                        onClick={(e) => {
                            e.preventDefault();
                            verifyCoupon();
                        }}
                    >
                        Dodaj kod
                    </button> : (couponVerified === 1 ? <h4 className="couponInfo couponInfo--success">
                        <img className="tickImg d-none d-md-inline" src={tickIcon} alt="dodany" />
                        Kupon został dodany
                    </h4> : "")}

                    {couponVerified === 0 ? <h4 className="couponInfo couponInfo--error">
                        Podany kupon nie istnieje
                    </h4> : ""}
                </section> : ""}

                {couponVerified === 1 ? <h4 className="clientForm__shippingHeader mt-5">
                    Kod rabatowy: <b>{couponCode} ({discount})</b>
                </h4> : ""}

                <h4 className="clientForm__shippingHeader mt-4">
                    Łącznie do zapłaty: <b>{sum + shippingCost - discountInPLN} PLN</b>
                </h4>

                <label className="w-100 clientForm__label--checkbox mb-4 mb-sm-0">
                    <input className="clientForm__checkbox"
                           name="check"
                           type="checkbox"
                           value={checkbox}
                           onChange={() => { setCheckbox(!checkbox); }} />

                    Zapoznałem/am się z <a href="/regulamin">Regulaminem</a> i <a href="/polityka-prywatnosci">Polityką prywatności</a> *.
                </label>

                <label className="w-100 clientForm__label--checkbox clientForm__label--checkbox--marketing mb-4">
                    <input className="clientForm__checkbox clientForm__checkbox--marketing"
                           name="marketingCheckbox"
                           type="checkbox"
                           value={marketingCheckbox}
                           onChange={() => { setMarketingCheckbox(!marketingCheckbox); }} />

                    Wyrażam zgodę na przetwarzanie przez HideIsland Dominik Adamczyk moich danych osobowych w postaci adresu poczty elektronicznej w celu przesyłania mi informacji marketingowych dotyczących produktów i usług oferowanych przez HideIsland Dominik Adamczyk za pomocą środków komunikacji elektronicznej, stosownie do treści przepisu art.10 ust. 1 i 2 ustawy o świadczeniu usług drogą elektroniczną.
                </label>

                <button className="addToCartBtn button--login button--payment mt-1" disabled={!checkbox} type="submit">
                    {paymentMethod === 2 ? "Kupuję" : "Przechodzę do płatności"}
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
                        {accountExistsError !== "" ? accountExistsError : ""}

                    {shippingMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę wysyłki</span> : ""}
                    {paymentMethod === -1 && formik.submitCount ? <span className="newLine">Wybierz metodę płatności</span> : "" }
                </span>
            </section>
        </form>
    </section>
}

export default ShippingForm;
