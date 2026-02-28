"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import { Search, FileText, Activity, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface Service {
  _id: string;
  title: string;
  titleTe?: string;
  description: string;
  icon: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    // Split search into words (tokens)
    const tokens = term.split(/\s+/).filter(Boolean);

    // Check if ALL tokens are present in ANY of the fields (Title, Telugu Title, Description)
    // This allows "pension aasara" to match "Aasara Pension"
    return tokens.every(token => {
      const inTitle = service.title.toLowerCase().includes(token);
      const inTe = service.titleTe && service.titleTe.toLowerCase().includes(token);
      const inDesc = service.description.toLowerCase().includes(token);
      return inTitle || inTe || inDesc;
    });
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8 bg-gradient-to-r from-green-50 to-indigo-50 rounded-3xl mb-8 border border-green-100 relative overflow-hidden">
        <div className="relative z-10 px-4">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mb-2">PRAJA PALANA</div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
            Public Connect
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Apply for Rythu Bandhu, Aasara Pensions, Kalyana Lakshmi, and other government schemes easily.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
              placeholder="Search services (e.g., Pension, Rythu, రేషన్)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
        <Link href="/schemes" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 rounded-full mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xs md:text-sm font-medium text-center text-gray-800">Apply for Scheme</span>
        </Link>
        <Link href="/track" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 rounded-full mb-2">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-xs md:text-sm font-medium text-center text-gray-800">Application Status</span>
        </Link>
        <Link href="/complaint" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-50 rounded-full mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <span className="text-xs md:text-sm font-medium text-center text-gray-800">Raise Complaint</span>
        </Link>
      </section>

      {/* Services Grid */}
      <section id="services">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Services</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-md mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                No services found matching your search.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
