export default {
  timeout: 15 * 1000,
  loader: ['ts-node/esm'],
  paths: ['tests/**/*.feature'],
  import: ['tests/**/*.spec.ts'],
};
