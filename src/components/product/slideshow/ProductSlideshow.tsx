// Componente importado de SwiperJS

'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { ProductImage } from '../product-image/ProductImage';


interface Props {
    images: string[];
    title: string;
    className?: string;
}


export const ProductSlideshow = ({ images, title, className }: Props) => {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

    return (
        <div className={className}>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties
                }
                spaceBetween={10}
                navigation={true}
                autoplay={{
                    delay: 2500,
                }}
                thumbs={{
                    swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className="product-slideshow__main"
            >

                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <ProductImage width={1024} height={800} src={image} alt={title} className="product-slideshow__image" />
                        </SwiperSlide>
                    ))
                }

            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="product-slideshow__thumbs [&_.swiper-slide]:opacity-40 [&_.swiper-slide-thumb-active]:opacity-100"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <ProductImage width={300} height={300} src={image} alt={title} className="product-slideshow__image" />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};