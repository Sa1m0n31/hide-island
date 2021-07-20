import React from 'react'
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/GallerySection";
import Recommendations from "../components/Recommendations";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

const HomePage = () => {
    return <>
        <Header />
        <HeroSection />
        <GallerySection />
        <Recommendations />
        <AboutUs />
        <Footer />
    </>
}

export default HomePage;
