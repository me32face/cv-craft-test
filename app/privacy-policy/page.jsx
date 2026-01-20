'use client';

import React from 'react'
import { ArrowLeft } from 'lucide-react';

function PrivacyPolicy() {

    const handleBack = () => {
        window.history.back();
    };
    return (
        <div
            className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif ,margin: 0, padding: 0' }}>
            {/* Back Button */}
            <button onClick={handleBack} className=" bg-gray-300 text-white hover:bg-gray-400 mt-12 ml-12 w-8 h-8 rounded-full transition-colors"><ArrowLeft size={15} />
            </button>
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="mb-9 pb-8">
                    <h1 className="text-4xl font-semibold text-gray-900 mb-2"> Privacy Policy</h1>
                    <p className="text-gray-600"> Last Updated: May 10, 2023</p>
                    <div className="mt-6 pt-5 text-md">
                        <p className="text-gray-700"> At <strong>Esta Enterprises Pvt. Ltd.</strong>, we value the privacy of every client, partner, and visitor who interacts with our website, products, and services. This Privacy  Policy outlines how we collect, use, and protect your personal information. </p>
                        <p className="text-gray-700 mt-8">  By using our website or availing our IT services, you agree to the practices described in this policy. </p>
                    </div>
                </header>

                {/* Section 1 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 1. Information We Collect </h2>
                    <p className="text-gray-700 mb-4">  We collect information to provide better services and enhance user experience. This information may include: </p>
                    <div className="mb-4">
                        <h3 className="text-lg font-semisemibold text-gray-800 mb-2">a)       Personal Information</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>Name, email address, phone number, and company details</li>
                            <li>Billing and payment data (processed securely through authorized gateways)</li>
                            <li>Project or service-related information shared during communication</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semisemibold text-gray-800 mb-2"> b) Non-Personal Information</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>Browser type, IP address, device details, and pages visited</li>
                            <li>Cookies or analytics data used to improve website performance</li>
                        </ul>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 2. How We Use the Information </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Providing, managing, and improving our software, website, and IT services</li>
                        <li>Communicating project updates, invoices, and support</li>
                        <li>Sending promotional updates (only with your consent)</li>
                        <li>Complying with legal and security obligations</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 3. Information Security </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>We use storage, network, and access controls</li>
                        <li>Restricted access to sensitive data within our organization</li>
                        <li>Regular monitoring and updates to maintain security standards</li>
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">  4. Data Sharing and Disclosure </h2>
                    <p className="text-gray-700 mb-4"> We respect your privacy and do <strong>not sell, rent, or trade</strong> your personal information. However, information may be shared in these cases: </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li> <strong>Trusted third-party partners</strong> (e.g., hosting or payment providers) </li>
                        <li> <strong>Government authorities</strong> when required by law or regulation </li>
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 5. Cookies and Tracking Technologies </h2>
                    <p className="text-gray-700"> Our website uses cookies to enhance your browsing experience. You can disable cookies via browser settings, but certain features may not work properly as a result. </p>
                </section>

                {/* Section 6 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 6. Data Retention </h2>
                    <p className="text-gray-700"> We retain your personal information only as long as necessary to fulfill the purpose for which it was collected. Once no longer required, it is securely deleted or anonymized. </p>
                </section>

                {/* Section 7 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 7. Your Rights </h2>
                    <p className="text-gray-700 mb-3">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Access the personal information we hold about you</li>
                        <li>Request deletion of your data (subject to legal obligations)</li>
                        <li>Withdraw consent for marketing at any time</li>
                    </ul>
                    <p className="text-gray-700 mt-4">To exercise these rights, contact us at{' '}<a href="mailto:privacy@estenterprises.in" className="text-red-600 underline" >  privacy@estenterprises.in </a></p>
                </section>

                {/* Section 8 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 8. Third-Party Links </h2>
                    <p className="text-gray-700"> Our website may contain links to third-party websites or services. We are not responsible for their content or privacy practices. Please review their policies before sharing any information. </p>
                </section>

                {/* Section 9 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 9. Changes to This Policy </h2>
                    <p className="text-gray-700"> We may update this Privacy Policy periodically to reflect changes in our operations or legal obligations. Continued use of our services constitutes acceptance of these updates. </p>
                </section>

                {/* Section 10 */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4"> 10. Contact Us </h2>
                    <p className="text-gray-700 mb-4"> For questions or concerns regarding this Privacy Policy, please contact:</p>
                    <div className="space-y-2 text-gray-700">
                        <p> <strong>📧 </strong>{' '} <a href="mailto:privacy@estenterprises.in" className="text-md" > privacy@estenterprises.in </a> </p>
                        <p>  <strong>🌐</strong>{' '} <a href="https://www.estenterprises.com" target="_blank" rel="noopener noreferrer" className="text-md" > www.estenterprises.com </a> </p>
                        <p><strong>📞</strong>{' '}<a href="tel:+918547885711" className="text-md" > +91 85478 85711 </a></p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default PrivacyPolicy;