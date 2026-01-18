# CS2 Trading Tracker - React Uygulaması

Counter-Strike 2 item trade takip uygulaması. React ile geliştirilmiştir ve localStorage kullanarak verileri otomatik olarak kaydeder.

## 🚀 Özellikler

- ✅ **Dönem Yönetimi**: Farklı dönemler oluşturabilir ve aralarında geçiş yapabilirsiniz
- ✅ **İşlem Takibi**: Alış-satış işlemlerini kaydedin ve takip edin
- ✅ **Otomatik Hesaplama**: Kâr/zarar otomatik hesaplanır
- ✅ **LocalStorage**: Veriler tarayıcınızda otomatik kaydedilir (uygulama kapansa bile)
- ✅ **Responsive Tasarım**: Mobil ve masaüstünde mükemmel çalışır
- ✅ **Sıralama**: İşlemleri tarihe, kâra veya isme göre sıralayın
- ✅ **Çoklu Para Birimi**: TL, USD ve EUR desteği

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

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

## 📁 Proje Yapısı

```
cs2-tracker-react/
├── public/
│   └── index.html
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── PeriodTabs.js
│   │   ├── PeriodTabs.css
│   │   ├── TransactionForm.js
│   │   ├── TransactionForm.css
│   │   ├── TransactionTable.js
│   │   ├── TransactionTable.css
│   │   ├── Toast.js
│   │   └── Toast.css
│   ├── context/             # State yönetimi
│   │   └── AppContext.js
│   ├── utils/               # Yardımcı fonksiyonlar
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Özellik Detayları

### Dönem Yönetimi
- Yeni dönem oluşturabilirsiniz (örn: "Ocak 2024", "Şubat 2024")
- Dönemler arasında geçiş yapabilirsiniz
- Her dönemin kendi işlemleri vardır
- Son dönem hariç istediğiniz dönemi silebilirsiniz

### İşlem Ekleme
- Eşya adı (örn: AK-47 | Redline)
- Alış fiyatı
- Satış fiyatı
- Para birimi (TL, USD, EUR)
- Tarih
- Notlar (opsiyonel)

### Dashboard İstatistikleri
- Toplam Kâr/Zarar
- Toplam Alış
- Toplam Satış
- İşlem Sayısı
- En Kârlı İşlem
- En Zararlı İşlem

### Sıralama Seçenekleri
- Tarihe göre sıralama
- Kâra göre sıralama
- Eşya ismine göre sıralama

## 🛠️ Geliştirme

### Örnek Veriyi Kaldırma

İlk açılışta örnek veriler yüklenir. Bunları kaldırmak için:

1. `src/context/AppContext.js` dosyasını açın
2. `loadPeriods` fonksiyonunda `createSampleData()` satırını yorum satırı yapın veya silin

### Yeni Özellikler Ekleme

- Yeni component eklemek için `src/components/` klasörüne yeni dosya oluşturun
- Global state değişiklikleri için `src/context/AppContext.js` dosyasını düzenleyin
- Yardımcı fonksiyonlar için `src/utils/helpers.js` kullanın

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyor
Eğer 3000 portu başka bir uygulama tarafından kullanılıyorsa:
```bash
# Windows'ta
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# veya farklı bir port kullanın
set PORT=3001 && npm start
```

### Uygulama Yavaş Çalışıyor
- Tarayıcı önbelleğini temizleyin
- Geliştirici araçlarını kapatın
- Başka sekmeleri kapatın

### Veriler Kayboldu
- Tarayıcı önbelleği temizlendiyse veriler kaybolur
- Düzenli yedek almayı unutmayın

## 📝 Notlar

- Bu uygulama tamamen tarayıcıda çalışır, sunucu gerektirmez
- Veriler sadece sizin bilgisayarınızda saklanır
- İnternet bağlantısı gerekmez (ilk kurulumdan sonra)

## 🤝 Katkıda Bulunma

Önerileriniz ve katkılarınız için pull request gönderebilirsiniz.

## 📄 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

---

**İyi Tradeler! 🎮💰**

