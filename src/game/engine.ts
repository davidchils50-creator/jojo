import { 
  Fighter, 
  Hitbox, 
  InputState, 
  Particle, 
  MatchConfig, 
  CharacterDef, 
  Projectile,
  TimeStopState,
  BarrageClashState,
  NextLineCutsceneState,
  HitReactionType,
  HitDirection,
  ArenaHazard,
  ArenaHazardType,
  DramaticFinisherState,
  StageFatalityType,
  WallBreakState
} from '../types';

export function getCharacterDramaticFinisherQuote(charId: string): { quote: string; cry: string } {
  switch (charId) {
    case 'jotaro':
      return { quote: 'やれやれだぜ... (Good grief... you never stood a chance.)', cry: 'オラァッ!! (ORA FINISH!)' };
    case 'dio':
      return { quote: 'WRYYYYY!! このDIOだァァッ!! (This is THE WORLD!)', cry: '無駄ァッ!! (MUDA FINISH!)' };
    case 'crazy_diamond':
      return { quote: 'グレートだぜ... このジョウスケの前に立つな！', cry: 'ドラァッ!! (DORARARA!)' };
    case 'jonathan':
      return { quote: 'ふるえるぞハート！燃えつきるほどヒート！', cry: 'SUNLIGHT YELLOW OVERDRIVE!!' };
    case 'joseph_young':
      return { quote: 'お前の次のセリフは...「貴様、いつの間に！」という！', cry: 'HAMON OVERDRIVE BEAT!!' };
    case 'joseph_old':
      return { quote: 'OH MY GOD!! これが老練の知恵と隠者の紫じゃ！', cry: 'HERMIT PURPLE 20-METER OVERDRIVE!' };
    case 'silver_chariot':
      return { quote: 'ブラボー！おお、ブラボー！針の穴をも通す剣技だ！', cry: 'SILVER CHARIOT! HORA HORA!!' };
    case 'king_crimson':
      return { quote: '結果だけが残る！これが我が『キング・クリムゾン』の絶頂！', cry: 'KORE GA WAGA KING CRIMSON!!' };
    case 'funny_valentine':
      return { quote: '我が心と行動に一点の曇りなし...! 全てが『正義』だ！', cry: 'DOJYAA~~N!!' };
    case 'pucci':
      return { quote: '『天国』へ行く時が来たのだ！時は加速する！', cry: 'MADE IN HEAVEN FINISH!!' };
    case 'tooru':
      return { quote: 'キミは『厄災の流れ』を追ってきた... それが過ちだ。', cry: 'CALAMITY OF WONDER OF U.' };
    case 'michael':
      return { quote: 'THINK HARDER, FIGHT SMARTER! KINETIC EQUATION SOLVED!', cry: 'WRAAAA KINETIC IMPACT!!' };
    case 'perstein':
      return { quote: '...SHH... THE 70-METER CHAIN HAS FALLEN SILENT.', cry: 'SILENCE AFTER THE STORM.' };
    case 'arabian_fat':
      return { quote: '我が『ザ・サン』の超高熱からは誰も逃れられん！', cry: 'SOLAR SUPERNOVA INCINERATION!' };
    case 'dipez':
      return { quote: 'DIVINE LIGHT TRANSCENDS ALL DARKNESS!', cry: 'PURE LIGHT DETONATION!!' };
    default:
      return { quote: 'RETIRED! VICTORY DECIDED!', cry: 'STAND FINISHER!!' };
  }
}

export function getNextLineQuotes(opponentCharId: string): {
  predictedCatchphraseJp: string;
  predictedCatchphraseEn: string;
  opponentShockReactionJp: string;
  opponentShockReactionEn: string;
  predictedCatchphrase: string;
  opponentShockReaction: string;
  charThemeColor: string;
} {
  switch (opponentCharId) {
    case 'dio':
      return {
        predictedCatchphraseJp: '『WRYYYYYYーッ！！』',
        predictedCatchphraseEn: '"WRYYYYYY--!!"',
        opponentShockReactionJp: 'な…何だとッ！？ このDIOが貴様ごときに読まれるだとォォーッ！？',
        opponentShockReactionEn: 'W-What the hell?! Me, DIO, read like a book by a mere brat?!',
        predictedCatchphrase: 'WRYYYYYYーッ！！',
        opponentShockReaction: 'な…何だとッ！？ (W-What the hell?!)',
        charThemeColor: '#facc15'
      };
    case 'jotaro':
      return {
        predictedCatchphraseJp: '『やれやれだぜ』',
        predictedCatchphraseEn: '"Yare Yare Daze"',
        opponentShockReactionJp: 'なっ…！？ バカな… オレの心理を完全に見抜いてやがったのか…',
        opponentShockReactionEn: 'W-What...?! Ridiculous... He saw right through my mind...',
        predictedCatchphrase: 'やれやれだぜ',
        opponentShockReaction: 'なっ…バカな！？ (W-What...?!)',
        charThemeColor: '#818cf8'
      };
    case 'jonathan':
      return {
        predictedCatchphraseJp: '『ふるえるぞハート！燃えつきるほどヒート！！』',
        predictedCatchphraseEn: '"My heart resonates! Heat enough to burn!!"',
        opponentShockReactionJp: 'はっ…！？ なぜそれを…！？ 君は私の波紋の呼吸を読んだのかい！？',
        opponentShockReactionEn: 'Ha-?! How did you know that...?! You read my Hamon flow?!',
        predictedCatchphrase: 'ふるえるぞハート！燃えつきるほどヒート！！',
        opponentShockReaction: 'はっ！？ なぜそれを…！？ (How did you know?!)',
        charThemeColor: '#38bdf8'
      };
    case 'silver_chariot':
      return {
        predictedCatchphraseJp: '『Bravo! Oh, Bravo!!』',
        predictedCatchphraseEn: '"Bravo! Oh, Bravo!!"',
        opponentShockReactionJp: 'トレビアン…じゃなくて、な、なんでオレのセリフを先回りするんだよォッ！？',
        opponentShockReactionEn: 'Tres bien... wait no! Why the hell are you stealing my lines beforehand?!',
        predictedCatchphrase: 'Bravo! Oh, Bravo!!',
        opponentShockReaction: 'オ、オレのセリフを！？ (Stealing my line?!)',
        charThemeColor: '#e2e8f0'
      };
    case 'josuke':
    case 'crazy_diamond':
      return {
        predictedCatchphraseJp: '『グレートだぜ…』',
        predictedCatchphraseEn: '"That\'s totally Great..."',
        opponentShockReactionJp: 'う、うそだろオイ！？ なんでオレの口癖まで知ってんだよォーッ！？',
        opponentShockReactionEn: 'N-No way man! How the hell do you even know my catchphrase?!',
        predictedCatchphrase: 'グレートだぜ (Great daze)...',
        opponentShockReaction: 'うそだろオイ！？ (No way man?!)',
        charThemeColor: '#06b6d4'
      };
    case 'king_crimson':
      return {
        predictedCatchphraseJp: '『帝王はこのディアボロだッ！！依然変わりなくッ！』',
        predictedCatchphraseEn: '"The Emperor is this Diavolo!! Unchanged as ever!"',
        opponentShockReactionJp: 'バ、バカなッ！ エピタフにすら現れなかった未来だとォォォッ！？',
        opponentShockReactionEn: 'I-Impossible! A future that didn\'t even appear in Epitaph\'s forecast?!',
        predictedCatchphrase: '帝王はこのディアボロだッ！！',
        opponentShockReaction: 'エピタフでも見えなかっただと…！？ (Epitaph missed this?!)',
        charThemeColor: '#ef4444'
      };
    case 'pucci':
      return {
        predictedCatchphraseJp: '『素数を数えて落ち着くんだ… 2, 3, 5, 7, 11…』',
        predictedCatchphraseEn: '"Count prime numbers to stay calm... 2, 3, 5, 7..."',
        opponentShockReactionJp: 'な…神の意志ではなく貴様の知略だと！？ 思考の先を越された…！',
        opponentShockReactionEn: 'Wh-Not God\'s will, but your cunning?! You outpaced my thoughts...!',
        predictedCatchphrase: '素数を数えて落ち着くんだ…',
        opponentShockReaction: '思考の先を越された…！ (Outpaced my thoughts?!)',
        charThemeColor: '#a855f7'
      };
    case 'tooru':
      return {
        predictedCatchphraseJp: '……。',
        predictedCatchphraseEn: '("......")',
        opponentShockReactionJp: '『厄災』の流れからは決して逃れられない…',
        opponentShockReactionEn: 'You can never escape the flow of Calamity...',
        predictedCatchphrase: '……。',
        opponentShockReaction: '……何か用かな？',
        charThemeColor: '#f43f5e'
      };
    case 'gappy':
      return {
        predictedCatchphraseJp: '『オレはいったい誰なんだ…？』',
        predictedCatchphraseEn: '"Who on earth am I...?"',
        opponentShockReactionJp: 'な…！？ なぜ僕の記憶の深淵を言い当てられるんだ…！？',
        opponentShockReactionEn: 'Wh-?! How could you pinpoint the depths of my lost memory...?!',
        predictedCatchphrase: 'オレはいったい誰なんだ…？',
        opponentShockReaction: 'なぜ僕の記憶を…！？',
        charThemeColor: '#38bdf8'
      };
    case 'funny_valentine':
      return {
        predictedCatchphraseJp: '『どじゃあ〜ん！！』',
        predictedCatchphraseEn: '"Dojyaaa--n!!"',
        opponentShockReactionJp: '我が大統領の決意を… 貴様のような若造に見抜かれるとは…！',
        opponentShockReactionEn: 'My presidential resolve... foreseen by a reckless youngster like you...!',
        predictedCatchphrase: 'どじゃあ〜ん！！',
        opponentShockReaction: '若造に見抜かれるとは…！',
        charThemeColor: '#f472b6'
      };
    case 'joseph_old':
      return {
        predictedCatchphraseJp: '『OH NOOOO!! OH MY GOD!!』',
        predictedCatchphraseEn: '"OH NOOOO!! OH MY GOD!!"',
        opponentShockReactionJp: 'HOLY SHIIIT!! 過去の若かりしワシに心理を読まれるとは何たる屈辱じゃあああ！！',
        opponentShockReactionEn: 'HOLY SHIIIT!! What a total humiliation to be read by my own younger self!!',
        predictedCatchphrase: 'OH NOOOO!! OH MY GOD!!',
        opponentShockReaction: 'HOLY SHIT!! 過去のワシに読まれたーッ！',
        charThemeColor: '#c084fc'
      };
    case 'michael':
      return {
        predictedCatchphraseJp: '『ウラアーッ！！』',
        predictedCatchphraseEn: '"Wraaaa!!"',
        opponentShockReactionJp: 'なっ…何だと…！？ 黙りやがれッ！！',
        opponentShockReactionEn: 'What??? Shut the fuck off!!',
        predictedCatchphrase: 'ウラアーッ！！',
        opponentShockReaction: 'なっ…何だと…！？ 黙りやがれッ！！',
        charThemeColor: '#facc15'
      };
    case 'perstein':
      return {
        predictedCatchphraseJp: '『シーッ...』',
        predictedCatchphraseEn: '"Shhh..."',
        opponentShockReactionJp: 'な…何だと…！？ どうやってそれをやったんだ…！？',
        opponentShockReactionEn: 'what?, how you do that',
        predictedCatchphrase: 'シーッ...',
        opponentShockReaction: 'な…何だと…！？ どうやってそれをやったんだ…！？',
        charThemeColor: '#38bdf8'
      };
    case 'arabian_fat':
      return {
        predictedCatchphraseJp: '『この灼熱の太陽から逃げられると思うなよ！』',
        predictedCatchphraseEn: '"Don\'t think you can escape this scorching Sun!"',
        opponentShockReactionJp: 'ひいいっ！ 潜伏場所もセリフも全部バレバレじゃねえかァーッ！！',
        opponentShockReactionEn: 'Eeeeek! My hiding spot and my lines are completely exposed?!',
        predictedCatchphrase: 'この砂漠の太陽から逃げられると思うなよ！',
        opponentShockReaction: '全部バレバレじゃねえかァーッ！！',
        charThemeColor: '#f97316'
      };
    case 'dipez':
      return {
        predictedCatchphraseJp: '『ウォアーッ！！』',
        predictedCatchphraseEn: '"Whoaaa!!"',
        opponentShockReactionJp: 'バ…バカな… 論理的にあり得ん…！！',
        opponentShockReactionEn: "i... Impossible, That's not logical",
        predictedCatchphrase: 'ウォアーッ！！',
        opponentShockReaction: 'バ…バカな… 論理的にあり得ん…！！',
        charThemeColor: '#fef08a'
      };
    case 'joseph_young':
      return {
        predictedCatchphraseJp: '『おまえの次のセリフは……！』',
        predictedCatchphraseEn: '"Next you\'re gonna say..."',
        opponentShockReactionJp: 'う…うそだろオイ！？ w.. what the fuck, My own words！？',
        opponentShockReactionEn: 'W.. what the fuck, My own words...?!',
        predictedCatchphrase: 'おまえの次のセリフは……！',
        opponentShockReaction: 'w.. what the fuck, My own words',
        charThemeColor: '#34d399'
      };
    case 'vampire':
    default:
      return {
        predictedCatchphraseJp: '『おのれェェッ！ジョジョォォーッ！！』',
        predictedCatchphraseEn: '"Curse youuu! JOJOOO--!!" ...to iu!',
        opponentShockReactionJp: 'ぎゃあああッ！？ な、何でお前の口からワシの言葉が出るんじゃァァッ！？',
        opponentShockReactionEn: 'Gyaaaah?! Wh-Why are my own words coming out of your mouth?!',
        predictedCatchphrase: 'おのれェェッ！ジョジョォォーッ！！',
        opponentShockReaction: '何でお前の口からワシの言葉が！？',
        charThemeColor: '#ef4444'
      };
  }
}
import {
  ARENA_WIDTH,
  SURVIVAL_ARENA_WIDTH,
  GROUND_Y,
  GRAVITY,
  MOVE_SPEED,
  JUMP_FORCE,
  FRICTION,
  PLAYER_MAX_HP,
  PLAYER_MAX_ENERGY,
  ENERGY_REGEN_PER_FRAME,
  STAND_ENERGY_UPKEEP,
  PUNCH_DAMAGE,
  PUNCH_STAND_DAMAGE,
  PUNCH_COOLDOWN,
  PUNCH_DURATION,
  BARRAGE_COST,
  BARRAGE_DAMAGE_PER_HIT,
  BARRAGE_STAND_DAMAGE_PER_HIT,
  BARRAGE_DURATION,
  BARRAGE_COOLDOWN,
  POSE_DURATION,
  POSE_ENERGY_GAIN,
  FIGHTER_WIDTH,
  FIGHTER_HEIGHT,
  CHARACTERS,
  MAPS,
  JOTARO_TIME_STOP_FRAMES,
  DIO_TIME_STOP_FRAMES,
  TIME_STOP_ENERGY_COST,
  TIME_STOP_COOLDOWN,
  STAR_FINGER_DAMAGE,
  STAR_FINGER_RANGE,
  STAR_FINGER_STUN,
  STAR_FINGER_COST,
  STAR_FINGER_COOLDOWN,
  STAR_VACUUM_COST,
  STAR_VACUUM_PULL_SPEED,
  STAR_VACUUM_DURATION,
  STAR_VACUUM_COOLDOWN,
  ORA_BEATDOWN_COST,
  ORA_BEATDOWN_GRAB_RANGE,
  ORA_BEATDOWN_TOTAL_DAMAGE,
  ORA_BEATDOWN_DURATION,
  ORA_BEATDOWN_COOLDOWN,
  STAND_LEAP_IMPULSE,
  STAND_LEAP_COST,
  STAND_LEAP_COOLDOWN,
  PARRY_STANCE_DURATION,
  PARRY_COUNTER_DAMAGE,
  PARRY_COST,
  PARRY_COOLDOWN,
  KNIFE_THROW_COUNT,
  KNIFE_DAMAGE,
  KNIFE_SPEED,
  KNIFE_COST,
  KNIFE_COOLDOWN,
  DRAIN_BLOOD_GRAB_RANGE,
  DRAIN_BLOOD_DAMAGE,
  DRAIN_BLOOD_HEAL,
  DRAIN_BLOOD_DURATION,
  DRAIN_BLOOD_COST,
  DRAIN_BLOOD_COOLDOWN,
  STREET_SIGN_DAMAGE,
  STREET_SIGN_RANGE,
  STREET_SIGN_GUARD_BREAK_FRAMES,
  STREET_SIGN_COST,
  STREET_SIGN_COOLDOWN,
  SPACE_RIPPER_DAMAGE,
  SPACE_RIPPER_DURATION,
  SPACE_RIPPER_COST,
  SPACE_RIPPER_COOLDOWN,
  TELEPORT_COST,
  TELEPORT_COOLDOWN,
  ROAD_ROLLER_COST,
  ROAD_ROLLER_TOTAL_DAMAGE,
  ROAD_ROLLER_DURATION,
  ROAD_ROLLER_COOLDOWN,
  // JONATHAN
  ZOOM_PUNCH_DAMAGE,
  ZOOM_PUNCH_RANGE,
  ZOOM_PUNCH_STUN,
  ZOOM_PUNCH_COST,
  ZOOM_PUNCH_COOLDOWN,
  HAMON_HEAL_AMOUNT,
  HAMON_HEAL_ENERGY_GAIN,
  HAMON_HEAL_DURATION,
  HAMON_HEAL_COST,
  HAMON_HEAL_COOLDOWN,
  SENDO_WAVE_DAMAGE,
  SENDO_WAVE_SPEED,
  SENDO_WAVE_COST,
  SENDO_WAVE_COOLDOWN,
  HAMON_COUNTER_DAMAGE,
  HAMON_COUNTER_COST,
  HAMON_COUNTER_COOLDOWN,
  LUCK_PLUCK_DAMAGE,
  LUCK_PLUCK_RANGE,
  LUCK_PLUCK_COST,
  LUCK_PLUCK_COOLDOWN,
  SUNLIGHT_ULTIMATE_DAMAGE,
  SUNLIGHT_ULTIMATE_DURATION,
  SUNLIGHT_ULTIMATE_COST,
  SUNLIGHT_ULTIMATE_COOLDOWN,
  // YOUNG JOSEPH
  CLACKER_VOLLEY_DAMAGE,
  CLACKER_VOLLEY_COST,
  CLACKER_VOLLEY_COOLDOWN,
  NEXT_LINE_COST,
  NEXT_LINE_COOLDOWN,
  NEXT_LINE_COUNTER_DAMAGE,
  HAMON_ELBOW_DAMAGE,
  HAMON_ELBOW_COST,
  HAMON_ELBOW_COOLDOWN,
  TOMMY_GUN_BULLET_DAMAGE,
  TOMMY_GUN_COST,
  TOMMY_GUN_COOLDOWN,
  YOUNG_JOSEPH_ULTIMATE_DAMAGE,
  YOUNG_JOSEPH_ULTIMATE_COST,
  YOUNG_JOSEPH_ULTIMATE_COOLDOWN,
  // OLD JOSEPH
  HERMIT_GRAPPLE_DAMAGE,
  HERMIT_GRAPPLE_RANGE,
  HERMIT_GRAPPLE_COST,
  HERMIT_GRAPPLE_COOLDOWN,
  SPIRIT_PHOTO_BUFF_DURATION,
  SPIRIT_PHOTO_COST,
  SPIRIT_PHOTO_COOLDOWN,
  HERMIT_TRAP_DAMAGE,
  HERMIT_TRAP_COST,
  HERMIT_TRAP_COOLDOWN,
  OVERDRIVE_TACTICS_DAMAGE,
  OVERDRIVE_TACTICS_COST,
  OVERDRIVE_TACTICS_COOLDOWN,
  OLD_JOSEPH_ULTIMATE_DAMAGE,
  OLD_JOSEPH_ULTIMATE_COST,
  OLD_JOSEPH_ULTIMATE_COOLDOWN,
  // DIAVOLO
  EPITAPH_DURATION,
  EPITAPH_COUNTER_DAMAGE,
  EPITAPH_COST,
  EPITAPH_COOLDOWN,
  CRIMSON_CLEAVE_DAMAGE,
  CRIMSON_CLEAVE_COST,
  CRIMSON_CLEAVE_COOLDOWN,
  FATE_CRUSHER_DAMAGE,
  FATE_CRUSHER_COST,
  FATE_CRUSHER_COOLDOWN,
  TIME_ERASE_DURATION,
  TIME_ERASE_COST,
  TIME_ERASE_COOLDOWN,
  DONUT_STRIKE_DAMAGE,
  DONUT_STRIKE_COST,
  DONUT_STRIKE_COOLDOWN,
  FLESH_THROW_DAMAGE,
  FLESH_THROW_BLIND_DURATION,
  FLESH_THROW_COST,
  FLESH_THROW_COOLDOWN,
  TIME_ERASE_AMBUSH_DAMAGE,
  TIME_ERASE_AMBUSH_COST,
  TIME_ERASE_AMBUSH_COOLDOWN,
  DOPPIO_CALL_DURATION,
  DOPPIO_CALL_COOLDOWN,
  DOPPIO_SCALPEL_DAMAGE,
  DOPPIO_SCALPEL_COST,
  DOPPIO_SCALPEL_COOLDOWN,
  DOPPIO_TWIN_ARMS_DAMAGE_PER_HIT,
  DOPPIO_TWIN_ARMS_COST,
  DOPPIO_TWIN_ARMS_COOLDOWN,
  DOPPIO_SCISSORS_DAMAGE,
  DOPPIO_SCISSORS_COST,
  DOPPIO_SCISSORS_COOLDOWN,
  DOPPIO_AEROSMITH_BAIT_DAMAGE,
  DOPPIO_AEROSMITH_BAIT_COST,
  DOPPIO_AEROSMITH_BAIT_COOLDOWN,
  DOPPIO_TRANSFORM_DURATION,
  // POLNAREFF
  RAY_OF_LIGHT_DAMAGE_PER_HIT,
  RAY_OF_LIGHT_COST,
  RAY_OF_LIGHT_COOLDOWN,
  ARMOR_OFF_SPEED_MULTIPLIER,
  ARMOR_OFF_DEFENSE_PENALTY,
  ARMOR_OFF_COST,
  ARMOR_OFF_COOLDOWN,
  SHOOTING_SWORD_DAMAGE,
  SHOOTING_SWORD_COST,
  SHOOTING_SWORD_COOLDOWN,
  UPWARD_THRUST_DAMAGE,
  UPWARD_THRUST_COST,
  UPWARD_THRUST_COOLDOWN,
  AFTERIMAGE_MIRAGE_DAMAGE,
  AFTERIMAGE_MIRAGE_COST,
  AFTERIMAGE_MIRAGE_COOLDOWN,
  JOSUKE_HOMING_SHARD_DAMAGE,
  JOSUKE_HOMING_SHARD_SPEED,
  JOSUKE_HOMING_SHARD_COST,
  JOSUKE_HOMING_SHARD_COOLDOWN,
  JOSUKE_ANGELO_WALL_STUN_DURATION,
  JOSUKE_ANGELO_WALL_DAMAGE,
  JOSUKE_ANGELO_WALL_COST,
  JOSUKE_ANGELO_WALL_COOLDOWN,
  JOSUKE_BEARING_SHOT_DAMAGE,
  JOSUKE_BEARING_SHOT_SPEED,
  JOSUKE_BEARING_SHOT_COST,
  JOSUKE_BEARING_SHOT_COOLDOWN,
  JOSUKE_DORA_COUNTER_DURATION,
  JOSUKE_DORA_COUNTER_DAMAGE,
  JOSUKE_DORA_COUNTER_COST,
  JOSUKE_DORA_COUNTER_COOLDOWN,
  JOSUKE_ROCK_SHIELD_DURATION,
  JOSUKE_ROCK_SHIELD_COST,
  JOSUKE_ROCK_SHIELD_COOLDOWN,
  JOSUKE_GROUND_PUNCH_DAMAGE,
  JOSUKE_GROUND_PUNCH_COST,
  JOSUKE_GROUND_PUNCH_COOLDOWN,
  // TOORU & WONDER OF U
  TOORU_HEAD_DOCTOR_DURATION,
  TOORU_HEAD_DOCTOR_COST,
  TOORU_HEAD_DOCTOR_COOLDOWN,
  TOORU_ROCK_INSECT_DAMAGE,
  TOORU_ROCK_INSECT_POISON_TICKS,
  TOORU_ROCK_INSECT_COST,
  TOORU_ROCK_INSECT_COOLDOWN,
  TOORU_CALAMITY_COUNTER_DURATION,
  TOORU_CALAMITY_COUNTER_COST,
  TOORU_CALAMITY_COUNTER_COOLDOWN,
  TOORU_CALAMITY_RAIN_DURATION,
  TOORU_ULTIMATE_DURATION,
  TOORU_CALAMITY_RAIN_TICK_DAMAGE,
  TOORU_CALAMITY_RAIN_SKILL_COST,
  TOORU_CALAMITY_RAIN_SKILL_COOLDOWN,
  TOORU_CURSE_GAZE_COST,
  TOORU_CURSE_GAZE_COOLDOWN,
  TOORU_METEOR_DAMAGE,
  TOORU_ULTIMATE_COST,
  TOORU_ULTIMATE_COOLDOWN,
  CALAMITY_DEBRIS_DAMAGE,
  CALAMITY_LIGHTNING_DAMAGE,
  CALAMITY_TRIP_DAMAGE,
  CALAMITY_COMBUSTION_TICK_DAMAGE,
  CALAMITY_CAR_DAMAGE,
  CALAMITY_BLEED_TICK_DAMAGE,
  PUCCI_14_WORDS_LIST,
  PUCCI_14_WORDS_TOTAL_WORDS,
  PUCCI_14_WORDS_STEP_FRAMES,
  PUCCI_14_WORDS_COST,
  PUCCI_14_WORDS_COOLDOWN,
  PUCCI_PISTOL_DAMAGE,
  PUCCI_PISTOL_SPEED,
  PUCCI_PISTOL_COST,
  PUCCI_PISTOL_COOLDOWN,
  PUCCI_DISC_EXTRACT_DAMAGE,
  PUCCI_DISC_EXTRACT_COST,
  PUCCI_DISC_EXTRACT_COOLDOWN,
  PUCCI_ACID_MELT_DAMAGE,
  PUCCI_ACID_MELT_DAMAGE_TICK,
  PUCCI_ACID_MELT_DURATION,
  PUCCI_ACID_MELT_COST,
  PUCCI_ACID_MELT_COOLDOWN,
  PUCCI_STAND_DISC_DAMAGE,
  PUCCI_STAND_DISC_FREEZE_DURATION,
  PUCCI_STAND_DISC_COST,
  PUCCI_STAND_DISC_COOLDOWN,
  CMOON_GRAVITY_SHIFT_COST,
  CMOON_GRAVITY_SHIFT_COOLDOWN,
  CMOON_INVERSION_PUNCH_DAMAGE,
  CMOON_INVERSION_PUNCH_COST,
  CMOON_INVERSION_PUNCH_COOLDOWN,
  CMOON_DEBRIS_LAUNCH_DAMAGE,
  CMOON_DEBRIS_LAUNCH_COST,
  CMOON_DEBRIS_LAUNCH_COOLDOWN,
  CMOON_GRAVITY_SHIELD_DURATION,
  CMOON_GRAVITY_SHIELD_COST,
  CMOON_GRAVITY_SHIELD_COOLDOWN,
  CMOON_EVOLVE_MIH_COST,
  MIH_SPEED_BLITZ_DAMAGE,
  MIH_SPEED_BLITZ_COST,
  MIH_SPEED_BLITZ_COOLDOWN,
  MIH_TIME_ACCEL_DURATION,
  MIH_TIME_ACCEL_COST,
  MIH_TIME_ACCEL_COOLDOWN,
  MIH_KNIFE_COUNT,
  MIH_KNIFE_DAMAGE,
  MIH_KNIFE_SPEED,
  MIH_KNIFE_COST,
  MIH_KNIFE_COOLDOWN,
  MIH_TELEPORT_STRIKE_DAMAGE,
  MIH_TELEPORT_STRIKE_COST,
  MIH_TELEPORT_STRIKE_COOLDOWN,
  MIH_TELEPORT_DAMAGE,
  MIH_TELEPORT_COST,
  MIH_TELEPORT_COOLDOWN,
  MIH_UNIVERSE_RESET_DAMAGE,
  MIH_UNIVERSE_RESET_COST,
  MIH_UNIVERSE_RESET_COOLDOWN,
  PUCCI_MEMORY_DISC_DAMAGE,
  PUCCI_MEMORY_DISC_COST,
  PUCCI_MEMORY_DISC_COOLDOWN,
  PUCCI_ACID_DAMAGE_PER_TICK,
  PUCCI_ACID_DURATION,
  CMOON_DEBRIS_DAMAGE,
  CMOON_DEBRIS_COST,
  CMOON_DEBRIS_COOLDOWN,
  CMOON_SHIELD_DURATION,
  CMOON_SHIELD_COST,
  CMOON_SHIELD_COOLDOWN,
  MIH_SPEED_BLITZ_DAMAGE_PER_HIT,
  // GAPPY (PART 8: JOJOLION)
  GAPPY_PLUNDER_CHANCE,
  GAPPY_PLUNDER_EFFECT_DURATION,
  GAPPY_BUBBLE_PLUNDER_COST,
  GAPPY_BUBBLE_PLUNDER_COOLDOWN,
  GAPPY_FRICTION_STRIP_DURATION,
  GAPPY_SHAVE_MOISTURE_DAMAGE,
  GAPPY_SHAVE_MOISTURE_LIFESTEAL,
  GAPPY_SHAVE_MOISTURE_ATTACK_DRAIN_PCT,
  GAPPY_SHAVE_MOISTURE_DURATION,
  GAPPY_SHAVE_MOISTURE_COST,
  GAPPY_SHAVE_MOISTURE_COOLDOWN,
  GAPPY_BUBBLE_BARRAGE_DAMAGE_PER_HIT,
  GAPPY_BUBBLE_BARRAGE_BURST_DAMAGE,
  GAPPY_BUBBLE_BARRAGE_COST,
  GAPPY_BUBBLE_BARRAGE_COOLDOWN,
  GAPPY_SHIELD_DURATION,
  GAPPY_TRAP_DURATION,
  GAPPY_BUBBLE_TRAP_COST,
  GAPPY_BUBBLE_TRAP_COOLDOWN,
  GAPPY_GO_BEYOND_TRUE_DAMAGE,
  GAPPY_GO_BEYOND_COST,
  GAPPY_GO_BEYOND_COOLDOWN,
  // FUNNY VALENTINE (PART 7: STEEL BALL RUN)
  VALENTINE_PARALLEL_COST,
  VALENTINE_PARALLEL_COOLDOWN,
  VALENTINE_PARALLEL_DURATION,
  VALENTINE_CLONE_ARMY_COST,
  VALENTINE_CLONE_ARMY_COOLDOWN,
  VALENTINE_CLONE_DURATION,
  VALENTINE_BARRAGE_DAMAGE_PER_HIT,
  VALENTINE_BARRAGE_FINISHER_DAMAGE,
  VALENTINE_BARRAGE_COST,
  VALENTINE_BARRAGE_COOLDOWN,
  VALENTINE_LOVE_TRAIN_DURATION,
  VALENTINE_LOVE_TRAIN_COST,
  VALENTINE_LOVE_TRAIN_COOLDOWN,
  VALENTINE_LOVE_TRAIN_REDIRECT_DAMAGE,
  VALENTINE_PISTOL_DAMAGE,
  VALENTINE_PARADOX_TRUE_DAMAGE,
  VALENTINE_LIFE_INSURANCE_HEAL_PCT,
  // THE SUN & ARABIAN FAT (PART 3: STARDUST CRUSADERS)
  SUN_TEMPERATURE_RISE_RATE,
  SUN_MAX_TEMPERATURE,
  SUN_BASE_LASER_INTERVAL,
  SUN_FAST_LASER_INTERVAL,
  SUN_LASER_DAMAGE,
  SUN_LASER_SPEED,
  SUN_BOMBARDMENT_DAMAGE,
  SUN_BOMBARDMENT_COUNT,
  SUN_BOMBARDMENT_COST,
  SUN_BOMBARDMENT_COOLDOWN,
  SUN_SUPERNOVA_DAMAGE,
  SUN_SUPERNOVA_COST,
  SUN_SUPERNOVA_COOLDOWN,
  SUN_MIRAGE_TRAP_COST,
  SUN_MIRAGE_TRAP_COOLDOWN,
  SUN_MIRAGE_DURATION,
  SUN_MIRROR_MAX_HP,
  SUN_EXPOSED_PANIC_HP,
  // MICHAEL JUNISTER (GHOST: HAT PRICE)
  MICHAEL_PALM_THRUST_DAMAGE,
  MICHAEL_PALM_THRUST_COST,
  MICHAEL_PALM_THRUST_COOLDOWN,
  MICHAEL_PALM_THRUST_DASH_SPEED,
  MICHAEL_COUNTER_DURATION,
  MICHAEL_COUNTER_DAMAGE,
  MICHAEL_COUNTER_COST,
  MICHAEL_COUNTER_COOLDOWN,
  MICHAEL_AXE_KICK_DAMAGE,
  MICHAEL_AXE_KICK_COST,
  MICHAEL_AXE_KICK_COOLDOWN,
  MICHAEL_OVERDRIVE_DURATION,
  MICHAEL_OVERDRIVE_COST,
  MICHAEL_OVERDRIVE_COOLDOWN,
  MICHAEL_BARRAGE_DAMAGE,
  MICHAEL_BARRAGE_COST,
  MICHAEL_BARRAGE_COOLDOWN,
  MICHAEL_ULTIMATE_DAMAGE,
  MICHAEL_ULTIMATE_COST,
  MICHAEL_ULTIMATE_COOLDOWN,
  // WALLY WABLE / PERSTEIN
  PERSTEIN_CHAIN_WHIP_DAMAGE,
  PERSTEIN_CHAIN_WHIP_RANGE,
  PERSTEIN_CHAIN_WHIP_COST,
  PERSTEIN_CHAIN_WHIP_COOLDOWN,
  PERSTEIN_SHRED_DAMAGE_PER_HIT,
  PERSTEIN_SHRED_COST,
  PERSTEIN_SHRED_COOLDOWN,
  PERSTEIN_SPARK_DAMAGE,
  PERSTEIN_SPARK_COST,
  PERSTEIN_SPARK_COOLDOWN,
  PERSTEIN_DEFLECTION_DURATION,
  PERSTEIN_DEFLECTION_COST,
  PERSTEIN_DEFLECTION_COOLDOWN,
  PERSTEIN_FLESH_TEAR_DAMAGE,
  PERSTEIN_FLESH_TEAR_COST,
  PERSTEIN_FLESH_TEAR_COOLDOWN,
  PERSTEIN_ULTIMATE_DAMAGE,
  PERSTEIN_ULTIMATE_COST,
  PERSTEIN_ULTIMATE_COOLDOWN,
} from './constants';
import { soundManager } from './audio';
import { createFighter } from './fighterFactory';
import { AIController } from './aiController';
import { findCharacterById, PUCCI_FORM_SKILLS } from './characters';

export class GameEngine {
  public player: Fighter;
  public ai: Fighter;
  public teammate: Fighter | null = null;
  public projectiles: Projectile[] = [];
  public particles: Particle[] = [];
  public arenaHazards: ArenaHazard[] = [];
  public acidPools: Array<{ id: number; ownerId: string; x: number; y: number; width: number; height: number; damagePerTick: number; duration: number; color: string }> = [];
  public activeGravityAxis: 'down' | 'right' | 'up' | 'left' = 'down';
  
  // STAGE WALL BREAK & DYNAMIC TRANSITION STATE
  public wallHpLeft: number = 100;
  public wallHpRight: number = 100;
  public isWallBroken: boolean = false;
  public isStageExpanded: boolean = false;
  public subArenaStartX: number = 1080;
  public isRightWallBroken: boolean = false;
  public isLeftWallBroken: boolean = false;
  public stageExpansionWidth: number = 0;
  public wallBreakThresholdX: number = 1080;
  public stagePhase: number = 0;
  public subArenaTitle: string = '';
  public wallBreakBannerTimer: number = 0;
  public wallBreakState: WallBreakState = {
    isActive: false,
    side: 'right',
    timer: 0,
    maxTimer: 26,
    subArenaTitle: '',
    stagePhase: 0,
    victimId: '',
    attackerId: '',
    isRightWallBroken: false,
    isLeftWallBroken: false,
    stageExpansionWidth: 0,
    wallBreakThresholdX: 1080,
  };
  public matchTime: number = 99; // seconds
  public isGameOver: boolean = false;
  public winner: 'player' | 'ai' | 'draw' | null = null;
  public screenShake: number = 0;
  public matchConfig: MatchConfig;
  public survivalStreak: number = 0;
  public vampires: Fighter[] = [];
  public vampireWaveTimer: number = 600;
  
  // GLOBAL TIME STOP & DAMAGE STACKING STATE
  public timeStopState: TimeStopState = {
    isActive: false,
    initiator: null,
    accumulatedDamagePlayer: 0,
    accumulatedDamageAI: 0,
    accumulatedDamageTeammate: 0,
    accumulatedKnockbackXPlayer: 0,
    accumulatedKnockbackYPlayer: 0,
    accumulatedKnockbackXAI: 0,
    accumulatedKnockbackYAI: 0,
    accumulatedKnockbackXTeammate: 0,
    accumulatedKnockbackYTeammate: 0,
    filterFlash: 0,
  };

  // STAND BARRAGE CLASH SYSTEM (All-Star Battle / Eyes of Heaven style Rush Clash)
  public barrageClash: BarrageClashState = {
    isActive: false,
    fighter1Id: '',
    fighter2Id: '',
    clashX: 0,
    clashY: 0,
    meter: 0, // -100 (F1 pushes F2 to edge) to +100 (F2 pushes F1)
    f1MashRate: 0,
    f2MashRate: 0,
    combinedMashRate: 0,
    f1TotalMashes: 0,
    f2TotalMashes: 0,
    clashIntensity: 0,
    durationFrames: 0,
    winnerId: null,
    resolutionPhase: 'active',
    finisherTimer: 0,
    isBothBots: false,
    timeRemainingSec: 4.0,
    f1Name: '',
    f2Name: '',
    f1StandName: '',
    f2StandName: '',
    f1CharId: '',
    f2CharId: '',
    f1Color: '#ffffff',
    f2Color: '#ffffff',
    f1StandColor: '#ffffff',
    f2StandColor: '#ffffff',
    f1AuraColor: 'purple',
    f2AuraColor: 'gold',
    f1HasStand: true,
    f2HasStand: true,
    f1Cry: 'ORA!',
    f2Cry: 'MUDA!',
  };

  private f1LastMashPressed: boolean = false;
  private f2LastMashPressed: boolean = false;
  private f1MashTimestamps: number[] = [];
  private f2MashTimestamps: number[] = [];
  private aiF1ClashMashCooldown: number = 0;
  private aiF2ClashMashCooldown: number = 0;
  private isExecutingClashFinisher: boolean = false;

  public isClashParticipant(f: Fighter | null | undefined): boolean {
    if (!f || !this.barrageClash || !this.barrageClash.isActive) return false;
    return f.id === this.barrageClash.fighter1Id || f.id === this.barrageClash.fighter2Id;
  }

  public universeResetFlash: number = 0;
  public nextLineCutscene: NextLineCutsceneState | null = null;
  public dramaticFinisher: DramaticFinisherState | null = null;
  private frameCount: number = 0;
  private particleId: number = 0;
  private projectileId: number = 0;
  private aiControllersMap: Map<string, AIController> = new Map();

  public triggerNextLineCutscene(joseph: Fighter, opponent: Fighter) {
    const quotes = getNextLineQuotes(opponent.charId);
    this.nextLineCutscene = {
      isActive: true,
      timer: 340,
      maxTimer: 340,
      josephId: joseph.id,
      opponentId: opponent.id,
      josephName: joseph.userName || joseph.name,
      opponentName: opponent.userName || opponent.name,
      josephCharId: joseph.charId,
      opponentCharId: opponent.charId,
      predictedCatchphraseJp: quotes.predictedCatchphraseJp,
      predictedCatchphraseEn: quotes.predictedCatchphraseEn,
      opponentShockReactionJp: quotes.opponentShockReactionJp,
      opponentShockReactionEn: quotes.opponentShockReactionEn,
      predictedCatchphrase: quotes.predictedCatchphrase,
      opponentShockReaction: quotes.opponentShockReaction,
      charThemeColor: quotes.charThemeColor,
      phase: 'intro',
    };

    // 1. Joseph enters iconic finger-pointing prediction pose
    joseph.action = 'next_line';
    joseph.actionTimer = 345;
    joseph.actionDuration = 345;
    joseph.invulnerableTimer = 360;
    joseph.vx = 0;
    joseph.vy = 0;

    // 2. Both fighters anchored squarely on ground level (never submerged under floor or hovering)
    joseph.y = GROUND_Y - joseph.height;
    joseph.isGrounded = true;

    const arenaW = this.getArenaWidth();
    if (opponent.spawnX !== undefined && opponent.spawnX > 0) {
      opponent.x = opponent.spawnX;
    } else {
      opponent.x = joseph.facing === 'right' ? Math.min(arenaW - 140, joseph.x + 420) : Math.max(80, joseph.x - 420);
    }
    opponent.y = GROUND_Y - opponent.height;
    opponent.isGrounded = true;
    opponent.vx = 0;
    opponent.vy = 0;

    // Opponent starts in their normal / confident combat stance (NOT in shock yet!)
    opponent.action = 'idle';
    opponent.actionTimer = 345;
    opponent.actionDuration = 345;
    opponent.invulnerableTimer = 360;
    opponent.hitStun = 0;

    // Face each other on the battlefield
    if (joseph.x < opponent.x) {
      joseph.facing = 'right';
      opponent.facing = 'left';
    } else {
      joseph.facing = 'left';
      opponent.facing = 'right';
    }

    // Teleport dust poof & shockwave at opponent's spawn location
    this.addShockwave(opponent.x + opponent.width / 2, opponent.y + opponent.height / 2, '#38bdf8');
    for (let i = 0; i < 8; i++) {
      this.addSpark(opponent.x + opponent.width / 2, opponent.y + opponent.height / 2, '#38bdf8');
    }

    soundManager.playHamonBuzz();
    soundManager.playPoseSound('joseph_young');
    this.screenShake = 10;
    this.addMenacingParticle(joseph.x + joseph.width / 2, joseph.y - 30, 'ズキュウウン', '#facc15');
  }

  private updateNextLineCutscene() {
    if (!this.nextLineCutscene || !this.nextLineCutscene.isActive) return;

    this.nextLineCutscene.timer--;
    const t = this.nextLineCutscene.timer;

    const joseph = this.getFighterById(this.nextLineCutscene.josephId);
    const opponent = this.getFighterById(this.nextLineCutscene.opponentId);

    if (!joseph || !opponent) {
      this.nextLineCutscene = null;
      return;
    }

    // Freeze motion during interaction on map
    joseph.vx = 0;
    joseph.vy = 0;
    opponent.vx = 0;
    opponent.vy = 0;
    joseph.invulnerableTimer = Math.max(joseph.invulnerableTimer, 30);
    opponent.invulnerableTimer = Math.max(opponent.invulnerableTimer, 30);

    // Keep Joseph in pointing pose
    joseph.action = 'next_line';

    // Face each other
    if (joseph.x < opponent.x) {
      joseph.facing = 'right';
      opponent.facing = 'left';
    } else {
      joseph.facing = 'left';
      opponent.facing = 'right';
    }

    // Dynamic sequential speech & pose transitions with distinct realization pause:
    // 1. Phase 1 (340 -> 265): Joseph smirks & points: "Tsugi ni omae wa..." (JP then EN subtitle)
    // Opponent stands composed in combat stance
    if (t > 265) {
      this.nextLineCutscene.phase = 'intro';
      opponent.action = 'idle';
      if (t === 338) {
        soundManager.playPoseSound('joseph_young');
      }
    } 
    // 2. Phase 2 (265 -> 190): "Tsugi ni" text clears! Joseph speaks opponent's line + "...to iu!"
    // Opponent still stands composed
    else if (t > 190) {
      this.nextLineCutscene.phase = 'predict';
      opponent.action = 'idle';
      if (t === 264) {
        this.screenShake = 8;
        soundManager.playHamonBuzz();
        this.addTextParticle(joseph.x + joseph.width / 2, joseph.y - 65, '🧠 TSUGI NI OMAE WA... TO IU!', '#facc15');
        this.addMenacingParticle(joseph.x + joseph.width / 2, joseph.y - 30, 'ドンッ', '#facc15');
      }
    } 
    // 3. Phase 3 (190 -> 115): Opponent speaks their own line IN THEIR CHARACTER POSE (NOT shocked yet!)
    else if (t > 115) {
      this.nextLineCutscene.phase = 'predict';
      // Opponent speaks proudly in their signature stance / pose!
      opponent.action = 'pose';
      if (t === 189) {
        soundManager.playPoseSound(opponent.charId);
      }
    }
    // 3.5. SILENT REALIZATION PAUSE (114 -> 80):
    // Opponent finishes speaking. Bubble closes! Opponent stands in pose for 35 frames (~0.6s) realizing what they just said!
    else if (t > 80) {
      this.nextLineCutscene.phase = 'predict';
      opponent.action = 'idle';
    }
    // 4. Phase 4 (79 -> 24): Opponent suddenly realizes they fell into the trap -> SWITCH TO SHOCK ANIMATION!
    else if (t > 24) {
      this.nextLineCutscene.phase = 'opponent_shock';
      // NOW opponent switches to shocked staggering / panic recoil!
      opponent.action = 'hit';
      opponent.hitReactionType = 'heavy_stagger';
      opponent.hitIntensity = 1.0;
      opponent.hitReactionTimer = 55;
      opponent.hitReactionDuration = 55;

      if (t === 78) {
        soundManager.playClashFinisher();
        this.screenShake = 18;
        this.addMenacingParticle(opponent.x + opponent.width / 2, opponent.y - 45, '！？', '#ef4444');
      }
      if (t % 6 === 0) {
        this.addSpark(opponent.x + opponent.width / 2 + (Math.random() - 0.5) * 35, opponent.y + (Math.random() - 0.5) * 35, '#ef4444');
      }
    } 
    // 5. Phase 5 (24 -> 0): Catastrophic Hamon String Trap Detonation!
    else if (t === 24) {
      this.nextLineCutscene.phase = 'detonate';
      const launchDir = joseph.facing === 'right' ? 1 : -1;
      
      this.screenShake = 150;
      soundManager.playHamonBuzz();
      soundManager.playOverdriveExplosion();
      soundManager.playClashFinisher();

      const cx = opponent.x + opponent.width / 2;
      const cy = opponent.y + opponent.height / 2;

      for (let s = 0; s < 7; s++) {
        this.addShockwave(cx, cy, s % 2 === 0 ? '#34d399' : '#facc15');
      }
      for (let i = 0; i < 35; i++) {
        this.addSpark(cx + (Math.random() - 0.5) * 100, cy + (Math.random() - 0.5) * 100, '#34d399');
        this.addSpark(cx + (Math.random() - 0.5) * 100, cy + (Math.random() - 0.5) * 100, '#facc15');
        this.addSpark(cx + (Math.random() - 0.5) * 100, cy + (Math.random() - 0.5) * 100, '#ffffff');
      }

      this.addTextParticle(cx, cy - 70, '🧠 MIND-READING COUNTER DETONATION! (-260 HP) 💥', '#34d399');
      this.addMenacingParticle(cx, cy - 35, 'ドゴォォン!!', '#facc15');

      // Heavy counter damage & directional launch
      opponent.invulnerableTimer = 0;
      this.applyRawDamage(opponent, 260, launchDir * 24, -13, joseph);
      opponent.action = 'knockback';
      opponent.hitReactionType = 'directional_launch';
      opponent.hitReactionTimer = 80;
      opponent.hitReactionDuration = 80;
      opponent.hitStun = 80;
      opponent.isGrounded = false;
      opponent.actionTimer = 0;

      joseph.action = 'idle';
      joseph.actionTimer = 0;
      joseph.invulnerableTimer = 45;
    } else if (t <= 0) {
      this.nextLineCutscene = null;
    }
  }

  public getAIControllerForFighter(fighterId: string): AIController {
    let controller = this.aiControllersMap.get(fighterId);
    if (!controller) {
      controller = new AIController();
      this.aiControllersMap.set(fighterId, controller);
    }
    return controller;
  }

  public getArenaWidth(): number {
    const mode = this.matchConfig?.mode;
    const baseW = (mode === 'survival' || mode === 'team_survival' || mode === 'team_boss')
      ? SURVIVAL_ARENA_WIDTH
      : ARENA_WIDTH;
    return baseW + this.stageExpansionWidth;
  }

  constructor(config?: MatchConfig) {
    this.matchConfig = config || {
      playerChar: CHARACTERS[0],
      enemyChar: CHARACTERS[1],
      mode: 'arcade',
      map: MAPS[0],
    };

    this.player = createFighter('player', 280, 'right', this.matchConfig.playerChar, this.matchConfig);
    this.ai = createFighter('ai', 800, 'left', this.matchConfig.enemyChar, this.matchConfig);

    if (this.matchConfig.mode === 'team_boss' || this.matchConfig.mode === 'team_survival') {
      const partnerChar = this.matchConfig.teammateChar || CHARACTERS[2];
      this.teammate = createFighter('teammate', 130, 'right', partnerChar, this.matchConfig);
      this.teammate.team = 'teamA';
    } else {
      this.teammate = null;
    }

    this.checkAndStartTooruBgm();
    this.initArenaHazards();
  }

  public checkAndStartTooruBgm() {
    const hasTooru =
      this.player.charId === 'tooru' ||
      this.ai.charId === 'tooru' ||
      this.ai.bossType === 'boss_tooru' ||
      (this.teammate && this.teammate.charId === 'tooru');

    if (hasTooru && !this.isGameOver) {
      soundManager.startTooruMatchBgm();
    } else {
      soundManager.stopTooruMatchBgm();
    }
  }

  public setMatchConfig(config: MatchConfig) {
    this.matchConfig = config;
    this.reset();
  }

  public spawnVampireWave(count: number = 2) {
    const MAX_ACTIVE_VAMPIRES = 4;
    const availableSlots = Math.max(0, MAX_ACTIVE_VAMPIRES - this.vampires.length);
    const actualSpawn = Math.min(count, availableSlots);
    if (actualSpawn <= 0) return;

    const arenaW = this.getArenaWidth();
    const vampireDef = findCharacterById('vampire') || CHARACTERS[0];

    for (let i = 0; i < actualSpawn; i++) {
      const fromLeft = i % 2 === 0;
      const sideIndex = Math.floor(i / 2);
      const offset = sideIndex * 110;
      const spawnX = fromLeft ? -100 - offset : arenaW + 100 + offset;
      const facing: 'left' | 'right' = fromLeft ? 'right' : 'left';
      const id = `vampire_${this.frameCount}_${i}_${Math.floor(Math.random() * 1000)}`;

      const v = createFighter(id, spawnX, facing, vampireDef, this.matchConfig);
      v.team = 'teamB';
      v.invulnerableTimer = 20;
      v.maxHp = 105 + Math.floor(Math.random() * 20);
      v.hp = v.maxHp;
      v.hasStand = false;
      v.isStandActive = false;
      v.standAlpha = 0;
      this.vampires.push(v);
      this.addShockwave(spawnX, GROUND_Y - 40, '#ef4444');
    }

    soundManager.playPoseSound('dio');
    this.addTextParticle(
      Math.min(arenaW - 400, Math.max(400, this.player.x)),
      130,
      `🩸 VAMPIRE SURGE! (+${actualSpawn} VAMPIRES FROM LEFT & RIGHT WALLS)`,
      '#ef4444'
    );
  }

  public getAllActiveFighters(): Fighter[] {
    const list: Fighter[] = [];

    const addFighterWithClones = (f: Fighter | null) => {
      if (!f || f.hp <= 0) return;
      list.push(f);
      if (f.valentineClones) {
        for (const clone of f.valentineClones) {
          if (clone && clone.hp > 0) {
            clone.team = f.team;
            clone.isClone = true;
            clone.isValentineClone = true;
            list.push(clone);
          }
        }
      }
      if (f.parallelEnemyClone && f.parallelEnemyClone.hp > 0) {
        list.push(f.parallelEnemyClone);
      }
    };

    addFighterWithClones(this.player);
    addFighterWithClones(this.ai);
    addFighterWithClones(this.teammate);

    if (this.vampires) {
      for (const v of this.vampires) {
        if (v && v.hp > 0) list.push(v);
      }
    }

    return list;
  }

  public getTargetsForAttacker(attacker: Fighter, defaultTarget: Fighter): Fighter[] {
    const isAttackerParallel = !!attacker.isParallelWorld;

    if (this.matchConfig.mode === 'survival' || this.matchConfig.mode === 'team_survival') {
      if (attacker.team === 'teamA') {
        const aliveVampires = this.vampires.filter(v => v.hp > 0 && !!v.isParallelWorld === isAttackerParallel);
        if (aliveVampires.length > 0) return aliveVampires;
      }
    }

    const all = this.getAllActiveFighters();
    const targets: Fighter[] = [];

    for (const f of all) {
      if (f.id !== attacker.id && f.hp > 0) {
        // Enforce strict dimension boundary: only targets in the exact same dimension
        if (!!f.isParallelWorld !== isAttackerParallel) {
          continue;
        }
        // Target opposing team members
        if (f.team !== attacker.team) {
          targets.push(f);
        }
      }
    }

    if (
      targets.length === 0 &&
      defaultTarget &&
      defaultTarget.hp > 0 &&
      defaultTarget.id !== attacker.id &&
      defaultTarget.team !== attacker.team &&
      !!defaultTarget.isParallelWorld === isAttackerParallel
    ) {
      targets.push(defaultTarget);
    }

    return targets;
  }

  public reset() {
    this.player = createFighter('player', 280, 'right', this.matchConfig.playerChar, this.matchConfig);
    this.ai = createFighter('ai', 800, 'left', this.matchConfig.enemyChar, this.matchConfig);
    
    if (this.matchConfig.mode === 'team_boss' || this.matchConfig.mode === 'team_survival') {
      const partnerChar = this.matchConfig.teammateChar || CHARACTERS[2];
      this.teammate = createFighter('teammate', 130, 'right', partnerChar, this.matchConfig);
      this.teammate.team = 'teamA';
    } else {
      this.teammate = null;
    }

    this.vampires = [];
    this.vampireWaveTimer = 720;
    this.survivalStreak = 0;

    if (this.matchConfig.mode === 'survival' || this.matchConfig.mode === 'team_survival') {
      this.spawnVampireWave(2);
      if (this.vampires.length > 0) {
        this.ai = this.vampires[0];
      }
    }

    this.projectiles = [];
    this.particles = [];
    if (this.matchConfig.mode === 'training') {
      this.matchTime = 999;
    } else if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings?.matchTimer !== undefined) {
      this.matchTime = this.matchConfig.customSettings.matchTimer === 0 ? 999 : this.matchConfig.customSettings.matchTimer;
    } else {
      this.matchTime = 99;
    }
    this.isGameOver = false;
    this.winner = null;
    this.screenShake = 0;
    this.frameCount = 0;
    this.timeStopState = {
      isActive: false,
      initiator: null,
      accumulatedDamagePlayer: 0,
      accumulatedDamageAI: 0,
      accumulatedDamageTeammate: 0,
      accumulatedKnockbackXPlayer: 0,
      accumulatedKnockbackYPlayer: 0,
      accumulatedKnockbackXAI: 0,
      accumulatedKnockbackYAI: 0,
      accumulatedKnockbackXTeammate: 0,
      accumulatedKnockbackYTeammate: 0,
      filterFlash: 0,
    };
    this.barrageClash = {
      isActive: false,
      fighter1Id: '',
      fighter2Id: '',
      clashX: 0,
      clashY: 0,
      meter: 0,
      f1MashRate: 0,
      f2MashRate: 0,
      combinedMashRate: 0,
      f1TotalMashes: 0,
      f2TotalMashes: 0,
      clashIntensity: 0,
      durationFrames: 0,
      winnerId: null,
      resolutionPhase: 'active',
      finisherTimer: 0,
      isBothBots: false,
      timeRemainingSec: 4.0,
      f1Name: '',
      f2Name: '',
      f1StandName: '',
      f2StandName: '',
      f1CharId: '',
      f2CharId: '',
      f1Color: '#ffffff',
      f2Color: '#ffffff',
      f1StandColor: '#ffffff',
      f2StandColor: '#ffffff',
      f1AuraColor: 'purple',
      f2AuraColor: 'gold',
      f1HasStand: true,
      f2HasStand: true,
      f1Cry: 'ORA!',
      f2Cry: 'MUDA!',
    };
    this.f1MashTimestamps = [];
    this.f2MashTimestamps = [];
    this.f1LastMashPressed = false;
    this.f2LastMashPressed = false;
    this.aiF1ClashMashCooldown = 0;
    this.aiF2ClashMashCooldown = 0;
    this.nextLineCutscene = null;
    this.dramaticFinisher = null;

    // Reset Stage Expansion & Wall States
    this.wallHpLeft = 100;
    this.wallHpRight = 100;
    this.isWallBroken = false;
    this.isStageExpanded = false;
    this.subArenaStartX = 1080;
    this.isRightWallBroken = false;
    this.isLeftWallBroken = false;
    this.stageExpansionWidth = 0;
    this.stagePhase = 0;
    this.subArenaTitle = '';
    this.wallBreakBannerTimer = 0;
    this.wallBreakState = {
      isActive: false,
      side: 'right',
      timer: 0,
      maxTimer: 26,
      subArenaTitle: '',
      stagePhase: 0,
      victimId: '',
      attackerId: '',
      isRightWallBroken: false,
      isLeftWallBroken: false,
      stageExpansionWidth: 0,
      wallBreakThresholdX: 1080,
    };

    this.checkAndStartTooruBgm();
    this.initArenaHazards();
  }

  public initArenaHazards() {
    this.arenaHazards = [];
    const arenaW = this.getArenaWidth();
    const mapId = this.matchConfig?.map?.id || 'cairo_bridge';

    if (mapId === 'cairo_bridge' || mapId === 'cairo_street') {
      // 1. Destructible Water Tank (Kakyoin Memorial)
      this.arenaHazards.push({
        id: 'hazard_water_tank',
        type: 'cairo_water_tank',
        x: arenaW - 175,
        y: GROUND_Y - 145,
        width: 95,
        height: 145,
        hp: 90,
        maxHp: 90,
        isBroken: false,
        breakTimer: 0,
        waterGushTimer: 0,
        crackLevel: 0,
        hazardName: 'Destructible Water Tank (Kakyoin Memorial)',
      });

      // 2. Periodic Cairo Street Traffic
      this.arenaHazards.push({
        id: 'hazard_street_car',
        type: 'cairo_street_car',
        x: -280,
        y: GROUND_Y - 58,
        width: 140,
        height: 56,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        cooldownTimer: 720,
        activeTimer: 0,
        vx: 0,
        direction: 1,
        hazardName: 'Passing Street Taxi',
      });
    } else if (mapId === 'arabian_desert') {
      // 1. Shifting Quicksand Sinkhole
      this.arenaHazards.push({
        id: 'hazard_quicksand',
        type: 'quicksand_sinkhole',
        x: arenaW / 2 - 140,
        y: GROUND_Y - 8,
        width: 280,
        height: 20,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        activeTimer: 0,
        cooldownTimer: 480, // Falling solar debris timer
        hazardName: 'Shifting Quicksand Sinkhole',
      });
    } else if (mapId === 'morioh_sunset') {
      // 1. Sparking Electrical Pole
      this.arenaHazards.push({
        id: 'hazard_power_pole',
        type: 'morioh_power_pole',
        x: 125,
        y: GROUND_Y - 240,
        width: 48,
        height: 240,
        hp: 120,
        maxHp: 120,
        isBroken: false,
        shockTimer: 0,
        crackLevel: 0,
        hazardName: 'Sparking Electrical Pole',
      });

      // 2. Angelo Rock Landmark
      this.arenaHazards.push({
        id: 'hazard_angelo_rock',
        type: 'morioh_angelo_rock',
        x: arenaW - 180,
        y: GROUND_Y - 140,
        width: 90,
        height: 140,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        activeTimer: 0,
        hazardName: 'Angelo Rock Landmark',
      });
    } else if (mapId === 'venice_canal' || mapId === 'air_supplena' || mapId === 'naples_station') {
      // 1. Swinging Heavy Cargo Crane
      this.arenaHazards.push({
        id: 'hazard_cargo_crane',
        type: 'vancouver_cargo_crane',
        x: arenaW / 2,
        y: 0,
        width: 85,
        height: 65,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        swingAngle: 0,
        swingSpeed: 0.024,
        hazardName: 'Swinging Cargo Crane',
      });

      // 2. Volatile Oil Barrels
      this.arenaHazards.push({
        id: 'hazard_oil_barrel_1',
        type: 'vancouver_oil_barrel',
        x: 230,
        y: GROUND_Y - 62,
        width: 46,
        height: 62,
        hp: 45,
        maxHp: 45,
        isBroken: false,
        firePoolTimer: 0,
        hazardName: 'Volatile Oil Drum',
      });
      this.arenaHazards.push({
        id: 'hazard_oil_barrel_2',
        type: 'vancouver_oil_barrel',
        x: arenaW - 260,
        y: GROUND_Y - 62,
        width: 46,
        height: 62,
        hp: 45,
        maxHp: 45,
        isBroken: false,
        firePoolTimer: 0,
        hazardName: 'Volatile Oil Drum',
      });
    } else if (mapId === 'rome_colosseum' || mapId === 'san_giorgio') {
      // Collapsible Stone Pillars
      this.arenaHazards.push({
        id: 'hazard_pillar_1',
        type: 'colosseum_marble_pillar',
        x: 170,
        y: GROUND_Y - 240,
        width: 58,
        height: 240,
        hp: 100,
        maxHp: 100,
        isBroken: false,
        breakTimer: 0,
        crackLevel: 0,
        hazardName: 'Ancient Marble Pillar (West)',
      });
      this.arenaHazards.push({
        id: 'hazard_pillar_2',
        type: 'colosseum_marble_pillar',
        x: arenaW - 235,
        y: GROUND_Y - 240,
        width: 58,
        height: 240,
        hp: 100,
        maxHp: 100,
        isBroken: false,
        breakTimer: 0,
        crackLevel: 0,
        hazardName: 'Ancient Marble Pillar (East)',
      });
    } else {
      // Default / other maps (joestar_mansion, green_dolphin, dojo_training, etc.)
      this.arenaHazards.push({
        id: 'hazard_default_pillar',
        type: 'colosseum_marble_pillar',
        x: 160,
        y: GROUND_Y - 240,
        width: 58,
        height: 240,
        hp: 100,
        maxHp: 100,
        isBroken: false,
        breakTimer: 0,
        hazardName: 'Collapsible Archway',
      });
      this.arenaHazards.push({
        id: 'hazard_default_barrel',
        type: 'vancouver_oil_barrel',
        x: arenaW - 220,
        y: GROUND_Y - 62,
        width: 46,
        height: 62,
        hp: 45,
        maxHp: 45,
        isBroken: false,
        firePoolTimer: 0,
        hazardName: 'Volatile Oil Drum',
      });
    }

    // Universal Interactive Stage Props: Pressurized Fire Hydrant & Wall Power Box
    this.arenaHazards.push({
      id: 'hazard_street_hydrant',
      type: 'street_hydrant',
      x: 270,
      y: GROUND_Y - 45,
      width: 36,
      height: 45,
      hp: 50,
      maxHp: 50,
      isBroken: false,
      waterGushTimer: 0,
      hazardName: 'Pressurized Fire Hydrant',
    });

    this.arenaHazards.push({
      id: 'hazard_power_box',
      type: 'power_box',
      x: 42,
      y: GROUND_Y - 95,
      width: 32,
      height: 48,
      hp: 80,
      maxHp: 80,
      isBroken: false,
      shockTimer: 0,
      hazardName: 'High-Voltage Transformer Box',
    });

    this.arenaHazards.push({
      id: 'hazard_street_sign',
      type: 'street_sign',
      x: 680,
      y: GROUND_Y - 110,
      width: 28,
      height: 110,
      hp: 45,
      maxHp: 45,
      isBroken: false,
      swingAngle: 0,
      swingSpeed: 0,
      hazardName: 'Metal Street Sign & Lamp Post',
    });
  }

  public spawnSubArenaHazards(mapId: string, startX: number = 1080) {
    if (mapId === 'cairo_bridge' || mapId === 'cairo_street') {
      // 1. High-Pressure Rooftop Storage Tank
      this.arenaHazards.push({
        id: 'hazard_cairo_rooftop_tank',
        type: 'cairo_rooftop_tank',
        x: startX + 260,
        y: GROUND_Y - 110,
        width: 85,
        height: 110,
        hp: 60,
        maxHp: 60,
        isBroken: false,
        waterGushTimer: 0,
        hazardName: 'Rooftop Water Storage Tank',
      });

      // 2. Tower Bronze Bell Pulley
      this.arenaHazards.push({
        id: 'hazard_clocktower_bell',
        type: 'clocktower_bell_pulley',
        x: startX + 560,
        y: GROUND_Y - 150,
        width: 65,
        height: 150,
        hp: 50,
        maxHp: 50,
        isBroken: false,
        swingAngle: 0,
        hazardName: 'Tower Bronze Bell Pulley',
      });

      // 3. Industrial Exhaust Updraft Turbine
      this.arenaHazards.push({
        id: 'hazard_hvac_turbine',
        type: 'hvac_exhaust_turbine',
        x: startX + 820,
        y: GROUND_Y - 45,
        width: 60,
        height: 45,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        activeTimer: 0,
        hazardName: 'Industrial Exhaust Updraft Turbine',
      });
    } else if (mapId === 'morioh_sunset') {
      // 1. Reimi's Cursed Ghost Mailbox
      this.arenaHazards.push({
        id: 'hazard_reimi_mailbox',
        type: 'reimi_ghost_mailbox',
        x: startX + 240,
        y: GROUND_Y - 70,
        width: 36,
        height: 70,
        hp: 50,
        maxHp: 50,
        isBroken: false,
        activeTimer: 0,
        hazardName: "Reimi's Cursed Ghost Mailbox",
      });

      // 2. Metal Trash Cans & Lids
      this.arenaHazards.push({
        id: 'hazard_ghost_trashcans',
        type: 'ghost_alley_trashcans',
        x: startX + 540,
        y: GROUND_Y - 55,
        width: 50,
        height: 55,
        hp: 35,
        maxHp: 35,
        isBroken: false,
        hazardName: 'Metal Trash Cans & Lids',
      });

      // 3. Cursed Spirit Fog Mire
      this.arenaHazards.push({
        id: 'hazard_spirit_fog',
        type: 'spooky_fog_pit',
        x: startX + 800,
        y: GROUND_Y - 18,
        width: 220,
        height: 25,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        activeTimer: 0,
        hazardName: 'Cursed Spirit Fog Mire',
      });
    } else if (mapId === 'rome_colosseum') {
      // 1. Ancient Roman Stone Sarcophagus
      this.arenaHazards.push({
        id: 'hazard_catacomb_sarcophagus',
        type: 'ancient_stone_sarcophagus',
        x: startX + 260,
        y: GROUND_Y - 65,
        width: 95,
        height: 65,
        hp: 70,
        maxHp: 70,
        isBroken: false,
        hazardName: 'Ancient Roman Stone Sarcophagus',
      });

      // 2. Subterranean Torch Fire Brazier
      this.arenaHazards.push({
        id: 'hazard_catacomb_brazier',
        type: 'catacomb_torch_brazier',
        x: startX + 560,
        y: GROUND_Y - 95,
        width: 40,
        height: 95,
        hp: 45,
        maxHp: 45,
        isBroken: false,
        firePoolTimer: 0,
        hazardName: 'Subterranean Torch Fire Brazier',
      });

      // 3. Collapsible Roman Marble Arch
      this.arenaHazards.push({
        id: 'hazard_catacomb_arch',
        type: 'roman_marble_arch',
        x: startX + 840,
        y: GROUND_Y - 140,
        width: 80,
        height: 140,
        hp: 60,
        maxHp: 60,
        isBroken: false,
        hazardName: 'Collapsible Roman Marble Arch',
      });
    } else if (mapId === 'cape_canaveral') {
      // 1. Cryogenic Liquid Oxygen Conduit
      this.arenaHazards.push({
        id: 'hazard_cryo_conduit',
        type: 'cryo_fuel_conduit',
        x: startX + 260,
        y: GROUND_Y - 85,
        width: 48,
        height: 85,
        hp: 50,
        maxHp: 50,
        isBroken: false,
        activeTimer: 0,
        hazardName: 'Cryogenic Liquid Oxygen Conduit',
      });

      // 2. Zero-G Antigravity Beam
      this.arenaHazards.push({
        id: 'hazard_zero_g_beam',
        type: 'zero_g_lift_beam',
        x: startX + 580,
        y: GROUND_Y - 180,
        width: 80,
        height: 180,
        hp: 99999,
        maxHp: 99999,
        isBroken: false,
        activeTimer: 0,
        hazardName: 'Zero-G Antigravity Beam',
      });

      // 3. Rocket Ignition High-Voltage Relay
      this.arenaHazards.push({
        id: 'hazard_high_voltage_relay',
        type: 'high_voltage_relay_spire',
        x: startX + 860,
        y: GROUND_Y - 120,
        width: 50,
        height: 120,
        hp: 65,
        maxHp: 65,
        isBroken: false,
        shockTimer: 0,
        hazardName: 'Rocket Ignition High-Voltage Relay',
      });
    } else {
      // Joestar Mansion Burning Grounds / Default
      this.arenaHazards.push({
        id: 'hazard_burning_fountain',
        type: 'burning_stone_fountain',
        x: startX + 260,
        y: GROUND_Y - 70,
        width: 85,
        height: 70,
        hp: 60,
        maxHp: 60,
        isBroken: false,
        hazardName: 'Boiling Scorched Stone Fountain',
      });

      this.arenaHazards.push({
        id: 'hazard_rose_trellis',
        type: 'blazing_rose_trellis',
        x: startX + 560,
        y: GROUND_Y - 95,
        width: 60,
        height: 95,
        hp: 45,
        maxHp: 45,
        isBroken: false,
        hazardName: 'Blazing Rose Trellis Arbor',
      });

      this.arenaHazards.push({
        id: 'hazard_iron_gate',
        type: 'heavy_iron_gate',
        x: startX + 850,
        y: GROUND_Y - 110,
        width: 55,
        height: 110,
        hp: 80,
        maxHp: 80,
        isBroken: false,
        hazardName: 'Spiked Wrought-Iron Estate Gate',
      });
    }
  }

  public updateArenaHazards(dt: number) {
    if (this.arenaHazards.length === 0) return;
    const arenaW = this.getArenaWidth();
    const activeFighters = this.getAllActiveFighters();

    for (const h of this.arenaHazards) {
      // 1. CAIRO WATER TANK (Kakyoin Memorial)
      if (h.type === 'cairo_water_tank') {
        if (h.waterGushTimer && h.waterGushTimer > 0) {
          h.waterGushTimer -= dt;
          // Spray high-pressure hydro particles
          for (let sp = 0; sp < 2; sp++) {
            this.addSpark(
              h.x + 30 + Math.random() * 35,
              h.y + 20 + Math.random() * 60,
              sp % 2 === 0 ? '#38bdf8' : '#bae6fd'
            );
          }
          // Push nearby fighters with hydro jet force
          for (const f of activeFighters) {
            if (this.isClashParticipant(f)) continue; // Clashing fighters are 100% immune from hazard physics!
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 230 && f.hp > 0) {
              const pushDir = f.x > h.x ? 1 : -1;
              f.vx += pushDir * 3.2 * dt;
            }
          }
        }

        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0 || this.isClashParticipant(f)) continue; // Clashing fighters immune to hazard impact
            const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 7.5;
            if (isFlinging) {
              const overlap = (
                f.x + f.width > h.x &&
                f.x < h.x + h.width &&
                f.y + f.height > h.y &&
                f.y < h.y + h.height
              );
              if (overlap) {
                h.hp -= 40;
                h.crackLevel = h.hp < 45 ? 2 : 1;
                soundManager.playHeavyImpact();
                this.screenShake = Math.max(this.screenShake, 14);
                this.addShockwave(h.x + h.width / 2, f.y + f.height / 2, '#38bdf8');
                f.vx = -(f.vx || 8) * 0.4;

                if (h.hp <= 0) {
                  h.isBroken = true;
                  h.waterGushTimer = 240; // 4s hydro gush
                  soundManager.playOverdriveExplosion();
                  this.screenShake = 24;
                  this.addTextParticle(h.x + h.width / 2, h.y - 45, '🌊 KAKYOIN WATER TANK BURST!! (-40 DMG)', '#38bdf8');
                  this.addMenacingParticle(h.x + h.width / 2, h.y - 20, 'ドバァァン!!', '#38bdf8');
                  this.applyRawDamage(f, 40, f.x > h.x ? 12 : -12, -7);
                }
              }
            }
          }
        }
      }

      // 2. CAIRO STREET CAR (Periodic Traffic)
      else if (h.type === 'cairo_street_car') {
        if (h.activeTimer && h.activeTimer > 0) {
          h.activeTimer -= dt;
          const dir = h.direction || 1;
          h.x += dir * 16.5 * dt;

          // Tire smoke particles
          if (this.frameCount % 4 === 0) {
            this.addSpark(dir > 0 ? h.x : h.x + h.width, GROUND_Y - 6, '#94a3b8');
          }

          // Check overlap with fighters
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const overlap = (
              f.x + f.width > h.x &&
              f.x < h.x + h.width &&
              f.y + f.height >= GROUND_Y - 55
            );
            if (overlap && (!f.invulnerableTimer || f.invulnerableTimer <= 0)) {
              f.invulnerableTimer = 35;
              this.triggerRagdollFling(f, dir * 22, -10, h.x);
              this.applyRawDamage(f, 45, 0, 0);
              soundManager.playHeavyImpact();
              this.screenShake = Math.max(this.screenShake, 18);
              this.addTextParticle(f.x + f.width / 2, f.y - 45, '🚗 TRAFFIC IMPACT! HONK! (-45 HP)', '#facc15');
              this.addMenacingParticle(f.x + f.width / 2, f.y - 20, 'プップー!!', '#ef4444');
            }
          }

          if (h.x > arenaW + 320 || h.x < -360) {
            h.activeTimer = 0;
            h.cooldownTimer = 850 + Math.random() * 350;
          }
        } else {
          h.cooldownTimer = (h.cooldownTimer || 720) - dt;
          if (h.cooldownTimer <= 0) {
            h.direction = Math.random() < 0.5 ? 1 : -1;
            h.x = h.direction === 1 ? -240 : arenaW + 240;
            h.activeTimer = 190;
            this.addTextParticle(arenaW / 2, 95, '⚠️ INCOMING CAIRO STREET TRAFFIC!', '#facc15');
          }
        }
      }

      // 3. SHIFTING QUICKSAND SINKHOLE
      else if (h.type === 'quicksand_sinkhole') {
        h.activeTimer = (h.activeTimer || 0) + dt;

        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          const onSand = (
            f.x + f.width > h.x &&
            f.x < h.x + h.width &&
            f.y + f.height >= GROUND_Y - 14
          );
          if (onSand) {
            f.vx *= 0.64; // High friction sand drag
            f.y = Math.min(GROUND_Y - f.height + 14, f.y + 0.55 * dt); // Sinking feet
            if (Math.abs(f.vx) > 0.4 && this.frameCount % 5 === 0) {
              this.addSpark(f.x + f.width / 2, GROUND_Y - 4, '#d97706');
            }
          }
        }

        // Falling Mirage Solar Debris
        h.cooldownTimer = (h.cooldownTimer || 480) - dt;
        if (h.cooldownTimer <= 0) {
          h.cooldownTimer = 480 + Math.random() * 260;
          const dropX = arenaW * 0.15 + Math.random() * arenaW * 0.7;
          this.projectiles.push({
            id: this.projectileId++,
            ownerId: 'hazard_the_sun',
            type: 'calamity_meteor',
            subType: 'meteor',
            x: dropX,
            y: -60,
            vx: (Math.random() - 0.5) * 3,
            vy: 14,
            baseVx: 0,
            baseVy: 14,
            width: 46,
            height: 46,
            damage: 55,
            knockbackX: 12,
            knockbackY: -9,
            isFrozenInTime: false,
            life: 90,
            maxLife: 90,
            color: '#f97316',
          });
          this.addTextParticle(dropX, 100, '☀️ SOLAR DEBRIS FALLING!', '#f97316');
        }
      }

      // 4. MORIOH SPARKING ELECTRICAL POLE
      else if (h.type === 'morioh_power_pole') {
        if (h.shockTimer && h.shockTimer > 0) {
          h.shockTimer -= dt;
          if (this.frameCount % 3 === 0) {
            this.addSpark(
              h.x + Math.random() * h.width,
              h.y + Math.random() * h.height,
              '#38bdf8'
            );
          }
        }

        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 6.5;
          if (isFlinging) {
            const overlap = (
              f.x + f.width > h.x &&
              f.x < h.x + h.width &&
              f.y + f.height > h.y &&
              f.y < h.y + h.height
            );
            if (overlap && (!h.shockTimer || h.shockTimer <= 0)) {
              h.shockTimer = 55;
              f.hitReactionType = 'electric_shock';
              f.hitStun = 42;
              f.vx = f.x < h.x ? -7 : 7;
              f.vy = -6;
              this.applyRawDamage(f, 32, 0, 0);
              soundManager.playHamonBuzz();
              this.screenShake = Math.max(this.screenShake, 18);
              this.addShockwave(h.x + h.width / 2, f.y + f.height / 2, '#38bdf8');
              this.addTextParticle(f.x + f.width / 2, f.y - 45, '⚡ MORIOH POWER POLE HIGH VOLTAGE! (-32 HP)', '#38bdf8');
            }
          }
        }
      }

      // 5. MORIOH ANGELO ROCK LANDMARK
      else if (h.type === 'morioh_angelo_rock') {
        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 6.0;
          if (isFlinging) {
            const overlap = (
              f.x + f.width > h.x &&
              f.x < h.x + h.width &&
              f.y + f.height > h.y &&
              f.y < h.y + h.height
            );
            if (overlap && (!f.wallSplatTimer || f.wallSplatTimer <= 0)) {
              f.wallSplatTimer = 50;
              f.vx = -f.vx * 1.32; // Richochet rebound
              f.vy = -7.5;
              f.isGrounded = false;
              this.applyRawDamage(f, 38, 0, 0);
              soundManager.playHeavyImpact();
              this.screenShake = Math.max(this.screenShake, 22);
              this.addShockwave(h.x + 20, f.y + f.height / 2, '#94a3b8');
              this.addTextParticle(h.x, f.y - 50, '🗿 YO, ANGELO! CRUSHING RICOCHET (-38 HP)', '#cbd5e1');
              this.addMenacingParticle(h.x + 20, f.y - 20, 'ゴゴゴ (ANGELO)', '#94a3b8');
            }
          }
        }
      }

      // 6. SWINGING CARGO CRANE
      else if (h.type === 'vancouver_cargo_crane') {
        h.swingAngle = (h.swingAngle || 0) + (h.swingSpeed || 0.024) * dt;
        const craneX = h.x + Math.sin(h.swingAngle) * 220;
        const craneY = 150 + Math.cos(h.swingAngle) * 35;
        const crateW = h.width;
        const crateH = h.height;

        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          const overlap = (
            f.x + f.width > craneX - crateW / 2 &&
            f.x < craneX + crateW / 2 &&
            f.y + f.height > craneY &&
            f.y < craneY + crateH
          );
          if (overlap && (!f.invulnerableTimer || f.invulnerableTimer <= 0)) {
            f.invulnerableTimer = 40;
            const swingDir = Math.cos(h.swingAngle) >= 0 ? (Math.sin(h.swingAngle) >= 0 ? 1 : -1) : -1;
            this.triggerRagdollFling(f, swingDir * 24, -10, craneX);
            this.applyRawDamage(f, 46, 0, 0);
            soundManager.playHeavyImpact();
            this.screenShake = Math.max(this.screenShake, 19);
            this.addTextParticle(f.x + f.width / 2, f.y - 45, '🏗️ HEAVY CARGO SMACK! (-46 HP)', '#f59e0b');
          }
        }
      }

      // 7. VOLATILE OIL BARRELS
      else if (h.type === 'vancouver_oil_barrel') {
        if (h.firePoolTimer && h.firePoolTimer > 0) {
          h.firePoolTimer -= dt;
          if (this.frameCount % 2 === 0) {
            this.addSpark(
              h.x + Math.random() * h.width,
              GROUND_Y - 4 - Math.random() * 25,
              '#f97316'
            );
          }
          // Burn fighters walking in fire
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            if (f.x + f.width > h.x - 25 && f.x < h.x + h.width + 25 && f.y + f.height >= GROUND_Y - 14) {
              f.burnedTimer = Math.max(f.burnedTimer || 0, 180);
              if (this.frameCount % 15 === 0) {
                this.applyRawDamage(f, 6, 0, 0);
              }
            }
          }
        }

        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 5.5;
            if (isFlinging) {
              const overlap = (
                f.x + f.width > h.x &&
                f.x < h.x + h.width &&
                f.y + f.height > h.y &&
                f.y < h.y + h.height
              );
              if (overlap) {
                h.hp = 0;
              }
            }
          }

          if (h.hp <= 0) {
            h.isBroken = true;
            h.firePoolTimer = 300; // 5s fire pool
            soundManager.playOverdriveExplosion();
            this.screenShake = 25;
            this.addShockwave(h.x + h.width / 2, h.y + h.height / 2, '#ef4444');
            this.addShockwave(h.x + h.width / 2, h.y + h.height / 2, '#f97316');
            this.addTextParticle(h.x + h.width / 2, h.y - 45, '🛢️ OIL DRUM DETONATION! (-65 HP)', '#ef4444');
            this.addMenacingParticle(h.x + h.width / 2, h.y - 20, 'ドグワァァン!!', '#ef4444');

            for (const af of activeFighters) {
              const dist = Math.abs((af.x + af.width / 2) - (h.x + h.width / 2));
              if (dist < 185 && af.hp > 0) {
                this.triggerRagdollFling(af, af.x > h.x ? 18 : -18, -11, h.x);
                this.applyRawDamage(af, 65, 0, 0);
                af.burnedTimer = 240;
              }
            }
          }
        }
      }

      // 8. COLLAPSIBLE STONE PILLARS
      else if (h.type === 'colosseum_marble_pillar') {
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 6.0;
            if (isFlinging) {
              const overlap = (
                f.x + f.width > h.x &&
                f.x < h.x + h.width &&
                f.y + f.height > h.y &&
                f.y < h.y + h.height
              );
              if (overlap) {
                h.hp -= 45;
                h.crackLevel = h.hp < 50 ? 2 : 1;
                soundManager.playHeavyImpact();
                this.screenShake = Math.max(this.screenShake, 16);
                this.addShockwave(h.x + h.width / 2, f.y + f.height / 2, '#94a3b8');

                if (h.hp <= 0) {
                  h.isBroken = true;
                  h.breakTimer = 300;
                  soundManager.playHeavyImpact();
                  this.screenShake = 24;
                  this.addShockwave(h.x + h.width / 2, GROUND_Y - 40, '#cbd5e1');
                  this.addShockwave(h.x + h.width / 2, GROUND_Y - 40, '#f59e0b');
                  this.addTextParticle(h.x + h.width / 2, h.y - 45, '🏛️ MARBLE PILLAR CRUMBLED!! (-55 HP)', '#e2e8f0');
                  this.addMenacingParticle(h.x + h.width / 2, h.y - 20, 'ガシャアアン!!', '#94a3b8');
                  this.applyRawDamage(f, 55, f.x > h.x ? 16 : -16, -9);
                }
              }
            }
          }
        }
      }
      // 5. PRESSURIZED STREET HYDRANT
      if (h.type === 'street_hydrant') {
        if (h.waterGushTimer && h.waterGushTimer > 0) {
          h.waterGushTimer -= dt;
          for (let sp = 0; sp < 2; sp++) {
            this.particles.push({
              id: this.particleId++,
              x: h.x + h.width / 2 + (Math.random() * 20 - 10),
              y: h.y - Math.random() * 90,
              vx: (Math.random() - 0.5) * 2.5,
              vy: -(Math.random() * 8 + 5),
              size: Math.random() * 5 + 3,
              color: Math.random() > 0.5 ? '#38bdf8' : '#e0f2fe',
              life: 25,
              maxLife: 25,
              type: 'water_splash',
            });
          }
          // Launch nearby fighters upward in water stream
          for (const f of activeFighters) {
            if (this.isClashParticipant(f) || f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 48 && f.y >= GROUND_Y - 220) {
              f.vy = Math.min(f.vy, -13.0);
              f.isGrounded = false;
              if (this.frameCount % 24 === 0) {
                this.addTextParticle(f.x + f.width / 2, f.y - 35, '🌊 GEYSER LAUNCH!', '#38bdf8');
                soundManager.playWhoosh();
              }
            }
          }
        }

        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            const isAttackingNearby = dist < 65 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || f.action === 'barrage');
            const isHighSpeedBody = dist < 50 && Math.abs(f.vx) > 5;
            if (isAttackingNearby || isHighSpeedBody) {
              h.hp -= 25;
              this.addSpark(h.x + h.width / 2, h.y, '#94a3b8');
              soundManager.playHit(false);
              if (h.hp <= 0) {
                h.isBroken = true;
                h.waterGushTimer = 360;
                this.screenShake = 6;
                this.spawnDebris(h.x + h.width / 2, h.y, 8, 'both');
                soundManager.playHeavyImpact();
                this.addTextParticle(h.x + h.width / 2, h.y - 45, '🌊 HYDRANT BURST!', '#38bdf8');
              }
              break;
            }
          }
        }
      }

      // 6. HIGH-VOLTAGE POWER BOX
      if (h.type === 'power_box') {
        if (h.shockTimer && h.shockTimer > 0) {
          h.shockTimer -= dt;
          if (this.frameCount % 4 === 0) {
            this.addSpark(h.x + h.width / 2, h.y + h.height / 2, '#facc15');
          }
        }

        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
          if (dist < 45 && (f.action === 'knockback' || f.action === 'hit' || Math.abs(f.vx) > 5)) {
            if (!h.shockTimer || h.shockTimer <= 0) {
              h.shockTimer = 35;
              f.hp = Math.max(0, f.hp - 16);
              f.hitStun = Math.max(f.hitStun, 28);
              f.vx = f.x < h.x ? -6 : 6;
              this.screenShake = 8;
              this.addShockwave(h.x + h.width / 2, h.y + h.height / 2, '#facc15');
              this.addTextParticle(f.x + f.width / 2, f.y - 35, '⚡ 20,000V ELECTRICAL SHOCK! (-16 HP)', '#facc15');
              soundManager.playRazorCut();
            }
          }
        }
      }

      // 7. STREET SIGN & LAMP POST
      if (h.type === 'street_sign') {
        if (h.swingAngle && Math.abs(h.swingAngle) > 0.01) {
          h.swingAngle *= 0.92;
        } else {
          h.swingAngle = 0;
        }

        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            const isAttackingNearby = dist < 70 && (
              f.action.startsWith('punch') || 
              f.action.startsWith('combo_') || 
              f.action === 'barrage' || 
              f.action.includes('slash') ||
              f.action.includes('strike')
            );
            const isHighSpeedBody = dist < 55 && (f.action === 'knockback' || f.action === 'ragdoll' || Math.abs(f.vx) > 5.5);
            
            if (isAttackingNearby || isHighSpeedBody) {
              const hitDamage = isHighSpeedBody ? 35 : 20;
              h.hp -= hitDamage;
              h.swingAngle = f.facing === 'left' ? -0.35 : 0.35;
              this.addSpark(h.x + h.width / 2, h.y + 35, '#facc15');
              soundManager.playHeavyImpact();
              this.screenShake = Math.max(this.screenShake, 7);

              if (h.hp <= 0) {
                h.isBroken = true;
                soundManager.playOverdriveExplosion();
                this.screenShake = 16;
                this.spawnDebris(h.x + h.width / 2, h.y + 30, 14, 'both');
                this.addTextParticle(h.x + h.width / 2, h.y - 45, '🚏 STREET SIGN SNAPPED & LAUNCHED!', '#facc15');
                this.addMenacingParticle(h.x + h.width / 2, h.y - 15, 'バキィィッ!!', '#facc15');

                // Launch sign plate as a spinning projectile
                const launchDir = f.facing === 'left' ? -1 : 1;
                this.projectiles.push({
                  id: this.projectileId++,
                  ownerId: f.id,
                  type: 'calamity_meteor',
                  subType: 'debris',
                  x: h.x,
                  y: h.y + 20,
                  vx: launchDir * 14.5,
                  vy: -5.0,
                  baseVx: launchDir * 14.5,
                  baseVy: -5.0,
                  width: 38,
                  height: 38,
                  damage: 42,
                  knockbackX: launchDir * 11,
                  knockbackY: -7,
                  isFrozenInTime: false,
                  life: 120,
                  maxLife: 120,
                  color: '#e2e8f0',
                });
              }
              break;
            }
          }
        }
      }

      // 8. CAIRO ROOFTOP WATER TANK
      if (h.type === 'cairo_rooftop_tank') {
        if (h.waterGushTimer && h.waterGushTimer > 0) {
          h.waterGushTimer -= dt;
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 65 && f.y >= GROUND_Y - 220) {
              f.vy = Math.min(f.vy, -13.5);
              f.isGrounded = false;
              if (this.frameCount % 20 === 0) {
                this.addTextParticle(f.x + f.width / 2, f.y - 35, '🌊 ROOFTOP GEYSER LAUNCH!', '#38bdf8');
                soundManager.playWhoosh();
              }
            }
          }
        }
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            const isAttacking = dist < 75 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || f.action === 'barrage');
            const isFlinging = dist < 65 && Math.abs(f.vx) > 5;
            if (isAttacking || isFlinging) {
              h.hp -= isFlinging ? 35 : 20;
              this.addSpark(h.x + h.width / 2, h.y + 40, '#38bdf8');
              soundManager.playHeavyImpact();
              if (h.hp <= 0) {
                h.isBroken = true;
                h.waterGushTimer = 360;
                this.screenShake = 16;
                this.spawnDebris(h.x + h.width / 2, h.y + 40, 15, 'both');
                this.addTextParticle(h.x + h.width / 2, h.y - 45, '🌊 ROOFTOP TANK RUPTURED!', '#38bdf8');
              }
              break;
            }
          }
        }
      }

      // 9. CLOCKTOWER BELL PULLEY
      if (h.type === 'clocktower_bell_pulley') {
        if (h.swingAngle && Math.abs(h.swingAngle) > 0.01) {
          h.swingAngle *= 0.94;
        } else {
          h.swingAngle = 0;
        }
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 60 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || Math.abs(f.vx) > 5)) {
              h.hp -= 25;
              h.swingAngle = f.facing === 'left' ? -0.45 : 0.45;
              soundManager.playHeavyImpact();
              this.screenShake = 8;
              this.addSpark(h.x + h.width / 2, h.y + 50, '#fbbf24');
              if (h.hp <= 0) {
                h.isBroken = true;
                soundManager.playHeavyImpact();
                this.screenShake = 20;
                this.addShockwave(h.x + h.width / 2, GROUND_Y - 20, '#facc15');
                this.addTextParticle(h.x + h.width / 2, h.y - 45, '🔔 GIANT BRONZE BELL CRASH! (-48 HP)', '#facc15');
                for (const af of activeFighters) {
                  if (Math.abs((af.x + af.width / 2) - (h.x + h.width / 2)) < 80 && af.hp > 0) {
                    this.applyRawDamage(af, 48, af.x > h.x ? 12 : -12, -7);
                    af.hitStun = 35;
                  }
                }
              }
              break;
            }
          }
        }
      }

      // 10. HVAC EXHAUST TURBINE
      if (h.type === 'hvac_exhaust_turbine') {
        for (const f of activeFighters) {
          if (f.hp <= 0 || this.isClashParticipant(f)) continue;
          const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
          if (dist < 45 && f.y >= GROUND_Y - 180) {
            f.vy = -15.5;
            f.isGrounded = false;
            if (this.frameCount % 24 === 0) {
              this.addTextParticle(f.x + f.width / 2, f.y - 35, '💨 STEAM TURBINE SUPER-JUMP!', '#f8fafc');
              soundManager.playWhoosh();
            }
          }
        }
      }

      // 11. REIMI'S CURSED GHOST MAILBOX
      if (h.type === 'reimi_ghost_mailbox') {
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 55 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || Math.abs(f.vx) > 5)) {
              h.hp -= 25;
              this.addSpark(h.x + h.width / 2, h.y + 20, '#c084fc');
              if (h.hp <= 0) {
                h.isBroken = true;
                const opp = f.id === 'player' ? this.ai : this.player;
                opp.hitStun = Math.max(opp.hitStun, 42);
                opp.vx = 0;
                soundManager.playHamonBuzz();
                this.screenShake = 14;
                this.addMenacingParticle(opp.x + opp.width / 2, opp.y - 20, 'ドロドロ (GHOST BIND)', '#c084fc');
                this.addTextParticle(opp.x + opp.width / 2, opp.y - 45, "👻 REIMI'S SPIRIT HANDS PARALYZE!", '#c084fc');
              }
              break;
            }
          }
        }
      }

      // 12. GHOST ALLEY TRASH CANS
      if (h.type === 'ghost_alley_trashcans') {
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 55 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || Math.abs(f.vx) > 5)) {
              h.isBroken = true;
              soundManager.playHeavyImpact();
              this.spawnDebris(h.x + h.width / 2, h.y + 25, 12, 'both');
              this.addTextParticle(h.x + h.width / 2, h.y - 40, '🗑️ TRASH CANS SCATTERED!', '#94a3b8');
              const launchDir = f.facing === 'left' ? -1 : 1;
              for (let l = 0; l < 2; l++) {
                this.projectiles.push({
                  id: this.projectileId++,
                  ownerId: f.id,
                  type: 'calamity_meteor',
                  subType: 'debris',
                  x: h.x + l * 15,
                  y: h.y + 10,
                  vx: launchDir * (12 + l * 3),
                  vy: -(4 + l * 2),
                  baseVx: launchDir * (12 + l * 3),
                  baseVy: -(4 + l * 2),
                  width: 32,
                  height: 32,
                  damage: 30,
                  knockbackX: launchDir * 9,
                  knockbackY: -6,
                  isFrozenInTime: false,
                  life: 100,
                  maxLife: 100,
                  color: '#94a3b8',
                });
              }
              break;
            }
          }
        }
      }

      // 13. SPOOKY FOG MIRE
      if (h.type === 'spooky_fog_pit') {
        for (const f of activeFighters) {
          if (f.hp <= 0) continue;
          if (f.x + f.width > h.x && f.x < h.x + h.width && f.y + f.height >= GROUND_Y - 15) {
            f.vx *= 0.65;
            if (this.frameCount % 25 === 0) {
              this.applyRawDamage(f, 4, 0, 0);
              this.addMenacingParticle(f.x + f.width / 2, GROUND_Y - 10, 'ドロ', '#a855f7');
            }
          }
        }
      }

      // 14. CATACOMB TORCH BRAZIER
      if (h.type === 'catacomb_torch_brazier') {
        if (h.firePoolTimer && h.firePoolTimer > 0) {
          h.firePoolTimer -= dt;
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            if (f.x + f.width > h.x - 20 && f.x < h.x + h.width + 20 && f.y + f.height >= GROUND_Y - 14) {
              f.burnedTimer = Math.max(f.burnedTimer || 0, 180);
              if (this.frameCount % 18 === 0) {
                this.applyRawDamage(f, 6, 0, 0);
              }
            }
          }
        }
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const dist = Math.abs((f.x + f.width / 2) - (h.x + h.width / 2));
            if (dist < 50 && (f.action.startsWith('punch') || f.action.startsWith('combo_') || Math.abs(f.vx) > 5)) {
              h.isBroken = true;
              h.firePoolTimer = 320;
              soundManager.playOverdriveExplosion();
              this.screenShake = 15;
              this.addShockwave(h.x + h.width / 2, GROUND_Y - 20, '#f97316');
              this.addTextParticle(h.x + h.width / 2, h.y - 45, '🔥 BRAZIER TOPPLED! BLAZING OIL FLOOR!', '#f97316');
              break;
            }
          }
        }
      }

      // 15. ANCIENT STONE SARCOPHAGUS
      if (h.type === 'ancient_stone_sarcophagus') {
        if (!h.isBroken) {
          for (const f of activeFighters) {
            if (f.hp <= 0) continue;
            const isFlinging = f.action === 'ragdoll' || f.isRagdoll || f.action === 'knockback' || Math.abs(f.vx) > 6;
            if (isFlinging) {
              const overlap = (f.x + f.width > h.x && f.x < h.x + h.width && f.y + f.height > h.y);
              if (overlap) {
                h.hp -= 35;
                soundManager.playHeavyImpact();
                this.screenShake = 16;
                this.addShockwave(h.x + h.width / 2, f.y + f.height / 2, '#94a3b8');
                f.vx = -f.vx * 0.5;
                if (h.hp <= 0) {
                  h.isBroken = true;
                  this.spawnDebris(h.x + h.width / 2, h.y + 20, 16, 'both');
                  this.addTextParticle(h.x + h.width / 2, h.y - 45, '🏛️ SARCOPHAGUS SHATTERED! (-45 HP)', '#cbd5e1');
                  this.applyRawDamage(f, 45, 0, 0);
                }
                break;
              }
            }
          }
        }
      }

      // 16. ZERO-G ANTIGRAVITY LIFT BEAM
      if (h.type === 'zero_g_lift_beam') {
        for (const f of activeFighters) {
          if (f.hp <= 0 || this.isClashParticipant(f)) continue;
          if (f.x + f.width > h.x && f.x < h.x + h.width) {
            f.vy = Math.max(-6.5, f.vy * 0.7 - 1.2);
            f.isGrounded = false;
            if (this.frameCount % 25 === 0) {
              this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
            }
          }
        }
      }
    }

    // PROJECTILE VS HAZARD COLLISION
    for (const p of this.projectiles) {
      if (p.life <= 0) continue;
      for (const h of this.arenaHazards) {
        if (h.isBroken) continue;
        if (
          h.type === 'cairo_water_tank' ||
          h.type === 'vancouver_oil_barrel' ||
          h.type === 'colosseum_marble_pillar'
        ) {
          const overlap = (
            p.x + p.width > h.x &&
            p.x < h.x + h.width &&
            p.y + p.height > h.y &&
            p.y < h.y + h.height
          );
          if (overlap) {
            h.hp -= p.damage;
            p.life = 0;
            this.addSpark(p.x, p.y, '#ffffff');

            if (h.type === 'vancouver_oil_barrel') {
              h.hp = 0; // Immediate detonation on projectile hit
            }
          }
        }
      }
    }
  }

  public nextSurvivalOpponent() {
    this.survivalStreak++;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 350);
    this.player.energy = this.player.maxEnergy;

    if (this.teammate && this.teammate.hp > 0) {
      this.teammate.hp = Math.min(this.teammate.maxHp, this.teammate.hp + 350);
      this.teammate.energy = this.teammate.maxEnergy;
    }

    const otherChars = CHARACTERS.filter(c => c.id !== this.ai.charId);
    const nextEnemy = otherChars[Math.floor(Math.random() * otherChars.length)] || CHARACTERS[0];
    
    this.ai = createFighter('ai', 800, 'left', nextEnemy, this.matchConfig);
    this.matchTime = 99;
    this.isGameOver = false;
    this.winner = null;

    this.addTextParticle(ARENA_WIDTH / 2, 140, `STAGE ${this.survivalStreak + 1}: ${nextEnemy.name}!`, '#fbbf24');
  }

  private currentDt: number = 1.0;

  public update(playerInput: InputState, dt: number = 1.0, overrideAiInput?: InputState) {
    if (this.isGameOver) return;

    // Clamp dt to avoid extreme physics simulation jumps on backgrounding tab
    this.currentDt = Math.max(0.5, Math.min(2.0, dt));
    this.frameCount++;

    // Global Match timer (only decrements when time is not stopped)
    const isInfiniteTimer = this.matchConfig.mode === 'training' || (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings?.matchTimer === 0);
    if (!this.timeStopState.isActive && !isInfiniteTimer && this.frameCount % 60 === 0 && this.matchTime > 0) {
      this.matchTime--;
      if (this.matchTime <= 0) {
        this.checkTimeoutWinner();
      }
    }

    if (this.screenShake > 0) {
      this.screenShake *= 0.93;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    if (this.wallBreakBannerTimer > 0) {
      this.wallBreakBannerTimer -= dt;
      if (this.wallBreakBannerTimer < 0) this.wallBreakBannerTimer = 0;
    }

    if (this.wallBreakState.isActive) {
      this.wallBreakState.timer -= dt;
      if (this.wallBreakState.timer <= 0) {
        this.wallBreakState.isActive = false;
      }
    }

    if (this.timeStopState.filterFlash > 0) {
      this.timeStopState.filterFlash *= 0.85;
    }

    // Training mode infinite SP / HP sustain
    if (this.matchConfig.mode === 'training') {
      this.player.energy = 100;
      if (this.ai.hp < 200) {
        this.ai.hp = this.ai.maxHp;
      }
    }

    let playerOpponent: Fighter = this.ai;
    if (this.player.isParallelWorld) {
      playerOpponent = this.player.parallelEnemyClone || this.ai;
    } else {
      // Dynamic Targeting: Always prioritize the closest alive opposing fighter in the same dimension
      const aliveOpponents = this.getAllActiveFighters().filter(
        (af) => af.hp > 0 && af.team !== this.player.team && !af.isParallelWorld
      );
      if (aliveOpponents.length > 0) {
        let closest = aliveOpponents[0];
        let minDist = Math.abs((aliveOpponents[0].x + aliveOpponents[0].width / 2) - (this.player.x + this.player.width / 2));
        for (const op of aliveOpponents) {
          const dist = Math.abs((op.x + op.width / 2) - (this.player.x + this.player.width / 2));
          if (dist < minDist) {
            minDist = dist;
            closest = op;
          }
        }
        playerOpponent = closest;
      }
    }

    // CPU vs CPU Mode: Player 1 is also controlled by AI!
    const effectivePlayerInput = this.matchConfig.mode === 'cpu_vs_cpu'
      ? this.getAIControllerForFighter(this.player.id).update(this.player, [playerOpponent], this.matchConfig, this.activeGravityAxis, this.getArenaWidth())
      : playerInput;

    // 0.5. STAND BARRAGE CLASH COLLISION DETECTION & UPDATE (Stand users only, not vampire minions)
    if (!this.barrageClash.isActive && !this.timeStopState.isActive && this.player.hp > 0 && this.ai.hp > 0 && this.ai.charId !== 'vampire') {
      if (this.isBarragingAction(this.player) && this.isBarragingAction(this.ai)) {
        const dist = Math.abs((this.player.x + this.player.width / 2) - (this.ai.x + this.ai.width / 2));
        if (dist <= 190) {
          this.initiateBarrageClash(this.player, this.ai);
        }
      }
    }

    if (this.barrageClash.isActive) {
      this.updateBarrageClash(effectivePlayerInput, this.currentDt, overrideAiInput);
    }

    // 0.8. MIND-READING "TSUGI NI OMAE WA... TO IU!" CINEMATIC CUTSCENE UPDATE
    if (this.nextLineCutscene && this.nextLineCutscene.isActive) {
      this.updateNextLineCutscene();
      this.updateProjectiles();
      this.updateAcidPools();
      this.updateArenaHazards(this.currentDt);
      this.updateParticles();
      return;
    }

    // 0.9. CINEMATIC DRAMATIC FINISHER & STAGE FATALITY UPDATE
    if (this.dramaticFinisher && this.dramaticFinisher.isActive) {
      this.updateDramaticFinisher(this.currentDt);
      this.updateProjectiles();
      this.updateAcidPools();
      this.updateArenaHazards(this.currentDt);
      this.updateParticles();
      return;
    }

    // 1. UPDATE TIME STOP ENGINE & PARALLEL TIMERS (Jotaro & Dio exclusive)
    this.updateTimeStopSystem(effectivePlayerInput);

    // 2. VAMPIRE HORDE SURVIVAL MODE LOGIC (Spawns 2 vampires up to max 4 active every 12 seconds)
    if (this.matchConfig.mode === 'survival' || this.matchConfig.mode === 'team_survival') {
      this.vampireWaveTimer -= this.currentDt * 60;
      if (this.vampireWaveTimer <= 0 || this.vampires.length === 0) {
        this.vampireWaveTimer = 720; // Reset 12s timer
        this.spawnVampireWave(2);
      }

      // Check dead vampires in horde & grant HP/Energy sustain on kill so all characters can survive!
      for (let i = this.vampires.length - 1; i >= 0; i--) {
        const v = this.vampires[i];
        if (v.hp <= 0) {
          this.survivalStreak++;
          soundManager.playRazorCut();
          soundManager.playHit(true);
          if (this.player && this.player.hp > 0) {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 38);
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 18);
          }
          if (this.teammate && this.teammate.hp > 0) {
            this.teammate.hp = Math.min(this.teammate.maxHp, this.teammate.hp + 38);
            this.teammate.energy = Math.min(this.teammate.maxEnergy, this.teammate.energy + 18);
          }
          this.addShockwave(v.x + v.width / 2, v.y + v.height / 2, '#ef4444');
          this.addTextParticle(v.x + v.width / 2, v.y - 35, `🩸 VAMPIRE SLAIN! [KILLS: ${this.survivalStreak}] (+38 HP / +18 SP)`, '#4ade80');
          for (let s = 0; s < 8; s++) {
            this.addSpark(v.x + v.width / 2 + (Math.random() * 40 - 20), v.y + (Math.random() * 40 - 20), '#dc2626');
          }
          this.vampires.splice(i, 1);
        }
      }

      // If all vampires were just killed, spawn the next wave immediately
      if (this.vampires.length === 0) {
        this.vampireWaveTimer = 720;
        this.spawnVampireWave(2);
      }

      if (this.vampires.length > 0) {
        this.ai = this.vampires[0];
      }
    }

    // 3. Target decision for AI (multi-target support in boss mode & closest target in standard)
    const isAiParallel = !!this.ai.isParallelWorld;
    const candidatesForAi: Fighter[] = [];
    if (this.player && this.player.hp > 0 && !!this.player.isParallelWorld === isAiParallel) {
      candidatesForAi.push(this.player);
    }
    if (this.teammate && this.teammate.hp > 0 && !!this.teammate.isParallelWorld === isAiParallel) {
      candidatesForAi.push(this.teammate);
    }
    if (this.player?.valentineClones) {
      for (const clone of this.player.valentineClones) {
        if (clone && clone.hp > 0 && !!clone.isParallelWorld === isAiParallel) {
          candidatesForAi.push(clone);
        }
      }
    }
    if (this.player?.parallelEnemyClone && this.player.parallelEnemyClone.hp > 0 && isAiParallel) {
      candidatesForAi.push(this.player.parallelEnemyClone);
    }

    const nonClashingForAi = candidatesForAi.filter(c => !this.isClashParticipant(c));
    const effectiveAiCandidates = nonClashingForAi.length > 0 ? nonClashingForAi : candidatesForAi;

    let targetForAi = effectiveAiCandidates[0] || this.ai;
    if (effectiveAiCandidates.length > 1) {
      let minDist = Infinity;
      for (const c of effectiveAiCandidates) {
        const d = Math.abs(c.x - this.ai.x);
        if (d < minDist) {
          minDist = d;
          targetForAi = c;
        }
      }
    }

    const aiInput = overrideAiInput || this.getAIControllerForFighter(this.ai.id).update(this.ai, effectiveAiCandidates.length > 0 ? effectiveAiCandidates : [this.ai], this.matchConfig, this.activeGravityAxis, this.getArenaWidth());

    // 4. Update Both Fighters & Vampire Horde (Checking if frozen)
    const isClashParticipant = (f: Fighter | null | undefined): boolean => this.isClashParticipant(f);

    const playerFrozen = this.isFighterFrozen(this.player);
    const aiFrozen = this.isFighterFrozen(this.ai);
    const teammateFrozen = this.teammate ? this.isFighterFrozen(this.teammate) : false;

    this.player.isFrozenByTimeStop = playerFrozen;
    this.ai.isFrozenByTimeStop = aiFrozen;
    if (this.teammate) {
      this.teammate.isFrozenByTimeStop = teammateFrozen;
    }

    const aiOpponent = this.ai.isParallelWorld ? (this.ai.parallelEnemyClone || this.player) : targetForAi;

    if (!playerFrozen && !isClashParticipant(this.player)) {
      this.updateFighter(this.player, effectivePlayerInput, playerOpponent);
    } else if (isClashParticipant(this.player)) {
      this.updateValentineClones(this.player, playerOpponent);
    }
    // In survival / team_survival, this.ai is this.vampires[0], which is updated inside the this.vampires loop below (prevents 2x speed double-update bug!)
    if (!aiFrozen && !isClashParticipant(this.ai) && this.matchConfig.mode !== 'survival' && this.matchConfig.mode !== 'team_survival') {
      this.updateFighter(this.ai, aiInput, aiOpponent);
    } else if (isClashParticipant(this.ai)) {
      this.updateValentineClones(this.ai, aiOpponent);
    }
    if (this.teammate && this.teammate.hp > 0 && !teammateFrozen && !isClashParticipant(this.teammate)) {
      const isTeammateParallel = !!this.teammate.isParallelWorld;
      const candidatesForTeammate: Fighter[] = [];
      if (this.ai && this.ai.hp > 0 && !!this.ai.isParallelWorld === isTeammateParallel) {
        candidatesForTeammate.push(this.ai);
      }
      if (this.vampires) {
        for (const v of this.vampires) {
          if (v.hp > 0 && !!v.isParallelWorld === isTeammateParallel) candidatesForTeammate.push(v);
        }
      }
      const nonClashingTm = candidatesForTeammate.filter(c => !isClashParticipant(c));
      const effectiveTmCandidates = nonClashingTm.length > 0 ? nonClashingTm : candidatesForTeammate;
      const tmTarget = effectiveTmCandidates[0] || this.ai;
      const teammateInput = this.getAIControllerForFighter(this.teammate.id).update(this.teammate, effectiveTmCandidates.length > 0 ? effectiveTmCandidates : [this.teammate], this.matchConfig, this.activeGravityAxis, this.getArenaWidth());
      this.updateFighter(this.teammate, teammateInput, tmTarget);
    } else if (this.teammate && isClashParticipant(this.teammate)) {
      this.updateValentineClones(this.teammate, this.ai);
    }

    // Update active vampires in horde
    if (this.matchConfig.mode === 'survival' || this.matchConfig.mode === 'team_survival') {
      for (const v of this.vampires) {
        const vFrozen = this.isFighterFrozen(v);
        v.isFrozenByTimeStop = vFrozen;
        if (!vFrozen && !isClashParticipant(v)) {
          const isVampParallel = !!v.isParallelWorld;
          const vCandidates: Fighter[] = [];
          if (this.player && this.player.hp > 0 && !!this.player.isParallelWorld === isVampParallel) {
            vCandidates.push(this.player);
          }
          if (this.teammate && this.teammate.hp > 0 && !!this.teammate.isParallelWorld === isVampParallel) {
            vCandidates.push(this.teammate);
          }
          if (this.player?.valentineClones) {
            for (const clone of this.player.valentineClones) {
              if (clone.hp > 0 && !!clone.isParallelWorld === isVampParallel) vCandidates.push(clone);
            }
          }
          const nonClashingVamp = vCandidates.filter(c => !isClashParticipant(c));
          const effectiveVCandidates = nonClashingVamp.length > 0 ? nonClashingVamp : vCandidates;
          let vTarget = effectiveVCandidates[0] || v;
          if (effectiveVCandidates.length > 1) {
            let minDist = Infinity;
            for (const c of effectiveVCandidates) {
              const d = Math.abs(c.x - v.x);
              if (d < minDist) {
                minDist = d;
                vTarget = c;
              }
            }
          }
          const vInput = this.getAIControllerForFighter(v.id).update(v, effectiveVCandidates.length > 0 ? effectiveVCandidates : [v], this.matchConfig, this.activeGravityAxis, this.getArenaWidth());
          this.updateFighter(v, vInput, vTarget);
        }
      }
    }


    // 4. Update Stands Visual Fade
    this.updateStandState(this.player);
    this.updateStandState(this.ai);
    if (this.teammate) {
      this.updateStandState(this.teammate);
    }

    // 4.5. Universal Valentine Spatiotemporal Paradox Annihilation (Autonomous & Independent of Valentine's Hit/Stun State)
    this.updateParadoxAnnihilationSystem();

    // 5. Update Projectiles (Knives, Space Ripper lasers, Road Roller)
    this.updateProjectiles();
    this.updateAcidPools();
    this.updateArenaHazards(this.currentDt);

    // 6. Update Particles
    this.updateParticles();

    // 7. Check Game Over
    if (this.matchConfig.mode !== 'training') {
      // Teammate respawn check in boss raid
      if (this.teammate && this.teammate.hp <= 0 && this.matchConfig.mode === 'team_boss') {
        this.teammate.hp = this.teammate.maxHp;
        this.teammate.energy = this.teammate.maxEnergy;
        this.teammate.x = 120;
        this.teammate.y = GROUND_Y - FIGHTER_HEIGHT;
        this.teammate.action = 'idle';
        this.teammate.invulnerableTimer = 90;
        this.addTextParticle(this.teammate.x + this.teammate.width / 2, this.teammate.y - 40, '⚡ TEAMMATE RESPAWNED!', '#818cf8');
      }

      if (this.player.hp <= 0 && this.matchConfig.mode === 'team_boss') {
        // Player respawns in boss raid mode!
        this.player.hp = this.player.maxHp;
        this.player.energy = this.player.maxEnergy;
        this.player.x = 80;
        this.player.y = GROUND_Y - FIGHTER_HEIGHT;
        this.player.action = 'idle';
        this.player.invulnerableTimer = 90;
        this.addTextParticle(this.player.x + this.player.width / 2, this.player.y - 40, '⚡ RESPAWNED (TEAM BOSS RAID)!', '#38bdf8');
      } else {
        const isPlayerDead = this.player.hp <= 0;
        const isTeammateDead = this.teammate ? this.teammate.hp <= 0 : true;

        if (isPlayerDead && isTeammateDead && this.ai.hp <= 0) {
          this.isGameOver = true;
          this.winner = 'draw';
          soundManager.stopTooruMatchBgm();
        } else if (isPlayerDead && isTeammateDead) {
          if (!this.dramaticFinisher) {
            const didTrigger = this.checkAndTriggerDramaticFinisher(this.ai, this.player, 'heavy');
            if (didTrigger) return;
          }
          this.isGameOver = true;
          this.winner = 'ai';
          soundManager.stopTooruMatchBgm();
        } else if (this.ai.hp <= 0) {
          if (this.matchConfig.mode !== 'survival' && this.matchConfig.mode !== 'team_survival') {
            if (!this.dramaticFinisher) {
              const didTrigger = this.checkAndTriggerDramaticFinisher(this.player, this.ai, 'heavy');
              if (didTrigger) return;
            }
            this.isGameOver = true;
            this.winner = 'player';
            soundManager.stopTooruMatchBgm();
          }
        }
      }
    }
  }

  public checkAndTriggerDramaticFinisher(
    winner: Fighter,
    loser: Fighter,
    triggerType: 'ultimate' | 'clash' | 'heavy' | 'hazard' = 'heavy',
    hitX?: number,
    hitY?: number
  ): boolean {
    if (this.dramaticFinisher && this.dramaticFinisher.isActive) return false;
    if (this.matchConfig.mode === 'training') return false;

    const mapId = this.matchConfig?.map?.id || 'cairo_bridge';
    let stageFatalityType: StageFatalityType | undefined;

    // 1. Check Environmental Stage Fatality Proximity
    if (mapId === 'cairo_bridge') {
      const tankHazard = this.arenaHazards.find(h => h.type === 'cairo_water_tank');
      if (tankHazard && Math.abs(loser.x - tankHazard.x) < 170) {
        stageFatalityType = 'cairo_water_tank';
        tankHazard.isBroken = true;
        tankHazard.waterGushTimer = 300;
        soundManager.playStageFatalityWaterTank();
      }
    } else if (mapId === 'cairo_street') {
      if (loser.y >= GROUND_Y - loser.height - 30) {
        stageFatalityType = 'cairo_traffic_truck';
        soundManager.playStageFatalityTruck();
      }
    } else if (mapId === 'morioh_sunset') {
      const rock = this.arenaHazards.find(h => h.type === 'morioh_angelo_rock');
      const pole = this.arenaHazards.find(h => h.type === 'morioh_power_pole');
      if (rock && Math.abs(loser.x - rock.x) < 150) {
        stageFatalityType = 'morioh_angelo_rock';
        rock.isBroken = true;
        soundManager.playHeavyImpact();
      } else if (pole && Math.abs(loser.x - pole.x) < 150) {
        stageFatalityType = 'morioh_power_pole';
        pole.shockTimer = 300;
        soundManager.playLightningStrike();
      }
    } else if (mapId === 'vancouver_port') {
      const barrel = this.arenaHazards.find(h => h.type === 'vancouver_oil_barrel');
      const crane = this.arenaHazards.find(h => h.type === 'vancouver_cargo_crane');
      if (barrel && Math.abs(loser.x - barrel.x) < 150) {
        stageFatalityType = 'vancouver_oil_explosion';
        barrel.isBroken = true;
        barrel.firePoolTimer = 300;
        soundManager.playOverdriveExplosion();
      } else if (crane && Math.abs(loser.x - crane.x) < 160) {
        stageFatalityType = 'vancouver_cargo_crane';
        soundManager.playHeavyImpact();
      }
    } else if (mapId === 'colosseum_rome') {
      const pillar = this.arenaHazards.find(h => h.type === 'colosseum_marble_pillar');
      if (pillar && Math.abs(loser.x - pillar.x) < 170) {
        stageFatalityType = 'colosseum_pillar_crush';
        pillar.isBroken = true;
        soundManager.playStageFatalityPillarCrush();
      }
    } else if (mapId === 'arabian_desert') {
      stageFatalityType = 'desert_solar_supernova';
      soundManager.playSunHeatwave();
    }

    const finisherType: 'stage_fatality' | 'clash_finish' | 'ultimate_finish' = 
      stageFatalityType ? 'stage_fatality' : (triggerType === 'clash' ? 'clash_finish' : 'ultimate_finish');

    const quotes = getCharacterDramaticFinisherQuote(winner.charId);

    soundManager.playDramaticFinisherTrigger();
    this.screenShake = 24;

    const actualHitX = hitX !== undefined ? hitX : (loser.x + loser.width / 2);
    const actualHitY = hitY !== undefined ? hitY : (loser.y + loser.height / 2);

    this.dramaticFinisher = {
      isActive: true,
      type: finisherType,
      stageFatalityType,
      winnerId: winner.id,
      loserId: loser.id,
      winnerName: winner.userName || winner.name,
      loserName: loser.userName || loser.name,
      winnerCharId: winner.charId,
      winnerColor: winner.color,
      winnerStandColor: winner.standColor || winner.color,
      winnerQuote: quotes.quote,
      winnerCry: quotes.cry,
      timer: 195,
      maxTimer: 195,
      freezeFrameTimer: 45,
      impactX: actualHitX,
      impactY: actualHitY,
      zoomLevel: 1.0,
      invertColorTimer: 35,
      letterboxProgress: 0,
      retiredStampScale: 0,
      hasTriggeredAudio: false,
    };

    // Fling loser in dramatic trajectory towards hazard or edge
    const launchDir = winner.x < loser.x ? 1 : -1;
    this.triggerRagdollFling(loser, launchDir * 32, -14, winner.x);
    loser.hitReactionType = 'wall_splat';
    loser.wallSplatTimer = 195;
    loser.invulnerableTimer = 195;

    winner.action = 'pose';
    winner.actionTimer = 195;
    winner.actionDuration = 195;
    winner.vx = 0;
    winner.vy = 0;

    return true;
  }

  private updateDramaticFinisher(dt: number) {
    if (!this.dramaticFinisher || !this.dramaticFinisher.isActive) return;

    this.dramaticFinisher.timer -= dt * 60;
    if (this.dramaticFinisher.freezeFrameTimer > 0) {
      this.dramaticFinisher.freezeFrameTimer -= dt * 60;
    }
    if (this.dramaticFinisher.invertColorTimer > 0) {
      this.dramaticFinisher.invertColorTimer -= dt * 60;
    }

    // Letterbox bars slide in smoothly (first 20 frames)
    this.dramaticFinisher.letterboxProgress = Math.min(1.0, this.dramaticFinisher.letterboxProgress + 0.05);

    // Zoom into impact point
    this.dramaticFinisher.zoomLevel = Math.min(1.25, this.dramaticFinisher.zoomLevel + 0.006);

    // Stamp "RETIRED!" animation slams down at frame 135
    if (this.dramaticFinisher.timer <= 135 && this.dramaticFinisher.retiredStampScale < 1.0) {
      this.dramaticFinisher.retiredStampScale = Math.min(1.0, this.dramaticFinisher.retiredStampScale + 0.15);
      if (!this.dramaticFinisher.hasTriggeredAudio) {
        this.dramaticFinisher.hasTriggeredAudio = true;
        soundManager.playRetiredSlam();
        this.screenShake = 18;
      }
    }

    // If timer concludes, end dramatic finisher and finalize game over
    if (this.dramaticFinisher.timer <= 0) {
      const winnerId = this.dramaticFinisher.winnerId;
      this.dramaticFinisher.isActive = false;
      this.isGameOver = true;
      this.winner = (winnerId === 'player' ? 'player' : 'ai') as 'player' | 'ai' | 'draw';
      soundManager.stopTooruMatchBgm();
    }
  }

  // --- TIME STOP LOGIC & PARALLEL COUNTERS (EXCLUSIVE TO DIO & JOTARO) ---
  private updateTimeStopSystem(playerInput: InputState) {
    const playerCanTimeStop = (this.player.charId === 'dio' || this.player.charId === 'jotaro') && this.player.canMoveInStoppedTime;
    const aiCanTimeStop = (this.ai.charId === 'dio' || this.ai.charId === 'jotaro') && this.ai.canMoveInStoppedTime;

    // 1. Check if Player triggers Time Stop / Counter Time Stop
    if (playerInput.timeStop && playerCanTimeStop && this.player.cooldowns.timeStop <= 0) {
      if (this.player.energy >= TIME_STOP_ENERGY_COST || this.matchConfig.mode === 'training') {
        this.activateTimeStop(this.player);
      }
    }

    // 2. Check if AI triggers Counter Time Stop when frozen by player
    if (this.timeStopState.isActive && this.ai.isFrozenByTimeStop && aiCanTimeStop && this.ai.cooldowns.timeStop <= 0 && this.ai.energy >= TIME_STOP_ENERGY_COST) {
      // AI Counter Time Stop reaction
      this.activateTimeStop(this.ai);
      this.addTextParticle(this.ai.x + this.ai.width / 2, this.ai.y - 40, `[COUNTER TIME STOP!]`, '#eab308');
    }

    // 3. Decrement individual parallel active timers
    if (this.timeStopState.isActive) {
      if (this.player.timeStopActiveTimer > 0) {
        this.player.timeStopActiveTimer -= this.currentDt;
        if (this.player.timeStopActiveTimer <= 0) {
          this.player.timeStopActiveTimer = 0;
          this.addTextParticle(this.player.x + this.player.width / 2, this.player.y - 20, 'TIME STOP EXPIRED', '#94a3b8');
        }
      }

      if (this.ai.timeStopActiveTimer > 0) {
        this.ai.timeStopActiveTimer -= this.currentDt;
        if (this.ai.timeStopActiveTimer <= 0) {
          this.ai.timeStopActiveTimer = 0;
          this.addTextParticle(this.ai.x + this.ai.width / 2, this.ai.y - 20, 'TIME STOP EXPIRED', '#94a3b8');
        }
      }

      if (this.teammate && this.teammate.timeStopActiveTimer > 0) {
        this.teammate.timeStopActiveTimer -= this.currentDt;
        if (this.teammate.timeStopActiveTimer <= 0) {
          this.teammate.timeStopActiveTimer = 0;
          this.addTextParticle(this.teammate.x + this.teammate.width / 2, this.teammate.y - 20, 'TIME STOP EXPIRED', '#818cf8');
        }
      }

      // Check if both characters (and teammate if active) have exhausted their active stopped time duration
      const playerExhausted = this.player.timeStopActiveTimer <= 0;
      const aiExhausted = this.ai.timeStopActiveTimer <= 0;
      const teammateExhausted = this.teammate ? this.teammate.timeStopActiveTimer <= 0 : true;

      if (playerExhausted && aiExhausted && teammateExhausted) {
        this.resumeTime();
      }
    }
  }

  public activateTimeStop(f: Fighter) {
    if (this.matchConfig.mode !== 'training') {
      f.energy -= TIME_STOP_ENERGY_COST;
    }
    f.cooldowns.timeStop = f.isBoss ? 2600 : TIME_STOP_COOLDOWN;
    f.timeStopActiveTimer = f.timeStopDurationMax;
    f.isStandActive = true; // Auto summon stand
    // Time stop offensive reserve: ensure initiator has SP to execute signature moves in stopped time
    f.energy = Math.max(f.energy, 50);

    const isFirstActivation = !this.timeStopState.isActive;
    this.timeStopState.isActive = true;
    this.timeStopState.filterFlash = 1.0;
    if (isFirstActivation) {
      this.timeStopState.initiator = f.id;
    }

    // Freeze all active projectiles in place immediately when Time Stop triggers
    for (const proj of this.projectiles) {
      if (!proj.isFrozenInTime) {
        proj.isFrozenInTime = true;
        if (proj.baseVx === undefined || proj.baseVx === 0) proj.baseVx = proj.vx;
        if (proj.baseVy === undefined || proj.baseVy === 0) proj.baseVy = proj.vy;
        proj.vx = 0;
        proj.vy = 0;
      }
    }

    const durationSec = Math.round(f.timeStopDurationMax / 60);
    const isDio = f.charId === 'dio';
    const shout = isDio 
      ? `ZA WARUDO... TOKI WO TOMARE! (${durationSec}s)` 
      : `STAR PLATINUM: THE WORLD! (${durationSec}s)`;

    this.addTextParticle(f.x + f.width / 2, f.y - 50, shout, isDio ? '#facc15' : '#c084fc');
    this.screenShake = 14;

    // Trigger authentic anime Time Stop sound effect
    soundManager.playTimeStop(f.charId);

    // Time stop distortion shockwave
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, isDio ? '#eab308' : '#a855f7');
  }

  public activateTimeErase(f: Fighter, opponent: Fighter) {
    if (this.matchConfig.mode !== 'training') {
      f.energy -= TIME_ERASE_COST;
    }
    f.cooldowns.timeStop = f.isBoss ? 2200 : TIME_ERASE_COOLDOWN;
    f.cooldowns.skill2 = f.isBoss ? 2200 : TIME_ERASE_COOLDOWN;
    f.isTimeEraseActive = true;
    f.timeEraseTimer = TIME_ERASE_DURATION;
    f.invulnerableTimer = 0;
    f.isStandActive = true;

    // Instant skip position behind opponent in erased time
    const targetX = opponent.facing === 'right' ? opponent.x - 65 : opponent.x + opponent.width + 25;
    f.x = Math.max(40, Math.min(this.getArenaWidth() - 80, targetX));
    f.y = opponent.y;

    this.addTextParticle(f.x + f.width / 2, f.y - 40, '⏱️ KING CRIMSON: ERASED TIME!', '#e11d48');
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#e11d48');
    this.screenShake = 14;

    soundManager.playPoseSound('king_crimson');
  }

  private isFighterFrozen(f: Fighter): boolean {
    if (!this.timeStopState.isActive) return false;
    return f.timeStopActiveTimer <= 0;
  }

  private resumeTime() {
    this.timeStopState.isActive = false;
    this.timeStopState.initiator = null;
    this.timeStopState.filterFlash = 1.0;
    this.screenShake = 15;

    // Trigger time resume audio synthesis
    soundManager.playTimeResume();

    this.addTextParticle(ARENA_WIDTH / 2, 120, '★ TOKI WA UGOKI DASU (TIME RESUMES!) ★', '#ffffff');

    // 1. Execute Stacked Accumulated Damage on Player
    if (this.timeStopState.accumulatedDamagePlayer > 0) {
      this.player.hp = Math.max(0, this.player.hp - this.timeStopState.accumulatedDamagePlayer);
      if (!(this.player.charId === 'dipez' && this.player.dipezForm === 'pure_light')) {
        this.triggerRagdollFling(this.player, this.timeStopState.accumulatedKnockbackXPlayer, this.timeStopState.accumulatedKnockbackYPlayer);
      } else {
        this.player.hitStun = 35;
        this.player.vx = this.timeStopState.accumulatedKnockbackXPlayer;
        this.player.vy = this.timeStopState.accumulatedKnockbackYPlayer;
        this.player.isGrounded = false;
        this.player.invulnerableTimer = 25;
      }

      const impactX = this.player.x + this.player.width / 2;
      const impactY = this.player.y + this.player.height / 2;
      this.addShockwave(impactX, impactY, '#ef4444');
      this.addTextParticle(impactX, impactY - 30, `-${Math.round(this.timeStopState.accumulatedDamagePlayer)} DETONATION!`, '#ef4444');
    }

    // 2. Execute Stacked Accumulated Damage on AI
    if (this.timeStopState.accumulatedDamageAI > 0) {
      this.ai.hp = Math.max(0, this.ai.hp - this.timeStopState.accumulatedDamageAI);
      if (!(this.ai.charId === 'dipez' && this.ai.dipezForm === 'pure_light')) {
        this.triggerRagdollFling(this.ai, this.timeStopState.accumulatedKnockbackXAI, this.timeStopState.accumulatedKnockbackYAI);
      } else {
        this.ai.hitStun = 35;
        this.ai.vx = this.timeStopState.accumulatedKnockbackXAI;
        this.ai.vy = this.timeStopState.accumulatedKnockbackYAI;
        this.ai.isGrounded = false;
        this.ai.invulnerableTimer = 25;
      }

      const impactX = this.ai.x + this.ai.width / 2;
      const impactY = this.ai.y + this.ai.height / 2;
      this.addShockwave(impactX, impactY, '#facc15');
      this.addTextParticle(impactX, impactY - 30, `-${Math.round(this.timeStopState.accumulatedDamageAI)} DETONATION!`, '#facc15');
    }

    // 2b. Execute Stacked Accumulated Damage on Teammate
    if (this.teammate && this.teammate.hp > 0 && this.timeStopState.accumulatedDamageTeammate > 0) {
      this.teammate.hp = Math.max(0, this.teammate.hp - this.timeStopState.accumulatedDamageTeammate);
      if (!(this.teammate.charId === 'dipez' && this.teammate.dipezForm === 'pure_light')) {
        this.triggerRagdollFling(this.teammate, this.timeStopState.accumulatedKnockbackXTeammate, this.timeStopState.accumulatedKnockbackYTeammate);
      } else {
        this.teammate.hitStun = 35;
        this.teammate.vx = this.timeStopState.accumulatedKnockbackXTeammate;
        this.teammate.vy = this.timeStopState.accumulatedKnockbackYTeammate;
        this.teammate.isGrounded = false;
        this.teammate.invulnerableTimer = 25;
      }

      const impactX = this.teammate.x + this.teammate.width / 2;
      const impactY = this.teammate.y + this.teammate.height / 2;
      this.addShockwave(impactX, impactY, '#818cf8');
      this.addTextParticle(impactX, impactY - 30, `-${Math.round(this.timeStopState.accumulatedDamageTeammate)} DETONATION!`, '#818cf8');
    }

    // Reset accumulated stacks
    this.timeStopState.accumulatedDamagePlayer = 0;
    this.timeStopState.accumulatedDamageAI = 0;
    this.timeStopState.accumulatedDamageTeammate = 0;
    this.timeStopState.accumulatedKnockbackXPlayer = 0;
    this.timeStopState.accumulatedKnockbackYPlayer = 0;
    this.timeStopState.accumulatedKnockbackXAI = 0;
    this.timeStopState.accumulatedKnockbackYAI = 0;
    this.timeStopState.accumulatedKnockbackXTeammate = 0;
    this.timeStopState.accumulatedKnockbackYTeammate = 0;

    // 3. Unfreeze all suspended floating projectiles
    for (const proj of this.projectiles) {
      if (proj.isFrozenInTime) {
        proj.isFrozenInTime = false;
        proj.vx = proj.baseVx !== undefined ? proj.baseVx : proj.vx;
        proj.vy = proj.baseVy !== undefined ? proj.baseVy : proj.vy;
        this.addSpark(proj.x, proj.y, '#facc15');
      }
    }
  }

  private checkTimeoutWinner() {
    this.isGameOver = true;
    soundManager.stopTooruMatchBgm();
    if (this.player.hp > this.ai.hp) {
      this.winner = 'player';
    } else if (this.ai.hp > this.player.hp) {
      this.winner = 'ai';
    } else {
      this.winner = 'draw';
    }
  }

  // --- FIGHTER UPDATE ---
  private updateFighter(f: Fighter, input: InputState, opponent: Fighter) {
    // Auto-turn AI or idle fighters towards their opponent when not holding directional keys
    if (opponent && opponent.hp > 0 && f.action !== 'knockdown' && f.action !== 'knockback' && f.action !== 'stun' && f.hitStun <= 0) {
      const isAIControlled = this.matchConfig.mode === 'cpu_vs_cpu' || f.id !== 'player' || f.isClone || !!f.isBoss;
      const isMovingDirectionally = (this.activeGravityAxis === 'right' || this.activeGravityAxis === 'left')
        ? (input.jump || input.crouch)
        : (input.left || input.right);

      if (isAIControlled && !isMovingDirectionally) {
        if (this.activeGravityAxis === 'right') {
          // Right wall: facing right is UP (-Y), facing left is DOWN (+Y)
          if (opponent.y < f.y - 10) f.facing = 'right'; // Opponent is above -> Face UP
          else if (opponent.y > f.y + 10) f.facing = 'left'; // Opponent is below -> Face DOWN
        } else if (this.activeGravityAxis === 'left') {
          // Left wall: facing left is UP (-Y), facing right is DOWN (+Y)
          if (opponent.y < f.y - 10) f.facing = 'left'; // Opponent is above -> Face UP
          else if (opponent.y > f.y + 10) f.facing = 'right'; // Opponent is below -> Face DOWN
        } else {
          // Floor and ceiling: horizontal facing
          if (opponent.x > f.x + 10) f.facing = 'right';
          else if (opponent.x < f.x - 10) f.facing = 'left';
        }
      }
    }

    // Cooldown reductions (Boss gets accelerated cooldown ticks! Custom mode can set multiplier or instant 0s!)
    let cdMult = f.isBoss ? 2.2 : 1.0;
    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings) {
      if (this.matchConfig.customSettings.cooldownMultiplier === 0) {
        cdMult = 9999; // Instant zero cooldown!
      } else {
        cdMult = 1.0 / this.matchConfig.customSettings.cooldownMultiplier;
      }
    }

    f.cooldowns.punch = Math.max(0, f.cooldowns.punch - cdMult);
    f.cooldowns.barrage = Math.max(0, f.cooldowns.barrage - cdMult);
    f.cooldowns.standToggle = Math.max(0, f.cooldowns.standToggle - cdMult);
    f.cooldowns.pose = Math.max(0, f.cooldowns.pose - cdMult);
    f.cooldowns.skill1 = Math.max(0, f.cooldowns.skill1 - cdMult);
    f.cooldowns.skill2 = Math.max(0, f.cooldowns.skill2 - cdMult);
    f.cooldowns.skill3 = Math.max(0, f.cooldowns.skill3 - cdMult);
    f.cooldowns.skill4 = Math.max(0, f.cooldowns.skill4 - cdMult);
    f.cooldowns.skill5 = Math.max(0, f.cooldowns.skill5 - cdMult);
    f.cooldowns.timeStop = Math.max(0, f.cooldowns.timeStop - cdMult);
    f.cooldowns.ultimate = Math.max(0, f.cooldowns.ultimate - cdMult);

    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings?.infiniteEnergy) {
      f.energy = f.maxEnergy;
    }

    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings) {
      if (this.matchConfig.customSettings.infiniteHpPlayer && (f.id === 'player' || f.id === 'teammate')) {
        f.hp = f.maxHp;
      }
      if (this.matchConfig.customSettings.infiniteHpEnemy && (f.id === 'ai' || f.id.startsWith('vampire'))) {
        f.hp = f.maxHp;
      }
    }

    if (f.isBoss) {
      f.energy = Math.min(f.maxEnergy, f.energy + 0.35); // Constant Boss energy recharge
      if (this.frameCount % 45 === 0) {
        this.addMenacingParticle(f.x + f.width / 2, f.y, 'ゴ', f.charId === 'dio' ? '#facc15' : '#e11d48');
      }
    }

    f.invulnerableTimer = Math.max(0, f.invulnerableTimer - 1);
    f.hitStun = Math.max(0, f.hitStun - 1);
    f.guardBreakTimer = Math.max(0, f.guardBreakTimer - 1);

    // DIPEZ PASSIVE MECHANICS (ALWAYS DECREMENTS EVERY FRAME)
    if (f.charId === 'dipez') {
      if (f.dipezArmLostTimer && f.dipezArmLostTimer > 0) {
        f.dipezArmLostTimer--;
      }
      if (f.dipezInvisibleTimer && f.dipezInvisibleTimer > 0) {
        f.dipezInvisibleTimer--;
        if (this.frameCount % 5 === 0) {
          this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#fef08a');
        }
      }
      if (f.dipezStarMakerFlash && f.dipezStarMakerFlash > 0) {
        f.dipezStarMakerFlash--;
        this.screenShake = Math.max(this.screenShake, 14); // Continuous heavy screen shake during Star Maker!
      }
    }

    // ARABIAN FAT & THE SUN PASSIVE ENVIRONMENTAL SYSTEM
    if (f.charId === 'arabian_fat') {
      if (f.isHidingBehindMirror && f.mirrorObject && !f.mirrorObject.isDestroyed) {
        // Absolute stillness while hiding in camouflage
        f.vx = 0;
        f.vy = 0;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 2);

        f.mirrorObject.glintTimer = ((f.mirrorObject.glintTimer || 0) + 1) % 120;
        if (f.mirrorObject.hitFlashTimer && f.mirrorObject.hitFlashTimer > 0) {
          f.mirrorObject.hitFlashTimer--;
        }
      }

      if (f.sunExposedTimer && f.sunExposedTimer > 0) {
        f.sunExposedTimer--;
      }

      if (f.sunActive) {
        // 1. Environmental Temperature Gauge (0-100) gradual rise
        f.sunTemperature = Math.min(SUN_MAX_TEMPERATURE, (f.sunTemperature || 0) + SUN_TEMPERATURE_RISE_RATE);
        f.sunX = this.getArenaWidth() / 2;
        f.sunY = 75;

        // 2. Periodic Burn Damage to enemies (once every 60 frames / 1s)
        if (this.frameCount % 60 === 0 && (f.sunTemperature || 0) > 15) {
          const targets = this.getTargetsForAttacker(f, opponent);
          const burnDmg = Math.max(1, Math.floor(((f.sunTemperature || 0) / 100) * 8));
          for (const t of targets) {
            if (t.hp > 0 && t.charId !== 'arabian_fat') {
              if (t.charId === 'dipez' && t.dipezForm === 'pure_light') continue;
              this.applyRawDamage(t, burnDmg, 0, 0, f, true);
              t.burnedTimer = Math.max(t.burnedTimer || 0, 90);
              this.addSpark(t.x + Math.random() * t.width, t.y + Math.random() * t.height, '#f97316');
            }
          }
          if (Math.random() < 0.25) {
            soundManager.playSunHeatwave();
          }
        }

        // 3. Auto-Targeting Heat Lasers
        // Interval accelerates if enemy is moving or dashing
        const targets = this.getTargetsForAttacker(f, opponent);
        const primaryTarget = targets[0] || opponent;
        if (primaryTarget && primaryTarget.hp > 0) {
          const isEnemyMoving = Math.abs(primaryTarget.vx) > 0.35 || Math.abs(primaryTarget.vy) > 0.35 || 
            primaryTarget.action === 'walk' || primaryTarget.action === 'jump' ||
            primaryTarget.action === 'punch' || primaryTarget.action === 'barrage' || (primaryTarget.action as string).includes('blitz');

          const laserInterval = isEnemyMoving ? SUN_FAST_LASER_INTERVAL : SUN_BASE_LASER_INTERVAL;
          
          if (!f.sunLaserTimer || f.sunLaserTimer <= 0) {
            f.sunLaserTimer = laserInterval;
          } else {
            f.sunLaserTimer--;
          }

          if (f.sunLaserTimer <= 0 && (f.sunTemperature || 0) > 10) {
            f.sunLaserTimer = laserInterval;
            const startX = (f.sunX || this.getArenaWidth() / 2) + (Math.random() * 40 - 20);
            const startY = (f.sunY || 75) + 20;
            const targetCenterX = primaryTarget.x + primaryTarget.width / 2;
            const targetCenterY = primaryTarget.y + primaryTarget.height / 2;
            const dx = targetCenterX - startX;
            const dy = targetCenterY - startY;
            const dist = Math.max(1, Math.hypot(dx, dy));
            const vx = (dx / dist) * SUN_LASER_SPEED;
            const vy = (dy / dist) * SUN_LASER_SPEED;

            this.projectiles.push({
              id: this.projectileId++,
              ownerId: f.id,
              type: 'sun_heat_laser',
              x: startX,
              y: startY,
              vx,
              vy,
              baseVx: vx,
              baseVy: vy,
              width: 18,
              height: 18,
              damage: SUN_LASER_DAMAGE + Math.floor(((f.sunTemperature || 0) / 100) * 14),
              knockbackX: vx > 0 ? 6 : -6,
              knockbackY: -3,
              hitStun: 22,
              isFrozenInTime: false,
              life: 80,
              maxLife: 80,
              color: '#f97316',
            });

            soundManager.playSunLaser();
            this.addSpark(startX, startY, '#facc15');
          }
        }
      }
    }

    // Michael Junister (Ghost: Hat Price) Mechanics & Kinetic Momentum Storage
    if (f.charId === 'michael') {
      if (f.michaelKineticMeter === undefined) f.michaelKineticMeter = 0;

      // Decrement George Trample Cooldown
      if (f.georgeTrampleCooldown && f.georgeTrampleCooldown > 0) {
        f.georgeTrampleCooldown--;
      }

      // George horse mounting physics & gallop effects
      if (f.isGeorgeMounted) {
        if (f.isGrounded && Math.abs(f.vx) > 1.2) {
          if (this.frameCount % 16 === 0) {
            soundManager.playGeorgeGallop();
          }
          if (this.frameCount % 4 === 0) {
            this.addSpark(
              f.facing === 'right' ? f.x - 15 : f.x + f.width + 15,
              f.y + f.height,
              '#d97706'
            );
          }
        }

        // --- GEORGE TRAMPLE CHARGE COLLISION DAMAGE (HIGH SPEED GALLOP IMPACT) ---
        if (Math.abs(f.vx) >= 3.2) {
          const targets = this.getTargetsForAttacker(f, opponent);
          for (const target of targets) {
            if (target.hp > 0 && Math.abs((target.x + target.width / 2) - (f.x + f.width / 2)) < 70 && Math.abs(target.y - f.y) < 65) {
              if (!target.georgeTrampleCooldown || target.georgeTrampleCooldown <= 0) {
                target.georgeTrampleCooldown = 28; // Cooldown between trample hits
                const trampleDamage = Math.round(30 + (f.michaelKineticMeter || 0) * 0.3);
                const chargeDir = f.vx > 0 ? 1 : -1;
                this.applyRawDamage(target, trampleDamage, chargeDir * 15, -4.5, f);
                target.hitStun = 30;
                this.screenShake = Math.max(this.screenShake, 7);
                soundManager.playGeorgeNeigh();
                soundManager.playGeorgeGallop();
                this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#d97706');
                this.addTextParticle(target.x + target.width / 2, target.y - 45, `🐎 HORSE TRAMPLE IMPACT! -${trampleDamage} HP`, '#facc15');
                // Physical impact collision charges kinetic meter
                f.michaelKineticMeter = Math.min(100, (f.michaelKineticMeter || 0) + 15);
              }
            }
          }
        }
      }

      // Dynamic Vault-Mounting Sequence for Michael Junister (No floating - athletic vaulting animation!)
      if (f.georgeMountingTimer && f.georgeMountingTimer > 0) {
        f.georgeMountingTimer--;

        // George gallops smoothly and swiftly towards Michael
        if (f.georgeX !== undefined) {
          const targetX = f.x;
          f.georgeX += (targetX - f.georgeX) * 0.22;
          if (this.frameCount % 8 === 0) {
            soundManager.playGeorgeGallop();
          }
        }

        // Multi-stage mounting kinematics:
        // 34-21: 'approach' (Michael waits grounded, readying sprint & extending hand for saddle pommel)
        // 20-8: 'vault' (Michael springs into mid-air, vaulting right leg athletically over George's back)
        // 7-0: 'mount' (Michael drops squarely into the saddle, slots boots into stirrups, grips reins)
        if (f.georgeMountingTimer > 20) {
          f.georgeMountingPhase = 'approach';
        } else if (f.georgeMountingTimer > 7) {
          f.georgeMountingPhase = 'vault';
          if (this.frameCount % 4 === 0) {
            this.addSpark(f.x + f.width / 2, f.y + f.height - 15, '#facc15');
          }
        } else {
          f.georgeMountingPhase = 'mount';
        }

        // Vault completion: Michael is now firmly mounted!
        if (f.georgeMountingTimer === 0) {
          f.isGeorgeMounted = true;
          f.georgeState = 'mounted';
          f.georgeX = f.x;
          soundManager.playGeorgeNeigh();
          soundManager.playGeorgeGallop();
          this.addShockwave(f.x + f.width / 2, f.y + f.height - 8, '#facc15');
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '🐎 MOUNTED GEORGE (NO.1 STALLION)!', '#facc15');
          for (let i = 0; i < 12; i++) {
            this.addSpark(
              f.x + f.width / 2 + (Math.random() * 50 - 25),
              f.y + f.height - 8 + (Math.random() * 16 - 8),
              '#facc15'
            );
          }
        }
      } else if (f.isGeorgeMounted) {
        f.georgeX = f.x;
      }

      // Re-mounting logic when Michael was unhorsed / fell off during combat:
      if (f.georgePendingRemount) {
        if (f.georgeFallOffTimer && f.georgeFallOffTimer > 0) {
          f.georgeFallOffTimer--;
        }
        // Once Michael is back on his feet (not in hitstun, not in knockdown/knockback/wakeup, and fall off timer expired):
        if (f.isGrounded && f.hitStun <= 0 && f.action !== 'knockdown' && f.action !== 'knockback' && f.action !== 'wakeup' && (f.georgeFallOffTimer || 0) <= 0) {
          f.georgePendingRemount = false;
          f.georgeMountingTimer = 30;
          f.georgeMountingPhase = 'approach';
          f.georgeState = 'mounting';
          // George gallops in from nearby to let Michael remount!
          f.georgeX = f.facing === 'right' ? f.x - 180 : f.x + 180;
          soundManager.playGeorgeNeigh();
          soundManager.playGeorgeGallop();
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '🐎 REMOUNTING GEORGE!', '#facc15');
        }
      }

      // Hard ground landing impact absorption (falling / slammed down)
      if (!f.wasGroundedLastFrame && f.isGrounded && Math.abs(f.vy) > 3) {
        const groundImpact = Math.min(20, Math.round(Math.abs(f.vy) * 2));
        f.michaelKineticMeter = Math.min(100, (f.michaelKineticMeter || 0) + groundImpact);
        this.addTextParticle(f.x + f.width / 2, f.y - 35, `⚡ GROUND IMPACT ABSORPTION +${groundImpact}%`, '#facc15');
      }

      // Kinetic Energy Generation through Movement & Momentum (E = 1/2 m v^2)
      if (Math.abs(f.vx) > 1.0 && f.isGrounded) {
        const isMounted = f.isGeorgeMounted;
        const velocityGain = isMounted ? 0.18 : 0.09;
        const overdriveMult = (f.michaelOverdriveTimer && f.michaelOverdriveTimer > 0) ? 2.0 : 1.0;
        f.michaelKineticMeter = Math.min(100, (f.michaelKineticMeter || 0) + velocityGain * overdriveMult);
      }

      // Kinetic Energy Storage Logic:
      // Locks firmly at 100% when fully charged (no decay at 100%)!
      if (f.michaelKineticMeter >= 98) {
        f.michaelKineticMeter = 100;
      } else if (f.michaelKineticMeter > 0 && (!f.michaelOverdriveTimer || f.michaelOverdriveTimer <= 0)) {
        f.michaelKineticMeter = Math.max(0, f.michaelKineticMeter - 0.015);
      }

      // Hat Price Overdrive Surge: Prevents kinetic decay, doubles kinetic accumulation, emits golden aura sparks
      if (f.michaelOverdriveTimer && f.michaelOverdriveTimer > 0) {
        f.michaelOverdriveTimer--;
        if (this.frameCount % 5 === 0) {
          const goldColor = Math.random() < 0.5 ? '#facc15' : '#fef08a';
          this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, goldColor);
        }
      }

      // Update Kinetic Stacks (0 to 5)
      f.michaelKineticStacks = Math.min(5, Math.floor(f.michaelKineticMeter / 20));

      if (f.michaelCounterTimer && f.michaelCounterTimer > 0) {
        f.michaelCounterTimer--;
        if (f.michaelCounterTimer <= 0) {
          f.michaelCounterActive = false;
          f.isParrying = false;
        }
      }
    }

    // Parallel Self Army (Clones update - ALWAYS runs even if main Valentine is stunned, hit, or in clash)
    this.updateValentineClones(f, opponent);

    // Parallel World Timer for main Funny Valentine
    if (!f.isClone && f.charId === 'funny_valentine' && f.isParallelWorld) {
      if (f.parallelWorldTimer && f.parallelWorldTimer > 0) {
        f.parallelWorldTimer--;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 2);
      } else {
        f.isParallelWorld = false;
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '🌀 RETURNED TO MAIN DIMENSION', '#94a3b8');
      }
    }

    if (f.epitaphTimer && f.epitaphTimer > 0) {
      f.epitaphTimer--;
      if (this.frameCount % 8 === 0) {
        this.addSpark(f.x + f.width / 2 + (Math.random() * 26 - 13), f.y + 8 + (Math.random() * 14 - 7), '#fb7185');
      }
      if (this.frameCount % 22 === 0) {
        this.addMenacingParticle(f.x + f.width / 2 + (Math.random() > 0.5 ? 24 : -24), f.y - 12, '予知', '#f43f5e');
      }
      // Epitaph Active Counter Trigger: If opponent initiates a close-range attack while Epitaph is active, immediately pre-emptively counter!
      if (
        f.isEpitaphActive &&
        opponent &&
        opponent.hp > 0 &&
        Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2)) < 175 &&
        ['punch', 'barrage', 'star_finger', 'street_sign', 'zoom_punch', 'luck_pluck_slash', 'hamon_elbow', 'ray_of_light', 'upward_thrust', 'donut_strike', 'crimson_cleave', 'fate_crusher'].includes(opponent.action) &&
        opponent.actionTimer &&
        opponent.actionDuration &&
        opponent.actionTimer >= opponent.actionDuration - 6
      ) {
        this.triggerEpitaphCounter(f, opponent);
      }
      if (f.epitaphTimer <= 0) f.isEpitaphActive = false;
    }
    if (f.timeEraseTimer && f.timeEraseTimer > 0) {
      f.timeEraseTimer--;
      if (f.timeEraseTimer <= 0) f.isTimeEraseActive = false;
    }
    if (f.doppioGlitchTimer && f.doppioGlitchTimer > 0) {
      f.doppioGlitchTimer--;
    }

    // Initialize afterimages array if undefined
    if (!f.afterimages) {
      f.afterimages = [];
    }

    // Decay existing afterimages
    f.afterimages.forEach(img => {
      img.alpha -= 0.045; // Fade out rate
    });
    f.afterimages = f.afterimages.filter(img => img.alpha > 0);

    // If Diavolo and Time Erase is active, record new afterimage
    if (f.charId === 'king_crimson' && f.isTimeEraseActive) {
      // Record a position trail if moving or acting
      if (this.frameCount % 3 === 0 && (f.vx !== 0 || f.vy !== 0 || f.action === 'walk' || f.action === 'jump')) {
        f.afterimages.push({
          x: f.x,
          y: f.y,
          alpha: 0.8,
          facing: f.facing,
          charId: 'king_crimson',
          color: 'rgba(239, 68, 68, 0.65)' // Red/Crimson afterimage
        });
      }
    }

    // PUCCI MADE IN HEAVEN: Continuous Speed Afterimages whenever moving, jumping, or executing any skills (like Diavolo Time Erase)
    if (f.charId === 'pucci' && f.pucciForm === 'made_in_heaven') {
      const isMovingOrActing = (
        Math.abs(f.vx) > 0.05 || 
        Math.abs(f.vy) > 0.05 || 
        f.action !== 'idle' ||
        (f.actionTimer && f.actionTimer > 0)
      );

      if (isMovingOrActing) {
        // Dynamic spawn frequency: every frame during active Time Accel / Universe Reset / Speed Blitz, otherwise every 2 frames
        const spawnInterval = (f.mihTimeAccelTimer && f.mihTimeAccelTimer > 0) || f.action === 'mih_universe_reset' || f.action === 'mih_speed_blitz' ? 1 : 2;
        if (this.frameCount % spawnInterval === 0) {
          const celestialColors = [
            'rgba(250, 204, 21, 0.75)',  // Radiant Heaven Gold
            'rgba(255, 255, 255, 0.75)',  // Pure Celestial White
            'rgba(56, 189, 248, 0.70)',   // Cosmic Cyan Velocity
            'rgba(234, 179, 8, 0.70)',    // Sunburst Amber
          ];
          const chosenColor = celestialColors[f.afterimages.length % celestialColors.length];
          f.afterimages.push({
            x: f.x,
            y: f.y,
            alpha: 0.85,
            facing: f.facing,
            charId: 'pucci',
            color: chosenColor
          });
        }
      }
    }

    // Michael Junister Golden Kinetic Trails (Only for lunges: palm thrust, counter kick, and ultimate - NO afterimages on Overdrive!)
    if (f.charId === 'michael' && (f.action === 'michael_palm_thrust' || f.action === 'michael_counter_kick' || f.action === 'michael_ultimate')) {
      if (this.frameCount % 2 === 0) {
        f.afterimages.push({
          x: f.x,
          y: f.y,
          alpha: 0.8,
          facing: f.facing,
          charId: 'michael',
          color: 'rgba(250, 204, 21, 0.7)'
        });
      }
    }

    // --- MANGA MENACING SFX GENERATOR (WALKING, FOOTSTEPS, LANDING, STAND AURA) ---
    // 1. Ground Landing Impact SFX (When touching down on floor)
    if (!f.wasGroundedLastFrame && f.isGrounded && Math.abs(f.vy) > 1.2) {
      const landX = f.x + f.width / 2;
      const landY = f.y + f.height - 12;
      this.addMenacingParticle(landX - 22, landY, 'ド', 'rgba(239, 68, 68, 0.9)');
      this.addMenacingParticle(landX + 22, landY, 'ゴ', 'rgba(192, 132, 252, 0.9)');
    }
    f.wasGroundedLastFrame = f.isGrounded;

    // 2. Walking / Footstep Menacing Particles (When stepping/walking across the ground)
    if (f.isGrounded && (f.action === 'walk' || Math.abs(f.vx) > 0.4)) {
      if (f.charId === 'michael' && f.isGeorgeMounted) {
        const isFast = Math.abs(f.vx) > 2.2;
        const hoofInterval = isFast ? 10 : 18;
        if (this.frameCount % hoofInterval === 0) {
          soundManager.playGeorgeGallop();
          const dustX = f.facing === 'right' ? f.x - 18 : f.x + f.width + 8;
          this.addSpark(dustX + (Math.random() * 10 - 5), f.y + f.height - 6, '#cbd5e1');
          this.addMenacingParticle(f.x + f.width / 2, f.y + f.height - 12, isFast ? 'ドドド' : 'パッカ', '#facc15');
        }
      } else if (this.frameCount % 7 === (f.id === 'player' ? 0 : 3)) {
        const footX = f.x + f.width / 2 + (Math.random() * 26 - 13);
        const footY = f.y + f.height - 10;
        const footGlyphs = ['ゴ', 'ド', 'ズズ', 'ドド'];
        const chosenGlyph = footGlyphs[Math.floor(Math.random() * footGlyphs.length)];
        const footColor = f.charId === 'dio' ? 'rgba(234, 179, 8, 0.9)'
          : f.charId === 'gappy' ? 'rgba(56, 189, 248, 0.9)'
          : f.charId === 'pucci' ? 'rgba(192, 132, 252, 0.9)'
          : f.charId === 'tooru' ? 'rgba(239, 68, 68, 0.9)'
          : 'rgba(168, 85, 247, 0.9)';
        this.addMenacingParticle(footX, footY, chosenGlyph, footColor);
      }
    }

    // 3. Stand Active Ambient Aura Particles
    if (f.isStandActive && this.frameCount % 16 === (f.id === 'player' ? 0 : 8)) {
      const auraX = f.x + Math.random() * f.width;
      const auraY = f.y - 10 + Math.random() * f.height;
      const auraGlyph = Math.random() < 0.7 ? 'ゴ' : (Math.random() < 0.5 ? 'ド' : 'ズ');
      const auraColor = f.charId === 'dio' ? 'rgba(250, 204, 21, 0.85)'
        : f.charId === 'crazy_diamond' ? 'rgba(56, 189, 248, 0.85)'
        : f.charId === 'king_crimson' ? 'rgba(251, 113, 133, 0.85)'
        : f.charId === 'gappy' ? 'rgba(125, 211, 252, 0.85)'
        : f.charId === 'pucci' ? 'rgba(192, 132, 252, 0.85)'
        : 'rgba(168, 85, 247, 0.85)';
      this.addMenacingParticle(auraX, auraY, auraGlyph, auraColor);
    }

    if (f.isShootingSwordCooldown && f.isShootingSwordCooldown > 0) {
      f.isShootingSwordCooldown--;
    }
    if (f.blindedTimer && f.blindedTimer > 0) {
      f.blindedTimer--;
    }
    if (f.bloodBlindedTimer && f.bloodBlindedTimer > 0) {
      f.bloodBlindedTimer--;
      if (this.frameCount % 6 === 0) {
        this.addSpark(
          f.x + f.width / 2 + (Math.random() * 20 - 10),
          f.y + 14 + Math.random() * 12,
          '#7f1d1d'
        );
      }
    }

    // Josuke Crazy Diamond checks
    if (f.charId === 'crazy_diamond') {
      // Check auto-trigger Enraged under 30% HP
      if (f.hp < f.maxHp * 0.30 && !f.isEnraged) {
        f.isEnraged = true;
        f.enragedTimer = 600; // 10s buff duration
        this.addTextParticle(f.x + f.width / 2, f.y - 45, "🤬 DON'T INSULT MY HAIR!!!", '#f43f5e');
        this.addMenacingParticle(f.x, f.y - 15, '💢', '#ef4444');
        soundManager.playPoseSound('crazy_diamond');
        this.screenShake = Math.max(this.screenShake, 8.5);
      }
    }

    if (f.enragedTimer && f.enragedTimer > 0) {
      f.enragedTimer--;
      if (f.enragedTimer <= 0 && f.hp >= f.maxHp * 0.30) {
        f.isEnraged = false;
        this.addTextParticle(f.x + f.width / 2, f.y - 40, "😇 JOSUKE CALMED DOWN", '#38bdf8');
      }
    }

    if (f.rockShieldTimer && f.rockShieldTimer > 0) {
      f.rockShieldTimer--;
      if (f.rockShieldTimer <= 0) {
        f.rockShieldX = undefined;
      }
    }

    if (f.angeloWallTimer && f.angeloWallTimer > 0) {
      f.angeloWallTimer--;
      // Keep ONLY the petrified fighter (f) rooted inside the Angelo Rock monolith!
      f.vx = 0;
      f.vy = 0;
      f.y = GROUND_Y - f.height;
      f.isGrounded = true;
      f.isStandActive = false;
      f.standAlpha = 0;
      f.isParrying = false;
      f.action = 'hit';
      f.hitStun = Math.max(f.hitStun, 2);
      // Lore-accurate Crazy Diamond molecular restoration slight heal while fused in Angelo Rock
      if (f.angeloWallTimer % 20 === 0 && f.hp > 0) {
        f.hp = Math.min(f.maxHp, f.hp + 3);
        this.addTextParticle(f.x + f.width / 2, f.y - 32, '💖 +3 HP (ANGELO RESTORATION)', '#4ade80');
      }
      if (this.frameCount % 6 === 0) {
        this.addSpark(
          f.x + f.width / 2 + (Math.random() * 44 - 22),
          f.y + f.height / 2 + (Math.random() * 50 - 25),
          Math.random() < 0.5 ? '#4ade80' : '#38bdf8'
        );
      }
      if (f.angeloWallTimer === 0) {
        f.hitStun = 0;
        f.hitReactionTimer = 0;
        f.action = 'idle';
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#64748b');
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🗿💥 ANGELO ROCK SHATTERED!', '#94a3b8');
        for (let i = 0; i < 12; i++) {
          this.addSpark(
            f.x + f.width / 2 + (Math.random() * 60 - 30),
            f.y + f.height / 2 + (Math.random() * 60 - 30),
            i % 2 === 0 ? '#64748b' : '#cbd5e1'
          );
        }
      }
    }

    // TOORU & WONDER OF U STATUS TIMERS & CALAMITY FLOW
    if (f.burnedTimer && f.burnedTimer > 0) {
      f.burnedTimer--;
      if (this.frameCount % 18 === 0) {
        this.applyRawDamage(f, CALAMITY_COMBUSTION_TICK_DAMAGE, 0, 0, null, true);
        this.addMenacingParticle(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '🔥', '#f97316');
      }
    }
    if (f.bleedTimer && f.bleedTimer > 0) {
      f.bleedTimer--;
      if (this.frameCount % 15 === 0) {
        this.applyRawDamage(f, CALAMITY_BLEED_TICK_DAMAGE, 0, 0, null, true);
        this.addMenacingParticle(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '🩸', '#dc2626');
      }
    }

    // POISON STATUS EFFECT (Dododo De Dadada Rock Insects & Toxic Attacks)
    if (f.poisonTimer && f.poisonTimer > 0) {
      f.poisonTimer--;
      f.vx *= 0.88; // Slows movement while poisoned
      if (this.frameCount % 20 === 0) {
        this.applyRawDamage(f, 3, 0, 0, null, true);
        this.addMenacingParticle(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '🦂', '#84cc16');
      }
    }

    // PUCCI WHITESNAKE ACID MELT & DISSOLUTION STATUS
    if (f.acidMeltTimer && f.acidMeltTimer > 0) {
      f.acidMeltTimer--;
      f.vx *= 0.82; // Sluggish movement in melting corrosive acid
      if (this.frameCount % 16 === 0) {
        this.applyRawDamage(f, PUCCI_ACID_DAMAGE_PER_TICK, 0, 0, null, true);
        this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#c084fc');
        this.particles.push({
          id: this.projectileId++,
          x: f.x + Math.random() * f.width,
          y: f.y + Math.random() * f.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2.5,
          life: 25,
          maxLife: 25,
          size: 6,
          color: '#c084fc',
          type: 'acid_bubble',
        });
      }
    }

    // PUCCI C-MOON INVERSION DISTORTION STATUS
    if (f.inversionDistortTimer && f.inversionDistortTimer > 0) {
      f.inversionDistortTimer--;
      if (this.frameCount % 8 === 0) {
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#34d399');
      }
    }

    if (f.headDoctorTimer && f.headDoctorTimer > 0) {
      f.headDoctorTimer--;
      f.invulnerableTimer = Math.max(f.invulnerableTimer, 2); // Maintain invulnerability
      if (f.headDoctorTimer <= 0) {
        f.isHeadDoctorDisguise = false;
        this.addTextParticle(f.x + f.width / 2, f.y - 30, 'DISGUISE EXPIRED', '#94a3b8');
      }
    }
    if (f.calamityCounterTimer && f.calamityCounterTimer > 0) {
      f.calamityCounterTimer--;
      if (f.calamityCounterTimer <= 0) {
        f.isCalamityCounterActive = false;
      }
    }
    if (f.calamityCooldownTimer && f.calamityCooldownTimer > 0) {
      f.calamityCooldownTimer--;
    }
    if (f.calamityRainTimer && f.calamityRainTimer > 0) {
      f.calamityRainTimer--;
      // Keep Tooru protected in the eye of the calamity storm
      if (f.charId === 'tooru') {
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 20);
      }
      // Dense piercing rain across the entire map
      if (this.frameCount % 2 === 0) {
        this.spawnCalamityRaindrop(f, opponent);
      }

      // ULTIMATE MASSIVE HIGHWAY TRAFFIC CARNAGE:
      // Fast-paced bumper-to-bumper convoys (🚗 🚙 🛻 🚐 🚚 🚛) rushing from outside map walls!
      if (f.calamityRainTimer > 25 && f.calamityRainTimer % 15 === 0) {
        const waveIndex = Math.floor((TOORU_ULTIMATE_DURATION - f.calamityRainTimer) / 15);
        const vehicleTypes: Array<'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi'> = [
          'sedan', 'suv', 'pickup', 'van', 'truck', 'semi', 'sedan', 'pickup', 'truck', 'semi'
        ];
        // Spawn a fast sequence of vehicles from both left & right walls simultaneously!
        for (let c = 0; c < 8; c++) {
          const type = vehicleTypes[(waveIndex * 2 + c) % vehicleTypes.length];
          const dir: 1 | -1 = c % 2 === 0 ? 1 : -1;
          const sideIndex = Math.floor(c / 2);
          const offset = sideIndex * 180;
          this.spawnRunawayCar(f, opponent, dir, type, offset);
        }
      } else if (f.calamityRainTimer === 20) {
        // Climax: Giant Extinction Meteor crashes onto opponent!
        this.spawnCalamityMeteor(f, opponent);
      }
    }

    // Wonder of U Autonomous Entity AI & Combat (Walks freely across the arena & repels intruders)
    if (f.charId === 'tooru') {
      if (!f.wouEntity) {
        f.wouEntity = {
          x: f.x - (f.facing === 'right' ? 80 : -80),
          y: f.y,
          vx: 0,
          vy: 0,
          facing: f.facing,
          walkTimer: 0,
          active: true,
          state: 'idle',
          targetX: f.x,
        };
      }

      const wou = f.wouEntity;
      wou.walkTimer++;

      // Wonder of U Autonomous Wandering & Stalking AI
      if (wou.walkTimer % 90 === 0) {
        const rand = Math.random();
        if (rand < 0.35) {
          wou.state = 'walk';
          wou.targetX = Math.max(80, Math.min(this.getArenaWidth() - 80, f.x + (Math.random() * 400 - 200)));
        } else if (rand < 0.85) {
          wou.state = 'stalk';
          wou.targetX = Math.max(80, Math.min(this.getArenaWidth() - 80, opponent.x + (Math.random() > 0.5 ? 90 : -90)));
        } else {
          wou.state = 'idle';
          wou.vx = 0;
        }
      }

      if (wou.state === 'walk' || wou.state === 'stalk') {
        const dx = wou.targetX - wou.x;
        if (Math.abs(dx) > 15) {
          wou.vx = Math.sign(dx) * 2.4; // Menacing walking speed
          wou.facing = dx > 0 ? 'right' : 'left';
        } else {
          wou.vx = 0;
          wou.state = 'idle';
        }
      } else {
        wou.vx = 0;
      }

      if (this.timeStopState.isActive) {
        wou.vx = 0;
      } else {
        wou.x += wou.vx;
      }
      wou.y = f.y;

      // Wonder of U Autonomous Proximity Retaliation:
      // If the opponent gets dangerously close to Wonder of U, WoU strikes with Calamity Aura!
      const distToWou = Math.abs((wou.x + 20) - (opponent.x + opponent.width / 2));
      if (!this.timeStopState.isActive && distToWou < 200 && (!wou.attackCooldown || wou.attackCooldown <= 0)) {
        wou.facing = opponent.x > wou.x ? 'right' : 'left';
        if (opponent.charId === 'dipez' && opponent.dipezForm === 'pure_light') {
          this.triggerDipezAutoBlink(opponent, f);
        } else {
          const knockDir = wou.facing === 'right' ? 1 : -1;
          this.applyRawDamage(opponent, 145, knockDir * 16, -9, f);
          opponent.hitStun = 45;
          opponent.isGrounded = false;
          soundManager.playRazorCut();
          this.screenShake = 10;
          this.addShockwave(wou.x + 20, wou.y + 35, '#ef4444');
          this.addTextParticle(wou.x, wou.y - 45, '⚠️ [WOU: CANE OF CALAMITY!]', '#ef4444');
        }
        wou.attackCooldown = 55;
      }
      if (wou.attackCooldown && wou.attackCooldown > 0) {
        wou.attackCooldown--;
      }

      // Floating "DO DO DO DE DA DA DA" and Menacing Katakana particles around Wonder of U & Tooru
      if (this.frameCount % 24 === 0) {
        const text = Math.random() > 0.5 ? 'DO DO DO' : 'DE DA DA DA';
        this.addTextParticle(wou.x + (Math.random() * 30 - 15), wou.y - 45, text, '#ef4444');
      }

      // Continuous Menacing Katakana SFX beside Wonder of U Entity
      if (this.frameCount % 8 === 0) {
        const wouSideX = wou.x + (Math.random() > 0.5 ? -25 : 35);
        const wouSideY = wou.y - 15 + (Math.random() * 30 - 15);
        const wouGlyph = Math.random() < 0.7 ? 'ゴ' : (Math.random() < 0.5 ? 'ド' : '災');
        this.addMenacingParticle(wouSideX, wouSideY, wouGlyph, '#ef4444');
      }

      // Continuous Menacing Katakana SFX beside Tooru himself
      if (this.frameCount % 8 === 4) {
        const tooruSideX = f.x + (Math.random() > 0.5 ? -28 : 38);
        const tooruSideY = f.y - 15 + (Math.random() * 30 - 15);
        const tooruGlyph = Math.random() < 0.7 ? 'ゴ' : (Math.random() < 0.5 ? 'ド' : '災');
        this.addMenacingParticle(tooruSideX, tooruSideY, tooruGlyph, '#ef4444');
      }

      // PASSIVE: "LOGIC OF CALAMITY" - Trigger when enemy approaches, pursues or attacks Tooru (same dimension only)
      const isSameDimension = !!f.isParallelWorld === !!opponent.isParallelWorld;
      const isOpponentApproaching = isSameDimension && ((opponent.facing === 'right' && opponent.x < f.x && opponent.vx > 0.3) ||
                                    (opponent.facing === 'left' && opponent.x > f.x && opponent.vx < -0.3));
      const isOpponentAttacking = isSameDimension && ['punch', 'barrage', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'ultimate', 'star_finger', 'knife_throw', 'road_roller', 'clacker_boomerang', 'ray_of_light', 'homing_shard'].includes(opponent.action);
      const dist = Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2));

      const isPursuing = isSameDimension && ((isOpponentApproaching && dist < 850) || (isOpponentAttacking && dist < 900) || (dist < 400));
      opponent.isPursuing = isPursuing;

      // TIME STOP WEAKNESS RULE (CRUCIAL):
      // If Time Stop is active, Calamity flow is totally broken and Tooru is frozen & vulnerable!
      if (this.timeStopState.isActive) {
        f.isCalamityCounterActive = false;
        f.isHeadDoctorDisguise = false;
        f.invulnerableTimer = 0;
      } else {
        // Normal time flow -> Calamity logic is highly active and potent!
        if (isPursuing && (!f.calamityCooldownTimer || f.calamityCooldownTimer <= 0)) {
          this.triggerCalamity(f, opponent);
          const cd = f.isHeadDoctorDisguise ? 20 : 32;
          f.calamityCooldownTimer = cd;
        }
      }

      // Wonder of U / Tooru: Calamity Highway Traffic Convoy (10 Cars every 15 seconds)
      if (!this.timeStopState.isActive && f.hp > 0) {
        if (f.calamityCarConvoyTimer === undefined) {
          f.calamityCarConvoyTimer = 900; // 15 seconds at 60 FPS
        } else if (f.calamityCarConvoyTimer > 0) {
          f.calamityCarConvoyTimer--;
          if (f.calamityCarConvoyTimer === 0) {
            this.spawnCalamityCarConvoy(f, opponent, 10);
            f.calamityCarConvoyTimer = 900; // Reset every 15s
          }
        }
      }
    }


    // Crumple state (stagger on knees before falling)
    if (f.crumpleTimer && f.crumpleTimer > 0) {
      f.crumpleTimer--;
      f.vx *= 0.82;
      if (f.crumpleTimer <= 0) {
        f.isCrumpled = false;
        f.action = 'knockdown';
        f.actionTimer = 22;
        f.actionDuration = 22;
      }
    }

    // Energy management: Passive energy regen for all fighters so special moves are readily usable
    f.energy = Math.min(f.maxEnergy, f.energy + ENERGY_REGEN_PER_FRAME);
    if (this.timeStopState.isActive && f.timeStopActiveTimer > 0) {
      // Offensive momentum for active fighter in stopped time
      f.energy = Math.min(f.maxEnergy, f.energy + 0.35);
    }

    // Smooth Stand / Hamon Aura fade transition
    const shouldShowAura = f.isStandActive || (!f.hasStand && (f.action !== 'idle' || f.energy >= 40));
    if (shouldShowAura) {
      f.standAlpha = Math.min(1, f.standAlpha + 0.1);
    } else {
      f.standAlpha = Math.max(0, f.standAlpha - 0.08);
    }

    // 1. Defeat / KO State Lock
    if (f.hp <= 0) {
      f.action = 'dead';
      f.isStandActive = false;
      this.applyPhysics(f);
      return;
    }

    // 2. Knockdown State (Lying on ground)
    if (f.action === 'knockdown') {
      f.vx *= 0.85;
      this.applyPhysics(f);
      if (f.actionTimer && f.actionTimer > 0) {
        f.actionTimer--;
      }
      if (!f.actionTimer || f.actionTimer <= 0) {
        if (f.hp <= 0) {
          f.action = 'dead';
        } else {
          f.action = 'wakeup';
          f.actionTimer = 18;
          f.actionDuration = 18;
          f.invulnerableTimer = 22;
        }
      }
      return;
    }

    // 3. Wakeup State (Pushing up off floor)
    if (f.action === 'wakeup') {
      this.applyPhysics(f);
      if (f.actionTimer && f.actionTimer > 0) {
        f.actionTimer--;
      }
      if (!f.actionTimer || f.actionTimer <= 0) {
        f.action = 'idle';
      }
      return;
    }

    // 4. Knockback State (Flying backward in air/recoil)
    if (f.action === 'knockback') {
      if (f.hitReactionTimer && f.hitReactionTimer > 0) {
        f.hitReactionTimer--;
      }
      if (f.actionTimer && f.actionTimer > 0) {
        f.actionTimer--;
      }
      if (f.hitStun && f.hitStun > 0) {
        f.hitStun--;
      }
      this.applyPhysics(f);

      if (f.isGrounded) {
        // Ground Bounce check for vertical spike slams
        if ((f.hitReactionType === 'ground_slam_spike' || f.isGroundBouncing) && (!f.groundBounceCount || f.groundBounceCount === 0)) {
          f.groundBounceCount = 1;
          f.isGroundBouncing = false;
          f.vy = -10.5; // High bounce for extended combo follow-up!
          f.isGrounded = false;
          f.hitStun = 30;
          soundManager.playHeavyImpact();
          this.addShockwave(f.x + f.width / 2, GROUND_Y - 10, '#facc15');
          this.addTextParticle(f.x + f.width / 2, GROUND_Y - 45, '💥 GROUND BOUNCE!', '#facc15');
          this.screenShake = Math.max(this.screenShake, 10);
          return;
        }

        f.action = 'knockdown';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.vx *= 0.3;
        f.groundBounceCount = 0;
        soundManager.playHit(false);
        this.addShockwave(f.x + f.width / 2, GROUND_Y - 10, '#94a3b8');
      } else {
        // Air Tech / Ukemi Recovery: when falling in air and hitstun is fading, player or AI can recover!
        if (f.hitStun > 0 && f.hitStun <= 18) {
          const wantsTech = input && (input.jump || input.punch);
          const aiWantsTech = (f.id !== 'player') && Math.random() < 0.25;
          if (wantsTech || aiWantsTech) {
            f.action = 'air_tech';
            f.actionTimer = 16;
            f.actionDuration = 16;
            f.hitStun = 0;
            f.invulnerableTimer = 18;
            f.vy = -4.8;
            const techDir = f.facing === 'right' ? -1 : 1;
            f.vx = techDir * 4.2;
            soundManager.playWhoosh();
            this.addTextParticle(f.x + f.width / 2, f.y - 35, '💨 AIR TECH RECOVERY!', '#38bdf8');
            this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
            this.applyPhysics(f);
            return;
          }
        }
        if ((!f.hitReactionTimer || f.hitReactionTimer <= 0) && (!f.actionTimer || f.actionTimer <= 0) && (!f.hitStun || f.hitStun <= 0)) {
          // Timeout recovery if airborne knockback takes too long
          f.action = 'jump';
        }
      }
      return;
    }

    // 4.2. Air Tech Recovery Flip
    if (f.action === 'air_tech') {
      if (f.actionTimer && f.actionTimer > 0) f.actionTimer--;
      f.vx *= 0.92;
      this.applyPhysics(f);
      if (f.isGrounded || !f.actionTimer || f.actionTimer <= 0) {
        f.action = f.isGrounded ? 'idle' : 'jump';
        f.actionTimer = 0;
      }
      return;
    }

    // 4.5. Ragdoll State (Full dynamic physics flinging & tumbling)
    if (f.action === 'ragdoll' || f.isRagdoll) {
      if (f.hitReactionTimer && f.hitReactionTimer > 0) {
        f.hitReactionTimer--;
      }
      if (f.actionTimer && f.actionTimer > 0) {
        f.actionTimer--;
      }
      if (f.hitStun && f.hitStun > 0) {
        f.hitStun--;
      }
      if (f.ragdollTimer && f.ragdollTimer > 0) {
        f.ragdollTimer--;
      }
      this.applyPhysics(f);
      return;
    }

    // 5. Guard Break state lock
    if (f.guardBreakTimer && f.guardBreakTimer > 0) {
      f.guardBreakTimer--;
      f.action = 'guard_break';
      this.applyPhysics(f);
      if (f.guardBreakTimer <= 0) {
        f.action = f.isGrounded ? 'idle' : 'jump';
      }
      return;
    }

    // 5.5. Petrified in Angelo Rock Monolith Lock (Josuke Skill 2)
    if (f.angeloWallTimer && f.angeloWallTimer > 0) {
      f.vx = 0;
      f.vy = 0;
      f.y = GROUND_Y - f.height;
      f.isGrounded = true;
      f.isStandActive = false;
      f.standAlpha = 0;
      f.action = 'hit';
      f.actionTimer = 0;
      this.applyPhysics(f);
      return;
    }

    // 6. Hitstun & Hit Reaction lock (Non-knockdown ground hits: flinch, stagger, beam/barrage pin)
    if (f.hitStun > 0 || (f.hitReactionTimer && f.hitReactionTimer > 0) || f.action === 'hit') {
      if (f.hitStun > 0) {
        f.hitStun--;
      }
      if (f.hitReactionTimer && f.hitReactionTimer > 0) {
        f.hitReactionTimer--;
      }

      // Smooth grounded deceleration for hits (punch impacts slide to rest)
      if (f.isGrounded && !f.isPinnedInBeam) {
        f.vx *= 0.85;
      }
      this.applyPhysics(f);

      if (f.hitStun <= 0 && (!f.hitReactionTimer || f.hitReactionTimer <= 0)) {
        f.action = f.isGrounded ? 'idle' : 'jump';
        f.isPinnedInBeam = false;
        f.isPinnedInBarrage = false;
        f.hitReactionType = undefined;
      }
      return;
    }

    // Grabbed by Command Grab (locked in place while attacker pummels)
    if (f.action === 'grabbed') {
      if (f.actionTimer && f.actionTimer > 0) {
        f.actionTimer--;
      }
      f.vx = 0;
      f.vy = 0;
      if (!f.actionTimer || f.actionTimer <= 0) {
        f.action = f.isGrounded ? 'idle' : 'jump';
      }
      return;
    }



    // Handle Active Action Execution Timers
    if (f.actionTimer > 0) {
      const op = (f.id === 'player' || f.id === 'teammate') ? this.ai : this.player;
      const isSlowed = op && op.charId === 'king_crimson' && op.isTimeEraseActive;
      if (!isSlowed || this.frameCount % 4 === 0) {
        f.actionTimer--;
        this.handleActionFrame(f, opponent, input);
      }

      if (f.actionTimer <= 0) {
        f.isParrying = false;
        if (f.action === 'tommy_gun') {
          f.cooldowns.skill4 = TOMMY_GUN_COOLDOWN;
        }
        f.action = f.isGrounded ? 'idle' : 'jump';
        if (f.grabbedTarget) {
          opponent.action = 'idle';
          f.grabbedTarget = null;
        }
      }

      this.applyPhysics(f);
      return;
    }

    // STATUS EFFECT & PASSIVE TIMERS
    // 0. Silenced by Whitesnake Disc Steal or Josuke Crazy Diamond Barrage Skill Lock (Blocks skill activations)
    if (f.silencedTimer && f.silencedTimer > 0) {
      f.silencedTimer--;
      input.skill1 = false;
      input.skill2 = false;
      input.skill3 = false;
      input.skill4 = false;
      input.skill5 = false;
      input.timeStop = false;
      input.ultimate = false;
      if (this.frameCount % 20 === 0) {
        this.addTextParticle(f.x + f.width / 2, f.y - 30, '🚫 SKILL LOCKED (1s)', '#f43f5e');
      }
    }

    // 0.1. Frozen in Place by Stand Disc Command (1.5s stun)
    if (f.discFrozenTimer && f.discFrozenTimer > 0) {
      f.discFrozenTimer--;
      f.vx = 0;
      f.vy = 0;
      f.action = 'hit';
      if (this.frameCount % 15 === 0) {
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#e2e8f0');
      }
      this.applyPhysics(f);
      return;
    }

    // 0.2. C-Moon Gravity Shield Timer
    if (f.cmoonShieldTimer && f.cmoonShieldTimer > 0) {
      f.cmoonShieldTimer--;
    }

    // 0.3. Made in Heaven Time Acceleration Timer (Instantly refreshes all MiH cooldowns)
    if (f.mihTimeAccelTimer && f.mihTimeAccelTimer > 0) {
      f.mihTimeAccelTimer--;
      if (f.charId === 'pucci') {
        f.cooldowns.skill1 = 0;
        f.cooldowns.skill2 = 0;
        f.cooldowns.skill3 = 0;
        f.cooldowns.skill4 = 0;
        f.cooldowns.ultimate = 0;
      }
    }

    // 0.4. C-Moon Passive: Gravitational Repulsion (Gently repulses opponent when within 140px)
    if (f.charId === 'pucci' && f.pucciForm === 'cmoon' && opponent && opponent.hp > 0) {
      const pCx = f.x + f.width / 2;
      const opCx = opponent.x + opponent.width / 2;
      const dist = Math.abs(pCx - opCx);
      if (dist < 140 && dist > 10) {
        const pushDir = opCx > pCx ? 1 : -1;
        opponent.vx += pushDir * (140 - dist) * 0.025;
        if (this.frameCount % 20 === 0) {
          this.addSpark(opponent.x + opponent.width / 2, opponent.y + opponent.height / 2, '#22c55e');
        }
      }
    }

    // 0.5. Made in Heaven Passive: Velocity Acceleration
    if (f.charId === 'pucci' && f.pucciForm === 'made_in_heaven') {
      if (input.left || input.right) {
        f.mihSpeedStack = Math.min(1.8, (f.mihSpeedStack || 0) + 0.02);
      } else {
        f.mihSpeedStack = 0;
      }
    }

    // 0.6. Gappy Status Timers & Passive Mechanics
    // Friction Theft (Zero ground friction, fighter slips out of control)
    if (f.gappyFrictionTheftTimer && f.gappyFrictionTheftTimer > 0) {
      f.gappyFrictionTheftTimer--;
      if (f.isGrounded) {
        f.vx *= 0.995;
      }
      if (this.frameCount % 15 === 0) {
        this.addSpark(f.x + f.width / 2, f.y + f.height, '#38bdf8');
      }
    }

    // Sight Theft (Screen blackout vignette)
    if (f.gappySightTheftTimer && f.gappySightTheftTimer > 0) {
      f.gappySightTheftTimer--;
      if (this.frameCount % 20 === 0) {
        this.addTextParticle(f.x + f.width / 2, f.y - 25, '👁️ SIGHT THEFT', '#0f172a');
      }
    }

    // Sound Theft (Muted sound effects)
    if (f.gappySoundTheftTimer && f.gappySoundTheftTimer > 0) {
      f.gappySoundTheftTimer--;
      if (this.frameCount % 20 === 0) {
        this.addTextParticle(f.x + f.width / 2, f.y - 25, '🔇 SOUND THEFT', '#64748b');
      }
    }

    // Attack Theft (50% reduced attack power)
    if (f.gappyAttackTheftTimer && f.gappyAttackTheftTimer > 0) {
      f.gappyAttackTheftTimer--;
      if (this.frameCount % 20 === 0) {
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '📉 ATK DRAIN (-50%)', '#0284c7');
      }
    }

    // Bubble Shield Timer
    if (f.gappyShieldTimer && f.gappyShieldTimer > 0) {
      f.gappyShieldTimer--;
      f.gappyShieldActive = true;
      if (this.frameCount % 12 === 0) {
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#7dd3fc');
      }
    } else {
      f.gappyShieldActive = false;
    }

    // Suspended in Bubble Trap
    if (f.gappyTrappedTimer && f.gappyTrappedTimer > 0) {
      f.gappyTrappedTimer--;
      f.vy = Math.sin(this.frameCount * 0.1) * 0.5;
      f.vx = 0;
      f.action = 'stun';
      if (this.frameCount % 15 === 0) {
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
      }
      this.applyPhysics(f);
      return;
    }

    // Active Friction Strips (Floor traps)
    if (f.gappyFrictionStrips && f.gappyFrictionStrips.length > 0) {
      f.gappyFrictionStrips = f.gappyFrictionStrips.filter(strip => {
        strip.timer--;
        if (opponent && opponent.isGrounded) {
          const opCenterX = opponent.x + opponent.width / 2;
          if (Math.abs(opCenterX - strip.x) < strip.width / 2) {
            opponent.gappyFrictionTheftTimer = 60; // 1s zero friction slip
            opponent.vx += (opCenterX > strip.x ? 5 : -5);
          }
        }
        return strip.timer > 0;
      });
    }

    // FUNNY VALENTINE TIMERS & DUAL-DIMENSION MECHANICS (PART 7)
    if (f.charId === 'funny_valentine') {
      // Love Train Active
      if (f.loveTrainTimer && f.loveTrainTimer > 0) {
        f.loveTrainTimer--;
        f.isLoveTrainActive = true;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 2);
        if (this.frameCount % 8 === 0) {
          this.addSpark(f.x + (Math.random() * 80 - 40), f.y - 20 + Math.random() * 100, '#fbbf24');
        }
      } else {
        f.isLoveTrainActive = false;
      }
    }

    // DIPEZ MECHANICS & TIMERS
    if (f.charId === 'dipez') {

      // Arm lost drawback when Arm Laser Cannon finishes in base form
      if (f.action === 'dipez_laser_cannon' && f.actionTimer === 1 && f.dipezForm !== 'pure_light') {
        f.dipezArmLostTimer = 300; // 5 seconds missing arms!
        soundManager.playDipezWhaa();
        for (let s = 0; s < 12; s++) {
          this.addSpark(f.x + (s % 2 === 0 ? 10 : f.width - 10), f.y + 20, '#ef4444');
        }
      }

      // Evolved Form: Pure Light Form passive continuous invincibility auto-blink & photon aura
      if (f.dipezForm === 'pure_light') {
        f.isInvulnerable = true;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 2);

        // Pure light cannot be burned, bled, blinded, silenced, frozen or trapped
        f.burnedTimer = 0;
        if (f.bleedTimer) f.bleedTimer = 0;
        if (f.poisonTimer) f.poisonTimer = 0;
        if (f.blindedTimer) f.blindedTimer = 0;
        if (f.silencedTimer) f.silencedTimer = 0;
        if (f.discFrozenTimer) f.discFrozenTimer = 0;
        if (f.gappyTrappedTimer) f.gappyTrappedTimer = 0;

        if (this.frameCount % 4 === 0) {
          this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#ffffff');
          this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#fef08a');
        }

        // Star Maker active damage tick (Arena white burn - HIGH DAMAGE!)
        if (f.dipezStarMakerActive && f.dipezStarMakerTimer && f.dipezStarMakerTimer > 0) {
          f.dipezStarMakerTimer--;
          if (this.frameCount % 4 === 0) {
            const allTargets = this.getAllActiveFighters();
            for (const target of allTargets) {
              if (target && target.hp > 0 && target.id !== f.id && target.team !== f.team) {
                this.applyRawDamage(target, 16, 0, -1, f);
                target.burnedTimer = Math.max(target.burnedTimer || 0, 180);
                this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#ffffff');
                this.addSpark(target.x + Math.random() * target.width, target.y + Math.random() * target.height, '#38bdf8');
              }
            }
          }
          if (f.dipezStarMakerTimer <= 0) {
            f.dipezStarMakerActive = false;
          }
        }
      }
    }

    // Wally Wable / Perstein timers
    if (f.charId === 'perstein') {
      if (f.persteinDeflectionTimer && f.persteinDeflectionTimer > 0) {
        f.persteinDeflectionTimer--;
      }
      if (f.persteinDeflectReactionTimer && f.persteinDeflectReactionTimer > 0) {
        f.persteinDeflectReactionTimer--;
      }
    }

    if (f.persteinChainBindTimer && f.persteinChainBindTimer > 0) {
      f.persteinChainBindTimer--;
    }

    // Universal Perstein Flesh Shred / Bleed status effect on affected fighters
    if (f.persteinShredTimer && f.persteinShredTimer > 0) {
      f.persteinShredTimer--;
      if (this.frameCount % 20 === 0) {
        f.hp = Math.max(1, f.hp - 3);
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#ef4444');
        this.addTextParticle(f.x + f.width / 2, f.y - 30, '🩸 FLESH TEAR BLEED (-3 HP)', '#ef4444');
      }
    }

    // TRIGGER ACTIONS BASED ON CHARACTER SKILLS
    const isJotaro = f.charId === 'jotaro';
    const isDio = f.charId === 'dio';
    const isJonathan = f.charId === 'jonathan';
    const isYoungJoseph = f.charId === 'joseph_young';
    const isOldJoseph = f.charId === 'joseph_old';
    const isDiavolo = f.charId === 'king_crimson';
    const isPolnareff = f.charId === 'silver_chariot';
    const isCrazyDiamond = f.charId === 'crazy_diamond';
    const isTooru = f.charId === 'tooru';
    const isPucci = f.charId === 'pucci';
    const isGappy = f.charId === 'gappy';
    const isValentine = f.charId === 'funny_valentine';
    const isDipez = f.charId === 'dipez';

    // Universal Time Stop / Time Erase Trigger (Key T / Button T:STOP / T:ERASE)
    if ((input.timeStop || (isDiavolo && (f.doppioStage ?? 3) === 3 && input.ultimate)) && f.cooldowns.timeStop <= 0) {
      if (isDiavolo && (f.doppioStage ?? 3) === 3 && (f.energy >= TIME_ERASE_COST || this.matchConfig.mode === 'training')) {
        this.activateTimeErase(f, opponent);
        this.applyPhysics(f);
        return;
      } else if ((isJotaro || isDio) && input.timeStop && (f.energy >= TIME_STOP_ENERGY_COST || this.matchConfig.mode === 'training')) {
        this.activateTimeStop(f);
        this.applyPhysics(f);
        return;
      }
    }

    // =========================================================================
    // ★★★ STANDLESS VALENTINE CLONE ACTION HANDLER ★★★
    // Absolute Rule: Clones have NO Stand. Only barehand melee & Colt revolver shots!
    // =========================================================================
    if (f.isValentineClone || (f.isClone && f.charId === 'funny_valentine')) {
      f.hasStand = false;
      f.isStandActive = false;
      f.standAlpha = 0;

      // 1. Colt .45 Revolver Shot (Triggered by any skill key, barrage, or ranged input)
      if ((input.skill1 || input.skill2 || input.skill3 || input.skill4 || input.skill5 || input.ultimate || input.barrage) && f.cooldowns.punch <= 0) {
        if (opponent && opponent.hp > 0 && opponent.id !== f.id && opponent.team !== f.team) {
          f.facing = opponent.x >= f.x ? 'right' : 'left';
        }
        f.action = 'valentine_clone_shoot';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.punch = 20;
        f.vx *= 0.4;
        this.applyPhysics(f);
        return;
      }

      // 2. Barehanded Melee Punches / Kicks
      if (input.punch && f.cooldowns.punch <= 0) {
        if (opponent && opponent.hp > 0 && opponent.id !== f.id && opponent.team !== f.team) {
          f.facing = opponent.x >= f.x ? 'right' : 'left';
        }
        const isKick = Math.random() < 0.35;
        f.action = isKick ? 'valentine_clone_kick' : 'valentine_clone_punch';
        f.actionTimer = isKick ? 20 : 16;
        f.actionDuration = isKick ? 20 : 16;
        f.cooldowns.punch = isKick ? 18 : 14;
        const dir = f.facing === 'right' ? 1 : -1;
        f.vx = dir * (isKick ? 7.5 : 5.5);
        this.applyPhysics(f);
        return;
      }

      // Basic jump / movement for clones
      if (input.jump && f.isGrounded) {
        f.vy = JUMP_FORCE;
        f.isGrounded = false;
        f.action = 'jump';
      } else if (input.left) {
        f.vx -= MOVE_SPEED;
        f.facing = 'left';
        if (f.isGrounded && f.action === 'idle') f.action = 'walk';
      } else if (input.right) {
        f.vx += MOVE_SPEED;
        f.facing = 'right';
        if (f.isGrounded && f.action === 'idle') f.action = 'walk';
      }

      this.applyPhysics(f);
      return;
    }

    // 1. Stand Toggle / Equip Sword Stance Toggle / Mount George Toggle
    if (input.toggleStand && f.cooldowns.standToggle <= 0 && isDiavolo && (f.doppioStage ?? 0) === 0) {
      f.cooldowns.standToggle = 25;
      soundManager.playDoppioNoAnswer();
      this.addTextParticle(f.x + f.width / 2, f.y - 40, '🐸 BELUM BISA PANGGIL STAND! TELPON BOSS DULU! (TURURURURU!)', '#f472b6');
    } else if (input.toggleStand && f.cooldowns.standToggle <= 0 && (f.hasStand || isJonathan || f.charId === 'michael')) {
      if (f.charId === 'michael') {
        if (f.isGeorgeMounted) {
          // Voluntary dismount onto foot
          f.isGeorgeMounted = false;
          f.georgeMountingTimer = 0;
          f.georgePendingRemount = false;
          f.cooldowns.standToggle = 30;
          f.vy = -4.2;
          f.vx = f.facing === 'right' ? 2.5 : -2.5;
          soundManager.playGeorgeGallop();
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '🐎 DISMOUNT (ON FOOT)', '#94a3b8');
        } else if ((f.georgeMountingTimer || 0) <= 0) {
          // Dynamic Vault-Mount Sequence: Stay on foot initially while George gallops in!
          f.isGeorgeMounted = false;
          f.georgeMountingTimer = 34; // 34-frame athletic approach & vault-mount sequence
          f.georgeMountingPhase = 'approach';
          f.georgeState = 'mounting';
          f.georgeX = f.facing === 'right' ? f.x - 260 : f.x + 260;
          f.georgeY = f.y;
          f.cooldowns.standToggle = 38;
          soundManager.playGeorgeNeigh();
          soundManager.playGeorgeGallop();
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '🐎 CALLING GEORGE THE THOROUGHBRED!', '#facc15');
          this.addShockwave(f.x + f.width / 2, f.y + f.height - 10, '#facc15');
          for (let i = 0; i < 12; i++) {
            this.addSpark(
              f.x + f.width / 2 + (Math.random() * 60 - 30),
              f.y + f.height - 10 + (Math.random() * 20 - 10),
              '#facc15'
            );
          }
        }
      } else if (isJonathan) {
        f.isSwordEquipped = !f.isSwordEquipped;
        f.isStandActive = f.isSwordEquipped; // Active Hamon aura glow
        f.cooldowns.standToggle = 25;
        soundManager.playSwordSlash();
        const msg = f.isSwordEquipped ? '⚔️ CHANGE: LUCK & PLUCK EQUIPPED!' : '👊 CHANGE: BARE HANDS STANCE';
        this.addTextParticle(f.x + f.width / 2, f.y - 40, msg, f.isSwordEquipped ? '#38bdf8' : '#facc15');
        for (let i = 0; i < 10; i++) {
          this.addSpark(
            f.x + f.width / 2 + (Math.random() * 40 - 20),
            f.y + f.height / 2 + (Math.random() * 40 - 20),
            f.isSwordEquipped ? '#38bdf8' : '#facc15'
          );
        }
      } else {
        f.isStandActive = !f.isStandActive;
        f.cooldowns.standToggle = 25;
        this.addTextParticle(f.x + f.width / 2, f.y - 30, f.isStandActive ? `[${f.standName}]` : 'STAND OFF', '#facc15');
        for (let i = 0; i < 6; i++) {
          this.addSpark(f.x + f.width / 2, f.y + f.height / 2, f.isStandActive ? '#c084fc' : '#94a3b8');
        }
      }
    }

    // 2. JONATHAN JOESTAR SKILLS (HAMON & LUCK/PLUCK SWORD)
    if (isJonathan) {
      // Skill 1: Zoom Punch (Bare hand) / Pluck Hamon Thrust (Sword)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= ZOOM_PUNCH_COST || this.matchConfig.mode === 'training')) {
        f.action = 'zoom_punch';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = ZOOM_PUNCH_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= ZOOM_PUNCH_COST;
        if (f.isSwordEquipped) {
          soundManager.playSwordSlash();
          this.addTextParticle(f.x + f.width / 2, f.y - 35, 'PLUCK HAMON THRUST!', '#38bdf8');
        } else {
          soundManager.playHamonBuzz();
          this.addTextParticle(f.x + f.width / 2, f.y - 35, 'ZOOM PUNCH!', '#facc15');
        }
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Hamon Breathing & Heal / Blade Resonance
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= HAMON_HEAL_COST || this.matchConfig.mode === 'training')) {
        f.action = 'hamon_heal';
        f.actionTimer = HAMON_HEAL_DURATION;
        f.actionDuration = HAMON_HEAL_DURATION;
        f.cooldowns.skill2 = HAMON_HEAL_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= HAMON_HEAL_COST;
        const healAmt = f.isSwordEquipped ? HAMON_HEAL_AMOUNT + 30 : HAMON_HEAL_AMOUNT;
        f.hp = Math.min(f.maxHp, f.hp + healAmt);
        f.energy = Math.min(f.maxEnergy, f.energy + HAMON_HEAL_ENERGY_GAIN);
        soundManager.playHamonBreath();
        const msg = f.isSwordEquipped ? `+${healAmt} HP (BLADE RESONANCE)` : `+${healAmt} HP (SENDO HEAL)`;
        this.addTextParticle(f.x + f.width / 2, f.y - 40, msg, '#4ade80');
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Sendo Wave (Bare hand) / Sunlight Crescent Wave (Sword)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= SENDO_WAVE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'sendo_wave';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill3 = SENDO_WAVE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= SENDO_WAVE_COST;
        if (f.isSwordEquipped) {
          this.spawnSwordCrescentWave(f);
          soundManager.playSwordSlash();
          this.addTextParticle(f.x + f.width / 2, f.y - 35, 'SUNLIGHT CRESCENT WAVE!', '#38bdf8');
        } else {
          this.spawnSendoWave(f);
          soundManager.playHamonBuzz();
          this.addTextParticle(f.x + f.width / 2, f.y - 35, 'SENDO HAMON OVERDRIVE!', '#eab308');
        }
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Scarlet Overdrive Stance (Bare hand) / Pluck Counter Stance (Sword)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= HAMON_COUNTER_COST || this.matchConfig.mode === 'training')) {
        f.action = 'hamon_counter';
        f.actionTimer = 40;
        f.actionDuration = 40;
        f.cooldowns.skill4 = HAMON_COUNTER_COOLDOWN;
        f.isParrying = true;
        if (this.matchConfig.mode !== 'training') f.energy -= HAMON_COUNTER_COST;
        soundManager.playHamonBuzz();
        const counterMsg = f.isSwordEquipped ? 'PLUCK BLADE COUNTER STANCE' : 'SCARLET OVERDRIVE STANCE';
        this.addTextParticle(f.x + f.width / 2, f.y - 35, counterMsg, f.isSwordEquipped ? '#38bdf8' : '#f97316');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Sword of Luck & Pluck / Change Equip & Slash
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= LUCK_PLUCK_COST || this.matchConfig.mode === 'training')) {
        f.action = 'luck_pluck_slash';
        f.actionTimer = 28;
        f.actionDuration = 28;
        f.cooldowns.skill5 = LUCK_PLUCK_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= LUCK_PLUCK_COST;
        // Auto-equip sword on skill 5 if not equipped
        if (!f.isSwordEquipped) {
          f.isSwordEquipped = true;
          f.isStandActive = true;
        }
        const dir = f.facing === 'right' ? 1 : -1;
        f.vx = dir * 12;
        soundManager.playSwordSlash();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'LUCK & PLUCK BARRAGE SLASH!', '#38bdf8');
        this.applyPhysics(f);
        return;
      }

      // Ultimate: Sunlight Yellow Overdrive!!
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= SUNLIGHT_ULTIMATE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'sunlight_ultimate';
        f.actionTimer = SUNLIGHT_ULTIMATE_DURATION;
        f.actionDuration = SUNLIGHT_ULTIMATE_DURATION;
        f.cooldowns.ultimate = SUNLIGHT_ULTIMATE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= SUNLIGHT_ULTIMATE_COST;
        soundManager.playHamonBreath();
        const ultMsg = f.isSwordEquipped ? '★ SUNLIGHT YELLOW PLUCK OVERDRIVE!! ★' : '★ SUNLIGHT YELLOW OVERDRIVE!! ★';
        this.addTextParticle(f.x + f.width / 2, f.y - 60, ultMsg, f.isSwordEquipped ? '#38bdf8' : '#facc15');
        this.screenShake = 14;
        this.applyPhysics(f);
        return;
      }
    }

    // 3. YOUNG JOSEPH JOESTAR SKILLS (BATTLE TENDENCY)
    if (isYoungJoseph) {
      // Skill 1: Clacker Volley
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= CLACKER_VOLLEY_COST || this.matchConfig.mode === 'training')) {
        f.action = 'clacker_volley';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = CLACKER_VOLLEY_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= CLACKER_VOLLEY_COST;
        this.spawnClackerVolley(f);
        soundManager.playClackerRattle();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'CLACKER VOLLEY!', '#34d399');
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Tsugi ni Omae wa... (Next Line Counter)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= NEXT_LINE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'next_line';
        f.actionTimer = 40;
        f.actionDuration = 40;
        f.cooldowns.skill2 = NEXT_LINE_COOLDOWN;
        f.isParrying = true;
        if (this.matchConfig.mode !== 'training') f.energy -= NEXT_LINE_COST;
        soundManager.playHamonBuzz();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'TSUGI NI OMAE WA... TO IU!', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Grenade Strap Overdrive (Skill O)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= HAMON_ELBOW_COST || this.matchConfig.mode === 'training')) {
        f.action = 'hamon_elbow';
        f.actionTimer = 26;
        f.actionDuration = 26;
        f.cooldowns.skill3 = HAMON_ELBOW_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= HAMON_ELBOW_COST;
        const dir = f.facing === 'right' ? 1 : -1;
        f.vx = dir * 18;
        soundManager.playHamonBuzz();
        soundManager.playOverdriveExplosion();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '💣 GRENADE STRAP OVERDRIVE! (SKILL O) 💥', '#10b981');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 20, '爆', '#ef4444');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Thompson SMG Full-Auto (Skill P - Up to 2.0s / 120 frames max)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= TOMMY_GUN_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tommy_gun';
        f.actionTimer = 120; // 2.0 seconds maximum continuous fire (120 frames)
        f.actionDuration = 120;
        f.cooldowns.skill4 = TOMMY_GUN_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOMMY_GUN_COST;
        soundManager.playTommyGun();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '🔫 THOMPSON SMG SPRAY!! 💥', '#ef4444');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 20, 'ダ', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Clacker Boomerang Overdrive
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= 30 || this.matchConfig.mode === 'training')) {
        f.action = 'clacker_boomerang';
        f.actionTimer = 28;
        f.actionDuration = 28;
        f.cooldowns.skill5 = 160;
        if (this.matchConfig.mode !== 'training') f.energy -= 30;
        f.vy = -10;
        soundManager.playClackerRattle();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'CLACKER LEAP OVERDRIVE!', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Ultimate: NIGERUNDAYO! Part 2 Biplane Crash Collision Attack!!
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= YOUNG_JOSEPH_ULTIMATE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'young_joseph_ultimate';
        f.actionTimer = 260; // 4.3 seconds total cutscene sequence
        f.actionDuration = 260;
        f.cooldowns.ultimate = YOUNG_JOSEPH_ULTIMATE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= YOUNG_JOSEPH_ULTIMATE_COST;
        
        // Escape direction: Joseph turns around and runs AWAY from his opponent!
        const escapeDir = (opponent && opponent.x >= f.x) ? -1 : 1;
        f.youngJosephUltEscapeDir = escapeDir;
        f.facing = escapeDir === 1 ? 'right' : 'left';
        f.invulnerableTimer = 260;

        soundManager.playHamonBuzz();
        this.addTextParticle(f.x + f.width / 2, f.y - 60, '🏃 NIGERUNDAYO!! BIPLANE CRASH ULTIMATE!! ✈️', '#facc15');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 25, '逃', '#ef4444');
        this.applyPhysics(f);
        return;
      }
    }

    // 4. OLD JOSEPH JOESTAR SKILLS (STARDUST CRUSADERS)
    if (isOldJoseph) {
      // Skill 1: Hermit Purple Grapple & Reel-In (U)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= HERMIT_GRAPPLE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'hermit_purple_grapple';
        f.actionTimer = 30;
        f.actionDuration = 30;
        f.cooldowns.skill1 = HERMIT_GRAPPLE_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= HERMIT_GRAPPLE_COST;
        this.spawnHermitVineGrab(f);
        soundManager.playHermitVineWhip();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌿⚡ HERMIT PURPLE: VINE GRAPPLE!', '#c084fc');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 15, 'ビシィ!', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Spirit Photo Divination & Weakness Scan (I)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= SPIRIT_PHOTO_COST || this.matchConfig.mode === 'training')) {
        f.action = 'spirit_photo';
        f.actionTimer = 36;
        f.actionDuration = 36;
        f.cooldowns.skill2 = SPIRIT_PHOTO_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= SPIRIT_PHOTO_COST;
        f.energy = Math.min(f.maxEnergy, f.energy + 55);
        f.invulnerableTimer = 65; // 1.1s psychic divination counter-frame
        soundManager.playSpiritPhotoFlash();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '📸 NENSHA! SPIRIT PHOTO DIVINATION!', '#e879f9');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 18, '念写!!', '#fef08a');
        this.applyPhysics(f);
        return;
      }

      // Skill 3: 20m Hermit Purple Electrified Ground Net (O)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= HERMIT_TRAP_COST || this.matchConfig.mode === 'training')) {
        f.action = 'hermit_trap';
        f.actionTimer = 38;
        f.actionDuration = 38;
        f.cooldowns.skill3 = HERMIT_TRAP_COOLDOWN;
        f.isStandActive = true;
        f.vx = 0;
        if (this.matchConfig.mode !== 'training') f.energy -= HERMIT_TRAP_COST;
        soundManager.playHermitVineWhip();
        soundManager.playHamonBuzz();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🕸️⚡ 20m HERMIT ELECTRIC GROUND NET!', '#a855f7');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 15, 'バチィ!', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Sunburst Rose Thorn Overdrive Whip (P)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= OVERDRIVE_TACTICS_COST || this.matchConfig.mode === 'training')) {
        const dir = f.facing === 'right' ? 1 : -1;
        f.action = 'overdrive_tactics';
        f.actionTimer = 34;
        f.actionDuration = 34;
        f.cooldowns.skill4 = OVERDRIVE_TACTICS_COOLDOWN;
        f.isStandActive = true;
        f.vx = dir * 5.5;
        if (f.isGrounded) {
          f.vy = -5.5;
          f.isGrounded = false;
        }
        if (this.matchConfig.mode !== 'training') f.energy -= OVERDRIVE_TACTICS_COST;
        soundManager.playHamonBuzz();
        soundManager.playHermitVineWhip();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌹⚡ SUNBURST ROSE THORN OVERDRIVE!!', '#facc15');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 15, '波紋!!', '#c084fc');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Hermit Body Armor & Polaroid Camera Smash (H)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= 25 || this.matchConfig.mode === 'training')) {
        const dir = f.facing === 'right' ? 1 : -1;
        f.action = 'camera_smash';
        f.actionTimer = 30;
        f.actionDuration = 30;
        f.cooldowns.skill5 = 150;
        f.isStandActive = true;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 28); // Hermit Purple + Hamon under-shirt armor!
        f.vx = dir * 10.5;
        if (this.matchConfig.mode !== 'training') f.energy -= 25;
        soundManager.playSpiritPhotoFlash();
        soundManager.playHamonBuzz();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '📸🦾 HERMIT ARMOR & POLAROID SMASH!', '#e2e8f0');
        this.applyPhysics(f);
        return;
      }

      // Ultimate: Hermit Purple: Sunlight Yellow Overdrive Surge!! (Y / L)
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= OLD_JOSEPH_ULTIMATE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'old_joseph_ultimate';
        f.actionTimer = 135;
        f.actionDuration = 135;
        f.cooldowns.ultimate = OLD_JOSEPH_ULTIMATE_COOLDOWN;
        f.isStandActive = true;
        f.invulnerableTimer = 140;
        f.vx = 0;
        if (this.matchConfig.mode !== 'training') f.energy -= OLD_JOSEPH_ULTIMATE_COST;
        soundManager.playOverdriveExplosion();
        soundManager.playHamonBuzz();
        this.addTextParticle(f.x + f.width / 2, f.y - 65, '★ OH MY GOD!! HERMIT SUNLIGHT YELLOW OVERDRIVE!! ★', '#facc15');
        this.addMenacingParticle(f.x + f.width / 2, f.y - 25, '波紋疾走!!', '#c084fc');
        this.screenShake = 18;
        this.applyPhysics(f);
        return;
      }
    }

    // 5. VINEGAR DOPPIO / DIAVOLO SKILLS (3-CALL PROGRESSION -> KING CRIMSON & EPITAPH)
    if (isDiavolo) {
      const stage = f.doppioStage ?? 3;

      // =========================================================================
      // STAGE 0: BASE VINEGAR DOPPIO (No Stand yet! All skill keys Call Boss 50/50)
      // =========================================================================
      if (stage === 0) {
        f.hasStand = false;
        f.isStandActive = false;
        f.standAlpha = 0;

        const anySkillPressed = input.skill1 || input.skill2 || input.skill3 || input.skill4 || input.skill5 || input.ultimate || input.timeStop;
        if (anySkillPressed && f.cooldowns.skill5 <= 0) {
          this.startDoppioCallBoss(f, 1);
          this.applyPhysics(f);
          return;
        }
      }
      // =========================================================================
      // STAGE 1: CALL #1 ANSWERED (Skill U = Epitaph + 1 KC Arm; Other skills = Call Boss #2)
      // =========================================================================
      else if (stage === 1) {
        f.hasStand = true;

        // Skill 1 (U): Epitaph Forecast & 1-Arm Counter Slash
        if (input.skill1) {
          if (
            f.isEpitaphActive &&
            (f.epitaphTimer || 0) < EPITAPH_DURATION - 28 &&
            f.action !== 'epitaph_forecast' &&
            f.action !== 'epitaph_counter_slash' &&
            opponent &&
            opponent.hp > 0 &&
            Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2)) < 280
          ) {
            this.triggerEpitaphCounter(f, opponent);
            this.applyPhysics(f);
            return;
          }
          if (f.cooldowns.skill1 <= 0 && (f.energy >= EPITAPH_COST || this.matchConfig.mode === 'training')) {
            f.action = 'epitaph_forecast';
            f.actionTimer = 26;
            f.actionDuration = 26;
            f.isEpitaphActive = true;
            f.epitaphTimer = EPITAPH_DURATION;
            f.cooldowns.skill1 = EPITAPH_COOLDOWN;
            f.isStandActive = true;
            f.standAlpha = 1.0;
            f.vx = 0;
            if (this.matchConfig.mode !== 'training') f.energy -= EPITAPH_COST;
            soundManager.playPoseSound('king_crimson');
            this.addTextParticle(f.x + f.width / 2, f.y - 45, '🔮 DOPPIO EPITAPH: PRECOGNITION + 1 KC ARM!', '#fb7185');
            this.addMenacingParticle(f.x + f.width / 2, f.y - 18, '墓碑銘 (EPITAPH)!!', '#e11d48');
            this.addShockwave(f.x + f.width / 2, f.y + 18, '#fb7185');
            this.applyPhysics(f);
            return;
          }
        }

        // Other skills (I, O, P, H, Y, T): Call Boss #2 (50/50 Chance to unlock 2 KC Arms & Risotto Fight Skills)
        const callSkillPressed = input.skill2 || input.skill3 || input.skill4 || input.skill5 || input.ultimate || input.timeStop;
        if (callSkillPressed && f.cooldowns.skill5 <= 0) {
          this.startDoppioCallBoss(f, 2);
          this.applyPhysics(f);
          return;
        }
      }
      // =========================================================================
      // STAGE 2: CALL #2 ANSWERED (2 KC Arms + Full Doppio vs Risotto Skillset + Skill H/T = 3rd Call to Transform!)
      // =========================================================================
      else if (stage === 2) {
        f.hasStand = true;

        // Skill 1 (U): Epitaph Forecast & Twin-Arm Counter Slash
        if (input.skill1) {
          if (
            f.isEpitaphActive &&
            (f.epitaphTimer || 0) < EPITAPH_DURATION - 28 &&
            f.action !== 'epitaph_forecast' &&
            f.action !== 'epitaph_counter_slash' &&
            opponent &&
            opponent.hp > 0 &&
            Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2)) < 280
          ) {
            this.triggerEpitaphCounter(f, opponent);
            this.applyPhysics(f);
            return;
          }
          if (f.cooldowns.skill1 <= 0 && (f.energy >= EPITAPH_COST || this.matchConfig.mode === 'training')) {
            f.action = 'epitaph_forecast';
            f.actionTimer = 26;
            f.actionDuration = 26;
            f.isEpitaphActive = true;
            f.epitaphTimer = EPITAPH_DURATION;
            f.cooldowns.skill1 = EPITAPH_COOLDOWN;
            f.isStandActive = true;
            f.standAlpha = 1.0;
            f.vx = 0;
            if (this.matchConfig.mode !== 'training') f.energy -= EPITAPH_COST;
            soundManager.playPoseSound('king_crimson');
            this.addTextParticle(f.x + f.width / 2, f.y - 45, '🔮 EPITAPH: TWIN-ARM PRECOGNITION!', '#fb7185');
            this.addMenacingParticle(f.x + f.width / 2, f.y - 18, '予知!!', '#e11d48');
            this.addShockwave(f.x + f.width / 2, f.y + 18, '#fb7185');
            this.applyPhysics(f);
            return;
          }
        }

        // Skill 2 (I): Risotto Iron Scalpel & Razor Throw
        if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= DOPPIO_SCALPEL_COST || this.matchConfig.mode === 'training')) {
          f.action = 'doppio_scalpel_throw';
          f.actionTimer = 24;
          f.actionDuration = 24;
          f.cooldowns.skill2 = DOPPIO_SCALPEL_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx *= 0.4;
          if (this.matchConfig.mode !== 'training') f.energy -= DOPPIO_SCALPEL_COST;
          soundManager.playRazorCut();
          this.addTextParticle(f.x + f.width / 2, f.y - 42, '🔪 DOPPIO VS RISOTTO: IRON SCALPEL BARRAGE!', '#e2e8f0');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 16, 'メスッ!!', '#f43f5e');
          this.applyPhysics(f);
          return;
        }

        // Skill 3 (O): Twin King Crimson Arms Fury Rush
        if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= DOPPIO_TWIN_ARMS_COST || this.matchConfig.mode === 'training')) {
          const dir = f.facing === 'right' ? 1 : -1;
          f.action = 'doppio_twin_arms_rush';
          f.actionTimer = 36;
          f.actionDuration = 36;
          f.cooldowns.skill3 = DOPPIO_TWIN_ARMS_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx = dir * 10;
          if (this.matchConfig.mode !== 'training') f.energy -= DOPPIO_TWIN_ARMS_COST;
          soundManager.playPoseSound('king_crimson');
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '🦾🦾 2 KING CRIMSON ARMS: FURY CLAW RUSH!!', '#e11d48');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 18, 'ウオオオッ!!', '#fb7185');
          this.applyPhysics(f);
          return;
        }

        // Skill 4 (P): Throat Scissors Riposte & Blood Blind (Risotto Fight Iconic Move)
        if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= DOPPIO_SCISSORS_COST || this.matchConfig.mode === 'training')) {
          const dir = f.facing === 'right' ? 1 : -1;
          f.action = 'doppio_scissors_riposte';
          f.actionTimer = 28;
          f.actionDuration = 28;
          f.cooldowns.skill4 = DOPPIO_SCISSORS_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx = dir * 7.5;
          if (this.matchConfig.mode !== 'training') f.energy -= DOPPIO_SCISSORS_COST;
          soundManager.playRazorCut();
          this.addTextParticle(f.x + f.width / 2, f.y - 42, '✂️🩸 THROAT SCISSORS RIPOSTE & BLOOD SPRAY!', '#dc2626');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 16, 'ハサミ!!', '#991b1b');
          this.applyPhysics(f);
          return;
        }

        // Ultimate (Y): Aerosmith Radar Bait & CO2 Strafing Run (Doppio vs Risotto Climax!)
        if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= DOPPIO_AEROSMITH_BAIT_COST || this.matchConfig.mode === 'training')) {
          const dir = f.facing === 'right' ? 1 : -1;
          f.action = 'doppio_aerosmith_bait';
          f.actionTimer = 46;
          f.actionDuration = 46;
          f.cooldowns.ultimate = DOPPIO_AEROSMITH_BAIT_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.invulnerableTimer = 40;
          f.vx = -dir * 9.5; // Doppio leaps back out of Aerosmith's line of fire!
          f.vy = -6.5;
          f.isGrounded = false;
          if (this.matchConfig.mode !== 'training') f.energy -= DOPPIO_AEROSMITH_BAIT_COST;
          soundManager.playTommyGun();
          this.addTextParticle(f.x + f.width / 2, f.y - 50, '✈️💥 AEROSMITH RADAR BAIT! SHOOT HIM, NARANCIA!!', '#facc15');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 20, 'ボラーレ・ヴィーア!!', '#f43f5e');
          this.applyPhysics(f);
          return;
        }

        // Skill 5 (H) or TimeStop (T): 3RD CALL TO BOSS (50/50 Chance -> Glitch & Anime Transform into Diavolo!)
        if ((input.skill5 || input.timeStop) && f.cooldowns.skill5 <= 0) {
          this.startDoppioCallBoss(f, 3);
          this.applyPhysics(f);
          return;
        }
      }
      // =========================================================================
      // STAGE 3: FULL DIAVOLO AWAKENED (KING CRIMSON & EPITAPH FULL MOVESET)
      // =========================================================================
      else {
        f.hasStand = true;

        // Skill 1 (U): Epitaph Forecast & Fate-Skip Counter
        if (input.skill1) {
          // Manual counter trigger if Epitaph has been active for at least 0.4s and opponent is within range
          if (
            f.isEpitaphActive &&
            (f.epitaphTimer || 0) < EPITAPH_DURATION - 28 &&
            f.action !== 'epitaph_forecast' &&
            f.action !== 'epitaph_counter_slash' &&
            opponent &&
            opponent.hp > 0 &&
            Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2)) < 280
          ) {
            this.triggerEpitaphCounter(f, opponent);
            this.applyPhysics(f);
            return;
          }
          if (f.cooldowns.skill1 <= 0 && (f.energy >= EPITAPH_COST || this.matchConfig.mode === 'training')) {
            f.action = 'epitaph_forecast';
            f.actionTimer = 26;
            f.actionDuration = 26;
            f.isEpitaphActive = true;
            f.epitaphTimer = EPITAPH_DURATION;
            f.cooldowns.skill1 = EPITAPH_COOLDOWN;
            f.isStandActive = true;
            f.standAlpha = 1.0;
            f.vx = 0;
            if (this.matchConfig.mode !== 'training') f.energy -= EPITAPH_COST;
            soundManager.playPoseSound('king_crimson');
            this.addTextParticle(f.x + f.width / 2, f.y - 45, '🔮 EPITAPH: FATE PRECOGNITION VISION!', '#fb7185');
            this.addMenacingParticle(f.x + f.width / 2, f.y - 18, '墓碑銘 (EPITAPH)!!', '#e11d48');
            this.addShockwave(f.x + f.width / 2, f.y + 18, '#fb7185');
            this.applyPhysics(f);
            return;
          }
        }

        // Skill 2 (I): King Crimson: Crimson Cleave (Twin-Arm Spatial X-Scythe Slash)
        if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= CRIMSON_CLEAVE_COST || this.matchConfig.mode === 'training')) {
          const dir = f.facing === 'right' ? 1 : -1;
          f.action = 'crimson_cleave';
          f.actionTimer = 30;
          f.actionDuration = 30;
          f.cooldowns.skill2 = CRIMSON_CLEAVE_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx = dir * 4.5;
          if (this.matchConfig.mode !== 'training') f.energy -= CRIMSON_CLEAVE_COST;
          soundManager.playPoseSound('king_crimson');
          this.addTextParticle(f.x + f.width / 2, f.y - 42, '⚔️ KING CRIMSON: CRIMSON CLEAVE!!', '#f43f5e');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 16, '斬!!', '#e11d48');
          this.applyPhysics(f);
          return;
        }

        // Skill 3 (O): King Crimson: Fate Crusher (Overhead Ground Rupture Slam)
        if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= FATE_CRUSHER_COST || this.matchConfig.mode === 'training')) {
          const dir = f.facing === 'right' ? 1 : -1;
          f.action = 'fate_crusher';
          f.actionTimer = 32;
          f.actionDuration = 32;
          f.cooldowns.skill3 = FATE_CRUSHER_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx = dir * 8.5;
          f.vy = -7.0;
          f.isGrounded = false;
          if (this.matchConfig.mode !== 'training') f.energy -= FATE_CRUSHER_COST;
          soundManager.playPoseSound('king_crimson');
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '💥 KING CRIMSON: FATE CRUSHER SLAM!!', '#e11d48');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 18, '破壊!!', '#fb7185');
          this.applyPhysics(f);
          return;
        }

        // Skill 4 (P): Arterial Blood Blind (Self Wrist-Slash Crescent Blood Splash)
        if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= FLESH_THROW_COST || this.matchConfig.mode === 'training')) {
          f.action = 'flesh_throw';
          f.actionTimer = 26;
          f.actionDuration = 26;
          f.cooldowns.skill4 = FLESH_THROW_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.vx = 0;
          if (this.matchConfig.mode !== 'training') f.energy -= FLESH_THROW_COST;
          this.addTextParticle(f.x + f.width / 2, f.y - 38, '🩸 ARTERIAL BLOOD BLIND SPLASH!', '#991b1b');
          this.applyPhysics(f);
          return;
        }

        // Skill 5 (H): Time Erase Ambush (Time-Skip Backstab Donut Impale)
        if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= TIME_ERASE_AMBUSH_COST || this.matchConfig.mode === 'training')) {
          f.action = 'time_erase_ambush';
          f.actionTimer = 36;
          f.actionDuration = 36;
          f.cooldowns.skill5 = TIME_ERASE_AMBUSH_COOLDOWN;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.invulnerableTimer = Math.max(f.invulnerableTimer, 26);
          if (this.matchConfig.mode !== 'training') f.energy -= TIME_ERASE_AMBUSH_COST;
          soundManager.playPoseSound('king_crimson');
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '👑 TIME ERASE: LETHAL DONUT IMPALE!!', '#e11d48');
          this.applyPhysics(f);
          return;
        }
      }
    }

    // 6. POLNAREFF SKILLS (SILVER CHARIOT)
    if (isPolnareff) {
      // Skill 1: Ray of Light (Rapid Thrust)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= RAY_OF_LIGHT_COST || this.matchConfig.mode === 'training')) {
        f.action = 'ray_of_light';
        f.actionTimer = 32;
        f.actionDuration = 32;
        f.cooldowns.skill1 = RAY_OF_LIGHT_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= RAY_OF_LIGHT_COST;
        soundManager.playRapierThrust();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '⚡ RAY OF LIGHT THRUST!', '#38bdf8');
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Armor Off (Speed 2x, Defense Penalty)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= ARMOR_OFF_COST || this.matchConfig.mode === 'training')) {
        f.isArmorOff = !f.isArmorOff;
        f.cooldowns.skill2 = ARMOR_OFF_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= ARMOR_OFF_COST;
        soundManager.playSwordSlash();
        const msg = f.isArmorOff ? '🛡️ ARMOR OFF: HYPER SPEED 2X!' : '🛡️ ARMOR ON: DEFENSE RESTORED';
        this.addTextParticle(f.x + f.width / 2, f.y - 40, msg, f.isArmorOff ? '#34d399' : '#64748b');
        for (let i = 0; i < 12; i++) {
          this.addSpark(
            f.x + f.width / 2 + (Math.random() * 40 - 20),
            f.y + f.height / 2 + (Math.random() * 40 - 20),
            f.isArmorOff ? '#34d399' : '#94a3b8'
          );
        }
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Shooting Sword (Rapier Launch)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= SHOOTING_SWORD_COST || this.matchConfig.mode === 'training')) {
        f.action = 'shooting_sword';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill3 = SHOOTING_SWORD_COOLDOWN;
        f.isShootingSwordCooldown = SHOOTING_SWORD_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= SHOOTING_SWORD_COST;
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '🗡️ SHOOTING SWORD LAUNCH!', '#38bdf8');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Upward Thrust (Overhead Launcher)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= UPWARD_THRUST_COST || this.matchConfig.mode === 'training')) {
        f.action = 'upward_thrust';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill4 = UPWARD_THRUST_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= UPWARD_THRUST_COST;
        f.vy = -12; // Leaping upward
        const dir = f.facing === 'right' ? 1 : -1;
        f.vx = dir * 6;
        soundManager.playSwordSlash();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '🗡️ UPWARD RAPIER THRUST!', '#38bdf8');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Afterimage Mirage (Multi-Clones - Requires Armor Off)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= AFTERIMAGE_MIRAGE_COST || this.matchConfig.mode === 'training')) {
        if (!f.isArmorOff) {
          this.addTextParticle(f.x + f.width / 2, f.y - 35, '⚠️ REQUIRES ARMOR OFF!', '#ef4444');
          f.cooldowns.skill5 = 30;
        } else {
          f.action = 'afterimage_mirage';
          f.actionTimer = 45;
          f.actionDuration = 45;
          f.cooldowns.skill5 = AFTERIMAGE_MIRAGE_COOLDOWN;
          f.isStandActive = true;
          if (this.matchConfig.mode !== 'training') f.energy -= AFTERIMAGE_MIRAGE_COST;
          soundManager.playRapierThrust();
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '⚡ AFTERIMAGE MIRAGE CLONES!!', '#34d399');
        }
        this.applyPhysics(f);
        return;
      }
    }

    // 7. JOSUKE HIGASHIKATA SKILLS (CRAZY DIAMOND)
    if (isCrazyDiamond) {
      // Skill 1: Homing Shard (Kira Finale Blood-Stained Glass Restoration Pull)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= JOSUKE_HOMING_SHARD_COST || this.matchConfig.mode === 'training')) {
        f.action = 'homing_shard';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill1 = JOSUKE_HOMING_SHARD_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_HOMING_SHARD_COST;
        soundManager.playSwordSlash();
        this.addTextParticle(f.x + f.width / 2, f.y - 38, '💎 「直す」！追尾する血のガラス片！(HOMING SHARD!)', '#38bdf8');
        this.addShockwave(f.x + f.width / 2, f.y + 25, '#f43f5e');
        for (let i = 0; i < 10; i++) {
          this.addSpark(f.x + f.width / 2, f.y + 25, i % 2 === 0 ? '#38bdf8' : '#f43f5e');
        }
        this.spawnJosukeShard(f);
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Angelo Wall / Rock Trap (Morioh Landmark "Yo, Angelo!" Fusion Stun)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= JOSUKE_ANGELO_WALL_COST || this.matchConfig.mode === 'training')) {
        const targets = this.getTargetsForAttacker(f, opponent);
        let targetEnemy: Fighter | null = null;
        let minDist = Infinity;
        for (const t of targets) {
          if (t && t.id !== f.id && t.team !== f.team && t.hp > 0 && !t.isTimeEraseActive) {
            const d = Math.abs((f.x + f.width / 2) - (t.x + t.width / 2));
            if (d < minDist) {
              minDist = d;
              targetEnemy = t;
            }
          }
        }
        if (targetEnemy && minDist <= 145) {
          f.action = 'rock_trap';
          f.actionTimer = 24;
          f.actionDuration = 24;
          f.cooldowns.skill2 = JOSUKE_ANGELO_WALL_COOLDOWN;
          f.isStandActive = true;
          if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_ANGELO_WALL_COST;
          
          // Apply Angelo Wall Petrification, Lore-Accurate Slight Heal & Stun strictly to targetEnemy ONLY!
          this.applyRawDamage(targetEnemy, Math.max(5, JOSUKE_ANGELO_WALL_DAMAGE - 18), 0, 0, f);
          const angeloLoreHeal = 22;
          if (targetEnemy.hp > 0) {
            targetEnemy.hp = Math.min(targetEnemy.maxHp, targetEnemy.hp + angeloLoreHeal);
          }
          targetEnemy.angeloWallTimer = JOSUKE_ANGELO_WALL_STUN_DURATION;
          targetEnemy.hitStun = JOSUKE_ANGELO_WALL_STUN_DURATION;
          targetEnemy.hitReactionTimer = 0;
          targetEnemy.actionTimer = 0;
          targetEnemy.action = 'hit';
          targetEnemy.vx = 0;
          targetEnemy.vy = 0;
          targetEnemy.y = GROUND_Y - targetEnemy.height;
          targetEnemy.isGrounded = true;
          targetEnemy.isStandActive = false;
          targetEnemy.standAlpha = 0;
          targetEnemy.isParrying = false;

          soundManager.playHamonBuzz();
          soundManager.playHeavyImpact();
          this.screenShake = 10.0;
          this.addTextParticle(f.x + f.width / 2, f.y - 42, '🗿 ドラララッ！「よォ アンジェロ！」(YO, ANGELO!)', '#38bdf8');
          this.addTextParticle(targetEnemy.x + targetEnemy.width / 2, targetEnemy.y - 58, '🗿 PETRIFIED IN ANGELO ROCK! (STUNNED)', '#94a3b8');
          this.addTextParticle(targetEnemy.x + targetEnemy.width / 2, targetEnemy.y - 80, `💖 +${angeloLoreHeal} HP (CRAZY DIAMOND RESTORATION HEAL!)`, '#4ade80');
          this.addShockwave(targetEnemy.x + targetEnemy.width / 2, GROUND_Y - 20, '#38bdf8');
          this.addShockwave(targetEnemy.x + targetEnemy.width / 2, GROUND_Y - 45, '#f43f5e');
          for (let i = 0; i < 16; i++) {
            this.addSpark(
              targetEnemy.x + targetEnemy.width / 2 + (Math.random() * 50 - 25),
              GROUND_Y - 35 + (Math.random() * 40 - 20),
              i % 3 === 0 ? '#64748b' : i % 2 === 0 ? '#38bdf8' : '#f43f5e'
            );
          }
        } else {
          this.addTextParticle(f.x + f.width / 2, f.y - 30, 'TOO FAR FOR ANGELO FUSION!', '#f43f5e');
          f.cooldowns.skill2 = 25; // short cooldown on miss
        }
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Bearing Shot (Ratt Hunt Sniper Rifle Bullet / Steel Bearing Flick)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= JOSUKE_BEARING_SHOT_COST || this.matchConfig.mode === 'training')) {
        f.action = 'bearing_shot';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.skill3 = JOSUKE_BEARING_SHOT_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_BEARING_SHOT_COST;
        soundManager.playRapierThrust();
        this.addTextParticle(f.x + f.width / 2, f.y - 38, '🎯 パァン！ベアリング弾狙撃！(BEARING SHOT!)', '#38bdf8');
        for (let i = 0; i < 8; i++) {
          this.addSpark(f.x + f.width / 2, f.y + 20, i % 2 === 0 ? '#67e8f9' : '#facc15');
        }
        this.spawnJosukeBearing(f);
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Dora Counter / Hair Insult Enraged Stagger
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= JOSUKE_DORA_COUNTER_COST || this.matchConfig.mode === 'training')) {
        if (f.isEnraged) {
          // In enraged mode, block turns into a wild pompadour-rage rush tackle!
          f.action = 'enraged_stagger';
          f.actionTimer = 25;
          f.actionDuration = 25;
          f.cooldowns.skill4 = JOSUKE_DORA_COUNTER_COOLDOWN;
          f.isStandActive = true;
          const dir = f.facing === 'right' ? 1 : -1;
          f.vx = dir * 17; // tackle dash
          this.screenShake = 9.0;
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '🤬 今…俺のこの頭のことなんつった！？(HAIR INSULT RAGE!)', '#ef4444');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ef4444');
          soundManager.playPoseSound('crazy_diamond');
        } else {
          f.action = 'parry_stance';
          f.actionTimer = JOSUKE_DORA_COUNTER_DURATION;
          f.actionDuration = JOSUKE_DORA_COUNTER_DURATION;
          f.cooldowns.skill4 = JOSUKE_DORA_COUNTER_COOLDOWN;
          f.isParrying = true;
          f.isStandActive = true;
          if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_DORA_COUNTER_COST;
          this.addTextParticle(f.x + f.width / 2, f.y - 38, '🛡️ ドラァ！修復カウンター構え (DORA COUNTER)', '#38bdf8');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
        }
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Rock Shield (Morioh Asphalt & Rebar Road Wall Restoration)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= JOSUKE_ROCK_SHIELD_COST || this.matchConfig.mode === 'training')) {
        f.action = 'rock_shield';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill5 = JOSUKE_ROCK_SHIELD_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_ROCK_SHIELD_COST;
        
        // Spawn barrier relative to facing
        const dir = f.facing === 'right' ? 1 : -1;
        f.rockShieldX = f.x + dir * 105;
        f.rockShieldTimer = JOSUKE_ROCK_SHIELD_DURATION;

        soundManager.playHit(true);
        this.screenShake = 6.0;
        this.addTextParticle(f.x + f.width / 2, f.y - 38, '🛡️ ドラァ！アスファルト防壁修復！(ROAD WALL RESTORE!)', '#38bdf8');
        this.addShockwave(f.rockShieldX, GROUND_Y - 20, '#38bdf8');
        for (let i = 0; i < 12; i++) {
          this.addSpark(f.rockShieldX, GROUND_Y - 40, i % 2 === 0 ? '#38bdf8' : '#f43f5e');
        }
        this.applyPhysics(f);
        return;
      }

      // Ultimate: Ground Punch / DORARARARA Tectonic Restoration Cataclysm
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= JOSUKE_GROUND_PUNCH_COST || this.matchConfig.mode === 'training')) {
        f.action = 'ground_punch';
        f.actionTimer = 54;
        f.actionDuration = 54;
        f.cooldowns.ultimate = JOSUKE_GROUND_PUNCH_COOLDOWN;
        f.isStandActive = true;
        f.vx = 0;
        (f as any).josukeUltHitIds = [];
        if (this.matchConfig.mode !== 'training') f.energy -= JOSUKE_GROUND_PUNCH_COST;
        
        soundManager.playPoseSound('crazy_diamond');
        this.addTextParticle(f.x + f.width / 2, f.y - 48, '💎 クレイジー・D！ドラララララァッ！！(EARTH SHATTER RESTORE!)', '#f43f5e');
        this.screenShake = 8.0;
        this.addShockwave(f.x + f.width / 2, GROUND_Y - 15, '#38bdf8');
        this.applyPhysics(f);
        return;
      }
    }

    // 1. Stand Toggle
    if (input.toggleStand && f.cooldowns.standToggle <= 0) {
      f.isStandActive = !f.isStandActive;
      f.cooldowns.standToggle = 25;
      this.addTextParticle(f.x + f.width / 2, f.y - 30, f.isStandActive ? `[${f.standName}]` : 'STAND OFF', '#facc15');
      for (let i = 0; i < 6; i++) {
        this.addSpark(f.x + f.width / 2, f.y + f.height / 2, f.isStandActive ? '#c084fc' : '#94a3b8');
      }
    }

    // 2. JOTARO SKILLS
    if (isJotaro) {
      // Skill 1: Star Finger
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= STAR_FINGER_COST || this.matchConfig.mode === 'training')) {
        f.action = 'star_finger';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = STAR_FINGER_COOLDOWN;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= STAR_FINGER_COST;
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'STAR FINGER!', '#c084fc');
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Star Vapor (Vacuum Inhale)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= STAR_VACUUM_COST || this.matchConfig.mode === 'training')) {
        f.action = 'star_vacuum';
        f.actionTimer = STAR_VACUUM_DURATION;
        f.actionDuration = STAR_VACUUM_DURATION;
        f.cooldowns.skill2 = STAR_VACUUM_COOLDOWN;
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (this.matchConfig.mode !== 'training') f.energy -= STAR_VACUUM_COST;
        soundManager.playStarInhale();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '★ STAR INHALE (吸い込む)ッ!! ★', '#38bdf8');
        this.addShockwave(f.x + f.width / 2, f.y + 20, '#38bdf8');
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Stand Leap
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= STAND_LEAP_COST || this.matchConfig.mode === 'training')) {
        f.action = 'stand_leap';
        f.actionTimer = 16;
        f.actionDuration = 16;
        f.cooldowns.skill3 = STAND_LEAP_COOLDOWN;
        f.vy = STAND_LEAP_IMPULSE;
        f.isGrounded = false;
        f.isStandActive = true;
        if (this.matchConfig.mode !== 'training') f.energy -= STAND_LEAP_COST;
        this.addShockwave(f.x + f.width / 2, GROUND_Y, '#9333ea');
        this.addTextParticle(f.x + f.width / 2, f.y - 20, 'STAND LEAP!', '#c084fc');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Inhale & Counter (Parry Stance)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= PARRY_COST || this.matchConfig.mode === 'training')) {
        f.action = 'parry_stance';
        f.actionTimer = PARRY_STANCE_DURATION;
        f.actionDuration = PARRY_STANCE_DURATION;
        f.cooldowns.skill4 = PARRY_COOLDOWN;
        f.isParrying = true;
        if (this.matchConfig.mode !== 'training') f.energy -= PARRY_COST;
        this.addTextParticle(f.x + f.width / 2, f.y - 30, 'PARRY STANCE', '#facc15');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Ora Beatdown (Command Grab)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= ORA_BEATDOWN_COST || this.matchConfig.mode === 'training')) {
        this.tryExecuteOraBeatdown(f, opponent);
        return;
      }
    }

    // 3. DIO SKILLS
    if (isDio) {
      // Skill 1: Knife Throw
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= KNIFE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'knife_throw';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill1 = KNIFE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= KNIFE_COST;
        this.spawnDIOKnives(f);
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Drain Blood (Command Grab)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= DRAIN_BLOOD_COST || this.matchConfig.mode === 'training')) {
        this.tryExecuteDrainBlood(f, opponent);
        return;
      }

      // Skill 3: Street Sign Attack (Guard Break Overhead)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= STREET_SIGN_COST || this.matchConfig.mode === 'training')) {
        f.action = 'street_sign';
        f.actionTimer = 26;
        f.actionDuration = 26;
        f.cooldowns.skill3 = STREET_SIGN_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= STREET_SIGN_COST;
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'STREET SIGN CHOP!', '#ef4444');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Space Ripper Stingy Eyes (Laser)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= SPACE_RIPPER_COST || this.matchConfig.mode === 'training')) {
        f.action = 'space_ripper';
        f.actionTimer = SPACE_RIPPER_DURATION;
        f.actionDuration = SPACE_RIPPER_DURATION;
        f.cooldowns.skill4 = SPACE_RIPPER_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= SPACE_RIPPER_COST;
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'SPACE RIPPER STINGY EYES!', '#ef4444');
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Checkmate (Teleport)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= TELEPORT_COST || this.matchConfig.mode === 'training')) {
        f.action = 'teleport';
        f.actionTimer = 15;
        f.actionDuration = 15;
        f.cooldowns.skill5 = TELEPORT_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TELEPORT_COST;
        
        // Spawn teleport smoke at old position
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#eab308');
        
        // Teleport behind opponent
        const targetX = opponent.facing === 'right' ? opponent.x - 65 : opponent.x + opponent.width + 25;
        f.x = Math.max(40, Math.min(this.getArenaWidth() - 80, targetX));
        f.y = opponent.y;

        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'CHECKMATE!', '#facc15');
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#eab308');
        this.applyPhysics(f);
        return;
      }

      // Ultimate: Road Roller Da! (DIO)
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= ROAD_ROLLER_COST || this.matchConfig.mode === 'training')) {
        f.action = 'road_roller_startup';
        f.actionTimer = ROAD_ROLLER_DURATION;
        f.actionDuration = ROAD_ROLLER_DURATION;
        f.cooldowns.ultimate = ROAD_ROLLER_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= ROAD_ROLLER_COST;
        f.isStandActive = true;
        f.standAlpha = 1.0;
        f.invulnerableTimer = ROAD_ROLLER_DURATION + 15; // Fully invulnerable during cinematic ultimate!

        // Anime-accurate Time Stop activation during Road Roller
        if (!this.timeStopState.isActive) {
          this.activateTimeStop(f);
        }
        f.timeStopActiveTimer = ROAD_ROLLER_DURATION + 15;
        opponent.hitStun = ROAD_ROLLER_DURATION + 15;
        opponent.isFrozenByTimeStop = true;

        soundManager.playTimeStop('dio');
        this.addTextParticle(f.x + f.width / 2, f.y - 60, '★ ROAD ROLLER DAッ!! ★', '#eab308');
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
        this.screenShake = 16;
        this.applyPhysics(f);
        return;
      }
    }

    // TOORU & WONDER OF U (PART 8: JOJOLION)
    if (isTooru) {
      // Skill 1: Head Doctor Disguise (Satoru Akefu) - U
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= TOORU_HEAD_DOCTOR_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_head_doctor';
        f.actionTimer = 16;
        f.actionDuration = 16;
        f.cooldowns.skill1 = TOORU_HEAD_DOCTOR_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_HEAD_DOCTOR_COST;
        f.isHeadDoctorDisguise = true;
        f.headDoctorTimer = TOORU_HEAD_DOCTOR_DURATION;
        f.invulnerableTimer = TOORU_HEAD_DOCTOR_DURATION;
        soundManager.playPoseSound('tooru');
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '🎩 HEAD DOCTOR DISGUISE: SATORU AKEFU', '#94a3b8');
        this.addMenacingParticle(f.x, f.y - 20, 'ゴ', '#64748b');
        this.applyPhysics(f);
        return;
      }

      // Skill 2: Rock Insects (Dododo De Dadada) - I
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= TOORU_ROCK_INSECT_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_rock_insects';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.skill2 = TOORU_ROCK_INSECT_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_ROCK_INSECT_COST;
        soundManager.playRockInsectHiss();
        const dir = f.facing === 'right' ? 1 : -1;
        for (let idx = 0; idx < 3; idx++) {
          this.projectiles.push({
            id: this.projectileId++,
            ownerId: f.id,
            type: 'rock_insect',
            subType: 'insect',
            x: f.x + (dir * (20 + idx * 30)),
            y: GROUND_Y - 20,
            vx: dir * (8 + idx * 3),
            vy: 0,
            baseVx: dir * (8 + idx * 3),
            baseVy: 0,
            width: 25,
            height: 18,
            damage: TOORU_ROCK_INSECT_DAMAGE,
            knockbackX: dir * 3,
            knockbackY: -2,
            isFrozenInTime: false,
            life: 140,
            maxLife: 140,
            color: '#84cc16',
          });
        }
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '🦂 ROCK INSECTS: DODODO DE DADADA!', '#84cc16');
        this.applyPhysics(f);
        return;
      }

      // Skill 3: Calamity Counter (Traffic Hazard) - O
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= TOORU_CALAMITY_COUNTER_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_calamity_counter';
        f.actionTimer = 16;
        f.actionDuration = 16;
        f.cooldowns.skill3 = TOORU_CALAMITY_COUNTER_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_CALAMITY_COUNTER_COST;
        f.isCalamityCounterActive = true;
        f.calamityCounterTimer = TOORU_CALAMITY_COUNTER_DURATION;
        soundManager.playDododoTheme();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '🛡️ CALAMITY COUNTER: TRAFFIC HAZARD', '#ef4444');
        this.applyPhysics(f);
        return;
      }

      // Skill 4: Rain of Calamity - P
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= TOORU_CALAMITY_RAIN_SKILL_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_calamity_rain';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.skill4 = TOORU_CALAMITY_RAIN_SKILL_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_CALAMITY_RAIN_SKILL_COST;
        f.calamityRainTimer = TOORU_CALAMITY_RAIN_DURATION;
        soundManager.playDododoTheme();
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '🌧️ RAIN OF CALAMITY (PIERCING DOWNPOUR)', '#38bdf8');
        this.screenShake = 6;
        this.applyPhysics(f);
        return;
      }

      // Skill 5: Wonder of U Stalk / Instant Calamity Flow - H
      if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= TOORU_CURSE_GAZE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_calamity_curse';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.skill5 = TOORU_CURSE_GAZE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_CURSE_GAZE_COST;
        this.triggerCalamity(f, opponent);
        if (f.wouEntity) {
          f.wouEntity.x = opponent.x - (opponent.facing === 'right' ? 80 : -80);
        }
        soundManager.playPoseSound('tooru');
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '👁️ WONDER OF U: ADVANCED CALAMITY FLOW', '#ef4444');
        this.addMenacingParticle(f.x, f.y - 20, 'ゴ', '#ef4444');
        this.applyPhysics(f);
        return;
      }

      // Ultimate: Extinction Meteor & Rain of Calamity - Y
      if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= TOORU_ULTIMATE_COST || this.matchConfig.mode === 'training')) {
        f.action = 'tooru_calamity_rain';
        f.actionTimer = 25;
        f.actionDuration = 25;
        f.cooldowns.ultimate = TOORU_ULTIMATE_COOLDOWN;
        if (this.matchConfig.mode !== 'training') f.energy -= TOORU_ULTIMATE_COST;
        f.calamityRainTimer = TOORU_ULTIMATE_DURATION; // ~2.1s duration (balanced, prevents infinite lockup)
        soundManager.playDododoTheme();
        this.addTextParticle(f.x + f.width / 2, f.y - 60, '🌧️ RAIN OF CALAMITY & TRAFFIC CARNAGE! ☄️', '#ef4444');
        this.screenShake = 14;
        this.applyPhysics(f);
        return;
      }

      // Stand Toggle / Posture Shift (L)
      if (input.toggleStand && f.cooldowns.standToggle <= 0) {
        f.cooldowns.standToggle = 30;
        f.calamityCooldownTimer = Math.max(0, f.calamityCooldownTimer - 60);
        this.addMenacingParticle(f.x + (f.facing === 'right' ? 30 : -30), f.y - 30, 'ド', '#ef4444');
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🎩 WONDER OF U: MENACING POSTURE', '#94a3b8');
        return;
      }

      // Action J (Chill Step - replaces standard punch)
      if (input.punch && f.cooldowns.punch <= 0) {
        f.action = 'tooru_chill_tap';
        f.actionTimer = 16;
        f.actionDuration = 16;
        f.cooldowns.punch = 25;
        f.energy = Math.min(f.maxEnergy, f.energy + 12);
        f.calamityCooldownTimer = 0; // Accelerates calamity flow
        soundManager.playDododoTheme();
        this.addTextParticle(f.x + f.width / 2, f.y - 35, '🎵 CHILL STEP (LOGIC ACCELERATION)', '#94a3b8');
        this.applyPhysics(f);
        return;
      }

      // Action K (Flow of Calamity - replaces standard barrage)
      if (input.barrage && f.cooldowns.barrage <= 0) {
        f.action = 'tooru_calamity_curse';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.barrage = 50;
        this.triggerCalamity(f, opponent);
        f.isStandActive = true;
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '👁️ WONDER OF U: CALAMITY GAZE!', '#ef4444');
        this.applyPhysics(f);
        return;
      }
    }

    // ENRICO PUCCI SKILLS (WHITESNAKE -> C-MOON -> MADE IN HEAVEN)
    if (isPucci) {
      if (this.handlePucciSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // JOSUKE HIGASHIKATA / GAPPY SKILLS (PART 8)
    if (isGappy) {
      if (this.handleGappySkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // FUNNY VALENTINE SKILLS (PART 7: STEEL BALL RUN)
    if (isValentine) {
      if (this.handleValentineSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // DIPEZ SKILLS (PHOTON CONVERTER & PURE LIGHT MAN)
    if (isDipez) {
      if (this.handleDipezSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // ARABIAN FAT & THE SUN (STAND OF THE SUN & MIRROR CAMOUFLAGE)
    if (f.charId === 'arabian_fat') {
      if (this.handleArabianFatSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
      // While hiding behind mirror, Arabian Fat cannot move or execute standard punch/barrage, but CAN pose to charge energy or cast skills!
      if (f.isHidingBehindMirror) {
        if (input.pose && f.isGrounded && f.cooldowns.pose <= 0) {
          f.action = 'pose';
          f.actionTimer = POSE_DURATION;
          f.actionDuration = POSE_DURATION;
          f.cooldowns.pose = 45;
          f.vx = 0;
          soundManager.playPoseSound(f.charId);
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '☕ 太陽は沈まない！ (ENERGY CHARGE)', '#f59e0b');
          this.applyPhysics(f);
          return;
        }
        if (input.punch || input.barrage) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '🪞 IN CAMOUFLAGE (USE SKILLS OR POSE: B)!', '#f59e0b');
        }
        this.applyPhysics(f);
        return;
      }
    }

    // MICHAEL JUNISTER (GHOST: HAT PRICE)
    if (f.charId === 'michael') {
      if (this.handleMichaelSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // WALLY WABLE / PERSTEIN (GHOST: WABLE THE METAL CUTTER)
    if (f.charId === 'perstein') {
      if (this.handlePersteinSkills(f, input, opponent)) {
        this.applyPhysics(f);
        return;
      }
    }

    // VAMPIRE HORDE MINION SKILLS (Occasional Bite & Eye Beam with long cooldowns)
    if (f.charId === 'vampire') {
      if (input.skill1 && f.cooldowns.skill1 <= 0 && f.energy >= 20) {
        f.action = 'vampire_drain';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = 220;
        f.energy -= 20;
        this.applyPhysics(f);
        return;
      }
      if (input.skill2 && f.cooldowns.skill2 <= 0 && f.energy >= 35) {
        f.action = 'space_ripper_small';
        f.actionTimer = 26;
        f.actionDuration = 26;
        f.cooldowns.skill2 = 260;
        f.energy -= 35;
        this.applyPhysics(f);
        return;
      }
    }

    // 4. Barrage Attack (Universal)
    if (input.barrage && f.cooldowns.barrage <= 0 && (f.energy >= BARRAGE_COST || this.matchConfig.mode === 'training')) {
      const isVampireMinion = f.charId === 'vampire';
      const bDur = isVampireMinion ? 24 : BARRAGE_DURATION;
      f.action = 'barrage';
      f.actionTimer = bDur;
      f.actionDuration = bDur;
      f.cooldowns.barrage = isVampireMinion ? 140 : BARRAGE_COOLDOWN;
      if (this.matchConfig.mode !== 'training') f.energy -= BARRAGE_COST;
      f.vx *= 0.3;
      // If character has a Stand, summon and activate Stand immediately for barrage flurry!
      if (f.hasStand) {
        f.isStandActive = true;
        f.standAlpha = 1.0;
      } else {
        f.isStandActive = false;
        f.standAlpha = 0;
      }
      this.addTextParticle(f.x + f.width / 2, f.y - 40, f.hasStand ? f.barrageCry : (isVampireMinion ? 'CLAW FRENZY!' : 'RAPID RUSH!'), '#eab308');
      this.screenShake = Math.max(this.screenShake, 3.5);
      this.applyPhysics(f);
      return;
    }

    // 5. Basic Punch Attacks
    if (input.punch && f.cooldowns.punch <= 0) {
      const isVampireMinion = f.charId === 'vampire';
      const dir = f.facing === 'right' ? 1 : -1;

      // 5A. AIRBORNE PUNCH ATTACK
      if (!f.isGrounded) {
        if (input.crouch) {
          // AERIAL METEOR DUNK (Spike Downwards)
          f.action = 'air_spike';
          f.actionTimer = 14;
          f.actionDuration = 14;
          f.cooldowns.punch = 18;
          f.vy = Math.min(f.vy, 2.0);
          soundManager.playPunchWhoosh(true);
          this.applyPhysics(f);
          return;
        } else {
          f.action = 'punch';
          f.actionTimer = 12;
          f.actionDuration = 12;
          f.cooldowns.punch = 14;
          soundManager.playPunchWhoosh(false);
          this.applyPhysics(f);
          return;
        }
      }

      // 5B. STANDARD PUNCH ATTACK
      f.action = 'punch';
      const duration = (f.charId === 'funny_valentine' && f.isStandActive) ? 24 : (isVampireMinion ? 14 : 12);
      f.actionTimer = duration;
      f.actionDuration = duration;
      f.cooldowns.punch = isVampireMinion ? 26 : 14;
      f.vx += dir * (isVampireMinion ? 1.5 : 2.5);
      soundManager.playPunchWhoosh(false);
      this.applyPhysics(f);
      return;
    }

    // 6. Pose
    if (input.pose && f.isGrounded && f.cooldowns.pose <= 0) {
      f.action = 'pose';
      f.actionTimer = POSE_DURATION;
      f.actionDuration = POSE_DURATION;
      f.cooldowns.pose = 45;
      f.vx = 0;

      soundManager.playPoseSound(f.charId);

      const dir = f.facing === 'right' ? 1 : -1;
      if (f.charId === 'jotaro') {
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'やれやれだぜ... (YARE YARE DAZE)', '#c084fc');
        this.addMenacingParticle(f.x + 35 * dir, f.y - 15, 'ゴ', '#c084fc');
      } else if (f.charId === 'dio') {
        this.addTextParticle(f.x + f.width / 2, f.y - 45, 'WRYYYYYYYYYYYYYY!!', '#facc15');
        this.addMenacingParticle(f.x - 10 * dir, f.y - 25, 'ゴ', '#facc15');
      } else if (f.charId === 'crazy_diamond') {
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'グレートだぜ...！ (GURETO DA ZE!)', '#38bdf8');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '♥', '#f43f5e');
      } else if (f.charId === 'king_crimson') {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, 'このディアボロだ！ (KONO DIAVOLO DA!)', '#fb7185');
        this.addMenacingParticle(f.x, f.y - 20, 'ゴ', '#fb7185');
      } else if (f.charId === 'silver_chariot') {
        this.addTextParticle(f.x + f.width / 2, f.y - 35, 'ブラボー！おお…ブラボー！！ (BRAVO!)', '#e2e8f0');
        this.addMenacingParticle(f.x + 20 * dir, f.y - 20, '★', '#facc15');
      } else if (f.charId === 'jonathan') {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '何をするんだ！うるさい！！ (NANI O SURU NDA, URUSAI!)', '#eab308');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '☀', '#eab308');
      } else if (f.charId === 'joseph_young') {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, 'お前の次のセリフは...！ (TSUGI NI OMAE WA...!)', '#34d399');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '💬', '#34d399');
      } else if (f.charId === 'joseph_old') {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, 'OH MY GOD!! (オー・マイ・ガー！)', '#a855f7');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '⚡', '#a855f7');
      } else if (f.charId === 'tooru') {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '厄災の理... (THE LOGIC OF CALAMITY)', '#94a3b8');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '🎧', '#94a3b8');
      } else if (f.charId === 'pucci') {
        const chant = f.pucciForm === 'made_in_heaven'
          ? 'MADE IN HEAVEN... 時は加速する！ (TIME ACCELERATES!)'
          : f.pucciForm === 'cmoon'
          ? '我が心はすでに「天国」にある... (MY HEART IS IN HEAVEN)'
          : '素数を数えて落ち着くんだ... (COUNT PRIME NUMBERS...)';
        this.addTextParticle(f.x + f.width / 2, f.y - 40, chant, '#a855f7');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '📿', '#a855f7');
      } else if (f.charId === 'funny_valentine') {
        this.addTextParticle(f.x + f.width / 2, f.y - 45, 'ドジャア～～ン！ (DOJYAA~~N!)', '#f472b6');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '★', '#facc15');
        this.addShockwave(f.x + f.width / 2, f.y + f.height - 10, '#f472b6');
      } else if (f.charId === 'dipez') {
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '✨', '#ffffff');
        this.addShockwave(f.x + f.width / 2, f.y + f.height - 10, '#fef08a');
      } else if (f.charId === 'perstein') {
        this.addTextParticle(f.x + f.width / 2, f.y - 45, 'WABLE THE METAL CUTTER... TEBAS TANPA AMPUN!', '#38bdf8');
        this.addMenacingParticle(f.x + 25 * dir, f.y - 20, '⚙️', '#94a3b8');
        this.addShockwave(f.x + f.width / 2, f.y + f.height - 10, '#38bdf8');
      } else {
        this.addTextParticle(f.x + f.width / 2, f.y - 30, '★ JOJO POSE ★', '#c084fc');
        this.addMenacingParticle(f.x, f.y - 15, 'ゴ', '#c084fc');
      }

      this.applyPhysics(f);
      return;
    }

    // 7. Movement & Jump (Responsive to C-Moon Dynamic Gravity Axis)
    let speedMult = f.isArmorOff ? ARMOR_OFF_SPEED_MULTIPLIER : 1.0;
    if (f.charId === 'vampire') {
      speedMult *= 0.72; // Vampire horde minions move slower so players can reposition and counterattack
    }
    if (f.charId === 'dipez' && f.dipezForm === 'pure_light') {
      speedMult *= 2.8; // Evolved form runs at light speed!
    }
    if (f.charId === 'pucci' && f.pucciForm === 'made_in_heaven') {
      speedMult *= (1.0 + (f.mihSpeedStack || 0));
    }
    if (f.charId === 'michael') {
      const kRatio = Math.min(1.0, Math.max(0, (f.michaelKineticMeter || 0) / 100));
      // Scaling momentum speed: up to +35% faster at max kinetic charge!
      speedMult *= (1.0 + kRatio * 0.35);
      if (f.isGeorgeMounted) {
        speedMult *= 1.38; // Thoroughbred equestrian mobility and speed!
      }
      if (f.michaelOverdriveTimer && f.michaelOverdriveTimer > 0) {
        speedMult *= 1.15;
      }
    }
    const op = (f.id === 'player' || f.id === 'teammate') ? this.ai : this.player;
    if (op && op.charId === 'king_crimson' && op.isTimeEraseActive) {
      speedMult *= 0.28;
    }

    // Environmental Heat Slowdown from The Sun Stand
    const sunUser = this.getAllActiveFighters().find(af => af && af.hp > 0 && af.charId === 'arabian_fat' && af.sunActive && (af.sunTemperature || 0) > 0 && af.team !== f.team);
    if (sunUser && sunUser.sunTemperature) {
      const heatSlow = Math.max(0.45, 1.0 - ((sunUser.sunTemperature || 0) / 100) * 0.55);
      speedMult *= heatSlow;
    }

    let heatJump = 1.0;
    if (sunUser && sunUser.sunTemperature) {
      heatJump = Math.max(0.48, 1.0 - ((sunUser.sunTemperature || 0) / 100) * 0.50);
    }

    const axis = this.activeGravityAxis || 'down';
    const jumpMag = Math.abs(JUMP_FORCE) * heatJump;

    if (axis === 'right') {
      // Standing on Right Wall (Ground at +X, facing -X towards center)
      if (input.left && f.isGrounded) {
        let jumpF = jumpMag * 1.2;
        if (op && op.charId === 'king_crimson' && op.isTimeEraseActive) jumpF *= 0.55;
        f.vx = -jumpF; // Negative X = Jump AWAY from right wall (towards left)
        f.isGrounded = false;
        f.action = 'jump';
      } else if (input.jump) {
        // Walk UP along right wall (analog UP)
        f.vy = -MOVE_SPEED * speedMult;
        f.facing = 'right';
        if (f.isGrounded) f.action = 'walk';
      } else if (input.crouch) {
        // Walk DOWN along right wall (analog DOWN)
        f.vy = MOVE_SPEED * speedMult;
        f.facing = 'left';
        if (f.isGrounded) f.action = 'walk';
      } else {
        f.vy *= FRICTION;
        if (f.isGrounded && Math.abs(f.vy) < 0.2) f.action = 'idle';
      }

    } else if (axis === 'left') {
      // Standing on Left Wall (Ground at -X, facing +X towards center)
      if (input.right && f.isGrounded) {
        let jumpF = jumpMag * 1.2;
        if (op && op.charId === 'king_crimson' && op.isTimeEraseActive) jumpF *= 0.55;
        f.vx = jumpF; // Positive X = Jump AWAY from left wall (towards right)
        f.isGrounded = false;
        f.action = 'jump';
      } else if (input.jump) {
        // Walk UP along left wall (analog UP)
        f.vy = -MOVE_SPEED * speedMult;
        f.facing = 'left';
        if (f.isGrounded) f.action = 'walk';
      } else if (input.crouch) {
        // Walk DOWN along left wall (analog DOWN)
        f.vy = MOVE_SPEED * speedMult;
        f.facing = 'right';
        if (f.isGrounded) f.action = 'walk';
      } else {
        f.vy *= FRICTION;
        if (f.isGrounded && Math.abs(f.vy) < 0.2) f.action = 'idle';
      }

    } else if (axis === 'up') {
      // Standing on Ceiling (Ground at -Y, facing +Y towards floor)
      // Pulling Analog Down (away from ceiling into arena) = JUMP down from ceiling
      if (input.crouch && f.isGrounded) {
        let jumpF = jumpMag;
        if (op && op.charId === 'king_crimson' && op.isTimeEraseActive) jumpF *= 0.55;
        f.vy = jumpF; // Positive Y = Jump DOWN from ceiling
        f.isGrounded = false;
        f.action = 'jump';
      } else if (input.left) {
        f.vx = -MOVE_SPEED * speedMult;
        f.facing = 'left';
        if (f.isGrounded) f.action = 'walk';
      } else if (input.right) {
        f.vx = MOVE_SPEED * speedMult;
        f.facing = 'right';
        if (f.isGrounded) f.action = 'walk';
      } else {
        f.vx *= FRICTION;
        if (f.isGrounded && Math.abs(f.vx) < 0.2) f.action = 'idle';
      }

    } else {
      // Normal 'down' gravity floor
      if (input.left) {
        f.vx = -MOVE_SPEED * speedMult;
        f.facing = 'left';
        if (f.isGrounded) f.action = 'walk';
      } else if (input.right) {
        f.vx = MOVE_SPEED * speedMult;
        f.facing = 'right';
        if (f.isGrounded) f.action = 'walk';
      } else {
        f.vx *= FRICTION;
        if (f.isGrounded && Math.abs(f.vx) < 0.2) f.action = 'idle';
      }

      if (input.jump && f.isGrounded) {
        let jumpF = jumpMag;
        if (op && op.charId === 'king_crimson' && op.isTimeEraseActive) jumpF *= 0.55;
        f.vy = -jumpF;
        f.isGrounded = false;
        f.action = 'jump';
      }
    }

    this.applyPhysics(f);
  }

  // --- ACTION TIMELINE EXECUTION ---
  private handleActionFrame(f: Fighter, opponent: Fighter, input?: InputState) {
    const dir = f.facing === 'right' ? 1 : -1;

    switch (f.action) {
      case 'punch':
        if (f.charId === 'funny_valentine' && f.isStandActive) {
          // Valentine Stand: 1 Revolver Shot + 2 D4C Forward Heavy Punches!
          if (f.actionTimer === 23) {
            this.executeValentineBasicRevolverShot(f, opponent);
          } else if (f.actionTimer === 15) {
            f.vx += dir * 4.5;
            this.executeValentineD4CPunch(f, opponent, 1);
          } else if (f.actionTimer === 7) {
            f.vx += dir * 3.5;
            this.executeValentineD4CPunch(f, opponent, 2);
          }
        } else {
          if (f.actionTimer === Math.floor(f.actionDuration / 2)) {
            this.executeComboPunch1(f, opponent);
          }
        }
        break;

      case 'air_spike':
        if (f.actionTimer === Math.floor(f.actionDuration / 2)) {
          this.executeAirSpike(f, opponent);
        }
        break;

      case 'valentine_clone_shoot':
        if (f.actionTimer === 14) {
          this.executeValentineCloneRevolverShot(f, opponent);
        }
        break;

      case 'valentine_clone_punch':
        if (f.actionTimer === 8) {
          this.executeValentineCloneMeleePunch(f, opponent);
        }
        break;

      case 'valentine_clone_kick':
        if (f.actionTimer === 10) {
          this.executeValentineCloneMeleeKick(f, opponent);
        }
        break;

      case 'barrage':
        if (f.charId === 'michael' && f.isGeorgeMounted && opponent && opponent.hp > 0) {
          const dist = Math.abs((opponent.x + opponent.width / 2) - (f.x + f.width / 2));
          if (dist < 90) {
            f.vx *= 0.1; // Lock George in front of target during barrage
          }
        }
        if (f.actionTimer % 3 === 0) {
          this.executeBarrageHit(f, opponent);
        }
        break;

      case 'pose':
        f.energy = Math.min(f.maxEnergy, f.energy + POSE_ENERGY_GAIN);
        if (this.frameCount % 6 === 0) {
          const offsetX = (Math.random() * 50 - 25);
          const glyph = f.charId === 'crazy_diamond' ? (Math.random() > 0.5 ? '♥' : '☮')
            : f.charId === 'silver_chariot' ? (Math.random() > 0.5 ? '★' : '⚔')
            : 'ゴ';
          const glyphColor = f.charId === 'dio' ? 'rgba(250, 204, 21, 0.9)'
            : f.charId === 'crazy_diamond' ? 'rgba(56, 189, 248, 0.9)'
            : f.charId === 'king_crimson' ? 'rgba(251, 113, 133, 0.9)'
            : f.charId === 'silver_chariot' ? 'rgba(226, 232, 240, 0.9)'
            : 'rgba(192, 132, 252, 0.9)';
          this.addMenacingParticle(f.x + f.width / 2 + offsetX, f.y - 10, glyph, glyphColor);
        }
        break;

      case 'sun_exposed_panic':
        f.vx *= 0.85;
        if (this.frameCount % 8 === 0) {
          this.addMenacingParticle(f.x + (Math.random() * 40 - 20), f.y - 20, '💧', '#38bdf8');
        }
        break;

      // MICHAEL JUNISTER ACTIONS (GHOST: HAT PRICE)
      case 'michael_palm_thrust':
        if (f.isGeorgeMounted && opponent && opponent.hp > 0) {
          const dist = Math.abs((opponent.x + opponent.width / 2) - (f.x + f.width / 2));
          if (dist < 95) {
            f.vx *= 0.2; // Lock position for palm thrust impact
          }
        }
        if (f.actionTimer === 12) {
          this.executeMichaelPalmThrust(f, opponent);
        }
        break;

      case 'michael_counter_stance':
        f.vx *= 0.8;
        if (f.actionTimer <= 0) {
          f.michaelCounterActive = false;
          f.isParrying = false;
        }
        break;

      case 'michael_counter_kick':
        if (f.actionTimer === 14) {
          this.executeMichaelCounterKickHit(f, opponent);
        }
        break;

      case 'michael_axe_kick':
        this.executeMichaelAxeKickFrame(f, opponent);
        break;

      case 'michael_kinetic_barrage':
        if (opponent && opponent.hp > 0) {
          const dist = Math.abs((opponent.x + opponent.width / 2) - (f.x + f.width / 2));
          if (dist < 95) {
            f.vx *= 0.12; // Lock George in front of target during kinetic barrage
          }
        }
        if (f.actionTimer % 5 === 0 && f.actionTimer > 10) {
          this.executeMichaelBarrageHit(f, opponent);
        } else if (f.actionTimer === 8) {
          this.executeMichaelBarrageFinisher(f, opponent);
        }
        break;

      case 'michael_ultimate':
        this.executeMichaelUltimateFrame(f, opponent);
        break;

      case 'star_finger':
        if (f.actionTimer === 12) {
          this.executeStarFinger(f, opponent);
        }
        break;

      case 'star_vacuum': {
        const dir = f.facing === 'right' ? 1 : -1;
        const targetX = f.x + dir * 65;
        const dist = Math.abs(opponent.x - f.x);

        // Vacuum suction cone reaches in front of Jotaro/Star Platinum
        const isFacingOpponent = (dir === 1 && opponent.x > f.x - 40) || (dir === -1 && opponent.x < f.x + 40);

        if (isFacingOpponent && dist < 750) {
          const isOpponentRagdoll = opponent.action === 'ragdoll' || !!opponent.isRagdoll;
          const pullDir = f.x < opponent.x ? -1 : 1;
          const pullAccel = Math.min(18, Math.max(9, 20 - dist * 0.016));

          if (isOpponentRagdoll) {
            // While opponent is ragdolled: pull slightly horizontally, but DO NOT cancel downward gravity or float stack!
            opponent.vx += pullDir * 1.2;
          } else {
            opponent.vx = pullDir * pullAccel;

            // Gently pull airborne opponents into Star Platinum's strike altitude
            if (!opponent.isGrounded && opponent.vy > 0) {
              opponent.vy *= 0.75;
            }

            // Guard Break & continuous stagger
            opponent.guardBreakTimer = 65;
            opponent.hitStun = Math.max(opponent.hitStun, 10);
          }

          // Friction suction damage every 6 frames
          if (f.actionTimer % 6 === 0) {
            this.applyRawDamage(opponent, 4, 0, 0, f);
            soundManager.playHit(false);
          }

          // Wind & air spark particles
          if (f.actionTimer % 3 === 0) {
            this.addSpark(opponent.x + (Math.random() - 0.5) * 40, opponent.y + (Math.random() - 0.5) * 50, '#38bdf8');
            this.addSpark(f.x + dir * 40 + (Math.random() - 0.5) * 30, f.y + 20 + (Math.random() - 0.5) * 30, '#ffffff');
          }

          // When opponent is sucked right into point-blank range: pin them in hitstun for immediate combo follow-up!
          if (dist <= 75 && !isOpponentRagdoll) {
            opponent.x = targetX;
            opponent.vx = 0;
            opponent.hitStun = Math.max(opponent.hitStun, 25);
            opponent.guardBreakTimer = 70;
            this.screenShake = Math.max(this.screenShake, 4);
          }
        }

        this.screenShake = Math.max(this.screenShake, 3);
        if (f.actionTimer % 8 === 0) {
          const sfxX = f.x + dir * (dist * 0.4);
          this.addMenacingParticle(sfxX, f.y - 15, 'ゴォォッ!', '#38bdf8');
        }
        break;
      }

      case 'ora_beatdown':
        // Multi-hit pummel while target is locked in 'grabbed' state
        if (f.actionTimer % 6 === 0 && f.actionTimer > 15) {
          this.executeOraBeatdownHit(f, opponent);
        } else if (f.actionTimer === 10) {
          // Final explosive blow
          this.executeOraBeatdownFinisher(f, opponent);
        }
        break;

      case 'drain_blood':
        // Vampiric DoT tick & heal DIO
        if (f.actionTimer % 10 === 0) {
          this.executeDrainBloodTick(f, opponent);
        }
        break;

      case 'vampire_drain':
        if (f.actionTimer === 12) {
          this.executeVampireDrainBite(f, opponent);
        }
        break;

      case 'space_ripper_small':
        if (f.actionTimer === 15) {
          this.executeSpaceRipperSmall(f, opponent);
        }
        break;

      case 'street_sign':
        if (f.actionTimer === 12) {
          this.executeStreetSignChop(f, opponent);
        }
        break;

      case 'space_ripper':
        if (f.actionTimer === 25) {
          this.executeSpaceRipperBeam(f, opponent);
        }
        break;

      case 'road_roller_startup': {
        const targetX = opponent.x + opponent.width / 2;

        // Keep opponent locked & frozen in Time Stop throughout the move
        if (f.actionTimer > 15) {
          opponent.hitStun = Math.max(opponent.hitStun, 25);
          opponent.isFrozenByTimeStop = true;
          f.invulnerableTimer = Math.max(f.invulnerableTimer, 25);
          f.isGrounded = false;
        }

        if (f.actionTimer > 130) {
          // Phase 1: High Supersonic Leap Off-Screen (160 -> 130) - Dio jumps offscreen to fetch the Road Roller!
          if (f.actionTimer === 159) {
            soundManager.playWhoosh();
            this.addShockwave(f.x + f.width / 2, GROUND_Y - 20, '#facc15');
            this.addTextParticle(f.x + f.width / 2, GROUND_Y - 50, '「ZA WARUDOッ!!」', '#eab308');
          }
          if (f.actionTimer === 135) {
            this.addTextParticle(targetX, 40, '★ ROOOOAAAAD ROLLER DAAAAッ!! ★', '#fde047');
          }
        } else if (f.actionTimer > 100) {
          // Phase 2: Supersonic Dive Slam carrying the massive Road Roller (130 -> 100)
          if (f.actionTimer === 128) {
            soundManager.playWhoosh();
            this.screenShake = Math.max(this.screenShake, 10);
          }
        } else if (f.actionTimer === 100) {
          // Ground Slam Impact!
          soundManager.playCarCrash();
          soundManager.playHit(true);
          soundManager.playHeavyImpact();
          this.screenShake = 32;
          this.addShockwave(targetX, GROUND_Y - 30, '#facc15');
          this.addShockwave(targetX, GROUND_Y - 30, '#ef4444');
          this.addTextParticle(targetX, GROUND_Y - 60, '★ TANK LORRY CRUSHッ!! ★', '#eab308');
          opponent.x = targetX - opponent.width / 2;
          opponent.y = GROUND_Y - opponent.height;
          opponent.isGrounded = true;
          opponent.action = 'knockdown';
        } else if (f.actionTimer > 25) {
          // Phase 3: Perched ON TOP of Road Roller - Rapid Downward MUDA MUDA Barrage in Stopped Time! (100 -> 25)
          opponent.x = targetX - opponent.width / 2;
          opponent.y = GROUND_Y - opponent.height;
          opponent.isGrounded = true;

          // Rapid downward barrage hits every 3 frames
          if (f.actionTimer % 3 === 0) {
            soundManager.playBarrageHit();
            this.executeRoadRollerPummelHit(f, opponent);
          }

          // Anime-authentic second count in stopped time:
          if (f.actionTimer === 90) {
            this.addTextParticle(targetX, f.y - 40, '「ICHIBYOU KEIKA... (1 SECOND)」', '#facc15');
          } else if (f.actionTimer === 75) {
            this.addTextParticle(targetX, f.y - 40, '「NIBYOU KEIKA... (2 SECONDS)」', '#facc15');
          } else if (f.actionTimer === 60) {
            this.addTextParticle(targetX, f.y - 40, '「YONBYOU KEIKA... (4 SECONDS)」', '#facc15');
          } else if (f.actionTimer === 45) {
            this.addTextParticle(targetX, f.y - 40, '「ROKUBYOU KEIKA... (6 SECONDS)」', '#facc15');
          } else if (f.actionTimer === 35) {
            this.addTextParticle(targetX, f.y - 40, '「NANA BYOU KEIKA... (7 SECONDS)」', '#facc15');
          } else if (f.actionTimer === 28) {
            this.addTextParticle(targetX, f.y - 45, '「HACHIBYOU KEIKA! WRYYYYYYY!! (8s)」', '#fde047');
            this.addShockwave(targetX, GROUND_Y - 80, '#facc15');
            this.screenShake = 18;
          }
        } else if (f.actionTimer > 15) {
          // Phase 4: Final heavy downward hammer strike & backflip off the steamroller
          if (f.actionTimer === 24) {
            soundManager.playClashFinisher();
            soundManager.playHit(true);
            this.screenShake = 26;
            this.addTextParticle(targetX, f.y - 45, '「WRYYYYYYYYYYYYYYッ!!」', '#ef4444');
            this.addTextParticle(targetX, f.y - 25, '「BURRRRRN TO ASHES!!」', '#facc15');
          }
        } else if (f.actionTimer === 15) {
          // Phase 5: Time Stop Ends & CATASTROPHIC ROAD ROLLER DETONATION!
          this.executeRoadRollerExplosion(f, opponent);
        }
        break;
      }

      // JONATHAN ACTIONS
      case 'zoom_punch':
        if (f.actionTimer === 12) {
          if (f.isSwordEquipped) {
            this.executePluckThrust(f, opponent);
          } else {
            this.executeZoomPunch(f, opponent);
          }
        }
        break;

      case 'luck_pluck_slash':
        if (f.actionTimer === 20 || f.actionTimer === 14 || f.actionTimer === 8) {
          this.executeLuckPluckSlash(f, opponent, f.actionTimer === 8);
        }
        break;

      case 'sunlight_ultimate':
        if (f.actionTimer % 3 === 0 && f.actionTimer > 20) {
          this.executeSunlightYellowHit(f, opponent);
        } else if (f.actionTimer === 15) {
          this.executeSunlightYellowFinisher(f, opponent);
        }
        break;

      // YOUNG JOSEPH ACTIONS
      case 'tommy_gun':
        // Prevent cooldown from ticking down while actively spraying bullets
        f.cooldowns.skill4 = TOMMY_GUN_COOLDOWN;

        // Human player cancels tommy_gun if key P / skill4 is released early before 2.0s actionTimer ends.
        // Bot (f.isAI) automatically fires full 2.0s burst without needing key hold.
        if (input && !input.skill4 && !f.isAI) {
          f.actionTimer = 0;
          f.action = f.isGrounded ? 'idle' : 'jump';
          f.cooldowns.skill4 = TOMMY_GUN_COOLDOWN;
          break;
        }

        if (f.actionTimer % 2 === 0) {
          this.spawnTommyGunSingleShot(f);
        }

        if (f.actionTimer <= 1) {
          f.cooldowns.skill4 = TOMMY_GUN_COOLDOWN; // Reset full 4.0s cooldown when 2.0s burst finishes!
        }
        break;

      case 'hamon_elbow':
        if (f.actionTimer === 14) {
          this.executeHamonElbow(f, opponent);
        }
        break;

      case 'clacker_boomerang':
        if (f.actionTimer === 10) {
          this.executeClackerBoomerang(f, opponent);
        }
        break;

      case 'young_joseph_ultimate':
        if (!f.youngJosephUltEscapeDir) {
          const opp = opponent || ((f.id === 'player' || f.id === 'teammate') ? this.ai : this.player);
          f.youngJosephUltEscapeDir = (opp && opp.x >= f.x) ? -1 : 1;
        }
        const runDir = f.youngJosephUltEscapeDir;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 20);

        if (f.actionTimer > 180) {
          // Phase 1: NIGERUNDAYO Sprint away backwards from opponent towards wall and off-screen!
          // Slowed down to 12 (from 32) so the comical high-knee runaway sprint is clearly visible
          f.facing = runDir === 1 ? 'right' : 'left';
          f.vx = runDir * 12;
          if (f.actionTimer === 250 || f.actionTimer === 215) {
            this.addTextParticle(f.x + f.width / 2, f.y - 45, '「逃げるんだよォー！スモーキーッ！！」', '#facc15');
          }
          if (this.frameCount % 4 === 0) {
            this.addSpark(f.x + f.width / 2 - runDir * 15, f.y + f.height - 10, '#cbd5e1');
          }
        } else if (f.actionTimer > 110) {
          // Phase 2: Map Tremor & Airplane Propeller Engine Roar (Off-screen on the side Joseph ran to)
          const arenaW = this.getArenaWidth();
          f.x = runDir === 1 ? arenaW + 450 : -450; // Far off-screen on escape side
          f.vx = 0;
          f.vy = 0;
          this.screenShake = Math.max(this.screenShake, 3);
          if (f.actionTimer === 150) {
            soundManager.playPlaneEngine();
            const oppCenterX = opponent ? opponent.x + opponent.width / 2 : arenaW / 2;
            const oppCenterY = opponent ? opponent.y - 60 : 100;
            this.addTextParticle(oppCenterX, oppCenterY, '✈️ BIPLANE ENGINE ROARING IN SKY!! ⚡', '#38bdf8');
            this.addMenacingParticle(oppCenterX, oppCenterY + 35, '轟', '#ef4444');
          }
        } else if (f.actionTimer > 45) {
          // Phase 3: WWII Biplane Diving Attack from Sky directly toward target (Diving in from the side Joseph ran to!)
          const arenaW = this.getArenaWidth();
          f.x = runDir === 1 ? arenaW + 450 : -450;
          f.vx = 0;
          f.vy = 0;
          this.screenShake = Math.max(this.screenShake, 18);

          // Calculate current Diving Biplane coordinates in World Space
          const crashX = Math.max(80, Math.min(arenaW - 80, opponent ? opponent.x + opponent.width / 2 : arenaW / 2));
          const crashY = GROUND_Y - 20;
          const planePhase = (110 - f.actionTimer) / 65; // 0 to 1
          // Biplane spawns from the SAME side Joseph escaped to:
          const startX = runDir === 1 ? crashX + 650 : crashX - 650;
          const startY = -120;
          const px = startX + (crashX - startX) * planePhase;
          const py = startY + (crashY - startY) * planePhase;

          // Spawn world-space fire embers and smoke particles behind diving plane along flight trajectory
          const dx = crashX - startX;
          const dy = crashY - startY;
          const dist = Math.hypot(dx, dy) || 1;
          const dirX = dx / dist;
          const dirY = dy / dist;

          if (f.actionTimer % 2 === 0) {
            for (let k = 0; k < 4; k++) {
              const backDist = 30 + k * 22;
              this.addSpark(px - dirX * backDist + (Math.random() - 0.5) * 20, py - dirY * backDist + (Math.random() - 0.5) * 20, '#facc15');
              this.addSpark(px - dirX * backDist + (Math.random() - 0.5) * 20, py - dirY * backDist + (Math.random() - 0.5) * 20, '#ef4444');
              this.addSpark(px - dirX * backDist + (Math.random() - 0.5) * 20, py - dirY * backDist + (Math.random() - 0.5) * 20, '#ffffff');
            }
          }
        } else if (f.actionTimer === 45) {
          // Phase 4: CATASTROPHIC BIPLANE IMPACT & EXPLOSION! Joseph leaps out of exploding cockpit!
          this.executeBiplaneCrash(f, opponent);
        }
        break;

      // OLD JOSEPH ACTIONS
      case 'hermit_purple_grapple':
        if (f.actionTimer === 22) {
          soundManager.playHamonBuzz();
          const gx = f.x + (f.facing === 'right' ? f.width + 25 : -25);
          this.addSpark(gx, f.y + 24, '#c084fc');
          this.addSpark(gx, f.y + 24, '#facc15');
        }
        break;

      case 'spirit_photo':
        if (f.actionTimer === 22) {
          this.executeSpiritPhotoScan(f, opponent);
        }
        break;

      case 'hermit_trap':
        if (f.actionTimer === 24 || f.actionTimer === 12) {
          this.executeHermitTrap(f, opponent, f.actionTimer === 12);
        }
        break;

      case 'overdrive_tactics':
        if (f.actionTimer === 22) {
          this.executeOverdriveTacticsWhip(f, opponent, 1);
        } else if (f.actionTimer === 10) {
          this.executeOverdriveTacticsWhip(f, opponent, 2);
        }
        break;

      case 'camera_smash':
        if (f.actionTimer === 14) {
          this.executeCameraSmash(f, opponent);
        }
        break;

      case 'old_joseph_ultimate':
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 15);
        if (f.actionTimer > 95) {
          // Phase 1: Arena-Wide Hermit Purple Vine Eruption & Snare Pull!
          if (f.actionTimer === 120 || f.actionTimer === 105) {
            soundManager.playHermitVineWhip();
            this.screenShake = Math.max(this.screenShake, 10);
            this.executeHermitUltimateSnare(f, opponent);
          }
        } else if (f.actionTimer > 20) {
          // Phase 2: High-Voltage Sunlight Yellow Overdrive Conduction!
          if (f.actionTimer % 6 === 0) {
            this.executeHermitSurgeHit(f, opponent);
          }
        } else if (f.actionTimer === 20) {
          // Phase 3: Catastrophic Cross-Vine Overdrive Detonation!
          this.executeHermitSurgeFinisher(f, opponent);
        }
        break;

      // VINEGAR DOPPIO / DIAVOLO ACTIONS
      case 'doppio_call_boss': {
        f.vx *= 0.65;
        const currentStage = f.doppioStage ?? 0;

        // Ringing effect & "トゥルルルル (TURURURURU!)" manga particles during startup
        if (f.actionTimer === 46 || f.actionTimer === 34) {
          soundManager.playDoppioRing();
          this.addMenacingParticle(
            f.x + f.width / 2 + (Math.random() > 0.5 ? 26 : -26),
            f.y - 16,
            'トゥルルルル!',
            '#f472b6'
          );
          this.addSpark(f.x + f.width / 2, f.y + 15, '#f472b6');
        }

        // Moment of Truth at Frame 24: 50/50 Chance Boss Answers the Phone!
        if (f.actionTimer === 24) {
          const isAnswered = Math.random() < 0.5;
          if (isAnswered) {
            f.doppioCallResult = 'answered';
            soundManager.playDoppioAnswer();
            this.screenShake = Math.max(this.screenShake, 12);
            this.addShockwave(f.x + f.width / 2, f.y + 24, '#e11d48');
            this.addShockwave(f.x + f.width / 2, f.y + 24, '#fb7185');
            for (let i = 0; i < 16; i++) {
              this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 60, f.y + 20 + (Math.random() - 0.5) * 50, i % 2 === 0 ? '#e11d48' : '#f472b6');
            }

            if (currentStage === 0) {
              // Call #1 Answered -> Unlock Epitaph (Skill U) + 1 Arm of King Crimson!
              f.doppioStage = 1;
              f.hasStand = true;
              f.isStandActive = true;
              f.standAlpha = 1.0;
              f.standName = 'Epitaph & 1 KC Arm';
              f.cooldowns.skill1 = 0; // Epitaph ready immediately!
              f.cooldowns.skill5 = f.isAI ? 240 : 90; // Prevent immediate accidental re-call
              f.energy = Math.min(f.maxEnergy, f.energy + 35);
              this.addTextParticle(f.x + f.width / 2, f.y - 52, '📞 「もしもし、ドッピオよ…」 BOSS ANSWERED (CALL #1)!', '#fb7185');
              this.addTextParticle(f.x + f.width / 2, f.y - 30, '🔮🦾 EPITAPH (SKILL U) & 1 KING CRIMSON ARM UNLOCKED!', '#e11d48');
              this.addMenacingParticle(f.x + f.width / 2, f.y - 12, 'エピタフ!!', '#e11d48');
            } else if (currentStage === 1) {
              // Call #2 Answered -> Unlock 2 Arms of King Crimson + Full Doppio vs Risotto Skillset!
              f.doppioStage = 2;
              f.hasStand = true;
              f.isStandActive = true;
              f.standAlpha = 1.0;
              f.standName = 'Epitaph & 2 KC Arms';
              f.cooldowns.skill1 = 0;
              f.cooldowns.skill2 = 0;
              f.cooldowns.skill3 = 0;
              f.cooldowns.skill4 = 0;
              f.cooldowns.skill5 = f.isAI ? 300 : 110; // Prevent immediate accidental 3rd call
              f.cooldowns.ultimate = 0;
              f.energy = Math.min(f.maxEnergy, f.energy + 50);
              this.addTextParticle(f.x + f.width / 2, f.y - 52, '📞 「わたしのかわいいドッピオ…」 BOSS ANSWERED (CALL #2)!', '#fb7185');
              this.addTextParticle(f.x + f.width / 2, f.y - 30, '🦾🦾 2 KING CRIMSON ARMS & RISOTTO ARSENAL UNLOCKED!!', '#e11d48');
              this.addMenacingParticle(f.x + f.width / 2, f.y - 12, '両腕貸すぞ!!', '#e11d48');
            } else if (currentStage === 2) {
              // Call #3 Answered -> Trigger King Crimson Screen Glitch & Anime Transformation into Diavolo!
              f.action = 'doppio_transform_diavolo';
              f.actionTimer = DOPPIO_TRANSFORM_DURATION;
              f.actionDuration = DOPPIO_TRANSFORM_DURATION;
              f.doppioGlitchTimer = DOPPIO_TRANSFORM_DURATION;
              f.invulnerableTimer = DOPPIO_TRANSFORM_DURATION + 20;
              f.vx = 0;
              f.vy = 0;
              soundManager.playDoppioTransformGlitch();
              this.screenShake = 24;
              this.addTextParticle(f.x + f.width / 2, f.y - 56, '📞⚡ 「ご苦労だったな、ドッピオ… ここはオレが出るッ！」', '#e11d48');
              this.addMenacingParticle(f.x + f.width / 2, f.y - 24, '帝王出現!!', '#fb7185');
            }
          } else {
            // 50% Not Answered: Boss didn't pick up yet!
            f.doppioCallResult = 'no_answer';
            soundManager.playDoppioNoAnswer();
            this.addTextParticle(f.x + f.width / 2, f.y - 42, '📵 「……ガチャ」 TIDAK DIANGKAT! (NO ANSWER - COBA TELPON LAGI!)', '#94a3b8');
            this.addMenacingParticle(f.x + f.width / 2, f.y - 18, 'プーッ…', '#64748b');
          }
        }
        break;
      }

      case 'doppio_transform_diavolo': {
        f.vx = 0;
        f.vy = 0;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 15);
        const t = f.actionTimer;

        // Continuous menacing crimson sparks & time-skip static tremors
        if (t % 4 === 0) {
          this.screenShake = Math.max(this.screenShake, t > 35 ? 8 : 14);
          this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 65, f.y + (Math.random()) * f.height, t % 8 === 0 ? '#e11d48' : '#a855f7');
        }
        if (t === 85) {
          this.addTextParticle(f.x + f.width / 2, f.y - 48, '🧥 DOPPIO RIPS OFF HIS SWEATER IN THE SHADOWS...', '#f472b6');
          this.addMenacingParticle(f.x + f.width / 2 - 28, f.y - 15, 'ズズズ…', '#e11d48');
        } else if (t === 60) {
          soundManager.playWhoosh();
          this.addShockwave(f.x + f.width / 2, f.y + 24, '#f472b6');
          this.addTextParticle(f.x + f.width / 2, f.y - 48, '👁️‍🗨️ 「これは『試練』だ… 過去に打ち勝てという『試練』とオレは受け取った…」', '#fb7185');
        } else if (t === 35) {
          // Climax: Full Diavolo & Full King Crimson Emerge!
          f.doppioStage = 3;
          f.hasStand = true;
          f.isStandActive = true;
          f.standAlpha = 1.0;
          f.name = 'Diavolo';
          f.userName = 'Diavolo (Boss Passione)';
          f.standName = 'King Crimson';
          f.hp = Math.min(f.maxHp, f.hp + 150);
          f.energy = f.maxEnergy;
          f.cooldowns.skill1 = 0;
          f.cooldowns.skill2 = 0;
          f.cooldowns.skill3 = 0;
          f.cooldowns.skill4 = 0;
          f.cooldowns.skill5 = 0;
          f.cooldowns.ultimate = 0;
          f.cooldowns.timeStop = 0;

          soundManager.playPoseSound('king_crimson');
          soundManager.playHeavyImpact();
          this.screenShake = 28;
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#e11d48');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#fb7185');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ffffff');
          this.addTextParticle(f.x + f.width / 2, f.y - 60, '👑 「帝王はこのディアボロだッ！！」 DIAVOLO AWAKENED!! (+150 HP & MAX ENERGY)', '#e11d48');
          this.addMenacingParticle(f.x + f.width / 2, f.y - 25, 'キング・クリムゾン!!', '#fb7185');

          // Knockback nearby enemies with King Crimson's awakening shockwave!
          const targets = this.getTargetsForAttacker(f, opponent);
          for (const target of targets) {
            const dist = Math.abs((target.x + target.width / 2) - (f.x + f.width / 2));
            if (dist < 240) {
              const pushDir = target.x >= f.x ? 1 : -1;
              this.applyRawDamage(target, 65, pushDir * 16, -7, f);
              target.hitStun = 38;
              target.isGrounded = false;
            }
          }
        }
        break;
      }

      case 'doppio_scalpel_throw':
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (f.actionTimer === 14) {
          this.executeDoppioScalpelThrow(f);
        }
        break;

      case 'doppio_twin_arms_rush': {
        f.isStandActive = true;
        f.standAlpha = 1.0;
        const rushDir = f.facing === 'right' ? 1 : -1;
        if (f.actionTimer > 10) {
          f.vx = rushDir * 6.5;
          if (f.actionTimer % 5 === 0) {
            this.executeDoppioTwinArmsHit(f, opponent);
          }
        } else if (f.actionTimer === 8) {
          this.executeDoppioTwinArmsFinisher(f, opponent);
        } else {
          f.vx *= 0.7;
        }
        break;
      }

      case 'doppio_scissors_riposte':
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (f.actionTimer === 20) {
          // Throat metallic flash & blood droplets
          for (let i = 0; i < 10; i++) {
            this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 20, f.y + 18 + (Math.random() - 0.5) * 14, i % 2 === 0 ? '#e2e8f0' : '#dc2626');
          }
        } else if (f.actionTimer === 14) {
          this.executeDoppioScissorsRiposte(f, opponent);
        }
        break;

      case 'doppio_aerosmith_bait':
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (f.actionTimer === 38) {
          // Doppio throws bait scalpels toward opponent to lure Aerosmith's CO2 radar
          this.executeDoppioScalpelThrow(f);
          this.addTextParticle(opponent.x + opponent.width / 2, opponent.y - 55, '🎯 [AEROSMITH CO2 RADAR LOCKED ON TARGET!]', '#facc15');
        } else if (f.actionTimer <= 30 && f.actionTimer >= 10 && f.actionTimer % 4 === 0) {
          this.executeDoppioAerosmithBarrage(f, opponent, f.actionTimer === 10);
        }
        break;

      case 'epitaph_forecast':
        f.vx *= 0.6;
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (f.actionTimer === 18 || f.actionTimer === 10) {
          this.addShockwave(f.x + f.width / 2, f.y + 16, '#f43f5e');
          for (let i = 0; i < 8; i++) {
            this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 40, f.y + 14 + (Math.random() - 0.5) * 24, '#fb7185');
          }
        }
        break;

      case 'epitaph_counter_slash':
        f.isStandActive = true;
        f.standAlpha = 1.0;
        if (f.actionTimer === 14) {
          this.executeEpitaphCounterSlash(f, opponent);
        }
        break;

      case 'crimson_cleave': {
        f.isStandActive = true;
        f.standAlpha = 1.0;
        const cleaveDir = f.facing === 'right' ? 1 : -1;
        if (f.actionTimer === 22) {
          // First Diagonal Slash lunge
          f.vx = cleaveDir * 15;
          soundManager.playSwordSlash();
          const firstBox = this.createOrientedHitbox(f, 150, 75, Math.round(CRIMSON_CLEAVE_DAMAGE * 0.35), 4, 0, {
            hitStun: 22,
            yOffset: 4,
            reactionType: 'heavy_stagger',
          });
          const slashX = f.x + f.width / 2 + cleaveDir * 55;
          this.addShockwave(slashX, f.y + 38, '#e11d48');
          for (const t of this.getTargetsForAttacker(f, opponent)) {
            if (this.checkCollision(firstBox, t)) {
              this.applyHit(f, t, firstBox);
              t.invulnerableTimer = 0; // Allow second X-slash to connect
            }
          }
        } else if (f.actionTimer === 12) {
          // Second Cross-Slash X-Cleave Finisher
          f.vx = cleaveDir * 6;
          for (const t of this.getTargetsForAttacker(f, opponent)) {
            t.invulnerableTimer = 0;
          }
          this.executeCrimsonCleave(f, opponent);
        } else if (f.actionTimer < 12) {
          f.vx *= 0.75;
        }
        break;
      }

      case 'fate_crusher': {
        f.isStandActive = true;
        f.standAlpha = 1.0;
        const crushDir = f.facing === 'right' ? 1 : -1;
        if (f.actionTimer > 16) {
          f.vx = crushDir * 8.0;
        } else if (f.actionTimer === 16) {
          f.vy = 18;
          f.vx = crushDir * 3.0;
          soundManager.playWhoosh();
        } else if (f.actionTimer === 13) {
          f.y = GROUND_Y - f.height;
          f.vy = 0;
          f.vx = 0;
          f.isGrounded = true;
          this.executeFateCrusher(f, opponent);
        } else {
          f.vx *= 0.7;
        }
        break;
      }

      case 'donut_strike':
        if (f.actionTimer === 12) {
          this.executeDonutStrike(f, opponent);
        }
        if (f.grabbedTarget) {
          opponent.action = 'grabbed';
          opponent.x = f.x + (f.facing === 'right' ? 65 : -opponent.width - 65);
          opponent.y = f.y;
          opponent.vx = 0;
          opponent.vy = 0;
        }
        if (f.actionTimer === 1 && f.grabbedTarget) {
          this.executeDonutThrow(f, opponent);
        }
        break;

      case 'flesh_throw':
        if (f.actionTimer === 18) {
          // Self wrist-slash arterial blood spray
          const wristX = f.facing === 'right' ? f.x + f.width - 4 : f.x + 4;
          const wristY = f.y + 26;
          for (let i = 0; i < 12; i++) {
            this.addSpark(wristX + (Math.random() - 0.5) * 18, wristY + (Math.random() - 0.5) * 16, i % 2 === 0 ? '#7f1d1d' : '#dc2626');
          }
        } else if (f.actionTimer === 12) {
          this.executeFleshThrow(f, opponent);
        }
        break;

      case 'time_erase_ambush':
        if (f.actionTimer === 29) {
          // Leave crimson time-skip afterimage at origin
          if (!f.afterimages) f.afterimages = [];
          f.afterimages.push({
            x: f.x,
            y: f.y,
            alpha: 1.0,
            facing: f.facing,
            charId: 'king_crimson',
            color: 'rgba(225, 29, 72, 0.9)',
          });
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#9f1239');
          const ambushX = opponent.facing === 'right' ? opponent.x - 62 : opponent.x + opponent.width + 22;
          f.x = Math.max(40, Math.min(this.getArenaWidth() - 80, ambushX));
          f.y = opponent.y;
          f.facing = opponent.x >= f.x ? 'right' : 'left';
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#e11d48');
          this.addTextParticle(f.x + f.width / 2, f.y - 38, '⏱️ TIME ERASED — BEHIND YOU!!', '#fb7185');
        } else if (f.actionTimer === 15) {
          this.executeDonutStrikeAmbush(f, opponent);
        }
        if (f.grabbedTarget) {
          opponent.action = 'grabbed';
          opponent.x = f.x + (f.facing === 'right' ? 65 : -opponent.width - 65);
          opponent.y = f.y;
          opponent.vx = 0;
          opponent.vy = 0;
        }
        if (f.actionTimer === 1 && f.grabbedTarget) {
          this.executeDonutThrow(f, opponent);
        }
        break;

      // POLNAREFF ACTIONS
      case 'ray_of_light':
        if (f.actionTimer % 4 === 0) {
          this.executeRayOfLightHit(f, opponent);
        }
        break;

      case 'shooting_sword':
        if (f.actionTimer === 10) {
          this.executeShootingSword(f, opponent);
        }
        break;

      case 'upward_thrust':
        if (f.actionTimer === 12) {
          this.executeUpwardThrust(f, opponent);
        }
        break;

      case 'afterimage_mirage':
        if (f.actionTimer === 25) {
          this.executeAfterimageMirage(f, opponent);
        }
        break;

      // JOSUKE ACTIONS
      case 'ground_punch':
        this.executeGroundPunch(f, opponent);
        break;

      case 'enraged_stagger':
        if (f.actionTimer % 6 === 0) {
          this.executeEnragedStagger(f, opponent);
        }
        break;

      // TOORU ACTIONS
      case 'tooru_chill_tap':
        if (f.actionTimer === 12) {
          this.addMenacingParticle(f.x, f.y - 15, '🎵', '#94a3b8');
        }
        break;

      case 'tooru_calamity_curse':
        if (f.actionTimer === 20) {
          this.triggerCalamity(f, opponent);
        }
        break;

      case 'tooru_head_doctor':
        if (f.actionTimer % 20 === 0) {
          this.addMenacingParticle(f.x, f.y - 20, 'ゴ', '#64748b');
        }
        break;

      case 'tooru_rock_insects':
        break;

      case 'tooru_calamity_counter':
        if (f.actionTimer % 15 === 0) {
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ef4444');
        }
        break;

      case 'tooru_calamity_rain':
        if (f.actionTimer % 12 === 0) {
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ef4444');
        }
        break;

      // PUCCI ACTIONS
      case 'pucci_pistol':
        if (f.actionTimer === 12) {
          this.executePucciPistol(f, opponent);
        }
        break;

      case 'pucci_memory_disc':
        if (f.actionTimer === 14) {
          this.executePucciMemoryDisc(f, opponent);
        }
        break;

      case 'pucci_acid_melt':
        if (f.actionTimer === 12) {
          this.executePucciAcidMelt(f, opponent);
        }
        break;

      case 'pucci_stand_disc':
        if (f.actionTimer === 12) {
          this.executePucciStandDisc(f, opponent);
        }
        break;

      case 'pucci_14_words_chant':
        this.handlePucciChantFrame(f);
        break;

      case 'cmoon_gravity_shift':
        if (f.actionTimer === 12) {
          this.executeCmoonGravityShift(f);
        }
        break;

      case 'cmoon_inversion_punch':
        if (f.actionTimer === 14) {
          this.executeCmoonInversionPunch(f, opponent);
        }
        break;

      case 'cmoon_debris_launch':
        if (f.actionTimer === 14) {
          this.executeCmoonDebrisLaunch(f, opponent);
        }
        break;

      case 'cmoon_gravity_shield':
        if (f.actionTimer % 15 === 0) {
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#22c55e');
        }
        break;

      case 'cmoon_evolve_mih':
        this.handlePucciMiHEvolutionFrame(f);
        break;

      case 'mih_speed_blitz':
        if (f.actionTimer % 6 === 0 && f.actionTimer > 0) {
          this.executeMihSpeedBlitzHit(f, opponent, Math.floor((36 - f.actionTimer) / 6));
        }
        break;

      case 'dipez_light_speed_blitz':
        this.executeDipezLightSpeedBlitzFrame(f, opponent);
        break;

      case 'dipez_evolution_startup': {
        f.vx = 0;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 15);

        if (f.actionTimer > 120) {
          // Phase 1: Piercing Eye Ignition Erupts Strictly Inside Head (Base Form Grounded)
          f.dipezForm = 'base';
          f.isGrounded = true;
          f.vy = 0;
          f.y = GROUND_Y - f.height;
          f.auraColor = undefined; // No full-body aura yet!

          // Concentrated photon micro-sparks from eye coordinates
          if (f.actionTimer % 3 === 0) {
            const eyeX = f.x + f.width / 2 + (f.facing === 'right' ? 8 : -8);
            const eyeY = f.y + 12;
            this.addSpark(eyeX, eyeY, '#ffffff');
            this.addSpark(eyeX, eyeY, '#38bdf8');
          }
          if (f.actionTimer % 6 === 0) {
            this.screenShake = Math.max(this.screenShake, 3);
          }
        } else if (f.actionTimer > 70) {
          // Phase 2: Levitation & Blinding Fissure Cracks Across Body
          f.dipezForm = 'base';
          f.isGrounded = false;
          const targetHoverY = GROUND_Y - f.height - 75;
          if (f.y > targetHoverY) {
            f.y = Math.max(targetHoverY, f.y - 2.5);
          }
          f.vy = 0;
          this.screenShake = Math.max(this.screenShake, 8);

          // Escaping light fissures emit radiant solar particles
          if (f.actionTimer % 2 === 0) {
            this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#fef08a');
            this.addSpark(f.x + Math.random() * f.width, f.y + Math.random() * f.height, '#ffffff');
          }
        } else if (f.actionTimer === 70) {
          // Phase 3: PHYSICAL SHELL SHATTERS! Detonates in a cataclysmic photon nova
          f.dipezForm = 'pure_light';
          f.isGrounded = false;
          f.vy = 0;
          f.auraColor = 'gold';

          soundManager.playDipezShatterNova();
          soundManager.playHeavyImpact();
          soundManager.playOverdriveExplosion();
          soundManager.playDipezEvolution();

          this.screenShake = 36;
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ffffff');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#fef08a');

          // Exploding shell fragments & radiant debris
          for (let i = 0; i < 30; i++) {
            this.addSpark(f.x + (Math.random() - 0.5) * 110, f.y + (Math.random() - 0.5) * 110, '#ffffff');
            this.addSpark(f.x + (Math.random() - 0.5) * 110, f.y + (Math.random() - 0.5) * 110, '#fef08a');
          }
        } else if (f.actionTimer > 0) {
          // Phase 4: Radiant Pure Light Entity Manifested
          f.dipezForm = 'pure_light';
          f.auraColor = 'gold';
          f.vy = 0;

          // Smooth graceful descent as timer approaches conclusion
          if (f.actionTimer < 25) {
            f.y = Math.min(GROUND_Y - f.height, f.y + 3.0);
          }
          if (f.actionTimer === 1) {
            f.y = GROUND_Y - f.height;
            f.isGrounded = true;
          }
        }
        break;
      }

      case 'dipez_star_maker': {
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 25);
        f.vx = 0;
        f.vy = 0;
        f.isGrounded = false;

        const centerX = f.x + f.width / 2;
        const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);

        if (f.actionTimer > 80) {
          // Phase 1: Singularity Gravitational Well & Accretion Vortex (180 -> 80)
          // Gravitational suction pulls opponent into center vortex
          for (const t of targets) {
            if (t.charId === 'dipez' && t.dipezForm === 'pure_light') continue;
            if (t.isTimeEraseActive) continue;
            const targetCenterX = t.x + t.width / 2;
            const pullDir = targetCenterX < centerX ? 1 : -1;
            const dist = Math.abs(targetCenterX - centerX);

            if (dist > 15) {
              t.vx = pullDir * Math.min(7.5, dist * 0.08 + 2.5);
            } else {
              t.vx = 0;
            }

            t.action = 'hit';
            t.actionTimer = 16;
            t.actionDuration = 16;
            t.hitStun = Math.max(t.hitStun, 16);
            t.invulnerableTimer = 0;
            t.isGrounded = false;

            // Gravitational compression stress ticks every 5 frames
            if (f.actionTimer % 5 === 0) {
              this.applyRawDamage(t, 5, pullDir * 2.0, -0.6, f);
              this.screenShake = Math.max(this.screenShake, 5);
              this.addSpark(targetCenterX + (Math.random() - 0.5) * 35, t.y + t.height / 2 + (Math.random() - 0.5) * 30, '#38bdf8');
              this.addSpark(targetCenterX + (Math.random() - 0.5) * 25, t.y + t.height / 2 + (Math.random() - 0.5) * 20, '#ffffff');
            }
          }
        } else if (f.actionTimer > 30) {
          // Phase 2: Stellar Fusion Supercharge & Coronal Heat (80 -> 30)
          // Opponents held immobilized in mid-air right underneath the infant star
          for (const t of targets) {
            if (t.charId === 'dipez' && t.dipezForm === 'pure_light') continue;
            if (t.isTimeEraseActive) continue;
            t.action = 'hit';
            t.actionTimer = 18;
            t.actionDuration = 18;
            t.hitStun = Math.max(t.hitStun, 20);
            t.invulnerableTimer = 0;
            t.vx *= 0.4;
            t.vy = -0.5;
            t.isGrounded = false;

            // Coronal solar radiation ticks every 4 frames
            if (f.actionTimer % 4 === 0) {
              this.applyRawDamage(t, 8, 0, -0.5, f);
              t.burnedTimer = Math.max(t.burnedTimer || 0, 240);
              this.screenShake = Math.max(this.screenShake, 7);
              this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 40, t.y + t.height / 2 + (Math.random() - 0.5) * 35, '#fef08a');
              this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 25, t.y + t.height / 2 + (Math.random() - 0.5) * 25, '#ffffff');
            }
          }
        } else if (f.actionTimer === 30) {
          // Phase 3: THE CELESTIAL SUPERNOVA DETONATION!
          soundManager.playDipezShatterNova();
          soundManager.playHeavyImpact();
          soundManager.playOverdriveExplosion();

          this.screenShake = 45;
          this.addShockwave(centerX, f.y + f.height / 2, '#ffffff');
          this.addShockwave(centerX, f.y + f.height / 2, '#fef08a');
          this.addShockwave(centerX, f.y + f.height / 2, '#38bdf8');

          for (let s = 0; s < 45; s++) {
            this.addSpark(centerX + (Math.random() - 0.5) * 180, (f.y + f.height / 2) + (Math.random() - 0.5) * 160, '#ffffff');
            this.addSpark(centerX + (Math.random() - 0.5) * 150, (f.y + f.height / 2) + (Math.random() - 0.5) * 140, '#fef08a');
          }

          for (const t of targets) {
            if (t.charId === 'dipez' && t.dipezForm === 'pure_light') continue;
            if (t.isTimeEraseActive) continue;
            const launchDir = (t.x + t.width / 2) >= centerX ? 1 : -1;
            this.applyRawDamage(t, 90, launchDir * 26, -16, f);
            t.action = 'knockback';
            t.actionTimer = 50;
            t.actionDuration = 50;
            t.hitStun = 60;
            t.invulnerableTimer = 0;
            t.isGrounded = false;
            t.burnedTimer = 360; // 6s burn
          }
        } else if (f.actionTimer > 0) {
          // Phase 4: Celestial Calm & Graceful Return (30 -> 1)
          if (f.actionTimer < 25) {
            f.y = Math.min(GROUND_Y - f.height, f.y + 4.5);
          }
          if (f.actionTimer === 1) {
            f.y = GROUND_Y - f.height;
            f.isGrounded = true;
            f.dipezStarMakerActive = false;
          }
        }
        break;
      }

      case 'mih_time_acceleration':
        if (f.actionTimer === 12) {
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
        }
        break;

      case 'mih_knife_throw':
        if (f.actionTimer === 12) {
          this.executeMihKnifeThrow(f, opponent);
        }
        break;

      case 'mih_teleport_strike':
        if (f.actionTimer === 12) {
          this.executeMihTeleportStrike(f, opponent);
        }
        break;

      case 'mih_universe_reset':
        this.handlePucciUniverseResetFrame(f, opponent);
        break;

      // GAPPY (PART 8: JOJOLION) ACTIONS
      case 'gappy_bubble_plunder':
        if (f.actionTimer === 12) {
          this.executeGappyBubblePlunder(f, opponent);
        }
        break;

      case 'gappy_shave_moisture':
        if (f.actionTimer === 12) {
          this.executeGappyShaveMoisture(f, opponent);
        }
        break;

      case 'gappy_bubble_barrage':
        if (f.actionTimer % 4 === 0 && f.actionTimer > 8) {
          this.executeGappyBubbleBarrageHit(f, opponent);
        } else if (f.actionTimer === 4) {
          this.executeGappyBubbleBarrageFinisher(f, opponent);
        }
        break;

      case 'gappy_bubble_trap':
        if (f.actionTimer === 12) {
          this.executeGappyBubbleTrap(f, opponent);
        }
        break;

      case 'gappy_go_beyond':
        if (f.actionTimer === 45) {
          this.executeGappyGoBeyond(f, opponent);
        }
        break;

      // WALLY WABLE / PERSTEIN (WABLE THE METAL CUTTER)
      case 'perstein_chain_whip':
        if (f.actionTimer === 12) {
          this.executePersteinChainWhip(f, opponent);
        }
        break;

      case 'perstein_chain_bind_shred':
        if (f.actionTimer % 4 === 0 && f.actionTimer > 6) {
          this.executePersteinShredHit(f, opponent);
        } else if (f.actionTimer === 4) {
          this.executePersteinShredFinisher(f, opponent);
        }
        break;

      case 'perstein_spark_ignition':
        if (f.actionTimer === 10) {
          this.executePersteinSparkIgnition(f, opponent);
        }
        break;

      case 'perstein_awaken_deflection':
        if (f.actionTimer === 12) {
          f.persteinDeflectionTimer = PERSTEIN_DEFLECTION_DURATION;
          soundManager.playPersteinDeflection();
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
          this.addTextParticle(f.x + f.width / 2, f.y - 45, '⚙️ INVISIBLE DRIVE CHAIN WARD (4s)', '#38bdf8');
        }
        break;

      case 'perstein_awaken_touch':
        if (f.actionTimer === 14) {
          this.executePersteinAwakenTouch(f, opponent);
        }
        break;

      case 'perstein_ultimate':
        this.executePersteinUltimateFrame(f, opponent);
        break;
    }
  }

  // --- TOORU CALAMITY SPAWNERS & PASSIVE LOGIC ---
  private spawnCalamityRaindrop(f: Fighter, opponent: Fighter) {
    // Torrential piercing rain falling across entire map arena
    const arenaW = this.getArenaWidth();
    const targetX = Math.random() * (arenaW - 60) + 30;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'calamity_raindrop',
      subType: 'raindrop',
      x: targetX,
      y: -30,
      vx: (Math.random() - 0.5) * 6 - 2,
      vy: 32,
      baseVx: 0,
      baseVy: 32,
      width: 10,
      height: 30,
      damage: TOORU_CALAMITY_RAIN_TICK_DAMAGE,
      knockbackX: 0,
      knockbackY: 0,
      isFrozenInTime: false,
      life: 60,
      maxLife: 60,
      color: '#38bdf8',
    });
  }

  public spawnCalamityCarConvoy(f: Fighter, opponent: Fighter, count: number = 10) {
    if (this.timeStopState.isActive) return;
    const vehicleTypes: Array<'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi'> = [
      'sedan', 'suv', 'pickup', 'van', 'truck', 'semi', 'sedan', 'pickup', 'van', 'truck'
    ];
    for (let c = 0; c < count; c++) {
      const type = vehicleTypes[c % vehicleTypes.length];
      const dir: 1 | -1 = c % 2 === 0 ? 1 : -1;
      const sideIndex = Math.floor(c / 2);
      const offset = sideIndex * 210; // Spaced bumper-to-bumper in sequence on each side
      this.spawnRunawayCar(f, opponent, dir, type, offset);
    }
    soundManager.playTooruCalamity();
    soundManager.playCarCrash();
    this.screenShake = 16;
    this.addTextParticle(
      Math.min(this.getArenaWidth() - 300, Math.max(300, opponent.x)),
      opponent.y - 65,
      `🚗 🚙 🛻 🚚 [CALAMITY DUAL-SIDE CONVOY! (LEFT & RIGHT WALLS)]`,
      '#dc2626'
    );
  }

  private spawnRunawayCar(
    f: Fighter,
    opponent: Fighter,
    direction: 1 | -1,
    vehicleType?: 'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi',
    offsetDistance: number = 0
  ) {
    const arenaW = this.getArenaWidth();
    const types: Array<'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi'> = [
      'sedan', 'suv', 'pickup', 'van', 'truck', 'semi'
    ];
    const subType = vehicleType || types[Math.floor(Math.random() * types.length)];

    let width = 175;
    let height = 68;
    let damage = CALAMITY_CAR_DAMAGE;
    let color = '#dc2626';
    let label = '🚗 [CALAMITY: SPEEDING SEDAN!]';

    switch (subType) {
      case 'sedan':
        width = 175;
        height = 68;
        damage = 220;
        color = '#dc2626'; // Crimson Red Sedan
        label = '🚗 [CALAMITY: RUNAWAY SEDAN!]';
        break;
      case 'suv':
        width = 185;
        height = 80;
        damage = 240;
        color = '#0284c7'; // Deep Blue SUV
        label = '🚙 [CALAMITY: 4x4 OFFROAD SUV!]';
        break;
      case 'pickup':
        width = 195;
        height = 78;
        damage = 250;
        color = '#d97706'; // Amber Pickup
        label = '🛻 [CALAMITY: HEAVY PICKUP TRUCK!]';
        break;
      case 'van':
        width = 190;
        height = 86;
        damage = 235;
        color = '#64748b'; // Slate Silver Van
        label = '🚐 [CALAMITY: DELIVERY VAN HAZARD!]';
        break;
      case 'truck':
        width = 225;
        height = 100;
        damage = 280;
        color = '#059669'; // Emerald Box Truck
        label = '🚚 [CALAMITY: FREIGHT CARGO TRUCK!]';
        break;
      case 'semi':
        width = 260;
        height = 112;
        damage = 320;
        color = '#991b1b'; // Heavy Semi Trailer
        label = '🚛 [CALAMITY: MASSIVE SEMI TRAILER!]';
        break;
    }

    // Always spawn from OUTSIDE the map boundary walls (dinding map)
    const spawnX = direction === 1 
      ? -width - 80 - offsetDistance 
      : arenaW + 80 + offsetDistance;

    const speed = 38;

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'calamity_car',
      subType: subType,
      x: spawnX,
      y: GROUND_Y - height,
      vx: direction * speed,
      vy: 0,
      baseVx: direction * speed,
      baseVy: 0,
      width,
      height,
      damage,
      knockbackX: direction * 28,
      knockbackY: -15,
      isFrozenInTime: false,
      life: 180,
      maxLife: 180,
      color,
    });
    soundManager.playCarCrash();
    this.screenShake = 16;
    if (offsetDistance === 0) {
      this.addTextParticle(opponent.x + opponent.width / 2, opponent.y - 50, label, color);
    }
  }

  private spawnCalamityMeteor(f: Fighter, opponent: Fighter) {
    soundManager.playTooruCalamity();
    this.screenShake = 18;
    this.addTextParticle(opponent.x + opponent.width / 2, opponent.y - 70, '☄️ [CALAMITY: GIGANTIC EXTINCTION METEOR!]', '#ef4444');
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'calamity_meteor',
      subType: 'meteor',
      x: opponent.x - 35,
      y: -180,
      vx: (opponent.facing === 'right' ? -1 : 1) * 2,
      vy: 24,
      baseVx: 0,
      baseVy: 24,
      width: 110,
      height: 110,
      damage: TOORU_METEOR_DAMAGE,
      knockbackX: (f.facing === 'right' ? 1 : -1) * 20,
      knockbackY: -18,
      isFrozenInTime: false,
      life: 100,
      maxLife: 100,
      color: '#f97316',
    });
  }

  private triggerCalamity(tooru: Fighter, victim: Fighter) {
    if (this.timeStopState.isActive) return; // Strict immunity during Time Stop
    if (victim.charId === 'dipez' && victim.dipezForm === 'pure_light') {
      this.triggerDipezAutoBlink(victim, tooru);
      return; // Absolute light invincibility - Calamity logic cannot affect pure light!
    }
    if (victim.invulnerableTimer > 15) return;
    if (!!tooru.isParallelWorld !== !!victim.isParallelWorld) return; // Dimension isolation: Calamity cannot cross dimensions

    soundManager.playTooruCalamity();

    const dir = tooru.facing === 'right' ? 1 : -1;
    const events = [
      'falling_debris',
      'sudden_lightning',
      'self_trip',
      'projectile_ricochet',
      'spontaneous_combustion',
      'flying_vehicle',
      'flying_vehicle', // Solid chance for speeding car/truck in passive flow!
      'sharp_object_cut'
    ];

    const chosen = events[Math.floor(Math.random() * events.length)];

    switch (chosen) {
      case 'falling_debris': {
        const debrisTypes: Array<'billboard' | 'pot' | 'pole' | 'plane_door'> = ['billboard', 'pot', 'pole', 'plane_door'];
        const sub = debrisTypes[Math.floor(Math.random() * debrisTypes.length)];
        this.projectiles.push({
          id: this.projectileId++,
          ownerId: tooru.id,
          type: 'calamity_debris',
          subType: sub,
          x: victim.x + victim.width / 2 - 25,
          y: -80,
          vx: (Math.random() - 0.5) * 2,
          vy: 24,
          baseVx: 0,
          baseVy: 24,
          width: 50,
          height: 50,
          damage: CALAMITY_DEBRIS_DAMAGE,
          knockbackX: (Math.random() > 0.5 ? 1 : -1) * 8,
          knockbackY: -8,
          isFrozenInTime: false,
          life: 90,
          maxLife: 90,
          color: '#ef4444',
          rotation: Math.random() * Math.PI,
        });
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 45, '⚠️ [CALAMITY: FALLING OBJECT!]', '#ef4444');
        break;
      }

      case 'sudden_lightning': {
        if (victim.charId === 'dipez' && victim.dipezForm === 'pure_light') {
          this.triggerDipezAutoBlink(victim, tooru);
          break;
        }
        this.applyRawDamage(victim, CALAMITY_LIGHTNING_DAMAGE, 0, -4, tooru);
        victim.hitStun = 55;
        soundManager.playLightningStrike();
        this.screenShake = 9;
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 50, '⚡ [CALAMITY: SUDDEN LIGHTNING!]', '#38bdf8');
        for (let i = 0; i < 15; i++) {
          this.addSpark(victim.x + victim.width / 2, victim.y + Math.random() * victim.height, '#38bdf8');
        }
        break;
      }

      case 'self_trip': {
        if (victim.charId === 'dipez' && victim.dipezForm === 'pure_light') {
          this.triggerDipezAutoBlink(victim, tooru);
          break;
        }
        this.applyRawDamage(victim, CALAMITY_TRIP_DAMAGE, -dir * 6, 8, tooru);
        victim.hitStun = 45;
        victim.isGrounded = false;
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 35, '💥 [CALAMITY: FATAL TRIP & SLIP!]', '#facc15');
        soundManager.playHit(true);
        break;
      }

      case 'projectile_ricochet': {
        let reflectedAny = false;
        for (const p of this.projectiles) {
          if (p.ownerId === victim.id) {
            p.ownerId = tooru.id;
            p.vx = -p.vx * 1.8;
            p.damage = Math.round(p.damage * 1.5);
            p.color = '#ef4444';
            reflectedAny = true;
          }
        }
        if (!reflectedAny) {
          this.projectiles.push({
            id: this.projectileId++,
            ownerId: tooru.id,
            type: 'calamity_debris',
            subType: 'pot',
            x: victim.x + (dir * -120),
            y: victim.y + 20,
            vx: dir * 26,
            vy: -1,
            baseVx: dir * 26,
            baseVy: 0,
            width: 30,
            height: 30,
            damage: 130,
            knockbackX: dir * 12,
            knockbackY: -6,
            isFrozenInTime: false,
            life: 40,
            maxLife: 40,
            color: '#ef4444',
          });
        }
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 45, '🔄 [CALAMITY: RICOCHET TRAJECTORY!]', '#ef4444');
        break;
      }

      case 'spontaneous_combustion': {
        if (victim.charId === 'dipez' && victim.dipezForm === 'pure_light') {
          this.triggerDipezAutoBlink(victim, tooru);
          break;
        }
        victim.burnedTimer = 180;
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 45, '🔥 [CALAMITY: SPONTANEOUS COMBUSTION!]', '#f97316');
        for (let i = 0; i < 10; i++) {
          this.addMenacingParticle(victim.x + Math.random() * victim.width, victim.y + Math.random() * victim.height, '🔥', '#f97316');
        }
        break;
      }

      case 'flying_vehicle': {
        const carDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
        const vehicleTypes: Array<'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi'> = [
          'sedan', 'suv', 'pickup', 'van', 'truck', 'semi'
        ];
        const chosenType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        this.spawnRunawayCar(tooru, victim, carDir, chosenType);
        break;
      }

      case 'sharp_object_cut': {
        if (victim.charId === 'dipez' && victim.dipezForm === 'pure_light') {
          this.triggerDipezAutoBlink(victim, tooru);
          break;
        }
        victim.bleedTimer = 180;
        this.applyRawDamage(victim, 60, dir * 4, -3, tooru);
        soundManager.playRazorCut();
        this.addTextParticle(victim.x + victim.width / 2, victim.y - 45, '🩸 [CALAMITY: FATAL LACERATION!]', '#dc2626');
        for (let i = 0; i < 8; i++) {
          this.addMenacingParticle(victim.x + Math.random() * victim.width, victim.y + Math.random() * victim.height, '🩸', '#dc2626');
        }
        break;
      }
    }
  }

  // --- JOSUKE SKILLS ACTIONS ---
  private executeGroundPunch(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const duration = f.actionDuration || 54;
    const elapsed = duration - f.actionTimer;
    const originX = f.x + f.width / 2 + dir * 48;

    // Phase 1 (elapsed 0..11): Crazy Diamond rapid DORARARARA ground-pound windup
    if (elapsed < 12) {
      if (elapsed % 3 === 0) {
        soundManager.playBarrageHit();
        this.screenShake = Math.max(this.screenShake, 5);
        this.addSpark(originX + (Math.random() * 24 - 12), GROUND_Y - 8, elapsed % 6 === 0 ? '#f43f5e' : '#38bdf8');
      }
      return;
    }

    // Phase 2 Moment of Cataclysmic Earth Shatter (elapsed === 12)
    if (elapsed === 12) {
      soundManager.playHeavyImpact();
      soundManager.playOverdriveExplosion();
      this.screenShake = 18.0;
      this.addShockwave(originX, GROUND_Y - 12, '#f43f5e');
      this.addShockwave(originX + dir * 38, GROUND_Y - 18, '#38bdf8');
      for (let i = 0; i < 16; i++) {
        this.addSpark(
          originX + (Math.random() * 60 - 30),
          GROUND_Y - 15 + (Math.random() * 20 - 10),
          i % 3 === 0 ? '#facc15' : i % 2 === 0 ? '#38bdf8' : '#f43f5e'
        );
      }
    }

    // Phase 2 Traveling Tectonic Pillar Eruption Wave (elapsed 12..42)
    // Pillars i = 1..9 are at originX + dir * (i * 38), erupting at startFrame = 10 + i * 2.5
    if (elapsed >= 12 && elapsed <= 42) {
      if (!Array.isArray((f as any).josukeUltHitIds)) {
        (f as any).josukeUltHitIds = [];
      }
      const hitIds: string[] = (f as any).josukeUltHitIds;

      // Spawn traveling ground sparks along the currently erupting pillar front
      const currentPillarIdx = Math.min(9, Math.max(1, Math.floor((elapsed - 10) / 2.5)));
      const frontX = originX + dir * (currentPillarIdx * 38);
      if (elapsed % 2 === 0 && elapsed <= 34) {
        this.screenShake = Math.max(this.screenShake, 7);
        this.addSpark(frontX + (Math.random() * 24 - 12), GROUND_Y - 24, elapsed % 4 === 0 ? '#38bdf8' : '#f43f5e');
      }

      // Check all valid enemy targets and launch them at the EXACT frame the ground pillar erupts beneath them!
      const targets = this.getTargetsForAttacker(f, opponent);
      for (const target of targets) {
        if (hitIds.includes(target.id)) continue;

        const targetCenterX = target.x + target.width / 2;
        const relDist = (targetCenterX - originX) * dir;

        // Check if any currently erupting pillar (1..9) overlaps the target horizontally and vertically
        let hitByPillar = false;
        let hitPillarX = targetCenterX;

        for (let i = 1; i <= 9; i++) {
          const startFrame = 10 + i * 2.5;
          const localWave = (elapsed - startFrame) / 18;
          // Pillar is actively erupting upward during localWave in [0, 0.65]
          if (localWave >= 0 && localWave <= 0.65) {
            const slabX = i * 38;
            if (Math.abs(relDist - slabX) <= 36 + target.width * 0.5) {
              hitByPillar = true;
              hitPillarX = originX + dir * slabX;
              break;
            }
          }
        }

        // Also cover point-blank impact right at Crazy Diamond's fists (relDist between -20 and 38) on initial slam
        if (!hitByPillar && elapsed >= 12 && elapsed <= 18 && relDist >= -24 && relDist <= 42) {
          hitByPillar = true;
          hitPillarX = originX;
        }

        // Target must be within vertical reach of the erupting pillars (up to 135px above ground)
        const withinVerticalEruption = (target.y + target.height) >= (GROUND_Y - 135);

        if (hitByPillar && withinVerticalEruption) {
          hitIds.push(target.id);
          const hitbox: Hitbox = {
            x: target.x - 15,
            y: target.y - 15,
            width: target.width + 30,
            height: target.height + 30,
            damage: JOSUKE_GROUND_PUNCH_DAMAGE,
            knockbackX: dir * 6,
            knockbackY: -19, // Tectonic Upward Launcher!
            hitStun: 50,
            reactionType: 'anti_air_launch'
          };
          this.applyHit(f, target, hitbox);
          soundManager.playHeavyImpact();
          this.screenShake = 16.0;
          this.addShockwave(hitPillarX, GROUND_Y - 24, '#38bdf8');
          this.addShockwave(targetCenterX, target.y + target.height / 2, '#f43f5e');
          this.addTextParticle(targetCenterX, target.y - 35, '💥 ドラララァッ！TECTONIC LAUNCH!!', '#38bdf8');
          for (let s = 0; s < 20; s++) {
            this.addSpark(
              targetCenterX + (Math.random() * 50 - 25),
              GROUND_Y - 25 + (Math.random() * 40 - 20),
              s % 3 === 0 ? '#facc15' : s % 2 === 0 ? '#38bdf8' : '#f43f5e'
            );
          }
        }
      }
    }
  }

  private executeEnragedStagger(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const hitbox: Hitbox = {
      x: f.facing === 'right' ? f.x + f.width : f.x - 70,
      y: f.y + 10,
      width: 75,
      height: 55,
      damage: 16,
      knockbackX: dir * 9,
      knockbackY: -3,
      hitStun: 22
    };
    if (this.checkCollision(hitbox, opponent)) {
      this.applyHit(f, opponent, hitbox);
    }
  }

  // --- PUCCI SKILL DISPATCHER & EVOLUTION LOGIC ---
  private handlePucciSkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const form = f.pucciForm || 'whitesnake';
    const isTraining = this.matchConfig.mode === 'training';

    // Stand Toggle
    if (input.toggleStand && f.cooldowns.standToggle <= 0) {
      f.isStandActive = !f.isStandActive;
      f.cooldowns.standToggle = 25;
      soundManager.playPucciDisc();
      const standTitle = form === 'made_in_heaven' ? 'MADE IN HEAVEN' : form === 'cmoon' ? 'C-MOON' : 'WHITESNAKE';
      this.addTextParticle(f.x + f.width / 2, f.y - 40, `✨ ${standTitle} ${f.isStandActive ? 'MANIFESTED' : 'RETRACTED'}`, f.color);
      return true;
    }

    if (form === 'whitesnake') {
      // Skill 1 - Pistol Shot (Key U / SKILL 1)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= PUCCI_PISTOL_COST || isTraining)) {
        f.action = 'pucci_pistol';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = PUCCI_PISTOL_COOLDOWN;
        if (!isTraining) f.energy -= PUCCI_PISTOL_COST;
        soundManager.playPucciGunshot();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🔫 PISTOL SHOT!', '#e2e8f0');
        return true;
      }

      // Skill 2 - Memory Disc Extract (Key I / SKILL 2)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= PUCCI_MEMORY_DISC_COST || isTraining)) {
        f.action = 'pucci_memory_disc';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill2 = PUCCI_MEMORY_DISC_COOLDOWN;
        if (!isTraining) f.energy -= PUCCI_MEMORY_DISC_COST;
        f.isStandActive = true;
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '💿 MEMORY DISC EXTRACT!', '#c084fc');
        return true;
      }

      // Skill 3 - Acid Melt Illusion (Key O / SKILL 3)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= PUCCI_ACID_MELT_COST || isTraining)) {
        f.action = 'pucci_acid_melt';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill3 = PUCCI_ACID_MELT_COOLDOWN;
        if (!isTraining) f.energy -= PUCCI_ACID_MELT_COST;
        soundManager.playAcidMelt();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🧪 ACID MELT ILLUSION!', '#a855f7');
        return true;
      }

      // Skill 4 - Stand Disc Command (Key P / SKILL 4)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= PUCCI_STAND_DISC_COST || isTraining)) {
        f.action = 'pucci_stand_disc';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill4 = PUCCI_STAND_DISC_COOLDOWN;
        if (!isTraining) f.energy -= PUCCI_STAND_DISC_COST;
        soundManager.playPucciDisc();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '💿 STAND DISC COMMAND!', '#e2e8f0');
        return true;
      }

      // Skill 5 / Evolution - 14 Words Recitation (Key [ or H / EVOLUTION)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && f.isGrounded) {
        f.action = 'pucci_14_words_chant';
        f.actionTimer = 252; // 14 words * 18 frames = 252 frames (~4.2s)
        f.actionDuration = 252;
        f.pucciChantStep = 0;
        f.vx = 0;
        f.cooldowns.skill5 = 120;
        soundManager.playPucciChant();
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '📿 [14 WORDS RECITATION STARTED!]', '#c084fc');
        this.addTextParticle(f.x + f.width / 2, f.y - 25, '⚠️ (DO NOT GET HIT - CAN BE INTERRUPTED)', '#fb7185');
        return true;
      }
    } else if (form === 'cmoon') {
      // Skill 1 - Gravity Axis Shift (Key U / SKILL 1)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= CMOON_GRAVITY_SHIFT_COST || isTraining)) {
        f.action = 'cmoon_gravity_shift';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill1 = CMOON_GRAVITY_SHIFT_COOLDOWN;
        if (!isTraining) f.energy -= CMOON_GRAVITY_SHIFT_COST;
        soundManager.playCmoonGravity();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌌 GRAVITY AXIS SHIFT!', '#10b981');
        return true;
      }

      // Skill 2 - Surface Inversion Punch (Key I / SKILL 2)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= CMOON_INVERSION_PUNCH_COST || isTraining)) {
        f.action = 'cmoon_inversion_punch';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill2 = CMOON_INVERSION_PUNCH_COOLDOWN;
        if (!isTraining) f.energy -= CMOON_INVERSION_PUNCH_COST;
        f.isStandActive = true;
        soundManager.playCmoonInversion();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌀 SURFACE INVERSION PUNCH!', '#10b981');
        return true;
      }

      // Skill 3 - Debris Gravitational Launch (Key O / SKILL 3)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= CMOON_DEBRIS_COST || isTraining)) {
        f.action = 'cmoon_debris_launch';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill3 = CMOON_DEBRIS_COOLDOWN;
        if (!isTraining) f.energy -= CMOON_DEBRIS_COST;
        soundManager.playCmoonGravity();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🪨 GRAVITATIONAL DEBRIS LAUNCH!', '#34d399');
        return true;
      }

      // Skill 4 - Gravity Repulsion Shield (Key P / SKILL 4)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= CMOON_SHIELD_COST || isTraining)) {
        f.action = 'cmoon_gravity_shield';
        f.actionTimer = 30;
        f.actionDuration = 30;
        f.cooldowns.skill4 = CMOON_SHIELD_COOLDOWN;
        f.cmoonShieldTimer = CMOON_SHIELD_DURATION;
        if (!isTraining) f.energy -= CMOON_SHIELD_COST;
        soundManager.playCmoonGravity();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🛡️ GRAVITY REPULSION SHIELD (3s)!', '#22c55e');
        return true;
      }

      // Skill 5 / Evolution - Made in Heaven (Cape Canaveral Evolution)
      if (input.skill5 && f.cooldowns.skill5 <= 0 && ((f.cmoonGauge || 0) >= 100 || isTraining)) {
        f.action = 'cmoon_evolve_mih';
        f.actionTimer = 80;
        f.actionDuration = 80;
        f.cooldowns.skill5 = 999;
        f.invulnerableTimer = 85;
        f.vx = 0;
        f.vy = 0;
        soundManager.playMiHAcceleration();
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '🌕 CAPE CANAVERAL GRAVITY ALIGNED!', '#facc15');
        this.addTextParticle(f.x + f.width / 2, f.y - 25, '👑 ASCENDING TO HEAVEN...', '#facc15');
        return true;
      }
    } else if (form === 'made_in_heaven') {
      // Skill 1 - Speed Blitz (Key U / SKILL 1)
      if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= MIH_SPEED_BLITZ_COST || isTraining)) {
        f.action = 'mih_speed_blitz';
        f.actionTimer = 36;
        f.actionDuration = 36;
        f.cooldowns.skill1 = MIH_SPEED_BLITZ_COOLDOWN;
        if (!isTraining) f.energy -= MIH_SPEED_BLITZ_COST;
        soundManager.playMiHBlitz();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '⚡ SPEED BLITZ (6 HITS)!', '#facc15');
        return true;
      }

      // Skill 2 - Time Acceleration (Key I / SKILL 2)
      if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= MIH_TIME_ACCEL_COST || isTraining)) {
        f.action = 'mih_time_acceleration';
        f.actionTimer = 24;
        f.actionDuration = 24;
        f.cooldowns.skill2 = MIH_TIME_ACCEL_COOLDOWN;
        f.mihTimeAccelTimer = MIH_TIME_ACCEL_DURATION;
        if (!isTraining) f.energy -= MIH_TIME_ACCEL_COST;
        soundManager.playMiHAcceleration();
        this.addTextParticle(f.x + f.width / 2, f.y - 45, '⏱️ TIME ACCELERATION ACTIVATED (5s)!', '#facc15');
        this.addTextParticle(f.x + f.width / 2, f.y - 20, '⚡ ALL MIH SKILL COOLDOWNS ACCELERATED!', '#ffffff');
        return true;
      }

      // Skill 3 - Invisible Knife Throw (Key O / SKILL 3)
      if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= MIH_KNIFE_COST || isTraining)) {
        f.action = 'mih_knife_throw';
        f.actionTimer = 18;
        f.actionDuration = 18;
        f.cooldowns.skill3 = MIH_KNIFE_COOLDOWN;
        if (!isTraining) f.energy -= MIH_KNIFE_COST;
        soundManager.playMiHKnife();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🔪 ACCELERATED INVISIBLE KNIVES!', '#e2e8f0');
        return true;
      }

      // Skill 4 - Speed Teleport Strike (Key P / SKILL 4)
      if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= MIH_TELEPORT_COST || isTraining)) {
        f.action = 'mih_teleport_strike';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill4 = MIH_TELEPORT_COOLDOWN;
        if (!isTraining) f.energy -= MIH_TELEPORT_COST;
        soundManager.playMiHBlitz();
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌀 SPEED TELEPORT AMBUSH!', '#facc15');
        return true;
      }

      // Ultimate - Universe Reset (Key Y / ULTIMATE or Key H / SKILL 5)
      const canReset = (input.ultimate || input.skill5) &&
        (f.cooldowns.ultimate <= 0 || f.cooldowns.skill5 <= 0) &&
        (f.energy >= MIH_UNIVERSE_RESET_COST || isTraining);
      if (canReset) {
        f.action = 'mih_universe_reset';
        f.actionTimer = 180; // 3 seconds
        f.actionDuration = 180;
        f.cooldowns.ultimate = MIH_UNIVERSE_RESET_COOLDOWN;
        f.cooldowns.skill5 = MIH_UNIVERSE_RESET_COOLDOWN;
        f.invulnerableTimer = 185;
        f.vx = 0;
        f.vy = 0;
        if (!isTraining) f.energy -= MIH_UNIVERSE_RESET_COST;
        soundManager.playUniverseReset();
        this.addTextParticle(f.x + f.width / 2, f.y - 55, '🌌 ★ UNIVERSE RESET: SINGULARITY ★ 🌌', '#facc15');
        return true;
      }
    }

    return false;
  }

  // --- JOSUKE HIGASHIKATA / GAPPY SKILLS & EXECUTION METHODS ---
  private handleGappySkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';

    // Stand Toggle
    if (input.toggleStand && f.cooldowns.standToggle <= 0) {
      f.isStandActive = !f.isStandActive;
      f.cooldowns.standToggle = 25;
      soundManager.playBubblePop();
      this.addTextParticle(f.x + f.width / 2, f.y - 40, `🧼 SOFT & WET ${f.isStandActive ? 'MANIFESTED' : 'RETRACTED'}`, '#38bdf8');
      return true;
    }

    // Skill 1 - Bubble Plunder (Friction Strip) (Key U / SKILL 1)
    if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= GAPPY_BUBBLE_PLUNDER_COST || isTraining)) {
      f.action = 'gappy_bubble_plunder';
      f.actionTimer = 22;
      f.actionDuration = 22;
      f.cooldowns.skill1 = GAPPY_BUBBLE_PLUNDER_COOLDOWN;
      if (!isTraining) f.energy -= GAPPY_BUBBLE_PLUNDER_COST;
      f.isStandActive = true;
      soundManager.playBubblePlunder();
      this.addTextParticle(f.x + f.width / 2, f.y - 40, '🧼 BUBBLE PLUNDER: ZERO FRICTION STRIP!', '#38bdf8');
      return true;
    }

    // Skill 2 - Shave & Moisture Theft (Key I / SKILL 2)
    if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= GAPPY_SHAVE_MOISTURE_COST || isTraining)) {
      f.action = 'gappy_shave_moisture';
      f.actionTimer = 24;
      f.actionDuration = 24;
      f.cooldowns.skill2 = GAPPY_SHAVE_MOISTURE_COOLDOWN;
      if (!isTraining) f.energy -= GAPPY_SHAVE_MOISTURE_COST;
      f.isStandActive = true;
      soundManager.playBubblePop();
      this.addTextParticle(f.x + f.width / 2, f.y - 40, '✂️ SHAVE & MOISTURE THEFT (ATK DRAIN)!', '#0284c7');
      return true;
    }

    // Skill 3 - Bubble Shot Barrage (Key O / SKILL 3)
    if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= GAPPY_BUBBLE_BARRAGE_COST || isTraining)) {
      f.action = 'gappy_bubble_barrage';
      f.actionTimer = 44;
      f.actionDuration = 44;
      f.cooldowns.skill3 = GAPPY_BUBBLE_BARRAGE_COOLDOWN;
      if (!isTraining) f.energy -= GAPPY_BUBBLE_BARRAGE_COST;
      f.isStandActive = true;
      this.addTextParticle(f.x + f.width / 2, f.y - 40, '🧼 ORA ORA BUBBLE SHOT BARRAGE!', '#38bdf8');
      return true;
    }

    // Skill 4 - Bubble Shield & Trap (Key P / SKILL 4)
    if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= GAPPY_BUBBLE_TRAP_COST || isTraining)) {
      f.action = 'gappy_bubble_trap';
      f.actionTimer = 24;
      f.actionDuration = 24;
      f.cooldowns.skill4 = GAPPY_BUBBLE_TRAP_COOLDOWN;
      if (!isTraining) f.energy -= GAPPY_BUBBLE_TRAP_COST;
      f.isStandActive = true;
      soundManager.playBubblePop();
      const dist = Math.abs((f.x + f.width / 2) - (opponent.x + opponent.width / 2));
      if (dist < 200) {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🫧 BUBBLE TRAP (SUSPENDED)!', '#7dd3fc');
      } else {
        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🫧 BUBBLE SHIELD ACTIVATED!', '#38bdf8');
      }
      return true;
    }

    // Skill 5 / Ultimate - Soft & Wet: Go Beyond (Key Y / ULTIMATE or Key H / SKILL 5)
    const canGoBeyond = (input.ultimate || input.skill5) &&
      (f.cooldowns.ultimate <= 0 || f.cooldowns.skill5 <= 0) &&
      (f.energy >= GAPPY_GO_BEYOND_COST || isTraining);
    if (canGoBeyond) {
      f.action = 'gappy_go_beyond';
      f.actionTimer = 90; // ~1.5s cast
      f.actionDuration = 90;
      f.cooldowns.ultimate = GAPPY_GO_BEYOND_COOLDOWN;
      f.cooldowns.skill5 = GAPPY_GO_BEYOND_COOLDOWN;
      f.invulnerableTimer = 95;
      f.gappyGoBeyondActive = true;
      f.gappyGoBeyondPhase = 'cast';
      f.gappyGoBeyondTimer = 90;
      f.gappyGoBeyondX = f.x + f.width / 2;
      f.gappyGoBeyondY = f.y + 20;
      if (!isTraining) f.energy -= GAPPY_GO_BEYOND_COST;
      soundManager.playGoBeyondLaunch();
      this.addTextParticle(f.x + f.width / 2, f.y - 55, '🌌 ★ SOFT & WET: GO BEYOND (見えないシャボン玉) ★', '#38bdf8');
      return true;
    }

    return false;
  }

  // --- FUNNY VALENTINE SKILLS & DUAL-DIMENSION MECHANICS (PART 7) ---
  private handleValentineSkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';

    // Stand Toggle
    if (input.toggleStand && f.cooldowns.standToggle <= 0) {
      f.isStandActive = !f.isStandActive;
      f.cooldowns.standToggle = 25;
      soundManager.playDojyaaan();
      this.addTextParticle(f.x + f.width / 2, f.y - 40, `★ D4C ${f.isStandActive ? 'MANIFESTED' : 'RETRACTED'} ★`, '#38bdf8');
      return true;
    }

    // Skill 1 - Change to Parallel / Paradox Pull (Key U / SKILL 1)
    if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= VALENTINE_PARALLEL_COST || isTraining || f.isParallelWorld)) {
      if (f.isParallelWorld) {
        // Re-trigger: Paradox Pull! (Return to base dimension and pull parallel enemy clone to collide)
        soundManager.playFlagSandwich();
        soundManager.playDojyaaan();
        f.action = 'valentine_paradox_pull';
        f.actionTimer = 35;
        f.actionDuration = 35;
        f.cooldowns.skill1 = VALENTINE_PARALLEL_COOLDOWN;
        f.isParallelWorld = false; // Transition back to real world!
        f.isParadoxColliding = true;
        f.paradoxCollisionTimer = 35;

        if (f.parallelEnemyClone) {
          f.parallelEnemyClone.isParallelWorld = false; // Drag clone to real world for paradox collision!
          f.parallelEnemyClone.x = opponent.x + (f.facing === 'right' ? 120 : -120);
          f.parallelEnemyClone.y = opponent.y;
        }

        this.addTextParticle(f.x + f.width / 2, f.y - 40, '💥 D4C: PARADOX PULL! MAGNETIZING CLONES!', '#f472b6');
        return true;
      } else {
        // Change to Parallel World
        f.action = 'valentine_parallel_shift';
        f.actionTimer = 30;
        f.actionDuration = 30;
        f.cooldowns.skill1 = VALENTINE_PARALLEL_COOLDOWN;
        if (!isTraining) f.energy -= VALENTINE_PARALLEL_COST;
        f.isStandActive = true;
        f.isParallelWorld = true;
        f.parallelWorldTimer = VALENTINE_PARALLEL_DURATION;
        f.flagSandwichActive = true;
        f.flagSandwichTimer = 25;
        f.invulnerableTimer = 30;

        soundManager.playFlagSandwich();
        soundManager.playDojyaaan();

        // Spawn Active CPU Enemy Clone in Parallel World
        const cloneId = 'parallel_enemy_' + Date.now();
        const cloneX = Math.max(80, Math.min(ARENA_WIDTH - 80, f.x + (f.facing === 'right' ? 220 : -220)));
        f.parallelEnemyClone = createFighter(
          cloneId,
          cloneX,
          f.facing === 'right' ? 'left' : 'right',
          opponent.charId || 'jotaro',
          this.matchConfig
        );
        f.parallelEnemyClone.isParallelWorld = true;
        f.parallelEnemyClone.isClone = true;
        f.parallelEnemyClone.isStandActive = true;
        f.parallelEnemyClone.standAlpha = 1.0;
        f.parallelEnemyClone.team = f.team === 'teamA' ? 'teamB' : 'teamA';
        f.parallelEnemyClone.energy = 100;
        f.parallelEnemyClone.hp = Math.max(300, Math.min(opponent.hp || 500, 500));

        this.addTextParticle(f.x + f.width / 2, f.y - 40, '🌀 D4C: CHANGE TO PARALLEL WORLD (DOJYAA~~N)!', '#38bdf8');
        return true;
      }
    }

    // Skill 2 - Parallel Self Army (Key I / SKILL 2)
    if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= VALENTINE_CLONE_ARMY_COST || isTraining)) {
      if (f.isClone) {
        // Clones cannot summon nested clones
        return false;
      }
      f.action = 'valentine_clone_summon';
      f.actionTimer = 25;
      f.actionDuration = 25;
      f.cooldowns.skill2 = VALENTINE_CLONE_ARMY_COOLDOWN;
      if (!isTraining) f.energy -= VALENTINE_CLONE_ARMY_COST;
      f.isStandActive = true;

      soundManager.playDojyaaan();
      soundManager.playFlagSandwich();

      // Spawn 2 Valentine Clones into Main World at distinct positions
      if (!f.valentineClones) f.valentineClones = [];
      const dir = f.facing === 'right' ? 1 : -1;
      const arenaW = this.getArenaWidth();
      const c1X = Math.max(60, Math.min(arenaW - 60, f.x - dir * 90));
      const c2X = Math.max(60, Math.min(arenaW - 60, f.x + dir * 110));

      const c1 = createFighter('val_clone_' + f.team + '_1_' + Date.now(), c1X, f.facing, 'funny_valentine', this.matchConfig);
      const c2 = createFighter('val_clone_' + f.team + '_2_' + Date.now(), c2X, f.facing, 'funny_valentine', this.matchConfig);

      // Valentine Clones are strictly STANDLESS (only barehand melee & Colt revolver pistols)
      c1.hasStand = false;
      c1.isStandActive = false;
      c1.standAlpha = 0;
      c1.standName = undefined;
      c1.isValentineClone = true;
      c1.cloneLifeTimer = VALENTINE_CLONE_DURATION;
      c1.team = f.team;
      c1.isClone = true;
      c1.isParallelWorld = !!f.isParallelWorld;

      c2.hasStand = false;
      c2.isStandActive = false;
      c2.standAlpha = 0;
      c2.standName = undefined;
      c2.isValentineClone = true;
      c2.cloneLifeTimer = VALENTINE_CLONE_DURATION;
      c2.team = f.team;
      c2.isClone = true;
      c2.isParallelWorld = !!f.isParallelWorld;

      for (let s = 0; s < 8; s++) {
        this.addSpark(c1X + 30, GROUND_Y - 40, '#f472b6');
        this.addSpark(c2X + 30, GROUND_Y - 40, '#f472b6');
      }

      f.valentineClones.push(c1, c2);

      this.addTextParticle(f.x + f.width / 2, f.y - 40, '👥 D4C: PARALLEL SELF ARMY (LIFE INSURANCE READY)!', '#f472b6');
      return true;
    }

    // Skill 3 - D4C Heavy Barrage (Key O / SKILL 3)
    if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= VALENTINE_BARRAGE_COST || isTraining)) {
      f.action = 'valentine_d4c_barrage';
      f.actionTimer = 40;
      f.actionDuration = 40;
      f.cooldowns.skill3 = VALENTINE_BARRAGE_COOLDOWN;
      if (!isTraining) f.energy -= VALENTINE_BARRAGE_COST;
      f.isStandActive = true;

      soundManager.playBarrageHit();
      this.screenShake = Math.max(this.screenShake, 5);

      const dir = f.facing === 'right' ? 1 : -1;
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: f.id,
        type: 'valentine_flag_whip',
        x: f.x + (dir === 1 ? f.width + 10 : -30),
        y: f.y + 15,
        vx: dir * 14,
        vy: 0,
        baseVx: dir * 14,
        baseVy: 0,
        width: 60,
        height: 40,
        damage: VALENTINE_BARRAGE_FINISHER_DAMAGE,
        knockbackX: dir * 16,
        knockbackY: -6,
        hitStun: 60,
        isFrozenInTime: false,
        life: 25,
        maxLife: 25,
        color: '#f472b6',
        subType: 'flag'
      });

      this.addTextParticle(f.x + f.width / 2, f.y - 40, '★ D4C: DOJYAA~~N HEAVY BARRAGE! ★', '#38bdf8');
      return true;
    }

    // Ultimate - D4C: Love Train (Key Y / ULTIMATE or Key P / SKILL 4 / SKILL 5)
    const canLoveTrain = (input.ultimate || input.skill4 || input.skill5) &&
      (f.cooldowns.ultimate <= 0 || f.cooldowns.skill4 <= 0) &&
      (f.energy >= VALENTINE_LOVE_TRAIN_COST || isTraining);

    if (canLoveTrain) {
      f.action = 'valentine_love_train';
      f.actionTimer = 45;
      f.actionDuration = 45;
      f.cooldowns.ultimate = VALENTINE_LOVE_TRAIN_COOLDOWN;
      f.cooldowns.skill4 = VALENTINE_LOVE_TRAIN_COOLDOWN;
      if (!isTraining) f.energy -= VALENTINE_LOVE_TRAIN_COST;
      f.isStandActive = true;

      f.isLoveTrainActive = true;
      f.loveTrainTimer = VALENTINE_LOVE_TRAIN_DURATION;
      f.invulnerableTimer = VALENTINE_LOVE_TRAIN_DURATION;

      soundManager.playLoveTrainActivate();
      this.screenShake = 12;

      this.addTextParticle(f.x + f.width / 2, f.y - 45, '✨ D4C: LOVE TRAIN (ABSOLUTE REDIRECTION)!', '#eab308');
      return true;
    }

    return false;
  }

  // --- VALENTINE CLONE (STANDLESS) REVOLVER & BAREHAND MELEE METHODS ---
  private executeValentineCloneRevolverShot(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    soundManager.playPucciPistol();
    this.screenShake = Math.max(this.screenShake, 4.5);

    const gunX = f.x + f.width / 2 + dir * 62;
    const gunY = f.y + 14;

    // Muzzle Flash sparks & high-energy blast
    this.addSpark(gunX, gunY, '#fde047');
    this.addSpark(gunX + dir * 6, gunY - 2, '#f97316');
    this.addSpark(gunX + dir * 10, gunY + 2, '#ffffff');
    this.addSpark(gunX + dir * 14, gunY, '#facc15');

    // Gunpowder smoke cloud & barrel flash
    for (let p = 0; p < 6; p++) {
      if (this.particles.length >= this.MAX_PARTICLES) this.particles.shift();
      this.particles.push({
        id: Math.random(),
        x: gunX + (Math.random() - 0.5) * 8,
        y: gunY + (Math.random() - 0.5) * 8,
        vx: dir * (2 + Math.random() * 3),
        vy: -0.8 - Math.random() * 1.2,
        life: 18,
        maxLife: 18,
        size: 9,
        color: '#cbd5e1',
        type: 'steam',
      });
    }

    this.addTextParticle(gunX, gunY - 24, '💥 BANG! (COLT .45)', '#fde047');

    const bulletWidth = 24;
    const bulletHeight = 8;
    const spawnX = dir === 1 ? gunX : gunX - bulletWidth;

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'valentine_bullet',
      x: spawnX,
      y: gunY - 4,
      vx: dir * 26,
      vy: 0,
      baseVx: dir * 26,
      baseVy: 0,
      width: bulletWidth,
      height: bulletHeight,
      damage: 28,
      knockbackX: dir * 12,
      knockbackY: -3,
      hitStun: 26,
      isFrozenInTime: false,
      life: 50,
      maxLife: 50,
      color: '#facc15',
      subType: 'bullet',
      isParallelWorld: !!f.isParallelWorld,
    });
  }

  private executeValentineCloneMeleePunch(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const reach = 90;
    const punchX = f.x + (dir === 1 ? f.width + 10 : -28);
    const punchY = f.y + 16;

    soundManager.playHit(false);
    const hitbox = this.createOrientedHitbox(f, reach, 56, 22, 10, 2.5, {
      hitStun: 18,
    });
    hitbox.reactionType = 'light_flinch';

    const targets = this.getTargetsForAttacker(f, opponent);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(f, t, hitbox);
        this.addSpark(punchX + 15, punchY + 10, '#ffffff');
        this.addSpark(punchX + 15, punchY + 10, '#f472b6');
        this.addTextParticle(t.x + t.width / 2, t.y - 25, '👊 PUNCH!', '#ffffff');
      }
    }
  }

  private executeValentineCloneMeleeKick(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const reach = 100;
    const kickX = f.x + (dir === 1 ? f.width + 12 : -32);
    const kickY = f.y + 24;

    soundManager.playHit(true);
    const hitbox = this.createOrientedHitbox(f, reach, 62, 28, 15, 6, {
      hitStun: 28,
    });
    hitbox.reactionType = 'heavy_stagger';

    const targets = this.getTargetsForAttacker(f, opponent);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(f, t, hitbox);
        this.screenShake = Math.max(this.screenShake, 4);
        this.addShockwave(kickX + 15, kickY + 10, '#f472b6');
        this.addSpark(kickX + 15, kickY + 10, '#facc15');
        this.addTextParticle(t.x + t.width / 2, t.y - 30, '💥 ROUNDHOUSE KICK!', '#f472b6');
      }
    }
  }

  // --- DIPEZ SKILLS & EVOLUTION MECHANICS ---
  private handleDipezSkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';
    const isPureLight = f.dipezForm === 'pure_light';
    const hasNoArms = !isPureLight && (f.dipezArmLostTimer !== undefined && f.dipezArmLostTimer > 0);

    // Skill 1 - Photon Bullet (Base) / Photon Invisibility (Pure Light Form) (Key U / SKILL 1)
    if (input.skill1 && f.cooldowns.skill1 <= 0) {
      if (hasNoArms) {
        soundManager.playDipezWhaa();
        f.cooldowns.skill1 = 20;
        return true;
      }
      if (f.energy >= 20 || isTraining || isPureLight) {
        if (isPureLight) {
          // Evolved Skill 1: Photon Invisibility (6 seconds invisible to enemies)
          f.action = 'dipez_invisibility';
          f.actionTimer = 20;
          f.actionDuration = 20;
          f.cooldowns.skill1 = 90;
          f.dipezInvisibleTimer = 360; // 6 seconds
          soundManager.playDipezTch();
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#fef08a');
          return true;
        }

        f.action = 'dipez_photon_bullet';
        f.actionTimer = 20;
        f.actionDuration = 20;
        f.cooldowns.skill1 = 40;
        if (!isTraining) f.energy -= 20;

        const dir = f.facing === 'right' ? 1 : -1;
        soundManager.playDipezTch();

        this.projectiles.push({
          id: this.projectileId++,
          ownerId: f.id,
          type: 'dipez_photon_bullet',
          x: f.x + (dir === 1 ? f.width + 10 : -35),
          y: f.y + 20,
          vx: dir * 28,
          vy: 0,
          baseVx: dir * 28,
          baseVy: 0,
          width: 35,
          height: 12,
          damage: 35,
          knockbackX: dir * 14,
          knockbackY: -4,
          hitStun: 30,
          isFrozenInTime: false,
          life: 45,
          maxLife: 45,
          color: '#fef08a',
        });

        return true;
      }
    }

    // Skill 2 - Flashbang (Base) / Omnipresent Map Laser (Pure Light Form) (Key I / SKILL 2)
    if (input.skill2 && f.cooldowns.skill2 <= 0) {
      if (hasNoArms) {
        soundManager.playDipezWhaa();
        f.cooldowns.skill2 = 20;
        return true;
      }
      if (f.energy >= 30 || isTraining || isPureLight) {
        if (isPureLight) {
          // Evolved Skill 2: Omnipresent Map Laser (Massive full map height & width laser beam!)
          f.action = 'dipez_map_laser';
          f.actionTimer = 60;
          f.actionDuration = 60;
          f.cooldowns.skill2 = 90;
          if (!isTraining) f.energy = Math.max(0, f.energy - 30);

          soundManager.playDipezDieYou();
          this.screenShake = 28;

          const arenaW = this.getArenaWidth();
          this.projectiles.push({
            id: this.projectileId++,
            ownerId: f.id,
            type: 'dipez_map_laser_beam',
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            baseVx: 0,
            baseVy: 0,
            width: arenaW,
            height: 540,
            damage: 140,
            knockbackX: (f.facing === 'right' ? 1 : -1) * 22,
            knockbackY: -10,
            hitStun: 60,
            isFrozenInTime: false,
            life: 60,
            maxLife: 60,
            color: '#38bdf8',
          });

          // Apply burn status to all opponents across map
          const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
          for (const t of targets) {
            t.burnedTimer = Math.max(t.burnedTimer || 0, 240); // 4s burn
          }

          return true;
        }

        f.action = 'dipez_flashbang';
        f.actionTimer = 25;
        f.actionDuration = 25;
        f.cooldowns.skill2 = 90;
        if (!isTraining) f.energy -= 30;

        soundManager.playDipezDieYou();
        this.screenShake = 12;

        const targets = this.getAllActiveFighters().filter(target => target.id !== f.id && target.team !== f.team && target.hp > 0);
        for (const target of targets) {
          const dx = (target.x + target.width / 2) - (f.x + f.width / 2);
          const dy = (target.y + target.height / 2) - (f.y + f.height / 2);
          const dist = Math.hypot(dx, dy);
          if (dist < 260) {
            target.blindedTimer = 90; // 1.5s Blind (screen goes pure white for opponent!)
            target.hitStun = 35;
            target.hp = Math.max(0, target.hp - 30);
            this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ffffff');
          }
        }

        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ffffff');
        return true;
      }
    }

    // Skill 3 - Arm Laser Cannon (Base) / Speed of Light Blitz (Pure Light Form) (Key O / SKILL 3)
    if (input.skill3 && f.cooldowns.skill3 <= 0) {
      if (hasNoArms && !isPureLight) {
        soundManager.playDipezWhaa();
        f.cooldowns.skill3 = 20;
        return true;
      }
      if (f.energy >= 30 || isTraining || isPureLight) {
        if (isPureLight) {
          // Evolved Form Skill: Speed of Light Blitz (Photon Multi-Point Teleport Hit & Burn)
          f.action = 'dipez_light_speed_blitz';
          f.actionTimer = 75; // ~1.25s duration
          f.actionDuration = 75;
          f.cooldowns.skill3 = 90; // 1.5s CD
          soundManager.playDipezStarMaker();
          return true;
        }

        f.action = 'dipez_laser_cannon';
        f.actionTimer = 90; // 1.5 seconds laser duration
        f.actionDuration = 90;
        f.cooldowns.skill3 = 180;
        if (!isTraining) f.energy -= 40;

        const dir = f.facing === 'right' ? 1 : -1;
        const beamLength = 1200;
        soundManager.playDipezStarMaker();

        this.projectiles.push({
          id: this.projectileId++,
          ownerId: f.id,
          type: 'dipez_laser_beam',
          x: dir === 1 ? f.x + f.width - 15 : f.x - beamLength + 15,
          y: f.y + 12,
          vx: dir,
          vy: 0,
          baseVx: dir,
          baseVy: 0,
          width: beamLength,
          height: 52,
          damage: 6,
          knockbackX: dir * 18,
          knockbackY: -5,
          hitStun: 20,
          isFrozenInTime: false,
          life: 90,
          maxLife: 90,
          color: '#38bdf8',
        });

        return true;
      }
    }

    // Skill 4 - Evolution Gamble (Base Form) / Star Maker (Pure Light Form) (Key P / SKILL 4)
    if ((input.skill4 || input.ultimate) && f.cooldowns.skill4 <= 0) {
      if (!isPureLight) {
        f.cooldowns.skill4 = 180; // 3 seconds cooldown on fail
        const rollSuccess = Math.random() < 0.5; // 50% chance

        if (rollSuccess) {
          f.action = 'dipez_evolution_startup';
          f.actionTimer = 160; // 4 distinct anime transformation phases
          f.actionDuration = 160;
          f.auraColor = undefined; // No full-body aura immediately! Head/eyes ignite first
          f.dipezForm = 'base'; // Starts in base form
          f.invulnerableTimer = 165;

          soundManager.playDipezEyeIgnition();
          this.screenShake = 6;
          // Spawn initial eye ignition sparks
          const eyeX = f.x + f.width / 2 + (f.facing === 'right' ? 8 : -8);
          this.addSpark(eyeX, f.y + 12, '#ffffff');
          this.addSpark(eyeX, f.y + 12, '#38bdf8');
        } else {
          if (!isTraining) f.energy = Math.max(0, f.energy - 20);
          soundManager.playDipezWhaa();
          // Subtle fizzle sparks on fail
          for (let i = 0; i < 8; i++) {
            this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 30, f.y + 20 + (Math.random() - 0.5) * 30, '#94a3b8');
          }
        }
        return true;
      } else {
        // Evolved Form Skill 4: Star Maker (Celestial Singularity & Supernova)
        if (f.energy >= 50 || isTraining) {
          f.action = 'dipez_star_maker';
          f.actionTimer = 180; // 3 seconds
          f.actionDuration = 180;
          f.cooldowns.skill4 = 300;
          if (!isTraining) f.energy -= 50;

          const arenaW = this.getArenaWidth();
          f.x = arenaW / 2 - f.width / 2;
          f.y = 150; // Ascend to celestial height
          f.vx = 0;
          f.vy = 0;
          f.invulnerableTimer = 185;

          f.dipezStarMakerActive = true;
          f.dipezStarMakerTimer = 180;
          f.dipezStarMakerFlash = 180; // 3 seconds celestial singularity effect

          soundManager.playDipezStarMaker();
          this.screenShake = 22;
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ffffff');
          this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
          return true;
        }
      }
    }

    return false;
  }

  // --- VALENTINE UNIVERSAL MENGER SPONGE PARADOX ANNIHILATION SYSTEM ---
  // Independent of Valentine's hit/stun/action state.
  // When identical entities from different worlds occupy the same world, they are irresistibly drawn together and annihilate!
  private updateParadoxAnnihilationSystem() {
    const valFighters: Fighter[] = [this.player, this.ai, ...(this.teammate ? [this.teammate] : [])].filter(
      f => f && f.charId === 'funny_valentine'
    );

    for (const val of valFighters) {
      if (!val.parallelEnemyClone) continue;

      const clone = val.parallelEnemyClone;

      // 1. Check if clone was defeated
      if (clone.hp <= 0) {
        soundManager.playFlagSandwich();
        this.addSpark(clone.x + clone.width / 2, clone.y + clone.height / 2, '#38bdf8');
        this.addTextParticle(clone.x + clone.width / 2, clone.y - 35, '🌀 PARALLEL ENEMY CLONE DESTROYED!', '#38bdf8');
        val.parallelEnemyClone = null;
        val.isParadoxColliding = false;
        val.paradoxCollisionTimer = 0;
        continue;
      }

      // 2. Clone is in Parallel World
      if (clone.isParallelWorld) {
        if (val.isParallelWorld) {
          // Clone actively duels Valentine in Parallel World
          const cloneInput = this.getAIControllerForFighter(clone.id).update(
            clone,
            [val],
            this.matchConfig,
            this.activeGravityAxis,
            this.getArenaWidth()
          );
          this.updateFighter(clone, cloneInput, val);
        } else {
          // Valentine returned to main dimension without paradox pull -> clone vanishes
          val.parallelEnemyClone = null;
          val.isParadoxColliding = false;
        }
        continue;
      }

      // 3. Clone is in the REAL WORLD (same dimension as original counterpart!):
      // AUTONOMOUS SPATIOTEMPORAL MENGER SPONGE PARADOX ANNIHILATION
      // Find the original real-world enemy counterpart (must be on enemy team, not Valentine, not a clone)
      const enemyCandidates = this.getAllActiveFighters().filter(
        t => t && t.hp > 0 && t.id !== clone.id && t.id !== val.id && t.team !== val.team && !t.isParallelWorld
      );
      let target = enemyCandidates.find(t => t.charId === clone.charId && !t.isClone) ||
                   enemyCandidates.find(t => !t.isClone) ||
                   enemyCandidates[0] ||
                   (val.id === this.player.id ? this.ai : this.player);

      if (!target || target.hp <= 0 || target.id === val.id) {
        val.parallelEnemyClone = null;
        val.isParadoxColliding = false;
        continue;
      }

      if (!val.paradoxCollisionTimer || val.paradoxCollisionTimer <= 0) {
        val.paradoxCollisionTimer = 35;
      }
      val.isParadoxColliding = true;
      val.paradoxCollisionTimer--;

      const targetCenterX = target.x + target.width / 2;
      const cloneCenterX = clone.x + clone.width / 2;
      const midX = (targetCenterX + cloneCenterX) / 2;
      const dist = Math.abs(targetCenterX - cloneCenterX);

      // Strong magnetic spatiotemporal attraction pulling both entities toward each other
      const pullSpeed = Math.min(20, Math.max(5, dist * 0.25));
      target.x += (midX - targetCenterX > 0 ? 1 : -1) * Math.min(Math.abs(midX - targetCenterX), pullSpeed);
      clone.x += (midX - cloneCenterX > 0 ? 1 : -1) * Math.min(Math.abs(midX - cloneCenterX), pullSpeed);

      target.y += ((clone.y - target.y) * 0.15);
      clone.y = target.y;

      target.hitStun = Math.max(target.hitStun, 15);
      clone.hitStun = Math.max(clone.hitStun, 15);

      // Dimensional fracture sparks & lightning between the two counterparts
      if (this.frameCount % 2 === 0) {
        this.addSpark(midX + (Math.random() * 20 - 10), target.y + 25 + (Math.random() * 20 - 10), '#38bdf8');
        this.addSpark(midX + (Math.random() * 20 - 10), target.y + 25 + (Math.random() * 20 - 10), '#f472b6');
        this.addSpark(targetCenterX, target.y + 20, '#eab308');
        this.addSpark(cloneCenterX, clone.y + 20, '#eab308');
      }

      if (this.frameCount % 6 === 0) {
        this.addMenacingParticle(midX, target.y, 'ゴ', '#f472b6');
      }

      // Trigger Annihilation when entities collide or timer finishes
      if (dist < 32 || val.paradoxCollisionTimer <= 0) {
        soundManager.playParadoxCollision();
        soundManager.playHeavyImpact();
        this.screenShake = 30;

        // Apply massive true damage to the original counterpart
        target.hp = Math.max(0, target.hp - VALENTINE_PARADOX_TRUE_DAMAGE);
        target.hitStun = 90;
        target.action = 'knockback';
        target.hitReactionType = 'directional_launch';
        target.hitReactionTimer = 60;
        target.hitReactionDuration = 60;
        target.vx = (target.x > val.x ? 1 : -1) * 16;
        target.vy = -10;
        target.isGrounded = false;

        // Visual Shockwaves
        this.addShockwave(midX, target.y + 30, '#38bdf8');
        this.addShockwave(midX, target.y + 30, '#f472b6');
        this.addShockwave(midX, target.y + 30, '#ffffff');

        // Menger Sponge fractal cubes disintegration burst
        for (let p = 0; p < 48; p++) {
          if (this.particles.length >= this.MAX_PARTICLES) this.particles.shift();
          this.particles.push({
            id: Math.random(),
            x: midX + (Math.random() * 90 - 45),
            y: target.y + (Math.random() * 90 - 45),
            vx: (Math.random() - 0.5) * 22,
            vy: (Math.random() - 0.5) * 22,
            life: 50,
            maxLife: 50,
            size: Math.random() * 14 + 6,
            color: Math.random() < 0.5 ? '#38bdf8' : '#f472b6',
            type: 'paradox_cube',
          });
        }

        this.addTextParticle(
          midX,
          target.y - 45,
          `💥 MENGER SPONGE PARADOX ANNIHILATION! (-${VALENTINE_PARADOX_TRUE_DAMAGE} HP)`,
          '#ef4444'
        );

        // Disintegrate parallel enemy clone completely
        val.parallelEnemyClone = null;
        val.isParadoxColliding = false;
        val.paradoxCollisionTimer = 0;
      }
    }
  }

  // --- ARABIAN FAT & THE SUN SKILLS LOGIC ---
  private handleArabianFatSkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';

    // Skill 1: Focused Heat Ray Snipe (U)
    if (input.skill1 && f.cooldowns.skill1 <= 0) {
      if (f.energy >= 15 || isTraining) {
        f.action = 'sun_laser_strike';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = 45;
        if (!isTraining) f.energy -= 15;

        soundManager.playSunLaser();
        const startX = f.sunX || this.getArenaWidth() / 2;
        const startY = (f.sunY || 75) + 25;
        const targetCenterX = opponent.x + opponent.width / 2;
        const targetCenterY = opponent.y + opponent.height / 2;
        const dx = targetCenterX - startX;
        const dy = targetCenterY - startY;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const laserSpeed = SUN_LASER_SPEED * 1.35;
        const vx = (dx / dist) * laserSpeed;
        const vy = (dy / dist) * laserSpeed;

        this.projectiles.push({
          id: this.projectileId++,
          ownerId: f.id,
          type: 'sun_heat_laser',
          x: startX,
          y: startY,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          width: 22,
          height: 22,
          damage: 42,
          knockbackX: (opponent.x > startX ? 1 : -1) * 12,
          knockbackY: -5,
          hitStun: 35,
          isFrozenInTime: false,
          life: 60,
          maxLife: 60,
          color: '#ef4444',
        });

        this.screenShake = 6;
        this.addTextParticle(startX, startY + 20, '🔥 FOCUSED HEAT RAY SNIPE!', '#f97316');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '⚡ NEED 15 ENERGY (POSE: B)!', '#f59e0b');
        }
      }
    }

    // Skill 2: Desert Mirage Illusion (I)
    if (input.skill2 && f.cooldowns.skill2 <= 0) {
      if (f.energy >= SUN_MIRAGE_TRAP_COST || isTraining) {
        f.action = 'sun_mirage_trap';
        f.actionTimer = 25;
        f.actionDuration = 25;
        f.cooldowns.skill2 = SUN_MIRAGE_TRAP_COOLDOWN;
        if (!isTraining) f.energy -= SUN_MIRAGE_TRAP_COST;

        soundManager.playSunHeatwave();
        opponent.blindedTimer = SUN_MIRAGE_DURATION;
        opponent.hitStun = 20;

        this.addShockwave(opponent.x + opponent.width / 2, opponent.y + opponent.height / 2, '#f97316');
        this.addTextParticle(opponent.x + opponent.width / 2, opponent.y - 45, '🏜️ DESERT HEAT MIRAGE: SENSES INVERTED (3s)!', '#f97316');
        for (let s = 0; s < 12; s++) {
          this.addSpark(opponent.x + Math.random() * opponent.width, opponent.y + Math.random() * opponent.height, '#fb923c');
        }
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '⚡ NEED 25 ENERGY (POSE: B)!', '#f59e0b');
        }
      }
    }

    // Skill 3: Prominence Solar Bombardment (O)
    if (input.skill3 && f.cooldowns.skill3 <= 0) {
      if (f.energy >= SUN_BOMBARDMENT_COST || isTraining) {
        f.action = 'sun_bombardment';
        f.actionTimer = 35;
        f.actionDuration = 35;
        f.cooldowns.skill3 = SUN_BOMBARDMENT_COOLDOWN;
        if (!isTraining) f.energy -= SUN_BOMBARDMENT_COST;

        soundManager.playSunLaser();
        const sunCenterX = f.sunX || this.getArenaWidth() / 2;
        const sunCenterY = (f.sunY || 75) + 30;

        const angles = [-0.65, -0.32, 0, 0.32, 0.65];
        for (const angle of angles) {
          const speed = 16;
          const vx = Math.sin(angle) * speed;
          const vy = Math.cos(angle) * speed;

          this.projectiles.push({
            id: this.projectileId++,
            ownerId: f.id,
            type: 'sun_flare_bomb',
            x: sunCenterX + (Math.random() * 30 - 15),
            y: sunCenterY,
            vx,
            vy,
            baseVx: vx,
            baseVy: vy,
            width: 24,
            height: 24,
            damage: SUN_BOMBARDMENT_DAMAGE,
            knockbackX: vx > 0 ? 8 : -8,
            knockbackY: -6,
            hitStun: 28,
            isFrozenInTime: false,
            life: 80,
            maxLife: 80,
            color: '#ef4444',
          });
        }

        this.screenShake = 9;
        this.addTextParticle(sunCenterX, sunCenterY + 20, '☄️ SOLAR PROMINENCE BOMBARDMENT (5 BOMBS)!', '#ef4444');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '⚡ NEED 40 ENERGY (POSE: B)!', '#f59e0b');
        }
      }
    }

    // Skill 4 / Ultimate: Supernova Heatwave (Y / P)
    if (input.ultimate && f.cooldowns.ultimate <= 0) {
      if (f.energy >= SUN_SUPERNOVA_COST || isTraining || f.isHidingBehindMirror) {
        f.action = 'sun_supernova';
        f.actionTimer = 45;
        f.actionDuration = 45;
        f.cooldowns.ultimate = SUN_SUPERNOVA_COOLDOWN;
        if (!isTraining) f.energy = Math.max(0, f.energy - SUN_SUPERNOVA_COST);

        // Immediate +35°C Environmental heat jump!
        f.sunTemperature = Math.min(SUN_MAX_TEMPERATURE, (f.sunTemperature || 0) + 35);

        soundManager.playSunHeatwave();
        soundManager.playArabiaFatChuckle();
        this.screenShake = 22;

        const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
        for (const t of targets) {
          if (t.charId === 'dipez' && t.dipezForm === 'pure_light') continue;
          this.applyRawDamage(t, SUN_SUPERNOVA_DAMAGE, (t.x > f.x ? 1 : -1) * 16, -10, f);
          t.burnedTimer = 300; // 5 seconds burn
          t.hitStun = 50;
          this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#f97316');
        }

        this.addTextParticle(f.x + f.width / 2, f.y - 50, '☀️💥 SUPERNOVA HEATWAVE (+35°C GLOBAL BURST)!', '#ea580c');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, '⚡ NEED 75 ENERGY (POSE: B)!', '#f59e0b');
        }
      }
    }

    return false;
  }

  // --- MICHAEL JUNISTER (GHOST: HAT PRICE) SKILLS LOGIC ---
  private handleMichaelSkills(f: Fighter, input: InputState, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';
    const isOverdrive = (f.michaelOverdriveTimer || 0) > 0;
    const isMounted = !!f.isGeorgeMounted;
    const forwardDir = f.facing === 'right' ? 1 : -1;

    // Skill 1: Golden Palm Thrust (U) / Mounted George Charge Thrust
    if (input.skill1 && f.cooldowns.skill1 <= 0) {
      if (f.energy >= MICHAEL_PALM_THRUST_COST || isTraining) {
        f.action = 'michael_palm_thrust';
        f.actionTimer = 22;
        f.actionDuration = 22;
        f.cooldowns.skill1 = MICHAEL_PALM_THRUST_COOLDOWN;
        if (!isTraining) f.energy -= MICHAEL_PALM_THRUST_COST;
        f.vx = forwardDir * (MICHAEL_PALM_THRUST_DASH_SPEED * (isMounted ? 1.5 : (isOverdrive ? 1.3 : 1.0)));
        soundManager.playMichaelPalmThrust();
        if (isMounted) soundManager.playGeorgeGallop();
        const skillName = isMounted ? '🐎 GEORGE CHARGE: KINETIC PALM THRUST!' : '⚡ GOLDEN PALM THRUST!';
        this.addTextParticle(f.x + f.width / 2, f.y - 35, skillName, '#facc15');
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, `⚡ NEED ${MICHAEL_PALM_THRUST_COST} ENERGY (POSE: B)!`, '#facc15');
        }
      }
    }

    // Skill 2: Flash Step Counter (I) / George Rearing Counter Stance
    if (input.skill2 && f.cooldowns.skill2 <= 0) {
      if (f.energy >= MICHAEL_COUNTER_COST || isTraining) {
        f.action = 'michael_counter_stance';
        f.actionTimer = MICHAEL_COUNTER_DURATION;
        f.actionDuration = MICHAEL_COUNTER_DURATION;
        f.cooldowns.skill2 = MICHAEL_COUNTER_COOLDOWN;
        f.michaelCounterActive = true;
        f.michaelCounterTimer = MICHAEL_COUNTER_DURATION;
        f.isParrying = true;
        if (!isTraining) f.energy -= MICHAEL_COUNTER_COST;
        f.vx = 0;
        soundManager.playMichaelCounter();
        if (isMounted) soundManager.playGeorgeNeigh();
        const skillName = isMounted ? '🐎 GEORGE REARING COUNTER STANCE!' : '🥋 KINETIC COUNTER STANCE';
        this.addTextParticle(f.x + f.width / 2, f.y - 35, skillName, '#facc15');
        this.addShockwave(f.x + f.width / 2, f.y + f.height - 10, '#facc15');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, `⚡ NEED ${MICHAEL_COUNTER_COST} ENERGY (POSE: B)!`, '#facc15');
        }
      }
    }

    // Skill 3: Golden Axe Kick (O) / Equestrian High Jump & Trample Slam
    if (input.skill3 && f.cooldowns.skill3 <= 0) {
      if (f.energy >= MICHAEL_AXE_KICK_COST || isTraining) {
        f.action = 'michael_axe_kick';
        f.actionTimer = 34;
        f.actionDuration = 34;
        f.cooldowns.skill3 = MICHAEL_AXE_KICK_COOLDOWN;
        f.michaelAxeKickPhase = 'rise';
        if (!isTraining) f.energy -= MICHAEL_AXE_KICK_COST;
        f.vy = isMounted ? -15 : -12;
        f.vx = forwardDir * (isMounted ? 7.5 : 5.5);
        f.isGrounded = false;
        soundManager.playMichaelAxeKick();
        if (isMounted) soundManager.playGeorgeNeigh();
        const skillName = isMounted ? '🐎 EQUESTRIAN HIGH LEAP & TRAMPLE!' : '⚡ GOLDEN AXE KICK!';
        this.addTextParticle(f.x + f.width / 2, f.y - 35, skillName, '#facc15');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, `⚡ NEED ${MICHAEL_AXE_KICK_COST} ENERGY (POSE: B)!`, '#facc15');
        }
      }
    }

    // Skill 4: Hat Price Overdrive (P) / Golden Pegasus Overdrive
    if (input.skill4 && f.cooldowns.skill4 <= 0) {
      if (f.energy >= MICHAEL_OVERDRIVE_COST || isTraining) {
        f.action = 'michael_overdrive';
        f.actionTimer = 25;
        f.actionDuration = 25;
        f.cooldowns.skill4 = MICHAEL_OVERDRIVE_COOLDOWN;
        f.michaelOverdriveTimer = MICHAEL_OVERDRIVE_DURATION;
        f.isStandActive = true;
        if (!isTraining) f.energy -= MICHAEL_OVERDRIVE_COST;
        soundManager.playMichaelGoldAura();
        if (isMounted) soundManager.playGeorgeNeigh();
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
        const skillName = isMounted ? '🔥 HAT PRICE OVERDRIVE (MOUNTED)!' : '🔥 HAT PRICE OVERDRIVE! (GOLDEN LIMBS)';
        this.addTextParticle(f.x + f.width / 2, f.y - 45, skillName, '#facc15');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, `⚡ NEED ${MICHAEL_OVERDRIVE_COST} ENERGY (POSE: B)!`, '#facc15');
        }
      }
    }

    // Skill 5: Kinetic Barrage: Gold Gale (L) / George Hypersonic Trample Rush
    if (input.skill5 && f.cooldowns.skill5 <= 0) {
      if (f.energy >= MICHAEL_BARRAGE_COST || isTraining) {
        f.action = 'michael_kinetic_barrage';
        f.actionTimer = 54;
        f.actionDuration = 54;
        f.cooldowns.skill5 = MICHAEL_BARRAGE_COOLDOWN;
        if (!isTraining) f.energy -= MICHAEL_BARRAGE_COST;
        f.vx = forwardDir * (isMounted ? 6.5 : 3.5);
        soundManager.playBarrageHit();
        if (isMounted) soundManager.playGeorgeGallop();
        const skillName = isMounted ? '🐎 GEORGE HYPERSONIC TRAMPLE RUSH!' : '⚡ KINETIC RUSH: GOLD GALE!';
        this.addTextParticle(f.x + f.width / 2, f.y - 40, skillName, '#facc15');
        return true;
      } else {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 40, `⚡ NEED ${MICHAEL_BARRAGE_COST} ENERGY (POSE: B)!`, '#facc15');
        }
      }
    }

    // Ultimate: HAT PRICE: WALL CRASH METEOR TACKLE (Y)
    if (input.ultimate && f.cooldowns.ultimate <= 0) {
      const isKineticFull = (f.michaelKineticMeter || 0) >= 98 || Math.round(f.michaelKineticMeter || 0) >= 100;
      if (!isKineticFull) {
        if (this.frameCount % 20 === 0) {
          this.addTextParticle(f.x + f.width / 2, f.y - 45, `⚠️ KINETIC METER HARUS PENUH 100%! (${Math.round(f.michaelKineticMeter || 0)}%)`, '#ef4444');
        }
        return false;
      }

      // Powered 100% by full kinetic meter (no energy roadblock)!
      f.action = 'michael_ultimate';
      f.actionTimer = 125;
      f.actionDuration = 125;
      f.cooldowns.ultimate = MICHAEL_ULTIMATE_COOLDOWN;
      f.invulnerableTimer = 140;
      f.isStandActive = true;
      f.michaelUltPhase = 'retreat_wall';
      f.michaelUltTargetId = opponent.id;
      f.michaelUltWallImpactX = undefined;
      f.michaelUltWallImpactY = undefined;

      soundManager.playMichaelUltimate();
      this.screenShake = 12;
      this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
      this.addTextParticle(f.x + f.width / 2, f.y - 50, '👑 HAT PRICE: WALL CRASH METEOR TACKLE!!', '#facc15');
      return true;
    }

    return false;
  }

  private executeMichaelPalmThrust(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const isOverdrive = (f.michaelOverdriveTimer || 0) > 0;
    const reach = isOverdrive ? 110 : 80;
    const hitX = f.x + f.width / 2 + dir * (f.width / 2 + reach / 2);
    const hitY = f.y + f.height / 2;

    this.screenShake = Math.max(this.screenShake, 7);
    this.addShockwave(hitX, hitY, '#facc15');
    soundManager.playMichaelPalmThrust();

    const targets = this.getTargetsForAttacker(f, opponent);
    for (const t of targets) {
      if (t.hp > 0 && Math.abs((t.x + t.width / 2) - hitX) < (reach + t.width / 2) && Math.abs(t.y - f.y) < 70) {
        t.guardBreakTimer = 50; // Guard Break
        const damage = MICHAEL_PALM_THRUST_DAMAGE * (isOverdrive ? 1.25 : 1.0);
        this.applyRawDamage(t, damage, dir * 18, -5, f);
        t.hitStun = 35;
        this.addTextParticle(t.x + t.width / 2, t.y - 40, '⚡ GUARD BREAK IMPACT!', '#facc15');
        for (let i = 0; i < 6; i++) {
          this.addSpark(t.x + Math.random() * t.width, t.y + Math.random() * t.height, '#facc15');
        }
      }
    }
  }

  private executeMichaelCounterKickHit(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const hitX = f.x + f.width / 2 + dir * 60;
    const hitY = f.y + f.height / 2;

    this.screenShake = Math.max(this.screenShake, 8);
    this.addShockwave(hitX, hitY, '#facc15');
    soundManager.playMichaelCounter();

    const targets = this.getTargetsForAttacker(f, opponent);
    for (const t of targets) {
      if (t.hp > 0 && Math.abs((t.x + t.width / 2) - hitX) < 90 && Math.abs(t.y - f.y) < 80) {
        this.applyRawDamage(t, MICHAEL_COUNTER_DAMAGE, dir * 20, -8, f);
        t.hitStun = 45;
        this.addTextParticle(t.x + t.width / 2, t.y - 40, '💥 KINETIC ROUNDHOUSE!', '#facc15');
      }
    }
  }

  private executeMichaelAxeKickFrame(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const isOverdrive = (f.michaelOverdriveTimer || 0) > 0;

    // Rising phase -> Falling slam phase
    if (f.actionTimer <= 20) {
      f.michaelAxeKickPhase = 'fall';
      f.vy = 22; // High velocity downward slam
      f.vx = dir * 3;

      // When touching the ground: impact slam shockwave!
      if (f.isGrounded || f.y >= 490) {
        f.michaelAxeKickPhase = 'slam';
        f.vy = 0;
        f.vx = 0;
        this.screenShake = Math.max(this.screenShake, 11);
        soundManager.playMichaelAxeKick();

        const slamX = f.x + f.width / 2 + dir * 35;
        const slamY = f.y + f.height - 10;
        this.addShockwave(slamX, slamY, '#facc15');
        this.addShockwave(slamX, slamY, '#ffffff');

        const targets = this.getTargetsForAttacker(f, opponent);
        for (const t of targets) {
          if (t.hp > 0 && Math.abs((t.x + t.width / 2) - slamX) < (isOverdrive ? 150 : 110) && Math.abs(t.y - f.y) < 90) {
            const damage = MICHAEL_AXE_KICK_DAMAGE * (isOverdrive ? 1.25 : 1.0);
            this.applyRawDamage(t, damage, dir * 8, -13, f); // High vertical pop-up juggle
            t.hitStun = 42;
            t.isGrounded = false;
            this.addTextParticle(t.x + t.width / 2, t.y - 45, '⚡ SEISMIC AXE IMPACT!', '#facc15');
          }
        }
      }
    }
  }

  private executeMichaelBarrageHit(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const isOverdrive = (f.michaelOverdriveTimer || 0) > 0;
    const isMounted = !!f.isGeorgeMounted;
    const hitX = f.x + f.width / 2 + dir * (isMounted ? 85 : 65);
    const hitY = f.y + f.height / 3 + (Math.random() * 30 - 15);

    // Build kinetic momentum on every strike
    f.michaelKineticMeter = Math.min(100, (f.michaelKineticMeter || 0) + 2.5);

    soundManager.playBarrageHit();
    this.addSpark(hitX, hitY, '#facc15');

    // Stand cry: "WRAAA!!"
    if (f.actionTimer % 12 === 0) {
      this.addTextParticle(f.x + f.width / 2, f.y - 45, 'WRAAA!!', '#facc15');
    }

    const targets = this.getTargetsForAttacker(f, opponent);
    const reach = isMounted ? 120 : 85;
    for (const t of targets) {
      if (t.hp > 0 && Math.abs((t.x + t.width / 2) - hitX) < reach && Math.abs(t.y - f.y) < 75) {
        const damage = MICHAEL_BARRAGE_DAMAGE * (isOverdrive ? 1.25 : 1.0);
        this.applyRawDamage(t, damage, dir * 2.5, -1.5, f);
        t.hitStun = 18;
      }
    }
  }

  private executeMichaelBarrageFinisher(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const isOverdrive = (f.michaelOverdriveTimer || 0) > 0;
    const isMounted = !!f.isGeorgeMounted;
    const hitX = f.x + f.width / 2 + dir * (isMounted ? 95 : 75);
    const hitY = f.y + f.height / 2;

    this.screenShake = Math.max(this.screenShake, 8);
    soundManager.playMichaelPalmThrust();
    this.addShockwave(hitX, hitY, '#facc15');

    f.michaelKineticMeter = Math.min(100, (f.michaelKineticMeter || 0) + 15);

    const targets = this.getTargetsForAttacker(f, opponent);
    const reach = isMounted ? 130 : 95;
    for (const t of targets) {
      if (t.hp > 0 && Math.abs((t.x + t.width / 2) - hitX) < reach && Math.abs(t.y - f.y) < 80) {
        const damage = 85 * (isOverdrive ? 1.25 : 1.0);
        this.applyRawDamage(t, damage, dir * 22, -6, f);
        t.hitStun = 40;
        this.addTextParticle(t.x + t.width / 2, t.y - 40, 'WRAAAA!! ⚡ DUAL PALM FINISHER!', '#facc15');
      }
    }
  }

  private executeMichaelUltimateFrame(f: Fighter, opponent: Fighter) {
    const arenaW = this.getArenaWidth();
    const targets = this.getTargetsForAttacker(f, opponent);
    const target = targets[0] || opponent;
    const launchDir = f.facing === 'right' ? 1 : -1;
    const backWallX = launchDir === 1 ? 55 : arenaW - 55 - f.width;
    const oppWallX = launchDir === 1 ? arenaW - 55 : 55;

    // Ensure opponent is kept in active fight space and cannot attack during cinematic ultimate
    target.hitStun = Math.max(target.hitStun, 15);

    // --- PHASE 1: RETREAT TO BACK WALL (Frames 125 down to 95) ---
    if (f.actionTimer > 95) {
      f.michaelUltPhase = 'retreat_wall';
      const retreatDir = -launchDir;
      f.vx = retreatDir * 32;
      f.vy = 0;
      if (f.isGeorgeMounted && f.georgeX !== undefined) {
        f.georgeX = f.x;
      }

      if (this.frameCount % 2 === 0) {
        this.addSpark(f.x + (launchDir === 1 ? f.width : 0), f.y + f.height - 4, '#facc15');
      }

      // Check reaching back wall
      const reachedWall = (launchDir === 1 && f.x <= 70) || (launchDir === -1 && f.x >= arenaW - 70 - f.width);
      if (reachedWall || f.actionTimer <= 96) {
        f.x = backWallX;
        f.vx = 0;
        f.michaelUltPhase = 'charge';
        f.actionTimer = 95;
        this.screenShake = 10;
        soundManager.playMichaelPalmThrust();
        this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
        this.addTextParticle(f.x + f.width / 2, f.y - 50, '⚡ BACK WALL REACHED: COILING KINETIC COMPRESSION! ⚡', '#facc15');
      }
    }
    // --- PHASE 2: ANCANG-ANCANG / KINETIC CHARGE COMPRESSION (Frames 95 down to 65) ---
    else if (f.actionTimer > 65) {
      f.michaelUltPhase = 'charge';
      f.vx = 0;
      f.vy = 0;
      f.x = backWallX;
      if (f.isGeorgeMounted) {
        f.georgeX = f.x;
        f.georgeState = 'rearing';
      }

      // Massive golden compression aura pulsing from the wall
      if (this.frameCount % 3 === 0) {
        const wallTouchX = launchDir === 1 ? 30 : arenaW - 30;
        this.addShockwave(wallTouchX, f.y + f.height / 2, '#facc15');
        this.addSpark(wallTouchX, f.y + f.height / 2 + (Math.random() - 0.5) * 50, '#ffffff');
        this.screenShake = Math.max(this.screenShake, 5);
      }

      if (f.actionTimer === 66) {
        // Vault / Leaping launch transition!
        f.michaelUltPhase = 'vault_rush';
        soundManager.playMichaelUltimate();
        soundManager.playRapierThrust();
        this.screenShake = 16;
        if (f.isGeorgeMounted) {
          // Vaulting off George! George stays proudly at the back wall!
          f.isGeorgeMounted = false;
          f.georgePendingRemount = true;
          f.georgeFallOffTimer = 160;
          f.georgeState = 'rearing';
          f.georgeX = backWallX;
          soundManager.playGeorgeNeigh();
          this.addTextParticle(f.x + f.width / 2, f.y - 55, '🐎 EQUESTRIAN SADDLE VAULT TACKLE! 🐎', '#facc15');
        } else {
          this.addTextParticle(f.x + f.width / 2, f.y - 55, '⚡ WALL SPRING SUPERSONIC TACKLE! ⚡', '#facc15');
        }
      }
    }
    // --- PHASE 3: SUPERSONIC LEAPING DIVE & TACKLE RUSH (Frames 65 down to 32) ---
    else if (f.actionTimer > 32 && f.michaelUltPhase !== 'tackle_impact' && f.michaelUltPhase !== 'wall_slam') {
      f.michaelUltPhase = 'vault_rush';
      f.isGrounded = false;

      // Dynamic leap arc: initial upward rocket leap then horizontal supersonic spear dive!
      if (f.actionTimer > 56) {
        f.vy = -6.0;
        f.vx = launchDir * 30;
      } else {
        f.vy = 1.0;
        f.vx = launchDir * 34;
      }

      // Supersonic comet jet stream trail & Mach cone particles
      this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
      this.addSpark(f.x + f.width / 2 - launchDir * 35, f.y + f.height / 2, '#fde047');
      this.screenShake = Math.max(this.screenShake, 8);

      // Check collision with opponent (with at least 8 frames of visible dive arc before impact)
      const dist = Math.abs((f.x + f.width / 2) - (target.x + target.width / 2));
      const passedOpponent = (launchDir === 1 && f.x >= target.x - 20) || (launchDir === -1 && f.x <= target.x + 20);
      if ((dist < 80 || passedOpponent) && f.actionTimer < 58) {
        // TACKLE IMPACT!
        f.michaelUltPhase = 'tackle_impact';
        f.actionTimer = 30; // Direct transition into impact hitstop and wall slam
        f.vx = launchDir * 6;
        f.vy = 0;

        soundManager.playMichaelAxeKick();
        soundManager.playClashFinisher();
        soundManager.playHit(true);
        this.screenShake = 24;
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ffffff');
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
        this.addTextParticle(target.x + target.width / 2, target.y - 50, '💥 SUPERSONIC METEOR TACKLE IMPACT! 💥', '#facc15');

        // Catapulting opponent violently through the air across the arena into the far wall!
        target.vx = launchDir * 45;
        target.vy = -3.2;
        target.isGrounded = false;
        target.action = 'knockback';
        target.hitStun = 65;
      }
    }
    // --- PHASE 4 & 5: OPPONENT CRASHES INTO FAR WALL & GIGANTIC KINETIC EXPLOSION (Frames 30 down to 0) ---
    else {
      f.michaelUltPhase = 'wall_slam';
      f.vx *= 0.85;

      const hitFarWall = (launchDir === 1 && target.x >= arenaW - 85 - target.width) || (launchDir === -1 && target.x <= 85);

      if (hitFarWall && !f.michaelUltWallImpactX) {
        f.michaelUltWallImpactX = oppWallX;
        f.michaelUltWallImpactY = target.y + target.height / 2;

        // CATASTROPHIC GIGANTIC KINETIC WALL EXPLOSION!
        this.screenShake = 28;
        soundManager.playClashFinisher();
        soundManager.playMichaelUltimate();
        soundManager.playCarCrash();

        // Expanding concentric kinetic blast shockwaves:
        for (let i = 0; i < 5; i++) {
          this.addShockwave(oppWallX, f.michaelUltWallImpactY, i % 2 === 0 ? '#facc15' : '#ffffff');
        }
        // Explosive golden lightning arcs & sparks:
        for (let i = 0; i < 28; i++) {
          this.addSpark(oppWallX + (Math.random() - 0.5) * 80, f.michaelUltWallImpactY + (Math.random() - 0.5) * 100, '#facc15');
        }
        this.addMenacingParticle(oppWallX, f.michaelUltWallImpactY - 30, 'ズガガガッ!!', '#facc15');
        this.addTextParticle(oppWallX, f.michaelUltWallImpactY - 60, '💥 GIGANTIC KINETIC WALL EXPLOSION!! 💥', '#facc15');

        // Deal full ultimate damage (400 damage):
        this.applyRawDamage(target, MICHAEL_ULTIMATE_DAMAGE, -launchDir * 8, -6, f);
        target.action = 'knockback';
        target.hitReactionType = 'directional_launch';
        target.hitReactionTimer = 70;
        target.hitReactionDuration = 70;
        target.hitStun = 70;
        target.isGrounded = false;

        // Fully consume kinetic meter upon catastrophic wall explosion:
        f.michaelKineticMeter = 0;
        f.michaelKineticStacks = 0;
      }

      if (hitFarWall) {
        target.vx = -launchDir * 4;
        target.vy = 3;
      }

      if (f.actionTimer <= 3) {
        f.michaelUltWallImpactX = undefined;
        f.michaelUltWallImpactY = undefined;
        f.michaelUltPhase = undefined;
      }
    }
  }

  private executeValentineBasicRevolverShot(attacker: Fighter, target: Fighter) {
    const isStand = !!attacker.isStandActive;
    const damage = isStand ? VALENTINE_PISTOL_DAMAGE + 20 : VALENTINE_PISTOL_DAMAGE;
    const knockFwd = isStand ? 9 : 7;
    const knockUp = -2.5;
    const speed = 34;

    soundManager.playPucciGunshot();
    this.screenShake = Math.max(this.screenShake, isStand ? 4.5 : 3.5);

    const dir = attacker.facing === 'right' ? 1 : -1;
    // Exactly at the tip of the extended Presidential Revolver barrel (Arm reach 50px + Barrel 18px = 68px from body center)
    const muzzleOffset = 68;
    const muzzleX = attacker.x + attacker.width / 2 + dir * muzzleOffset;
    const muzzleY = attacker.y + 30;

    // Bullet Muzzle Spark & Gunpowder Smoke bursting forward from the gun's muzzle
    for (let s = 0; s < 6; s++) {
      this.addSpark(muzzleX + dir * (Math.random() * 8 + 2), muzzleY + (Math.random() * 6 - 3), '#facc15');
      this.addSpark(muzzleX + dir * (Math.random() * 12 + 4), muzzleY + (Math.random() * 6 - 3), '#ffffff');
    }

    const bulletWidth = 18;
    const bulletHeight = 8;
    // Position projectile so it starts cleanly from the gun's muzzle tip
    const spawnX = dir === 1 ? muzzleX : muzzleX - bulletWidth;
    const spawnY = muzzleY - bulletHeight / 2;

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'pucci_bullet',
      subType: 'bullet',
      x: spawnX,
      y: spawnY,
      vx: dir * speed,
      vy: 0,
      baseVx: dir * speed,
      baseVy: 0,
      width: bulletWidth,
      height: bulletHeight,
      damage: damage,
      knockbackX: dir * knockFwd,
      knockbackY: knockUp,
      hitStun: 28,
      isFrozenInTime: false,
      life: 40,
      maxLife: 40,
      color: '#facc15',
      isParallelWorld: !!attacker.isParallelWorld
    });

    this.addTextParticle(muzzleX, attacker.y - 35, '🔫 BANG! REVOLVER SHOT!', '#fde047');
  }

  private executeValentineD4CPunch(attacker: Fighter, target: Fighter, hitNum: number) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = hitNum === 1 ? 105 : 120;
    const damage = hitNum === 1 ? 38 : 52;
    const knockFwd = hitNum === 1 ? 4.5 : 8.5;
    const knockUp = hitNum === 1 ? 2.5 : 5.0;
    const hitStun = hitNum === 1 ? 20 : 28;

    const hitbox = this.createOrientedHitbox(attacker, reach, 65, damage, knockFwd, knockUp);
    hitbox.hitStun = hitStun;

    // Spawn oriented punch arm with D4C cyan theme
    this.spawnOrientedBarrageArm(attacker, reach, '#38bdf8', '#0284c7', false);

    soundManager.playHit(true);
    this.screenShake = Math.max(this.screenShake, hitNum === 1 ? 3.5 : 5.5);

    const punchX = attacker.x + (dir === 1 ? attacker.width + 30 : -40);
    const punchY = attacker.y + 15;
    this.addMenacingParticle(punchX, punchY, hitNum === 1 ? 'ド' : 'ドジャアアン', '#38bdf8');

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        
        // Impact Sparks & Shockwave
        const sparkCount = hitNum === 1 ? 7 : 12;
        for (let i = 0; i < sparkCount; i++) {
          this.addSpark(t.x + t.width / 2 + (Math.random() * 20 - 10), t.y + 20 + (Math.random() * 20 - 10), i % 2 === 0 ? '#38bdf8' : '#ffffff');
        }
        this.addShockwave(t.x + t.width / 2, t.y + 25, hitNum === 1 ? '#38bdf8' : '#0284c7');

        if (hitNum === 2) {
          this.addTextParticle(t.x + t.width / 2, t.y - 35, '💥 D4C COMBO FINISH!', '#38bdf8');
        }
      }
    }
  }

  private executeGappyBubblePlunder(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_plunder_bubble',
      x: attacker.x + (dir === 1 ? attacker.width : -32),
      y: attacker.y + 10,
      vx: dir * 9,
      vy: 2.5,
      baseVx: dir * 9,
      baseVy: 2.5,
      width: 32,
      height: 32,
      damage: 15,
      knockbackX: dir * 4,
      knockbackY: -2,
      isFrozenInTime: false,
      life: 45,
      maxLife: 45,
      color: '#38bdf8',
    });
    soundManager.playBubblePop();
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 40, '🧼 BUBBLE PLUNDER LAUNCHED!', '#38bdf8');
  }

  private executeGappyShaveMoisture(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_shave_bubble',
      x: attacker.x + (dir === 1 ? attacker.width : -38),
      y: attacker.y + 8,
      vx: dir * 14,
      vy: 0,
      baseVx: dir * 14,
      baseVy: 0,
      width: 38,
      height: 38,
      damage: GAPPY_SHAVE_MOISTURE_DAMAGE,
      knockbackX: dir * 6,
      knockbackY: -3,
      isFrozenInTime: false,
      life: 55,
      maxLife: 55,
      color: '#0284c7',
    });
    soundManager.playBubblePlunder();
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 40, '✂️ SHAVE BUBBLE SHOT!', '#0284c7');
  }

  private executeGappyBubbleBarrageHit(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 110;
    this.spawnOrientedBarrageArm(attacker, reach, '#38bdf8', '#7dd3fc', false);
    
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_barrage_bubble',
      x: attacker.x + (dir === 1 ? attacker.width + 5 : -28),
      y: attacker.y + 5 + Math.random() * 30,
      vx: dir * (14 + Math.random() * 4),
      vy: (Math.random() - 0.5) * 3,
      baseVx: dir * 14,
      baseVy: 0,
      width: 24,
      height: 24,
      damage: GAPPY_BUBBLE_BARRAGE_DAMAGE_PER_HIT,
      knockbackX: dir * 1.5,
      knockbackY: -0.5,
      isFrozenInTime: false,
      life: 28,
      maxLife: 28,
      color: '#38bdf8',
    });
    soundManager.playBubblePop();
  }

  private executeGappyBubbleBarrageFinisher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_barrage_bubble',
      x: attacker.x + (dir === 1 ? attacker.width + 10 : -44),
      y: attacker.y + 10,
      vx: dir * 18,
      vy: 0,
      baseVx: dir * 18,
      baseVy: 0,
      width: 46,
      height: 46,
      damage: GAPPY_BUBBLE_BARRAGE_BURST_DAMAGE,
      knockbackX: dir * 14,
      knockbackY: -6,
      isFrozenInTime: false,
      life: 35,
      maxLife: 35,
      color: '#7dd3fc',
    });
    this.addShockwave(attacker.x + attacker.width / 2 + dir * 60, attacker.y + 30, '#38bdf8');
    this.screenShake = Math.max(this.screenShake, 5);
    soundManager.playBubblePop();
  }

  private executeGappyBubbleTrap(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_trap_bubble',
      x: attacker.x + (dir === 1 ? attacker.width : -42),
      y: attacker.y + 5,
      vx: dir * 10,
      vy: 0,
      baseVx: dir * 10,
      baseVy: 0,
      width: 44,
      height: 44,
      damage: 20,
      knockbackX: dir * 2,
      knockbackY: -4,
      isFrozenInTime: false,
      life: 65,
      maxLife: 65,
      color: '#7dd3fc',
    });
    soundManager.playBubblePop();
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 40, '🫧 BUBBLE TRAP SHOT!', '#7dd3fc');
  }

  private executeGappyGoBeyond(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const launchX = attacker.x + attacker.width / 2 + dir * 40;
    const launchY = attacker.y + 20;

    attacker.gappyGoBeyondPhase = 'launch';
    attacker.gappyGoBeyondX = launchX;
    attacker.gappyGoBeyondY = launchY;

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'gappy_go_beyond',
      x: launchX,
      y: launchY,
      vx: dir * 26,
      vy: 0,
      baseVx: dir * 26,
      baseVy: 0,
      width: 48,
      height: 48,
      damage: GAPPY_GO_BEYOND_TRUE_DAMAGE,
      knockbackX: dir * 20,
      knockbackY: -10,
      isFrozenInTime: false,
      life: 75,
      maxLife: 75,
      color: '#ffffff',
    });

    soundManager.playGoBeyondLaunch();
    this.screenShake = 14;
    this.universeResetFlash = 16;
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 55, '🌌 ★ GO BEYOND: SPINNING BUBBLE LAUNCHED! ★', '#38bdf8');
  }

  // --- PUCCI EXECUTION METHODS ---
  private executePucciBasicPistolShot(attacker: Fighter, target: Fighter) {
    const isStand = !!attacker.isStandActive;
    const damage = isStand ? PUNCH_STAND_DAMAGE : PUNCH_DAMAGE;
    const knockFwd = isStand ? 8 : 6;
    const knockUp = isStand ? -2.5 : -2;
    const speed = 32;

    soundManager.playPucciGunshot();
    this.screenShake = Math.max(this.screenShake, isStand ? 4 : 3);

    const axis = this.activeGravityAxis || 'down';
    let spawnX = attacker.x;
    let spawnY = attacker.y + 25;
    let vx = (attacker.facing === 'right' ? 1 : -1) * speed;
    let vy = 0;
    let pWidth = 18;
    let pHeight = 8;
    let kbX = (attacker.facing === 'right' ? 1 : -1) * knockFwd;
    let kbY = knockUp;

    if (axis === 'down' || axis === 'up') {
      const dir = attacker.facing === 'right' ? 1 : -1;
      const forwardOffset = isStand ? 35 : 18;
      spawnX = attacker.x + attacker.width / 2 + dir * forwardOffset;
      spawnY = attacker.y + 28;
      vx = dir * speed;
      vy = 0;
      pWidth = 18;
      pHeight = 8;
      kbX = dir * knockFwd;
      kbY = axis === 'up' ? -knockUp : knockUp;
    } else if (axis === 'right') {
      const isUp = attacker.facing === 'right';
      const forwardOffset = isStand ? 35 : 18;
      spawnX = attacker.x - 15;
      spawnY = attacker.y + (isUp ? -forwardOffset : attacker.height + forwardOffset);
      vx = -5;
      vy = (isUp ? -1 : 1) * speed;
      pWidth = 8;
      pHeight = 18;
      kbX = -5;
      kbY = (isUp ? -1 : 1) * knockFwd;
    } else if (axis === 'left') {
      const isUp = attacker.facing === 'left';
      const forwardOffset = isStand ? 35 : 18;
      spawnX = attacker.x + attacker.width + 15;
      spawnY = attacker.y + (isUp ? -forwardOffset : attacker.height + forwardOffset);
      vx = 5;
      vy = (isUp ? -1 : 1) * speed;
      pWidth = 8;
      pHeight = 18;
      kbX = 5;
      kbY = (isUp ? -1 : 1) * knockFwd;
    }

    this.addSpark(spawnX, spawnY, isStand ? '#facc15' : '#ffffff');
    this.addSpark(spawnX, spawnY, '#fbbf24');

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'pucci_bullet',
      x: spawnX - pWidth / 2,
      y: spawnY - pHeight / 2,
      vx: vx,
      vy: vy,
      baseVx: vx,
      baseVy: vy,
      width: pWidth,
      height: pHeight,
      damage: damage,
      knockbackX: kbX,
      knockbackY: kbY,
      isFrozenInTime: false,
      life: 90,
      maxLife: 90,
      color: isStand ? '#facc15' : '#e2e8f0',
    });
  }

  private executePucciPistol(attacker: Fighter, target: Fighter) {
    const isStand = !!attacker.isStandActive;
    const speed = 32;

    soundManager.playPucciGunshot();
    this.screenShake = 5;

    const axis = this.activeGravityAxis || 'down';
    let spawnX = attacker.x;
    let spawnY = attacker.y + 25;
    let vx = (attacker.facing === 'right' ? 1 : -1) * speed;
    let vy = 0;
    let pWidth = 20;
    let pHeight = 8;
    let kbX = (attacker.facing === 'right' ? 1 : -1) * 8;
    let kbY = -2;

    if (axis === 'down' || axis === 'up') {
      const dir = attacker.facing === 'right' ? 1 : -1;
      const forwardOffset = isStand ? 35 : 20;
      spawnX = attacker.x + attacker.width / 2 + dir * forwardOffset;
      spawnY = attacker.y + 28;
      vx = dir * speed;
      vy = 0;
      pWidth = 20;
      pHeight = 8;
      kbX = dir * 8;
      kbY = axis === 'up' ? 2 : -2;
    } else if (axis === 'right') {
      const isUp = attacker.facing === 'right';
      const forwardOffset = isStand ? 35 : 20;
      spawnX = attacker.x - 15;
      spawnY = attacker.y + (isUp ? -forwardOffset : attacker.height + forwardOffset);
      vx = -5;
      vy = (isUp ? -1 : 1) * speed;
      pWidth = 8;
      pHeight = 20;
      kbX = -5;
      kbY = (isUp ? -1 : 1) * 8;
    } else if (axis === 'left') {
      const isUp = attacker.facing === 'left';
      const forwardOffset = isStand ? 35 : 20;
      spawnX = attacker.x + attacker.width + 15;
      spawnY = attacker.y + (isUp ? -forwardOffset : attacker.height + forwardOffset);
      vx = 5;
      vy = (isUp ? -1 : 1) * speed;
      pWidth = 8;
      pHeight = 20;
      kbX = 5;
      kbY = (isUp ? -1 : 1) * 8;
    }

    this.addSpark(spawnX, spawnY, '#fbbf24');
    this.addSpark(spawnX, spawnY, '#ffffff');

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'pucci_bullet',
      x: spawnX - pWidth / 2,
      y: spawnY - pHeight / 2,
      vx: vx,
      vy: vy,
      baseVx: vx,
      baseVy: vy,
      width: pWidth,
      height: pHeight,
      damage: PUCCI_PISTOL_DAMAGE,
      knockbackX: kbX,
      knockbackY: kbY,
      isFrozenInTime: false,
      life: 90,
      maxLife: 90,
      color: '#e2e8f0',
    });
  }

  private executePucciMemoryDisc(attacker: Fighter, target: Fighter) {
    const reach = 135;
    const hitbox = this.createOrientedHitbox(attacker, reach, 70, PUCCI_MEMORY_DISC_DAMAGE, 14, 5, {
      hitStun: 45,
    });
    this.screenShake = 8;
    soundManager.playPucciDisc();
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#c084fc');
    
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        // Force all opponent skill cooldowns to maximum
        t.cooldowns.skill1 = 180;
        t.cooldowns.skill2 = 180;
        t.cooldowns.skill3 = 180;
        t.cooldowns.skill4 = 180;
        t.cooldowns.skill5 = 180;
        t.silencedTimer = 90;
        this.addTextParticle(t.x + t.width / 2, t.y - 50, '💿 MEMORY DISC STOLEN! ALL SKILLS COOLDOWN!', '#c084fc');
      }
    }
  }

  private executePucciAcidMelt(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const poolX = attacker.x + (dir === 1 ? 50 : -220);
    const poolWidth = 240;
    if (!this.acidPools) this.acidPools = [];
    this.acidPools.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      x: poolX,
      y: GROUND_Y - 18,
      width: poolWidth,
      height: 24,
      damagePerTick: PUCCI_ACID_DAMAGE_PER_TICK,
      duration: PUCCI_ACID_DURATION * 1.5,
      color: '#c084fc',
    });

    // Splashing digestive acid projectile wave
    for (let i = 0; i < 4; i++) {
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: attacker.id,
        type: 'pucci_acid_pool',
        x: attacker.x + (dir === 1 ? attacker.width : -20),
        y: attacker.y + 15 + i * 8,
        vx: dir * (14 + i * 3),
        vy: -3 + i * 2,
        baseVx: dir * (14 + i * 3),
        baseVy: -3 + i * 2,
        width: 32,
        height: 24,
        damage: 18,
        knockbackX: dir * 6,
        knockbackY: -2,
        isFrozenInTime: false,
        life: 50,
        maxLife: 50,
        color: '#c084fc',
      });
    }

    // Spawn bubbling acid foam & vapor particles
    for (let p = 0; p < 12; p++) {
      this.particles.push({
        id: this.projectileId++,
        x: poolX + Math.random() * poolWidth,
        y: GROUND_Y - 14,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 4 - 1.5,
        life: 35,
        maxLife: 35,
        size: 8 + Math.random() * 6,
        color: '#c084fc',
        type: 'acid_bubble',
      });
    }

    soundManager.playAcidMelt();
    this.screenShake = 12;
    this.addShockwave(poolX + poolWidth / 2, GROUND_Y - 10, '#c084fc');
    this.addShockwave(attacker.x + attacker.width / 2, attacker.y + attacker.height / 2, '#a855f7');
    this.addTextParticle(poolX + poolWidth / 2, GROUND_Y - 45, '🧪 WHITESNAKE ACID DIGESTION STREAM!', '#c084fc');

    // Direct hit check for enemies in front of Pucci
    const targets = this.getTargetsForAttacker(attacker, target);
    const hitbox = this.createOrientedHitbox(attacker, 180, 80, PUCCI_ACID_MELT_DAMAGE, 12, 4, {
      hitStun: 50,
    });
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        t.acidMeltTimer = 120; // 2 seconds melting illusion!
        this.addTextParticle(t.x + t.width / 2, t.y - 55, '💀 MELTING ILLUSION! FLESH DISSOLVING!', '#c084fc');
      }
    }
  }

  private executePucciStandDisc(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'pucci_disc',
      x: dir === 1 ? attacker.x + attacker.width : attacker.x - 30,
      y: attacker.y + 25,
      vx: dir * 18,
      vy: 0,
      baseVx: dir * 18,
      baseVy: 0,
      width: 28,
      height: 28,
      damage: PUCCI_STAND_DISC_DAMAGE,
      knockbackX: 0,
      knockbackY: 0,
      isFrozenInTime: false,
      life: 100,
      maxLife: 100,
      color: '#e2e8f0',
    });
    soundManager.playPucciDisc();
  }

  private handlePucciChantFrame(f: Fighter) {
    const WORDS_14 = [
      'Spiral Staircase (らせん階段)',
      'Rhinoceros Beetle (カブト虫)',
      'Desolation Row (廃墟の街)',
      'Fig Tart (イチジクのタルト)',
      'Rhinoceros Beetle (カブト虫)',
      'Via Dolorosa (ドロローサへの道)',
      'Rhinoceros Beetle (カブト虫)',
      'Singularity Point (特異点)',
      'Giotto (ジョット)',
      'Angel (天使)',
      'Hydrangea (紫陽花)',
      'Rhinoceros Beetle (カブト虫)',
      'Singularity Point (特異点)',
      'Secret Emperor (秘密の皇帝) ✨'
    ];

    const currentStep = Math.floor((252 - f.actionTimer) / 18) + 1;
    if (currentStep > (f.pucciChantStep || 0) && currentStep <= 14) {
      f.pucciChantStep = currentStep;
      const word = WORDS_14[currentStep - 1];
      soundManager.play14WordsChant(currentStep);
      this.addTextParticle(f.x + f.width / 2, f.y - 50 - ((currentStep % 2) * 18), `📿 [${currentStep}/14] ${word}`, '#c084fc');
      this.addMenacingParticle(f.x + (Math.random() * 60 - 30), f.y - 20, '★', '#facc15');
      this.addSpark(f.x + f.width / 2, f.y + f.height / 2, '#c084fc');

      // Double-Helix Sacred Ascending Particle
      this.particles.push({
        id: this.projectileId++,
        x: f.x + f.width / 2,
        y: f.y + f.height / 2,
        vx: Math.cos(currentStep * 0.8) * 3,
        vy: -2.5,
        life: 55,
        maxLife: 55,
        size: 14,
        color: currentStep === 14 ? '#facc15' : '#c084fc',
        type: 'spiral_word',
        text: word.split(' ')[0],
      });
    }

    if (f.actionTimer <= 2 && (f.pucciChantStep || 0) >= 14) {
      this.evolvePucciToCmoon(f);
    }
  }

  private evolvePucciToCmoon(f: Fighter) {
    f.pucciForm = 'cmoon';
    f.standName = 'C-Moon';
    f.color = '#10b981';
    f.cmoonGauge = 0;
    soundManager.playPucciEvolution();
    this.screenShake = 20;
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#10b981');
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#34d399');
    this.addTextParticle(f.x + f.width / 2, f.y - 65, '🌕 [EVOLUTION: C-MOON AWAKENED!]', '#34d399');
    this.addTextParticle(f.x + f.width / 2, f.y - 35, '🌌 GRAVITATIONAL SHIFT UNLOCKED!', '#10b981');
  }

  private executeCmoonGravityShift(attacker: Fighter) {
    // Cycles activeGravityAxis: down -> right -> up -> left -> down
    const nextAxisMap: Record<string, 'down' | 'up' | 'left' | 'right'> = {
      down: 'right',
      right: 'up',
      up: 'left',
      left: 'down',
    };
    const prevAxis = this.activeGravityAxis || 'down';
    this.activeGravityAxis = nextAxisMap[prevAxis] || 'down';
    this.screenShake = 26;
    soundManager.playCmoonGravity();

    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#10b981');
    this.addShockwave(this.getArenaWidth() / 2, 260, '#34d399');

    // Pucci gains Singularity focus (+15 gauge)
    if (attacker.cmoonGauge !== undefined) {
      attacker.cmoonGauge = Math.min(100, attacker.cmoonGauge + 15);
    }

    // Spawn a wave of directional gravity arrow particles spanning the entire arena pointing toward the new gravitational floor
    const arenaW = this.getArenaWidth();
    for (let a = 0; a < 16; a++) {
      const arrowX = Math.random() * arenaW;
      const arrowY = Math.random() * 420 + 40;
      let vx = 0;
      let vy = 0;
      if (this.activeGravityAxis === 'right') {
        vx = 14 + Math.random() * 8;
        vy = 0;
      } else if (this.activeGravityAxis === 'left') {
        vx = -14 - Math.random() * 8;
        vy = 0;
      } else if (this.activeGravityAxis === 'up') {
        vx = 0;
        vy = -14 - Math.random() * 8;
      } else {
        vx = 0;
        vy = 14 + Math.random() * 8;
      }

      this.particles.push({
        id: this.projectileId++,
        x: arrowX,
        y: arrowY,
        vx: vx,
        vy: vy,
        life: 45,
        maxLife: 45,
        size: 22,
        color: '#10b981',
        type: 'gravity_arrow',
      });
    }

    // Fling all opponents along the new gravity axis vector with gravity slam armed
    const candidates = [
      this.player,
      this.ai,
      ...(this.teammate ? [this.teammate] : []),
      ...this.vampires,
    ];

    for (const f of candidates) {
      if (f.id !== attacker.id && f.hp > 0) {
        f.isGrounded = false;
        f.gravitySlamArmed = true;
        f.hitStun = Math.max(f.hitStun || 0, 30);
        if (this.activeGravityAxis === 'right') {
          f.vx = 26;
          f.vy = -6;
        } else if (this.activeGravityAxis === 'left') {
          f.vx = -26;
          f.vy = -6;
        } else if (this.activeGravityAxis === 'up') {
          f.vy = -28;
        } else {
          f.vy = 24;
        }
      }
    }

    for (let i = 0; i < 16; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 160, cy + (Math.random() - 0.5) * 160, '#10b981');
    }
    this.addMenacingParticle(cx, cy - 60, 'ゴ', '#10b981');
    this.addMenacingParticle(cx + 40, cy - 80, 'ゴ', '#34d399');
    this.addTextParticle(this.getArenaWidth() / 2, 140, `🌌 3000G GRAVITATIONAL SHIFT: [ ${this.activeGravityAxis.toUpperCase()} ]`, '#34d399');
  }

  private executeCmoonInversionPunch(attacker: Fighter, target: Fighter) {
    const reach = 140;
    const hitbox = this.createOrientedHitbox(attacker, reach, 75, CMOON_INVERSION_PUNCH_DAMAGE, 24, 12, {
      hitStun: 60,
      yOffset: 5,
    });

    this.screenShake = 22;
    soundManager.playCmoonInversion();
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#10b981');
    this.addTextParticle(cx, attacker.y - 45, '🌀 SURFACE INVERSION STRIKE (INSIDE-OUT)!', '#10b981');

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        // Inversion effect: reverse and multiply target's velocity violently
        t.vx = -t.vx * 1.8;
        t.vy = -t.vy * 1.8;
        t.inversionDistortTimer = 50; // Inside-out turning distortion!
        t.action = 'knockback';
        
        this.particles.push({
          id: this.projectileId++,
          x: t.x + t.width / 2,
          y: t.y + t.height / 2,
          vx: 0,
          vy: 0,
          life: 45,
          maxLife: 45,
          size: 44,
          color: '#10b981',
          type: 'inversion_spiral',
        });

        for (let i = 0; i < 12; i++) {
          this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#34d399');
        }
      }
    }
  }

  private executeCmoonDebrisLaunch(attacker: Fighter, target: Fighter) {
    const axis = this.activeGravityAxis || 'down';
    const dir = attacker.facing === 'right' ? 1 : -1;

    for (let d = 0; d < 3; d++) {
      let spawnX = attacker.x + (dir === 1 ? attacker.width + d * 20 : -30 - d * 20);
      let spawnY = attacker.y + 15 + d * 15;
      let vx = dir * (20 + d * 3);
      let vy = -4 + d * 3;

      if (axis === 'right') {
        const isUp = attacker.facing === 'right';
        spawnX = attacker.x - 20;
        spawnY = attacker.y + (isUp ? -30 - d * 20 : attacker.height + d * 20);
        vx = -8;
        vy = (isUp ? -1 : 1) * (20 + d * 3);
      } else if (axis === 'left') {
        const isUp = attacker.facing === 'left';
        spawnX = attacker.x + attacker.width + 10;
        spawnY = attacker.y + (isUp ? -30 - d * 20 : attacker.height + d * 20);
        vx = 8;
        vy = (isUp ? -1 : 1) * (20 + d * 3);
      } else if (axis === 'up') {
        spawnY = attacker.y + 10;
        vy = 4 - d * 3;
      }

      this.projectiles.push({
        id: this.projectileId++,
        ownerId: attacker.id,
        type: 'cmoon_debris',
        x: spawnX,
        y: spawnY,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        width: 34,
        height: 30,
        damage: Math.round(CMOON_DEBRIS_DAMAGE / 3),
        knockbackX: dir * 12,
        knockbackY: -6,
        isFrozenInTime: false,
        life: 85,
        maxLife: 85,
        color: '#6ee7b7',
      });
    }
    soundManager.playCmoonGravity();
    this.screenShake = 10;
  }

  private handlePucciMiHEvolutionFrame(f: Fighter) {
    this.screenShake = Math.max(this.screenShake, 10);
    if (this.frameCount % 5 === 0) {
      this.addSpark(f.x + f.width / 2 + (Math.random() * 80 - 40), f.y + f.height / 2 + (Math.random() * 80 - 40), '#facc15');
      this.addMenacingParticle(f.x + (Math.random() * 80 - 40), f.y - 30, '★', '#facc15');
    }
    // Ascending celestial levitation afterimages
    if (!f.afterimages) f.afterimages = [];
    if (this.frameCount % 3 === 0) {
      f.afterimages.push({
        x: f.x,
        y: f.y,
        alpha: 0.8,
        facing: f.facing,
        charId: 'pucci',
        color: 'rgba(250, 204, 21, 0.75)'
      });
    }
    if (f.actionTimer === 10) {
      this.evolvePucciToMiH(f);
    }
  }

  private evolvePucciToMiH(f: Fighter) {
    f.pucciForm = 'made_in_heaven';
    f.standName = 'Made in Heaven';
    f.color = '#facc15';
    this.activeGravityAxis = 'down';
    soundManager.playMiHAcceleration();
    this.screenShake = 24;
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#facc15');
    this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#ffffff');
    this.addTextParticle(f.x + f.width / 2, f.y - 65, '👑 ★ MADE IN HEAVEN: FINAL EVOLUTION! ★ 👑', '#facc15');
    this.addTextParticle(f.x + f.width / 2, f.y - 35, '⚡ INFINITE SPEED ACCELERATION UNLOCKED!', '#ffffff');

    // Burst afterimages celebrating the ascension to Made in Heaven
    if (!f.afterimages) f.afterimages = [];
    for (let b = 0; b < 3; b++) {
      f.afterimages.push({
        x: f.x + (b - 1) * 16,
        y: f.y,
        alpha: 0.9 - b * 0.2,
        facing: f.facing,
        charId: 'pucci',
        color: b === 1 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(250, 204, 21, 0.8)'
      });
    }
  }

  private executeMihSpeedBlitzHit(attacker: Fighter, target: Fighter, count: number) {
    soundManager.playMiHBlitz();
    const reach = 120;
    this.spawnOrientedBarrageArm(attacker, reach, '#facc15', '#ffffff', true);

    const hitbox = this.createOrientedHitbox(attacker, reach, 75, MIH_SPEED_BLITZ_DAMAGE_PER_HIT, 2.5, 1, {
      isBarrage: true,
      yOffset: 10,
    });
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private executeMihKnifeThrow(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    for (let k = 0; k < 5; k++) {
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: attacker.id,
        type: 'mih_knife',
        x: dir === 1 ? attacker.x + attacker.width + k * 10 : attacker.x - 30 - k * 10,
        y: attacker.y + 10 + k * 12,
        vx: dir * (36 + k * 2),
        vy: (k - 2) * 1.5,
        baseVx: dir * (36 + k * 2),
        baseVy: (k - 2) * 1.5,
        width: 32,
        height: 10,
        damage: MIH_KNIFE_DAMAGE / 5,
        knockbackX: dir * 8,
        knockbackY: -2,
        isFrozenInTime: false,
        life: 70,
        maxLife: 70,
        color: '#facc15',
      });
    }
    soundManager.playMiHKnife();
    this.screenShake = 6;
  }

  private executeMihTeleportStrike(attacker: Fighter, target: Fighter) {
    const origX = attacker.x;
    const origY = attacker.y;

    const dir = target.facing === 'right' ? -1 : 1;
    attacker.x = Math.max(40, Math.min(this.getArenaWidth() - 80, target.x + (dir * 70)));
    attacker.y = target.y;

    // Leave speed blitz displacement afterimages along the teleport trajectory
    if (!attacker.afterimages) attacker.afterimages = [];
    attacker.afterimages.push({
      x: origX,
      y: origY,
      alpha: 0.9,
      facing: attacker.facing,
      charId: 'pucci',
      color: 'rgba(250, 204, 21, 0.85)'
    });
    attacker.afterimages.push({
      x: (origX + attacker.x) * 0.5,
      y: (origY + attacker.y) * 0.5,
      alpha: 0.75,
      facing: attacker.facing,
      charId: 'pucci',
      color: 'rgba(255, 255, 255, 0.8)'
    });

    soundManager.playMiHBlitz();
    this.screenShake = 12;
    this.addShockwave(attacker.x + attacker.width / 2, attacker.y + attacker.height / 2, '#facc15');

    const hitbox = this.createOrientedHitbox(attacker, 110, 70, MIH_TELEPORT_DAMAGE, 20, 8, {
      hitStun: 45,
      yOffset: 10,
    });
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private handlePucciUniverseResetFrame(attacker: Fighter, target: Fighter) {
    this.screenShake = Math.max(this.screenShake, 18);
    if (this.frameCount % 3 === 0) {
      this.addMenacingParticle(Math.random() * this.getArenaWidth(), Math.random() * 400 + 40, '⏱️', '#facc15');
      this.addSpark(Math.random() * this.getArenaWidth(), Math.random() * 400 + 40, '#ffffff');
    }
    if (attacker.actionTimer === 10) {
      soundManager.playUniverseReset();
      this.screenShake = 30;
      const candidateFighters = [target, ...(this.teammate ? [this.teammate] : []), ...this.vampires];
      for (const t of candidateFighters) {
        if (t && t.hp > 0 && t.id !== attacker.id && t.team !== attacker.team) {
          this.applyRawDamage(t, MIH_UNIVERSE_RESET_DAMAGE, (t.x > attacker.x ? 1 : -1) * 26, -18, attacker);
          t.hitStun = 90;
          t.isGrounded = false;
          this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#facc15');
        }
      }
      this.addTextParticle(this.getArenaWidth() / 2, 180, '🌌 ★ UNIVERSE RESET: SINGULARITY REACHED! ★ 🌌', '#facc15');
    }
  }

  private executeDipezLightSpeedBlitzFrame(f: Fighter, opponent: Fighter) {
    if (f.actionTimer > 0) {
      const origX = f.x;
      const origY = f.y;

      const arenaW = this.getArenaWidth();
      const arenaH = 540;

      // Only reposition, play sounds, spawn particles, and check damage every 3 frames to prevent browser/rendering lag!
      if (f.actionTimer % 3 === 0) {
        let targetX: number;
        let targetY: number;

        const hitStep = Math.floor((75 - f.actionTimer) / 3);
        if (hitStep % 2 === 0 && opponent && opponent.hp > 0) {
          // Dash around opponent from various surrounding angles
          const angle = Math.random() * Math.PI * 2;
          const dist = 50 + Math.random() * 90;
          targetX = Math.max(60, Math.min(arenaW - 100, opponent.x + Math.cos(angle) * dist));
          targetY = Math.max(120, Math.min(arenaH - 140, opponent.y + Math.sin(angle) * dist));
        } else {
          // Flash to extreme arena bounds to create multi-point screen illusion
          targetX = 60 + Math.random() * (arenaW - 120);
          targetY = 100 + Math.random() * 280;
        }

        f.x = targetX;
        f.y = targetY;
        f.facing = f.x < origX ? 'left' : 'right';

        // Push glowing afterimages (reduced from 3 to 2 for optimized stickman model drawing)
        if (!f.afterimages) f.afterimages = [];
        f.afterimages.push({
          x: origX,
          y: origY,
          alpha: 0.85,
          facing: f.facing,
          charId: 'dipez',
          color: '#ffffff'
        });
        f.afterimages.push({
          x: (origX + targetX) * 0.5,
          y: (origY + targetY) * 0.5,
          alpha: 0.70,
          facing: f.facing,
          charId: 'dipez',
          color: '#fef08a'
        });

        // Sound, Screen Shake & Particles
        soundManager.playMiHBlitz();
        this.screenShake = Math.max(this.screenShake, 8);
        this.addShockwave((origX + targetX) * 0.5, (origY + targetY) * 0.5, '#fef08a');
        this.addSpark(targetX + f.width / 2, targetY + f.height / 2, '#ffffff');

        // Check damage & burn hits on targets hit along or near the light speed path
        const targets = this.getTargetsForAttacker(f, opponent);
        for (const t of targets) {
          if (!t || t.hp <= 0 || t.id === f.id) continue;
          
          const distToTarget = Math.hypot((t.x + t.width / 2) - (targetX + f.width / 2), (t.y + t.height / 2) - (targetY + f.height / 2));
          if (distToTarget < 190) {
            const knockDir = targetX > origX ? 1 : -1;
            // Balanced damage: 7 damage per hit over 25 potential hits (total possible damage: ~175, but usually ~80-120 since target is moving)
            this.applyRawDamage(t, 7, knockDir * 12, -5, f);
            t.hitStun = 15;
            t.action = 'hit';
            
            // Apply Burn Status (Damage Terbakar!)
            t.burnedTimer = Math.max(t.burnedTimer || 0, 120); // 2 seconds burning duration
            
            if (Math.random() < 0.3) {
              this.addMenacingParticle(t.x + Math.random() * t.width, t.y + Math.random() * t.height, '🔥', '#f97316');
            }
            if (Math.random() < 0.15) {
              this.addTextParticle(t.x + t.width / 2, t.y - 35, '⚡ LIGHT BLITZ!', '#fef08a');
            }
          }
        }
      }
    }
  }

  private updateAcidPools() {
    if (this.timeStopState.isActive) return;
    if (!this.acidPools || this.acidPools.length === 0) return;
    for (let i = this.acidPools.length - 1; i >= 0; i--) {
      const pool = this.acidPools[i];
      pool.duration--;
      if (pool.duration <= 0) {
        this.acidPools.splice(i, 1);
        continue;
      }

      // Spontaneous bubbling surface fizz & toxic vapors
      if (this.frameCount % 8 === 0) {
        this.particles.push({
          id: this.projectileId++,
          x: pool.x + Math.random() * pool.width,
          y: GROUND_Y - 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2.8 - 0.5,
          life: 25,
          maxLife: 25,
          size: 6 + Math.random() * 5,
          color: '#c084fc',
          type: 'acid_bubble',
        });
      }

      // Check all fighters standing inside acid pool
      const fighters = [this.player, this.ai, ...(this.teammate ? [this.teammate] : []), ...this.vampires];
      for (const f of fighters) {
        if (f && f.hp > 0 && f.id !== pool.ownerId && f.isGrounded) {
          const fCenter = f.x + f.width / 2;
          if (fCenter >= pool.x && fCenter <= pool.x + pool.width) {
            // Heavily slow down and dissolve
            f.vx *= 0.5;
            f.acidMeltTimer = Math.max(f.acidMeltTimer || 0, 50);
            if (this.frameCount % 15 === 0) {
              f.hp = Math.max(0, f.hp - pool.damagePerTick);
              this.addSpark(f.x + f.width / 2, GROUND_Y - 10, pool.color);
              this.addTextParticle(f.x + f.width / 2, f.y - 25, '🧪 ACID CORROSION', '#c084fc');
              soundManager.playAcidMelt();
            }
          }
        }
      }
    }
  }

  // --- HITBOX & COMBAT LOGIC ---
  private executePunch(attacker: Fighter, target: Fighter) {
    if (attacker.charId === 'pucci') {
      const form = attacker.pucciForm || 'whitesnake';
      if (form === 'cmoon') {
        // Dedicated C-Moon Gravitational Strike (Melee punch with green stand arm and shockwave)
        const reach = 115;
        const damage = attacker.isStandActive ? PUNCH_STAND_DAMAGE + 20 : PUNCH_DAMAGE + 15;
        const hitbox = this.createOrientedHitbox(attacker, reach, 65, damage, 10, 4, { hitStun: 26 });
        this.spawnOrientedBarrageArm(attacker, reach, '#10b981', '#34d399', false);
        soundManager.playHit(true);
        soundManager.playCmoonGravity();
        this.screenShake = Math.max(this.screenShake, 5);

        const dir = attacker.facing === 'right' ? 1 : -1;
        const punchX = attacker.x + (dir === 1 ? attacker.width + 15 : -25);
        const punchY = attacker.y + 10;
        this.addMenacingParticle(punchX, punchY, 'ゴ', '#10b981');

        const targets = this.getTargetsForAttacker(attacker, target);
        for (const t of targets) {
          if (this.checkCollision(hitbox, t)) {
            this.applyHit(attacker, t, hitbox);
            this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#34d399');
            this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#10b981');
            if (attacker.cmoonGauge !== undefined) {
              attacker.cmoonGauge = Math.min(100, attacker.cmoonGauge + 4);
            }
          }
        }
        return;
      } else if (form === 'made_in_heaven') {
        // Dedicated Made in Heaven Lightning Speed Chop
        const reach = 125;
        const damage = attacker.isStandActive ? PUNCH_STAND_DAMAGE + 25 : PUNCH_DAMAGE + 20;
        const hitbox = this.createOrientedHitbox(attacker, reach, 65, damage, 12, 5, { hitStun: 28 });
        this.spawnOrientedBarrageArm(attacker, reach, '#facc15', '#ffffff', true);
        soundManager.playHit(true);
        soundManager.playMiHBlitz();
        this.screenShake = Math.max(this.screenShake, 5);

        const dir = attacker.facing === 'right' ? 1 : -1;
        const punchX = attacker.x + (dir === 1 ? attacker.width + 15 : -25);
        const punchY = attacker.y + 10;
        this.addMenacingParticle(punchX, punchY, '★', '#facc15');

        const targets = this.getTargetsForAttacker(attacker, target);
        for (const t of targets) {
          if (this.checkCollision(hitbox, t)) {
            this.applyHit(attacker, t, hitbox);
            this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#facc15');
          }
        }
        return;
      }

      this.executePucciBasicPistolShot(attacker, target);
      return;
    }

    if (attacker.charId === 'funny_valentine') {
      this.executeValentineBasicRevolverShot(attacker, target);
      return;
    }

    if (attacker.charId === 'perstein') {
      soundManager.playPersteinChainWhip();
      const chainReach = 280; // Long-range 70m Drive Chain Lash!
      const damage = attacker.isStandActive ? PUNCH_STAND_DAMAGE + 20 : PUNCH_DAMAGE + 15;
      const hitbox = this.createOrientedHitbox(attacker, chainReach, 65, damage, 11, 4, { hitStun: 28 });
      this.spawnOrientedBarrageArm(attacker, chainReach, '#38bdf8', '#cbd5e1', true);
      soundManager.playHit(true);
      this.screenShake = Math.max(this.screenShake, 5);

      const dir = attacker.facing === 'right' ? 1 : -1;
      const punchX = attacker.x + (dir === 1 ? attacker.width + 25 : -35);
      const punchY = attacker.y + 10;
      this.addMenacingParticle(punchX, punchY, '⛓️', '#38bdf8');

      // Spawn chain glints along the lash
      for (let i = 0; i < 5; i++) {
        this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 50 : -i * 50), attacker.y + 25, '#94a3b8');
      }

      const targets = this.getTargetsForAttacker(attacker, target);
      for (const t of targets) {
        if (this.checkCollision(hitbox, t)) {
          this.applyHit(attacker, t, hitbox);
          this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#38bdf8');
          this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#38bdf8');
        }
      }
      return;
    }

    if (attacker.charId === 'joseph_old') {
      soundManager.playHermitVineWhip();
      soundManager.playHamonBuzz();
      const vineReach = 185; // Mid-long range Hermit Purple thorny vine whip strike!
      const damage = attacker.isStandActive ? PUNCH_STAND_DAMAGE + 18 : PUNCH_DAMAGE + 14;
      const hitbox = this.createOrientedHitbox(attacker, vineReach, 65, damage, 10, 4, {
        hitStun: 26,
        reactionType: 'electric_shock',
      });
      this.spawnOrientedBarrageArm(attacker, vineReach, '#c084fc', '#facc15', true);
      this.screenShake = Math.max(this.screenShake, 5);

      const dir = attacker.facing === 'right' ? 1 : -1;
      const tipX = attacker.x + (dir === 1 ? attacker.width + 65 : -65);
      const tipY = attacker.y + 20;
      this.addMenacingParticle(tipX, tipY - 10, 'ビシッ', '#c084fc');
      for (let i = 0; i < 5; i++) {
        this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 32 : -i * 32), attacker.y + 24, i % 2 === 0 ? '#c084fc' : '#facc15');
      }

      const targets = this.getTargetsForAttacker(attacker, target);
      for (const t of targets) {
        if (this.checkCollision(hitbox, t)) {
          this.applyHit(attacker, t, hitbox);
          this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#c084fc');
          this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#facc15');
          this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#c084fc');
        }
      }
      return;
    }

    if (attacker.charId === 'jonathan') {
      if (attacker.isSwordEquipped) {
        soundManager.playSwordSlash();
        const swordReach = 135;
        const hitbox = this.createOrientedHitbox(attacker, swordReach, 70, 115, 10, 4);
        this.spawnOrientedBarrageArm(attacker, swordReach, '#f8fafc', '#38bdf8', true);
        const dir = attacker.facing === 'right' ? 1 : -1;
        const tipX = attacker.x + (dir === 1 ? attacker.width + 40 : -40);
        this.addShockwave(tipX, attacker.y + 20, '#38bdf8');
        this.addMenacingParticle(tipX, attacker.y + 10, '斬', '#38bdf8');

        const targets = this.getTargetsForAttacker(attacker, target);
        for (const t of targets) {
          if (this.checkCollision(hitbox, t)) {
            this.applyHit(attacker, t, hitbox);
          }
        }
        return;
      } else {
        // Hamon Overdrive Heavy Punch
        soundManager.playHamonBuzz();
        soundManager.playHit(true);
        const hamonReach = 95;
        const hitbox = this.createOrientedHitbox(attacker, hamonReach, 65, PUNCH_DAMAGE + 15, 8, 4);
        this.spawnOrientedBarrageArm(attacker, hamonReach, '#facc15', '#fb923c', false);
        const dir = attacker.facing === 'right' ? 1 : -1;
        const punchX = attacker.x + (dir === 1 ? attacker.width + 25 : -35);
        this.addShockwave(punchX, attacker.y + 20, '#facc15');
        this.addMenacingParticle(punchX, attacker.y + 10, '☀', '#facc15');
        for (let i = 0; i < 4; i++) {
          this.addSpark(punchX + (Math.random() - 0.5) * 20, attacker.y + 20 + (Math.random() - 0.5) * 20, '#facc15');
        }

        const targets = this.getTargetsForAttacker(attacker, target);
        for (const t of targets) {
          if (this.checkCollision(hitbox, t)) {
            this.applyHit(attacker, t, hitbox);
          }
        }
        return;
      }
    }

    const isVampireAttacker = attacker.charId === 'vampire';
    const reach = attacker.isStandActive ? 105 : (isVampireAttacker ? 68 : 75);
    const damage = isVampireAttacker ? 16 : (attacker.isStandActive ? PUNCH_STAND_DAMAGE : PUNCH_DAMAGE);
    const knockFwd = isVampireAttacker ? 3.5 : (attacker.isStandActive ? 9 : 6);
    const knockUp = isVampireAttacker ? 1.5 : (attacker.isStandActive ? 5 : 3);
    const hitbox = this.createOrientedHitbox(attacker, reach, 60, damage, knockFwd, knockUp);

    // Spawn Punch Menacing Particle
    const dir = attacker.facing === 'right' ? 1 : -1;
    const punchX = attacker.x + (dir === 1 ? attacker.width + 15 : -25);
    const punchY = attacker.y + 10;
    const punchGlyph = attacker.charId === 'jotaro' ? (Math.random() < 0.5 ? 'オラ' : 'ゴ')
      : attacker.charId === 'dio' ? (Math.random() < 0.5 ? '無駄' : 'ゴ')
      : attacker.charId === 'crazy_diamond' ? (Math.random() < 0.5 ? 'ドラ' : 'ゴ')
      : attacker.charId === 'gappy' ? (Math.random() < 0.5 ? 'オラ' : 'ゴ')
      : attacker.charId === 'king_crimson' ? (Math.random() < 0.5 ? 'ドゴ' : 'ゴ')
      : attacker.charId === 'silver_chariot' ? '⚔️'
      : 'ド';
    const punchColor = attacker.charId === 'dio' ? 'rgba(250, 204, 21, 0.95)'
      : attacker.charId === 'gappy' ? 'rgba(56, 189, 248, 0.95)'
      : attacker.charId === 'king_crimson' ? 'rgba(251, 113, 133, 0.95)'
      : 'rgba(239, 68, 68, 0.95)';
    this.addMenacingParticle(punchX, punchY, punchGlyph, punchColor);

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        if (attacker.charId === 'gappy' && Math.random() < GAPPY_PLUNDER_CHANCE) {
          const roll = Math.random();
          soundManager.playBubblePlunder();
          if (roll < 0.34) {
            t.gappyFrictionTheftTimer = GAPPY_PLUNDER_EFFECT_DURATION;
            this.addTextParticle(t.x + t.width / 2, t.y - 45, '🧼 PLUNDER: FRICTION THEFT!', '#38bdf8');
          } else if (roll < 0.67) {
            t.gappySightTheftTimer = GAPPY_PLUNDER_EFFECT_DURATION;
            this.addTextParticle(t.x + t.width / 2, t.y - 45, '👁️ PLUNDER: SIGHT THEFT!', '#0f172a');
          } else {
            t.gappySoundTheftTimer = GAPPY_PLUNDER_EFFECT_DURATION;
            this.addTextParticle(t.x + t.width / 2, t.y - 45, '🔇 PLUNDER: SOUND THEFT!', '#64748b');
          }
          for (let b = 0; b < 8; b++) {
            this.addSpark(t.x + t.width / 2 + (Math.random() * 40 - 20), t.y + t.height / 2 + (Math.random() * 40 - 20), '#7dd3fc');
          }
        }
      }
    }
  }

  private executeComboPunch1(attacker: Fighter, target: Fighter) {
    const isVampire = attacker.charId === 'vampire';
    const reach = attacker.isStandActive ? 100 : (isVampire ? 68 : 80);
    const damage = isVampire ? 16 : (attacker.isStandActive ? 28 : 20);
    const hitbox = this.createOrientedHitbox(attacker, reach, 55, damage, 3.0, 1.0, { hitStun: 20 });

    const dir = attacker.facing === 'right' ? 1 : -1;
    const punchX = attacker.x + (dir === 1 ? attacker.width + 15 : -25);
    const punchY = attacker.y + 12;

    const standColor = attacker.standColor || '#c084fc';
    const auraColor = attacker.auraColor || '#facc15';
    if (attacker.hasStand || attacker.isStandActive) {
      this.spawnOrientedBarrageArm(attacker, reach, standColor, auraColor, false);
    }
    soundManager.playPunchWhoosh(false);

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        this.addSpark(punchX, punchY, standColor);
      }
    }
  }

  private executeAirSpike(attacker: Fighter, target: Fighter) {
    const reach = attacker.isStandActive ? 105 : 85;
    const damage = attacker.isStandActive ? 62 : 46;
    const hitbox = this.createOrientedHitbox(attacker, reach, 75, damage, 3.5, 16.0, { hitStun: 35 });

    const dir = attacker.facing === 'right' ? 1 : -1;
    const punchX = attacker.x + (dir === 1 ? attacker.width + 15 : -25);
    const punchY = attacker.y + 35;

    const standColor = attacker.standColor || '#ef4444';
    if (attacker.hasStand || attacker.isStandActive) {
      this.spawnOrientedBarrageArm(attacker, reach, standColor, '#facc15', true);
    }
    soundManager.playHeavyImpact();
    this.screenShake = Math.max(this.screenShake, 8);
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 35, '☄️ METEOR SPIKE!', '#ef4444');
    this.addShockwave(punchX, punchY, '#ef4444');

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        t.isGroundBouncing = true;
        t.hitReactionType = 'ground_slam_spike';
        this.applyHit(attacker, t, hitbox);
        for (let s = 0; s < 6; s++) {
          this.addSpark(punchX + (Math.random() * 30 - 15), punchY + (Math.random() * 30 - 15), '#facc15');
        }
      }
    }
  }

  private executeVampireDrainBite(attacker: Fighter, target: Fighter) {
    const reach = 95;
    const hitbox = this.createOrientedHitbox(attacker, reach, 55, 20, 3, 1.5);

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        soundManager.playRazorCut();
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + 20);
        this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 30, '🩸 VAMPIRIC DRAIN! (+20 HP)', '#ef4444');
        this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#dc2626');
        for (let i = 0; i < 6; i++) {
          this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#7f1d1d');
        }
      }
    }
  }

  private executeSpaceRipperSmall(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'space_ripper',
      subType: 'vampire_beam',
      x: dir === 1 ? attacker.x + attacker.width + 10 : attacker.x - 60,
      y: attacker.y + 25,
      vx: dir * 22,
      vy: 0,
      baseVx: dir * 22,
      baseVy: 0,
      width: 50,
      height: 16,
      damage: 22,
      knockbackX: dir * 6,
      knockbackY: -2,
      isFrozenInTime: false,
      life: 45,
      maxLife: 45,
      color: '#ef4444',
    });
    soundManager.playRazorCut();
  }

  private executeBarrageHit(attacker: Fighter, target: Fighter) {
    const isSilverChariot = attacker.charId === 'silver_chariot';
    const isPerstein = attacker.charId === 'perstein';
    const reach = isPerstein
      ? (attacker.isStandActive ? 320 : 260)
      : attacker.isStandActive ? (isSilverChariot ? 95 : 85) : (isSilverChariot ? 80 : 70);

    if (isPerstein) {
      if (this.frameCount % 4 === 0) soundManager.playPersteinChainShred();
      this.spawnOrientedBarrageArm(
        attacker,
        reach,
        '#38bdf8',
        '#e2e8f0',
        true
      );
    } else if (isSilverChariot) {
      soundManager.playRapierThrust();
      this.spawnOrientedBarrageArm(
        attacker,
        reach,
        '#f1f5f9',
        '#38bdf8',
        true
      );
    } else if (attacker.charId === 'jonathan') {
      if (this.frameCount % 5 === 0) soundManager.playHamonBuzz();
      this.spawnOrientedBarrageArm(
        attacker,
        reach,
        '#facc15',
        '#fb923c',
        false
      );
    } else {
      this.spawnOrientedBarrageArm(
        attacker,
        reach,
        attacker.isStandActive ? attacker.standColor : attacker.color,
        attacker.isStandActive ? '#facc15' : '#ffffff',
        false
      );
    }

    const isJosuke = attacker.charId === 'crazy_diamond';
    const isVampireMinion = attacker.charId === 'vampire';
    const damage = isVampireMinion
      ? 4
      : isPerstein
      ? (attacker.isStandActive ? BARRAGE_STAND_DAMAGE_PER_HIT + 3 : BARRAGE_DAMAGE_PER_HIT + 2)
      : isJosuke
      ? (attacker.isStandActive ? BARRAGE_STAND_DAMAGE_PER_HIT + 4 : BARRAGE_DAMAGE_PER_HIT + 3)
      : (attacker.isStandActive ? BARRAGE_STAND_DAMAGE_PER_HIT : BARRAGE_DAMAGE_PER_HIT);
    const hitbox = this.createOrientedHitbox(attacker, reach, 55, damage, 1.8, 0.8, {
      isBarrage: true,
    });

    // Spawn Barrage Menacing / Shout Particles
    if (this.frameCount % 2 === 0) {
      const dir = attacker.facing === 'right' ? 1 : -1;
      const armX = attacker.x + (dir === 1 ? attacker.width + Math.random() * reach : -Math.random() * reach);
      const armY = attacker.y + Math.random() * 40 - 10;
      const bGlyph = attacker.charId === 'jotaro' ? (Math.random() < 0.7 ? 'オラ' : 'ゴ')
        : attacker.charId === 'dio' ? (Math.random() < 0.7 ? '無駄' : 'ゴ')
        : attacker.charId === 'crazy_diamond' ? (Math.random() < 0.7 ? 'ドラ' : '♥')
        : attacker.charId === 'gappy' ? (Math.random() < 0.7 ? 'オラ' : 'ゴ')
        : attacker.charId === 'king_crimson' ? (Math.random() < 0.7 ? 'ドゴ' : 'ゴ')
        : attacker.charId === 'silver_chariot' ? (Math.random() < 0.7 ? '⚔️' : 'ゴ')
        : attacker.charId === 'michael' ? (Math.random() < 0.7 ? 'ウラ' : 'ゴ')
        : attacker.charId === 'perstein' ? (Math.random() < 0.7 ? 'シッ' : 'ゴ')
        : attacker.charId === 'jonathan' ? (Math.random() < 0.7 ? '波' : '☀')
        : 'ゴ';
      const bColor = attacker.charId === 'dio' ? 'rgba(250, 204, 21, 0.95)'
        : attacker.charId === 'crazy_diamond' ? 'rgba(244, 63, 94, 0.95)'
        : attacker.charId === 'gappy' ? 'rgba(56, 189, 248, 0.95)'
        : attacker.charId === 'king_crimson' ? 'rgba(251, 113, 133, 0.95)'
        : attacker.charId === 'michael' ? 'rgba(245, 158, 11, 0.95)'
        : attacker.charId === 'perstein' ? 'rgba(56, 189, 248, 0.95)'
        : attacker.charId === 'jonathan' ? 'rgba(250, 204, 21, 0.95)'
        : 'rgba(192, 132, 252, 0.95)';
      this.addMenacingParticle(armX, armY, bGlyph, bColor);
    }

    // JOSUKE CRAZY DIAMOND SPECIAL FEATURE:
    // 1. Detect Teammates in Barrage Range -> Heal Teammate & Cleanse Debuffs!
    if (isJosuke) {
      const allies = this.getAllActiveFighters().filter(
        a => a && a.id !== attacker.id && a.team === attacker.team && a.hp > 0 && !a.isDead
      );
      for (const ally of allies) {
        if (this.checkCollision(hitbox, ally)) {
          const allyHeal = attacker.isStandActive ? 14 : 10;
          ally.hp = Math.min(ally.maxHp, ally.hp + allyHeal);
          if (ally.bleedTimer && ally.bleedTimer > 0) ally.bleedTimer = 0;
          if (ally.burnedTimer && ally.burnedTimer > 0) ally.burnedTimer = 0;
          if (ally.persteinShredTimer && ally.persteinShredTimer > 0) ally.persteinShredTimer = 0;

          const ax = ally.x + ally.width / 2;
          const ay = ally.y + ally.height / 2;
          this.addSpark(ax + (Math.random() * 32 - 16), ay + (Math.random() * 32 - 16), '#4ade80');
          this.addSpark(ax + (Math.random() * 32 - 16), ay + (Math.random() * 32 - 16), '#38bdf8');
          this.addSpark(ax + (Math.random() * 32 - 16), ay + (Math.random() * 32 - 16), '#f43f5e');
          if (this.frameCount % 6 === 0) {
            soundManager.playHamonBreath();
            this.addShockwave(ax, ay, '#4ade80');
            this.addTextParticle(ax, ally.y - 38, `💖 「直す」ALLY HEAL! +${allyHeal} HP`, '#4ade80');
            this.addMenacingParticle(ax + (Math.random() * 24 - 12), ally.y - 14, '♥', '#f43f5e');
          }
        }
      }
    }

    // 2. Detect Enemies in Barrage Range -> Micro-Heal + Bigger Damage + 1s Post-Barrage Skill Lock!
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        // STAND BARRAGE CLASH TRIGGER (When two Stand characters barrage and collide!)
        if (
          !this.barrageClash.isActive &&
          attacker.charId !== 'vampire' &&
          t.charId !== 'vampire' &&
          this.isBarragingAction(attacker) &&
          this.isBarragingAction(t) &&
          !attacker.isFrozenByTimeStop &&
          !t.isFrozenByTimeStop &&
          attacker.hp > 0 &&
          t.hp > 0
        ) {
          this.initiateBarrageClash(attacker, t);
          return;
        }

        if (isJosuke) {
          // Lore-accurate micro-heal (+2 HP) before applying much larger DORARARA barrage damage (~13 DMG),
          // plus locking enemy skills for 1 full second (60 frames) after the barrage!
          const microHeal = 2;
          if (t.hp > 0) {
            t.hp = Math.min(t.maxHp, t.hp + microHeal);
          }
          this.applyHit(attacker, t, hitbox);
          t.silencedTimer = Math.max(t.silencedTimer || 0, 60); // 1 second (60 frames) skill lock after barrage!

          const tx = t.x + t.width / 2;
          const ty = t.y + t.height / 2;
          this.addSpark(tx + (Math.random() * 28 - 14), ty + (Math.random() * 28 - 14), '#4ade80');
          this.addSpark(tx + (Math.random() * 28 - 14), ty + (Math.random() * 28 - 14), '#38bdf8');
          if (this.frameCount % 6 === 0) {
            this.addTextParticle(
              tx,
              t.y - 42,
              `💖+${microHeal} HP / 💥-${Math.round(damage)} DMG (🚫 SKILL LOCK 1s!)`,
              '#38bdf8'
            );
            this.addMenacingParticle(tx + (Math.random() * 26 - 13), t.y - 16, '♥', '#4ade80');
          }
        } else {
          this.applyHit(attacker, t, hitbox);
        }
      }
    }
  }

  private executeStarFinger(attacker: Fighter, target: Fighter) {
    const reach = STAR_FINGER_RANGE;
    const hitbox = this.createOrientedHitbox(attacker, reach, 40, STAR_FINGER_DAMAGE, 3.5, 1.5, {
      hitStun: STAR_FINGER_STUN,
      yOffset: 20,
    });

    this.screenShake = 6;
    const axis = this.activeGravityAxis || 'down';
    for (let i = 0; i < 6; i++) {
      let sparkX = attacker.x + attacker.width / 2;
      let sparkY = attacker.y + attacker.height / 2;
      if (axis === 'down' || axis === 'up') {
        const dir = attacker.facing === 'right' ? 1 : -1;
        sparkX = attacker.x + (dir === 1 ? attacker.width + i * 40 : -i * 40);
        sparkY = attacker.y + 35;
      } else if (axis === 'right') {
        const isUp = attacker.facing === 'right';
        sparkX = attacker.x - 20;
        sparkY = attacker.y + (isUp ? -i * 40 : attacker.height + i * 40);
      } else if (axis === 'left') {
        const isUp = attacker.facing === 'left';
        sparkX = attacker.x + attacker.width + 20;
        sparkY = attacker.y + (isUp ? -i * 40 : attacker.height + i * 40);
      }
      this.addSpark(sparkX, sparkY, '#c084fc');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private tryExecuteOraBeatdown(attacker: Fighter, target: Fighter) {
    if (attacker.team && target.team && attacker.team === target.team) {
      attacker.cooldowns.skill5 = 30; // Cannot grab teammate
      return;
    }
    const dist = Math.abs((attacker.x + attacker.width / 2) - (target.x + target.width / 2));
    if (dist <= ORA_BEATDOWN_GRAB_RANGE && !target.isInvulnerable && !target.isTimeEraseActive) {
      attacker.action = 'ora_beatdown';
      attacker.actionTimer = ORA_BEATDOWN_DURATION;
      attacker.actionDuration = ORA_BEATDOWN_DURATION;
      attacker.cooldowns.skill5 = ORA_BEATDOWN_COOLDOWN;
      attacker.grabbedTarget = target.id;
      attacker.isStandActive = true;
      if (this.matchConfig.mode !== 'training') attacker.energy -= ORA_BEATDOWN_COST;

      target.action = 'grabbed';
      target.x = attacker.facing === 'right' ? attacker.x + attacker.width + 10 : attacker.x - target.width - 10;
      target.y = attacker.y;

      this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 45, 'ORA BEATDOWN GRABBED!', '#facc15');
      this.screenShake = 8;
    } else {
      attacker.cooldowns.skill5 = 30; // Miss penalty
    }
  }

  private executeOraBeatdownHit(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const damage = 22;
    this.applyRawDamage(target, damage, dir * 0.5, -0.5);
    this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
    this.spawnOrientedBarrageArm(attacker, 85, '#9333ea', '#facc15', false);
    this.screenShake = 4;
  }

  private executeOraBeatdownFinisher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const finalDamage = 130;
    this.applyRawDamage(target, finalDamage, dir * 18, -6);
    target.action = 'knockback';
    target.hitReactionType = 'directional_launch';
    target.hitReactionTimer = 45;
    target.hitReactionDuration = 45;
    target.isGrounded = false;
    target.hitStun = 45;
    this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#9333ea');
    this.addTextParticle(target.x + target.width / 2, target.y - 40, 'RETIRED!! (BLAST AWAY)', '#facc15');
    this.screenShake = 12;
  }

  // --- DIO SKILL EXECUTIONS ---
  private spawnDIOKnives(dio: Fighter) {
    const axis = this.activeGravityAxis || 'down';
    const isInsideTimeStop = this.timeStopState.isActive;

    this.addTextParticle(dio.x + dio.width / 2, dio.y - 30, isInsideTimeStop ? 'SUSPENDED KNIVES!' : 'KNIFE THROW!', '#ef4444');

    for (let i = 0; i < KNIFE_THROW_COUNT; i++) {
      const angleOffset = (i - (KNIFE_THROW_COUNT - 1) / 2) * 0.15;
      const speed = KNIFE_SPEED;
      let vx = Math.cos(angleOffset) * speed * (dio.facing === 'right' ? 1 : -1);
      let vy = Math.sin(angleOffset) * speed;
      let spawnX = dio.facing === 'right' ? dio.x + dio.width + 10 : dio.x - 20;
      let spawnY = dio.y + 25 + i * 8;
      let pWidth = 24;
      let pHeight = 10;
      let kbX = (dio.facing === 'right' ? 1 : -1) * 4;
      let kbY = -2;

      if (axis === 'right') {
        const isUp = dio.facing === 'right';
        vx = -Math.abs(Math.sin(angleOffset) * speed) - 4;
        vy = (isUp ? -1 : 1) * Math.cos(angleOffset) * speed;
        spawnX = dio.x - 15;
        spawnY = dio.y + (isUp ? -15 - i * 6 : dio.height + i * 6);
        pWidth = 10;
        pHeight = 24;
        kbX = -4;
        kbY = (isUp ? -1 : 1) * 4;
      } else if (axis === 'left') {
        const isUp = dio.facing === 'left';
        vx = Math.abs(Math.sin(angleOffset) * speed) + 4;
        vy = (isUp ? -1 : 1) * Math.cos(angleOffset) * speed;
        spawnX = dio.x + dio.width + 10;
        spawnY = dio.y + (isUp ? -15 - i * 6 : dio.height + i * 6);
        pWidth = 10;
        pHeight = 24;
        kbX = 4;
        kbY = (isUp ? -1 : 1) * 4;
      }

      this.projectiles.push({
        id: this.projectileId++,
        ownerId: dio.id,
        type: 'knife',
        x: spawnX,
        y: spawnY,
        vx: isInsideTimeStop ? 0 : vx,
        vy: isInsideTimeStop ? 0 : vy,
        baseVx: vx,
        baseVy: vy,
        width: pWidth,
        height: pHeight,
        damage: KNIFE_DAMAGE,
        knockbackX: kbX,
        knockbackY: kbY,
        isFrozenInTime: isInsideTimeStop,
        life: 180,
        maxLife: 180,
        color: '#facc15',
      });
    }
  }

  private tryExecuteDrainBlood(dio: Fighter, target: Fighter) {
    // Dynamic Targeting: Secure the closest valid alive opponent in range
    let resolvedTarget = target;
    const targets = this.getTargetsForAttacker(dio, target);
    if (targets.length > 0) {
      let closest = targets[0];
      let minDist = Math.abs((targets[0].x + targets[0].width / 2) - (dio.x + dio.width / 2));
      for (const t of targets) {
        const d = Math.abs((t.x + t.width / 2) - (dio.x + dio.width / 2));
        if (d < minDist) {
          minDist = d;
          closest = t;
        }
      }
      resolvedTarget = closest;
    }

    if (dio.team && resolvedTarget.team && dio.team === resolvedTarget.team) {
      dio.cooldowns.skill2 = 35; // Cannot grab teammate
      return;
    }
    const dist = Math.abs((dio.x + dio.width / 2) - (resolvedTarget.x + resolvedTarget.width / 2));
    if (dist <= DRAIN_BLOOD_GRAB_RANGE && !resolvedTarget.isInvulnerable && !resolvedTarget.isTimeEraseActive && resolvedTarget.hp > 0) {
      dio.action = 'drain_blood';
      dio.actionTimer = DRAIN_BLOOD_DURATION;
      dio.actionDuration = DRAIN_BLOOD_DURATION;
      dio.cooldowns.skill2 = DRAIN_BLOOD_COOLDOWN;
      dio.grabbedTarget = resolvedTarget.id;
      if (this.matchConfig.mode !== 'training') dio.energy -= DRAIN_BLOOD_COST;

      resolvedTarget.action = 'grabbed';
      resolvedTarget.x = dio.facing === 'right' ? dio.x + dio.width + 5 : dio.x - resolvedTarget.width - 5;
      resolvedTarget.y = dio.y;

      this.addTextParticle(dio.x + dio.width / 2, dio.y - 45, 'WRYYYY! (BLOOD DRAIN)', '#ef4444');
      this.screenShake = 6;
    } else {
      dio.cooldowns.skill2 = 35;
    }
  }

  private executeDrainBloodTick(dio: Fighter, target: Fighter) {
    const tickDamage = 30;
    const healAmount = 25;
    this.applyRawDamage(target, tickDamage, 0, 0);
    dio.hp = Math.min(dio.maxHp, dio.hp + healAmount);

    this.addSpark(target.x + target.width / 2, target.y + 20, '#ef4444');
    this.addTextParticle(dio.x + dio.width / 2, dio.y - 20, `+${healAmount} HP`, '#4ade80');
  }

  private executeStreetSignChop(dio: Fighter, target: Fighter) {
    const hitbox = this.createOrientedHitbox(dio, STREET_SIGN_RANGE, 90, STREET_SIGN_DAMAGE, 12, 4, {
      isGuardBreak: true,
      yOffset: -10,
    });

    this.screenShake = 8;
    const cx = dio.x + dio.width / 2;
    const cy = dio.y + dio.height / 2;
    this.addShockwave(cx, cy, '#ef4444');

    const targets = this.getTargetsForAttacker(dio, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        t.guardBreakTimer = STREET_SIGN_GUARD_BREAK_FRAMES;
        this.applyHit(dio, t, hitbox);
        this.addTextParticle(t.x + t.width / 2, t.y - 30, 'GUARD BROKEN!', '#ef4444');
      }
    }
  }

  private executeSpaceRipperBeam(dio: Fighter, target: Fighter) {
    const reach = 850;
    const hitbox = this.createOrientedHitbox(dio, reach, 20, SPACE_RIPPER_DAMAGE, 14, 3, {
      yOffset: 12,
    });

    this.screenShake = 10;
    const cx = dio.x + dio.width / 2;
    const cy = dio.y + dio.height / 2;
    this.addShockwave(cx, cy, '#ef4444');

    const targets = this.getTargetsForAttacker(dio, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(dio, t, hitbox);
      }
    }
  }

  private executeRoadRollerPummelHit(dio: Fighter, target: Fighter) {
    const damage = 18;
    this.applyRawDamage(target, damage, 0, 0, dio);
    const targetX = target.x + target.width / 2;
    this.addShockwave(targetX, GROUND_Y - 50, '#facc15');
    this.addSpark(targetX + (Math.random() - 0.5) * 60, GROUND_Y - 145 + (Math.random() - 0.5) * 30, '#ffffff');
    this.screenShake = Math.max(this.screenShake, 7);

    // Katakana "無駄ッ!" or "MUDA!" text particle
    const katakana = Math.random() < 0.6 ? '無駄ッ!' : 'MUDA!';
    this.addMenacingParticle(targetX + (Math.random() - 0.5) * 80, GROUND_Y - 120, katakana, '#facc15');
  }

  private executeRoadRollerExplosion(dio: Fighter, target: Fighter) {
    const dir = dio.facing === 'right' ? 1 : -1;
    const finalDamage = 220;
    const targetX = target.x + target.width / 2;
    const explodeY = GROUND_Y - 60;

    // Time resumes as the Road Roller detonates
    this.resumeTime();
    soundManager.playTimeResume();
    soundManager.playCarCrash();
    soundManager.playClashFinisher();

    this.screenShake = 28;

    // Expanding fire shockwaves
    for (let i = 0; i < 5; i++) {
      this.addShockwave(targetX, explodeY, i % 2 === 0 ? '#f97316' : '#facc15');
    }
    for (let i = 0; i < 30; i++) {
      this.addSpark(targetX + (Math.random() - 0.5) * 120, explodeY + (Math.random() - 0.5) * 80, '#facc15');
    }

    this.addMenacingParticle(targetX, explodeY - 40, 'ドゴォォォンッ!!', '#ef4444');
    this.addTextParticle(targetX, explodeY - 70, '💥 ROAD ROLLER CATASTROPHIC DETONATION!! 💥', '#facc15');

    this.applyRawDamage(target, finalDamage, dir * 26, -9, dio);
    target.action = 'knockback';
    target.hitReactionType = 'directional_launch';
    target.hitReactionTimer = 75;
    target.hitReactionDuration = 75;
    target.hitStun = 75;
    target.isGrounded = false;
  }

  // --- JONATHAN EXECUTION METHODS ---
  private executeZoomPunch(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const directReach = ZOOM_PUNCH_RANGE + 30; // ~230px
    const directHitbox = this.createOrientedHitbox(attacker, directReach, 55, ZOOM_PUNCH_DAMAGE + 15, 7, 2, {
      hitStun: ZOOM_PUNCH_STUN + 8,
      yOffset: 12,
    });
    
    // Wind Pressure Shockwave Gust Hitbox (Extended range up to 520px!)
    const windReach = 520;
    const windHitbox = this.createOrientedHitbox(attacker, windReach, 85, 75, 11, 3, {
      hitStun: 24,
      yOffset: 12,
    });

    this.screenShake = 10;
    soundManager.playHamonBuzz();
    soundManager.playHit(true);

    // Erupting golden Hamon sparks along the dislocation vector
    for (let i = 0; i < 8; i++) {
      this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 32 : -i * 32), attacker.y + 26, '#facc15');
      this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 32 : -i * 32), attacker.y + 26, '#fef08a');
    }
    const tipX = attacker.x + (dir === 1 ? attacker.width + ZOOM_PUNCH_RANGE : -ZOOM_PUNCH_RANGE);
    this.addShockwave(tipX, attacker.y + 26, '#facc15');

    // Wind shear sparks along the extended air blast path
    for (let w = 0; w < 6; w++) {
      const wx = tipX + dir * (w * 45 + 30);
      this.addSpark(wx, attacker.y + 26 + (Math.random() - 0.5) * 30, '#fde047');
      this.addSpark(wx, attacker.y + 26 + (Math.random() - 0.5) * 30, '#ffffff');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    const hitDirectly = new Set<string>();

    // 1. Direct Fist Melee Hits
    for (const t of targets) {
      if (this.checkCollision(directHitbox, t)) {
        this.applyHit(attacker, t, directHitbox);
        hitDirectly.add(t.id);
        this.addTextParticle(t.x + t.width / 2, t.y - 35, '⚡ DIRECT ZOOM PUNCH! ⚡', '#facc15');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, 'ド', '#facc15');
      }
    }

    // 2. Wind Pressure Shockwave Gust Hits (For targets outside direct punch reach!)
    for (const t of targets) {
      if (!hitDirectly.has(t.id) && this.checkCollision(windHitbox, t)) {
        this.applyHit(attacker, t, windHitbox);
        this.addTextParticle(t.x + t.width / 2, t.y - 35, '💨 AIR PRESSURE GUST! (-75 HP)', '#fde047');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, '風', '#fde047');
        this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#fde047');
        for (let s = 0; s < 5; s++) {
          this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 30, t.y + t.height / 2 + (Math.random() - 0.5) * 30, '#ffffff');
        }
      }
    }
  }

  private executeLuckPluckSlash(attacker: Fighter, target: Fighter, isFinisher: boolean = false) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const damage = isFinisher ? LUCK_PLUCK_DAMAGE * 0.6 : LUCK_PLUCK_DAMAGE * 0.35;
    const knockFwd = isFinisher ? 16 : 4;
    const knockUp = isFinisher ? 6 : 2;
    const hitbox = this.createOrientedHitbox(attacker, LUCK_PLUCK_RANGE + 20, 75, damage, knockFwd, knockUp, {
      hitStun: isFinisher ? 45 : 18,
      yOffset: 5,
    });
    this.screenShake = isFinisher ? 12 : 6;
    soundManager.playSwordSlash();
    if (isFinisher) {
      soundManager.playClashFinisher();
    }

    const cx = attacker.x + (dir === 1 ? attacker.width + 40 : -40);
    const cy = attacker.y + 25;
    this.addShockwave(cx, cy, isFinisher ? '#facc15' : '#38bdf8');

    for (let i = 0; i < (isFinisher ? 10 : 5); i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 50, cy + (Math.random() - 0.5) * 50, isFinisher ? '#facc15' : '#38bdf8');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        if (isFinisher) {
          this.addTextParticle(t.x + t.width / 2, t.y - 45, '⚔️ PLUCK & LUCK CROSS FINISH! ⚔️', '#38bdf8');
          this.addMenacingParticle(t.x + t.width / 2, t.y - 20, '斬', '#38bdf8');
        }
      }
    }
  }

  private executeSunlightYellowHit(attacker: Fighter, target: Fighter) {
    soundManager.playHamonBuzz();
    soundManager.playHit(false);
    const reach = 130;
    this.spawnOrientedBarrageArm(attacker, reach, '#facc15', '#fb923c', false);

    const hitbox = this.createOrientedHitbox(attacker, reach, 80, 14, 1.8, 0.5, {
      isBarrage: true,
      yOffset: 10,
    });

    const dir = attacker.facing === 'right' ? 1 : -1;
    const punchX = attacker.x + (dir === 1 ? attacker.width + 20 : -30);
    this.addSpark(punchX, attacker.y + 15 + Math.random() * 20, '#fde047');

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private executeSunlightYellowFinisher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    this.applyRawDamage(target, 175, dir * 20, -9);
    target.action = 'knockback';
    target.hitReactionType = 'directional_launch';
    target.hitReactionTimer = 65;
    target.hitReactionDuration = 65;
    target.isGrounded = false;
    target.hitStun = 65;
    this.screenShake = 22;
    soundManager.playOverdriveExplosion();
    soundManager.playClashFinisher();

    const hitX = target.x + target.width / 2;
    const hitY = target.y + target.height / 2;
    this.addShockwave(hitX, hitY, '#ffffff');
    this.addShockwave(hitX, hitY, '#facc15');
    this.addShockwave(hitX, hitY, '#f97316');

    for (let i = 0; i < 20; i++) {
      this.addSpark(hitX + (Math.random() - 0.5) * 80, hitY + (Math.random() - 0.5) * 80, '#facc15');
      this.addSpark(hitX + (Math.random() - 0.5) * 80, hitY + (Math.random() - 0.5) * 80, '#ffffff');
    }

    this.addTextParticle(hitX, target.y - 65, '★ SUNLIGHT YELLOW OVERDRIVE SUPERNOVA!! ★', '#facc15');
    this.addMenacingParticle(hitX, target.y - 30, 'ゴ', '#facc15');
  }

  // --- PROJECTILE SPAWNERS ---
  private executePluckThrust(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const directReach = 230;
    const directHitbox = this.createOrientedHitbox(attacker, directReach, 50, 175, 14, 3, {
      hitStun: 45,
      yOffset: 12,
    });

    // Supersonic Piercing Air Blade Hitbox (Extended range up to 540px!)
    const windReach = 540;
    const windHitbox = this.createOrientedHitbox(attacker, windReach, 75, 85, 12, 3, {
      hitStun: 26,
      yOffset: 12,
    });

    this.screenShake = 11;
    soundManager.playSwordSlash();
    soundManager.playHit(true);

    for (let i = 0; i < 9; i++) {
      this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 28 : -i * 28), attacker.y + 26, '#38bdf8');
      this.addSpark(attacker.x + (dir === 1 ? attacker.width + i * 28 : -i * 28), attacker.y + 26, '#facc15');
    }
    const tipX = attacker.x + (dir === 1 ? attacker.width + directReach : -directReach);
    this.addShockwave(tipX, attacker.y + 26, '#38bdf8');

    // Piercing wind trail sparks across the extended flight path
    for (let w = 0; w < 7; w++) {
      const wx = tipX + dir * (w * 42 + 25);
      this.addSpark(wx, attacker.y + 26 + (Math.random() - 0.5) * 25, '#38bdf8');
      this.addSpark(wx, attacker.y + 26 + (Math.random() - 0.5) * 25, '#ffffff');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    const hitDirectly = new Set<string>();

    // 1. Direct Sword Piercing Melee Hits
    for (const t of targets) {
      if (this.checkCollision(directHitbox, t)) {
        this.applyHit(attacker, t, directHitbox);
        hitDirectly.add(t.id);
        this.addTextParticle(t.x + t.width / 2, t.y - 35, '🗡️ DIRECT PLUCK PIERCED! 🗡️', '#38bdf8');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, '貫', '#38bdf8');
      }
    }

    // 2. Piercing Air Blade Shockwave Hits (For targets outside direct sword reach!)
    for (const t of targets) {
      if (!hitDirectly.has(t.id) && this.checkCollision(windHitbox, t)) {
        this.applyHit(attacker, t, windHitbox);
        this.addTextParticle(t.x + t.width / 2, t.y - 35, '🌪️ PIERCING AIR BLADE! (-85 HP)', '#38bdf8');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, '風', '#38bdf8');
        this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#38bdf8');
        for (let s = 0; s < 5; s++) {
          this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 30, t.y + t.height / 2 + (Math.random() - 0.5) * 30, '#38bdf8');
        }
      }
    }
  }

  private spawnSwordCrescentWave(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'sendo_wave',
      x: dir === 1 ? f.x + f.width : f.x - 70,
      y: f.y + 15,
      vx: dir * (SENDO_WAVE_SPEED + 3),
      vy: 0,
      baseVx: dir * (SENDO_WAVE_SPEED + 3),
      baseVy: 0,
      width: 70,
      height: 45,
      damage: SENDO_WAVE_DAMAGE + 35,
      knockbackX: dir * 13,
      knockbackY: -5,
      isFrozenInTime: false,
      life: 90,
      maxLife: 90,
      color: '#38bdf8',
    });
  }

  private spawnSendoWave(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'sendo_wave',
      x: dir === 1 ? f.x + f.width : f.x - 60,
      y: GROUND_Y - 30,
      vx: dir * SENDO_WAVE_SPEED,
      vy: 0,
      baseVx: dir * SENDO_WAVE_SPEED,
      baseVy: 0,
      width: 60,
      height: 30,
      damage: SENDO_WAVE_DAMAGE,
      knockbackX: dir * 10,
      knockbackY: -4,
      isFrozenInTime: false,
      life: 90,
      maxLife: 90,
      color: '#facc15',
    });
  }

  private spawnJosukeShard(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    f.homingShardActive = true;
    f.homingShardState = 'out';
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'josuke_shard',
      x: dir === 1 ? f.x + f.width : f.x - 35,
      y: f.y + 25,
      vx: dir * JOSUKE_HOMING_SHARD_SPEED,
      vy: 0.5, // slight arc
      baseVx: dir * JOSUKE_HOMING_SHARD_SPEED,
      baseVy: 0.5,
      width: 35,
      height: 20,
      damage: JOSUKE_HOMING_SHARD_DAMAGE,
      knockbackX: dir * 2,
      knockbackY: -2,
      isFrozenInTime: false,
      life: 80,
      maxLife: 80,
      color: '#06b6d4',
    });
  }

  private spawnJosukeBearing(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'josuke_bearing',
      x: dir === 1 ? f.x + f.width : f.x - 20,
      y: f.y + 20,
      vx: dir * JOSUKE_BEARING_SHOT_SPEED,
      vy: 0,
      baseVx: dir * JOSUKE_BEARING_SHOT_SPEED,
      baseVy: 0,
      width: 20,
      height: 10,
      damage: JOSUKE_BEARING_SHOT_DAMAGE,
      knockbackX: dir * 10,
      knockbackY: -3,
      isFrozenInTime: false,
      life: 70,
      maxLife: 70,
      color: '#06b6d4',
    });
  }

  private spawnClackerVolley(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'clacker_volley',
      x: dir === 1 ? f.x + f.width : f.x - 45,
      y: f.y + 25,
      vx: dir * 13,
      vy: 0,
      baseVx: dir * 13,
      baseVy: 0,
      width: 45,
      height: 35,
      damage: CLACKER_VOLLEY_DAMAGE,
      knockbackX: dir * 8,
      knockbackY: -3,
      isFrozenInTime: false,
      life: 75,
      maxLife: 75,
      color: '#34d399',
    });
  }

  private spawnTommyGunSingleShot(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const muzzleX = dir === 1 ? f.x + f.width + 44 : f.x - 44;
    const muzzleY = f.y + 20;

    // Fire 1-2 rapid high-velocity tracer bullets per pulse with slight realistic spread
    const numBullets = Math.random() < 0.35 ? 2 : 1;
    for (let b = 0; b < numBullets; b++) {
      const spreadY = (Math.random() - 0.5) * 14;
      const speed = 19 + Math.random() * 4;
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: f.id,
        type: 'tommy_bullet',
        x: muzzleX,
        y: muzzleY + spreadY,
        vx: dir * speed,
        vy: (Math.random() - 0.5) * 1.5,
        baseVx: dir * speed,
        baseVy: 0,
        width: 24,
        height: 8,
        damage: 18,
        knockbackX: dir * 2.8,
        knockbackY: -1,
        isFrozenInTime: false,
        life: 55,
        maxLife: 55,
        color: '#ef4444',
      });
    }

    // Muzzle sparks and ejected brass casing spark
    this.addSpark(muzzleX + dir * 6, muzzleY, '#facc15');
    this.addSpark(muzzleX + dir * 10, muzzleY + (Math.random() - 0.5) * 10, '#ffffff');
    this.addSpark(muzzleX - dir * 18, muzzleY - 8, '#fef08a'); // Ejected shell casing spark

    // Screen vibration & sound
    this.screenShake = Math.max(this.screenShake, 2.8);
    if ((f.actionTimer || 0) % 4 === 0) {
      soundManager.playTommyGun();
    }

    if (Math.random() < 0.2) {
      this.addMenacingParticle(muzzleX + dir * 25, muzzleY - 15, 'ダッ!', '#facc15');
    }
  }

  private spawnHermitVineGrab(f: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    this.projectiles.push({
      id: this.projectileId++,
      ownerId: f.id,
      type: 'hermit_vine_grab',
      x: dir === 1 ? f.x + f.width : f.x - 115,
      y: f.y + 16,
      vx: dir * 18,
      vy: 0,
      baseVx: dir * 18,
      baseVy: 0,
      width: 115,
      height: 46,
      damage: HERMIT_GRAPPLE_DAMAGE,
      knockbackX: -dir * 14,
      knockbackY: -4,
      isFrozenInTime: false,
      life: 48,
      maxLife: 48,
      color: '#c084fc',
    });
  }

  // --- YOUNG JOSEPH EXECUTION METHODS ---
  private executeHamonElbow(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 160;
    const damage = 195;
    const hitbox = this.createOrientedHitbox(attacker, reach, 75, damage, 16, 6, {
      hitStun: 55,
      yOffset: 6,
    });

    this.screenShake = 22;
    soundManager.playHamonBuzz();
    soundManager.playOverdriveExplosion();
    soundManager.playHit(true);

    const hitX = attacker.x + (dir === 1 ? attacker.width + 45 : -45);
    const hitY = attacker.y + 25;
    this.addShockwave(hitX, hitY, '#34d399');
    this.addShockwave(hitX, hitY, '#ef4444');

    // Explosive tripwire cluster grenade burst sparks
    for (let i = 0; i < 22; i++) {
      this.addSpark(hitX + (Math.random() - 0.5) * 80, hitY + (Math.random() - 0.5) * 60, '#facc15');
      this.addSpark(hitX + (Math.random() - 0.5) * 80, hitY + (Math.random() - 0.5) * 60, '#ef4444');
      this.addSpark(hitX + (Math.random() - 0.5) * 80, hitY + (Math.random() - 0.5) * 60, '#34d399');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        t.action = 'knockback';
        t.hitReactionType = 'radial_explosion';
        t.hitReactionTimer = 55;
        t.hitReactionDuration = 55;
        t.isGrounded = false;
        t.hitStun = 55;
        this.addTextParticle(t.x + t.width / 2, t.y - 45, '💣 GRENADE CLUSTER DETONATION! (-195 HP) 💥', '#ef4444');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, '爆', '#ef4444');
      }
    }
  }

  private executeClackerBoomerang(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const hitbox = this.createOrientedHitbox(attacker, attacker.width + 95, 75, 195, 12, 7, {
      hitStun: 38,
      yOffset: -10,
    });
    this.screenShake = 16;
    soundManager.playClackerRattle();
    soundManager.playClashFinisher();

    const cx = attacker.x + (dir === 1 ? attacker.width + 45 : -45);
    const cy = attacker.y + 30;
    this.addShockwave(cx, cy, '#34d399');
    this.addShockwave(cx, cy, '#facc15');

    for (let i = 0; i < 14; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60, '#34d399');
      this.addSpark(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60, '#fef08a');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        this.addTextParticle(t.x + t.width / 2, t.y - 45, '⚡ CLACKER OVERDRIVE SMASH!! ⚡', '#34d399');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 20, '撃', '#facc15');
      }
    }
  }

  private executeBiplaneCrash(attacker: Fighter, target: Fighter) {
    const arenaW = this.getArenaWidth();
    const escapeDir = attacker.youngJosephUltEscapeDir || (attacker.facing === 'right' ? 1 : -1);
    const flightDir = escapeDir === 1 ? -1 : 1; // Direction plane was diving towards
    const crashX = target ? target.x + target.width / 2 : arenaW / 2;
    const crashY = GROUND_Y - 20;

    // 1. Catastrophic Impact Screen Shake & Explosive Audio
    this.screenShake = 160;
    soundManager.playCarCrash();
    soundManager.playOverdriveExplosion();
    soundManager.playClashFinisher();

    // 2. Heavy Fire Shockwaves & Erupting Sparks
    for (let s = 0; s < 7; s++) {
      this.addShockwave(crashX, crashY, s % 2 === 0 ? '#ef4444' : '#facc15');
    }
    for (let i = 0; i < 45; i++) {
      this.addSpark(crashX + (Math.random() - 0.5) * 160, crashY - (Math.random() * 90), '#facc15');
      this.addSpark(crashX + (Math.random() - 0.5) * 160, crashY - (Math.random() * 90), '#ef4444');
      this.addSpark(crashX + (Math.random() - 0.5) * 160, crashY - (Math.random() * 90), '#ffffff');
    }

    // 3. Joseph Ejected High out of Cockpit, leaping through the air over the blast in flight direction!
    attacker.x = Math.max(30, Math.min(arenaW - 80, crashX + flightDir * 40));
    attacker.y = GROUND_Y - attacker.height - 140; // High aloft over explosion!
    attacker.vx = flightDir * 8;
    attacker.vy = -12; // High jump arc momentum
    attacker.facing = flightDir === 1 ? 'right' : 'left';
    attacker.isGrounded = false;
    attacker.invulnerableTimer = 60;

    // Joseph takes slight self-recoil damage (~15 HP, leaving min 1 HP)
    if (attacker.hp > 15) {
      attacker.hp -= 15;
    } else if (attacker.hp > 1) {
      attacker.hp = 1;
    }

    // 4. All nearby opponents take ENORMOUS CATASTROPHIC DAMAGE (~380 HP) and MASSIVE EXPLOSIVE KNOCKBACK
    const targets = this.getTargetsForAttacker(attacker, target);
    let hitAny = false;
    for (const t of targets) {
      const distToBlast = Math.abs((t.x + t.width / 2) - crashX);
      if (distToBlast < 550) { // Large explosive blast radius
        hitAny = true;
        const blastDir = (t.x + t.width / 2) >= crashX ? 1 : -1;
        // Scale damage based on proximity to epicenter
        const proximityFactor = Math.max(0.5, 1.0 - distToBlast / 550);
        const blastDamage = Math.round(380 * proximityFactor);
        const knockX = blastDir * Math.round(42 * proximityFactor); // High horizontal fling speed across arena!
        const knockY = -Math.round(18 * proximityFactor); // High skyward launch arc!

        this.applyRawDamage(t, blastDamage, knockX, knockY, attacker);
        t.action = 'knockback';
        t.hitReactionType = 'directional_launch';
        t.hitReactionTimer = Math.round(95 * proximityFactor);
        t.hitReactionDuration = 95;
        t.hitStun = Math.round(95 * proximityFactor);
        t.isGrounded = false;
        t.y = Math.min(t.y, GROUND_Y - t.height - 35); // Immediately lift airborne off ground!
        t.burnedTimer = 180; // Catch fire from plane crash explosion!
        t.actionTimer = 0;
        t.actionDuration = 0;

        this.addTextParticle(t.x + t.width / 2, t.y - 45, '🔥 BIPLANE EXPLOSION CATASTROPHIC BLAST! 💥', '#ef4444');
      }
    }

    // Fallback: If no opponents were in target list (e.g. survival mode transition or single-player dead-state issues), force target to take damage
    if (!hitAny && target && target.hp > 0) {
      this.applyRawDamage(target, 380, flightDir * 42, -18, attacker);
      target.action = 'knockback';
      target.hitReactionType = 'directional_launch';
      target.hitReactionTimer = 95;
      target.hitReactionDuration = 95;
      target.hitStun = 95;
      target.isGrounded = false;
      target.y = Math.min(target.y, GROUND_Y - target.height - 35);
      target.burnedTimer = 180;
      target.actionTimer = 0;
      target.actionDuration = 0;
    }

    // 5. Manga & Text Particles
    this.addTextParticle(crashX, crashY - 90, '💥 BIPLANE CATASTROPHIC COLLISION!! (-380 HP) 💥', '#ef4444');
    this.addMenacingParticle(crashX, crashY - 45, 'ドゴォォン!!', '#facc15');

    // 6. Scatter Biplane Wreckage Debris across the ground
    const subTypes: Array<'plane_door' | 'billboard' | 'pot' | 'pole'> = ['plane_door', 'billboard', 'pot', 'pole'];
    for (let d = 0; d < 8; d++) {
      const dbx = crashX + (Math.random() - 0.5) * 180;
      const dby = crashY - 20 - Math.random() * 40;
      const dvx = (Math.random() - 0.5) * 12;
      const dvy = -4 - Math.random() * 6;
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: attacker.id,
        type: 'calamity_debris',
        subType: subTypes[d % subTypes.length],
        x: dbx,
        y: dby,
        vx: dvx,
        vy: dvy,
        baseVx: dvx,
        baseVy: dvy,
        width: 42 + Math.random() * 18,
        height: 24 + Math.random() * 12,
        damage: 0,
        knockbackX: 0,
        knockbackY: 0,
        isFrozenInTime: false,
        life: 180, // 3 seconds total
        maxLife: 180,
        color: '#facc15',
        rotation: Math.random() * Math.PI * 2,
      });
    }
  }

  // --- OLD JOSEPH EXECUTION METHODS ---
  private executeSpiritPhotoScan(attacker: Fighter, target: Fighter) {
    soundManager.playSpiritPhotoFlash();
    soundManager.playHamonBuzz();
    this.screenShake = 12;

    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + 24;
    this.addShockwave(cx, cy, '#ffffff');
    this.addShockwave(cx, cy, '#e879f9');

    for (let i = 0; i < 12; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 70, cy + (Math.random() - 0.5) * 50, i % 2 === 0 ? '#e879f9' : '#fef08a');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      const dist = Math.abs((t.x + t.width / 2) - cx);
      if (dist < 460) {
        const dir = attacker.facing === 'right' ? 1 : -1;
        this.applyRawDamage(t, 45, dir * 3, -2, attacker);
        t.isCrouching = false; // Guard Break via psychic exposure!
        t.blindedTimer = Math.max(t.blindedTimer || 0, 150);
        t.hitStun = Math.max(t.hitStun, 42);
        t.action = 'hit';
        t.hitReactionType = 'electric_shock';
        t.hitReactionTimer = 42;
        t.hitReactionDuration = 42;

        const tx = t.x + t.width / 2;
        const ty = t.y + t.height / 2;
        this.addShockwave(tx, ty, '#e879f9');
        this.addShockwave(tx, ty, '#facc15');
        this.addTextParticle(tx, t.y - 45, '📸 SPIRIT PHOTO: WEAKNESS EXPOSED & BLINDED!', '#e879f9');
        this.addMenacingParticle(tx, t.y - 15, 'パシャァ!!', '#fef08a');
      }
    }
  }

  private executeHermitTrap(attacker: Fighter, target: Fighter, isSecondPulse: boolean = false) {
    const damage = isSecondPulse ? Math.round(HERMIT_TRAP_DAMAGE * 0.65) : HERMIT_TRAP_DAMAGE;
    const hitbox = this.createOrientedHitbox(attacker, 260, 65, damage, 0, 0, {
      hitStun: 60,
      yOffset: 10,
      reactionType: 'electric_shock',
    });
    this.screenShake = isSecondPulse ? 11 : 8;
    soundManager.playHamonBuzz();
    const dir = attacker.facing === 'right' ? 1 : -1;
    const cx = attacker.x + attacker.width / 2 + dir * 110;
    const cy = GROUND_Y - 12;
    this.addShockwave(cx, cy, '#c084fc');
    this.addShockwave(cx, cy, '#facc15');
    for (let i = 0; i < 14; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 180, cy - Math.random() * 35, i % 2 === 0 ? '#c084fc' : '#facc15');
    }
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        t.vx = 0;
        t.vy = 0;
        t.hitStun = Math.max(t.hitStun, 60);
        t.hitReactionType = 'electric_shock';
        t.hitReactionTimer = 60;
        t.hitReactionDuration = 60;
        this.addTextParticle(t.x + t.width / 2, t.y - 40, isSecondPulse ? '⚡ HAMON NET VOLTAGE SURGE!' : '🕸️⚡ 20m HERMIT VINE BOUND!', '#c084fc');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, 'バチィ!!', '#facc15');
      }
    }
  }

  private executeOverdriveTacticsWhip(attacker: Fighter, target: Fighter, stage: number = 1) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = stage === 1 ? 220 : 250;
    const dmg = stage === 1 ? Math.round(OVERDRIVE_TACTICS_DAMAGE * 0.55) : OVERDRIVE_TACTICS_DAMAGE;
    const knockX = stage === 1 ? -dir * 4 : dir * 15;
    const knockY = stage === 1 ? -3 : -9;
    const hitbox = this.createOrientedHitbox(attacker, reach, 85, dmg, knockX, knockY, {
      hitStun: stage === 1 ? 30 : 48,
      yOffset: -8,
      reactionType: stage === 1 ? 'electric_shock' : 'directional_launch',
    });
    this.screenShake = stage === 1 ? 8 : 15;
    soundManager.playHermitVineWhip();
    soundManager.playHamonBuzz();

    const tipX = attacker.x + attacker.width / 2 + dir * (reach * 0.75);
    const tipY = attacker.y + 25;
    this.addShockwave(tipX, tipY, stage === 1 ? '#c084fc' : '#facc15');
    for (let i = 0; i < 14; i++) {
      this.addSpark(tipX + (Math.random() - 0.5) * 90, tipY + (Math.random() - 0.5) * 60, i % 2 === 0 ? '#facc15' : '#e879f9');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        if (stage === 2) {
          t.burnedTimer = Math.max(t.burnedTimer || 0, 120);
          this.addTextParticle(t.x + t.width / 2, t.y - 45, '🌹⚡ SUNBURST ROSE THORN OVERDRIVE!!', '#facc15');
          this.addMenacingParticle(t.x + t.width / 2, t.y - 15, '波紋疾走!!', '#facc15');
        } else {
          this.addTextParticle(t.x + t.width / 2, t.y - 35, '🌿 THORNY VINE LASH!', '#c084fc');
        }
      }
    }
  }

  private executeCameraSmash(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const hitbox = this.createOrientedHitbox(attacker, 135, 70, 175, 12, -6, {
      isGuardBreak: true,
      hitStun: 52,
      yOffset: 4,
      reactionType: 'heavy_stagger',
    });
    this.screenShake = 14;
    soundManager.playSpiritPhotoFlash();
    soundManager.playHeavyImpact();

    const hitX = attacker.x + attacker.width / 2 + dir * 65;
    const hitY = attacker.y + 25;
    this.addShockwave(hitX, hitY, '#ffffff');
    this.addShockwave(hitX, hitY, '#c084fc');
    for (let i = 0; i < 16; i++) {
      this.addSpark(hitX + (Math.random() - 0.5) * 60, hitY + (Math.random() - 0.5) * 50, i % 2 === 0 ? '#ffffff' : '#facc15');
    }

    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        t.blindedTimer = Math.max(t.blindedTimer || 0, 180);
        this.addTextParticle(t.x + t.width / 2, t.y - 45, '📸🦾 PROSTHETIC POLAROID SMASH! (GUARD BREAK)', '#e2e8f0');
        this.addMenacingParticle(t.x + t.width / 2, t.y - 15, 'ガシャァン!!', '#facc15');
      }
    }
  }

  private executeHermitUltimateSnare(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const cx = attacker.x + attacker.width / 2;
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      const dist = Math.abs((t.x + t.width / 2) - cx);
      if (dist < 520) {
        const idealX = Math.max(60, Math.min(this.getArenaWidth() - 100, cx + dir * 145));
        t.x += (idealX - t.x) * 0.45;
        t.y = GROUND_Y - t.height;
        t.vx = 0;
        t.vy = 0;
        t.isCrouching = false;
        t.action = 'hit';
        t.hitReactionType = 'electric_shock';
        t.hitReactionTimer = 30;
        t.hitReactionDuration = 30;
        t.hitStun = 30;
        this.applyRawDamage(t, 18, 0, 0, attacker);
        this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#c084fc');
        this.addTextParticle(t.x + t.width / 2, t.y - 45, '🕸️🌿 HERMIT PURPLE: FULL ARENA VINE SNARE!!', '#c084fc');
      }
    }
  }

  private executeHermitSurgeHit(attacker: Fighter, target: Fighter) {
    soundManager.playHamonBuzz();
    const dir = attacker.facing === 'right' ? 1 : -1;
    const cx = attacker.x + attacker.width / 2;
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      const dist = Math.abs((t.x + t.width / 2) - cx);
      if (dist < 480) {
        const idealX = Math.max(60, Math.min(this.getArenaWidth() - 100, cx + dir * 135));
        t.x += (idealX - t.x) * 0.25;
        t.vx = 0;
        t.vy = 0;
        t.action = 'hit';
        t.hitReactionType = 'electric_shock';
        t.hitReactionTimer = 20;
        t.hitReactionDuration = 20;
        t.hitStun = 20;
        this.applyRawDamage(t, 22, 0, 0, attacker);
        this.screenShake = Math.max(this.screenShake, 8);
        const tx = t.x + t.width / 2;
        const ty = t.y + t.height / 2;
        this.addSpark(tx + (Math.random() - 0.5) * 45, ty + (Math.random() - 0.5) * 55, '#c084fc');
        this.addSpark(tx + (Math.random() - 0.5) * 45, ty + (Math.random() - 0.5) * 55, '#facc15');
        if ((attacker.actionTimer || 0) % 18 === 0) {
          this.addShockwave(tx, ty, '#facc15');
          this.addMenacingParticle(tx + (Math.random() - 0.5) * 40, t.y - 15, 'バチィィ!!', '#facc15');
        }
      }
    }
  }

  private executeHermitSurgeFinisher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const cx = attacker.x + attacker.width / 2;
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      const dist = Math.abs((t.x + t.width / 2) - cx);
      if (dist < 520) {
        this.applyRawDamage(t, 210, dir * 22, -13, attacker);
        t.action = 'knockback';
        t.hitReactionType = 'directional_launch';
        t.hitReactionTimer = 70;
        t.hitReactionDuration = 70;
        t.isGrounded = false;
        t.hitStun = 70;
        t.burnedTimer = 240;
        const tx = t.x + t.width / 2;
        const ty = t.y + t.height / 2;
        this.addShockwave(tx, ty, '#c084fc');
        this.addShockwave(tx, ty, '#facc15');
        this.addShockwave(tx, ty, '#ffffff');
        for (let i = 0; i < 24; i++) {
          this.addSpark(tx + (Math.random() - 0.5) * 110, ty + (Math.random() - 0.5) * 90, i % 2 === 0 ? '#facc15' : '#c084fc');
        }
        this.addTextParticle(tx, t.y - 60, '☀️⚡ SUNLIGHT YELLOW OVERDRIVE DETONATION!! (-210 HP)', '#facc15');
        this.addMenacingParticle(tx, t.y - 25, 'ドゴォォン!!', '#c084fc');
      }
    }
    this.screenShake = 28;
    soundManager.playOverdriveExplosion();
    soundManager.playClashFinisher();
  }

  // --- DIAVOLO EXECUTION METHODS ---
  private triggerEpitaphCounter(diavolo: Fighter, attacker: Fighter) {
    diavolo.isEpitaphActive = false;
    diavolo.epitaphTimer = 0;
    diavolo.isStandActive = true;
    diavolo.standAlpha = 1.0;

    // Leave crimson forecast hologram at Diavolo's original position
    if (!diavolo.afterimages) diavolo.afterimages = [];
    diavolo.afterimages.push({
      x: diavolo.x,
      y: diavolo.y,
      alpha: 1.0,
      facing: diavolo.facing,
      charId: 'king_crimson',
      color: 'rgba(244, 63, 94, 0.92)',
    });
    this.addShockwave(diavolo.x + diavolo.width / 2, diavolo.y + diavolo.height / 2, '#fb7185');

    // Time-skip directly behind the attacker
    let behindX = attacker.facing === 'right' ? attacker.x - 62 : attacker.x + attacker.width + 22;
    if (behindX < 40 || behindX > this.getArenaWidth() - 80) {
      behindX = attacker.facing === 'right' ? attacker.x + attacker.width + 55 : attacker.x - 55;
    }
    diavolo.x = Math.max(40, Math.min(this.getArenaWidth() - 80, behindX));
    diavolo.y = attacker.y;
    diavolo.vx = 0;
    diavolo.vy = 0;
    diavolo.facing = attacker.x >= diavolo.x ? 'right' : 'left';
    diavolo.invulnerableTimer = 28;
    diavolo.action = 'epitaph_counter_slash';
    diavolo.actionTimer = 22;
    diavolo.actionDuration = 22;

    soundManager.playPoseSound('king_crimson');
    this.screenShake = Math.max(this.screenShake, 12);
    this.addShockwave(diavolo.x + diavolo.width / 2, diavolo.y + diavolo.height / 2, '#e11d48');
    this.addTextParticle(diavolo.x + diavolo.width / 2, diavolo.y - 50, '🔮 EPITAPH FORESAW THIS!! (FATE SKIP COUNTER!)', '#fb7185');
    this.addMenacingParticle(diavolo.x + diavolo.width / 2, diavolo.y - 20, '結果だけだ!!', '#e11d48');
  }

  private executeEpitaphCounterSlash(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 145;
    const hitbox = this.createOrientedHitbox(attacker, reach, 75, EPITAPH_COUNTER_DAMAGE, 20, -6, {
      hitStun: 44,
      yOffset: 6,
    });
    this.screenShake = Math.max(this.screenShake, 16);
    soundManager.playSwordSlash();
    soundManager.playHit(true);
    const cx = attacker.x + attacker.width / 2 + dir * 48;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#e11d48');
    this.addShockwave(cx, cy, '#fb7185');
    for (let i = 0; i < 18; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 70, cy + (Math.random() - 0.5) * 55, i % 2 === 0 ? '#e11d48' : '#fda4af');
    }
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t) || Math.abs((attacker.x + attacker.width / 2) - (t.x + t.width / 2)) < 155) {
        t.isBlocking = false;
        this.applyRawDamage(t, EPITAPH_COUNTER_DAMAGE, dir * 20, -6.5, attacker);
        t.hitStun = 44;
        this.addTextParticle(t.x + t.width / 2, t.y - 40, '🩸 EPITAPH FATE SEVER!! (-195 HP)', '#e11d48');
      }
    }
  }

  private executeCrimsonCleave(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 155;
    const hitbox = this.createOrientedHitbox(attacker, reach, 80, CRIMSON_CLEAVE_DAMAGE, 22, -5.5, {
      hitStun: 42,
      yOffset: 4,
    });
    this.screenShake = Math.max(this.screenShake, 16);
    soundManager.playSwordSlash();
    soundManager.playHit(true);
    const cx = attacker.x + attacker.width / 2 + dir * 58;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#e11d48');
    this.addShockwave(cx + dir * 25, cy, '#fb7185');
    for (let i = 0; i < 22; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 95, cy + (Math.random() - 0.5) * 70, i % 2 === 0 ? '#f43f5e' : '#881337');
    }
    this.addTextParticle(cx, attacker.y - 38, '⚔️ CRIMSON X-SCYTHE CLEAVE!!', '#fb7185');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        if (t.isBlocking) {
          t.isBlocking = false;
          t.guardBreakTimer = 35;
          this.addTextParticle(t.x + t.width / 2, t.y - 45, '💥 GUARD TORN BY KING CRIMSON!', '#e11d48');
        }
        this.applyHit(attacker, t, hitbox);
        for (let j = 0; j < 14; j++) {
          this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 45, t.y + t.height / 2 + (Math.random() - 0.5) * 45, '#dc2626');
        }
      }
    }
  }

  private executeFateCrusher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 150;
    attacker.vy = Math.max(attacker.vy, 10);
    const hitbox = this.createOrientedHitbox(attacker, reach, 90, FATE_CRUSHER_DAMAGE, 16, -11, {
      hitStun: 48,
      yOffset: 0,
    });
    this.screenShake = Math.max(this.screenShake, 22);
    soundManager.playHeavyImpact();
    soundManager.playHit(true);
    const slamX = attacker.x + attacker.width / 2 + dir * 52;
    const slamY = GROUND_Y - 12;
    this.addShockwave(slamX, slamY, '#e11d48');
    this.addShockwave(slamX, slamY, '#fda4af');
    for (let i = 0; i < 26; i++) {
      this.addSpark(slamX + (Math.random() - 0.5) * 140, slamY - Math.random() * 55, i % 2 === 0 ? '#e11d48' : '#fb7185');
    }
    this.addTextParticle(slamX, attacker.y - 45, '💥 FATE CRUSHER GROUND RUPTURE!!', '#e11d48');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        t.isBlocking = false; // Overhead slam crushes guard
        this.applyHit(attacker, t, hitbox);
        t.vy = -10.5; // Ground bounce launch
        t.isGrounded = false;
        this.addTextParticle(t.x + t.width / 2, t.y - 50, '💀 OVERHEAD FATE CRUSH!', '#fb7185');
      }
    }
  }

  private executeDonutStrike(attacker: Fighter, target: Fighter) {
    const reach = 125;
    const hitbox = this.createOrientedHitbox(attacker, reach, 65, DONUT_STRIKE_DAMAGE, 18, 5, {
      hitStun: 40,
      yOffset: 10,
    });
    this.screenShake = 10;
    soundManager.playHit(true);
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#fb7185');
    this.addTextParticle(cx, attacker.y - 35, '🩸 LETHAL DONUT CHOP!', '#fb7185');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        if (!t.isTimeEraseActive && !t.isEpitaphActive && t.hp > 0) {
          // Impale/Grab mechanism:
          t.action = 'grabbed';
          t.vx = 0;
          t.vy = 0;
          t.hitStun = 45;
          attacker.grabbedTarget = t.id;
          t.x = attacker.x + (attacker.facing === 'right' ? 65 : -t.width - 65);
          t.y = attacker.y;
        }
      }
    }
  }

  private executeDonutThrow(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    target.action = 'knockback';
    target.vx = dir * 26; // Fly backward far away!
    target.vy = -9;       // Lifted high in the air!
    target.hitStun = 45;
    target.isGrounded = false;
    attacker.grabbedTarget = null;

    this.screenShake = 14;
    this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#e11d48');
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 50, '💀 DONUT SHATTER THROW!', '#e11d48');
    soundManager.playHit(true);
  }

  private executeFleshThrow(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const spawnX = dir === 1 ? attacker.x + attacker.width - 5 : attacker.x - 35;
    const spawnY = attacker.y + 16;

    // Close-range arterial blood splash check so point-blank enemies get blinded immediately
    const splashHitbox = this.createOrientedHitbox(attacker, 95, 55, FLESH_THROW_DAMAGE, 6, -2, {
      hitStun: 38,
      yOffset: 6,
    });
    const targets = this.getTargetsForAttacker(attacker, target);
    let hitPointBlank = false;
    for (const t of targets) {
      if (this.checkCollision(splashHitbox, t)) {
        hitPointBlank = true;
        this.applyHit(attacker, t, splashHitbox);
        t.blindedTimer = FLESH_THROW_BLIND_DURATION;
        t.bloodBlindedTimer = FLESH_THROW_BLIND_DURATION;
        t.hitStun = Math.max(t.hitStun, 38);
        this.addTextParticle(t.x + t.width / 2, t.y - 38, '🩸 EYES SPLASHED WITH DARK BLOOD! (BLINDED)', '#991b1b');
        for (let i = 0; i < 18; i++) {
          this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 32, t.y + 18 + (Math.random() - 0.5) * 18, i % 2 === 0 ? '#450a0a' : '#991b1b');
        }
      }
    }

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'blood_blind',
      x: spawnX,
      y: spawnY,
      vx: dir * 19,
      vy: -0.4,
      baseVx: dir * 19,
      baseVy: -0.4,
      width: 44,
      height: 28,
      damage: hitPointBlank ? 0 : FLESH_THROW_DAMAGE,
      knockbackX: dir * 6,
      knockbackY: -2,
      isFrozenInTime: false,
      life: 90,
      maxLife: 90,
      color: '#7f1d1d',
    });

    for (let i = 0; i < 16; i++) {
      this.addSpark(spawnX + 15 + (Math.random() - 0.5) * 30, spawnY + 10 + (Math.random() - 0.5) * 24, i % 2 === 0 ? '#450a0a' : '#dc2626');
    }
    soundManager.playHit(false);
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 35, '🩸 ARTERIAL BLOOD CRESCENT!', '#991b1b');
  }

  private executeDonutStrikeAmbush(attacker: Fighter, target: Fighter) {
    const reach = 135;
    const hitbox = this.createOrientedHitbox(attacker, reach, 70, TIME_ERASE_AMBUSH_DAMAGE, 20, 7, {
      hitStun: 50,
      yOffset: 10,
    });
    this.screenShake = 15;
    soundManager.playHit(true);
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#e11d48');
    this.addTextParticle(cx, attacker.y - 45, '👑 KING CRIMSON: DONUT AMBUSH!!', '#e11d48');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        if (!t.isTimeEraseActive && !t.isEpitaphActive && t.hp > 0) {
          // Impale/Grab mechanism:
          t.action = 'grabbed';
          t.vx = 0;
          t.vy = 0;
          t.hitStun = 45;
          attacker.grabbedTarget = t.id;
          t.x = attacker.x + (attacker.facing === 'right' ? 65 : -t.width - 65);
          t.y = attacker.y;
        }
      }
    }
  }

  // --- VINEGAR DOPPIO EXECUTION METHODS (3-CALL PROGRESSION & RISOTTO FIGHT ARSENAL) ---
  private startDoppioCallBoss(f: Fighter, callNumber: 1 | 2 | 3) {
    const props: Array<'frog' | 'ice_cream' | 'toy_phone' | 'shoe' | 'banana'> = [
      'frog',
      'ice_cream',
      'toy_phone',
      'shoe',
      'banana',
    ];
    // Favor the iconic green frog on Call #1, then cycle/randomize hilarious anime objects!
    f.doppioPhoneProp = callNumber === 1 ? 'frog' : props[Math.floor(Math.random() * props.length)];
    f.doppioCallResult = 'ringing';
    f.action = 'doppio_call_boss';
    f.actionTimer = DOPPIO_CALL_DURATION;
    f.actionDuration = DOPPIO_CALL_DURATION;
    f.vx *= 0.35;

    // Put a brief universal cooldown on call buttons so the call animation plays out cleanly
    f.cooldowns.skill5 = DOPPIO_CALL_COOLDOWN;
    if ((f.doppioStage ?? 0) === 0) {
      f.cooldowns.skill1 = DOPPIO_CALL_COOLDOWN;
      f.cooldowns.skill2 = DOPPIO_CALL_COOLDOWN;
      f.cooldowns.skill3 = DOPPIO_CALL_COOLDOWN;
      f.cooldowns.skill4 = DOPPIO_CALL_COOLDOWN;
    } else if (f.doppioStage === 1) {
      f.cooldowns.skill2 = DOPPIO_CALL_COOLDOWN;
      f.cooldowns.skill3 = DOPPIO_CALL_COOLDOWN;
      f.cooldowns.skill4 = DOPPIO_CALL_COOLDOWN;
    }

    soundManager.playDoppioRing();
    const propLabel =
      f.doppioPhoneProp === 'frog' ? '🐸 FROG PHONE'
      : f.doppioPhoneProp === 'ice_cream' ? '🍦 ICE CREAM CONE PHONE'
      : f.doppioPhoneProp === 'toy_phone' ? '☎️ TOY PHONE'
      : f.doppioPhoneProp === 'banana' ? '🍌 BANANA PHONE'
      : '👞 SHOE PHONE';
    this.addTextParticle(
      f.x + f.width / 2,
      f.y - 45,
      `📞 TURURURURU!! (${propLabel} - CALLING BOSS #${callNumber}: 50/50 CHANCE!)`,
      '#f472b6'
    );
    this.addMenacingParticle(f.x + f.width / 2, f.y - 18, 'トゥルルルル!!', '#f472b6');
  }

  private executeDoppioScalpelThrow(attacker: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const spawnX = dir === 1 ? attacker.x + attacker.width + 6 : attacker.x - 34;
    const baseY = attacker.y + 14;

    // Throw a rapid fan of 4 razor-sharp metallic scalpels (from the Risotto Nero fight)
    const vyOffsets = [-2.2, -0.7, 0.7, 2.2];
    for (let i = 0; i < vyOffsets.length; i++) {
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: attacker.id,
        type: 'doppio_scalpel',
        x: spawnX + dir * (i * 8),
        y: baseY + i * 6,
        vx: dir * (22 + i * 1.2),
        vy: vyOffsets[i],
        baseVx: dir * (22 + i * 1.2),
        baseVy: vyOffsets[i],
        width: 34,
        height: 12,
        damage: Math.round(DOPPIO_SCALPEL_DAMAGE / 2.2),
        knockbackX: dir * 7,
        knockbackY: -2.5,
        isFrozenInTime: false,
        life: 65,
        maxLife: 65,
        color: '#e2e8f0',
      });
    }

    soundManager.playRazorCut();
    this.screenShake = Math.max(this.screenShake, 6);
    for (let s = 0; s < 10; s++) {
      this.addSpark(spawnX + dir * 10, baseY + 10 + (Math.random() - 0.5) * 20, s % 2 === 0 ? '#e2e8f0' : '#f43f5e');
    }
  }

  private executeDoppioTwinArmsHit(attacker: Fighter, target: Fighter) {
    const reach = 130;
    soundManager.playHit(false);
    this.spawnOrientedBarrageArm(attacker, reach, '#e11d48', '#fda4af', false);
    const hitbox = this.createOrientedHitbox(attacker, reach, 70, DOPPIO_TWIN_ARMS_DAMAGE_PER_HIT, 4.5, 1.5, {
      hitStun: 24,
      isBarrage: true,
      yOffset: 6,
    });
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
        this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 30, t.y + 25 + (Math.random() - 0.5) * 30, '#e11d48');
      }
    }
  }

  private executeDoppioTwinArmsFinisher(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 145;
    const hitbox = this.createOrientedHitbox(attacker, reach, 80, 85, 18, -9, {
      hitStun: 44,
      isGuardBreak: true,
      yOffset: 0,
      reactionType: 'directional_launch',
    });
    soundManager.playHeavyImpact();
    soundManager.playHit(true);
    this.screenShake = Math.max(this.screenShake, 16);
    const cx = attacker.x + attacker.width / 2 + dir * 55;
    const cy = attacker.y + 28;
    this.addShockwave(cx, cy, '#e11d48');
    this.addShockwave(cx, cy, '#fb7185');
    this.addTextParticle(cx, attacker.y - 42, '🦾💥 TWIN KING CRIMSON ARMS CRUSH!!', '#e11d48');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private executeDoppioScissorsRiposte(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = 145;
    const hitbox = this.createOrientedHitbox(attacker, reach, 78, DOPPIO_SCISSORS_DAMAGE, 16, -6, {
      hitStun: 46,
      isGuardBreak: true,
      yOffset: 4,
    });
    soundManager.playRazorCut();
    soundManager.playSwordSlash();
    soundManager.playHit(true);
    this.screenShake = Math.max(this.screenShake, 16);
    const cx = attacker.x + attacker.width / 2 + dir * 56;
    const cy = attacker.y + 26;
    this.addShockwave(cx, cy, '#dc2626');
    this.addShockwave(cx, cy, '#e2e8f0');
    for (let i = 0; i < 20; i++) {
      this.addSpark(cx + (Math.random() - 0.5) * 75, cy + (Math.random() - 0.5) * 55, i % 2 === 0 ? '#7f1d1d' : '#e2e8f0');
    }
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        t.isBlocking = false;
        this.applyHit(attacker, t, hitbox);
        t.bleedTimer = Math.max(t.bleedTimer || 0, 210);
        t.blindedTimer = Math.max(t.blindedTimer || 0, 135);
        t.bloodBlindedTimer = Math.max(t.bloodBlindedTimer || 0, 135);
        this.addTextParticle(t.x + t.width / 2, t.y - 45, '✂️🩸 THROAT SCISSORS SEVER! (BLEED + BLOOD BLIND!)', '#dc2626');
      }
    }
  }

  private executeDoppioAerosmithBarrage(attacker: Fighter, target: Fighter, isFinalBomb: boolean) {
    const targets = this.getTargetsForAttacker(attacker, target);
    const primary = targets[0] || target;
    if (!primary) return;

    const strikeX = primary.x + primary.width / 2 + (Math.random() - 0.5) * 50;
    const strikeY = primary.y + primary.height / 2;

    if (isFinalBomb) {
      soundManager.playOverdriveExplosion();
      soundManager.playHeavyImpact();
      this.screenShake = 22;
      this.addShockwave(strikeX, strikeY, '#facc15');
      this.addShockwave(strikeX, strikeY, '#ef4444');
      for (let i = 0; i < 24; i++) {
        this.addSpark(strikeX + (Math.random() - 0.5) * 110, strikeY + (Math.random() - 0.5) * 90, i % 2 === 0 ? '#facc15' : '#ef4444');
      }
      this.addTextParticle(strikeX, primary.y - 55, '✈️💣 VOLARE VIA!! AEROSMITH BOMB DETONATION!!', '#facc15');
      for (const t of targets) {
        if (Math.abs((t.x + t.width / 2) - strikeX) < 180) {
          const knockDir = t.x >= attacker.x ? 1 : -1;
          this.applyRawDamage(t, 115, knockDir * 20, -11, attacker);
          t.action = 'knockback';
          t.hitStun = 52;
          t.isGrounded = false;
          t.burnedTimer = Math.max(t.burnedTimer || 0, 150);
        }
      }
    } else {
      soundManager.playTommyGun();
      this.screenShake = Math.max(this.screenShake, 8);
      this.addShockwave(strikeX, strikeY, '#a855f7');
      for (let i = 0; i < 10; i++) {
        this.addSpark(strikeX + (Math.random() - 0.5) * 60, strikeY + (Math.random() - 0.5) * 60, i % 2 === 0 ? '#facc15' : '#e879f9');
      }
      for (const t of targets) {
        if (Math.abs((t.x + t.width / 2) - strikeX) < 140) {
          const knockDir = t.x >= attacker.x ? 1 : -1;
          this.applyRawDamage(t, 24, knockDir * 4, -2, attacker);
          t.hitStun = Math.max(t.hitStun, 24);
          t.bleedTimer = Math.max(t.bleedTimer || 0, 150);
        }
      }
    }
  }

  // --- POLNAREFF EXECUTION METHODS ---
  private executeRayOfLightHit(attacker: Fighter, target: Fighter) {
    const reach = 145;
    soundManager.playRapierThrust();
    this.spawnOrientedBarrageArm(attacker, reach, '#f1f5f9', '#38bdf8', true);

    const hitbox = this.createOrientedHitbox(attacker, reach, 65, RAY_OF_LIGHT_DAMAGE_PER_HIT, 1.5, 0.5, {
      isBarrage: true,
      yOffset: 10,
    });
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private executeShootingSword(attacker: Fighter, target: Fighter) {
    const axis = this.activeGravityAxis || 'down';
    const dir = attacker.facing === 'right' ? 1 : -1;
    let spawnX = dir === 1 ? attacker.x + attacker.width : attacker.x - 30;
    let spawnY = attacker.y + 30;
    let vx = dir * 24;
    let vy = 0;
    let pWidth = 40;
    let pHeight = 12;
    let kbX = dir * 12;
    let kbY = -3;

    if (axis === 'right') {
      const isUp = attacker.facing === 'right';
      spawnX = attacker.x - 10;
      spawnY = isUp ? attacker.y - 30 : attacker.y + attacker.height + 10;
      vx = -6;
      vy = (isUp ? -1 : 1) * 24;
      pWidth = 12;
      pHeight = 40;
      kbX = -6;
      kbY = (isUp ? -1 : 1) * 12;
    } else if (axis === 'left') {
      const isUp = attacker.facing === 'left';
      spawnX = attacker.x + attacker.width + 10;
      spawnY = isUp ? attacker.y - 30 : attacker.y + attacker.height + 10;
      vx = 6;
      vy = (isUp ? -1 : 1) * 24;
      pWidth = 12;
      pHeight = 40;
      kbX = 6;
      kbY = (isUp ? -1 : 1) * 12;
    }

    this.projectiles.push({
      id: this.projectileId++,
      ownerId: attacker.id,
      type: 'rapier_blade',
      x: spawnX,
      y: spawnY,
      vx: vx,
      vy: vy,
      baseVx: vx,
      baseVy: vy,
      width: pWidth,
      height: pHeight,
      damage: SHOOTING_SWORD_DAMAGE,
      knockbackX: kbX,
      knockbackY: kbY,
      isFrozenInTime: false,
      life: 120,
      maxLife: 120,
      color: '#f1f5f9',
    });
    soundManager.playSwordSlash();
    this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 35, '🗡️ RAPIER LAUNCH!', '#38bdf8');
  }

  private executeUpwardThrust(attacker: Fighter, target: Fighter) {
    const hitbox = this.createOrientedHitbox(attacker, 100, 100, UPWARD_THRUST_DAMAGE, 6, 14, {
      hitStun: 45,
      yOffset: -20,
    });
    this.screenShake = 8;
    soundManager.playSwordSlash();
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;
    this.addShockwave(cx, cy, '#38bdf8');
    this.addTextParticle(cx, attacker.y - 35, '🗡️ UPWARD RAPIER LAUNCHER!', '#38bdf8');
    const targets = this.getTargetsForAttacker(attacker, target);
    for (const t of targets) {
      if (this.checkCollision(hitbox, t)) {
        this.applyHit(attacker, t, hitbox);
      }
    }
  }

  private executeAfterimageMirage(attacker: Fighter, target: Fighter) {
    const dir = attacker.facing === 'right' ? 1 : -1;
    const totalDamage = AFTERIMAGE_MIRAGE_DAMAGE;
    this.applyRawDamage(target, totalDamage, dir * 16, -7);
    target.action = 'knockback';
    target.hitReactionType = 'directional_launch';
    target.hitReactionTimer = 60;
    target.hitReactionDuration = 60;
    target.isGrounded = false;
    target.hitStun = 60;
    this.screenShake = 16;
    soundManager.playRapierThrust();
    soundManager.playSwordSlash();

    for (let i = 0; i < 5; i++) {
      const cloneX = target.x + (Math.random() * 160 - 80);
      const cloneY = target.y + (Math.random() * 80 - 40);
      this.addShockwave(cloneX, cloneY, '#34d399');
      this.addSpark(cloneX, cloneY, '#f1f5f9');
    }
    this.addTextParticle(target.x + target.width / 2, target.y - 50, '⚡ SILVER CHARIOT: AFTERIMAGE MIRAGE!!', '#34d399');
  }

  // --- DAMAGE & TIME STOP ACCUMULATION LOGIC ---
  public createOrientedHitbox(
    attacker: Fighter,
    reach: number,
    height: number,
    damage: number,
    knockbackFwd: number,
    knockbackUp: number,
    options: {
      hitStun?: number;
      isBarrage?: boolean;
      yOffset?: number;
      isGuardBreak?: boolean;
      isUnblockable?: boolean;
      reactionType?: HitReactionType;
      hitDirection?: HitDirection;
      isContinuousBeam?: boolean;
      continuousTickInterval?: number;
      wallBounce?: boolean;
      groundBounce?: boolean;
    } = {}
  ): Hitbox {
    const axis = this.activeGravityAxis || 'down';
    const dir = attacker.facing === 'right' ? 1 : -1;
    const yOff = options.yOffset !== undefined ? options.yOffset : 10;
    
    // Gravitational bonus for C-Moon Pucci (Singularity center empowerment)
    let finalDamage = damage;
    if (attacker.charId === 'pucci' && attacker.pucciForm === 'cmoon') {
      finalDamage = Math.round(damage * 1.15); // +15% gravitational force empowerment
    }

    if (axis === 'right') {
      // Floor on right wall. "Forward" along wall is Y:
      // facing === 'right' -> UP (-Y), facing === 'left' -> DOWN (+Y)
      const isUp = attacker.facing === 'right';
      return {
        x: attacker.x - 35,
        y: isUp ? attacker.y - reach : attacker.y + attacker.height,
        width: attacker.width + 70,
        height: reach,
        damage: finalDamage,
        knockbackX: -Math.abs(knockbackUp), // Pushes away from right wall into arena
        knockbackY: (isUp ? -1 : 1) * knockbackFwd,
        hitStun: options.hitStun,
        isBarrage: options.isBarrage,
        isGuardBreak: options.isGuardBreak,
        isUnblockable: options.isUnblockable,
        reactionType: options.reactionType,
        hitDirection: options.hitDirection,
        isContinuousBeam: options.isContinuousBeam,
        continuousTickInterval: options.continuousTickInterval,
        wallBounce: options.wallBounce,
        groundBounce: options.groundBounce,
      };
    } else if (axis === 'left') {
      // Floor on left wall. "Forward" along wall is Y:
      // facing === 'left' -> UP (-Y), facing === 'right' -> DOWN (+Y)
      const isUp = attacker.facing === 'left';
      return {
        x: attacker.x - 35,
        y: isUp ? attacker.y - reach : attacker.y + attacker.height,
        width: attacker.width + 70,
        height: reach,
        damage: finalDamage,
        knockbackX: Math.abs(knockbackUp), // Pushes away from left wall into arena
        knockbackY: (isUp ? -1 : 1) * knockbackFwd,
        hitStun: options.hitStun,
        isBarrage: options.isBarrage,
        isGuardBreak: options.isGuardBreak,
        isUnblockable: options.isUnblockable,
        reactionType: options.reactionType,
        hitDirection: options.hitDirection,
        isContinuousBeam: options.isContinuousBeam,
        continuousTickInterval: options.continuousTickInterval,
        wallBounce: options.wallBounce,
        groundBounce: options.groundBounce,
      };
    } else if (axis === 'up') {
      // Floor is ceiling. "Forward" along ceiling is X:
      return {
        x: dir === 1 ? attacker.x + attacker.width : attacker.x - reach,
        y: attacker.y + yOff,
        width: reach,
        height: height,
        damage: finalDamage,
        knockbackX: dir * knockbackFwd,
        knockbackY: Math.abs(knockbackUp), // Pushes down away from ceiling into arena
        hitStun: options.hitStun,
        isBarrage: options.isBarrage,
        isGuardBreak: options.isGuardBreak,
        isUnblockable: options.isUnblockable,
        reactionType: options.reactionType,
        hitDirection: options.hitDirection,
        isContinuousBeam: options.isContinuousBeam,
        continuousTickInterval: options.continuousTickInterval,
        wallBounce: options.wallBounce,
        groundBounce: options.groundBounce,
      };
    } else {
      // Normal down gravity
      return {
        x: dir === 1 ? attacker.x + attacker.width : attacker.x - reach,
        y: attacker.y + yOff,
        width: reach,
        height: height,
        damage: finalDamage,
        knockbackX: dir * knockbackFwd,
        knockbackY: -Math.abs(knockbackUp),
        hitStun: options.hitStun,
        isBarrage: options.isBarrage,
        isGuardBreak: options.isGuardBreak,
        isUnblockable: options.isUnblockable,
        reactionType: options.reactionType,
        hitDirection: options.hitDirection,
        isContinuousBeam: options.isContinuousBeam,
        continuousTickInterval: options.continuousTickInterval,
        wallBounce: options.wallBounce,
        groundBounce: options.groundBounce,
      };
    }
  }

  public getFighterAABB(f: Fighter): { x: number; y: number; width: number; height: number } {
    const axis = this.activeGravityAxis || 'down';
    const cx = f.x + f.width / 2;
    const cy = f.y + f.height / 2;

    if (axis === 'right' || axis === 'left') {
      const effW = f.height; // Rotated width = 80
      const effH = f.width;  // Rotated height = 40
      return {
        x: cx - effW / 2,
        y: cy - effH / 2,
        width: effW,
        height: effH,
      };
    }
    return {
      x: f.x,
      y: f.y,
      width: f.width,
      height: f.height,
    };
  }

  private checkCollision(hitbox: Hitbox, target: Fighter, attacker?: Fighter): boolean {
    // If target is Arabian Fat hiding behind mirror: check mirror object hitbox!
    if (target.charId === 'arabian_fat' && target.isHidingBehindMirror && target.mirrorObject && !target.mirrorObject.isDestroyed) {
      const m = target.mirrorObject;
      const collidesWithMirror = (
        hitbox.x < m.x + m.width &&
        hitbox.x + hitbox.width > m.x &&
        hitbox.y < m.y + m.height &&
        hitbox.y + hitbox.height > m.y
      );

      if (collidesWithMirror) {
        this.damageMirrorObject(target, hitbox.damage, attacker);
      }
      return false; // User itself is hidden behind mirror, isTargetable = false
    }

    const targetAABB = this.getFighterAABB(target);
    const axis = this.activeGravityAxis || 'down';

    // Standard AABB overlap check
    return (
      hitbox.x < targetAABB.x + targetAABB.width &&
      hitbox.x + hitbox.width > targetAABB.x &&
      hitbox.y < targetAABB.y + targetAABB.height &&
      hitbox.y + hitbox.height > targetAABB.y
    );
  }

  public damageMirrorObject(target: Fighter, damage: number, attacker?: Fighter | null) {
    if (!target.mirrorObject || target.mirrorObject.isDestroyed) return;

    target.mirrorObject.hp = Math.max(0, target.mirrorObject.hp - damage);
    target.mirrorObject.hitFlashTimer = 8;
    soundManager.playHit(true);
    this.screenShake = Math.max(this.screenShake, 5);

    const mx = target.mirrorObject.x + target.mirrorObject.width / 2;
    const my = target.mirrorObject.y + target.mirrorObject.height / 2;
    this.addShockwave(mx, my, '#38bdf8');
    this.addTextParticle(mx, target.mirrorObject.y - 25, `🪞 MIRROR HIT! (-${Math.round(damage)})`, '#38bdf8');

    if (target.mirrorObject.hp <= 0) {
      // MIRROR SHATTERED & USER EXPOSED (THE SUN REMAINS ACTIVE IN THE SKY!)
      target.mirrorObject.isDestroyed = true;
      target.isHidingBehindMirror = false;
      target.sunActive = true; // The Sun Stand does NOT disappear!
      target.hp = Math.min(target.hp, SUN_EXPOSED_PANIC_HP);
      target.isInvulnerable = false;
      target.invulnerableTimer = 0;
      target.guardBreakTimer = 0; // Immediately allow full movement & actions
      target.action = 'sun_exposed_panic';
      target.actionTimer = 25; // Brief 0.4s reaction frame, smoothly returning to idle
      target.actionDuration = 25;
      target.sunExposedTimer = 360; // 6s comedic panic expression

      soundManager.playMirrorShatter();
      soundManager.playArabiaFatPanic();
      this.screenShake = 22;

      this.addShockwave(mx, my, '#ef4444');
      this.addShockwave(mx, my, '#ffffff');
      this.addTextParticle(mx, target.mirrorObject.y - 45, '💥🪞 MIRROR SHATTERED! ARABIA FAT EXPOSED (1000 HP)! THE SUN STILL BLAZES!', '#ef4444');

      for (let s = 0; s < 18; s++) {
        this.addSpark(mx + (Math.random() * 80 - 40), my + (Math.random() * 80 - 40), '#38bdf8');
        this.addSpark(mx + (Math.random() * 80 - 40), my + (Math.random() * 80 - 40), '#ffffff');
      }
    }
  }

  private triggerDipezAutoBlink(target: Fighter, attacker?: Fighter | null) {
    if (target.charId !== 'dipez' || target.dipezForm !== 'pure_light') return;

    // Immediately clear negative status effects because pure light cannot burn, bleed, freeze, or trap
    target.burnedTimer = 0;
    if (target.bleedTimer) target.bleedTimer = 0;
    if (target.poisonTimer) target.poisonTimer = 0;
    if (target.blindedTimer) target.blindedTimer = 0;
    if (target.silencedTimer) target.silencedTimer = 0;
    if (target.discFrozenTimer) target.discFrozenTimer = 0;
    if (target.gappyTrappedTimer) target.gappyTrappedTimer = 0;

    // Don't trigger blink position jump if target is already mid-blink invulnerable
    if (target.invulnerableTimer > 15) return;

    if (!target.afterimages) target.afterimages = [];
    target.afterimages.push({
      x: target.x,
      y: target.y,
      alpha: 1.0,
      facing: target.facing,
      charId: 'dipez',
      color: 'rgba(255, 255, 255, 0.95)',
    });

    const refFighter = attacker || (this.player.id !== target.id ? this.player : this.ai);
    let blinkX = refFighter && refFighter.facing === 'right' ? refFighter.x - 70 : (refFighter ? refFighter.x + refFighter.width + 30 : target.x + 100);
    if (blinkX < 40 || blinkX > this.getArenaWidth() - 80) {
      blinkX = refFighter && refFighter.facing === 'right' ? refFighter.x + refFighter.width + 70 : (refFighter ? refFighter.x - 70 : target.x - 100);
    }
    target.x = Math.max(40, Math.min(this.getArenaWidth() - 80, blinkX));
    target.y = refFighter ? refFighter.y : target.y;
    target.vx = 0;
    target.vy = 0;
    target.invulnerableTimer = 25;

    soundManager.playDipezTch();
    this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ffffff');
    this.addTextParticle(target.x + target.width / 2, target.y - 45, '✨ [PURE LIGHT: INVINCIBLE AUTO-BLINK!]', '#fef08a');
    for (let i = 0; i < 8; i++) {
      this.addSpark(target.x + Math.random() * target.width, target.y + Math.random() * target.height, '#ffffff');
    }
  }

  private applyHit(attacker: Fighter, target: Fighter, hitbox: Hitbox) {
    // Barrage Clash Exclusivity & 100% Invulnerability:
    // Characters currently engaged in a Stand Clash are completely immune to all external attacks!
    if (this.isClashParticipant(target)) {
      return;
    }
    // Attackers currently engaged in a Stand Clash duel only clash with their opponent and cannot hit third parties!
    if (this.isClashParticipant(attacker)) {
      return;
    }

    // Friendly Fire Check: Teammates cannot hit each other!
    if (attacker.team && target.team && attacker.team === target.team) {
      const isLocal1v1Opponent = !this.matchConfig.isMultiplayer && 
        ((attacker.id === 'player' && target.id === 'ai') || (attacker.id === 'ai' && target.id === 'player'));
      if (!isLocal1v1Opponent) {
        return;
      }
    }

    // Dimension Separation: Attacks cannot hit targets across different dimensions!
    if (!!attacker.isParallelWorld !== !!target.isParallelWorld) {
      return;
    }

    // 0. Check if Target is Dipez in Pure Light Form (Invincible Auto-Blink)
    if (target.charId === 'dipez' && target.dipezForm === 'pure_light') {
      this.triggerDipezAutoBlink(target, attacker);
      return;
    }

    // 0. Check if Target is in Erased Time (Diavolo Time Erase Auto-Blink & Phase-Through)
    if (target.isTimeEraseActive || (target.charId === 'king_crimson' && target.isTimeEraseActive)) {
      // Record vivid crimson afterimage at origin
      if (!target.afterimages) target.afterimages = [];
      target.afterimages.push({
        x: target.x,
        y: target.y,
        alpha: 1.0,
        facing: target.facing,
        charId: 'king_crimson',
        color: 'rgba(225, 29, 72, 0.9)',
      });

      // Calculate blink reposition (behind the attacker or to safe opposite side)
      let blinkX = attacker.facing === 'right' ? attacker.x - 70 : attacker.x + attacker.width + 30;
      if (blinkX < 40 || blinkX > this.getArenaWidth() - 80) {
        blinkX = attacker.facing === 'right' ? attacker.x + attacker.width + 70 : attacker.x - 70;
      }
      target.x = Math.max(40, Math.min(this.getArenaWidth() - 80, blinkX));
      target.y = attacker.y;
      target.vx = 0;
      target.vy = 0;
      target.invulnerableTimer = 16;

      // Audio, particles & visual feedback
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#e11d48');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '⏱️ [TIME ERASE: AUTO-BLINK PHASE!]', '#fb7185');
      for (let i = 0; i < 8; i++) {
        this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#fb7185');
      }
      soundManager.playPoseSound('king_crimson');
      this.screenShake = Math.max(this.screenShake, 4.0);
      return; // Attacker's hit completely phases through, 0 damage taken!
    }

    // 1. Check if Target has Epitaph Precognition Active (Diavolo Auto-Dodge & Counter Slash)
    if (target.isEpitaphActive) {
      this.triggerEpitaphCounter(target, attacker);
      return; // Attacker's hit is foreseen by Epitaph and countered!
    }

    // 1.5. Check if Target is Young Joseph during NIGERUNDAYO Ultimate (Auto-Evade / Slip / Miss)
    if (target.charId === 'joseph_young' && target.action === 'young_joseph_ultimate') {
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '💨 AUTO-EVADE! (NIGERUNDAYO!)', '#38bdf8');
      this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#38bdf8');
      this.addSpark(target.x + target.width / 2 + 10, target.y + target.height / 2 - 10, '#ffffff');
      soundManager.playPoseSound('joseph_young');
      return; // All attacks directed at Joseph while running auto-miss!
    }

    // 1.9. Check if Target is Michael Junister with Kinetic Counter Active (Flash Step Counter Kick)
    if (target.charId === 'michael' && (target.michaelCounterActive || target.action === 'michael_counter_stance')) {
      target.michaelCounterActive = false;
      target.isParrying = false;
      target.action = 'michael_counter_kick';
      target.actionTimer = 24;
      target.actionDuration = 24;
      target.invulnerableTimer = 35;

      // Flash step behind attacker
      const behindX = attacker.facing === 'right' ? attacker.x - 45 : attacker.x + attacker.width + 15;
      target.x = Math.max(30, Math.min(this.getArenaWidth() - 70, behindX));
      target.y = attacker.y;
      target.facing = attacker.facing === 'right' ? 'right' : 'left';

      // Hat Price absorbs kinetic energy from intercepted impact (+30%)
      target.michaelKineticMeter = Math.min(100, (target.michaelKineticMeter || 0) + 30);
      target.michaelKineticStacks = Math.min(5, Math.floor(target.michaelKineticMeter / 20));

      soundManager.playMichaelCounter();
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
      this.addTextParticle(target.x + target.width / 2, target.y - 55, '⚡ IMPACT ABSORBED (+30% KINETIC CHARGE!)', '#facc15');
      this.addTextParticle(target.x + target.width / 2, target.y - 35, '⚡ FLASH STEP COUNTER KICK!', '#facc15');

      const kickDir = target.facing === 'right' ? 1 : -1;
      this.applyRawDamage(attacker, MICHAEL_COUNTER_DAMAGE, kickDir * 18, -7, target);
      attacker.hitStun = 45;
      this.screenShake = 9;
      return; // Attacker's hit is cleanly countered!
    }

    // 2. Check if Target is Parrying (Jotaro Inhale, Young Joseph Next Line, Jonathan Counter)
    if (target.isParrying) {
      target.isParrying = false;
      const dir = target.facing === 'right' ? 1 : -1;

      if (target.charId === 'joseph_young' || target.action === 'next_line') {
        // --- YOUNG JOSEPH "TSUGI NI OMAE WA... TO IU!" MIND-READING MASTER COUNTER SCENE ---
        target.isParrying = false;
        this.triggerNextLineCutscene(target, attacker);
        return;
      }

      target.action = 'parry_counter';
      target.actionTimer = 25;
      target.actionDuration = 25;
      target.isStandActive = true;
      target.invulnerableTimer = 30;

      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
      this.addTextParticle(target.x + target.width / 2, target.y - 40, '★ PARRY COUNTER STRIKE! ★', '#c084fc');

      // Counter-attack hits attacker immediately
      this.applyRawDamage(attacker, PARRY_COUNTER_DAMAGE, dir * 14, -5);
      attacker.hitStun = 35;
      return;
    }

    // 2.5. Check if Target is Tooru with Calamity Counter Active (Traffic Hazard)
    if (!this.timeStopState.isActive && target.charId === 'tooru' && target.isCalamityCounterActive) {
      target.isCalamityCounterActive = false;
      target.invulnerableTimer = 25;
      const carDir = target.facing === 'right' ? 1 : -1;
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: target.id,
        type: 'calamity_car',
        subType: 'car',
        x: attacker.x - (carDir * 180),
        y: GROUND_Y - 45,
        vx: carDir * 34,
        vy: 0,
        baseVx: carDir * 34,
        baseVy: 0,
        width: 90,
        height: 45,
        damage: CALAMITY_CAR_DAMAGE,
        knockbackX: carDir * 24,
        knockbackY: -10,
        isFrozenInTime: false,
        life: 80,
        maxLife: 80,
        color: '#ef4444',
      });
      soundManager.playCarCrash();
      this.screenShake = 12;
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ef4444');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '🚗 [CALAMITY COUNTER: TRAFFIC HAZARD!]', '#ef4444');
      return;
    }

    // 2.6. Check if Target is Tooru disguised as Head Doctor (Satoru Akefu)
    if (!this.timeStopState.isActive && target.charId === 'tooru' && target.isHeadDoctorDisguise) {
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '🎩 [HEAD DOCTOR: UNTOUCHABLE CALAMITY!]', '#94a3b8');
      this.triggerCalamity(target, attacker);
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#94a3b8');
      return; // Direct hits cannot harm the Head Doctor!
    }

    // 2.7. Check if Target is Tooru (Flow of Calamity: Passive Repulsion & Retribution Shield)
    if (!this.timeStopState.isActive && target.charId === 'tooru' && target.invulnerableTimer <= 0) {
      // The absolute logic of calamity repels attacks and punishes the attacker!
      this.triggerCalamity(target, attacker);
      target.invulnerableTimer = 22;

      // Heavy 85% damage reduction
      const reducedDamage = (target.isArmorOff ? hitbox.damage * ARMOR_OFF_DEFENSE_PENALTY : hitbox.damage) * 0.15;
      target.hp = Math.max(0, target.hp - reducedDamage);
      target.hitStun = 8;

      // Repel attacker backwards
      const repulseDir = target.x < attacker.x ? 1 : -1;
      attacker.vx = repulseDir * 10;
      attacker.vy = -4;
      attacker.hitStun = Math.max(attacker.hitStun, 28);
      attacker.isGrounded = false;

      soundManager.playTooruCalamity();
      this.screenShake = 8;
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ef4444');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '🛡️ [FLOW OF CALAMITY: RETRIBUTION SHIELD!]', '#ef4444');
      return;
    }

    // 2.8. Check if Target is Pucci reciting 14 Words (Interruptible Chant)
    if (target.charId === 'pucci' && target.action === 'pucci_14_words_chant') {
      target.action = 'hit';
      target.actionTimer = 0;
      target.pucciChantStep = 0;
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '❌ 14 WORDS CHANT INTERRUPTED!', '#ef4444');
    }

    // 2.9. Check if Target is C-Moon with Gravity Shield Active
    if (!this.timeStopState.isActive && target.charId === 'pucci' && target.pucciForm === 'cmoon' && target.cmoonShieldTimer && target.cmoonShieldTimer > 0) {
      target.invulnerableTimer = 16;
      const repulseDir = target.x < attacker.x ? 1 : -1;
      attacker.vx = repulseDir * 18;
      attacker.vy = -6;
      attacker.hitStun = 35;
      attacker.isGrounded = false;
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#22c55e');
      this.addTextParticle(target.x + target.width / 2, target.y - 40, '🛡️ GRAVITY REPULSION DEFLECT!', '#22c55e');
      soundManager.playCmoonGravity();
      return;
    }

    // 2.10. Check if Target has Gappy Bubble Shield Active
    if (target.gappyShieldActive && target.gappyShieldTimer && target.gappyShieldTimer > 0) {
      target.gappyShieldActive = false;
      target.gappyShieldTimer = 0;
      target.invulnerableTimer = 20;
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#7dd3fc');
      this.addTextParticle(target.x + target.width / 2, target.y - 40, '🫧 BUBBLE SHIELD ABSORBED HIT!', '#38bdf8');
      soundManager.playBubblePop();
      return;
    }

    // 2.11. Check if Target is Funny Valentine with D4C: Love Train Active
    if (target.isLoveTrainActive || (target.charId === 'funny_valentine' && target.loveTrainTimer && target.loveTrainTimer > 0)) {
      soundManager.playLoveTrainRedirect();
      this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#fbbf24');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '✨ [D4C: LOVE TRAIN MISFORTUNE REDIRECTED!]', '#eab308');

      if (attacker) {
        attacker.hp = Math.max(0, attacker.hp - VALENTINE_LOVE_TRAIN_REDIRECT_DAMAGE);
        attacker.hitStun = 20;
        attacker.vx = (attacker.x > target.x ? 1 : -1) * 12;
        attacker.vy = -5;
        this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 35, `⚡ MISFORTUNE REFLECTED! -${VALENTINE_LOVE_TRAIN_REDIRECT_DAMAGE} HP`, '#eab308');
      }
      return;
    }

    // 2.12. Check if Target is Wally Wable / Perstein with Invisible Drive Chain Deflection Active
    if (target.charId === 'perstein' && target.persteinDeflectionTimer && target.persteinDeflectionTimer > 0) {
      soundManager.playPersteinDeflection();
      soundManager.playHit(true);
      target.invulnerableTimer = 16;
      target.persteinDeflectReactionTimer = 24; // Invisible drive chains instantaneously manifest to intercept & deflect
      target.persteinDeflectImpactX = attacker ? attacker.x + attacker.width / 2 : target.x + target.width / 2;
      target.persteinDeflectImpactY = attacker ? attacker.y + attacker.height / 2 : target.y + target.height / 2;
      target.persteinDeflectAngle = Math.atan2((attacker ? attacker.y : target.y) - target.y, (attacker ? attacker.x : target.x) - target.x);

      this.addShockwave(target.persteinDeflectImpactX, target.persteinDeflectImpactY, '#38bdf8');
      this.addTextParticle(target.x + target.width / 2, target.y - 40, '⚙️ INVISIBLE DRIVE CHAIN: INTERCEPT & RICOCHET!', '#38bdf8');

      if (attacker) {
        attacker.hp = Math.max(0, attacker.hp - 25);
        attacker.hitStun = 22;
        attacker.vx = (attacker.x > target.x ? 1 : -1) * 14;
        attacker.vy = -6;
        for (let s = 0; s < 10; s++) {
          this.addSpark(attacker.x + attacker.width / 2 + (Math.random() * 24 - 12), attacker.y + attacker.height / 2 + (Math.random() * 24 - 12), '#facc15');
        }
      }
      return;
    }

    // Invulnerability check: Wakeup, dodging, or anti-infinite tech recovery blocks incoming attacks
    if (target.invulnerableTimer > 0) {
      if (attacker.charId === 'vampire' || !hitbox.isBarrage || target.invulnerableTimer > 3) {
        return;
      }
    }

    // VAMPIRE HORDE FAIRNESS & SUPER ARMOR:
    // If attacker is a Vampire Minion, player/teammate attacks & skills have Super Armor (cannot be interrupted mid-attack!)
    // and player receives brief post-hit mercy invulnerability so multiple vampires can NEVER chain-stunlock the player!
    if (attacker.charId === 'vampire') {
      const isTargetExecutingAttackOrSkill =
        target.actionTimer > 0 &&
        target.action !== 'idle' &&
        target.action !== 'walk' &&
        target.action !== 'jump' &&
        target.action !== 'crouch' &&
        target.action !== 'hit' &&
        target.action !== 'stun' &&
        target.action !== 'knockback' &&
        target.action !== 'knockdown';

      if (isTargetExecutingAttackOrSkill) {
        // Super Armor during player attacks/skills: take 50% reduced scratch damage without interrupting player's move!
        const scratchDmg = Math.max(2, Math.round(hitbox.damage * 0.5));
        target.hp = Math.max(0, target.hp - scratchDmg);
        target.invulnerableTimer = Math.max(target.invulnerableTimer, 18);
        this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#f87171');
        return;
      }
    }

    // Attacker gains energy on hit
    attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + (hitbox.isBarrage ? 1.5 : 8));

    // Whitesnake Passive - Disc Steal on Basic/Barrage hit (chance to silence)
    if (attacker.charId === 'pucci' && (!attacker.pucciForm || attacker.pucciForm === 'whitesnake') && Math.random() < 0.35) {
      target.silencedTimer = 120; // 2 seconds silence
      soundManager.playPucciDisc();
      this.addTextParticle(target.x + target.width / 2, target.y - 45, '💿 DISC STOLEN! (SILENCED 2s)', '#e2e8f0');
    }

    // C-Moon Passive - Cape Canaveral Gauge accumulation on hit
    if (attacker.charId === 'pucci' && attacker.pucciForm === 'cmoon') {
      attacker.cmoonGauge = Math.min(100, (attacker.cmoonGauge || 0) + (hitbox.isBarrage ? 2.5 : 8));
      if (attacker.cmoonGauge >= 100 && (attacker.cmoonGauge - (hitbox.isBarrage ? 2.5 : 8)) < 100) {
        this.addTextParticle(attacker.x + attacker.width / 2, attacker.y - 40, '🌕 CAPE CANAVERAL 100% READY!', '#facc15');
      }
    }

    // Calculate damage with Attack Theft & Armor Off penalty
    let dmgMult = 1.0;
    if (attacker.gappyAttackTheftTimer && attacker.gappyAttackTheftTimer > 0) {
      dmgMult *= 0.50; // 50% Attack reduction from Gappy Shave & Moisture Theft
    }
    if (attacker.charId === 'michael') {
      const kineticRatio = Math.min(1.0, Math.max(0, (attacker.michaelKineticMeter || 0) / 100));
      // Scaling: up to +150% damage bonus (2.5x total damage!) at 100% kinetic meter!
      dmgMult *= (1.0 + kineticRatio * 1.50);
      if (attacker.michaelOverdriveTimer && attacker.michaelOverdriveTimer > 0) {
        dmgMult *= 1.30; // +30% kinetic surge damage during Hat Price Overdrive
      }

      // Successful hit charges Michael's kinetic meter
      const hitCharge = hitbox.isBarrage ? 1.5 : 7.0;
      const overdriveMult = (attacker.michaelOverdriveTimer && attacker.michaelOverdriveTimer > 0) ? 2.0 : 1.0;
      attacker.michaelKineticMeter = Math.min(100, (attacker.michaelKineticMeter || 0) + hitCharge * overdriveMult);
      attacker.michaelKineticStacks = Math.min(5, Math.floor(attacker.michaelKineticMeter / 20));
    }
    let customDmgMult = 1.0;
    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings?.damageMultiplier !== undefined) {
      customDmgMult = this.matchConfig.customSettings.damageMultiplier;
    }
    const baseDamage = hitbox.damage * dmgMult * customDmgMult;
    let effectiveDamage = target.isArmorOff ? baseDamage * ARMOR_OFF_DEFENSE_PENALTY : baseDamage;


    // If target was in crumple state, hit connects clean
    if (target.isCrumpled) {
      target.isCrumpled = false;
      target.crumpleTimer = 0;
    }

    // Air juggle physics: keep opponent elevated if juggled midair!
    if (!target.isGrounded && target.action === 'knockback') {
      if (hitbox.knockbackY > 0) {
        target.vy = Math.min(-3.5, target.vy * 0.4 - 2.8);
      }
    }

    // Check God Mode in Custom Mode
    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings) {
      if (this.matchConfig.customSettings.infiniteHpPlayer && (target.id === 'player' || target.id === 'teammate')) {
        effectiveDamage = 0;
      }
      if (this.matchConfig.customSettings.infiniteHpEnemy && (target.id === 'ai' || target.id.startsWith('vampire'))) {
        effectiveDamage = 0;
      }
    }

    if (attacker.charId === 'michael') {
      this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
    }

    // 3. IF TARGET IS FROZEN IN TIME STOP -> DAMAGE STACKING!
    if (this.timeStopState.isActive && target.isFrozenByTimeStop) {
      if (target.id === 'player') {
        this.timeStopState.accumulatedDamagePlayer += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXPlayer += hitbox.knockbackX;
        this.timeStopState.accumulatedKnockbackYPlayer += hitbox.knockbackY;
      } else if (target.id === 'teammate') {
        this.timeStopState.accumulatedDamageTeammate += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXTeammate += hitbox.knockbackX;
        this.timeStopState.accumulatedKnockbackYTeammate += hitbox.knockbackY;
      } else {
        this.timeStopState.accumulatedDamageAI += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXAI += hitbox.knockbackX;
        this.timeStopState.accumulatedKnockbackYAI += hitbox.knockbackY;
      }

      const impactX = target.x + target.width / 2;
      const impactY = target.y + target.height / 3;
      this.addSpark(impactX, impactY, '#facc15');
      if (!hitbox.isBarrage) {
        this.addShockwave(impactX, impactY, '#facc15');
      }
      this.screenShake = Math.max(this.screenShake, 2.5);
      return;
    }

    // 4. Normal Damage Execution
    target.hp = Math.max(0, target.hp - effectiveDamage);

    // Life Insurance Passive Check (Conditional Dimension Swap)
    if (target.charId === 'funny_valentine' && target.hp <= 0 && !target.isLifeInsuranceReviving) {
      const activeClones = target.valentineClones ? target.valentineClones.filter(c => c.hp > 0) : [];
      if (activeClones.length > 0) {
        const substituteClone = activeClones[0];
        target.x = substituteClone.x;
        target.y = substituteClone.y;
        target.hp = Math.floor(target.maxHp * VALENTINE_LIFE_INSURANCE_HEAL_PCT);
        target.isLifeInsuranceReviving = true;
        target.lifeInsuranceTimer = 45;
        target.invulnerableTimer = 60;
        target.action = 'idle';

        const idx = target.valentineClones!.indexOf(substituteClone);
        if (idx !== -1) target.valentineClones!.splice(idx, 1);

        soundManager.playDojyaaan();
        soundManager.playFlagSandwich();
        this.screenShake = 10;

        this.addTextParticle(target.x + target.width / 2, target.y - 50, '🚩 PASSIVE: LIFE INSURANCE (DIMENSION SWAP!)', '#38bdf8');
        for (let i = 0; i < 20; i++) {
          this.addSpark(target.x + (Math.random() * 60 - 30), target.y + (Math.random() * 60 - 30), '#f472b6');
        }
        return;
      }
    }
    if (target.hp <= 0 && (target.id === 'player' || target.id === 'ai')) {
      const isUlt = !!(attacker.action.includes('ultimate') || attacker.action.includes('overdrive') || attacker.action.includes('beatdown'));
      this.checkAndTriggerDramaticFinisher(attacker, target, isUlt ? 'ultimate' : 'heavy', target.x + target.width / 2, target.y + target.height / 2);
    }

    const attackerDir = attacker.x < target.x ? 1 : -1;
    const hitDir: HitDirection = hitbox.hitDirection || (attackerDir === 1 ? 'right' : 'left');

    let finalKnockX = hitbox.knockbackX;
    let finalKnockY = hitbox.knockbackY;
    if (attacker.charId === 'michael') {
      const kineticRatio = Math.min(1.0, Math.max(0, (attacker.michaelKineticMeter || 0) / 100));
      // Scaling: up to +220% knockback force (3.2x launch distance!) at 100% kinetic meter!
      finalKnockX = Math.round(finalKnockX * (1.0 + kineticRatio * 2.2));
      finalKnockY = Math.round(finalKnockY * (1.0 + kineticRatio * 1.0));
      if (kineticRatio >= 0.25 && !hitbox.isBarrage) {
        this.addTextParticle(target.x + target.width / 2, target.y - 45, `⚡ KINETIC BOOST (+${Math.round(kineticRatio * 150)}% DMG / +${Math.round(kineticRatio * 220)}% LAUNCH)`, '#facc15');
      }
    }

    // Determine specific HitReactionType based on attack properties
    let reactionType: HitReactionType = hitbox.reactionType || 'light_flinch';
    if (!hitbox.reactionType) {
      if (hitbox.isBarrage) {
        reactionType = 'barrage_pin';
      } else if (hitbox.isContinuousBeam) {
        reactionType = 'continuous_beam_trap';
      } else if (finalKnockY < -8 && Math.abs(finalKnockX) < 8) {
        reactionType = 'anti_air_launch';
      } else if (finalKnockY > 6) {
        reactionType = 'ground_slam_spike';
      } else if (Math.abs(finalKnockX) >= 14 || Math.abs(finalKnockY) >= 9) {
        reactionType = 'directional_launch';
      } else if (effectiveDamage >= 22 || (hitbox.hitStun && hitbox.hitStun >= 24)) {
        reactionType = 'heavy_stagger';
      } else {
        reactionType = 'light_flinch';
      }
    }

    // Check if target is currently already tumbling in ragdoll or lying knocked down on the floor
    const isAlreadyRagdoll = target.action === 'ragdoll' || !!target.isRagdoll;
    const isKnockedDown = target.action === 'knockdown' || target.action === 'wakeup';

    if (isAlreadyRagdoll) {
      // Bugfix: If target is ALREADY in ragdoll mode:
      // They take damage and display hit impacts, but MUST NOT enter a new ragdoll mode,
      // MUST NOT interrupt their tumbling ragdoll state, and MUST NOT stack upward velocity (no climbing up on laser/suction)!
      const impactX = target.x + target.width / 2;
      const impactY = target.y + target.height / 2;
      this.addSpark(impactX, impactY, '#ffffff');
      this.addSpark(impactX + (Math.random() - 0.5) * 20, impactY + (Math.random() - 0.5) * 20, '#f43f5e');
      this.screenShake = Math.max(this.screenShake, 3);
      soundManager.playHit(false);

      // Keep ragdoll action locked in place
      target.action = 'ragdoll';
      target.isRagdoll = true;

      // Gentle horizontal impulse only in attacker direction, absolutely NO upward launch stacking
      target.vx += attackerDir * Math.min(2.5, Math.max(0.5, Math.abs(finalKnockX) * 0.12));

      // Natural downward gravity is strictly preserved; do not decrease or reverse downward fall speed!
      if (finalKnockY > 0) {
        target.vy = Math.max(target.vy, target.vy + finalKnockY * 0.15); // Downward spikes push down slightly faster
      }
      return;
    }

    if (isKnockedDown) {
      // While knocked down on floor or waking up, prevent being popped back up into a ragdoll loop!
      const impactX = target.x + target.width / 2;
      const impactY = target.y + target.height / 2;
      this.addSpark(impactX, impactY, '#ffffff');
      soundManager.playHit(false);
      return;
    }

    // Check if attacker's move is a skill (all special skills, projectiles, Stand abilities, calamity attacks)
    const isSkillAttack = this.isSkillActionOrHitbox(attacker, hitbox);

    // Skills that are pure status/DoT (poison, burn, passive debuffs) or have noRagdoll flag MUST NOT trigger ragdoll!
    const isStatusOrPassiveSkill = !!(
      hitbox.isPoison ||
      hitbox.isBurn ||
      hitbox.isPassive ||
      hitbox.noRagdoll ||
      (Math.abs(finalKnockX) < 4 && Math.abs(finalKnockY) < 3 && !hitbox.reactionType)
    );

    if (isSkillAttack && !isStatusOrPassiveSkill && !(target.charId === 'dipez' && target.dipezForm === 'pure_light')) {
      target.hitReactionType = 'ragdoll_fling';
      target.hitDirection = hitDir;
      target.hitIntensity = Math.min(1.0, effectiveDamage / 35);
      target.hitVariant = ((target.hitVariant || 0) + 1) % 3;
      this.triggerRagdollFling(target, finalKnockX, finalKnockY, attacker.x);
    } else {
      target.hitReactionType = reactionType;
      target.hitDirection = hitDir;
      target.hitIntensity = Math.min(1.0, effectiveDamage / 35);
      target.hitVariant = ((target.hitVariant || 0) + 1) % 3;

      // Apply specific kinematics, hitstun duration, and action state for each reaction type
      if (reactionType === 'light_flinch') {
        target.action = 'hit';
        target.hitReactionTimer = 10;
        target.hitReactionDuration = 10;
        target.hitStun = hitbox.hitStun || 10;
        target.isGrounded = true; // Stays grounded!
        target.vx = attackerDir * Math.min(3.5, Math.max(1.8, Math.abs(finalKnockX) * 0.4));
        target.vy = 0;
      } else if (reactionType === 'heavy_stagger') {
        target.action = 'hit';
        target.hitReactionTimer = 22;
        target.hitReactionDuration = 22;
        target.hitStun = hitbox.hitStun || 22;
        target.isGrounded = true; // Stagger on feet!
        target.vx = attackerDir * Math.min(7.5, Math.max(4.5, Math.abs(finalKnockX) * 0.7));
        target.vy = 0;
      } else if (reactionType === 'barrage_pin') {
        target.action = 'hit';
        target.isPinnedInBarrage = true;
        target.hitReactionTimer = 10;
        target.hitReactionDuration = 10;
        target.hitStun = 10;
        target.isGrounded = true;
        // Progressive pushback force during long barrages so targets are pushed away naturally
        const pushbackSpeed = 3.2;
        target.vx = attackerDir * pushbackSpeed;
        target.vy = 0;
      } else if (reactionType === 'continuous_beam_trap') {
        target.action = 'hit';
        target.isPinnedInBeam = true;
        target.hitReactionTimer = 12;
        target.hitReactionDuration = 12;
        target.hitStun = 12;
        target.isGrounded = true;
        target.vx = attackerDir * 4.5;
        target.vy = 0;
      } else if (reactionType === 'anti_air_launch') {
        target.action = 'knockback';
        target.hitReactionTimer = 40;
        target.hitReactionDuration = 40;
        target.hitStun = hitbox.hitStun || 40;
        target.isGrounded = false;
        target.vx = attackerDir * (Math.abs(finalKnockX) || 3.5);
        target.vy = finalKnockY < 0 ? finalKnockY : -13;
      } else if (reactionType === 'ground_slam_spike') {
        target.action = 'knockback';
        target.hitReactionTimer = 35;
        target.hitReactionDuration = 35;
        target.hitStun = hitbox.hitStun || 45;
        target.isGrounded = false;
        target.vx = attackerDir * (Math.abs(finalKnockX) || 2.0);
        target.vy = Math.max(12, finalKnockY || 14);
      } else if (reactionType === 'directional_launch' || reactionType === 'radial_explosion') {
        target.action = 'knockback';
        target.hitReactionTimer = 45;
        target.hitReactionDuration = 45;
        target.hitStun = hitbox.hitStun || 45;
        target.isGrounded = false;
        target.vx = finalKnockX;
        target.vy = finalKnockY || -8;
      } else if (reactionType === 'crumple') {
        target.action = 'hit';
        target.hitReactionTimer = 35;
        target.hitReactionDuration = 35;
        target.hitStun = 35;
        target.isGrounded = true;
        target.vx = attackerDir * 1.5;
        target.vy = 0;
      } else if (reactionType === 'electric_shock') {
        target.action = 'hit';
        target.hitReactionTimer = 25;
        target.hitReactionDuration = 25;
        target.hitStun = 25;
        target.isGrounded = true;
        target.vx = attackerDir * 2.0;
        target.vy = 0;
      } else {
        target.action = 'hit';
        target.hitReactionTimer = 14;
        target.hitReactionDuration = 14;
        target.hitStun = hitbox.hitStun || 14;
        target.isGrounded = true;
        target.vx = finalKnockX;
        target.vy = 0;
      }
    }

    if (attacker.charId === 'vampire') {
      // Prevent multi-vampire stunlock: clamp hitStun to 6 frames and grant generous mercy i-frames so player can always attack back!
      target.hitStun = Math.min(target.hitStun, 6);
      target.hitReactionTimer = Math.min(target.hitReactionTimer || 6, 6);
      target.invulnerableTimer = Math.max(target.invulnerableTimer, hitbox.isBarrage ? 16 : 26);
    }

    // If target is petrified inside Josuke's Angelo Rock, keep them cemented in stone on the ground while taking damage!
    if (target.angeloWallTimer && target.angeloWallTimer > 0) {
      if (target.hp <= 0) {
        target.angeloWallTimer = 0;
      } else {
        target.vx = 0;
        target.vy = 0;
        target.y = GROUND_Y - target.height;
        target.isGrounded = true;
        target.action = 'hit';
        target.hitReactionTimer = 0;
        target.isPinnedInBarrage = false;
        target.isPinnedInBeam = false;
        target.hitStun = Math.max(target.hitStun, target.angeloWallTimer);
        for (let s = 0; s < 4; s++) {
          this.addSpark(
            target.x + target.width / 2 + (Math.random() * 40 - 20),
            target.y + target.height / 2 + (Math.random() * 40 - 20),
            s % 2 === 0 ? '#64748b' : '#94a3b8'
          );
        }
      }
    }

    // Audio SFX synthesis with zero latency
    if (hitbox.isBarrage) {
      if (attacker.charId === 'silver_chariot') {
        soundManager.playRapierThrust();
      } else {
        soundManager.playBarrageHit();
      }
    } else {
      soundManager.playHit(attacker.isStandActive);
    }

    if (!hitbox.isBarrage) {
      target.invulnerableTimer = 14;
      this.screenShake = attacker.isStandActive ? 7.5 : 4.5;
      const hitX = target.x + target.width / 2;
      const hitY = target.y + target.height / 3;
      const hitImpactGlyph = Math.random() < 0.35 ? 'ドゴォ' : (Math.random() < 0.5 ? 'ズドン' : 'ドドン');
      this.addMenacingParticle(hitX, hitY - 15, hitImpactGlyph, '#ef4444');
    } else {
      this.screenShake = Math.max(this.screenShake, 2.5);
    }

    const impactX = target.x + target.width / 2;
    const impactY = target.y + target.height / 3;
    this.addShockwave(impactX, impactY, attacker.isStandActive ? '#facc15' : '#ffffff');
    for (let i = 0; i < (hitbox.isBarrage ? 3 : 8); i++) {
      this.addSpark(impactX, impactY, attacker.isStandActive ? '#facc15' : '#ffffff');
    }

    // Michael Junister Hat Price: Kinetic Impact Absorption (Charges meter upon receiving physical impact)
    if (target.charId === 'michael') {
      const absorbed = Math.min(45, Math.max(10, Math.round(effectiveDamage * 0.9)));
      target.michaelKineticMeter = Math.min(100, (target.michaelKineticMeter || 0) + absorbed);
      target.michaelKineticStacks = Math.min(5, Math.floor(target.michaelKineticMeter / 20));
      this.addSpark(impactX, impactY, '#facc15');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, `⚡ IMPACT ABSORBED +${absorbed}%`, '#facc15');
      soundManager.playMichaelGoldAura();

      // UNHORSED REACTION: Michael is knocked off George upon taking hits while mounted!
      if (target.isGeorgeMounted) {
        target.isGeorgeMounted = false;
        target.georgePendingRemount = true;
        target.georgeFallOffTimer = 48; // Recovery window before George gallops up to remount
        target.georgeState = 'rearing';
        target.georgeX = target.x;

        // Dynamic parabolic tumble off the horse saddle
        const knockDir = attacker.facing === 'right' ? 1 : -1;
        target.vx = knockDir * (hitbox.isBarrage ? 7.5 : 11);
        target.vy = -6.5;
        target.isGrounded = false;
        target.action = 'knockback';
        target.hitStun = Math.max(target.hitStun, 32);

        soundManager.playGeorgeNeigh();
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ef4444');
        this.addTextParticle(target.x + target.width / 2, target.y - 65, '🐎💥 JATOH DARI KUDA! (UNHORSED TUMBLE)', '#f87171');
      }
    }
  }

  public isSkillActionOrHitbox(attacker: Fighter, hitbox?: Hitbox): boolean {
    if (hitbox?.isSkill) return true;
    const basicActions = [
      'punch',
      'heavy_punch',
      'combo_punch_1',
      'combo_punch_2',
      'combo_punch_3',
      'combo_launcher',
      'combo_sweep',
      'combo_gut_thrust',
      'air_combo_1',
      'air_combo_2',
      'air_spike',
      'air_tech',
      'barrage',
      'barrage_clash',
      'idle',
      'walk',
      'jump',
      'crouch',
      'dash',
      'block',
      'hit',
      'knockback',
      'knockdown',
      'wakeup',
      'dead',
      'pose',
      'ragdoll'
    ];
    return !basicActions.includes(attacker.action);
  }

  public triggerRagdollFling(target: Fighter, launchVx: number, launchVy: number, sourceX?: number) {
    // Barrage Clash participant immunity against ragdoll unless it is the dedicated clash finisher!
    if (this.isClashParticipant(target) && !this.isExecutingClashFinisher) {
      return;
    }

    // If target is ALREADY in ragdoll, or in knockdown / wakeup: do NOT enter a new ragdoll or stack upward velocity!
    if (target.action === 'ragdoll' || target.isRagdoll || target.action === 'knockdown' || target.action === 'wakeup') {
      return;
    }

    // Dipez pure light is completely immune to ragdoll! ("kecuali Dipez light man")
    if (target.charId === 'dipez' && target.dipezForm === 'pure_light') {
      return;
    }

    // If petrified inside solid granite Angelo Rock and still alive, remain anchored until broken
    if (target.angeloWallTimer && target.angeloWallTimer > 0 && target.hp > 0) {
      return;
    }

    // Unseat Michael from horse if mounted
    if (target.charId === 'michael' && target.isGeorgeMounted) {
      target.isGeorgeMounted = false;
      target.georgePendingRemount = true;
      target.georgeFallOffTimer = 48;
      target.georgeState = 'rearing';
      target.georgeX = target.x;
      soundManager.playGeorgeNeigh();
      this.addTextParticle(target.x + target.width / 2, target.y - 65, '🐎💥 JATOH DARI KUDA! (UNHORSED RAGDOLL)', '#f87171');
    }

    // Dismiss active stand on heavy ragdoll launch
    if (target.hasStand && target.isStandActive) {
      target.isStandActive = false;
      target.standAlpha = 0;
    }

    target.action = 'ragdoll';
    target.isRagdoll = true;
    target.ragdollTimer = 45;
    target.ragdollBounces = 0;
    target.ragdollSlideTimer = 0;
    target.isGrounded = false;
    target.hitReactionType = 'ragdoll_fling';
    target.hitStun = Math.max(target.hitStun || 0, 42);
    target.hitReactionTimer = 42;
    target.hitReactionDuration = 42;

    // Determine launch velocities (moderated to prevent overly brutal bouncing)
    let fVx = launchVx;
    let fVy = launchVy;

    if (Math.abs(fVx) < 5) {
      if (sourceX !== undefined) {
        fVx = (target.x >= sourceX ? 1 : -1) * 9.5;
      } else {
        fVx = (target.facing === 'right' ? -1 : 1) * 9.5;
      }
    } else {
      const dir = fVx >= 0 ? 1 : -1;
      fVx = dir * Math.max(7.5, Math.min(13.5, Math.abs(fVx) * 0.75));
    }

    if (fVy >= 0) {
      fVy = -7.5; // Natural parabolic pop arc
    } else {
      fVy = Math.max(-9.5, Math.min(-6.0, fVy * 0.68));
    }

    target.vx = fVx;
    target.vy = fVy;

    const spinDir = fVx >= 0 ? 1 : -1;
    target.ragdollAngularVel = spinDir * (0.15 + Math.min(0.12, Math.abs(fVx) * 0.008));
    target.ragdollAngle = spinDir * 0.15;

    this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#f43f5e');
    this.addTextParticle(target.x + target.width / 2, target.y - 45, '💫 RAGDOLL!', '#f43f5e');
    this.screenShake = Math.max(this.screenShake, 5.5);
    soundManager.playHeavyImpact();
  }

  private applyRawDamage(
    target: Fighter,
    damage: number,
    knockX: number,
    knockY: number,
    attacker?: Fighter | null,
    isPassiveDoT: boolean = false
  ) {
    // Barrage Clash Exclusivity & 100% Invulnerability:
    // Both clash participants are completely immune to outside damage, projectiles, DoT and hazards!
    if (this.isClashParticipant(target) && !this.isExecutingClashFinisher) {
      return;
    }
    if (attacker && this.isClashParticipant(attacker) && !this.isExecutingClashFinisher) {
      return;
    }

    if (target.charId === 'dipez' && target.dipezForm === 'pure_light') {
      this.triggerDipezAutoBlink(target, attacker || null);
      return; // Pure light form is 100% immune to all raw damage & calamity!
    }

    // Young Joseph NIGERUNDAYO Ultimate auto-evade immunity
    if (target.charId === 'joseph_young' && target.action === 'young_joseph_ultimate') {
      return;
    }

    if (attacker && attacker.team && target.team && attacker.team === target.team) {
      const isLocal1v1Opponent = !this.matchConfig.isMultiplayer && 
        ((attacker.id === 'player' && target.id === 'ai') || (attacker.id === 'ai' && target.id === 'player'));
      if (!isLocal1v1Opponent) {
        return; // Friendly Fire Protection
      }
    }

    if (attacker && (!!attacker.isParallelWorld !== !!target.isParallelWorld)) {
      return; // Dimension isolation: attacks in different dimensions cannot affect target
    }

    if (target.isTimeEraseActive || (target.charId === 'king_crimson' && target.isTimeEraseActive)) {
      return; // Phased through completely during erased time
    }

    if (!this.timeStopState.isActive && target.charId === 'king_crimson' && (target.isEpitaphActive || (target.epitaphTimer && target.epitaphTimer > 0) || target.action === 'epitaph_forecast')) {
      this.triggerEpitaphCounter(target, attacker || this.player);
      return;
    }

    // Michael Junister Attacker Scaling: Boosts all skill damage & knockback by Kinetic Meter!
    let effectiveDamage = damage;
    let effectiveKnockX = knockX;
    let effectiveKnockY = knockY;
    if (attacker && attacker.charId === 'michael') {
      const kineticRatio = Math.min(1.0, Math.max(0, (attacker.michaelKineticMeter || 0) / 100));
      effectiveDamage = Math.round(damage * (1.0 + kineticRatio * 1.50));
      effectiveKnockX = Math.round(knockX * (1.0 + kineticRatio * 2.2));
      effectiveKnockY = Math.round(knockY * (1.0 + kineticRatio * 1.0));
    }

    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings?.damageMultiplier !== undefined) {
      effectiveDamage = Math.round(effectiveDamage * this.matchConfig.customSettings.damageMultiplier);
    }

    if (this.matchConfig.mode === 'custom' && this.matchConfig.customSettings) {
      if (this.matchConfig.customSettings.infiniteHpPlayer && (target.id === 'player' || target.id === 'teammate')) {
        effectiveDamage = 0;
      }
      if (this.matchConfig.customSettings.infiniteHpEnemy && (target.id === 'ai' || target.id.startsWith('vampire'))) {
        effectiveDamage = 0;
      }
    }

    if (this.timeStopState.isActive && target.isFrozenByTimeStop) {
      if (target.id === 'player') {
        this.timeStopState.accumulatedDamagePlayer += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXPlayer += effectiveKnockX;
        this.timeStopState.accumulatedKnockbackYPlayer += effectiveKnockY;
      } else if (target.id === 'teammate') {
        this.timeStopState.accumulatedDamageTeammate += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXTeammate += effectiveKnockX;
        this.timeStopState.accumulatedKnockbackYTeammate += effectiveKnockY;
      } else {
        this.timeStopState.accumulatedDamageAI += effectiveDamage;
        this.timeStopState.accumulatedKnockbackXAI += effectiveKnockX;
        this.timeStopState.accumulatedKnockbackYAI += effectiveKnockY;
      }
      return;
    }

    target.hp = Math.max(0, target.hp - effectiveDamage);
    if (target.angeloWallTimer && target.angeloWallTimer > 0 && target.hp > 0) {
      target.vx = 0;
      target.vy = 0;
      target.y = GROUND_Y - target.height;
      target.isGrounded = true;
      target.action = 'hit';
      target.hitStun = Math.max(target.hitStun, target.angeloWallTimer);
    } else {
      const isAlreadyRagdoll = target.action === 'ragdoll' || !!target.isRagdoll;
      const isKnockedDown = target.action === 'knockdown' || target.action === 'wakeup';
      const hasKineticForce = Math.abs(effectiveKnockX) >= 4 || Math.abs(effectiveKnockY) >= 3;

      // Passive damage (poison, burn, bleed, ambient heat) or attacks without kinetic launch force NEVER trigger ragdoll!
      if (!isAlreadyRagdoll && !isKnockedDown && !isPassiveDoT && hasKineticForce && !(target.charId === 'dipez' && target.dipezForm === 'pure_light')) {
        this.triggerRagdollFling(target, effectiveKnockX, effectiveKnockY, attacker ? attacker.x : undefined);
      } else if (!isAlreadyRagdoll && !isKnockedDown && (effectiveKnockX !== 0 || effectiveKnockY !== 0)) {
        target.vx = effectiveKnockX;
        target.vy = effectiveKnockY;
        target.isGrounded = false;
      }
      if (target.hp <= 0) {
        target.angeloWallTimer = 0;
      }
    }

    // Michael Junister Hat Price: Kinetic Impact Absorption (Charges meter from raw damage/explosions/projectiles)
    if (target.charId === 'michael') {
      const absorbed = Math.min(45, Math.max(10, Math.round(damage * 0.85)));
      target.michaelKineticMeter = Math.min(100, (target.michaelKineticMeter || 0) + absorbed);
      target.michaelKineticStacks = Math.min(5, Math.floor(target.michaelKineticMeter / 20));
      this.addSpark(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
      this.addTextParticle(target.x + target.width / 2, target.y - 45, `⚡ IMPACT ABSORBED +${absorbed}%`, '#facc15');
      soundManager.playMichaelGoldAura();

      // UNHORSED REACTION on heavy raw damage
      if (target.isGeorgeMounted && damage >= 8) {
        target.isGeorgeMounted = false;
        target.georgePendingRemount = true;
        target.georgeFallOffTimer = 48;
        target.georgeState = 'rearing';
        target.georgeX = target.x;

        target.action = 'knockback';
        target.hitStun = Math.max(target.hitStun, 30);
        soundManager.playGeorgeNeigh();
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ef4444');
        this.addTextParticle(target.x + target.width / 2, target.y - 65, '🐎💥 JATOH DARI KUDA! (UNHORSED TUMBLE)', '#f87171');
      }
    }
  }

  private applyPhysics(f: Fighter) {
    let dt = this.currentDt;

    // Slow down opponent's physics/movements during Diavolo's Time Erase (Skip Time)
    const opponent = (f.id === 'player' || f.id === 'teammate') ? this.ai : this.player;
    if (opponent && opponent.charId === 'king_crimson' && opponent.isTimeEraseActive) {
      dt *= 0.28; // 28% speed (72% slowed down)
    }

    // Slow down opponent during Made in Heaven's Time Acceleration
    if (opponent && opponent.charId === 'pucci' && opponent.pucciForm === 'made_in_heaven' && opponent.mihTimeAccelTimer && opponent.mihTimeAccelTimer > 0 && f.charId !== 'pucci') {
      dt *= 0.35; // 35% speed (65% slowed down)
    }

    // DIO Road Roller Cinematic Off-Screen Leap & Drop Physics
    if (f.charId === 'dio' && f.action === 'road_roller_startup') {
      const targetX = opponent.x + opponent.width / 2;
      const timer = f.actionTimer || 0;

      f.invulnerableTimer = Math.max(f.invulnerableTimer, 25);
      f.isGrounded = false;
      f.facing = f.x < targetX ? 'right' : 'left';

      if (timer > 130) {
        // Phase 1: High Supersonic Leap Off-Screen (160 -> 130)
        // Lerp smoothly high up into the sky far above the screen
        const leapP = (160 - timer) / 30; // 0 -> 1
        const startY = GROUND_Y - f.height;
        f.y = startY - leapP * (startY + 350); // goes smoothly up to -350
        f.vx = 0;
        f.vy = -20;
        return;
      } else if (timer > 100) {
        // Phase 2: Diving Down carrying the massive Road Roller in hands (130 -> 100)
        const dropP = (130 - timer) / 30; // 0 -> 1
        const rollerY = -350 + dropP * (GROUND_Y - 80 - (-350));
        f.x = targetX - f.width / 2;
        f.y = rollerY - f.height + 25;
        f.vx = 0;
        f.vy = 24;
        return;
      } else if (timer > 25) {
        // Phase 3: Perched ON TOP of Road Roller during rapid MUDA MUDA Barrage (100 -> 25)
        const rollerRoofY = GROUND_Y - 145 - f.height + 25;
        f.x = targetX - f.width / 2;
        f.y = rollerRoofY;
        f.vx = 0;
        f.vy = 0;
        return;
      } else if (timer > 15) {
        // Phase 4: Final Smash & Backflip Leap off the Steamroller (25 -> 15)
        const flipP = (25 - timer) / 10; // 0 -> 1
        const rollerRoofY = GROUND_Y - 145 - f.height + 25;
        const jumpBackDir = f.facing === 'right' ? -1 : 1;
        f.x = (targetX - f.width / 2) + jumpBackDir * flipP * 90;
        f.y = rollerRoofY - Math.sin(flipP * Math.PI) * 90;
        f.vx = jumpBackDir * 6;
        f.vy = -12;
        return;
      } else {
        // Phase 5: Landing after explosion (15 -> 0)
        f.vy += GRAVITY * dt * 0.8;
        f.y += f.vy * dt;
        if (f.y >= GROUND_Y - f.height) {
          f.y = GROUND_Y - f.height;
          f.vy = 0;
          f.isGrounded = true;
        }
        return;
      }
    }

    // DIPEZ Evolution Startup & Star Maker Levitation Physics
    if (f.charId === 'dipez') {
      if (f.action === 'dipez_evolution_startup') {
        const timer = f.actionTimer || 0;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 15);
        f.vx = 0;
        if (timer > 120) {
          // Phase 1: Grounded in base form, eyes igniting
          f.y = GROUND_Y - f.height;
          f.vy = 0;
          f.isGrounded = true;
          return;
        } else if (timer > 25) {
          // Phase 2 & 3: Floating in mid-air during levitation, body cracks, and shell shatter explosion
          f.isGrounded = false;
          f.vy = 0;
          return;
        } else if (timer > 0) {
          // Phase 4: Pure Light Human graceful descent to earth
          const landProg = (25 - timer) / 25; // 0 -> 1
          const hoverY = GROUND_Y - f.height - 75;
          f.y = hoverY + landProg * 75;
          f.vy = 0;
          if (f.y >= GROUND_Y - f.height - 1) {
            f.y = GROUND_Y - f.height;
            f.isGrounded = true;
          }
          return;
        }
      } else if (f.action === 'dipez_star_maker') {
        const timer = f.actionTimer || 0;
        f.invulnerableTimer = Math.max(f.invulnerableTimer, 20);
        f.vx = 0;
        if (timer > 25) {
          f.vy = 0;
          f.isGrounded = false;
          return;
        } else if (timer > 0) {
          const landProg = (25 - timer) / 25;
          const apexY = 150;
          const groundY = GROUND_Y - f.height;
          f.y = apexY + landProg * (groundY - apexY);
          f.vy = 0;
          if (f.y >= groundY - 1) {
            f.y = groundY;
            f.isGrounded = true;
          }
          return;
        }
      }
    }

    // DYNAMIC GRAVITY AXIS (C-MOON GRAVITY MECHANIC)
    const axis = this.activeGravityAxis || 'down';
    const arenaW = this.getArenaWidth();

    if (axis === 'up') {
      f.vy -= GRAVITY * dt * 1.2;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      // Standing on ceiling (y = 60)
      if (f.y <= 60) {
        f.y = 60;
        f.vy = 0;
        f.isGrounded = true;
      } else {
        f.isGrounded = false;
      }
      if (f.y + f.height >= GROUND_Y) {
        f.y = GROUND_Y - f.height;
        f.vy = 0;
      }

    } else if (axis === 'right') {
      // Standing on Right Wall (x = arenaW - 60 - height)
      f.vx += GRAVITY * dt * 1.5;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      const rightWallGround = arenaW - 60 - f.height;
      if (f.x >= rightWallGround) {
        f.x = rightWallGround;
        f.vx = 0;
        f.isGrounded = true;
      } else {
        f.isGrounded = false;
      }
      if (f.x <= 40) {
        f.x = 40;
        f.vx = 0;
      }
      if (f.y <= 40) f.y = 40;
      if (f.y + f.height >= GROUND_Y) f.y = GROUND_Y - f.height;

    } else if (axis === 'left') {
      // Standing on Left Wall (x = 60)
      f.vx -= GRAVITY * dt * 1.5;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      if (f.x <= 60) {
        f.x = 60;
        f.vx = 0;
        f.isGrounded = true;
      } else {
        f.isGrounded = false;
      }
      if (f.x + f.width >= arenaW - 40) {
        f.x = arenaW - 40 - f.width;
        f.vx = 0;
      }
      if (f.y <= 40) f.y = 40;
      if (f.y + f.height >= GROUND_Y) f.y = GROUND_Y - f.height;

    } else {
      // Default 'down' gravity
      f.vy += GRAVITY * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      if (f.action === 'ragdoll' || f.isRagdoll) {
        f.ragdollAngle = (f.ragdollAngle || 0) + (f.ragdollAngularVel || 0.18) * dt;
        f.vx *= 0.985; // Natural air drag deceleration
        if (Math.random() < 0.25) {
          this.addSpark(f.x + f.width / 2, f.y + f.height / 2, 'rgba(255, 255, 255, 0.35)');
        }
      }

      if (f.y + f.height >= GROUND_Y) {
        if (f.action === 'ragdoll' || f.isRagdoll) {
          f.y = GROUND_Y - f.height;
          // Check ground bounce: at most 1 soft impact thud bounce if falling at high speed
          if (f.vy > 4.5 && (f.ragdollBounces || 0) < 1) {
            f.vy = -Math.min(2.4, f.vy * 0.22); // Very soft low bounce
            f.vx *= 0.52; // Strong ground friction on impact
            f.ragdollAngularVel = (f.ragdollAngularVel || 0.1) * 0.35;
            f.ragdollBounces = 1;
            f.isGrounded = false;
            soundManager.playHeavyImpact();
            this.addShockwave(f.x + f.width / 2, GROUND_Y - 4, '#f43f5e');
            for (let s = 0; s < 4; s++) {
              this.addSpark(f.x + f.width / 2 + (Math.random() - 0.5) * 20, GROUND_Y - 4, '#94a3b8');
            }
            this.screenShake = Math.max(this.screenShake, 3.5);
          } else {
            f.vy = 0;
            f.isGrounded = true;
            f.vx *= 0.62; // Smooth ground slide deceleration
            f.ragdollAngularVel = (f.ragdollAngularVel || 0) * 0.45;
            f.ragdollSlideTimer = (f.ragdollSlideTimer || 0) + 1;
            if (Math.abs(f.vx) > 1.8 && Math.random() < 0.35) {
              this.addSpark(f.x + f.width / 2, GROUND_Y - 2, '#cbd5e1');
            }
            // Settle quickly and smoothly into knockdown
            if (Math.abs(f.vx) < 1.0 || (f.ragdollTimer || 0) <= 0 || f.ragdollSlideTimer > 8) {
              f.isRagdoll = false;
              f.ragdollAngle = 0;
              f.ragdollAngularVel = 0;
              f.ragdollSlideTimer = 0;
              if (f.hp <= 0) {
                f.action = 'dead';
              } else {
                f.action = 'knockdown';
                f.actionTimer = 20;
                f.actionDuration = 20;
              }
              soundManager.playHit(false);
              this.addShockwave(f.x + f.width / 2, GROUND_Y - 4, '#94a3b8');
            }
          }
        } else {
          f.y = GROUND_Y - f.height;
          f.vy = 0;
          f.isGrounded = true;
        }
      } else {
        f.isGrounded = false;
      }
      if (f.y <= 40) {
        f.y = 40;
        if (f.action === 'ragdoll' || f.isRagdoll) {
          f.vy = Math.min(1.5, Math.abs(f.vy) * 0.2); // Gentle drop from ceiling without bounce
          f.ragdollAngularVel = -(f.ragdollAngularVel || 0.1) * 0.4;
        } else {
          f.vy = 0;
        }
      }
    }

    // Check Gravity Slam Impact on surface landing
    if (f.gravitySlamArmed && f.isGrounded) {
      f.gravitySlamArmed = false;
      const slamDamage = 28;
      f.hp = Math.max(0, f.hp - slamDamage);
      this.screenShake = Math.max(this.screenShake, 16);
      soundManager.playHit(true);
      const cx = f.x + f.width / 2;
      const cy = f.y + f.height / 2;
      this.addShockwave(cx, cy, '#10b981');
      for (let i = 0; i < 8; i++) {
        this.addSpark(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40, '#34d399');
      }
      this.addTextParticle(cx, cy - 45, '💥 GRAVITY IMPACT SLAM! (-28 HP)', '#34d399');
    }

    // Young Joseph NIGERUNDAYO Ultimate runs through wall and off-screen
    if (f.charId === 'joseph_young' && f.action === 'young_joseph_ultimate') {
      return;
    }

    const currentArenaWidth = this.getArenaWidth();

    const incomingVx = f.vx;
    if (f.x < 30) {
      const isHighVelocityLeft = incomingVx < -7.0 && (f.action === 'knockback' || f.action === 'hit' || f.action === 'ragdoll' || f.isRagdoll || f.hitStun > 10);
      if (isHighVelocityLeft) {
        // High-velocity wall impact (Wall Crash!)
        const splatDmg = Math.min(40, Math.round(Math.abs(incomingVx) * 1.6));
        f.hp = Math.max(0, f.hp - splatDmg);
        this.screenShake = Math.max(this.screenShake, 14);
        soundManager.playHit(true);
        this.addShockwave(30, f.y + f.height / 2, '#facc15');
        this.addSpark(30, f.y + f.height / 2, '#ffffff');

        // WALL DAMAGE & BREAK CHECK (Only if wall is not already broken!)
        if (!this.isWallBroken) {
          const wallDamage = Math.round(Math.abs(incomingVx) * 4.8);
          this.wallHpLeft = Math.max(0, this.wallHpLeft - wallDamage);

          if (this.wallHpLeft <= 0 && !this.wallBreakState.isActive) {
            const opponent = f.id === 'player' ? this.ai : this.player;
            this.triggerWallBreak('left', f, opponent);
            return;
          } else if (this.wallHpLeft <= 50) {
            this.addTextParticle(60, f.y - 45, `⚠️ WALL FRACTURE! (${this.wallHpLeft}%)`, '#f59e0b');
            this.spawnDebris(30, f.y + f.height / 2, 8, 'left');
          } else {
            this.addTextParticle(60, f.y - 35, `💥 WALL CRASH! (-${splatDmg} HP)`, '#facc15');
          }
        } else {
          this.addTextParticle(60, f.y - 35, `💥 BOUNDARY IMPACT! (-${splatDmg} HP)`, '#facc15');
        }

        f.vx = 6.5; // Wall bounce
        f.vy = -3.5;
        f.isGrounded = false;
        f.hitStun = Math.max(f.hitStun, 25);
        if (f.action === 'ragdoll' || f.isRagdoll) {
          f.ragdollAngularVel = -(f.ragdollAngularVel || 0.1) * 0.4;
        }
      } else if (f.action === 'ragdoll' || f.isRagdoll) {
        f.vx = Math.min(1.5, Math.abs(f.vx) * 0.12);
        f.ragdollAngularVel = (f.ragdollAngularVel || 0.1) * 0.25;
        soundManager.playHit(true);
        this.addShockwave(30, f.y + f.height / 2, '#f43f5e');
        this.addSpark(30, f.y + f.height / 2, '#ffffff');
        this.screenShake = Math.max(this.screenShake, 3.5);
      } else {
        f.vx = 0;
      }
      f.x = 30;
    } else if (f.x + f.width > currentArenaWidth - 30) {
      const isHighVelocityRight = incomingVx > 7.0 && (f.action === 'knockback' || f.action === 'hit' || f.action === 'ragdoll' || f.isRagdoll || f.hitStun > 10);
      if (isHighVelocityRight) {
        // High-velocity wall impact (Wall Crash!)
        const splatDmg = Math.min(40, Math.round(Math.abs(incomingVx) * 1.6));
        f.hp = Math.max(0, f.hp - splatDmg);
        this.screenShake = Math.max(this.screenShake, 14);
        soundManager.playHit(true);
        this.addShockwave(currentArenaWidth - 30, f.y + f.height / 2, '#facc15');
        this.addSpark(currentArenaWidth - 30, f.y + f.height / 2, '#ffffff');

        // WALL DAMAGE & BREAK CHECK (Only if wall is not already broken!)
        if (!this.isWallBroken) {
          const wallDamage = Math.round(Math.abs(incomingVx) * 4.8);
          this.wallHpRight = Math.max(0, this.wallHpRight - wallDamage);

          if (this.wallHpRight <= 0 && !this.wallBreakState.isActive) {
            const opponent = f.id === 'player' ? this.ai : this.player;
            this.triggerWallBreak('right', f, opponent);
            return;
          } else if (this.wallHpRight <= 50) {
            this.addTextParticle(currentArenaWidth - 60, f.y - 45, `⚠️ WALL FRACTURE! (${this.wallHpRight}%)`, '#f59e0b');
            this.spawnDebris(currentArenaWidth - 30, f.y + f.height / 2, 8, 'right');
          } else {
            this.addTextParticle(currentArenaWidth - 60, f.y - 35, `💥 WALL CRASH! (-${splatDmg} HP)`, '#facc15');
          }
        } else {
          this.addTextParticle(currentArenaWidth - 60, f.y - 35, `💥 BOUNDARY IMPACT! (-${splatDmg} HP)`, '#facc15');
        }

        f.vx = -6.5; // Wall bounce
        f.vy = -3.5;
        f.isGrounded = false;
        f.hitStun = Math.max(f.hitStun, 25);
        if (f.action === 'ragdoll' || f.isRagdoll) {
          f.ragdollAngularVel = -(f.ragdollAngularVel || 0.1) * 0.4;
        }
      } else if (f.action === 'ragdoll' || f.isRagdoll) {
        f.vx = -Math.min(1.5, Math.abs(f.vx) * 0.12);
        f.ragdollAngularVel = -(f.ragdollAngularVel || 0.1) * 0.25;
        soundManager.playHit(true);
        this.addShockwave(currentArenaWidth - 30, f.y + f.height / 2, '#f43f5e');
        this.addSpark(currentArenaWidth - 30, f.y + f.height / 2, '#ffffff');
        this.screenShake = Math.max(this.screenShake, 3.5);
      } else {
        f.vx = 0;
      }
      f.x = currentArenaWidth - 30 - f.width;
    }
  }

  public spawnDebris(x: number, y: number, count: number = 15, direction: 'left' | 'right' | 'both' = 'both') {
    const colors = ['#cbd5e1', '#94a3b8', '#64748b', '#b45309', '#f8fafc', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() * 8 + 3) * (direction === 'left' ? 1 : direction === 'right' ? -1 : (Math.random() > 0.5 ? 1 : -1));
      const vy = -(Math.random() * 8 + 3);
      this.particles.push({
        id: this.particleId++,
        x,
        y,
        vx,
        vy,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 75,
        maxLife: 75,
        type: 'debris',
        rotation: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.4,
        bounceCount: 0,
      });
    }
  }

  public triggerWallBreak(side: 'left' | 'right', victim: Fighter, attacker: Fighter) {
    if (this.isWallBroken) return; // Prevent any secondary / infinite wall break loop!
    const baseArenaW = ARENA_WIDTH;
    this.stagePhase = 1;
    this.isWallBroken = true;
    this.isStageExpanded = true;
    this.stageExpansionWidth = baseArenaW; // Expand total arena width by +1080 (Total = 2160)
    const mapId = this.matchConfig?.map?.id || 'cairo_bridge';

    let title = 'SUB-ARENA: INNER SANCTUM';
    if (mapId === 'cairo_bridge' || mapId === 'cairo_street') {
      title = 'CAIRO CLOCKTOWER & ROOFTOP';
    } else if (mapId === 'morioh_sunset') {
      title = "REIMI'S GHOST ALLEY & GHOST ROAD";
    } else if (mapId === 'rome_colosseum') {
      title = 'SAN GIROLAMO ANCIENT CATACOMBS';
    } else if (mapId === 'joestar_mansion') {
      title = 'BURNING COURTYARD & CLOCK GROUNDS';
    } else if (mapId === 'arabian_desert') {
      title = 'SCORCHING MIRAGE OASIS';
    } else if (mapId === 'vancouver_port') {
      title = 'SEATTLE UNDERGROUND WAREHOUSE';
    } else if (mapId === 'cape_canaveral') {
      title = 'ZERO-GRAVITY ORBIT LAUNCH TOWER';
    } else if (mapId === 'air_supplena') {
      title = 'HELL CLIMB SANCTUARY';
    }

    this.subArenaTitle = title;
    this.wallBreakBannerTimer = 140;
    this.wallBreakState = {
      isActive: true,
      side,
      timer: 36,
      maxTimer: 36,
      subArenaTitle: title,
      stagePhase: this.stagePhase,
      victimId: victim.id,
      attackerId: attacker.id,
      isRightWallBroken: side === 'right',
      isLeftWallBroken: side === 'left',
      stageExpansionWidth: this.stageExpansionWidth,
      wallBreakThresholdX: baseArenaW,
    };

    // Massive screen shake & heavy sound detonation
    this.screenShake = 22;
    soundManager.playHeavyImpact();
    soundManager.playHit(true);

    if (side === 'right') {
      this.isRightWallBroken = true;
      this.wallHpRight = 0; // Wall is permanently shattered into an open passageway!
      this.subArenaStartX = baseArenaW; // 1080
      
      const breakX = baseArenaW;
      const breakY = victim.y + victim.height / 2;
      this.spawnDebris(breakX, breakY, 50, 'both');
      this.addShockwave(breakX, breakY, '#f59e0b');
      this.addShockwave(breakX, breakY, '#ffffff');
      this.addShockwave(breakX, breakY, '#38bdf8');

      // Spawn interactive sub-arena hazards in the new expanded right sector [1080 .. 2160]
      this.spawnSubArenaHazards(mapId, this.subArenaStartX);

      // Victim is blasted seamlessly THROUGH the broken wall into the new extended sector (NO TELEPORT)
      victim.x = baseArenaW + 40;
      victim.vx = 10.5; // Blasting rightward into Sub-Arena
      victim.vy = -4.8;
      victim.action = 'knockback';
      victim.hitStun = 38;
      victim.facing = 'left';

      // Attacker surges forward through the breach to follow
      attacker.x = baseArenaW - 65;
      attacker.vx = 5.2;
      attacker.facing = 'right';

      // Announce Wall Break and Map Expansion
      this.addTextParticle(baseArenaW, 120, '💥 WALL BREAK DETONATION!! 💥', '#facc15');
      this.addTextParticle(baseArenaW, 155, `📍 STAGE EXPANDED: ${title} (SLIDE SCROLL UNLOCKED!)`, '#38bdf8');
    } else {
      // Smashed through Left Wall: Shift current world rightwards so coordinates remain positive
      const shift = baseArenaW;
      this.player.x += shift;
      this.ai.x += shift;
      if (this.teammate) this.teammate.x += shift;
      for (const v of this.vampires) if (v) v.x += shift;
      for (const h of this.arenaHazards) h.x += shift;
      for (const p of this.projectiles) p.x += shift;

      this.isLeftWallBroken = true;
      this.wallHpLeft = 0;
      this.subArenaStartX = 0; // Sub-arena is now at 0..1080, main arena is at 1080..2160

      const breakX = shift;
      const breakY = victim.y + victim.height / 2;
      this.spawnDebris(breakX, breakY, 50, 'both');
      this.addShockwave(breakX, breakY, '#f59e0b');
      this.addShockwave(breakX, breakY, '#ffffff');

      // Spawn interactive sub-arena hazards in the new left sector [0 .. 1080]
      this.spawnSubArenaHazards(mapId, 0);

      victim.x = shift - 120;
      victim.vx = -10.5;
      victim.vy = -4.8;
      victim.action = 'knockback';
      victim.hitStun = 38;
      victim.facing = 'right';

      attacker.x = shift + 65;
      attacker.vx = -5.2;
      attacker.facing = 'left';

      this.addTextParticle(shift, 120, '💥 WALL BREAK DETONATION!! 💥', '#facc15');
      this.addTextParticle(shift, 155, `📍 STAGE EXPANDED: ${title} (SLIDE SCROLL UNLOCKED!)`, '#38bdf8');
    }
  }

  public updateValentineClones(f: Fighter, opponent?: Fighter) {
    if (!f.isClone && f.valentineClones && f.valentineClones.length > 0) {
      const opp = opponent || this.ai;
      for (let i = f.valentineClones.length - 1; i >= 0; i--) {
        const clone = f.valentineClones[i];
        if (!clone.cloneLifeTimer) clone.cloneLifeTimer = VALENTINE_CLONE_DURATION;
        clone.cloneLifeTimer--;
        if (clone.hp <= 0 || clone.cloneLifeTimer <= 0) {
          soundManager.playFlagSandwich();
          this.addSpark(clone.x + clone.width / 2, clone.y + clone.height / 2, '#f472b6');
          this.addTextParticle(clone.x + clone.width / 2, clone.y - 35, clone.hp <= 0 ? '👥 CLONE DESTROYED!' : '👥 CLONE EXPIRED!', '#f472b6');
          f.valentineClones.splice(i, 1);
        } else {
          clone.team = f.team;
          clone.isClone = true;
          clone.isValentineClone = true;
          const cloneTargets = this.getTargetsForAttacker(clone, opp);
          let cloneTarget = cloneTargets[0] || opp;
          if (cloneTargets.length > 1) {
            let minDist = Infinity;
            for (const ct of cloneTargets) {
              const d = Math.abs(ct.x - clone.x);
              if (d < minDist) {
                minDist = d;
                cloneTarget = ct;
              }
            }
          }
          const cloneInput = this.getAIControllerForFighter(clone.id).update(
            clone,
            cloneTargets.length > 0 ? cloneTargets : [],
            this.matchConfig,
            this.activeGravityAxis,
            this.getArenaWidth()
          );
          this.updateFighter(clone, cloneInput, cloneTarget);
        }
      }
    }
  }

  private updateStandState(f: Fighter) {
    if (!f.hasStand || f.charId === 'vampire') {
      f.isStandActive = false;
      f.standAlpha = 0;
      return;
    }
    const targetAlpha = f.isStandActive ? 1 : 0;
    if (f.standAlpha < targetAlpha) {
      f.standAlpha = Math.min(1, f.standAlpha + 0.1);
    } else if (f.standAlpha > targetAlpha) {
      f.standAlpha = Math.max(0, f.standAlpha - 0.1);
    }
  }

  // --- PROJECTILES UPDATE ---
  private updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      // If Time Stop is active, freeze any projectile immediately!
      if (this.timeStopState.isActive) {
        if (!p.isFrozenInTime) {
          p.isFrozenInTime = true;
          if (p.baseVx === undefined || p.baseVx === 0) p.baseVx = p.vx;
          if (p.baseVy === undefined || p.baseVy === 0) p.baseVy = p.vy;
          p.vx = 0;
          p.vy = 0;
        }
      }

      // If frozen in stopped time, skip movement, collision, and life decay
      if (p.isFrozenInTime) {
        continue;
      }

      // Attacker and team resolution for collision, friendly fire check & deflection (including Valentine Clones)
      const resolvedOwner = this.getFighterById(p.ownerId);
      const isPlayerSideOwner =
        p.ownerId === 'player' ||
        p.ownerId === 'teammate' ||
        p.ownerId.includes('teamA') ||
        (resolvedOwner ? resolvedOwner.team === this.player.team : false);
      const attacker = resolvedOwner || (isPlayerSideOwner ? this.player : this.ai);
      const attackerTeam = resolvedOwner ? resolvedOwner.team : (isPlayerSideOwner ? this.player.team : this.ai.team);

      // 1. Check Rock Shield wall block
      const opponentFighter = (attackerTeam === this.player.team) ? this.ai : this.player;
      if (opponentFighter.rockShieldTimer && opponentFighter.rockShieldTimer > 0 && opponentFighter.rockShieldX !== undefined) {
        const wallX = opponentFighter.rockShieldX;
        // Check if projectile is crossing the wall
        const crossedWall = p.vx > 0 ? (p.x <= wallX && p.x + p.vx >= wallX) : (p.x >= wallX && p.x + p.vx <= wallX);
        if (crossedWall) {
          this.addSpark(wallX, p.y, '#06b6d4');
          this.addTextParticle(wallX, p.y - 15, '🚫 WALL BLOCKED!', '#06b6d4');
          soundManager.playHit(true);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      // Check Perstein Invisible Drive Chain Deflection (auto-manifests to intercept incoming projectiles)
      const persteinDefenders = this.getAllActiveFighters().filter(f => f.charId === 'perstein' && f.persteinDeflectionTimer && f.persteinDeflectionTimer > 0 && f.team !== attackerTeam && f.id !== p.ownerId);
      let pDeflected = false;
      for (const def of persteinDefenders) {
        const defCenterX = def.x + def.width / 2;
        const defCenterY = def.y + def.height / 2;
        const targetDist = Math.hypot(defCenterX - p.x, defCenterY - p.y);
        if (targetDist < 110) {
          def.persteinDeflectReactionTimer = 24;
          def.persteinDeflectImpactX = p.x;
          def.persteinDeflectImpactY = p.y;
          def.persteinDeflectAngle = Math.atan2(p.y - defCenterY, p.x - defCenterX);
          this.addSpark(p.x, p.y, '#38bdf8');
          for (let s = 0; s < 8; s++) {
            this.addSpark(p.x + (Math.random() * 24 - 12), p.y + (Math.random() * 24 - 12), '#facc15');
          }
          this.addShockwave(p.x, p.y, '#38bdf8');
          this.addTextParticle(p.x, p.y - 20, '⚙️ INVISIBLE DRIVE CHAIN: INTERCEPT!', '#38bdf8');
          soundManager.playPersteinDeflection();
          soundManager.playHit(true);
          this.projectiles.splice(i, 1);
          pDeflected = true;
          break;
        }
      }
      if (pDeflected) continue;

      // 2. Custom behavior for Josuke Homing Shard (restoring movement)
      if (p.type === 'josuke_shard') {
        const josuke = (p.ownerId === 'player' || p.ownerId === 'teammate') ? (p.ownerId === 'player' ? this.player : this.teammate) : this.ai;
        const targetFighter = (p.ownerId === 'player' || p.ownerId === 'teammate') ? this.ai : this.player;
        if (p.life < 42 && josuke.homingShardState !== 'restoring') {
          josuke.homingShardState = 'restoring';
        }

        if (josuke.homingShardState === 'restoring') {
          // Move towards Josuke's center coordinates
          const dx = (josuke.x + josuke.width / 2) - p.x;
          const dy = (josuke.y + josuke.height / 2) - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 15) {
            p.vx = (dx / dist) * JOSUKE_HOMING_SHARD_SPEED;
            p.vy = (dy / dist) * JOSUKE_HOMING_SHARD_SPEED;
          } else {
            p.life = 0; // Reached Josuke
            josuke.homingShardState = 'idle';
            josuke.homingShardActive = false;
          }

          // Fetch target if close to returning shard
          const targetDistX = Math.abs(targetFighter.x + targetFighter.width / 2 - p.x);
          const targetDistY = Math.abs(targetFighter.y + targetFighter.height / 2 - p.y);
          if (targetDistX < 50 && targetDistY < 60) {
            targetFighter.x = p.x - targetFighter.width / 2;
            targetFighter.y = p.y - targetFighter.height / 2;
            targetFighter.vx = p.vx;
            targetFighter.vy = p.vy;
            targetFighter.hitStun = Math.max(targetFighter.hitStun, 6);
            if (this.frameCount % 2 === 0) {
              this.addSpark(targetFighter.x + targetFighter.width / 2, targetFighter.y + targetFighter.height / 2, '#06b6d4');
            }
          }
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // Gappy bubble projectile particle trails
      if (p.type.startsWith('gappy_') && this.frameCount % 2 === 0) {
        this.addSpark(p.x + Math.random() * p.width, p.y + Math.random() * p.height, p.type === 'gappy_go_beyond' ? '#ffffff' : '#7dd3fc');
      }

      // Check Gappy Plunder Bubble ground landing
      if (p.type === 'gappy_plunder_bubble' && p.y >= GROUND_Y - 25) {
        const stripX = p.x;
        if (!attacker.gappyFrictionStrips) attacker.gappyFrictionStrips = [];
        attacker.gappyFrictionStrips.push({
          id: Date.now() + Math.random(),
          x: stripX,
          y: GROUND_Y - 10,
          width: 150,
          timer: GAPPY_FRICTION_STRIP_DURATION,
        });
        soundManager.playBubblePlunder();
        this.addShockwave(stripX, GROUND_Y - 15, '#38bdf8');
        this.addTextParticle(stripX, GROUND_Y - 35, '🧼 PLUNDER STRIP: FRICTION = 0', '#7dd3fc');
        for (let s = 0; s < 10; s++) {
          this.addSpark(stripX + (Math.random() * 80 - 40), GROUND_Y - 15, '#38bdf8');
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      const isAttackerParallel = p.isParallelWorld !== undefined ? p.isParallelWorld : (attacker ? !!attacker.isParallelWorld : false);
      const possibleTargets: Fighter[] = [];
      const candidateFighters = this.getAllActiveFighters();
      for (const f of candidateFighters) {
        if (f && f.hp > 0 && f.id !== p.ownerId && f.id !== attacker?.id && f.team !== attackerTeam) {
          // Young Joseph auto-evades all incoming projectiles while in Ultimate
          if (f.charId === 'joseph_young' && f.action === 'young_joseph_ultimate') {
            continue;
          }
          if (!!f.isParallelWorld === isAttackerParallel) {
            possibleTargets.push(f);
          }
        }
      }

      // Special Meteor Ground & Proximity Impact
      if (p.type === 'calamity_meteor' && p.y >= GROUND_Y - 55) {
        soundManager.playMeteorExplosion();
        this.screenShake = 26;
        const meteorCenterX = p.x + p.width / 2;
        const meteorCenterY = GROUND_Y - 20;
        this.addShockwave(meteorCenterX, meteorCenterY, '#ef4444');
        this.addShockwave(meteorCenterX, meteorCenterY, '#f97316');
        this.addTextParticle(meteorCenterX, meteorCenterY - 45, '☄️💥 [EXTINCTION METEOR CRASH!]', '#ef4444');
        for (let s = 0; s < 8; s++) {
          this.addSpark(meteorCenterX + (Math.random() * 40 - 20), meteorCenterY + (Math.random() * 20 - 10), '#f97316');
        }

        for (const t of possibleTargets) {
          if (t.charId === 'dipez' && t.dipezForm === 'pure_light') {
            this.triggerDipezAutoBlink(t, attacker);
            continue;
          }
          const distToMeteor = Math.abs((t.x + t.width / 2) - meteorCenterX);
          if (distToMeteor < 280) {
            const blastDir = t.x > meteorCenterX ? 1 : -1;
            this.applyRawDamage(t, p.damage, blastDir * 24, -18, attacker);
            t.hitStun = 60;
            t.isGrounded = false;
          }
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      const isStatusProjectile = p.type === 'rock_insect';
      const hitbox: Hitbox = {
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        damage: p.damage,
        knockbackX: p.knockbackX,
        knockbackY: p.knockbackY,
        isSkill: !isStatusProjectile,
        isPoison: p.type === 'rock_insect',
        noRagdoll: isStatusProjectile,
      };

      // Special Calamity Car Multi-Target Penetration Impact ("mental gak nembus, universal untuk lawan")
      if (p.type === 'calamity_car') {
        const arenaW = this.getArenaWidth();
        if (p.life <= 0 || (p.vx > 0 && p.x > arenaW + 350) || (p.vx < 0 && p.x < -p.width - 350)) {
          this.projectiles.splice(i, 1);
          continue;
        }
        if (!p.hitTargetIds) {
          p.hitTargetIds = [];
        }
        for (const t of possibleTargets) {
          if (t.hp > 0 && !p.hitTargetIds.includes(t.id) && this.checkCollision(hitbox, t)) {
            p.hitTargetIds.push(t.id);
            if (t.charId === 'dipez' && t.dipezForm === 'pure_light') {
              this.triggerDipezAutoBlink(t, attacker);
              continue;
            }
            if (t.isTimeEraseActive || (t.charId === 'king_crimson' && t.isTimeEraseActive)) {
              this.applyHit(attacker, t, hitbox);
              this.addSpark(p.x, p.y, '#fb7185');
              continue;
            }
            soundManager.playCarCrash();
            this.screenShake = 18;
            this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, p.color || '#ef4444');
            this.addTextParticle(t.x + t.width / 2, t.y - 45, '💥 [VEHICLE CALAMITY IMPACT!]', p.color || '#ef4444');
            t.isGrounded = false;
            t.hitStun = 50;
            t.action = 'knockback';
            t.actionTimer = 45;
            t.actionDuration = 45;
            t.vx = (p.vx > 0 ? 1 : -1) * 28;
            t.vy = -14;
            t.invulnerableTimer = 0;
            this.applyHit(attacker, t, hitbox);
          }
        }
        continue; // Continues traveling across arena hitting all targets in its path!
      }

      // Special Dipez Laser Beam (Continuous Multi-Hit Stream, Pinned in Beam, Final Detonation)
      if (p.type === 'dipez_laser_beam') {
        if (p.life <= 0 || !attacker || attacker.hp <= 0 || attacker.action !== 'dipez_laser_cannon' || attacker.hitStun > 0) {
          this.projectiles.splice(i, 1);
          continue;
        }

        // Dynamically glue the laser beam origin to Dipez's firing hands across full screen length
        const dir = attacker.facing === 'right' ? 1 : -1;
        const beamLength = 1200;
        p.width = beamLength;
        p.height = 52;
        p.vx = dir;
        p.knockbackX = dir * 18;
        p.x = dir === 1 ? attacker.x + attacker.width - 15 : attacker.x - beamLength + 15;
        p.y = attacker.y + 12;

        const currentHitbox: Hitbox = {
          x: p.x,
          y: p.y,
          width: p.width,
          height: p.height,
          damage: p.damage,
          knockbackX: p.knockbackX,
          knockbackY: p.knockbackY,
        };

        const isEnding = p.life <= 2;

        for (const t of possibleTargets) {
          if (!t || t.hp <= 0 || t.id === attacker.id) continue;

          // Check if target is inside the active laser beam stream
          if (this.checkCollision(currentHitbox, t)) {
            if (t.charId === 'dipez' && t.dipezForm === 'pure_light') {
              this.triggerDipezAutoBlink(t, attacker);
              continue;
            }
            if (t.isTimeEraseActive || (t.charId === 'king_crimson' && t.isTimeEraseActive)) {
              this.applyHit(attacker, t, currentHitbox);
              this.addSpark(p.x + p.width / 2, p.y + p.height / 2, '#fb7185');
              continue;
            }

            // High-power laser penetrates any wakeup invulnerability
            t.invulnerableTimer = 0;

            const isTargetRagdoll = t.action === 'ragdoll' || !!t.isRagdoll;

            if (isEnding) {
              // Final Detonation Burst on beam conclusion!
              this.applyRawDamage(t, 26, isTargetRagdoll ? dir * 8 : dir * 22, isTargetRagdoll ? 0 : -12, attacker);
              if (!isTargetRagdoll) {
                t.action = 'knockback';
                t.actionTimer = 45;
                t.actionDuration = 45;
                t.vx = dir * 22;
                t.vy = -12;
                t.hitStun = 50;
                t.isGrounded = false;
              }
              this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#38bdf8');
              this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#ffffff');
              soundManager.playHeavyImpact();
              this.screenShake = Math.max(this.screenShake, 18);
            } else {
              // Continuous Multi-Hit Stream: Trap target in the beam!
              // If target is already in ragdoll, DO NOT cancel ragdoll action or ground them
              if (!isTargetRagdoll) {
                t.action = 'hit';
                t.actionTimer = 16;
                t.actionDuration = 16;
                t.hitStun = Math.max(t.hitStun, 16);
                t.isGrounded = true; // Pin upright so gravity cannot force knockdown during active beam
                t.vy = 0;
                t.vx = dir * 4.2; // Steady kinetic pushback along the laser
              }
              t.burnedTimer = Math.max(t.burnedTimer || 0, 180);

              if (p.life % 3 === 0) {
                this.applyRawDamage(t, 6, dir * 4.2, 0, attacker);
                this.screenShake = Math.max(this.screenShake, 5);
                this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#ffffff');
                this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 30, t.y + t.height / 2 + (Math.random() - 0.5) * 25, '#38bdf8');
                this.addSpark(t.x + t.width / 2 + (Math.random() - 0.5) * 35, t.y + t.height / 2 + (Math.random() - 0.5) * 25, '#fef08a');
              }
            }
          }
        }
        continue; // Keep the laser in play for its full life duration!
      }

      // Special Dipez Map Laser (Continuous Orbital Ion Bombardment across Full Map)
      if (p.type === 'dipez_map_laser_beam') {
        if (p.life <= 0 || !attacker || attacker.hp <= 0 || attacker.action !== 'dipez_map_laser' || attacker.hitStun > 0) {
          this.projectiles.splice(i, 1);
          continue;
        }

        const isEnding = p.life <= 2;

        for (const t of possibleTargets) {
          if (!t || t.hp <= 0 || t.id === attacker.id) continue;

          if (t.charId === 'dipez' && t.dipezForm === 'pure_light') {
            this.triggerDipezAutoBlink(t, attacker);
            continue;
          }
          if (t.isTimeEraseActive || (t.charId === 'king_crimson' && t.isTimeEraseActive)) {
            continue;
          }

          const isTargetRagdoll = t.action === 'ragdoll' || !!t.isRagdoll;

          if (isEnding) {
            // Final apocalyptic ground detonation
            const launchDir = t.x > attacker.x ? 1 : -1;
            this.applyRawDamage(t, 32, isTargetRagdoll ? launchDir * 8 : launchDir * 18, isTargetRagdoll ? 0 : -14, attacker);
            if (!isTargetRagdoll) {
              t.action = 'knockback';
              t.actionTimer = 45;
              t.actionDuration = 45;
              t.vx = launchDir * 18;
              t.vy = -14;
              t.hitStun = 50;
              t.isGrounded = false;
            }
            this.addShockwave(t.x + t.width / 2, t.y + t.height / 2, '#ffffff');
            soundManager.playHeavyImpact();
            this.screenShake = Math.max(this.screenShake, 26);
          } else {
            // Continuous orbital ion storm strikes every 4 frames
            t.invulnerableTimer = 0;
            if (!isTargetRagdoll) {
              t.action = 'hit';
              t.actionTimer = 16;
              t.actionDuration = 16;
              t.hitStun = Math.max(t.hitStun, 14);
              t.isGrounded = true;
              t.vy = 0;
            }
            t.burnedTimer = Math.max(t.burnedTimer || 0, 240);

            if (p.life % 4 === 0) {
              this.applyRawDamage(t, 8, 0, 0, attacker);
              this.screenShake = Math.max(this.screenShake, 7);
              this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#38bdf8');
              this.addSpark(t.x + t.width / 2, t.y + t.height / 2, '#ffffff');
            }
          }
        }
        continue;
      }

      // Solar Flare Bomb Ground Impact & Detonation
      if (p.type === 'sun_flare_bomb' && p.y >= GROUND_Y - 25) {
        soundManager.playMeteorExplosion();
        this.screenShake = 8;
        const bombCenterX = p.x + p.width / 2;
        const bombCenterY = GROUND_Y - 15;
        this.addShockwave(bombCenterX, bombCenterY, '#ef4444');
        this.addShockwave(bombCenterX, bombCenterY, '#f97316');
        this.addTextParticle(bombCenterX, bombCenterY - 30, '💥 SOLAR FLARE BURST!', '#ef4444');
        for (let s = 0; s < 8; s++) {
          this.addSpark(bombCenterX + (Math.random() * 30 - 15), bombCenterY + (Math.random() * 20 - 10), '#f97316');
        }
        for (const t of possibleTargets) {
          if (Math.abs((t.x + t.width / 2) - bombCenterX) < 95) {
            this.applyRawDamage(t, p.damage, (t.x > bombCenterX ? 1 : -1) * 12, -8, attacker);
            t.burnedTimer = 180;
            t.hitStun = 32;
          }
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      let target: Fighter | null = null;

      for (const t of possibleTargets) {
        if (this.checkCollision(hitbox, t)) {
          target = t;
          break;
        }
      }

      if (target) {
        // VALENTINE CLONE COLT .45 REVOLVER BULLET IMPACT
        if (p.type === 'valentine_bullet') {
          this.applyHit(attacker, target, hitbox);
          soundManager.playHit(true);
          this.screenShake = Math.max(this.screenShake, 4);
          this.addShockwave(p.x, p.y, '#facc15');
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '💥 BULLET HIT! (-28 HP)', '#facc15');
          for (let s = 0; s < 6; s++) {
            this.addSpark(p.x + (Math.random() * 16 - 8), p.y + (Math.random() * 16 - 8), '#facc15');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

        // GAPPY BUBBLE PROJECTILE IMPACTS
        if (p.type === 'gappy_shave_bubble') {
          this.applyHit(attacker, target, hitbox);
          soundManager.playBubblePop();
          attacker.hp = Math.min(attacker.maxHp, attacker.hp + GAPPY_SHAVE_MOISTURE_LIFESTEAL);
          target.gappyAttackTheftTimer = GAPPY_SHAVE_MOISTURE_DURATION;
          this.addTextParticle(target.x + target.width / 2, target.y - 45, '✂️ ATTACK STOLEN (-50%)! (+45 HP)', '#0284c7');
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#0284c7');
          for (let s = 0; s < 10; s++) {
            this.addSpark(target.x + target.width / 2 + (Math.random() * 30 - 15), target.y + target.height / 2 + (Math.random() * 30 - 15), '#38bdf8');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

        if (p.type === 'gappy_barrage_bubble') {
          this.applyHit(attacker, target, hitbox);
          soundManager.playBubblePop();
          this.addShockwave(p.x, p.y, '#38bdf8');
          for (let s = 0; s < 5; s++) {
            this.addSpark(p.x + (Math.random() * 20 - 10), p.y + (Math.random() * 20 - 10), '#7dd3fc');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

        if (p.type === 'gappy_trap_bubble') {
          this.applyHit(attacker, target, hitbox);
          target.gappyTrappedTimer = GAPPY_TRAP_DURATION;
          soundManager.playBubblePop();
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#7dd3fc');
          this.addTextParticle(target.x + target.width / 2, target.y - 45, '🫧 SUSPENDED IN BUBBLE TRAP (3s)!', '#38bdf8');
          for (let s = 0; s < 14; s++) {
            this.addSpark(target.x + target.width / 2 + (Math.random() * 40 - 20), target.y + target.height / 2 + (Math.random() * 40 - 20), '#7dd3fc');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

        if (p.type === 'gappy_go_beyond') {
          if (target.charId === 'dipez' && target.dipezForm === 'pure_light') {
            this.triggerDipezAutoBlink(target, attacker);
            this.projectiles.splice(i, 1);
            continue;
          }
          target.hp = Math.max(0, target.hp - GAPPY_GO_BEYOND_TRUE_DAMAGE);
          target.hitStun = 60;
          target.vx = (p.vx > 0 ? 1 : -1) * 22;
          target.vy = -12;
          target.isGrounded = false;
          soundManager.playGoBeyondExplosion();
          this.screenShake = 24;
          this.universeResetFlash = 18;
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ffffff');
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#38bdf8');
          this.addTextParticle(target.x + target.width / 2, target.y - 55, '🌌 ★ GO BEYOND: LOGIC PIERCED! ★', '#38bdf8');
          for (let b = 0; b < 24; b++) {
            this.addSpark(target.x + target.width / 2 + (Math.random() * 60 - 30), target.y + target.height / 2 + (Math.random() * 60 - 30), b % 2 === 0 ? '#38bdf8' : '#ffffff');
          }
          this.projectiles.splice(i, 1);
          continue;
        }
        if (target.charId === 'pucci' && target.pucciForm === 'cmoon' && target.cmoonShieldTimer && target.cmoonShieldTimer > 0) {
          p.vx = -p.vx * 1.2;
          p.ownerId = target.id;
          soundManager.playCmoonGravity();
          this.addShockwave(p.x, p.y, '#22c55e');
          this.addTextParticle(target.x + target.width / 2, target.y - 30, '🛡️ GRAVITY DEFLECT!', '#22c55e');
          continue;
        }
        if (p.type === 'pucci_disc') {
          target.discFrozenTimer = PUCCI_STAND_DISC_FREEZE_DURATION;
          soundManager.playPucciDisc();
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '💿 DISC COMMAND: FREEZE 1.5s!', '#e2e8f0');
        }
        if (target.isTimeEraseActive || (target.charId === 'king_crimson' && target.isTimeEraseActive)) {
          this.applyHit(attacker, target, hitbox);
          this.addSpark(p.x, p.y, '#fb7185');
          this.projectiles.splice(i, 1);
          continue;
        }
        if (target.isEpitaphActive || (target.charId === 'king_crimson' && ((target.epitaphTimer && target.epitaphTimer > 0) || target.action === 'epitaph_forecast'))) {
          this.triggerEpitaphCounter(target, attacker);
          this.addSpark(p.x, p.y, '#fb7185');
          this.projectiles.splice(i, 1);
          continue;
        }
        if (p.type === 'calamity_meteor') {
          soundManager.playMeteorExplosion();
          this.screenShake = 26;
          this.addShockwave(target.x + target.width / 2, GROUND_Y - 20, '#ef4444');
          this.addShockwave(target.x + target.width / 2, GROUND_Y - 20, '#f97316');
          this.addTextParticle(target.x + target.width / 2, target.y - 50, '☄️💥 [DIRECT METEOR EXTINCTION!]', '#ef4444');
          target.isGrounded = false;
          target.hitStun = 60;
          this.applyHit(attacker, target, hitbox);
          this.projectiles.splice(i, 1);
          continue;
        }
        if (p.type === 'blood_blind') {
          target.blindedTimer = FLESH_THROW_BLIND_DURATION;
          target.bloodBlindedTimer = FLESH_THROW_BLIND_DURATION;
          target.hitStun = 45;
          for (let b = 0; b < 22; b++) {
            this.addSpark(
              target.x + target.width / 2 + (Math.random() - 0.5) * 32,
              target.y + 18 + (Math.random() - 0.5) * 18,
              b % 2 === 0 ? '#450a0a' : '#991b1b'
            );
          }
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '🩸 EYES BLINDED BY DARK BLOOD!', '#991b1b');
        }
        if (p.type === 'doppio_scalpel') {
          target.bleedTimer = Math.max(target.bleedTimer || 0, 180);
          target.hitStun = Math.max(target.hitStun, 28);
          soundManager.playRazorCut();
          for (let b = 0; b < 10; b++) {
            this.addSpark(
              target.x + target.width / 2 + (Math.random() - 0.5) * 26,
              target.y + 22 + (Math.random() - 0.5) * 22,
              b % 2 === 0 ? '#dc2626' : '#e2e8f0'
            );
          }
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '🔪 IRON SCALPEL SLICE! (BLEED)', '#f43f5e');
        }
        if (p.type === 'rock_insect') {
          target.poisonTimer = Math.max(target.poisonTimer || 0, TOORU_ROCK_INSECT_POISON_TICKS);
          hitbox.noRagdoll = true;
          hitbox.isPoison = true;
          this.applyHit(attacker, target, hitbox);
          soundManager.playRazorCut();
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '🦂 POISON INFECTION! (SLOW + DOT)', '#84cc16');
          for (let s = 0; s < 8; s++) {
            this.addSpark(target.x + target.width / 2 + (Math.random() - 0.5) * 20, target.y + target.height / 2 + (Math.random() - 0.5) * 20, '#84cc16');
          }
          this.projectiles.splice(i, 1);
          continue;
        }
        if (p.type === 'josuke_shard') {
          attacker.homingShardState = 'restoring';
          target.hitStun = Math.max(target.hitStun, 40);
          this.addTextParticle(target.x + target.width / 2, target.y - 35, '⏳ RESTORATION FETCH!', '#06b6d4');
          soundManager.playHamonBuzz();
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#06b6d4');
        }
        if (p.type === 'hermit_vine_grab') {
          this.applyHit(attacker, target, hitbox);
          // Reel-in & pull target violently toward Old Joseph!
          const pullDir = attacker.x < target.x ? -1 : 1;
          const idealX = attacker.x + (attacker.facing === 'right' ? attacker.width + 52 : -target.width - 52);
          target.x += (idealX - target.x) * 0.55;
          target.vx = pullDir * 14;
          target.vy = -5;
          target.isGrounded = false;
          target.hitStun = Math.max(target.hitStun, 48);
          target.action = 'hit';
          target.hitReactionType = 'electric_shock';
          target.hitReactionTimer = 48;
          target.hitReactionDuration = 48;
          soundManager.playHamonBuzz();
          this.screenShake = Math.max(this.screenShake, 10);
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#c084fc');
          this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#facc15');
          this.addTextParticle(target.x + target.width / 2, target.y - 45, '🌿⚡ HERMIT VINE SNARE & REEL-IN!!', '#c084fc');
          for (let s = 0; s < 12; s++) {
            this.addSpark(target.x + target.width / 2 + (Math.random() - 0.5) * 40, target.y + target.height / 2 + (Math.random() - 0.5) * 40, s % 2 === 0 ? '#c084fc' : '#facc15');
          }
          this.projectiles.splice(i, 1);
          continue;
        }
        this.applyHit(attacker, target, hitbox);
        this.addSpark(p.x, p.y, p.color || '#facc15');
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.life <= 0 || p.x < -100 || p.x > this.getArenaWidth() + 100) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  // --- PARTICLE HELPERS (HARD CAPPED FOR 60 FPS ZERO LAG) ---
  private readonly MAX_PARTICLES = 45;

  private addSpark(x: number, y: number, color: string) {
    if (this.particles.length >= this.MAX_PARTICLES) {
      this.particles.shift();
    }
    this.particles.push({
      id: this.particleId++,
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 1.5,
      life: 10,
      maxLife: 10,
      size: 3 + Math.random() * 3,
      color,
      type: 'spark',
    });
  }

  private addShockwave(x: number, y: number, color: string) {
    if (this.particles.length >= this.MAX_PARTICLES) {
      this.particles.shift();
    }
    this.particles.push({
      id: this.particleId++,
      x,
      y,
      vx: 0,
      vy: 0,
      life: 10,
      maxLife: 10,
      size: 25,
      color,
      type: 'shockwave',
    });
  }

  private spawnOrientedBarrageArm(
    attacker: Fighter,
    reach: number,
    armColor: string,
    glowColor: string,
    isRapier: boolean = false
  ) {
    const axis = this.activeGravityAxis || 'down';
    const cx = attacker.x + attacker.width / 2;
    const cy = attacker.y + attacker.height / 2;

    let originX = cx;
    let originY = cy;
    let targetX = cx;
    let targetY = cy;
    let dir = 1;

    if (axis === 'down' || axis === 'up') {
      dir = attacker.facing === 'right' ? 1 : -1;
      originX = cx + (attacker.isStandActive ? (dir === 1 ? -12 : 12) : 0);
      originY = attacker.y + 35 + (Math.random() * 16 - 8);
      targetX = originX + dir * (reach + Math.random() * 15);
      targetY = originY + (Math.random() * 24 - 12);
    } else if (axis === 'right') {
      const isUp = attacker.facing === 'right';
      dir = isUp ? -1 : 1;
      originX = attacker.x - 10 + (Math.random() * 16 - 8);
      originY = cy + (attacker.isStandActive ? (isUp ? 12 : -12) : 0);
      targetX = originX - (Math.random() * 20 - 10);
      targetY = originY + dir * (reach + Math.random() * 15);
    } else if (axis === 'left') {
      const isUp = attacker.facing === 'left';
      dir = isUp ? -1 : 1;
      originX = attacker.x + attacker.width + 10 + (Math.random() * 16 - 8);
      originY = cy + (attacker.isStandActive ? (isUp ? 12 : -12) : 0);
      targetX = originX + (Math.random() * 20 - 10);
      targetY = originY + dir * (reach + Math.random() * 15);
    }

    this.addBarrageArmParticle(
      originX,
      originY,
      targetX,
      targetY,
      dir,
      armColor,
      glowColor,
      isRapier
    );
    this.addSpark(targetX, targetY, glowColor);
  }

  private addBarrageArmParticle(
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    dir: number,
    armColor: string,
    glowColor: string,
    isRapier: boolean = false
  ) {
    if (this.particles.length >= this.MAX_PARTICLES) {
      this.particles.shift();
    }
    this.particles.push({
      id: this.particleId++,
      x: targetX,
      y: targetY,
      originX,
      originY,
      vx: dir * (isRapier ? 6 : 4),
      vy: 0,
      life: isRapier ? 6 : 8,
      maxLife: isRapier ? 6 : 8,
      size: isRapier ? 6 : 12,
      color: armColor,
      armColor,
      glowColor,
      isRapier,
      type: 'barrage_arm',
    });
  }

  public addTextParticle(x: number, y: number, text: string, color: string) {
    // Only allow max 4 active text particles to prevent font drawing overhead
    const activeTextCount = this.particles.filter(p => p.type === 'text').length;
    if (activeTextCount >= 4) {
      const oldestTextIdx = this.particles.findIndex(p => p.type === 'text');
      if (oldestTextIdx !== -1) {
        this.particles.splice(oldestTextIdx, 1);
      }
    }
    this.particles.push({
      id: this.particleId++,
      x: Math.max(20, Math.min(this.getArenaWidth() - 200, x - 40)),
      y,
      vx: 0,
      vy: -1.2,
      life: 25,
      maxLife: 25,
      size: 18,
      color,
      type: 'text',
      text,
    });
  }

  private addMenacingParticle(x: number, y: number, text: string = 'ゴ', color: string = 'rgba(192, 132, 252, 0.85)') {
    if (this.particles.length >= this.MAX_PARTICLES) {
      this.particles.shift();
    }
    this.particles.push({
      id: this.particleId++,
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.4 - Math.random() * 0.6,
      life: 35,
      maxLife: 35,
      size: text === 'ゴ' ? 32 : 24,
      color,
      type: 'menacing',
      text,
    });
  }

  private updateParticles() {
    if (this.timeStopState.isActive) return; // Freeze particle decay & movement in Time Stop
    if (this.particles.length > 50) {
      this.particles.splice(0, this.particles.length - 40);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // ==========================================
  // WALLY WABLE / PERSTEIN (WABLE THE METAL CUTTER)
  // ==========================================
  private handlePersteinSkills(f: Fighter, input: any, opponent: Fighter): boolean {
    const isTraining = this.matchConfig.mode === 'training';
    const isSilenced = (f.silencedTimer || 0) > 0;
    if (isSilenced) return false;

    // 1. Skill 1: 70m Motorcycle Chain Whip & Pull (perstein_chain_whip)
    if (input.skill1 && f.cooldowns.skill1 <= 0 && (f.energy >= PERSTEIN_CHAIN_WHIP_COST || isTraining)) {
      f.action = 'perstein_chain_whip';
      f.actionTimer = 22;
      f.actionDuration = 22;
      f.cooldowns.skill1 = PERSTEIN_CHAIN_WHIP_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_CHAIN_WHIP_COST;
      f.vx = 0;
      soundManager.playPersteinChainWhip();
      this.addTextParticle(f.x + f.width / 2, f.y - 45, '⛓️ 70m DRIVE CHAIN SNARE!', '#38bdf8');
      return true;
    }

    // 2. Skill 2: High-RPM Drive Chain Shred (perstein_chain_bind_shred)
    if (input.skill2 && f.cooldowns.skill2 <= 0 && (f.energy >= PERSTEIN_SHRED_COST || isTraining)) {
      f.action = 'perstein_chain_bind_shred';
      f.actionTimer = 32;
      f.actionDuration = 32;
      f.cooldowns.skill2 = PERSTEIN_SHRED_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_SHRED_COST;
      const dir = f.facing === 'right' ? 1 : -1;
      f.vx = dir * 3.5;
      soundManager.playPersteinChainShred();
      this.addTextParticle(f.x + f.width / 2, f.y - 45, '⛓️ HIGH-RPM DRIVE CHAIN SHRED!', '#94a3b8');
      return true;
    }

    // 3. Skill 3: Spark Blast & Concrete Friction (perstein_spark_ignition)
    if (input.skill3 && f.cooldowns.skill3 <= 0 && (f.energy >= PERSTEIN_SPARK_COST || isTraining)) {
      f.action = 'perstein_spark_ignition';
      f.actionTimer = 20;
      f.actionDuration = 20;
      f.cooldowns.skill3 = PERSTEIN_SPARK_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_SPARK_COST;
      f.vx = 0;
      soundManager.playPersteinSpark();
      this.addTextParticle(f.x + f.width / 2, f.y - 45, '✨ METAL FRICTION SPARK BLAST!', '#facc15');
      return true;
    }

    // 4. Skill 4: Invisible Drive Chain Deflection (perstein_awaken_deflection)
    if (input.skill4 && f.cooldowns.skill4 <= 0 && (f.energy >= PERSTEIN_DEFLECTION_COST || isTraining)) {
      f.action = 'perstein_awaken_deflection';
      f.actionTimer = 20;
      f.actionDuration = 20;
      f.cooldowns.skill4 = PERSTEIN_DEFLECTION_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_DEFLECTION_COST;
      f.vx = 0;
      f.persteinDeflectionTimer = PERSTEIN_DEFLECTION_DURATION;
      soundManager.playPersteinDeflection();
      this.addTextParticle(f.x + f.width / 2, f.y - 45, '⚙️ INVISIBLE DRIVE CHAIN DEFLECTION (4s)', '#38bdf8');
      return true;
    }

    // 5. Skill 5: Direct Touch Flesh Tear (perstein_awaken_touch)
    if (input.skill5 && f.cooldowns.skill5 <= 0 && (f.energy >= PERSTEIN_FLESH_TEAR_COST || isTraining)) {
      f.action = 'perstein_awaken_touch';
      f.actionTimer = 24;
      f.actionDuration = 24;
      f.cooldowns.skill5 = PERSTEIN_FLESH_TEAR_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_FLESH_TEAR_COST;
      const dir = f.facing === 'right' ? 1 : -1;
      f.vx = dir * 6;
      soundManager.playPersteinUltimate();
      this.addTextParticle(f.x + f.width / 2, f.y - 45, '🩸 DIRECT TOUCH FLESH TEAR (AWAKEN 1)!', '#ef4444');
      return true;
    }

    // 6. Ultimate: Silence After The Storm - Snare, Reel, Spin & Crush (perstein_ultimate)
    if (input.ultimate && f.cooldowns.ultimate <= 0 && (f.energy >= PERSTEIN_ULTIMATE_COST || isTraining)) {
      f.action = 'perstein_ultimate';
      f.actionTimer = 130;
      f.actionDuration = 130;
      f.cooldowns.ultimate = PERSTEIN_ULTIMATE_COOLDOWN;
      if (!isTraining) f.energy -= PERSTEIN_ULTIMATE_COST;
      f.vx = 0;
      f.vy = 0;
      f.isInvulnerable = true;
      f.invulnerableTimer = 135;

      const victim = (opponent && opponent.hp > 0) ? opponent : this.getAllActiveFighters().find(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
      f.persteinUltVictimId = victim ? victim.id : null;
      f.persteinUltPhase = 'snare';

      soundManager.playPersteinChainWhip();
      soundManager.playPersteinUltimate();
      this.screenShake = 22;
      this.addShockwave(f.x + f.width / 2, f.y + f.height / 2, '#38bdf8');
      return true;
    }

    return false;
  }

  private executePersteinChainWhip(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const whipReach = PERSTEIN_CHAIN_WHIP_RANGE; // 850px full arena snare reach
    const whipBox: Hitbox = {
      x: dir === 1 ? f.x + f.width : f.x - whipReach,
      y: f.y + 5,
      width: whipReach,
      height: 55,
      damage: PERSTEIN_CHAIN_WHIP_DAMAGE,
      knockbackX: dir * 4,
      knockbackY: -4,
    };

    soundManager.playPersteinChainWhip();
    this.screenShake = 8;

    // Spawn whip visual particles along full 850px reach
    for (let seg = 0; seg < 16; seg++) {
      const segX = f.x + f.width / 2 + dir * (seg * (whipReach / 16));
      this.addSpark(segX, f.y + 25 + (Math.random() * 12 - 6), '#94a3b8');
      if (seg % 3 === 0) {
        this.addSpark(segX, f.y + 25, '#38bdf8');
      }
    }

    // Check collision with opponent
    const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
    for (const target of targets) {
      if (this.checkCollision(whipBox, target)) {
        this.applyHit(f, target, whipBox);
        // Pull target towards Perstein across screen
        const pullTargetX = f.x + dir * 65;
        target.x = pullTargetX;
        target.vx = -dir * 12;
        target.vy = -4;
        target.hitStun = 34;
        soundManager.playHit(true);
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#38bdf8');
        this.addTextParticle(target.x + target.width / 2, target.y - 45, '⛓️ 70m CHAIN SNARED & REELED IN!', '#38bdf8');
      }
    }
  }

  private executePersteinShredHit(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const hitBox: Hitbox = {
      x: dir === 1 ? f.x + f.width - 15 : f.x - 180,
      y: f.y + 5,
      width: 195,
      height: 65,
      damage: PERSTEIN_SHRED_DAMAGE_PER_HIT,
      knockbackX: dir * 2.5,
      knockbackY: -1.2,
      isBarrage: true,
    };

    soundManager.playPersteinChainShred();
    this.screenShake = 3;

    // High friction sparks
    const sawX = dir === 1 ? f.x + f.width + 45 : f.x - 45;
    for (let s = 0; s < 4; s++) {
      this.addSpark(sawX + (Math.random() * 20 - 10), f.y + 30 + (Math.random() * 20 - 10), '#facc15');
    }

    const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
    for (const target of targets) {
      if (this.checkCollision(hitBox, target)) {
        this.applyHit(f, target, hitBox);
      }
    }
  }

  private executePersteinShredFinisher(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const finisherBox: Hitbox = {
      x: dir === 1 ? f.x + f.width - 15 : f.x - 220,
      y: f.y,
      width: 235,
      height: 75,
      damage: 70,
      knockbackX: dir * 16,
      knockbackY: -8,
    };

    soundManager.playPersteinUltimate();
    this.screenShake = 12;

    const sawX = dir === 1 ? f.x + f.width + 55 : f.x - 55;
    this.addShockwave(sawX, f.y + 35, '#38bdf8');

    const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
    for (const target of targets) {
      if (this.checkCollision(finisherBox, target)) {
        this.applyHit(f, target, finisherBox);
        this.addTextParticle(target.x + target.width / 2, target.y - 45, '⛓️💥 DRIVE CHAIN CLEAVE FINISHER!', '#38bdf8');
      }
    }
  }

  private executePersteinSparkIgnition(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const startX = dir === 1 ? f.x + f.width + 10 : f.x - 10;
    const startY = f.y + f.height - 15;

    soundManager.playPersteinSpark();
    this.screenShake = 9;
    this.addShockwave(startX, startY, '#facc15');

    // Spawn 7 fan-out hot spark projectiles spanning the entire floor (850px+ travel!)
    for (let p = -3; p <= 3; p++) {
      const angle = p * 0.11;
      const speed = 18 + Math.random() * 6;
      const projVx = dir * Math.cos(angle) * speed;
      const projVy = Math.sin(angle) * speed - 1.8;
      this.projectiles.push({
        id: this.projectileId++,
        ownerId: f.id,
        type: 'perstein_spark_wave',
        x: startX,
        y: startY - 10 + p * 8,
        vx: projVx,
        vy: projVy,
        baseVx: projVx,
        baseVy: projVy,
        width: 22,
        height: 22,
        damage: PERSTEIN_SPARK_DAMAGE / 3,
        knockbackX: dir * 10,
        knockbackY: -4,
        isFrozenInTime: false,
        life: 50, // Long-range travel across the entire screen!
        maxLife: 50,
        color: '#facc15',
      });
    }

    // Local ground blast hitbox
    const blastBox: Hitbox = {
      x: dir === 1 ? f.x + f.width : f.x - 220,
      y: f.y + 5,
      width: 220,
      height: 70,
      damage: PERSTEIN_SPARK_DAMAGE,
      knockbackX: dir * 14,
      knockbackY: -6,
    };

    const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
    for (const target of targets) {
      if (this.checkCollision(blastBox, target)) {
        this.applyHit(f, target, blastBox);
        target.burnedTimer = 120;
        this.addTextParticle(target.x + target.width / 2, target.y - 45, '🔥 MOLTEN METAL SHRAPNEL IGNITION!', '#facc15');
      }
    }
  }

  private executePersteinAwakenTouch(f: Fighter, opponent: Fighter) {
    const dir = f.facing === 'right' ? 1 : -1;
    const box: Hitbox = {
      x: dir === 1 ? f.x + f.width - 10 : f.x - 200,
      y: f.y + 5,
      width: 210,
      height: 65,
      damage: PERSTEIN_FLESH_TEAR_DAMAGE,
      knockbackX: dir * 12,
      knockbackY: -6,
    };

    soundManager.playPersteinUltimate();
    this.screenShake = 14;

    const targets = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
    for (const target of targets) {
      if (this.checkCollision(box, target)) {
        this.applyHit(f, target, box);
        target.persteinShredTimer = 300; // 5 seconds bleed
        this.addShockwave(target.x + target.width / 2, target.y + target.height / 2, '#ef4444');
        this.addTextParticle(target.x + target.width / 2, target.y - 50, '🩸 DIRECT TOUCH: FLESH TEAR (-260 HP + BLEED)', '#ef4444');
      }
    }
  }

  private executePersteinUltimateFrame(f: Fighter, opponent: Fighter) {
    const timer = f.actionTimer || 0;

    // Locate the locked primary victim
    let victim: Fighter | undefined;
    if (f.persteinUltVictimId) {
      victim = this.getAllActiveFighters().find(t => t.id === f.persteinUltVictimId && t.hp > 0);
    }
    if (!victim) {
      victim = (opponent && opponent.hp > 0) ? opponent : this.getAllActiveFighters().find(t => t.id !== f.id && t.team !== f.team && t.hp > 0);
      if (victim) f.persteinUltVictimId = victim.id;
    }

    const dir = f.facing === 'right' ? 1 : -1;
    const holdX = f.x + dir * 85;

    // PHASE 1: NGIKET MUSUH (70m Heavy-Duty Drive Chain Snare & Binding) [Frames 130 down to 100]
    if (timer >= 100) {
      f.persteinUltPhase = 'snare';
      if (victim) {
        victim.action = 'grabbed';
        victim.hitStun = 110;
        victim.persteinChainBindTimer = 110;
        victim.vx = 0;
        victim.vy = 0;

        if (timer === 126) {
          soundManager.playPersteinChainWhip();
          this.screenShake = 16;
          this.addShockwave(victim.x + victim.width / 2, victim.y + victim.height / 2, '#38bdf8');
          for (let s = 0; s < 12; s++) {
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 40 - 20), victim.y + victim.height / 2 + (Math.random() * 40 - 20), '#38bdf8');
          }
        }
      }
    }
    // PHASE 2: DITARIK (Reeling In Bound Enemy With Hydraulic Torque) [Frames 99 down to 80]
    else if (timer >= 80) {
      f.persteinUltPhase = 'pull';
      if (victim) {
        victim.action = 'grabbed';
        victim.hitStun = 85;
        victim.persteinChainBindTimer = 85;
        // Interpolate smoothly towards Perstein's grab focal point
        victim.x += (holdX - victim.x) * 0.28;
        victim.y += (f.y - victim.y) * 0.28;
        victim.vx = 0;
        victim.vy = 0;

        if (timer === 95) {
          soundManager.playPersteinChainShred();
          this.screenShake = 14;
          this.addShockwave(victim.x + victim.width / 2, victim.y + victim.height / 2, '#38bdf8');
        }
      }
    }
    // PHASE 3: DIPUTER (High-RPM Spinning Drive Chain Shredding) [Frames 79 down to 35]
    else if (timer >= 35) {
      f.persteinUltPhase = 'spin_shred';
      if (victim) {
        victim.action = 'grabbed';
        victim.hitStun = 50;
        victim.persteinChainBindTimer = 50;
        victim.x = holdX;
        victim.y = f.y - 10;
        victim.vx = 0;
        victim.vy = 0;

        // Rapid multi-hit rotational shredding every 4 frames
        if (timer % 4 === 0) {
          soundManager.playPersteinChainShred();
          this.screenShake = 12;
          const shredDmg = 18;
          victim.hp = Math.max(1, victim.hp - shredDmg);
          victim.persteinShredTimer = 300;

          // Collateral damage to other nearby enemies within rotary range
          const collaterals = this.getAllActiveFighters().filter(t => t.id !== f.id && t.team !== f.team && t.id !== victim!.id && t.hp > 0);
          for (const col of collaterals) {
            if (Math.abs(col.x - holdX) < 110) {
              col.hp = Math.max(1, col.hp - 10);
              col.hitStun = 14;
              col.vx = (col.x > holdX ? 1 : -1) * 6;
            }
          }

          for (let s = 0; s < 6; s++) {
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 50 - 25), victim.y + victim.height / 2 + (Math.random() * 60 - 30), '#facc15');
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 50 - 25), victim.y + victim.height / 2 + (Math.random() * 60 - 30), '#ef4444');
          }
        }
      }
    }
    // PHASE 4: DIREMET SAMPE MUSUHNYA KEKIKIS RANTAINYA AMPE ABIS (Constriction Crush & Final Cleave) [Frames 34 down to 0]
    else {
      f.persteinUltPhase = 'constrict_crush';
      if (victim) {
        victim.action = 'grabbed';
        victim.hitStun = 35;
        victim.persteinChainBindTimer = 35;
        victim.x = holdX;
        victim.y = f.y - 6;
        victim.vx = 0;
        victim.vy = 0;

        // Progressive hydraulic constriction squeezer every 3 frames
        if (timer > 12 && timer % 3 === 0) {
          victim.hp = Math.max(1, victim.hp - 16);
          this.screenShake = 15;
          soundManager.playHit(true);
          this.addSpark(victim.x + victim.width / 2, victim.y + victim.height / 2, '#38bdf8');
          for (let s = 0; s < 4; s++) {
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 30 - 15), victim.y + victim.height / 2 + (Math.random() * 40 - 20), '#ef4444');
          }
        }

        // CLIMAX: Final Grinding Constriction Snap & Cataclysmic Sunder at Frame 12!
        if (timer === 12) {
          soundManager.playPersteinUltimate();
          this.screenShake = 32;

          const finalBurst = 180;
          victim.hp = Math.max(0, victim.hp - finalBurst);
          victim.vx = dir * 26;
          victim.vy = -13;
          victim.hitStun = 60;
          victim.isGrounded = false;
          victim.persteinShredTimer = 360;
          victim.persteinChainBindTimer = 0;

          this.addShockwave(victim.x + victim.width / 2, victim.y + victim.height / 2, '#38bdf8');
          this.addShockwave(victim.x + victim.width / 2, victim.y + victim.height / 2, '#ffffff');

          for (let s = 0; s < 22; s++) {
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 80 - 40), victim.y + victim.height / 2 + (Math.random() * 80 - 40), '#38bdf8');
            this.addSpark(victim.x + victim.width / 2 + (Math.random() * 80 - 40), victim.y + victim.height / 2 + (Math.random() * 80 - 40), '#ffffff');
          }
        }
      }

      if (timer <= 1) {
        f.persteinUltPhase = 'complete';
        f.action = 'idle';
        f.persteinUltVictimId = null;
        if (victim && victim.action === 'grabbed') {
          victim.action = 'idle';
        }
      }
    }
  }

  // ==========================================
  // STAND BARRAGE CLASH SYSTEM (ALL-STAR BATTLE / EYES OF HEAVEN RUSH CLASH)
  // ==========================================

  public isBarragingAction(f: Fighter): boolean {
    if (!f || f.hp <= 0) return false;
    return (
      f.action === 'barrage' ||
      f.action === 'gappy_bubble_barrage' ||
      f.action === 'valentine_d4c_barrage' ||
      f.action === 'michael_kinetic_barrage' ||
      f.action === 'doppio_twin_arms_rush' ||
      f.action === 'barrage_clash'
    );
  }

  public initiateBarrageClash(f1: Fighter, f2: Fighter) {
    if (this.barrageClash.isActive || this.timeStopState.isActive) return;
    if (f1.hp <= 0 || f2.hp <= 0) return;
    if (!!f1.isParallelWorld !== !!f2.isParallelWorld) return;

    // Both enter barrage_clash action!
    f1.action = 'barrage_clash';
    f2.action = 'barrage_clash';
    f1.actionTimer = 9999;
    f2.actionTimer = 9999;
    f1.actionDuration = 9999;
    f2.actionDuration = 9999;
    f1.hitStun = 0;
    f2.hitStun = 0;
    f1.invulnerableTimer = 9999;
    f2.invulnerableTimer = 9999;
    f1.isInvulnerable = true;
    f2.isInvulnerable = true;

    // Determine left and right fighters
    const leftFighter = f1.x <= f2.x ? f1 : f2;
    const rightFighter = f1.x <= f2.x ? f2 : f1;

    leftFighter.facing = 'right';
    rightFighter.facing = 'left';

    const clashX = (leftFighter.x + rightFighter.x + leftFighter.width / 2 + rightFighter.width / 2) / 2;
    const clashY = Math.min(leftFighter.y, rightFighter.y) + 35;

    leftFighter.x = clashX - leftFighter.width / 2 - 55;
    rightFighter.x = clashX - rightFighter.width / 2 + 55;
    leftFighter.vx = 0;
    leftFighter.vy = 0;
    rightFighter.vx = 0;
    rightFighter.vy = 0;
    leftFighter.y = GROUND_Y - leftFighter.height;
    rightFighter.y = GROUND_Y - rightFighter.height;
    leftFighter.isGrounded = true;
    rightFighter.isGrounded = true;

    // If Stand users, summon and maintain active Stand immediately!
    if (leftFighter.hasStand) {
      leftFighter.isStandActive = true;
      leftFighter.standAlpha = 1.0;
    } else {
      leftFighter.isStandActive = false;
      leftFighter.standAlpha = 0;
    }

    if (rightFighter.hasStand) {
      rightFighter.isStandActive = true;
      rightFighter.standAlpha = 1.0;
    } else {
      rightFighter.isStandActive = false;
      rightFighter.standAlpha = 0;
    }

    const isF1Human = (leftFighter.id === 'player' && this.matchConfig.mode !== 'cpu_vs_cpu');
    const isF2Human = (rightFighter.id === 'player' && this.matchConfig.mode !== 'cpu_vs_cpu');
    const isBothBots = !isF1Human && !isF2Human;

    this.barrageClash = {
      isActive: true,
      fighter1Id: leftFighter.id,
      fighter2Id: rightFighter.id,
      clashX,
      clashY,
      meter: 0,
      f1MashRate: 0,
      f2MashRate: 0,
      combinedMashRate: 0,
      f1TotalMashes: 0,
      f2TotalMashes: 0,
      clashIntensity: 0.5,
      durationFrames: 0,
      winnerId: null,
      resolutionPhase: 'active',
      finisherTimer: 0,
      isBothBots,
      timeRemainingSec: 4.0,
      f1Name: leftFighter.userName || leftFighter.name,
      f2Name: rightFighter.userName || rightFighter.name,
      f1StandName: leftFighter.standName || (leftFighter.hasStand ? 'Stand' : 'Ripple'),
      f2StandName: rightFighter.standName || (rightFighter.hasStand ? 'Stand' : 'Ripple'),
      f1CharId: leftFighter.charId,
      f2CharId: rightFighter.charId,
      f1Color: leftFighter.color,
      f2Color: rightFighter.color,
      f1StandColor: leftFighter.standColor || '#c084fc',
      f2StandColor: rightFighter.standColor || '#facc15',
      f1AuraColor: leftFighter.auraColor || 'purple',
      f2AuraColor: rightFighter.auraColor || 'gold',
      f1HasStand: !!leftFighter.hasStand,
      f2HasStand: !!rightFighter.hasStand,
      f1Cry: leftFighter.barrageCry || 'ORA ORA ORA!',
      f2Cry: rightFighter.barrageCry || 'MUDA MUDA MUDA!',
    };

    this.f1MashTimestamps = [];
    this.f2MashTimestamps = [];
    this.f1LastMashPressed = true;
    this.f2LastMashPressed = true;
    this.aiF1ClashMashCooldown = 0;
    this.aiF2ClashMashCooldown = 0;

    soundManager.playClashStart();
    this.screenShake = 10;

    this.addShockwave(clashX, clashY, '#ffffff');
    this.addShockwave(clashX, clashY, leftFighter.standColor || '#c084fc');
    if (isBothBots) {
      this.addTextParticle(clashX, clashY - 60, '🤖 BOT VS BOT RUSH CLASH!! 🤖', '#facc15');
      this.addTextParticle(clashX, clashY - 80, '⏱️ 4s TIME LIMIT • CORNERED BOT LOSES!', '#38bdf8');
    } else {
      this.addTextParticle(clashX, clashY - 60, '⚡ RUSH CLASH!! ⚡', '#facc15');
      this.addTextParticle(clashX, clashY - 80, 'MASH RAPIDLY!', '#ffffff');
    }

    for (let i = 0; i < 20; i++) {
      this.addClashSpark(clashX, clashY, leftFighter.standColor || '#ffffff', rightFighter.standColor || '#facc15');
    }
  }

  public getFighterById(id: string): Fighter | null {
    if (this.player.id === id) return this.player;
    if (this.ai.id === id) return this.ai;
    if (this.teammate && this.teammate.id === id) return this.teammate;
    if (this.player.parallelEnemyClone && this.player.parallelEnemyClone.id === id) return this.player.parallelEnemyClone;
    if (this.ai.parallelEnemyClone && this.ai.parallelEnemyClone.id === id) return this.ai.parallelEnemyClone;
    if (this.player.valentineClones) {
      const c = this.player.valentineClones.find(cl => cl.id === id);
      if (c) return c;
    }
    if (this.ai.valentineClones) {
      const c = this.ai.valentineClones.find(cl => cl.id === id);
      if (c) return c;
    }
    if (this.teammate?.valentineClones) {
      const c = this.teammate.valentineClones.find(cl => cl.id === id);
      if (c) return c;
    }
    const v = this.vampires.find(vam => vam.id === id);
    if (v) return v;
    return null;
  }

  public getFighterBarrageCry(fighter: Fighter): { cries: string[]; color: string; strokeColor: string } {
    const charId = fighter.charId;
    const color = fighter.standColor || fighter.color || '#facc15';
    switch (charId) {
      case 'jotaro':
        return { cries: ['オラッ!', 'オラァ!', 'ORA!', 'オラオラ!'], color: '#c084fc', strokeColor: '#581c87' };
      case 'dio':
        return { cries: ['無駄ッ!', '無駄ァ!', 'MUDA!', '無駄無駄!'], color: '#facc15', strokeColor: '#78350f' };
      case 'crazy_diamond':
        return { cries: ['ドラッ!', 'ドラァ!', 'DORA!', 'ドラドラ!'], color: '#38bdf8', strokeColor: '#0369a1' };
      case 'jonathan':
        return { cries: ['山吹色!', '波紋疾走!', 'OVERDRIVE!', 'SUNLIGHT!'], color: '#fbbf24', strokeColor: '#b45309' };
      case 'joseph_young':
      case 'joseph_old':
        return { cries: ['喰らいな!', '波紋!', 'OVERDRIVE!', 'HERMIT!'], color: '#4ade80', strokeColor: '#15803d' };
      case 'silver_chariot':
        return { cries: ['ホラッ!', 'HORA!', '突く!', 'RUSH!'], color: '#e2e8f0', strokeColor: '#475569' };
      case 'king_crimson':
        return { cries: ['消し飛べ!', '無駄だ!', 'KING CRIMSON!', '滅びろ!'], color: '#f43f5e', strokeColor: '#881337' };
      case 'tooru':
        return { cries: ['厄災!', 'CALAMITY!', '触れるな!', '流転!'], color: '#ef4444', strokeColor: '#450a0a' };
      case 'pucci':
        if (fighter.pucciForm === 'made_in_heaven') {
          return { cries: ['天国!', '加速!', 'ACCEL!', 'MADE IN HEAVEN!'], color: '#fef08a', strokeColor: '#a16207' };
        } else if (fighter.pucciForm === 'cmoon') {
          return { cries: ['引力!', '反転!', 'GRAVITY!', 'C-MOON!'], color: '#4ade80', strokeColor: '#166534' };
        }
        return { cries: ['記憶!', 'DISC!', 'WHITESNAKE!', '14 WORDS!'], color: '#cbd5e1', strokeColor: '#334155' };
      case 'gappy':
        return { cries: ['オラッ!', 'SOFT & WET!', '奪う!', 'GO BEYOND!'], color: '#38bdf8', strokeColor: '#075985' };
      case 'funny_valentine':
        return { cries: ['DOJYAA~~N!', '隣の次元!', 'D4C!', '愛の列車!'], color: '#f472b6', strokeColor: '#9d174d' };
      case 'dipez':
        return { cries: ['光速!', 'LIGHT!', 'ピカッ!', 'BLITZ!'], color: '#fef08a', strokeColor: '#ca8a04' };
      case 'arabian_fat':
        return { cries: ['灼熱!', 'THE SUN!', 'HEAT!', 'MIRROR!'], color: '#fb923c', strokeColor: '#9a3412' };
      case 'michael':
        return { cries: ['WRAA!', 'WRAAA!', 'WRAH!', 'ウラァッ!'], color: '#f59e0b', strokeColor: '#78350f' };
      case 'perstein':
        return { cries: ['...Shh...', 'SHH!', 'SHHH!', 'SHHHH...'], color: '#38bdf8', strokeColor: '#0284c7' };
      default:
        return { cries: ['HA!', 'RUSH!', 'BARRAGE!', 'FIST!'], color: '#e2e8f0', strokeColor: '#1e293b' };
    }
  }

  public addStandCryParticle(x: number, y: number, text: string, color: string, strokeColor: string = '#000000') {
    // Keep reasonable particle density for optimal performance
    const activeStandCryCount = this.particles.filter(p => p.type === 'stand_cry').length;
    if (activeStandCryCount >= 18) {
      const oldestIdx = this.particles.findIndex(p => p.type === 'stand_cry');
      if (oldestIdx !== -1) this.particles.splice(oldestIdx, 1);
    }

    this.particles.push({
      id: this.particleId++,
      x,
      y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -1.6 - Math.random() * 1.2,
      life: 24,
      maxLife: 24,
      size: 26 + Math.floor(Math.random() * 8),
      color,
      strokeColor,
      rotation: (Math.random() - 0.5) * 0.4,
      type: 'stand_cry',
      text,
    });
  }

  public registerPlayerClashMash(targetPlayerId: string = 'player') {
    if (!this.barrageClash.isActive || this.barrageClash.resolutionPhase === 'finisher') return;
    const f1 = this.getFighterById(this.barrageClash.fighter1Id);
    const f2 = this.getFighterById(this.barrageClash.fighter2Id);
    if (!f1 || !f2) return;
    const now = performance.now();
    if (f1.id === targetPlayerId) {
      this.registerMash('f1', f1, f2, now);
    } else if (f2.id === targetPlayerId) {
      this.registerMash('f2', f2, f1, now);
    }
  }

  private registerMash(side: 'f1' | 'f2', fighter: Fighter, enemy: Fighter, now: number) {
    if (this.barrageClash.resolutionPhase === 'finisher') return;

    const pushStrength = 7.5;
    if (side === 'f1') {
      this.barrageClash.f1TotalMashes++;
      this.f1MashTimestamps.push(now);
      this.barrageClash.meter = Math.max(-100, this.barrageClash.meter - pushStrength);
      if (this.barrageClash.meter <= -85) {
        this.barrageClash.winnerId = fighter.id;
        this.startClashFinisher(fighter, enemy);
        return;
      }
    } else {
      this.barrageClash.f2TotalMashes++;
      this.f2MashTimestamps.push(now);
      this.barrageClash.meter = Math.min(100, this.barrageClash.meter + pushStrength);
      if (this.barrageClash.meter >= 85) {
        this.barrageClash.winnerId = fighter.id;
        this.startClashFinisher(fighter, enemy);
        return;
      }
    }

    const currentClashX = this.barrageClash.clashX + (this.barrageClash.meter / 100) * 45;
    const cy = this.barrageClash.clashY;

    // Contact collision sparks & impact sound
    this.addClashSpark(currentClashX, cy, fighter.standColor || '#ffffff', enemy.standColor || '#facc15');
    soundManager.playClashImpact(this.barrageClash.clashIntensity);

    // Dynamic per-punch Stand Cry appearing behind the active punching fighter
    const cryData = this.getFighterBarrageCry(fighter);
    const chosenCry = cryData.cries[Math.floor(Math.random() * cryData.cries.length)];
    
    // Positioned behind the fighter in world space
    const cryOffsetX = side === 'f1' ? -45 - Math.random() * 45 : 45 + Math.random() * 45;
    const cryOffsetY = (Math.random() - 0.5) * 55;
    this.addStandCryParticle(
      fighter.x + fighter.width / 2 + cryOffsetX,
      fighter.y + 20 + cryOffsetY,
      chosenCry,
      cryData.color,
      cryData.strokeColor
    );

    // Menacing particle behind fighter
    if (Math.random() < 0.65) {
      const glyphs = ['ゴ', 'ド', 'ズガッ', 'バシィ', 'ドドン'];
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      this.addMenacingParticle(
        fighter.x + fighter.width / 2 + cryOffsetX * 0.8,
        fighter.y - 10 + (Math.random() - 0.5) * 35,
        glyph,
        cryData.color
      );
    }
  }

  private updateAICallMash(side: 'f1' | 'f2', fighter: Fighter, enemy: Fighter, now: number, dt: number) {
    if (this.barrageClash.resolutionPhase === 'finisher') return;

    if (side === 'f1') {
      this.aiF1ClashMashCooldown -= dt * 16.67;
      if (this.aiF1ClashMashCooldown <= 0) {
        const isBoss = fighter.isBoss || this.matchConfig.mode === 'team_boss';
        const baseInterval = isBoss ? 80 : 105;
        const jitter = (Math.random() - 0.5) * 45;
        this.aiF1ClashMashCooldown = Math.max(50, baseInterval + jitter);
        this.registerMash('f1', fighter, enemy, now);
      }
    } else {
      this.aiF2ClashMashCooldown -= dt * 16.67;
      if (this.aiF2ClashMashCooldown <= 0) {
        const isBoss = fighter.isBoss || this.matchConfig.mode === 'team_boss';
        const baseInterval = isBoss ? 80 : 105;
        const jitter = (Math.random() - 0.5) * 45;
        this.aiF2ClashMashCooldown = Math.max(50, baseInterval + jitter);
        this.registerMash('f2', fighter, enemy, now);
      }
    }
  }

  private updateBarrageClash(p1Input: InputState, dt: number, p2Input?: InputState) {
    if (!this.barrageClash.isActive) return;

    const f1 = this.getFighterById(this.barrageClash.fighter1Id);
    const f2 = this.getFighterById(this.barrageClash.fighter2Id);
    if (!f1 || !f2 || f1.hp <= 0 || f2.hp <= 0) {
      this.endBarrageClash(null);
      return;
    }

    this.barrageClash.durationFrames += dt;
    const now = performance.now();

    // 1. Keep fighters locked in place facing each other, 100% invulnerable from external interference
    f1.action = 'barrage_clash';
    f2.action = 'barrage_clash';
    f1.actionTimer = 9999;
    f2.actionTimer = 9999;
    f1.actionDuration = 9999;
    f2.actionDuration = 9999;
    f1.hitStun = 0;
    f2.hitStun = 0;
    f1.invulnerableTimer = 9999;
    f2.invulnerableTimer = 9999;
    f1.isInvulnerable = true;
    f2.isInvulnerable = true;
    f1.burnedTimer = 0;
    f2.burnedTimer = 0;
    f1.acidMeltTimer = 0;
    f2.acidMeltTimer = 0;
    f1.poisonTimer = 0;
    f2.poisonTimer = 0;
    f1.silencedTimer = 0;
    f2.silencedTimer = 0;
    f1.vx = 0;
    f1.vy = 0;
    f2.vx = 0;
    f2.vy = 0;
    f1.facing = 'right';
    f2.facing = 'left';
    f1.y = GROUND_Y - f1.height;
    f2.y = GROUND_Y - f2.height;
    f1.isGrounded = true;
    f2.isGrounded = true;

    // Dynamic Tug-of-war position shift
    const pushOffset = (this.barrageClash.meter / 100) * 45;
    const currentClashX = this.barrageClash.clashX + pushOffset;
    f1.x = currentClashX - f1.width / 2 - 50;
    f2.x = currentClashX - f2.width / 2 + 50;

    if (f1.hasStand) { f1.isStandActive = true; f1.standAlpha = 1.0; }
    if (f2.hasStand) { f2.isStandActive = true; f2.standAlpha = 1.0; }

    // Check Resolution Phase
    if (this.barrageClash.resolutionPhase === 'finisher') {
      this.barrageClash.finisherTimer -= dt;
      if (this.barrageClash.finisherTimer <= 0) {
        const winner = this.getFighterById(this.barrageClash.winnerId || '');
        const loser = winner === f1 ? f2 : f1;
        if (winner && loser) {
          this.executeClashFinisher(winner, loser);
        } else {
          this.endBarrageClash(null);
        }
      }
      return;
    }

    // Determine if both clash participants are bots (CPUs / AIs)
    const isF1Human = (f1.id === 'player' && this.matchConfig.mode !== 'cpu_vs_cpu') || (f1.id === 'ai' && p2Input !== undefined);
    const isF2Human = (f2.id === 'player' && this.matchConfig.mode !== 'cpu_vs_cpu') || (f2.id === 'ai' && p2Input !== undefined);
    const isBothBots = !isF1Human && !isF2Human;
    this.barrageClash.isBothBots = isBothBots;

    // 2. Mashing Input for Fighter 1
    if (isF1Human) {
      const f1Input = f1.id === 'player' ? p1Input : p2Input;
      const isPressed = !!(f1Input && (f1Input.barrage || f1Input.punch));
      if (isPressed && !this.f1LastMashPressed) {
        this.registerMash('f1', f1, f2, now);
      }
      this.f1LastMashPressed = isPressed;
    } else {
      this.updateAICallMash('f1', f1, f2, now, dt);
    }

    // 3. Mashing Input for Fighter 2
    if (isF2Human) {
      const f2Input = f2.id === 'player' ? p1Input : p2Input;
      const isPressed = !!(f2Input && (f2Input.barrage || f2Input.punch));
      if (isPressed && !this.f2LastMashPressed) {
        this.registerMash('f2', f2, f1, now);
      }
      this.f2LastMashPressed = isPressed;
    } else {
      this.updateAICallMash('f2', f2, f1, now, dt);
    }

    // Rolling 1-second window for tap rate
    const oneSecAgo = now - 1000;
    while (this.f1MashTimestamps.length > 0 && this.f1MashTimestamps[0] < oneSecAgo) {
      this.f1MashTimestamps.shift();
    }
    while (this.f2MashTimestamps.length > 0 && this.f2MashTimestamps[0] < oneSecAgo) {
      this.f2MashTimestamps.shift();
    }

    this.barrageClash.f1MashRate = this.f1MashTimestamps.length;
    this.barrageClash.f2MashRate = this.f2MashTimestamps.length;
    this.barrageClash.combinedMashRate = this.barrageClash.f1MashRate + this.barrageClash.f2MashRate;
    this.barrageClash.clashIntensity = Math.min(2.5, this.barrageClash.combinedMashRate / 10);

    // Natural slight center drift (only when active in neutral zone)
    if (this.barrageClash.resolutionPhase === 'active' && Math.abs(this.barrageClash.meter) < 80) {
      if (this.barrageClash.meter > 0) {
        this.barrageClash.meter = Math.max(0, this.barrageClash.meter - 0.05 * dt);
      } else if (this.barrageClash.meter < 0) {
        this.barrageClash.meter = Math.min(0, this.barrageClash.meter + 0.05 * dt);
      }
    }

    // Dynamic screen shake scaling with button mashing speed!
    const baseShake = 3.5;
    const dynamicShake = baseShake + this.barrageClash.clashIntensity * 6.5;
    this.screenShake = Math.max(this.screenShake, dynamicShake);

    // Continuous contact sparks, lightning arcs & sound
    if (this.frameCount % 2 === 0) {
      this.spawnContinuousClashParticles(currentClashX, this.barrageClash.clashY, f1, f2);
    }

    // 4. Check for Winner when meter reaches boundary threshold (<= -85 or >= 85)
    if (this.barrageClash.resolutionPhase === 'active') {
      if (this.barrageClash.meter <= -85) {
        this.barrageClash.winnerId = f1.id;
        this.startClashFinisher(f1, f2);
        return;
      } else if (this.barrageClash.meter >= 85) {
        this.barrageClash.winnerId = f2.id;
        this.startClashFinisher(f2, f1);
        return;
      }

      // 5. Special 4-Second Time Limit specifically when both fighters are bots
      if (isBothBots) {
        const maxClashFrames = 240; // 4.0 seconds at 60 FPS
        const remainingFrames = Math.max(0, maxClashFrames - this.barrageClash.durationFrames);
        this.barrageClash.timeRemainingSec = Math.max(0, remainingFrames / 60);

        if (this.barrageClash.durationFrames >= maxClashFrames) {
          // 4 seconds elapsed without standard -85/+85 knockout:
          // Bot whose meter is closest to the losing corner loses!
          // Meter scale: -100 (F2 pushed into corner) to +100 (F1 pushed into corner).
          // If meter < 0: F2 is closer to losing corner (-100). F2 loses, F1 wins!
          // If meter > 0: F1 is closer to losing corner (+100). F1 loses, F2 wins!
          // If meter === 0: Dead-center tie, fighter with lower HP loses (or total mashes tiebreak).
          let winner: Fighter;
          let loser: Fighter;

          if (this.barrageClash.meter < 0) {
            winner = f1;
            loser = f2;
          } else if (this.barrageClash.meter > 0) {
            winner = f2;
            loser = f1;
          } else {
            // Dead tie: compare HP or total mashes
            if (f1.hp < f2.hp) {
              winner = f2;
              loser = f1;
            } else if (f2.hp < f1.hp) {
              winner = f1;
              loser = f2;
            } else {
              if (this.barrageClash.f1TotalMashes >= this.barrageClash.f2TotalMashes) {
                winner = f1;
                loser = f2;
              } else {
                winner = f2;
                loser = f1;
              }
            }
          }

          this.addTextParticle(currentClashX, this.barrageClash.clashY - 80, '⏱️ 4s TIME OUT! CORNERED BOT RETIRES! ⏱️', '#f43f5e');
          this.addTextParticle(winner.x + winner.width / 2, winner.y - 45, '👑 CORNER ADVANTAGE OVERPOWER!', '#facc15');
          this.barrageClash.winnerId = winner.id;
          this.startClashFinisher(winner, loser);
          return;
        }
      }
    }
  }

  private startClashFinisher(winner: Fighter, loser: Fighter) {
    if (this.barrageClash.resolutionPhase === 'finisher') return;
    this.barrageClash.resolutionPhase = 'finisher';
    this.barrageClash.winnerId = winner.id;
    this.barrageClash.finisherTimer = 14;

    const cx = this.barrageClash.clashX;
    const cy = this.barrageClash.clashY;

    const winCry = winner.charId === 'jotaro' ? 'オラァッ!! (ORA FINISH!)'
      : winner.charId === 'dio' ? '無駄ァッ!! (MUDA FINISH!)'
      : winner.charId === 'crazy_diamond' ? 'ドラァッ!! (DORA FINISH!)'
      : winner.charId === 'jonathan' ? 'SUNLIGHT YELLOW FINISH!!'
      : winner.charId === 'silver_chariot' ? 'HORAAA!!'
      : winner.charId === 'king_crimson' ? 'KORE GA WAGA KING CRIMSON!!'
      : winner.charId === 'funny_valentine' ? 'DOJYAA~~N!!'
      : winner.charId === 'pucci' ? 'HEAVEN IMPACT!!'
      : winner.charId === 'michael' ? 'WRAAAA FINISH!!'
      : winner.charId === 'perstein' ? '...SHH... (SILENCE)'
      : 'CLASH FINISH!!';

    this.addTextParticle(winner.x + winner.width / 2, winner.y - 45, winCry, winner.standColor || '#facc15');
    this.addShockwave(cx, cy, '#ffffff');
    this.screenShake = 16;
  }

  private executeClashFinisher(winner: Fighter, loser: Fighter) {
    const cx = this.barrageClash.clashX;
    const cy = this.barrageClash.clashY;

    soundManager.playClashFinisher();
    this.screenShake = 20;

    const finisherDamage = 85;
    this.isExecutingClashFinisher = true;
    this.applyRawDamage(loser, finisherDamage, 0, 0, winner);

    const launchDir = winner.x < loser.x ? 1 : -1;
    this.triggerRagdollFling(loser, launchDir * 28, -13, winner.x);
    this.isExecutingClashFinisher = false;

    loser.hitReactionType = 'wall_splat';
    loser.wallSplatTimer = 60;
    loser.invulnerableTimer = 20;

    winner.action = 'pose';
    winner.actionTimer = 35;
    winner.actionDuration = 35;
    winner.cooldowns.barrage = 50;
    winner.vx = 0;
    winner.vy = 0;

    this.addShockwave(cx, cy, '#ffffff');
    this.addShockwave(cx, cy, winner.standColor || '#facc15');
    this.addTextParticle(cx, cy - 65, '💥 FINISH!! 💥', '#fbbf24');

    for (let i = 0; i < 35; i++) {
      this.addClashSpark(cx, cy, winner.standColor || '#ffffff', '#facc15');
    }

    if (loser.hp <= 0) {
      this.checkAndTriggerDramaticFinisher(winner, loser, 'clash', cx, cy);
    }

    this.endBarrageClash(winner.id);
  }

  private endBarrageClash(winnerId: string | null) {
    const f1 = this.getFighterById(this.barrageClash.fighter1Id);
    const f2 = this.getFighterById(this.barrageClash.fighter2Id);
    if (f1) {
      f1.invulnerableTimer = 25;
      f1.isInvulnerable = false;
      if (f1.action === 'barrage_clash') {
        f1.action = 'idle';
        f1.actionTimer = 0;
        f1.actionDuration = 0;
      }
    }
    if (f2) {
      f2.invulnerableTimer = 25;
      f2.isInvulnerable = false;
      if (f2.action === 'barrage_clash') {
        f2.action = 'idle';
        f2.actionTimer = 0;
        f2.actionDuration = 0;
      }
    }

    this.barrageClash.isActive = false;
    this.barrageClash.resolutionPhase = 'active';
    this.barrageClash.winnerId = null;
    this.barrageClash.meter = 0;
  }

  public addClashSpark(x: number, y: number, color1: string, color2: string) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 12;
    const col = Math.random() < 0.5 ? color1 : color2;
    this.particles.push({
      id: this.particleId++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 4,
      color: col,
      type: 'clash_spark',
      life: 14 + Math.floor(Math.random() * 10),
      maxLife: 24,
    });
  }

  public spawnContinuousClashParticles(cx: number, cy: number, f1: Fighter, f2: Fighter) {
    const cry1 = this.getFighterBarrageCry(f1);
    const cry2 = this.getFighterBarrageCry(f2);
    const col1 = cry1.color;
    const col2 = cry2.color;

    for (let i = 0; i < 4; i++) {
      this.addClashSpark(cx + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 24, col1, col2);
    }

    this.particles.push({
      id: this.particleId++,
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      size: 3,
      color: Math.random() < 0.5 ? col1 : col2,
      type: 'lightning_arc',
      originX: cx - 28,
      originY: cy + (Math.random() - 0.5) * 30,
      targetX: cx + 28,
      targetY: cy + (Math.random() - 0.5) * 30,
      life: 6,
      maxLife: 6,
    });

    if (this.frameCount % 4 === 0) {
      this.particles.push({
        id: this.particleId++,
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        size: 35,
        color: '#ffffff',
        type: 'clash_shockwave',
        life: 10,
        maxLife: 10,
      });
    }

    // Continuous floating Stand Cries behind each fighter
    if (this.frameCount % 5 === 0) {
      const c1 = cry1.cries[Math.floor(Math.random() * cry1.cries.length)];
      this.addStandCryParticle(
        f1.x - 30 - Math.random() * 40,
        f1.y + 15 + (Math.random() - 0.5) * 45,
        c1,
        cry1.color,
        cry1.strokeColor
      );

      const c2 = cry2.cries[Math.floor(Math.random() * cry2.cries.length)];
      this.addStandCryParticle(
        f2.x + f2.width + 30 + Math.random() * 40,
        f2.y + 15 + (Math.random() - 0.5) * 45,
        c2,
        cry2.color,
        cry2.strokeColor
      );
    }

    // Menacing floating Kanji particles drifting behind both fighters
    if (this.frameCount % 4 === 0) {
      const glyphs = ['ゴ', 'ド', 'バシィ', 'ズガッ', 'ドドン', 'ズキュウウウン'];
      const chosenGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const targetFighter = side === 'left' ? f1 : f2;
      const targetColor = side === 'left' ? col1 : col2;
      const offX = side === 'left' ? -35 - Math.random() * 50 : targetFighter.width + 35 + Math.random() * 50;

      this.addMenacingParticle(
        targetFighter.x + offX,
        targetFighter.y - 15 + (Math.random() - 0.5) * 40,
        chosenGlyph,
        targetColor
      );
    }
  }
}
