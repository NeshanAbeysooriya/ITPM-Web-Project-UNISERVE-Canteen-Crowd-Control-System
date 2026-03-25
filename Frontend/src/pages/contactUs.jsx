import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Footer from "../components/footer";

export default function ContactUsPage() {
  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["011 452 3698", "011 452 3699"],
      description: "Call us for immediate assistance"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["support@uniserve.com", "admin@uniserve.com"],
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      details: ["SLIIT", "Faculty of Computing", "Malabe, Sri Lanka"],
      description: "Visit our canteen location"
    },
    {
      icon: FaClock,
      title: "Operating Hours",
      details: ["Monday - Friday: 7:30 AM - 8:00 PM", "Saturday: 8:00 AM - 6:00 PM", "Sunday: Closed"],
      description: "When you can reach us"
    }
  ];

  return (
    <div className="bg-primary text-secondary">
      <div className="px-4 py-10 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-accent mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for any questions, feedback, or support. We're here to help make your canteen experience better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-bordercolor hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-accent mb-2">{item.title}</h3>
                    <div className="space-y-1 mb-3">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-bordercolor">
            <h2 className="text-2xl font-bold text-accent mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">Emergency Contact</h3>
                <p className="text-gray-700">For urgent issues outside operating hours:</p>
                <p className="text-gray-700 font-medium">Security Office: 011 250 0000</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">Feedback</h3>
                <p className="text-gray-700">We value your feedback! Use our feedback form in the app or contact us directly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
