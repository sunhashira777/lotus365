/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { reactIcons } from '@/utils/icons';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { isYupError, parseYupError } from '@/utils/Yup';
import { amountValidation, depositValidation } from '@/utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { init } from '@/redux/actions';
import toast from 'react-hot-toast';
import { Download, Share2, Maximize2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import DepositEditStake from '@/components/NewModals/DepositEditStake';
import { getImage } from '@/utils/imagekit';
const rules = [
  '1. Deposit money only in the selected account to get the fastest credits and avoid possible delays.',
  '2. Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.',
  '3. We is not responsible for money deposited to Old, Inactive or Closed accounts.',
  '4. After deposit, add your UTR and amount to receive balance.',
  '5. NEFT receiving time varies from 40 minutes to 2 hours.',
];
const Deposit = () => {
  const [openEditStake, setOpenEditStake] = useState(false);
  const [stakebutton, setStakeButton] = useState([
    { text: '100', value: 100 },
    { text: '200', value: 200 },
    { text: '500', value: 500 },
    { text: '1000', value: 1000 },
  ]);
  const [paymentStep, setPaymentStep] = useState(1);
  // eslint-disable-next-line
  const [depositListData, setDepositListData] = useState([]);
  const [bankData, setBankData] = useState({});
  const [upiData, setUpiData] = useState({});
  const [selectedImage, setSelectedImage] = useState({});
  const [qrType, setQrType] = useState('');
  const dispatch = useDispatch();
  const User = useSelector((state) => state?.user?.profile);
  const login = isLoggedIn();
  // eslint-disable-next-line
  const [page, setPage] = useState(1);
  const take = 15;
  // eslint-disable-next-line
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });

  useEffect(() => {
    dispatch(init());
  }, [dispatch, login]);

  useEffect(() => {
    if (User?.id) {
      handleChange({
        target: { name: 'userId', value: User?.id },
      });
    }
  }, [User?.id, selectedImage]);

  const [form, setForm] = useState({
    paymentMethod: 'account',
    utr: '',
    img: '', // filename (backend)
    previewUrl: '', // UI
    amount: '',
    condition: false,
  });
  const [formError, setFormError] = useState({
    paymentMethod: '',
    utr: '',
    img: '',
    amount: '',
    condition: false,
  });

  const paymentList = [
    {
      text: 'Bank of Maharashtra',
      icon: '/images/deposit/bankOfMaha.png',
      value: 'account',
    },
    { text: 'Google Pay', icon: '/images/deposit/gpay.png', value: 'G-Pay' },
    { text: 'Paytm', icon: '/images/deposit/paytm.png', value: 'Paytm' },
  ];
  // eslint-disable-next-line
  const accountDetails =
    form?.paymentMethod === 'account'
      ? bankData?.bankName &&
        bankData?.acountholdername &&
        bankData?.accountNumber &&
        bankData?.ifscCode &&
        bankData?.accountType
        ? [
            {
              text: `Bank : ${bankData?.bankName}`,
              copy: bankData?.bankName,
            },

            {
              text: `A/c Holder Name : ${bankData?.acountholdername}`,
              copy: bankData?.acountholdername,
            },
            {
              text: `A/c No. : ${bankData?.accountNumber}`,
              copy: bankData?.accountNumber,
            },

            {
              text: `IFSC Code : ${bankData?.ifscCode}`,
              copy: bankData?.ifscCode,
            },
            {
              text: `A/c Type : ${bankData?.accountType}`,
              copy: bankData?.accountType,
            },
          ]
        : []
      : upiData?.upi
      ? [{ text: `Upi Id : ${upiData?.upi}`, copy: `${upiData?.upi}` }]
      : [];

  useEffect(() => {
    getDepositList();
    getBankAndUpi(); //
  }, [take, page]);

  const getFullImageUrl = async (img) => {
    if (!img) return '';

    if (img.startsWith('http')) return img;

    return await getAuthData(`/storage/${img}`);
  };
  const getDepositList = async () => {
    const islogin = isLoggedIn();
    if (!islogin) return;

    try {
      const response = await getAuthData(
        `/banker/my-deposit-withdraw?page=${page}&limit=${take}&type=Credit&status=Pending&isUpi=true&isBank=true`,
      );

      if (response?.status === 200 || response?.status === 201) {
        const list = response?.data?.data || [];

        // ✅ MAP DATA FOR UI (IMPORTANT 🔥)
        const formattedData = list.map(async (item) => ({
          id: item.id,
          amount: item.amount,
          status: item.status,
          utr: item.transactionCode,
          image: await getFullImageUrl(item.image),
          createdAt: item.createdAt,

          // ✅ Detect payment type
          paymentType: item.upiId ? 'UPI' : 'BANK',

          // ✅ UPI details
          upiId: item?.upi?.upiId || '',

          // ✅ Bank details (future safe)
          bankName: item?.bank?.bankName || '',
        }));

        setDepositListData(formattedData);

        setPagination({
          totalCount: response?.data?.pagination?.totalItems || 0,
        });
      }
    } catch (error) {
      console.error('Deposit List Error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch deposit list',
      );
    }
  };

  const getBankAndUpi = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData('/banker/show-account');

        if (response?.status === 200 || response?.status === 201) {
          const bank = response?.data?.bank?.[0] || {};
          const upi = response?.data?.upi?.[0] || {};

          // ✅ MAP ACCORDING TO OLD STRUCTURE (IMPORTANT)
          setBankData({
            id: bank?.id,
            bankName: bank?.bankName,
            accountNumber: bank?.accountNumber,
            ifscCode: bank?.ifsc,
            acountholdername: bank?.accountHolder,
            accountType: bank?.accountType,
          });

          setUpiData({
            upi: upi?.upiId,
            id: upi?.id,
            image: upi?.qrCode,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const copieBtn = async (e) => {
    toast.success(e + ' Copied!!');
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!validImageTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG files are allowed');
      event.target.value = '';
      setSelectedImage(null);
      return;
    }

    try {
      setSelectedImage(file);

      const formData = new FormData();
      formData.append('file', file);

      const res = await postAuthData('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.status && res?.data?.meta?.filename) {
        setForm((prev) => ({
          ...prev,
          img: res.data.meta.filename, // ✅ backend ke liye
          previewUrl: res.data.url, // ✅ UI ke liye
        }));

        setFormError((prev) => ({ ...prev, img: '' }));

        toast.success('Image uploaded successfully ✅');
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Image upload failed';

      toast.error(errorMessage);

      setSelectedImage(null);
      event.target.value = '';
    }
  };

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    if (name === 'amount' && value < 0) {
      updatedValue = 0;
    }
    setForm((prevCredential) => ({
      ...prevCredential,
      [name]: updatedValue,
    }));
    setFormError((prevFormError) => ({
      ...prevFormError,
      [name]: '',
    }));
  };

  const handleButtonClick = (index, type, value) => {
    setQrType(value);
  };

  const handleAmountSubmit = async () => {
    try {
      await amountValidation.validate(form, {
        abortEarly: false,
      });
      setPaymentStep(2);
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        toast.error(error?.message || 'Unauthorised');
      }
    }
  };
  const [isLoading, setLoading] = useState(false);
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setFormError({});

      await depositValidation.validate(form, {
        abortEarly: false,
      });

      if (!form.condition) return;

      // ✅ COMMON PAYLOAD
      const payload = {
        type: 'Credit',
        amount: Number(form.amount),
        UTR: form.utr,
        image: form.img, // ✅ filename
      };

      let response;

      // ✅ DYNAMIC API CALL
      if (form.paymentMethod === 'account') {
        response = await postAuthData('/bank/deposit-withdraw-request', {
          ...payload,
          bankId: Number(bankData?.id), // ✅ dynamic
        });
      } else {
        response = await postAuthData('/upi/deposit-withdraw-request', {
          ...payload,
          UPI: Number(upiData?.id), // ✅ dynamic
        });
      }

      if (response?.status === 200 || response?.status === 201) {
        toast.success('Deposit Request Sent Successfully ✅');

        setForm({
          paymentMethod: 'account',
          utr: '',
          img: '',
          previewUrl: '',
          amount: '',
          condition: false,
        });

        setPaymentStep(1);
        getDepositList();
        setSelectedImage(null);

        document.getElementById('file').value = '';
      } else {
        throw new Error(response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        const msg =
          error?.response?.data?.message || error?.message || 'Deposit failed';

        if (msg.includes('UTR')) {
          toast.error('⚠️ UTR already used. Try another.');
        } else {
          toast.error(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const localStakeData = JSON.parse(localStorage.getItem('localStakeData'));
    if (localStakeData && Array.isArray(localStakeData)) {
      setStakeButton(localStakeData);
    }
  }, [openEditStake]);

  return (
    <>
      <div className="min-h-screen mx-1 md:mx-0 py-5">
        {paymentStep === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
            <div className="px-12 py-9 hidden lg:block shadow-sm lg:shadow-[-1px_1px_10px_#383838]">
              <h1 className="hidden lg:flex text-[29px] font-bold text-black">
                Deposit
              </h1>

              <div className="flex flex-col max-w-[270px] p-5">
                <h2 className="text-[#40424f] text-18 font-bold ">Notes</h2>
                <img src={getImage('/images/deposit/1.png')} alt="" />
                <img
                  src={getImage('/images/deposit/2.png')}
                  className="mb-4"
                  alt=""
                />
                <img src={getImage('/images/deposit/3.png')} alt="" />
              </div>
            </div>
            <div className="lg:px-12 lg:py-10 p-2 shadow-sm lg:shadow-[1px_1px_10px_#383838] ">
              <div>
                <div className=" flex flex-col gap-2">
                  <div className="lg:hidden flex items-center justify-between">
                    <h1 className=" text-14 md:text-16 font-bold text-black">
                      Deposit Amount
                    </h1>
                    <div className="border-black border-2 p-1 rounded-md w-fit mt-2">
                      <p className="text-12 font-semibold leading-none">
                        Min: 100 | Max: 10000000
                      </p>
                    </div>
                  </div>
                  <label
                    htmlFor="amount"
                    className="text-18 font-bold lg:block hidden"
                  >
                    Amount*
                  </label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="border border-black rounded-md outline-none text-14 py-2 px-5"
                  />
                  {formError.amount && (
                    <div className="form-eror xl:text-16 text-14">
                      {formError.amount ==
                      'amount must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
                        ? 'Please Enter Amount'
                        : formError.amount}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block border-black border-2 p-1 rounded-md w-fit mt-2">
                  <p className="text-12 font-semibold leading-none">
                    Min: 100 | Max: 10000000
                  </p>
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-3 gap-2   p-[15px]">
                  {stakebutton.map((item, index) => (
                    <button
                      key={index}
                      className="col-span-1 font-bold text-black h-[26px] lg:w-[75px] shadow-[2px_2px_#00000040] rounded-md flex-center bg-[#70cfb6]  text-[11px]"
                      onClick={() => {
                        handleChange({
                          target: { name: 'amount', value: item.value },
                        });
                      }}
                    >
                      + {item.text}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenEditStake(true)}
                    className="bg-primary-1300 text-14 h-[35px] flex-center gap-1 rounded-[4px] w-full text-white shadow-[2px_2px_#00000040]"
                  >
                    <span>{reactIcons.editNew}</span>
                    Edit Stake
                  </button>
                  <button
                    onClick={handleAmountSubmit}
                    className="bg-primary-1300 text-14 h-[35px] flex-center rounded-[4px] w-full text-white shadow-[2px_2px_#00000040]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
            <div className="hidden lg:block px-12 py-9 shadow-sm lg:shadow-[-1px_1px_10px_#383838]">
              <h1 className="text-[29px] font-bold text-black mb-4">Deposit</h1>
              {form?.paymentMethod === 'account' ? (
                <div className="p-5 border-2 border-dashed border-[#1e8067] rounded-[5px]">
                  <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                    <div className="flex items-center font-semibold">
                      <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                        Bank Name
                      </p>
                      <p className=" text-black  text-12 whitespace-nowrap">
                        : {bankData?.bankName}
                      </p>
                    </div>
                    <CopyToClipboard text={bankData?.bankName}>
                      <span
                        className="cursor-pointer"
                        onClick={() => copieBtn(bankData?.bankName)}
                      >
                        {reactIcons.copy}
                      </span>
                    </CopyToClipboard>
                  </div>
                  <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                    <div className="flex items-center font-semibold">
                      <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                        Account Number
                      </p>
                      <p className=" text-black  text-12 whitespace-nowrap">
                        : {bankData?.accountNumber}
                      </p>
                    </div>
                    <CopyToClipboard text={bankData?.accountNumber}>
                      <span
                        className="cursor-pointer"
                        onClick={() => copieBtn(bankData?.accountNumber)}
                      >
                        {reactIcons.copy}
                      </span>
                    </CopyToClipboard>
                  </div>
                  <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                    <div className="flex items-center font-semibold">
                      <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                        IFSC Code
                      </p>
                      <p className=" text-black  text-12 whitespace-nowrap">
                        : {bankData?.ifscCode}
                      </p>
                    </div>
                    <CopyToClipboard text={bankData?.ifscCode}>
                      <span
                        className="cursor-pointer"
                        onClick={() => copieBtn(bankData?.ifscCode)}
                      >
                        {reactIcons.copy}
                      </span>
                    </CopyToClipboard>
                  </div>
                  {/* bankData?.bankName &&
        bankData?.acountholdername &&
        bankData?.accountNumber &&
        bankData?.ifscCode &&
        bankData?.accountType */}
                  <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                    <div className="flex items-center font-semibold">
                      <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                        Account Holder Name
                      </p>
                      <p className="  text-black text-12 whitespace-nowrap">
                        : {bankData?.acountholdername}
                      </p>
                    </div>
                    <CopyToClipboard text={bankData?.acountholdername}>
                      <span
                        className="cursor-pointer"
                        onClick={() => copieBtn(bankData?.acountholdername)}
                      >
                        {reactIcons.copy}
                      </span>
                    </CopyToClipboard>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-2  border-dashed border-green-700 rounded-md p-4 w-full max-w-sm mx-auto bg-white shadow-sm">
                    {/* QR Section */}
                    <div className="flex">
                      <div className="flex-1 flex justify-center">
                        <img
                          src={upiData?.image} // <-- put your QR image path
                          alt="UPI QR Code"
                          className="w-[200px] h-[200px] object-contain border rounded-md"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col spa ce-y-3 ml-3">
                        <Link
                          to={upiData?.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="p-2 border rounded hover:bg-gray-100 shadow-md mb-2">
                            <Maximize2 size={18} />
                          </button>
                        </Link>
                        <button className="p-2 border rounded hover:bg-gray-100  shadow-md mb-2">
                          <Share2 size={18} />
                        </button>
                        <a
                          href={upiData?.image}
                          download={upiData?.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="p-2 border rounded hover:bg-gray-100  shadow-md mb-2">
                            <Download size={18} />
                          </button>
                        </a>
                      </div>
                    </div>

                    {/* UPI ID */}
                    <div className="mt-4 flex items-center text-sm">
                      <span className="font-semibold">UPI ID:</span>
                      <span className="ml-2 text-blue-700 font-semibold">
                        {upiData?.upi}
                      </span>
                      <CopyToClipboard text={upiData?.upi}>
                        <span
                          className="cursor-pointer"
                          onClick={() => copieBtn(upiData?.upi)}
                        >
                          {reactIcons.copy}
                        </span>
                      </CopyToClipboard>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="lg:px-12 p-2 lg:py-10 shadow-sm lg:shadow-[1px_1px_10px_#383838] ">
              <div>
                <p className="lg:hidden text-14 font-bold">Payment Options</p>
                <div className="mt-2 lg:mt-5 overflow-x-auto gap-2 flex items-center">
                  {paymentList.map((item, index) => (
                    <button
                      className={`rounded-[10px] h-[78px] w-[133px] bg-cover bg-center border border-[#B2E0FF] p-1 flex  text-black ${
                        form?.paymentMethod === item.value
                          ? 'bg-[linear-gradient(108.08deg,hsla(0,0%,70%,.8)_50%,hsla(0,0%,100%,.8))] '
                          : ' bg-paymentBg'
                      } flex-col  `}
                      key={index}
                      onClick={() => {
                        handleButtonClick(index, item.text, item.value);
                        handleChange({
                          target: { name: 'paymentMethod', value: item.value },
                        });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <img
                          src={getImage(item.icon)}
                          className=" w-10"
                          alt=""
                        />
                        {form?.paymentMethod !== item.value ? (
                          <div className="h-5 w-5 rounded-full  bg-white border border-black"></div>
                        ) : (
                          <div className="h-5 w-5 rounded-full flex-center bg-primary-1300 text-white">
                            {reactIcons.checkMark}
                          </div>
                        )}
                      </div>
                      <span className=" text-12">{item.text}</span>
                    </button>
                  ))}
                </div>
                {formError.paymentMethod && (
                  <div className="form-eror text-center xl:text-16 text-12">
                    {formError.paymentMethod}
                  </div>
                )}{' '}
                <div className="mt-5 lg:hidden">
                  {form?.paymentMethod === 'account' ? (
                    <div className="p-5 border-2 border-dashed border-[#1e8067] rounded-[5px]">
                      <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                        <div className="flex items-center font-semibold">
                          <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                            Account Number
                          </p>
                          <p className=" text-black  text-12 whitespace-nowrap">
                            : {bankData?.accountNumber}
                          </p>
                        </div>
                        <CopyToClipboard text={bankData?.accountNumber}>
                          <span
                            className="cursor-pointer"
                            onClick={() => copieBtn(bankData?.accountNumber)}
                          >
                            {reactIcons.copy}
                          </span>
                        </CopyToClipboard>
                      </div>
                      <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                        <div className="flex items-center font-semibold">
                          <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                            IFSC Code
                          </p>
                          <p className=" text-black  text-12 whitespace-nowrap">
                            : {bankData?.ifscCode}
                          </p>
                        </div>
                        <CopyToClipboard text={bankData?.ifscCode}>
                          <span
                            className="cursor-pointer"
                            onClick={() => copieBtn(bankData?.ifscCode)}
                          >
                            {reactIcons.copy}
                          </span>
                        </CopyToClipboard>
                      </div>
                      <div className="flex justify-between items-center my-1 md:my-2 gap-2">
                        <div className="flex items-center font-semibold">
                          <p className=" w-[120px] text-[#4b4b4b] text-12 whitespace-nowrap">
                            Account Holder Name
                          </p>
                          <p className="  text-black text-12 whitespace-nowrap">
                            : {bankData?.acountholdername}
                          </p>
                        </div>
                        <CopyToClipboard text={bankData?.acountholdername}>
                          <span
                            className="cursor-pointer"
                            onClick={() => copieBtn(bankData?.acountholdername)}
                          >
                            {reactIcons.copy}
                          </span>
                        </CopyToClipboard>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border-2  border-dashed border-green-700 rounded-md p-4 w-full max-w-sm mx-auto bg-white shadow-sm">
                        {/* QR Section */}
                        <div className="flex">
                          <div className="flex-1 flex justify-center">
                            <img
                              src={upiData?.image} // <-- put your QR image path
                              alt="UPI QR Code"
                              className="w-[200px] h-[200px] object-contain border rounded-md"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col spa ce-y-3 ml-3">
                            <Link
                              to={upiData?.image}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className="p-2 border rounded hover:bg-gray-100 shadow-md mb-2">
                                <Maximize2 size={18} />
                              </button>
                            </Link>
                            <button className="p-2 border rounded hover:bg-gray-100  shadow-md mb-2">
                              <Share2 size={18} />
                            </button>
                            <a
                              href={upiData?.image}
                              download={upiData?.image}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className="p-2 border rounded hover:bg-gray-100  shadow-md mb-2">
                                <Download size={18} />
                              </button>
                            </a>
                          </div>
                        </div>

                        {/* UPI ID */}
                        <div className="mt-4 flex items-center text-sm">
                          <span className="font-semibold">UPI ID:</span>
                          <span className="ml-2 text-blue-700 font-semibold">
                            {upiData?.upi}
                          </span>
                          <CopyToClipboard text={upiData?.upi}>
                            <span
                              className="cursor-pointer"
                              onClick={() => copieBtn(upiData?.upi)}
                            >
                              {reactIcons.copy}
                            </span>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="my-3">
                  <label
                    htmlFor="file"
                    className="text-primary-100 flex text-start text-16 font-bold"
                  >
                    Upload Your Photo Below
                  </label>

                  {/* Upload Box */}
                  <label
                    htmlFor="file"
                    className="mt-2 flex cursor-pointer  border-2 border-dashed border-green-700 rounded-md p-2 text-center hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>

                      {/* Text */}
                      <span className="text-black font-semibold text-14 underline ">
                        Upload
                      </span>
                      <span className="text-gray-500 text-[10px]">
                        or Drop a File Right Here
                      </span>
                    </div>

                    <input
                      id="file"
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Show Selected File */}
                  {selectedImage && (
                    <div className="mt-2 text-black truncate text-sm">
                      {selectedImage?.name}
                    </div>
                  )}

                  {/* Show Error */}
                  {formError.img && (
                    <div className="form-eror text-red-600 text-sm">
                      {formError.img}
                    </div>
                  )}
                </div>
                <div className=" w-full">
                  <label
                    htmlFor="utr"
                    className="text-primary-100 flex text-start xl:text-16 text-14"
                  >
                    Enter UTR Number*
                  </label>
                  <div className="rounded-md overflow-hidden h-[48px] mt-1 w-full">
                    <input
                      name="utr"
                      placeholder={'10 to 12 Digit UTR Number'}
                      id="utr"
                      value={form.utr}
                      onChange={handleChange}
                      className="border border-black rounded-md outline-none text-14 py-2 px-5  w-full"
                    />
                  </div>
                  {formError.utr && (
                    <div className="form-eror xl:text-16 text-14">
                      {formError.utr}
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-start gap-2 mt-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-primary-red"
                    name="condition"
                    checked={form.condition}
                    onChange={handleChange}
                    id="odds"
                  />
                  <label htmlFor="odds" className="leading-5 text-14 ">
                    I have read and agree with{' '}
                    <Link to="#" className="text-primary-1300 underline">
                      the terms of payment and withdrawal policy.
                    </Link>
                  </label>
                </div>
                {formError.condition && (
                  <div className="form-eror xl:text-16   text-14">
                    {formError.condition}
                  </div>
                )}
                <button
                  onClick={handleDepositSubmit}
                  disabled={isLoading}
                  className="bg-primary-1300 my-5 text-14 h-[35px] flex-center rounded-[4px] w-full text-white shadow-[2px_2px_#00000040]"
                >
                  {isLoading ? 'Processing.... ' : 'Proceed'}
                </button>
              </div>
              <ul className="lg:hidden block bg-white border border-black p-2 rounded-md ">
                {rules.map((item, index) => (
                  <li
                    className=" text-[13px] leading-5 font-bold mb-2"
                    key={index}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {openEditStake && (
        <DepositEditStake
          isOpen={openEditStake}
          handleClose={() => setOpenEditStake(false)}
          stakebutton={stakebutton}
          setStakeButton={setStakeButton}
        />
      )}
    </>
  );
};

export default Deposit;
