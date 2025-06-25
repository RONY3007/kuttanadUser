import React, { useState, useEffect } from 'react';
import { CreditCard, Building2, Hash, Phone, Upload, Save, Edit, CheckCircle, Copy } from 'lucide-react';
import { User, BankDetails as BankDetailsType } from '../types';

interface BankDetailsProps {
  user: User;
}

const BankDetails: React.FC<BankDetailsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetailsType | null>(null);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    linkedMobile: '',
    upiId: ''
  });
  const [passbookImage, setPassbookImage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    // Load existing bank details
    const allBankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
    const userBankDetails = allBankDetails.find((details: BankDetailsType) => details.userId === user.id);
    
    if (userBankDetails) {
      setBankDetails(userBankDetails);
      setFormData({
        accountHolderName: userBankDetails.accountHolderName,
        bankName: userBankDetails.bankName,
        accountNumber: userBankDetails.accountNumber,
        ifscCode: userBankDetails.ifscCode,
        branchName: userBankDetails.branchName,
        linkedMobile: userBankDetails.linkedMobile,
        upiId: userBankDetails.upiId || ''
      });
      setPassbookImage(userBankDetails.passbookImage || '');
    } else {
      // Pre-fill with user data
      setFormData({
        ...formData,
        accountHolderName: user.fullName,
        linkedMobile: user.phoneNumber
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.accountHolderName.length < 2) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (formData.bankName.length < 2) {
      newErrors.bankName = 'Bank name is required';
    }

    if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be between 9-18 digits';
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }

    if (formData.branchName.length < 2) {
      newErrors.branchName = 'Branch name is required';
    }

    if (formData.linkedMobile.length !== 10) {
      newErrors.linkedMobile = 'Mobile number must be 10 digits';
    }

    if (formData.upiId && !/^[\w\.-]+@[\w\.-]+$/.test(formData.upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPassbookImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBankDetails: BankDetailsType = {
        id: bankDetails?.id || Date.now().toString(),
        userId: user.id,
        ...formData,
        passbookImage,
        updatedAt: new Date().toISOString()
      };

      const allBankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
      const existingIndex = allBankDetails.findIndex((details: BankDetailsType) => details.userId === user.id);

      if (existingIndex !== -1) {
        allBankDetails[existingIndex] = newBankDetails;
      } else {
        allBankDetails.push(newBankDetails);
      }

      localStorage.setItem('bankDetails', JSON.stringify(allBankDetails));
      setBankDetails(newBankDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const inputClasses = (fieldName: string) => 
    `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      errors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bank Details</h1>
            <p className="text-emerald-100 text-lg">
              Manage your banking information for assistance disbursement
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <CreditCard className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Status Card */}
      {bankDetails && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bank Details Verified</h3>
                <p className="text-gray-600">Your banking information is saved and ready for processing</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Details'}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(bankDetails.updatedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}

      {/* Bank Details Form */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Banking Information</h2>
          {!bankDetails && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
              Please fill in your banking details
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className={inputClasses('accountHolderName')}
                    placeholder="Full name as per bank records"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{formData.accountHolderName}</span>
                  <button
                    onClick={() => copyToClipboard(formData.accountHolderName, 'name')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errors.accountHolderName && <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className={inputClasses('bankName')}
                    placeholder="e.g., State Bank of India"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{formData.bankName}</span>
                  <button
                    onClick={() => copyToClipboard(formData.bankName, 'bank')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className={inputClasses('accountNumber')}
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-mono">
                    {formData.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                  </span>
                  <button
                    onClick={() => copyToClipboard(formData.accountNumber, 'account')}
                    className={`${copySuccess === 'account' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className={inputClasses('ifscCode')}
                    placeholder="e.g., SBIN0001234"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-mono">{formData.ifscCode}</span>
                  <button
                    onClick={() => copyToClipboard(formData.ifscCode, 'ifsc')}
                    className={`${copySuccess === 'ifsc' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className={inputClasses('branchName')}
                    placeholder="Enter branch name"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  />
                </div>
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{formData.branchName}</span>
                </div>
              )}
              {errors.branchName && <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Mobile Number *
              </label>
              {isEditing || !bankDetails ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    className={inputClasses('linkedMobile')}
                    placeholder="Mobile linked to bank account"
                    value={formData.linkedMobile}
                    onChange={(e) => setFormData({ ...formData, linkedMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{formData.linkedMobile}</span>
                </div>
              )}
              {errors.linkedMobile && <p className="mt-1 text-sm text-red-600">{errors.linkedMobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID (Optional)
            </label>
            {isEditing || !bankDetails ? (
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className={inputClasses('upiId')}
                  placeholder="e.g., yourname@paytm, mobile@upi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{formData.upiId || 'Not provided'}</span>
              </div>
            )}
            {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Passbook / Cancelled Cheque (Optional)
            </label>
            {isEditing || !bankDetails ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  {passbookImage ? (
                    <div className="relative">
                      <img src={passbookImage} alt="Passbook" className="mx-auto max-h-48 rounded-lg shadow-sm" />
                      <button
                        onClick={() => setPassbookImage('')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600"> or drag and drop</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                {passbookImage ? (
                  <img src={passbookImage} alt="Passbook" className="max-h-32 rounded-lg shadow-sm" />
                ) : (
                  <span className="text-gray-500">No document uploaded</span>
                )}
              </div>
            )}
          </div>

          {(isEditing || !bankDetails) && (
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Bank Details'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <CheckCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Security & Privacy</h3>
            <p className="text-blue-700 text-sm mb-2">
              Your banking information is encrypted and stored securely. We use this information only for disaster relief assistance disbursement.
            </p>
            <ul className="text-blue-600 text-sm space-y-1">
              <li>• Bank details are verified before processing assistance</li>
              <li>• Information is shared only with authorized government officials</li>
              <li>• You can update your details anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;