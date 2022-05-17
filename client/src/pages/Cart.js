import React, {useContext, useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartContent from "../components/CartContent";
import ReactGA from "react-ga4";
import {CartContext} from "../App";

const Cart = () => {
    const { cartContent } = useContext(CartContext);

    const calculateCartSum = (cart) => {
        return cart.reduce((prev, current, index, array) => {
            return prev += current.price * current.amount;
        }, 0);
    }

    useEffect(() => {
        ReactGA.event('view_cart', {
            currency: "PLN",
            value: calculateCartSum(cartContent),
            items: cartContent?.map((item) => {
                return {
                    item_id: item.id.toString(),
                    item_name: item.title,
                    price: item.price,
                    quantity: item.amount
                }
            })
        });
    }, [cartContent]);

    return <>
        <Header />
        <CartContent />
        <Footer />
    </>
}

export default Cart;
