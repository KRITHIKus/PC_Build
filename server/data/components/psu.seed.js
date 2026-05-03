const psu = [
  {
    type: "PSU",
    brand: "Seasonic",
    model: "Focus GX-750",
    name: "Seasonic Focus GX-750 750W",
    description: "Reliable 750W Gold PSU ideal for mid to high-end builds",
    imageUrl: "https://placehold.co/600x400?text=Focus+GX+750",
    estimatedPrice: 0,
    currency: "INR",
    inStock: true,
    tags: ["750w", "gold", "reliable", "mid-high"],
    specs: {
      wattage: 750,
      efficiency: "80+ Gold",
      modular: true,
      fanSize: 120,
      atx3: false,
      pcie5Connector: false
    },
    compatibility: {
      formFactor: "ATX",
      length: 140
    }
  },
  {
    type: "PSU",
    brand: "Corsair",
    model: "RM850x SHIFT",
    name: "Corsair RM850x SHIFT 850W",
    description: "Premium ATX 3.0 PSU with PCIe 5 support",
    imageUrl: "https://placehold.co/600x400?text=RM850x+SHIFT",
    estimatedPrice: 0,
    currency: "INR",
    inStock: true,
    tags: ["850w", "premium", "atx3", "pcie5"],
    specs: {
      wattage: 850,
      efficiency: "80+ Gold",
      modular: true,
      fanSize: 140,
      atx3: true,
      pcie5Connector: true
    },
    compatibility: {
      formFactor: "ATX",
      length: 160
    }
  },
  {
    type: "PSU",
    brand: "MSI",
    model: "MEG Ai1000P PCIE5",
    name: "MSI MEG Ai1000P PCIE5 1000W",
    description: "Enthusiast-grade PSU for flagship GPUs and upgrades",
    imageUrl: "https://placehold.co/600x400?text=MEG+1000W",
    estimatedPrice: 0,
    currency: "INR",
    inStock: true,
    tags: ["1000w", "enthusiast", "pcie5", "flagship"],
    specs: {
      wattage: 1000,
      efficiency: "80+ Platinum",
      modular: true,
      fanSize: 135,
      atx3: true,
      pcie5Connector: true
    },
    compatibility: {
      formFactor: "ATX",
      length: 180
    }
  }
];

export default psu;