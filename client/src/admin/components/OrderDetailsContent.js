import React, { useEffect, useState } from 'react'
import {deleteOrderById, getOrderDetails, getRibbons, payOrder} from "../helpers/orderFunctions";

import { useLocation } from "react-router";
import x from '../static/img/close.png'
import tick from '../static/img/tick-sign.svg'
import {getDate, getTime} from "../helpers/formatFunctions";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import axios from "axios";
import settings from "../helpers/settings";

const OrderDetailsContent = () => {
    const location = useLocation();

    const [id, setId] = useState(0);
    const [cart, setCart] = useState([1]);
    const [sum, setSum] = useState(0);
    const [modal, setModal] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [comment, setComment] = useState("");
    const [letterNumber, setLetterNumber] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [orderUpdated, setOrderUpdated] = useState(-1);
    const [adminComment, setAdminComment] = useState("");
    const [payClicked, setPayClicked] = useState(-1);
    const [orderPrice, setOrderPrice] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [numberOfProducts, setNumberOfProducts] = useState(1);

    useEffect(() => {
        /* Get order id from url string */
        const id = parseInt(new URLSearchParams(location.search).get("id"));

        if(!id) window.location = "/panel";
        setId(id);

        /* Get order info */
        getOrderDetails(id)
            .then(res => {
               if(res?.data?.result?.length) {
                   setCart(res.data.result);
                   setDiscount(Math.max(res.data.result[0]?.order_price_before_discount - res.data.result[0]?.order_price, 0));
                   setOrderStatus(res.data.result[0].order_status);
                   setLetterNumber(res.data.result[0].letter_number);
                   setComment(res.data.result[0].order_comment);
                   setAdminComment(res.data.result[0].admin_comment);
                   setSum(res.data.result.reduce((prev, item) => {
                       return prev + item.price;
                   }, 0));
               }
               //setSum(calculateCartSum(res.data.result));
               calculateCartSum();
            });

    }, []);

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const deleteProduct = () => {
        deleteOrderById(id)
            .then(res => {
                if(res.data.result === 1) {
                    setDeleteMsg("Zam??wienie zosta??o usni??te");
                    setTimeout(() => {
                        window.location = "/panel";
                    }, 2000);
                }
                else {
                    setDeleteMsg("Co?? posz??o nie tak... Spr??buj ponownie p????niej");
                }
            });
    }

    const calculateCartSum = () => {
        let sum = 0, qt;
        const cartPrices = document.querySelectorAll(".panelPrice");
        const cartQuantities = document.querySelectorAll(".panelQuantity");
        cartPrices?.forEach((item, index, array) => {
           qt = parseInt(cartQuantities[index].textContent.split(" ")[0]);
           sum += parseInt(item.textContent.replace("PLN", "")) * qt;
           if(index === array.length - 1) setSum(sum);
        });
    }

    const changeOrderStatus = () => {
        axios.post(`${settings.API_URL}/order/change-order-status`, {
            id,
            orderStatus,
            letterNumber,
            adminComment
        })
            .then(res => {
                if(res.data.result) {
                    setOrderUpdated(1);
                }
                else {
                    setOrderUpdated(0);
                }
            })
    }

    useEffect(() => {
        if(orderUpdated !== -1) {
            setTimeout(() => {
                setOrderUpdated(-1);
            }, 2000);
        }
    }, [orderUpdated]);

    useEffect(() => {
        const tmpNum = cart?.reduce((prev, current, index) => {
            return prev + current.quantity;
        }, 0);
        setNumberOfProducts(tmpNum);
        setOrderPrice(cart?.reduce((prev, current) => {
            return prev + Math.round(current.price - (discount / tmpNum)) * current.quantity;
        }, 0));
    }, [cart, discount]);

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usun???? to zam??wienie?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteProduct() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>



        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Szczeg????y zam??wienia #{id}
            </h1>
        </header>

        <section className="panelContent__frame">
            <section className="panelContent__cart">
                <header className="panelContent__cart__header">
                    <h2 className="panelContent__header--smaller">
                        Zawarto???? koszyka
                    </h2>

                    <section className="panelContent__buttons">
                        <button className="panelContent__btn btn--neutral">
                            <a className="button--link" href="/panel/zamowienia">
                                Wr???? do zam??wie??
                            </a>
                        </button>
                        <button className="panelContent__btn btn--red" onClick={() => { openModal() }}>
                            Usu?? zam??wienie
                        </button>
                    </section>
                </header>
                <main className="panelContent__cart__content">
                    {cart?.map((item, index) => {
                        return <>
                            <section key={index} className="panelContent__cart__item">
                                <section className="panelContent__cart__column">
                                    <span>{item.name}</span>
                                </section>
                                <section className="panelContent__cart__column panelQuantity">
                                    <span>Ilo????: {item.quantity}</span>
                                </section>
                                <section className="panelContent__cart__column">
                                    <span>{item.option}</span>
                                </section>
                                <section className="panelContent__cart__column">
                                    <span>{item.size ? `Rozmiar: ${item.size}` : ""}</span>
                                </section>
                                <section className="panelContent__cart__column">
                                    <span>Cena: {item.price} PLN</span>
                                </section>
                            </section>
                            <section className="panelContent__cart__item__priceWithDiscount">
                                <section className="panelContent__cart__column">
                                    <span>Cena po rabacie: <b>{Math.round(item.price - (discount / numberOfProducts))} PLN</b></span>
                                </section>
                            </section>
                        </>
                    })}
                </main>
                <h4 className="panelContent__cart__summary">
                    <span>Koszt wysy??ki:</span> {cart[0].shipping_price} PLN
                </h4>
                <h4 className="panelContent__cart__summary">
                    <span>Warto???? zam??wienia (bez rabatu):</span> {cart[0].order_price_before_discount ? cart[0].order_price_before_discount + ' PLN' : 'Brak danych'}
                </h4>
                <h4 className="panelContent__cart__summary">
                    <span>Cena zam??wienia (po rabacie):</span> {orderPrice} PLN
                </h4>
            </section>

            <section className="panelContent__orderDetails">
                <section className="panelContent__clientData">
                    <h2 className="panelContent__header--smaller">
                        Dane klienta
                    </h2>
                    {cart?.length ?  <main className="panelContent__clientData__content">
                        <h3 className="panelContent__data w-50">
                            {cart[0].first_name}
                        </h3>
                        <h3 className="panelContent__data w-50">
                            {cart[0].last_name}
                        </h3>
                        <h3 className="panelContent__data w-70">
                            {cart[0].email}
                        </h3>
                        <h3 className="panelContent__data w-30">
                            {cart[0].phone_number ? cart[0].phone_number : "Brak numeru telefonu"}
                        </h3>
                        <h3 className="panelContent__data w-100">
                            {cart[0].date ? getDate(cart[0].date) + " " + getTime(cart[0].date) : ""}
                        </h3>
                        <h3 className="panelContent__data w-100">
                            {cart[0].order_comment ? cart[0].order_comment : "Brak komentarza do zam??wienia"}
                        </h3>
                    </main> : ""}

                    {cart?.length ? <section className="panelContent__orderStatus">
                        <h2 className="panelContent__orderStatus__header">
                            Op??acone:
                            <img className="panelContent__orderStatus__img" src={(cart[0].payment_status?.toLowerCase() === "op??acone" && payClicked !== 0) || payClicked === 1 ? tick : x} alt="oplacone" />
                            {(cart[0].payment_status?.toLowerCase() === "op??acone" && payClicked !== 0) || payClicked === 1 ? <button onClick={() => { payOrder(0, cart[0].id); setPayClicked(0); }}>
                                Oznacz jako nieop??acone
                            </button> : <button onClick={() => { payOrder(1, cart[0].id); setPayClicked(1); }}>
                                Oznacz jako op??acone
                            </button>}
                        </h2>
                        <h2 className="panelContent__orderStatus__header">
                            Faktura VAT:
                            <img className="panelContent__orderStatus__img" src={cart[0].company_name ? tick : x} alt="faktura-vat" />
                        </h2>
                    </section> : ""}
                </section>

                {cart?.length ? <section className="panelContent__shipping">
                    <h2 className="panelContent__header--smaller">
                        Spos??b dostawy: <b>{cart[0].shipping}</b>
                    </h2>
                    <h2 className="panelContent__header--smaller mt-4">
                        P??atno????: <b>{cart[0].payment}</b>
                    </h2>

                    {cart[0].shipping === "Paczkomaty InPost" ? <section className="inPost__address">
                        <h4 className="inPost__address__header">
                            Adres paczkomatu:
                        </h4>
                        {cart[0].inpost_address}<br/>
                        {cart[0].inpost_postal_code} {cart[0].inpost_city}
                    </section> : <section className="inPost__address">
                        <h4 className="inPost__address__header">
                            Adres dostawy:
                        </h4>
                        {cart[0].street} {cart[0].building} {cart[0].flat ? `/${cart[0].flat}` : ""}<br/>
                        {cart[0].postal_code} {cart[0].city}
                    </section>}

                    {cart[0].company_name ? <address className="inPost__address">
                        <h4 className="inPost__address__header">
                            Dane do faktury
                        </h4>
                        {cart[0].company_name}<br/>
                        {cart[0].nip}
                    </address> : "" }

                    <h2 className="panelContent__header--smaller mt-3">
                        Numer listu przewozowego:
                        <input className="panelContent__input panelContent__input--letterNumber"
                               value={letterNumber}
                               onChange={(e) => { setLetterNumber(e.target.value); }} />
                    </h2>

                    <h2 className="panelContent__header--smaller mt-3">
                        Status zam??wienia:
                        <select className="panelContent__select"
                                onChange={e => { setOrderStatus(e.target.value); }}
                                value={orderStatus}>
                            <option value="z??o??one">z??o??one</option>
                            <option value="przyj??te do realizacji">przyj??te do realizacji</option>
                            <option value="zrealizowane">zrealizowane</option>
                        </select>
                    </h2>

                    <h2 className="panelContent__header--smaller panelContent__header--smaller--adminComment mt-3">
                        Tw??j komentarz:
                        <textarea className="panelContent__input panelContent__input--adminComment"
                               value={adminComment}
                               onChange={(e) => { setAdminComment(e.target.value); }} />
                    </h2>

                    {orderUpdated === -1 ? <button className="panelContent__editOrderBtn" onClick={() => { changeOrderStatus(); }}>
                        Zmie?? parametry zam??wienia
                    </button> : orderUpdated === 1 ? <h4 className="infoHeader">Dane zam??wienia zosta??y zaktualizowane</h4> : <h4 className="infoHeader">Co?? posz??o nie tak... Prosimy spr??bowa?? p????niej</h4> }
                </section> : ""}
            </section>

        </section>
    </main>
}

export default OrderDetailsContent;
