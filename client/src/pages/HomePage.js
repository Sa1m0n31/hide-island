import React from 'react'
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/GallerySection";
import Recommendations from "../components/Recommendations";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import NewsletterSection from "../components/NewsletterSection";

const HomePage = () => {
    return <>
        <Header />
        <HeroSection />
        <GallerySection />
        <NewsletterSection />
        <Recommendations />
        <AboutUs />
        <Footer />
    </>
}

export default HomePage;
