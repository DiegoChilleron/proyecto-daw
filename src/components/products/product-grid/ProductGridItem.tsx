
import { Product } from "@/interfaces"
import Link from "next/link";
import { ProductImage } from "@/components/product/product-image/ProductImage";

interface Props {
    product: Product;
}

export const ProductGridItem = ({ product }: Props) => {

    return (

        <div className="product-grid__item">

            <Link href={`/product/${product.slug}`}>

                <ProductImage 
                    src={product.images[0]}
                    alt={product.title}
                    className="product-grid__image product-grid__image--default"
                    width={500}
                    height={500} />

                <ProductImage 
                    src={product.images[1] || product.images[0]}
                    alt={product.title}
                    className="product-grid__image product-grid__image--hover"
                    width={500}
                    height={500} />
            </Link>

            <div className="product-grid__info">
                <Link className="product-grid__title" href={`/product/${product.slug}`}>{product.title}</Link>
                <span className="product-grid__price">{product.price} €</span>
            </div>

        </div>

    )
}
