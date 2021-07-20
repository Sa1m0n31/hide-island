import React, { useEffect, useState } from 'react'
import facebookIcon from '../static/img/facebook.svg'
import instagramIcon from '../static/img/instagram.svg'
import logo from '../static/img/logo.png'
import cartIcon from '../static/img/shop-bag.svg'
import loginIcon from '../static/img/user.svg'

const Header = () => {
    const [menu, setMenu] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

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
                <figure className="header__logo">
                    <img className="header__logo__img" src={logo} alt="hideisland-logo" />
                </figure>
            </section>
            <section className="header__header__section">
                <button className="header__header__section__btn">
                    <img className="header__header__section__btn__img" src={loginIcon} alt="login" />
                    Zaloguj się
                </button>
                <button className="header__header__section__btn">
                    <img className="header__header__section__btn__img" src={cartIcon} alt="koszyk" />
                    Twój koszyk (2)
                </button>
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
