# Restaurant Management System

Modern ve kapsamlı bir restaurant yönetim sistemi. NestJS backend ve React frontend ile geliştirilmiştir.

## 🚀 Özellikler

### Backend (NestJS)
- **Authentication**: JWT tabanlı kimlik doğrulama
- **Role-based Access Control**: Admin, Garson, Şef, Kasiyer rolleri
- **Database**: PostgreSQL + TypeORM
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator ile veri doğrulama

### Frontend (React)
- **Modern UI**: TailwindCSS ile responsive tasarım
- **TypeScript**: Tip güvenliği
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Heroicons

### Modüller
- 👥 **Kullanıcı Yönetimi**: Rol tabanlı erişim
- 🍽️ **Menü Yönetimi**: Kategori ve ürün yönetimi
- 🪑 **Masa Yönetimi**: Masa durumu takibi
- 📋 **Sipariş Yönetimi**: Sipariş alma ve takip
- 💳 **Ödeme Yönetimi**: Çoklu ödeme yöntemi
- 📦 **Stok Yönetimi**: Malzeme ve envanter takibi
- 📊 **Raporlar**: Satış ve performans raporları

## 🛠️ Kurulum

### Gereksinimler
- Node.js (v18+)
- PostgreSQL (v12+)
- npm veya yarn

### 1. Veritabanı Kurulumu
```bash
# PostgreSQL'de veritabanı oluştur
psql -U postgres -c "CREATE DATABASE restaurant_system;"
```

### 2. Backend Kurulumu
```bash
cd backend

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle

# Uygulamayı başlat
npm run start:dev
```

### 3. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm start
```

## 🔧 Konfigürasyon

### Backend Environment (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=restaurant_system

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# App
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=Restaurant Management System
```

## 👤 Varsayılan Kullanıcılar

Sistem ilk çalıştırıldığında otomatik olarak oluşturulur:

- **Admin**: `admin@restaurant.com` / `admin123`
- **Garson**: `waiter@restaurant.com` / `admin123`
- **Şef**: `chef@restaurant.com` / `admin123`

## 📚 API Dokümantasyonu

Backend çalıştıktan sonra Swagger dokümantasyonuna erişim:
```
http://localhost:3001/api
```

## 🏗️ Proje Yapısı

```
restaurantsystem/
├── backend/
│   ├── src/
│   │   ├── auth/           # Kimlik doğrulama
│   │   ├── users/          # Kullanıcı yönetimi
│   │   ├── tables/         # Masa yönetimi
│   │   ├── orders/         # Sipariş yönetimi
│   │   ├── menu/           # Menü yönetimi
│   │   ├── payments/       # Ödeme yönetimi
│   │   ├── inventory/      # Stok yönetimi
│   │   └── reports/        # Raporlar
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── services/       # API servisleri
│   │   ├── contexts/       # React context'leri
│   │   └── types/          # TypeScript tipleri
│   └── package.json
└── README.md
```

## 🚀 Çalıştırma

### Development Modu
```bash
# Backend (Terminal 1)
cd backend
npm run start:dev

# Frontend (Terminal 2)
cd frontend
npm start
```

### Production Modu
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
```

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- CORS koruması
- Input validation

## 📊 Veritabanı Şeması

Sistem aşağıdaki ana tabloları içerir:
- `users` - Kullanıcı bilgileri
- `tables` - Masa bilgileri
- `categories` - Menü kategorileri
- `menu_items` - Menü öğeleri
- `orders` - Siparişler
- `order_items` - Sipariş detayları
- `payments` - Ödemeler
- `inventory_items` - Stok öğeleri
- `ingredients` - Malzemeler

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:
1. Issue oluşturun
2. Detaylı hata mesajı ekleyin
3. Sistem bilgilerinizi paylaşın

## 🔄 Güncellemeler

### v1.0.0
- İlk sürüm
- Temel CRUD işlemleri
- Authentication sistemi
- Role-based access control
- Modern UI/UX 