const storage = [
  {
    type: "Storage",
    brand: "WD",
    model: "Black SN850X 1TB",
    name: "WD Black SN850X 1TB NVMe SSD",
    description: "High-performance Gen4 NVMe SSD for gaming and heavy workloads",
    imageUrl: "https://placehold.co/600x400?text=SN850X+1TB",
    estimatedPrice: 10500,
    currency: "INR",
    inStock: true,
    tags: ["nvme", "gen4", "premium", "1tb"],
    specs: {
      capacity: 1000,
      type: "SSD",
      formFactor: "M.2",
      interface: "NVMe",
      readSpeed: 7300,
      writeSpeed: 6600,
      nandType: "TLC",
      tbw: 600
    },
    compatibility: {
      interface: "NVMe",
      formFactor: "M.2"
    }
  },
  {
    type: "Storage",
    brand: "Kingston",
    model: "NV2 1TB",
    name: "Kingston NV2 1TB NVMe SSD",
    description: "Affordable NVMe SSD for everyday computing and gaming",
    imageUrl: "https://placehold.co/600x400?text=NV2+1TB",
    estimatedPrice: 4800,
    currency: "INR",
    inStock: true,
    tags: ["nvme", "budget", "1tb"],
    specs: {
      capacity: 1000,
      type: "SSD",
      formFactor: "M.2",
      interface: "NVMe",
      readSpeed: 3500,
      writeSpeed: 2100,
      nandType: "QLC",
      tbw: 320
    },
    compatibility: {
      interface: "NVMe",
      formFactor: "M.2"
    }
  },
  {
    type: "Storage",
    brand: "WD",
    model: "Green 480GB",
    name: "WD Green 480GB SATA SSD",
    description: "Budget SATA SSD for basic upgrades and office builds",
    imageUrl: "https://placehold.co/600x400?text=WD+Green+480GB",
    estimatedPrice: 2400,
    currency: "INR",
    inStock: true,
    tags: ["sata", "budget", "480gb"],
    specs: {
      capacity: 480,
      type: "SSD",
      formFactor: "2.5",
      interface: "SATA",
      readSpeed: 545,
      writeSpeed: 465,
      nandType: "TLC",
      tbw: 100
    },
    compatibility: {
      interface: "SATA",
      formFactor: "2.5"
    }
  },
  {
    type: "Storage",
    brand: "Seagate",
    model: "Barracuda 6TB",
    name: "Seagate Barracuda 6TB HDD",
    description: "Large capacity HDD for media storage and backups",
    imageUrl: "https://placehold.co/600x400?text=Barracuda+6TB",
    estimatedPrice: 9500,
    currency: "INR",
    inStock: true,
    tags: ["hdd", "6tb", "storage"],
    specs: {
      capacity: 6000,
      type: "HDD",
      formFactor: "3.5",
      interface: "SATA",
      rpm: 5400,
      cacheBuffer: 256
    },
    compatibility: {
      interface: "SATA",
      formFactor: "3.5"
    }
  }
];

export default storage;