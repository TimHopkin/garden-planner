// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC419c3Dt7jZ2rBJKfqnW4imqQjq-CJnaE",
  authDomain: "garden-planner-ffdce.firebaseapp.com",
  projectId: "garden-planner-ffdce",
  storageBucket: "garden-planner-ffdce.firebasestorage.app",
  messagingSenderId: "240335794914",
  appId: "1:240335794914:web:8ea9b0f98810593b8d24bb",
  measurementId: "G-JTL1562H3P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Export auth for use in other files
window.auth = auth;