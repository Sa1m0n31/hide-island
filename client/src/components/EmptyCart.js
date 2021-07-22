import React from 'react'

const EmptyCart = () => {
    return <main className="page emptyCart">
        <h2 className="cart__header">
            Twój koszyk jest pusty
        </h2>
        <a className="emptyCart__btn" href="/">
            Wróć do sklepu
        </a>
    </main>
}

export default EmptyCart;
