"use client";

import { useAuth } from '@/context/AuthContext';
import { User, Phone, Shield, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { user, dbUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <Skeleton className="h-10 w-48 mb-8" />
                <div className="bg-white rounded-xl shadow-lg border border-indigo-50 overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <div className="px-8 pb-8 relative">
                        <Skeleton className="absolute -top-16 left-8 h-32 w-32 rounded-full border-4 border-white" />
                        <div className="pt-20 space-y-6">
                            <div>
                                <Skeleton className="h-8 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-20 w-full rounded-lg col-span-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-indigo-900 mb-8 flex items-center gap-3">
                <User className="w-8 h-8" /> My Profile
            </h1>

            <div className="bg-white rounded-xl shadow-lg border border-indigo-50 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-md">
                            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600">
                                {dbUser?.name?.charAt(0) || user.phoneNumber?.charAt(1) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{dbUser?.name || 'Citizen'}</h2>
                        <p className="text-gray-500">Telangana Public Services User</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Phone className="text-indigo-500 w-5 h-5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                                <p className="font-medium">{user.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Shield className="text-green-600 w-5 h-5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                                <p className="font-medium capitalize">{dbUser?.role || 'User'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-full">
                            <Calendar className="text-orange-500 w-5 h-5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Member Since</p>
                                <p className="font-medium">
                                    {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    }) : 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
