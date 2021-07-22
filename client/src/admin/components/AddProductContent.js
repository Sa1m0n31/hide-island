import React, { useEffect, useState, useRef } from 'react'

import {addAllergens, getNewId, getProductDetails} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";

import gluten from '../static/img/allergens/gluten.png'
import grzyby from '../static/img/allergens/grzyby.png'
import jajka from '../static/img/allergens/jajka.png'
import kukurydza from '../static/img/allergens/kukurydza.png'
import lubin from '../static/img/allergens/lubin.png'
import mieczaki from '../static/img/allergens/mieczaki.png'
import mleko from '../static/img/allergens/mleko.png'
import musztarda from '../static/img/allergens/musztarda.png'
import orzechy from '../static/img/allergens/orzechy.png'
import orzechyZiemne from '../static/img/allergens/orzechy-ziemne.png'
import ryba from '../static/img/allergens/ryba.png'
import seler from '../static/img/allergens/seler.png'
import sezam from '../static/img/allergens/sezam.png'
import siarka from '../static/img/allergens/siarka.png'
import skorupiaki from '../static/img/allergens/skorupiaki.png'
import soja from '../static/img/allergens/soja.png'

import JoditEditor from 'jodit-react';
import ReactTooltip from "react-tooltip";

const AddProductContent = () => {
    const editorR = useRef(null);

    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [bracket, setBracket] = useState("");
    const [id, setId] = useState(0);
    const [categoryId, setCategoryId] = useState(1); // 1 - Oferta indywidualna, 2 - Menu grupowe, 3 - Menu bankietowe
    const [currentCat, setCurrentCat] = useState(0);
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allergies, setAllergies] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [hidden, setHidden] = useState(false);

    /* Prices */
    const [price, setPrice] = useState(0);

    /* Descriptions */
    const [shortDescription, setShortDescription] = useState("");

    /* Options */
    const [sizeM, setSizeM] = useState(true);
    const [sizeL, setSizeL] = useState(false);

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
        /* PRODUCT ADDED */
        const added = parseInt(new URLSearchParams(location.search).get("add"));
        if(added) {
            if(added === 1) {
                setAddMsg("Produkt został dodany");
                /* Add allergens */
                addAllergens(parseInt(localStorage.getItem('sec-product-id')), JSON.parse(localStorage.getItem('sec-allergens-to-add')))
                    .then(res => {
                        localStorage.removeItem('sec-product-id');
                        localStorage.removeItem('sec-allergens-to-add');
                    });
            }
            else if(added === 0) {
                setAddMsg("Nie udało się dodać produktu. Prosimy spróbować później lub skontaktować się z administratorem systemu");
            }
        }

        /* Get all categories */
        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
            });

        /* UPDATE PRODUCT MODE */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            setId(param);
            setUpdate(true);

            getProductDetails(param)
                .then(async res => {
                    await setProduct(res.data.result[0]);
                    await setInitialValues(res.data.result[0]);
                });
        }
        else {
            getNewId()
                .then(res => {
                   setId(res.data.result+1);
                });
        }
    }, []);

    const setInitialValues = (productData) => {
        setName(productData.name);

        setSizeL(productData.l);
        setSizeM(productData.m);

        setCategoryId(productData.category_id);
        setHidden(productData.hidden);

        setShortDescription(productData.short_description);
    }

    const handleSubmit = (e) => {
        /* Add allergens to local storage - DELETED */
    }

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja produktu
            </h1>
        </header>
        {addMsg === "" ? <form className="addProduct__form addProduct__form--addProduct"
                               encType="multipart/form-data"
                               onSubmit={(e) => { handleSubmit(e) }}
                               action={update ? "http://localhost:5000/product/update-product" : "http://localhost:5000/product/add-product"}
                               method="POST"
        >
            <section className="addProduct__form__section">
                <input className="invisibleInput"
                       name="id"
                       value={id} />

                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="name"
                           value={name}
                           onChange={(e) => { setName(e.target.value) }}
                           placeholder="Nazwa produktu" />
                </label>
                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="bracketName"
                           value={bracket}
                           onChange={(e) => { setBracket(e.target.value) }}
                           placeholder="Nazwa w nawiasie" />
                </label>

                {/* PRICES */}
                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="price"
                           type="number"
                           step={0.01}
                           value={price}
                           onChange={(e) => { setPrice(e.target.value) }}
                           placeholder="Cena" />
                </label>


                <select className="addProduct__categorySelect"
                        name="categoryId"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(parseInt(e.target.value));
                        }}>
                    {categories?.map((item, index) => {
                        return <option key={index} value={index+1}>{item.name}</option>
                    })}
                </select>


                <label className="jodit--label">
                    <span>Krótki opis</span>
                    <JoditEditor
                        name="shortDescription"
                        ref={editorR}
                        value={shortDescription}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setShortDescription(newContent) }}
                    />
                </label>

                <label className="fileInputLabel">
                    <span>Zdjęcie produktu</span>
                    <input type="file"
                           className="product__fileInput"
                           name="mainImage" />
                </label>
                <label className="fileInputLabel">
                    <span>Galeria zdjęć</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery1" />
                </label>
            </section>

            <section className="addProduct__form__section">

                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne rozmiary
                    </h4>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => {
                            e.preventDefault();
                            if(categoryId === 3) setSizeM(!sizeM);
                        }}>
                            <span className={sizeM ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "25 szt." : "M (domyślna)"}
                    </label>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeL(!sizeL); }}>
                            <span className={sizeL ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "50 szt." : "L"}
                    </label>
                </section>


                {/* Hidden inputs */}
                <input className="input--hidden"
                       name="m"
                       value={sizeM} />
                <input className="input--hidden"
                       name="l"
                       value={sizeL} />

                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                        <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Ukryj produkt
                </label>

                <input className="invisibleInput"
                       value={hidden ? "hidden" : ""}
                       name="hidden" />
            </section>

            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" type="submit">
                    {update ? "Zaktualizuj produkt" : "Dodaj produkt"}
                </button>
            </section>
        </form> : <h2 className="addMsg">
            {addMsg}
        </h2> }
    </main>
}

export default AddProductContent;
