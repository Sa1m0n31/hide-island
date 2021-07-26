import React, { useEffect, useState, useContext } from 'react';

import arrowWhite from '../static/img/arrow-white.svg'
import arrowLong from '../static/img/arrow-long.svg'
import {CartContext} from "../App";
import closeImg from "../static/img/close.png";
import tickImg from "../static/img/tick-sign.svg";
import Modal from "react-modal";

const SingleProductInfo = ({id, title, description, img, price, sizes}) => {
    const [size, setSize] = useState(0);
    const [amount, setAmount] = useState(1);
    const [modal, setModal] = useState(false);

    const { cartContent, addToCart } = useContext(CartContext);

    const isSizeAvailable = (s) => {
        return sizes?.findIndex((item) => {
            return item === s;
        }) !== -1;
    }

    useEffect(() => {
        if(amount <= 0) {
            setAmount(1);
        }
    }, [amount]);

    return <main className="singleProductInfo d-flex flex-column flex-lg-row justify-content-center justify-content-md-between align-items-center align-items-md-start">
        <Modal
            isOpen={modal}
            portalClassName="smallModal"
            onRequestClose={() => { setModal(false) }}
        >

            <button className="modalClose" onClick={() => { setModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <img className="modalTick" src={tickImg} alt="dodano-do-koszyka" />
            <h2 className="modalHeader">
                Produkt został dodany do koszuka
            </h2>
            <section className="modal__buttons">
                <button className="modal__btn" onClick={() => { setModal(false) }}>
                    Kontynuuj zakupy
                </button>
                <button className="modal__btn" onClick={() => { window.location = "/koszyk" }}>
                    Przejdź do kasy
                </button>
            </section>
        </Modal>

        <figure className="singleProductInfo__section singleProductInfo__section--figure">
            <img className="singleProductInfo__img" src={img} alt={title} />
        </figure>

        <section className="singleProductInfo__section">
            {/* TITLE AND PRICE */}
            <h1 className="singleProductInfo__title text-center">
                {title}
            </h1>
            <h2 className="singleProductInfo__price text-center">
                {price} PLN
            </h2>

            {/* USER INPUT */}
            <section className="singleProductInfo__row flex-wrap d-flex align-items-start align-items-md-end justify-content-between mt-4">
                <section className="singleProductInfo__sizes">
                    <h3 className="singleProductInfo__sizes__header">
                        Wybierz rozmiar:
                    </h3>
                    <section className="singleProductInfo__sizes__buttons">

                        {sizes?.map((item, index) => {
                            if(item.name) {
                                return <button className="singleProductInfo__sizes__btn"
                                               key={index}
                                               value={item.name}
                                               disabled={item.stock <= 0}
                                               onClick={() => { setSize(item.name); }}
                                               id={size === item.name ? "sizeSelected" : ""}
                                >
                                    {item.name}
                                </button>
                            }
                        })}
                    </section>
                </section>

                <section className="singleProductInfo__amount mt-4 mt-md-0">
                    <label className="singleProductInfo__label">
                        Ilość:
                        <input className="singleProductInfo__amount__input"
                               type="number"
                               min={1}
                               onChange={(e) => { setAmount(parseInt(e.target.value)); }}
                               value={amount} />
                    </label>
                    <aside className="singleProductInfo__amount__buttons">
                        <button className="singleProductInfo__arrow__btn"
                                onClick={() => { setAmount(amount+1); }}
                        >
                            <img className="singleProductInfo__arrow__img" src={arrowWhite} alt="wiecej" />
                        </button>
                        <button className="singleProductInfo__arrow__btn"
                                onClick={() => { setAmount(amount-1); }}
                        >
                            <img className="singleProductInfo__arrow__img" src={arrowWhite} alt="mniej" />
                        </button>
                    </aside>
                </section>

                <button className="addToCartBtn" onClick={() => { addToCart(id, title, amount, img, size, price); setModal(true); }}>
                    Dodaj do koszyka
                    <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                </button>
            </section>

            {/* DESCRIPTION */}
            <section className="singleProductInfo__description">
                <h3 className="singleProductInfo__description__header">
                    Opis produktu
                </h3>
                <p className="singleProductInfo__description__content" dangerouslySetInnerHTML={{__html: description}}>

                </p>
            </section>
        </section>
    </main>
}

export default SingleProductInfo;
