import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  MdOutlineFastfood, 
  MdOutlineTimer, 
  MdOutlineShoppingBag, 
  MdOutlineAnalytics,
  MdArrowForwardIos 
} from "react-icons/md";
import Footer from "../components/footer";

const popularItems = [
  { name: "Chicken Kottu", price: "LKR 480", tag: "Best Seller", img: "chicken kottu.jpg" },
  { name: "Spicy Crab", price: "LKR 650", tag: "Chef's Special", img: "spicy crab.jpg" },
  { name: "Fish Thiyal", price: "LKR 580", tag: "Traditional", img: "fish thiyal.jpg" },
  { name: "Cheese Kottu", price: "LKR 450", tag: "Cheesy", img: "cheese kottu.jpg" },
];

export default function UserHomePage() {
  const [crowdLevel] = useState("low"); // low | medium | high

  const crowdConfig = {
    low: { label: "Quiet & Fast", color: "bg-accent", light: "bg-accent/10", text: "text-accent" },
    medium: { label: "Moderate Pace", color: "bg-highlight", light: "bg-highlight/10", text: "text-highlight" },
    high: { label: "Peak Hour", color: "bg-red-500", light: "bg-red-500/10", text: "text-red-500" },
  }[crowdLevel];

  return (
    <div className="min-h-screen bg-primary text-secondary font-sans selection:bg-accent/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-bordercolor shadow-sm mb-6 animate-fade-in">
              <span className={`w-2 h-2 rounded-full ${crowdConfig.color} animate-pulse`} />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-70">Canteen Status: {crowdConfig.label}</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight">
              Skip the <span className="text-accent italic font-serif">Wait.</span> <br />
              Savor the <span className="text-highlight">Taste.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-secondary/70 max-w-lg mb-10 leading-relaxed">
              The smartest way to fuel your campus life. Pre-order from your favorite spots and pick up when it's fresh.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="px-10 py-5 bg-secondary text-primary rounded-2xl font-bold text-lg hover:bg-secondary/90 transition-all flex items-center gap-3 group shadow-xl hover:shadow-secondary/20">
                Order Now
                <MdOutlineFastfood className="text-2xl group-hover:rotate-12 transition-transform" />
              </Link>
              <Link to="/orders" className="px-10 py-5 bg-white border border-bordercolor text-secondary rounded-2xl font-bold text-lg hover:border-accent transition-all">
                Track Orders
              </Link>
            </div>
          </div>

          {/* Hero Image / Illustration Area */}
          <div className="relative">
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="homePhoto.jpg" 
                alt="Delicious Food" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-highlight/20 rounded-full blur-3xl -z-0" />
          </div>
        </div>
      </section>

      {/* --- BENTO GRID STATS --- */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Live Crowd Card */}
          <div className={`p-8 rounded-[2rem] ${crowdConfig.light} border border-white flex flex-col justify-between h-64 group overflow-hidden relative`}>
             <div>
                <MdOutlineAnalytics className={`text-4xl ${crowdConfig.text} mb-4`} />
                <h3 className="text-2xl font-bold italic">Live Radar</h3>
                <p className="opacity-70 mt-2 font-medium">Currently {crowdConfig.label} inside the hall.</p>
             </div>
             <div className="flex items-end justify-between">
                <span className={`text-5xl font-black ${crowdConfig.text}`}>
                  {crowdLevel === 'low' ? '15%' : crowdLevel === 'medium' ? '55%' : '90%'}
                </span>
                <div className="w-16 h-1 bg-black/10 rounded-full overflow-hidden">
                  <div className={`h-full ${crowdConfig.color} transition-all duration-1000`} style={{width: '60%'}} />
                </div>
             </div>
          </div>

          {/* Timing Card */}
          <div className="p-8 rounded-[2rem] bg-white border border-bordercolor flex flex-col justify-between h-64 shadow-sm">
             <MdOutlineTimer className="text-4xl text-highlight mb-4" />
             <div>
                <h3 className="text-4xl font-black tracking-tighter">~08 MIN</h3>
                <p className="opacity-60 text-sm font-bold uppercase mt-1">Avg. Prep Time Today</p>
             </div>
          </div>

          {/* Order Bag Card */}
          <div className="p-8 rounded-[2rem] bg-secondary text-primary flex flex-col justify-between h-64 shadow-xl">
             <div className="flex justify-between items-start">
               <MdOutlineShoppingBag className="text-4xl text-accent" />
               <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase">Live</span>
             </div>
             <div>
                <h3 className="text-2xl font-bold">Ready for Pickup</h3>
                <p className="text-primary/60 mt-1">4 orders waiting at counter A</p>
             </div>
          </div>

        </div>
      </section>

      {/* --- POPULAR PICKS (Elegant Carousel) --- */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">Popular Right Now</h2>
              <p className="text-secondary/50 font-medium italic">What your colleagues are loving today</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 font-bold text-accent hover:underline decoration-2">
              Explore Full Menu <MdArrowForwardIos className="text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-lg">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {item.tag}
                  </div>
                </div>
                <h4 className="text-xl font-bold">{item.name}</h4>
                <p className="text-highlight font-black text-lg">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-accent p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-accent/20">
          <div className="relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to break the <br /> 
              queue culture?
            </h2>
            <Link to="/products" className="inline-block bg-secondary text-primary px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
              Get Started Now
            </Link>
          </div>
          {/* Abstract patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>

      <Footer/>
    </div>
  );
}