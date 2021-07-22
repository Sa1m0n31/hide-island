import React, { useEffect, useState } from 'react'

import test2 from '../static/img/test2.png'
import arrowLong from "../static/img/arrow-long.svg";

const CategoryContent = () => {
    const filters = [
        'do 100 zł', 'do 200 zł', 'do 300 zł', 'do 500 zł'
    ];

    const [products, setProducts] = useState([1, 2, 3, 4, 5, 6]);
    const [categories, setCategories] = useState(['Koszulki', 'Spodnie', 'Bluzy']);
    const [sizes, setSizes] = useState([
        { size: "S", selected: false },
        { size: "M", selected: false },
        { size: "L", selected: false },
        { size: "XL", selected: false }
    ]);
    const [price, setPrice] = useState(-1);

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

    const isSizeSelected = (size) => {
        return sizes.filter((item) => {
            if(item.size === size) {
                return item.selected;
            }
            else return false;
        }).length > 0;
    }

    return <section className="page category">
        <aside className="category__filters d-none d-md-block">
            <section className="category__filters__item">
                <h3 className="category__filters__item__header">
                    Kategorie
                </h3>
                <ul className="category__filters__item__list">
                    {categories.map((item, index) => {
                        return <li className="category__list__item">
                            <a className="category__list__link" href="#">
                                {item}
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
            {products.map((item, index) => {
                return <a className="recom__item" key={index}>
                    <figure className="recom__item__imgWrapper overflow-hidden">
                        <img className="recom__item__img" src={test2} />
                    </figure>
                    <h3 className="recom__item__title recom__item__title--category text-center mt-3">
                        Kurtka oversize czarna
                    </h3>
                    <h4 className="recom__item__price recom__item__price--category text-center">
                        99 PLN
                    </h4>
                    <button className="addToCartBtn addToCartBtn--category">
                        Dodaj do koszyka
                        <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                    </button>
                </a>
            })}
        </main>
    </section>
}

export default CategoryContent;
