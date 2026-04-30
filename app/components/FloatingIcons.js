import { MessageCircle, Eye, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const FloatingIcons = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // show button after scrolling 200px
      if (window.scrollY > 200) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* LEFT SIDE (Support / Games) */}
      <div className="fixed   bottom-6 left-2 z-[9999] flex flex-col gap-3">
        {/* Games */}
        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-md cursor-pointer sm:hidden ">
          🎮
        </div>

        {/* Support */}
        <div className="rounded-full shadow-md cursor-pointer">
          <img src="/images/support.webp" alt="message" className="w-16" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="fixed bottom-6 right-2 z-[9999] flex flex-col gap-3">
        {/* Scroll Top */}
        {show && (
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-36 right-2 z-[9999] 
        w-12 h-12 rounded-full bg-[#1e8067] 
        flex items-center justify-center text-white 
        shadow-md cursor-pointer hover:scale-110 transition"
          >
            <ChevronUp size={20} />
          </div>
        )}

        {/* Eye */}
        <div className="w-12 h-12 rounded-full bg-[#1e8067] flex items-center justify-center text-white shadow-md cursor-pointer">
          <Eye size={20} />
        </div>

        {/* Support / Chat */}
        <div className="w-12 h-12 rounded-full bg-[#1e8067] flex items-center justify-center text-white shadow-md cursor-pointer">
          <img src="/images/message.webp" alt="message" className="w-4" />
        </div>
      </div>
    </>
  );
};

export default FloatingIcons;
