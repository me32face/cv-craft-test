'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicy() {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif ,margin: 0, padding: 0' }}>
      {/* Back Button */}
      <button onClick={handleBack} className=" bg-gray-300 text-white hover:bg-gray-400 mt-12 ml-12 w-8 h-8 rounded-full transition-colors" >
        <ArrowLeft size={15} />
      </button>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12  pb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2"> Refund and Cancellation Policy</h1>
          <p className="text-gray-600"> Effective Date: 04/11/2025</p>
          <div className="mt-6 p-4 ">
            <p className="text-gray-700 mb-12"><strong>Company Name:</strong> EERA Enterprises Pvt. Ltd.</p>
            <p className="text-gray-700 mt-2"> At <strong>EERA Enterprises Pvt. Ltd.</strong>, we take pride in delivering high-quality IT solutions, software products, mobile applications, and web development services. Our goal  is to ensure complete satisfaction for our clients while maintaining transparency and fairness   in all transactions. </p>
          </div>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 1. General Policy</h2>
          <p className="text-gray-700"> All payments made to EERA Enterprises Pvt. Ltd. are for services agreed upon in the project  related to software development, website design, digital applications, or related IT solutions.  Since these services involve dedicated effort, time, and resources, refunds are subject to  specific terms and conditions outlined below.</p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 2. Refund Eligibility</h2>
          <p className="text-gray-700 mb-4"> Refunds may be considered under the following circumstances:</p>
          <ul className="space-y-4 text-gray-700">
            <li> <strong>Service not delivered:</strong> If EERA Enterprises Pvt. Ltd. fails to deliver the agreed services within the timeframe outlined in the contract.</li>
            <li> <strong>Project cancellation (before initiation):</strong> If the project has not yet entered the development phase and significant resources have not been allocated.</li>
            <li><strong>Non-delivery of service:</strong> If EERA Enterprises Pvt. Ltd. is unable to deliver the agreed service within the stipulated timeframe due to internal constraints. </li></ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">  3. Non-Refundable Cases </h2>
          <p className="text-gray-700 mb-4">Refunds will not be issued in the following cases:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Once the client has approved the project design, prototypes, or code.</li>
            <li>If development work has already started and milestones have been delivered.</li>
            <li>For domain registration, hosting, SSL certificates, or third-party service charges.</li>
            <li>After project delivery or deployment, or services already completed, tested, and customized.</li>
            <li>For non-tangible/intangible, AMC, or subscription-based services already activated.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 4. Custom Software and Application Projects </h2>
          <p className="text-gray-700 mb-4"> For custom projects (website development, mobile apps, or software), Once the development  process begins, refunds are generally not applicable, as costs are incurred immediately  in planning, designing, and coding.</p>
          <p className="text-gray-700"> However, EERA Enterprises Pvt. Ltd. may, at its discretion, consider partial refunds for unutilized work stages if mutually agreed in writing.</p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. How to Request a Refund </h2>
          <p className="text-gray-700 mb-4"> Clients must submit a refund request in writing to{' '}
            <a href="mailto:refund@eenterprises.in" className="text-red-600 underline"> refund@eenterprises.in</a>{' '}  with:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Transaction details</li>
            <li>Project name or invoice number</li>
            <li>Reason for requesting the refund</li>
          </ul>
          <p className="text-gray-700 mt-4"> Our accounts team will review the request and respond within 7–10 business days. If approved, refunds will be processed through the original mode of payment within 15 working days. </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 6. Changes to This Policy</h2>
          <p className="text-gray-700">EERA Enterprises Pvt. Ltd. reserves the right to update or modify this Refund Policy at any time. The latest version will always be available on our official website. Continued use of our services after such changes constitutes acceptance of the revised policy.</p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 7. Contact Us</h2>
          <p className="text-gray-700 mb-4">For any questions or clarifications regarding our refund policy, please reach out to:</p>
          <div className="space-y-2 text-gray-700">
            <p><strong>📧 </strong>{' '}<a href="mailto:eenterprises.com" className="text-red-600 hover:underline"> eenterprises.com </a></p>
            <p><strong>🌐</strong>{' '}<a href="https://www.eenterprises.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">www.eenterprises.com </a> </p>
            <p><strong>📞</strong>{' '} <a href="tel:+918547020111" className="text-red-600 "> +91-8547020111 </a></p>
          </div>
        </section>
      </div>
    </div>
  );
}