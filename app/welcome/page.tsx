'use client'

// components/RegistrationForm.jsx
import { useState } from 'react';
import Image from 'next/image';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    spokenLanguage: '',
    gender: 'Female',
    referralCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
  };

  return (
    <div className="bg-white flex flex-col min-h-screen relative overflow-x-hidden pb-40">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start justify-between px-6 pt-12 pb-0 relative z-10">
        {/* Left: Form */}
        <div className="w-[964px] md:w-[54%]">
          {/* Logo and Heading */}
          <div className="flex items-center mb-2">
            <Image src="/assets/Baaten Logo 6.png" alt="Baatein Logo" width={56} height={56} />
            <span className="ml-3 text-[40px] font-bold text-[#F5BC1C]">Baatein</span>
          </div>
          <h1 className="text-[32px] font-bold text-[#F5BC1C] mb-2 relative w-fit">
            Welcome to Baatein Family
            
          </h1>
          <p className="text-[#2D2D2D] text-lg mb-8">Turn your time into income. Start your journey as a Partner.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Date of Birth <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="Enter Your Date of Birth"
                className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]"
                required
              />
            </div>
            <div>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Spoken Language <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="spokenLanguage"
                value={formData.spokenLanguage}
                onChange={handleChange}
                placeholder="Enter your phone Number"
                className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]"
                required
              />
            </div>
            <div>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Gender <span className="text-[#F5BC1C]">*</span>
              </label>
              <div className="flex gap-2">
                {['Female', 'Male', 'LGBTQIA'].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenderSelect(g)}
                    className={`px-4 py-2 rounded-lg border text-md font-medium ${
                      formData.gender === g
                        ? 'bg-[#F5BC1C] text-white border-[#F5BC1C]'
                        : 'bg-white text-[#F5BC1C] border-[#F5BC1C]'
                    } transition`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Referral Code <span className="text-sm text-[#AFAFAF] font-normal">(Agency Code)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Abx1232yaf"
                className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#484848] mt-2">
              <Image src="/assets/Cloud Security.png" alt="privacy" width={30} height={28} />
              <span className='ml-2'>
                Your data is highly encrypted and never shared with anyone. Your privacy is our top priority.
              </span>
            </div>
            <button
              type="submit"
              className="w-[373px] mx-auto flex justify-center bg-[#F5BC1C] text-white font-semibold text-lg py-3 rounded-lg mt-2 hover:bg-[#e5ac0f] transition"
            >
              Join as a Partner
            </button>
          </form>
        </div>
        {/* Right: Illustration and Ellipses */}
        <div className="hidden md:flex flex-1 items-end justify-end relative min-h-[600px] z-50">
          {/* Floating ellipses */}
          <Image src="/assets/Ellipse 799.png" alt="" width={18} height={18} className="absolute right-10 top-10" />
          <Image src="/assets/Ellipse 802.png" alt="" width={10} height={10} className="absolute right-32 top-24" />
          <Image src="/assets/Ellipse 799.png" alt="" width={14} height={14} className="absolute right-20 top-1/2" />
          <Image src="/assets/Ellipse 799.png" alt="" width={14} height={14} className="absolute right-20 top-1/2" />
          <Image src="/assets/Ellipse 799.png" alt="" width={14} height={14} className="absolute right-20 top-1/2" />
          {/* Illustration */}
          <Image
            src="/assets/long man stand.png"
            alt="Baatein User"
            width={447}
            height={891}
            className="z-50 -mb-10"
            priority
          />
        </div>
      </div>
      {/* Bottom Wave and Ellipses */}
      <div className="absolute left-0 right-0 bottom-0 w-full pointer-events-none z-0">
        <div className="relative w-full h-[220px]">
          {/* Layered Waves */}
          <Image
            src="/assets/wave-bottom.png"
            alt="Wave Bottom"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-10"
            priority
          />
          <Image
            src="/assets/wave-middle.png"
            alt="Wave Middle"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-20"
            priority
          />
          <Image
            src="/assets/wave-top.png"
            alt="Wave Top"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-30"
            priority
          />
          <Image
            src="/assets/wave tangled.png"
            alt="Wave Tangled"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-40"
            priority
          />

          {/* Floating ellipses on wave */}
          <Image
            src="/assets/Ellipse 799.png"
            alt=""
            width={32}
            height={32}
            className="absolute left-[12%] bottom-6 z-50"
          />
          <Image
            src="/assets/Ellipse 802.png"
            alt=""
            width={18}
            height={18}
            className="absolute left-[40%] bottom-10 z-50"
          />
          <Image
            src="/assets/Ellipse 799.png"
            alt=""
            width={24}
            height={24}
            className="absolute right-[18%] bottom-8 z-50"
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;