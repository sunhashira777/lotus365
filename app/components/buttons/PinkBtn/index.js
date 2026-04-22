import React from 'react';
import PropTypes from 'prop-types';

const PinkBtn = ({ text, size, disabled, onClick, css }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        bet-btn flex flex-col items-center justify-center gap-[6px]
        w-[58px] h-[50px] rounded-[10px] border border-[#f5b5c3]
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${css}
      `}
      style={{
        background:
          'linear-gradient(278.15deg, #f8cdd6 45.25%, #ffd6df 139.37%)',
      }}
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
