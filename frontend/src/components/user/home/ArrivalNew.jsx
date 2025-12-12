import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArrivalNew = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("auth_user"))
  const userId = user?._id

  const [titlestyle, descstyle] = [
    "text-white font-semibold text-[24px] leading-[24px] tracking-[3%]",
    "w-40 font-pop text-[14px] leading-[21px] text-white tracking-[0%] font-regular",
  ];

  
  useEffect(() => {
    const fetchArrivalProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3500/api/arrival/allproduct"
        );

        // Only first 4 products for layout
        setProducts(res.data.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching arrival products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivalProducts();
  }, []);

 
  const handleShopNow = async (product) => {
    try {

      await axios.post("http://localhost:3500/api/cart/add", {
        userId: userId,
        productId: product._id,
        imageurl: product.imageurl,
        productname: product.productname,
        price: product.price,
        discount: product.discount,
        rating: product.rating && product.rating<5?product.rating:Math.floor(Math.random()*5)+1,
        originalprice: product.originalprice,
        category: product.category,
      });
      alert("product is added cart successfully")
     // navigate("/orders");
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };

  if (loading) {
    return (
      <h1 className="text-center py-10 text-xl text-gray-500">
        Loading New Arrival...
      </h1>
    );
  }

  // If less than 4 products
  if (products.length < 4) {
    return (
      <h1 className="text-center py-10 text-red-500 text-xl">
        Please upload at least 4 arrival products in admin panel.
      </h1>
    );
  }

  return (
    <>
      <div className="px-6 md:px-12 lg:px-20 py-10">
        {/* Heading */}
        <h1 className="font-pop font-semibold text-[28px] sm:text-[32px] md:text-[36px] mb-10 bg-gradient-to-r from-[#1600A0] to-[#9B77E7] bg-clip-text text-transparent leading-[48px] tracking-[4%] text-center md:text-left">
          New Arrival
        </h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10">
          {/* Left Big Image */}
          <div className="relative bg-black rounded-2xl overflow-hidden lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[550px] flex justify-center items-center">
            <img
              src={products[0].imageurl}
              alt="Arrival Product"
              className="object-cover w-full pe-10 opacity-80"
            />
            <div className="absolute bottom-5 left-5">
              <h3 className={titlestyle}>{products[0].productname}</h3>
              <p className={descstyle}>{products[0].description}</p>

              <h5
                onClick={() => handleShopNow(products[0])}
                className="font-medium text-[16px] text-white mt-1 cursor-pointer"
              >
                Shop Now
              </h5>

              <div className="w-20 h-0.5 bg-gray-400 rounded-full mt-1"></div>
            </div>
          </div>

          {/* Right Two Sections */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            {/* Top Right Large */}
            <div className="relative bg-black rounded-2xl overflow-hidden h-[250px] sm:h-[300px]">
              <img
                src={products[1].imageurl}
                alt={products[1].productname}
                className="object-cover w-full opacity-80"
              />
              <div className="absolute bottom-5 left-5">
                <h3 className={titlestyle}>{products[1].productname}</h3>
                <p className={descstyle}>{products[1].description}</p>

                <h5
                  onClick={() => handleShopNow(products[1])}
                  className="font-medium text-[16px] text-white mt-1 cursor-pointer"
                >
                  Shop Now
                </h5>

                <div className="w-20 h-0.5 bg-gray-400 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Bottom Small Two */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[products[2], products[3]].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-black rounded-2xl overflow-hidden h-[200px] flex justify-center items-center"
                >
                  <img
                    src={item.imageurl}
                    alt={item.productname}
                    className="object-cover w-50 h-50 opacity-80"
                  />
                  <div className="absolute bottom-4 left-4">
                    <h3 className={titlestyle}>{item.productname}</h3>
                    <p className={descstyle}>{item.description}</p>

                    <h5
                      onClick={() => handleShopNow(item)}
                      className="font-medium text-[16px] text-white mt-1 cursor-pointer"
                    >
                      Shop Now
                    </h5>

                    <div className="w-20 h-0.5 bg-gray-400 rounded-full mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArrivalNew;
