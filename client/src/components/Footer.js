import React from 'react'
import logo from '../static/img/logo.png'

const Footer = () => {
    return <footer className="footer">
        <section className="footer__row d-flex justify-content-between align-items-center align-items-md-start">
            <section className="footer__menu">
                <h4 className="footer__menu__header">
                    Informacje
                </h4>
                <ul className="footer__menu__list">
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Regulamin
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Polityka prywatności
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
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
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Dla niej
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Dla niego
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Spodnie
                        </a>
                    </li>
                    <li className="footer__menu__item">
                        <a className="footer__menu__link">
                            Koszulki
                        </a>
                    </li>
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
                    <label className="footer__label">
                        <input className="footer__input"
                               name="email"
                               type="email"
                               placeholder="Tu wpisz swój e-mail" />
                    </label>
                    <button className="footer__btn">
                        Zapisz się
                    </button>
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
