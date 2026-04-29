import React from 'react';
import PropTypes from 'prop-types';

const CasinoIframe = ({ iframeHtml, onBack, topOffset }) => {
  if (!iframeHtml) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-2 left-2 z-[10000] bg-yellow-400 px-3 py-1 rounded font-bold"
      >
        ← Back
      </button>

      {/* Iframe */}
      <iframe
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        srcDoc={iframeHtml}
        allowFullScreen
        title="Casino Game"
        className="w-full h-full border-0 block"
      />
    </div>
  );
};

CasinoIframe.propTypes = {
  iframeHtml: PropTypes.string,
  onBack: PropTypes.func,
  topOffset: PropTypes.string,
};

export default CasinoIframe;
