import Link from "next/link";
import { IoCloudDone, IoTime, IoWarning } from "react-icons/io5";

interface Props {
    status: string;
    deploymentUrl?: string | null;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    pending: {
        label: 'Pendiente',
        icon: <IoTime className="w-4 h-4" />,
        className: 'bg-gray-100 text-gray-700',
    },
    deployed: {
        label: 'Desplegado',
        icon: <IoCloudDone className="w-4 h-4" />,
        className: 'bg-green-100 text-green-700',
    },
    failed: {
        label: 'Error en despliegue',
        icon: <IoWarning className="w-4 h-4" />,
        className: 'bg-red-100 text-red-700',
    },
};

export const DeploymentStatusBadge = ({ status, deploymentUrl }: Props) => {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <div className="flex flex-col gap-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
                {config.icon}
                {config.label}
            </div>
            
            {status === 'deployed' && deploymentUrl && (
                <Link 
                    href={deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                    Ver mi web →
                </Link>
            )}
        </div>
    );
};
