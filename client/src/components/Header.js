import React, { useEffect, useState, useContext } from 'react'
import facebookIcon from '../static/img/facebook.svg'
import instagramIcon from '../static/img/instagram.svg'
import logo from '../static/img/logo.png'
import cartIcon from '../static/img/shop-bag.svg'
import loginIcon from '../static/img/user.svg'
import {CartContext} from "../App";

const Header = () => {
    const [menu, setMenu] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

    const { cartContent } = useContext(CartContext);


    useEffect(() => {
        console.log(cartContent);
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
                        <button className="header__header__section__btn">
                            <img className="header__header__section__btn__img" src={loginIcon} alt="login" />
                            Zaloguj się
                        </button>
                        <a className="header__header__section__btn" href="/koszyk">
                            <img className="header__header__section__btn__img" src={cartIcon} alt="koszyk" />
                            Twój koszyk ({cartContent.length})
                        </a>
                    </section>
                </header>

                <menu className="header__menu">
                    <ul className="header__menu__list d-flex justify-content-between align-items-start">
                        {menu.map((item, index) => {
                            return <li className="header__menu__list__item" key={index}>
                                <a className="header__menu__list__link">
                                    Koszule
                                </a>
                            </li>
                        })}
                    </ul>
                </menu>
            </header>
}

export default Header;
