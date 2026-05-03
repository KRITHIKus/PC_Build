const buildsSeed = [
  {
    user: "69e301d6643422b636982ea9",
    title: "Budget Gaming Build",
    description: "Affordable 1080p gaming setup",
    parts: {
      cpu: "69e4c8406a81809a5f89c49a",
      gpu: "69e4c8406a81809a5f89c4a6",
      ram: "69e4c8406a81809a5f89c4b1",
      motherboard: "69e4c8406a81809a5f89c4b8",
      storage: ["69e4c8406a81809a5f89c4c0"],
      psu: "69e4c8406a81809a5f89c4c8",
      cabinet: "69e4c8406a81809a5f89c4ce",
      cooling: "69e4cf4415ff80f2baa6cbc6"
    },
    totalEstimatedPrice: 48000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: false,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Mid-Range Gaming Build",
    description: "Balanced build for 1080p high and 1440p gaming",
    parts: {
      cpu: "69e4cf4415ff80f2baa6cba8",
      gpu: "69e4c8406a81809a5f89c4a8",
      ram: "69e4c8406a81809a5f89c4b2",
      motherboard: "69e4c8406a81809a5f89c4b9",
      storage: ["69e4cf4415ff80f2baa6cbbd"],
      psu: "69e4c8406a81809a5f89c4ca",
      cabinet: "69e4c8406a81809a5f89c4d1",
      cooling: "69e4c8406a81809a5f89c4d6"
    },
    totalEstimatedPrice: 90000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "High-End Gaming Build",
    description: "High refresh rate 1440p and entry 4K gaming",
    parts: {
      cpu: "69e4c8406a81809a5f89c49f",
      gpu: "69e4c8406a81809a5f89c4a9",
      ram: "69e4c8406a81809a5f89c4b6",
      motherboard: "69e4cf4415ff80f2baa6cbb9",
      storage: ["69e4c8406a81809a5f89c4c1"],
      psu: "69e4c8406a81809a5f89c4cd",
      cabinet: "69e4c8406a81809a5f89c4d3",
      cooling: "69e4c8406a81809a5f89c4d7"
    },
    totalEstimatedPrice: 150000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Gaming and Streaming Build",
    description: "Optimized for gaming and live streaming workloads",
    parts: {
      cpu: "69e4c8406a81809a5f89c4a3",
      gpu: "69e4cf4415ff80f2baa6cbb0",
      ram: "69e4cf4415ff80f2baa6cbb7",
      motherboard: "69e4cf4415ff80f2baa6cbbb",
      storage: [
        "69e4c8406a81809a5f89c4c1",
        "69e4c8406a81809a5f89c4c6"
      ],
      psu: "69e4c8406a81809a5f89c4cc",
      cabinet: "69e4cf4415ff80f2baa6cbc3",
      cooling: "69e4c8406a81809a5f89c4d8"
    },
    totalEstimatedPrice: 160000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Office Productivity Build",
    description: "Efficient system for office and daily tasks",
    parts: {
      cpu: "69e4cf4415ff80f2baa6cbab",
      gpu: "69e4cf4415ff80f2baa6cbae",
      ram: "69e4c8406a81809a5f89c4b0",
      motherboard: "69e4c8406a81809a5f89c4bd",
      storage: ["69e4cf4415ff80f2baa6cbbe"],
      psu: "69e4c8406a81809a5f89c4c9",
      cabinet: "69e4cf4415ff80f2baa6cbc4",
      cooling: "69e4c8406a81809a5f89c4d5"
    },
    totalEstimatedPrice: 35000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "completed",
    isFavorite: false,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Programming Build",
    description: "Balanced setup for coding and multitasking",
    parts: {
      cpu: "69e4cf4415ff80f2baa6cbac",
      gpu: "69e4cf4415ff80f2baa6cbae",
      ram: "69e4c8406a81809a5f89c4b4",
      motherboard: "69e4cf4415ff80f2baa6cbba",
      storage: ["69e4c8406a81809a5f89c4c2"],
      psu: "69e4c8406a81809a5f89c4cb",
      cabinet: "69e4c8406a81809a5f89c4d2",
      cooling: "69e4c8406a81809a5f89c4d4"
    },
    totalEstimatedPrice: 80000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Video Editing Build",
    description: "Balanced CPU, RAM, and storage for editing workflows",
    parts: {
      cpu: "69e4c8406a81809a5f89c49d",
      gpu: "69e4cf4415ff80f2baa6cbb1",
      ram: "69e4cf4415ff80f2baa6cbb7",
      motherboard: "69e4c8406a81809a5f89c4ba",
      storage: [
        "69e4c8406a81809a5f89c4c3",
        "69e4c8406a81809a5f89c4c6"
      ],
      psu: "69e4c8406a81809a5f89c4cc",
      cabinet: "69e4c8406a81809a5f89c4d0",
      cooling: "69e4c8406a81809a5f89c4d7"
    },
    totalEstimatedPrice: 150000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "AI ML Starter Build",
    description: "Entry-level setup for learning AI and ML workloads",
    parts: {
      cpu: "69e4c8406a81809a5f89c49c",
      gpu: "69e4cf4415ff80f2baa6cbb3",
      ram: "69e4c8406a81809a5f89c4b4",
      motherboard: "69e4c8406a81809a5f89c4ba",
      storage: ["69e4c8406a81809a5f89c4c2"],
      psu: "69e4c8406a81809a5f89c4cb",
      cabinet: "69e4c8406a81809a5f89c4d1",
      cooling: "69e4c8406a81809a5f89c4d6"
    },
    totalEstimatedPrice: 110000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: false,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "AI ML Performance Build",
    description: "High-performance setup for ML training workloads",
    parts: {
      cpu: "69e4c8406a81809a5f89c4a4",
      gpu: "69e4cf4415ff80f2baa6cbb2",
      ram: "69e4c8406a81809a5f89c4b6",
      motherboard: "69e4c8406a81809a5f89c4bf",
      storage: [
        "69e4c8406a81809a5f89c4c3",
        "69e4c8406a81809a5f89c4c1"
      ],
      psu: "69e4c8406a81809a5f89c4cd",
      cabinet: "69e4cf4415ff80f2baa6cbc5",
      cooling: "69e4cf4415ff80f2baa6cbc8"
    },
    totalEstimatedPrice: 220000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "3D Rendering Workstation",
    description: "Balanced CPU and GPU for rendering workloads",
    parts: {
      cpu: "69e4c8406a81809a5f89c4a5",
      gpu: "69e4c8406a81809a5f89c4ad",
      ram: "69e4cf4415ff80f2baa6cbb7",
      motherboard: "69e4c8406a81809a5f89c4bf",
      storage: [
        "69e4c8406a81809a5f89c4c3",
        "69e4c8406a81809a5f89c4c6"
      ],
      psu: "69e4cf4415ff80f2baa6cbc2",
      cabinet: "69e4cf4415ff80f2baa6cbc3",
      cooling: "69e4c8406a81809a5f89c4d9"
    },
    totalEstimatedPrice: 250000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Mixed Use All-Rounder Build",
    description: "Balanced system for gaming, work, and daily use",
    parts: {
      cpu: "69e4cf4415ff80f2baa6cba9",
      gpu: "69e4cf4415ff80f2baa6cbb1",
      ram: "69e4c8406a81809a5f89c4b6",
      motherboard: "69e4cf4415ff80f2baa6cbb9",
      storage: ["69e4c8406a81809a5f89c4c1"],
      psu: "69e4c8406a81809a5f89c4cb",
      cabinet: "69e4c8406a81809a5f89c4d3",
      cooling: "69e4c8406a81809a5f89c4d6"
    },
    totalEstimatedPrice: 120000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: false,
    isDreamBuild: false,
    isFeatured: true,
    compatibilityResult: null
  },
  {
    user: "69e301d6643422b636982ea9",
    title: "Dream Flagship Build",
    description: "Top-tier system with flagship components",
    parts: {
      cpu: "69e4cf4415ff80f2baa6cbaa",
      gpu: "69e4c8406a81809a5f89c4aa",
      ram: "69e4c8406a81809a5f89c4b7",
      motherboard: "69e4c8406a81809a5f89c4bc",
      storage: [
        "69e4c8406a81809a5f89c4c3",
        "69e4cf4415ff80f2baa6cbbc"
      ],
      psu: "69e4cf4415ff80f2baa6cbc2",
      cabinet: "69e4cf4415ff80f2baa6cbc5",
      cooling: "69e4c8406a81809a5f89c4d9"
    },
    totalEstimatedPrice: 400000,
    currency: "INR",
    source: "recommendation",
    journeyStatus: "planning",
    isFavorite: true,
    isDreamBuild: true,
    isFeatured: true,
    compatibilityResult: null
  }
];

export default buildsSeed;