'use client';

import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { generatePaginationNumbers } from "@/utils";

import Link from "next/link";
import clsx from "clsx";

interface Props {
    totalPages: number;
}


export const Pagination = ({ totalPages }: Props) => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageString = searchParams.get('page') ?? 1;
    const currentPage = isNaN(+pageString) ? 1 : +pageString;

    if (currentPage < 1 || currentPage > totalPages || isNaN(+pageString)) redirect(pathname);

    const allPages = generatePaginationNumbers(currentPage, totalPages);

    const createPageUrl = (pageNumber: number | string) => {

        const params = new URLSearchParams(searchParams);

        if (pageNumber === '...') {
            return `${pathname}?${params.toString()}`;
        }
        if (+pageNumber <= 0) {
            return `${pathname}`;
        }

        if (+pageNumber > totalPages) {
            return `${pathname}?${params.toString()}`;
        }

        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;

    }

    return (

        <nav aria-label="Navegación de páginas" className="pagination">
            <ul className="flex">

                <li>
                    <Link className="pagination__link" href={createPageUrl(currentPage - 1)} ><IoChevronBackOutline size={30} /></Link>
                </li>

                {
                    allPages.map((page, index) => (
                        <li key={page + '-' + index}>
                            <Link href={createPageUrl(page)} className={
                                clsx(
                                    "pagination__link", { 'pagination__link--active': page === currentPage }
                                )
                            }>{page}</Link>
                        </li>
                    ))
                }

                <li>
                    <Link className="pagination__link" href={createPageUrl(currentPage + 1)}><IoChevronForwardOutline size={30} /></Link>
                </li>

            </ul>
        </nav>
    )
}
