// ══════════════════════════════════════════
//   firebase-config.js
//   Khởi tạo kết nối Firebase — điền config từ
//   Firebase Console > Project settings > Your apps
// ══════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcq23LFUCt0jrrlb1z144BBeB0pzXs-tE",
  authDomain: "valoranthome-fad08.firebaseapp.com",
  projectId: "valoranthome-fad08",
  storageBucket: "valoranthome-fad08.firebasestorage.app",
  messagingSenderId: "26523156489",
  appId: "1:26523156489:web:3e6804f17d643c7d88f8d8",
  measurementId: "G-CPY3DC1CYG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };