import React, { useState, useEffect } from 'react'

import icon1 from '../static/img/award.png'
import icon2 from '../static/img/poland.png'
import icon3 from '../static/img/price-tag.png'
import icon4 from '../static/img/hand.png'

const AboutUs = () => {
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        const result = [
            { icon: icon1, text: "Gwarancja najwyższej jakości" },
            { icon: icon2, text: "Produkty wyprodukowane w Polsce" },
            { icon: icon3, text: "Ceny skrojone pod Twój portfel" },
            { icon: icon4, text: "Ubrania w Twoim stylu" }
        ];
        setIcons(result);
    }, []);

    return <section className="aboutUs">
        <h2 className="section__header">
            Poznaj nas
        </h2>

        <header className="aboutUs__icons d-flex justify-content-center justify-content-md-between align-items-center">
            {icons.map((item, index) => {
                return <section className="aboutUs__icons__item d-flex flex-column align-items-center" key={index}>
                    <img className="aboutUs__icons__item__img" src={item.icon} alt={item.text} />
                    <h4 className="aboutUs__icons__item__header mt-4">
                        {item.text}
                    </h4>
                </section>
            })}
        </header>
        <main className="aboutUs__content">
            <h3 className="aboutUs__header">
                Kilka słów...
            </h3>

            <article className="aboutUs__content__text">
                <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                </p>
                <p>
                    Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                </p>
            </article>
        </main>
    </section>
}

export default AboutUs;
