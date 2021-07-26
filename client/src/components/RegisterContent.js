import React from "react";
import user from "../static/img/mail.svg";
import arrowLong from "../static/img/arrow-long.svg";

const RegisterContent = () => {
    return <main className="page registerPage">
        <form className="clientForm registerForm">
            <h2 className="clientForm__header text-center">
                Zarejestruj się
            </h2>

            <h3 className="clientForm__subheader">
                Dane logowania
            </h3>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="email"
                       type="text"
                       placeholder="Adres email"
                />
            </label>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="password"
                       type="password"
                       placeholder="Hasło"
                />
            </label>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="repeatPassword"
                       type="password"
                       placeholder="Powtórz hasło"
                />
            </label>

            <h3 className="clientForm__subheader">
                Dane osobowe
            </h3>
            <span className="clientForm__row d-flex justify-content-between align-items-center">
                <label className="clientForm__label">
                    <input className="clientForm__input"
                           name="firstName"
                           type="text"
                           placeholder="Imię"
                    />
                </label>
                <label className="clientForm__label">
                    <input className="clientForm__input"
                           name="lastName"
                           type="text"
                           placeholder="Nazwisko"
                    />
                </label>
            </span>
            <label className="clientForm__label">
                <input className="clientForm__input"
                       name="phoneNumber"
                       type="text"
                       placeholder="Numer telefonu"
                />
            </label>
            <span className="clientForm__row d-flex justify-content-between align-items-center">
                <label className="clientForm__label w-30">
                    <input className="clientForm__input"
                           name="postalCode"
                           type="text"
                           placeholder="Kod pocztowy"
                    />
                </label>
                <label className="clientForm__label w-68">
                    <input className="clientForm__input"
                           name="city"
                           type="text"
                           placeholder="Miejscowość"
                    />
                </label>
            </span>
            <span className="clientForm__row d-flex justify-content-between align-items-center">
                <label className="clientForm__label w-48">
                    <input className="clientForm__input"
                           name="street"
                           type="text"
                           placeholder="Numer domu"
                    />
                </label>
                <label className="clientForm__label w-25">
                    <input className="clientForm__input"
                           name="building"
                           type="text"
                           placeholder="Budynek"
                    />
                </label>
                 <label className="clientForm__label w-25">
                    <input className="clientForm__input"
                           name="flat"
                           type="text"
                           placeholder="Mieszkanie"
                    />
                </label>
            </span>



            <button className="addToCartBtn button--login">
                Załóż konto
                <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
            </button>
        </form>
    </main>
}

export default RegisterContent;
