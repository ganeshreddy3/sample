import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Search, ShieldCheck, CheckCircle, AlertTriangle, ArrowRight, ArrowUpRight, BadgeCheck, FileSearch, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Index = () => {
  const { t } = useTranslation();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    '/hero-bag.jpg',
    '/hero_slide_2.png',
    '/hero_slide_3.png',
    '/hero_slide_4.png',
    '/hero_slide_5.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-sans selection:bg-[#1C5C48]/30">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 py-16 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Hero */}
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 font-semibold text-xs tracking-wider uppercase border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
              {t('hero.badge')}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              {t('hero.title_verify')} <br/>
              <span className="text-[#1C5C48] italic font-serif leading-[1.1]">{t('hero.title_highlight')}</span><br/>
              {t('hero.title_end')}
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-[#1C5C48] hover:bg-[#134233] text-white rounded-full px-8 h-12 text-base shadow-lg shadow-[#1C5C48]/20 transition-all font-semibold">
                <Link to="/verify">
                  {t('hero.btn_verify')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-blue-700 bg-[#f4f7fa] hover:bg-[#ebf0f5] border-none rounded-full px-8 h-12 text-base font-semibold transition-all">
                <Link to="/products">
                  {t('hero.btn_alerts')}
                </Link>
              </Button>

            </div>
          </div>

          {/* Right Hero */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300 border border-white/50 aspect-[4/3] bg-[#fdfdfd] group">
              <div 
                className="flex w-full h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroImages.map((imgSrc, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0 relative">
                    <img 
                      src={imgSrc} 
                      alt={`FSSAI Verification Demo ${index + 1}`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {heroImages.map((_, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${currentSlide === index ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/40 hover:bg-white/60'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="px-4 py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f0f2ef] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <h3 className="text-4xl font-black text-[#1C5C48] mb-2">50K+</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Licenses Validated</p>
            </div>
            <div className="bg-[#f2f1f8] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <h3 className="text-4xl font-black text-[#5B4FCE] mb-2">99.2%</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Accuracy Rate</p>
            </div>
            <div className="bg-[#f0f2ef] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <h3 className="text-4xl font-black text-[#1C5C48] mb-2">Real-time</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Database Sync</p>
            </div>
            <div className="bg-[#f2f1f8] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
              <h3 className="text-4xl font-black text-[#5B4FCE] mb-2">Instant</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Verification Time</p>
            </div>
          </div>
        </section>

        {/* How to Verify */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Verify</h2>
            <p className="text-slate-500">Three simple steps to ensure the FSSAI license on your processed food is genuine and active.</p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center relative">
            <div className="absolute top-10 left-[15%] right-[15%] h-px bg-slate-200 hidden md:block" />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center group relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[#1C5C48] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#1C5C48]/20 transition-transform group-hover:scale-110 duration-300">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Find the Number</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Locate the 14-digit FSSAI license number usually found on the back of the packaging near the logo.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center group relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[#5B4FCE] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#5B4FCE]/20 transition-transform group-hover:scale-110 duration-300">
                <BadgeCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Enter the Code</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Type or scan the 14-digit code into our verification portal for an instant database lookup.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center group relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[#1C5C48] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#1C5C48]/20 transition-transform group-hover:scale-110 duration-300">
                <FileSearch className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Get Verdict</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Receive immediate manufacturer details, registration validity, and any active safety alerts.</p>
            </div>
          </div>
        </section>

        {/* Deep Validation Bento */}
        <section className="py-24 px-4 bg-[#f4f4f2]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Deep FSSAI Verification</h2>
                <p className="text-slate-600 font-medium">We provide more than just a validity check. We delve into the registration history and safety records of every FSSAI number.</p>
              </div>
              <Link to="/about" className="text-sm font-semibold text-[#1C5C48] flex items-center gap-1 hover:underline mt-4 md:mt-0 pb-1">
                Learn about FSSAI Standards
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
               {/* Row 1, Col 1 (small) */}
               <div className="md:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md">
                 <div className="w-12 h-12 rounded-2xl bg-[#f0f2ef] text-[#1C5C48] flex items-center justify-center mb-16">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Instant License Validation</h3>
                 <p className="text-sm text-slate-500 font-medium mb-12 leading-relaxed">
                   Verify the legitimacy and active status of any 14-digit FSSAI license number in seconds against national records.
                 </p>
                 <div className="mt-auto flex items-center gap-3">
                   <span className="px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-xs font-bold tracking-wide">Active Status</span>
                   <span className="text-xs font-semibold text-slate-400">Real-time API sync</span>
                 </div>
               </div>

               {/* Row 1, Col 2 (wide image card) */}
               <div className="md:col-span-3 bg-[#1C5C48] rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden flex transition-all hover:shadow-md min-h-[300px]">
                 <div className="relative z-10 max-w-[55%] flex flex-col justify-center">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-6">
                     <Search className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Manufacturer Detail Lookup</h3>
                   <p className="text-sm text-green-50/80 font-medium leading-relaxed">
                     Access complete manufacturer info, including registered address, unit type, and production capacity associated with the license.
                   </p>
                 </div>
                 {/* Decorative mock packaging offset to the right */}
                 <div className="absolute top-0 right-0 bottom-0 w-1/2 flex items-center justify-end overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 z-0" />
                    <div className="relative z-10 h-64 w-52 bg-white/90 rounded-l-xl shadow-2xl p-4 flex flex-col gap-2 translate-x-4 border-l border-y border-white">
                       <h4 className="text-[10px] font-black tracking-widest text-[#1C5C48] border-b-2 border-[#1C5C48] pb-1 uppercase">Nutrition Facts</h4>
                       <div className="w-full h-3 bg-slate-200 mt-1" />
                       <div className="w-2/3 h-3 bg-slate-200" />
                       <div className="flex-1 w-full border-t border-slate-300 mt-2 pt-2 flex flex-col gap-1.5">
                          <div className="w-full h-2 bg-slate-200" />
                          <div className="w-full h-2 bg-slate-200" />
                          <div className="w-3/4 h-2 bg-slate-200" />
                          <div className="w-1/2 h-2 bg-slate-200" />
                          <div className="w-full h-2 bg-slate-200 mt-2" />
                          <div className="w-5/6 h-2 bg-slate-200" />
                       </div>
                    </div>
                 </div>
               </div>

               {/* Row 2 (3 cards) */}
               <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
                 <AlertTriangle className="w-5 h-5 text-slate-800 mb-8" />
                 <h4 className="font-bold text-slate-900 mb-3">Safety Alert System</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Immediate notification if the license or associated manufacturer has any recent safety warnings or recalls.</p>
               </div>
               
               <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
                 <Landmark className="w-5 h-5 text-slate-800 mb-8" />
                 <h4 className="font-bold text-slate-900 mb-3">Registry History</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Check the historical compliance and renewal records of the specific registration number.</p>
               </div>
               
               <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
                 <CheckCircle className="w-5 h-5 text-slate-800 mb-8" />
                 <h4 className="font-bold text-slate-900 mb-3">Audit Compliance</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Status of recent site inspections and food safety management systems (FSMS) certifications.</p>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-4 bg-[#f4f4f2]">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#1C5C48] to-[#12382c] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#1C5C48]/20">
             {/* Subdued grain or background texture simulation */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
             
             <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Verify your food's FSSAI license now</h2>
               <p className="text-emerald-100/90 font-medium text-lg mb-10 max-w-xl mx-auto">
                 Join conscious consumers who use The Editorial Guardian to ensure their processed food meets national safety standards.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button asChild size="lg" className="bg-white text-[#1C5C48] hover:bg-slate-50 shadow-xl rounded-full px-8 h-14 font-bold text-base">
                   <Link to="/verify">Verify FSSAI Number</Link>
                 </Button>
                 <Button asChild size="lg" variant="outline" className="border-white/30 text-white rounded-full px-8 h-14 font-bold text-base hover:bg-white/10 hover:border-white/40">
                   <Link to="/products">View Recent Alerts</Link>
                 </Button>
               </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
