import React, { useEffect, useState, useContext } from 'react'
import facebookIcon from '../static/img/facebook.svg'
import instagramIcon from '../static/img/instagram.svg'
import logo from '../static/img/logo.png'
import cartIcon from '../static/img/shop-bag.svg'
import loginIcon from '../static/img/user.svg'
import {CartContext} from "../App";
import {getAllCategories} from "../helpers/categoryFunctions";
import auth from "../admin/helpers/auth";
import hamburger from '../static/img/hamburger.svg'
import closeIcon from '../static/img/close.png'
import arrow from '../static/img/arrow-white.svg'

const Header = () => {
    const [menu, setMenu] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { cartContent } = useContext(CartContext);

    useEffect(() => {
        getAllCategories()
            .then((res) => {
                if(res?.data?.result) {
                    setMenu(res.data.result);
                }
            });

        /* Authorization */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
                if(res.data?.result) setIsAuth(true);
                else setIsAuth(false);
            });
    }, []);

    const getCategoryChildren = (categoryId) => {
        return menu.filter(item => {
            return item.parent_id === categoryId && !item.hidden;
        });
    }

    return <header className="header">
                <header className="header__header d-flex">
                    <section className="header__header__section">
                        <section className="header__socialMedia d-none d-md-flex">
                            <a className="header__socialMedia__link" href="https://facebook.com">
                                <img className="header__socialMedia__link__img" src={facebookIcon} alt="facebook" />
                            </a>
                            <a className="header__socialMedia__link" href="https://instagram.com">
                                <img className="header__socialMedia__link__img" src={instagramIcon} alt="instagram" />
                            </a>
                        </section>
                    </section>
                    <section className="header__header__section">
                        <a className="header__logo" href="/">
                            <img className="header__logo__img" src={logo} alt="hideisland-logo" />
                        </a>
                    </section>
                    <section className="header__header__section d-none d-md-flex">
                        <a className="header__header__section__btn" href={isAuth ? "/moje-konto" : "/zaloguj-sie"}>
                            <img className="header__header__section__btn__img" src={loginIcon} alt="login" />
                            {isAuth ? "Moje konto" : "Zaloguj się"}
                        </a>
                        <a className="header__header__section__btn" href="/koszyk">
                            <img className="header__header__section__btn__img" src={cartIcon} alt="koszyk" />
                            Twój koszyk ({cartContent.length})
                        </a>
                    </section>
                </header>

                <menu className="header__menu d-none d-md-block">
                    <ul className="header__menu__list d-flex justify-content-between align-items-start">
                        <li className="header__menu__list__item">
                            <a className="header__menu__list__link" href="/">
                                Strona główna
                            </a>
                        </li>
                        <li className="header__menu__list__item">
                            <a className="header__menu__list__link" href="/sklep">
                                Sklep
                            </a>
                        </li>
                        {menu.map((item, index) => {
                            if((!item.hidden)&&(!item.parent_id)) {
                                return <li className="header__menu__list__item" key={index}>
                                    <a className="header__menu__list__link" href={`/kategoria/${item.permalink}`}>
                                        {item.name}
                                    </a>
                                    {getCategoryChildren(item.id).length ? <img className="header__menu__arrow" src={arrow} alt="rozwin" /> : "" }

                                    {getCategoryChildren(item.id).length ? <ul className="header__menu__submenu">
                                        {getCategoryChildren(item.id).map((itemChild, indexChild) => {
                                                return <li className="header__menu__list__item" key={indexChild}>
                                                    <a className="header__menu__list__link" href={`/kategoria/${item.permalink}/${itemChild.permalink}`}>
                                                        {itemChild.name}
                                                    </a>
                                                </li>
                                    })}
                                    </ul> : ""}
                                </li>
                            }
                        })}
                        <li className="header__menu__list__item">
                            <a className="header__menu__list__link" href="#o-nas">
                                O nas
                            </a>
                        </li>
                    </ul>
                </menu>

                {/* Mobile menu */}
                <menu className="header__mobileMenu d-flex d-md-none justify-content-between align-items-center pt-4 pb-4">
                    <button className="header__mobileMenu__item" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); }}>
                        <img className={mobileMenuOpen ? "header__mobileMenu__icon invert" : "header__mobileMenu__icon"} src={mobileMenuOpen ? closeIcon : hamburger} alt="menu" />
                    </button>
                    <a className="header__mobileMenu__item" href="/zaloguj-sie">
                        <img className="header__mobileMenu__icon" src={loginIcon} alt="zaloguj-sie" />
                    </a>
                    <a className="header__mobileMenu__item" href="/koszyk">
                        <img className="header__mobileMenu__icon" src={cartIcon} alt="koszyk" />
                    </a>



                    <menu className={mobileMenuOpen ? "header__mobileMenu__menu d-block d-md-none" : "header__mobileMenu__menu d-none"}>
                        <ul className="header__mobileMenu__list mb-0">
                            <li className="header__menu__list__item text-center pb-2">
                                <a className="header__menu__list__link" href="/">
                                    Strona główna
                                </a>
                            </li>
                            <li className="header__menu__list__item text-center pb-2">
                                <a className="header__menu__list__link" href="/sklep">
                                    Sklep
                                </a>
                            </li>
                            {menu.map((item, index) => {
                                if((!item.hidden)&&(!item.parent_id)) {
                                    return <li className="header__menu__list__item pb-2 flex-column" key={index}>
                                        <a className="header__menu__list__link" href={`/kategoria/${item.permalink}`}>
                                            {item.name}
                                        </a>
                                        {getCategoryChildren(item.id).length ? getCategoryChildren(item.id).map((itemChild, indexChild) => {
                                            if((!itemChild.hidden)&&(itemChild.parent_id === item.id)) {
                                                return <li className="header__menu__list__item pt-2 pl-5" key={indexChild}>
                                                    <a className="header__menu__list__link" href={`/kategoria/${item.permalink}/${itemChild.permalink}`}>
                                                        {itemChild.name}
                                                    </a>
                                                </li>
                                            }
                                        }) : ""}
                                    </li>
                                }
                            })}
                        </ul>
                        <li className="header__menu__list__item text-center pb-2">
                            <a className="header__menu__list__link" href="#o-nas">
                                O nas
                            </a>
                        </li>
                    </menu>
                </menu>
            </header>
}

export default Header;
