import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import box from '../static/img/box.svg'
import checkboxSquare from '../static/img/checkbox_square.svg'
import creditCart from '../static/img/credit_card.svg'
import home from '../static/img/home_alt_fill.svg'
import layers from '../static/img/layers_alt.svg'
import list from '../static/img/list_ul.svg'
import settingsImg from '../static/img/settings_filled.svg'
import powerOff from '../static/img/power-off.png'
import addImg from '../static/img/add.png'
import hamburger from '../../static/img/hamburger.png'
import close from '../static/img/close.png'
import others from '../static/img/file.png'
import discount from '../static/img/discount.png'
import banner from '../static/img/banner.png'
import newsletterIcon from '../static/img/about-us.png'
import fashion from '../static/img/fashion.png'

import settings from "../helpers/settings";
import auth from "../helpers/auth";

const PanelMenu = ({active, submenu}) => {
    const [render, setRender] = useState(false);
    const menu = useRef(null);

    useEffect(() => {
        auth(localStorage.getItem('sec-sessionKey'))
            .then((res) => {
                if(res.data.result === 1) {
                    setRender(true);
                }
                else {
                    window.location = "/";
                }
            })
    }, []);

    const logout = () => {
        axios.post(`${settings.API_URL}/auth/logout`, {
            sessionKey: localStorage.getItem('sec-sessionKey')
        })
            .then(res => {
                if(res.data.result === 1) {
                    window.location = "/";
                    localStorage.removeItem('sec-sessionKey');
                    localStorage.removeItem('sec-username');
                }
            })
    }

    const showMenu = () => {
        menu.current.style.display = "flex";
    }

    const closeMenu = () => {
        menu.current.style.display = "none";
    }

    return render ? <menu className="panelMenu">
            <section className="panelMenu__top d-desktop">
                <figure className="panelMenu__top__logoWrapper">
                    <img className="panelMenu__top__logo" src={settings.logo} alt="logo" />
                </figure>
                <header className="panelMenu__top__info">
                    <h3 className="panelMenu__top__header">
                        Zalogowany jako:
                    </h3>
                    <h4 className="panelMenu__top__subheader">
                        {localStorage.getItem('sec-username')}
                    </h4>
                </header>
            </section>

            <header className="panelMenu__menuMobile d-flex d-md-none">
                <header className="panelMenu__top__info">
                    <h3 className="panelMenu__top__header">
                        Zalogowany jako:
                    </h3>
                    <h4 className="panelMenu__top__subheader">
                        {localStorage.getItem('sec-username')}
                    </h4>
                </header>
                <button className="panelMenu__menuMobile__hamburgerWrapper" onClick={() => { showMenu(); }}>
                    <img className="panelMenu__menuMobile__hamburgerImg" src={hamburger} alt="menu" />
                </button>
            </header>

            <nav className="panelMenu__menu" ref={menu}>
                <button className="panelMenu__menuMobile__closeBtn d-mobile" onClick={() => { closeMenu(); }}>
                    <img className="panelMenu__menuMobile__closeBtn__img" src={close} alt="zamknij" />
                </button>

                <ul className="panelMenu__list">
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 0 ? "menuItem--active" : ""} href="/panel">
                            <img className="panelMenu__list__item__img" src={home} alt="home" />
                            Home
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 1 && !submenu ? "menuItem--active" : ""} href="/panel/produkty">
                            <img className="panelMenu__list__item__img" src={layers} alt="produkty" />
                            Produkty
                        </a>
                        { active === 1 ? <a className="panelMenu__list__subitem" id={submenu ? "menuItem--active" : ""} href="/panel/dodaj-produkt">
                            <img className="panelMenu__list__subitem__img" src={addImg} alt="dodaj-produkt" />
                            Dodaj produkt
                        </a> : "" }
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 2 && !submenu ? "menuItem--active" : ""} href="/panel/stany-magazynowe">
                            <img className="panelMenu__list__item__img" src={fashion} alt="stany-magazynowe" />
                            Stany magazynowe
                        </a>
                        { active === 2 ? <a className="panelMenu__list__subitem" id={submenu ? "menuItem--active" : ""} href="/panel/dodaj-stan-magazynowy">
                            <img className="panelMenu__list__subitem__img" src={addImg} alt="dodaj-stan-magazynowy" />
                            Dodaj stan magazynowy
                        </a> : "" }
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 3 ? "menuItem--active" : ""} href="/panel/zamowienia">
                            <img className="panelMenu__list__item__img" src={checkboxSquare} alt="zamowienia" />
                            Zamówienia
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 12 ? "menuItem--active" : ""} href="/panel/dodaj-zamowienie">
                            <img className="panelMenu__list__item__img" src={addImg} alt="zamowienia" />
                            Nowe zamówienie
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 4 ? "menuItem--active" : ""} href="/panel/kategorie">
                            <img className="panelMenu__list__item__img" src={list} alt="kategorie" />
                            Kategorie
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 5 ? "menuItem--active" : ""} href="/panel/wysylka">
                            <img className="panelMenu__list__item__img" src={box} alt="wysylka" />
                            Metody wysyłki
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 6 ? "menuItem--active" : ""} href="/panel/platnosci">
                            <img className="panelMenu__list__item__img" src={creditCart} alt="platnosci" />
                            Płatności
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 7 ? "menuItem--active" : ""} href="/panel/ustawienia">
                            <img className="panelMenu__list__item__img" src={settingsImg} alt="ustawienia" />
                            Ustawienia
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 8 ? "menuItem--active" : ""} href="/panel/kupony">
                            <img className="panelMenu__list__item__img" src={discount} alt="kupony" />
                            Kupony rabatowe
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 9 ? "menuItem--active" : ""} href="/panel/zdjecia">
                            <img className="panelMenu__list__item__img" src={banner} alt="zdjecia" />
                            Zdjęcia
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 10 ? "menuItem--active" : ""} href="/panel/pozostale">
                            <img className="panelMenu__list__item__img" src={others} alt="pozostale" />
                            Pozostałe
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 11 ? "menuItem--active" : ""} href="/panel/newsletter">
                            <img className="panelMenu__list__item__img" src={newsletterIcon} alt="pozostale" />
                            Newsletter
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <button className="panelMenu__list__item__link" onClick={() => logout()}>
                            <img className="panelMenu__list__item__img" src={powerOff} alt="wyloguj-sie" />
                            Wyloguj się
                        </button>
                    </li>
                </ul>
            </nav>
        </menu> : ""
}

export default PanelMenu;
