
import { Product } from "@/interfaces"
import Link from "next/link";
import { ProductImage } from "@/components/product/product-image/ProductImage";

interface Props {
    product: Product;
}

export const ProductGridItem = ({ product }: Props) => {

    return (

        <div className="rounded-md overflow-hidden fade-in group">

            <Link href={`/product/${product.slug}`}>

                <ProductImage 
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full object-cover rounded group-hover:hidden"
                    width={500}
                    height={500} />

                <ProductImage 
                    src={product.images[1] || product.images[0]}
                    alt={product.title}
                    className="w-full object-cover rounded group-hover:block hidden"
                    width={500}
                    height={500} />
            </Link>

            <div className="p-4 flex flex-col">
                <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>{product.title}</Link>
                <span className="font-bold">{product.price} €</span>
            </div>

        </div>

    )
}
