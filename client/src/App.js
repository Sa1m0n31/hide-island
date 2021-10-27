import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import "aos/dist/aos.css";
import AOS from 'aos';
import CookieConsent from "react-cookie-consent";

import './static/style/admin.css'
import './static/style/adminMobile.css'
import './static/style/style.css'
import './static/style/mobile.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import SingleProduct from "./pages/SingleProduct";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Page from "./pages/Page";

import LoginPage from "./admin/pages/LoginPage";
import PanelPage from "./admin/pages/PanelPage";
import PanelProducts from "./admin/pages/PanelProducts";
import PanelOrders from "./admin/pages/PanelOrders";
import PanelCategories from "./admin/pages/PanelCategories";
import PanelPayment from "./admin/pages/PanelPayment";
import PanelShipping from "./admin/pages/PanelShipping";
import PanelSettings from "./admin/pages/PanelSettings";
import PanelCoupons from "./admin/pages/PanelCoupons";
import PanelOthers from "./admin/pages/PanelOthers";

import AddProductPage from "./admin/pages/AddProductPage";
import AddPostPage from "./admin/pages/AddPostPage";
import OrderDetails from "./admin/pages/OrderDetails";
import RegisterPage from "./pages/RegisterPage";
import LoginPageClient from "./pages/LoginPageClient";
import AfterRegister from "./pages/AfterRegister";
import MyAccount from "./pages/MyAccount";
import {getPagesContent} from "./helpers/pagesFunctions";
import PanelImages from "./admin/pages/PanelImages";
import NewsletterPage from "./admin/pages/NewsletterPage";
import TYPage from "./pages/TYPage";
import auth from "./admin/helpers/auth";
import { v4 as uuidv4 } from 'uuid';
import PanelStocks from "./admin/pages/PanelStocks";
import AddStockPage from "./admin/pages/AddStockPage";
import {getProductStock} from "./admin/helpers/stockFunctions";
import przelewy24Methods from './static/img/metody-platnosci.png'
import SubscriptionValidationPage from "./pages/SubscriptionValidationPage";
import SubscriptionResignationPage from "./pages/SubscriptionResignationPage";

/* Context */
const CartContext = React.createContext(null);

