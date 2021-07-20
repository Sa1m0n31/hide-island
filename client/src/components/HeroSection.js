import React from 'react'

import landingExample1 from '../static/img/test-landing.png'

const HeroSection = () => {
    return <main className="hero">
        <figure className="hero__slider">
            <img className="hero__slider__img" src={landingExample1} alt="hideisland-slider" />
        </figure>
        <aside className="hero__slider__controls d-flex align-items-center justify-content-between">
            <button className="hero__slider__btn">

            </button>
            <button className="hero__slider__btn">

            </button>
            <button className="hero__slider__btn">

            </button>
        </aside>
    </main>
}

export default HeroSection;
