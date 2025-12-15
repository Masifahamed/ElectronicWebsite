import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  //  HANDLE CHANGE 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error on input
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  // FORM VALIDATION 
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first.trim()) newErrors.first = "First name is required";
    if (!formData.last.trim()) newErrors.last = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be 6+ characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Please accept the terms & conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  // HANDLE SUBMIT 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
    
      const bodyData = {
        first: formData.first,
        last: formData.last,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      const res = await fetch("http://localhost:3500/api/user/newuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.message || "Registration failed" });
        return;
      }

      console.log("User created:", data);
    alert("Account created successfully go to login page and register")
      navigate("/auth/login", {
        state: {
          message: "Account created successfully! Please login.",
          registeredEmail: formData.email
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Something went wrong. Try again." });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us today and get started
          </p>
        </div>

        {/* FORM */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-4">
            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                  <input
                    name="first"
                    type="text"
                    value={formData.first}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${errors.first ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="First name"
                  />
                </div>

                {errors.first && <p className="text-red-600 text-sm">{errors.first}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>

                <input
                  name="last"
                  type="text"
                  value={formData.last}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border rounded-lg ${errors.last ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Last name"
                />
                {errors.last && <p className="text-red-600 text-sm">{errors.last}</p>}
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your email"
                />
              </div>

              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your phone"
                />
              </div>

              {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <a className="text-blue-600">Terms & Conditions</a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-600 text-sm">{errors.acceptTerms}</p>
          )}

          {/* SUBMIT ERROR */}
          {errors.submit && (
            <div className="bg-red-100 p-3 rounded text-red-700">
              {errors.submit}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
