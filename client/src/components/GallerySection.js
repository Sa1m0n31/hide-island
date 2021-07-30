import React, { useState, useEffect } from 'react'

import test1 from '../static/img/test1.png'
import test2 from '../static/img/test2.png'
import test3 from '../static/img/test3.png'
import test4 from '../static/img/test4.png'
import axios from "axios";
import settings from "../helpers/settings";

const GallerySection = () => {
    const [imagesAndLinks, setImagesAndLinks] = useState({});

    useEffect(() => {
        axios.get(`${settings.API_URL}/homepage/get-all`)
            .then(res => {
                const result = res.data?.result;
                if(result) setImagesAndLinks(res.data.result);
            });
    }, []);

    return <section className="gallerySection">
        <h2 className="section__header">
            {imagesAndLinks.section_header}
        </h2>
        <main className="gallerySection__content">
            <a href={imagesAndLinks.section_link_1} className="gallerySection__imgWrapper imgWrapper-1" data-aos="zoom-in">
                <img className="gallerySection__img img-1" src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.section_image_1}`} alt="test" />
            </a>
            <a href={imagesAndLinks.section_link_2} className="gallerySection__imgWrapper imgWrapper-2" data-aos="zoom-in" data-aos-delay={300} >
                <img className="gallerySection__img img-2" src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.section_image_2}`} alt="test" />
            </a>
            <a href={imagesAndLinks.section_link_3} className="gallerySection__imgWrapper imgWrapper-3" data-aos="zoom-in" data-aos-delay={900}>
                <img className="gallerySection__img img-3" src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.section_image_3}`} alt="test" />
            </a>
            <a href={imagesAndLinks.section_link_4} className="gallerySection__imgWrapper imgWrapper-4" data-aos="zoom-in" data-aos-delay={600}>
                <img className="gallerySection__img img-4" src={`${settings.API_URL}/image?url=/media/homepage/${imagesAndLinks.section_image_4}`} alt="test" />
            </a>
        </main>
    </section>
}

export default GallerySection;
