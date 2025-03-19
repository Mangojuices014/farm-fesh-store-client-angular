export interface Order {
  orderInfo: string;
  shipment: Shipment;
  details: OrderDetail;
}

export interface Shipment {
  address: string;
  phone: string;
  email: string;
  customerName: string;
}

export interface OrderDetail {
  productId: string;
  quantity: number;
}
