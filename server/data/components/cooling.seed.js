const cooling = [
  {
    type: "Cooling",
    brand: "Deepcool",
    model: "GAMMAXX 400 V2",
    name: "Deepcool GAMMAXX 400 V2 Air Cooler",
    description: "Budget air cooler for entry-level and mid-range CPUs",
    imageUrl: "https://placehold.co/600x400?text=GAMMAXX+400+V2",
    estimatedPrice: 1500,
    currency: "INR",
    inStock: true,
    tags: ["budget", "air", "compact"],
    specs: {
      type: "Air",
      fans: 1,
      fanSize: 120,
      height: 155,
      tdpRating: 150,
      heatpipes: 4,
      noiseLevel: 27
    },
    compatibility: {
      sockets: ["AM4", "AM5", "LGA1700"],
      maxRamHeight: 45
    }
  },
  {
    type: "Cooling",
    brand: "Noctua",
    model: "NH-D15",
    name: "Noctua NH-D15 Premium Air Cooler",
    description: "Top-tier dual tower air cooler for high-end CPUs",
    imageUrl: "https://placehold.co/600x400?text=NH-D15",
    estimatedPrice: 9000,
    currency: "INR",
    inStock: true,
    tags: ["premium", "air", "high-performance"],
    specs: {
      type: "Air",
      fans: 2,
      fanSize: 140,
      height: 165,
      tdpRating: 250,
      heatpipes: 6,
      noiseLevel: 24
    },
    compatibility: {
      sockets: ["AM4", "AM5", "LGA1700"],
      maxRamHeight: 40
    }
  },
  {
    type: "Cooling",
    brand: "Lian Li",
    model: "Galahad II 360",
    name: "Lian Li Galahad II 360mm AIO",
    description: "High-end liquid cooler for flagship CPUs and overclocking",
    imageUrl: "https://placehold.co/600x400?text=Galahad+II+360",
    estimatedPrice: 14000,
    currency: "INR",
    inStock: true,
    tags: ["premium", "aio", "flagship"],
    specs: {
      type: "Liquid",
      fans: 3,
      fanSize: 120,
      height: 60,
      tdpRating: 320,
      heatpipes: 0,
      noiseLevel: 32
    },
    compatibility: {
      sockets: ["AM4", "AM5", "LGA1700"],
      maxRamHeight: 65
    }
  }
];

export default cooling;