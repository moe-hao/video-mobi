import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    packages: 'external',
    format: 'esm',
    sourcemap: true,
    minify: true,
    keepNames: true,
    preserveSymlinks: true,
    // alias: {
    //     '@volcengine/openapi/lib/services/vod': '@volcengine/openapi/lib/services/vod/index.js',
    // },
}).catch(() => process.exit(1));
