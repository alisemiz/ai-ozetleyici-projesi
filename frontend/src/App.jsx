// frontend/src/App.jsx

import React, { useState } from "react";
import axios from "axios"; // HTTP istekleri için axios'u import et
// "./App.css" import satırı, derleme hatası verdiği için kaldırıldı.
// Stiller doğrudan aşağıya <style> etiketi olarak eklendi.

function App() {
  // Arayüzün durumlarını (state) yönet
  const [text, setText] = useState(""); // Kullanıcının girdiği metin
  const [summary, setSummary] = useState(""); // AI'dan gelen özet
  const [loading, setLoading] = useState(false); // "Yükleniyor..." durumu
  const [error, setError] = useState(""); // Hata mesajları

  // "Özetle" butonuna tıklandığında...
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle

    // Hata kontrolü
    if (!text || text.trim().length === 0) {
      setError("Lütfen özetlenecek bir metin girin.");
      return;
    }

    // Arayüzü sıfırla
    setSummary("");
    setError("");
    setLoading(true);

    try {
      // Python sunucumuza (backend) API isteği gönder
      //
      // !!! DÜZELTME BURADA !!!
      // Backend'imiz JSON'u 'text' anahtarıyla bekliyordu.
      //
      const response = await axios.post("http://localhost:5000/summarize", {
        text: text, // 'text_to_summarize' yerine 'text' olarak değiştirildi
      });

      // Gelen cevabı (özeti) state'e ata
      setSummary(response.data.summary);
    } catch (err) {
      // Hata yakalama
      console.error("API isteği sırasında hata oluştu:", err);
      if (err.response) {
        // Sunucudan (Flask) gelen spesifik hata mesajını göster
        setError(`Hata: ${err.response.data.error}`);
      } else {
        // Sunucuya hiç ulaşılamadıysa (Flask çalışmıyorsa)
        setError(
          "Özetleme sunucusuna bağlanılamadı. Backend'in çalıştığından emin misin?"
        );
      }
    } finally {
      // Yükleniyor durumunu kapat
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* CSS dosyası import edilemediği için stiller buraya eklendi */}
      <style>{`
        .App {
          font-family: sans-serif;
          text-align: center;
          color: #333;
        }
        
        header {
          background-color: #007bff;
          color: white;
          padding: 20px 10px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        header h1 {
          margin: 0;
          font-size: 2.2rem;
        }
        
        header p {
          margin: 5px 0 0;
          font-size: 1.1rem;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        textarea {
          width: 100%;
          min-height: 200px;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          resize: vertical;
          box-sizing: border-box; /* Padding'in genişliği etkilememesi için */
        }
        
        button {
          padding: 12px 20px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        button:hover {
          background-color: #0056b3;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .message {
          padding: 15px;
          margin-top: 15px;
          border-radius: 8px;
          font-weight: bold;
        }
        
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .message.loading {
          background-color: #e2e3e5;
          color: #383d41;
          border: 1px solid #d6d8db;
        }
        
        .summary-output {
          background-color: #f8f9fa;
          min-height: 150px;
          margin-top: 20px;
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #212529;
        }
      `}</style>

      <header>
        <h1>Yapay Zeka Metin Özetleyici 🤖</h1>
        <p>Uzun metinlerinizi yapıştırın ve saniyeler içinde özetini alın.</p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Özetlenecek uzun metni buraya yapıştırın..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Özetleniyor..." : "Özetle"}
          </button>
        </form>

        {/* Hata veya Yüklenme mesajlarının gösterildiği alan */}
        {error && <div className="message error">{error}</div>}
        {loading && (
          <div className="message loading">
            Lütfen bekleyin... AI modeli metni analiz ediyor.
          </div>
        )}

        <textarea
          className="summary-output"
          value={summary}
          readOnly
          placeholder="Özet burada görünecek..."
        />
      </main>
    </div>
  );
}

export default App;
