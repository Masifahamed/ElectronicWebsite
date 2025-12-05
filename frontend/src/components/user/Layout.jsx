import React from 'react'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import ScrollUp from '../../components/user/ScrollUp'

const Layout = ({ children }) => {
    return (
        <div className='relative min-h-screen flex flex-col'>
            {/* Header/Navigation */}
            <Navbar />
            
            {/* Main content - grows to fill space */}
            <main className="flex-grow">
                {children}
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Scroll Up */}
            <ScrollUp/>
        </div>
    )
}

export default Layout