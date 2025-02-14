// razorpay.d.ts (ensure this file is in your project)

declare global {
  interface RazorpayInstance {
    open: () => void;
    close: () => void;
    on: (event: string, callback: Function) => void;
    off: (event: string, callback: Function) => void;
    // Add other methods as per Razorpay's documentation
    paymentSuccess: (data: any) => void;
    paymentError: (error: any) => void;
    // Constructor signature
    new (options: RazorpayOptions): RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    handler: (response: any) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
    order_id?: string;
  }

  var Razorpay: RazorpayInstance; // Declares Razorpay as a global variable of type RazorpayInstance
}

export {}; // This ensures the file is treated as a module
