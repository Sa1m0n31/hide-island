import React, { useEffect, useState } from 'react'

import test1 from '../static/img/test1.png'
import test2 from '../static/img/test2.png'
import test3 from '../static/img/test3.png'

const Recommendations = () => {
    const [recoms, setRecoms] = useState([1, 2, 3]);

    return <section className="recommendationsSection">
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
                </a>
            })}
        </main>
    </section>
}

export default Recommendations;
