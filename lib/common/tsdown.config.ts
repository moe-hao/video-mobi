import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "src/**/*.ts",
    platform: "node",
    unbundle: true,
    dts: true,
    format: "esm",
    outDir: "dist",
    clean: true,
    fixedExtension: false,
    minify: true
});
