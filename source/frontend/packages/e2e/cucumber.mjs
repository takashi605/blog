export default {
  loader: ['ts-node/esm'],
  paths: ['tests/**/*.feature'],
  import: ['support/*.ts','tests/**/*.spec.ts'],
};
