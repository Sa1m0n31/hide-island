import React, {useEffect, useState, useRef} from 'react'
import ReactSiema from 'react-siema'

import sliderArrow from '../static/img/slider-arrow.png'
import axios from "axios";
import settings from "../helpers/settings";

const HeroSection = () => {
    const [slide, setSlide] = useState(0);
    const [slideTmp, setSlideTmp] = useState(0);
    const [imagesAndLinks, setImagesAndLinks] = useState({});
    const [loaded, setLoaded] = useState(false);

    const sliderRef1 = useRef(null);
    const sliderRef2 = useRef(null);
    const sliderRef3 = useRef(null);

    const images = [sliderRef1, sliderRef2, sliderRef3];

    let localSlide = 0;

    useEffect(() => {
        axios.get(`${settings.API_URL}/homepage/get-all`)
            .then(res => {
                const result = res.data?.result;
                if(result) setImagesAndLinks(res.data.result);
            });


    }, []);

    const sliderInterval = () => {
        setInterval(() => {
            localSlide++;
            if(localSlide === 3) localSlide = 0;
            setSlideTmp(localSlide);
        }, 8000);
    }

    useEffect(() => {
        sliderGoTo(slideTmp);
    }, [slideTmp]);

    const sliderGoTo = (newSlide) => {
        const prevSlide = slide;
        setSlide(newSlide);
        localSlide = newSlide;
        images[prevSlide].current.style.opacity = "0";
        images[newSlide].current.style.opacity = "1";
    }

    const sliderPrev = () => {
        const prevSlide = slide;
        if(slide === 0) {
            setSlide(2);
            localSlide = 2;
            images[prevSlide].current.style.opacity = "0";
            images[2].current.style.opacity = "1";
        }
        else {
            setSlide(slide-1);
            localSlide = slide-1;
            images[prevSlide].current.style.opacity = "0";
            images[slide-1].current.style.opacity = "1";
        }
    }

    const sliderNext = () => {
        const prevSlide = slide;
        if(slide === 2) {
            setSlide(0);
            localSlide = 0;
            images[prevSlide].current.style.opacity = "0";
            images[0].current.style.opacity = "1";
        }
        else {
            setSlide(slide+1);
            localSlide = slide+1;
            images[prevSlide].current.style.opacity = "0";
            images[slide+1].current.style.opacity = "1";
        }
    }

    return <main className="hero">
            <figure className={loaded ? "hero__slider" : "hero__slider opacity-0"}>
                <button className="d-md-block hero__slider__arrow hero__slider__arrow--left" onClick={() => { sliderPrev(); }}>
                    <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-lewo" />
                </button>
                    <main className="hero__carousel">
                        <img ref={sliderRef1} className="hero__slider__img" id="slider-1"
                             onLoad={() => { setLoaded(true); sliderInterval(); }}
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
                    </main>

                <button className="d-md-block hero__slider__arrow hero__slider__arrow--right" onClick={() => { sliderNext(); }}>
                    <img className="hero__slider__arrow__img" src={sliderArrow} alt="w-prawo" />
                </button>
            </figure>
            <aside className="hero__slider__controls d-none d-md-flex align-items-center justify-content-between">
                <button className={slide === 0 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { sliderGoTo(0); }}>

                </button>
                <button className={slide === 1 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { sliderGoTo(1); }}>

                </button>
                <button className={slide === 2 ? "hero__slider__btn heroSliderBtn--selected" : "hero__slider__btn"} onClick={() => { sliderGoTo(2); }}>

                </button>
            </aside>
    </main>
}

export default HeroSection;
