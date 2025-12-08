'use server';

import prisma from "@/lib/prisma";


interface Address {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
}

export const setUserAddress = async (address: Address, userId: string) => {
    try {
 const newAddress = await createOrReplaceAddress(address, userId);
        return {
            ok: true,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al guardar la dirección del usuario',
        }
    }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            city: address.city,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
        };

        if (!storedAddress) {
            // Crear nueva dirección
            const newAddress = await prisma.userAddress.create({
                data: addressToSave,
            });
            return newAddress;
        }


        const updatedAddress = await prisma.userAddress.update({
            where: { userId },
            data: addressToSave,
        });

        return updatedAddress;
        
} catch (error) {
    console.log(error);
    throw new Error('Error al crear o reemplazar la dirección del usuario');
}
}