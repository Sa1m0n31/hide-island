import React, { useState, useEffect } from 'react'
import settings from "../helpers/settings";
import JoditEditor from "jodit-react";
import { useLocation } from "react-router";
import {getPagesContent} from "../../helpers/pagesFunctions";

const PanelOthersContent = () => {
    const [terms, setTerms] = useState("");
    const [policy, setPolicy] = useState("");
    const [complaints, setComplaints] = useState("");
    const [returns, setReturns] = useState("");
    const [shippingAndPayment, setShippingAndPayment] = useState("");
    const [aboutUs, setAboutUs] = useState("");

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
            /* Check if post added */
            const added = parseInt(new URLSearchParams(location.search).get("add"));
            if (added) {
                if (added === 1) {
                    setAddMsg("Treści zostały zaktualizowane");
                } else {
                    setAddMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
            }

            /* Get pages content */
            getPagesContent()
                .then(res => {
                    if(res.data.result) {
                        const result = res.data.result[0];
                        if(result) {
                            setTerms(result.terms_of_service);
                            setPolicy(result.privacy_policy);
                            setComplaints(result.complaints);
                            setReturns(result.returns);
                            setShippingAndPayment(result.shipping_and_payment);
                            setAboutUs(result.about_us);
                        }
                    }
                })
        }, []);

    useEffect(() => {
        if(addMsg !== "") {
            setTimeout(() => {
                setAddMsg("");
            }, 3000);
        }
    }, [addMsg]);


    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Pozostałe
            </h1>
        </header>
        <section className="panelContent__frame">
            <h1 className="panelContent__frame__header">
                Edycja podstron
            </h1>

            {addMsg === "" ? <form className="panelContent__frame__form panelContent--others"
                                   method="POST"
                                   action={`${settings.API_URL}/pages/update`}
            >
                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Regulamin</span>
                        <JoditEditor
                            name="termsOfService"
                            value={terms}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setTerms(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Polityka prywatności</span>
                        <JoditEditor
                            name="privacyPolicy"
                            value={policy}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setPolicy(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Zwroty</span>
                        <JoditEditor
                            name="complaints"
                            value={complaints}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setComplaints(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Reklamacje</span>
                        <JoditEditor
                            name="returns"
                            value={returns}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setReturns(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Dostawa i płatności</span>
                        <JoditEditor
                            name="shippingAndPayment"
                            value={shippingAndPayment}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setShippingAndPayment(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Kilka słów o nas</span>
                        <JoditEditor
                            name="aboutUs"
                            value={aboutUs}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setAboutUs(newContent) }}
                        />
                    </label>
                </section>

                <button className="addProduct__btn marginTop10" type="submit">
                    Aktualizuj treści podstron
                </button>
            </form> : <h1 className="addedMsgWrapper">
                {addMsg}
            </h1> }
        </section>
    </main>
}

export default PanelOthersContent;
