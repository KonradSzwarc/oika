import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    devtools(), // must be first
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    nitroV2Plugin({ preset: 'node-server' }),
    viteReact(), // react's vite plugin must come after start's vite plugin
  ],
});
