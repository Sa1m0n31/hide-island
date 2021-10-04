import React, {useState, useEffect} from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import settings from "../helpers/settings";

const Page = ({title, content, extra}) => {
    const [filename, setFilename] = useState("");

    useEffect(() => {
        if(title === "Zwroty") {
            setFilename("formularz-zwrotu-towaru.pdf");
        }
        else if(title === "Reklamacje") {
            setFilename("formularz-reklamacji-towaru.pdf");
        }
    }, []);

    return <>
        <Header />
        <main className="page">
            <h1 className="cart__header">
                {title}
            </h1>
            {title !== 'Zwroty' && title !== 'Reklamacje' ? <article className="page__content" dangerouslySetInnerHTML={{__html: content}}>

            </article> : <main className="page__linkWrapper">
                <article className="page__content" dangerouslySetInnerHTML={{__html: content}}>

                </article>
                <a target="_blank" href={`${settings.API_URL}/image?url=/media/forms/${filename}`} download={filename} className="button button--downloadLink">
                    {title === "Reklamacje" ? "Pobierz formularz reklamacji" : "Pobierz formularz zwrotu"}
                </a>
            </main>}

            {extra ? <img className="paymentMethodsImg" src={extra} alt="metody-platnosci" /> : ""}
        </main>
        <Footer />
    </>
}

export default Page;
