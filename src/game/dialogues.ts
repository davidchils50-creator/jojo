export interface DialogueLine {
  speakerId: string;
  speakerName: string;
  standName?: string;
  side: 'player' | 'enemy';
  japaneseTitle: string;
  quoteJapanese: string;
  quoteTranslation: string;
  expression?: 'normal' | 'menacing' | 'angry' | 'smirk' | 'confident' | 'shocked';
}

export interface MatchIntroDialogue {
  id: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
}

export function getIntroDialogue(playerCharId: string, enemyCharId: string): MatchIntroDialogue {
  const pairKey = `${playerCharId}_vs_${enemyCharId}`;
  const reverseKey = `${enemyCharId}_vs_${playerCharId}`;

  // 1. JOTARO VS DIO
  if (pairKey === 'jotaro_vs_dio' || pairKey === 'dio_vs_jotaro') {
    const isPlayerJotaro = playerCharId === 'jotaro';
    return {
      id: 'jotaro_vs_dio',
      title: 'THE DESTINED SHOWDOWN',
      subtitle: 'カイロの死闘 (CLASH IN CAIRO)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ほう… 向かって来るのか… 逃げずにこのDIOに近づいて来るのか…？',
          quoteTranslation: '"Oh? You\'re approaching me? Instead of running away, you\'re coming right to me, DIO...?"',
          expression: 'smirk'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: '近づかなきゃ… てめーをブチのめせないんでな。',
          quoteTranslation: '"I can\'t beat the shit out of you without getting closer."',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フン！ では十分近づくがよい！ ザ・ワールド！！',
          quoteTranslation: '"Hmph! Then come as close as you like! THE WORLD!!"',
          expression: 'menacing'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… てめーのツラを叩き割ってやる！',
          quoteTranslation: '"Good grief... I\'m gonna smash that smug face of yours!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 2. JOSUKE VS JOTARO
  if (pairKey === 'crazy_diamond_vs_jotaro' || pairKey === 'jotaro_vs_crazy_diamond') {
    const isPlayerJosuke = playerCharId === 'crazy_diamond';
    return {
      id: 'josuke_vs_jotaro',
      title: 'DUEL IN MORIOH TOWN',
      subtitle: '杜王町の黄金の精神 (MEETING OF TWO GENERATIONS)',
      lines: [
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'お前が東方仗助か… 少し落ち着け。この町には危険なスタンド使いが潜んでいる。',
          quoteTranslation: '"So you\'re Josuke Higashikata... Calm down. Dangerous Stand users are lurking in this town."',
          expression: 'normal'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'オイアンタ… 今オレのこの自慢のヘアースタイルをサザエさんみてーって言ったかよォ？！',
          quoteTranslation: '"Hey mister... Did you just say my proud hairstyle looks like a weird sea snail?!"',
          expression: 'angry'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: '言ってないが… 頭に血が上ると周りが見えなくなるタイプだな。テストしてやる。',
          quoteTranslation: '"I didn\'t say that... But you seem like the type who loses all reason when enraged. Let\'s test you."',
          expression: 'confident'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'グレートだぜ！ 誰であろうとオレの頭をバカにした奴はブッ飛ばす！ クレイジー・D！',
          quoteTranslation: '"GREAT! Whoever insults my hair is getting pummeled! CRAZY DIAMOND!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 3. POLNAREFF VS DIO
  if (pairKey === 'silver_chariot_vs_dio' || pairKey === 'dio_vs_silver_chariot') {
    const isPlayerPol = playerCharId === 'silver_chariot';
    return {
      id: 'polnareff_vs_dio',
      title: 'THE STAIRWAY OF FEAR',
      subtitle: '階段の対峙 (POLNAREFF\'S RESOLVE)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerPol ? 'player' : 'enemy',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'DIO！ お前を倒すためにオレ達はここまで来た！ 階段の上から見下ろすな！',
          quoteTranslation: '"DIO! We came all this way to take you down! Stop looking down on me from atop those stairs!"',
          expression: 'angry'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerPol ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ポルナレフ… お前は優れた男だ。再び私の足元に跪くなら命だけは助けてやろう。',
          quoteTranslation: '"Polnareff... You are a capable man. If you kneel before me once more, I will spare your life."',
          expression: 'smirk'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerPol ? 'player' : 'enemy',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '断る！ オレのシルバーチャリオッツの針のような剣先がお前の心臓を刺し貫くぜ！',
          quoteTranslation: '"I refuse! The razor-sharp rapier of my Silver Chariot will pierce straight through your vile heart!"',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerPol ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フッ… 自ら死を選ぶか。ザ・ワールドの真の恐怖を味わうがいい！ WRYYYYY！',
          quoteTranslation: '"Hmph... So you choose death. Taste the true terror of THE WORLD! WRYYYYY!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 4. POLNAREFF VS DIAVOLO (Colosseum Rematch)
  if (pairKey === 'silver_chariot_vs_king_crimson' || pairKey === 'king_crimson_vs_silver_chariot') {
    const isPlayerPol = playerCharId === 'silver_chariot';
    return {
      id: 'polnareff_vs_diavolo',
      title: 'CLASH AT THE COLOSSEUM',
      subtitle: 'コロッセオの死闘 (DESTINY & THE ARROW)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerPol ? 'player' : 'enemy',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'ディアボロ！ 血の滴りを数えろ！ お前の「時を消し去る」能力は見切っている！',
          quoteTranslation: '"Diavolo! Count the blood droplets! I have seen right through your time-erasing ability!"',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerPol ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'ジャン・ピエール・ポルナレフ… 生きていたとはな。だが貴様はすでに「敗者」なのだ！',
          quoteTranslation: '"Jean Pierre Polnareff... To think you survived. But you are already a vanquished remnant of the past!"',
          expression: 'menacing'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerPol ? 'player' : 'enemy',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '矢はお前のような悪魔には決して渡さない！ 行くぞチャリオッツ！！',
          quoteTranslation: '"The Arrow will never fall into the clutches of a monster like you! Pierce him, Chariot!!"',
          expression: 'angry'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerPol ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'この世には「結果」だけが残る！ キング・クリムゾン！！',
          quoteTranslation: '"In this world, only the RESULTS remain! KING CRIMSON!!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 5. DIO VS DIAVOLO (Time Stop vs Time Erase)
  if (pairKey === 'dio_vs_king_crimson' || pairKey === 'king_crimson_vs_dio') {
    const isPlayerDio = playerCharId === 'dio';
    return {
      id: 'dio_vs_diavolo',
      title: 'BATTLE OF THE EMPERORS',
      subtitle: '頂上決戦 (STOPPED TIME VS ERASED TIME)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerDio ? 'player' : 'enemy',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'この世界の頂点に立つ帝王はこのDIOだ！ 時を飛ばす程度の小僧が、我が前に立つか？',
          quoteTranslation: '"The sole emperor atop this world is I, DIO! Does a coward who merely skips time dare stand before me?"',
          expression: 'smirk'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerDio ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '帝王はこのディアボロだ！ お前の「時を止める世界」すら、我がエピタフの予知の中にある！',
          quoteTranslation: '"The true emperor is Diavolo! Even your stopped world is already foreshown in my Epitaph!"',
          expression: 'menacing'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerDio ? 'player' : 'enemy',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: '身の程を知れッ！ 静止した時の中で貴様の体を両断してくれるわ！ WRYYYY！',
          quoteTranslation: '"Know your place! Within the frozen time, I shall rip you in two! WRYYYYY!"',
          expression: 'angry'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerDio ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '無駄だ！ 運命は我が絶頂を祝福している！ 吹き飛べッ！',
          quoteTranslation: '"Futile! Destiny crowns my everlasting climax! Perish!!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 6. JOTARO VS DIAVOLO
  if (pairKey === 'jotaro_vs_king_crimson' || pairKey === 'king_crimson_vs_jotaro') {
    const isPlayerJotaro = playerCharId === 'jotaro';
    return {
      id: 'jotaro_vs_diavolo',
      title: 'STAR OF JUSTICE VS CRIMSON TERROR',
      subtitle: '受け継がれる意志 (THE BOSS OF PASSIONE)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '我が正体を探ろうとする者は何者であれ生かしてはおかん… 消え去るのだ、空条承太郎！',
          quoteTranslation: '"Anyone who attempts to unveil my identity must be eliminated... Vanish, Jotaro Kujo!"',
          expression: 'menacing'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'イタリアを牛耳るパッショーネのボスがお前か。仲間を傷つけた罪… てめー自身で払ってもらうぜ。',
          quoteTranslation: '"So you\'re the boss of Passione terrorizing Italy. You\'re going to pay for every innocent soul you\'ve harmed."',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '我がキング・クリムゾンの前では貴様の力など無意味！ 「時」は消し飛び、貴様には死の結末のみが残る！',
          quoteTranslation: '"Before King Crimson, your strength is nothing! Time skips, leaving only your inevitable demise!"',
          expression: 'angry'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… お前の飛ばした時の中へ、オレが殴り込んでやる！',
          quoteTranslation: '"Good grief... I\'ll just punch right through whatever time you try to erase!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 7. JOSUKE VS DIO
  if (pairKey === 'crazy_diamond_vs_dio' || pairKey === 'dio_vs_crazy_diamond') {
    const isPlayerJosuke = playerCharId === 'crazy_diamond';
    return {
      id: 'josuke_vs_dio',
      title: 'GENERATIONAL VENGEANCE',
      subtitle: '血統の因縁 (JOSUKE MEETS DIO)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ジョセフ・ジョースターの息子か… なんと滑稽でみすぼらしいヘアースタイルのガキだ。',
          quoteTranslation: '"Joseph Joestar\'s bastard son, is it? What a comical, laughable hairstyle on such a brat."',
          expression: 'smirk'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'テメエ… 今… オレの頭のこと… なンだって言ったコラァァッッ！！！！',
          quoteTranslation: '"YOU BASTARD... RIGHT NOW... ABOUT MY HAIR... WHAT THE HELL DID YOU JUST SAYYY?!!"',
          expression: 'angry'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フッ、ジョースターの血を引く者は揃いも揃って単細胞よ。貴様の肉体、吸い尽くしてくれよう！',
          quoteTranslation: '"Heh, all who bear Joestar blood are predictable simpletons. I shall drain your youthful vitality dry!"',
          expression: 'menacing'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'オレの怒りはマックスだぜ！ アンタのその吸血鬼の顔面ごとブチ直してやる！！ ドラララ！！',
          quoteTranslation: '"My rage is at MAX! I\'m gonna smash that vampire face of yours beyond repair!! DORARARA!!"',
          expression: 'angry'
        }
      ]
    };
  }

  // 8. JOSUKE VS DIAVOLO
  if (pairKey === 'crazy_diamond_vs_king_crimson' || pairKey === 'king_crimson_vs_crazy_diamond') {
    const isPlayerJosuke = playerCharId === 'crazy_diamond';
    return {
      id: 'josuke_vs_diavolo',
      title: 'HEALING DIAMOND VS TIME ERASER',
      subtitle: '直す力と消す力 (REPAIR VS ERASE)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '何者だ小僧… 我が素顔を見た者は誰一人として生きて帰すわけにはいかん！',
          quoteTranslation: '"Who are you, brat... No one who has seen my true visage is permitted to leave alive!"',
          expression: 'menacing'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'オレは杜王町の高校生、東方仗助だ！ なんだか知らねーがアンタ、ヤバい匂いがプンプンするぜ！',
          quoteTranslation: '"I\'m high schooler Josuke Higashikata of Morioh! I don\'t know your deal, but you reek of pure villainy!"',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '貴様の「直す」力など、時を吹き飛ばすキング・クリムゾンの前では無意味！ 死ねッ！',
          quoteTranslation: '"Whatever you \'repair\' is meaningless before King Crimson that deletes time itself! Perish!"',
          expression: 'angry'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: '直すだけじゃねえ… 叩き壊す力もあるんだぜ！ ドラララララララァッ！！',
          quoteTranslation: '"I don\'t just fix things... I can smash things to pieces too! DORARARARARARA!!" ',
          expression: 'angry'
        }
      ]
    };
  }

  // 9. JOTARO VS POLNAREFF
  if (pairKey === 'jotaro_vs_silver_chariot' || pairKey === 'silver_chariot_vs_jotaro') {
    const isPlayerJotaro = playerCharId === 'jotaro';
    return {
      id: 'jotaro_vs_polnareff',
      title: 'COMRADES IN ARMS SPARRING',
      subtitle: '戦友のスパーリング (STARDUST CRUSADERS SPARRING)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '承太郎！ オレのシルバーチャリオッツの神速の剣技、受けてみるかい？！',
          quoteTranslation: '"Jotaro! Care to test your reflexes against the godspeed swordplay of my Silver Chariot?!"',
          expression: 'smirk'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'ポルナレフ、手加減はしねえぜ。スタープラチナでそのレイピアをへし折ってやる。',
          quoteTranslation: '"Polnareff, I won\'t pull my punches. Star Platinum will catch every single thrust."',
          expression: 'confident'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJotaro ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'ハハッ！ そうこなくっちゃな！ ブラボー！ ブラボー！ 行くぜッ！',
          quoteTranslation: '"Haha! That\'s the spirit! BRAVO! BRAVO! En garde!!"',
          expression: 'confident'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJotaro ? 'player' : 'enemy',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… いつでも来い。オラァッ！',
          quoteTranslation: '"Good grief... Come at me anytime. ORAAA!"',
          expression: 'normal'
        }
      ]
    };
  }

  // 10. JOSUKE VS POLNAREFF
  if (pairKey === 'crazy_diamond_vs_silver_chariot' || pairKey === 'silver_chariot_vs_crazy_diamond') {
    const isPlayerJosuke = playerCharId === 'crazy_diamond';
    return {
      id: 'josuke_vs_polnareff',
      title: 'CRUSADER MEETS MORIOH YOUTH',
      subtitle: '友情の剣戟 (KNIGHT MEETS HEALING FIST)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '君が承太郎の言っていた仗助君か！ そのリーゼント、フランスでも流行りそうなくらいイカしてるぜ！',
          quoteTranslation: '"So you\'re Josuke, the one Jotaro mentioned! That pompadour is cool enough to become a trend in France!"',
          expression: 'smirk'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'へへっ！ アンタ見る目あるじゃんか！ 承太郎さんの友達なら手加減なしでいくぜ！',
          quoteTranslation: '"Hehe! You\'ve got great taste! If you\'re Jotaro-san\'s comrade, I won\'t hold back!"',
          expression: 'confident'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJosuke ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '騎士として全力で相手をするのが礼儀だ！ ブラボー！ 刺突を見切れるかな？！',
          quoteTranslation: '"As a knight, giving my all is my courtesy! BRAVO! Can you evade my supersonic thrusts?!"',
          expression: 'confident'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJosuke ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'グレートにいかせてもらうぜ！ クレイジー・ダイヤモンド！！',
          quoteTranslation: '"I\'m gonna make this GREAT! CRAZY DIAMOND!!" ',
          expression: 'normal'
        }
      ]
    };
  }

  // 11. MIRROR MATCHES
  if (playerCharId === enemyCharId) {
    if (playerCharId === 'jotaro') {
      return {
        id: 'jotaro_mirror',
        title: 'MIRROR PHANTOM CLASH',
        subtitle: '二人の承太郎 (STAR PLATINUM VS STAR PLATINUM)',
        lines: [
          {
            speakerId: 'jotaro',
            speakerName: 'Jotaro (1P)',
            standName: 'Star Platinum',
            side: 'player',
            japaneseTitle: '空条 承太郎 (1P)',
            quoteJapanese: 'これは… 敵のスタンドによる幻覚か…？',
            quoteTranslation: '"Is this... an illusion caused by an enemy Stand...?"',
            expression: 'normal'
          },
          {
            speakerId: 'jotaro',
            speakerName: 'Jotaro (2P)',
            standName: 'Star Platinum',
            side: 'enemy',
            japaneseTitle: '空条 承太郎 (2P)',
            quoteJapanese: '偽物がどっちか、オラオララッシュで白黒つけてやる。',
            quoteTranslation: '"Let\'s settle which one of us is the fake with an ORA rush."',
            expression: 'confident'
          },
          {
            speakerId: 'jotaro',
            speakerName: 'Jotaro (1P)',
            standName: 'Star Platinum',
            side: 'player',
            japaneseTitle: '空条 承太郎 (1P)',
            quoteJapanese: 'やれやれだぜ… てめーを叩きのめすだけだ。',
            quoteTranslation: '"Good grief... I\'ll just beat you into dust."',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'dio') {
      return {
        id: 'dio_mirror',
        title: 'BATTLE FOR THE THRONE',
        subtitle: '真の帝王 (WHO IS THE TRUE DIO?)',
        lines: [
          {
            speakerId: 'dio',
            speakerName: 'DIO (1P)',
            standName: 'THE WORLD',
            side: 'player',
            japaneseTitle: '帝王 DIO (1P)',
            quoteJapanese: 'このDIOが二人いるだと？！ この世界の支配者はただ一人、私だけで十分だ！',
            quoteTranslation: '"There are two of DIO?! One supreme ruler is enough for this entire world!"',
            expression: 'menacing'
          },
          {
            speakerId: 'dio',
            speakerName: 'DIO (2P)',
            standName: 'THE WORLD',
            side: 'enemy',
            japaneseTitle: '帝王 DIO (2P)',
            quoteJapanese: '偽物め！ ザ・ワールドの真の力を見せて塵に変えてくれるわ！ WRYYYYY！',
            quoteTranslation: '"Imposter! I shall show you the true power of THE WORLD and turn you to ash! WRYYYYY!"',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'crazy_diamond') {
      return {
        id: 'josuke_mirror',
        title: 'DOUBLE POMPADOUR CLASH',
        subtitle: 'ドッペルゲンガー (TWO CRAZY DIAMONDS)',
        lines: [
          {
            speakerId: 'crazy_diamond',
            speakerName: 'Josuke (1P)',
            standName: 'Crazy Diamond',
            side: 'player',
            japaneseTitle: '東方 仗助 (1P)',
            quoteJapanese: 'うおっ？！ なんだお前？！ オレと全く同じリーゼントしてんじゃねーか！',
            quoteTranslation: '"Whoa?! What are you doing with the exact same pompadour as mine?!"',
            expression: 'shocked'
          },
          {
            speakerId: 'crazy_diamond',
            speakerName: 'Josuke (2P)',
            standName: 'Crazy Diamond',
            side: 'enemy',
            japaneseTitle: '東方 仗助 (2P)',
            quoteJapanese: 'こっちのセリフだぜ！ グレートに決着をつけようじゃねーか！ ドラララ！',
            quoteTranslation: '"That\'s my line! Let\'s settle this GREAT style! DORARARA!"',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'king_crimson') {
      return {
        id: 'diavolo_mirror',
        title: 'PARADOX OF DESTINY',
        subtitle: '時間のパラドックス (TWO DESTINIES)',
        lines: [
          {
            speakerId: 'king_crimson',
            speakerName: 'Diavolo (1P)',
            standName: 'King Crimson',
            side: 'player',
            japaneseTitle: '帝王 ディアボロ (1P)',
            quoteJapanese: '我が絶頂を脅かす偽物め… 時を消し飛ばして消去してやる！',
            quoteTranslation: '"An imposter threatening my apex... I shall erase you within skipped time!"',
            expression: 'menacing'
          },
          {
            speakerId: 'king_crimson',
            speakerName: 'Diavolo (2P)',
            standName: 'King Crimson',
            side: 'enemy',
            japaneseTitle: '帝王 ディアボロ (2P)',
            quoteJapanese: '運命が選んだ真の帝王はこの私だ！ キング・クリムゾン！！',
            quoteTranslation: '"The true emperor chosen by destiny is I! KING CRIMSON!!"',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'silver_chariot') {
      return {
        id: 'polnareff_mirror',
        title: 'DUEL OF THE FRENCH RAPIERS',
        subtitle: '鏡の中の騎士 (MIRROR KNIGHT DUEL)',
        lines: [
          {
            speakerId: 'silver_chariot',
            speakerName: 'Polnareff (1P)',
            standName: 'Silver Chariot',
            side: 'player',
            japaneseTitle: 'ポルナレフ (1P)',
            quoteJapanese: 'ええっ？！ オレと同じイケメンがもう一人いるだと？！',
            quoteTranslation: '"Whaaat?! There\'s another handsome guy just like me?!"',
            expression: 'shocked'
          },
          {
            speakerId: 'silver_chariot',
            speakerName: 'Polnareff (2P)',
            standName: 'Silver Chariot',
            side: 'enemy',
            japaneseTitle: 'ポルナレフ (2P)',
            quoteJapanese: 'ハハッ！ 本物の剣技のキレを見せてやるぜ！ ブラボー！ ブラボー！',
            quoteTranslation: '"Haha! I\'ll show you whose sword technique is truly sharper! BRAVO! BRAVO!"',
            expression: 'confident'
          }
        ]
      };
    }
  }

  // JONATHAN VS DIO (Phantom Blood Showdown)
  if (pairKey === 'jonathan_vs_dio' || pairKey === 'dio_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_dio',
      title: 'FATE OF PHANTOM BLOOD',
      subtitle: '宿命の血族 (SUNLIGHT VS VAMPIRIC DARKNESS)',
      lines: [
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'ディオ！ お前との因縁… ここで断ち切る！ この波紋の呼吸で貴様を滅ぼす！',
          quoteTranslation: '"Dio! Our fateful ties end right here! With this Hamon breathing, I will destroy your darkness!"',
          expression: 'angry'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD / Vampire',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フハハハハ！ ジョナサン！ 貧弱！ 貧弱ゥ！ 人間のお前がこのDIOに勝てると思うかァ！',
          quoteTranslation: '"Fuhahaha! Jonathan! Weak! So ridiculously weak! Do you truly think a mortal human can overcome DIO?!"',
          expression: 'smirk'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'ふるえるぞハート！ 燃えつきるほどヒート！！ 刻むぞ血液のビート！ サンライトイエローオーバードライブ！！',
          quoteTranslation: '"My heart resonates! Heat to total burn!! Engrave the beat of my pulse! SUNLIGHT YELLOW OVERDRIVE!!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS DIAVOLO
  if (pairKey === 'jonathan_vs_king_crimson' || pairKey === 'king_crimson_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_diavolo',
      title: 'PIONEER OF SUNLIGHT VS KING OF SHADOWS',
      subtitle: '初代ジョースターVS帝王 (SUNLIGHT OVERDRIVE VS TIME ERASER)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '我が頂点に立ちふさがる者は何者だ… 過去の亡霊め！ 消え去るがいい！',
          quoteTranslation: '"Who dares stand before my climax... A ghost from the distant past! Begone!"',
          expression: 'menacing'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君の目には底知れぬ悪意と恐怖しか見えない！ 僕は犠牲となった者たちのために戦う！',
          quoteTranslation: '"I see nothing but bottomless malice and terror in your eyes! I fight for all those who suffered by your hands!"',
          expression: 'angry'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'このキング・クリムゾンで時間を吹き飛ばし、死の未来へ送ってやる！',
          quoteTranslation: '"King Crimson will erase time and leap straight to your inevitable death!"',
          expression: 'angry'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '波紋の呼吸は絶えない！ 太陽の波紋疾走（サンライトイエローオーバードライブ）を受けろ！',
          quoteTranslation: '"The rhythm of my Hamon will never fade! Take this Sunlight Yellow Overdrive!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS POLNAREFF
  if (pairKey === 'jonathan_vs_silver_chariot' || pairKey === 'silver_chariot_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_polnareff',
      title: 'GENTLEMAN & FRENCH KNIGHT',
      subtitle: '高潔なる騎士道 (HONORABLE FISTS VS SILVER RAPIER)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'これは驚いた！ 承太郎のご先祖様、ジョナサン・ジョースターか！ まさに本物の英国紳士だな！',
          quoteTranslation: '"Mon dieu! Jotaro\'s ancestor, Jonathan Joestar! A true English gentleman in the flesh!"',
          expression: 'smirk'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'フランスの騎士ジャン・ピエール・ポルナレフ君！ 君の剣技には誇りと高潔さを感じられる！',
          quoteTranslation: '"Jean Pierre Polnareff of France! I can feel immense pride and chivalry in your sword spirit!"',
          expression: 'normal'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'フッ、光栄だぜ！ ならば言葉はいらん、オレのシルバーチャリオッツと手加減なしで勝負だ！',
          quoteTranslation: '"Hah, I\'m honored! Then words are unnecessary—let\'s spar with my Silver Chariot, no holding back!"',
          expression: 'confident'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '望むところだ！ 紳士として全霊をかけて相手をしよう！',
          quoteTranslation: '"That is my wish as well! As a gentleman, I shall respond with my absolute full strength!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS JOSUKE
  if (pairKey === 'jonathan_vs_crazy_diamond' || pairKey === 'crazy_diamond_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_josuke',
      title: 'GREAT-GREAT-GRANDFATHER & GREAT-GRANDSON',
      subtitle: 'ひ孫との出会い (SUNLIGHT RIPPLE & CRAZY REPAIR)',
      lines: [
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'うわッ？！ 承太郎さんから聞いた初代ジョースター、ジョナサンさん？！ マジでガタイが物凄いスね！',
          quoteTranslation: '"Whoa?! Great-Grandfather Jonathan, whom I heard about from Jotaro-san?! Your build is seriously monstrous!"',
          expression: 'shocked'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君が東方仗助君か！ 優しい心の持ち主だと伝わってくるよ。その髪型もとても個性的で素晴らしい！',
          quoteTranslation: '"So you are Josuke Higashikata! I can feel your kind heart. And that hairstyle of yours is uniquely splendid!"',
          expression: 'normal'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'へへっ！ 髪型を褒めてくれるなんて最高っスよ！ 黄金の精神で全力でいきますッ！',
          quoteTranslation: '"Hehe! Praising my hair makes you the best ever! I\'ll come at you with the full force of my Golden Spirit!"',
          expression: 'confident'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'ふむ！ ジョースター家の誇りをかけて、拳を交えよう！',
          quoteTranslation: '"Splendid! Bearing the pride of the Joestar family, let us clash our fists!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS YOUNG JOSEPH
  if (pairKey === 'jonathan_vs_joseph_young' || pairKey === 'joseph_young_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_joseph_young',
      title: 'GRANDFATHER & GRANDSON BATTLE',
      subtitle: '祖父と孫の拳 (THE NOBLE GENTLEMAN & THE TRICKSTER)',
      lines: [
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'げげっ？！ おじいちゃんのジョナサン？！ 本物かよ！ 噂通りの超マッチョだな！',
          quoteTranslation: '"Geh?! Grandfather Jonathan?! Are you real?! You really are ultra-jacked just like in the photos!"',
          expression: 'shocked'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君が孫のジョセフか！ 礼儀作法は少々型破りのようだが… 目には強い正義の光宿っている！',
          quoteTranslation: '"So you are my grandson Joseph! Your manners are quite unconventional... but a brilliant light of justice burns in your eyes!"',
          expression: 'normal'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ 次にお前は「クラッカーボレイの罠に気をつけろ」と言う！',
          quoteTranslation: '"Heh! Next you\'re gonna say: \'Be careful of the trap set by my Clacker Volley!\'"',
          expression: 'smirk'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'クラッカー…？ ははは、言葉遊びも達者だな！ 行くぞジョセフ！',
          quoteTranslation: '"Clacker...? Hahaha, clever with words as well! Here I come, Joseph!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS OLD JOSEPH
  if (pairKey === 'jonathan_vs_joseph_old' || pairKey === 'joseph_old_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_joseph_old',
      title: 'REUNION ACROSS 100 YEARS',
      subtitle: '100年の時を超えて (GRANDFATHER & MATURE GRANDSON)',
      lines: [
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'ジョナサンおじいちゃん…！ 奇跡だ、生きているうちにあなたと相まみえることができるとは…！',
          quoteTranslation: '"Grandfather Jonathan...! It\'s a miracle to stand face-to-face with you in my lifetime...!"',
          expression: 'normal'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'ジョセフ… 立派に成長し、多くの仲間を導く頼もしい男になったな！',
          quoteTranslation: '"Joseph... You have grown into a truly dependable man guiding many steadfast comrades!"',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'OH MY GOD! この老体ですが、波紋とハーミットパープルで全力でかからせてもらいます！',
          quoteTranslation: '"OH MY GOD! Though I am old now, I shall give everything with my Hamon and Hermit Purple!"',
          expression: 'angry'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'よし！ 我が血族の誇り高き魂を見せてくれ！',
          quoteTranslation: '"Good! Show me the proud, noble soul of our bloodline!"',
          expression: 'confident'
        }
      ]
    };
  }

  // JONATHAN VS JOTARO (Meeting Across Generations)
  if (pairKey === 'jonathan_vs_jotaro' || pairKey === 'jotaro_vs_jonathan') {
    const isPlayerJonathan = playerCharId === 'jonathan';
    return {
      id: 'jonathan_vs_jotaro',
      title: 'CROSS-GENERATION JOESTAR',
      subtitle: 'ジョースター家の血脈 (ORIGIN AND STAND)',
      lines: [
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君もジョースターの血を引く者なのか… 背後にあるその背後霊のようなオーラは一体…？！',
          quoteTranslation: '"You carry the Joestar blood as well... What is that phantom aura looming behind you?!"',
          expression: 'normal'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerJonathan ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: '高祖父ジョナサン… こいつは「スタンド」だ。やれやれ… 噂通りハンパないガタイだな。',
          quoteTranslation: '"Great-Great Grandfather Jonathan... This is a Stand. Good grief... You really are built like a fortress."',
          expression: 'confident'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerJonathan ? 'player' : 'enemy',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '素晴らしい！ 英国紳士として、我が子孫と全力を尽くして拳を交えよう！',
          quoteTranslation: '"Splendid! As an English gentleman, I shall clash fists with my descendant using all my might!"',
          expression: 'confident'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS DIO
  if (pairKey === 'joseph_young_vs_dio' || pairKey === 'dio_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_dio',
      title: 'TRICKSTER VS VAMPIRIC LORD',
      subtitle: '受け継ぐ波紋 (BATTLE TENDENCY VS THE WORLD)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ジョナサンの孫か… どこまでも鬱陶しい泥鼠どもめ！',
          quoteTranslation: '"Jonathan\'s grandson... What insufferable vermin you Joestars are!"',
          expression: 'menacing'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ ディオとかいう吸血鬼気取りのジジイ！ 次にお前は「このDIOが世界を支配する」と言う！',
          quoteTranslation: '"Heh! You vampire wanna-be geezer DIO! Next you\'re gonna say: \'I, DIO, shall rule this world!\'"',
          expression: 'smirk'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ナニ？！ …戯言をッ！ ザ・ワールドでその生意気な口を永遠に封じてやる！',
          quoteTranslation: '"WHAT?! ...Absurd nonsense! THE WORLD will seal that arrogant mouth forever!"',
          expression: 'angry'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'クラッカーボレイと波紋疾走（オーバードライブ）の味を教えてやるぜッ！',
          quoteTranslation: '"I\'ll teach you what my Clacker Volley and Hamon Overdrive taste like!"',
          expression: 'confident'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS JOTARO
  if (pairKey === 'joseph_young_vs_jotaro' || pairKey === 'jotaro_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_jotaro',
      title: 'GRANDFATHER & GRANDSON TIME CLASH',
      subtitle: '若き祖父と孫 (YOUNG TRICKSTER & COOL DELINQUENT)',
      lines: [
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'おいおい！ お前がワシの孫の承太郎か？！ なんつー目つきの悪さだ！ 学ランもイカつすぎだろ！',
          quoteTranslation: '"Hey hey! You\'re my grandson Jotaro?! What\'s with that scary glare?! That school uniform is way too intense!"',
          expression: 'shocked'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'じじい… 若い頃から調子乗りでうるさい奴だったんだな。やれやれだぜ。',
          quoteTranslation: '"Old man... So you were a noisy, arrogant show-off even when young. Good grief."',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'なんだとォ？！ 孫のくせに生意気だぞ！ ワシのトリックプレーで懲らしめてやる！',
          quoteTranslation: '"What did you say?! So cocky for a grandson! I\'ll teach you a lesson with my trick plays!"',
          expression: 'angry'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'スタープラチナでまとめて叩きのめしてやる。来い！',
          quoteTranslation: '"Star Platinum will knock some sense into you. Bring it!"',
          expression: 'angry'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS DIAVOLO
  if (pairKey === 'joseph_young_vs_king_crimson' || pairKey === 'king_crimson_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_diavolo',
      title: 'TRICKSTER VS TIME ERASER',
      subtitle: '予知と策謀 (PREDICTION & STRATAGEM)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '我が正体を暴こうとする者は何者だろうと抹殺する！ 貴様も例外ではない！',
          quoteTranslation: '"Whoever dares try to uncover my identity will be eliminated! You are no exception!"',
          expression: 'menacing'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ お前みたいなコソコソ隠れてるボスは、ワシの逃げ足と罠の標的にピッタリだぜ！',
          quoteTranslation: '"Heh! A cowardly hiding boss like you is the perfect target for my tactical escapes and traps!"',
          expression: 'smirk'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'キング・クリムゾン！ 貴様の浅はかな策など時間の消去の前には無価値！',
          quoteTranslation: '"King Crimson! Your shallow tricks are utterly worthless before erased time!"',
          expression: 'angry'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: '次にお前は「勝った！」と言う！ だが勝つのはこのワシだッ！',
          quoteTranslation: '"Next you\'re gonna say: \'I won!\' But the winner is me!"',
          expression: 'confident'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS POLNAREFF
  if (pairKey === 'joseph_young_vs_silver_chariot' || pairKey === 'silver_chariot_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_polnareff',
      title: 'CLACKER VOLLEY VS SILVER RAPIER',
      subtitle: 'トリックスターと騎士 (TRICKSTER & FRENCH RAPIER)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'ミスター・ジョースターの若い頃か！ 噂には聞いていたが本当にハチャメチャな男だな！',
          quoteTranslation: '"Mr. Joestar\'s youth! I heard stories, but you really are a crazy wild card!"',
          expression: 'smirk'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'おっ！ シルバーの甲冑を着たイカしたスタンドだな！ オレのクラッカーボレイと勝負してみるか？！',
          quoteTranslation: '"Ooh! That\'s a sick silver-armored Stand! Want to see how it fares against my Clacker Volley?!"',
          expression: 'confident'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: '言ったな！ シルバーチャリオッツの神速の突きを破れるか試してみな！ ブラボー！',
          quoteTranslation: '"You asked for it! See if you can dodge Silver Chariot\'s supersonic thrusts! BRAVO!"',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'オーケーオーケー！ 波紋肘打ち（ハモンエルボー）叩き込んでやるぜ！',
          quoteTranslation: '"Okay okay! I\'ll smash you with a Hamon Elbow!"',
          expression: 'smirk'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS JOSUKE
  if (pairKey === 'joseph_young_vs_crazy_diamond' || pairKey === 'crazy_diamond_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_josuke',
      title: 'UNMATCHED TRICKSTER & MORIOH HERO',
      subtitle: '若い父親と息子 (YOUNG FATHER & JOSUKE)',
      lines: [
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'うわッ！ ジョセフのじいさんの若い頃？！ なんかチャラくて信用できねーっスよ！',
          quoteTranslation: '"Whoa! Old man Joseph in his youth?! You look super flashy and suspicious!"',
          expression: 'shocked'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'おいおい、髪型に命かけてる高校生ちゃん！ ワシをバカにすると痛い目見るぜ！',
          quoteTranslation: '"Hey hey, high school kid who stakes his life on his hair! Mock me and you\'ll get hurt!"',
          expression: 'smirk'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: '髪型だと…？ じいさんだろうと許さねえ！ クレイジー・ダイヤモンドでぶちのめす！',
          quoteTranslation: '"My hair...? Even if you\'re future dad, I won\'t forgive you! Crazy Diamond!"',
          expression: 'angry'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ 次にお前は「ドラララ！」と言う！ 逃げて勝つのがワシの真骨頂だ！',
          quoteTranslation: '"Heh! Next you\'re gonna say: \'DORARARA!\' Running away to win is my true specialty!"',
          expression: 'confident'
        }
      ]
    };
  }

  // YOUNG JOSEPH VS OLD JOSEPH
  if (pairKey === 'joseph_young_vs_joseph_old' || pairKey === 'joseph_old_vs_joseph_young') {
    const isPlayerYoung = playerCharId === 'joseph_young';
    return {
      id: 'joseph_young_vs_joseph_old',
      title: 'PARADOX OF THE RIPPLE',
      subtitle: '二人のジョセフ (BATTLE TENDENCY VS STARDUST CRUSADERS)',
      lines: [
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'おいおいおい！ ひげ面のジジイ… まさか未来のオレ自身じゃねーだろうな？！',
          quoteTranslation: '"Hey hey hey! Old bearded geezer... Don\'t tell me you\'re future me?!"',
          expression: 'shocked'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerYoung ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'OH MY GOD! 若き日のワシか！ 相変わらず調子に乗りおって… 油断するなよ若造！',
          quoteTranslation: '"OH MY GOD! My youthful self! Cocky as ever... Don\'t let your guard down, kid!"',
          expression: 'angry'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph Joestar (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerYoung ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ 次にお前は「クラッカーボレイを舐めるなよ」と言う！',
          quoteTranslation: '"Heh! Next you\'re gonna say: \'Don\'t underestimate my Clacker Volley!\'"',
          expression: 'smirk'
        }
      ]
    };
  }

  // OLD JOSEPH VS JOTARO
  if (pairKey === 'joseph_old_vs_jotaro' || pairKey === 'jotaro_vs_joseph_old') {
    const isPlayerOld = playerCharId === 'joseph_old';
    return {
      id: 'joseph_old_vs_jotaro',
      title: 'STARDUST CRUSADERS SPARRING',
      subtitle: 'エジプトへの旅路 (GRANDFATHER & GRANDSON CRUSADE)',
      lines: [
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: '承太郎！ DIOとの決戦を前に、ワシのハーミットパープルでオラオララッシュのキレを試してやるぞ！',
          quoteTranslation: '"Jotaro! Before our final battle with DIO, let\'s test your ORA rush against my Hermit Purple!"',
          expression: 'normal'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'じじい、無理すんじゃねえ。怪我しても知らんぞ。',
          quoteTranslation: '"Old man, don\'t overexert yourself. Don\'t blame me if you get hurt."',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'OH NO! ワシをただの老いぼれと思うなよ！ 波紋とスタンドの複合技を見せてやる！',
          quoteTranslation: '"OH NO! Don\'t take me for a senile old fool! I\'ll show you the combination of Hamon and Stand!"',
          expression: 'angry'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… 手加減なしでいくぞ。',
          quoteTranslation: '"Good grief... I won\'t go easy on you."',
          expression: 'normal'
        }
      ]
    };
  }

  // OLD JOSEPH VS DIAVOLO
  if (pairKey === 'joseph_old_vs_king_crimson' || pairKey === 'king_crimson_vs_joseph_old') {
    const isPlayerOld = playerCharId === 'joseph_old';
    return {
      id: 'joseph_old_vs_diavolo',
      title: 'OLD CRUSADER VS PASSIONE BOSS',
      subtitle: '隠者の真価 (HERMIT VINES VS KING CRIMSON)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '老いぼれめ… 我が絶頂の前に立ち塞がるか。時間の露と消えるがいい！',
          quoteTranslation: '"Senile fool... Do you dare stand before my climax? Perish like dew in skipped time!"',
          expression: 'menacing'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'ポルナレフや若者たちを追い詰めた悪党が貴様か！ ワシの命に代えても野望を砕く！',
          quoteTranslation: '"So you\'re the scoundrel who cornered Polnareff and the young ones! I\'ll crush your ambitions even if it costs my life!"',
          expression: 'angry'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'キング・クリムゾン！ 貴様のハーミットパープルごと心臓を穿ち抜いてやる！',
          quoteTranslation: '"King Crimson! I shall pierce your heart along with your Hermit Purple!"',
          expression: 'angry'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'ハーミットパープル波紋疾走！ 絶望するのは貴様の方じゃ！',
          quoteTranslation: '"Hermit Purple Hamon Overdrive! The one who despairs is you!"',
          expression: 'confident'
        }
      ]
    };
  }

  // OLD JOSEPH VS POLNAREFF
  if (pairKey === 'joseph_old_vs_silver_chariot' || pairKey === 'silver_chariot_vs_joseph_old') {
    const isPlayerOld = playerCharId === 'joseph_old';
    return {
      id: 'joseph_old_vs_polnareff',
      title: 'EGYPTIAN TRAVEL COMPANIONS',
      subtitle: 'エジプト旅日記 (MR. JOESTAR & POLNAREFF)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'ミスター・ジョースター！ トイレの災難続きでストレス溜まってんだ、一本勝負付き合ってくださいよ！',
          quoteTranslation: '"Mr. Joestar! With all those bathroom troubles on our journey, I\'m stressed out—let me spar with you!"',
          expression: 'smirk'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'OH MY GOD! ポルナレフ、旅の途中で無駄な体力を使うなと言ったろう！ …まあ良い、ワシが相手だ！',
          quoteTranslation: '"OH MY GOD! Polnareff, didn\'t I tell you not to waste energy during our journey! ...Oh well, I\'m your opponent!"',
          expression: 'angry'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'ブラボー！ シルバーチャリオッツの高速刺突、見切れますか？！',
          quoteTranslation: '"BRAVO! Can you withstand Silver Chariot\'s high-speed rapiers?!"',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'ワシの紫の隠者（ハーミットパープル）を舐めるなよ！',
          quoteTranslation: '"Don\'t underestimate my Hermit Purple!"',
          expression: 'confident'
        }
      ]
    };
  }

  // OLD JOSEPH VS JOSUKE
  if (pairKey === 'joseph_old_vs_crazy_diamond' || pairKey === 'crazy_diamond_vs_joseph_old') {
    const isPlayerOld = playerCharId === 'joseph_old';
    return {
      id: 'joseph_old_vs_josuke',
      title: 'FATHER & SON OF MORIOH',
      subtitle: '杜王町の父子 (REUNION IN MORIOH TOWN)',
      lines: [
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'ジョセフのじいさん… あんたがオレの親父か。年取っててもかっこいいじゃねーか。',
          quoteTranslation: '"Old man Joseph... So you\'re my dad. You\'re pretty cool even with old age."',
          expression: 'normal'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: '仗助… 済まなかったな。だがお前の黄金の精神と立派な成長が見られてワシは本当に嬉しいぞ！',
          quoteTranslation: '"Josuke... Forgive me. But seeing your golden spirit and splendid growth makes me truly happy!"',
          expression: 'normal'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'へへっ、照れるじゃねーか。親父の腕前、クレイジー・ダイヤモンドで確かめさせてもらうぜ！',
          quoteTranslation: '"Hehe, don\'t embarrass me. Let me test your skills with Crazy Diamond!"',
          expression: 'confident'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'よし！ ワシも父親として全力を尽くそう！ ハーミットパープル！',
          quoteTranslation: '"Good! As your father, I will give my absolute best! Hermit Purple!"',
          expression: 'confident'
        }
      ]
    };
  }

  // OLD JOSEPH VS DIO (Stardust Crusaders Cairo Final Fight)
  if (pairKey === 'joseph_old_vs_dio' || pairKey === 'dio_vs_joseph_old') {
    const isPlayerOld = playerCharId === 'joseph_old';
    return {
      id: 'joseph_old_vs_dio',
      title: '50-YEAR DESTINED CRUSADE',
      subtitle: 'ジョースターの因縁 (HERMIT PURPLE VS THE WORLD)',
      lines: [
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph Joestar (Old)',
          standName: 'Hermit Purple',
          side: isPlayerOld ? 'player' : 'enemy',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'DIO！ ジョナサンの肉体を奪った貴様を… 50年の時を経てワシの手で打ち滅ぼす！',
          quoteTranslation: '"DIO! You who stole my grandfather Jonathan\'s body... After 50 years, I will destroy you with my own hands!"',
          expression: 'angry'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerOld ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ジョセフ・ジョースター… 隠者の紫（ハーミットパープル）など最弱のスタンド！ ザ・ワールドの餌食となれ！',
          quoteTranslation: '"Joseph Joestar... Your Hermit Purple is the most pathetic Stand! Become prey for THE WORLD!"',
          expression: 'smirk'
        }
      ]
    };
  }

  // MIRROR MATCHES FOR JONATHAN, YOUNG JOSEPH, OLD JOSEPH
  if (playerCharId === enemyCharId) {
    if (playerCharId === 'jonathan') {
      return {
        id: 'jonathan_mirror',
        title: 'DUEL OF NOBLE GENTLEMEN',
        subtitle: '二人のジョナサン (SUNLIGHT VS SUNLIGHT)',
        lines: [
          {
            speakerId: 'jonathan',
            speakerName: 'Jonathan (1P)',
            standName: 'Hamon Overdrive',
            side: 'player',
            japaneseTitle: 'ジョナサン (1P)',
            quoteJapanese: '僕と同じ姿… 敵のスタンドの罠なのか？！',
            quoteTranslation: '"An exact copy of me... Is this an enemy Stand trap?!"',
            expression: 'shocked'
          },
          {
            speakerId: 'jonathan',
            speakerName: 'Jonathan (2P)',
            standName: 'Hamon Overdrive',
            side: 'enemy',
            japaneseTitle: 'ジョナサン (2P)',
            quoteJapanese: '誇り高き紳士として、ニセモノには負けない！ サンライトイエローオーバードライブ！',
            quoteTranslation: '"As a proud gentleman, I won\'t lose to an imposter! Sunlight Yellow Overdrive!"',
            expression: 'confident'
          }
        ]
      };
    }

    if (playerCharId === 'joseph_young') {
      return {
        id: 'joseph_young_mirror',
        title: 'DOUBLE TRICKSTER MAYHEM',
        subtitle: '二人のジョセフ (WHO IS THE REAL TRICKSTER?)',
        lines: [
          {
            speakerId: 'joseph_young',
            speakerName: 'Joseph (1P)',
            standName: 'Clacker Volley',
            side: 'player',
            japaneseTitle: 'ジョセフ (1P)',
            quoteJapanese: 'おいおい！ ワシと同じハンサム顔がもう一人いるぞ？！',
            quoteTranslation: '"Hey hey! There\'s another handsome guy with my face?!"',
            expression: 'shocked'
          },
          {
            speakerId: 'joseph_young',
            speakerName: 'Joseph (2P)',
            standName: 'Clacker Volley',
            side: 'enemy',
            japaneseTitle: 'ジョセフ (2P)',
            quoteJapanese: 'へっ！ 次にお前は「クラッカーボレイを食らえ」と言う！',
            quoteTranslation: '"Heh! Next you\'re gonna say: \'Take my Clacker Volley!\'"',
            expression: 'smirk'
          }
        ]
      };
    }

    if (playerCharId === 'joseph_old') {
      return {
        id: 'joseph_old_mirror',
        title: 'CLASH OF THE OLD CRUSADERS',
        subtitle: '二人のジジイ (OH MY GOD x2)',
        lines: [
          {
            speakerId: 'joseph_old',
            speakerName: 'Joseph (1P)',
            standName: 'Hermit Purple',
            side: 'player',
            japaneseTitle: 'ジョセフ (1P)',
            quoteJapanese: 'OH MY GOD! ワシが二人おるだと？！ 一体どういうことじゃ！',
            quoteTranslation: '"OH MY GOD! There are two of me?! What is the meaning of this!"',
            expression: 'shocked'
          },
          {
            speakerId: 'joseph_old',
            speakerName: 'Joseph (2P)',
            standName: 'Hermit Purple',
            side: 'enemy',
            japaneseTitle: 'ジョセフ (2P)',
            quoteJapanese: 'ハーミットパープル！ どちらが本物のジョセフ・ジョースターか決着をつけるぞ！',
            quoteTranslation: '"Hermit Purple! Let\'s settle who the real Joseph Joestar is!"',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'gappy') {
      return {
        id: 'gappy_mirror',
        title: 'THE WALL EYES DUPLEX',
        subtitle: '２人の壁の目の男 (SAILOR BUBBLES VS SAILOR BUBBLES)',
        lines: [
          {
            speakerId: 'gappy',
            speakerName: 'Josuke (1P)',
            standName: 'Soft & Wet',
            side: 'player',
            japaneseTitle: '東方 仗助 (1P)',
            quoteJapanese: 'おい… なんでお前も水兵服を着て壁の目から出てきたんだ？',
            quoteTranslation: '"Hey... Why are you wearing a sailor suit and coming out of the Wall Eyes too?"',
            expression: 'shocked'
          },
          {
            speakerId: 'gappy',
            speakerName: 'Josuke (2P)',
            standName: 'Soft & Wet',
            side: 'enemy',
            japaneseTitle: '東方 仗助 (2P)',
            quoteJapanese: 'オレこそが東方仗助だ！ 康穂と一緒にごま蜜団子を食べるのはオレだぜ！ オラオラ！',
            quoteTranslation: '"I am the real Josuke Higashikata! The one eating Goma Mitsu Dango with Yasuho is me! ORA ORA!"',
            expression: 'angry'
          }
        ]
      };
    }

    if (playerCharId === 'tooru') {
      return {
        id: 'tooru_mirror',
        title: 'THE DUALITY OF CALAMITY',
        subtitle: '二つの厄災 (WONDER OF U VS WONDER OF U)',
        lines: [
          {
            speakerId: 'tooru',
            speakerName: 'Tooru (1P)',
            standName: 'Wonder of U',
            side: 'player',
            japaneseTitle: '透龍 (1P)',
            quoteJapanese: 'ほう… 私の前に、もう一人の院長（ワンダー・オブ・U）が立つというのかい？',
            quoteTranslation: '"Oh? Another Head Doctor (Wonder of U) stands before me...?"',
            expression: 'confident'
          },
          {
            speakerId: 'tooru',
            speakerName: 'Tooru (2P)',
            standName: 'Wonder of U',
            side: 'enemy',
            japaneseTitle: '透龍 (2P)',
            quoteJapanese: '先に相手を「追撃」した方に、世界最高の厄災が降り注ぐことになる…',
            quoteTranslation: '"Whichever of us pursues first shall be struck by the supreme calamity of this world..."',
            expression: 'menacing'
          }
        ]
      };
    }
  }

  // TOORU SPECIAL MATCHUPS
  if (pairKey === 'tooru_vs_jotaro' || pairKey === 'jotaro_vs_tooru') {
    const isPlayerTooru = playerCharId === 'tooru';
    return {
      id: 'tooru_vs_jotaro',
      title: 'THE LOGIC OF CALAMITY VS STOPPED TIME',
      subtitle: '厄災の理 VS 静止した世界',
      lines: [
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '空条承太郎… 君は私を追うつもりかい？ 厄災の流れに逆らうことは誰にもできない。',
          quoteTranslation: '"Jotaro Kujo... Do you intend to pursue me? No one can ever defy the flow of Calamity."',
          expression: 'confident'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… 厄災だろうが何だろうが、時を止めててめーのツラを叩き割るだけだ。',
          quoteTranslation: '"Good grief... Calamity or not, I\'ll just stop time and smash your face in."',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: 'その「向かって来る意志」こそが… すでに厄災のトリガーなんだよ。',
          quoteTranslation: '"That very will to approach me... is already the trigger for your destruction."',
          expression: 'menacing'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'てめーの理屈なんざ知るか！ スタープラチナ・ザ・ワールド！！',
          quoteTranslation: '"I don\'t give a damn about your logic! STAR PLATINUM: THE WORLD!!"',
          expression: 'angry'
        }
      ]
    };
  }

  if (pairKey === 'tooru_vs_dio' || pairKey === 'dio_vs_tooru') {
    const isPlayerTooru = playerCharId === 'tooru';
    return {
      id: 'tooru_vs_dio',
      title: 'CALAMITY OF NATURE VS THE VAMPIRE EMPEROR',
      subtitle: '岩人間の理 VS 闇の帝王',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'このDIOの前に立ちはだかるか、不気味な岩人間め！ 我がザ・ワールドの餌食となれ！',
          quoteTranslation: '"Do you dare stand before DIO, eerie Rock Human?! Become fodder for THE WORLD!"',
          expression: 'smirk'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '吸血鬼の帝王… DIOかい？ 人間だろうと不老不死だろうと、厄災の法則からは逃れられない。',
          quoteTranslation: '"Vampire emperor... DIO, was it? Whether human or immortal, none escape the law of Calamity."',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フン！ 止まった時の中では厄災など指一本動かせんわッ！ WRYYYYY！',
          quoteTranslation: '"Hmph! Within stopped time, your calamity cannot even lift a single finger! WRYYYYY!"',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '試してみるといい… 明夫明院長、姿を見せておやり。',
          quoteTranslation: '"Go ahead and try... Head Doctor Satoru Akefu, reveal yourself to him."',
          expression: 'menacing'
        }
      ]
    };
  }

  if (pairKey === 'tooru_vs_crazy_diamond' || pairKey === 'crazy_diamond_vs_tooru') {
    const isPlayerTooru = playerCharId === 'tooru';
    return {
      id: 'tooru_vs_josuke',
      title: 'THE BATTLE FOR THE LOCACACA',
      subtitle: 'ロカカカと杜王町 (DUEL OF CALAMITY)',
      lines: [
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: '透龍…！ 康穂やロカカカを利用して、この町で一体何を企んでやがるッ！',
          quoteTranslation: '"Tooru...! What the hell are you plotting in Morioh using Yasuho and the Locacaca fruit!"',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '東方仗助… 君は80年代の音楽を聴くかい？ 雨の音が聴こえるだろう… それが厄災の音だよ。',
          quoteTranslation: '"Josuke Higashikata... Do you listen to 80s music? Listen to the rain... That is the sound of Calamity."',
          expression: 'normal'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke Higashikata',
          standName: 'Crazy Diamond',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: 'ふざけたこと言ってんじゃねえ！ クレイジー・ダイヤモンドで叩き直してやる！',
          quoteTranslation: '"Quit screwing around! Crazy Diamond is going to smash you to pieces!"',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '「追撃」の意思… それが君の最期だ。ドウドウドウ・デ・ダダダ…',
          quoteTranslation: '"The intent to pursue... That will be your end. Dododo De Dadada..."',
          expression: 'menacing'
        }
      ]
    };
  }

  if (pairKey === 'tooru_vs_king_crimson' || pairKey === 'king_crimson_vs_tooru') {
    const isPlayerTooru = playerCharId === 'tooru';
    return {
      id: 'tooru_vs_diavolo',
      title: 'ABSOLUTE RESULTS VS THE FLOW OF CALAMITY',
      subtitle: '消し去られた時間 VS 厄災の理',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '何者であれ我が絶頂を脅かす者は排除する！ エピタフに映る未来はお前の敗北だ！',
          quoteTranslation: '"Anyone who threatens my eternal apex will be eliminated! Epitaph foresees your defeat!"',
          expression: 'menacing'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: 'ディアボロ… 10秒を消し去っても、厄災の流れは消せない。時間が戻れば厄災は2倍になって降りかかる。',
          quoteTranslation: '"Diavolo... Erasing 10 seconds cannot erase Calamity. When time resumes, disaster doubles."',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerTooru ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '黙れッ！ この世には「結果」だけが残る！ キング・クリムゾン！！',
          quoteTranslation: '"Silence! In this world, only the RESULTS remain! KING CRIMSON!!"',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerTooru ? 'player' : 'enemy',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '上を見なよ… 降ってくるのは君自身の厄災だ。',
          quoteTranslation: '"Look above you... What descends now is your very own calamity."',
          expression: 'menacing'
        }
      ]
    };
  }

  // --- ENRICO PUCCI SPECIAL MATCHUPS (PART 6: STONE OCEAN) ---

  // 1. PUCCI VS JOTARO (Cape Canaveral Climax)
  if (pairKey === 'pucci_vs_jotaro' || pairKey === 'jotaro_vs_pucci') {
    const isPlayerPucci = playerCharId === 'pucci';
    return {
      id: 'pucci_vs_jotaro',
      title: 'DESTINED FATE AT CAPE CANAVERAL',
      subtitle: 'ケープ・カナベラルの天国 (THE FINAL ACCELERATION)',
      lines: [
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Whitesnake',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '空条承太郎… お前の弱点は「娘」だ。時を止める2秒では、加速する運命に届かない！',
          quoteTranslation: '"Jotaro Kujo... Your daughter is your weakness. The 2 seconds of frozen time cannot outpace accelerated destiny!"',
          expression: 'confident'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum: The World',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'プッチ… てめーのその歪んだ「天国」とやらは、オレがここで叩き割って終わらせる！',
          quoteTranslation: '"Pucci... I\'m gonna smash that twisted \'Heaven\' of yours and end this here and now!"',
          expression: 'angry'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '時は加速する！ 螺旋階段、カブト虫、天国の時！ メイド・イン・ヘブンッ！！',
          quoteTranslation: '"Time accelerates! Spiral staircase, Rhinoceros beetle, Heaven is nigh! MADE IN HEAVEN!!" ',
          expression: 'menacing'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'スタープラチナ ザ・ワールド！！ てめーの野望をゼロにするぜ！',
          quoteTranslation: '"STAR PLATINUM: THE WORLD!! I\'ll reduce your ambitions to absolute zero!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 2. PUCCI VS DIO (The 1987 Chapel Meeting & The Path to Heaven)
  if (pairKey === 'pucci_vs_dio' || pairKey === 'dio_vs_pucci') {
    const isPlayerPucci = playerCharId === 'pucci';
    return {
      id: 'pucci_vs_dio',
      title: 'THE PROMISE OF GRAVITY',
      subtitle: '1987年の盟約 (DO YOU BELIEVE IN GRAVITY?)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'プッチ… お前は「引力」を信じるか？ 人と人との出会いはすべて引力なのだ。',
          quoteTranslation: '"Pucci... Do you believe in \'gravity\'? The encounters between souls are all dictated by gravity."',
          expression: 'smirk'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Whitesnake',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: 'DIO様… あなたの残した14の言葉のノート、私が必ず「天国」へと昇華させてみせます。',
          quoteTranslation: '"Lord DIO... The notebook of 14 words you left behind, I will guide it to its zenith in Heaven."',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: '見せてみよ、プッチ！ お前のホワイトスネイクの力… そして天国への覚悟を！',
          quoteTranslation: '"Then show me, Pucci! The resolve of your Whitesnake and your pursuit of Heaven!"',
          expression: 'confident'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'C-Moon / Made in Heaven',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '我が心に曇りなし… 全ては神とあなたの意志のままに！',
          quoteTranslation: '"My heart is unclouded... All according to the will of God and yours!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 3. PUCCI VS DIAVOLO (Time Erase vs Time Acceleration)
  if (pairKey === 'pucci_vs_king_crimson' || pairKey === 'king_crimson_vs_pucci') {
    const isPlayerPucci = playerCharId === 'pucci';
    return {
      id: 'pucci_vs_king_crimson',
      title: 'ERASED TIME VS ACCELERATED REALITY',
      subtitle: '時間の特異点 (ERASURE VS ACCELERATION)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '貴様の時間を加速させるスタンドなど… キング・クリムゾンの前では無意味！ 「結果」だけが残る！',
          quoteTranslation: '"Your Stand that accelerates time is utterly meaningless before King Crimson! Only the \'results\' remain!"',
          expression: 'angry'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '消し去った時間すらも無限の速度で置き去りにする… それがメイド・イン・ヘブンの特異点だ！',
          quoteTranslation: '"Even the time you erase is left behind at infinite velocity... That is the singularity of Made in Heaven!"',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson & Epitaph',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: 'エピタフの予知が… 追いつかないだと？！ 馬鹿なッ！',
          quoteTranslation: '"Epitaph\'s prophecy... cannot keep up with this speed?! Impossible!"',
          expression: 'shocked'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '覚悟とは暗闇の荒野に道を開くこと… 宇宙の一巡を目撃せよ！',
          quoteTranslation: '"Resolve is paving a path through the dark wilderness... Witness the reset of the universe!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 4. PUCCI VS TOORU (Gravity vs Calamity)
  if (pairKey === 'pucci_vs_tooru' || pairKey === 'tooru_vs_pucci') {
    const isPlayerPucci = playerCharId === 'pucci';
    return {
      id: 'pucci_vs_tooru',
      title: 'THE LAWS OF GRAVITY AND CALAMITY',
      subtitle: '引力と厄災の理 (SINGULARITY VS CALAMITY)',
      lines: [
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '透龍',
          quoteJapanese: '神父さん… 君のその天国への野望も、私を「追撃」するなら厄災に巻き込まれるだけだよ。',
          quoteTranslation: '"Father... That ambition of yours for Heaven will merely trigger calamity if you \'pursue\' me."',
          expression: 'smirk'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'C-Moon / Made in Heaven',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '厄災も物理法則の一つに過ぎん。重力の軸を変え、宇宙を一巡させれば厄災の因果すらも超越する！',
          quoteTranslation: '"Calamity is merely a physical law. By shifting gravity and resetting the universe, I transcend its causality!"',
          expression: 'confident'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerPucci ? 'enemy' : 'player',
          japaneseTitle: '透龍',
          quoteJapanese: '面白い仮説だね… でも、天国に着く前に落雷が君の頭上に落ちるよ。',
          quoteTranslation: '"An amusing theory... But before you reach Heaven, lightning will strike your crown."',
          expression: 'menacing'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Whitesnake',
          side: isPlayerPucci ? 'player' : 'enemy',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: 'ホワイトスネイク！ DISCを抜き取り、厄災の源を暴いてみせる！',
          quoteTranslation: '"Whitesnake! I will extract your DISC and expose the root of this calamity!"',
          expression: 'angry'
        }
      ]
    };
  }

  // --- JOSUKE HIGASHIKATA (GAPPY / PART 8 JOJOLION) SPECIAL MATCHUPS ---

  // 1. GAPPY VS JOTARO
  if (pairKey === 'gappy_vs_jotaro' || pairKey === 'jotaro_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_jotaro',
      title: 'STAR PLATINUM VS SOFT & WET',
      subtitle: '継承される星の血統 (MORIOH SAILOR MEETS STARDUST CHAMPION)',
      lines: [
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'お前… 首筋に星の痣があるな。杜王町の壁の目から救出された男か。',
          quoteTranslation: '"You... have a star birthmark on your neck. The man rescued from Morioh\'s Wall Eyes?"',
          expression: 'normal'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '空条承太郎… アンタ、オレが誰なのか知っているのか？！ オレの過去を教えてくれ！',
          quoteTranslation: '"Jotaro Kujo... Do you know who I truly am?! Tell me about my past!"',
          expression: 'angry'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: '言葉で語るよりスタンドで確かめる。その「シャボン玉」の真価を見せてみろ！',
          quoteTranslation: '"Rather than words, let\'s verify with Stand ability. Show me the true worth of those soap bubbles!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレの「ソフト＆ウェット」は何でも奪う！ スタープラチナの視界すらもな！ オラオラオラ！！',
          quoteTranslation: '"My Soft & Wet plunders anything! Even Star Platinum\'s sight! ORA ORA ORA!!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 2. GAPPY VS DIO
  if (pairKey === 'gappy_vs_dio' || pairKey === 'dio_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_dio',
      title: 'VAMPIRE KING VS PLUNDERING BUBBLES',
      subtitle: '摩擦を奪う泡 (STEALING VAMPIRIC VITALITY)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: '水兵服のガキが… このDIOの前に立ち塞がる気か？ 命が惜しくないようだな！',
          quoteTranslation: '"A brat in a sailor suit... Dares to stand before DIO? You must not value your life!"',
          expression: 'smirk'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'アンタの足元から「摩擦」を奪った… 一歩も動けず滑り続けるぜ、吸血鬼！',
          quoteTranslation: '"I\'ve stolen the friction from under your boots... You\'ll keep slipping endlessly, vampire!"',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'なッ… 足が滑るだと？！ 戯けが！ ザ・ワールド！ 時よ止まれッ！',
          quoteTranslation: '"Wha... My feet are sliding?! Foolish insect! THE WORLD! Time, stop!"',
          expression: 'angry'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '時を止めようが関係ない… この世に存在しない「回転の線」でお前を撃ち抜く！ オラァッ！',
          quoteTranslation: '"Stopping time matters not... This spinning line that doesn\'t exist in this world will pierce right through you! ORA!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 3. GAPPY VS CRAZY DIAMOND (JOSUKE PART 4)
  if (pairKey === 'gappy_vs_crazy_diamond' || pairKey === 'crazy_diamond_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_crazy_diamond',
      title: 'THE TWO JOSUKES OF MORIOH',
      subtitle: 'ふたりの東方仗助 (MORIOH 1999 VS MORIOH 2011)',
      lines: [
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke (Part 4)',
          standName: 'Crazy Diamond',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (4部)',
          quoteJapanese: 'おいおいマジかよ！ アンタも名前が「東方仗助」で、杜王町に住んでんのか？！',
          quoteTranslation: '"Hey hey, serious?! You\'re named \'Josuke Higashikata\' and live in Morioh Town too?!"',
          expression: 'shocked'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレは土の中から発見されて、東方家に引き取られた… 仗助という名は康穂がつけてくれたんだ。',
          quoteTranslation: '"I was found buried underground and taken in by the Higashikata family... Yasuho gave me the name Josuke."',
          expression: 'normal'
        },
        {
          speakerId: 'crazy_diamond',
          speakerName: 'Josuke (Part 4)',
          standName: 'Crazy Diamond',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (4部)',
          quoteJapanese: 'へえ〜！ なんだか運命的なものを感じるぜ！ どっちの「ドララ」と「オラオラ」が強いか勝負だ！',
          quoteTranslation: '"Whoa~! Feels like a fateful twist! Let\'s see whether your \'Ora Ora\' or my \'Dora Dora\' is stronger!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'グレートな勝負にしようじゃないか！ ソフト＆ウェット！ オラオラオラオラァッ！！',
          quoteTranslation: '"Let\'s make this a GREAT match! SOFT & WET! ORA ORA ORA ORAAA!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 4. GAPPY VS KING CRIMSON (DIAVOLO)
  if (pairKey === 'gappy_vs_king_crimson' || pairKey === 'king_crimson_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_king_crimson',
      title: 'ERASED TIME VS BEYOND EXISTENCE',
      subtitle: '存在せぬ泡の領域 (GO BEYOND VS TIME ERASE)',
      lines: [
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '消し去られた時間の中では、貴様のシャボン玉など一つとして届きはせん！ 死ねッ！',
          quoteTranslation: '"Within erased time, not a single one of your soap bubbles can ever reach me! Perish!"',
          expression: 'menacing'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレの星の痣から出るシャボン玉は… この世のどこにも存在しない「線」でできている。',
          quoteTranslation: '"The bubble emerging from my star birthmark... is made of a line that does not exist anywhere in this world."',
          expression: 'confident'
        },
        {
          speakerId: 'king_crimson',
          speakerName: 'Diavolo',
          standName: 'King Crimson',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '帝王 ディアボロ',
          quoteJapanese: '存在しないだと…？！ エピタフに映らない攻撃など… あり得んッ！',
          quoteTranslation: '"Does not exist...?! An attack invisible to Epitaph... Impossible!!"',
          expression: 'shocked'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '「ゴー・ビヨンド」！ 時も運命も越えて、お前を撃ち抜く！ オラァッ！',
          quoteTranslation: '"GO BEYOND! Transcending time and destiny, I shoot right through you! ORA!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 5. GAPPY VS SILVER CHARIOT (POLNAREFF)
  if (pairKey === 'gappy_vs_silver_chariot' || pairKey === 'silver_chariot_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_silver_chariot',
      title: 'THE FRENCH KNIGHT & THE BUBBLE SAILOR',
      subtitle: '神速の剣 VS 奪われる摩擦 (SWORD OF SPEED VS FRICTION PLUNDER)',
      lines: [
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'へえ！ その水兵服なかなかセンスいいじゃないか！ オレの速さにシャボン玉でついてこられるか？！',
          quoteTranslation: '"Heh! That sailor suit has pretty neat style! Can your soap bubbles keep up with my speed?!"',
          expression: 'smirk'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'シャボン玉が破裂した瞬間… アンタの足元の摩擦を奪った。',
          quoteTranslation: '"The instant my bubble popped... I stole the friction beneath your feet."',
          expression: 'confident'
        },
        {
          speakerId: 'silver_chariot',
          speakerName: 'J.P. Polnareff',
          standName: 'Silver Chariot',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ポルナレフ',
          quoteJapanese: 'うわぁぁッ？！ ま、滑る！ 床がツルッツルだぞーっ！ ブラボーだが勘弁してくれ！',
          quoteTranslation: '"Woaaah?! I-I\'m slipping! The floor is completely frictionless! Bravo, but give me a break!"',
          expression: 'shocked'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '勝負はこれからだ！ ソフト＆ウェット！ オラオラオラ！',
          quoteTranslation: '"The battle starts now! SOFT & WET! ORA ORA ORA!"',
          expression: 'normal'
        }
      ]
    };
  }

  // 6. GAPPY VS JONATHAN
  if (pairKey === 'gappy_vs_jonathan' || pairKey === 'jonathan_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_jonathan',
      title: 'FIRST JOESTAR & THE MEMORYLESS HERO',
      subtitle: '初代の波紋と8部の泡 (SUNLIGHT RIPPLE & SOFT BUBBLES)',
      lines: [
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君の目からは… 自分のルーツを探し求める強い意志と誠実さを感じられる！',
          quoteTranslation: '"In your eyes... I can feel an unyielding resolve and sincerity searching for your roots!"',
          expression: 'normal'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'ジョナサン・ジョースター… アンタの体から溢れる温かい光、なんだかとても懐かしい感じがする…',
          quoteTranslation: '"Jonathan Joestar... The warm light radiating from your body feels strangely familiar to me..."',
          expression: 'normal'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (波紋疾走)',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: 'それが血の絆だ！ 君の真の強さを確かめるため、太陽の波紋で全力で向かおう！',
          quoteTranslation: '"That is the bond of blood! To test your true strength, I come with the full power of Sunlight Hamon!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレも自分の大切な人たちを守るために… 全力で立ち向かう！ オラオラオラッ！',
          quoteTranslation: '"To protect the people precious to me... I will face you with all I have! ORA ORA ORA!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 7. GAPPY VS YOUNG JOSEPH
  if (pairKey === 'gappy_vs_joseph_young' || pairKey === 'joseph_young_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_joseph_young',
      title: 'TRICKSTER ANCESTOR VS WALL EYES SAILOR',
      subtitle: 'お前の次のセリフは (NEXT YOU\'RE GONNA SAY...)',
      lines: [
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'へっ！ おかしな水兵服を着たお前、次にお前は「オレの金玉は4つある」と言う！',
          quoteTranslation: '"Heh! Funny sailor boy, next you\'re gonna say: \'I have four testicles!\'"',
          expression: 'smirk'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレの睾丸は4つある… な、なぜそれを知っているッ？！',
          quoteTranslation: '"I have four testicles... W-Why do you know that?!"',
          expression: 'shocked'
        },
        {
          speakerId: 'joseph_young',
          speakerName: 'Joseph (Young)',
          standName: 'Hamon & Clacker Volley',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (18歳)',
          quoteJapanese: 'ハッハハ！ ワシの心理読みに驚いたか！ クラッカーボレイでお見舞いしてやるぜ！',
          quoteTranslation: '"Hahaha! Shocked by my mind reading?! I\'ll treat you to my Clacker Volley!"',
          expression: 'smirk'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'シャボン玉でアンタの声帯の振動を奪う！ これで予告はできないぜ！ オラオラ！',
          quoteTranslation: '"My bubble steals the vibration of your vocal cords! Now you can\'t predict lines anymore! ORA ORA!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 8. GAPPY VS OLD JOSEPH
  if (pairKey === 'gappy_vs_joseph_old' || pairKey === 'joseph_old_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_joseph_old',
      title: 'DIVINATION OF HERMIT PURPLE',
      subtitle: '隠者の紫と記憶の捜索 (DIVINING JOSEFUMI & KIRA)',
      lines: [
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph (Old)',
          standName: 'Hermit Purple',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'ワシのハーミットパープルで念写してみたが… お前は二人の人間が融合した存在なのか？！',
          quoteTranslation: '"I divined with Hermit Purple... Are you a fused existence of two human beings?!"',
          expression: 'shocked'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '空条吉良と初鹿野吉輝… 二人の男が壁の目の等価交換で一つになった… それがオレだ。',
          quoteTranslation: '"Kira Yoshikage and Josefumi Kujo... two men merged by equivalent exchange under the Wall Eyes... That is me."',
          expression: 'normal'
        },
        {
          speakerId: 'joseph_old',
          speakerName: 'Joseph (Old)',
          standName: 'Hermit Purple',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ (69歳)',
          quoteJapanese: 'なんという奇妙な運命じゃ…！ だがその覚悟、本物のジョースターの精神じゃな！',
          quoteTranslation: '"What a bizarre fate...! But that resolve is truly the spirit of a Joestar!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'おじいさん、感謝する… オレの道はオレ自身で切り開く！ オラオラオラッ！',
          quoteTranslation: '"Old man, thank you... I will carve my own path forward! ORA ORA ORA!"',
          expression: 'confident'
        }
      ]
    };
  }

  // 9. GAPPY VS TOORU
  if (pairKey === 'gappy_vs_tooru' || pairKey === 'tooru_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_tooru',
      title: 'THE FINAL SHOWDOWN FOR LOCACACA',
      subtitle: '厄災の理 VS 越えて行く力 (GO BEYOND THE CALAMITY)',
      lines: [
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '東方仗助… 君は私を「追撃」するつもりかい？ 厄災の理からは誰一人逃れられない。',
          quoteTranslation: '"Josuke Higashikata... Do you intend to \'pursue\' me? No one escapes the law of Calamity."',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '透龍！ 新ロカカカも、康穂も、この杜王町も… お前の思い通りにはさせない！',
          quoteTranslation: '"Tooru! The New Locacaca, Yasuho, and this Morioh Town... I will never let you have your way!"',
          expression: 'angry'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: '透龍 (TG大病院)',
          quoteJapanese: '無駄だよ。君がワンダー・オブ・Uに一歩近づくたび、致命的な災厄が君を襲う。',
          quoteTranslation: '"It\'s futile. Every step you take toward Wonder of U brings fatal disaster upon you."',
          expression: 'menacing'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'この世に存在しない無の回転…「ゴー・ビヨンド」！ 厄災の理を越えて打ち砕けぇぇっ！！',
          quoteTranslation: '"The spinning line of non-existence... \'GO BEYOND\'! Cross beyond the law of Calamity and shatter it!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // 10. GAPPY VS PUCCI
  if (pairKey === 'gappy_vs_pucci' || pairKey === 'pucci_vs_gappy') {
    const isPlayerGappy = playerCharId === 'gappy';
    return {
      id: 'gappy_vs_pucci',
      title: 'ACCELERATED FATE VS LINE BEYOND LOGIC',
      subtitle: '天国の一巡 VS 存在せぬ泡 (UNIVERSE RESET VS GO BEYOND)',
      lines: [
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '宇宙は一巡する… 運命を知ることこそが人類の真の「幸福」なのだ！',
          quoteTranslation: '"The universe shall reset... Knowing one\'s fate is humanity\'s true \'happiness\'!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '運命が決まっているだって…？ オレは自分の過去すら知らなかったが、自分で未来を選んできた！',
          quoteTranslation: '"Predetermined fate...? I didn\'t even know my own past, yet I chose my future with my own hands!"',
          expression: 'angry'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerGappy ? 'enemy' : 'player',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '加速する時間の中で、貴様のシャボン玉など追いつくことはできん！',
          quoteTranslation: '"Within accelerated time, your soap bubbles can never hope to keep up!"',
          expression: 'menacing'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerGappy ? 'player' : 'enemy',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: '「ゴー・ビヨンド」は物理法則も時間の加速も超越する！ 天国ごとぶち破るぜ！ オラァッ！',
          quoteTranslation: '"\'GO BEYOND\' transcends physical laws and time acceleration! I\'ll break through your Heaven! ORA!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS JOTARO KUJO
  if (pairKey === 'funny_valentine_vs_jotaro' || pairKey === 'jotaro_vs_funny_valentine') {
    const isPlayerValentine = playerCharId === 'funny_valentine';
    return {
      id: 'funny_valentine_vs_jotaro',
      title: 'JUSTICE OF THE NATION VS STAR PLATINUM',
      subtitle: '第23代大統領の宿願 (CLASH OF CONVICTIONS)',
      lines: [
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '空条承太郎… お前のその強大な力、実に見事だ。だが我が合衆国の繁栄の前に、一個人の意志など無意味だ。',
          quoteTranslation: '"Jotaro Kujo... Your tremendous power is indeed magnificent. But before the absolute prosperity of our nation, the will of a single individual is futile."',
          expression: 'confident'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'ナプキンだの国家の繁栄だの知ったこっちゃねえ… てめーの歪んだ正義ごと、オレのスタープラチナで叩き割る！',
          quoteTranslation: '"I don\'t give a damn about napkins or national prosperity... I\'ll smash your twisted justice to pieces with Star Platinum!"',
          expression: 'angry'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C: Love Train',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '我が心と行動に一点の曇りなし… 全てが『正義』だ！ ドジャア～～ン！',
          quoteTranslation: '"My heart and actions are utterly unclouded... They are all those of \'Justice\'! DOJYAA~~N!"',
          expression: 'menacing'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… てめーをブチのめすのに次元なんざ関係ねえ！',
          quoteTranslation: '"Good grief... Dimensions don\'t matter when it comes to beating the shit out of you!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS DIO
  if (pairKey === 'funny_valentine_vs_dio' || pairKey === 'dio_vs_funny_valentine') {
    const isPlayerValentine = playerCharId === 'funny_valentine';
    return {
      id: 'funny_valentine_vs_dio',
      title: 'THE 23RD PRESIDENT VS THE EMPEROR OF DARKNESS',
      subtitle: '世界の覇者と大統領 (THE SOVEREIGN VS THE EMPEROR)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'ほう… 大統領だと？ 人類を導くなどと傲慢なことをぬかす定命の虫けらが、このDIOの前に立つか！',
          quoteTranslation: '"Oh? A president? A mortal insect preaching about guiding humanity stands before the immortal DIO?!"',
          expression: 'smirk'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C: Love Train',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '吸血鬼だろうと世界の支配者を気取ろうと関係ない。我が国の未来を脅かす害悪は、並行世界の彼方へ消滅させる！',
          quoteTranslation: '"Vampire or self-proclaimed ruler, it matters not. Any menace threatening my country\'s future will be obliterated across parallel dimensions!"',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フン！貴様の次元など、この『世界』の静止した時の中で引き裂いてくれるわ！ ザ・ワールド！！',
          quoteTranslation: '"Hmph! Your dimensions shall be torn apart within THE WORLD\'s stopped time! THE WORLD!!"',
          expression: 'menacing'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '最初にナプキンを取るのは私だ！ D4C！！',
          quoteTranslation: '"The one who takes the first napkin is ME! D4C!!" ',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS ENRICO PUCCI
  if (pairKey === 'funny_valentine_vs_pucci' || pairKey === 'pucci_vs_funny_valentine') {
    const isPlayerValentine = playerCharId === 'funny_valentine';
    return {
      id: 'funny_valentine_vs_pucci',
      title: 'DIVINE DESTINY VS PATRIOTIC SANCTUARY',
      subtitle: '天国への引力と聖なる遺体 (GRAVITY VS THE CORPSE)',
      lines: [
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Whitesnake / Made in Heaven',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: 'ヴァレンタイン大統領… あなたは「引力」を信じますか？ 天国へ向かう人類の運命はすでに定められているのです。',
          quoteTranslation: '"President Valentine... Do you believe in \'gravity\'? The destiny of humanity heading towards Heaven has already been ordained."',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C: Love Train',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '引力だと？ 我が国を守るのは定まった運命ではない。聖なる遺体の加護と、最初にナプキンを掴み取る強い意志だ！',
          quoteTranslation: '"Gravity? What protects my nation is not preordained fate. It is the blessing of the Holy Corpse and the will to seize the first napkin!"',
          expression: 'confident'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '遺体の加護すら、全宇宙の一巡の前には無力… あなたの魂のDISCを捧げなさい！',
          quoteTranslation: '"Even the Corpse\'s blessing is futile before the reset of the universe... Surrender your soul\'s DISC!"',
          expression: 'menacing'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '全ての不幸はラブトレインの隙間から他所へ弾き飛ばされる！ ドジャア～～ン！',
          quoteTranslation: '"All misfortunes are effortlessly redirected away through the gap of Love Train! DOJYAA~~N!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS JOSUKE HIGASHIKATA (GAPPY)
  if (pairKey === 'funny_valentine_vs_gappy' || pairKey === 'gappy_vs_funny_valentine') {
    const isPlayerValentine = playerCharId === 'funny_valentine';
    return {
      id: 'funny_valentine_vs_gappy',
      title: 'CROSS-ERA SBR SAGA: 1890 TO 2011',
      subtitle: '時代を超えた遺志 (DIMENSIONAL ODYSSEY)',
      lines: [
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'あんたの体から… 杜王町の地下に眠る奇妙な次元の歪みを感じる。何者なんだ？！',
          quoteTranslation: '"I feel a bizarre dimensional distortion resonating from you, just like the depths of Morioh... Who are you?!"',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '遥か未来の杜王町の少年か… ジョニィ・ジョースターの血筋が受け継いだ因縁も、ここで断ち切ってやろう。',
          quoteTranslation: '"A boy from the distant future of Morioh... The lingering destiny inherited from Johnny Joestar ends right here."',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke (Gappy)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (8部)',
          quoteJapanese: 'オレの「ゴー・ビヨンド」は次元の壁すら越えて撃ち抜く！ 奪い取ってやるぜ！',
          quoteTranslation: '"My \'Go Beyond\' shoots through even the barrier of dimensions! I\'ll plunder through your wall!"',
          expression: 'menacing'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C: Love Train',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '越えられるものなら越えてみるがいい！ 絶対の正義の前に散れ！',
          quoteTranslation: '"Cross it if you dare! Perish before the absolute sanctuary of Justice!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS TOORU (WONDER OF U)
  if (pairKey === 'funny_valentine_vs_tooru' || pairKey === 'tooru_vs_funny_valentine') {
    const isPlayerValentine = playerCharId === 'funny_valentine';
    return {
      id: 'funny_valentine_vs_tooru',
      title: 'THE LOGIC OF CALAMITY VS LOVE TRAIN',
      subtitle: '厄災の理と完全なる幸福 (CALAMITY VS SANCTUARY)',
      lines: [
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '透龍 & WOU',
          quoteJapanese: '大統領… 君は私を追撃するつもりなのかい？ 「厄災の流れ」は君のどんな正義も粉砕するよ。',
          quoteTranslation: '"Mr. President... Are you intending to pursue me? The \'Flow of Calamity\' will crush whatever justice you claim."',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C: Love Train',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '厄災など、この世に満ちる「不運」の一端に過ぎん。我がラブトレインは全ての不運を無力化し他所へ受け流す！',
          quoteTranslation: '"Calamity is merely a fragment of the \'misfortunes\' filling this world. My Love Train neutralizes all misfortunes and redirects them away!"',
          expression: 'confident'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerValentine ? 'enemy' : 'player',
          japaneseTitle: '透龍 & WOU',
          quoteJapanese: '不運の受け流しだと…？ ならば地球の理そのものが君のナプキンを奪い去るだけさ。',
          quoteTranslation: '"Redirecting misfortune...? Then the very logic of the earth itself shall simply tear away your napkin."',
          expression: 'menacing'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C',
          side: isPlayerValentine ? 'player' : 'enemy',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '我が心と行動に一点の曇りなし！ 並行世界の狭間に消え去れ！ ドジャア～～ン！',
          quoteTranslation: '"My heart and actions are utterly unclouded! Disintegrate into the crevices of parallel worlds! DOJYAA~~N!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // FUNNY VALENTINE VS FUNNY VALENTINE (MIRROR MATCH)
  if (pairKey === 'funny_valentine_vs_funny_valentine') {
    return {
      id: 'funny_valentine_vs_funny_valentine',
      title: 'DUAL-DIMENSION CONVERGENCE',
      subtitle: '二人の大統領とパラドックス (TWO PRESIDENTS PARADOX)',
      lines: [
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine (Base)',
          standName: 'D4C (Base Dimension)',
          side: 'player',
          japaneseTitle: '基本世界の大統領',
          quoteJapanese: '並行世界から来た私か… 遺体を手にする権利を持つのは、この「基本世界」の私ただ一人だ！',
          quoteTranslation: '"My counterpart from a parallel world... The only one entitled to possess the Holy Corpse is ME of this \'Base Dimension\'!"',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine (Parallel)',
          standName: 'D4C (Parallel Dimension)',
          side: 'enemy',
          japaneseTitle: '並行世界の大統領',
          quoteJapanese: 'フッ… 我々の意志は等しく「合衆国の繁栄」。だが最初にナプキンを取る者が勝者だ！',
          quoteTranslation: '"Hmph... Our wills are equally dedicated to the nation\'s glory. But the one who takes the first napkin is the victor!"',
          expression: 'menacing'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine (Base)',
          standName: 'D4C: Paradox',
          side: 'player',
          japaneseTitle: '基本世界の大統領',
          quoteJapanese: '同一の存在が触れ合えば、メンガースポンジとなって消滅する… 覚悟するがいい！',
          quoteTranslation: '"When identical counterparts collide, they annihilate into Menger sponge cubes... Prepare yourself!"',
          expression: 'angry'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine (Parallel)',
          standName: 'D4C: Dojyaaan',
          side: 'enemy',
          japaneseTitle: '並行世界の大統領',
          quoteJapanese: '我が心と行動に一点の曇りなし！ ドジャア～～ン！',
          quoteTranslation: '"My heart and actions are utterly unclouded! DOJYAA~~N!"',
          expression: 'confident'
        }
      ]
    };
  }

  // DIPEZ VS TOORU (WONDER OF U)
  if (pairKey === 'dipez_vs_tooru' || pairKey === 'tooru_vs_dipez') {
    const isPlayerDipez = playerCharId === 'dipez';
    return {
      id: 'dipez_vs_tooru',
      title: 'LOGIC OF LIGHT VS THE FLOW OF CALAMITY',
      subtitle: '光の計算と絶対の災厄 (CALCULATION OF LIGHT VS ABSOLUTE CALAMITY)',
      lines: [
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '透龍 & WOU',
          quoteJapanese: 'ディペズ君… 君は非常に優秀で合理的だ。だが「厄災の理」は世界の決定事項、君の計算ごときで覆るものではないよ。',
          quoteTranslation: '"Dipez... you are highly intelligent and rational. But the \'Flow of Calamity\' is a fixed law of this world. It is not something your calculations can ever overturn."',
          expression: 'confident'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Photon Control',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ',
          quoteJapanese: '理だの厄災だの、ただの言い訳に過ぎない。私はあらゆる可能性をシミュレートし、それを打破するために血の滲むような訓練をしてきた。',
          quoteTranslation: '"Laws, calamities... those are just excuses. I have simulated every single possibility, and trained to the point of bleeding just to break them."',
          expression: 'confident'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '透龍 & WOU',
          quoteJapanese: '努力の量で「運命」に挑むというのかい？ それこそ最も非合理的な、愚者の思い上がりだよ。',
          quoteTranslation: '"Do you truly believe the sheer amount of your effort can challenge \'fate\'? That is the most irrational, foolish hubris of all."',
          expression: 'menacing'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Pure Light Form',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ (極限進化)',
          quoteJapanese: '愚者かどうかは、私の「光」が君の厄災の速度を超えた瞬間に証明される。数式は完成した。消えろ、亡霊。',
          quoteTranslation: '"Whether I am a fool will be proven the moment my \'Light\' outruns the speed of your calamity. The formula is complete. Begone, ghost."',
          expression: 'menacing'
        }
      ]
    };
  }

  // DIPEZ VS DIO
  if (pairKey === 'dipez_vs_dio' || pairKey === 'dio_vs_dipez') {
    const isPlayerDipez = playerCharId === 'dipez';
    return {
      id: 'dipez_vs_dio',
      title: 'THE PRAGMATIC STRIVER VS THE ARROGANT EMPEROR',
      subtitle: '極限の努力者と傲慢なる帝王 (THE GRITTY STRIVER VS THE ARROGANT MONARCH)',
      lines: [
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フン… 面白い光を放つ虫ケラだな。だが、生まれながらの帝王であるこのDIOの前に、その輝きはただのロウソクに過ぎん！',
          quoteTranslation: '"Hmph... a mere insect emitting an interesting glow. But before DIO, the born Emperor, your light is nothing more than a flickering candle!"',
          expression: 'smirk'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Photon Control',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ',
          quoteJapanese: '「帝王」か… 生まれついての才能に胡坐をかいているだけの奴は、どうにも虫酸が走る。言葉が多すぎるぞ、王様。',
          quoteTranslation: '"\'Emperor\'... People who just sit comfortably on their natural-born talents make my skin crawl. You talk too much, King."',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: '何だと…？！ このDIOの絶対的な「時間停止」の恐怖を、その身をもって知るがよい！ WRYYYYY！',
          quoteTranslation: '"What did you say...?! Learn the true terror of DIO\'s absolute \'Time Stop\' with your very body! WRYYYYY!"',
          expression: 'angry'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Pure Light Form',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ (極限進化)',
          quoteJapanese: '君の「時間停止」の起動速度も、射程範囲も、全て計算済みだ。傲慢さが君の盲点になる。努力の差を見せてやろう。',
          quoteTranslation: '"The activation speed of your \'Time Stop\', its range... I have calculated it all. Your arrogance is your blind spot. Let me show you the difference made by raw effort."',
          expression: 'menacing'
        }
      ]
    };
  }

  // DIPEZ VS GAPPY (JOSUKE HIGASHIKATA PART 8)
  if (pairKey === 'dipez_vs_gappy' || pairKey === 'gappy_vs_dipez') {
    const isPlayerDipez = playerCharId === 'dipez';
    return {
      id: 'dipez_vs_gappy',
      title: 'SPEED OF LIGHT VS THE EXISTENCELESS SPIN',
      subtitle: '光速の計算と存在せぬ泡 (LIGHTSPEED CALCULATION VS NON-EXISTENCE BUBBLES)',
      lines: [
        {
          speakerId: 'gappy',
          speakerName: 'Josuke Higashikata (Part 8)',
          standName: 'Soft & Wet',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (ジョジョリオン)',
          quoteJapanese: '君の光の技… 単なる超能力じゃないな。一歩間違えれば自滅するほどの速度を、凄まじい計算と訓練で制御している…！',
          quoteTranslation: '"Your light technique... it\'s not just some simple superpower. You\'re controlling a speed that could easily destroy you, purely through extreme calculation and training...!"',
          expression: 'confident'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Photon Control',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ',
          quoteJapanese: 'よく分かっているじゃないか、東方仗助。奇跡のような融合や「ゴー・ビヨンド」といった幸運に頼る奴らとは違ってね。私は自らの力でこれを掴み取った。',
          quoteTranslation: '"So you do understand, Josuke Higashikata. Unlike those who rely on lucky miracles like fusions or \'Go Beyond\', I grabbed this power with my own two hands."',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke Higashikata (Part 8)',
          standName: 'Go Beyond',
          side: isPlayerDipez ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助 (ジョジョリオン)',
          quoteJapanese: '幸運なんかじゃない。オレは自分の正体を知るために、そして大切な人を守るために全力で戦ってきたんだ。この泡は… 光であっても逃がさない！',
          quoteTranslation: '"It wasn\'t luck. I fought with everything I had to discover who I am and to protect the people I love. These bubbles... won\'t let even light escape!"',
          expression: 'menacing'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Pure Light Form',
          side: isPlayerDipez ? 'player' : 'enemy',
          japaneseTitle: 'ディペズ (極限進化)',
          quoteJapanese: '面白い。存在しない泡と、限界を超えた光速… どちらが勝つか、私の最高レベルの演算で見届けてやる。',
          quoteTranslation: '"Interesting. Bubbles that do not exist versus a speed of light that exceeds all limits... Let\'s see which wins under my highest level of calculation."',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS FUNNY VALENTINE
  if (pairKey === 'michael_vs_funny_valentine' || pairKey === 'funny_valentine_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_funny_valentine',
      title: 'NUMBER ONE JOCKEY VS PRESIDENTIAL AMBITION',
      subtitle: '先頭を駆ける者と国家の意志 (THE NUMBER ONE RUNNER VS NATIONAL WILL)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター (No.1 Jockey)',
          quoteJapanese: '大統領さんよ、あんたの長いお説教を聞いてる暇はないんだ。オレとジョージの前を走る奴は、誰であれ土煙を吸わせて置き去りにするだけさ。',
          quoteTranslation: '"Mr. President, I don\'t have time to listen to your lengthy sermons. Anyone who tries to run ahead of me and George is just going to choke on our dust."',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'Dirty Deeds Done Dirt Cheap (D4C)',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ファニー・ヴァレンタイン大統領',
          quoteJapanese: '傲慢な若造め… お前はただのレースを走っているつもりかもしれんが、歴史の頂点に立つのはこの私だ！ 「最初のナプキン」は譲らん！',
          quoteTranslation: '"Insolent brat... You think you are merely running a race, but it is I who shall stand atop history! I will not surrender the \'first napkin\'!"',
          expression: 'menacing'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'フッ、偉そうに語る割には、オレの背中すら拝めそうにないな。ゴールまで指くわえて見てな！ WRAAAA!!',
          quoteTranslation: '"Heh, for someone talking so big, you won\'t even catch a glimpse of my back. Stand back and watch me take the finish line! WRAAAA!!"',
          expression: 'confident'
        },
        {
          speakerId: 'funny_valentine',
          speakerName: 'Funny Valentine',
          standName: 'D4C - Love Train',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '第23代米合衆国大統領',
          quoteJapanese: '我が心と行動に一点の曇りなし………！ お前のその傲慢、隣の世界の塵に変えてくれよう！ ドジャア～～ン！',
          quoteTranslation: '"My heart and actions are utterly unclouded...! I will scatter your arrogance into the dust of an adjacent world! DOJYAA~~N!"',
          expression: 'confident'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS DIO
  if (pairKey === 'michael_vs_dio' || pairKey === 'dio_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_dio',
      title: 'SUPREME CHAMPION VS ANCIENT EMPEROR',
      subtitle: '頂点の誇りと夜の帝王 (CHAMPION PRIDE VS EMPEROR OF THE NIGHT)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター (No.1)',
          quoteJapanese: '世界を支配する帝王様か…？ 笑わせるなよ。オレから見れば、ただの時代遅れの老いぼれにしか見えないぜ。',
          quoteTranslation: '"An emperor who rules the world...? Don\'t make me laugh. From where I stand, you\'re just an outdated fossil."',
          expression: 'confident'
        },
        {
          speakerId: 'dio',
          speakerName: 'DIO',
          standName: 'THE WORLD',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '帝王 DIO',
          quoteJapanese: 'フハハハッ！ このDIOの前で減らず口を叩く青二才め！ その生意気な舌ごと引き裂いてミンチにしてやるわ！',
          quoteTranslation: '"Fuhahaha! Running your mouth before DIO, you insolent whelp?! I will rip you apart starting with that smart tongue!"',
          expression: 'angry'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '吠えるのは後にしてくれ。オレが勝つのは最初から決まってんだよ！ WRAAAA!!',
          quoteTranslation: '"Save the barking for later. It was decided from the very start that I\'m taking this win! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS JOTARO KUJO
  if (pairKey === 'michael_vs_jotaro' || pairKey === 'jotaro_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_jotaro',
      title: 'SPEED & INSTINCT VS UNBROKEN RESOLVE',
      subtitle: '若き天才と不動の拳 (YOUNG GENIUS VS UNYIELDING FISTS)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'おいおい、そんな怖い顔して睨みつけるなよ。オレとやる前から負けるのが分かってビビってんのか？',
          quoteTranslation: '"Hey now, don\'t glare at me with such a scary face. Are you already terrified because you know you\'re going to lose to me?"',
          expression: 'confident'
        },
        {
          speakerId: 'jotaro',
          speakerName: 'Jotaro Kujo',
          standName: 'Star Platinum',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '空条 承太郎',
          quoteJapanese: 'やれやれだぜ… くだらねえ口を叩くガキだ。てめーのその減らず口を、この拳で叩き直してやる。',
          quoteTranslation: '"Good grief... What a loudmouth brat. I\'ll fix that smug mouth of yours with this fist."',
          expression: 'menacing'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'やれるもんならやってみな！ 一瞬で置き去りにして、顔面をへし折ってやる！ WRAAAA!!',
          quoteTranslation: '"Try it if you can! I\'ll leave you behind in a flash and smash your face in! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS DIPEZ
  if (pairKey === 'michael_vs_dipez' || pairKey === 'dipez_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_dipez',
      title: 'TRACK CHAMPION VS CALCULATING MIND',
      subtitle: '勝負師の勘と冷徹な演算 (CHAMPION INSTINCT VS COLD CALCULATION)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター (No.1 Jockey)',
          quoteJapanese: 'おいディペズ、またブツブツと小難しい講釈を垂れてるのか？ 勝負ってのはな、最後に立ってた奴が1番なんだよ。',
          quoteTranslation: '"Hey Dipez, still muttering those overly complicated theories? In a real match, the one left standing at the end is number one."',
          expression: 'confident'
        },
        {
          speakerId: 'dipez',
          speakerName: 'Dipez',
          standName: 'Photon Control',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ディペズ',
          quoteJapanese: '傲慢な騎手め。己の勘を過信した愚か者がどうなるか、光の速度で教えてやる。',
          quoteTranslation: '"Arrogant jockey. I\'ll show you at the speed of light what happens to fools who rely solely on overconfident instinct."',
          expression: 'menacing'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '講釈は聞き飽きたぜ。オレの拳をそのツラに叩き込んで黙らせてやる！ WRAAAA!!',
          quoteTranslation: '"I\'m sick of your lectures. I\'ll drive my fist straight into your face and shut you up for good! WRAAAA!!"',
          expression: 'confident'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS JONATHAN JOESTAR
  if (pairKey === 'michael_vs_jonathan' || pairKey === 'jonathan_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_jonathan',
      title: 'SUPREME EQUESTRIAN VS GENTLEMAN RESOLVE',
      subtitle: '勝負師の閃光と紳士の誇り (CHAMPION FLASH VS GENTLEMAN PRIDE)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '英国の貴族様か… その生真面目な顔、勝負の世界じゃ何の役にも立たないぜ！',
          quoteTranslation: '"A British noble, huh? That serious face of yours won\'t do you any good in a real match!"',
          expression: 'confident'
        },
        {
          speakerId: 'jonathan',
          speakerName: 'Jonathan Joestar',
          standName: 'Hamon (Overdrive)',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ジョナサン・ジョースター',
          quoteJapanese: '君の走りと波紋の如き熱気… 確かに凄まじい！ だが紳士の誇りをかけた私の拳は決して折れない！',
          quoteTranslation: '"Your speed and heat are astounding! But my fists, fueled by a gentleman\'s pride, will never break!"',
          expression: 'angry'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '誇りなんて言葉じゃ腹は膨らまねえ！ ジョージ、あの高貴な体を土煙まみれにしてやれ！ WRAAAA!!',
          quoteTranslation: '"\'Pride\' won\'t fill an empty stomach! George, let\'s cover that noble body in dust! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS JOSEPH JOESTAR
  if (pairKey === 'michael_vs_joseph' || pairKey === 'joseph_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_joseph',
      title: 'EQUESTRIAN GENIUS VS TRICKSTER TACTICIAN',
      subtitle: '天才騎手と策士の駆け引き (GENIUS JOCKEY VS CUNNING TRICKSTER)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'お前のそのニヤニヤしたツラ、最初から気に食わねえんだよ。イカサマでも仕掛けるつもりか？',
          quoteTranslation: '"I\'ve hated that smug grin of yours right from the start. Planning to pull a cheap trick?"',
          expression: 'confident'
        },
        {
          speakerId: 'joseph',
          speakerName: 'Joseph Joestar',
          standName: 'Hamon & Hermit Purple',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ・ジョースター',
          quoteJapanese: 'ヘッ！ 次にお前は『オレとジョージの足に追いつける奴はいねえ！』と言う！',
          quoteTranslation: '"Heh! Next you\'re gonna say: \'There isn\'t a single soul who can catch up to me and George!\'"',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'オレとジョージの足に追いつける奴はいねえ！ …ハッ？！ テメェ、何をした？！',
          quoteTranslation: '"There isn\'t a single soul who can catch up to me and George! ...HUH?! What did you just do?!"',
          expression: 'shocked'
        },
        {
          speakerId: 'joseph',
          speakerName: 'Joseph Joestar',
          standName: 'Hamon Overdrive',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ジョセフ・ジョースター',
          quoteJapanese: 'ハハッ！ 馬の足が速くたって、ワイヤーの手繰り寄せには勝てねえぜ！ ハモン疾走！',
          quoteTranslation: '"Haha! No matter how fast your horse runs, it can\'t beat a clever wire trap! Hamon Run!"',
          expression: 'confident'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS GIORNO GIOVANNA
  if (pairKey === 'michael_vs_giorno' || pairKey === 'giorno_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_giorno',
      title: 'NUMBER ONE JOCKEY VS GOLDEN DREAM',
      subtitle: '頂点の執念と黄金の夢 (TOP TENACITY VS GOLDEN DREAM)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'ギャングのボスがこのオレに勝負を挑む気か？ 黄金の夢だか知らねえが、オレのキネティック・エネルギーで粉々に砕いてやる！',
          quoteTranslation: '"A gang boss wants to challenge me? I don\'t care about your Golden Dream, my kinetic energy will smash it to pieces!"',
          expression: 'confident'
        },
        {
          speakerId: 'giorno',
          speakerName: 'Giorno Giovanna',
          standName: 'Gold Experience Requiem',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'ジョルノ・ジョバァーナ',
          quoteJapanese: '僕には夢がある… そして君のその圧倒的な加速力と野心、決して嫌いではない。だが、終わりのない真実へたどり着くのは僕だ。',
          quoteTranslation: '"I have a dream... and I don\'t dislike your overwhelming acceleration and ambition. However, it is I who will reach the truth that never ends."',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '口だけならいくらでも言えるぜ！ ゴールド・ギャル（黄金の暴風）でその夢ごと吹き飛ばしてやる！ WRAAAA!!',
          quoteTranslation: '"Anyone can talk big! I\'ll blow away your dream along with you in a Gold Gale! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS ENRICO PUCCI
  if (pairKey === 'michael_vs_pucci' || pairKey === 'pucci_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_pucci',
      title: 'EQUESTRIAN ACCELERATION VS HEAVEN\'S GRAVITY',
      subtitle: '大地を駆ける足と天国の引力 (EARTH GALLOP VS HEAVENLY GRAVITY)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '神だの引力だの、神父様がレース場に何の用だ？ 天国に行きたいなら、オレの後ろを這ってついてきな！',
          quoteTranslation: '"God, gravity, destiny... What business does a priest have on the racetrack? If you want to go to Heaven, crawl behind me!"',
          expression: 'confident'
        },
        {
          speakerId: 'pucci',
          speakerName: 'Enrico Pucci',
          standName: 'Made in Heaven',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'エンリコ・プッチ神父',
          quoteJapanese: '知るがいい、ジュニスター… 人間が天国に到達するのは『引力』による必然。お前の速さもすでに『素数』の中に計算されているのだ！',
          quoteTranslation: '"Know this, Junister... Humanity reaching Heaven is a necessity guided by \'gravity\'. Even your speed was calculated within the prime numbers!"',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '素数だか何だか知らねえが！ ジョージの脚力とHat Priceの運動エネルギーは、お前の神様すら置き去りにするぜ！ WRAAAA!!',
          quoteTranslation: '"I don\'t care about your prime numbers! George\'s hooves and Hat Price\'s kinetic energy will leave even your God in the dust! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS TOORU
  if (pairKey === 'michael_vs_tooru' || pairKey === 'tooru_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_tooru',
      title: 'HYPERSONIC CHARGE VS PRINCIPLE OF CALAMITY',
      subtitle: '音速の突撃と厄災の理 (HYPERSONIC CHARGE VS LAW OF CALAMITY)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'おいおい、妙な気配のするガキだな… オレの前に立つな。踏み潰されたいのか？',
          quoteTranslation: '"Hey kid, you\'ve got a weird vibe around you... Get out of my way. Do you want to be trampled?"',
          expression: 'confident'
        },
        {
          speakerId: 'tooru',
          speakerName: 'Tooru',
          standName: 'Wonder of U',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '透龍 (ワンダー・オブ・U)',
          quoteJapanese: '君は競馬のチャンピオンらしいね… でも、『追いかける』という行為そのものが厄災を招くという理を、君の馬は理解しているのかな？',
          quoteTranslation: '"You seem to be a horse racing champion... But does your horse understand that the very act of \'pursuing\' brings calamity?"',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '厄災だと…？！ ふざけるな！ どんな災厄が来ようと、超音波を超える速度で突き破るだけだ！ 踏みつぶせ、ジョージ！！',
          quoteTranslation: '"Calamity...?! Don\'t make me laugh! Whatever disaster comes, we\'ll blast right through it faster than sound! Trample him, George!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS JOSUKE HIGASHIKATA (PART 8) / GAPPY
  if (pairKey === 'michael_vs_gappy' || pairKey === 'gappy_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_gappy',
      title: 'KINETIC ENERGY VS SOFT & WET BUBBLES',
      subtitle: '運動エネルギーと奪うシャボン玉 (KINETIC IMPACT VS PLUNDERING BUBBLES)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '水玉の泡を飛ばす変な奴だな… 泡でオレのジョージの足を止めるつもりか？！',
          quoteTranslation: '"A weird guy throwing water bubbles around... You think bubbles can stop my George\'s hooves?!"',
          expression: 'confident'
        },
        {
          speakerId: 'gappy',
          speakerName: 'Josuke Higashikata (Part 8)',
          standName: 'Soft & Wet: Go Beyond',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '東方 仗助',
          quoteJapanese: '僕は自分が誰なのか探している… だが君の馬のスピードは本物だ。僕の『シャボン玉』から奪えるものがあるか、試させてもらう。',
          quoteTranslation: '"I am searching for who I am... But your horse\'s speed is real. Let me see if there is something my bubbles can take from you."',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '奪えるもんなら奪ってみろ！ オレのHat Priceは衝撃を溜め込むほど強くなるんだよ！ WRAAAA!!',
          quoteTranslation: '"Try taking it if you can! My Hat Price grows stronger the more impact it absorbs! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS ARABIAN FAT (THE SUN)
  if (pairKey === 'michael_vs_arabian_fat' || pairKey === 'arabian_fat_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_arabian_fat',
      title: 'NUMBER ONE JOCKEY VS THE SCORCHING SUN',
      subtitle: '疾走する騎手と灼熱の太陽 (RUNNING JOCKEY VS BURNING SUN)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'クソッ、なんだこの異常な暑さは？！ 偽物の太陽を浮かべて気取ってんじゃねえぞ、デブ野郎！',
          quoteTranslation: '"Dammit, what\'s with this abnormal heat?! Don\'t act cool floating a fake sun up there, you fat bastard!"',
          expression: 'angry'
        },
        {
          speakerId: 'arabian_fat',
          speakerName: 'Arabian Fat',
          standName: 'The Sun',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: 'アラビア・ファッツ',
          quoteJapanese: 'ヒヒヒッ！ 砂漠の太陽は容赦ないぞ！ お前の自慢の馬も、干からびて熱中症で倒れるのがオチだな！',
          quoteTranslation: '"Heeheehee! The desert sun knows no mercy! Your prized horse will just shrivel up and collapse from heatstroke!"',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: 'ジョージをバカにするな！ 太陽の熱すらキネティック・メーターに変換して、そのツラに叩き込んでやるぜ！ WRAAAA!!',
          quoteTranslation: '"Don\'t insult George! We\'ll convert even the sun\'s heat into kinetic energy and drive it right into your face! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS VAMPIRE
  if (pairKey === 'michael_vs_vampire' || pairKey === 'vampire_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_vampire',
      title: 'EQUESTRIAN CHAMPION VS NOCTURNAL VAMPIRE',
      subtitle: '騎手と夜の吸血鬼 (JOCKEY VS NIGHT VAMPIRE)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '吸血鬼のバケモノか… オレとジョージの踏みつけの生贄にはちょうどいいぜ！',
          quoteTranslation: '"A vampire monster, huh... You\'re the perfect sacrifice to be trampled under me and George!"',
          expression: 'confident'
        },
        {
          speakerId: 'vampire',
          speakerName: 'Vampire Minion',
          standName: 'Vampiric Claws',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '屍生人 (ヴァンパイア)',
          quoteJapanese: 'ヒヒッ… 人間の分せいで馬に跨がり威張るな！ その生き血、一滴残らず吸い尽くしてやるわ！',
          quoteTranslation: '"Heehee... Don\'t posture riding a horse, tiny human! I\'ll drain every last drop of your fresh blood!"',
          expression: 'angry'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '血を吸う前に、その頭蓋骨をジョージの蹄で粉々に砕いてやる！ WRAAAA!!',
          quoteTranslation: '"Before you suck any blood, George\'s hooves will shatter your skull to dust! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // MICHAEL JUNISTER VS STICKMAN
  if (pairKey === 'michael_vs_stickman' || pairKey === 'stickman_vs_michael') {
    const isPlayerMichael = playerCharId === 'michael';
    return {
      id: 'michael_vs_stickman',
      title: 'NUMBER ONE JOCKEY VS SILENT STICKMAN',
      subtitle: '頂点の騎手と無口な棒人間 (JOCKEY VS SILENT STICKMAN)',
      lines: [
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '棒人間だと…？ ふざけた見た目しやがって、オレのウォーミングアップにもならねえな！',
          quoteTranslation: '"A stickman...? What a ridiculous look, you won\'t even serve as a warmup for me!"',
          expression: 'confident'
        },
        {
          speakerId: 'stickman',
          speakerName: 'Stickman Fighter',
          standName: 'Stick Aura',
          side: isPlayerMichael ? 'enemy' : 'player',
          japaneseTitle: '棒人間ファイター',
          quoteJapanese: '（静かなプレッシャーと共に素早い構えを取る）',
          quoteTranslation: '"(Silently adopts a swift fighting stance with intense pressure)"',
          expression: 'confident'
        },
        {
          speakerId: 'michael',
          speakerName: 'Michael Junister',
          standName: 'Hat Price',
          side: isPlayerMichael ? 'player' : 'enemy',
          japaneseTitle: 'マイケル・ジュニスター',
          quoteJapanese: '言葉も喋れねえのか！ 一瞬で吹き飛ばしてやるぜ！ WRAAAA!!',
          quoteTranslation: '"Can\'t even speak?! I\'ll blow you away in a single second! WRAAAA!!"',
          expression: 'menacing'
        }
      ]
    };
  }

  // DYNAMIC FALLBACK (Ensures no stickman / generic placeholders EVER appear)
  const pMeta = getCharDialogueMeta(playerCharId);
  const eMeta = getCharDialogueMeta(enemyCharId);

  return {
    id: `${playerCharId}_vs_${enemyCharId}`,
    title: `${pMeta.speakerName.toUpperCase()} VS ${eMeta.speakerName.toUpperCase()}`,
    subtitle: `${pMeta.japaneseTitle} VS ${eMeta.japaneseTitle}`,
    lines: [
      {
        speakerId: playerCharId,
        speakerName: pMeta.speakerName,
        standName: pMeta.standName,
        side: 'player',
        japaneseTitle: pMeta.japaneseTitle,
        quoteJapanese: pMeta.quote1,
        quoteTranslation: pMeta.trans1,
        expression: 'confident'
      },
      {
        speakerId: enemyCharId,
        speakerName: eMeta.speakerName,
        standName: eMeta.standName,
        side: 'enemy',
        japaneseTitle: eMeta.japaneseTitle,
        quoteJapanese: eMeta.quote2,
        quoteTranslation: eMeta.trans2,
        expression: 'angry'
      }
    ]
  };
}

function getCharDialogueMeta(charId: string) {
  switch (charId) {
    case 'gappy':
      return {
        speakerName: 'Josuke Higashikata (Part 8)',
        standName: 'Soft & Wet',
        japaneseTitle: '東方 仗助 (ジョジョリオン)',
        quote1: 'オレの「ソフト＆ウェット」は何でも奪う！',
        trans1: '"My Soft & Wet plunders anything!"',
        quote2: 'この世に存在しない回転の線… ゴー・ビヨンド！',
        trans2: '"The spinning line that doesn\'t exist in this world... GO BEYOND!"'
      };
    case 'pucci':
      return {
        speakerName: 'Enrico Pucci',
        standName: 'Whitesnake',
        japaneseTitle: 'エンリコ・プッチ神父',
        quote1: '人は天国へ行くべきなのだ… お前は「引力」を信じるか？',
        trans1: '"Humanity must attain Heaven... Do you believe in gravity?"',
        quote2: '螺旋階段、カブト虫、廃墟の街、イチジクのタルト… メイド・イン・ヘブン！',
        trans2: '"Spiral staircase, Rhinoceros beetle, Desolation row, Fig tart... MADE IN HEAVEN!"'
      };
    case 'jotaro':
      return {
        speakerName: 'Jotaro Kujo',
        standName: 'Star Platinum',
        japaneseTitle: '空条 承太郎',
        quote1: 'やれやれだぜ… てめーを叩きのめす。',
        trans1: '"Good grief... I\'m gonna beat you down."',
        quote2: '裁くのはオレのスタンドだ！',
        trans2: '"The one who will judge you is my Stand!"'
      };
    case 'dio':
      return {
        speakerName: 'DIO',
        standName: 'THE WORLD',
        japaneseTitle: '帝王 DIO',
        quote1: 'このDIOにひれ伏すがいい！ ザ・ワールド！',
        trans1: '"Kneel before DIO! THE WORLD!"',
        quote2: '無駄無駄無駄無駄ァ！ WRYYYYY！',
        trans2: '"Muda Muda Muda Muda! WRYYYYY!"'
      };
    case 'crazy_diamond':
      return {
        speakerName: 'Josuke Higashikata',
        standName: 'Crazy Diamond',
        japaneseTitle: '東方 仗助',
        quote1: 'オレのこの髪型をバカにする奴はぶちのめす！',
        trans1: '"Anyone who disses my hair is getting pummeled!"',
        quote2: 'グレートにいかせてもらうぜ！ クレイジー・D！',
        trans2: '"I\'m gonna make this GREAT! CRAZY DIAMOND!"'
      };
    case 'king_crimson':
      return {
        speakerName: 'Diavolo',
        standName: 'King Crimson',
        japaneseTitle: '帝王 ディアボロ',
        quote1: 'この世には「結果」だけが残る！',
        trans1: '"In this world, only the RESULTS remain!"',
        quote2: '我が絶頂を脅かす者は消し去る！',
        trans2: '"Anyone who threatens my apex will be erased!"'
      };
    case 'silver_chariot':
      return {
        speakerName: 'J.P. Polnareff',
        standName: 'Silver Chariot',
        japaneseTitle: 'ポルナレフ',
        quote1: '我がシルバーチャリオッツの神速の剣技を見よ！',
        trans1: '"Behold the godspeed swordplay of my Silver Chariot!"',
        quote2: 'ブラボー！ ブラボー！ 覚悟はいいか？！',
        trans2: '"BRAVO! BRAVO! Are you ready?!"'
      };
    case 'jonathan':
      return {
        speakerName: 'Jonathan Joestar',
        standName: 'Hamon Overdrive',
        japaneseTitle: 'ジョナサン・ジョースター',
        quote1: 'ふるえるぞハート！ 燃えつきるほどヒート！！',
        trans1: '"My heart resonates! Heat to total burn!!"',
        quote2: '英国紳士として全霊で相手をしよう！',
        trans2: '"As an English gentleman, I shall fight with all my soul!"'
      };
    case 'joseph_young':
      return {
        speakerName: 'Joseph Joestar (Young)',
        standName: 'Hamon & Clacker Volley',
        japaneseTitle: 'ジョセフ (18歳)',
        quote1: '次にお前は「ハッタリをかますな」と言う！',
        trans1: '"Next you\'re gonna say: \'Don\'t bluff with me!\'"',
        quote2: 'クラッカーボレイと波紋疾走の味を食らいな！',
        trans2: '"Take a taste of my Clacker Volley and Hamon Overdrive!"'
      };
    case 'joseph_old':
      return {
        speakerName: 'Joseph Joestar (Old)',
        standName: 'Hermit Purple',
        japaneseTitle: 'ジョセフ (69歳)',
        quote1: 'OH MY GOD! ワシをただの老いぼれと思うなよ！',
        trans1: '"OH MY GOD! Don\'t take me for a senile old fool!"',
        quote2: '隠者の紫（ハーミットパープル）波紋疾走！',
        trans2: '"Hermit Purple Hamon Overdrive!"'
      };
    case 'tooru':
      return {
        speakerName: 'Tooru',
        standName: 'Wonder of U',
        japaneseTitle: '透龍 & WOU',
        quote1: '厄災の流れは… 誰にも止めることはできない。',
        trans1: '"The flow of calamity... is something no one can ever halt."',
        quote2: '君は… 私を「追撃」するつもりなのかい？',
        trans2: '"Are you... intending to \'pursue\' me?"'
      };
    case 'funny_valentine':
      return {
        speakerName: 'Funny Valentine',
        standName: 'Dirty Deeds Done Dirt Cheap (D4C)',
        japaneseTitle: '第23代米合衆国大統領',
        quote1: '我が心と行動に一点の曇りなし………！ 全てが『正義』だ。',
        trans1: '"My heart and actions are utterly unclouded...! They are all those of \'Justice\'."',
        quote2: '最初にナプキンを取った者が、全てのルールを決めるのだ！ ドジャア～～ン！',
        trans2: '"The one who takes the first napkin determines all the rules of this world! DOJYAA~~N!"'
      };
    case 'dipez':
      return {
        speakerName: 'Dipez',
        standName: 'Photon Control',
        japaneseTitle: 'ディペズ',
        quote1: '美学だの運命だの、下らない。私は血のにじむ努力と計算だけでここまで来た。',
        trans1: '"Aesthetics, fate... how useless. I reached here purely through blood, sweat, and calculation."',
        quote2: 'お前のような「選ばれた天才」が一番虫酸が走るんだ。光の速度で計算を終わらせてやる。',
        trans2: '"Self-proclaimed \'chosen geniuses\' like you make my skin crawl. I\'ll finish my calculations at the speed of light."'
      };
    case 'michael':
      return {
        speakerName: 'Michael Junister',
        standName: 'Hat Price',
        japaneseTitle: 'マイケル・ジュニスター (No.1 Jockey)',
        quote1: 'オレとジョージの前を走れる奴なんて、この世に一人もいねえんだよ。',
        trans1: '"There isn\'t a single soul in this world who can run ahead of me and George."',
        quote2: '抜かせるわけねえだろ。テメェはオレの土煙でも吸ってな！ WRAAAA!!',
        trans2: '"You think I\'ll let you pass? Choke on my dust! WRAAAA!!"'
      };
    case 'perstein':
      return {
        speakerName: 'Perstein',
        standName: 'Wable the Metal Cutter',
        japaneseTitle: 'ウォーリー・ウェイブル (Perstein)',
        quote1: '嵐の後の静けさ……この70mのチェーンでお前の息の根を止めてやる。',
        trans1: '"Silence after the storm... with this 70m drive chain, I will sever your life."',
        quote2: '幾千の摩擦と切断を経て、最後に残るのはただの沈黙だ。',
        trans2: '"Through thousands of friction cuts, all that remains at the end is pure silence."'
      };
    default:
      return {
        speakerName: charId.toUpperCase(),
        standName: 'Stand / Skill',
        japaneseTitle: 'STAND USER',
        quote1: '覚悟はいいか？ 全力でかかってこい！',
        trans1: '"Are you prepared? Come at me with everything!"',
        quote2: 'フッ… 後悔させてやるぜ！',
        trans2: '"Hmph... I\'ll make you regret this!"'
      };
  }
}
