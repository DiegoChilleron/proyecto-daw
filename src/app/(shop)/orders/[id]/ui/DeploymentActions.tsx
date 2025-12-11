'use client';

import { useState } from "react";
import { IoTrash, IoRefresh } from "react-icons/io5";
import { deleteDeployment, deployWebsite } from "@/actions";
import { useRouter } from "next/navigation";

interface Props {
    orderItemId: string;
    status: string;
    isPaid: boolean;
}

export const DeploymentActions = ({ orderItemId, status, isPaid }: Props) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRedeploying, setIsRedeploying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este despliegue? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        const result = await deleteDeployment(orderItemId);
        
        setIsDeleting(false);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        router.refresh();
    };

    const handleRedeploy = async () => {
        if (!confirm('¿Quieres volver a desplegar esta web?')) {
            return;
        }

        setIsRedeploying(true);
        setError(null);

        const result = await deployWebsite(orderItemId);
        
        setIsRedeploying(false);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        router.refresh();
    };

    // Solo mostrar acciones si la orden está pagada
    if (!isPaid) return null;

    return (
        <div className="mt-3 flex flex-col gap-2">
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}

            <div className="flex gap-2">
                {/* Botón Redesplegar - visible si falló o está desplegado */}
                {(status === 'failed' || status === 'deployed' || status === 'pending') && (
                    <button
                        onClick={handleRedeploy}
                        disabled={isRedeploying || isDeleting}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <IoRefresh className={`w-3.5 h-3.5 ${isRedeploying ? 'animate-spin' : ''}`} />
                        {isRedeploying ? 'Desplegando...' : status === 'failed' ? 'Reintentar' : 'Redesplegar'}
                    </button>
                )}

                {/* Botón Eliminar - solo visible si está desplegado */}
                {status === 'deployed' && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting || isRedeploying}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <IoTrash className={`w-3.5 h-3.5 ${isDeleting ? 'animate-pulse' : ''}`} />
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                )}
            </div>
        </div>
    );
};
