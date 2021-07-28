import React, { useEffect, useState, useRef } from 'react'

import {addAllergens, getNewId, getProductDetails} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";

import JoditEditor from 'jodit-react';

const AddProductContent = () => {
    const editorR = useRef(null);

    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [id, setId] = useState(0);
    const [categoryId, setCategoryId] = useState(1); // 1 - Oferta indywidualna, 2 - Menu grupowe, 3 - Menu bankietowe
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [recommendation, setRecommendation] = useState(false);

    /* Sizes and stocks */
    const [size1, setSize1] = useState("");
    const [size2, setSize2] = useState("");
    const [size3, setSize3] = useState("");
    const [size4, setSize4] = useState("");
    const [size5, setSize5] = useState("");

    const [stock1, setStock1] = useState(0);
    const [stock2, setStock2] = useState(0);
    const [stock3, setStock3] = useState(0);
    const [stock4, setStock4] = useState(0);
    const [stock5, setStock5] = useState(0);

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

        setPrice(productData.price);

        setSize1(productData.size_1_name);
        setSize2(productData.size_2_name);
        setSize3(productData.size_3_name);
        setSize4(productData.size_4_name);
        setSize5(productData.size_5_name);
        setStock1(productData.size_1_stock);
        setStock2(productData.size_2_stock);
        setStock3(productData.size_3_stock);
        setStock4(productData.size_4_stock);
        setStock5(productData.size_5_stock);

        setCategoryId(productData.category_id);
        setHidden(productData.hidden);
        setRecommendation(productData.recommendation);

        setShortDescription(productData.description);
    }

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja produktu
            </h1>
        </header>
        {addMsg === "" ? <form className="addProduct__form addProduct__form--addProduct"
                               encType="multipart/form-data"
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
                        name="categoryIdSelect"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(parseInt(e.target.value));
                        }}>
                    {categories?.map((item, index) => {
                        return <option key={index} value={item.id}>{item.name}</option>
                    })}
                </select>

                <input className="invisibleInput"
                       value={categoryId}
                       name="categoryId" />


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
            </section>

            <section className="addProduct__form__section">
                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    {/* Sizes and stocks */}
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne rozmiary
                    </h4>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size1"
                               type="text"
                               value={size1}
                               onChange={(e) => { setSize1(e.target.value) }}
                               placeholder="Pierwszy rozmiar" />
                        <input className="addProduct__input"
                               name="size1Stock"
                               type="number"
                               value={stock1}
                               onChange={(e) => { setStock1(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size2"
                               type="text"
                               value={size2}
                               onChange={(e) => { setSize2(e.target.value) }}
                               placeholder="Drugi rozmiar" />
                        <input className="addProduct__input"
                               name="size2Stock"
                               type="number"
                               value={stock2}
                               onChange={(e) => { setStock2(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size3"
                               type="text"
                               value={size3}
                               onChange={(e) => { setSize3(e.target.value) }}
                               placeholder="Trzeci rozmiar" />
                        <input className="addProduct__input"
                               name="size3Stock"
                               type="number"
                               value={stock3}
                               onChange={(e) => { setStock3(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size4"
                               type="text"
                               value={size4}
                               onChange={(e) => { setSize4(e.target.value) }}
                               placeholder="Czwarty rozmiar" />
                        <input className="addProduct__input"
                               name="size4Stock"
                               type="number"
                               value={stock4}
                               onChange={(e) => { setStock4(e.target.value) }}
                               placeholder="Na stanie" />
                    </label>
                    <label className="addProduct__label d-flex justify-content-between align-items-center">
                        <input className="addProduct__input"
                               name="size5"
                               type="text"
                               value={size5}
                               onChange={(e) => { setSize5(e.target.value) }}
                               placeholder="Piąty rozmiar" />
                        <input className="addProduct__input"
                               name="size5Stock"
                               type="number"
                               value={stock5}
                               onChange={(e) => { setStock5(e.target.value) }}
                               placeholder="Na stanie" />
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
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setRecommendation(!recommendation); }}>
                        <span className={recommendation ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Pokaż produkt w polecanych
                </label>

                <input className="invisibleInput"
                       value={hidden ? "hidden" : ""}
                       name="hidden" />
                <input className="invisibleInput"
                       value={recommendation ? "true" : ""}
                       name="recommendation" />

                <label className="fileInputLabel">
                    <span>Zdjęcie produktu</span>
                    <input type="file"
                           className="product__fileInput"
                           name="mainImage" />
                </label>
                <label className="fileInputLabel">
                    <span>Galeria zdjęć</span>
                    <input type="file"
                           multiple={true}
                           className="product__fileInput"
                           name="gallery" />
                </label>
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
