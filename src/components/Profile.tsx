import React, { useState } from 'react';
import { User as UserIcon, Calendar, Users, Home, Camera, Save, Edit } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [profileImage, setProfileImage] = useState(user.profilePicture || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setFormData({ ...formData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...formData };
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user in session
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{formData.fullName}</h2>
            <p className="text-gray-600">{formData.email}</p>
            <p className="text-gray-600">{formData.phoneNumber}</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 py-3">{formData.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <p className="text-gray-900 py-3">{formData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 py-3">{formData.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 py-3">{formData.dateOfBirth || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-900 py-3 capitalize">{formData.gender || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
            <p className="text-gray-900 py-3">{formData.aadhaarNumber || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
            {isEditing ? (
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 py-3">{formData.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village/Locality</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                />
              ) : (
                <p className="text-gray-900 py-3">{formData.village}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              ) : (
                <p className="text-gray-900 py-3">{formData.pincode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <p className="text-gray-900 py-3">{formData.district}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Household Information */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Household Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Ownership</label>
            {isEditing ? (
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.houseOwnership || ''}
                onChange={(e) => setFormData({ ...formData, houseOwnership: e.target.value as 'own' | 'rental' })}
              >
                <option value="">Select Ownership Type</option>
                <option value="own">Own</option>
                <option value="rental">Rental</option>
              </select>
            ) : (
              <p className="text-gray-900 py-3 capitalize">{formData.houseOwnership || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of House</label>
            {isEditing ? (
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.houseType || ''}
                onChange={(e) => setFormData({ ...formData, houseType: e.target.value as 'concrete' | 'thatched' | 'semi-pucca' })}
              >
                <option value="">Select House Type</option>
                <option value="concrete">Concrete</option>
                <option value="thatched">Thatched</option>
                <option value="semi-pucca">Semi-pucca</option>
              </select>
            ) : (
              <p className="text-gray-900 py-3 capitalize">{formData.houseType || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Family Members</label>
            {isEditing ? (
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.familyMembers || ''}
                onChange={(e) => setFormData({ ...formData, familyMembers: parseInt(e.target.value) || 0 })}
              />
            ) : (
              <p className="text-gray-900 py-3">{formData.familyMembers || 'Not specified'}</p>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;