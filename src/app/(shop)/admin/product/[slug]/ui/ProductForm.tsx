'use client';

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage, TemplateType } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


interface Props {
    product: Partial<Product> & { ProductImage?: ProductWithImage[] };
    categories: Category[];
}

const templateTypes: TemplateType[] = ['corporate', 'portfolio', 'landing', 'blog', 'ecommerce'];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    tags: string;
    templateType: TemplateType;
    categoryId: string;
    demoUrl?: string;
    features: string;
    formFields?: string;

    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

    const router = useRouter();

    const {
        handleSubmit, register, formState: { isValid }
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product.tags?.join(', '),
            features: product.features?.join(', ') ?? '',
            formFields: product.formFields ? JSON.stringify(product.formFields, null, 2) : '[]',
            images: undefined,
        },
    });


    const onSubmit = async (data: FormInputs) => {

        const { images, ...productToSave } = data;

        const formData = new FormData();
        if (product.id) { formData.append('id', product.id ?? '') };
        formData.append('title', productToSave.title);
        formData.append('slug', productToSave.slug);
        formData.append('description', productToSave.description);
        formData.append('price', productToSave.price.toString());
        formData.append('tags', productToSave.tags);
        formData.append('templateType', productToSave.templateType);
        formData.append('categoryId', productToSave.categoryId);
        if (productToSave.demoUrl) formData.append('demoUrl', productToSave.demoUrl);
        formData.append('features', productToSave.features);
        if (productToSave.formFields) formData.append('formFields', productToSave.formFields);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        const { ok, product: updatedProduct } = await createUpdateProduct(formData);

        if (!ok) {
            alert('Error al guardar el producto');
            return;
        }

        router.replace(`/admin/product/${updatedProduct?.slug}`);
    };


    return (
        <form className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input type="text" className="p-2 rounded-md bg-gray-200" {...register('title', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input type="text" className="p-2 rounded-md bg-gray-200" {...register('slug', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 rounded-md bg-gray-200" {...register('description', { required: true })}
                    ></textarea>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Precio (€)</span>
                    <input type="number" className="p-2 rounded-md bg-gray-200" {...register('price', { required: true, min: 0 })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags (separados por coma)</span>
                    <input type="text" className="p-2 rounded-md bg-gray-200" {...register('tags', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tipo de plantilla</span>
                    <select className="p-2 rounded-md bg-gray-200" {...register('templateType', { required: true })}>
                        <option value="">[Seleccione]</option>
                        {templateTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Categoría</span>
                    <select className="p-2 rounded-md bg-gray-200" {...register('categoryId', { required: true })}>
                        <option value="">[Seleccione]</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn-primary w-full" >
                    Guardar
                </button>
            </div>

            {/* Campos específicos de plantillas web */}
            <div className="w-full">

                <div className="flex flex-col mb-2">
                    <span>URL de Demo</span>
                    <input type="url" className="p-2 rounded-md bg-gray-200" {...register('demoUrl')} placeholder="https://demo.ejemplo.com" />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Características (separadas por coma)</span>
                    <textarea
                        rows={3}
                        className="p-2 rounded-md bg-gray-200"
                        {...register('features')}
                        placeholder="Responsive, SEO optimizado, Formulario de contacto..."
                    ></textarea>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Campos del formulario (JSON)</span>
                    <textarea
                        rows={8}
                        className="p-2 rounded-md bg-gray-200 font-mono text-sm"
                        {...register('formFields')}
                        placeholder='[{"name": "siteName", "label": "Nombre del sitio", "type": "text", "required": true}]'
                    ></textarea>
                </div>

                <div className="flex flex-col mb-2">

                    <span>Imágenes de la plantilla</span>
                    <input
                        type="file" multiple {...register('images')}
                        className="p-2 rounded-md bg-gray-200"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                    />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {
                        product.ProductImage?.map(image => (

                            <div key={image.id}>

                                <ProductImage alt={product.title ?? ''} src={image.url} width={300} height={300} className="rounded-t shadow-md" />
                                <button onClick={() => deleteProductImage(image.id, image.url)} type="button" className="btn-danger w-full rounded-b-xl">Eliminar</button>

                            </div>
                        ))
                    }
                </div>

            </div>

        </form >
    );
};
