const motherboard = [
  {
    type: "Motherboard",
    brand: "ASRock",
    model: "B450 Steel Legend",
    name: "ASRock B450 Steel Legend",
    description: "Value-packed AM4 motherboard with solid build quality",
    imageUrl: "https://placehold.co/600x400?text=B450+Steel+Legend",
    estimatedPrice: 8500,
    currency: "INR",
    inStock: true,
    tags: ["am4", "budget", "ddr4"],
    specs: {
      formFactor: "ATX",
      chipset: "B450",
      ramSlots: 4,
      maxRam: 64,
      m2Slots: 2,
      sataSlots: 6,
      pcie5: false,
      usb32Gen2: true,
      wifi: false,
      bluetooth: false
    },
    compatibility: {
      socket: "AM4",
      ramType: "DDR4",
      maxRamSpeed: 3533,
      cpuBrands: ["AMD"]
    }
  },
  {
    type: "Motherboard",
    brand: "Gigabyte",
    model: "B650M DS3H",
    name: "Gigabyte B650M DS3H",
    description: "Affordable AM5 motherboard for entry DDR5 builds",
    imageUrl: "https://placehold.co/600x400?text=B650M+DS3H",
    estimatedPrice: 15500,
    currency: "INR",
    inStock: true,
    tags: ["am5", "ddr5", "budget"],
    specs: {
      formFactor: "Micro-ATX",
      chipset: "B650",
      ramSlots: 4,
      maxRam: 128,
      m2Slots: 2,
      sataSlots: 4,
      pcie5: false,
      usb32Gen2: true,
      wifi: false,
      bluetooth: false
    },
    compatibility: {
      socket: "AM5",
      ramType: "DDR5",
      maxRamSpeed: 6400,
      cpuBrands: ["AMD"]
    }
  },
  {
    type: "Motherboard",
    brand: "ASUS",
    model: "Prime B660M-K D4",
    name: "ASUS Prime B660M-K D4",
    description: "Compact DDR4 motherboard for Intel budget builds",
    imageUrl: "https://placehold.co/600x400?text=B660M+D4",
    estimatedPrice: 9500,
    currency: "INR",
    inStock: true,
    tags: ["intel", "ddr4", "budget"],
    specs: {
      formFactor: "Micro-ATX",
      chipset: "B660",
      ramSlots: 2,
      maxRam: 64,
      m2Slots: 1,
      sataSlots: 4,
      pcie5: false,
      usb32Gen2: false,
      wifi: false,
      bluetooth: false
    },
    compatibility: {
      socket: "LGA1700",
      ramType: "DDR4",
      maxRamSpeed: 3200,
      cpuBrands: ["Intel"]
    }
  },
  {
    type: "Motherboard",
    brand: "MSI",
    model: "MAG B760 Tomahawk WIFI",
    name: "MSI MAG B760 Tomahawk WIFI DDR5",
    description: "Feature-rich DDR5 motherboard for Intel gaming builds",
    imageUrl: "https://placehold.co/600x400?text=B760+Tomahawk",
    estimatedPrice: 21000,
    currency: "INR",
    inStock: true,
    tags: ["intel", "ddr5", "midrange", "wifi"],
    specs: {
      formFactor: "ATX",
      chipset: "B760",
      ramSlots: 4,
      maxRam: 128,
      m2Slots: 3,
      sataSlots: 6,
      pcie5: true,
      usb32Gen2: true,
      wifi: true,
      bluetooth: true
    },
    compatibility: {
      socket: "LGA1700",
      ramType: "DDR5",
      maxRamSpeed: 7000,
      cpuBrands: ["Intel"]
    }
  }
];

export default motherboard;