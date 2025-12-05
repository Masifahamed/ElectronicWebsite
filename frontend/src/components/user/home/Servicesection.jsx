import React, { useEffect, useState } from 'react';
import delivery from '../../../assets/delivery.png';
import service from '../../../assets/Services.png';
import authenticate from '../../../assets/authenticate.png';
import ScrollUp from '../ScrollUp';


const Servicesection = () => {


  return (
    <section className="w-full mt-10 mb-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {/* Delivery Service */}
        <div className="flex flex-col items-center gap-3 px-4">
          <img
            src={delivery}
            alt="Fast Delivery"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <h1 className="font-bold text-lg sm:text-xl">FREE AND FAST DELIVERY</h1>
          <p className="text-sm sm:text-base text-gray-500">Free delivery for all orders over $140</p>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center gap-3 px-4">
          <img
            src={service}
            alt="Customer Service"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <h1 className="font-bold text-lg sm:text-xl">24/7 CUSTOMER SERVICE</h1>
          <p className="text-sm sm:text-base text-gray-500">Friendly 24/7 customer support</p>
        </div>

        {/* Money Back */}
        <div className="flex flex-col items-center gap-3 px-4">
          <img
            src={authenticate}
            alt="Money Back Guarantee"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <h1 className="font-bold text-lg sm:text-xl">MONEY BACK GUARANTEE</h1>
          <p className="text-sm sm:text-base text-gray-500">We return money within 30 days</p>
        </div>
      </div>
  <ScrollUp/>
    </section>
  );
};

export default Servicesection;
