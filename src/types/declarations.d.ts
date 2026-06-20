declare module "canvas-confetti" {
  type ConfettiOptions = {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForced3D?: boolean;
  };
  const confetti: (options?: ConfettiOptions) => Promise<null> | null;
  export default confetti;
}
