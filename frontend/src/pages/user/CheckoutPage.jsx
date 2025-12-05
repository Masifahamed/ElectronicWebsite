import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    pincode: "",
    addressline: "",
  });

  useEffect(()=>{
    fetch("http://localhost:3500/api/user",{credentials:"include"})
    .then(res=>res.json())
    .then(data=>{
        setUserDetails(prev=>({
            ...prev,
            first:data.first,
            email:data.email,
            phone:data.phone
        }))
    })
    .catch(err=>console.log("Error fetching user",err))
  },[])

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
   if (!userDetails.state||!userDetails.district||!userDetails.pincode||!userDetails.addressline) {
        alert("Please fill all required fields");
        return;
      }
    

    // store in localStorage
    localStorage.setItem("userAddress", JSON.stringify(userDetails));

    // navigate to payment
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Delivery Information
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="col-span-2">
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <User size={18}/> Full Name
            </label>
            <input name="fullname" value={userDetails.name} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter your full name"/>
          </div>

          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <Mail size={18}/> Email
            </label>
            <input name="email" value={userDetails.email} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter email"/>
          </div>

          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <Phone size={18}/> Phone
            </label>
            <input name="phone" value={userDetails.phone} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter phone"/>
          </div>

          <div>
            <label className="text-gray-700 font-medium mb-1">State</label>
            <input name="state" value={userDetails.state} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter state"/>
          </div>

          <div>
            <label className="text-gray-700 font-medium mb-1">District</label>
            <input name="district" value={userDetails.district} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter district"/>
          </div>

          <div>
            <label className="text-gray-700 font-medium mb-1">Pincode</label>
            <input name="pincode" value={userDetails.pincode} onChange={handleChange}
              className="w-full p-3 border rounded-lg" placeholder="Enter pincode"/>
          </div>

          <div className="col-span-2">
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <MapPin size={18}/> Address
            </label>
            <textarea name="addressline" value={userDetails.addressline} onChange={handleChange}
              rows={3} className="w-full p-3 border rounded-lg"
              placeholder="House number, street, area, landmark"/>
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Save & Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
