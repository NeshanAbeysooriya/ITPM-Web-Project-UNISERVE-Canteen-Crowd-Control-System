import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { MdFastfood, MdPeopleOutline, MdAccessTime } from 'react-icons/md'; // or any icon lib you use

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com/yourcanteen", label: "Facebook" },
    { icon: FaInstagram, href: "https://instagram.com/yourcanteen", label: "Instagram" },
    { icon: FaTwitter, href: "https://x.com/yourcanteen", label: "X / Twitter" },
    { icon: FaTiktok, href: "https://tiktok.com/@yourcanteen", label: "TikTok" },
  ];

  const quickLinks = [
    { name: "Pre-Order Now", href: "/menu" },
    { name: "My Orders", href: "/orders" }, 
    { name: "Menu & Prices", href: "/menu" },
    { name: "Contact Us", href: "/contact" },
    { name: "How Pre-Order Works", href: "/how-it-works" },
  ];

  return (
    <footer className="bg-secondary text-primary border-t border-bordercolor/30 pt-16 pb-10 px-6 md:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Decorative top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-accent via-highlight to-accent rounded-full mb-12 opacity-80 max-w-xs mx-auto" />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* 1. Brand + Tagline */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-3.5xl font-bold font-serif tracking-tight mb-4">
              <span className="text-accent">Uni</span>
              <span className="text-highlight">Serve</span>
            </h2>
            <p className="text-primary/80 text-sm md:text-base leading-relaxed max-w-xs mx-auto md:mx-0">
              Skip the queue. Pre-order your favorite meals and enjoy faster pickup with real-time crowd updates.
            </p>

            {/* Quick value icons */}
            <div className="flex justify-center md:justify-start gap-6 mt-6 text-accent/90">
              <div className="flex flex-col items-center">
                <MdFastfood size={28} />
                <span className="text-xs mt-1 opacity-80">Pre-Order</span>
              </div>
              <div className="flex flex-col items-center">
                <MdPeopleOutline size={28} />
                <span className="text-xs mt-1 opacity-80">Live Crowd</span>
              </div>
              <div className="flex flex-col items-center">
                <MdAccessTime size={28} />
                <span className="text-xs mt-1 opacity-80">Save Time</span>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-accent mb-5 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-primary/85">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-highlight transition-colors duration-300 hover:translate-x-1.5 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-accent mb-5 uppercase tracking-wider">
              Get in Touch
            </h3>
            <address className="not-italic space-y-4 text-primary/85">
              <p>
                <span className="font-medium text-highlight block">Phone</span>
                <a href="tel:0114523698" className="hover:text-accent transition duration-300">
                  011 452 3698
                </a>
              </p>
              <p>
                <span className="font-medium text-highlight block">Email</span>
                <a
                  href="mailto:support@uniserve.com"
                  className="hover:text-accent transition duration-300"
                >
                  support@uniserve.com
                </a>
              </p>
              <p>
                <span className="font-medium text-highlight block">Support Hours</span>
                Mon–Fri: 7:30 AM – 8:00 PM
              </p>
            </address>
          </div>

          {/* 4. Social + Newsletter hint */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-accent mb-5 uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start gap-5 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/80 hover:text-highlight transition duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <link.icon className="w-7 h-7" />
                </a>
              ))}
            </div>

            <p className="text-sm text-primary/70">
              Join our updates for daily specials & crowd alerts
            </p>
            {/* Optional small CTA – can link to newsletter */}
            <a
              href="/newsletter"
              className="mt-4 inline-block text-sm font-medium text-highlight hover:text-accent transition"
            >
              Subscribe →
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-bordercolor/40 text-center text-sm text-primary/60">
          <p>
            © {currentYear} UniServe. All rights reserved. 
            <span className="mx-3">|</span>
            <a href="/privacy" className="hover:text-accent transition">Privacy Policy</a>
            <span className="mx-3">|</span>
            <a href="/terms" className="hover:text-accent transition">Terms of Service</a>
          </p>
          <p className="mt-3 opacity-75">
            Made with ♥ for faster, smarter canteen experiences
          </p>
        </div>
      </div>
    </footer>
  );
}