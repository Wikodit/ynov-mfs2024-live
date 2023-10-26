/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  const svgUrl: string;
  export = svgUrl;
}