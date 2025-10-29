// jest.config.js
module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.[t|j]sx?$": "babel-jest",
  },

  // ✅ Allow Jest to transform ESM dependencies like axios, pinia, vue-router
  transformIgnorePatterns: [
    "/node_modules/(?!axios|pinia|@vueuse|vue-router)"
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/main.js",
    "!src/router/**",
    "!src/store/**",
    "!**/node_modules/**",
  ],
  coverageReporters: ["html", "text-summary"],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
