import { CharacterDef, BossType } from '../types';

export const BOSS_SCALE = 1.35;

export const BOSS_CHARACTERS: CharacterDef[] = [
  {
    id: 'boss_dio',
    name: 'AWAKENED DIO (GOD FORM)',
    userName: 'DIO (Awakened Vampire God)',
    standName: 'THE WORLD OVERLORD',
    title: 'Immortal Vampire Overlord & Master of Time',
    bodyColor: '#fef08a',
    standColor: '#facc15',
    auraColor: 'crimson',
    eyeColor: '#ef4444',
    barrageCry: 'WRRRRRYYYYY!! MUDA MUDA MUDA!!',
    specialMove: 'THE WORLD: APOCALYPTIC TIME STOP (12s)',
    timeStopDurationSec: 12,
    stats: {
      power: 'SSS',
      speed: 'SS',
      range: 'A+',
      durability: 'EX (4500 HP BOSS REGEN)',
    },
    skillsList: [
      { id: 'boss_blood_drain', name: 'Apocalyptic Blood Feast', command: 'Boss Passive/Auto', description: 'Menyedot darah dari jarak jauh dan memicu ledakan darah area.' },
      { id: 'boss_time_stop', name: 'The World Overlord (12s)', command: 'Boss Ultimate', description: 'Menghentikan waktu seluruh pemain selama 12 detik!' },
      { id: 'boss_road_roller', name: 'Gigantic Road Roller Crush', command: 'Boss Special', description: 'Menghantamkan Road Roller raksasa berukuran masif yang memicu ledakan seismik.' },
      { id: 'boss_knives', name: '100 Flying Knives Cloud', command: 'Boss Skill', description: 'Menebar badai ratusan pisau pembunuh mengambang di udara.' },
    ],
    description: 'Bentuk kebangkitan darah Joestar tertinggi dari DIO Brando. Memiliki darah 4,500 HP, cakar vampir beracun, ukuran raksasa, dan kekuatan Stand The World tanpa batas.',
  },
  {
    id: 'boss_diavolo',
    name: 'EMPEROR DIAVOLO (CRIMSON FATE)',
    userName: 'Diavolo (Lord of Crimson Fate)',
    standName: 'KING CRIMSON ETERNAL',
    title: 'Supreme Passione Boss & Absolute Erasure',
    bodyColor: '#f43f5e',
    standColor: '#be123c',
    auraColor: 'crimson',
    eyeColor: '#fbbf24',
    barrageCry: 'KORE GA WAGA KING CRIMSON NO NORYOKU!',
    specialMove: 'ETERNAL TIME ERASE & AMBUSH OF DEATH',
    stats: {
      power: 'SSS',
      speed: 'SSS',
      range: 'B',
      durability: 'EX (3800 HP BOSS HYPER-ARMOR)',
    },
    skillsList: [
      { id: 'boss_time_erase', name: 'Eternal Time Erasure', command: 'Boss Passive', description: 'Menghapus waktu secara berantai, kebal segala damage dan berteleportasi di belakang lawan.' },
      { id: 'boss_donut_execution', name: 'Fatal Donut Cleave', command: 'Boss Strike', description: 'Tusukan King Crimson membelah dada berdamage dahsyat dengan knockback pentalan tinggi.' },
      { id: 'boss_blood_blind_storm', name: 'Rain of Crimson Blood', command: 'Boss Area', description: 'Menyiram arena dengan darah kutukan yang membutakan seluruh pemain.' },
    ],
    description: 'Bentuk takdir mutlak Bos Passione Diavolo dengan King Crimson Eternal berkekuatan penuh. Memiliki 3,800 HP, invulnerability auto-blink beruntun, dan eksekusi mematikan.',
  },
  {
    id: 'boss_tooru',
    name: 'SUPREME TOORU (CALAMITY WONDER)',
    userName: 'Tooru (Head Doctor & Calamity Ruler)',
    standName: 'WONDER OF U (ABSOLUTE LOGIC)',
    title: 'Head Doctor of TG University Hospital & Master of Calamity',
    bodyColor: '#0ea5e9',
    standColor: '#334155',
    auraColor: 'calamity',
    eyeColor: '#38bdf8',
    barrageCry: 'SORA WO MIAGE... CALAMITY WA SUBETE WO SEIGYO SURU.',
    specialMove: 'RELAXED CALAMITY: AUTOMATIC WONDER OF U',
    stats: {
      power: 'EX',
      speed: 'C (Relaxed & Casual Stroll)',
      range: 'INFINITE',
      durability: 'EX (4200 HP CALAMITY LOGIC)',
    },
    skillsList: [
      { id: 'boss_calamity_passive', name: 'Automatic Calamity Law', command: 'Boss Passive', description: 'Siapapun yang mendekati atau mengejar Boss Tooru akan secara otomatis dihantam Bencana (Mobil, Meteor, Petir, Puing).' },
      { id: 'boss_wou_entity', name: 'Wonder of U Autonomous Entity', command: 'Boss Guard', description: 'Stand Wonder of U berjalan bebas di arena dan melontarkan hempasan energi penolak musuh.' },
      { id: 'boss_calamity_rain', name: 'Rain of Calamity & Traffic Carnage', command: 'Boss Ultimate', description: 'Menyerukan hujan bencana dan konvoi mobil berkecepatan tinggi menyeberangi arena.' },
    ],
    description: 'Bentuk bos dari Tooru dan Stand Wonder of U. Memiliki 4,200 HP dan gaya bertarung yang sangat santai. Hukum Calamity secara otomatis membalas dan menghancurkan musuh yang mencoba mendekat atau menyerangnya.',
  },
  {
    id: 'boss_pucci',
    name: 'FATHER PUCCI (HEAVEN ASCENSION)',
    userName: 'Father Pucci (Heaven Ascension)',
    standName: 'MIH / C-MOON / WHITESNAKE',
    title: 'The Architect of the New Universe & Master of Gravity',
    bodyColor: '#4c1d95',
    standColor: '#fbbf24',
    auraColor: 'heaven',
    eyeColor: '#ef4444',
    barrageCry: 'MADE IN HEAVEN! HEAVEN ACCELERATION!',
    specialMove: 'UNIVERSE RESET & INFINITE ACCELERATION',
    stats: {
      power: 'SSS',
      speed: 'SSS (Infinite)',
      range: 'EX',
      durability: 'EX (5000 HP BOSS SPEED)',
    },
    skillsList: [
      { id: 'boss_disc_steal', name: 'Disc Extraction Steal', command: 'Boss Strike', description: 'Mencuri disc lawan, menyegel seluruh jurus mereka selama beberapa detik dan melumpuhkan mereka.' },
      { id: 'boss_gravity_slam', name: 'C-Moon Gravity Slam & Axis Shift', command: 'Boss Special', description: 'Mengubah arah gravitasi arena dan menghempaskan musuh berkali-kali ke langit.' },
      { id: 'boss_time_acceleration', name: 'Infinite Made in Heaven Acceleration', command: 'Boss Ultimate', description: 'Mempercepat aliran waktu secara ekstrem, meningkatkan kecepatan gerak dan serangan Pucci secara gila-gilaan.' },
    ],
    description: 'Bentuk kenaikan surga mutlak dari Enrico Pucci. Berbekal 5,000 HP, dia bertarung secara sangat agresif, melumpuhkan lawan dengan pencurian DISC, memanipulasi gravitasi dengan C-Moon, dan mempercepat aliran waktu menjadi tak terbatas dengan Made in Heaven.',
  },
];

export function getBossDefinition(type: BossType): CharacterDef {
  return BOSS_CHARACTERS.find((b) => b.id === type) || BOSS_CHARACTERS[0];
}
