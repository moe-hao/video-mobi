import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    packages: 'bundle',
    format: 'esm',
    sourcemap: true,
    minify: true,
}).catch(error => {
    console.error(error);
    process.exit(1);
})

