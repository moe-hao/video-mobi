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
}).catch(() => process.exit(1));
