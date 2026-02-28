"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface Service {
    _id: string;
    title: string;
    titleTe?: string;
    description: string;
    category?: 'State' | 'Central';
    icon: string;
}

export default function SchemesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'State' | 'Central'>('State');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/services');
                console.log("Services API Response:", data);
                setServices(data || []);
            } catch (err: any) {
                console.error("Failed to fetch services", err);
                setError(err.message || 'Failed to load schemes');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = services.filter(service => {
        // Default to State if no category is present (backward compatibility)
        const category = service.category || 'State';
        console.log(`Service: ${service.title}, Category: ${category}, ActiveTab: ${activeTab}`);
        return category === activeTab;
    });

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Government Schemes</h1>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('State')}
                    className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'State'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Telangana State Schemes
                </button>
                <button
                    onClick={() => setActiveTab('Central')}
                    className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'Central'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    Central Govt Schemes
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl bg-white shadow-sm">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <ServiceCard
                                key={service._id}
                                id={service._id}
                                title={service.title}
                                titleTe={service.titleTe}
                                description={service.description}
                                icon={service.icon || '🏛️'}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            {error ? (
                                <div className="text-red-500">
                                    <p className="font-bold">Error loading schemes</p>
                                    <p className="text-sm">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-gray-400 text-5xl mb-4">📭</div>
                                    <p className="text-gray-500 text-lg">No schemes found in this category.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
