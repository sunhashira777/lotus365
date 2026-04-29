import { MessageCircle, Eye, ChevronUp } from 'lucide-react';
import React from 'react';
const FloatingIcons = () => {
  return (
    <>
      {/* LEFT SIDE (Support / Games) */}
      <div className="fixed   bottom-6 left-2 z-[9999] flex flex-col gap-3">
        {/* Games */}
        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-md cursor-pointer sm:hidden ">
          🎮
        </div>

        {/* Support */}
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md cursor-pointer">
          <MessageCircle size={20} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="fixed bottom-6 right-2 z-[9999] flex flex-col gap-3">
        {/* Scroll Top */}
        {/* <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md cursor-pointer"
        >
          <ChevronUp size={20} />
        </div> */}

        {/* Eye */}
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md cursor-pointer">
          <Eye size={20} />
        </div>

        {/* Support / Chat */}
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-md cursor-pointer">
          <MessageCircle size={20} />
        </div>
      </div>
    </>
  );
};

export default FloatingIcons;
