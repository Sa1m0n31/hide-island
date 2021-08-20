import React, { useState, useEffect } from "react";
import axios from "axios";
import settings from "../helpers/settings";
import mailIcon from '../static/img/mail.svg'

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [newsletterResponse, setNewsletterResponse] = useState(0);

    const isEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const addToNewsletter = () => {
        if(isEmail(email)) {
            axios.post(`${settings.API_URL}/newsletter/add`, { email })
                .then(res => {
                    if(res.data.result === 1) {
                        setNewsletterResponse(1);
                        setEmail("");
                    }
                    else {
                        setNewsletterResponse(-1);
                    }
                });
        }
        else {
            setNewsletterResponse(2);
        }
    }

    useEffect(() => {
        if(newsletterResponse !== 0) {
            setTimeout(() => {
                setNewsletterResponse(0);
            }, 3000);
        }
    }, [newsletterResponse]);

    return <section className="section newsletterSection">
        <h2 className="section__header" data-aos="fade-up">
            Newsletter
        </h2>

        <p className="newsletterText m-4 text-center" data-aos="fade-up">
            Zapisz się do <b>newslettera</b> i zgarnij <b>10% zniżki</b>!
        </p>

        <section className="footer__newsletter__form footer__newsletter__form--section">
            {!newsletterResponse ? <>
                <label className="footer__label" data-aos="fade-left">
                    <img className="mailIcon" src={mailIcon} alt="mail" />
                    <input className="footer__input"
                           name="email"
                           type="email"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }}
                           placeholder="Tu wpisz swój e-mail" />
                </label>
                <button className="footer__btn" onClick={() => { addToNewsletter() }} data-aos="fade-right">
                    Zapisz się
                </button>
            </> : <h4 className="newsletterResponse">
                {newsletterResponse === 2 ? "Proszę podać poprawny adres e-mail" : newsletterResponse === 1 ? "Dziękujemy za zapisanie się do naszego newslettera" : "Podany adres e-mail jest już zapisany do naszego newslettera"}
            </h4> }
        </section>
    </section>
}

export default NewsletterSection;