function App() {
    const [cartContent, setCartContent] = useState(localStorage.getItem('hideisland-cart') ? JSON.parse(localStorage.getItem('hideisland-cart')) : []);

    const addToCart = (id, title, amount, img, size, price) => {
        const uuid = uuidv4();

        let existedUuid, existedAmount = 0;

        /* If product already in cart - increase amount */
        if(cartContent.findIndex((item) => {
           if((item.id === id)&&(item.size === size)) {
               existedUuid = item.uuid;
               existedAmount = item.amount;
               return true;
           }
           else return false;
        }) !== -1) {
            if(existedUuid) {
                getProductStock(id)
                    .then(res => {
                        const result = res?.data?.result[0];
                        if(result) {
                            const sizes = [
                                { name: result.size_1_name, value: result.size_1_stock },
                                { name: result.size_2_name, value: result.size_2_stock },
                                { name: result.size_3_name, value: result.size_3_stock },
                                { name: result.size_4_name, value: result.size_4_stock },
                                { name: result.size_5_name, value: result.size_5_stock }
                            ];
                            sizes.forEach((item) => {
                                if(item.name === size) {
                                    if(item.value >= existedAmount+amount) {
                                        editCart(existedUuid, id, title, existedAmount+amount, img, size, price);
                                    }
                                }
                            })
                        }
                    })
            }
        }
        else {
            localStorage.setItem('hideisland-cart', JSON.stringify([...cartContent, {
                uuid, id, title, amount, img, size, price
            }]));

            setCartContent([...cartContent, {
                uuid, id, title, amount, img, size, price
            }]);
        }
    }

    const editCart = (uuid, id, title, amount, img, size, price) => {
        localStorage.setItem('hideisland-cart', JSON.stringify(cartContent.map((item) => {
            if(item.uuid === uuid) {
                return {
                    uuid, id, title, amount, img, size, price
                }
            }
            else return item;
        })));

        setCartContent(cartContent.map((item) => {
            if(item.uuid === uuid) {
                return {
                    uuid, id, title, amount, img, size, price
                }
            }
            else return item;
        }));
    }

    const removeFromCart = (uuid) => {
        const localStorageItem = localStorage.getItem('hideisland-cart');
        if(localStorageItem) {
            const newCart = JSON.parse(localStorage.getItem('hideisland-cart'))
                .filter((item) => {
                   return item.uuid !== uuid;
                });
            setCartContent(newCart);
            localStorage.setItem('hideisland-cart', JSON.stringify(newCart));
        }
    }

    const [terms, setTerms] = useState("");
    const [policy, setPolicy] = useState("");
    const [complaints, setComplaints] = useState("");
    const [returns, setReturns] = useState("");
    const [shippingAndPayment, setShippingAndPayment] = useState("");

    useEffect(() => {
        /* Initialize AOS */
        AOS.init({
            offset: -50,
            mirror: true
        });

        /* Get pages content */
        getPagesContent()
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    setTerms(result[0].terms_of_service);
                    setPolicy(result[0].privacy_policy);
                    setComplaints(result[0].complaints);
                    setReturns(result[0].returns);
                    setShippingAndPayment(result[0].shipping_and_payment);
                }
            });

        /* Auth */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
               if(!res.data.result) {
                   localStorage.removeItem('sec-user-id');
               }
            });
    }, []);

  return (<CartContext.Provider value={{cartContent, addToCart, editCart, removeFromCart}}>
      <Helmet>
          <title>HideIsland - ubrania dla Ciebie</title>
      </Helmet>
      <div className="App">
        <Router>
          {/* Website routes */}
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/produkt">
              <SingleProduct />
          </Route>
          <Route path="/kategoria">
              <Category />
          </Route>
          <Route path="/sklep">
              <Category />
          </Route>
          <Route path="/koszyk">
              <Cart />
          </Route>
          <Route path="/regulamin">
              <Page
                  title="Regulamin"
                  content={terms} />
          </Route>
            <Route path="/polityka-prywatnosci">
                <Page
                    title="Polityka prywatności"
                    content={policy} />
            </Route>
            <Route path="/zwroty">
                <Page
                    title="Zwroty"
                    content={complaints} />
            </Route>
            <Route path="/reklamacje">
                <Page
                    title="Reklamacje"
                    content={returns} />
            </Route>
            <Route path="/dostawa-i-platnosci">
                <Page
                    title="Dostawa i płatności"
                    content={shippingAndPayment}
                    extra={przelewy24Methods}
                />
            </Route>

          <Route path="/zaloguj-sie">
              <LoginPageClient />
          </Route>
          <Route path="/zarejestruj-sie">
              <RegisterPage />
          </Route>
          <Route path="/konto-zalozone">
              <AfterRegister />
          </Route>
          <Route path="/moje-konto">
              <MyAccount />
          </Route>
          <Route path="/dziekujemy">
              <TYPage />
          </Route>

          <Route path="/potwierdzenie-subskrypcji-newslettera">
              <SubscriptionValidationPage />
          </Route>
          <Route path="/rezygnacja-z-subskrypcji">
              <SubscriptionResignationPage />
          </Route>

            {/* Admin routes */}
            <Route exact path='/admin'>
                <LoginPage />
            </Route>
            <Route exact path="/panel">
                <PanelPage />
            </Route>
            <Route path="/panel/produkty">
                <PanelProducts />
            </Route>
            <Route path="/panel/zamowienia">
                <PanelOrders />
            </Route>
            <Route path="/panel/kategorie">
                <PanelCategories />
            </Route>
            <Route path="/panel/platnosci">
                <PanelPayment />
            </Route>
            <Route path="/panel/wysylka">
                <PanelShipping />
            </Route>
            <Route path="/panel/ustawienia">
                <PanelSettings />
            </Route>
            <Route path="/panel/kupony">
                <PanelCoupons />
            </Route>
            <Route path="/panel/zdjecia">
                <PanelImages />
            </Route>
            <Route path="/panel/pozostale">
                <PanelOthers />
            </Route>
            <Route path="/panel/newsletter">
                <NewsletterPage />
            </Route>
            <Route path="/panel/stany-magazynowe">
                <PanelStocks />
            </Route>
            <Route path="/panel/dodaj-stan-magazynowy">
                <AddStockPage />
            </Route>

            {/* Add content pages */}
            <Route path="/panel/dodaj-produkt">
                <AddProductPage />
            </Route>
            <Route path="/panel/dodaj-wpis">
                <AddPostPage />
            </Route>

            {/* Order details */}
            <Route path="/panel/szczegoly-zamowienia">
                <OrderDetails />
            </Route>
        </Router>

          <CookieConsent buttonText="OK">
              Ta strona korzysta z plików cookies w celu usprawnienia i promocji naszych usług. Pozostanie na niej jest równoznaczne z zaakceptowaniem naszej <a className="cookiesLink" href="/polityka-prywatnosci">Polityki Prywatności</a>.
          </CookieConsent>
    </div>
  </CartContext.Provider>);
}

export default App;
export { CartContext }
