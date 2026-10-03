declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        firebaseUid?: string;
        role: "CUSTOMER" | "RESTAURANT_OWNER" | "RIDER" | "ADMIN";
        status: "ACTIVE" | "SUSPENDED";
      };
    }
  }
}

export {};
