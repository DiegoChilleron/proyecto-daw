// Componente importado de SwiperJS

'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {

    return (
        <div className={className}>
            <Swiper
                pagination
                navigation={true}
                autoplay={{
                    delay: 2500,
                }}

                modules={[FreeMode, Autoplay, Pagination]}
                className="product-slideshow-mobile"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <Image width={600} height={500} src={`/products/${image}`} alt={title} className="product-slideshow-mobile__image" />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};