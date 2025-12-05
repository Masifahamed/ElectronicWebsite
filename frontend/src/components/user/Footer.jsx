import Qrcode from '../../assets/Qrcode.png'
import appstore from '../../assets/AppStore.png'
import goopleplay from '../../assets/GooglePlay.png'
import ScrollUp from './ScrollUp'
import logo from '../../assets/logo.png'
const Footer = () => {
    return (
        <footer className="w-full bg-black text-white relative  px-6 pt-5 grid sm:grid sm:items-center sm:justify-center">
            <div className="max-w-7xl mx-auto grid grid-cols-1 pt-3 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Logo + Email */}
                <div className="flex flex-col gap-4">
                   <img src={logo} alt="logo image" className='w-25 h-25' />
                    <p className="text-gray-300">Message is here</p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="border border-gray-400 bg-transparent rounded-sm p-2 text-sm focus:outline-none w-full sm:w-48"
                    />
                </div>

                {/* Support */}
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-2xl sm:text-3xl">Support</h1>
                    <p className="text-gray-300 text-sm">
                        111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.
                    </p>
                    <p className="text-gray-300 text-sm">exclusive@gmail.com</p>
                    <p className="text-gray-300 text-sm">+88015-88888-9999</p>
                </div>

                {/* Account */}
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-2xl sm:text-3xl">Account</h1>
                    <ul className="flex flex-col gap-2 text-gray-300 text-sm">
                        <li>My Account</li>
                        <li>Login / Register</li>
                        <li>Cart</li>
                        <li>Wishlist</li>
                        <li>Shop</li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-2xl sm:text-3xl">Quick Link</h1>
                    <ul className="flex flex-col gap-2 text-gray-300 text-sm">
                        <li>Privacy Policy</li>
                        <li>Terms of Use</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>
                </div>

                {/* Download App */}
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl sm:text-3xl">Download App</h1>
                    <p className="text-gray-300 text-sm">
                        Save $3 with App New User Only
                    </p>

                    <div className="flex items-center">
                        <img src={Qrcode} alt="QR code" className="h-20 w-20 object-contain" />
                        <div className="ms-3 flex flex-col gap-2">
                            <img src={goopleplay} alt="Google Play" className="h-8 rounded-sm" />
                            <img src={appstore} alt="App Store" className="h-8 rounded-sm" />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <i className="ri-instagram-line text-[28px] sm:text-[32px] hover:text-pink-500 transition-all"></i>
                        <i className="ri-facebook-fill text-[28px] sm:text-[32px] hover:text-blue-500 transition-all"></i>
                        <i className="ri-linkedin-box-fill text-[28px] sm:text-[32px] hover:text-blue-400 transition-all"></i>
                    </div>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="border-t border-gray-700  w-full py-3 text-center text-sm text-gray-400">
                © 2025 Your Company Name. All rights reserved.
            </div>
            <ScrollUp/>
        </footer>
    )
}

export default Footer
