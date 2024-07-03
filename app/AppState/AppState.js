//Import Librerie
import React, { useState, useEffect } from "react";

//Import Navigazione
import AppNavigation from "../AppNavigation/AppNavigation";


//Import di autenticazione e crud per Firebase
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, } from "firebase/database";

//Necessario per usare le localStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

//Import di netInfo
import NetInfo from "@react-native-community/netinfo";


export default function AppState() {

  //Variabili di stato
  const [allNotes, setAllNotes] = useState([]);
  const [note, setNote] = useState([]);
  //Variabile per definire se l'utente è loggato o meno
  const [userLoaded, setUserLoaded] = useState(false)
  //Variabile che immagazzina l'id utente fatta l'identificazione
  const [userId, setUserId] = useState(null)

  //Variabile per l'offline
  const [offline, setOffline] = useState(false)
  //Funzione per la presa di ciò che è contenuto nel database e stampa sull'app
  const prendiNote = () => {

    const db = getDatabase()
    const userRef = ref(db, 'users/' + auth.currentUser.uid + '/notes')
    // siccome il then qui fa una snapShot è buona pratica chiamare l'argomento snapShot
    get(userRef).then((snapShot) => {
      if (snapShot.exists()) {
        // se snapShot esiste setUser col valore(val) trovato da snapShot
        // setAllNotes(snapShot.val()
        salvaNoteLocalmente(snapShot.val())
      } else {
        console.log("nessun dato disponibile")
        setAllNotes([])
      }
    }).catch((error) => {
      console.error(error)
    })
  }


  //Metodo per salvare note in locale

 const salvaNoteLocalmente = async (note) => {

try {
  const noteJson = JSON.stringify(note)
  await AsyncStorage.setItem('noteLocali', noteJson)
  caricaNoteLocali()
} catch (error) {
  console.error("errore nel salvataggio note in locale", error)
}
 }


  const caricaNoteLocali = async () => {
    try {
      const noteJson = await AsyncStorage.getItem("noteLocali");
      if (noteJson !== null) {
        const note = JSON.parse(noteJson)
        setAllNotes(note)
      }
    } catch (error) {
      console.error("errore del caricamento in locale a causa di: ",  error)
    }
  }

  useEffect(() => {
    //onAuthStateChaged è un listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        prendiNote();
        setUserId(auth.currentUser.uid)
      }
    });
    return unsubscribe; //clean up per rimuovere il listener, se l'utente è loggato non richiede di loggare di nuovo
  }, [userLoaded]);


      // useEffect(() => {
      //   const unsubscribeOffline = NetInfo.addEventListener((state) => {
      //     setOffline(state.isConnected === false);
      //   });
      //   return () => unsubscribeOffline();
  // }, []);
  
useEffect(() => {
  const unsubscribeOffline = NetInfo.addEventListener((state) => {
    setOffline(state.isConnected === false);
  });
  return () => unsubscribeOffline();
}, []);

  



  //Passaggio delle informazioni che ci interessa siano aggiungibili da qualsiasi parte del codice come stati glo
  const StatiGlobali = {
    allNotes,
    setAllNotes,
    note,
    setNote,
    prendiNote,
    userLoaded,
    setUserLoaded,
    userId,
    setUserId,
    offline
  };


  return <AppNavigation StatiGlobali={StatiGlobali} />
}