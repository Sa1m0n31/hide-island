import React, { useEffect, useState, useContext } from 'react'
import facebookIcon from '../static/img/facebook.svg'
import instagramIcon from '../static/img/instagram.svg'
import logo from '../static/img/logo.png'
import cartIcon from '../static/img/shop-bag.svg'
import loginIcon from '../static/img/user.svg'
import {CartContext} from "../App";
import {getAllCategories} from "../helpers/categoryFunctions";
import auth from "../admin/helpers/auth";

const Header = () => {
    const [menu, setMenu] = useState([]);
    const [isAuth, setIsAuth] = useState(false);

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

    return <header className="header">
                <header className="header__header d-flex">
                    <section className="header__header__section">
                        <section className="header__socialMedia d-flex">
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
                    <section className="header__header__section">
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

                <menu className="header__menu">
                    <ul className="header__menu__list d-flex justify-content-between align-items-start">
                        <li className="header__menu__list__item">
                            <a className="header__menu__list__link" href="/">
                                Strona główna
                            </a>
                        </li>
                        {menu.map((item, index) => {
                            if(!item.hidden) {
                                return <li className="header__menu__list__item" key={index}>
                                    <a className="header__menu__list__link" href={`/kategoria/${item.permalink}`}>
                                        {item.name}
                                    </a>
                                </li>
                            }
                        })}
                    </ul>
                </menu>
            </header>
}

export default Header;
