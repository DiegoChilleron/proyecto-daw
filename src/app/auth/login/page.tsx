
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {RegisterForm} from '@/app/auth/RegisterForm'



export default async function ProfilePage() {

  // Obtener sesión con Better Auth en Server Component
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Protección: Si ya hay sesión activa, redirigir al home
  if (session?.user) redirect('/');

  return (

    <RegisterForm />

  )
}