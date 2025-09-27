import React from 'react';
import RequestForm from '../components/RequestForm';
import { motion } from 'framer-motion';

const SubmitHelp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Request Emergency Help</h1>
        <p className="mt-2 text-lg">
          Your safety is our priority. Submit your needs and our volunteers will respond quickly.
        </p>
      </section>

      {/* Form Section */}
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl"
        >
          <RequestForm />
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitHelp;
