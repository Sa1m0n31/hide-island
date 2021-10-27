import React, {useEffect, useState} from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import settings from "../helpers/settings";

const SubscriptionValidationPage = () => {
    const [loaded, setLoaded] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(!token) {
            window.location = "/";
        }
        else {
            axios.post(`${settings.API_URL}/newsletter/verify-subscription`, {
                token
            })
                .then((res) => {
                    if(res?.data?.result) setLoaded(true);
                    else window.location = "/";
                });
        }
    }, []);

    return <>
        <Header />
        {loaded ? <main className="page page--ty pb-5">
            <h1 className="page__header page__header--ty pt-5">
                Twoja subskrypcja newslettera została aktywowana. Na mailu znajdziesz swój kod rabatowy na pierwsze zakupy w HideIsland!
            </h1>

            <a className="emptyCart__btn m-auto mt-5" href="/">
                Wróć na stronę główną
            </a>
        </main> : ""}
        <Footer />
    </>
}

export default SubscriptionValidationPage;
