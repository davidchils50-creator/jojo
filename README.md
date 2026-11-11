# ⚡ Jojo's Bizarre Adventure: Heritage for the Future / MUGEN (Web Edition)

A high-performance, action-packed 2D fighting game inspired by *JoJo's Bizarre Adventure*, built with **React, TypeScript, Vite, Tailwind CSS, and HTML5 Canvas**. Play as iconic characters with faithful Stand abilities, Time Stop mechanics, Time Erase, Hamon breath, and fully customizable touch controls!

---

## 🌟 Features & Roster

- **Complete Playable Roster**:
  - **Michael Junister** (*Ghost: Hat Price*) - Devil's Competitive No.1 jockey with his horse George. Kinetic momentum meter & storage, Golden Palm Thrust, Flash Step Counter, Golden Axe Kick, Hat Price Overdrive, Kinetic Rush Barrage, and Maximum Price Ultimate.
  - **Perstein / Wally Wable** (*Wable the Metal Cutter*) - 70m heavy-duty motorcycle roller drive chain combat, reactive chain deflection stance, Awaken modes, and 4-phase hydraulic execution (Snare -> Torque Reel-In -> High-RPM Spin Shred -> Total Erosion Constriction Crush).
  - **Jotaro Kujo** (*Star Platinum*) - Star Platinum ORA ORA Rush, Star Finger, Time Stop (T).
  - **DIO Brando** (*The World*) - Vampire abilities, Knife Throw, Drain Blood, The World Time Stop (T), Road Roller Ultimate (Y).
  - **Josuke Higashikata** (*Crazy Diamond*) - Homing Shard tractor pull, Angelo Wall trap, Rock Shield, Dora Counter, Ground Smash, and Enraged mode (<30% HP).
  - **Diavolo** (*King Crimson*) - Epitaph foresight, Time Erase slow motion (7s), Donut Chop, Flesh Throw, and Erase Ambush.
  - **Jean Pierre Polnareff** (*Silver Chariot*) - Ray Thrust, Armor Off (2x speed mode), Sword Projectile, Upward Thrust.
  - **Jonathan Joestar** (*Hamon Warrior*) - Zoom Punch, Hamon Breath/Heal, Sendo Wave, Parry Stance, Luck & Pluck Sword equip/unequip.
  - **Joseph Joestar (Young)** (*Clacker Master*) - Clacker Volley, Bait Counter, Tommy Gun, Red Stone Beam.
  - **Joseph Joestar (Old)** (*Hermit Purple*) - Hermit Grab, Camera Smash, Overdrive Surge.
  - **Tooru** (*Wonder of U*) - Flow of Calamity passive, Calamity Phantom, Locacaca 6251, De Do Do Do De Da Da Da, Calamity Car crash.
  - **Enrico Pucci** (*Whitesnake / C-MOON / Made in Heaven*) - DISC extraction, Gravity Shift, Time Acceleration.
  - **Funny Valentine** (*Dirty Deeds Done Dirt Cheap / Love Train*) - Dimension Hop, Clone Ambush, Flag Trap, Love Train barrier.
  - **Dipez** (*Pure Light Form*) - Photon Control, Light Laser, Mirrored Reflection, Superluminal Blitz.
  - **Arabian Fat** (*The Sun*) - Mirror Camouflage Fortress, Focused Heat Ray Snipe, Desert Mirage Illusion, Prominence Solar Bombardment, Supernova Heatwave.

- **🛠️ Interactive Touch HUD Customizer (HUD Settings)**:
  - Full touchscreen gamepad layout customizer.
  - Choose any character and preview all their skills arranged in rows.
  - Freely **drag and drop** buttons on the virtual screen, resize button scales (50% to 220%), use manual X/Y offsets, or 5px precision nudge arrows.
  - Settings are saved automatically per character to `localStorage`.

- **🕹️ Controls**:
  - **Movement**: A / D (or On-screen Left/Right)
  - **Jump / Crouch**: W / S (or On-screen D-pad)
  - **Punch**: J (Heavy Strike)
  - **Barrage / Rush**: K (Stand Barrage)
  - **Pose**: B (Restore Energy)
  - **Stand Toggle**: L (Summon/Dismiss Stand)
  - **Time / Special Power**: T (Time Stop / Time Erase)
  - **Ultimate**: Y (Character Ultimate Attack)
  - **Skills 1-5**: U, I, O, P, H

---

## 🚀 Tech Stack

- **Framework**: React 18+ with Vite (TypeScript)
- **Styling**: Tailwind CSS & Lucide Icons
- **Animation**: Motion (`motion/react`)
- **Rendering**: HTML5 2D Canvas Engine with custom particle effects, screen shake, and afterimage shaders.

---

## 💻 Local Development

If you want to run this project locally:

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/davidchils50-creator/Jojo-stickman-game.git

# 2. Navigate to project folder
cd Jojo-stickman-game

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
\`\`\`

---

## 📄 License

Created for fan enjoyment and open-source demonstration under the MIT License. JoJo's Bizarre Adventure is created by Hirohiko Araki.
