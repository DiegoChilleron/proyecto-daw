import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function CheckoutLayout({ children }: {
  children: React.ReactNode;
}) {

  // Obtener sesión con Better Auth en Server Component
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Protección de páginas privadas
  if (!session?.user) redirect('/auth/login');

  return (
    <>
      {children}
    </>
  );
}