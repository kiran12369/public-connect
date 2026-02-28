"use client";

import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
    () => import('@/components/AdminDashboard'),
    { ssr: false, loading: () => <div className="p-10 text-center">Loading Admin Dashboard...</div> }
);

export default function AdminDashboardPage() {
    return <AdminDashboard />;
}
