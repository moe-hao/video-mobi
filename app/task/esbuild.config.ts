import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    packages: 'bundle',
    format: 'esm',
    sourcemap: true,
    sourcesContent: false,
    minify: true,
    banner: {
        js: `import { createRequire as __mobiRequire } from "module"; const require = __mobiRequire(import.meta.url);`,
    },
}).catch(() => process.exit(1));
