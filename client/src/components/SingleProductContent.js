import React, { useState, useEffect } from 'react'

import SingleProductInfo from "./SingleProductInfo";
import SingleProductCrossSells from "./SingleProductCrossSells";
import {getProductByName} from "../helpers/productFunctions";

import { useLocation } from "react-router";
import {convertToString} from "../helpers/convertToURL";
import axios from "axios";
import settings from "../helpers/settings";

const SingleProductContent = () => {
    const [product, setProduct] = useState({});
    const [sizes, setSizes] = useState([]);
    const [crossSells, setCrossSells] = useState([]);
    const [gallery, setGallery] = useState([]);

    const location = useLocation();

    useEffect(() => {
        /* Get product info */
        console.log(convertToString(window.location.pathname.split("/")[2]));
        getProductByName(convertToString(window.location.pathname.split("/")[2]))
            .then(res => {
               const result = res.data?.result;
                if(result) {
                   const productInfo = result[0];
                   setProduct(productInfo);
                   setSizes([
                       { name: productInfo.size_1_name, stock: productInfo.size_1_stock },
                       { name: productInfo.size_2_name, stock: productInfo.size_2_stock },
                       { name: productInfo.size_3_name, stock: productInfo.size_3_stock },
                       { name: productInfo.size_4_name, stock: productInfo.size_4_stock },
                       { name: productInfo.size_5_name, stock: productInfo.size_5_stock }
                   ]);

                    /* Get product gallery */
                    axios.post(`${settings.API_URL}/product/get-gallery`, {
                        id: productInfo.id
                    })
                        .then(res => {
                           const galleryResult = res.data?.result;
                           if(galleryResult) {
                               setGallery(galleryResult.filter(item => {
                                   return item.file_path;
                               }));
                           }
                        });
                }
            });

        const crossSellsExample = [5, 7, 19];
        setCrossSells(crossSellsExample);
    }, []);

    return <main className="singleProduct">
        <SingleProductInfo
            id={product.id}
            title={product.name}
            description={product.description}
            price={product.price}
            img={product.file_path}
            gallery={gallery}
            sizes={sizes} />
        <SingleProductCrossSells
            ids={crossSells} />
    </main>
}

export default SingleProductContent;
