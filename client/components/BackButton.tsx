"use client";

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/') return null;

    return (
        <button
            onClick={() => router.back()}
            className="mb-4 flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="font-medium">Back</span>
        </button>
    );
}
