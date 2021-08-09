import React, {useEffect, useState, useContext, useRef} from 'react';

import arrowWhite from '../static/img/arrow-white.svg'
import arrowLong from '../static/img/arrow-long.svg'
import {CartContext} from "../App";
import closeImg from "../static/img/close.png";
import tickImg from "../static/img/tick-sign.svg";
import Modal from "react-modal";
import settings from "../helpers/settings";
import ReactSiema from 'react-siema'
import sliderArrow from "../static/img/slider-arrow.png";
import axios from "axios";

const SingleProductInfo = ({id, title, description, img, price, sizes, gallery}) => {
    const [size, setSize] = useState("S");
    const [amount, setAmount] = useState(1);
    const [modal, setModal] = useState(false);
    const [loaded, setLoaded] = useState(true);
    const [modalNotification, setModalNotification] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(-1);

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

    const isProductAvailable = () => {
        return sizes.filter(item => {
            return item.stock > 0;
        }).length;
    }

    const addNotification = (e) => {
        e.preventDefault();
        if(email) {
            axios.post(`${settings.API_URL}/notification/add`, {
                productId: id,
                email: email
            })
                .then(res => {
                    if(res.data?.result) setEmailSuccess(1);
                    else setEmailSuccess(0);
                });
        }
        else {
            setEmailError("Wpisz poprawny adres email");
        }
    }

    useEffect(() => {
        if(emailSuccess !== -1) {
            setTimeout(() => {
                setEmailSuccess(-1);
                setModalNotification(false);
            }, 2000);
        }
    }, [emailSuccess]);

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

        <Modal
            isOpen={modalNotification}
            portalClassName="smallModal"
            onRequestClose={() => { setModalNotification(false) }}
        >

            <button className="modalClose" onClick={() => { setModalNotification(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <img className="modalTick" src={tickImg} alt="dodano-do-koszyka" />
            {emailSuccess === -1 ? <>
                <h2 className="modalHeader modalHeader--smaller">
                    Wpisz adres email, na który mamy wysłać powiadomienie o dostępności produktu
                </h2>

                <label className="clientForm__label clientForm__label--notification">
                    <input className="clientForm__input clientForm__input--notification"
                           name="firstName"
                           type="email"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }}
                           placeholder="Adres email"
                    />
                    {emailError ? <span className="error error--login">
                    {emailError}
                </span> : ""}
                </label>

                <section className="modal__buttons">
                    <button className="modal__btn m-auto d-block" onClick={(e) => { addNotification(e); }}>
                        Powiadom mnie
                    </button>
                </section>
            </> : emailSuccess === 0 ? <h3 className="modalHeader modalHeader--smaller">
                Coś poszło nie tak... Prosimy spróbować później
            </h3> : <h3 className="modalHeader modalHeader--smaller">
                Udało się! Poinformujemy Cię, gdy produkt będzie dostępny.
            </h3>}
        </Modal>

        <section className={loaded ? "singleProduct__carousel m-auto m-lg-0 mb-4 mb-lg-0" : "singleProduct__carousel m-auto m-lg-0 mb-4 mb-lg-0 opacity-0"}>
            {gallery.length > 1 ? <button className="d-block hero__slider__arrow hero__slider__arrow--left singleProductSlider__btn" onClick={() => { sliderPrev(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-lewo" />
            </button> : ""}
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
            {gallery.length > 1 ? <button className="d-block hero__slider__arrow hero__slider__arrow--right singleProductSlider__btn" onClick={() => { sliderNext(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-prawo" />
            </button> : ""}
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
                        {isProductAvailable() ? <>
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
                        </> : <>
                            <h3 className="singleProductInfo__sizes__header">
                                Produkt aktualnie niedostępny
                            </h3>
                        </>}
                    </section>

                    {isProductAvailable() ? <section className="singleProductInfo__amount mt-4 mt-md-0">
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
                    </section> : ""}

                    <button className="addToCartBtn" onClick={() => {
                        if(isProductAvailable()) {
                            addToCart(id, title, amount, img, size, price);
                            setModal(true);
                        }
                        else {
                            setModalNotification(true);
                        }
                    }}>
                        {isProductAvailable() ? <>
                            Dodaj do koszyka
                            <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                        </> : <span className="font-size-12">Powiadom mnie, gdy produkt będzie dostępny
                            <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" /></span>
                        }
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
