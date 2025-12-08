
export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {

    // Si nº paginas <= 7, mostrar todas las paginas
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Si pagina actual es <= 3, mostrar primeras 3 paginas, ..., 2 ultimas paginas
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    // Si pagina actual esta entre las 3 ultimas paginas, mostrar 2 primeras paginas, ..., ultimas 3 paginas
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // Si pagina actual esta en el medio, mostrar la 1º pagina, ..., pagina actual, y vecinos.
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];

}
