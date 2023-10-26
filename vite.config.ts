import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envPrefix: 'VITE_',
  server: {
    port: 5175,
  },
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@emotion/styled', '@mui/material/Unstable_Grid2'],
  },
});
