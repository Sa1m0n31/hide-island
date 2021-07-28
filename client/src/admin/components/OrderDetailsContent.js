import React, { useEffect, useState } from 'react'
import {deleteOrderById, getOrderDetails, getRibbons} from "../helpers/orderFunctions";

import { useLocation } from "react-router";
import x from '../static/img/close.png'
import tick from '../static/img/tick-sign.svg'
import {getDate, getTime} from "../helpers/formatFunctions";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";

const OrderDetailsContent = () => {
    const location = useLocation();

    const [id, setId] = useState(0);
    const [cart, setCart] = useState([1]);
    const [sum, setSum] = useState(0);
    const [modal, setModal] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [ribbons, setRibbons] = useState([]);

    useEffect(() => {
        /* Get order id from url string */
        const id = parseInt(new URLSearchParams(location.search).get("id"));

        if(!id) window.location = "/panel";
        setId(id);

        /* Get order info */
        getOrderDetails(id)
            .then(res => {
                console.log(res.data.result);
               setCart(res.data.result);
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
                    setDeleteMsg("Zamówienie zostało usnięte");
                    setTimeout(() => {
                        window.location = "/panel";
                    }, 2000);
                }
                else {
                    setDeleteMsg("Coś poszło nie tak... Spróbuj ponownie później");
                }
            });
    }

    const getCartItemPrice = (item) => {
        const size = item.size;
        const option = item.option;
        if((size === "M")&&(option === "Mięsna")) return item.price_m_meat;
        if((size === "L")&&(option === "Mięsna")) return item.price_l_meat;
        if((size === "M")&&(option === "Wegetariańska")) return item.price_m_vege;
        if((size === "L")&&(option === "Wegetariańska")) return item.price_l_vege;
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

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć to zamówienie?
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
                Szczegóły zamówienia #{id}
            </h1>
        </header>

        <section className="panelContent__frame">
            <section className="panelContent__cart">
                <header className="panelContent__cart__header">
                    <h2 className="panelContent__header--smaller">
                        Zawartość koszyka
                    </h2>

                    <section className="panelContent__buttons">
                        <button className="panelContent__btn btn--neutral">
                            <a className="button--link" href="/panel/zamowienia">
                                Wróć do zamówień
                            </a>
                        </button>
                        <button className="panelContent__btn btn--red" onClick={() => { openModal() }}>
                            Usuń zamówienie
                        </button>
                    </section>
                </header>
                <main className="panelContent__cart__content">
                    {cart.map((item, index) => {
                        return <section key={index} className="panelContent__cart__item">
                            <section className="panelContent__cart__column">
                                <span>{item.name}</span>
                            </section>
                            <section className="panelContent__cart__column panelQuantity">
                                <span>Ilość: {item.quantity}</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>{item.option}</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>{item.size ? `Rozmiar: ${item.size}` : ""}</span>
                            </section>
                        </section>
                    })}
                </main>

            </section>

            <section className="panelContent__orderDetails">
                <section className="panelContent__clientData">
                    <h2 className="panelContent__header--smaller">
                        Dane klienta
                    </h2>
                    <main className="panelContent__clientData__content">
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
                            {cart[0].order_comment ? cart[0].order_comment : "Brak komentarza do zamówienia"}
                        </h3>
                    </main>

                    <section className="panelContent__orderStatus">
                        <h2 className="panelContent__orderStatus__header">
                            Opłacone:
                            <img className="panelContent__orderStatus__img" src={cart[0].payment_status?.toLowerCase() === "opłacone" ? tick : x} alt="oplacone" />
                        </h2>
                        <h2 className="panelContent__orderStatus__header">
                            Faktura VAT:
                            <img className="panelContent__orderStatus__img" src={cart[0].company_name ? tick : x} alt="faktura-vat" />
                        </h2>
                    </section>
                </section>

                <section className="panelContent__shipping">
                    <h2 className="panelContent__header--smaller">
                        Sposób dostawy: <b>{cart[0].shipping}</b>
                    </h2>
                    <h2 className="panelContent__header--smaller mt-4">
                        Płatność: <b>{cart[0].payment}</b>
                    </h2>

                    {cart[0].shipping === "Paczkomaty InPost" ? <section className="inPost__address">
                        <h4 className="inPost__address__header">
                            Adres paczkomatu:
                        </h4>
                        {cart[0].inpost_address}<br/>
                        {cart[0].inpost_postal_code} {cart[0].inpost_city}
                    </section> : ""}

                    {cart[0].company_name ? <address className="inPost__address">
                        <h4 className="inPost__address__header">
                            Dane do faktury
                        </h4>
                        {cart[0].company_name}<br/>
                        {cart[0].nip}
                    </address> : "" }
                </section>
            </section>

        </section>
    </main>
}

export default OrderDetailsContent;