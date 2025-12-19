import { useNavigate } from "react-router-dom";
import speakerurl from '../assets/speaker.png'

export const textgradient="pb-3 text-4xl md:text-5xl lg:text-6xl font-pop font-bold bg-gradient-to-r from-[#1600A0] to-[#9B77E7] bg-clip-text text-transparent"

export const backend ="https://electronicwebsite-backend.onrender.com"

export const speaker={
  speakerimage:speakerurl
}

export const products = [
        {
            _id: 1,
            name: "MacBook Pro M2",
            price: 1299,
            discount: 15,
            originalPrice: 1529,
            rating: 4.8,
            reviews: 124,
            likes: 89,
            views: 234,
            imageurl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
        {
            _id: 2,
            name: "Dell XPS 13",
            price: 999,
            discount: 20,
            originalPrice: 1249,
            rating: 4.6,
            reviews: 89,
            likes: 67,
            views: 189,
            imageurl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
        {
            _id: 3,
            name: "HP Spectre x360",
            price: 1199,
            discount: 12,
            originalPrice: 1369,
            rating: 4.7,
            reviews: 156,
            likes: 112,
            views: 298,
            imageurl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
        {
            _id: 4,
            name: "Lenovo ThinkPad",
            price: 899,
            discount: 25,
            originalPrice: 1199,
            rating: 4.5,
            reviews: 203,
            likes: 145,
            views: 367,
            imageurl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
        {
            _id: 5,
            name: "ASUS ROG Zephyrus",
            price: 1599,
            discount: 18,
            originalPrice: 1949,
            rating: 4.9,
            reviews: 78,
            likes: 93,
            views: 156,
            imageurl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
        {
            _id: 6,
            name: "Microsoft Surface",
            price: 1099,
            discount: 10,
            originalPrice: 1221,
            rating: 3,
            reviews: 167,
            likes: 78,
            views: 245,
            imageurl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            isLiked: false
        },
    ];

 export const allProducts = [
  { id: 1, name: "MacBook Pro M3", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697301324726", price: 1899, rating: 4.8, category: "Laptop" },
  { id: 2, name: "iPhone 15 Pro", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15pro-blue-titanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009276794", price: 1199, rating: 4.9, category: "Smartphone" },
  { id: 3, name: "Sony WH-1000XM5 Headphones", image: "https://cdn.mos.cms.futurecdn.net/jAmK7AGoJfrQnG5Q8UvPob.jpg", price: 399, rating: 4.7, category: "Headphones" },
  { id: 4, name: "Canon EOS R7 Mirrorless Camera", image: "https://cdn.mos.cms.futurecdn.net/3D9gZ8WejJQ5PzKmWz3X5b.jpg", price: 1499, rating: 4.6, category: "Camera" },
  { id: 5, name: "Samsung Galaxy Watch 6", image: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-r930nzaains/gallery/in-galaxy-watch6-sm-r930nzaains-537688308?$1300_1038_PNG$", price: 349, rating: 4.5, category: "Smartwatch" },
  { id: 6, name: "PlayStation 5 Console", image: "https://cdn.mos.cms.futurecdn.net/iFJVRsgPjYrvZtRnqY55QF.jpg", price: 499, rating: 4.9, category: "Gaming" },
];

// utils/initAdmin.js
export const initializeDefaultAdmin = () => {
  try {
    // Check if admin already exists in separate admin storage
    const existingAdminToken = localStorage.getItem('admin_authToken');
    const existingAdminUser = localStorage.getItem('admin_user');
    
    // If admin doesn't exist, create static admin
    if (!existingAdminToken || !existingAdminUser) {
      const staticAdmin = {
        id: 1,
        name: 'Administrator',
        email: 'admin@example.com',
        password: 'admin123', // This won't be stored in localStorage for security
        role: 'admin',
        type: 'admin',
        registrationDate: new Date().toISOString()
      };
      
      // Store admin in separate admin storage (not in registeredUsers)
      localStorage.setItem('admin_authToken', 'admin-static-token');
      localStorage.setItem('admin_user', JSON.stringify(staticAdmin));
      
      console.log('✅ Static admin created: admin@example.com / admin123');
    }

    // Check if demo user exists in separate user storage
    const existingUserToken = localStorage.getItem('user_authToken');
    const existingUserData = localStorage.getItem('user_user');
    
    // If demo user doesn't exist, create static demo user
    if (!existingUserToken || !existingUserData) {
      const demoUser = {
        id: 2,
        name: 'Demo User',
        email: 'user@example.com',
        password: 'user123', // This won't be stored in localStorage for security
        phone: '+1234567890',
        role: 'user',
        type: 'user',
        registrationDate: new Date().toISOString()
      };
      
      // Store demo user in separate user storage
      localStorage.setItem('user_authToken', 'user-static-token');
      localStorage.setItem('user_user', JSON.stringify(demoUser));
      
      console.log('✅ Demo user created: user@example.com / user123');
    }

    console.log('🎯 Authentication system ready!');
    console.log('👑 Admin: admin@example.com / admin123');
    console.log('👤 User: user@example.com / user123');

  } catch (error) {
    console.error('❌ Error initializing users:', error);
  }
};


 export const getimagesrc = (imageurl) => {
        if (!imageurl) return "/no-image.png"
        if (imageurl.startsWith("http")) {
            return imageurl
        }
        return `${backend}${imageurl}`
    }

// Call this in your main App.js component
// initializeDefaultAdmin();

// // Auth Check Component - Redirects based on authentication
// export const AuthRedirect = () => {
//   const navigate = useNavigate()
  
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || 'null')
//     const token = localStorage.getItem('authToken')
    
//     if (token && user) {
//       // User is logged in, redirect based on role
//       if (user.role === 'admin') {
//         navigate('/adminpage')
//       } else {
//         navigate('/')
//       }
//     } else {
//       // User is not logged in, redirect to login
//       navigate('/auth/login')
//     }
//   }, [navigate])
  
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//     </div>
//   )
// }
