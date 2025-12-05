import React, { useEffect, useState } from 'react';

const ScrollUp = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShowButton(window.scrollY > 200); // show after 200px scroll
        };
        
        window.addEventListener('scroll', onScroll);
        onScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button 
            onClick={scrollToTop} 
            aria-label='Scroll to top' 
            className={`fixed right-5 bottom-5 z-50 flex items-center justify-center p-3 rounded-full transition-all duration-300 hover:scale-110  shadow-lg ${
                showButton 
                    ? 'opacity-100  translate-y-0' 
                    : 'opacity-0 translate-y-10'
            }`}
            title='Scroll to Top'
        >
            {/* Visual circular background and icon */}
            <span className='bg-gradient-to-r from-[#1600A0] to-[#9B77E7] rounded-full p-2 shadow-sm flex items-center justify-center'>
                <i className='ri-arrow-up-line text-2xl text-white' />
            </span>
        </button>
    );
};

export default ScrollUp;