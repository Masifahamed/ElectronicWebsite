import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './WithAuth';
import SuccessPopup from '../../components/user/SuccessPopup'
import { backend } from '../../ultis/constant';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
const[popupMessage,setPopupMessage]=useState("")
const[showPopup,setShowPopup]=useState(false)

const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 const payload={
  email:formData.email.trim().toLocaleLowerCase(),
  password:formData.password.trim()
 }
    try {
      const res = await axios.post(
        `${backend}/api/login/checklogin`,
       payload,{
        headers:{
          "Content-Type":"application/json"
        }
       }
      );
      // Backend Response
      const { token, user, message } = res.data;
      //console.log(user,"good masif ahamed jknfsjfns kjncjscsjjbcs")
      //console.log(token)
      // Save login details
    
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      
      // ADMIN LOGIN
      if (user.role ==="admin") {
      setPopupMessage("welcome admin masif"||(`${user.first}`))
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
           navigate("/adminpage",{replace:true});
        }, 1500);
       
      }else{
              // NORMAL USER LOGIN
              setPopupMessage(`${user.name},${message}`)
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
           navigate("/",{replace:true});
      }, 1500);
    
      }
     } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                flex items-center justify-center 
                px-3 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg 
               bg-white rounded-xl sm:rounded-2xl 
               shadow-lg sm:shadow-xl 
               p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl 
                     font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">Sign in to your account</p>
        </div>

        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 
                             h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-9 sm:pl-10 pr-3 
                          py-2.5 sm:py-3 
                          text-sm sm:text-base 
                          border rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> :
                                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm sm:text-sm mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && <div className="bg-red-100 p-3 rounded text-red-700 text-xs sm:text-sm">{errors.submit}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-blue-600 hover:text-blue-500">
              Sign up here
            </Link>
          </p>
        </form>
      </motion.div>

      {
        showPopup&&(
          <SuccessPopup title={popupMessage} bgcolor='success'/>
        )
      }
    </div>
  );
};

export default Login;

