import React from 'react'
import phone from '../../../assets/phonesale.png'
import computer from '../../../assets/Computer.png'
import Gamepad from '../../../assets/Gamepad.png'
import smartwatch from '../../../assets/SmartWatch.png'
import headphone from '../../../assets/HeadPhone.png'
import { Camera, Type } from 'lucide-react'
import { useRef } from 'react'

const Category = () => {

  const scrollContainerRef = useRef(null)
  
  const camera= <Camera size={50}/>

  const content = [
    "Category",
    "Phones",
    "Computer",
    "SmartWatch",
    "Camera",
    "HeadPhones",
    "Gaming",
  ];

  const categories = [
    { name: content[1], img: phone,type:'image' },
    { name: content[2], img: computer,type:'image' },
    { name: content[3], img: smartwatch,type:'image' },
    { name: content[4], img: camera ,type:'icon'},
    { name: content[5], img: headphone ,type:'image'},
    { name: content[6], img: Gamepad ,type:'image'},
  
  ];

  return (
    <section className="px-6 sm:px-10 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#1600A0] to-[#9B77E7] bg-clip-text text-transparent pb-1 text-center sm:text-left">
          {content[0]}
        </h1>
   
      </div>

      {/* Category Grid */}

      <div className="mt-5 grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-items-center space-x-6 scrollbar-hide overflow-x-auto scroll-smooth py-4 px-2" ref={scrollContainerRef}>
          {categories.map((item, index) => (
            <div
              key={index}
              className={`border-2 border-blue-200 flex flex-col items-center justify-center gap-2 w-full sm:w-[140px] h-[140px] sm:h-[160px] px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r from-[#9B77E7] to-[#1600A0] `}
            >
          {item.type==="icon"?(
            <div>
              {item.img}
            </div>
          ):(

              <img key={index}
                src={item.img}
                alt={item.name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />)
              }
              <h2 className="font-medium text-sm sm:text-base text-center">{item.name}</h2>
            </div>
          ))}
        </div>
    </section>
  );
};

export default Category;
