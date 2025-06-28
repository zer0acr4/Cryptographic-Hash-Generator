# Cryptographic-Hash-Generator
A responsive client-side hash generator supports MD5, SHA-1, SHA-2, and SHA-3 algorithms, designed with accessibility, a clean interface, and an emphasis on cybersecurity. This sleek, fast, and modern tool allows users to securely create cryptographic hashes for text and files using popular algorithms. All processing occurs entirely within the browser, ensuring that no data leaves your device.


> ⚡ Built with accessibility, performance, and cybersecurity awareness in mind.

[![Live Demo](https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge&logo=vercel)](https://zer0acr4.github.io/Cryptographic-Hash-Generator/)


---

## 🚀 Features

- 🔑 **Multiple Hash Algorithms**
  - `MD5`, `SHA-1`, `SHA-224`, `SHA-256`, `SHA-512`
  - `SHA3-256`, `SHA3-384`, `SHA3-512`, `BLAKE2b`, `BLAKE2s`
- 📄 **Drag & Drop File Uploading**
- 🧮 **Real-time Hash Comparison**
- 💾 **Local History with Export Options**
- 🌓 **Dark/Light Theme Toggle**
- 📤 **Floating Action Button (FAB)** for exporting and clearing
- 🔒 **Security Tips for Weak Algorithms**
- 📱 **Fully Responsive & Mobile-First Design**
- 🧠 **Built with Vanilla JavaScript** — no frameworks or backend

---

## 🖥️ Live Demo

🌐 **Try it here:**  
👉 [https://zer0acr4.github.io/Cryptographic-Hash-Generator/](https://zer0acr4.github.io/Cryptographic-Hash-Generator/)

---

## 📸 Screenshots

<!-- Add your own screenshots in assets/ folder -->
| Hash Generator UI | File Upload & History |
|-------------------|------------------------|
| ![UI Screenshot](assets/screen1.png) | ![History Screenshot](assets/screen2.png) |

---

## 🛠️ Built With

- **HTML5**, **CSS3** (Flexbox, Grid, Variables)
- **Vanilla JavaScript (ES6+)**
- [`CryptoJS`](https://github.com/brix/crypto-js) – hashing library
- Web APIs: `FileReader`, `Clipboard`, `localStorage`, `TextEncoder`

---

## 📂 Project Structure

Cryptographic-Hash-Generator/

├── index.html

├── style.css

├── script.js

├── assets/ # images, icons, optional screenshots

└── README.md



---

## 🧪 How to Use

### ▶️ Online
Just open the [Live Demo](https://zer0acr4.github.io/Cryptographic-Hash-Generator/) — no installation needed.

### 🛠️ Run Locally
```bash
git clone https://github.com/zer0acr4/Cryptographic-Hash-Generator.git
cd Cryptographic-Hash-Generator
open index.html    # or drag into your browser
```
---


### 🔐 Security Note
⚠️ MD5 and SHA-1 are outdated and insecure for cryptographic use.
They are included here only for educational and compatibility reasons.
For secure applications, use SHA-2, or SHA-3.



---

### ✨ Roadmap & Future Ideas

```markdown
- [ ] Add HMAC support
- [ ] Convert into a PWA (Progressive Web App)
- [ ] Add bcrypt / scrypt / PBKDF2 (password hashing)
- [ ] Hash multiple files at once
- [ ] Support clipboard watch mode

 
```
---
### 👨‍💻 Author
Rithesh Chandraa Alakati
 - 🎓 B.Tech Cybersecurity Student | Aspiring Pentester & Frontend Developer
 - 🔗 GitHub: [zer0arc4](https://github.com/zer0acr4)
 - 📫 LinkedIn [Alakati Rithesh Chandra ](https://www.linkedin.com/in/alakati-rithesh-chandra)
 

---
### 🧠 Acknowledgments
Inspired by developer tools like CyberChef

Thanks to CryptoJS, Cursor, and ChatGPT for helping with my thoughts, debugging, and future enhancements. 

---
### 📄 License
This project is licensed under the MIT License — free to use and modify.
