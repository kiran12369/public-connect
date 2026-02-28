"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

export default function MyApplicationsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/applications/my-applications')
                .then(res => setApplications(res.data))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return <div className="p-10 text-center">Please login to view your applications.</div>;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-indigo-900">My Applications</h1>

            {applications.length === 0 ? (
                <p className="text-gray-500">You haven't submitted any applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map(app => (
                        <Link
                            key={app._id}
                            href={`/track?id=${app.applicationId}`}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
                        >
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {app.type === 'Complaint' ? app.title : (app.serviceId?.title || 'Unknown Service')}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${app.type === 'Complaint' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {app.type}
                                    </span>
                                    <p className="text-sm text-gray-500 font-mono">ID: {app.applicationId}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    Submitted on {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-3 ml-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                ${app.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {app.status}
                                </span>
                                <span className="text-indigo-600 text-xs font-bold group-hover:underline">Track & View Details →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
