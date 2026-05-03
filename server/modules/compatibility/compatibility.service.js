const result = (blockers = [], warnings = [], notes = []) => ({
  valid: blockers.length === 0,
  blockers,
  warnings,
  notes,
});

const merge = (...results) => ({
  valid: results.every((r) => r.valid),
  blockers: results.flatMap((r) => r.blockers),
  warnings: results.flatMap((r) => r.warnings),
  notes: results.flatMap((r) => r.notes),
});

// ─── Individual Checks ────────────────────────────────────────────────────────

export const checkCpuMotherboard = (cpu, motherboard) => {
  const blockers = [];
  const warnings = [];
  const notes = [];

  const cpuSocket = cpu?.compatibility?.socket;
  const mbSocket = motherboard?.compatibility?.socket;

  if (!cpuSocket || !mbSocket) {
    return result(["CPU or motherboard is missing socket information"]);
  }

  if (cpuSocket !== mbSocket) {
    blockers.push(
      `CPU socket (${cpuSocket}) does not match motherboard socket (${mbSocket})`
    );
  } else {
    notes.push(`CPU and motherboard share compatible socket: ${cpuSocket}`);
  }

  const cpuRamType = cpu?.compatibility?.ramType;
  const mbRamType = motherboard?.compatibility?.ramType;

  if (cpuRamType && mbRamType) {
    const cpuTypes = cpuRamType.split("/").map((s) => s.trim());
    if (!cpuTypes.includes(mbRamType)) {
      warnings.push(
        `CPU supports ${cpuRamType} but motherboard uses ${mbRamType} — verify compatibility`
      );
    }
  }

  return result(blockers, warnings, notes);
};

export const checkRamMotherboard = (ram, motherboard) => {
  const blockers = [];
  const warnings = [];
  const notes = [];

  const ramType = ram?.specs?.type;
  const mbRamType = motherboard?.compatibility?.ramType;

  if (!ramType || !mbRamType) {
    return result(["RAM or motherboard is missing RAM type information"]);
  }

  if (ramType !== mbRamType) {
    blockers.push(
      `RAM type (${ramType}) is not compatible with motherboard (${mbRamType})`
    );
  } else {
    notes.push(`RAM type ${ramType} is compatible with this motherboard`);
  }

  const ramSpeed = ram?.specs?.speed;
  const mbMaxSpeed = motherboard?.compatibility?.maxRamSpeed;

  if (ramSpeed && mbMaxSpeed) {
    if (ramSpeed > mbMaxSpeed) {
      warnings.push(
        `RAM speed (${ramSpeed} MHz) exceeds motherboard maximum (${mbMaxSpeed} MHz) — will run at ${mbMaxSpeed} MHz`
      );
    } else {
      notes.push(`RAM speed ${ramSpeed} MHz is within motherboard limit of ${mbMaxSpeed} MHz`);
    }
  }

  const ramFormFactor = ram?.specs?.formFactor;
  if (ramFormFactor && ramFormFactor === "SO-DIMM") {
    warnings.push("SO-DIMM RAM is typically for compact/mini-ITX boards only — verify slot type");
  }

  return result(blockers, warnings, notes);
};

export const checkMotherboardCabinet = (motherboard, cabinet) => {
  const blockers = [];
  const warnings = [];
  const notes = [];

  const mbFormFactor = motherboard?.specs?.formFactor;
  const supported = cabinet?.specs?.supportedMotherboards;

  if (!mbFormFactor || !supported) {
    return result(["Motherboard or cabinet is missing form factor information"]);
  }

  const supportedList = Array.isArray(supported) ? supported : [supported];

  if (!supportedList.includes(mbFormFactor)) {
    blockers.push(
      `Motherboard form factor (${mbFormFactor}) is not supported by this cabinet (supports: ${supportedList.join(", ")})`
    );
  } else {
    notes.push(`Motherboard form factor ${mbFormFactor} fits this cabinet`);
  }

  return result(blockers, warnings, notes);
};

export const checkPsuWattage = (components = []) => {
  const blockers = [];
  const warnings = [];
  const notes = [];

  const psu = components.find((c) => c.type === "PSU");
  if (!psu) {
    return result(["No PSU provided for wattage check"]);
  }

  const psuWattage = psu?.specs?.wattage;
  if (!psuWattage) {
    return result(["PSU is missing wattage information"]);
  }

  let estimatedDraw = 75;

  for (const c of components) {
    if (c.type === "GPU") {
      const tdp = c?.specs?.tdp;
      if (tdp) estimatedDraw += tdp;
      else estimatedDraw += 200;
    }
    if (c.type === "CPU") {
      const tdp = c?.specs?.tdp;
      if (tdp) estimatedDraw += tdp;
      else estimatedDraw += 95;
    }
    if (c.type === "Storage") {
      estimatedDraw += c?.specs?.type === "HDD" ? 10 : 5;
    }
    if (c.type === "RAM") {
      estimatedDraw += 5;
    }
    if (c.type === "Cooling") {
      estimatedDraw += 10;
    }
  }

  const headroom = psuWattage - estimatedDraw;
  const headroomPercent = Math.round((headroom / psuWattage) * 100);

  if (headroom < 0) {
    blockers.push(
      `PSU (${psuWattage}W) is insufficient for estimated system draw (~${estimatedDraw}W)`
    );
  } else if (headroomPercent < 15) {
    warnings.push(
      `PSU headroom is tight: ${psuWattage}W PSU with ~${estimatedDraw}W estimated draw (${headroomPercent}% headroom). Consider a higher wattage PSU.`
    );
  } else {
    notes.push(
      `PSU wattage is adequate: ${psuWattage}W PSU for ~${estimatedDraw}W estimated draw (${headroomPercent}% headroom)`
    );
  }

  return result(blockers, warnings, notes);
};

