import React, { useEffect, useState } from 'react';

import arrowWhite from '../static/img/arrow-white.svg'
import arrowLong from '../static/img/arrow-long.svg'

const SingleProductInfo = ({title, description, img, price, sizes}) => {
    const [size, setSize] = useState(null);
    const [amount, setAmount] = useState(1);

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
                        <button className="singleProductInfo__sizes__btn"
                                value="S"
                                disabled={!isSizeAvailable("S")}
                                onClick={() => { setSize("S"); }}
                                id={size === "S" ? "sizeSelected" : ""}
                        >
                            S
                        </button>
                        <button className="singleProductInfo__sizes__btn"
                                value="S"
                                disabled={!isSizeAvailable("M")}
                                onClick={() => { setSize("M"); }}
                                id={size === "M" ? "sizeSelected" : ""}
                        >
                            M
                        </button>
                        <button className="singleProductInfo__sizes__btn"
                                value="S"
                                disabled={!isSizeAvailable("L")}
                                onClick={() => { setSize("L"); }}
                                id={size === "L" ? "sizeSelected" : ""}
                        >
                            L
                        </button>
                        <button className="singleProductInfo__sizes__btn"
                                value="S"
                                disabled={!isSizeAvailable("XL")}
                                onClick={() => { setSize("XL"); }}
                                id={size === "XL" ? "sizeSelected" : ""}
                        >
                            XL
                        </button>
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

                <button className="addToCartBtn">
                    Dodaj do koszyka
                    <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                </button>
            </section>

            {/* DESCRIPTION */}
            <section className="singleProductInfo__description">
                <h3 className="singleProductInfo__description__header">
                    Opis produktu
                </h3>
                <p className="singleProductInfo__description__content">
                    {description}
                </p>
            </section>
        </section>
    </main>
}

export default SingleProductInfo;
