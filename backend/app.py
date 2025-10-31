from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import logging

# Hata ayıklama için loglamayı açalım
logging.basicConfig(level=logging.INFO)

# 1. Flask sunucusunu ve CORS'u (Cross-Origin Resource Sharing) başlat
app = Flask(__name__)
# CORS: React'in (localhost:5173) bu sunucuya (localhost:5000) erişebilmesi için izin ver
CORS(app, resources={r"/summarize": {"origins": "http://localhost:5173"}})

# 2. Yapay Zeka Modelini Yükle
summarizer = None
# KULLANILACAK MODELİN ADI
# 'ozcangundes' modeli bozuk görünüyor. Farklı bir modeli deniyoruz.
model_name = "savasy/mt5-mlsum-turkish-summarization"

def load_model():
    """Modeli yüklemek için yardımcı fonksiyon."""
    global summarizer
    try:
        logging.info(f"AI Modeli ({model_name}) yükleniyor... LÜTFEN BEKLEYİN.")
        logging.info("UYARI: Bu da ~1.2 GB civarı bir modeldir ve indirilmesi UZUN sürebilir.")
        # Modeli pipeline ile yüklüyoruz
        summarizer = pipeline("summarization", model=model_name)
        logging.info("AI Modeli başarıyla yüklendi!")
    except Exception as e:
        logging.error(f"Model yüklenirken HATA oluştu: {e}")
        summarizer = None # Hata durumunda modeli 'None' yap

# 3. Özetleme için API 'endpoint' (rota) oluştur
@app.route('/summarize', methods=['POST'])
def summarize_text():
    global summarizer
    # Modelin yüklenip yüklenmediğini kontrol et
    if summarizer is None:
        return jsonify({"error": "Model henüz yüklenmedi veya yüklenirken bir hata oluştu."}), 503

    try:
        data = request.get_json()
        text_to_summarize = data.get('text')

        if not text_to_summarize:
            return jsonify({"error": "Metin ('text') alanı eksik."}), 400

        # Metin çok kısaysa özetlemeye çalışma
        if len(text_to_summarize.split()) < 30:
             return jsonify({"summary": text_to_summarize}) # Kısa metni olduğu gibi geri döndür

        logging.info("Özetleme işlemi başlıyor...")
        
        # Modeli çalıştır ve özet oluştur
        summary_list = summarizer(text_to_summarize, min_length=30, max_length=150, do_sample=False)
        
        # Özet metnini al
        summary = summary_list[0]['summary_text']
        
        logging.info("Özetleme tamamlandı.")
        
        # Özeti JSON olarak React'e geri döndür
        return jsonify({"summary": summary})

    except Exception as e:
        logging.error(f"Özetleme sırasında hata: {e}")
        return jsonify({"error": "Özetleme sırasında sunucuda bir hata oluştu."}), 500

# 4. Sunucuyu çalıştır
if __name__ == '__main__':
    # Modeli ana program başladığında yükle
    load_model()
    # Sunucuyu debug modunda çalıştır
    # (use_reloader=False) modelin iki kez yüklenmesini engeller
    app.run(debug=True, port=5000, use_reloader=False)

