// Pure 2D/Pseudo-3D Canvas Renderer (Guardian Tales Top-Down Tilted Camera Style)
// NO 3D models used! All procedural Canvas 2D with mathematical projection & Y-sorting!

import { Mode3DEngine, ARENA_BOUNDS } from './engine';
import { worldToScreen } from './math';
import { Entity3D, Obstacle3D, Direction8 } from './types';

export interface DirectionKeyframe {
  headOffsetX: number;
  chestHalfW: number;
  hipHalfW: number;
  shoulderOffsetX: number;
  hipOffsetX: number;
  leftShoulderBase: { x: number; y: number };
  rightShoulderBase: { x: number; y: number };
  leftHipBase: { x: number; y: number };
  rightHipBase: { x: number; y: number };
  leftFootBase: { x: number; y: number };
  rightFootBase: { x: number; y: number };
  leftHandBase: { x: number; y: number };
  rightHandBase: { x: number; y: number };
  footStride: { x: number; y: number };
  armSwing: { x: number; y: number };
  isFacingUp: boolean;
  elbowFlexLeft: { x: number; y: number };
  elbowFlexRight: { x: number; y: number };
  leftArmDepthBias: number;
  rightArmDepthBias: number;
  leftLegDepthBias: number;
  rightLegDepthBias: number;
}

// 16 Transitional Direction Sheets evenly spaced at 22.5-degree intervals (0..15)
// Combines 8 primary directions + 8 dedicated intermediate transition sheets with true continuous 3D rotation
export const DIRECTION_KEYFRAMES: DirectionKeyframe[] = Array.from({ length: 16 }, (_, i) => {
  const theta = (i * Math.PI * 2) / 16;
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const sinAbs = Math.abs(sin);

  return {
    headOffsetX: cos * 2.2,
    chestHalfW: 3.6 + 3.9 * sinAbs,
    hipHalfW: 2.2 + 2.6 * sinAbs,
    shoulderOffsetX: 6.2,
    hipOffsetX: 3.8,
    leftShoulderBase: { x: sin * 6.2, y: 3.5 - cos * 1.2 },
    rightShoulderBase: { x: -sin * 6.2, y: 3.5 + cos * 1.2 },
    leftHipBase: { x: sin * 3.8, y: 0 },
    rightHipBase: { x: -sin * 3.8, y: 0 },
    leftFootBase: { x: sin * 3.8, y: -2.5 - cos * 1.5 },
    rightFootBase: { x: -sin * 3.8, y: -2.5 + cos * 1.5 },
    leftHandBase: { x: sin * 7.6, y: -28.0 - cos * 1.2 },
    rightHandBase: { x: -sin * 7.6, y: -28.0 + cos * 1.2 },
    footStride: { x: cos * 6.5, y: sin * 3.5 },
    armSwing: { x: cos * 4.8, y: sin * 2.4 },
    isFacingUp: sin < -0.2,
    elbowFlexLeft: { x: sin * 1.4 - cos * 1.8, y: -sin * 0.8 - 0.2 },
    elbowFlexRight: { x: -sin * 1.4 - cos * 1.8, y: -sin * 0.8 - 0.2 },
    leftArmDepthBias: -cos * 6.5,
    rightArmDepthBias: cos * 6.5,
    leftLegDepthBias: -cos * 4.5,
    rightLegDepthBias: cos * 4.5
  };
});

function dirToAngle(dir: string): number {
  switch (dir) {
    case 'right': return 0;
    case 'down_right': return Math.PI / 4;
    case 'down': return Math.PI / 2;
    case 'down_left': return 3 * Math.PI / 4;
    case 'left': return Math.PI;
    case 'up_left': return -3 * Math.PI / 4;
    case 'up': return -Math.PI / 2;
    case 'up_right': return -Math.PI / 4;
    default: return Math.PI / 2;
  }
}

function solveArmIK(
  pShoulder: { x: number; y: number },
  pHand: { x: number; y: number },
  chestCenter: { x: number; y: number },
  isLeftArm: boolean,
  L1: number,
  L2: number
): { x: number; y: number } {
  const dx = pHand.x - pShoulder.x;
  const dy = pHand.y - pShoulder.y;
  const dist = Math.hypot(dx, dy);

  if (dist >= L1 + L2 - 0.001) {
    const ratio = L1 / (L1 + L2);
    return {
      x: pShoulder.x + dx * ratio,
      y: pShoulder.y + dy * ratio
    };
  }

  const safeDist = Math.max(0.1, dist);
  const cosAlpha = Math.max(-1, Math.min(1, (L1 * L1 + safeDist * safeDist - L2 * L2) / (2 * L1 * safeDist)));
  const hParallel = L1 * cosAlpha;
  const hPerp = Math.sqrt(Math.max(0, L1 * L1 - hParallel * hParallel));

  const ux = dx / safeDist;
  const uy = dy / safeDist;

  // Two candidate perpendicular vectors
  const midX = pShoulder.x + ux * hParallel;
  const midY = pShoulder.y + uy * hParallel;

  const candidate1 = { x: midX - uy * hPerp, y: midY + ux * hPerp };
  const candidate2 = { x: midX + uy * hPerp, y: midY - ux * hPerp };

  // Scoring function: natural outward bend from chest & downward gravity
  const fromChestX = pShoulder.x - chestCenter.x;
  const score1 = (candidate1.x - chestCenter.x) * fromChestX + (candidate1.y - pShoulder.y) * 4.0;
  const score2 = (candidate2.x - chestCenter.x) * fromChestX + (candidate2.y - pShoulder.y) * 4.0;

  return score1 >= score2 ? candidate1 : candidate2;
}

function lerp2D(a: { x: number; y: number }, b: { x: number; y: number }, t: number): { x: number; y: number } {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}

export class Mode3DRenderer {
  private ctx: CanvasRenderingContext2D;
  private entityVisualAngles: Map<string, number> = new Map();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public render(engine: Mode3DEngine, width: number, height: number) {
    const ctx = this.ctx;
    const camera = engine.camera;

    // Apply Screen Shake if active
    ctx.save();
    if (engine.screenShake > 0) {
      const sx = (Math.random() - 0.5) * engine.screenShake * 2;
      const sy = (Math.random() - 0.5) * engine.screenShake * 2;
      ctx.translate(sx, sy);
    }

    // 1. Clear background with ambient arena atmosphere
    this.renderAtmosphere(width, height);

    // 2. Render 3D Tilted Floor & Arena Courtyard Grid
    this.renderFloorGrid(engine, width, height);

    // 3. Render Arena Boundary Fences & Walls
    this.renderArenaBoundaries(engine, width, height);

    // 4. Collect & Depth-Sort (Y-Sort) All Entities, Obstacles, and Renderables
    this.renderDepthSortedScene(engine, width, height);

    // 5. Render Floating Damage Numbers & Combat Text
    this.renderCombatText(engine, width, height);

    ctx.restore();
  }

