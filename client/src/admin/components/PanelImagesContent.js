import React, { useState, useEffect } from "react";
import settings from "../helpers/settings";
import axios from "axios";
import { useLocation } from "react-router";

const PanelImagesContent = () => {
    const [header, setHeader] = useState("");
    const [link1, setLink1] = useState("");
    const [link2, setLink2] = useState("");
    const [link3, setLink3] = useState("");
    const [section1Link, setSection1Link] = useState("");
    const [section2Link, setSection2Link] = useState("");
    const [section3Link, setSection3Link] = useState("");
    const [section4Link, setSection4Link] = useState("");
    const [addedMsg, setAddedMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
        if(addedMsg !== "") {
            setTimeout(() => {
                setAddedMsg("");
            }, 2000);
        }
    }, [addedMsg]);

    useEffect(() => {
        /* Get all images and links */
        axios.get(`${settings.API_URL}/homepage/get-all`)
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    setHeader(result.section_header);
                    setLink1(result.slider_link_1);
                    setLink2(result.slider_link_2);
                    setLink3(result.slider_link_3);
                    setSection1Link(result.section_link_1);
                    setSection2Link(result.section_link_2);
                    setSection3Link(result.section_link_3);
                    setSection4Link(result.section_link_4);
                }
            });

        /* Check if not added */
        const param = parseInt(new URLSearchParams(location.search).get("add"));
        if(param) {
            setAddedMsg("Zmiany zostały zapisane");
        }
        else if(param === 0) {
            setAddedMsg("Coś poszło nie tak... Prosimy spróbować później");
        }
    }, []);

    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Zdjęcia na stronie głównej
            </h1>
        </header>
    <section className="panelContent__frame">
        {addedMsg === "" ? <><section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Edycja zdjęć w sliderze
                </h1>

                <main className="d-flex flex-column flex-xl-row justify-content-between align-items-center mt-5">
                    <form className="panelContent__frame"
                          method="POST"
                          encType="multipart/form-data"
                          action={`${settings.API_URL}/homepage/update-slider-1`}>
                        <label className="fileInputLabel">
                            <span>Pierwsze zdjęcie</span>
                            <input type="file"
                                   className="product__fileInput"
                                   name="slider1" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                            Link do zdjęcia
                            <input className="addProduct__input"
                                   name="link1"
                                   value={link1}
                                   onChange={(e) => { setLink1(e.target.value) }}
                                   type="text"
                                   placeholder="Link do zdjęcia" />
                        </label>

                        <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                    </form>

                    <form className="panelContent__frame"
                          method="POST"
                          encType="multipart/form-data"
                          action={`${settings.API_URL}/homepage/update-slider-2`}>
                        <label className="fileInputLabel">
                            <span>Drugie zdjęcie</span>
                            <input type="file"
                                   className="product__fileInput"
                                   name="slider2" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                            Link do zdjęcia
                            <input className="addProduct__input"
                                   name="link2"
                                   value={link2}
                                   onChange={(e) => { setLink2(e.target.value) }}
                                   type="text"
                                   placeholder="Link do zdjęcia" />
                        </label>

                        <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                    </form>

                    <form className="panelContent__frame"
                          method="POST"
                          encType="multipart/form-data"
                          action={`${settings.API_URL}/homepage/update-slider-3`}>
                        <label className="fileInputLabel">
                            <span>Trzecie zdjęcie</span>
                            <input type="file"
                                   className="product__fileInput"
                                   name="slider3" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                            Link do zdjęcia
                            <input className="addProduct__input"
                                   name="link3"
                                   value={link3}
                                   onChange={(e) => { setLink3(e.target.value) }}
                                   type="text"
                                   placeholder="Link do zdjęcia" />
                        </label>

                        <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                    </form>
                </main>
            </section>


            <section className="panelContent__frame__section mt-5">
                <h1 className="panelContent__frame__header">
                    Edycja zdjęć w sekcji poniżej slidera
                </h1>

                <form className="panelContent__frame"
                      method="POST"
                      action={`${settings.API_URL}/homepage/update-header`}>
                        <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                            Nagłówek sekcji
                            <input className="addProduct__input"
                                   name="header"
                                   value={header}
                                   onChange={(e) => { setHeader(e.target.value) }}
                                   type="text"
                                   placeholder="Nagłówek sekcji" />
                        </label>
                        <button className="addProduct__btn btn--editSectionHeader m-auto mt-5 d-block" type="submit">
                            Edytuj nagłówek sekcji
                        </button>
                </form>

                <section className="d-flex flex-column flex-xxl-row justify-content-between align-items-center mt-5">
                 <form className="panelContent__frame"
                       method="POST"
                       encType="multipart/form-data"
                       action={`${settings.API_URL}/homepage/update-section-1`}>
                     <label className="fileInputLabel">
                        <span>Pierwsze zdjęcie</span>
                        <input type="file"
                               className="product__fileInput"
                               name="section1" />
                    </label>
                     <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                        Link do zdjęcia
                        <input className="addProduct__input"
                               name="section1Link"
                               value={section1Link}
                               onChange={(e) => { setSection1Link(e.target.value) }}
                               type="text"
                               placeholder="Link do zdjęcia" />
                     </label>
                     <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                 </form>

                <form className="panelContent__frame"
                      method="POST"
                      encType="multipart/form-data"
                      action={`${settings.API_URL}/homepage/update-section-2`}>
                    <label className="fileInputLabel">
                        <span>Drugie zdjęcie</span>
                        <input type="file"
                               className="product__fileInput"
                               name="section2" />
                    </label>
                     <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                        Link do zdjęcia
                        <input className="addProduct__input"
                               name="section2Link"
                               value={section2Link}
                               onChange={(e) => { setSection2Link(e.target.value) }}
                               type="text"
                               placeholder="Link do zdjęcia" />
                     </label>
                    <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                </form>

               <form className="panelContent__frame"
                     method="POST"
                     encType="multipart/form-data"
                     action={`${settings.API_URL}/homepage/update-section-3`}>
                    <label className="fileInputLabel">
                        <span>Trzecie zdjęcie</span>
                        <input type="file"
                               className="product__fileInput"
                               name="section3" />
                    </label>
                     <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                        Link do zdjęcia
                        <input className="addProduct__input"
                               name="section3Link"
                               value={section3Link}
                               onChange={(e) => { setSection3Link(e.target.value) }}
                               type="text"
                               placeholder="Link do zdjęcia" />
                     </label>
                   <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
               </form>

                 <form className="panelContent__frame"
                       method="POST"
                       encType="multipart/form-data"
                       action={`${settings.API_URL}/homepage/update-section-4`}>
                     <label className="fileInputLabel">
                        <span>Pierwsze zdjęcie</span>
                        <input type="file"
                               className="product__fileInput"
                               name="section4" />
                    </label>
                     <label className="addProduct__label addProduct__label--frame addShipping__input m-auto mt-4 mb-4">
                        Link do zdjęcia
                        <input className="addProduct__input"
                               name="section4Link"
                               value={section4Link}
                               onChange={(e) => { setSection4Link(e.target.value) }}
                               type="text"
                               placeholder="Link do zdjęcia" />
                     </label>
                     <button className="addProduct__btn mt-5" type="submit">
                            Edytuj zdjęcie i link
                        </button>
                 </form>
            </section>
            </section>
            </> : <h3 className="msg text-center mt-5">
                {addedMsg}
            </h3>}
    </section>
    </main>
}

export default PanelImagesContent;
