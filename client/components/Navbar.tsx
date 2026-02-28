"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, dbUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Government Logo Placeholder */}
                            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center font-bold text-white border-2 border-yellow-400">
                                TG
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-tight leading-none">Public Connect</span>
                                <span className="text-xs text-indigo-200 font-medium">Government of Telangana</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Services</Link>
                            {dbUser?.role === 'admin' && (
                                <Link href="/admin/dashboard" className="text-indigo-700 hover:text-indigo-900 font-bold transition-colors">Admin Dashboard</Link>
                            )}
                            <Link href="/complaint" className="text-red-600 hover:text-red-700 font-medium transition-colors">Complaint</Link>
                            {user && (
                                <Link href="/my-applications" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">My Apps</Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="text-sm text-indigo-200 hover:text-white transition-colors flex items-center gap-2">
                                    <User size={16} />
                                    {user.phoneNumber}
                                </Link>
                                <button onClick={logout} className="p-2 hover:bg-indigo-800 rounded-full text-indigo-200 hover:text-white" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-indigo-800">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-indigo-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {user && (
                        <>
                            <Link href="/my-applications" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">My Applications</Link>
                            <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Logout</button>
                        </>
                    )}
                    {!user && (
                        <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white">Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
