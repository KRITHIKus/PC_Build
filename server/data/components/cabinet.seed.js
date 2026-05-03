const cabinet = [
  {
    type: "Cabinet",
    brand: "Fractal Design",
    model: "Meshify 2",
    name: "Fractal Design Meshify 2 Mid Tower",
    description: "Premium airflow-focused cabinet for high-performance builds",
    imageUrl: "https://placehold.co/600x400?text=Meshify+2",
    estimatedPrice: 13500,
    currency: "INR",
    inStock: true,
    tags: ["premium", "airflow", "mid-tower"],
    specs: {
      formFactor: "Mid Tower",
      supportedMotherboards: ["ATX", "Micro-ATX", "Mini-ITX"],
      maxGpuLength: 420,
      maxCpuCoolerHeight: 185,
      driveBays35: 2,
      driveBays25: 4,
      fanSlots: 9,
      radiatorSupport: ["360mm", "420mm"],
      includedFans: 3,
      frontIO: ["USB-C", "USB 3.0", "Audio"]
    },
    compatibility: {
      psuFormFactor: "ATX",
      maxPsuLength: 250
    }
  },
  {
    type: "Cabinet",
    brand: "Thermaltake",
    model: "S100 TG",
    name: "Thermaltake S100 TG Micro-ATX",
    description: "Compact cabinet for Micro-ATX and Mini-ITX builds",
    imageUrl: "https://placehold.co/600x400?text=S100+TG",
    estimatedPrice: 4800,
    currency: "INR",
    inStock: true,
    tags: ["compact", "micro-atx", "budget"],
    specs: {
      formFactor: "Mini Tower",
      supportedMotherboards: ["Micro-ATX", "Mini-ITX"],
      maxGpuLength: 330,
      maxCpuCoolerHeight: 165,
      driveBays35: 2,
      driveBays25: 2,
      fanSlots: 4,
      radiatorSupport: ["240mm"],
      includedFans: 1,
      frontIO: ["USB 3.0", "USB 2.0", "Audio"]
    },
    compatibility: {
      psuFormFactor: "ATX",
      maxPsuLength: 160
    }
  },
  {
    type: "Cabinet",
    brand: "Lian Li",
    model: "PC-O11 Dynamic",
    name: "Lian Li PC-O11 Dynamic Showcase Case",
    description: "Premium dual-chamber showcase cabinet for enthusiast builds",
    imageUrl: "https://placehold.co/600x400?text=O11+Dynamic",
    estimatedPrice: 14500,
    currency: "INR",
    inStock: true,
    tags: ["enthusiast", "showcase", "premium"],
    specs: {
      formFactor: "Mid Tower",
      supportedMotherboards: ["ATX", "Micro-ATX", "Mini-ITX"],
      maxGpuLength: 400,
      maxCpuCoolerHeight: 167,
      driveBays35: 2,
      driveBays25: 4,
      fanSlots: 9,
      radiatorSupport: ["360mm", "280mm"],
      includedFans: 0,
      frontIO: ["USB-C", "USB 3.0", "Audio"]
    },
    compatibility: {
      psuFormFactor: "ATX",
      maxPsuLength: 200
    }
  }
];

export default cabinet;