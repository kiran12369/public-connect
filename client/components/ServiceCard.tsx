import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
    id: string;
    title: string;
    titleTe?: string;
    description: string;
    icon: string;
}

export default function ServiceCard({ id, title, titleTe, description, icon }: ServiceCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="p-6 flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{icon}</span>
                    <div className="bg-indigo-50 p-2 rounded-full">
                        <FileText className="text-indigo-600 w-5 h-5" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
                {titleTe && <p className="text-sm text-indigo-600 font-medium mb-2">{titleTe}</p>}
                <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Link href={`/apply?id=${id}`} className="flex items-center justify-between text-indigo-600 font-medium hover:text-indigo-800 transition-colors group">
                    Apply Now
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
