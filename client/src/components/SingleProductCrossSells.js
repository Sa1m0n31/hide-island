import React, { useState, useEffect } from 'react'
import test2 from "../static/img/test2.png";
import arrowLong from "../static/img/arrow-long.svg";

const SingleProductCrossSells = ({ids}) => {
    const [recoms, setRecoms] = useState([1, 2, 3]);

    useEffect(() => {
        /* Get products by id */
        ids.forEach((item) => {

        });
    }, []);

    return <section className="recommendationsSection recommendationsSection--crossSells">
            <h2 className="section__header">
                Polecane
            </h2>
            <main className="recom__content d-flex justify-content-between align-items-center">
                {recoms.map((item, index) => {
                    return <a className="recom__item">
                        <figure className="recom__item__imgWrapper overflow-hidden">
                            <img className="recom__item__img" src={test2} />
                        </figure>
                        <h3 className="recom__item__title text-center mt-3">
                            Kurtka oversize czarna
                        </h3>
                        <h4 className="recom__item__price text-center">
                            99 PLN
                        </h4>
                        <button className="addToCartBtn addToCartBtn--crossSells">
                            Dodaj do koszyka
                            <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                        </button>
                    </a>
                })}
            </main>
        </section>
}

export default SingleProductCrossSells;
