import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Check, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Plan } from "../pages/Types";
import { createSubscription } from "../services/Subscription";

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "1_day",
      name: "1 Day Pass",
      price: "$1.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD quality",
        "No ads",
      ],
      duration: "24 hours of premium access",
    },
    {
      id: "1_month",
      name: "1 Month Pass",
      price: "$7.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD & 4K quality",
        "No ads",
        "Offline downloads",
      ],
      duration: "30 days of premium access",
      popular: true,
    },
    {
      id: "3_months",
      name: "3 Month Premium",
      price: "$19.99",
      features: [
        "Full access to all movies",
        "Unlimited streaming",
        "HD & 4K quality",
        "No ads",
        "Offline downloads",
        "Priority customer support",
        "Early access to new releases",
      ],
      duration: "90 days of premium access",
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        console.log("Redirecting to:", checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: any) {
      console.error("Error in handleSubscribe:", err);
      setError(
        err.message || "Failed to initiate subscription. Please try again."
      );
      setIsProcessing(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        color: "#fff",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{ mb: { xs: 3, sm: 4, md: 5 } }}
        >
          Choose Your Plan
        </Typography>

        {/* Grid of Plan Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 3, sm: 4, md: 5 },
          }}
        >
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#1e1e1e",
                color: "#fff",
                borderRadius: 3,
                border:
                  selectedPlan === plan.id
                    ? "2px solid #E50914"
                    : "1px solid #444",
                boxShadow: selectedPlan === plan.id ? 6 : 2,
                transition: "0.3s ease",
                position: "relative",
                px: 2,
                py: 3,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              {index === Math.floor(plans.length / 2) && (
                <Chip
                  label="Popular"
                  color="warning"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: "bold",
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                  {plan.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#ccc", mb: 1 }}>
                  {plan.duration}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  {plan.price}
                </Typography>

                <List dense>
                  {plan.features.map((feature, i) => (
                    <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <Check color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setSelectedPlan(plan.id)}
                  sx={{
                    bgcolor: "#E50914",
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "#c7000d",
                    },
                  }}
                >
                  {selectedPlan === plan.id ? "Selected" : "Choose"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        {/* Confirmation Section */}
        <div className="mt-20 mb-20"></div>
        {selectedPlan && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "100%",
                maxWidth: "md",
                bgcolor: "rgba(20, 20, 20, 0.9)",
                color: "#fff",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom>
                Confirm Your Subscription
              </Typography>
              <Typography
                variant="body1"
                color="rgba(255,255,255,0.7)"
                gutterBottom
                sx={{ mb: 3 }}
              >
                You have selected the{" "}
                {plans.find((p) => p.id === selectedPlan)?.name} for{" "}
                {plans.find((p) => p.id === selectedPlan)?.price}.
              </Typography>
              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={isProcessing}
                onClick={handleSubscribe}
                sx={{
                  py: 1.5,
                  bgcolor: "#E50914",
                  "&:hover": { bgcolor: "#c7000d" },
                }}
              >
                {isProcessing ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Processing...
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Subscribe Now <ArrowForward sx={{ ml: 1 }} />
                  </Box>
                )}
              </Button>
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.7)"
                align="center"
                sx={{ mt: 2 }}
              >
                You can cancel your subscription at any time from your account
                settings
              </Typography>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}
