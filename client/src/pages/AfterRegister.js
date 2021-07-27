import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import arrowLong from "../static/img/arrow-long.svg";

const AfterRegister = () => {
    const [success, setSuccess] = useState(-2);

    useEffect(() => {
        const userRegistered = localStorage.getItem('hideisland-user-registered');
        if(userRegistered) {
            if(userRegistered === 'true') {
                setSuccess(1);
            }
            else if(userRegistered === 'exists') {
                setSuccess(-1);
            }
            else {
                setSuccess(0);
            }
            localStorage.removeItem('hideisland-user-registered');
        }
        else {
            window.location = "/";
        }
    }, []);

    return <>
        <Header />
        <main className="page page--thankYou">
            <h1 className="infoHeader">
                {success === 1 ? "Proces rejestracji zakończony powodzeniem. Dziękujemy za założenie konta w naszym sklepie!" : (success === -1 ? "Istnieje już konto użytkownika z podanym adresem email. Prosimy użyć innego adresu." : "Coś poszło nie tak... Prosimy spróbować później")}
            </h1>
            <a href="/" className="button addToCartBtn button--backToHomepage">
                Wróć do strony głównej
                <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
            </a>
        </main>
        <Footer />
    </>
}

export default AfterRegister;
