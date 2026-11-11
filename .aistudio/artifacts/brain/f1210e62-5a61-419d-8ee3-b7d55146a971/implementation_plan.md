# Rencana Implementasi: Mini-Game D'Arby's Soul Poker Saloon (Judi Jiwa Psikologis)

Sistem ini menghadirkan mode permainan mini psikologis legendaris dari Stardust Crusaders (*Jotaro Kujo & Joseph Joestar vs. Daniel J. D'Arby*). Pemain tidak hanya bertarung adu pukulan fisik di arena, tetapi juga adu gertakan mental (*psychological poker*) di mana taruhannya adalah **Keping Jiwa (Soul Chips)** kawan-kawan Joestar!

---

## 1. Mekanisme Inti: D'Arby Psychological Poker

### A. Format Permainan Kartu (Five-Card Draw Poker)
1. **Babak Taruhan Awal (Ante)**:
   - Pemain dan D'Arby masing-masing memiliki 10 keping jiwa (terukir wajah Jotaro, Joseph, Polnareff, Kakyoin, Avdol).
2. **Pembagian Kartu (Deal & Draw)**:
   - Masing-masing pemain dibagikan 5 kartu tertutup.
   - Pemain dapat memilih hingga 3 kartu untuk dibuang dan ditukar kartu baru.
3. **Peringkat Tangan Standar**:
   - High Card ➔ One Pair ➔ Two Pair ➔ Three of a Kind ➔ Straight ➔ Flush ➔ Full House ➔ Four of a Kind ➔ Straight Flush / Royal Flush.

---

## 2. Kemampuan Khusus Karakter JoJo (Mind Tactics & Stand Tricks)

Pemain dapat memanfaatkan trik psikologis ikonik:

1. **Jotaro's Iron Bluff (Gertakan Tanpa Melihat Kartu)**:
   - Jotaro menaikkan taruhan (*RAISE!*) 3 hingga 5 keping sekaligus tanpa memeriksa kartunya sendiri.
   - Memicu bar **D'Arby Panic Meter** bertambah drastis. Jika meter panik D'Arby penuh (100%), D'Arby mengalami *Mental Collapse* ("B-B-BAR-R-R-DA!!"), pingsan di meja, dan pemain otomatis menang!
2. **Star Platinum's Lightning Sleight of Hand**:
   - Menggunakan kecepatan kilat Stand untuk menukar 1 kartu dari tumpukan dek rahasia.
   - Memiliki mini-game timing bar: jika presisi (warna hijau), kartu berubah menjadi kartu As/King; jika meleset (warna merah), D'Arby mendeteksi kecurangan dengan jarum Osiris Stand!
3. **Joseph's Hamon Coin & Drink Minigame (Bonus Round)**:
   - Minigame selingan memasukkan keping koin emas ke dalam gelas anggur yang telah penuh terisi minuman keras.
   - Pemain meneteskan koin dengan menahan tegangan permukaan cairan menggunakan Ripple/Hamon. Yang membuat air tumpah dinyatakan kalah!

---

## 3. Desain Visual & Suasana Sinematik Manga

- **Meja Bar Kairo Temaram**: Suasana bar kayu klasik dengan lampu gantung remang-remang, kartu remi vintage JoJo, dan tumpukan koin jiwa perak/emas.
- **Efek Wajah Panik Dinamis D'Arby**:
  - Saat santai: D'Arby tersenyum licik sambil mengocok koin di jarinya ("GOOD!").
  - Saat tertekan: Muncul keringat dingin manga tebal, pupil mengecil, dan jari bergetar hebat.
- **Audio & Onomatopoeia Khas Anime**:
  - Efek suara koin berdenting (*clink!*).
  - Suara seruan manga: *『G-O-O-D!!』*, *『CALL!』*, *『RAISE!!』*, *『ゴゴゴゴ (MENACING)』*.

---

## 4. Integrasi Arsitektur Kode

1. **`src/types.ts`**:
   - Penambahan tipe data `PokerCard`, `PokerHand`, `SoulChip`, `DArbyGameState`, dan mode `darby_poker`.
2. **`src/game/darbyEngine.ts`**:
   - Engine logika kartu: evaluasi kombinasi poker 5 kartu, algoritma AI gertakan D'Arby, manajemen koin jiwa, dan sistem panic meter.
3. **`src/components/DArbyPoker.tsx`**:
   - Komponen visual interaktif: meja bar, animasi pembagian kartu, tombol aksi (`Call`, `Raise`, `Fold`, `Bluff`, `Star Platinum Trick`), serta cutscene dialog manga sinematik.
4. **`src/components/ModeSelect.tsx` / `src/App.tsx`**:
   - Menambahkan kartu pilihan mode baru **"D'ARBY SOUL POKER"** di menu utama dengan ikon koin jiwa dan kartu remi.

---

## 5. Rencana Verifikasi
- Pengujian pembagian kartu acak dan validasi akurasi penilaian tangan poker (Pair, Flush, Full House, dll).
- Pengujian tombol gertakan Jotaro dan trigger kemenangan mental breakdown D'Arby.
- Pengujian siklus menang/kalah keping jiwa dan transisi kembali ke menu utama.
