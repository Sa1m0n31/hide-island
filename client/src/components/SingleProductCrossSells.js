import React, { useState, useEffect } from 'react'
import test2 from "../static/img/test2.png";
import arrowLong from "../static/img/arrow-long.svg";
import axios from "axios";
import settings from "../helpers/settings";
import convertToURL from "../helpers/convertToURL";

const SingleProductCrossSells = ({ids}) => {
    const [recoms, setRecoms] = useState([]);

    useEffect(() => {
        axios.get(`${settings.API_URL}/product/get-recommendations`)
            .then(res => {
                if(res.data?.result) {
                    setRecoms(res.data.result);
                }
            })
    }, []);

    return <section className="recommendationsSection recommendationsSection--crossSells">
            <h2 className="section__header">
                Polecane
            </h2>
            <main className="recom__content d-flex justify-content-between align-items-center">
                {recoms.map((item, index) => {
                    return <a className="recom__item" href={`/produkt/${convertToURL(item.name)}`}>
                            <figure className="recom__item__imgWrapper overflow-hidden">
                                <img className="recom__item__img" src={`${settings.API_URL}/image?url=/media/${item.file_path}`} />
                            </figure>
                            <h3 className="recom__item__title text-center mt-3">
                                {item.name}
                            </h3>
                            <h4 className="recom__item__price text-center">
                                {item.price} PLN
                            </h4>
                        <button className="addToCartBtn addToCartBtn--crossSells">
                            Zobacz produkt
                            <img className="addToCartBtn__img" src={arrowLong} alt="dodaj" />
                        </button>
                    </a>
                })}
            </main>
        </section>
}

export default SingleProductCrossSells;
