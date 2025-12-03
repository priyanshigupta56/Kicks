import React from "react";
import heroImg from "../../assets/img/bg-hero.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full h-[85vh] bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* LEFT-CONSTRAINED CONTENT */}
      <div className="relative z-10 pl-10 md:pl-28 max-w-[600px]">
        <h1 className="text-white text-5xl md:text-6xl font-semibold leading-tight">
          Step Into Your Best
           Self
        </h1>

        <p className="text-gray-200 text-lg md:text-xl mt-4">
          Discover premium footwear designed for performance, comfort,
          and style. 
          Your perfect pair awaits.
        </p>

        <div className="mt-8">
          <a
            href="#products"
            className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium shadow hover:opacity-90 transition inline-flex gap-2 items-center"
          >
            Shop Now →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;