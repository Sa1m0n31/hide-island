import React, { useEffect, useState, useRef } from 'react'

import {
    addAllergens,
    getNewId,
    getProductCategories,
    getProductDetails,
    getProductGallery
} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";
import Dropzone from "react-dropzone-uploader";
import JoditEditor from 'jodit-react';
import settings from "../helpers/settings";
import axios from "axios";

const AddProductContent = () => {
    const editorR = useRef(null);

    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [id, setId] = useState(0);
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [recommendation, setRecommendation] = useState(false);
    const [choosenCategories, setChoosenCategories] = useState([]);
    const [gallery, setGallery] = useState([]);

    const [imagesChanged, setImagesChanged] = useState([false, false, false, false, false]);

    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);

    /* Prices */
    const [price, setPrice] = useState(0);

    /* Descriptions */
    const [shortDescription, setShortDescription] = useState("");

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    /* Initialize categories */
    const initializeCategories = (categoryList) => {
        setChoosenCategories(categoryList.map(item => {
           return {
               id: item.category_id,
               selected: true
           }
        }));
    }

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
                setChoosenCategories(res.data.result.map((item) => {
                    return {
                        id: item.id,
                        selected: false
                    }
                }));
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

            getProductGallery(param)
                .then(res => {
                    setGallery(res.data?.result);
                });

            getProductCategories(param)
                .then(res => {
                    if(res.data.result) {
                        initializeCategories(res.data.result);
                    }
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

        setHidden(productData.hidden);
        setRecommendation(productData.recommendation);

        setShortDescription(productData.description);
    }

    const isInArray = (categoryId) => {
        return choosenCategories.filter(item => {
            return item.id === categoryId;
        }).length > 0;
    }

    const handleCategories = (categoryToToggle) => {
        if(isInArray(categoryToToggle)) {
            setChoosenCategories(choosenCategories.map((item) => {
                return {
                    id: item.id,
                    selected: item.id === categoryToToggle ? !item.selected : item.selected
                }
            }));
        }
        else {
            setChoosenCategories([...choosenCategories, { id: categoryToToggle, selected: true }]);
        }
    }

    const isCategoryChoosen = (categoryId) => {
        return choosenCategories.filter((item) => {
            return item.id === categoryId && item.selected;
        }).length > 0;
    }

    const addNewGalleryImage = (e, n) => {
        const galleryWrapper = document.querySelector(`.galleryWrapper--${n}`);
        const input = document.querySelector(`.galleryImageInput--${n}`);

        const temporaryImages = document.querySelectorAll(`.galleryWrapper--${n}>.galleryProductImage`);
        temporaryImages.forEach(item => {
            item.parentElement.removeChild(item);
        });

        let i = 0;

        setImagesChanged(imagesChanged.map((item, index) => {
            if(index === n) return true;
            else return item;
        }));

        Array.prototype.forEach.call(input.files, async (file) => {
            const reader = new FileReader();
            await reader.readAsDataURL(file);

            reader.onload = (e) => {
                const newImg = document.createElement("img");
                newImg.setAttribute("src", e.target.result);
                newImg.setAttribute("class", "galleryProductImage");
                newImg.setAttribute("alt", "zdjecie-galerii");
                galleryWrapper.appendChild(newImg);
                i++;
            }
        });
    }

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja produktu
            </h1>
        </header>
        {addMsg === "" ? <form className="addProduct__form addProduct__form--addProduct"
                               encType="multipart/form-data"
                               method="POST"
                               action={update ? 'https://hideisland.pl/product/update-product' : 'https://hideisland.pl/product/add-product'}
        >
            <section className="addProduct__form__section">
                <input className="invisibleInput"
                       name="id"
                       value={id} />
                <input className="invisibleInput"
                       name="img1Changed"
                       value={imagesChanged[0]} />
                <input className="invisibleInput"
                       name="img2Changed"
                       value={imagesChanged[1]} />
                <input className="invisibleInput"
                       name="img3Changed"
                       value={imagesChanged[2]} />
                <input className="invisibleInput"
                       name="img4Changed"
                       value={imagesChanged[3]} />
                <input className="invisibleInput"
                       name="img5Changed"
                       value={imagesChanged[4]} />


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


                <section className="addProduct__categorySelect">
                    {categories?.map((item, index) => {
                        if(!item.parent_id) {
                            return <><label className="panelContent__filters__label__label" key={index}>
                                <button value={item.id} className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); handleCategories(item.id); }}>
                                    <span className={isCategoryChoosen(item.id) ? "panelContent__filters__btn--active" : "d-none"} />
                                </button>
                                {item.name}
                            </label>
                                <input className="invisibleInput"
                                       name={`category-${item.id}`}
                                       value={isCategoryChoosen(item.id)} />


                                {categories?.map((itemChild, indexChild) => {
                                    if(itemChild.parent_id === item.id) {
                                        return <><label className="panelContent__filters__label__label pl-5 d-block" key={index}>
                                            <button value={itemChild.id} className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); handleCategories(itemChild.id); }}>
                                                <span className={isCategoryChoosen(itemChild.id) ? "panelContent__filters__btn--active" : "d-none"} />
                                            </button>
                                            {itemChild.name}
                                        </label>
                                            <input className="invisibleInput"
                                                   name={`category-${itemChild.id}`}
                                                   value={isCategoryChoosen(itemChild.id)} />
                                        </>
                                    }
                                })}
                            </>
                        }
                    })}
                </section>

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
                    <label className="fileInputLabel fileInputLabel--gallery">
                        <span>Zdjęcie główne</span>
                        <input type="file"
                               onChange={(e) => { addNewGalleryImage(e, 0); }}
                               multiple={false}
                               className="product__fileInput galleryImageInput--0"
                               name="gallery1" />
                        <section className="galleryWrapper--0" onClick={e => { e.preventDefault(); }}>
                            {gallery.length > 0 ? <img className="galleryProductImage" src={`${settings.API_URL}/image?url=/media/${gallery[0].file_path}`} alt="zdjecie-produktu" /> : ""}
                        </section>
                    </label>
                </section>
                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <label className="fileInputLabel fileInputLabel--gallery">
                        <span>Zdjęcie 1.</span>
                        <input type="file"
                               onChange={(e) => { addNewGalleryImage(e, 1); }}
                               multiple={false}
                               className="product__fileInput galleryImageInput--1"
                               name="gallery2" />
                        <section className="galleryWrapper--1" onClick={e => { e.preventDefault(); }}>
                            {gallery.length > 1 ? <img className="galleryProductImage" src={`${settings.API_URL}/image?url=/media/${gallery[1].file_path}`} alt="zdjecie-produktu" /> : ""}
                        </section>
                    </label>
                </section>
                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <label className="fileInputLabel fileInputLabel--gallery">
                        <span>Zdjęcie 2.</span>
                        <input type="file"
                               onChange={(e) => { addNewGalleryImage(e, 2); }}
                               multiple={false}
                               className="product__fileInput galleryImageInput--2"
                               name="gallery3" />
                        <section className="galleryWrapper--2" onClick={e => { e.preventDefault(); }}>
                            {gallery.length > 2 ? <img className="galleryProductImage" src={`${settings.API_URL}/image?url=/media/${gallery[2].file_path}`} alt="zdjecie-produktu" /> : ""}
                        </section>
                    </label>
                </section>
                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <label className="fileInputLabel fileInputLabel--gallery">
                        <span>Zdjęcie 3.</span>
                        <input type="file"
                               onChange={(e) => { addNewGalleryImage(e, 3); }}
                               multiple={false}
                               className="product__fileInput galleryImageInput--3"
                               name="gallery4" />
                        <section className="galleryWrapper--3" onClick={e => { e.preventDefault(); }}>
                            {gallery.length > 3 ? <img className="galleryProductImage" src={`${settings.API_URL}/image?url=/media/${gallery[3].file_path}`} alt="zdjecie-produktu" /> : ""}
                        </section>
                    </label>
                </section>
                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <label className="fileInputLabel fileInputLabel--gallery">
                        <span>Zdjęcie 4.</span>
                        <input type="file"
                               onChange={(e) => { addNewGalleryImage(e, 4); }}
                               multiple={false}
                               className="product__fileInput galleryImageInput--4"
                               name="gallery5" />
                        <section className="galleryWrapper--4" onClick={e => { e.preventDefault(); }}>
                            {gallery.length > 4 ? <img className="galleryProductImage" src={`${settings.API_URL}/image?url=/media/${gallery[4].file_path}`} alt="zdjecie-produktu" /> : ""}
                        </section>
                    </label>
                </section>

                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                        <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Ukryj produkt
                </label>
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category mt-4">
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
