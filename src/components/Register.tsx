import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import axios from 'axios';

interface RegisterProps {
  onRegister: (userData: UserType, aadhaarImage: File | null, isOtpVerified: boolean) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [user, setUser] = useState<UserType>({
    id: '',
    fullName: '',
    userEmailID: '',
    phoneNumber: '',
    userAddress: '',
    village: '',
    pincode: '',
    district: '',
    aadhaarNumber: '',
    userPassword: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: undefined,
    houseOwnership: undefined,
    houseType: undefined,
    familyMembers: undefined,
    createdAt: new Date().toISOString(),
    role: 'USER',
    reAppeal: 'No',
  });
  const [aadhaarImage, setAadhaarImage] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarImage(e.target.files[0]);
    }
  };

  const sendOtp = async () => {
    if (!user.userEmailID) {
      setError('Please enter an email address');
      return;
    }
    try {
      const response = await axios.post(`http://192.168.1.2:8082/kdr/otp/send?email=${encodeURIComponent(user.userEmailID)}`, null, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data === 'OTP sent successfully') {
        setResendTimer(30); // Start 30-second timer
        setError(null);
        const interval = setInterval(() => {
          setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
          if (resendTimer === 0) clearInterval(interval);
        }, 1000);
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP: ' + (error.response ? error.response.data : error.message));
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const response = await axios.post('http://192.168.1.2:8082/kdr/otp/verify', { email: user.userEmailID, otp }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data === 'OTP Verified Successfully!') {
        setIsOtpVerified(true);
        setError(null);
      } else {
        setError('Invalid or expired OTP');
        setIsOtpVerified(false);
      }
    } catch (error) {
      setError('OTP verification failed: ' + (error.response ? error.response.data : error.message));
      setIsOtpVerified(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const response = await axios.post(`http://192.168.1.2:8082/kdr/otp/resend?email=${encodeURIComponent(user.userEmailID)}`, null, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data === 'OTP resent successfully') {
        setResendTimer(30); // Reset timer to 30 seconds
        setError(null);
        const interval = setInterval(() => {
          setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
          if (resendTimer === 0) clearInterval(interval);
        }, 1000);
      } else {
        setError('Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.fullName || !user.userEmailID || !user.phoneNumber || !user.userAddress || !user.village || !user.pincode || !user.userPassword) {
      setError('All fields except optional ones are required');
      return;
    }
    onRegister(user, aadhaarImage, isOtpVerified);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Kuttanad Disaster Relief</h1>
          </div>
          <p className="text-gray-600">Register to report disaster damages and receive timely assistance</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="userEmailID"
            value={user.userEmailID}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="userAddress"
            value={user.userAddress}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="village"
            value={user.village}
            onChange={handleChange}
            placeholder="Village"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="pincode"
            value={user.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="aadhaarNumber"
            value={user.aadhaarNumber || ''}
            onChange={handleChange}
            placeholder="Aadhaar Number (Optional)"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="userPassword"
            value={user.userPassword}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              type="button"
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
            >
              Send OTP
            </button>
            <button
              type="button"
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mb-2"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className="w-full text-blue-600 hover:underline mt-2 disabled:text-gray-400"
            >
              Resend OTP {resendTimer > 0 ? `(${resendTimer}s)` : ''}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!isOtpVerified}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;