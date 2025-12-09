'use server';

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deployOrderWebsites } from "../deploy/deploy-website";

export const paypalCheckPayment = async (paypalTransactionId: string) => {

    const authToken = await getPaypalBearerToken();
    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de PayPal'
        }
    }


    const resp = await verifyPayPalPayment(paypalTransactionId, authToken);

    if (!resp) {
        return {
            ok: false,
            message: 'No se pudo verificar el pago con PayPal'
        }
    }

    const {status, purchase_units} = resp;
    const {invoice_id: orderId} = purchase_units[0];

    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: `El pago no está completado. Status: ${status}`
        }
    }

    try {

        await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true, paidAt: new Date() }
        });

        // Iniciar el despliegue de las webs de la orden
        // Se ejecuta en segundo plano para no bloquear la respuesta
        deployOrderWebsites(orderId).then((results) => {
            console.log(`[PayPal] Despliegue completado para orden ${orderId}:`, results);
        }).catch((error) => {
            console.error(`[PayPal] Error en despliegue para orden ${orderId}:`, error);
        });

        revalidatePath(`/orders/${orderId}`);

        return {
            ok: true,
        };


    } catch (error) {
        return {
            ok: false,
            message: 'Error al verificar el pago con PayPal'
        }
    }

};


const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`, 'utf-8').toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(oauth2Url, requestOptions).then(r => r.json());
        return result.access_token;

    } catch (error) {
        console.log('Error obteniendo token de PayPal', error);
        return null;
    }
}




const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse|null> => {

const paypalOrdersUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${bearerToken}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
};

try {
  const resp = await  fetch(paypalOrdersUrl, requestOptions).then(r => r.json());
  return resp;
} catch (error) {
    console.log('Error verificando pago en PayPal', error);
    return null;

}
}