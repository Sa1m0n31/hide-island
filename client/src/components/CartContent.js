import React, { useState, useContext, useEffect } from 'react'

import test3 from '../static/img/test3.png'
import ShippingForm from "./ShippingForm";

import { CartContext } from "../App";
import EmptyCart from "./EmptyCart";
import settings from "../helpers/settings";

const CartContent = () => {
    const [sum, setSum] = useState(0);
    const [remove, setRemove] = useState(false);

    const { cartContent, addToCart, removeFromCart } = useContext(CartContext);

    useEffect(() => {
        calculateCartSum();
    }, []);

    useEffect(() => {
        calculateCartSum();
    }, [remove]);

    const calculateCartSum = () => {
        let sum = 0;
        cartContent.forEach((item, index, array) => {
            sum += item.price * item.amount;
            if(index === array.length-1) setSum(sum);
        });
    }

    return <>
        {cartContent.length ? <main className="page cart">
            <h2 className="cart__header">
                Twój koszyk
            </h2>

            <main className="cart__content">
                {cartContent.map((item, index) => {
                    return <section className="cart__item d-grid d-md-flex justify-content-between align-items-center">
                        <section className="d-flex cart__item__imgWrapper position-relative">
                            <button className="removeFromCartBtn"
                                    onClick={() => { removeFromCart(item.id, item.size); setRemove(!remove); }}
                            >
                                &times;
                            </button>
                            <img className="cart__item__img" src={`${settings.API_URL}/image?url=/media/${item.img}`} alt="title"/>

                            <h3 className="cart__item__title d-none d-md-block">
                                {item.title}
                                <span className="d-block d-lg-none mt-1 cart__item__key">
                                    Rozmiar: {item.size}
                                </span>
                            </h3>
                        </section>

                        <h3 className="cart__item__title d-block d-md-none">
                            {item.title}
                            <span className="d-block d-lg-none mt-1 cart__item__key">
                                    Rozmiar: {item.size}
                                </span>
                        </h3>

                        <label className="cart__item__amount">
                            Ilość:
                            <input className="cart__item__input"
                                   value={item.amount}
                                   type="number"/>
                        </label>

                        <section className="cart__item__price d-none d-lg-block">
                            <h3 className="cart__item__key">
                                Rozmiar
                            </h3>
                            <h4 className="cart__item__value text-center">
                                {item.size}
                            </h4>
                        </section>

                        <section className="cart__item__price">
                            <h3 className="cart__item__key d-none d-sm-block">
                                Cena
                            </h3>
                            <h4 className="cart__item__value">
                                {item.price} PLN
                            </h4>
                        </section>
                    </section>
                })}

                <section className="cart__item__price">
                    <h3 className="cart__item__key">
                        Podsumowanie zakupów
                    </h3>
                    <h4 className="cart__item__value">
                        {sum} PLN
                    </h4>
                </section>
            </main>

            <ShippingForm/>
        </main> : <EmptyCart />}
    </>
}

export default CartContent;
