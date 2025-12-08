
export const revalidate = 0;

import { getPaginatedUsers } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { IoCardOutline } from 'react-icons/io5';
import { UsersTable } from './UsersTable';

export default async function OrdersPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) { redirect('/auth/login') };


  return (
    <>
      <Title title="Administración de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
        {/* <Pagination totalPages={1} currentPage={1} /> */} {/* Paginacion sin implementar */}
      </div>
    </>
  );
}