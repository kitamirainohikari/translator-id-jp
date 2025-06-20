
# 🌸 CodeParcel Translator - Indonesia ⇄ Jepang (JLPT N5-N3)

Aplikasi translate fullstack end-to-end yang dirancang khusus untuk calon pekerja migran Indonesia ke Jepang. Menggunakan AI (OpenAI GPT-4) untuk memberikan terjemahan akurat beserta level JLPT, romaji, dan fitur audio pronunciation.

## ✨ Fitur Utama

- 🔄 **Translate 2 Arah**: Indonesia → Jepang dan Jepang → Indonesia
- 🎌 **Output Lengkap**: Kanji/Hiragana + Romaji + Level JLPT
- 🎵 **Audio Pronunciation**: Text-to-speech dengan highlight animasi
- ⌨️ **Virtual Keyboard Jepang**: Input Hiragana/Katakana dengan audio
- 📚 **Riwayat Terjemahan**: Simpan dan kelola history terjemahan
- 🔐 **Autentikasi Google**: Login aman dengan Google OAuth
- 📱 **Responsive Design**: Optimal di desktop dan mobile

## 🛠️ Tech Stack

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **AI**: OpenAI GPT-4 API
- **Deployment**: Vercel/Netlify Ready
- **Styling**: Modern Japanese-themed UI

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd codeparcel-translator
npm install
```

### 2. Setup Environment Variables
Buat file `.env.local` dan tambahkan:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API Key
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 3. Setup Supabase Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Create translations table
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  romaji TEXT,
  jlpt_level TEXT,
  translation_direction TEXT CHECK (translation_direction IN ('id_to_jp', 'jp_to_id')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own translations
CREATE POLICY "Users can view their own translations" ON translations
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_translations_user_id ON translations(user_id);
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);
```

### 4. Setup Google OAuth di Supabase

1. Buka Supabase Dashboard → Authentication → Providers
2. Enable Google Provider
3. Tambahkan Google OAuth credentials:
   - Client ID dan Client Secret dari Google Cloud Console
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🏗️ Struktur Project

```
src/
├── components/
│   ├── Header.tsx              # Header dengan auth
│   ├── TranslatorForm.tsx      # Form translate utama
│   ├── VirtualKeyboard.tsx     # Keyboard Jepang virtual
│   └── TranslationHistory.tsx  # Komponen riwayat
├── lib/
│   ├── supabase.ts            # Konfigurasi Supabase
│   ├── openai.ts              # OpenAI API integration
│   └── utils.ts               # Utility functions
├── pages/
│   ├── Index.tsx              # Halaman utama
│   └── NotFound.tsx           # 404 page
└── hooks/
    └── use-toast.ts           # Toast notification hook
```

## 🔧 Konfigurasi API

