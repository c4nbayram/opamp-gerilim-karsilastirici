# Grup 18

Grup 18, Yazılım Projesi Geliştirme dersi kapsamında hazırlanmış bir gerilim karşılaştırıcı simülatörüdür. Amaç, op-amp karşılaştırıcı devresinin Vin ve Vref değerlerine göre çıkışı nasıl +Vsat veya -Vsat seviyesine taşıdığını etkileşimli olarak göstermektir.

## Proje Amacı

Bu uygulamada kullanıcı giriş sinyalini, referans gerilimini, doyum sınırlarını ve simülasyon aralığını değiştirerek devrenin davranışını anlık olarak inceleyebilir. Grafik bölümünde Vin(t), Vref ve Vout(t) aynı zaman ekseninde gösterilir. Vin sinyalinin referans gerilimini kestiği anahtarlama noktaları ayrıca işaretlenir.

## Kullanılan Teknolojiler

- React
- Vite
- Recharts
- CSS

## Özellikler

- Elle çizilmiş SVG op-amp karşılaştırıcı devresi
- Vin, Vref, +Vsat ve -Vsat değerleri için canlı ayar kontrolleri
- Sinüs, üçgen, kare, rampa ve sabit giriş sinyali
- Genlik, offset, frekans, süre ve örnekleme sayısı ayarları
- HIGH, LOW ve EŞİK durumunu gösteren karar paneli
- Grafikte seçilen zamana göre devre şeması ve karar panelini güncelleyen karar anı kontrolü
- Osiloskop görünümünde giriş-çıkış grafiği
- Anahtarlama noktaları için grafik markerları ve tablo
- Hazır örnek senaryolar
- Mobil ve masaüstü görünüme uyumlu arayüz

## Kurulum

Projeyi indirdikten sonra klasör içinde bağımlılıkları kurmak için:

```bash
npm install
```

## Çalıştırma

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Build almak için:

```bash
npm run build
```

## Simülasyon Mantığı

Karşılaştırıcı devrede temel karar şu şekilde alınır:

- Vin(t) > Vref ise Vout(t) = +Vsat
- Vin(t) < Vref ise Vout(t) = -Vsat
- Vin(t) = Vref ise devre eşik bölgesinde kabul edilir

Grafikteki anahtarlama noktaları, Vin(t) - Vref ifadesinin işaret değiştirdiği örnekler üzerinden bulunur. Geçiş zamanı daha düzgün görünsün diye iki örnek arasında yaklaşık lineer interpolasyon yapılır.

## Ekran Bölümleri

1. Op-Amp Karşılaştırıcı Devresi: Devre şeması, LED durum göstergesi ve parametre kontrolleri bulunur.
2. Referans Gerilimi ve Karar Paneli: Seçilen karar anındaki Vin, Vref, Vout ve lojik durum sayısal olarak gösterilir.
3. Giriş ve Çıkış İşaret Grafikleri: Vin(t), Vref ve Vout(t) osiloskop benzeri ekranda çizilir.

## Geliştirilebilecek Yönler

- Histerezisli Schmitt trigger modeli eklenebilir.
- Gerçek op-amp gecikmesi veya slew rate etkisi yaklaşık olarak modellenebilir.
- Grafik dışa aktarma özelliği eklenebilir.
- Daha fazla örnek devre senaryosu hazırlanabilir.
