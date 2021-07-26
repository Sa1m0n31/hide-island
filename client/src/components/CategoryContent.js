import React, {useContext, useEffect, useState} from 'react'

import { useLocation } from "react-router";

import test2 from '../static/img/test2.png'
import arrowLong from "../static/img/arrow-long.svg";
import closeImg from '../static/img/close.png'
import tickImg from '../static/img/tick-sign.svg'
import Modal from 'react-modal'
import {getAllCategories} from "../helpers/categoryFunctions";
import {CartContext} from "../App";
import {getAllProducts, getProductsByCategory} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";
import axios from "axios";
import convertToURL from "../helpers/convertToURL";

const CategoryContent = () => {
    const filters = [
        'do 100 zł', 'do 200 zł', 'do 300 zł', 'do 500 zł', 'bez ograniczeń'
    ];

    const location = useLocation();

    const { cartContent, addToCart } = useContext(CartContext);

    const [products, setProducts] = useState([1, 2, 3, 4, 5, 6]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([
        { size: "S", selected: false },
        { size: "M", selected: false },
        { size: "L", selected: false },
        { size: "XL", selected: false }
    ]);
    const [price, setPrice] = useState(4);
    const [modal, setModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        /* Get categories */
        getAllCategories()
            .then(res => {
                if(res?.data?.result) {
                    setCategories(res.data.result);
                }
            });

        /* Get current category */
        const urlPathArray = window.location.pathname.split("/");
        const categorySlug = urlPathArray[urlPathArray.length-1];

        axios.post(`${settings.API_URL}/category/get-category-by-slug`, { slug: categorySlug })
            .then(res => {
                if(res.data.result[0]) {
                    /* Category page => Get products of current category */
                    setCurrentCategory(res.data.result[0]?.name);
                    getProductsByCategory(res.data.result[0]?.id)
                        .then(res => {
                           if(res?.data?.result) {
                               setProducts(res.data.result);
                               setProductsFiltered(res.data.result);
                               setLoaded(true);
                           }
                        });
                }
                else {
                    /* Shop page => Get all products */
                    getAllProducts()
                        .then(res => {
                            if(res?.data?.result) {
                                setProducts(res.data.result);
                                setProductsFiltered(res.data.result);
                                setLoaded(true);
                            }
                        });
                }
            });
    }, []);

    const handleSizeFilter = (size) => {
        setSizes(sizes.map((item) => {
            if(size === item.size) {
                return {
                    size: size,
                    selected: !item.selected
                }
            }
            else return item;
        }));
    }

    useEffect(() => {
        /* Handle price filter */
        const pricesToFilter = [100, 200, 300, 500];
        switch(price) {
            case 0:
                setProductsFiltered(products.filter((item) => {
                    return item.price < pricesToFilter[0];
                }));
                break;
            case 1:
                setProductsFiltered(products.filter((item) => {
                    return item.price < pricesToFilter[1];
                }));
                break;
            case 2:
                setProductsFiltered(products.filter((item) => {
                    return item.price < pricesToFilter[2];
                }));
                break;
            case 3:
                setProductsFiltered(products.filter((item) => {
                    return item.price < pricesToFilter[3];
                }));
                break;
            default:
                setProductsFiltered(products);
                break;
        }
    }, [price]);

    const isSizeSelected = (size) => {
        return sizes.filter((item) => {
            if(item.size === size) {
                return item.selected;
            }
            else return false;
        }).length > 0;
    }

    return <section className="page category">
        <Modal
            isOpen={modal}
            portalClassName="smallModal"
            onRequestClose={() => { setModal(false) }}
        >

            <button className="modalClose" onClick={() => { setModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <img className="modalTick" src={tickImg} alt="dodano-do-koszyka" />
            <h2 className="modalHeader">
               Produkt został dodany do koszuka
            </h2>
            <section className="modal__buttons">
                <button className="modal__btn" onClick={() => { setModal(false) }}>
                    Kontynuuj zakupy
                </button>
                <button className="modal__btn" onClick={() => { window.location = "/koszyk" }}>
                    Przejdź do kasy
                </button>
            </section>
        </Modal>


        <h1 className="category__content__header">
            {currentCategory ? currentCategory : "Wszystkie produkty"}
        </h1>

        <aside className="category__filters d-none d-md-block">
            <section className="category__filters__item">
                <h3 className="category__filters__item__header">
                    Kategorie
                </h3>
                <ul className="category__filters__item__list">
                    <li className="category__list__item">
                        <a className={!currentCategory ? "category__list__link category__list__link--current" : "category__list__link"} href="/sklep">
                            Wszystkie produkty
                        </a>
                    </li>
                    {categories.map((item, index) => {
                        return <li className="category__list__item" key={index}>
                            <a className={item.name === currentCategory ? "category__list__link category__list__link--current" : "category__list__link"} href={`/kategoria/${item.permalink}`}>
                                {item.name}
                            </a>
                        </li>
                    })}
                </ul>
            </section>

            <section className="category__filters__item">
                <h3 className="category__filters__item__header">
                    Filtrowanie
                </h3>

                <h4 className="category__filters__item__subheader">
                    Rozmiar:
                </h4>
                <section className="singleProductInfo__sizes__buttons d-flex justify-content-between">
                    <button className="singleProductInfo__sizes__btn"
                            value="S"
                            onClick={() => { handleSizeFilter("S"); }}
                            id={isSizeSelected("S") ? "sizeSelected" : ""}
                    >
                        S
                    </button>
                    <button className="singleProductInfo__sizes__btn"
                            value="M"
                            onClick={() => { handleSizeFilter("M"); }}
                            id={isSizeSelected("M") ? "sizeSelected" : ""}
                    >
                        M
                    </button>
                    <button className="singleProductInfo__sizes__btn"
                            value="L"
                            onClick={() => { handleSizeFilter("L"); }}
                            id={isSizeSelected("L") ? "sizeSelected" : ""}
                    >
                        L
                    </button>
                    <button className="singleProductInfo__sizes__btn"
                            value="XL"
                            onClick={() => { handleSizeFilter("XL"); }}
                            id={isSizeSelected("XL") ? "sizeSelected" : ""}
                    >
                        XL
                    </button>
                </section>

                <h4 className="category__filters__item__subheader mt-4 mb-4">
                    Cena:
                </h4>
                <section>

                    {filters.map((item, index) => {
                        return <label className="category__filters__priceLabel d-flex align-items-center">
                            <button className= "category__filters__priceBtn"
                                    onClick={() => { setPrice(index); }}
                            >
                                <span className={price === index ? "priceBtn--selected" : "d-none"}></span>
                            </button>
                            {item}
                        </label>
                    })}

                </section>
            </section>
        </aside>
            <main className="category__content">
            {productsFiltered.map((item, index) => {
                if((!item.hidden)&&(loaded)) {
                    return <a className="recom__item" key={index} href={`http://localhost:3000/produkt/${convertToURL(item.name)}`}>
                        <figure className="recom__item__imgWrapper overflow-hidden">
                            <img className="recom__item__img" src={test2} />
                        </figure>
                        <h3 className="recom__item__title recom__item__title--category text-center mt-3">
                            {item.name}
                        </h3>
                        <h4 className="recom__item__price recom__item__price--category text-center">
                            {item.price} PLN
                        </h4>
                        <button className="addToCartBtn addToCartBtn--category">
                            Zobacz więcej
                            <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                        </button>
                    </a>
                }
            })}
            </main>
    </section>
}

export default CategoryContent;
