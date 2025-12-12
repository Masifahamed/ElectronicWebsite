import React, { useState, useEffect } from 'react';
import { Save, Upload, Clock, Tag, Headphones } from 'lucide-react';
import axios from 'axios';
import { speaker } from '../../ultis/constant';

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
    imageurl: '',
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


  // const handleSave = async () => {
  //   setIsLoading(true);

  //   try {
  //     let formData;

  //     if (imageFile) {
  //       // Only include file in FormData
  //       formData = new FormData();

  //       Object.keys(heroData).forEach(key => formData.append(key, heroData[key] == null ? "" : String(heroData[key])));
  //       formData.append('imageFile', imageFile);

  //       await axios.put(`${API_Poster}/update`, formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       });
  //     } else {
  //       // Update only text & URL
  //       await axios.put(`${API_Poster}/update`, heroData);
  //     }

  //     // Reload backend data for preview
  //     const refreshed = await axios.get(`${API_Poster}/`);
  //     if (refreshed.data.success && refreshed.data.data) {
  //       setHeroData(refreshed.data.data);

  //       if (refreshed.data.data.imageurl) {
  //         setPreviewUrl(`http://localhost:3500${refreshed.data.data.imageurl}`);
  //       }                                                        // Update preview from backend
  //       setImageFile(null); // Reset file
  //     }

  //     setMessage("Poster updated successfully!");
  //     setTimeout(() => setMessage(""), 3000);

  //   } catch (error) {
  //     console.log("Save error:", error);
  //     setMessage("Error while saving poster!");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

const handleSave = async () => {
  setIsLoading(true);
  try {

    if (imageFile) {
      // If user uploaded a file → call file upload function
      await uploadImageFile();
    } else {
      // If user updates only text or image URL
      await updateImageUrl();
    }

    // Refresh latest data from backend
    const refreshed = await axios.get(`${API_Poster}/`);
    if (refreshed.data.success && refreshed.data.data) {
      setHeroData(refreshed.data.data);

      if (refreshed.data.data.imageurl) {
        setPreviewUrl(`http://localhost:3500${refreshed.data.data.imageurl}`);
      }
    }

    setImageFile(null);
    setMessage("Poster updated successfully!");
    setTimeout(() => setMessage(""), 3000);

  } catch (err) {
    console.log("Save error:", err);
    setMessage("Error while saving poster!");
  } finally {
    setIsLoading(false);
  }
};

const uploadImageFile = async () => {
  const formData = new FormData();

  Object.keys(heroData).forEach(key =>
    formData.append(key, heroData[key] == null ? "" : String(heroData[key]))
  );

  formData.append("imageFile", imageFile);

  await axios.put(`${API_Poster}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
      imageurl: '',
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
                  value={heroData.originalprice??0}
                  onChange={handleInputChange}
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
                  onChange={handleImageUpload||speaker}
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