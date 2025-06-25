import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface RegisterProps {
  onRegister: (userData: UserType, aadhaarImage: File | null) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.fullName || !user.userEmailID || !user.phoneNumber || !user.userAddress || !user.village || !user.pincode || !user.userPassword) {
      setError('All fields except optional ones are required');
      return;
    }
    onRegister(user, aadhaarImage);
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Register
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