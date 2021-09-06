import React, { useState } from "react";
import arrowLong from "../static/img/arrow-long.svg";

import { useFormik } from "formik";
import * as Yup from 'yup'
import axios from "axios";
import settings from "../helpers/settings";

const RegisterContent = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Podaj poprawny adres email")
            .required("Wpisz swój adres email"),
        password: Yup.string()
            .min(6, "Hasło musi składać się z co najmniej sześciu znaków")
            .required("Wpisz hasło"),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Podane hasła nie są identyczne")
            .required("Powtórz hasło"),
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry'),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy"),
        check: Yup.boolean()
            .oneOf([true])
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            repeatPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            postalCode: "",
            city: "",
            street: "",
            building: "",
            flat: "",
            check: false
        },
        validationSchema,
        onSubmit: ({email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat}) => {
            axios.post(`${settings.API_URL}/auth/add-user`, {
                email, password,
                firstName, lastName, phoneNumber,
                postalCode, city, street, building, flat
            })
                .then(res => {
                    if(res.data?.result === 1) {
                        localStorage.setItem('hideisland-user-registered', 'true');
                        window.location = '/konto-zalozone';
                    }
                    else if(res.data?.result === -1) {
                        localStorage.setItem('hideisland-user-registered', 'exists');
                        window.location = "/konto-zalozone";
                    }
                    else {
                        localStorage.setItem('hideisland-user-registered', 'false');
                        window.location = '/konto-zalozone';
                    }
                });
        }
    })

    return <main className="page registerPage">
        <form className="clientForm registerForm" onSubmit={formik.handleSubmit}>
            <h2 className="clientForm__header text-center">
                Zarejestruj się
            </h2>

            <h3 className="clientForm__subheader">
                Dane logowania
            </h3>
            <label className={formik.errors.email && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                <input className="clientForm__input"
                       name="email"
                       type="text"
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       placeholder="Adres email*"
                />
                <span className="error">{formik.errors.email && formik.submitCount ? formik.errors.email : ""}</span>
            </label>
            <label className={formik.errors.password && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                <input className="clientForm__input"
                       name="password"
                       type="password"
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       placeholder="Hasło*"
                />
                <span className="error">{formik.errors.password && formik.submitCount ? formik.errors.password : ""}</span>
            </label>
            <label className={formik.errors.repeatPassword && formik.submitCount ? "clientForm__label input--error" : "clientForm__label"}>
                <input className="clientForm__input"
                       name="repeatPassword"
                       type="password"
                       value={formik.values.repeatPassword}
                       onChange={formik.handleChange}
                       placeholder="Powtórz hasło*"
                />
                <span className="error">{formik.errors.repeatPassword && formik.submitCount ? formik.errors.repeatPassword : ""}</span>
            </label>
            <h3 className="clientForm__subheader">
                Dane osobowe
            </h3>
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
                <span className="error">{formik.errors.phoneNumber && formik.submitCount ? formik.errors.phoneNumber : ""}</span>
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

            <label className="w-100 clientForm__label--checkbox mb-4 mb-sm-0">
                <input className="clientForm__checkbox"
                       name="check"
                       type="checkbox"
                       value={formik.values.check}
                       onChange={formik.handleChange} />

                Zapoznałem/am się z <a href="/regulamin">Regulaminem</a> i <a href="/polityka-prywatnosci">Polityką prywatności</a>.
            </label>

            <button className="addToCartBtn button--login">
                Załóż konto
                <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
            </button>
        </form>
    </main>
}

export default RegisterContent;
