import React, { useEffect, useState } from "react";
import axios from "axios";


const SampleData = () => {
    const [productdata, setProductdata] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get("https://fakestoreapi.com/products")
                setLoading(true)
                setProductdata(res.data)
            } catch (err) {
                console.log(err.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
        fetchdata()
    }, [])

    if (loading) {
            return (
                <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-400 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12  border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            )
        }


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
                Product Details
            </h1>
            <div className="flex gap-6 justify-center items-center">
                <div className="bg-white rounded-lg shadow-md px-15 py-10 flex items-center justify-center m-10">
                    <p className="text-orange-400 font-bold text-[20px]"><span className="text-black">Total Item:</span> {productdata.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md px-15 py-10 flex items-center justify-center m-10">
                    <p className="text-orange-400 font-bold text-[20px]"><span className="text-black">Total Price:</span> {productdata.reduce((a, b) => a + b.price, 0).toLocaleString("en-IN")}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productdata.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition pb-5"
                    >
                        {/* Image */}
                        <div className="h-56 bg-gray-100 flex items-center justify-center p-4">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full object-contain"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                                {item.title}
                            </h2>

                            <p className="text-xs text-gray-500 capitalize mt-1">
                                {item.category}
                            </p>

                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                {item.description}
                            </p>

                            {/* Price & Rating */}
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{item.price}
                                </span>

                                <div className="text-sm text-yellow-500">
                                    ⭐ {item.rating?.rate}
                                    <span className="text-gray-500 ml-1">
                                        ({item.rating?.count})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => window.print()}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
                Download PDF
            </button>

        </div>
    );
};

export default SampleData;
