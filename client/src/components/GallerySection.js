import React from 'react'

import test1 from '../static/img/test1.png'
import test2 from '../static/img/test2.png'
import test3 from '../static/img/test3.png'
import test4 from '../static/img/test4.png'

const GallerySection = () => {
    return <section className="gallerySection">
        <h2 className="section__header">
            Ostatnia kolekcja
        </h2>
        <main className="gallerySection__content">
            <figure className="gallerySection__imgWrapper imgWrapper-1">
                <img className="gallerySection__img img-1" src={test3} alt="test" />
            </figure>
            <figure className="gallerySection__imgWrapper imgWrapper-2">
                <img className="gallerySection__img img-2" src={test2} alt="test" />
            </figure>
            <figure className="gallerySection__imgWrapper imgWrapper-3">
                <img className="gallerySection__img img-3" src={test1} alt="test" />
            </figure>
            <figure className="gallerySection__imgWrapper imgWrapper-4">
                <img className="gallerySection__img img-4" src={test4} alt="test" />
            </figure>
        </main>
    </section>
}

export default GallerySection;
