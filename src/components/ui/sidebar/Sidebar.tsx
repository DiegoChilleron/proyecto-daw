'use client'

import { IoCloseOutline, IoSearchOutline, IoTicketOutline, IoLogInOutline, IoShirtOutline, IoPeopleOutline, IoPersonOutline, IoGridOutline } from "react-icons/io5"
import Link from "next/link";
import { useUIStore } from "@/store";
import { clsx } from "clsx";
import { authClient } from "@/lib/auth-client";


export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);

    const { data: session } = authClient.useSession() as { data: { user: { id: string; email: string; name: string; role: 'Admin' | 'User' } } | null }
    const isAuthenticated = !!session?.user;
    const isAdmin = (session?.user?.role === 'Admin');

    return (
        <div>

            {
                isSideMenuOpen && (<div onClick={closeMenu} className="fixed top-0 left-0 w-screen h-screen z-10 bg-black/30 backdrop-filter backdrop-blur-sm fade-in" />)
            }

            <nav className={clsx("fixed z-20 p-5 right-0 top-0 w-[500px] h-screen bg-white shadow-2xl transform transition-all duration-300)",
                {
                    "translate-x-0": isSideMenuOpen,
                    "translate-x-full": !isSideMenuOpen,
                }
            )}>
                <IoCloseOutline size={50} className="absolute top-5 right-5 cursor-pointer" />

                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />

                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />

                </div>

                {isAuthenticated && (
                    <>
                        <Link href="/profile" onClick={closeMenu} className="sidebar__link">
                            <IoPersonOutline size={30} />
                            <span className="sidebar__link-span">Perfil</span>
                        </Link>

                        <Link href="/orders" onClick={closeMenu} className="sidebar__link">
                            <IoTicketOutline size={30} />
                            <span className="sidebar__link-span">Ordenes</span>
                        </Link>

                    </>
                )}

                {!isAuthenticated && (

                    <Link href="/auth/login/" className="sidebar__link" onClick={closeMenu}>
                        <IoLogInOutline size={30} />
                        <span className="sidebar__link-span">Entrar</span>
                    </Link>


                )}


                {isAuthenticated && (
                    <button className="sidebar__link" onClick={() => authClient.signOut()}>
                        <IoLogInOutline size={30} />
                        <span className="sidebar__link-span">Salir</span>
                    </button>

                )}

                {isAdmin && (
                <>
                <div className="w-full h-px bg-gray-200 my-10"></div>

                <Link href="/admin" className="sidebar__link" onClick={closeMenu}>
                    <IoGridOutline size={30} />
                    <span className="sidebar__link-span">Panel de Administración</span>
                </Link>

                <Link href="/admin/products" className="sidebar__link" onClick={closeMenu}>
                    <IoShirtOutline size={30} />
                    <span className="sidebar__link-span">Productos</span>
                </Link>

                <Link href="/admin/orders" className="sidebar__link" onClick={closeMenu}>
                    <IoTicketOutline size={30} />
                    <span className="sidebar__link-span">Ordenes</span>
                </Link>

                <Link href="/admin/users" className="sidebar__link" onClick={closeMenu}>
                    <IoPeopleOutline size={30} />
                    <span className="sidebar__link-span">Usuarios</span>
                </Link>
                </>
                )}
            </nav>
        </div>
    )
}
