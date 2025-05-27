import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Easy Lawn Care',
  description: 'Get in touch with Easy Lawn Care Guyana. Find our address, phone number, and email for inquiries, support, or quotes.',
};

export default function ContactUsPage() {
  const address = '63a Sandy Babb Street, Georgetown, Guyana';
  const phone = '592-687-6821';
  const email = 'support@easylawncare.gy'; // Assuming a support email

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-12 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-green-600 mb-3 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-green-500" />
              Our Office
            </h2>
            <p className="text-gray-700 leading-relaxed">{address}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline mt-2 inline-block"
            >
              Get Directions
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-600 mb-3 flex items-center">
              <Phone className="w-6 h-6 mr-3 text-green-500" />
              Phone
            </h2>
            <a href={`tel:${phone.replace(/-/g, '')}`} className="text-gray-700 hover:text-green-600 leading-relaxed">
              {phone}
            </a>
            <p className="text-sm text-gray-500 mt-1">Monday - Friday, 8:00 AM - 5:00 PM</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-600 mb-3 flex items-center">
              <Mail className="w-6 h-6 mr-3 text-green-500" />
              Email
            </h2>
            <a href={`mailto:${email}`} className="text-gray-700 hover:text-green-600 leading-relaxed">
              {email}
            </a>
            <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours.</p>
          </section>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-green-600 mb-6">Send Us a Message</h2>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" id="name" autoComplete="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="email-form" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email-form" id="email-form" autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone-form" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
              <input type="tel" name="phone-form" id="phone-form" autoComplete="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Send Message
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Please note: This form is for general inquiries. For service bookings, please use our <a href="/booking" className="text-green-600 hover:underline">online booking system</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
