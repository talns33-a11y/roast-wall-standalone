import { NodeServer } from '@bitdev/node.node-server';

/**
 * Roast service app definition.
 *
 * Mongoose's optional native C++ bindings (kerberos, snappy, etc.) cannot be
 * bundled by esbuild. Marking only those as external lets esbuild skip them
 * safely — they are optional and mongoose works perfectly without them.
 * mongoose and mongodb themselves ARE bundled so they are self-contained in
 * the deployment artifact.
 */
export default NodeServer.from({
  name: 'roast-service',
  mainPath: import.meta.resolve('./roast-service.app-root.js'),
  esbuildOptions: {
    external: [
      'kerberos',
      'mongodb-client-encryption',
      '@mongodb-js/zstd',
      '@aws-sdk/credential-providers',
      'snappy',
      'socks',
      'aws4',
      'bson-ext',
    ],
  },
});
