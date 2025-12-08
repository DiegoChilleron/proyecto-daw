export const revalidate = 60; //60 seconds

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { notFound, redirect } from "next/navigation";
import { TemplateType } from "../../../../../generated/prisma/client";


interface Props {
  params: Promise<{ type: string }>;
  searchParams: { page?: string };
}

const validTypes = ['corporate', 'portfolio', 'landing', 'blog', 'ecommerce'];

export default async function TemplateTypePage({ params, searchParams }: Props) {

  const { type } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;

  if (!validTypes.includes(type)) {
    notFound();
  }

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page, 
    templateType: type as TemplateType 
  });

  if (products.length === 0) {
    redirect(`/templates/${type}`);
  }

  const labels: Record<string, string> = {
    'corporate': 'Webs Corporativas',
    'portfolio': 'Portfolios',
    'landing': 'Landing Pages',
    'blog': 'Blogs',
    'ecommerce': 'Tiendas Online'
  }

  return (
    <>
      <Title title={labels[type]} subtitle="Plantillas disponibles" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}