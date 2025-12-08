
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';


export default async function AdminLayout({ children, }: {
    children: React.ReactNode;
}) {

    // Obtener sesión con Better Auth en Server Component
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Si no hay sesión, redirigir a login
    if (!session?.user) redirect('/auth/login');

    // Si no es admin, redirigir a home
    if (session.user.role !== 'Admin') redirect('/');

    return (
        <>
         <div className="flex text-center">
            <Link href="/admin/" className="btn-secondary">Panel de Administración</Link>
             

            </div>
            {children}
        </>
    );
}
