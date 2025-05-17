'use client';

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUsers, FiSettings, FiDatabase, FiPhone, FiDollarSign, FiUserCheck, FiUserX, FiLogOut, FiMenu, FiX, FiBell } from "react-icons/fi";
import { useRouter, usePathname } from 'next/navigation';
import { PartnerCountsProvider, usePartnerCounts } from '../context/PartnerCountsContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-[#F5BC1C] text-gray-900 shadow-lg' 
          : 'text-gray-100 hover:bg-white/10 hover:text-[#F5BC1C] hover:translate-x-1'
      }`}
    >
      <Icon className={`text-xl ${isActive ? 'transform rotate-6' : ''}`} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

const NavSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="pt-6">
    <p className="px-3 text-xs font-semibold text-[#F5BC1C] uppercase tracking-wider">{title}</p>
    <div className="space-y-1 mt-3">
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { counts } = usePartnerCounts();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#F5BC1C] text-gray-900 hover:bg-[#F5BC1C]/90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F5BC1C] shadow-lg"
      >
        {isMobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-10">
              {/* Battein Logo */}
              <div className="w-12 h-12 relative">
                <Image
                  src="/assets/Baaten Logo 6.png"
                  alt="Battein Logo"
                  width={48}
                  height={48}
                  className="transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#F5BC1C]">Battein</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>

            <nav className="flex-1 space-y-6">
              <NavLink href="/admin" icon={FiUsers}>
                Dashboard
              </NavLink>
              
              <NavSection title="Partner Management">
                <div className="flex items-center justify-between">
                  <NavLink href="/admin/partners/pending" icon={FiUserCheck}>
                    Pending Approval
                  </NavLink>
                  {counts.pending > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {counts.pending}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <NavLink href="/admin/partners/active" icon={FiUsers}>
                    Active Partners
                  </NavLink>
                  {counts.approved > 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {counts.approved}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <NavLink href="/admin/partners/rejected" icon={FiUserX}>
                    Rejected Partners
                  </NavLink>
                  {counts.rejected > 0 && (
                    <span className="ml-2 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {counts.rejected}
                    </span>
                  )}
                </div>
              </NavSection>

              <NavSection title="Operations">
                <NavLink href="/admin/calls" icon={FiPhone}>
                  Call History
                </NavLink>
                <NavLink href="/admin/earnings" icon={FiDollarSign}>
                  Earnings
                </NavLink>
                <NavLink href="/admin/data" icon={FiDatabase}>
                  Analytics
                </NavLink>
              </NavSection>

              <NavSection title="System">
                <NavLink href="/admin/settings" icon={FiSettings}>
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-100 hover:bg-white/10 hover:text-[#F5BC1C] transition-all duration-200 text-left hover:translate-x-1"
                >
                  <FiLogOut className="text-xl" />
                  <span className="font-medium">Logout</span>
                </button>
              </NavSection>
            </nav>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white z-20 border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 lg:px-8 flex items-center justify-end space-x-4">
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <FiBell className="h-5 w-5 text-gray-600" />
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#F5BC1C]/10 flex items-center justify-center">
              <span className="text-sm font-medium text-[#F5BC1C]">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@battein.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <PartnerCountsProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:ml-72 min-h-screen pt-16">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </PartnerCountsProvider>
  );
} 