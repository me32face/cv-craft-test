'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Disclaimer() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif ,margin: 0, padding: 0' }}>
      {/* Back Button */}
      <button onClick={handleBack} className=" bg-gray-300 text-white hover:bg-gray-400 mt-12 ml-12 w-8 h-8 rounded-full transition-colors">
        <ArrowLeft size={15} />
      </button>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12  pb-8">
          <h1 className="text-4xl font-semibold text-red-500 mb-4"> Disclaimer</h1>
          <p className="text-gray-600 mb-4">Effective Date: 04/11/2025</p>
          <p className="text-gray-700 mb-2"><strong>Company Name:</strong> ESTA Enterprises Pvt. Ltd.</p>
          <div className="mt-6 pt-4 ">
            <p className="text-gray-700"> Welcome to ESTA Enterprises Pvt. Ltd. ("we," "our," or "us"). The information provided on our website —{' '} <a href="https://www.estaenterprises.com" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">www.estaenterprises.com</a>{' '}— is for general informational and business purposes only. By using this website, you acknowledge and agree to the terms outlined in this Disclaimer. </p>
          </div>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 1. Accuracy of Information</h2>
          <p className="text-gray-700">We make every effort to ensure that the information displayed on our website is accurate, up-to-date, and reliable. However, ESTA Enterprises Pvt. Ltd. does not guarantee the completeness, accuracy, or timeliness of any content, including product descriptions,  service details, or pricing information. Content on this website may be updated, modified,  or removed without prior notice. Users are encouraged to verify details before making any  business or financial decisions based on the information provided.</p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 2. Professional Advice Disclaimer</h2>
          <p className="text-gray-700">All materials, tutorials, and resources shared on this website are intended for informational and educational purposes only. They do not constitute technical, legal, financial, or professional advice. Before taking any decision or implementing any business process, users should seek advice from qualified professionals or contact our team directly for clarification.</p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 3. Service Limitations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>The website or hosted services will be available at all times or error-free.</li>
            <li>Any defects or issues will be corrected immediately.</li>
            <li>The results obtained from using our software, websites, or applications will meet every individual expectation.</li>
          </ul>
          <p className="text-gray-700 mt-4">All services are provided "as is" and "as available" without any express or implied warranties.</p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Links and Integrations</h2>
          <p className="text-gray-700">Our website and software solutions may contain links or integrations with third-party websites, tools, or services (such as hosting providers, APIs, or payment gateways). These links are provided for user convenience and do not imply endorsement or responsibility for the content or reliability of such external sites. Users are encouraged to review the privacy and policy documents of those third-party providers before engaging with them.</p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Any direct, indirect, or consequential damages arising from the use of our website, software, or services.</li>
            <li>Loss of data, business interruption, or financial damages resulting from technical issues, system failures, or misuse.</li>
            <li>Actions taken or decisions made based on the content provided on this website.</li>
          </ul>
          <p className="text-gray-700 mt-4"> Your use of our services is entirely at your own discretion and risk.</p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 6. Testimonials and Case Studies</h2>
          <p className="text-gray-700">Testimonials, feedback, and case studies displayed on our website represent individual client experiences. Results may vary depending on project requirements, timelines, and business conditions. They should not be interpreted as guaranteed outcomes for all users. </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Disclaimer</h2>
          <p className="text-gray-700">ESTA Enterprises Pvt. Ltd. reserves the right to update, amend, or revise this Disclaimer at any time without prior notice. The most recent version will always be available on our website. By continuing to use our website or services, you acknowledge and agree to the latest  version of this Disclaimer.</p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 8. Contact Us</h2>
          <p className="text-gray-700 mb-4"> For any questions, clarifications, or concerns related to this Disclaimer, please contact us at:</p>
          <div className="space-y-2 text-gray-700">
            <p><strong>📧</strong>{' '}<a href="mailto:estaenterprises@gmail.com" className="hover:underline">  estaenterprises@gmail.com</a></p>
            <p><strong>🌐 </strong>{' '}<a href="https://www.estaenterprises.com" target="_blank" rel="noopener noreferrer" className=" hover:underline"> www.estaenterprises.com </a></p>
            <p><strong>📞 </strong>{' '}<a href="tel:+914046270111" className=""> +91-4046270111 </a> </p>
          </div>
        </section>
      </div>
    </div>
  );
}