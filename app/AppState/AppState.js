//Import Librerie
import React, { useState, useEffect } from "react";

//Import Navigazione
import AppNavigation from "../AppNavigation/AppNavigation";


//Import di autenticazione e crud per Firebase
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, } from "firebase/database";


export default function AppState() {

  //Variabili di stato
  const [allNotes, setAllNotes] = useState([]);
  const [note, setNote] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false)
  const [userId, setUserId] = useState(null)


  //Funzione per la presa di ciò che è contenuto nel database e stampa sull'app
  const prendiNote = () => {

    const db = getDatabase()
    const userRef = ref(db, 'users/' + auth.currentUser.uid + '/notes')
    // siccome il then qui fa una snapShot è buona pratica chiamare l'argomento snapShot
    get(userRef).then((snapShot) => {
      if (snapShot.exists()) {
        // se snapShot esiste setUser col valore(val) trovato da snapShot
        setAllNotes(snapShot.val())
      } else {
        console.log("nessun dato disponibile")
        setAllNotes([])
      }
    }).catch((error) => {
      console.error(error)
    })
  }


  useEffect(() => {
    //onAuthStateChaged è un listener
    const unsubscibe = onAuthStateChanged(auth, (user) => {
      if (user) {
        prendiNote();
        setUserId(auth.currentUser.uid)
      }
    });
    return unsubscibe; //clean up per rimuovere il listener, se l'utente è loggato non richiede di loggare di nuovo
  }, [userLoaded]);


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
  };


  return <AppNavigation StatiGlobali={StatiGlobali} />
}