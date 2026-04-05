/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { postAuthData } from '@/utils/apiHandlers';
import { isYupError, parseYupError } from '@/utils/Yup';
import { addAccountValidation } from '@/utils/validation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { reactIcons } from '@/utils/icons';
import { Link } from 'react-router-dom';

const AddAccount = () => {
  const userId = useSelector((state) => state?.user?.profile?.id);
  const [isPassword, setIsPassword] = useState(false);

  const [form, setForm] = useState({});
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  const inputBox = [
    {
      label: 'BANK NAME',
      placeholder: 'Enter Bank name',
      keyName: 'bankName',
    },
    {
      label: 'Account holder’s name',
      placeholder: 'Eg. John Doe',
      keyName: 'accountHolder',
    },
    {
      label: 'Account number',
      placeholder: 'Enter account number',
      keyName: 'accountNumber',
    },
    {
      label: 'IFSC Code',
      placeholder: 'Eg SBIN0005943',
      keyName: 'ifsc',
    },
  ];

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    value = type === 'checkbox' ? checked : value.trim();

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleAddAccountSubmit = async (e) => {
    e.preventDefault();

    console.log('FORM DATA 👉', form);

    try {
      setFormError({});

      await addAccountValidation.validate(form, {
        abortEarly: false,
      });

      console.log('✅ VALIDATION PASSED');

      const payload = {
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        accountHolder: form.accountHolder,
        accountType: 'Savings',
        bankName: form.bankName,
        selectType: 'Account1',
        minAmount: 100,
        maxAmount: 100000,
        txnCode: form.withdrawPassword,
      };

      console.log('📦 PAYLOAD 👉', payload);

      const response = await postAuthData('/bank', payload);

      console.log('🔥 API RESPONSE 👉', response);

      if (response?.status === 200 || response?.status === 201) {
        toast.success('Account Added Successfully');

        setForm({
          bankName: '',
          accountHolder: '',
          accountNumber: '',
          ifsc: '',
          withdrawPassword: '',
          condition: false,
        });
      } else {
        toast.error(response?.data || 'Something went wrong');
      }
    } catch (error) {
      console.log('❌ ERROR 👉', error);

      if (isYupError(error)) {
        const parsed = parseYupError(error);
        console.log('🚨 VALIDATION ERRORS 👉', parsed);

        setFormError(parsed);

        // 🔥 IMPORTANT: toast show kar
        toast.error(Object.values(parsed)[0]);
      } else {
        toast.error(error?.message || 'Unauthorised');
      }
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {inputBox.map((item, index) => (
          <div key={index}>
            <label className="text-black text-14 md:text-16 font-bold">
              {item.label}
            </label>

            <div className="bg-gradient p-[1px] rounded-md h-[48px]">
              <input
                name={item.keyName}
                placeholder={item.placeholder}
                value={form[item.keyName] || ''}
                onChange={handleChange}
                className="w-full h-full px-4 border border-black rounded-md"
              />
            </div>

            {formError[item.keyName] && (
              <div className="text-red-500 text-12">
                {formError[item.keyName]}
              </div>
            )}
          </div>
        ))}

        {/* Withdraw Password */}
        <div>
          <label className="font-bold">Withdraw Password</label>

          <div className="relative h-[48px]">
            <input
              name="withdrawPassword"
              placeholder="Enter Withdraw Password"
              type={isPassword ? 'text' : 'password'}
              value={form.withdrawPassword || ''}
              onChange={handleChange}
              className="w-full h-full px-4 border border-black rounded-md"
            />

            <span
              onClick={() => setIsPassword(!isPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {isPassword ? reactIcons.eye : reactIcons.eyeSlash}
            </span>
          </div>

          {formError.withdrawPassword && (
            <div className="text-red-500 text-12">
              {formError.withdrawPassword}
            </div>
          )}
        </div>

        {/* Checkbox */}
        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            name="condition"
            checked={form.condition || false}
            onChange={handleChange}
          />
          <label className="text-14">
            I agree with{' '}
            <Link to="#" className="text-primary-1300 underline">
              terms & policy
            </Link>
          </label>
        </div>

        {formError.condition && (
          <div className="text-red-500 text-12">{formError.condition}</div>
        )}
      </div>

      <button
        onClick={handleAddAccountSubmit}
        className="bg-primary-1300 mt-5 h-[40px] w-full text-white rounded-md"
      >
        Add Bank Account
      </button>
    </div>
  );
};

export default AddAccount;
