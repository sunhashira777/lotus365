import PropTypes from 'prop-types';
import React from 'react';

const BlankBtn = ({ css }) => {
  return (
    <button
      className={`bet-btn ${css}  w-[45px] h-[50px] rounded-[10px] border border-[#cce7ff] `}
    >
      -
    </button>
  );
};
BlankBtn.propTypes = {
  css: PropTypes.string,
};
export default BlankBtn;
