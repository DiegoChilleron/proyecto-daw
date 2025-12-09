import { Product } from "@/interfaces"
import { ProductGridItem } from "./ProductGridItem";

interface Props {
    products: Product[];
}

export const ProductGrid = ({ products }: Props) => {
    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductGridItem key={product.slug} product={product} />
            ))
            }
        </div>
    )
}
