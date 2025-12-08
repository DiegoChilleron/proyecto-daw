import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {

    cart: CartProduct[];

    getTotalItems: () => number;

    getSummaryInformation: () => {
        itemsInCart: number;
        subTotal: number;
        tax: number;
        total: number;
    }

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;


    clearCart: () => void;
}

export const useCartStore = create<State>()(

    persist(

        (set, get) => ({

            cart: [],

            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },

            // Cuadro resumen del carrito
            getSummaryInformation: () => {
                const { cart } = get();
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal, 0);
                const taxRate = 0.21; // 21% IVA
                const tax = subTotal * taxRate;
                const total = subTotal + tax;

                return { itemsInCart, subTotal, tax, total };
            },


            // Añade un producto al carrito
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();

                // 1. Revisar si el producto ya existe en el carrito
                const productInCart = cart.some((item) => item.id === product.id);

                if (!productInCart) {
                    set({ cart: [...cart, product] });
                    return;
                }

                // 2. Si existe, actualizar la configuración (reemplazar)
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id) {
                        return { ...item, ...product };
                    }
                    return item;
                });

                set({ cart: updatedCartProducts });
            },

            // Actualiza la cantidad de un producto en el carrito
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id) {
                        return { ...item, quantity };
                    }
                    return item;
                });
                set({ cart: updatedCartProducts });
            },

            // Elimina un producto del carrito
            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter((item) => item.id !== product.id);
                set({ cart: updatedCartProducts });
            },

            clearCart: () => {
                set({ cart: [] });
            },


        }),
        {
            name: 'shopping-cart',
        }
    )
);