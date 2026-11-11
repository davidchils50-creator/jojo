// Mathematical Projection Engine for Pseudo-3D Mode (Guardian Tales Style)

import { Camera3D, Direction8, Vector3D } from './types';

// Default camera tilt: ~54.7 degrees (cos(54.7°) ≈ 0.577, standard dimetric / top-down perspective)
export const DEFAULT_TILT = Math.PI / 3.3; // ~54.5 degrees

/**
 * Projects a 3D world coordinate into a 2D screen coordinate.
 * In Guardian Tales perspective:
 * - X corresponds directly to screen horizontal coordinate.
 * - Z (depth) projects downward on the screen, foreshortened by sin(tilt).
 * - Y (elevation/height) projects directly UPWARD (negative screen Y).
 */
export function worldToScreen(
  pos: Vector3D,
  camera: Camera3D,
  viewWidth: number,
  viewHeight: number
): { screenX: number; screenY: number; scale: number; depth: number } {
  const dx = pos.x - camera.x;
  const dz = pos.z - camera.z;
  const dy = pos.y;

  const tiltFactor = Math.sin(camera.tiltAngle);

  // Subtle perspective scale to give objects further north a slight sense of depth
  // while keeping Guardian Tales' clean, readable pixel-clarity
  const baseZoom = camera.zoom;
  const perspectiveDepth = dz * 0.0003;
  const scale = Math.max(0.65, Math.min(1.4, baseZoom * (1 + perspectiveDepth)));

  const screenX = viewWidth * 0.5 + dx * scale;
  const screenY = viewHeight * 0.5 + (dz * tiltFactor - dy) * scale;

  return {
    screenX,
    screenY,
    scale,
    depth: pos.z // Depth used for Painter's sorting (larger Z renders in front)
  };
}

/**
 * Linearly interpolates between two angles taking shortest path
 */
export function lerpAngle(current: number, target: number, t: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * t;
}

/**
 * Converts a continuous angle (-PI to PI) into an 8-direction enum
 */
export function angleToDirection8(angle: number): Direction8 {
  const octant = Math.round((angle / (Math.PI / 4)) + 8) % 8;
  switch (octant) {
    case 0: return 'right';
    case 1: return 'down_right';
    case 2: return 'down';
    case 3: return 'down_left';
    case 4: return 'left';
    case 5: return 'up_left';
    case 6: return 'up';
    case 7: return 'up_right';
    default: return 'down';
  }
}

/**
 * Converts a vector (dx, dz) into an 8-direction enum
 */
export function vectorToDirection8(dx: number, dz: number): Direction8 {
  if (Math.abs(dx) < 0.1 && Math.abs(dz) < 0.1) return 'down';
  const angle = Math.atan2(dz, dx); // -PI to PI
  return angleToDirection8(angle);
}

/**
 * 2D distance on the ground plane (X-Z)
 */
export function distanceXZ(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Circle-to-Circle collision resolve in X-Z plane
 */
export function resolveCircleCollision(
  a: { x: number; z: number; radius: number },
  b: { x: number; z: number; radius: number }
): { collided: boolean; normalX: number; normalZ: number; overlap: number } {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const minDist = a.radius + b.radius;

  if (dist < minDist && dist > 0.0001) {
    const overlap = minDist - dist;
    const nx = dx / dist;
    const nz = dz / dist;
    return { collided: true, normalX: nx, normalZ: nz, overlap };
  }

  return { collided: false, normalX: 0, normalZ: 0, overlap: 0 };
}
