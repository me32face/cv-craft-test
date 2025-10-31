import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is the resume builder free to use?",
      answer: "Yes! Our basic resume builder is completely free to use. You can create, edit, and download your resume without any cost. We also offer premium features for advanced customization and additional templates."
    },
    {
      question: "Can I download my resume as a PDF?",
      answer: "Absolutely! You can download your resume in multiple formats including PDF and Word (.docx). The PDF format ensures your resume looks professional and maintains its formatting across all devices."
    },
    {
      question: "How does AI improve my resume?",
      answer: "Our AI analyzes your content and provides intelligent suggestions for improvement, including better phrasing, industry-specific keywords, achievement quantification, and ATS optimization to help your resume stand out to both recruiters and tracking systems."
    },
    {
      question: "Are the templates ATS-friendly?",
      answer: "Yes! All our templates are specifically designed to be ATS-friendly. They use standard formatting, appropriate headers, and clean structure to ensure your resume passes through Applicant Tracking Systems and reaches human recruiters."
    },
    {
      question: "Can I create multiple versions of my resume?",
      answer: "Yes, you can create and save multiple versions of your resume. This allows you to tailor different versions for specific job applications or industries, maximizing your chances of success."
    },
    {
      question: "How long does it take to create a resume?",
      answer: "With our intuitive builder and AI assistance, you can create a professional resume in as little as 15-20 minutes. If you use LinkedIn integration, it can be even faster as your profile data is imported automatically."
    },
    {
      question: "Can I edit my resume after downloading?",
      answer: "Yes! When you download in Word format, you have full editing capabilities. Even after downloading as PDF, you can return to our platform anytime to make changes and download an updated version."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9FB] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Max-width container for 4K screens */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#342D4C] mb-4 ">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#7F7F80] max-w-2xl mx-auto">
            Everything you need to know about our resume builder
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#7F7F80] overflow-hidden transition-all duration-300 hover:border-[#d3d3d3]"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none group"
              >
                <span className="text-base sm:text-lg font-medium text-[#7F7F80] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}