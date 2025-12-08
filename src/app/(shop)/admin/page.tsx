import { Title } from '@/components';
import Link from 'next/link';


export default async function AdminPage() {


    return (
        <div>
            <Title title="Panel de Administración" />

                    <div className="flex gap-8 py-62 text-center">
                <Link href="/admin/users" className="btn-secondary w-full">Usuarios</Link>
                <Link href="/admin/products" className="btn-secondary w-full">Productos</Link>
                <Link href="/admin/orders" className="btn-secondary w-full">Ordenes</Link>

            </div>
        </div>
    );
}