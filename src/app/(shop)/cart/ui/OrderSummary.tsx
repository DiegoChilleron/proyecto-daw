'use client';

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export const OrderSummary = () => {

    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, tax, total } = useCartStore(useShallow((state) => state.getSummaryInformation()));

    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (itemsInCart === 0 && loaded === true) { router.replace('/empty') }
    }, [itemsInCart, loaded, router])

    if (!loaded) return <p>Cargando...</p>;


    return (
        <>
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>


            <span>Impuestos (21%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
        </>
    )
}
