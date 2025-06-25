export interface User {
  id: string;
  fullName: string;
  userEmailID: string; // Changed from email to match backend
  phoneNumber: string;
  userAddress: string; // Changed from address
  village: string;
  pincode: string;
  district: string;
  aadhaarNumber?: string;
  userPassword: string; // Changed from password
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  houseOwnership?: 'own' | 'rental';
  houseType?: 'concrete' | 'thatched' | 'semi-pucca';
  familyMembers?: number;
  createdAt: string;
  role?: string; // Add if required by backend
  reAppeal?: string; // Add if required by backend
}