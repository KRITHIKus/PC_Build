import recommendedBuilds from "./recommends.builds.js";
import user1Builds from "./user1.builds.seed.js";
import user2Builds from "./user2.builds.seed.js";

const buildsSeedData = [
  ...recommendedBuilds,
  ...user1Builds,
  ...user2Builds,
];

export default buildsSeedData;