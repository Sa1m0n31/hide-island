import React, {useEffect, useState, useRef} from 'react'
import ReactSiema from 'react-siema'

import landingTest1 from '../static/img/hide-test1.jpg'
import landingTest2 from '../static/img/hide-test2.jpg'
import landingTest3 from '../static/img/hide-test3.jpg'

import sliderArrow from '../static/img/slider-arrow.png'

const HeroSection = () => {
    let slider = useRef({currentSlide: 0});
    const [slide, setSlide] = useState(0);

    const sliderRef1 = useRef(null);
    const sliderRef2 = useRef(null);
    const sliderRef3 = useRef(null);

    const sliderPrev = () => {
        slider.prev();
        setSlide(slider.currentSlide);
    }

    const sliderNext = () => {
        slider.next();
        setSlide(slider.currentSlide);
    }

    return <main className="hero">
        <figure className="hero__slider">
            <button className="d-none d-md-block hero__slider__arrow hero__slider__arrow--left" onClick={() => { sliderPrev(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-lewo" />
            </button>
            <ReactSiema perPage={1} loop={true} draggable={false}
                        ref={siema => slider = siema}
            >
                <img ref={sliderRef1} className="hero__slider__img" id="slider-1" src={landingTest1} alt="hideisland-slider" />
                <img ref={sliderRef2} className="hero__slider__img" id="slider-2" src={landingTest2} alt="hideisland-slider" />
                <img ref={sliderRef3} className="hero__slider__img" id="slider-3" src={landingTest3} alt="hideisland-slider" />
            </ReactSiema>

            <button className="d-none d-md-block hero__slider__arrow hero__slider__arrow--right" onClick={() => { sliderNext(); }}>
                <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-prawo" />
            </button>
        </figure>
        <aside className="hero__slider__controls d-none d-md-flex align-items-center justify-content-between">
            <button className={slide === 0 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { setSlide(0); slider.goTo(0); }}>

            </button>
            <button className={slide === 1 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { setSlide(1); slider.goTo(1); }}>

            </button>
            <button className={slide === 2 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { setSlide(2); slider.goTo(2); }}>

            </button>
        </aside>
    </main>
}

export default HeroSection;
