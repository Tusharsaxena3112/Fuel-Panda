export interface DeliveryUpdateDTO {
  orderId: string;
  status: "COMPLETED" | "FAILED";
  reason?: string;
}
