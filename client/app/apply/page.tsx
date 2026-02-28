"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface Service {
    _id: string;
    title: string;
    requiredDocuments: string[];
    formFields?: {
        name: string;
        label: string;
        type: string;
        required: boolean;
    }[];
}

function ApplyContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { user } = useAuth();
    const router = useRouter();

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [files, setFiles] = useState<{ [key: number]: File }>({});
    const [formData, setFormData] = useState<any>({});
    const [successId, setSuccessId] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            api.get(`/services`).then(res => {
                const found = res.data.find((s: Service) => s._id === id);
                setService(found);
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to apply");
            router.push('/login');
            return;
        }

        // Validate all files are uploaded
        if (service && Object.keys(files).length < service.requiredDocuments.length) {
            alert("Please upload ALL required documents with photos.");
            return;
        }

        if (Object.keys(files).length === 0) {
            alert("At least one photo is required.");
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('serviceId', id as string);

            // Augment formData with map of which file index corresponds to which doc name
            const fileMapping: any = {};
            service?.requiredDocuments.forEach((doc, index) => {
                fileMapping[index] = doc;
            });
            const finalFormData = { ...formData, fileMapping };

            data.append('formData', JSON.stringify(finalFormData));

            // Append files in order
            if (service) {
                service.requiredDocuments.forEach((doc, index) => {
                    if (files[index]) {
                        // We append with the same name 'documents' so multer.array('documents') picks them up
                        // The order is preserved, so index 0 in array corresponds to requiredDocuments[0]
                        data.append('documents', files[index]);
                    }
                });
            }

            const res = await api.post('/applications', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccessId(res.data.applicationId);

            const message = `Hello, I submitted an application for ${service?.title}. Application ID: ${res.data.applicationId}. Please review.`;
            const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

            window.open(waLink, '_blank');

        } catch (error) {
            console.error(error);
            alert("Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    if (!id) return <div className="p-10 text-center text-red-500">Invalid Service ID</div>;
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }
    if (!service) return <div className="p-10 text-center text-red-500">Service not found</div>;

    if (successId) {
        return (
            <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">Your Application ID is <span className="font-mono font-bold text-indigo-600">{successId}</span></p>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-left">
                    <h4 className="flex items-center font-bold text-yellow-800 mb-2">
                        <AlertCircle className="w-4 h-4 mr-2" /> Next Steps
                    </h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                        <li>We have opened WhatsApp for you to send the details to the officer.</li>
                        <li>You can track status using your Application ID.</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button onClick={() => router.push('/')} variant="outline">Back to Home</Button>
                    <Button onClick={() => router.push('/track')}>Track Status</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-indigo-900 mb-2">Apply for {service.title}</h1>
            <p className="text-gray-500 mb-6">Please fill in the details below to submit your request.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Common Fields if not in dynamic list */}
                    {!service.formFields?.some(f => f.name === 'fullName') && (
                        <Input
                            label="Full Name (as per Aadhaar)"
                            value={formData.fullName || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    )}

                    {/* Dynamic Fields */}
                    {service.formFields?.map((field) => (
                        <div key={field.name}>
                            {field.type === 'checkbox' ? (
                                <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
                                    <input
                                        type="checkbox"
                                        id={field.name}
                                        checked={!!formData[field.name]}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                                        required={field.required}
                                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={field.name} className="text-sm text-gray-700">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                </div>
                            ) : (
                                <Input
                                    label={field.label}
                                    type={field.type}
                                    value={formData[field.name] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Upload Required Documents</h3>
                    {service.requiredDocuments.map((doc, index) => (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{doc} <span className="text-red-500">*</span></span>
                                {files && files[index] ? (
                                    <span className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {files[index].name}
                                    </span>
                                ) : (
                                    <label htmlFor={`file-upload-${index}`} className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                        Upload
                                        <input
                                            id={`file-upload-${index}`}
                                            name={`file-${index}`}
                                            type="file"
                                            className="sr-only"
                                            onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const newFiles = { ...files };
                                                    newFiles[index] = e.target.files[0];
                                                    setFiles(newFiles as any);
                                                }
                                            }}
                                            required
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <Button type="submit" className="w-full" isLoading={submitting}>
                    Submit Application
                </Button>
            </form>
        </div>
    );
}

export default function ApplyPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ApplyContent />
        </Suspense>
    );
}
