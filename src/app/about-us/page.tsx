import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Easy Lawn Care',
  description: 'Learn more about Easy Lawn Care Guyana, our mission, values, and commitment to providing top-quality lawn care services.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">About Easy Lawn Care Guyana</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700">
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Our Mission</h2>
          <p className="mb-4">
            At Easy Lawn Care Guyana, our mission is simple: to provide exceptional, reliable, and affordable lawn care and landscaping services that enhance the beauty and value of our clients' properties. We strive to make professional lawn care accessible and hassle-free for everyone in Guyana.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Who We Are</h2>
          <p className="mb-4">
            Founded with a passion for green spaces and a commitment to customer satisfaction, Easy Lawn Care has grown into a trusted name in the Guyanese community. Our team is composed of experienced and dedicated professionals who take pride in their work, treating every lawn as if it were their own. We combine local expertise with modern techniques and equipment to deliver outstanding results.
          </p>
          <p className="mb-4">
            We understand the unique climate and horticultural needs of Guyana, allowing us to provide tailored solutions that keep your lawns lush, healthy, and vibrant year-round.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Quality:</strong> We are committed to the highest standards of workmanship in every service we provide.</li>
            <li><strong>Reliability:</strong> You can count on us to be on time and to deliver on our promises.</li>
            <li><strong>Customer Focus:</strong> Our clients are at the heart of everything we do. We listen to your needs and work to exceed your expectations.</li>
            <li><strong>Integrity:</strong> We operate with honesty and transparency in all our dealings.</li>
            <li><strong>Community:</strong> As a local Guyanese business, we are dedicated to contributing positively to our community and environment.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Why Choose Us?</h2>
          <p className="mb-4">
            Choosing Easy Lawn Care means partnering with a team that genuinely cares about your outdoor space. We offer:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Professional and courteous staff</li>
            <li>Competitive and transparent pricing</li>
            <li>Easy online booking and account management</li>
            <li>Customized service plans to fit your specific needs</li>
            <li>A satisfaction guarantee – we're not happy until you are!</li>
          </ul>
          <p>
            Thank you for considering Easy Lawn Care Guyana. We look forward to helping you create and maintain the beautiful lawn you deserve!
          </p>
        </section>
      </div>
    </div>
  );
}
