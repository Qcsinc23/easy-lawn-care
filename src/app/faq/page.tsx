import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Easy Lawn Care',
  description: 'Find answers to frequently asked questions about Easy Lawn Care Guyana services, booking, pricing, and more.',
};

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

const faqData: FAQItem[] = [
  {
    question: 'What areas in Guyana do you service?',
    answer: 'Easy Lawn Care Guyana primarily services Georgetown and surrounding areas. Please contact us with your specific location to confirm service availability.',
  },
  {
    question: 'How do I book a service?',
    answer: (
      <>
        You can easily book our services online through our website. Simply navigate to the 'Booking' page, select your desired service, choose a date and time, and provide your address details. You can also call us at <a href="tel:+5926876821" className="text-green-600 hover:underline">592-687-6821</a> to book over the phone.
      </>
    ),
  },
  {
    question: 'What types of lawn care services do you offer?',
    answer: 'We offer a comprehensive range of services including lawn mowing, edging, trimming, fertilization, weed control, garden bed maintenance, and seasonal cleanups. We also provide custom landscaping solutions based on your needs.',
  },
  {
    question: 'How often should I have my lawn serviced?',
    answer: 'The ideal frequency depends on your lawn type, weather conditions, and desired appearance. Typically, weekly or bi-weekly mowing is recommended during peak growing seasons. We can assess your lawn and recommend a suitable schedule.',
  },
  {
    question: 'Do I need to be home during the service?',
    answer: 'No, you do not need to be home as long as our team has safe and clear access to the areas to be serviced. Please ensure pets are secured and any gates are unlocked.',
  },
  {
    question: 'What are your payment options?',
    answer: 'We accept online payments via credit/debit cards through our secure platform. For other payment arrangements, please contact us directly.',
  },
  {
    question: 'What if it rains on my scheduled service day?',
    answer: 'In case of inclement weather, we will contact you to reschedule your service for the next available day that is suitable for you and safe for our team to work.',
  },
  {
    question: 'Are your services pet and child-friendly?',
    answer: 'Yes, we prioritize the safety of your family and pets. We use eco-friendly products where possible and can discuss specific product usage with you if you have concerns.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We understand plans can change. We request at least 24 hours notice for cancellations or rescheduling. Please refer to our Terms of Service for detailed information.',
  },
  {
    question: 'Do you offer one-time services or only regular maintenance plans?',
    answer: 'We offer both! Whether you need a one-time cleanup or regular ongoing maintenance, we can tailor a service plan to fit your needs.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        {faqData.map((item, index) => (
          <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">{item.question}</h2>
            <div className="text-gray-700 prose prose-lg max-w-none">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
