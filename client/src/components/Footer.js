import React, { useEffect, useState } from 'react'
import logo from '../static/img/logo.png'
import axios from "axios";
import settings from "../helpers/settings";
import mailIcon from "../static/img/mail.svg";
import {getAllParentCategories} from "../admin/helpers/categoriesFunctions";

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState("");
    const [newsletterResponse, setNewsletterResponse] = useState(0);

    useEffect(() => {
        getAllParentCategories()
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
                    <li className="footer__menu__item">
                        <a className="footer__menu__link" href="/dostawa-i-platnosci">
                            Dostawa i płatności
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
                    Dane firmy
                </h4>

                <p>
                    Hideisland Dominik Adamczyk
                </p>

                <p>
                    NIP: 8513260489<br/>
                    Regon: 389065009
                </p>
                <p>
                    Ul. Topolowa 26<br/>
                    72-006 Mierzyn
                </p>
                <p>
                    kontakt: biuro@hideisland.pl
                </p>
                <p>
                    Nr konta bankowego:<br/>
                    42 1090 2268 0000 0001 4500 4135<br/>
                    Santander Bank Polska
                </p>
            </section>
        </section>
        <section className="footer__row d-flex justify-content-between align-items-start">
            <section className="footer__newsletter">
                <h3 className="footer__newsletter__header">
                    Zapisz się do newslettera i zgarnij <b>10% zniżki</b>!
                </h3>
                <section className="footer__newsletter__form">
                    {!newsletterResponse ? <>
                        <label className="footer__label">
                            <img className="mailIcon" src={mailIcon} alt="mail" />
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

            <a href="/">
                <img className="footer__logo d-none d-md-block" src={logo} alt="hideisland-logo" />
            </a>
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
