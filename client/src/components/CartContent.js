import React, { useState, useContext, useEffect } from 'react'

import ShippingForm from "./ShippingForm";
import trashIcon from '../static/img/trash.png'

import { CartContext } from "../App";
import EmptyCart from "./EmptyCart";
import settings from "../helpers/settings";
import {getProductStock, getSingleStock} from "../admin/helpers/stockFunctions";

const CartContent = () => {
    const { cartContent, editCart, removeFromCart } = useContext(CartContext);

    const [sum, setSum] = useState(0);
    const [remove, setRemove] = useState(false);
    const [currentCart, setCurrentCart] = useState(cartContent);

    useEffect(() => {
        calculateCartSum();
    }, []);

    useEffect(() => {
        calculateCartSum();
        setCurrentCart(cartContent);
    }, [remove]);

    const calculateCartSum = () => {
        let sum = 0;
        currentCart.forEach((item, index, array) => {
            sum += item.price * item.amount;
            if(index === array.length-1) setSum(sum);
        });
    }

    useEffect(() => {
        calculateCartSum();
    }, [currentCart]);

    const changeAmountInCart = (value, uuid, id, size) => {
        const cart = JSON.parse(localStorage.getItem('hideisland-cart'));

        if(value === "") {
            return 0;
        }

        getProductStock(id)
            .then(res => {
                if(res?.data?.result) {
                    const result = res.data.result[0];
                    const sizes = [
                        { name: result.size_1_name, value: result.size_1_stock },
                        { name: result.size_2_name, value: result.size_2_stock },
                        { name: result.size_3_name, value: result.size_3_stock },
                        { name: result.size_4_name, value: result.size_4_stock },
                        { name: result.size_5_name, value: result.size_5_stock }
                    ];
                    sizes.forEach((item) => {
                        if(item.name === size) {
                            if(item.value >= parseInt(value)) {
                                console.log("CHANGING CART");
                                localStorage.setItem('hideisland-cart', JSON.stringify(cart.map((item) => {
                                    if(item.uuid === uuid) {
                                        editCart(uuid, item.id, item.title, parseInt(value), item.img, item.size, item.price);
                                        return {
                                            uuid,
                                            id: item.id,
                                            img: item.img,
                                            size: item.size,
                                            price: item.price,
                                            title: item.title,
                                            amount: value
                                        }
                                    }
                                    else return item;
                                })));

                                setCurrentCart(cart.map((item) => {
                                    if(item.uuid === uuid) {
                                        editCart(uuid, item.id, item.title, parseInt(value), item.img, item.size, item.price);
                                        return {
                                            uuid,
                                            id: item.id,
                                            img: item.img,
                                            size: item.size,
                                            price: item.price,
                                            title: item.title,
                                            amount: value
                                        }
                                    }
                                    else return item;
                                }));
                            }
                            else {
                                return 0;
                            }
                        }
                    })
                }
            });
    }

    const handleInputClick = (e) => {
        e.target.select();
    };

    return <>
        {cartContent.length ? <main className="page cart">
            <h2 className="cart__header">
                Twój koszyk
            </h2>

            <main className="cart__content">
                {currentCart.map((item, index) => {
                    return <section className="cart__item d-grid d-md-flex justify-content-between align-items-center">
                        <section className="d-flex cart__item__imgWrapper position-relative">
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
                                   name={item.uuid}
                                   value={item.amount}
                                   onClick={(e) => { handleInputClick(e); }}
                                   onChange={(e) => { changeAmountInCart(e.target.value, item.uuid, item.id, item.size); }}
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

                        <button className="removeFromCartBtn"
                                onClick={() => { removeFromCart(item.uuid); setRemove(!remove); }}
                        >
                            <img className="removeFromCartBtn__img" src={trashIcon} alt="usun" />
                        </button>
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

            <ShippingForm sum={sum} />
        </main> : <EmptyCart />}
    </>
}

export default CartContent;
