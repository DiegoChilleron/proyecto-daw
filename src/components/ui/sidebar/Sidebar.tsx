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
                isSideMenuOpen && (<div onClick={closeMenu} className="sidebar__overlay" />)
            }

            <nav className={clsx("sidebar__nav",
                {
                    "sidebar__nav--open": isSideMenuOpen,
                    "sidebar__nav--closed": !isSideMenuOpen,
                }
            )}>
                <IoCloseOutline size={50} className="sidebar__close" />

                <div className="sidebar__search">
                    <IoSearchOutline size={20} className="sidebar__search-icon" />

                    <input
                        type="text"
                        placeholder="Buscar"
                        className="sidebar__search-input"
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
                <div className="sidebar__divider"></div>

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
