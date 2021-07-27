import React, { useState } from 'react'
import arrowLong from "../static/img/arrow-long.svg";

import padlock from '../static/img/padlock.svg'
import user from '../static/img/mail.svg'
import axios from "axios";
import settings from "../helpers/settings";

const LoginContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useState(-1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if((email !== "")&&(password !== "")) {
            axios.post(`${settings.API_URL}/auth/login-user`, {
                username: email,
                password: password
            })
                .then(res => {
                    if(res.data?.result) {
                        setAuth(1);
                        localStorage.setItem('sec-sessionKey', res.data.sessionKey);
                        localStorage.setItem('sec-user-id', res.data.id);
                        window.location = "/moje-konto"
                    }
                    else {
                        setAuth(0);
                    }
                });
        }
        else {

        }
    }

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
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }}
                       placeholder="Adres email"
                />
            </label>
            <label className="clientForm__label">
                <img className="clientForm__icon" src={padlock} alt="haslo" />
                <input className="clientForm__input"
                       name="password"
                       type="password"
                       value={password}
                       onChange={(e) => { setPassword(e.target.value); }}
                       placeholder="Hasło"
                />
            </label>
            <button className="addToCartBtn button--login" onClick={(e) => { handleSubmit(e) }}>
                Zaloguj się
                <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
            </button>

            {auth === 0 ? <span className="error error--login">Nie znaleziono konta o podanym haśle i adresie email</span> : "" }

        </form>
        <a className="registerHintBtn" href="/zarejestruj-sie">
            Nie masz konta? Zarejestruj się!
        </a>
    </main>
}

export default LoginContent;
