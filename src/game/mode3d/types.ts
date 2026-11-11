// Types for 3D/Pseudo-3D Mode (Guardian Tales Top-Down Tilted Style)

export interface Vector3D {
  x: number; // Horizontal (West <-> East)
  y: number; // Vertical height / Elevation (0 = Ground level)
  z: number; // Depth (North <-> South, higher Z is closer to camera)
}

export interface Camera3D {
  x: number;
  z: number;
  zoom: number;
  tiltAngle: number; // Radians, e.g. 50-60 degrees top-down tilt
  targetX: number;
  targetZ: number;
}

export type Direction8 = 'down' | 'down_right' | 'right' | 'up_right' | 'up' | 'up_left' | 'left' | 'down_left';

export interface Entity3D {
  id: string;
  type: 'player' | 'dummy' | 'obstacle';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  height: number;
  facing: Direction8;
  facingAngle: number; // Radians 0..2PI
  hp: number;
  maxHp: number;
  isGrounded: boolean;
  action: 'idle' | 'walk' | 'attack' | 'hit' | 'jump';
  actionTimer: number;
  actionDuration: number;
  comboStep: number;
  hitStun: number;
  color: string;
  name: string;
}

export interface Obstacle3D {
  id: string;
  type: 'pillar' | 'crate' | 'torch';
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  radius: number;
  color: string;
}

export interface Particle3D {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'dust' | 'fire' | 'text';
  text?: string;
}

export interface InputState3D {
  moveX: number; // -1 to 1
  moveZ: number; // -1 to 1
  attack: boolean;
  jump: boolean;
  dodge: boolean;
}
