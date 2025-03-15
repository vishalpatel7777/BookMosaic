import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const faqs = [
  {
    question: "How does BookMosaic recommend books? 🤖",
    answer: "BookMosaic uses AI/ML algorithms to analyze your reading history, preferences, and trending books to suggest personalized recommendations."
  },
  {
    question: "Is my payment information secure? 🔒",
    answer: "Yes! We use a secure payment gateway with encryption to ensure that your transactions are safe and private."
  },
  {
    question: "Can I download purchased books as PDFs? 📄",
    answer: "Absolutely! Once you complete your purchase, you'll get access to download the book in PDF format from your account."
  },
  {
    question: "How do I reset my password? 🔑",
    answer: "Go to the login page, click on 'Forgot Password', and follow the instructions sent to your registered email."
  },
  {
    question: "Do you offer refunds on book purchases? 💰",
    answer: "Due to the digital nature of our products, we do not offer refunds. However, if you face any issues, contact our support team."
  }
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-center mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ❓ Frequently Asked Questions
      </motion.h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleFAQ(index)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{faq.question}</h2>
              <ChevronDownIcon
                className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
              />
            </div>
            {openIndex === index && (
              <motion.p
                className="mt-3 text-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;