// Game Engine for 3D/Pseudo-3D Prototype Mode

import { Camera3D, Entity3D, InputState3D, Obstacle3D, Particle3D } from './types';
import { DEFAULT_TILT, distanceXZ, resolveCircleCollision, vectorToDirection8, lerpAngle, angleToDirection8 } from './math';

export const ARENA_BOUNDS = {
  minX: -420,
  maxX: 420,
  minZ: -420,
  maxZ: 420
};

export class Mode3DEngine {
  public player: Entity3D;
  public dummy: Entity3D;
  public obstacles: Obstacle3D[] = [];
  public particles: Particle3D[] = [];
  public camera: Camera3D;
  public nextParticleId = 1;
  public comboTimer = 0;
  public screenShake = 0;
  public time = 0;

  constructor() {
    // 1. Initialize Player (Stickman Prototype Fighter)
    this.player = {
      id: 'player_3d',
      type: 'player',
      x: 0,
      y: 0,
      z: 120,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: 18,
      height: 48,
      facing: 'up',
      facingAngle: -Math.PI / 2,
      hp: 100,
      maxHp: 100,
      isGrounded: true,
      action: 'idle',
      actionTimer: 0,
      actionDuration: 0,
      comboStep: 0,
      hitStun: 0,
      color: '#38bdf8', // Cyan Stickman
      name: 'PROTOTYPE FIGHTER'
    };

    // 2. Initialize Training Dummy
    this.dummy = {
      id: 'dummy_3d',
      type: 'dummy',
      x: 0,
      y: 0,
      z: -80,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: 20,
      height: 48,
      facing: 'down',
      facingAngle: Math.PI / 2,
      hp: 100,
      maxHp: 100,
      isGrounded: true,
      action: 'idle',
      actionTimer: 0,
      actionDuration: 0,
      comboStep: 0,
      hitStun: 0,
      color: '#f43f5e', // Rose Red Dummy
      name: 'TRAINING DUMMY'
    };

    // 3. Initialize Camera (Guardian Tales top-down tilted angle)
    this.camera = {
      x: 0,
      z: 0,
      zoom: 1.25,
      tiltAngle: DEFAULT_TILT,
      targetX: 0,
      targetZ: 0
    };

    // 4. Initialize Test Arena Obstacles for Depth & Collision verification
    this.setupArenaObstacles();
  }

  private setupArenaObstacles() {
    this.obstacles = [
      // 4 Majestic Ancient Stone Pillars (for verifying Y-sort / depth ordering around player)
      { id: 'pillar_nw', type: 'pillar', x: -220, y: 0, z: -220, width: 36, depth: 36, height: 90, radius: 24, color: '#64748b' },
      { id: 'pillar_ne', type: 'pillar', x: 220, y: 0, z: -220, width: 36, depth: 36, height: 90, radius: 24, color: '#64748b' },
      { id: 'pillar_sw', type: 'pillar', x: -220, y: 0, z: 220, width: 36, depth: 36, height: 90, radius: 24, color: '#64748b' },
      { id: 'pillar_se', type: 'pillar', x: 220, y: 0, z: 220, width: 36, depth: 36, height: 90, radius: 24, color: '#64748b' },

      // Training Crates on sides
      { id: 'crate_left', type: 'crate', x: -160, y: 0, z: 0, width: 32, depth: 32, height: 32, radius: 20, color: '#b45309' },
      { id: 'crate_right', type: 'crate', x: 160, y: 0, z: 0, width: 32, depth: 32, height: 32, radius: 20, color: '#b45309' },

      // Torches near arena center
      { id: 'torch_left', type: 'torch', x: -60, y: 0, z: -180, width: 14, depth: 14, height: 60, radius: 12, color: '#475569' },
      { id: 'torch_right', type: 'torch', x: 60, y: 0, z: -180, width: 14, depth: 14, height: 60, radius: 12, color: '#475569' },
    ];
  }

