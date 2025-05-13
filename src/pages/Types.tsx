export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  duration: string;
  popular?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
}
