import React, {useEffect, useState, useContext, useRef} from 'react';

import arrowWhite from '../static/img/arrow-white.svg'
import arrowLong from '../static/img/arrow-long.svg'
import {CartContext} from "../App";
import closeImg from "../static/img/close.png";
import tickImg from "../static/img/tick-sign.svg";
import Modal from "react-modal";
import settings from "../helpers/settings";
import ReactSiema from 'react-siema'
import landingTest1 from "../static/img/hide-test1.jpg";
import landingTest2 from "../static/img/hide-test2.jpg";
import landingTest3 from "../static/img/hide-test3.jpg";
import sliderArrow from "../static/img/slider-arrow.png";

const SingleProductInfo = ({id, title, description, img, price, sizes, gallery}) => {
    const [size, setSize] = useState("S");
    const [amount, setAmount] = useState(1);
    const [modal, setModal] = useState(false);
    const [loaded, setLoaded] = useState(false);

    let slider = useRef({currentSlide: 0});
    const [slide, setSlide] = useState(0);

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

    const sliderPrev = () => {
        slider.prev();
        setSlide(slider.currentSlide);
    }

    const sliderNext = () => {
        slider.next();
        setSlide(slider.currentSlide);
    }

    return <main className="singleProductInfo page--singleProduct d-flex flex-column flex-lg-row justify-content-center justify-content-md-between align-items-center align-items-md-start">
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

        <section className={loaded ? "singleProduct__carousel m-auto m-lg-0 mb-4 mb-lg-0" : "singleProduct__carousel m-auto m-lg-0 mb-4 mb-lg-0 opacity-0"}>
            <button className="d-block hero__slider__arrow hero__slider__arrow--left singleProductSlider__btn" onClick={() => { sliderPrev(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-lewo" />
            </button>
                <ReactSiema perPage={1} loop={true} ref={siema => slider = siema}>
                    {gallery.map((item, index) => {
                        return <div>
                            <img className="singleProductInfo__img" key={index}
                                 src={`${settings.API_URL}/image?url=/media/${item.file_path}`} alt={title}
                                 onLoad={() => { setLoaded(true); }}
                            />
                        </div>
                    }).reverse()}
                </ReactSiema>
            <button className="d-block hero__slider__arrow hero__slider__arrow--right singleProductSlider__btn" onClick={() => { sliderNext(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-prawo" />
            </button>
        </section>

            <section className={loaded ? "singleProductInfo__section" : "singleProductInfo__section opacity-0"}>
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
