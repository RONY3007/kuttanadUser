import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Camera, 
  Upload, 
  IndianRupee, 
  FileText, 
  Send,
  X,
  Plus,
  Loader
} from 'lucide-react';
import { User, DisasterReport as DisasterReportType } from '../types';

interface DisasterReportProps {
  user: User;
}

const DisasterReport: React.FC<DisasterReportProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    disasterType: '' as DisasterReportType['disasterType'] | '',
    incidentDate: '',
    description: '',
    cause: '',
    severityLevel: '' as DisasterReportType['severityLevel'] | '',
    estimatedLoss: '',
    location: '',
    additionalNotes: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const disasterTypes = [
    { value: 'flood', label: 'Flood', icon: '🌊' },
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'landslide', label: 'Landslide', icon: '⛰️' },
    { value: 'cyclone', label: 'Cyclone', icon: '🌪️' },
    { value: 'earthquake', label: 'Earthquake', icon: '🏚️' },
    { value: 'other', label: 'Other', icon: '⚠️' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.disasterType) {
      newErrors.disasterType = 'Please select disaster type';
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident date is required';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.cause) {
      newErrors.cause = 'Cause of disaster is required';
    }

    if (!formData.severityLevel) {
      newErrors.severityLevel = 'Please select severity level';
    }

    if (!formData.estimatedLoss || parseFloat(formData.estimatedLoss) <= 0) {
      newErrors.estimatedLoss = 'Please enter a valid estimated loss amount';
    }

    if (formData.location.length < 5) {
      newErrors.location = 'Location must be at least 5 characters';
    }

    if (images.length === 0) {
      newErrors.images = 'Please upload at least one image of the damage';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (images.length < 6) { // Limit to 6 images
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReport: DisasterReportType = {
        id: Date.now().toString(),
        userId: user.id,
        ...formData,
        disasterType: formData.disasterType as DisasterReportType['disasterType'],
        severityLevel: formData.severityLevel as DisasterReportType['severityLevel'],
        estimatedLoss: parseFloat(formData.estimatedLoss),
        images,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingReports = JSON.parse(localStorage.getItem('disasterReports') || '[]');
      existingReports.push(newReport);
      localStorage.setItem('disasterReports', JSON.stringify(existingReports));

      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      disasterType: '',
      incidentDate: '',
      description: '',
      cause: '',
      severityLevel: '',
      estimatedLoss: '',
      location: '',
      additionalNotes: ''
    });
    setImages([]);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your disaster report has been submitted and is being reviewed by the authorities. 
            You will be notified about the status updates via email and SMS.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Report ID:</strong> DR{Date.now().toString().slice(-8)}
              <br />
              <strong>Next Steps:</strong> Officials will verify your report and contact you within 2-3 business days.
            </p>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Report Disaster Damage</h1>
            <p className="text-red-100 text-lg">
              Submit details about disaster-related damage to receive assistance
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Disaster Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type of Disaster *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {disasterTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, disasterType: type.value as any })}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.disasterType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium">{type.label}</div>
                </button>
              ))}
            </div>
            {errors.disasterType && <p className="mt-2 text-sm text-red-600">{errors.disasterType}</p>}
          </div>

          {/* Date and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Incident *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.incidentDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>
              {errors.incidentDate && <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level *
              </label>
              <div className="space-y-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severityLevel: level.value as any })}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                      formData.severityLevel === level.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`px-2 py-1 rounded text-sm font-medium ${level.color}`}>
                      {level.label} Severity
                    </span>
                  </button>
                ))}
              </div>
              {errors.severityLevel && <p className="mt-2 text-sm text-red-600">{errors.severityLevel}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description of Damage *
            </label>
            <textarea
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe the damage caused by the disaster in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </div>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Cause */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cause of Disaster *
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.cause ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Heavy rainfall, Dam overflow, Electrical short circuit"
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
            />
            {errors.cause && <p className="mt-1 text-sm text-red-600">{errors.cause}</p>}
          </div>

          {/* Location and Loss */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Specific location of the damage"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Property Loss (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="100"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.estimatedLoss ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter amount in rupees"
                  value={formData.estimatedLoss}
                  onChange={(e) => setFormData({ ...formData, estimatedLoss: e.target.value })}
                />
              </div>
              {errors.estimatedLoss && <p className="mt-1 text-sm text-red-600">{errors.estimatedLoss}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images of Damage * (Maximum 6 images)
            </label>
            
            {images.length < 6 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 5MB each</p>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Damage ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                    <Plus className="h-8 w-8 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Any additional information that might be helpful..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start">
          <FileText className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Important Guidelines</h3>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Provide accurate and complete information for faster processing</li>
              <li>• Upload clear, well-lit photos showing the extent of damage</li>
              <li>• Keep your phone available for verification calls from officials</li>
              <li>• Reports are processed within 2-3 business days</li>
              <li>• You will receive SMS and email updates on report status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterReport;