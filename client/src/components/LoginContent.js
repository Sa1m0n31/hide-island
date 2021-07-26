import React from 'react'
import arrowLong from "../static/img/arrow-long.svg";

import padlock from '../static/img/padlock.svg'
import user from '../static/img/mail.svg'

const LoginContent = () => {
    return <main className="page loginPage loginPage--client">
        <form className="clientForm loginForm">
            <h2 className="clientForm__header text-center">
                Zaloguj się
            </h2>

            <label className="clientForm__label">
                <img className="clientForm__icon" src={user} alt="login" />
                <input className="clientForm__input"
                       name="email"
                       type="text"
                       placeholder="Adres email"
                />
            </label>
            <label className="clientForm__label">
                <img className="clientForm__icon" src={padlock} alt="haslo" />
                <input className="clientForm__input"
                       name="password"
                       type="password"
                       placeholder="Hasło"
                />
            </label>
            <button className="addToCartBtn button--login">
                Zaloguj się
                <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
            </button>

        </form>
        <a className="registerHintBtn" href="/zarejestruj-sie">
            Nie masz konta? Zarejestruj się!
        </a>
    </main>
}

export default LoginContent;
