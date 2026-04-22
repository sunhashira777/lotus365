import React from 'react';
import PropTypes from 'prop-types';

const BlueBtn = ({ text, size, disabled, onClick, css }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        bet-btn flex flex-col items-center justify-center gap-[6px]
        w-[58px] h-[50px] rounded-[10px] border border-[#cce7ff]
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${css}
      `}
      style={{
        background:
          'linear-gradient(278.15deg, #cfdce9 45.25%, #d1e9ff 139.37%)',
      }}
    >
      <span className="text-12 font-bold sm:font-semibold leading-none">
        {text}
      </span>

      {size && <span className="text-[9px] truncate leading-none">{size}</span>}
    </button>
  );
};

BlueBtn.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
  css: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default BlueBtn;
