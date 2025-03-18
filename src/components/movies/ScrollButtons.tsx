'use client';

import React, { useEffect, useRef } from 'react';
import styles from './ScrollButtons.module.css';

interface ScrollButtonsProps {
    containerId: string;
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({ containerId }) => {
    const [isScrolling, setIsScrolling] = React.useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Apply the scroll transition class to the container when component mounts
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add(styles['scroll-transition']);
        }

        return () => {
            // Clean up when component unmounts
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [containerId]);

    const handleScrollAnimation = (direction: 'left' | 'right') => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Calculate scroll distance based on container width for more natural scrolling
        const scrollDistance = Math.min(container.clientWidth * 0.8, 500);
        const scrollAmount = direction === 'left' ? -scrollDistance : scrollDistance;

        // Add animation class
        setIsScrolling(true);
        container.classList.add(styles['scrolling-active']);

        // Perform the scroll with enhanced easing
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        // Remove animation class after animation completes
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            container.classList.remove(styles['scrolling-active']);
            setIsScrolling(false);
        }, 500);
    };

    const handleScrollLeft = () => handleScrollAnimation('left');
    const handleScrollRight = () => handleScrollAnimation('right');

    return (
        <>
            {/* Left scroll button */}
            <button
                onClick={handleScrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none"
                aria-label="Scroll left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Right scroll button */}
            <button
                onClick={handleScrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none"
                aria-label="Scroll right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </>
    );
};

export default ScrollButtons;