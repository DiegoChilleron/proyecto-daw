import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Almacenar la direccion con Zustand
interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
        rememberAddress: boolean;
    }
    setAdress: (address: State['address']) => void;


}



export const useAddressStore = create<State>()(
    persist(

        (set, get) => ({
            address: {
                firstName: '',
                lastName: '',
                address: '',
                address2: '',
                postalCode: '',
                city: '',
                country: '',
                phone: '',
                rememberAddress: false,
            },

            setAdress: (address) => {
                set({ address });
            },
        }),

        // lo guarda en el local storage, nombre 'address-storage'
        {
            name: 'address-storage',
        }
    )
);
