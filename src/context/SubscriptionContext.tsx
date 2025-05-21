import React, { createContext, useContext, useState, useEffect } from "react";
import { getSubscriptionStatus } from "../services/Subscription";
import toast from "react-hot-toast";

interface SubscriptionContextType {
  planType: "basic" | "premium" | null;
  loading: boolean;
  refreshStatus: () => void;
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  planType: null,
  loading: false,
  refreshStatus: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [planType, setPlanType] = useState<"basic" | "premium" | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptionStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const data = await getSubscriptionStatus(token);
      setPlanType(data.plan_type);
    } catch (error) {
      toast.error("Could not fetch subscription status");
      setPlanType(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ planType, loading, refreshStatus: fetchSubscriptionStatus }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
