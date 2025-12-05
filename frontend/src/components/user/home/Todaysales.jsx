import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
//import { products } from '../../../ultis/constant';
//import { Heart, Eye, ShoppingCart } from 'lucide-react';
import ProductGrid from './ProductGrid';

const TodaysSales = () => {
  return (
        <section className="py-16 bg-gray-50 items-center flex flex-col">
            <div className="container mx-auto px-4">
                {/* Header with Timer */}
                <div className="flex flex-col lg:flex-row justify-between gap-10 items-start lg:items-center mb-12">
                    <div className="mb-6 lg:mb-0">
                        <h2 className="text-4xl lg:text-5xl font-pop font-bold bg-gradient-to-r from-[#1600A0] to-[#9B77E7] bg-clip-text text-transparent mb-4">
                            Today's Sales
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Don't miss out on these amazing deals! Limited time offer.
                        </p>
                    </div>

                    {/* Timer */}
                    <Timer />
                </div>
                <ProductGrid />
            </div>

            {/* Decorative element */}
            <div className='w-50 h-2 bg-blue-500 rounded-xl mt-12'></div>
        </section>
    );
};

export default TodaysSales;