# Medusa.js Admin Dashboard Kurulum ve Çalıştırma Rehberi

## Sistem Gereksinimleri

- **Node.js**: v18 veya üzeri
- **Yarn**: 3.2.1 (packages.json'da belirtilmiş)
- **Medusa Backend**: Port 9000'de çalışıyor olmalı (varsayılan)

## Adım 1: Bağımlılıkları Kurma

Projenin kök dizininde zaten `node_modules` kurulmuş görünüyor, ancak yeni bir kurulum yapıyorsanız:

```bash
cd /Users/ozkankocakaplan/Desktop/machtech-commerce-admin
yarn install
```

## Adım 2: Çalışma Modu

Admin dashboard'u çalıştırmak için iki yol var:

### Yol 1: Sadece Admin Dashboard (Geliştirme Modu)

```bash
cd packages/admin/dashboard
yarn dev
```

Bu komut admin dashboard'u development modunda başlatır. Dashboard genellikle **http://localhost:5173** adresinde açılır (Vite varsayılan portu).

### Yol 2: Tüm Projeyi Birlikte Çalıştırma (Önerilen)

Kök dizinden tüm workspace'i build edip çalıştırın:

```bash
# Kök dizindeyken
yarn build

# Sonra dashboard'u çalıştır
cd packages/admin/dashboard
yarn dev
```

## Adım 3: Çevresel Değişkenler (.env)

Admin dashboard'u çalıştırmadan önce, `packages/admin/dashboard/.env` dosyası oluşturmanız gerekebilir:

```bash
cd packages/admin/dashboard
cat > .env << 'EOF'
# Backend API URL
VITE_MEDUSA_BACKEND_URL=https://ecommerce-api.mach-tech.io

# Storefront URL
VITE_MEDUSA_STOREFRONT_URL=https://shop.mach-tech.io

# Base path (Admin dashboard base URL)
VITE_MEDUSA_BASE=/

# Admin extensions yolu (Opsiyonel)
# VITE_MEDUSA_PROJECT=../../..
EOF
```

## Adım 4: Medusa Backend Hazırlığı

Admin dashboard'u kullanabilmek için Medusa backend'inizin çalışıyor olması gerekiyor:

1. Backend'iniz çalışıyor mu kontrol edin: `http://localhost:9000`
2. Eğer backend yoksa, Medusa project oluşturmanız gerekir

### Hızlı Backend Kurulumu

```bash
# Yeni bir terminal açın
npx @medusajs/cli@latest create my-medusa-backend

cd my-medusa-backend

# Development sunucusunu başlat
npx medusa develop
```

Backend default olarak `http://localhost:9000` adresinde çalışır.

## Adım 5: Admin Dashboard'a Giriş

1. Admin dashboard'u başlattıktan sonra tarayıcınızda açılır
2. İlk kullanıcı oluşturmanız gerekebilir
3. Backend'de admin user oluşturma:

```bash
# Backend dizininde
npx medusa user -e admin@example.com -p supersecret
```

## Özet Komutlar

### Tam Kurulum (İlk Kez Çalıştırma)

```bash
# 1. Kök dizine git
cd /Users/ozkankocakaplan/Desktop/machtech-commerce-admin

# 2. Bağımlılıkları kur (gerekirse)
yarn install

# 3. Projeyi build et
yarn build

# 4. Dashboard dizinine git
cd packages/admin/dashboard

# 5. .env dosyası kontrol et (zaten oluşturulmuş)
# Backend: https://ecommerce-api.mach-tech.io
# Storefront: https://shop.mach-tech.io

# 6. Dashboard'u çalıştır
yarn dev
```

### Hızlı Başlatma (Sonraki Kere)

```bash
cd packages/admin/dashboard
yarn dev
```

## Sorun Giderme

### Port 5173 Kullanımda
Vite farklı bir port kullanacaktır. Console'daki çıktıyı kontrol edin.

### Backend'e Bağlanamıyor
- Backend'inizin `https://ecommerce-api.mach-tech.io` adresinde çalıştığından emin olun
- `.env` dosyasında `VITE_MEDUSA_BACKEND_URL` doğru mu kontrol edin (https://ecommerce-api.mach-tech.io)
- Backend'de CORS ayarlarını kontrol edin
- Browser console'da CORS hatalarını kontrol edin

### Build Hataları
```bash
# Temiz kurulum
rm -rf node_modules packages/*/node_modules
yarn install
yarn build
```

## Faydalı Komutlar

```bash
# Dashboard preview
cd packages/admin/dashboard
yarn preview

# Dashboard build
yarn build

# Linter çalıştır
yarn lint

# Test çalıştır
yarn test
```

## Önemli Notlar

1. Bu bir **monorepo** projesidir - tüm paketler `packages/` dizini altında
2. Admin dashboard React + Vite kullanır
3. Backend API: **https://ecommerce-api.mach-tech.io**
4. Storefront URL: **https://shop.mach-tech.io**
5. Yarn workspace manager'ı kullanır (npm değil)
6. Dashboard backend'e bağlıdır - backend olmadan çalışmaz

