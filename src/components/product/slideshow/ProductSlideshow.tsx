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
                className="w-full h-auto rounded-lg"
            >

                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <ProductImage width={1024} height={800} src={image} alt={title} className="rounded-lg object-cover w-full h-full" />
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
                className="w-full h-[20%] box-border my-6 [&_.swiper-slide]:opacity-40 [&_.swiper-slide-thumb-active]:opacity-100"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <ProductImage width={300} height={300} src={image} alt={title} className="rounded-lg object-cover w-full h-full" />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};