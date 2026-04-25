import React from 'react';
import PropTypes from 'prop-types';

const PinkBtn = ({ text, size, disabled, onClick, css }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        bet-btn flex flex-col items-center justify-center gap-[6px]
        w-[45px] h-[50px] rounded-[10px] font-semibold
          border border-gray-200
          shadow-sm
 bg-pink-btn-gradient first-letter:
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${css}
      `}
    >
      <span className="text-12 font-bold sm:font-semibold leading-none">
        {text}
      </span>

      {size && <span className="text-[9px] leading-none truncate">{size}</span>}
    </button>
  );
};

PinkBtn.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
  css: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default PinkBtn;
