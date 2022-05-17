import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReactGA from "react-ga4";

const TYPage = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('hideisland-ty')) {
            localStorage.removeItem('hideisland-ty');
            setLoaded(true);
        }
        else window.location = "/";
    }, []);

    return <>
        <Header />
        {loaded ? <main className="page page--ty pb-5">
            <h1 className="page__header page__header--ty pt-5">
                Dziękujemy za złożenie zamówienia. Wkrótce dostarczymy je do Ciebie.
            </h1>

            <a className="emptyCart__btn m-auto mt-5" href="/">
                Wróć na stronę główną
            </a>
        </main> : ""}
        <Footer />
    </>
}

export default TYPage;
