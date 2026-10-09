# SideAI - Autonomous Travel Tech & Booking Platform

SideAI, doğal dil girdilerini işleyerek seyahat rotaları planlayan, otel ve uçuş seçeneklerini sorgulayan ve merkezi rezervasyon süreçlerini otonom olarak yöneten yeni nesil bir yapay zeka seyahat asistanıdır.

## Temel Özellikler

- **AI Seyahat Planlayıcı:** Kullanıcının doğal dildeki isteklerini analiz ederek gün bazlı seyahat rotaları ve aktiviteler önerir.
- **Dinamik Otel & Uçuş Arama:** Gerçek zamanlı kriterlere göre konaklama ve uçuş alternatiflerini listeler.
- **Otonom CRS Rezervasyonu:** PNR oluşturma ve rezervasyon onay adımlarını tek arayüz üzerinden uçtan uca simüle eder.
- **Performans & Token Analitiği:** LLM token tüketimini ve tahmini maliyet metriklerini izleyen entegre altyapı.

## Teknoloji Yığını

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** .NET 9 Web API, Entity Framework Core, SQL Server
- **AI / LLM:** Google Gemini API (Function Calling & Structured Outputs)
- **Mimari:** RESTful API, DTO Pattern, Clean Architecture

## Kurulum ve Çalıştırma

### Frontend
```bash
npm install
npm run dev