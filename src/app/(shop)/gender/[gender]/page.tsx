export const revalidate = 60; //60 seconds

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { notFound, redirect } from "next/navigation";
import { Gender } from "../../../../../generated/prisma/client";


interface Props {
  params: Promise<{ gender: string }>;
  searchParams: { page?: string };
}

export default async function GenderByPage({ params, searchParams }: Props) {

  const { gender } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos'
  }

  if (!['men', 'women', 'kid', 'unisex'].includes(gender)) {
    notFound();
  }

  return (
    <>
      <Title title={`Artículos ${labels[gender]}`} subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}