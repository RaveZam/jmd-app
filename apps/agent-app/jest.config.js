// jest-expo preset runs BOTH pure-logic TS tests (core/helpers) and
// React Native component tests (renders RN components in a fake screen).
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  // Files we want transformed even though they live in node_modules
  // (RN ships untranspiled ES modules).
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@testing-library/.*|uuid))",
  ],
};
