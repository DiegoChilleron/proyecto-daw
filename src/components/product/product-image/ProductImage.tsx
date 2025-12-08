import Image from "next/image";

interface Props {
    src?: string;
    alt: string;
    className?: React.HTMLAttributes<HTMLImageElement>['className'];
    width: number;
    height: number;
}
    
export const ProductImage = ({ src, alt, className, width, height }: Props) => {

    const localSrc = (src)
        ? src.startsWith('http')
            ? src 
            : `/products/${src}`
        : '/imgs/placeholder.webp';

    return (
        <Image src={localSrc} width={width} height={height} alt={alt} className={className} />
    )
}
