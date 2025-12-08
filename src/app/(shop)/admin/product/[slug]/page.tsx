
import { getProductBySlug, getCategories } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: { slug: string };

}

export default async function ProductPage({ params }: Props) {
    const { slug } = params;

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ]);



    if (!product && slug !== 'new') { redirect('/admin/products') };

    const title = (slug === 'new') ? 'Crear producto' : `Editar producto: ${product?.title ?? ''}`;

    return (
        <>
            <Title title={title}></Title>
            <ProductForm product={product ?? {}} categories={categories} />
        </>
    );
}