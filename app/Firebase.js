// // Importa le funzionalità necessarie da Firebase
// import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// //importiamo Async per salvare i dati
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Importa la tua configurazione di Firebase
// import { firebaseConfig } from '../firebase-config';

// // Inizializza Firebase
// const app = initializeApp(firebaseConfig);

// // Configura la persistenza dell'autenticazione con AsyncStorage
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

// // Esporta ciò che ti serve in altri file/componenti
// export { auth };

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../firebase-config";

let auth;

// Verifica se l'app Firebase è già stata inizializzata
if (getApps().length === 0) {
  // Se non è stata inizializzata, inizializza l'app Firebase
  const app = initializeApp(firebaseConfig);

  // Configura la persistenza dell'autenticazione con AsyncStorage
  // e inizializza l'autenticazione
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Se l'app Firebase è già stata inizializzata, ottieni l'istanza esistente
  const app = getApps()[0];

  // Ottieni l'istanza esistente di Auth o inizializzala se non esiste
  auth =
    getAuth(app) ||
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
}

// Esporta ciò che ti serve in altri file/componenti
export { auth };
