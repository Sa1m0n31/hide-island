import React, { useEffect, useState } from 'react'
import logo from '../static/img/logo.png'
import {getAllCategories} from "../helpers/categoryFunctions";
import axios from "axios";
import settings from "../helpers/settings";

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState("");
    const [newsletterResponse, setNewsletterResponse] = useState(0);

    useEffect(() => {
        getAllCategories()
            .then(res => {
                if(res?.data?.result) {
                    setCategories(res.data.result);
                }
            })
    }, []);

    const isEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const addToNewsletter = () => {
        if(isEmail(email)) {
            axios.post(`${settings.API_URL}/newsletter/add`, { email })
                .then(res => {
                    if(res.data.result === 1) {
                        setNewsletterResponse(1);
                        setEmail("");
                    }
                    else {
                        setNewsletterResponse(-1);
                    }
                });
        }
        else {
            setNewsletterResponse(2);
        }
    }

    useEffect(() => {
        if(newsletterResponse !== 0) {
            setTimeout(() => {
                setNewsletterResponse(0);
            }, 3000);
        }
    }, [newsletterResponse]);

    return <footer className="footer">
        <section className="footer__row d-flex justify-content-between align-items-center align-items-md-start">
            <section className="footer__menu">
                <h4 className="footer__menu__header">
                    Informacje
                </h4>
                <ul className="footer__menu__list">
                    <li className="footer__menu__item">
                        <a className="footer__menu__link" href="/regulamin">
                            Regulamin
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link" href="/polityka-prywatnosci">
                            Polityka prywatności
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link" href="/zwroty-i-reklamacje">
                            Reklamacje i zwroty
                        </a>
                    </li>
                </ul>
            </section>

            <section className="footer__menu">
                <h4 className="footer__menu__header">
                    Kategorie
                </h4>
                <ul className="footer__menu__list">
                    {categories?.map((item, index) => {
                        if(index < 4) {
                            return <li className="footer__menu__item" key={index}>
                                <a className="footer__menu__link" href={`/kategoria/${item.permalink}`}>
                                    {item.name}
                                </a>
                            </li>
                        }
                    })}
                </ul>
            </section>

            <section className="footer__menu">
                <h4 className="footer__menu__header">
                    Hideisland
                </h4>

                <p>
                    <b>HideIsland - ubranka</b><br/>
                    ul. Polska 2/1, 87-100 Los Angeles
                </p>
                <p>
                    tel. 111 222 333 <br/>
                    mail: kontakt@hideisland.pl
                </p>
                <p>
                    Bank PKO BP<br/>
                    Nr konta 25 2222 3333 1111 1111 4544 0000<br/>
                    Infolinia czynna od poniedziałku do piątku w godzinach 8.00 - 16.00.
                </p>
            </section>
        </section>
        <section className="footer__row d-flex justify-content-between align-items-start">
            <section className="footer__newsletter">
                <h3 className="footer__newsletter__header">
                    Nie pozwól, by Cię coś ominęło! <b>Zapisz się do newslettera!</b>
                </h3>
                <section className="footer__newsletter__form">
                    {!newsletterResponse ? <>
                        <label className="footer__label">
                            <input className="footer__input"
                                   name="email"
                                   type="email"
                                   value={email}
                                   onChange={(e) => { setEmail(e.target.value); }}
                                   placeholder="Tu wpisz swój e-mail" />
                        </label>
                        <button className="footer__btn" onClick={() => { addToNewsletter() }}>
                            Zapisz się
                        </button>
                    </> : <h4 className="newsletterResponse">
                        {newsletterResponse === 2 ? "Proszę podać poprawny adres e-mail" : newsletterResponse === 1 ? "Dziękujemy za zapisanie się do naszego newslettera" : "Podany adres e-mail jest już zapisany do naszego newslettera"}
                    </h4> }
                </section>
            </section>

            <img className="footer__logo d-none d-md-block" src={logo} alt="hideisland-logo" />
        </section>
        <aside className="footer__bottom">
            <h6 className="footer__bottom__header">
                Copyright { new Date().getFullYear() } HideIsland. Wszystkie prawa zastrzeżone
            </h6>
            <h6 className="footer__bottom__header">
                Projekt i wykonanie: <a className="footer__bottom__link" href="https://skylo.pl" target="_blank" rel="noreferrer">skylo.pl</a>
            </h6>
        </aside>
    </footer>
}

export default Footer;
