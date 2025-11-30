// Order related interfaces

export interface IOrderItem {
    title: string;
    price: number;
    quantity: number;
}

export interface ICreateOrderRequest {
    items: IOrderItem[];
    paymentMethod: 'STRIPE' | 'PAYPAL'; 
}

export interface IUpdateOrderStatusRequest {
    orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'; 
}

export interface IOrder {
    id: string;
    userId: string;
    items: IOrderItem[];
    totalAmount: number;
    paymentMethod: 'STRIPE' | 'PAYPAL';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
    paymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}