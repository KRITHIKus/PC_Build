const ram = [
  {
    type: "RAM",
    brand: "Crucial",
    model: "CT16G4DFRA32A",
    name: "Crucial 16GB (2x8GB) DDR4 3200MHz",
    description: "Reliable budget DDR4 kit for everyday use",
    imageUrl: "https://placehold.co/600x400?text=Crucial+16GB+DDR4",
    estimatedPrice: 3200,
    currency: "INR",
    inStock: true,
    tags: ["ddr4", "budget", "16gb", "low-profile"],
    specs: {
      capacity: 16,
      modules: 2,
      speed: 3200,
      type: "DDR4",
      casLatency: 22,
      voltage: 1.2,
      formFactor: "UDIMM"
    },
    compatibility: {
      ramType: "DDR4",
      ecc: false,
      xmp: true,
      expo: false
    }
  },
  {
    type: "RAM",
    brand: "G.Skill",
    model: "Trident Z RGB 32GB DDR4 3600",
    name: "G.Skill Trident Z RGB 32GB (2x16GB) DDR4 3600MHz",
    description: "High-performance RGB DDR4 kit for gaming and creators",
    imageUrl: "https://placehold.co/600x400?text=Trident+Z+RGB+DDR4",
    estimatedPrice: 9500,
    currency: "INR",
    inStock: true,
    tags: ["ddr4", "32gb", "rgb", "performance"],
    specs: {
      capacity: 32,
      modules: 2,
      speed: 3600,
      type: "DDR4",
      casLatency: 18,
      voltage: 1.35,
      formFactor: "UDIMM"
    },
    compatibility: {
      ramType: "DDR4",
      ecc: false,
      xmp: true,
      expo: false
    }
  },
  {
    type: "RAM",
    brand: "Kingston",
    model: "Fury Beast 16GB DDR5 5200",
    name: "Kingston Fury Beast 16GB (2x8GB) DDR5 5200MHz",
    description: "Affordable DDR5 kit for entry AM5 and Intel builds",
    imageUrl: "https://placehold.co/600x400?text=Fury+Beast+DDR5",
    estimatedPrice: 5200,
    currency: "INR",
    inStock: true,
    tags: ["ddr5", "budget", "16gb"],
    specs: {
      capacity: 16,
      modules: 2,
      speed: 5200,
      type: "DDR5",
      casLatency: 40,
      voltage: 1.25,
      formFactor: "UDIMM"
    },
    compatibility: {
      ramType: "DDR5",
      ecc: false,
      xmp: true,
      expo: true
    }
  },
  {
    type: "RAM",
    brand: "Corsair",
    model: "Vengeance RGB 32GB DDR5 6000",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    description: "Premium DDR5 RGB kit for high-end gaming and productivity",
    imageUrl: "https://placehold.co/600x400?text=Vengeance+RGB+DDR5",
    estimatedPrice: 14500,
    currency: "INR",
    inStock: true,
    tags: ["ddr5", "32gb", "rgb", "premium"],
    specs: {
      capacity: 32,
      modules: 2,
      speed: 6000,
      type: "DDR5",
      casLatency: 36,
      voltage: 1.35,
      formFactor: "UDIMM"
    },
    compatibility: {
      ramType: "DDR5",
      ecc: false,
      xmp: true,
      expo: true
    }
  }
];

export default ram;