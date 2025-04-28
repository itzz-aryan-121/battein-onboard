// app/page.tsx with animations
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import './animations.css'; 

export default function Home() {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden font-inter">
            <Head>
                <title>Baatein - India's Leading Voice Platform</title>
                <meta name="description" content="Join Baatein as a partner and earn ₹40,000-₹80,000 monthly" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <main className="max-w-6xl mx-auto px-4 pt-16 pb-32 text-center relative z-10">
                {/* Logo + Header */}
                <div className="flex flex-col items-center mb-6 animate-fadeInDown">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/assets/Baaten Logo 6.png"
                            alt="Baatein Logo"
                            width={64}
                            height={64}
                            className="animate-pulse"
                        />
                        <h1 className="text-5xl font-bold text-[#F5BC1C] ml-4">Baatein</h1>
                    </div>
                </div>

                <h2 className="text-4xl text-[#AFAFAF] font-bold mb-6 animate-fadeInUp delay-200">Welcomes You Aboard</h2>

                {/* Main Pitch */}
                <h3 className="text-[28px] md:text-[32px] font-bold text-black mb-4 animate-fadeInUp delay-300">
                    Earn <span className="text-[#F5BC1C]">₹40,000–₹80,000</span> Monthly as a Baatein Partner
                </h3>
                <p className="text-lg text-[#2D2D2D] mb-8 animate-fadeInUp delay-400">
                    Join 1,000+ partners growing their community and income on India's leading voice platform.
                </p>

                {/* CTA Button */}
                <div className="mb-16 animate-fadeInUp delay-500">
                    <Link href="/language" className="inline-flex items-center bg-[#F5BC1C] text-white font-semibold py-4 px-10 rounded-lg text-lg hover:bg-yellow-500 transition duration-300 button-animate hover-lift">
                        Apply to become a Partner
                        <img src="/assets/icon.png" alt="right-arrow" className="ml-9" width={16} height={16} />
                    </Link>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-70 relative max-w-6xl mx-auto stagger-children">
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
                        <div key={title} className="flex items-start space-x-4 relative animate-fadeInUp hover-lift">
                            <div className="flex-shrink-0">
                                <div className="w-[66px] h-[66px] rounded-full border border-[#F5BC1C] flex items-center justify-center bg-white hover-scale">
                                    <Image
                                        src={icon}
                                        alt={title}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-start text-left flex-1">
                                <h4 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">{title}</h4>
                                <p className="text-sm text-[#AFAFAF] leading-[21px]">{desc}</p>
                            </div>
                            {index < 2 && (
                                <div className="md:block absolute -right-4 top-1/2 -translate-y-1/2">
                                    <img
                                        src="/assets/line.png"
                                        alt="Divider"
                                        width={2}
                                        height={5}
                                        className="opacity-20 h-[100px] w-[2px] bg-[#F5BC1C]"
                                    />
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
                            className="object-bottom animate-waveMove"
                        />
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/assets/wave-middle.png"
                            alt="Middle Wave"
                            className="object-bottom animate-waveMove delay-200"
                            style={{ animationDuration: '16s' }}
                        />
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/assets/wave-bottom.png"
                            alt="Bottom Wave"
                            className="object-bottom animate-waveMove delay-400"
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
                                    <div key={idx} className="relative w-1/4 animate-fadeInUp animate-floatY" style={{ height: `${person.height}px`, animationDelay: `${idx * 0.2}s` }}>
                                        <Image
                                            src={person.src}
                                            alt={person.alt}
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="bottom"
                                            priority
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}