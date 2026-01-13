# CS2 Trading Tracker - React Uygulaması

Counter-Strike 2 item trade takip uygulaması. React ile geliştirilmiştir ve localStorage kullanarak verileri otomatik olarak kaydeder.

🎥 Projeyi daha iyi incelemek için aşağıdaki videoyu indirip izlemenizi tavsiye ederim:
[Watch the video](https://github.com/persates/myproje/blob/main/CS2/watch-me.mp4)


## 🔧 Kurulum ve Çalıştırma

### 1. Proje Klasörüne Gidin

```bash
cd c:\Users\90546\Desktop\proje-2-vs\cs2-tracker-react
```

### 2. Bağımlılıkları Yükleyin (İlk Kurulum)

Bu adım sadece ilk kez veya bağımlılıklar güncellendiğinde gereklidir:

```bash
npm install
```

### 3. Uygulamayı Başlatın

```bash
npm start
```

Bu komut uygulamayı geliştirme modunda başlatır. Tarayıcınızda otomatik olarak [http://localhost:3000](http://localhost:3000) adresi açılacaktır.

Sayfa düzenlemeler yaptığınızda otomatik olarak yeniden yüklenecektir.

### 4. Production Build Oluşturma (Opsiyonel)

Uygulamayı yayınlamak için optimize edilmiş bir build oluşturmak isterseniz:

```bash
npm run build
```

Bu komut `build` klasöründe optimize edilmiş dosyalar oluşturur.

## 💾 Veri Saklama

Uygulama **localStorage** kullanarak tüm verilerinizi tarayıcınızda saklar:

- ✅ Uygulama kapansa bile veriler kaybolmaz
- ✅ Her değişiklik otomatik olarak kaydedilir
- ✅ Tarayıcı önbelleğini temizlerseniz veriler silinir (dikkatli olun!)
- ✅ Farklı tarayıcılarda farklı veriler saklanır

### Veri Yedekleme İpucu

localStorage verileri tarayıcıya özeldir. Verilerinizi yedeklemek için:
1. Tarayıcınızın Geliştirici Araçlarını açın (F12)
2. Application/Depolama sekmesine gidin
3. Local Storage > http://localhost:3000
4. `cs2TrackerData` anahtarını bulun ve değerini kopyalayın
5. Bu veriyi bir metin dosyasına kaydedin

