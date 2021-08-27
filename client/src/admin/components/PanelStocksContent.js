import React, { useState, useEffect } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {deleteStock, getAllStocks} from "../helpers/stockFunctions";

const PanelStocksContent = () => {
    const [stocks, setStocks] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [addedMsg, setAddedMsg] = useState("");

    useEffect(() => {
        getAllStocks()
            .then(res => {
                setStocks(res.data.result);
            });
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const deleteStockyById = () => {
        deleteStock(candidate)
            .then(res => {
                setDeleted(true);
                if(res.data.result === 0) {
                    /* Can't delete category, becouse it has children */
                    setDeleteMsg("Nie można usunąć podanego stanu magazynowego.");
                }
                else if(res.data.result === -1) {
                    /* Database error */
                    setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
            });
    }

    const openModal = id => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setDeleted(false);
    }

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten stan magazynowy?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteStockyById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Stan magazynowy został usunięty" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Stany magazynowe
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Lista stanów magazynowych
                </h1>

                <main className="panelContent__content">
                    {stocks?.map((item, index) => (
                        <section className="panelContent__item productItem">
                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Nazwa
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.name}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value">
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn">
                                            <a className="panelContent__column__link" href={`/panel/dodaj-stan-magazynowy?id=${item.id}`}>
                                                <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                            </a>
                                        </button>
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                            <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </section>
                    ))}
                </main>
            </section>
        </section>
    </main>
}

export default PanelStocksContent;
