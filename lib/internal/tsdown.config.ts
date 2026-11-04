import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "src/**/*.ts",
    platform: "node",
    unbundle: true,
    format: "esm",
    outDir: "dist",
    clean: true,
    fixedExtension: false
});

