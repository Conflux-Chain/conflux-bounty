/**
 * @fileOverview jest configuration
 * @name jest.config.js
 */

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/*/RbGenerated*/*.{js,jsx}',
    '!src/App.js',
    '!src/globalStyles/*',
    '!src/*/*/Loadable.{js,jsx}',
  ],
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      // coverage needs to met to pass the test
      // statements: 98,
      // branches: 91,
      // functions: 98,
      // lines: 98,
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.js',
    '@testing-library/react/cleanup-after-each',
    '@testing-library/jest-dom/extend-expect',
    '<rootDir>/internals/testing/mount-webpack-defineplugin-envs.js',
  ],
  setupFiles: ['raf/polyfill', '<rootDir>/internals/testing/mock-store.js'],
  testRegex: 'tests/.*\\.test\\.js$',
  snapshotSerializers: [],
};
