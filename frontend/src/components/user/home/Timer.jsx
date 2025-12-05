import React from 'react'
import { useEffect, useState } from 'react';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 34,
        seconds: 56
    });

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const newSeconds = prev.seconds - 1;
                if (newSeconds < 0) {
                    const newMinutes = prev.minutes - 1;
                    if (newMinutes < 0) {
                        const newHours = prev.hours - 1;
                        if (newHours < 0) {
                            clearInterval(timer);
                            return { hours: 0, minutes: 0, seconds: 0 };
                        }
                        return { hours: newHours, minutes: 59, seconds: 59 };
                    }
                    return { ...prev, minutes: newMinutes, seconds: 59 };
                }
                return { ...prev, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div className="p-6 min-w-[280px]">
                <div className="flex justify-center space-x-4">
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white rounded-lg py-3 px-4 min-w-[60px]">
                            <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-sm text-gray-600 mt-2 block">Hours</span>
                    </div>
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white rounded-lg py-3 px-4 min-w-[60px]">
                            <span className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-sm text-gray-600 mt-2 block">Minutes</span>
                    </div>
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white rounded-lg py-3 px-4 min-w-[60px]">
                            <span className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-sm text-gray-600 mt-2 block">Seconds</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Timer