  public update(input: InputState3D) {
    this.time++;

    // Decay screen shake
    if (this.screenShake > 0) this.screenShake *= 0.88;
    if (this.screenShake < 0.1) this.screenShake = 0;

    // Decay combo reset timer
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.player.comboStep = 0;
      }
    }

    // 1. Update Player Movement & State
    this.updatePlayer(input);

    // 2. Update Dummy AI / Recovery
    this.updateDummy();

    // 3. Resolve Obstacle & Boundary Collisions
    this.resolveEntityObstacleCollisions(this.player);
    this.resolveEntityObstacleCollisions(this.dummy);

    // 4. Resolve Player <-> Dummy Physical Collision
    const charCol = resolveCircleCollision(this.player, this.dummy);
    if (charCol.collided) {
      this.player.x -= charCol.normalX * (charCol.overlap * 0.5);
      this.player.z -= charCol.normalZ * (charCol.overlap * 0.5);
      this.dummy.x += charCol.normalX * (charCol.overlap * 0.5);
      this.dummy.z += charCol.normalZ * (charCol.overlap * 0.5);
    }

    // 5. Update Camera Smooth Follow (Top-Down Tilted)
    this.camera.targetX = this.player.x;
    this.camera.targetZ = this.player.z;
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.12;
    this.camera.z += (this.camera.targetZ - this.camera.z) * 0.12;

    // 6. Update 3D Particles
    this.updateParticles();
  }

  private updatePlayer(input: InputState3D) {
    const p = this.player;

    // Hitstun recovery
    if (p.hitStun > 0) {
      p.hitStun--;
      if (p.hitStun === 0 && p.action === 'hit') {
        p.action = 'idle';
      }
    }

    // Action timer progression
    if (p.actionTimer > 0) {
      p.actionTimer--;
      if (p.actionTimer === 0) {
        if (p.action === 'attack') {
          p.action = 'idle';
        }
      }
    }

    // 1. Movement Processing (only if not attacking or in hitstun)
    const canMove = p.action !== 'attack' && p.hitStun <= 0;
    if (canMove) {
      const moveSpeed = 4.2;
      const mag = Math.sqrt(input.moveX * input.moveX + input.moveZ * input.moveZ);

      if (mag > 0.1) {
        const nx = input.moveX / mag;
        const nz = input.moveZ / mag;
        p.vx = nx * moveSpeed;
        p.vz = nz * moveSpeed;

        const targetAngle = Math.atan2(nz, nx);
        p.facingAngle = lerpAngle(p.facingAngle, targetAngle, 0.22);
        p.facing = angleToDirection8(p.facingAngle);
        p.action = p.isGrounded ? 'walk' : 'jump';

        // Footstep dust particle
        if (this.time % 8 === 0 && p.isGrounded) {
          this.addParticle(p.x, 0, p.z, -nx * 0.6, 0.4, -nz * 0.6, 'dust', '#94a3b8', 12, 5);
        }
      } else {
        p.vx *= 0.6;
        p.vz *= 0.6;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;
        if (Math.abs(p.vz) < 0.05) p.vz = 0;
        if (p.isGrounded && p.action === 'walk') {
          p.action = 'idle';
        }
      }
    } else {
      p.vx *= 0.75;
      p.vz *= 0.75;
    }

    // 2. Jump & Vertical Gravity
    if (input.jump && p.isGrounded && p.hitStun <= 0) {
      p.vy = 7.5;
      p.isGrounded = false;
      p.action = 'jump';
      this.addParticle(p.x, 0, p.z, 0, 0.5, 0, 'dust', '#cbd5e1', 14, 8);
    }

    if (!p.isGrounded) {
      p.vy -= 0.42; // Gravity
      p.y += p.vy;
      if (p.y <= 0) {
        p.y = 0;
        p.vy = 0;
        p.isGrounded = true;
        if (p.action === 'jump') {
          p.action = 'idle';
          this.addParticle(p.x, 0, p.z, 0, 0.4, 0, 'dust', '#94a3b8', 14, 8);
        }
      }
    }

    // 3. Basic Attack (Punch Combo)
    if (input.attack && p.action !== 'attack' && p.hitStun <= 0) {
      this.performPlayerAttack();
    }

    // Apply movement velocities
    p.x += p.vx;
    p.z += p.vz;

    // Arena boundary clamp
    p.x = Math.max(ARENA_BOUNDS.minX, Math.min(ARENA_BOUNDS.maxX, p.x));
    p.z = Math.max(ARENA_BOUNDS.minZ, Math.min(ARENA_BOUNDS.maxZ, p.z));
  }

  private performPlayerAttack() {
    const p = this.player;
    p.action = 'attack';
    p.comboStep = (p.comboStep % 3) + 1;
    this.comboTimer = 40; // Reset combo window

    if (p.comboStep === 1) {
      p.actionTimer = 16;
      p.actionDuration = 16;
    } else if (p.comboStep === 2) {
      p.actionTimer = 18;
      p.actionDuration = 18;
    } else {
      p.actionTimer = 26;
      p.actionDuration = 26;
    }

    // Forward kinetic impulse in facing direction
    const lungeForce = p.comboStep === 3 ? 4.2 : (p.comboStep === 2 ? 3.0 : 2.2);
    p.vx = Math.cos(p.facingAngle) * lungeForce;
    p.vz = Math.sin(p.facingAngle) * lungeForce;

    if (p.comboStep === 3 && p.isGrounded) {
      p.vy = 4.8;
      p.isGrounded = false;
      this.addParticle(p.x, 0, p.z, 0, 0.6, 0, 'dust', '#facc15', 16, 12);
    }

    // Hitbox calculation in 3D (Cone / Area in front of player)
    const attackReach = p.comboStep === 3 ? 58 : 46;
    const attackX = p.x + Math.cos(p.facingAngle) * (attackReach * 0.7);
    const attackZ = p.z + Math.sin(p.facingAngle) * (attackReach * 0.7);

    // Check hit on Training Dummy
    const distToDummy = distanceXZ({ x: attackX, y: p.y, z: attackZ }, this.dummy);
    if (distToDummy < attackReach + this.dummy.radius) {
      // Hit connected!
      const damage = p.comboStep === 3 ? 28 : (p.comboStep === 2 ? 16 : 10);
      const knockback = p.comboStep === 3 ? 9.5 : (p.comboStep === 2 ? 5.5 : 3.5);

      this.dummy.hp = Math.max(0, this.dummy.hp - damage);
      this.dummy.action = 'hit';
      this.dummy.hitStun = p.comboStep === 3 ? 32 : 18;
      this.dummy.actionTimer = this.dummy.hitStun;
      this.dummy.actionDuration = this.dummy.hitStun;

      // Knockback in strike direction
      this.dummy.vx = Math.cos(p.facingAngle) * knockback;
      this.dummy.vz = Math.sin(p.facingAngle) * knockback;
      if (p.comboStep === 3) {
        this.dummy.vy = 6.0;
        this.dummy.isGrounded = false;
      }

      this.screenShake = p.comboStep === 3 ? 14 : (p.comboStep === 2 ? 8 : 4);

      // Spawn 3D Hit Sparks & Floating Damage Text
      const hitX = (attackX + this.dummy.x) * 0.5;
      const hitY = this.dummy.y + 24;
      const hitZ = (attackZ + this.dummy.z) * 0.5;

      for (let s = 0; s < (p.comboStep === 3 ? 12 : 6); s++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4.5;
        this.addParticle(
          hitX, hitY, hitZ,
          Math.cos(ang) * spd, (Math.random() - 0.2) * spd, Math.sin(ang) * spd,
          'spark', p.comboStep === 3 ? '#facc15' : '#38bdf8', 14, 4
        );
      }

      // Floating damage number in 3D
      this.addTextParticle(hitX, hitY + 20, hitZ, `-${damage}`, p.comboStep === 3 ? '#facc15' : '#ffffff');
    }
  }

  private updateDummy() {
    const d = this.dummy;

    // Dummy faces towards player smoothly
    const dx = this.player.x - d.x;
    const dz = this.player.z - d.z;
    if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
      const targetAngle = Math.atan2(dz, dx);
      d.facingAngle = lerpAngle(d.facingAngle, targetAngle, 0.22);
      d.facing = angleToDirection8(d.facingAngle);
    }

    // Decay knockback velocity
    d.vx *= 0.85;
    d.vz *= 0.85;
    if (Math.abs(d.vx) < 0.05) d.vx = 0;
    if (Math.abs(d.vz) < 0.05) d.vz = 0;

    // Apply gravity if launched airborne
    if (!d.isGrounded) {
      d.vy -= 0.42;
      d.y += d.vy;
      if (d.y <= 0) {
        d.y = 0;
        d.vy = 0;
        d.isGrounded = true;
      }
    }

    // Hitstun recovery
    if (d.hitStun > 0) {
      d.hitStun--;
      if (d.hitStun === 0) {
        d.action = 'idle';
      }
    }

    d.x += d.vx;
    d.z += d.vz;

    // Arena boundary clamp
    d.x = Math.max(ARENA_BOUNDS.minX, Math.min(ARENA_BOUNDS.maxX, d.x));
    d.z = Math.max(ARENA_BOUNDS.minZ, Math.min(ARENA_BOUNDS.maxZ, d.z));

    // Auto-heal dummy if HP drops to 0 for infinite training testing
    if (d.hp <= 0 && d.hitStun <= 5) {
      d.hp = d.maxHp;
      this.addTextParticle(d.x, d.y + 35, d.z, '★ RESPAWN ★', '#34d399');
    }
  }

  private resolveEntityObstacleCollisions(e: Entity3D) {
    for (const obs of this.obstacles) {
      const col = resolveCircleCollision(
        { x: e.x, z: e.z, radius: e.radius },
        { x: obs.x, z: obs.z, radius: obs.radius }
      );
      if (col.collided) {
        e.x -= col.normalX * col.overlap;
        e.z -= col.normalZ * col.overlap;
      }
    }
  }

  private updateParticles() {
    // Spawn ambient torch fire particles
    if (this.time % 3 === 0) {
      for (const obs of this.obstacles) {
        if (obs.type === 'torch') {
          this.addParticle(
            obs.x + (Math.random() - 0.5) * 4,
            obs.height + Math.random() * 4,
            obs.z + (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 0.3,
            0.8 + Math.random() * 0.6,
            (Math.random() - 0.5) * 0.3,
            'fire',
            Math.random() > 0.5 ? '#f97316' : '#facc15',
            18,
            5
          );
        }
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      if (p.type !== 'text') {
        p.vy -= 0.15; // Particle gravity
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public addParticle(
    x: number, y: number, z: number,
    vx: number, vy: number, vz: number,
    type: Particle3D['type'], color: string, maxLife = 15, size = 4
  ) {
    this.particles.push({
      id: this.nextParticleId++,
      x, y, z,
      vx, vy, vz,
      type, color,
      life: maxLife,
      maxLife,
      size
    });
  }

  public addTextParticle(x: number, y: number, z: number, text: string, color: string) {
    this.particles.push({
      id: this.nextParticleId++,
      x, y, z,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 1.2,
      vz: (Math.random() - 0.5) * 0.5,
      type: 'text',
      color,
      text,
      life: 30,
      maxLife: 30,
      size: 16
    });
  }

  public resetPositions() {
    this.player.x = 0;
    this.player.y = 0;
    this.player.z = 120;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.vz = 0;
    this.player.hp = this.player.maxHp;
    this.player.action = 'idle';

    this.dummy.x = 0;
    this.dummy.y = 0;
    this.dummy.z = -80;
    this.dummy.vx = 0;
    this.dummy.vy = 0;
    this.dummy.vz = 0;
    this.dummy.hp = this.dummy.maxHp;
    this.dummy.action = 'idle';
  }
}
