import React, { useState, useEffect } from 'react'

import SingleProductInfo from "./SingleProductInfo";
import SingleProductCrossSells from "./SingleProductCrossSells";
import {getProductByName} from "../helpers/productFunctions";

import { useLocation } from "react-router";
import {convertToString} from "../helpers/convertToURL";
import axios from "axios";
import settings from "../helpers/settings";
import {getProductCategories} from "../admin/helpers/productFunctions";
import {getCategoryById} from "../helpers/categoryFunctions";

const SingleProductContent = () => {
    const [product, setProduct] = useState({});
    const [sizes, setSizes] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [productGender, setProductGender] = useState(-1);

    const location = useLocation();

    useEffect(() => {
        /* Get product info */
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
                               setGallery(galleryResult);
                           }

                           /* Get product categories */
                           getProductCategories(productInfo.id)
                               .then(res => {
                                   if(res?.data?.result) {
                                       const result = res.data.result;
                                       result.forEach(item => {
                                           getCategoryById(item.category_id)
                                               .then(res => {
                                                   console.log(res?.data?.result);
                                                  if(res?.data?.result?.name?.toLowerCase() === "damskie") {
                                                      setProductGender(0);
                                                  }
                                                  else if(res?.data?.result?.name?.toLowerCase() === "męskie") {
                                                      setProductGender(1);
                                                  }
                                               });
                                       });
                                   }
                               });
                        });
                }
            });
    }, []);

    return <main className="singleProduct">
        <SingleProductInfo
            id={product.id}
            title={product.name}
            description={product.description}
            price={product.price}
            priceBeforeDiscount={product.price_before_discount}
            img={product.file_path}
            gallery={gallery}
            sizes={sizes} />
        <SingleProductCrossSells
            productGender={productGender}
        />
    </main>
}

export default SingleProductContent;
