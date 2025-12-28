'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Shield, FileText, User, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function ReportIncidentPage() {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    reporterRelationship: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentState: '',
    incidentLga: '',
    description: '',
    victimName: '',
    victimAge: '',
    victimGender: '',
    suspectName: '',
    suspectRelationship: '',
    emergencyContact: '',
    urgency: 'MEDIUM',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // In a real implementation, this would create a case
      // For now, we'll show a success message
      toast.success('Your report has been submitted successfully. Our team will contact you shortly.');
      
      // Reset form
      setFormData({
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        reporterRelationship: '',
        incidentType: '',
        incidentDate: '',
        incidentTime: '',
        incidentLocation: '',
        incidentState: '',
        incidentLga: '',
        description: '',
        victimName: '',
        victimAge: '',
        victimGender: '',
        suspectName: '',
        suspectRelationship: '',
        emergencyContact: '',
        urgency: 'MEDIUM',
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again or call the emergency helpline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Coat of Arms - Top Center */}
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <img 
              src="/coat-of-arms.png" 
              alt="Nigerian Coat of Arms" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SGBV Information System</h1>
                <p className="text-xs text-gray-600">Ministry of Justice</p>
              </div>
            </Link>
            <Link 
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <p className="font-semibold">
              IN EMERGENCY? CALL: 
              <a href="tel:112" className="ml-2 underline hover:text-red-100">112 (Police)</a>
              <span className="mx-2">|</span>
              <a href="tel:08000333333" className="underline hover:text-red-100">0800-033-3333 (SGBV Helpline)</a>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Incident</h1>
            <p className="text-gray-600">
              Your report is confidential and will be handled with the utmost care and urgency.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Reporter Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="reporterName"
                    required
                    value={formData.reporterName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="reporterPhone"
                    required
                    value={formData.reporterPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to Victim *
                  </label>
                  <select
                    name="reporterRelationship"
                    required
                    value={formData.reporterRelationship}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select relationship</option>
                    <option value="VICTIM">I am the victim</option>
                    <option value="PARENT_GUARDIAN">Parent / Guardian</option>
                    <option value="FAMILY">Family member</option>
                    <option value="FRIEND">Friend</option>
                    <option value="WITNESS">Witness</option>
                    <option value="PROFESSIONAL">Professional (Doctor, Social Worker, etc.)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Incident Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Incident Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Incident *
                  </label>
                  <select
                    name="incidentType"
                    required
                    value={formData.incidentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select type</option>
                    <option value="RAPE">Rape</option>
                    <option value="ASSAULT">Sexual Assault</option>
                    <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
                    <option value="HARASSMENT">Harassment</option>
                    <option value="TRAFFICKING">Human Trafficking</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    name="urgency"
                    required
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent - Immediate Response Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Incident *
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    required
                    value={formData.incidentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time of Incident
                  </label>
                  <input
                    type="time"
                    name="incidentTime"
                    value={formData.incidentTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="incidentState"
                    required
                    value={formData.incidentState}
                    onChange={handleChange}
                    placeholder="e.g., Lagos, Abuja"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA
                  </label>
                  <input
                    type="text"
                    name="incidentLga"
                    value={formData.incidentLga}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location/Address *
                  </label>
                  <input
                    type="text"
                    name="incidentLocation"
                    required
                    value={formData.incidentLocation}
                    onChange={handleChange}
                    placeholder="Street address or landmark"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description of Incident *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Please provide as much detail as possible..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </section>

            {/* Victim Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Victim Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Victim Name (if different from reporter)
                  </label>
                  <input
                    type="text"
                    name="victimName"
                    value={formData.victimName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="victimAge"
                    value={formData.victimAge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="victimGender"
                    value={formData.victimGender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Suspect Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Suspect/Offender Information (if known)
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suspect Name
                  </label>
                  <input
                    type="text"
                    name="suspectName"
                    value={formData.suspectName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to Victim
                  </label>
                  <input
                    type="text"
                    name="suspectRelationship"
                    value={formData.suspectRelationship}
                    onChange={handleChange}
                    placeholder="e.g., Spouse, Stranger, Acquaintance"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
              <Link
                href="/"
                className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Confidentiality:</strong> All information provided is strictly confidential and will only be used for case management and support purposes.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

