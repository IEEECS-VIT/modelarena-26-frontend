// Minimal ambient declarations for three.js and its example modules
// This file provides `any` types so TypeScript compilation succeeds without
// installing full `@types/three`. For stricter typing, install the official
// types: `npm i -D @types/three` and remove or narrow these declarations.

declare module "three" {
  const Three: any;
  export = Three;
}

declare module "three/examples/jsm/postprocessing/EffectComposer.js" {
  export const EffectComposer: any;
}
declare module "three/examples/jsm/postprocessing/RenderPass.js" {
  export const RenderPass: any;
}
declare module "three/examples/jsm/postprocessing/UnrealBloomPass.js" {
  export const UnrealBloomPass: any;
}
declare module "three/examples/jsm/postprocessing/FilmPass.js" {
  export const FilmPass: any;
}
declare module "three/examples/jsm/lines/LineSegmentsGeometry.js" {
  export const LineSegmentsGeometry: any;
}
declare module "three/examples/jsm/lines/LineMaterial.js" {
  export const LineMaterial: any;
}
declare module "three/examples/jsm/lines/Line2.js" {
  export const Line2: any;
}
