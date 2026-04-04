import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGetFancyProfitLossQuery } from '@/api/booksetApi';
import { reactIcons } from '@/utils/icons';

const BookListModal = ({ open, onClose, selectionId }) => {
  const { eventId } = useParams();

  const queryParams = useMemo(() => {
    return {
      eventId: Number(eventId),
      selectionId: selectionId ? String(selectionId) : '',
    };
  }, [eventId, selectionId]);

  const { data, isLoading, error } = useGetFancyProfitLossQuery(queryParams, {
    skip: !open,
  });

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] opacity-100"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed z-[1000] top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-green-600">
          <h2 className="text-2xl font-bold text-white">BOOK LIST</h2>
          <button onClick={onClose} className="text-xl hover:text-red-500">
            {reactIcons.close}
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-primary-dark text-modal-text">
                <th className="p-2 px-4">Runner Name</th>
                <th className="p-2">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="p-3 text-center" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td
                    colSpan={2}
                    className="p-3 text-center text-red-400 font-semibold"
                  >
                    Failed to fetch data
                  </td>
                </tr>
              )}

              {Array.isArray(data) &&
                data.map((item, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? 'bg-gray-200' : ''
                    } border-b text-black border-gray-800`}
                  >
                    <td className="p-3 capitalize pl-5">{item.position}</td>

                    <td
                      className={`p-3 font-semibold ${
                        item?.profit_or_loss < 0
                          ? 'text-red-400'
                          : item?.profit_or_loss > 0
                          ? 'text-green-600'
                          : ''
                      }`}
                    >
                      {Number(item?.profit_or_loss || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>,
    document.body,
  );
};
BookListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default React.memo(BookListModal);