export const checkStorageSupport = (storage, motherboard) => {
  const blockers = [];
  const warnings = [];
  const notes = [];

  const storageInterface = storage?.compatibility?.interface;
  const storageFormFactor = storage?.compatibility?.formFactor;

  if (!storageInterface) {
    return result(["Storage is missing interface information"]);
  }

  const isNvme = storageInterface.toLowerCase().includes("nvme") ||
                 storageInterface.toLowerCase().includes("pcie");
  const isSata = storageInterface.toLowerCase().includes("sata");
  const isM2 = storageFormFactor?.toLowerCase().includes("m.2");

  const mbM2Slots = motherboard?.specs?.m2Slots;
  const mbSataSlots = motherboard?.specs?.sataSlots;

  if (isNvme && isM2) {
    if (mbM2Slots === undefined) {
      warnings.push("Cannot verify M.2 slot availability — motherboard M.2 slot data missing");
    } else if (mbM2Slots === 0) {
      blockers.push("Motherboard has no M.2 slots — NVMe SSD cannot be installed");
    } else {
      notes.push(`NVMe M.2 SSD can be installed in one of ${mbM2Slots} M.2 slot(s)`);
    }
  }

  if (isSata) {
    if (mbSataSlots === undefined) {
      warnings.push("Cannot verify SATA port availability — motherboard SATA data missing");
    } else if (mbSataSlots === 0) {
      blockers.push("Motherboard has no SATA ports — SATA storage cannot be connected");
    } else {
      notes.push(`SATA storage supported — motherboard has ${mbSataSlots} SATA port(s)`);
    }
  }

  return result(blockers, warnings, notes);
};

// ─── Full Build Check ─────────────────────────────────────────────────────────

export const checkBuildCompatibility = (components = []) => {
  const results = [];

  const cpu = components.find((c) => c.type === "CPU");
  const gpu = components.find((c) => c.type === "GPU");
  const ram = components.find((c) => c.type === "RAM");
  const motherboard = components.find((c) => c.type === "Motherboard");
  const cabinet = components.find((c) => c.type === "Cabinet");
  const storageList = components.filter((c) => c.type === "Storage");

  if (cpu && motherboard) {
    results.push(checkCpuMotherboard(cpu, motherboard));
  }

  if (ram && motherboard) {
    results.push(checkRamMotherboard(ram, motherboard));
  }

  if (motherboard && cabinet) {
    results.push(checkMotherboardCabinet(motherboard, cabinet));
  }

  if (components.some((c) => c.type === "PSU")) {
    results.push(checkPsuWattage(components));
  }

  for (const storage of storageList) {
    if (motherboard) {
      results.push(checkStorageSupport(storage, motherboard));
    }
  }

  const gpuLength = gpu?.specs?.length;
  const cabinetMaxGpu = cabinet?.specs?.maxGpuLength;
  if (gpuLength && cabinetMaxGpu) {
    if (gpuLength > cabinetMaxGpu) {
      results.push(
        result([
          `GPU length (${gpuLength}mm) exceeds cabinet maximum GPU clearance (${cabinetMaxGpu}mm)`,
        ])
      );
    } else {
      results.push(result([], [], [`GPU fits cabinet: ${gpuLength}mm ≤ ${cabinetMaxGpu}mm clearance`]));
    }
  }

  const cooler = components.find((c) => c.type === "Cooling");
  const coolerHeight = cooler?.specs?.height;
  const cabinetMaxCooler = cabinet?.specs?.maxCpuCoolerHeight;
  if (coolerHeight && cabinetMaxCooler) {
    if (coolerHeight > cabinetMaxCooler) {
      results.push(
        result([
          `CPU cooler height (${coolerHeight}mm) exceeds cabinet clearance (${cabinetMaxCooler}mm)`,
        ])
      );
    } else {
      results.push(result([], [], [`Cooler height OK: ${coolerHeight}mm ≤ ${cabinetMaxCooler}mm`]));
    }
  }

  if (cooler && cpu) {
    const coolerSockets = cooler?.compatibility?.sockets ?? [];
    const cpuSocket = cpu?.compatibility?.socket;
    if (cpuSocket && coolerSockets.length > 0 && !coolerSockets.includes(cpuSocket)) {
      results.push(
        result([
          `CPU cooler does not support CPU socket (${cpuSocket}). Supported: ${coolerSockets.join(", ")}`,
        ])
      );
    } else if (cpuSocket && coolerSockets.includes(cpuSocket)) {
      results.push(result([], [], [`CPU cooler supports socket ${cpuSocket}`]));
    }
  }

  return results.length > 0 ? merge(...results) : result([], [], ["No compatibility pairs found to check"]);
};