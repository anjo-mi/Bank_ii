const ignore = {
  testPathIgnorePatterns: [
    ".*\\.spec\\.js$", // ignore .spec.js files
    "tests-examples", // ignore tests-examples folder
    "load-setup\\.test\\.js$", // ignore specific file
  ],
};

export default ignore;
