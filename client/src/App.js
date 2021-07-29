import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'

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

/* Context */
const CartContext = React.createContext(null);

function App() {
    const [cartContent, setCartContent] = useState(localStorage.getItem('hideisland-cart') ? JSON.parse(localStorage.getItem('hideisland-cart')) : []);

    const addToCart = (id, title, amount, img, size, price) => {
        localStorage.setItem('hideisland-cart', JSON.stringify([...cartContent, {
            id, title, amount, img, size, price
        }]));

        setCartContent([...cartContent, {
            id, title, amount, img, size, price
        }]);
    }

    const removeFromCart = (id, size) => {
        const localStorageItem = localStorage.getItem('hideisland-cart');
        if(localStorageItem) {
            const newCart = JSON.parse(localStorage.getItem('hideisland-cart'))
                .filter((item) => {
                   return item.id !== id || item.size !== size;
                });
            setCartContent(newCart);
            localStorage.setItem('hideisland-cart', JSON.stringify(newCart));
        }
    }

    const [terms, setTerms] = useState("");
    const [policy, setPolicy] = useState("");
    const [complaints, setComplaints] = useState("");

    useEffect(() => {
        /* Get pages content */
        getPagesContent()
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    setTerms(result[0].terms_of_service);
                    setPolicy(result[0].privacy_policy);
                    setComplaints(result[0].complaints_and_returns);
                }
            });
    }, []);

  return (<CartContext.Provider value={{cartContent, addToCart, removeFromCart}}>
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
            <Route path="/zwroty-i-reklamacje">
                <Page
                    title="Zwroty i reklamacje"
                    content={complaints} />
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
            <Route path="/panel/pozostale">
                <PanelOthers />
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
    </div>
  </CartContext.Provider>);
}

export default App;
export { CartContext }
