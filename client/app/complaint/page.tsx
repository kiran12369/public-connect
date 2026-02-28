"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Upload, AlertTriangle } from 'lucide-react';

export default function ComplaintPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
    const [locating, setLocating] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocating(false);
            },
            (err) => {
                console.error(err);
                alert('Unable to retrieve your location');
                setLocating(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('type', 'Complaint');
        formData.append('title', title);
        formData.append('remarks', description); // Using remarks field for description temporarily or add separate description
        // Actually, we added description to model, let's use that if controller supports it.
        // Assuming controller just takes req.body, but for file upload it expects form-data.
        // Let's pass description in formData map or separate field.
        // Our controller logic for applications might need a tweak to accept 'title' and 'description' at top level.
        // For now, let's look at ApplicationController.createApplication.

        formData.append('description', description);

        if (location) {
            formData.append('location', JSON.stringify(location));
        }

        if (file) {
            formData.append('documents', file);
        }

        try {
            const { data } = await api.post('/applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`Complaint Submitted Successfully! ID: ${data.applicationId}`);
            router.push('/track');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-48 mb-8" />
                <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-8 h-8" /> Raise a Complaint
            </h1>
            <p className="text-gray-600 mb-8">Report an issue or grievance to the government.</p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-red-50">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <Input
                        placeholder="e.g., Road repair needed in Hyderabad"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        rows={5}
                        placeholder="Describe your issue in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            onClick={handleGetLocation}
                            variant="outline"
                            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                            disabled={locating}
                        >
                            {locating ? 'Fetching...' : '📍 Auto-Fetch Location'}
                        </Button>
                        {location && (
                            <span className="text-sm text-green-600 font-medium fa-fade">
                                Location Captured! ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attach Photo <span className="text-red-500">*</span></label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                    {file ? file.name : "Click to upload image (Required)"}
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept="image/*"
                                required
                            />
                        </label>
                    </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" isLoading={loading}>
                    Submit Complaint
                </Button>
            </form>
        </div>
    );
}
