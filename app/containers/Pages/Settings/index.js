/* eslint-disable react-hooks/exhaustive-deps */
import GradientHeading from '@/components/GradientHeading';
import { postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { userChangePasswordValidation } from '@/utils/validation';
import { isYupError, parseYupError } from '@/utils/Yup';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [isPassword, setIsPassword] = useState(false);
  const [isPassword1, setIsPassword1] = useState(false);
  const [isPassword2, setIsPassword2] = useState(false);

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({ ...formError, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError({});

      await userChangePasswordValidation.validate(form, {
        abortEarly: false,
      });

      const payload = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      };

      const response = await postAuthData('/users/me/change-password', payload);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || 'Password changed successfully',
        );

        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('FULL ERROR 👉', error);

      // ✅ YUP VALIDATION ERROR
      if (isYupError(error)) {
        setFormError(parseYupError(error));
        return;
      }

      // ✅ BACKEND ERROR HANDLING (MAIN FIX)
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      // 🔥 show toast
      toast.error(backendMessage || 'Something went wrong');

      // 🔥 optional: show under old password field
      if (backendMessage?.toLowerCase().includes('old password')) {
        setFormError((prev) => ({
          ...prev,
          oldPassword: backendMessage,
        }));
      }
    }
  };

  return (
    <div className="lg:min-h-screen mx-1 md:mx-0 pb-5">
      <div className="py-2 w-full lg:max-w-[570px]">
        <GradientHeading heading={'Change Password'} />
      </div>

      <div className="w-full lg:max-w-[570px] text-12">
        <form className="flex flex-col gap-2 px-2">
          {/* OLD PASSWORD */}
          <div className="relative w-full">
            <input
              type={!isPassword ? 'password' : 'text'}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
              className="border bg-white border-gray-300 w-full text-14 px-[10px] py-2 rounded-lg font-semibold outline-none"
            />
            <span
              className="absolute top-[10px] right-[10px] cursor-pointer"
              onClick={() => setIsPassword(!isPassword)}
            >
              {isPassword ? reactIcons.eye : reactIcons.eyeSlash}
            </span>

            {formError?.oldPassword && (
              <p className="text-red-600 text-12">{formError.oldPassword}</p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div className="relative w-full">
            <input
              type={!isPassword1 ? 'password' : 'text'}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="border bg-white border-gray-300 w-full text-14 px-[10px] py-2 rounded-lg font-semibold outline-none"
            />
            <span
              className="absolute top-[10px] right-[10px] cursor-pointer"
              onClick={() => setIsPassword1(!isPassword1)}
            >
              {isPassword1 ? reactIcons.eye : reactIcons.eyeSlash}
            </span>

            {formError?.newPassword && (
              <p className="text-red-600 text-12">{formError.newPassword}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative w-full">
            <input
              type={!isPassword2 ? 'password' : 'text'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat New Password"
              className="border bg-white border-gray-300 w-full text-14 px-[10px] py-2 rounded-lg font-semibold outline-none"
            />
            <span
              className="absolute top-[10px] right-[10px] cursor-pointer"
              onClick={() => setIsPassword2(!isPassword2)}
            >
              {isPassword2 ? reactIcons.eye : reactIcons.eyeSlash}
            </span>

            {formError?.confirmPassword && (
              <p className="text-red-600 text-12">
                {formError.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#1E8067] text-white py-2 rounded-sm"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
