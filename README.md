SideAI – Yapay Zeka Destekli Seyahat Asistanı

SideAI, doğal dilde yazılan seyahat isteklerini anlayan; otel ve uçuş arayan, dinamik paket oluşturan ve rezervasyonu (PNR üreterek) tek bir sohbet arayüzünden tamamlayan bir yapay zeka seyahat asistanıdır. Yapay zeka katmanı Google Gemini (Function Calling) ile çalışır.

Not: Otel, uçuş ve rezervasyon verileri şu an örnek (mock) veridir ve bellekte tutulur. Gerçek bir CRS/GDS entegrasyonu veya veritabanı henüz bağlı değildir.

Özellikler
AI Seyahat Asistanı: Kullanıcının serbest metin isteğini analiz eder ve ilgili aracı (otel arama, uçuş arama, rezervasyon) otomatik olarak çağırır.
Otel Arama: Bölge, minimum yıldız ve gecelik bütçeye göre filtreleme.
Uçuş Arama: Kalkış ve varış havalimanına göre uçuş listeleme (SAW, IST → AYT vb.).
Otel ve Dinamik Paket Rezervasyonu: Otel ya da otel + uçuş paketi için PNR kodlu onay üretir.
Yönetim Paneli Metrikleri: Toplam rezervasyon, ciro, token tüketimi ve tahmini yapay zeka maliyeti.
Modern Arayüz: Otel/uçuş kartları, seyahat planı, rezervasyon onayı ve ajan aktivite göstergesi.
Teknoloji Yığını
Katman	Teknolojiler
Frontend	React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios
Backend	.NET 9 Web API, Swagger (Swashbuckle)
Yapay Zeka	Google Gemini API (gemini-2.5-flash, Function Calling)
Mimari	Clean Architecture (Domain / Application / Infrastructure / WebAPI), DTO Pattern
Proje Yapısı
SideAI/
├── SideAI.Domain/           # Varlıklar: Hotel, Flight, Reservation
├── SideAI.Application/      # Arayüzler (IAgentService, ITravelService, ...) ve DTO'lar
├── SideAI.Infrastructure/   # GeminiAgentService, TravelService, AdminMetricsService
├── SideAI.WebAPI/           # Controller'lar (Agent, Admin), Program.cs
├── frontend/                # React + Vite arayüzü
└── SideAI.sln
Gereksinimler
.NET 9 SDK
Node.js (LTS önerilir) ve npm
Bir Google Gemini API anahtarı
Kurulum ve Çalıştırma
1. Depoyu klonlayın
bash
git clone https://github.com/<kullanici-adi>/SideAI.git
cd SideAI
2. Backend

Gemini API anahtarınızı repoya göndermeden tanımlayın. appsettings.Development.json dosyası .gitignore içinde olduğu için güvenle kullanabilirsiniz.

SideAI.WebAPI/appsettings.Development.json:

json
{
  "Gemini": {
    "ApiKey": "BURAYA_GEMINI_API_ANAHTARINIZ"
  }
}

Alternatif olarak kullanıcı sırlarını (user-secrets) kullanabilirsiniz:

bash
cd SideAI.WebAPI
dotnet user-secrets set "Gemini:ApiKey" "BURAYA_GEMINI_API_ANAHTARINIZ"

API'yi başlatın:

bash
cd SideAI.WebAPI
dotnet run --launch-profile http

API http://localhost:5184 adresinde çalışır. Geliştirme ortamında Swagger arayüzü http://localhost:5184/swagger adresindedir.

3. Frontend
bash
cd frontend
npm install
npm run dev

Uygulama, Vite'ın gösterdiği adreste (varsayılan http://localhost:5173) açılır. Arayüz, backend'e http://localhost:5184 üzerinden bağlanır.

API Uç Noktaları
Metot	Adres	Açıklama
POST	/api/Agent/chat	Kullanıcı mesajını (JSON string) yapay zeka ajanına iletir; yanıt, otel/uçuş sonuçları ve rezervasyon bilgisini döner.
GET	/api/Admin/dashboard	Rezervasyon sayısı, ciro, token kullanımı ve tahmini AI maliyeti.

Örnek istek:

bash
curl -X POST http://localhost:5184/api/Agent/chat \
  -H "Content-Type: application/json" \
  -d "\"Side'de 5 yıldızlı, gecelik 90 euro altı bir otel bul\""
Örnek Komutlar
"Antalya'da 5 yıldızlı otelleri listele."
"İstanbul Sabiha Gökçen'den Antalya'ya uçuşlara bak."
"Side Star Resort için Ahmet Yılmaz adına 5 gecelik rezervasyon yap."
"Side Crown Serenity ve Pegasus uçuşuyla 7 gecelik paket oluştur."
Yol Haritası
[ ] Gerçek veritabanı entegrasyonu (Entity Framework Core + SQL Server)
[ ] Gerçek CRS/GDS ve uçuş sağlayıcı entegrasyonu
[ ] Sohbet geçmişi ve çok adımlı konuşma desteği
[ ] Kimlik doğrulama ve yönetim paneli arayüzü
[ ] Ortama göre yapılandırılabilir API adresi (.env)
Güvenlik Notu

API anahtarlarınızı asla repoya göndermeyin. appsettings.json içinde yalnızca yer tutucu bırakın; gerçek anahtarı appsettings.Development.json, user-secrets veya ortam değişkenleriyle sağlayın.

Lisans

Bu proje için henüz bir lisans belirtilmemiştir. Açık kaynak yapmayı düşünüyorsanız bir lisans dosyası (ör. MIT) ekleyebilirsiniz.
