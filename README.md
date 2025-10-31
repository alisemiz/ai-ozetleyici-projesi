# AI Destekli Metin Özetleyici (Full-Stack Projesi)

Bu proje, bir Python/Flask backend ve React/Vite frontend'den oluşan, uzun Türkçe metinleri analiz ederek yüksek doğruluklu özetler çıkaran bir web uygulamasıdır. Hugging Face `transformers` kütüphanesi aracılığıyla yerel olarak çalıştırılan bir yapay zeka modelini kullanır.

## Proje Amacı

Bu projenin temel amacı, modern bir web yığını (React + Flask) kullanarak uçtan uca bir yapay zeka uygulamasının nasıl oluşturulacağını göstermektir. Harici, ücretli API'lere bağımlı kalmadan, güçlü bir açık kaynaklı modeli (mT5) doğrudan bir Python sunucusu üzerinden sunarak performanslı ve ölçeklenebilir bir çözüm sunmayı hedefler.

---

## 🚀 Temel Özellikler

* **Dinamik React Arayüzü:** Vite ile oluşturulmuş hızlı, modern ve reaktif bir kullanıcı arayüzü.
* **Güçlü API Sunucusu:** Python Flask kullanılarak oluşturulmuş, `/summarize` endpoint'i sağlayan bir backend.
* **Yerel AI Modeli:** `savasy/mt5-mlsum-turkish-summarization` (mT5) modelini kullanarak harici servislere ihtiyaç duymadan özetleme yapar.
* **Asenkron İşlem Yönetimi:** `axios` ile yapılan API çağrıları sırasında kullanıcıyı bilgilendiren "Yükleniyor..." durumu.
* **Kapsamlı Hata Yönetimi:**
    * **Frontend:** Boş metin gönderimi gibi kullanıcı hatalarını yakalar.
    * **Backend:** Modelin henüz yüklenmemesi (`503`), eksik veri (`400`) veya özetleme sırasındaki sunucu hataları (`500`) için net JSON yanıtları döner.

---

## 🛠️ Kullanılan Teknolojiler

### Backend (Sunucu Tarafı)

* **Python 3.10+**
* **Flask:** API sunucusunu oluşturmak ve endpoint'leri yönetmek için kullanılan mikro-web framework.
* **Flask-CORS:** Frontend'den (farklı port/domain) gelen `POST` isteklerine izin vermek için.
* **Hugging Face `transformers`:** Özetleme modelini yüklemek, önbelleğe almak ve çalıştırmak için temel kütüphane.
* **`savasy/mt5-mlsum-turkish-summarization`:** Türkçe metin özetleme için kullanılan önceden eğitilmiş model.
* **`sentencepiece` & `protobuf`:** Modelin tokenizer'ı (metin parçalayıcı) için gerekli olan temel bağımlılıklar.

### Frontend (İstemci Tarafı)

* **React 18+**
* **Vite:** Hızlı, anında yeniden yükleme (HMR) sunan modern React geliştirme ortamı.
* **Axios:** Backend API'sine asenkron HTTP `POST` isteklerini yapmak için kullanılan promise-bazlı kütüphane.
* **CSS (dahili):** `App.jsx` içine gömülü stil kodları.

---
## Görüntüler
<img width="1165" height="750" alt="Ekran görüntüsü 2025-10-31 230049" src="https://github.com/user-attachments/assets/cf74db7c-e77c-412b-858d-9efbe71fe4e1" />

## 🧠 Model Detayları

Bu projede `savasy/mt5-mlsum-turkish-summarization` modeli tercih edilmiştir. Bu model:
* Google'ın **mT5 (Multilingual T5)** mimarisinin bir varyantıdır.
* **MLSUM (Multilingual Summarization)** veri setinin Türkçe bölümü üzerinde ince ayar (fine-tuning) yapılmıştır.
* Yaklaşık **1.2 GB** boyutundadır, bu da `t5-small` gibi daha küçük modellere göre çok daha yüksek kalitede ve anlamsal olarak tutarlı Türkçe özetler üretmesini sağlar.

---

## 📂 Proje Mimarisi ve Veri Akışı

1.  Kullanıcı, React arayüzündeki (`localhost:5173`) `textarea`'ya metni girer ve "Özetle" butonuna basar.
2.  React, `axios` kullanarak `{"text": "..."}` içeren bir `POST` isteğini Flask sunucusuna (`localhost:5000/summarize`) gönderir.
3.  Flask (`app.py`), isteği alır, JSON'dan `text` verisini ayıklar.
4.  Bu metni, hafızaya önceden yüklenmiş olan `transformers` `pipeline`'ına verir.
5.  AI modeli metni işler ve özetlenmiş metni (`summary_text`) üretir.
6.  Flask, `{"summary": "..."}` içeren bir JSON yanıtını React'e geri gönderir.
7.  React, bu yanıtı alır, `summary` state'ini günceller ve sonucu arayüzdeki ikinci `textarea`'da gösterir.
