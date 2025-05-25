import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Easy Lawn Care',
  description: 'Terms of Service for Easy Lawn Care Guyana - Learn about our service terms and conditions.',
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Easy Lawn Care's services, you accept and agree to be bound by the 
            terms and provision of this agreement. If you do not agree to abide by the above, please 
            do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">2. Service Description</h2>
          <p className="mb-4">
            Easy Lawn Care provides professional lawn care and landscaping services in Guyana, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Lawn mowing and trimming</li>
            <li>Garden maintenance and landscaping</li>
            <li>Weed control and fertilization</li>
            <li>Custom lawn care solutions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">3. Booking and Scheduling</h2>
          <p className="mb-4">
            Service bookings are subject to availability and weather conditions. We reserve the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Reschedule services due to weather or other circumstances beyond our control</li>
            <li>Require a minimum 24-hour notice for cancellations</li>
            <li>Charge a cancellation fee for same-day cancellations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">4. Payment Terms</h2>
          <p className="mb-4">
            Payment is due upon completion of services unless otherwise arranged. We accept:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Online payments via credit/debit cards</li>
            <li>Bank transfers</li>
            <li>Cash payments (where applicable)</li>
          </ul>
          <p className="mb-4">
            Late payments may incur additional fees. Continued non-payment may result in service suspension.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">5. Service Guarantee</h2>
          <p className="mb-4">
            We guarantee the quality of our work. If you're not satisfied with our service, please 
            contact us within 48 hours, and we will work to resolve any issues at no additional cost.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">6. Liability and Insurance</h2>
          <p className="mb-4">
            Easy Lawn Care maintains appropriate insurance coverage. However, our liability is limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The cost of the specific service provided</li>
            <li>Direct damages caused by our negligence</li>
          </ul>
          <p className="mb-4">
            We are not liable for indirect, consequential, or punitive damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">7. Customer Responsibilities</h2>
          <p className="mb-4">Customers are responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing safe and clear access to the service area</li>
            <li>Securing pets during service visits</li>
            <li>Removing valuable or breakable items from work areas</li>
            <li>Providing accurate contact and address information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">8. Privacy and Data Protection</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our Privacy Policy to understand how we 
            collect, use, and protect your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">9. Dispute Resolution</h2>
          <p className="mb-4">
            Any disputes arising from these terms will be resolved through:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Direct negotiation between the parties</li>
            <li>Mediation if necessary</li>
            <li>Jurisdiction of Guyanese courts</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">10. Contact Information</h2>
          <p className="mb-4">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p><strong>Easy Lawn Care Guyana</strong></p>
            <p>Email: support@easylawncare.gy</p>
            <p>Phone: +592-XXX-XXXX</p>
            <p>Address: Georgetown, Guyana</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">11. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Changes will be effective 
            immediately upon posting. Continued use of our services constitutes acceptance of modified terms.
          </p>
        </section>
      </div>
    </div>
  )
}
