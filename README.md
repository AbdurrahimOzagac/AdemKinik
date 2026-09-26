# Adem Kınık — Portfolyo

Çizer portfolyo sitesi. Saf HTML/CSS/JS; derleme adımı yok.

## Çalıştırma

`index.html` dosyasını tarayıcıda açın veya:

```sh
python3 -m http.server 8000   # → http://localhost:8000
```

GitHub Pages, Netlify, Vercel gibi herhangi bir statik hostinge olduğu gibi yüklenebilir.

## Yapı

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sayfa: giriş, işler, hakkımda, iletişim |
| `style.css` | Tüm tasarım (renkler en üstte `:root` içinde) |
| `script.js` | Galeri listesi (`WORKS`), filtreler, büyütme penceresi, sipariş formu |
| `assets/works/` | Web için küçültülmüş çizimler (`x.jpg` büyük, `x-sm.jpg` küçük) |
| `assets/fonts/` | Yerel fontlar (Bricolage Grotesque, Caveat, Space Mono — OFL) |
| `adem/` | Orijinal fotoğraflar |

## Düzenleme

- **İletişim bilgileri:** `index.html` içindeki `#iletisim` bölümünde e-posta, Instagram ve WhatsApp
  bağlantılarını gerçekleriyle değiştirin. Sipariş formu, sayfadaki e-posta adresine mail açar.
- **Yeni çizim eklemek:** görseli `assets/works/` klasörüne `ad.jpg` (~1800px) ve `ad-sm.jpg` (~720px)
  olarak koyun, `script.js` içindeki `WORKS` listesine bir satır ekleyin.
