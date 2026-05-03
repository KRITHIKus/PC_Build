const cpu = [
  {
    type: "CPU",
    brand: "AMD",
    model: "Ryzen 5 5600",
    name: "AMD Ryzen 5 5600",
    description: "High-value AM4 CPU for gaming and productivity",
    imageUrl: "https://placehold.co/600x400?text=R5+5600",
    estimatedPrice: 12500,
    currency: "INR",
    inStock: true,
    tags: ["am4", "value", "gaming"],
    specs: {
      cores: 6,
      threads: 12,
      baseClock: 3.5,
      boostClock: 4.4,
      tdp: 65,
      socket: "AM4",
      architecture: "Zen 3",
      lithography: "7nm",
      l3Cache: 32,
      integratedGraphics: false
    },
    compatibility: {
      socket: "AM4",
      chipsets: ["B450", "B550", "X570"],
      maxRamSpeed: 3200,
      ramType: "DDR4"
    }
  },

  {
    type: "CPU",
    brand: "AMD",
    model: "Ryzen 5 7600",
    name: "AMD Ryzen 5 7600",
    description: "Efficient AM5 CPU for gaming and modern builds",
    imageUrl: "https://placehold.co/600x400?text=R5+7600",
    estimatedPrice: 22000,
    currency: "INR",
    inStock: true,
    tags: ["am5", "ddr5", "gaming"],
    specs: {
      cores: 6,
      threads: 12,
      baseClock: 3.8,
      boostClock: 5.1,
      tdp: 65,
      socket: "AM5",
      architecture: "Zen 4",
      lithography: "5nm",
      l3Cache: 32,
      integratedGraphics: true
    },
    compatibility: {
      socket: "AM5",
      chipsets: ["B650", "X670", "X670E"],
      maxRamSpeed: 5200,
      ramType: "DDR5"
    }
  },
  {
    type: "CPU",
    brand: "AMD",
    model: "Ryzen 9 7950X",
    name: "AMD Ryzen 9 7950X",
    description: "Flagship AM5 CPU for heavy workloads and creators",
    imageUrl: "https://placehold.co/600x400?text=R9+7950X",
    estimatedPrice: 52000,
    currency: "INR",
    inStock: true,
    tags: ["am5", "flagship", "creator"],
    specs: {
      cores: 16,
      threads: 32,
      baseClock: 4.5,
      boostClock: 5.7,
      tdp: 170,
      socket: "AM5",
      architecture: "Zen 4",
      lithography: "5nm",
      l3Cache: 64,
      integratedGraphics: true
    },
    compatibility: {
      socket: "AM5",
      chipsets: ["B650", "X670", "X670E"],
      maxRamSpeed: 5600,
      ramType: "DDR5"
    }
  },

  {
    type: "CPU",
    brand: "Intel",
    model: "Core i3-12100F",
    name: "Intel Core i3-12100F",
    description: "Budget LGA1700 CPU for entry gaming builds",
    imageUrl: "https://placehold.co/600x400?text=i3+12100F",
    estimatedPrice: 9000,
    currency: "INR",
    inStock: true,
    tags: ["intel", "budget", "gaming"],
    specs: {
      cores: 4,
      threads: 8,
      baseClock: 3.3,
      boostClock: 4.3,
      tdp: 60,
      socket: "LGA1700",
      architecture: "Alder Lake",
      lithography: "Intel 7",
      l3Cache: 12,
      integratedGraphics: false
    },
    compatibility: {
      socket: "LGA1700",
      chipsets: ["H610", "B660", "B760", "Z690", "Z790"],
      maxRamSpeed: 3200,
      ramType: "DDR4"
    }
  },
  {
    type: "CPU",
    brand: "Intel",
    model: "Core i5-13400",
    name: "Intel Core i5-13400",
    description: "Balanced CPU for gaming and productivity",
    imageUrl: "https://placehold.co/600x400?text=i5+13400",
    estimatedPrice: 21000,
    currency: "INR",
    inStock: true,
    tags: ["intel", "midrange", "hybrid"],
    specs: {
      cores: 10,
      threads: 16,
      baseClock: 2.5,
      boostClock: 4.6,
      tdp: 65,
      socket: "LGA1700",
      architecture: "Raptor Lake",
      lithography: "Intel 7",
      l3Cache: 20,
      integratedGraphics: true
    },
    compatibility: {
      socket: "LGA1700",
      chipsets: ["B660", "B760", "Z690", "Z790"],
      maxRamSpeed: 4800,
      ramType: "DDR5"
    }
  },
  {
    type: "CPU",
    brand: "Intel",
    model: "Core i9-14900K",
    name: "Intel Core i9-14900K",
    description: "Flagship CPU for extreme performance and multitasking",
    imageUrl: "https://placehold.co/600x400?text=i9+14900K",
    estimatedPrice: 60000,
    currency: "INR",
    inStock: true,
    tags: ["intel", "flagship", "enthusiast"],
    specs: {
      cores: 24,
      threads: 32,
      baseClock: 3.2,
      boostClock: 6.0,
      tdp: 253,
      socket: "LGA1700",
      architecture: "Raptor Lake Refresh",
      lithography: "Intel 7",
      l3Cache: 36,
      integratedGraphics: true
    },
    compatibility: {
      socket: "LGA1700",
      chipsets: ["Z690", "Z790"],
      maxRamSpeed: 5600,
      ramType: "DDR5"
    }
  }
];

export default cpu;