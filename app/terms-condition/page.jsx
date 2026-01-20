'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
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
        <header className="mb-12 pb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4"> Terms & Conditions</h1>
          <p className='text-gray-500'>Effective Date: 04/11/2025</p>
          <div className="mt-6 pt-4   ">
            <p className="text-gray-700 mb-8 "><strong>Company Name:</strong> Esta Enterprises Pvt. Ltd.</p>
            <p className="text-gray-700"> Welcome to <strong>Esta Enterprises Pvt. Ltd.</strong> (the "us" or "us").  These Terms and Conditions ("terms") govern your access to and use of our website,  products, and services, including all related information, software, and IT solutions.</p>
            <p className="text-gray-700 mt-3"> By visiting our website or engaging our services, you agree to comply with these Terms. If you do not agree, please do not use our services.</p>
          </div>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Scope of Services</h2>
          <p className="text-gray-700 mb-4"> Esta Enterprises Pvt. Ltd. offers a wide range of IT services, including but not limited to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Software and mobile application development</li>
            <li>Website design and development</li>
            <li>Digital marketing solutions</li>
            <li>Infrastructure and support services</li>
          </ul>
          <p className="text-gray-700 mt-4">The exact services to be provided will be outlined in a signed project terms, proposals,  or service contracts.</p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 2. Use of Website and Services</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>You agree to use our website only for lawful purposes.</li>
            <li>You agree not to engage in any activity that may damage, disable, or impair the functioning of our website or services.</li>
            <li>Unauthorized access to any part of our platform or any content is strictly prohibited.</li>
          </ul>
        </section>
        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Intellectual Property Rights</h2>
          <p className="text-gray-700 mb-4">All content, website, code, graphics, and materials created or distributed by Esta Enterprises Pvt. Ltd. are the intellectual property of the company, unless otherwise specified.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Clients retain ownership of content, data, files, brand materials, and content (complete or in development) provided by them during the project.</li>
            <li>The source code, designs, or intellectual property created by Esta Enterprises Pvt. Ltd. will be fully provided back to clients only after the invoice/payment has been received.</li>
            <li>Any unauthorized duplication or use of materials without prior written consent is strictly prohibited.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">  4. Client Responsibilities</h2>
          <p className="text-gray-700 mb-4"> To ensure smooth project execution, clients are required to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide accurate and complete project details, content, and feedback on time.</li>
            <li>Ensure that the content/data provided does not violate any third-party copyrights or intellectual property laws.</li>
            <li>Make timely payments as per the agreed schedule.</li>
            <li>Review and approve deliverables as promptly as reasonably possible to avoid project delays.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>All payments are to be made as per the terms outlined in project quotations, proposals, or invoices.</li>
            <li>Late or overdue payments may result in suspension of services until the outstanding amount is paid.</li>
            <li>Clients are responsible for any third-party charges (such as hosting, domain registration, or licensing fees).</li>
            <li>Esta Enterprises Pvt. Ltd. may revise charges as outlined by the client.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 6. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">While we strive to deliver error-free and secure solutions, Esta Enterprises Pvt. Ltd.  shall not be held responsible for:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Downtime, loss of data, or issues arising from third-party hosting or services.</li>
            <li>Issues arising from third-party tools, hosting, or APIs integrated into client systems.</li>
            <li>Any post-launch changes made by the client or their team without our involvement (as the client be fully responsible for any impact caused).</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">  7. Confidentiality</h2>
          <p className="text-gray-700">Both parties agree to maintain confidentiality of all proprietary and project-related information shared during the course of engagement. Confidential information will not be disclosed to any third-party without written consent, except where required by law.</p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
          <p className="text-gray-700">Our website or services may have links to third-party platforms (such as payment gateways, hosting providers, etc.). Esta Enterprises Pvt. Ltd. is not responsible for the privacy practices or content of these external services.</p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
          <p className="text-gray-700 mb-4">Either party may terminate the service agreement by providing written notice under the following conditions:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <strong>By the Client:</strong> The client may cancel the agreement with prior notice, subject to any applicable cancellation fees.
            </li>
            <li>
              <strong>By Esta Enterprises Pvt. Ltd.:</strong> In case of non-payment, violation of terms, or misuse of services, we reserve the right to suspend or terminate services without prior notice or liability of outstanding dues shall have to be paid fully.
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Policy Updates</h2>
          <p className="text-gray-700"> Esta Enterprises Pvt. Ltd. may update these Terms & Conditions at any time. Updates will  be posted on our official website. Continued use of our services after the updates implies acceptance of the revised terms.</p>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-700"> These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Beach, India</strong>.</p>
        </section>

        {/* Section 12 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 mb-4"> For any questions, concerns, or clarifications regarding these Terms & Conditions, please contact us at:</p>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>📧</strong>{' '}
              <a href="mailto:info@estenterprises.com" className=" hover:underline" > info@estenterprises.com </a></p>
            <p>
              <strong>🌐</strong>{' '}
              <a href="https://www.estenterprises.com" target="_blank" rel="noopener noreferrer" className=" hover:underline" > www.estenterprises.com</a> </p>
            <p>
              <strong>📞</strong>{' '}
              <a href="tel:+918547885711" className="" > +91 8547885711</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}