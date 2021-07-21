import React, { useState, useEffect } from 'react'

import example from '../static/img/single-product-test.png'
import SingleProductInfo from "./SingleProductInfo";
import SingleProductCrossSells from "./SingleProductCrossSells";

const SingleProductContent = () => {
    const [product, setProduct] = useState({});
    const [crossSells, setCrossSells] = useState([]);

    useEffect(() => {
        const result = {
            title: 'Koszulka męska czarna',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet',
            price: 250,
            img: example,
            sizes: [
                'L', 'XL'
            ]
        }
        const crossSellsExample = [5, 7, 19];
        setProduct(result);
        setCrossSells(crossSellsExample);
    }, []);

    return <main className="page">
        <SingleProductInfo
            title={product.title}
            description={product.description}
            price={product.price}
            img={product.img}
            sizes={product.sizes} />
        <SingleProductCrossSells
            ids={crossSells} />
    </main>
}

export default SingleProductContent;
