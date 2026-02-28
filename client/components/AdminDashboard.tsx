"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { X, MapPin, Phone, User, FileText, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { user, dbUser, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'applications' | 'complaints'>('applications');
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [closeModal, setCloseModal] = useState<{ appId: string; newStatus: string } | null>(null);
    const [remarksInput, setRemarksInput] = useState('');

    useEffect(() => {
        if (authLoading) return;
        if (!user || !dbUser) {
            setDataLoading(false);
            return;
        }
        if (dbUser && dbUser.role === 'admin') {
            const url = filter ? `/admin/applications?status=${filter}` : '/admin/applications';
            api.get(url)
                .then(res => setApplications(res.data))
                .catch(() => {})
                .finally(() => setDataLoading(false));
        } else {
            setDataLoading(false);
        }
    }, [dbUser, filter, user, authLoading]);

    const updateStatus = async (id: string, newStatus: string) => {
        if (newStatus === 'Resolved' || newStatus === 'Rejected') {
            setCloseModal({ appId: id, newStatus });
            return;
        }
        await doUpdateStatus(id, newStatus, '');
    };

    const doUpdateStatus = async (id: string, newStatus: string, remarks: string) => {
        try {
            await api.patch(`/admin/applications/${id}`, { status: newStatus, remarks });
            setApplications(prev => prev.map(app =>
                app._id === id ? { ...app, status: newStatus, remarks } : app
            ));
            setCloseModal(null);
            setRemarksInput('');
            setSelectedApp(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCloseWithRemarks = () => {
        if (!closeModal || !remarksInput.trim()) return;
        doUpdateStatus(closeModal.appId, closeModal.newStatus, remarksInput.trim());
    };

    if (authLoading) return <div className="p-10 text-center">Loading User Authentication...</div>;
    if (dataLoading) return <div className="p-10 text-center">Loading Dashboard Data...</div>;
    if (!dbUser || dbUser.role !== 'admin') return <div className="p-10 text-center text-red-500">Access Denied. Admins only.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Service Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('complaints')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'complaints'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Complaints
                    </button>
                </nav>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab === 'applications' ? 'Service Requests' : 'Citizen Complaints'}
                </h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => setFilter('')} className={!filter ? 'bg-indigo-50' : ''}>All</Button>
                    <Button variant="outline" onClick={() => setFilter('Pending')} className={filter === 'Pending' ? 'bg-yellow-50' : ''}>Pending</Button>
                    <Button variant="outline" onClick={() => setFilter('Resolved')} className={filter === 'Resolved' ? 'bg-green-50' : ''}>Resolved</Button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications
                            .filter(app => {
                                if (activeTab === 'applications') return app.type !== 'Complaint';
                                if (activeTab === 'complaints') return app.type === 'Complaint';
                                return true;
                            })
                            .map(app => (
                                <tr
                                    key={app._id}
                                    onClick={() => setSelectedApp(app)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.applicationId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.userId?.name}<br />
                                        <span className="text-xs">{app.userId?.phone}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.type === 'Complaint' ? (
                                            <div>
                                                <span className="text-red-600 font-medium">Complaint: {app.title}</span>
                                                {app.location && app.location.lat && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3 text-blue-500" />
                                                        <span className="text-xs text-blue-500">Geo-tagged</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            app.serviceId?.title || 'Unknown Service'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full 
                                ${app.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            View
                                        </button>
                                        {app.status !== 'Resolved' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(app._id, 'Resolved'); }}
                                                className="text-green-600 hover:text-green-900 font-medium"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        {app.status !== 'Rejected' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(app._id, 'Rejected'); }}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        {applications.filter(app => activeTab === 'applications' ? app.type !== 'Complaint' : app.type === 'Complaint').length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No {activeTab} found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {selectedApp.type === 'Complaint' ? 'Complaint Details' : 'Application Details'}
                            </h3>
                            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg"><User className="w-5 h-5 text-indigo-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Citizen</p>
                                        <p className="font-medium">{selectedApp.userId?.name || 'Guest'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg"><Phone className="w-5 h-5 text-green-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</p>
                                        <p className="font-medium">{selectedApp.userId?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">App ID</p>
                                        <p className="font-mono font-medium text-indigo-600">{selectedApp.applicationId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg"><CheckCircle className="w-5 h-5 text-yellow-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                                        <p className={`font-medium ${selectedApp.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedApp.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                                    <FileText className="w-5 h-5" /> Information
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Service / Subject</p>
                                        <p className="text-lg font-semibold text-indigo-900">
                                            {selectedApp.type === 'Complaint' ? selectedApp.title : (selectedApp.serviceId?.title || 'Unknown Service')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <div className="mt-1 p-4 bg-white border rounded-xl text-gray-700 whitespace-pre-wrap">
                                            {selectedApp.description || selectedApp.remarks || 'No additional description provided.'}
                                        </div>
                                    </div>
                                    {selectedApp.location && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> Captured Location</p>
                                            <a
                                                href={`https://www.google.com/maps?q=${selectedApp.location.lat},${selectedApp.location.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                View Precise Location on Google Maps
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                                    <CheckCircle className="w-5 h-5" /> Evidence & Photos
                                </h4>
                                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedApp.documents.map((doc: string, idx: number) => (
                                            <div key={idx} className="group relative rounded-xl overflow-hidden border bg-gray-50">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${doc}`}
                                                    alt={`Document ${idx}`}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${doc}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity"
                                                >
                                                    <span className="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Click to Enlarge</span>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 border-2 border-dashed rounded-xl text-center text-gray-400 italic">
                                        No photos uploaded for this record.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex gap-4 justify-end rounded-b-2xl">
                            {selectedApp.status !== 'Resolved' && (
                                <Button onClick={() => { updateStatus(selectedApp._id, 'Resolved'); setSelectedApp(null); }} className="bg-green-600 hover:bg-green-700">Mark as Resolved</Button>
                            )}
                            {selectedApp.status !== 'Rejected' && (
                                <Button variant="danger" onClick={() => { updateStatus(selectedApp._id, 'Rejected'); setSelectedApp(null); }}>Reject</Button>
                            )}
                            <Button variant="outline" onClick={() => setSelectedApp(null)}>Close View</Button>
                        </div>
                    </div>
                </div>
            )}

            {closeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {closeModal.newStatus === 'Resolved' ? 'Resolve Application' : 'Reject Application'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Remarks are required when closing an application.</p>
                        <textarea
                            value={remarksInput}
                            onChange={(e) => setRemarksInput(e.target.value)}
                            placeholder="Enter your remarks (required)..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <div className="flex gap-3 mt-6 justify-end">
                            <Button variant="outline" onClick={() => { setCloseModal(null); setRemarksInput(''); }}>Cancel</Button>
                            <Button
                                onClick={handleCloseWithRemarks}
                                disabled={!remarksInput.trim()}
                                variant={closeModal.newStatus === 'Rejected' ? 'danger' : 'primary'}
                            >
                                {closeModal.newStatus === 'Resolved' ? 'Resolve' : 'Reject'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
