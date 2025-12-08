'use client'

import Link from "next/link"
import { titleFont } from "@/config/fonts";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";
import { useEffect, useState } from "react";


export const TopMenu = () => {

    const openSideMenu = useUIStore(state => state.openSideMenu);
    const totalItemsInCart = useCartStore(state => state.getTotalItems());


    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);


    return (
        <nav className="flex px-5 justify-between items-center w-full">
            <div>
                <Link href="/">
                    <span className={`${titleFont.className} antialiased font-bold`}>WebFactory</span>
                    <span> | Webs</span>
                </Link>
            </div>

            {/* Menú central */}
            <div className="hidden sm:block">
                <Link className="m-2 p-2 rounded-md trnsition-all hover:bg-gray-100" href="/templates/corporate">Corporativas</Link>
                <Link className="m-2 p-2 rounded-md trnsition-all hover:bg-gray-100" href="/templates/portfolio">Portfolios</Link>
                <Link className="m-2 p-2 rounded-md trnsition-all hover:bg-gray-100" href="/templates/landing">Landing Pages</Link>
                <Link className="m-2 p-2 rounded-md trnsition-all hover:bg-gray-100" href="/templates/blog">Blogs</Link>
            </div>

            {/* Busqueda, carrito, menu */}
            <div className="flex items-center gap-x-4">
                <Link href="/search">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>

                <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : '/cart'}>
                    <div className="relative">
                        {
                            (loaded && totalItemsInCart > 0) && (
                                <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">{totalItemsInCart}</span>
                            )
                        }
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button onClick={openSideMenu} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">Menú</button>
            </div>
        </nav>
    )
}
