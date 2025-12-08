import { Title } from '@/components';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function ProfilePage() {

    // Obtener sesión con Better Auth en Server Component (no de Prisma)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Protección de páginas privadas
    if (!session?.user) redirect('/auth/login');

    const { user } = session;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Title title="Mi Perfil" />
            <p className="mb-6">Información de tu cuenta</p>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-6 mb-6">

                    <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'X'}
                    </div>


                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la cuenta</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Nombre completo</p>
                            <p className="text-gray-800 font-medium">{user.name}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Correo electrónico</p>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Estado del email</p>
                            <p className="text-gray-800 font-medium">
                                {user.emailVerified ? (
                                    <span className="text-green-600">✓ Verificado</span>
                                ) : (
                                    <span className="text-orange-600">⚠ No verificado</span>
                                )}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Tipo de cuenta</p>
                            <p className="text-gray-800 font-medium">{user.role}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">ID de usuario</p>
                            <p className="text-gray-800 font-medium text-sm">{user.id}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Miembro desde</p>
                            <p className="text-gray-800 font-medium">
                                {new Date(user.createdAt).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}