import React, { useEffect, useState } from 'react'

import test1 from '../static/img/test1.png'
import test2 from '../static/img/test2.png'
import test3 from '../static/img/test3.png'
import axios from "axios";
import settings from "../helpers/settings";
import convertToURL from "../helpers/convertToURL";

const Recommendations = () => {
    const [recoms, setRecoms] = useState([]);

    useEffect(() => {
        axios.get(`${settings.API_URL}/product/get-recommendations`)
            .then(res => {
                if(res.data?.result) {
                    setRecoms(res.data.result);
                }
            });
    }, []);

    return <section className="recommendationsSection">
        <h2 className="section__header" data-aos="fade-up">
            Polecane
        </h2>
        <main className="recom__content d-flex justify-content-between align-items-center">
            {recoms.map((item, index) => {
                return <a className="recom__item" href={`/produkt/${convertToURL(item.name)}`} data-aos="fade-up" data-aos-delay={400}>
                    <figure className="recom__item__imgWrapper overflow-hidden">
                        <img className="recom__item__img" src={`${settings.API_URL}/image?url=/media/${item.file_path}`} />
                    </figure>
                    <h3 className="recom__item__title text-center mt-3">
                        {item.name}
                    </h3>
                    <h4 className="recom__item__price text-center">
                        {item.price} PLN
                    </h4>
                </a>
            })}
        </main>
    </section>
}

export default Recommendations;
