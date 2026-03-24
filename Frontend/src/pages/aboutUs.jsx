import { Link } from "react-router-dom";
import {
  MdTimer,
  MdPeople,
  MdPhoneIphone,
  MdFastfood,
  MdDashboard,
  MdTrendingUp,
  MdRestaurantMenu,
  MdArrowForward,
} from "react-icons/md";
import Footer from "../components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-primary text-secondary selection:bg-accent/30">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-sm uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              The Future of Campus Dining
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              Eat <span className="text-accent">Smart.</span> <br /> 
              Wait <span className="text-highlight">Less.</span>
            </h1>
            <p className="text-xl text-secondary/70 max-w-lg mb-10 leading-relaxed">
              UniServe bridges the gap between hungry students and busy canteens using 
              real-time crowd analytics and seamless pre-ordering.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-accent transition-all duration-300 shadow-xl shadow-secondary/10">
                Start Ordering
              </Link>
              <Link to="/how-it-works" className="px-8 py-4 bg-white border border-bordercolor font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300">
                How it works
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Main Image Placeholder: A student happily picking up a fresh meal */}
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="ordering.jpg" 
                alt="Student picking up food" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Floating UI Elements */}
            <div className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">🟢</div>
                <div>
                  <p className="text-xs text-secondary/50 font-bold uppercase">Canteen Status</p>
                  <p className="font-bold">Low Crowd</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-bordercolor">
               <MdTimer className="text-highlight text-3xl mb-2" />
               <p className="font-black text-2xl">12 min</p>
               <p className="text-sm text-secondary/60">Average Wait Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION BENTO --- */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-12 rounded-[3rem] border border-bordercolor flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                 <MdFastfood size={140} />
               </div>
               <h2 className="text-4xl font-black mb-6 italic">Our Mission</h2>
               <p className="text-2xl text-secondary/80 leading-snug">
                 "We’re ending the 'starving student' era. No more 20-minute lines for a sandwich. 
                 We build tech that respects your time and your appetite."
               </p>
            </div>
            <div className="bg-accent p-12 rounded-[3rem] text-white flex flex-col justify-end relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
               <h3 className="text-5xl font-black mb-2">98%</h3>
               <p className="text-white/80 font-medium">User satisfaction rate across campus trials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CROWD RADAR (Modern Visual) --- */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">The Crowd Radar</h2>
            <p className="text-secondary/60 text-lg">Real-time data at your fingertips.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { status: "Chill", color: "bg-green-500", img: "chill.jpg", desc: "Plenty of seats. Walk right in." },
              { status: "Steady", color: "bg-yellow-500", img: "steady.jpg", desc: "A little buzz, but moving fast." },
              { status: "Busy", color: "bg-red-500", img: "busy.jpg", desc: "High traffic. Definitely pre-order." },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-80 rounded-[2rem] overflow-hidden mb-6">
                  <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={item.status} />
                  <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-white font-bold text-sm ${item.color}`}>
                    {item.status}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.status} Mode</h3>
                <p className="text-secondary/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STEPS (Minimalist) --- */}
      <section className="py-24 bg-secondary text-white rounded-[4rem] mx-4 my-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-16 text-center">How Magic Happens</h2>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: MdPhoneIphone, title: "Choose", desc: "Browse daily specials" },
              { icon: MdTimer, title: "Schedule", desc: "Pick your pickup slot" },
              { icon: MdDashboard, title: "Track", desc: "Watch the kitchen prep" },
              { icon: MdFastfood, title: "Enjoy", desc: "Grab and go in seconds" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-accent text-4xl mb-6"><step.icon /></div>
                <h3 className="text-xl font-bold mb-2">{i+1}. {step.title}</h3>
                <p className="text-white/50 text-sm">{step.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-5 -right-6 text-white/10 text-4xl"><MdArrowForward /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VISION CTA --- */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">
            Ready to reclaim your <span className="text-highlight">lunch break?</span>
          </h2>
          <Link
            to="/menu"
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-accent/20"
          >
            Join the Food Revolution <MdArrowForward />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}