import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Easy Lawn Care',
  description: 'Privacy Policy for Easy Lawn Care Guyana - Learn how we protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            At Easy Lawn Care, we collect information you provide directly to us, such as when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account or sign up for our services</li>
            <li>Book lawn care services</li>
            <li>Contact us for customer support</li>
            <li>Subscribe to our newsletter or communications</li>
          </ul>
          <p className="mb-4">
            This information may include your name, email address, phone number, postal address, 
            and payment information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our lawn care services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Communicate with you about services, offers, and events</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy. We may share your information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>With service providers who assist us in operating our business</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and update your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>File a complaint with regulatory authorities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">6. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience, analyze site usage, 
            and assist in our marketing efforts. You can control cookie settings through your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p><strong>Easy Lawn Care Guyana</strong></p>
            <p>Email: privacy@easylawncare.gy</p>
            <p>Phone: +592-XXX-XXXX</p>
            <p>Address: Georgetown, Guyana</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">8. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>
      </div>
    </div>
  )
}
