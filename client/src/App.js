import React, { useState, useContext } from 'react'
import { Helmet } from 'react-helmet'
import './static/style/style.css'
import './static/style/mobile.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import SingleProduct from "./pages/SingleProduct";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Page from "./pages/Page";

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

    const removeFromCart = (id) => {
        const localStorageItem = localStorage.getItem('hideisland-cart');
        if(localStorageItem) {
            const newCart = JSON.parse(localStorage.getItem('hideisland-cart'))
                .filter((item) => {
                   return item.id !== id;
                });
            setCartContent(newCart);
            localStorage.setItem('hideisland-cart', JSON.stringify(newCart));
        }
    }

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
          <Route path="/koszyk">
              <Cart />
          </Route>
          <Route path="/regulamin">
              <Page
                  title="Regulamin"
                  content="regulamin" />
          </Route>
            <Route path="/polityka-prywatnosci">
                <Page
                    title="Polityka prywatności"
                    content="regulamin" />
            </Route>
            <Route path="/zwroty-i-reklamacje">
                <Page
                    title="Zwroty i reklamacje"
                    content="regulamin" />
            </Route>

            {/* Admin routes */}
        </Router>
    </div>
  </CartContext.Provider>);
}

export default App;
export { CartContext }
