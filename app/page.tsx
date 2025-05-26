// app/page.tsx with sexy animations
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import './animations.css'; 

export default function Home() {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden font-inter page-transition">
            <Head>
                <title>Baatein - India's Leading Voice Platform</title>
                <meta name="description" content="Join Baatein as a partner and earn ₹40,000-₹80,000 monthly" />
                <link rel="icon" href="/Baaten Logo 6.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-[#F5BC1C] rounded-full animate-particleFloat opacity-60"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-[#FFD700] rounded-full animate-particleFloat delay-200 opacity-50"></div>
                <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-[#FFA500] rounded-full animate-particleFloat delay-400 opacity-70"></div>
                <div className="absolute top-80 right-1/3 w-2.5 h-2.5 bg-[#F5BC1C] rounded-full animate-particleFloat delay-600 opacity-40"></div>
                <div className="absolute top-32 left-2/3 w-2 h-2 bg-[#FFD700] rounded-full animate-particleFloat delay-800 opacity-60"></div>
            </div>

            <main className="max-w-6xl mx-auto px-4 pt-16 pb-32 text-center relative z-10">
                {/* Logo + Header */}
                <div className="flex flex-col items-center mb-6 animate-fadeInDown">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/assets/Baaten Logo 6.png"
                            alt="Baatein Logo"
                            width={64}
                            height={64}
                            className="logo-pulse hover-magnetic"
                        />
                        <h1 className="text-5xl font-bold text-[#F5BC1C] ml-4 animate-textShimmer">Baatein</h1>
                    </div>
                </div>

                <h2 className="text-4xl text-[#AFAFAF] font-bold mb-6 animate-fadeInUp delay-200 text-reveal">
                    Welcomes You Aboard
                </h2>

                {/* Main Pitch */}
                <h3 className="text-[28px] md:text-[32px] font-bold text-black mb-4  delay-300">
                    Earn <span className="text-[#F5BC1C] animate-textShimmer">₹80,000-₹1,00,000</span> Monthly as a Baatein Partner
                </h3>
                <p className="text-lg text-[#2D2D2D] mb-8 animate-fadeInUp delay-400">
                    Join 1,000+ partners growing their community and income on India's leading voice platform.
                </p>

                {/* CTA Button */}
                <div className="mb-16 delay-500 animate-slideInFromBottom">
                    <Link href="/language" className="inline-flex items-center bg-[#F5BC1C] text-white font-semibold py-4 px-10 rounded-lg text-lg hover:bg-yellow-500 transition duration-300 button-animate hover-glow">
                        Apply to become a Partner
                        <img src="/assets/icon.png" alt="right-arrow" className="ml-9 hover-magnetic" width={16} height={16} />
                    </Link>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-70 relative max-w-6xl mx-auto">
                    {[
                        {
                            title: "Multiple Revenue",
                            desc: "Earn through voice rooms, virtual gifts, sponsored events, and premium content",
                            icon: "/assets/multiple-revenue.png"
                        },
                        {
                            title: "Rewards System",
                            desc: "Earn additional rewards based on your lifetime earnings and total time spent on platform",
                            icon: "/assets/rewards.png"
                        },
                        {
                            title: "Weekly Payouts",
                            desc: "Reliable transfers every 7 days directly to your bank account or UPI",
                            icon: "/assets/weekly-payout.png"
                        }
                    ].map(({ title, desc, icon }, index) => (
                        <div key={title} className="flex items-start space-x-4 relative  cursor-pointer">
                            <div className="flex-shrink-0">
                                <div className="w-[66px] h-[66px] rounded-full border border-[#F5BC1C] flex items-center justify-center bg-white hover-magnetic  transition-all duration-300">
                                    <Image
                                        src={icon}
                                        alt={title}
                                        width={32}
                                        height={32}
                                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-start text-left flex-1">
                                <h4 className="text-[18px] font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#F5BC1C] transition-colors duration-300">{title}</h4>
                                <p className="text-sm text-[#AFAFAF] leading-[21px] group-hover:text-gray-600 transition-colors duration-300">{desc}</p>
                            </div>
                            {index < 2 && (
                                <div className="md:block absolute -right-4 top-1/2 -translate-y-1/2">
                                    <div className="opacity-20 h-[100px] w-[2px] bg-gradient-to-b from-[#F5BC1C] to-[#FFD700] animate-pulseGlow"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Wave Background and People */}
            <div className="absolute bottom-0 left-0 right-0 w-full">
                <div className="relative h-[400px]">
                    {/* Wave Background - Three Layers */}
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/assets/wave-top.png"
                            alt="Top Wave"
                            className="w-full h-auto object-cover object-bottom animate-waveMove"
                        />
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/assets/wave-middle.png"
                            alt="Middle Wave"
                            className="w-full h-auto object-cover object-bottom animate-waveMove delay-200"
                            style={{ animationDuration: '16s' }}
                        />
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/assets/wave-bottom.png"
                            alt="Bottom Wave"
                            className="w-full h-auto object-cover object-bottom animate-waveMove delay-400"
                            style={{ animationDuration: '22s' }}
                        />
                    </div>

                    {/* People Illustrations */}
                    <div className="relative bottom-0 w-full top-[50px]">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="flex justify-between items-end stagger-children">
                                {[
                                    { src: "/assets/person-hijab.png", alt: "Person with hijab", height: 280 },
                                    { src: "/assets/person-music.png", alt: "Person with music", height: 300 },
                                    { src: "/assets/person-headphones.png", alt: "Person with headphones", height: 290 },
                                    { src: "/assets/person-phone.png", alt: "Person using phone", height: 270 }
                                ].map((person, idx) => (
                                    <div key={idx} className="relative w-1/4 animate-fadeInUp animate-floatY hover-magnetic" style={{ height: `${person.height}px`, animationDelay: `${idx * 0.2}s` }}>
                                        <Image
                                            src={person.src}
                                            alt={person.alt}
                                            fill
                                            className="object-contain object-bottom transition-transform duration-500 hover:scale-105"
                                            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                                            priority
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Elements */}
            <div className="fixed bottom-8 right-8 z-50">
                <div className="w-12 h-12 bg-[#F5BC1C] rounded-full flex items-center justify-center animate-pulseGlow hover-magnetic cursor-pointer shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
            </div>
        </div>
    );
}