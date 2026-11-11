import React, { useRef, useEffect } from 'react';
import { MatchConfig } from '../types';
import { DialogueLine } from '../game/dialogues';

interface CutsceneStageCanvasProps {
  matchConfig: MatchConfig;
  currentLine?: DialogueLine;
  lineIndex: number;
}

export const CutsceneStageCanvas: React.FC<CutsceneStageCanvasProps> = ({
  matchConfig,
  currentLine,
  lineIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Animation simulation state
  const simStateRef = useRef({
    time: 0,
    p1X: 180,
    p2X: 520,
    p1TargetX: 230,
    p2TargetX: 470,
    p1StandAlpha: 0.85,
    p2StandAlpha: 0.85,
    clashSparks: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>,
    menacingKanji: [] as Array<{ x: number; y: number; text: string; alpha: number; size: number; vy: number }>,
    steamPuffs: [] as Array<{ x: number; y: number; r: number; alpha: number; vy: number }>,
  });

  const p1Id = matchConfig.playerChar.id;
  const p2Id = matchConfig.enemyChar.id;

  // Re-adjust targets based on character matchup and dialogue progression
  useEffect(() => {
    const isJotaroDio = (p1Id === 'jotaro' && p2Id === 'dio') || (p1Id === 'dio' && p2Id === 'jotaro');
    const sim = simStateRef.current;

    // In Jotaro vs DIO, they walk closer as the dialogue progresses ("Oh? You're approaching me?")
    if (isJotaroDio) {
      const approachDistance = Math.min(100, lineIndex * 24);
      sim.p1TargetX = 220 + approachDistance;
      sim.p2TargetX = 480 - approachDistance;
    } else {
      sim.p1TargetX = 230 + (lineIndex % 2 === 0 ? 15 : 0);
      sim.p2TargetX = 470 - (lineIndex % 2 === 1 ? 15 : 0);
    }
  }, [lineIndex, p1Id, p2Id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const sim = simStateRef.current;
      sim.time += 1;
      const t = sim.time;

      // Smooth interpolation for fighter positions
      sim.p1X += (sim.p1TargetX - sim.p1X) * 0.05;
      sim.p2X += (sim.p2TargetX - sim.p2X) * 0.05;

      const width = canvas.width;
      const height = canvas.height;
      const groundY = height - 42;

      // 1. Clear Stage
      ctx.clearRect(0, 0, width, height);

      // Background Stage Ambience & Floor Grid
      drawStageBackground(ctx, width, height, groundY, t, p1Id, p2Id);

      // 2. Spawn and update interactive particles (Menacing Kanji, sparks, steam)
      updateStageParticles(ctx, sim, width, groundY, currentLine);

      // 3. Draw Fighters & Stands with dynamic animations
      const isP1Speaking = currentLine?.side === 'player';
      const isP2Speaking = currentLine?.side === 'enemy';

      // 1P Fighter on Left (Facing Right)
      drawCutsceneFighter(
        ctx,
        sim.p1X,
        groundY,
        p1Id,
        true, // facing right
        isP1Speaking,
        currentLine?.expression || 'confident',
        t,
        true, // is 1P
        p2Id
      );

      // 2P Fighter on Right (Facing Left)
      drawCutsceneFighter(
        ctx,
        sim.p2X,
        groundY,
        p2Id,
        false, // facing left
        isP2Speaking,
        currentLine?.expression || 'confident',
        t,
        false, // is 2P
        p1Id
      );

      // 4. Draw Center Aura Clash Effects when close
      const distance = Math.abs(sim.p2X - sim.p1X);
      if (distance < 200) {
        drawClashEnergy(ctx, (sim.p1X + sim.p2X) / 2, groundY - 45, t, p1Id, p2Id);
      }

      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [p1Id, p2Id, currentLine]);

  // --- DRAW STAGE BACKGROUND ---
  const drawStageBackground = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    groundY: number,
    t: number,
    char1: string,
    char2: string
  ) => {
    // Stage Floor
    const isPucciStage = char1 === 'pucci' || char2 === 'pucci';
    const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
    if (isPucciStage) {
      // Cape Canaveral coastal stone & green-gold gravity shimmer
      floorGrad.addColorStop(0, '#1e1b4b');
      floorGrad.addColorStop(0.4, '#172554');
      floorGrad.addColorStop(1, '#020617');
    } else {
      floorGrad.addColorStop(0, '#1e1b4b');
      floorGrad.addColorStop(0.4, '#0f172a');
      floorGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // If Pucci is fighting, draw New Moon / Cape Canaveral Shuttle Tower in background
    if (isPucciStage) {
      // New Moon / Gravitational Rift in sky
      const moonX = w / 2;
      const moonY = 36;
      ctx.save();
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 32);
      moonGlow.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
      moonGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
      ctx.fill();

      // Crescent New Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090a16';
      ctx.beginPath();
      ctx.arc(moonX + 5, moonY - 3, 13, 0, Math.PI * 2);
      ctx.fill();

      // Gravitational acceleration ray lines
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const rayX = (t * 2 + i * 140) % w;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 30, groundY);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Floor Line
    ctx.strokeStyle = isPucciStage ? '#eab308' : '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Perspective grid tiles on floor
    ctx.strokeStyle = isPucciStage ? 'rgba(234, 179, 8, 0.2)' : 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + (x - w / 2) * 0.4, h);
      ctx.stroke();
    }
  };

  // --- UPDATE STAGE PARTICLES ---
  const updateStageParticles = (
    ctx: CanvasRenderingContext2D,
    sim: typeof simStateRef.current,
    w: number,
    groundY: number,
    line?: DialogueLine
  ) => {
    // Spawn floating Kanji
    if (sim.time % 22 === 0) {
      const kanjis = ['ゴ', 'ド', 'ズ', 'バ'];
      const text = kanjis[Math.floor(Math.random() * kanjis.length)];
      const x = 80 + Math.random() * (w - 160);
      sim.menacingKanji.push({
        x,
        y: groundY - 10,
        text,
        alpha: 0.8,
        size: 20 + Math.random() * 16,
        vy: 1.2 + Math.random() * 0.8,
      });
    }

    // Update & draw Kanji
    ctx.font = 'bold 24px sans-serif';
    for (let i = sim.menacingKanji.length - 1; i >= 0; i--) {
      const k = sim.menacingKanji[i];
      k.y -= k.vy;
      k.alpha -= 0.012;

      if (k.alpha <= 0 || k.y < 20) {
        sim.menacingKanji.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = `rgba(192, 132, 252, ${k.alpha})`;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 10;
      ctx.font = `bold ${k.size}px sans-serif`;
      ctx.fillText(k.text, k.x, k.y);
      ctx.restore();
    }

    // Spawn clash sparks between fighters
    if (sim.time % 6 === 0) {
      const midX = (sim.p1X + sim.p2X) / 2 + (Math.random() - 0.5) * 30;
      const midY = groundY - 30 - Math.random() * 40;
      sim.clashSparks.push({
        x: midX,
        y: midY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        color: Math.random() > 0.5 ? '#facc15' : '#c084fc',
      });
    }

    // Update & draw Sparks
    for (let i = sim.clashSparks.length - 1; i >= 0; i--) {
      const s = sim.clashSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.05;

      if (s.life <= 0) {
        sim.clashSparks.splice(i, 1);
        continue;
      }

      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5 * s.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // Steam puffs for angry expression (e.g. Josuke hair insults)
    if (line?.expression === 'angry') {
      const speakerX = line.side === 'player' ? sim.p1X : sim.p2X;
      if (sim.time % 8 === 0) {
        sim.steamPuffs.push({
          x: speakerX + (Math.random() - 0.5) * 20,
          y: groundY - 65,
          r: 4 + Math.random() * 4,
          alpha: 0.9,
          vy: 1.5,
        });
      }
    }

    // Draw steam puffs
    for (let i = sim.steamPuffs.length - 1; i >= 0; i--) {
      const p = sim.steamPuffs[i];
      p.y -= p.vy;
      p.r += 0.3;
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        sim.steamPuffs.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(240, 240, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // --- DRAW CLASH ENERGY IN CENTER ---
  const drawClashEnergy = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    t: number,
    char1: string,
    char2: string
  ) => {
    ctx.save();
    // Glowing shockwave ring
    const radius = 18 + Math.sin(t * 0.25) * 8;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Electric Lightning Bolts
    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const angle = (t * 0.1 + i * 2.1) % (Math.PI * 2);
      const ex = cx + Math.cos(angle) * (radius + 10);
      const ey = cy + Math.sin(angle) * (radius + 10);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (ex - cx) * 0.5 + (Math.random() - 0.5) * 8, cy + (ey - cy) * 0.5 + (Math.random() - 0.5) * 8);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
    ctx.restore();
  };

  // --- DRAW CUTSCENE FIGHTER & STAND WITH INTERACTIVE ANIMATIONS ---
  const drawCutsceneFighter = (
    ctx: CanvasRenderingContext2D,
    x: number,
    groundY: number,
    charId: string,
    facingRight: boolean,
    isSpeaking: boolean,
    expression: string,
    time: number,
    isP1: boolean,
    opponentId: string
  ) => {
    const dir = facingRight ? 1 : -1;
    const bodyHeight = 65;
    const standOffsetY = -15 + Math.sin(time * 0.08) * 6;
    const standOffsetX = -dir * 28;

    // 1. Draw Ground Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x, groundY + 2, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Stand Phantom Behind Fighter
    drawCutsceneStand(
      ctx,
      x + standOffsetX,
      groundY + standOffsetY,
      charId,
      facingRight,
      isSpeaking,
      time,
      expression
    );

    // 3. Draw Stickman Fighter Model with Matchup Gestures
    ctx.save();
    ctx.translate(x, groundY - bodyHeight);

    const headRadius = 11;
    const headY = 12;
    const neckY = headY + headRadius;
    const hipY = neckY + 24;
    const footY = bodyHeight;

    // Limb coordinates based on character posture
    let leftHandX = -8 * dir;
    let leftHandY = neckY + 12;
    let rightHandX = 10 * dir;
    let rightHandY = neckY + 10;
    let leftFootX = -10 * dir;
    let rightFootX = 10 * dir;
    let headTilt = 0;

    // Breathing / speaking bob
    const speakBob = isSpeaking ? Math.sin(time * 0.3) * 2 : Math.sin(time * 0.1) * 1;
    const walkSwing = Math.sin(time * 0.15) * 6;

    // INTERACTIVE POSE CHOREOGRAPHY BY CHARACTER:
    if (charId === 'jotaro') {
      // Jotaro: Hands in pockets / adjusts cap / points finger if speaking
      if (isSpeaking) {
        // Pointing Star Finger Pose
        rightHandX = 26 * dir;
        rightHandY = neckY - 2;
        leftHandX = 2 * dir;
        leftHandY = headY - 1; // Hand on visor
        headTilt = 0.08 * dir;
      } else {
        // Cool slouch with hands in coat pockets
        leftHandX = -6 * dir;
        leftHandY = hipY - 2;
        rightHandX = 6 * dir;
        rightHandY = hipY - 2;
        headTilt = -0.05 * dir;
      }
      leftFootX = -12 * dir + walkSwing;
      rightFootX = 8 * dir - walkSwing;
    } 
    else if (charId === 'dio') {
      // DIO: Arrogant swagger / WRYYY arch back / Beckoning hand
      if (isSpeaking) {
        // WRYYYYY Sky Claw / Arch Back
        rightHandX = -14 * dir;
        rightHandY = headY - 16;
        leftHandX = 16 * dir;
        leftHandY = headY - 12;
        headTilt = -0.2 * dir;
      } else {
        // Beckoning hand forward
        rightHandX = 22 * dir;
        rightHandY = neckY + 2;
        leftHandX = -10 * dir;
        leftHandY = hipY;
        headTilt = 0.1 * dir;
      }
      leftFootX = -14 * dir - walkSwing;
      rightFootX = 12 * dir + walkSwing;
    }
    else if (charId === 'crazy_diamond') {
      // Josuke: Pompadour check & comb / Angry hair protection
      if (expression === 'angry' || isSpeaking) {
        // Anger stance: Fists clenched, comb in hand!
        rightHandX = 14 * dir;
        rightHandY = headY - 12; // Hand near pompadour
        leftHandX = -14 * dir;
        leftHandY = hipY - 4;
        headTilt = 0.12 * dir;
      } else {
        // Cocked hip casual Morioh delinquent
        leftHandX = -10 * dir;
        leftHandY = hipY;
        rightHandX = 8 * dir;
        rightHandY = hipY;
        headTilt = -0.06 * dir;
      }
      leftFootX = -8 * dir;
      rightFootX = 14 * dir;
    }
    else if (charId === 'king_crimson') {
      // Diavolo: Crossing arms, twitching glitch stance
      rightHandX = 12 * dir;
      rightHandY = neckY + 8;
      leftHandX = -12 * dir;
      leftHandY = neckY + 8;
      headTilt = isSpeaking ? 0.15 * dir : 0;
      leftFootX = -10 * dir;
      rightFootX = 10 * dir;
    }
    else if (charId === 'silver_chariot') {
      // Polnareff: En-Garde fencer salute & Bravo Bravo clapping
      if (isSpeaking) {
        // Fencer Lunge
        rightHandX = 24 * dir;
        rightHandY = neckY + 2;
        leftHandX = -16 * dir;
        leftHandY = neckY - 6;
      } else {
        // Gentleman Bravo applause hand position
        leftHandX = 8 * dir;
        leftHandY = neckY + 4;
        rightHandX = 11 * dir;
        rightHandY = neckY + 4;
      }
      leftFootX = -14 * dir;
      rightFootX = 12 * dir;
    }
    else if (charId === 'pucci') {
      // Enrico Pucci: Holding crucifix / Holding memory DISC / Raising hands to Heaven
      if (isSpeaking) {
        // Raising hand to the heavens / reciting 14 words
        rightHandX = 18 * dir;
        rightHandY = neckY - 14;
        leftHandX = -6 * dir;
        leftHandY = hipY - 2;
        headTilt = -0.15 * dir;
      } else {
        // Holding golden cross / DISC extraction posture
        rightHandX = 12 * dir;
        rightHandY = neckY + 4;
        leftHandX = 4 * dir;
        leftHandY = neckY + 6;
        headTilt = 0.05 * dir;
      }
      leftFootX = -8 * dir;
      rightFootX = 10 * dir;
    }
    else if (charId === 'gappy') {
      if (isSpeaking) {
        // Iconic Sailor Cap touch with head tilt & extended hand
        rightHandX = 14 * dir;
        rightHandY = headY - 10;
        leftHandX = -18 * dir;
        leftHandY = neckY + 4;
        headTilt = -0.12 * dir;
      } else {
        // Cool JoJolion stance with hand touching cap rim
        rightHandX = 12 * dir;
        rightHandY = headY - 8;
        leftHandX = -12 * dir;
        leftHandY = hipY + 2;
        headTilt = 0.05 * dir;
      }
      leftFootX = -12 * dir;
      rightFootX = 12 * dir;
    }
    else if (charId === 'funny_valentine') {
      if (isSpeaking) {
        // Presidential proclamation: one hand pointing forward with revolver, one resting on lapel
        rightHandX = 24 * dir;
        rightHandY = neckY - 2;
        leftHandX = -6 * dir;
        leftHandY = neckY + 8;
        headTilt = 0.08 * dir;
      } else {
        // Regal presidential composure
        rightHandX = 10 * dir;
        rightHandY = hipY - 2;
        leftHandX = -10 * dir;
        leftHandY = hipY - 2;
        headTilt = -0.04 * dir;
      }
      leftFootX = -11 * dir;
      rightFootX = 11 * dir;
    }
    else {
      // Default Martial Arts stance
      rightHandX = 14 * dir;
      rightHandY = neckY + 2;
      leftHandX = -10 * dir;
      leftHandY = neckY + 8;
      leftFootX = -10 * dir;
      rightFootX = 10 * dir;
    }

    // 1. Draw Stickman Limbs (Legs, Torso, Arms)
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    // Legs
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(leftFootX, footY);
    ctx.moveTo(0, hipY);
    ctx.lineTo(rightFootX, footY);
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(0, neckY + speakBob);
    ctx.lineTo(0, hipY);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(0, neckY + 4 + speakBob);
    ctx.lineTo(leftHandX, leftHandY + speakBob);
    ctx.moveTo(0, neckY + 4 + speakBob);
    ctx.lineTo(rightHandX, rightHandY + speakBob);
    ctx.stroke();

    // Inner Fill
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(leftFootX, footY);
    ctx.moveTo(0, hipY);
    ctx.lineTo(rightFootX, footY);
    ctx.moveTo(0, neckY + speakBob);
    ctx.lineTo(0, hipY);
    ctx.moveTo(0, neckY + 4 + speakBob);
    ctx.lineTo(leftHandX, leftHandY + speakBob);
    ctx.moveTo(0, neckY + 4 + speakBob);
    ctx.lineTo(rightHandX, rightHandY + speakBob);
    ctx.stroke();

    // 2. Draw Head with Tilt
    ctx.save();
    ctx.translate(0, headY + speakBob);
    ctx.rotate(headTilt);

    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = charId === 'dio' ? '#ef4444' : '#0f172a';
    ctx.beginPath();
    ctx.arc(3.5 * dir, -1, 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Character Headwear & Accessories
    drawCutsceneCharacterHeadwear(ctx, charId, headRadius, dir, time, expression);

    ctx.restore(); // Restore head transform

    // 4. Draw Torso & Waist Clothing Accessories
    drawCutsceneBodyWear(ctx, charId, neckY + speakBob, hipY, dir, time, rightHandX, rightHandY + speakBob);

    // 5. Active Speaker Indicator Icon & Expression Emoji
    if (isSpeaking) {
      ctx.save();
      // Talking pulse diamond badge above head
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, headY - headRadius - 14 + Math.sin(time * 0.2) * 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Emotion VFX
      if (expression === 'angry') {
        // Red Anger Vein (💢)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        const vx = 10 * dir;
        const vy = headY - headRadius - 6;
        ctx.beginPath();
        ctx.moveTo(vx - 4, vy - 4);
        ctx.lineTo(vx + 4, vy + 4);
        ctx.moveTo(vx + 4, vy - 4);
        ctx.lineTo(vx - 4, vy + 4);
        ctx.stroke();
      } else if (expression === 'smirk') {
        // Eye Gleam Star
        ctx.fillStyle = '#facc15';
        ctx.fillRect(4 * dir, headY - 3, 3, 3);
      }

      ctx.restore();
    }

    ctx.restore(); // Restore fighter transform
  };

  // --- DRAW CHARACTER HEADWEAR (JOTARO HAT, DIO HAIR, JOSUKE POMPADOUR, ETC) ---
  const drawCutsceneCharacterHeadwear = (
    ctx: CanvasRenderingContext2D,
    charId: string,
    headRadius: number,
    dir: number,
    time: number,
    expression: string
  ) => {
    if (charId === 'jotaro') {
      // Torn School Cap
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(0, 0, headRadius + 1, -Math.PI * 0.95, 0.05);
      ctx.lineTo(dir * (headRadius + 7), -1); // Visor bill
      ctx.lineTo(dir * (headRadius + 5), 3);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Palm Badge
      ctx.fillStyle = '#facc15';
      ctx.fillRect(dir * 3 - 2, -6, 4, 5);

      // Torn Spiky Hair blending out back
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      const bx = -dir * headRadius;
      ctx.moveTo(bx, -4);
      ctx.lineTo(bx - dir * 5, -2);
      ctx.lineTo(bx - dir * 2, 2);
      ctx.lineTo(bx - dir * 6, 6);
      ctx.lineTo(0, headRadius);
      ctx.closePath();
      ctx.fill();
    } 
    else if (charId === 'dio') {
      // Golden Spiky Vampiric Hair
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-dir * (headRadius + 1), 3);
      ctx.lineTo(-dir * (headRadius + 8), -2);
      ctx.lineTo(-dir * (headRadius + 4), -7);
      ctx.lineTo(-dir * (headRadius + 10), -12);
      ctx.lineTo(-dir * 3, -headRadius - 8);
      ctx.lineTo(dir * 5, -headRadius - 10);
      ctx.lineTo(dir * (headRadius + 4), -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Green Heart Headband
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(dir * 2, -5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'crazy_diamond') {
      // MASSIVE POMPADOUR QUIFF
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-dir * (headRadius + 1), 6);
      ctx.bezierCurveTo(
        -dir * 4, -headRadius - 16,
        dir * 20, -headRadius - 14,
        dir * 18, -2
      );
      ctx.bezierCurveTo(
        dir * 12, 4,
        dir * 6, -3,
        0, -headRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glossy Blue Quiff Highlight
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-dir * 2, -headRadius - 10);
      ctx.lineTo(dir * 12, -headRadius - 6);
      ctx.stroke();

      // Sparkling star on pompadour
      const starScale = 1 + Math.sin(time * 0.3) * 0.3;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(dir * 15, -headRadius - 10, 2.5 * starScale, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'king_crimson') {
      // Diavolo Long Spotted Pink Hair
      ctx.fillStyle = '#fb7185';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-dir * 2, -headRadius);
      ctx.bezierCurveTo(-dir * 14, -headRadius + 4, -dir * 16, headRadius + 14, -dir * 10, headRadius + 18);
      ctx.lineTo(-dir * 4, headRadius + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    else if (charId === 'jonathan') {
      // Jonathan: Noble Dark Blue Wavy Hair & Golden Hamon Sparkles
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-dir * (headRadius + 2), 4);
      ctx.lineTo(-dir * (headRadius + 7), -4);
      ctx.lineTo(-dir * (headRadius + 4), -8);
      ctx.lineTo(0, -headRadius - 6);
      ctx.lineTo(dir * 6, -headRadius - 5);
      ctx.lineTo(dir * (headRadius + 5), 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Hamon sparks around head
      ctx.fillStyle = '#facc15';
      const sparkX = (Math.sin(time * 0.2) * 12);
      ctx.beginPath();
      ctx.arc(sparkX, -headRadius - 8, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'joseph_young') {
      // Young Joseph: Spiky Brown Hair & Caesar's Triangle Striped Headband
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-dir * (headRadius + 2), 4);
      ctx.lineTo(-dir * (headRadius + 8), -2);
      ctx.lineTo(-dir * 3, -headRadius - 9);
      ctx.lineTo(dir * 5, -headRadius - 8);
      ctx.lineTo(dir * (headRadius + 6), -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Caesar's Patterned Headband (Purple/Yellow Triangles)
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -3, headRadius + 1, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.fillRect(-dir * 2, -6, 3, 3);
    }
    else if (charId === 'joseph_old') {
      // Old Joseph: Brown Fedora Hat & Grey Beard
      // Fedora Hat
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;

      // Brim
      ctx.beginPath();
      ctx.ellipse(0, -headRadius + 1, headRadius + 9, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crown
      ctx.beginPath();
      ctx.rect(-6, -headRadius - 8, 12, 9);
      ctx.fill();
      ctx.stroke();

      // Black Hatband
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -headRadius, 12, 2.5);

      // Grey Beard & Mustache
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(dir * 3, headRadius - 3, 5, 0, Math.PI);
      ctx.fill();
    }
    else if (charId === 'tooru') {
      // Tooru: Afro Hair & Bright Red Retro Earphones
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // Afro rounded puff
      ctx.beginPath();
      ctx.arc(0, -2, headRadius + 4.5, -Math.PI * 0.95, 0.05);
      ctx.fill();
      ctx.stroke();

      // Red Retro Earphones on sides
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-dir * (headRadius + 3) - 2, -4, 4, 8, 2);
      ctx.fill();
      ctx.stroke();

      // Earphone Headband Arc
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -2, headRadius + 3, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();
    }
    else if (charId === 'pucci') {
      // Enrico Pucci: Star hairline on forehead & braided white hair crown
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-dir * (headRadius + 2), 2);
      ctx.lineTo(-dir * (headRadius + 5), -6);
      ctx.lineTo(0, -headRadius - 4);
      ctx.lineTo(dir * (headRadius + 4), -4);
      ctx.lineTo(dir * (headRadius + 2), 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Star / Cross Hairline on Forehead
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(dir * 3, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Priest White Beard & Sideburns
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(dir * 2, headRadius - 2, 4, 0, Math.PI);
      ctx.fill();
    }
    else if (charId === 'gappy') {
      // White Sailor Cap with Navy Blue Rim & Golden Anchor
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.ellipse(0, -headRadius - 2, headRadius + 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-(headRadius + 2), -headRadius - 3, (headRadius + 2) * 2, 2.5);

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(dir * 2, -headRadius - 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'funny_valentine') {
      // Blonde side-parted hair & voluminous cylindrical spring ringlets
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.2;

      // Crown hair
      ctx.beginPath();
      ctx.arc(0, -headRadius - 1, headRadius + 3, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      ctx.stroke();

      // Front Bangs
      ctx.beginPath();
      ctx.moveTo(-4 * dir, -headRadius);
      ctx.quadraticCurveTo(2 * dir, -headRadius + 2, 7 * dir, -headRadius + 6);
      ctx.stroke();

      // Ringlet curls cascading down
      for (const off of [-4, 0, 4]) {
        const cx = -dir * (8 + off);
        const cy = -headRadius + 5;
        for (let ring = 0; ring < 3; ring++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy + ring * 5, 3, 2.2, 0.2 * dir, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    else if (charId === 'michael') {
      // 1. Fair Handsome Face (Not dark / black)
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, 0, headRadius - 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Anime Jawline & Athletic Smirk
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-1 * dir, 4);
      ctx.quadraticCurveTo(2 * dir, 5, 5 * dir, 3);
      ctx.stroke();

      // Piercing Golden Irises & Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1.5 * dir, -2.5, 4.5 * dir, 3);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(3.5 * dir, -1, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a'; // Sharp Brow
      ctx.fillRect(1 * dir, -4, 5.5 * dir, 1.2);

      // 2. Spiky Obsidian Hair with Golden Highlights
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-headRadius * dir, -2);
      ctx.lineTo(-14 * dir, -12);
      ctx.lineTo(-6 * dir, -10);
      ctx.lineTo(-8 * dir, -18);
      ctx.lineTo(0, -12);
      ctx.lineTo(6 * dir, -20);
      ctx.lineTo(10 * dir, -10);
      ctx.lineTo(14 * dir, -14);
      ctx.lineTo(12 * dir, -2);
      ctx.closePath();
      ctx.fill();

      // Gold Hair Highlights
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(6 * dir, -20);
      ctx.lineTo(8 * dir, -15);
      ctx.lineTo(4 * dir, -15);
      ctx.closePath();
      ctx.fill();

      // 3. Golden Athletic Headband with Emblem
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-headRadius - 1, -headRadius - 1, (headRadius + 1) * 2, 3.5);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(dir * 2 - 2, -headRadius - 1.5, 4, 4.5);

      // Fluttering Ribbon Tails
      const ribbonWave = Math.sin(time * 0.25) * 4;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-headRadius * dir, -headRadius);
      ctx.bezierCurveTo(-14 * dir, -headRadius + ribbonWave, -20 * dir, -headRadius + 6 - ribbonWave, -26 * dir, -headRadius + 2 + ribbonWave);
      ctx.stroke();
    }
  };

  // --- DRAW BODY WEAR & PROPS ---
  const drawCutsceneBodyWear = (
    ctx: CanvasRenderingContext2D,
    charId: string,
    neckY: number,
    hipY: number,
    dir: number,
    time: number,
    handX: number,
    handY: number
  ) => {
    if (charId === 'jotaro') {
      // High Collar & Gold Chain
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-dir * 4 - 2, neckY - 5, 8, 6);

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-dir * 5, neckY - 2);
      ctx.bezierCurveTo(-dir * 8, neckY + 8, dir * 2, neckY + 10, 0, neckY + 5);
      ctx.stroke();

      // Gold Belt
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-6, hipY - 3, 12, 3);
    }
    else if (charId === 'dio') {
      // Open V-Neck & Green Heart Belt
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-5, neckY - 2, 10, 4);

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, hipY - 1, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'crazy_diamond') {
      // Anchor and Peace sign lapel badges
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-dir * 4, neckY - 3, 2.5, 2.5);
      ctx.fillRect(dir * 3, neckY - 3, 2.5, 2.5);
    }
    else if (charId === 'silver_chariot') {
      // Fencer Rapier in Hand
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + dir * 35, handY - 2);
      ctx.stroke();

      // Bell Guard Hilt
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(handX + dir * 4, handY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Rapier Tip Sparkle Glint
      const tipX = handX + dir * 35;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(tipX, handY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'tooru') {
      // Tooru: Stylish Spiraled Jacket & Walkman Wire
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-6, neckY - 1, 12, 10);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-6, neckY - 1, 12, 10);

      // Gold spiral swirl brooch on shoulder
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-dir * 4, neckY + 1, 2.5, 0, Math.PI * 1.5);
      ctx.stroke();

      // Red Walkman Wire hanging to pocket
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-dir * 8, neckY - 4);
      ctx.bezierCurveTo(-dir * 12, neckY + 6, -dir * 4, hipY - 2, -dir * 3, hipY + 4);
      ctx.stroke();
    }
    else if (charId === 'jonathan') {
      // Brown Leather Tank Top & Luck & Pluck Sword Sheath
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-6, neckY - 2, 12, 10);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.strokeRect(-6, neckY - 2, 12, 10);

      // Sword Sheath on Back
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-dir * 6, neckY - 4);
      ctx.lineTo(dir * 12, hipY + 12);
      ctx.stroke();

      // Gold Pommel
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-dir * 6, neckY - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'joseph_young') {
      // Long Flowing Green Scarf Neck Wrap & Flapping Scarf Tails
      const scarfWave = Math.sin(time * 0.25) * 4;
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(0, neckY, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-dir * 4, neckY + 2);
      ctx.bezierCurveTo(-dir * 12, neckY + 10 + scarfWave, -dir * 18, neckY + 18 - scarfWave, -dir * 24, neckY + 24 + scarfWave);
      ctx.stroke();

      // Steel Clacker Volley Balls on Hip
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(dir * 6, hipY, 2.5, 0, Math.PI * 2);
      ctx.arc(dir * 9, hipY + 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'joseph_old') {
      // Trench Coat Collar & Coat Tails
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-7, neckY - 1, 14, 6);

      const coatWave = Math.sin(time * 0.2) * 3;
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, hipY - 2);
      ctx.lineTo(-dir * 14 + coatWave, hipY + 22);
      ctx.stroke();
    }
    else if (charId === 'pucci') {
      // Priest Cassock Robe with Golden Cross Pattern
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-6, neckY - 2, 12, 14);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-6, neckY - 2, 12, 14);

      // Large Gold Cross running down torso
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, neckY - 1);
      ctx.lineTo(0, hipY + 8);
      ctx.moveTo(-5, neckY + 4);
      ctx.lineTo(5, neckY + 4);
      ctx.stroke();

      // Silver DISC held in hand
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(handX + dir * 2, handY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    else if (charId === 'gappy') {
      // Sailor Suit Top & Navy Flap Collar
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.rect(-6, neckY - 2, 12, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-5, neckY - 2);
      ctx.lineTo(5, neckY - 2);
      ctx.lineTo(dir * 6, neckY + 10);
      ctx.lineTo(-dir * 2, neckY + 10);
      ctx.closePath();
      ctx.fill();

      // Floating bubbles emitting
      for (let b = 0; b < 3; b++) {
        const bx = handX + Math.sin(time * 0.1 + b) * 12;
        const by = handY - Math.cos(time * 0.1 + b) * 10;
        ctx.strokeStyle = '#7dd3fc';
        ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    else if (charId === 'funny_valentine') {
      // Tailored Orchid Pink Double-Breasted Presidential Coat
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#db2777';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-7, neckY);
      ctx.lineTo(7, neckY);
      ctx.lineTo(8, hipY + 4);
      ctx.lineTo(-8, hipY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White Ascot & Gold Brooch
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, neckY, 6, 6);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, neckY + 3, 2, 0, Math.PI * 2);
      ctx.fill();

      // Gold Shoulder Epaulets
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-9, neckY, 3.5, 2);
      ctx.fillRect(5.5, neckY, 3.5, 2);

      // Presidential Engraved Revolver in right hand
      ctx.save();
      ctx.translate(handX, handY);
      ctx.scale(dir, 1);
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.fillRect(0, -2, 10, 3);
      ctx.fillRect(-3, -2, 4, 4); // cylinder
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-3, 2, 3, 5); // handle
      ctx.restore();

      // 2D Waving Silk Flag / Cape behind in Cutscene
      ctx.save();
      const flagWave = Math.sin(time * 0.25) * 4;
      const capeX = -10 * dir;
      const capeY = neckY + 2;
      const capeW = 20 * dir;
      const capeH = 26;

      ctx.beginPath();
      ctx.moveTo(capeX, capeY);
      ctx.bezierCurveTo(capeX - 8 * dir, capeY + 12 + flagWave, capeX - 12 * dir, capeY + 22 - flagWave, capeX - 18 * dir, capeY + capeH + flagWave * 0.5);
      ctx.lineTo(capeX - 4 * dir, capeY + capeH);
      ctx.bezierCurveTo(capeX, capeY + 18, capeX + 4 * dir, capeY + 10, capeX, capeY);
      ctx.closePath();

      const capeGrad = ctx.createLinearGradient(capeX, capeY, capeX - 18 * dir, capeY + capeH);
      capeGrad.addColorStop(0, '#dc2626');
      capeGrad.addColorStop(0.5, '#b91c1c');
      capeGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = capeGrad;
      ctx.fill();

      // Gold bullion hem line
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }
    else if (charId === 'michael') {
      // 1. Dark Sleeveless Martial Gi with Golden Trim
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, neckY);
      ctx.lineTo(6, neckY);
      ctx.lineTo(10, hipY);
      ctx.lineTo(-10, hipY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold Chest Emblem (Kinetic Diamond)
      ctx.fillStyle = '#facc15';
      const midY = (neckY + hipY) * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, midY - 3.5);
      ctx.lineTo(3.5, midY);
      ctx.lineTo(0, midY + 3.5);
      ctx.lineTo(-3.5, midY);
      ctx.closePath();
      ctx.fill();

      // 2. SIGNATURE FLUTTERING SELENDANG (Flowing Silk Shawl / Scarf)
      const selendangWave = Math.sin(time * 0.2) * 6;
      ctx.strokeStyle = '#047857'; // Deep emerald silk base
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Selendang draped around neck
      ctx.moveTo(-7 * dir, neckY + 1);
      ctx.quadraticCurveTo(0, neckY + 7, 7 * dir, neckY + 1);
      ctx.stroke();

      // Flowing Selendang Tail (billowing back into the wind)
      ctx.beginPath();
      ctx.moveTo(-4 * dir, neckY + 3);
      ctx.bezierCurveTo(-12 * dir, neckY + 8 + selendangWave, -22 * dir, neckY + 4 - selendangWave, -34 * dir, neckY + 18 + selendangWave);
      ctx.stroke();

      // Gold embroidered border along the selendang
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4 * dir, neckY + 1);
      ctx.bezierCurveTo(-12 * dir, neckY + 6 + selendangWave, -22 * dir, neckY + 2 - selendangWave, -34 * dir, neckY + 16 + selendangWave);
      ctx.stroke();

      // Gold Martial Belt
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-7, hipY - 2, 14, 3);
    }
  };

  // --- DRAW STAND PHANTOM (STAR PLATINUM, THE WORLD, ETC) ---
  const drawCutsceneStand = (
    ctx: CanvasRenderingContext2D,
    x: number,
    groundY: number,
    charId: string,
    facingRight: boolean,
    isSpeaking: boolean,
    time: number,
    expression: string
  ) => {
    const dir = facingRight ? 1 : -1;
    const bodyHeight = 72;

    ctx.save();
    ctx.translate(x, groundY - bodyHeight);

    // NO STAND FOR JONATHAN & YOUNG JOSEPH (HAMON MASTERS)
    if (charId === 'jonathan' || charId === 'joseph_young') {
      const isJonathan = charId === 'jonathan';
      const glowColor = isJonathan ? 'rgba(250, 204, 21, 0.45)' : 'rgba(16, 185, 129, 0.45)';
      const pulseScale = 1 + Math.sin(time * 0.25) * 0.2 + (isSpeaking ? 0.25 : 0);

      const hamonGrad = ctx.createRadialGradient(0, 30, 4, 0, 30, 50 * pulseScale);
      hamonGrad.addColorStop(0, glowColor);
      hamonGrad.addColorStop(0.6, glowColor.replace('0.45', '0.15'));
      hamonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = hamonGrad;
      ctx.beginPath();
      ctx.arc(0, 30, 50 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // Surging Hamon Electric Sparks
      ctx.strokeStyle = isJonathan ? '#facc15' : '#34d399';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const angle = (time * 0.15 + i * 1.5) % (Math.PI * 2);
        const r = 24 + Math.sin(time * 0.3 + i) * 8;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r + 20;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 12, sy + (Math.random() - 0.5) * 12);
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    // HERMIT PURPLE FOR OLD JOSEPH (THORNY VINES & HAMON SPARKS)
    if (charId === 'joseph_old') {
      const pulseScale = 1 + Math.sin(time * 0.25) * 0.2 + (isSpeaking ? 0.25 : 0);
      const vineGrad = ctx.createRadialGradient(0, 30, 4, 0, 30, 55 * pulseScale);
      vineGrad.addColorStop(0, 'rgba(192, 132, 252, 0.55)');
      vineGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.2)');
      vineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = vineGrad;
      ctx.beginPath();
      ctx.arc(0, 30, 55 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // Thorny Purple Vines Writhing Around
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Vine 1
      ctx.beginPath();
      ctx.moveTo(-15 * dir, 45);
      ctx.bezierCurveTo(-25 * dir, 20, 10 * dir, 10, 25 * dir, 25);
      ctx.stroke();

      // Vine 2
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10 * dir, 50);
      ctx.bezierCurveTo(20 * dir, 30, -10 * dir, 5, -20 * dir, 18);
      ctx.stroke();

      // Sharp Yellow Thorns
      ctx.fillStyle = '#facc15';
      const thorns = [
        { x: -18 * dir, y: 28 },
        { x: 5 * dir, y: 14 },
        { x: 18 * dir, y: 22 },
        { x: -12 * dir, y: 15 },
      ];
      thorns.forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Yellow Hamon Lightning Arcs
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = (time * 0.2 + i * 2) % (Math.PI * 2);
        const r = 20 + Math.sin(time * 0.3 + i) * 10;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r + 25;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 12, sy + (Math.random() - 0.5) * 12);
        ctx.stroke();
      }

      ctx.restore();
      return;
    }

    // Stand Color Themes
    let auraColor = 'rgba(168, 85, 247, 0.4)';
    let standColor = '#a855f7';

    if (charId === 'dio') {
      auraColor = 'rgba(234, 179, 8, 0.4)';
      standColor = '#eab308';
    } else if (charId === 'crazy_diamond') {
      auraColor = 'rgba(56, 189, 248, 0.4)';
      standColor = '#38bdf8';
    } else if (charId === 'king_crimson') {
      auraColor = 'rgba(239, 68, 68, 0.4)';
      standColor = '#ef4444';
    } else if (charId === 'silver_chariot') {
      auraColor = 'rgba(226, 232, 240, 0.4)';
      standColor = '#e2e8f0';
    } else if (charId === 'joseph_old') {
      auraColor = 'rgba(192, 132, 252, 0.45)';
      standColor = '#c084fc';
    } else if (charId === 'tooru') {
      auraColor = 'rgba(239, 68, 68, 0.45)';
      standColor = '#64748b';
    } else if (charId === 'pucci') {
      auraColor = 'rgba(250, 204, 21, 0.45)';
      standColor = '#facc15';
    } else if (charId === 'funny_valentine') {
      auraColor = 'rgba(56, 189, 248, 0.45)';
      standColor = '#38bdf8';
    }

    // Aura Flame Glow Backdrop
    const pulseScale = 1 + Math.sin(time * 0.2) * 0.15 + (isSpeaking ? 0.2 : 0);
    const auraGrad = ctx.createRadialGradient(0, 30, 5, 0, 30, 48 * pulseScale);
    auraGrad.addColorStop(0, auraColor);
    auraGrad.addColorStop(0.7, auraColor.replace('0.4', '0.15'));
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 30, 48 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Stand Head & Body Structure
    ctx.globalAlpha = 0.88;
    const headRadius = 12;
    const headY = 10;
    const neckY = headY + headRadius;
    const hipY = neckY + 26;

    // Arms in ready battle pose
    let armLX = -10 * dir;
    let armLY = neckY + 10;
    let armRX = 14 * dir;
    let armRY = neckY + 8;

    if (charId === 'jotaro') {
      // Star Platinum Arms folded or flexing
      armLX = 6 * dir;
      armLY = neckY + 12;
      armRX = 8 * dir;
      armRY = neckY + 12;
    } else if (charId === 'dio') {
      // The World Muscles flexed
      armLX = -14 * dir;
      armLY = neckY - 2;
      armRX = 16 * dir;
      armRY = neckY + 2;
    } else if (charId === 'silver_chariot') {
      // Silver Chariot rapier drawn
      armRX = 22 * dir;
      armRY = neckY + 4;
    }

    // Stand Bones / Frame
    ctx.lineWidth = 4;
    ctx.strokeStyle = standColor;
    ctx.lineCap = 'round';

    // Torso
    ctx.beginPath();
    ctx.moveTo(0, neckY);
    ctx.lineTo(0, hipY);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(0, neckY + 4);
    ctx.lineTo(armLX, armLY);
    ctx.moveTo(0, neckY + 4);
    ctx.lineTo(armRX, armRY);
    ctx.stroke();

    // Stand Head
    ctx.fillStyle = standColor;
    ctx.beginPath();
    ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Stand Sharp Eyes
    ctx.fillStyle = charId === 'jotaro' ? '#facc15' : '#ef4444';
    ctx.beginPath();
    ctx.arc(4 * dir, headY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // STAND ACCESSORIES:
    if (charId === 'jotaro') {
      // Star Platinum Wild Long Flowing Mane
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.moveTo(0, headY - headRadius);
      ctx.bezierCurveTo(-dir * 16, headY - 12, -dir * 22, headY + 16, -dir * 18, neckY + 26);
      ctx.lineTo(-dir * 10, neckY + 18);
      ctx.closePath();
      ctx.fill();

      // Gold Headband
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, headY, headRadius + 1, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();
    }
    else if (charId === 'dio') {
      // The World Triangular Crown & Twin Power Cables
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.moveTo(-5, headY - headRadius);
      ctx.lineTo(0, headY - headRadius - 8);
      ctx.lineTo(5, headY - headRadius);
      ctx.closePath();
      ctx.fill();

      // Green power hoses
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(dir * 5, headY + 6);
      ctx.bezierCurveTo(dir * 10, neckY + 4, -dir * 6, neckY + 8, -dir * 8, neckY);
      ctx.stroke();
    }
    else if (charId === 'crazy_diamond') {
      // Heart Helmet Crown
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(-dir * 4, headY - headRadius);
      ctx.lineTo(0, headY - headRadius - 10);
      ctx.lineTo(dir * 4, headY - headRadius);
      ctx.closePath();
      ctx.fill();

      // Glowing Magenta Heart on Chest
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, neckY + 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (charId === 'king_crimson') {
      // Forehead Epitaph Face (Tiny face on head)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(dir * 2, headY - 6, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Epitaph small red eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(dir * 2 - 1.5, headY - 7, 1, 1);
      ctx.fillRect(dir * 2 + 1, headY - 7, 1, 1);
    }
    else if (charId === 'silver_chariot') {
      // Helmet Plume & Rapier Flurry
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(-dir * 4, headY - headRadius);
      ctx.lineTo(0, headY - headRadius - 8);
      ctx.lineTo(dir * 4, headY - headRadius);
      ctx.closePath();
      ctx.fill();

      // Rapier Flurry afterimages
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const offset = (Math.sin(time * 0.5 + i) * 6);
        ctx.beginPath();
        ctx.moveTo(armRX, armRY);
        ctx.lineTo(armRX + dir * 30, armRY + offset);
        ctx.stroke();
      }
    }
    else if (charId === 'tooru') {
      // Wonder of U: Iconic Bowler Hat with Wide Brim & Striped Band
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // Brim
      ctx.beginPath();
      ctx.ellipse(0, headY - headRadius + 2, headRadius + 7, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Hat Crown
      ctx.beginPath();
      ctx.roundRect(-headRadius + 2, headY - headRadius - 10, (headRadius - 2) * 2, 11, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Hat Band
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-headRadius + 2, headY - headRadius - 2, (headRadius - 2) * 2, 2.5);

      // Red Glowing Optic Slits (Eyes)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(dir * 3 - 2, headY - 2, 4, 1.5);
      ctx.fillRect(dir * 3 - 2, headY + 1.5, 4, 1.5);

      // Long Trench Coat Flapping Behind
      const coatWave = Math.sin(time * 0.25) * 4;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-6, hipY);
      ctx.lineTo(-dir * 18 + coatWave, hipY + 30);
      ctx.lineTo(dir * 4, hipY + 28);
      ctx.lineTo(6, hipY);
      ctx.closePath();
      ctx.fill();
    }
    else if (charId === 'pucci') {
      // WHITESNAKE / C-MOON / MADE IN HEAVEN CELESTIAL FORM
      // Executioner striped mask / Crown of Heaven
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-dir * 5, headY - headRadius);
      ctx.lineTo(0, headY - headRadius - 12);
      ctx.lineTo(dir * 5, headY - headRadius);
      ctx.closePath();
      ctx.fill();

      // Golden Halo of Heaven above stand head
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, headY - headRadius - 14, 12, 4, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Floating CD DISCs orbiting stand
      for (let i = 0; i < 3; i++) {
        const discAngle = time * 0.1 + i * 2.1;
        const discR = 24 + Math.sin(time * 0.2 + i) * 6;
        const dx = Math.cos(discAngle) * discR;
        const dy = Math.sin(discAngle) * (discR * 0.5) + neckY;
        
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    else if (charId === 'funny_valentine') {
      // D4C: DIRTY DEEDS DONE DIRT CHEAP
      // 1. Tall Iconic Rabbit-Ear Horns
      for (const s of [-1, 1]) {
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s * 4, headY - headRadius);
        ctx.lineTo(s * 11, headY - headRadius - 22);
        ctx.lineTo(s * 2, headY - headRadius - 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 2. White Cross-Stitch Diamond Lattice Mask
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.7, headY - headRadius * 0.5);
      ctx.lineTo(headRadius * 0.7, headY + headRadius * 0.5);
      ctx.moveTo(headRadius * 0.7, headY - headRadius * 0.5);
      ctx.lineTo(-headRadius * 0.7, headY + headRadius * 0.5);
      ctx.stroke();

      // 3. Glowing Golden Slit Eyes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(3 * dir, headY - 1, 2.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Quilted Diamond Shoulders
      for (const s of [-1, 1]) {
        ctx.fillStyle = '#bae6fd';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(s * 9, neckY + 4, 3.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // 5. Dimensional Spacetime Shimmer particles
      for (let i = 0; i < 4; i++) {
        const angle = time * 0.15 + i * 1.57;
        const px = Math.cos(angle) * 22;
        const py = Math.sin(angle) * 16 + neckY;
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#f472b6';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    else if (charId === 'michael') {
      // GHOST: HAT PRICE (Pure Golden Kinetic Phantom - NO HAT!)
      // 1. Ethereal Fiery Kinetic Aura Spikes (Flame Crest)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-dir * 6, headY - headRadius);
      ctx.lineTo(-dir * 11, headY - headRadius - 13);
      ctx.lineTo(-dir * 4, headY - headRadius - 7);
      ctx.lineTo(0, headY - headRadius - 18);
      ctx.lineTo(dir * 4, headY - headRadius - 8);
      ctx.lineTo(dir * 11, headY - headRadius - 14);
      ctx.lineTo(dir * 6, headY - headRadius);
      ctx.closePath();
      ctx.fill();

      // 2. Blazing White-Gold Phantom Eyes
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(4 * dir, headY - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Concentric Kinetic Shock Rings around Hat Price
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.lineWidth = 1.5;
      const ringR = (time * 18) % 36;
      ctx.beginPath();
      ctx.arc(0, headY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Flurry of Kinetic Golden Palms
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const pOff = Math.sin(time * 0.4 + i * 2) * 8;
        ctx.beginPath();
        ctx.arc(armRX + dir * (10 + i * 8), armRY + pOff, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  return (
    <div className="relative w-full max-w-4xl h-[240px] sm:h-[290px] flex items-center justify-center my-auto z-10 shrink-0">
      <canvas
        ref={canvasRef}
        width={720}
        height={280}
        className="w-full h-full max-h-[280px] object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      />
    </div>
  );
};
