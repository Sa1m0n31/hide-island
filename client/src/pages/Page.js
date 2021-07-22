import React from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";

const Page = ({title, content}) => {
    return <>
        <Header />
        <main className="page">
            <h1 className="cart__header">
                {title}
            </h1>
            <article className="page__content" dangerouslySetInnerHTML={{__html: content}}>

            </article>
        </main>
        <Footer />
    </>
}

export default Page;
