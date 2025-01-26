module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.cjs",
  },
};
