'use client';

import { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { deleteDeployment } from "@/actions";
import { useRouter } from "next/navigation";

interface Props {
    orderItemId: string;
    status: string;
    isPaid: boolean;
}

export const DeploymentActions = ({ orderItemId, status, isPaid }: Props) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
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

    // Solo mostrar acciones si la orden está pagada y está desplegado
    if (!isPaid || status !== 'deployed') return null;

    return (
        <div className="mt-3 flex flex-col gap-2">
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <IoTrash className={`w-3.5 h-3.5 ${isDeleting ? 'animate-pulse' : ''}`} />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
        </div>
    );
};
