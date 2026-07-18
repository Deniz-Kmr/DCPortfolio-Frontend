# Changelog

Bu projedeki önemli değişiklikler bu dosyada belgelenir.

Sürüm numaralandırması [Semantic Versioning](https://semver.org/) yaklaşımını
takip eder.

## [1.0.0] - 2026-07-18

DCPortfolio Frontend'in ilk kararlı production sürümü.

### Added

- React 19, TypeScript ve Vite tabanlı responsive public portfolio
- ASP.NET Core Web API ile dinamik veri entegrasyonu
- Ana sayfa, projeler ve slug tabanlı proje detay sayfaları
- Çoklu proje görsel galerisi
- Teknik yetkinlik grupları ve deneyim zaman çizelgesi
- CV, sertifika ve iletişim bölümleri
- Mobil navigasyon ve responsive hero deneyimi
- JWT korumalı local admin giriş akışı
- Proje, teknoloji, CV, deneyim ve sertifika yönetimi
- DevLog, Todo, ders, İngilizce planı ve Learning Roadmap modülleri
- Sürükle-bırak ana sayfa proje seçimi
- Production monitoring dashboard
- Yeniden kullanılabilir loading, error ve empty state bileşenleri
- Docker multi-stage build ve Nginx runtime yapılandırması
- Türkçe ve İngilizce proje dokümantasyonu
- Masaüstü, mobil, admin ve monitoring tanıtım görselleri

### Security

- Production build içinde admin UI varsayılan olarak devre dışı bırakıldı
- Admin endpointleri için backend JWT ve `Admin` rol doğrulaması kullanıldı
- Gerçek environment dosyaları Git takibinden çıkarıldı
- Frontend bundle içinde secret ve private key taraması tamamlandı
- Token değerlerinin console veya kullanıcı arayüzünde gösterilmediği doğrulandı
- Nginx güvenlik header'ları ve riskli ayarlar kontrol edildi
- Production ve development dependency taramalarında güvenlik açığı bulunmadı

### Validation

- `npm audit`: 0 vulnerabilities
- ESLint: 0 error
- Production-like Vite build: successful
- Production bundle secret scan: clean
- Nginx security configuration: verified
- README image references: verified
