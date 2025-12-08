import { getProductBySlug } from "@/actions";
import { notFound } from "next/navigation";
import { ConfigureForm } from "./ui/ConfigureForm";
import { titleFont } from "@/config/fonts";
import { ProductImage } from "@/components";
import { Metadata } from "next";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
        title: `Configurar ${product?.title ?? 'Plantilla'}`,
        description: `Personaliza tu plantilla ${product?.title}`,
    }
}

export default async function ConfigurePage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className={`${titleFont.className} text-3xl font-bold mb-2`}>
                Configura tu plantilla
            </h1>
            <p className="text-gray-600 mb-8">
                Personaliza los datos de tu sitio web. Podrás modificarlos más tarde si lo necesitas.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Información del producto */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                        <ProductImage
                            src={product.images[0]}
                            alt={product.title}
                            width={400}
                            height={300}
                            className="rounded-lg w-full mb-4"
                        />
                        <h2 className="font-bold text-xl mb-2">{product.title}</h2>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        
                        <div className="border-t pt-4">
                            <p className="font-bold text-2xl text-blue-600">{product.price} €</p>
                            <p className="text-sm text-gray-500">Pago único</p>
                        </div>

                        {product.features && product.features.length > 0 && (
                            <div className="border-t mt-4 pt-4">
                                <h3 className="font-semibold mb-2">Incluye:</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.demoUrl && (
                            <a
                                href={product.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-4 text-center text-blue-600 hover:underline text-sm"
                            >
                                Ver demo →
                            </a>
                        )}
                    </div>
                </div>

                {/* Formulario de configuración */}
                <div className="lg:col-span-2">
                    <ConfigureForm product={product} />
                </div>
            </div>
        </div>
    );
}