  private renderAtmosphere(width: number, height: number) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  private renderFloorGrid(engine: Mode3DEngine, width: number, height: number) {
    const ctx = this.ctx;
    const cam = engine.camera;

    const tileSize = 60;
    const minTileX = Math.floor(ARENA_BOUNDS.minX / tileSize);
    const maxTileX = Math.ceil(ARENA_BOUNDS.maxX / tileSize);
    const minTileZ = Math.floor(ARENA_BOUNDS.minZ / tileSize);
    const maxTileZ = Math.ceil(ARENA_BOUNDS.maxZ / tileSize);

    for (let tz = minTileZ; tz < maxTileZ; tz++) {
      for (let tx = minTileX; tx < maxTileX; tx++) {
        const x0 = tx * tileSize;
        const z0 = tz * tileSize;
        const x1 = (tx + 1) * tileSize;
        const z1 = (tz + 1) * tileSize;

        // 4 corners of tile in 3D world
        const p0 = worldToScreen({ x: x0, y: 0, z: z0 }, cam, width, height);
        const p1 = worldToScreen({ x: x1, y: 0, z: z0 }, cam, width, height);
        const p2 = worldToScreen({ x: x1, y: 0, z: z1 }, cam, width, height);
        const p3 = worldToScreen({ x: x0, y: 0, z: z1 }, cam, width, height);

        // Checkerboard stone pattern (Guardian Tales Courtyard)
        const isAlt = (tx + tz) % 2 === 0;
        const isCenter = Math.abs(tx) <= 1 && Math.abs(tz) <= 1;

        if (isCenter) {
          ctx.fillStyle = isAlt ? '#334155' : '#1e293b';
        } else {
          ctx.fillStyle = isAlt ? '#1e293b' : '#0f172a';
        }

        ctx.beginPath();
        ctx.moveTo(p0.screenX, p0.screenY);
        ctx.lineTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.lineTo(p3.screenX, p3.screenY);
        ctx.closePath();
        ctx.fill();

        // Stone Tile Borders
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Center Arena Emblem (Golden Rune Ring on Floor)
    const centerScreen = worldToScreen({ x: 0, y: 0, z: 0 }, cam, width, height);
    ctx.save();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = 2.5 * centerScreen.scale;
    ctx.beginPath();
    // Tilt the circle ellipse to match top-down tilt
    ctx.ellipse(centerScreen.screenX, centerScreen.screenY, 70 * centerScreen.scale, 70 * Math.sin(cam.tiltAngle) * centerScreen.scale, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5 * centerScreen.scale;
    ctx.beginPath();
    ctx.ellipse(centerScreen.screenX, centerScreen.screenY, 110 * centerScreen.scale, 110 * Math.sin(cam.tiltAngle) * centerScreen.scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private renderArenaBoundaries(engine: Mode3DEngine, width: number, height: number) {
    const ctx = this.ctx;
    const cam = engine.camera;

    // Outer Boundary Wall Rim
    const b = ARENA_BOUNDS;
    const c0 = worldToScreen({ x: b.minX, y: 0, z: b.minZ }, cam, width, height);
    const c1 = worldToScreen({ x: b.maxX, y: 0, z: b.minZ }, cam, width, height);
    const c2 = worldToScreen({ x: b.maxX, y: 0, z: b.maxZ }, cam, width, height);
    const c3 = worldToScreen({ x: b.minX, y: 0, z: b.maxZ }, cam, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(c0.screenX, c0.screenY);
    ctx.lineTo(c1.screenX, c1.screenY);
    ctx.lineTo(c2.screenX, c2.screenY);
    ctx.lineTo(c3.screenX, c3.screenY);
    ctx.closePath();
    ctx.stroke();

    // Boundary Wall Glow
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  private renderDepthSortedScene(engine: Mode3DEngine, width: number, height: number) {
    const cam = engine.camera;

    // Collect all elements with depth key (world Z coordinate)
    type RenderItem =
      | { type: 'entity'; depth: number; entity: Entity3D }
      | { type: 'obstacle'; depth: number; obstacle: Obstacle3D }
      | { type: 'particle'; depth: number; particle: import('./types').Particle3D };

    const renderList: RenderItem[] = [];

    // Add Player & Dummy
    renderList.push({ type: 'entity', depth: engine.player.z, entity: engine.player });
    renderList.push({ type: 'entity', depth: engine.dummy.z, entity: engine.dummy });

    // Add Obstacles
    for (const obs of engine.obstacles) {
      renderList.push({ type: 'obstacle', depth: obs.z, obstacle: obs });
    }

    // Add 3D Particles
    for (const p of engine.particles) {
      if (p.type !== 'text') {
        renderList.push({ type: 'particle', depth: p.z, particle: p });
      }
    }

    // Painter's Algorithm Sorting (Ascending Z: furthest north objects drawn first, closest south drawn last)
    renderList.sort((a, b) => a.depth - b.depth);

    // Render sorted items
    for (const item of renderList) {
      if (item.type === 'entity') {
        this.renderEntity(item.entity, cam, width, height, engine.time);
      } else if (item.type === 'obstacle') {
        this.renderObstacle(item.obstacle, cam, width, height, engine.time);
      } else if (item.type === 'particle') {
        this.renderParticle(item.particle, cam, width, height);
      }
    }
  }

  // --- 2.5D STYLIZED STICKMAN MODEL (NO NECK, SLIMMER LIMBS, NATURAL FLEXED ARMS & LEGS) ---

  private drawLightGreyHead(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number, r: number,
    outlineColor: string
  ) {
    ctx.save();

    // Pass 1: Ink Outline
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 0.6, 0, Math.PI * 2);
    ctx.stroke();

    // Pass 2: Smooth 3D Specular Radial Gradient
    const grad = ctx.createRadialGradient(
      cx - r * 0.35, cy - r * 0.35, r * 0.08,
      cx, cy, r
    );
    grad.addColorStop(0, '#ffffff');   // High specular highlight
    grad.addColorStop(0.4, '#e2e8f0'); // Core light grey
    grad.addColorStop(0.85, '#cbd5e1'); // Soft shade edge
    grad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawGauntletArm(
    ctx: CanvasRenderingContext2D,
    pShoulder: { x: number; y: number },
    pHand: { x: number; y: number },
    pElbow: { x: number; y: number },
    scale: number,
    gauntletColor: string,
    outlineColor: string,
    isFarArm: boolean = false,
    isPunching: boolean = false
  ) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Proportional, heroic arm dimensions matching the base model
    const rBicep = (isPunching ? 2.3 : 2.1) * scale;
    const rGauntlet = (isPunching ? 2.9 : 2.6) * scale;

    // Wrist Cuff position at 75% of forearm
    const pWrist = {
      x: pElbow.x + (pHand.x - pElbow.x) * 0.75,
      y: pElbow.y + (pHand.y - pElbow.y) * 0.75
    };

    // Ambient occlusion depth shading for far arm vs near arm
    const bicepColor = isFarArm ? '#94a3b8' : '#e2e8f0';
    const cuffColor = isFarArm ? '#cbd5e1' : '#ffffff';
    const actualGauntletColor = isFarArm ? '#090d16' : gauntletColor;

    // 1. Outer Ink Outline (Shoulder -> Flexed Elbow -> Hand Fist)
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = rGauntlet * 2 + 2.0;
    ctx.beginPath();
    ctx.moveTo(pShoulder.x, pShoulder.y);
    ctx.lineTo(pElbow.x, pElbow.y);
    ctx.lineTo(pHand.x, pHand.y);
    ctx.stroke();

    // 2. Upper Arm Bicep Fill (Shoulder -> Elbow)
    ctx.strokeStyle = bicepColor;
    ctx.lineWidth = rBicep * 2;
    ctx.beginPath();
    ctx.moveTo(pShoulder.x, pShoulder.y);
    ctx.lineTo(pElbow.x, pElbow.y);
    ctx.stroke();

    // 3. Forearm Gauntlet Fill (Elbow -> Hand)
    ctx.strokeStyle = actualGauntletColor;
    ctx.lineWidth = rGauntlet * 2;
    ctx.beginPath();
    ctx.moveTo(pElbow.x, pElbow.y);
    ctx.lineTo(pHand.x, pHand.y);
    ctx.stroke();

    // 4. White Wrist Cuff Ring (Flush with forearm)
    ctx.fillStyle = cuffColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(pWrist.x, pWrist.y, rGauntlet * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. Fist End Ball (Impactful and proportional, never tiny)
    const rFist = rGauntlet * (isPunching ? 1.15 : 0.95);
    ctx.fillStyle = actualGauntletColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(pHand.x, pHand.y, rFist, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawFlaredPantsLeg(
    ctx: CanvasRenderingContext2D,
    pHip: { x: number; y: number },
    pFoot: { x: number; y: number },
    scale: number, pantsColor: string, bootColor: string, outlineColor: string,
    isFarLeg: boolean = false
  ) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Slimmer leg dimensions
    const rThigh = 2.4 * scale;
    const rCalf = 3.2 * scale;

    const actualPantsColor = isFarLeg ? '#111827' : pantsColor;
    const actualBootColor = isFarLeg ? '#1f2937' : bootColor;
    const toeCapColor = isFarLeg ? '#9ca3af' : '#d1d5db';

    // Knee Joint Midpoint (2-Segment Leg with subtle natural bend)
    const pKnee = {
      x: (pHip.x + pFoot.x) * 0.5 + (pFoot.x >= pHip.x ? 0.6 * scale : -0.6 * scale),
      y: (pHip.y + pFoot.y) * 0.5 - 0.4 * scale
    };

    // 1. Thigh Segment (Hip -> Knee) - Outline & Fill
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = rThigh * 2 + 2.0;
    ctx.beginPath(); ctx.moveTo(pHip.x, pHip.y); ctx.lineTo(pKnee.x, pKnee.y); ctx.stroke();

    ctx.strokeStyle = actualPantsColor;
    ctx.lineWidth = rThigh * 2;
    ctx.beginPath(); ctx.moveTo(pHip.x, pHip.y); ctx.lineTo(pKnee.x, pKnee.y); ctx.stroke();

    // 2. Calf Segment (Knee -> Foot) - Outline & Fill
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = rCalf * 2 + 2.0;
    ctx.beginPath(); ctx.moveTo(pKnee.x, pKnee.y); ctx.lineTo(pFoot.x, pFoot.y); ctx.stroke();

    ctx.strokeStyle = actualPantsColor;
    ctx.lineWidth = rCalf * 2;
    ctx.beginPath(); ctx.moveTo(pKnee.x, pKnee.y); ctx.lineTo(pFoot.x, pFoot.y); ctx.stroke();

    // Fabric Crease Fold Accents on Knee & Shin
    ctx.strokeStyle = isFarLeg ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.0 * scale;
    ctx.beginPath();
    ctx.moveTo(pKnee.x - 1 * scale, pKnee.y - 1 * scale);
    ctx.lineTo(pKnee.x + 1 * scale, pKnee.y + 1 * scale);
    ctx.stroke();

    // 3. Combat Boot at Foot (Slimmer Profile)
    const bootRx = 4.8 * scale;
    const bootRy = 3.2 * scale;

    ctx.fillStyle = outlineColor;
    ctx.beginPath();
    ctx.ellipse(pFoot.x, pFoot.y, bootRx + 1.8, bootRy + 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = actualBootColor;
    ctx.beginPath();
    ctx.ellipse(pFoot.x, pFoot.y, bootRx, bootRy, 0, 0, Math.PI * 2);
    ctx.fill();

    // Light Grey Toe Cap
    ctx.fillStyle = toeCapColor;
    ctx.beginPath();
    ctx.ellipse(pFoot.x, pFoot.y + bootRy * 0.25, bootRx * 0.7, bootRy * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawPunchSwoosh(
    ctx: CanvasRenderingContext2D,
    fistPos: { x: number; y: number },
    facingAngle: number,
    scale: number,
    comboStep: number,
    strikeExt: number
  ) {
    if (strikeExt < 0.35) return;
    ctx.save();
    ctx.translate(fistPos.x, fistPos.y);

    const alpha = Math.min(0.85, Math.max(0, (strikeExt - 0.35) / 0.45));

    if (comboStep === 3) {
      // Uppercut rising crescent arc & kinetic spark trail
      ctx.rotate(-Math.PI * 0.5); // Pointing upward
      const arcR = 17 * scale;

      ctx.lineWidth = 3.5 * scale;
      ctx.strokeStyle = `rgba(250, 204, 21, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(0, 0, arcR, -0.65, 0.85);
      ctx.stroke();

      ctx.lineWidth = 1.6 * scale;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
      ctx.beginPath();
      ctx.arc(0, 0, arcR, -0.4, 0.65);
      ctx.stroke();
    } else {
      // Forward punch kinetic crescent
      ctx.rotate(facingAngle);
      const arcR = (comboStep === 2 ? 15 : 12) * scale;
      const arcColor = comboStep === 2
        ? `rgba(56, 189, 248, ${alpha * 0.9})`
        : `rgba(224, 242, 254, ${alpha * 0.9})`;
      const coreColor = `rgba(255, 255, 255, ${alpha * 0.95})`;

      ctx.lineWidth = (comboStep === 2 ? 3.5 : 2.5) * scale;
      ctx.strokeStyle = arcColor;
      ctx.beginPath();
      ctx.arc(arcR * 0.2, 0, arcR, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      ctx.lineWidth = 1.4 * scale;
      ctx.strokeStyle = coreColor;
      ctx.beginPath();
      ctx.arc(arcR * 0.2, 0, arcR, -Math.PI * 0.25, Math.PI * 0.25);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderEntity(e: Entity3D, cam: import('./types').Camera3D, width: number, height: number, time: number) {
    const ctx = this.ctx;
    const baseProj = worldToScreen({ x: e.x, y: 0, z: e.z }, cam, width, height);
    const bodyScale = baseProj.scale;

    ctx.save();

    // 1. Projected Floor Shadow (Ellipse on ground plane at y = 0)
    const shadowAlpha = Math.max(0.15, 0.45 * (1 - e.y / 80));
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(
      baseProj.screenX,
      baseProj.screenY,
      e.radius * bodyScale * 0.95,
      e.radius * Math.sin(cam.tiltAngle) * bodyScale * 0.95,
      0, 0, Math.PI * 2
    );
    ctx.fill();

    // 2. 8-DIRECTIONAL 2.5D SPRITE RENDERING
    const dir = e.facing || 'down';
    const outlineColor = '#0f172a';
    const pantsColor = e.type === 'player' ? '#1f2937' : '#111827';
    const gauntletColor = '#0f172a';
    const bootColor = '#374151';

    const cx = baseProj.screenX;
    const cy = baseProj.screenY - e.y * bodyScale;

    const headR = 6.5 * bodyScale;

    // Movement & Attack Animation State
    const isAttacking = e.action === 'attack';
    const comboStep = e.comboStep || 1;
    const speedSq = e.vx * e.vx + e.vz * e.vz;
    const isMoving = (speedSq > 0.02 || e.action === 'walk') && !isAttacking;
    const walkFreq = 0.18; // Frame-rate multiplier for 1.7 strides/sec natural human gait
    const walkPhase = isMoving ? time * walkFreq : 0;
    const legAmp = isMoving ? Math.sin(walkPhase) : 0;
    const armAmp = isMoving ? Math.sin(walkPhase) : 0;
    const walkBounce = isMoving ? Math.abs(Math.sin(walkPhase * 2)) * 1.5 * bodyScale : 0;

    // Continuous Attack Combo Progress (0 to 1) & Kinetic Strike Curve with Impact Hold
    const attackProgress = isAttacking && (e.actionDuration || 0) > 0
      ? Math.min(1, Math.max(0, 1 - (e.actionTimer || 0) / e.actionDuration))
      : 0;

    let strikeExt = 0;
    let strikePhase: 'windup' | 'strike' | 'hold' | 'recovery' = 'windup';
    let stanceBlend = 0;
    if (isAttacking) {
      stanceBlend = Math.sin(attackProgress * Math.PI);

      if (comboStep === 3) {
        // Combo 3: Heavy Rising Uppercut Finisher
        // 0.00..0.24: Deep crouch & windup (drop low, fist cocked at waist)
        // 0.24..0.44: Explosive upward launch to apex
        // 0.44..0.74: IMPACT APEX HOLD! Full rising uppercut held proudly in midair
        // 0.74..1.00: Crisp landing & recovery to idle
        if (attackProgress < 0.24) {
          strikePhase = 'windup';
          strikeExt = -Math.sin((attackProgress / 0.24) * Math.PI) * 0.35;
        } else if (attackProgress < 0.44) {
          strikePhase = 'strike';
          const t = (attackProgress - 0.24) / 0.20;
          strikeExt = Math.sin(t * Math.PI * 0.5);
        } else if (attackProgress < 0.74) {
          strikePhase = 'hold';
          strikeExt = 1.0; // Clear, locked apex hold!
        } else {
          strikePhase = 'recovery';
          const t = (attackProgress - 0.74) / 0.26;
          strikeExt = 1.0 - Math.sin(t * Math.PI * 0.5);
        }
      } else {
        // Combo 1 (Left Jab) & Combo 2 (Right Straight Cross):
        // 0.00..0.20: Coiled windup
        // 0.20..0.42: Fast explosive punch thrust
        // 0.42..0.72: IMPACT HOLD! Full-reach punch held locked for readable impact!
        // 0.72..1.00: Athletic snap recoil to neutral
        if (attackProgress < 0.20) {
          strikePhase = 'windup';
          strikeExt = -Math.sin((attackProgress / 0.20) * Math.PI) * 0.28;
        } else if (attackProgress < 0.42) {
          strikePhase = 'strike';
          const t = (attackProgress - 0.20) / 0.22;
          strikeExt = Math.sin(t * Math.PI * 0.5);
        } else if (attackProgress < 0.72) {
          strikePhase = 'hold';
          strikeExt = 1.0; // Clear, locked impact hold!
        } else {
          strikePhase = 'recovery';
          const t = (attackProgress - 0.72) / 0.28;
          strikeExt = 1.0 - Math.sin(t * Math.PI * 0.5);
        }
      }
    }

    // --- CONTINUOUS TRANSITIONAL DIRECTION INTERPOLATION (SMOOTH 360 / 16-SHEET TRANSITION) ---
    const targetAngle = Number.isFinite(e.facingAngle) ? e.facingAngle : dirToAngle(e.facing || 'down');
    let visualAngle = this.entityVisualAngles.get(e.id);
    if (visualAngle === undefined) {
      visualAngle = targetAngle;
    } else {
      let diff = targetAngle - visualAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      visualAngle += diff * 0.25; // Smooth rotational lerp without snapping
    }
    this.entityVisualAngles.set(e.id, visualAngle);

    let normAngle = visualAngle % (Math.PI * 2);
    if (normAngle < 0) normAngle += Math.PI * 2;

    const step = (Math.PI * 2) / 16; // 22.5 degrees (PI/8) between each of the 16 sheets
    const indexFloat = normAngle / step;
    const indexA = Math.floor(indexFloat) % 16;
    const indexB = (indexA + 1) % 16;
    const blendT = indexFloat - Math.floor(indexFloat);

    const sheetA = DIRECTION_KEYFRAMES[indexA];
    const sheetB = DIRECTION_KEYFRAMES[indexB];

    const lerpVal = (a: number, b: number) => a + (b - a) * blendT;

    const headOffsetX = lerpVal(sheetA.headOffsetX, sheetB.headOffsetX);
    const chestHalfW = lerpVal(sheetA.chestHalfW, sheetB.chestHalfW) * bodyScale;
    const hipHalfW = lerpVal(sheetA.hipHalfW, sheetB.hipHalfW) * bodyScale;
    const leftShoulderBaseX = lerpVal(sheetA.leftShoulderBase.x, sheetB.leftShoulderBase.x);
    const leftShoulderBaseY = lerpVal(sheetA.leftShoulderBase.y, sheetB.leftShoulderBase.y);
    const rightShoulderBaseX = lerpVal(sheetA.rightShoulderBase.x, sheetB.rightShoulderBase.x);
    const rightShoulderBaseY = lerpVal(sheetA.rightShoulderBase.y, sheetB.rightShoulderBase.y);

    const leftHipBaseX = lerpVal(sheetA.leftHipBase.x, sheetB.leftHipBase.x);
    const leftHipBaseY = lerpVal(sheetA.leftHipBase.y, sheetB.leftHipBase.y);
    const rightHipBaseX = lerpVal(sheetA.rightHipBase.x, sheetB.rightHipBase.x);
    const rightHipBaseY = lerpVal(sheetA.rightHipBase.y, sheetB.rightHipBase.y);

    const leftFootBaseX = lerpVal(sheetA.leftFootBase.x, sheetB.leftFootBase.x);
    const leftFootBaseY = lerpVal(sheetA.leftFootBase.y, sheetB.leftFootBase.y);
    const rightFootBaseX = lerpVal(sheetA.rightFootBase.x, sheetB.rightFootBase.x);
    const rightFootBaseY = lerpVal(sheetA.rightFootBase.y, sheetB.rightFootBase.y);

    const leftHandBaseX = lerpVal(sheetA.leftHandBase.x, sheetB.leftHandBase.x);
    const leftHandBaseY = lerpVal(sheetA.leftHandBase.y, sheetB.leftHandBase.y);
    const rightHandBaseX = lerpVal(sheetA.rightHandBase.x, sheetB.rightHandBase.x);
    const rightHandBaseY = lerpVal(sheetA.rightHandBase.y, sheetB.rightHandBase.y);

    const strideDirX = lerpVal(sheetA.footStride.x, sheetB.footStride.x);
    const strideDirY = lerpVal(sheetA.footStride.y, sheetB.footStride.y);

    const armSwingDirX = lerpVal(sheetA.armSwing.x, sheetB.armSwing.x);
    const armSwingDirY = lerpVal(sheetA.armSwing.y, sheetB.armSwing.y);

    let elbowFlexLeft = {
      x: lerpVal(sheetA.elbowFlexLeft.x, sheetB.elbowFlexLeft.x) * bodyScale,
      y: lerpVal(sheetA.elbowFlexLeft.y, sheetB.elbowFlexLeft.y) * bodyScale
    };
    let elbowFlexRight = {
      x: lerpVal(sheetA.elbowFlexRight.x, sheetB.elbowFlexRight.x) * bodyScale,
      y: lerpVal(sheetA.elbowFlexRight.y, sheetB.elbowFlexRight.y) * bodyScale
    };

    const leftArmDepthBias = lerpVal(sheetA.leftArmDepthBias, sheetB.leftArmDepthBias);
    const rightArmDepthBias = lerpVal(sheetA.rightArmDepthBias, sheetB.rightArmDepthBias);
    const leftLegDepthBias = lerpVal(sheetA.leftLegDepthBias, sheetB.leftLegDepthBias);
    const rightLegDepthBias = lerpVal(sheetA.rightLegDepthBias, sheetB.rightLegDepthBias);

    // 2.5D Directional Forward & Lateral Vectors
    const facingCos = Math.cos(visualAngle);
    const facingSin = Math.sin(visualAngle);
    const fwdScreenX = facingCos;
    const fwdScreenY = facingSin * 0.5;
    const sideScreenX = -facingSin;
    const sideScreenY = facingCos * 0.5;

    // Torso subtle dynamic lunge & uppercut height
    const lungeDist = isAttacking
      ? (comboStep === 3 ? 2.2 : (comboStep === 2 ? 3.0 : 2.0)) * Math.max(0, strikeExt) * bodyScale
      : 0;
    const uppercutLift = (isAttacking && comboStep === 3)
      ? Math.max(0, strikeExt) * 10.0 * bodyScale
      : 0;

    // Heightened Torso (Elongated chest vertically, shoulders sit clearly below head)
    const chestX = cx + fwdScreenX * lungeDist;
    const chestY = cy - 66 * bodyScale - walkBounce - uppercutLift + fwdScreenY * lungeDist;
    const headX = cx + (headOffsetX + fwdScreenX * (lungeDist * 0.5)) * bodyScale;
    const headY = chestY - headR * 1.0;
    const hipX = cx + fwdScreenX * (lungeDist * 0.35);
    const hipY = cy - 38 * bodyScale - walkBounce * 0.4 - uppercutLift * 0.4 + fwdScreenY * (lungeDist * 0.35);

    const stepLiftLeft = legAmp > 0 ? legAmp * 2.5 * bodyScale : 0;
    const stepLiftRight = legAmp < 0 ? Math.abs(legAmp) * 2.5 * bodyScale : 0;

    let leftFoot = {
      x: cx + (leftFootBaseX + legAmp * strideDirX) * bodyScale,
      y: cy + (leftFootBaseY + legAmp * strideDirY) * bodyScale - stepLiftLeft
    };
    let rightFoot = {
      x: cx + (rightFootBaseX - legAmp * strideDirX) * bodyScale,
      y: cy + (rightFootBaseY - legAmp * strideDirY) * bodyScale - stepLiftRight
    };

    if (isAttacking) {
      // Braced martial arts stance during punch (continuous smooth blending via stanceBlend)
      if (comboStep === 1) {
        // Left foot steps slightly forward, right foot braces behind
        leftFoot = {
          x: cx + (leftFootBaseX + fwdScreenX * 4.0 * stanceBlend) * bodyScale,
          y: cy + (leftFootBaseY + fwdScreenY * 2.0 * stanceBlend) * bodyScale
        };
        rightFoot = {
          x: cx + (rightFootBaseX - fwdScreenX * 2.5 * stanceBlend) * bodyScale,
          y: cy + (rightFootBaseY - fwdScreenY * 1.5 * stanceBlend) * bodyScale
        };
      } else if (comboStep === 2) {
        // Right foot steps in with hip drive, left foot braces behind
        rightFoot = {
          x: cx + (rightFootBaseX + fwdScreenX * 4.5 * stanceBlend) * bodyScale,
          y: cy + (rightFootBaseY + fwdScreenY * 2.2 * stanceBlend) * bodyScale
        };
        leftFoot = {
          x: cx + (leftFootBaseX - fwdScreenX * 2.5 * stanceBlend) * bodyScale,
          y: cy + (leftFootBaseY - fwdScreenY * 1.5 * stanceBlend) * bodyScale
        };
      } else {
        // Uppercut: both feet tuck slightly during airborne apex
        const tuck = Math.max(0, strikeExt) * 4.0 * bodyScale;
        leftFoot = {
          x: cx + (leftFootBaseX - fwdScreenX * 2.0 * stanceBlend) * bodyScale,
          y: cy + leftFootBaseY * bodyScale - tuck
        };
        rightFoot = {
          x: cx + (rightFootBaseX + fwdScreenX * 1.5 * stanceBlend) * bodyScale,
          y: cy + rightFootBaseY * bodyScale - tuck * 0.7
        };
      }
    }

    const leftHipPos = {
      x: hipX + leftHipBaseX * bodyScale,
      y: hipY + leftHipBaseY * bodyScale
    };
    const rightHipPos = {
      x: hipX + rightHipBaseX * bodyScale,
      y: hipY + rightHipBaseY * bodyScale
    };

    let leftShoulderPos = {
      x: chestX + leftShoulderBaseX * bodyScale,
      y: chestY + leftShoulderBaseY * bodyScale
    };
    let rightShoulderPos = {
      x: chestX + rightShoulderBaseX * bodyScale,
      y: chestY + rightShoulderBaseY * bodyScale
    };

    if (isAttacking) {
      if (comboStep === 1) {
        // Left Jab: Left shoulder drives forward, right pulls back
        leftShoulderPos.x += (fwdScreenX * 2.5 + sideScreenX * 0.8) * Math.max(0, strikeExt) * bodyScale;
        leftShoulderPos.y += fwdScreenY * 1.5 * Math.max(0, strikeExt) * bodyScale;
        rightShoulderPos.x -= (fwdScreenX * 1.5 + sideScreenX * 0.5) * Math.max(0, strikeExt) * bodyScale;
        rightShoulderPos.y -= fwdScreenY * 1.0 * Math.max(0, strikeExt) * bodyScale;
      } else if (comboStep === 2) {
        // Right Cross: Right shoulder drives forward with power, left pulls back
        rightShoulderPos.x += (fwdScreenX * 3.5 - sideScreenX * 0.8) * Math.max(0, strikeExt) * bodyScale;
        rightShoulderPos.y += fwdScreenY * 2.0 * Math.max(0, strikeExt) * bodyScale;
        leftShoulderPos.x -= (fwdScreenX * 2.0 - sideScreenX * 0.5) * Math.max(0, strikeExt) * bodyScale;
        leftShoulderPos.y -= fwdScreenY * 1.2 * Math.max(0, strikeExt) * bodyScale;
      } else {
        // Uppercut: Right shoulder lifts upward into strike, left drops
        const upS = Math.max(0, strikeExt);
        rightShoulderPos.x += fwdScreenX * 1.5 * upS * bodyScale;
        rightShoulderPos.y -= 3.0 * upS * bodyScale;
        leftShoulderPos.x -= fwdScreenX * 1.0 * upS * bodyScale;
        leftShoulderPos.y += 2.0 * upS * bodyScale;
      }
    }

    const baseLeftHand = {
      x: cx + (leftHandBaseX - armAmp * armSwingDirX) * bodyScale,
      y: cy + (leftHandBaseY - armAmp * armSwingDirY) * bodyScale
    };
    const baseRightHand = {
      x: cx + (rightHandBaseX + armAmp * armSwingDirX) * bodyScale,
      y: cy + (rightHandBaseY + armAmp * armSwingDirY) * bodyScale
    };

    let leftHand = { ...baseLeftHand };
    let rightHand = { ...baseRightHand };

    // Standard biological arm segment lengths (Upper Arm = 16.5, Forearm = 16.5, Total Reach = 33)
    const armSegmentL = 16.5 * bodyScale;

    if (isAttacking) {
      if (comboStep === 1) {
        // Combo 1: Left Lead Jab (Snappy, full-reach piston punch)
        const fistTarget = {
          x: leftShoulderPos.x + fwdScreenX * (29.0 * bodyScale),
          y: leftShoulderPos.y + (4.0 + fwdScreenY * 18.0) * bodyScale
        };
        const fistWindup = {
          x: leftShoulderPos.x + (-fwdScreenX * 4.0 - sideScreenX * 2.0) * bodyScale,
          y: leftShoulderPos.y + (16.0 - fwdScreenY * 4.0) * bodyScale
        };
        leftHand = strikeExt >= 0
          ? lerp2D(baseLeftHand, fistTarget, strikeExt)
          : lerp2D(baseLeftHand, fistWindup, -strikeExt);

        // Right Arm: Tight boxing guard protecting chin
        rightHand = {
          x: rightShoulderPos.x + (fwdScreenX * 5.0 - sideScreenX * 1.5) * bodyScale,
          y: rightShoulderPos.y + (3.0 + fwdScreenY * 3.0) * bodyScale
        };

      } else if (comboStep === 2) {
        // Combo 2: Right Straight Cross (Power reach straight punch)
        const fistTarget = {
          x: rightShoulderPos.x + fwdScreenX * (31.0 * bodyScale),
          y: rightShoulderPos.y + (4.0 + fwdScreenY * 20.0) * bodyScale
        };
        const fistWindup = {
          x: rightShoulderPos.x + (-fwdScreenX * 5.0 + sideScreenX * 2.0) * bodyScale,
          y: rightShoulderPos.y + (16.0 - fwdScreenY * 4.0) * bodyScale
        };
        rightHand = strikeExt >= 0
          ? lerp2D(baseRightHand, fistTarget, strikeExt)
          : lerp2D(baseRightHand, fistWindup, -strikeExt);

        // Left Arm: Tight boxing guard protecting cheek/chin
        leftHand = {
          x: leftShoulderPos.x + (fwdScreenX * 5.0 + sideScreenX * 1.5) * bodyScale,
          y: leftShoulderPos.y + (3.0 + fwdScreenY * 3.0) * bodyScale
        };

      } else {
        // Combo 3: Explosive Rising Uppercut Finisher
        const fistTarget = {
          x: rightShoulderPos.x + fwdScreenX * (16.0 * bodyScale),
          y: rightShoulderPos.y - (24.0 - fwdScreenY * 8.0) * bodyScale
        };
        const fistWindup = {
          x: rightShoulderPos.x + (-fwdScreenX * 3.0) * bodyScale,
          y: rightShoulderPos.y + 24.0 * bodyScale
        };
        rightHand = strikeExt >= 0
          ? lerp2D(baseRightHand, fistTarget, strikeExt)
          : lerp2D(baseRightHand, fistWindup, -strikeExt);

        // Left Arm: Dynamic counterbalance swept back and down
        leftHand = {
          x: leftShoulderPos.x + (-fwdScreenX * 11.0 + sideScreenX * 3.0) * bodyScale,
          y: leftShoulderPos.y + (18.0 - fwdScreenY * 4.0) * bodyScale
        };
      }
    }

    // Solve 2-segment arm IK for both arms (Guarantees Upper Arm = 16.5, Forearm = 16.5; NEVER SHRUNK, NEVER MUNGIL)
    let leftElbowPos: { x: number; y: number };
    let rightElbowPos: { x: number; y: number };

    if (isAttacking) {
      leftElbowPos = solveArmIK(leftShoulderPos, leftHand, { x: chestX, y: chestY }, true, armSegmentL, armSegmentL);
      rightElbowPos = solveArmIK(rightShoulderPos, rightHand, { x: chestX, y: chestY }, false, armSegmentL, armSegmentL);
    } else {
      leftElbowPos = {
        x: (leftShoulderPos.x + leftHand.x) * 0.5 + elbowFlexLeft.x,
        y: (leftShoulderPos.y + leftHand.y) * 0.5 + elbowFlexLeft.y
      };
      rightElbowPos = {
        x: (rightShoulderPos.x + rightHand.x) * 0.5 + elbowFlexRight.x,
        y: (rightShoulderPos.y + rightHand.y) * 0.5 + elbowFlexRight.y
      };
    }

    // --- PAINTER'S ALGORITHM CONTINUOUS 3D DEPTH-SORTED RENDERING ---
    // Pitch depth bias for head (Front facing = +Z = camera forward; Back facing = -Z = behind)
    const headDepth = hipY + Math.sin(visualAngle) * 4.0 * bodyScale;

    // Extra depth bias when facing camera so arms and hands stay cleanly in front of thighs/hips
    const cameraFrontBias = Math.sin(visualAngle) > 0 ? Math.sin(visualAngle) * 3.0 * bodyScale : 0;

    // Continuous 3D depth relative to torso (hipY)
    let leftArmDepth = hipY + (leftArmDepthBias * 1.3) * bodyScale + cameraFrontBias - armAmp * armSwingDirY * 0.4 * bodyScale;
    let rightArmDepth = hipY + (rightArmDepthBias * 1.3) * bodyScale + cameraFrontBias + armAmp * armSwingDirY * 0.4 * bodyScale;

    if (isAttacking) {
      if (comboStep === 1) {
        leftArmDepth = hipY + 18.0 * bodyScale;
        rightArmDepth = hipY + 6.0 * bodyScale;
      } else if (comboStep === 2) {
        rightArmDepth = hipY + 18.0 * bodyScale;
        leftArmDepth = hipY + 6.0 * bodyScale;
      } else {
        rightArmDepth = hipY + 20.0 * bodyScale;
        leftArmDepth = hipY + 5.0 * bodyScale;
      }
    }

    // Ambient depth shading active only when arm is in far background (behind torso in profile)
    const isLeftArmFar = !isAttacking && leftArmDepthBias < -2.5;
    const isRightArmFar = !isAttacking && rightArmDepthBias < -2.5;

    // Alternating leg stride depth (leg stepping forward is in front)
    const legStrideDepthLeft = legAmp * 3.0 * bodyScale;
    const legStrideDepthRight = -legAmp * 3.0 * bodyScale;

    // Leg depth anchored at hips (hipY), never using foot ground cy to prevent thigh overlapping hands
    const leftLegDepth = hipY + (leftLegDepthBias * 0.7) * bodyScale + legStrideDepthLeft;
    const rightLegDepth = hipY + (rightLegDepthBias * 0.7) * bodyScale + legStrideDepthRight;

    interface BodyPartItem {
      depth: number;
      render: () => void;
    }

    const isLeftStriking = isAttacking && comboStep === 1;
    const isRightStriking = isAttacking && (comboStep === 2 || comboStep === 3);

    const parts: BodyPartItem[] = [
      {
        depth: leftLegDepth,
        render: () => this.drawFlaredPantsLeg(ctx, leftHipPos, leftFoot, bodyScale, pantsColor, bootColor, outlineColor, leftLegDepth < rightLegDepth)
      },
      {
        depth: rightLegDepth,
        render: () => this.drawFlaredPantsLeg(ctx, rightHipPos, rightFoot, bodyScale, pantsColor, bootColor, outlineColor, rightLegDepth < leftLegDepth)
      },
      {
        depth: hipY,
        render: () => {
          ctx.save();
          // Belt
          ctx.fillStyle = outlineColor;
          ctx.fillRect(hipX - hipHalfW - 1 * bodyScale, hipY - 2 * bodyScale, (hipHalfW + 1 * bodyScale) * 2, 4 * bodyScale);

          // Tapered Light Grey Chest
          ctx.fillStyle = outlineColor;
          ctx.beginPath();
          ctx.moveTo(chestX - chestHalfW - 1.5, chestY - 1.5);
          ctx.lineTo(chestX + chestHalfW + 1.5, chestY - 1.5);
          ctx.lineTo(hipX + hipHalfW + 1.5, hipY + 1.5);
          ctx.lineTo(hipX - hipHalfW - 1.5, hipY + 1.5);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(chestX - chestHalfW, chestY);
          ctx.lineTo(chestX + chestHalfW, chestY);
          ctx.lineTo(hipX + hipHalfW, hipY);
          ctx.lineTo(hipX - hipHalfW, hipY);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      },
      {
        depth: headDepth,
        render: () => this.drawLightGreyHead(ctx, headX, headY, headR, outlineColor)
      },
      {
        depth: leftArmDepth,
        render: () => this.drawGauntletArm(
          ctx, leftShoulderPos, leftHand, leftElbowPos, bodyScale,
          gauntletColor, outlineColor, isLeftArmFar, isLeftStriking
        )
      },
      {
        depth: rightArmDepth,
        render: () => this.drawGauntletArm(
          ctx, rightShoulderPos, rightHand, rightElbowPos, bodyScale,
          gauntletColor, outlineColor, isRightArmFar, isRightStriking
        )
      }
    ];

    if (isAttacking && strikeExt > 0.35) {
      const activeFist = comboStep === 1 ? leftHand : rightHand;
      parts.push({
        depth: Math.max(leftArmDepth, rightArmDepth) + 2.0,
        render: () => this.drawPunchSwoosh(ctx, activeFist, visualAngle, bodyScale, comboStep, strikeExt)
      });
    }

    parts.sort((a, b) => a.depth - b.depth);
    for (const part of parts) {
      part.render();
    }

    // 3. Floating 3D Overhead Health Bar & Nameplate
    const hpBarW = 48 * bodyScale;
    const hpBarH = 5 * bodyScale;
    const hpBarX = headX - hpBarW * 0.5;
    const hpBarY = headY - 16 * bodyScale;
    const hpPct = Math.max(0, e.hp / e.maxHp);

    // HP Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(hpBarX - 1, hpBarY - 1, hpBarW + 2, hpBarH + 2);

    // HP Fill
    ctx.fillStyle = e.type === 'player' ? '#10b981' : '#f43f5e';
    ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPct, hpBarH);

    // Name label
    ctx.font = `900 ${Math.round(9.5 * bodyScale)}px "Impact", sans-serif`;
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.strokeText(e.name, headX, hpBarY - 3);
    ctx.fillText(e.name, headX, hpBarY - 3);

    ctx.restore();
  }

  private renderObstacle(obs: Obstacle3D, cam: import('./types').Camera3D, width: number, height: number, time: number) {
    const ctx = this.ctx;
    const baseProj = worldToScreen({ x: obs.x, y: 0, z: obs.z }, cam, width, height);
    const topProj = worldToScreen({ x: obs.x, y: obs.height, z: obs.z }, cam, width, height);
    const scale = baseProj.scale;

    ctx.save();

    if (obs.type === 'pillar') {
      // 1. Pillar Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(baseProj.screenX, baseProj.screenY, obs.radius * scale, obs.radius * Math.sin(cam.tiltAngle) * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Pillar Column Body (2.5D Cylinder)
      const r = obs.radius * scale * 0.8;
      const h = (baseProj.screenY - topProj.screenY);

      // Gradient shading for cylinder
      const colGrad = ctx.createLinearGradient(baseProj.screenX - r, 0, baseProj.screenX + r, 0);
      colGrad.addColorStop(0, '#334155');
      colGrad.addColorStop(0.5, '#64748b');
      colGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = colGrad;

      ctx.beginPath();
      ctx.rect(baseProj.screenX - r, topProj.screenY, r * 2, h);
      ctx.fill();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(baseProj.screenX - r, topProj.screenY, r * 2, h);

      // 3. Pillar Top Cap
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(topProj.screenX, topProj.screenY, r, r * Math.sin(cam.tiltAngle), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    } else if (obs.type === 'crate') {
      // 1. Crate Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(baseProj.screenX, baseProj.screenY, obs.width * scale * 0.6, obs.depth * Math.sin(cam.tiltAngle) * scale * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. 2.5D Wooden Crate Box Faces
      const halfW = (obs.width * 0.5) * scale;
      const h = obs.height * scale;

      // Front Face
      ctx.fillStyle = '#b45309';
      ctx.fillRect(baseProj.screenX - halfW, baseProj.screenY - h, halfW * 2, h);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(baseProj.screenX - halfW, baseProj.screenY - h, halfW * 2, h);

      // X brace on crate front
      ctx.beginPath();
      ctx.moveTo(baseProj.screenX - halfW, baseProj.screenY - h);
      ctx.lineTo(baseProj.screenX + halfW, baseProj.screenY);
      ctx.moveTo(baseProj.screenX + halfW, baseProj.screenY - h);
      ctx.lineTo(baseProj.screenX - halfW, baseProj.screenY);
      ctx.stroke();

      // Top Face
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(baseProj.screenX - halfW, baseProj.screenY - h);
      ctx.lineTo(baseProj.screenX, baseProj.screenY - h - 10 * scale);
      ctx.lineTo(baseProj.screenX + halfW * 2, baseProj.screenY - h - 10 * scale);
      ctx.lineTo(baseProj.screenX + halfW, baseProj.screenY - h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (obs.type === 'torch') {
      // Torch Stand
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3.5 * scale;
      ctx.beginPath();
      ctx.moveTo(baseProj.screenX, baseProj.screenY);
      ctx.lineTo(topProj.screenX, topProj.screenY);
      ctx.stroke();

      // Torch Brazier Cap
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(topProj.screenX, topProj.screenY, 5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Torch Light Aura
      const torchGlow = ctx.createRadialGradient(topProj.screenX, topProj.screenY, 2, topProj.screenX, topProj.screenY, 35 * scale);
      torchGlow.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
      torchGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = torchGlow;
      ctx.beginPath();
      ctx.arc(topProj.screenX, topProj.screenY, 35 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderParticle(p: import('./types').Particle3D, cam: import('./types').Camera3D, width: number, height: number) {
    const ctx = this.ctx;
    const proj = worldToScreen({ x: p.x, y: p.y, z: p.z }, cam, width, height);
    const alpha = Math.max(0, p.life / p.maxLife);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;

    if (p.type === 'spark') {
      ctx.beginPath();
      ctx.arc(proj.screenX, proj.screenY, p.size * proj.scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'dust') {
      ctx.beginPath();
      ctx.arc(proj.screenX, proj.screenY, (p.size * 0.5 + (1 - alpha) * 4) * proj.scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'fire') {
      ctx.beginPath();
      ctx.arc(proj.screenX, proj.screenY, p.size * alpha * proj.scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderCombatText(engine: Mode3DEngine, width: number, height: number) {
    const ctx = this.ctx;
    const cam = engine.camera;

    for (const p of engine.particles) {
      if (p.type === 'text' && p.text) {
        const proj = worldToScreen({ x: p.x, y: p.y, z: p.z }, cam, width, height);
        const alpha = Math.max(0, p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `900 ${Math.round(p.size * proj.scale)}px "Impact", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText(p.text, proj.screenX, proj.screenY);
        ctx.fillText(p.text, proj.screenX, proj.screenY);
        ctx.restore();
      }
    }
  }
}
