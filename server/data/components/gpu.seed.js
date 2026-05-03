const gpu = [
  {
    type: "GPU",
    brand: "NVIDIA",
    model: "GTX 1630",
    name: "NVIDIA GeForce GTX 1630 4GB",
    description: "Ultra-budget GPU for basic display and light gaming",
    imageUrl: "https://placehold.co/600x400?text=GTX+1630",
    estimatedPrice: 12000,
    currency: "INR",
    inStock: true,
    tags: ["budget", "entry-level", "compact"],
    specs: {
      vram: 4,
      vramType: "GDDR6",
      baseClock: 1740,
      boostClock: 1785,
      tdp: 75,
      busWidth: 64,
      displayOutputs: ["HDMI", "DP"],
      length: 150
    },
    compatibility: {
      powerConnectors: [],
      recommendedPSU: 350,
      pcieSlot: "PCIe 3.0",
      slotWidth: 2
    }
  },
  {
    type: "GPU",
    brand: "AMD",
    model: "RX 6400",
    name: "AMD Radeon RX 6400 4GB",
    description: "Low-profile GPU ideal for compact builds",
    imageUrl: "https://placehold.co/600x400?text=RX+6400",
    estimatedPrice: 13500,
    currency: "INR",
    inStock: true,
    tags: ["budget", "compact", "low-profile"],
    specs: {
      vram: 4,
      vramType: "GDDR6",
      baseClock: 1923,
      boostClock: 2321,
      tdp: 53,
      busWidth: 64,
      displayOutputs: ["HDMI", "DP"],
      length: 165
    },
    compatibility: {
      powerConnectors: [],
      recommendedPSU: 350,
      pcieSlot: "PCIe 4.0",
      slotWidth: 2
    }
  },

  {
    type: "GPU",
    brand: "NVIDIA",
    model: "RTX 4060 Ti",
    name: "NVIDIA GeForce RTX 4060 Ti 16GB",
    description: "Efficient 1440p GPU with higher VRAM capacity",
    imageUrl: "https://placehold.co/600x400?text=RTX+4060+Ti+16GB",
    estimatedPrice: 46000,
    currency: "INR",
    inStock: true,
    tags: ["1440p", "midrange", "dlss3"],
    specs: {
      vram: 16,
      vramType: "GDDR6",
      baseClock: 2310,
      boostClock: 2535,
      tdp: 165,
      busWidth: 128,
      displayOutputs: ["HDMI", "DP"],
      length: 250
    },
    compatibility: {
      powerConnectors: ["8-pin"],
      recommendedPSU: 600,
      pcieSlot: "PCIe 4.0",
      slotWidth: 2.5
    }
  },
  {
    type: "GPU",
    brand: "AMD",
    model: "RX 7700 XT",
    name: "AMD Radeon RX 7700 XT 12GB",
    description: "Strong 1440p GPU with good raster performance",
    imageUrl: "https://placehold.co/600x400?text=RX+7700+XT",
    estimatedPrice: 48000,
    currency: "INR",
    inStock: true,
    tags: ["1440p", "gaming"],
    specs: {
      vram: 12,
      vramType: "GDDR6",
      baseClock: 2171,
      boostClock: 2544,
      tdp: 245,
      busWidth: 192,
      displayOutputs: ["HDMI", "DP"],
      length: 280
    },
    compatibility: {
      powerConnectors: ["8-pin", "8-pin"],
      recommendedPSU: 700,
      pcieSlot: "PCIe 4.0",
      slotWidth: 2.5
    }
  },

  {
    type: "GPU",
    brand: "NVIDIA",
    model: "RTX 4080 Super",
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    description: "High-end GPU for 4K gaming and creators",
    imageUrl: "https://placehold.co/600x400?text=RTX+4080+Super",
    estimatedPrice: 115000,
    currency: "INR",
    inStock: true,
    tags: ["high-end", "4k", "creator"],
    specs: {
      vram: 16,
      vramType: "GDDR6X",
      baseClock: 2295,
      boostClock: 2550,
      tdp: 320,
      busWidth: 256,
      displayOutputs: ["HDMI", "DP"],
      length: 320
    },
    compatibility: {
      powerConnectors: ["16-pin"],
      recommendedPSU: 850,
      pcieSlot: "PCIe 4.0",
      slotWidth: 3
    }
  },

  {
    type: "GPU",
    brand: "Intel",
    model: "Arc A770",
    name: "Intel Arc A770 16GB",
    description: "High VRAM GPU for 1440p gaming and creators",
    imageUrl: "https://placehold.co/600x400?text=Arc+A770",
    estimatedPrice: 33000,
    currency: "INR",
    inStock: true,
    tags: ["1440p", "value", "intel-arc"],
    specs: {
      vram: 16,
      vramType: "GDDR6",
      baseClock: 2100,
      boostClock: 2400,
      tdp: 225,
      busWidth: 256,
      displayOutputs: ["HDMI", "DP"],
      length: 267
    },
    compatibility: {
      powerConnectors: ["8-pin", "6-pin"],
      recommendedPSU: 650,
      pcieSlot: "PCIe 4.0",
      slotWidth: 2.5
    }
  }
];

export default gpu;