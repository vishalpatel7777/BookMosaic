import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
      <p className="text-gray-700 mb-4">
        Welcome to BookMosaic! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
      </p>
      <h2 className="text-xl font-semibold mt-6">1. Account Registration</h2>
      <p className="text-gray-700 mb-4">
        To access certain features, you must register an account. You are responsible for maintaining the confidentiality of your login credentials.
      </p>
      <h2 className="text-xl font-semibold mt-6">2. Use of Services</h2>
      <p className="text-gray-700 mb-4">
        You agree not to misuse the platform, engage in unlawful activities, or violate intellectual property rights.
      </p>
      <h2 className="text-xl font-semibold mt-6">3. Purchases and Payments</h2>
      <p className="text-gray-700 mb-4">
        All purchases made through BookMosaic are final. We use a secure payment gateway to process transactions safely.
      </p>
      <h2 className="text-xl font-semibold mt-6">4. Refund Policy</h2>
      <p className="text-gray-700 mb-4">
        Refunds are only issued in case of duplicate transactions or technical errors. Please contact support within 7 days for assistance.
      </p>
      <h2 className="text-xl font-semibold mt-6">5. Intellectual Property</h2>
      <p className="text-gray-700 mb-4">
        All content on BookMosaic, including book descriptions, AI recommendations, and UI designs, is protected by copyright laws.
      </p>
      <h2 className="text-xl font-semibold mt-6">6. Changes to Terms</h2>
      <p className="text-gray-700 mb-4">
        We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
      </p>
      <h2 className="text-xl font-semibold mt-6">7. Contact Information</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions about these Terms and Conditions, please contact us at <strong>support@bookmosaic.com</strong>.
      </p>
    </div>
  );
};

export default TermsAndConditions;