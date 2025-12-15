import React, { useState, useEffect } from 'react';
import { Save, Upload, Clock, Tag, Headphones, Speaker } from 'lucide-react';
import axios from 'axios';
//import { speaker } from '../../ultis/constant';
import speaker from '../../assets/speaker.png';
const API_Poster = "http://localhost:3500/api/poster"

const PosterPage = () => {
  const [heroData, setHeroData] = useState({
    category: 'Categories',
    title: 'Enhance Your Music Experience',
    productname: 'Speaker',
    originalprice: 4500,
    price: 4000,
    days: 1,
    hours: 12,
    minutes: 34,
    seconds: 56,
    buttonText: 'Buy Now',
    imageurl: speaker,
    backgroundColor: '#000000',
    textColor: '#FAFAFA',
    accentColor: '#FAFAFA',
    categoryTextColor: '#00FF66',
    buttonColor: '#00FF66',
    buttonTextColor: '#000000',

  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(heroData.imageurl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPosterData = async () => {
      try {
        const res = await axios.get(`${API_Poster}/`);
        if (res.data.success && res.data.data) {
          setHeroData(res.data.data);

          if (res.data.data.imageurl) {
            setPreviewUrl(`http://localhost:3500${res.data.data.imageurl}`);
          }
        }
      } catch (err) {
        console.log("Error loading poster data", err);
      }
    };
    fetchPosterData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file); // For FormData upload

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result); // Preview immediately
    };
    reader.readAsDataURL(file);
  };


  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (imageFile) {
        // Only include file in FormData
        const formData = new FormData();

        // Object.keys(heroData).forEach(key => formData.append(key, heroData[key] == null ? "" : String(heroData[key])));
        // formData.append('imageFile', imageFile);
        Object.keys(heroData).forEach(key => {
          if (key !== "imageurl") {
            formData.append(key, heroData[key] ?? "")
          }
        })
        formData.append("imageFile", imageFile)
        if (heroData._id) {
          await axios.put(`${API_Poster}/update`, formData)
        } else {
          await axios.post(`${API_Poster}/add`, formData)
        }
      } else {
        // Update only text & URL
        await axios.put(`${API_Poster}/update`, heroData);
      }

      // Reload backend data for preview
      const refreshed = await axios.get(`${API_Poster}/`);
      if (refreshed.data.success) {
        setHeroData(refreshed.data.data);


        setPreviewUrl(`http://localhost:3500${refreshed.data.data.imageurl}`);
        // Update preview from backend
        //setImageFile(null); // Reset file
      }

      setMessage("Poster updated successfully!");
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.log("Save error:", error);
      setMessage("Error while saving poster!");
    } finally {
      setIsLoading(false);
    }
  };



  const resetToDefault = () => {
    setHeroData({
      category: 'Categories',
      title: 'Enhance Your Music Experience',
      productname: "Speaker",
      originalprice: 4500,
      price: 4000,
      days: 1,
      hours: 12,
      minutes: 34,
      seconds: 56,
      buttonText: 'Buy Now',
      imageurl: speaker,
      backgroundColor: '#000000',
      textColor: '#FAFAFA',
      accentColor: '#FAFAFA',
      buttonColor: '#00FF66',
      categoryTextColor: '#00FF66',
      buttonTextColor: '#000000'
    });
    setPreviewUrl(heroData.imageurl || "");
    setImageFile(null);
    setMessage('Reset to default values!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero Section Management</h1>
        <p className="text-gray-600">Manage the main hero/banner section of your website</p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg  absolute bottom-40 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
          {message}
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Content Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Text
                </label>
                <input
                  type="text"
                  name="category"
                  value={heroData.category || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Title
                </label>
                <textarea
                  name="title"
                  value={heroData.title || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="productname"
                  value={heroData.productname || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OriginalPrice
                </label>
                <input
                  name="originalprice"
                  value={heroData.originalprice ?? 0}
                  onChange={handleInputChange}
                  step="0.01"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Price
                </label>
                <input
                  type='number'
                  name="price"
                  value={heroData.price ?? 0}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={heroData.buttonText || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timer Settings
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'days', label: 'Days', max: 30 },
                { name: 'hours', label: 'Hours', max: 23 },
                { name: 'minutes', label: 'Minutes', max: 59 },
                { name: 'seconds', label: 'Seconds', max: 59 }
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label || ""}
                  </label>
                  <input
                    type="number"
                    name={item.name}
                    value={heroData[item.name] ?? ""}
                    onChange={handleInputChange}
                    min="0"
                    max={item.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Image Upload
            </h2>

            <div className="space-y-4">

              {/* OPTION 1 — Upload from Computer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image from Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* OPTION 2 — Paste Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={heroData.imageurl || ""}
                  onChange={(e) => {
                    const url = e.target.value;
                    setHeroData(prev => ({
                      ...prev,
                      imageurl: url
                    }));
                    setPreviewUrl(url);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* LIVE PREVIEW */}
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="relative w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] z-10"
                />
              ) : (
                <div className="relative w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center z-10">
                  <p className="text-gray-500">Image Preview</p>
                </div>
              )}


            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Color Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'backgroundColor', label: 'Background Color' },
                { name: 'textColor', label: 'Text Color' },
                { name: 'accentColor', label: 'Accent Color' },
                { name: 'buttonColor', label: 'Button Color' },
                { name: 'categoryTextColor', label: 'Category Color' },
                { name: 'buttonTextColor', label: 'Button Text Color' }
              ].map((color) => (
                <div key={color.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {color.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name={color.name}
                      value={heroData[color.name || ""]}
                      onChange={handleInputChange}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name={color.name}
                      value={heroData[color.name || ""]}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Live Preview
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div
              className="w-full rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
              style={{ backgroundColor: heroData.backgroundColor }}
            >
              {/* Text and Timer Section */}
              <div className="flex flex-col gap-6 z-10 text-center md:text-left">
                <p
                  className="font-semibold text-[16px]"
                  style={{ color: heroData.categoryTextColor }}
                >
                  {heroData.category || ""}
                </p>
                <h1
                  className="font-semibold text-[28px] md:text-[40px] lg:text-[50px] text-yellow-600 leading-tight"

                >
                  {heroData.productname || ""}
                </h1>
                <h1
                  className="font-semibold text-[28px] md:text-[40px] lg:text-[50px] text-yellow-600 leading-tight"

                >
                  {heroData.originalprice || 45000}
                </h1>

                <h1
                  className="font-semibold text-[28px] md:text-[40px] lg:text-[50px] leading-tight"
                  style={{ color: heroData.textColor }}
                >
                  {heroData.title || ""}
                </h1>
                <h1 className='font-bold text-white text-[30px]'>
                  Price :
                  {heroData.price ?? 0}
                </h1>

                {/* Timer Circles */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  {[
                    { label: 'Days', value: heroData.days ?? 0 },
                    { label: 'Hours', value: heroData.hours ?? 0 },
                    { label: 'Minutes', value: heroData.minutes ?? 0 },
                    { label: 'Seconds', value: heroData.seconds ?? 0 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-white flex flex-col justify-center items-center font-bold text-black"
                    >
                      <h1 className="text-[16px] sm:text-[18px] md:text-[20px]">
                        {String(item.value || 0).padStart(2, '0')}
                      </h1>
                      <h2 className="text-[12px] sm:text-[14px]">{item.label || ""}</h2>
                    </div>
                  ))}
                </div>

                {/* Buy Now Button */}
                <div className="flex justify-center md:justify-start">
                  <button
                    className="mt-5 font-semibold py-3 px-6 rounded-md transition-all"
                    style={{
                      backgroundColor: heroData.buttonColor,
                      color: heroData.buttonTextColor
                    }}
                  >
                    {heroData.buttonText || ""}
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="relative mt-8 md:mt-0 flex justify-center items-center">
                <div
                  className="absolute rounded-full blur-[100px] right-0 opacity-70"
                  style={{
                    backgroundColor: heroData.accentColor,
                    width: '300px',
                    height: '300px'
                  }}
                ></div>
                {previewUrl ? (
                  <img
                    src={previewUrl || ""}
                    alt="Product preview"
                    className="relative w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] z-10"
                  />
                ) : (
                  <div className="relative w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center z-10">
                    <p className="text-gray-500">Image Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPage;

// import React, { useEffect, useState } from "react";
// import { Save, Upload, Clock, Tag, Headphones } from "lucide-react";
// import axios from "axios";
// import speaker from "../../assets/speaker.png";

// const API_Poster = "http://localhost:3500/api/poster";

// const emptyPoster = {
//   category: "Categories",
//   title: "Enhance Your Music Experience",
//   productname: "Speaker",
//   originalprice: 4500,
//   price: 4000,
//   days: 1,
//   hours: 12,
//   minutes: 34,
//   seconds: 56,
//   buttonText: "Buy Now",
//   imageurl: "",
//   backgroundColor: "#000000",
//   textColor: "#FAFAFA",
//   accentColor: "#FAFAFA",
//   categoryTextColor: "#00FF66",
//   buttonColor: "#00FF66",
//   buttonTextColor: "#000000",
//   isTrending: false,
// };

// const PosterPage = () => {
//   const [posters, setPosters] = useState([]);
//   const [editingPoster, setEditingPoster] = useState(null); // object when editing or null for new
//   const [formDataState, setFormDataState] = useState(emptyPoster);
//   const [imageFile, setImageFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // load posters
//   const fetchPosters = async () => {
//     try {
//       const res = await axios.get(`${API_Poster}/`);
//       if (res.data.success) {
//         setPosters(res.data.data || []);
//       }
//     } catch (err) {
//       console.error("Fetch posters err", err);
//     }
//   };

//   useEffect(() => {
//     fetchPosters();
//   }, []);

//   // when selecting poster to edit or adding new
//   const openNewPoster = () => {
//     setEditingPoster(null);
//     setFormDataState(emptyPoster);
//     setImageFile(null);
//     setPreviewUrl("");
//   };

//   const openEditPoster = (poster) => {
//     setEditingPoster(poster);
//     // map DB poster into form state
//     setFormDataState({
//       ...poster,
//       imageurl: poster.imageurl || ""
//     });
//     setPreviewUrl(poster.imageurl ? formatPreviewUrl(poster.imageurl) : "");
//     setImageFile(null);
//   };

//   const formatPreviewUrl = (url) => {
//     if (!url) return "";
//     if (url.startsWith("http") || url.startsWith("data:")) return url;
//     return url.startsWith("/") ? `http://localhost:3500${url}` : `http://localhost:3500/${url}`;
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormDataState(prev => ({ ...prev, [name]: val }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewUrl(reader.result);
//     reader.readAsDataURL(file);
//   };

//   // Save (create or update)
//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       // prepare payload
//       if (imageFile) {
//         const fd = new FormData();
//         // append all text fields
//         Object.keys(formDataState).forEach(key => {
//           if (key !== "imageurl") fd.append(key, formDataState[key] ?? "");
//         });
//         fd.append("imageFile", imageFile);
//         fd.append("isTrending", formDataState.isTrending ?? false);

//         if (editingPoster && editingPoster._id) {
//           await axios.put(`${API_Poster}/update/${editingPoster._id}`, fd, {
//             headers: { "Content-Type": "multipart/form-data" }
//           });
//         } else {
//           await axios.post(`${API_Poster}/add`, fd, {
//             headers: { "Content-Type": "multipart/form-data" }
//           });
//         }
//       } else {
//         // no file -> send JSON (imageurl may be set)
//         const payload = { ...formDataState };
//         if (editingPoster && editingPoster._id) {
//           await axios.put(`${API_Poster}/update/${editingPoster._id}`, payload);
//         } else {
//           await axios.post(`${API_Poster}/add`, payload);
//         }
//       }

//       await fetchPosters();
//       setMessage("Saved successfully!");
//       setTimeout(() => setMessage(""), 3000);
//       // reset form
//       setEditingPoster(null);
//       setFormDataState(emptyPoster);
//       setImageFile(null);
//       setPreviewUrl("");
//     } catch (err) {
//       console.error("Save err", err);
//       setMessage("Error saving poster");
//       setTimeout(() => setMessage(""), 3000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this poster?")) return;
//     try {
//       await axios.delete(`${API_Poster}/delete/${id}`);
//       await fetchPosters();
//       setMessage("Deleted");
//       setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//       console.error("delete err", err);
//       setMessage("Error deleting");
//       setTimeout(() => setMessage(""), 2000);
//     }
//   };

//   const toggleTrending = async (poster) => {
//     // mark this poster trending, backend will unset others if requested
//     try {
//       const payload = { ...poster, isTrending: !poster.isTrending };
//       // remove _id from payload since update route accepts body
//       delete payload._id;
//       await axios.put(`${API_Poster}/update/${poster._id}`, payload);
//       await fetchPosters();
//     } catch (err) {
//       console.error(err);
//       setMessage("Error toggling trending");
//       setTimeout(() => setMessage(""), 2000);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Poster Manager</h1>
//           <p className="text-gray-600">Add, edit and manage posters. Min 1 poster required on site.</p>
//         </div>

//         <div className="flex gap-2">
//           <button onClick={openNewPoster} className="bg-green-600 text-white px-4 py-2 rounded">Add Poster</button>
//           <button onClick={fetchPosters} className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
//         </div>
//       </div>

//       {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>}

//       {/* Posters list */}
//       <div className="mb-6">
//         <h2 className="font-semibold mb-2">Posters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {posters.length === 0 && <div className="p-4 bg-yellow-50 rounded">No posters yet</div>}
//           {posters.map(p => (
//             <div key={p._id} className="border rounded p-4 bg-white">
//               <div className="flex justify-between items-start gap-2">
//                 <div>
//                   <p className="font-semibold text-sm" style={{ color: p.categoryTextColor || "#000" }}>{p.category}</p>
//                   <h3 className="font-bold">{p.productname}</h3>
//                   <p className="text-sm">{p.title}</p>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <button onClick={() => openEditPoster(p)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
//                   <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
//                   <button onClick={() => toggleTrending(p)} className={`px-2 py-1 rounded ${p.isTrending ? "bg-yellow-400" : "bg-gray-200"}`}>
//                     {p.isTrending ? "Trending" : "Mark trending"}
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <img src={formatPreviewUrl(p.imageurl || "") || speaker} alt="preview" className="w-full h-40 object-cover rounded" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Form (Add/Edit) */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-lg font-semibold mb-4">{editingPoster ? "Edit Poster" : "Add Poster"}</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Category</label>
//             <input name="category" value={formDataState.category} onChange={handleInputChange} className="w-full p-2 border rounded" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Product Name</label>
//             <input name="productname" value={formDataState.productname} onChange={handleInputChange} className="w-full p-2 border rounded" />
//           </div>

//           <div className="col-span-1 md:col-span-2">
//             <label className="block text-sm font-medium">Title</label>
//             <textarea name="title" value={formDataState.title} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Original Price</label>
//             <input type="number" name="originalprice" value={formDataState.originalprice} onChange={handleInputChange} className="w-full p-2 border rounded" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Price</label>
//             <input type="number" name="price" value={formDataState.price} onChange={handleInputChange} className="w-full p-2 border rounded" />
//           </div>

//           {/* timer */}
//           {["days","hours","minutes","seconds"].map(key => (
//             <div key={key}>
//               <label className="block text-sm font-medium">{key}</label>
//               <input type="number" name={key} value={formDataState[key]} onChange={handleInputChange} className="w-full p-2 border rounded" />
//             </div>
//           ))}

//           <div>
//             <label className="block text-sm font-medium">Button Text</label>
//             <input name="buttonText" value={formDataState.buttonText} onChange={handleInputChange} className="w-full p-2 border rounded" />
//           </div>

//           {/* Image upload */}
//           <div className="col-span-1 md:col-span-2">
//             <label className="block text-sm font-medium">Upload Image</label>
//             <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded" />
//             <label className="block mt-2 text-sm">Or paste image URL</label>
//             <input type="text" name="imageurl" value={formDataState.imageurl} onChange={(e) => { setFormDataState(prev => ({ ...prev, imageurl: e.target.value })); setPreviewUrl(e.target.value); }} className="w-full p-2 border rounded" />
//           </div>

//           {/* Colors */}
//           {[
//             { name: "backgroundColor", label: "Background" },
//             { name: "textColor", label: "Text" },
//             { name: "accentColor", label: "Accent" },
//             { name: "categoryTextColor", label: "Category" },
//             { name: "buttonColor", label: "Button" },
//             { name: "buttonTextColor", label: "Button Text" }
//           ].map(c => (
//             <div key={c.name}>
//               <label className="block text-sm font-medium">{c.label}</label>
//               <div className="flex gap-2">
//                 <input type="color" name={c.name} value={formDataState[c.name]} onChange={handleInputChange} className="w-12 h-10" />
//                 <input type="text" name={c.name} value={formDataState[c.name]} onChange={handleInputChange} className="flex-1 p-2 border rounded" />
//               </div>
//             </div>
//           ))}

//           <div className="col-span-1 md:col-span-2 flex items-center gap-4">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" name="isTrending" checked={!!formDataState.isTrending} onChange={handleInputChange} />
//               <span className="text-sm">Mark as trending (only one allowed)</span>
//             </label>
//           </div>

//           {/* Preview */}
//           <div className="col-span-1 md:col-span-2">
//             <h3 className="font-semibold mb-2">Live Preview</h3>
//             <div className="p-4 rounded" style={{ backgroundColor: formDataState.backgroundColor }}>
//               <div className="flex flex-col md:flex-row items-center justify-between">
//                 <div className="z-10 text-left">
//                   <p style={{ color: formDataState.categoryTextColor }}>{formDataState.category}</p>
//                   <h2 style={{ color: formDataState.textColor }}>{formDataState.title}</h2>
//                   <p className="font-bold">Price: {formDataState.price}</p>
//                 </div>

//                 <div>
//                   <img src={previewUrl || formatPreviewUrl(formDataState.imageurl) || speaker} alt="preview" className="w-[200px] h-[160px] object-cover rounded" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-span-1 md:col-span-2 flex gap-3">
//             <button onClick={handleSave} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
//               <Save className="inline-block mr-2" /> {isLoading ? "Saving..." : "Save"}
//             </button>
//             <button onClick={() => { setEditingPoster(null); setFormDataState(emptyPoster); setPreviewUrl(""); }} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PosterPage;
