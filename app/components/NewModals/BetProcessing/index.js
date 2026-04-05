import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { PropTypes } from 'prop-types';
import { getImage } from '@/utils/imagekit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 640,
  width: '100%',
  bgcolor: '#0f2327',
  outline: 'none',
  p: 0,
  borderRadius: '10px',
};

export default function BetProcessing({ isOpen }) {
  const [seconds, setSeconds] = React.useState(6);

  // ✅ Reset when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSeconds(6);
    }
  }, [isOpen]);

  // ✅ Countdown logic (clean interval)
  React.useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box sx={style}>
        <div className="bg-white hide-scrollbar p-6 flex flex-col items-center gap-4">
          <h2 className="text-16 font-bold text-center">
            Your Bet Is Being Processed <br />
            Please Wait... {seconds}
          </h2>

          <img
            src={getImage('/images/timer.gif')}
            className="w-12 h-12 lg:h-16 lg:w-16"
            alt="timer"
          />
        </div>
      </Box>
    </Modal>
  );
}

BetProcessing.propTypes = {
  isOpen: PropTypes.bool,
};
