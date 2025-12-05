import React, { useEffect, useState } from 'react';
import speaker from '../../../assets/speaker.png';
import axios from 'axios';

const ProductPoster = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const user = JSON.parse(localStorage.getItem("auth_user"))
  const userId = user?._id

  const [showCartMessage, setShowCartMessage] = useState(false)
  const [heroData, setHeroData] = useState(null);
  const [successmessage, setsuccessmessage] = useState('')
  const [displayData, setDisplayData] = useState({});
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState([])

  const loadCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3500/api/cart/single/${userId}`)
      setCart(res.data.data.cartlist);
      setLoading(true)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }
  useEffect(() => {
    loadCart()
  }, [userId])

  // Handle add to cart from popup
  const handleAddToCart = async (product) => {
    try {
      //const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Check if product already exists in cart
      const res = await axios.post("http://localhost:3500/api/cart/add", {
        userId: userId,
        productId: product._id,
        imageurl: product.imageurl,
        productname: product.productname || product.title,
        price: product.price,
        discount: product.discount,
        rating: product.rating,
        originalprice: product.originalprice,
        category: product.category,

      })
      console.log(res.data.message)

      alert("product is added to cart successfully")
      // Show success message
      setShowCartMessage(true);

      // Close popup after adding to cart
      setShowProductPopup(false);
      // Auto hide message after 3 seconds
      setTimeout(() => {
        setShowCartMessage(false);
      });


    } catch (err) {
      console.log(err)

    }
  };

  // Load hero/poster data
  useEffect(() => {
    const loadposter = async () => {
      try {
        const res = await axios.get("http://localhost:3500/api/poster/");
        if (res.data.success && res.data.data) {

          const data = res.data.data;
          setDisplayData(data);

          setTimeLeft({
            days: data.days,
            hours: data.hours,
            minutes: data.minutes,
            seconds: data.seconds,
          });
        }
      } catch (err) {
        console.log("Error loading poster:", err);
      }
    };

    loadposter();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds, days } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days -= 1;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <section className="mx-4 md:mx-10 my-10 flex justify-center">
      <div
        className="w-full max-w-[1170px] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
        style={{ backgroundColor: displayData.backgroundColor }}
      >

        {/* Text and Timer Section */}
        <div className="flex flex-col gap-6 z-10 text-center md:text-left">
          <p
            className="font-semibold text-[16px]"
            style={{ color: displayData.categoryTextColor || displayData.accentColor }}
          >
            {displayData.category}
          </p>
          <h1
            className="font-semibold text-[28px] md:text-[40px] lg:text-[50px] leading-tight"
            style={{ color: displayData.textColor }}
          >
            {displayData.title}
          </h1>
          <div>
            <h1 className='text-white font-bold text-[30px]'>{displayData.productname}</h1>
            <h3 className='text-yellow-500'>Price : {displayData.price}</h3>
            <p className='text-white'>Original Price : {displayData.originalprice}</p>
          </div>
          {/* Timer Circles */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-white flex flex-col justify-center items-center font-bold text-black"
              >
                <h1 className="text-[16px] sm:text-[18px] md:text-[20px]">
                  {item.value}
                </h1>
                <h2 className="text-[12px] sm:text-[14px]">{item.label}</h2>
              </div>
            ))}
          </div>

          {/* Buy Now Button */}
          <div className="flex justify-center md:justify-start">
            <button
              className="mt-5 font-semibold py-3 px-6 rounded-md hover:opacity-90 transition-all"
              style={{
                backgroundColor: displayData.buttonColor,
                color: displayData.buttonTextColor
              }}
              onClick={() => handleAddToCart(displayData)}
            >
              {displayData.buttonText}
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative mt-8 md:mt-0 flex justify-center items-center">
          <div
            className="absolute rounded-full blur-[100px] right-0 opacity-70"
            style={{
              backgroundColor: displayData.accentColor,
              width: '300px',
              height: '300px'
            }}
          ></div>
          <img
            src={displayData.imageurl || speaker}
            alt="speaker"
            className="relative w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductPoster;