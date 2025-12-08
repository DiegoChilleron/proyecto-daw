import { Size } from './product.interface';

export interface Order {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    transactionId?: string | null;
    orderItems?: OrderItem[];
    orderAddress?: OrderAddress;
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size: Size;
    orderId: string;
    productId: string;
    product?: {
        id: string;
        title: string;
        slug: string;
        productImages?: Array<{ url: string }>;
    };
}

export interface OrderAddress {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string | null;
    postalCode: string;
    city: string;
    phone: string;
    countryId: string;
    orderId: string;
    country?: {
        id: string;
        name: string;
    };
}
