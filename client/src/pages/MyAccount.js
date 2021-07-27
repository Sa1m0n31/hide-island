import React, {useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MyAccountContent from "../components/MyAccountContent";
import auth from "../admin/helpers/auth";

const MyAccount = () => {
    useEffect(() => {
        /* Authorization */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
                if(!res.data?.result) window.location = "/";
            });
    }, []);

    return <>
        <Header />
        <MyAccountContent />
        <Footer />
    </>
}

export default MyAccount;
