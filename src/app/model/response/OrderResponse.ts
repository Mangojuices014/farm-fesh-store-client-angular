export interface Order {
  completeDate: string;
  id: string;
  businessKey:string;
  orderDetails: OrderDetail[];
  orderInfo: string;
  send_status: boolean;
  shipmentId: string;
  status: string;
  totalItem: number;
  totalPrice: number;
  userId: number;
}

export interface OrderDetail {
  price: number;
  productId: string;
  quantity: number;
  totalPrice: number;
}
