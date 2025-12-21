import React, { useRef } from "react";
import phone from "../../../assets/phonesale.png";
import computer from "../../../assets/Computer.png";
import Gamepad from "../../../assets/Gamepad.png";
import smartwatch from "../../../assets/SmartWatch.png";
import headphone from "../../../assets/Headphone.png";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

const Category = () => {
  const scrollContainerRef = useRef(null);
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return
    const scrollamount = 220;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollamount : scrollamount,
      behavior: "smooth"
    })
  }
  const categories = [
    { name: "Phones", img: phone, type: "image" },
    { name: "Computer", img: computer, type: "image" },
    { name: "SmartWatch", img: smartwatch, type: "image" },
    { name: "Camera", img: <Camera size={42} />, type: "icon" },
    { name: "HeadPhones", img: headphone, type: "image" },
    { name: "Gaming", img: Gamepad, type: "image" },
  ];

  return (
    <section className="px-4 sm:px-8 py-10">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold
                     bg-gradient-to-r from-[#1600A0] to-[#9B77E7]
                     bg-clip-text text-transparent text-center sm:text-left pb-1">
        Category
      </h1>
      {/* Scroll button */}
      <div className="flex gap-2 sm:hidden">
        <button onClick={() => scroll("left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <ChevronLeft />
        </button>
        <button onClick={() => scroll("right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <ChevronRight />
        </button>
      </div>
      {/* Category List */}
      <div
        ref={scrollContainerRef}
        className="
          mt-6
          flex gap-4 overflow-x-auto scrollbar-hide
          sm:grid sm:grid-cols-3
          lg:grid-cols-6
          sm:overflow-x-hidden
        "
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className="
              min-w-[130px] sm:min-w-0
              h-[140px] sm:h-[160px]
              border-2 border-blue-200
              rounded-lg
              flex flex-col items-center justify-center gap-2
              cursor-pointer
              transition-all duration-300
              hover:scale-105
              hover:bg-gradient-to-r
              hover:from-[#9B77E7]
              hover:to-[#1600A0]
            "
          >
            {item.type === "icon" ? (
              item.img
            ) : (
              <img
                src={item.img}
                alt={item.name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
            )}

            <h2 className="font-medium text-sm sm:text-base text-center">
              {item.name}
            </h2>
            <button>

            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
