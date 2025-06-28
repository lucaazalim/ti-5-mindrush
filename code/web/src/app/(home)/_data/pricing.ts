export const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Start Free",
    popular: false,
    inverse: false,
    features: ["Up to 5 participants per quiz", "Unlimited quiz creation", "2GB of storage"],
  },
  {
    title: "Pro",
    monthlyPrice: 10,
    buttonText: "Subscribe Pro",
    popular: true,
    inverse: true,
    features: [
      "Up to 60 participants per quiz",
      "Unlimited quiz creation",
      "50GB of storage",
      "Theme customization",
    ],
  },
  {
    title: "School",
    monthlyPrice: 100,
    buttonText: "Subscribe School",
    popular: false,
    inverse: false,
    features: [
      "Unlimited participants",
      "Unlimited quiz creation",
      "200GB of storage",
      "Class management",
      "Data export",
    ],
  },
];