### OpenAI API Setup
1. Dapatkan API key dari [OpenAI Platform](https://platform.openai.com/)
2. Tambahkan ke `.env.local` sebagai `VITE_OPENAI_API_KEY`
3. Pastikan credit tersedia di akun OpenAI

### Supabase Setup
1. Buat project baru di [Supabase](https://supabase.com/)
2. Copy Project URL dan anon key
3. Enable Google OAuth di Authentication settings
4. Jalankan SQL schema (lihat langkah 3 di atas)

## 🎯 Cara Penggunaan

### Untuk Pengguna

1. **Login**: Klik "Login dengan Google" di header
2. **Translate**:
   - Pilih arah terjemahan (Indonesia ⇄ Jepang)
   - Masukkan teks (gunakan virtual keyboard untuk Jepang)
   - Klik "Terjemahkan"
3. **Audio**: Klik tombol "Play" untuk mendengar pronunciation
4. **Simpan**: Klik "Simpan" untuk menyimpan ke riwayat
5. **Riwayat**: Buka tab "Riwayat" untuk melihat terjemahan sebelumnya

### Virtual Keyboard Jepang
- Toggle antara Hiragana (ひらがな) dan Katakana (カタカナ)
- Hover untuk melihat romaji
- Enable audio untuk mendengar pronunciation saat klik
- Efek ripple dan animasi hover

## 📱 Fitur Mobile

- Responsive design untuk semua ukuran layar
- Touch-friendly virtual keyboard
- Swipe gesture untuk switch tab
- Optimasi performance untuk mobile

## 🔐 Keamanan

- Row Level Security (RLS) di Supabase
- Google OAuth untuk autentikasi aman
- Environment variables untuk API keys
- HTTPS required untuk production

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

### Netlify
```bash
# Build
npm run build

# Deploy folder 'dist' ke Netlify
# Set environment variables di Netlify dashboard
```

### Environment Variables untuk Production
Pastikan set semua env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

## 🧪 Testing & Development

### Local Development
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Database Migration
Jika ada perubahan schema:
```sql
-- Tambahkan migration di Supabase SQL Editor
-- Contoh: menambah kolom baru
ALTER TABLE translations ADD COLUMN confidence_score FLOAT;
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` untuk mengubah warna:
```ts
colors: {
  sakura: { /* Pink theme */ },
  blue: { /* Blue theme */ },
  // Tambah warna custom
}
```

### Prompts OpenAI
Edit `src/lib/openai.ts` untuk menyesuaikan prompt:
```ts
const prompt = `Custom prompt untuk translate...`
```

## 📊 Monitoring & Analytics

### Error Tracking
- Console logs untuk debugging
- Toast notifications untuk user feedback
- Supabase logs untuk database errors

### Performance
- Lazy loading untuk komponen besar
- Optimasi bundle size dengan Vite
- Service worker untuk caching (optional)

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check OpenAI usage dan billing
- Monitor Supabase storage dan bandwidth
- Backup database secara berkala

### Feature Extensions
- JLPT N1/N2 support
- Voice input (Speech-to-Text)
- Offline mode dengan cache
- Export/import riwayat
- Multiple language pairs

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes dengan tests
4. Submit pull request

## 📄 License

MIT License - bebas digunakan untuk tujuan komersial dan non-komersial.

## ⚠️ Catatan Konflik Dependency: `react-day-picker` & `date-fns`

Proyek ini menggunakan `react-day-picker@8.10.1` yang memiliki **peer dependency** sebagai berikut:

```
date-fns@^2.28.0 || ^3.0.0
```

Jika kamu mencoba menginstall versi lain dari `date-fns` (contohnya versi `4.x.x`), maka kemungkinan besar akan muncul error saat menjalankan perintah `npm install`, seperti berikut:

```
npm ERR! ERESOLVE could not resolve
npm ERR! peer date-fns@"^2.28.0 || ^3.0.0" from react-day-picker@8.10.1
```

### ✅ Solusi

Untuk mengatasi konflik ini dan menjaga kompatibilitas antar dependency:

1. **Install versi `date-fns` yang sesuai**, misalnya:

```bash
npm install date-fns@3.6.0
```

2. Setelah itu, lanjutkan dengan proses instalasi:

```bash
npm install
```

> ⚠️ Hindari menggunakan `--force` atau `--legacy-peer-deps` kecuali benar-benar terpaksa, karena bisa menyebabkan struktur dependency menjadi tidak stabil atau tidak kompatibel.

### 📌 Kenapa Ini Penting

Menjaga kompatibilitas versi dependency akan memastikan bahwa:

* Perilaku aplikasi tetap stabil dan dapat diprediksi
* Menghindari error saat runtime
* Mempermudah upgrade dan pemeliharaan di masa depan

Jika di kemudian hari `react-day-picker` sudah mendukung `date-fns@4.x.x`, maka catatan ini akan diperbarui.

---

## 🆘 Troubleshooting

### Common Issues

**Build Error**: 
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

**Supabase Connection Error**:
- Periksa URL dan API key
- Pastikan RLS policy sudah benar
- Check network connectivity

**OpenAI API Error**:
- Periksa API key validity
- Check usage quota
- Verify model availability

**Audio Not Working**:
- Pastikan browser support Web Speech API
- Check microphone permissions
- Test dengan HTTPS (required)

## 👥 Kontributor

- IncoDIY     : [@incodiy](https://github.com/incodiy)
- GeneSYNC    : [@genesync](https://github.com/genesync)
- CodeParcel  : [@codeparcel](https://github.com/codeparcel)


## 📞 Support

Untuk bantuan lebih lanjut:
- Dokumentasi: [Supabase Docs](https://supabase.com/docs)
- Community: [Discord](https://discord.supabase.com)
- Issues: GitHub Issues tab

---

**Dibuat dengan ❤️ untuk membantu calon pekerja migran Indonesia ke Jepang**

🌸 **Ganbatte kudasai!** (頑張ってください！) - Semoga berhasil!
