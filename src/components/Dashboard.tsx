import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Clock, CheckCircle, Plus, Calendar, IndianRupee } from 'lucide-react';
import { User, DisasterReport } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [reports, setReports] = useState<DisasterReport[]>([]);

  useEffect(() => {
    // Load user's disaster reports
    const allReports = JSON.parse(localStorage.getItem('disasterReports') || '[]');
    const userReports = allReports.filter((report: DisasterReport) => report.userId === user.id);
    setReports(userReports);
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under-review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'under-review': return <AlertTriangle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalLoss = reports.reduce((sum, report) => sum + report.estimatedLoss, 0);
  const approvedReports = reports.filter(report => report.status === 'approved').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName}</h1>
        <p className="text-blue-100 text-lg">
          Track your disaster reports and manage your profile
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved Claims</p>
              <p className="text-3xl font-bold text-gray-900">{approvedReports}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Estimated Loss</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoss)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <IndianRupee className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Disaster Reports</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </button>
          </div>
        </div>

        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports submitted yet</h3>
              <p className="text-gray-600 mb-6">
                Submit your first disaster report to get started with the assistance process.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Submit First Report
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {report.disasterType.charAt(0).toUpperCase() + report.disasterType.slice(1)} Incident
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(report.incidentDate)}
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {formatCurrency(report.estimatedLoss)}
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="capitalize">{report.severityLevel} Severity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Submitted on {formatDate(report.submittedAt)}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;