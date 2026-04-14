import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import { valueFormatter } from '@/utils/marketFormaterHelpers';
import clsx from 'clsx';
import { IoLockClosedOutline } from 'react-icons/io5';
import { isLoggedIn } from '@/utils/apiHandlers';
import { useDispatch } from 'react-redux';
import { openModal } from '@/redux/Slices/modalSlice';
const OddButton = ({
  context,
  marketId,
  runnersData,
  oddsCount,
  type,
  price,
  size = '',
  position = 3,
  className,
  disabled,
  isSelected = false,
  onClick = () => {},
}) => {
  const isLogin = isLoggedIn();
  const dispatch = useDispatch();

  const selectionId = runnersData?.selectionId;
  const runnerId = runnersData?.runnerId;

  const uniqueId =
    selectionId ??
    (runnerId && marketId ? `${runnerId}:${marketId}` : undefined);

  const isEmpty = price === 0 || price === '0' || price === '' || !price;
  const displayPrice = isEmpty ? undefined : Number(price);
  const displaySize = size ? valueFormatter.format(Number(size)) : '';

  const prevPriceMapRef = useRef({});
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!uniqueId) return;
    if (displayPrice == null) return;
    if (context === 'outer') return;

    const prevPrice = prevPriceMapRef.current[uniqueId];

    if (prevPrice == null) {
      prevPriceMapRef.current[uniqueId] = displayPrice;
      return;
    }

    if (prevPrice !== displayPrice) {
      buttonRef.current?.classList.add('!bg-yellow-300');

      setTimeout(() => {
        buttonRef.current?.classList.remove('!bg-yellow-300');
      }, 400);
    }

    prevPriceMapRef.current[uniqueId] = displayPrice;
  }, [displayPrice, uniqueId, context]);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      onClick={() => {
        if (!isLogin) {
          dispatch(openModal('login'));
          return;
        }

        onClick(); // your original click logic
      }}
      className={clsx(
        'border-b border-[#ddd] bet-btn flex flex-col items-center justify-center gap-[6px] ',

        {
          [type === 'back' ? 'bg-[#a7d8fd] ' : 'bg-odd-pink-100']:
            position === 3,
          [type === 'back' ? 'bg-[#a7d8fd]  ' : 'bg-odd-pink-300']:
            position === 2,
          [type === 'back' ? 'bg-[#a7d8fd]' : 'bg-odd-pink-500']:
            position === 1,
        },

        { 'flex-col': displaySize },

        oddsCount === 1 ? 'w-[140px]' : 'w-[55px] xs:w-[55px]',

        'transition-all duration-200 ease-in-out',
        'hover:scale-105 hover:shadow-lg',
        'active:scale-95',

        'border-2 border-transparent',
        'hover:border-white/40',

        'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent',

        {
          'border-white shadow-lg scale-105': isSelected,
          'hover:brightness-110': !isSelected && !disabled,
        },

        {
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        },

        className,
      )}
    >
      {isEmpty ? (
        <IoLockClosedOutline />
      ) : (
        <>
          <span className="text-12 font-semibold leading-none">
            {displayPrice}
          </span>
          <span className="text-[9px] truncate leading-none">
            {displaySize}
          </span>
        </>
      )}
    </button>
  );
};
OddButton.propTypes = {
  context: PropTypes.string,

  marketId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  runnersData: PropTypes.shape({
    selectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    runnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),

  oddsCount: PropTypes.number,

  type: PropTypes.oneOf(['back', 'lay']), // important validation

  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  position: PropTypes.number,

  className: PropTypes.string,

  disabled: PropTypes.bool,

  isSelected: PropTypes.bool,

  onClick: PropTypes.func,
};
export default OddButton;
