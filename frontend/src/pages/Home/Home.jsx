import React, { useRef }  from 'react';
import Header from '../../utils/Header';
import Hero from '../../components/Home/Hero';
import Products from '../../components/Home/Products';
import Footer from '../../utils/Footer';
import FAQ from '../../components/Home/FAQ';
import ContactUs from '../../components/Home/ContactUs';


const Home = () => {
  const serviceRef = useRef(null);

  const scrollToService = () => {
    serviceRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-inter min-h-screen bg-white">
      <Header scrollToService={scrollToService}/>
      <Hero />
      <Products />
      <FAQ />
      <ContactUs />
        <Footer />
    </div>
  );
};

export default Home;