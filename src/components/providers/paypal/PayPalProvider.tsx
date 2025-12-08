'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const PayPalProvider = ({ children }: Props) => {
    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
                intent: 'capture',
                currency: 'EUR',
            }}
        >
            {children}
        </PayPalScriptProvider>
    );
};
