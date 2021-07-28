import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup'
import settingsIcon from '../static/img/settings.svg'
import axios from "axios";
import settings from "../helpers/settings";

const MyAccountContent = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [dataChanged, setDataChanged] = useState("");

    const [orders, setOrders] = useState([]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [building, setBuilding] = useState("");
    const [street, setStreet] = useState("");
    const [flat, setFlat] = useState("");

    useEffect(() => {
        /* Get user data */
        axios.post(`${settings.API_URL}/user/get-user`, {
            id: parseInt(localStorage.getItem('sec-user-id'))
        })
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    setFirstName(result.first_name);
                    setLastName(result.last_name);
                    setPhoneNumber(result.phone_number);
                    setPostalCode(result.postal_code);
                    setCity(result.city);
                    setStreet(result.street);
                    setBuilding(result.building);
                    setFlat(result.flat);
                }
            });

        /* Get user orders */
        axios.post(`${settings.API_URL}/user/get-user-orders`, {
            id: parseInt(localStorage.getItem('sec-user-id'))
        })
            .then(res => {
               const result = res.data?.result;
               if(result) {
                   setOrders(result);
               }
            });
    }, []);


    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry'),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy")
    });

    const formik = useFormik({
        initialValues: {
            id: parseInt(localStorage.getItem('sec-user-id')),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            postalCode: postalCode,
            city: city,
            street: street,
            building: building,
            flat: flat
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            axios.post(`${settings.API_URL}/user/update-user`, values)
                .then(res => {
                    if(res.data?.result) {
                        setDataChanged("Dane zostały zmienione");
                    }
                    else {
                        setDataChanged("Coś poszło nie tak... Prosimy spróbować później");
                    }
                });
        }
    });

    const handleChangePassword = (e) => {
        e.preventDefault();
        if((password === repeatPassword)&&(password.length !== 0)) {
            axios.post(`${settings.API_URL}/user/change-user-password`, {
                id: parseInt(localStorage.getItem('sec-user-id')),
                oldPassword: oldPassword,
                newPassword: password
            })
                .then(res => {
                    if(res.data?.result) {
                        setPasswordError("");
                        setPasswordSuccess("Hasło zostało zmienione");

                        setOldPassword("");
                        setPassword("");
                        setRepeatPassword("");
                    }
                    else {
                        setPasswordError("Niepoprawne stare hasło");
                    }
                })
        }
        else if(password.length < 6) {
            setPasswordError("Hasło musi mieć co najmniej 6 znaków długości");
        }
        else {
            setPasswordError("Podane hasła nie są identyczne");
        }
    }

    const logout = () => {
        axios.post(`${settings.API_URL}/auth/logout`, {
            sessionKey: localStorage.getItem('sec-sessionKey')
        })
            .then(res => {
               window.location = "/";
            });
        localStorage.removeItem('sec-sessionKey');
        localStorage.removeItem('sec-user-id');
    }

    return <main className="page page--myAccount">
        <aside className="myAccount__buttons d-flex justify-content-between align-items-center">
            <a className="button--transparent" href="/sklep">
                Przejdź do sklepu
            </a>

            <button className="button--transparent" onClick={() => { logout(); }}>
                Wyloguj się
            </button>
        </aside>
        <section className="clientForm loginForm myAccount">
            <h2 className="clientForm__header text-center">
                Moje konto
            </h2>

            {/* Account data */}
            <h3 className="clientForm__subheader">
                Dane konta
            </h3>
            <form className="myAccount__form" onSubmit={formik.handleSubmit}>
                <span className="clientForm__row d-flex justify-content-between align-items-center">
                    <label className="clientForm__label">
                        <input className="clientForm__input"
                               name="firstName"
                               type="text"
                               value={formik.values.firstName}
                               onChange={formik.handleChange}
                               placeholder="Imię"
                        />
                    </label>
                    <label className="clientForm__label">
                        <input className="clientForm__input"
                               name="lastName"
                               type="text"
                               value={formik.values.lastName}
                               onChange={formik.handleChange}
                               placeholder="Nazwisko"
                        />
                    </label>
                </span>
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
                    <label className="clientForm__label w-68">
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
                    <label className="clientForm__label w-48">
                        <input className="clientForm__input"
                               name="street"
                               type="text"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                        />
                    </label>
                    <label className="clientForm__label w-25">
                        <input className="clientForm__input"
                               name="building"
                               type="text"
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Budynek"
                        />
                    </label>
                     <label className="clientForm__label w-25">
                        <input className="clientForm__input"
                               name="flat"
                               type="text"
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Mieszkanie"
                        />
                    </label>
                </span>
                <button className="addToCartBtn button--login" type="submit">
                    Zmień dane
                    <img className="addToCartBtn__img" src={settingsIcon} alt="dodaj" />
                </button>

                {(formik.errors.postalCode || formik.errors.phoneNumber) && formik.submitCount ? <span className="error error--login mt-3">
                    {formik.errors.postalCode}<br/>{formik.errors.phoneNumber}
                </span> : "" }

                {dataChanged !== "" ? <span className="success mt-2">{dataChanged}</span> : ""}
            </form>

            {/* Orders history */}
            <h3 className="clientForm__subheader">
                Historia zamówień
            </h3>
            <section className="myAccount__orders">
                {orders.map((item, index) => {
                    return <section key={index} className="myAccount__orders__item d-flex flex-wrap justify-content-between align-items-center">
                        <h3 className="myAccount__orders__item__value">
                            #{item.id}
                        </h3>
                        <h3 className="myAccount__orders__item__value">
                            {item.date.substr(0, 10)}
                        </h3>
                        <h3 className="myAccount__orders__item__value">
                            {item.order_price} PLN
                        </h3>
                        <h3 className="myAccount__orders__item__status">
                            {item.order_status}
                        </h3>
                    </section>
                })}
            </section>

            {/* Change password */}
            <h3 className="clientForm__subheader">
                Zmień hasło
            </h3>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="oldPassword"
                       type="password"
                       value={oldPassword}
                       onChange={(e) => { setOldPassword(e.target.value); }}
                       placeholder="Stare hasło"
                />
            </label>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="password"
                       type="password"
                       value={password}
                       onChange={(e) => { setPassword(e.target.value); }}
                       placeholder="Hasło"
                />
            </label>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="repeatPassword"
                       type="password"
                       value={repeatPassword}
                       onChange={(e) => { setRepeatPassword(e.target.value); }}
                       placeholder="Powtórz hasło"
                />
            </label>
            <button className="addToCartBtn button--login" onClick={(e) => { handleChangePassword(e) }}>
                Zmień hasło
                <img className="addToCartBtn__img" src={settingsIcon} alt="dodaj" />
            </button>

            {passwordError !== "" ? <span className="error error--login mt-3">{passwordError}</span> : ""}
            {passwordSuccess !== "" ? <span className="success mt-3">{passwordSuccess}</span> : "" }
        </section>
    </main>
}

export default MyAccountContent;
