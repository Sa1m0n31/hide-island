import React, {useEffect, useState, useRef} from 'react'
import ReactSiema from 'react-siema'

import landingTest1 from '../static/img/hide-test1.jpg'
import landingTest2 from '../static/img/hide-test2.jpg'
import landingTest3 from '../static/img/hide-test3.jpg'

import sliderArrow from '../static/img/slider-arrow.png'
import axios from "axios";
import settings from "../helpers/settings";

const HeroSection = () => {
    let slider = useRef({currentSlide: 0});
    const [slide, setSlide] = useState(0)
    const [imagesAndLinks, setImagesAndLinks] = useState({});
    const [loaded, setLoaded] = useState(false);

    const sliderRef1 = useRef(null);
    const sliderRef2 = useRef(null);
    const sliderRef3 = useRef(null);

    useEffect(() => {
        axios.get(`${settings.API_URL}/homepage/get-all`)
            .then(res => {
                const result = res.data?.result;
                if(result) setImagesAndLinks(res.data.result);
            });
    }, []);

    const sliderPrev = () => {
        if(slider) {
            slider.prev();
            setSlide(slider.currentSlide);
        }
    }

    const sliderNext = () => {
        if(slider) {
            slider.next();
            setSlide(slider.currentSlide);
        }
    }

    return <main className="hero">
            <figure className={loaded ? "hero__slider" : "hero__slider opacity-0"}>
                <button className="d-none d-md-block hero__slider__arrow hero__slider__arrow--left" onClick={() => { sliderPrev(); }}>
                    <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-lewo" />
                </button>
                <ReactSiema perPage={1} loop={true} draggable={true}
                            ref={(siema) => {slider = siema; }}
                >
                    <img ref={sliderRef1} className="hero__slider__img" id="slider-1"
                         onLoad={() => { setLoaded(true); }}
                         onClick={() => { window.location = imagesAndLinks.slider_link_1 }}
                         src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.slider_image_1}`}
                         alt="hideisland-slider" />
                    <img ref={sliderRef2}
                         className="hero__slider__img" id="slider-2"
                         onClick={() => { window.location = imagesAndLinks.slider_link_2 }}
                         src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.slider_image_2}`}
                         alt="hideisland-slider" />
                    <img ref={sliderRef3}
                         className="hero__slider__img" id="slider-3"
                         onClick={() => { window.location = imagesAndLinks.slider_link_3 }}
                         src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.slider_image_3}`}
                         alt="hideisland-slider" />
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
