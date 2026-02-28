"use client";

import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, MapPin, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function TrackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [appId, setAppId] = useState(searchParams.get('id') || '');
    const [statusData, setStatusData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStatus = async (id: string) => {
        setLoading(true);
        setError('');
        setStatusData(null);
        try {
            const { data } = await api.get(`/applications/track/${id}`);
            setStatusData(data);
        } catch (err) {
            setError('Application ID not found. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setAppId(id);
            fetchStatus(id);
        }
    }, [searchParams]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appId) return;
        router.push(`/track?id=${appId}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="text-green-500 w-12 h-12" />;
            case 'Rejected': return <XCircle className="text-red-500 w-12 h-12" />;
            case 'In Progress': return <Clock className="text-blue-500 w-12 h-12" />;
            default: return <AlertTriangle className="text-yellow-500 w-12 h-12" />;
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" onClick={() => router.back()} className="p-2 rounded-full h-10 w-10">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold text-indigo-900">Track Application</h1>
            </div>

            <form onSubmit={handleTrack} className="flex gap-4 mb-10">
                <Input
                    placeholder="Enter Application ID..."
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    required
                />
                <Button type="submit" isLoading={loading}>
                    <Search className="w-4 h-4 mr-2" /> Track
                </Button>
            </form>

            {error && <p className="text-center text-red-500 bg-red-50 p-4 rounded-xl mb-6">{error}</p>}

            {statusData && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-8">
                    <div className="text-center">
                        {getStatusIcon(statusData.status)}
                        <h2 className="text-2xl font-bold mt-2">{statusData.status}</h2>
                        <p className="text-gray-500 text-sm italic">Tracking ID: {statusData.applicationId}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <span className="text-sm text-gray-500 font-medium">Type</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusData.type === 'Complaint' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                {statusData.type}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-3">
                            <span className="text-sm text-gray-500 font-medium">Service / Subject</span>
                            <span className="font-semibold text-gray-900">{statusData.type === 'Complaint' ? statusData.title : (statusData.serviceId?.title || 'Unknown Service')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-3">
                            <span className="text-sm text-gray-500 font-medium">Submitted On</span>
                            <span className="font-medium text-gray-800">{new Date(statusData.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Description / Details</p>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                                {statusData.description || "No detailed description provided."}
                            </div>
                        </div>

                        {statusData.remarks && (
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Status Update from Officer</p>
                                <p className="text-indigo-900 font-medium">{statusData.remarks}</p>
                            </div>
                        )}

                        {statusData.location && statusData.location.lat && (
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-2">Submitted Location</p>
                                <a
                                    href={`https://www.google.com/maps?q=${statusData.location.lat},${statusData.location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-bold"
                                >
                                    <MapPin className="w-5 h-5" /> View Application Location on Maps
                                </a>
                            </div>
                        )}

                        {statusData.documents && statusData.documents.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-3">Uploaded Evidence / Photos</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {statusData.documents.map((doc: string, idx: number) => (
                                        <a
                                            key={idx}
                                            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${doc}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative rounded-lg overflow-hidden border bg-gray-50 group shadow-sm"
                                        >
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${doc}`}
                                                alt={`Evidence ${idx}`}
                                                className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                                <span className="bg-white px-2 py-1 rounded text-[10px] font-bold shadow">View Original</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading Tracking Information...</div>}>
            <TrackContent />
        </Suspense>
    );
}
