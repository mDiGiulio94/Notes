//Import librerie
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Platform, Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

//Import icone
import  { Ionicons } from '@expo/vector-icons'

//Import autenticazione
import { auth } from "../Firebase";
//listener e metodo di log out
import { onAuthStateChanged, signOut } from "firebase/auth";
//ref serve per puntare alla tabella e al database get invece è uno dei metodi del database (come delate ecc..)
import { getDatabase, ref, get } from "firebase/database";
import { ThemedText } from "@/components/ThemedText";

//Import Componenti
import CustomModal from "./CustomModal";

export default function Header({StatiGlobali}) {
  //Percorso del logo in header
  const Logo = "../../assets/images/logo_app_notes.png";

  //Destrutturaizione della variabile userLoaded per verificare se l'user è loggato o no
  const { userLoaded } = StatiGlobali;

  //variabili di stato

  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  //Motodo per aprire la modale al pulsante di log-out
  const logout = () => {
    setModalVisible(true);
  };

  //Metodo per conferma del log-out
  const confirmLogout = (item) => {
    setModalVisible(false);
    handleLogout();
  };

  const prendiNote = () => {
    const db = getDatabase();
    const userRef = ref(db, "users/" + auth.currentUser.uid);
    // siccome il then qui fa una snapShot è buona pratica chiamare l'argomento snapShot
    get(userRef)
      .then((snapShot) => {
        if (snapShot.exists()) {
          // se snapShot esiste setUser col valore(val) trovato da snapShot
          setUser(snapShot.val());
        } else {
          console.log("nessun utente disponibile");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //funzione di log out, si possono scrivere qui tutte le cose che deve fare una volta fatto il logout

const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("logout effettuato");
        setUser(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    //onAuthStateChaged è un listener
    const unsubscibe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //Per risolvere il problema del caricamento dati il primo metodo
        //  setTimeout(() => {
        //       prendiNote();
        //  }, 100)
        prendiNote();
      }
    });
    return unsubscibe; //clean up per rimuovere il listener, se l'utente è loggato non richiede di loggare di nuovo
  }, [userLoaded]);

  return (
    <>
      <ThemedView style={styled.shadowWrapper}>
        <ThemedView style={styled.header}>
          <Image source={require(Logo)} style={styled.Logo} />
        </ThemedView>
        {user && (
          <>
            <ThemedView style={styled.contenitoreUser}>
              <ThemedText>
              Ciao {user?.nome} {user?.cognome}
              </ThemedText>
              <TouchableOpacity onPress={logout}>
                <Ionicons name="exit-outline" size={32} color="black" />
              </TouchableOpacity>
            </ThemedView>
            <CustomModal
              isVisible={modalVisible}
              onConfirm={confirmLogout}
              onCancel={() => setModalVisible(false)}
            />
          </>
        )}
      </ThemedView>
    </>
  );
}

const styled = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10,
    marginTop: 15,
  },

  shadowWrapper: {
    backgroundColor: "yellow",
    paddingBottom: 10,

    // Nel caso ci sono poche cose influenzate
    // paddingTop: Platform.OS == 'android' ? 10 : 5,

    //Caso in cui ci sono tante cose influenzate si può fare questa scritturan con l'ausilio del metodo Select
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: 5,
        },
        paddingTop: 10,
      },
    }),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    zIndex: 10,
  },

  //Stile immagine

  Logo: {
    height: 60,
    width: 160,
  },

  contenitoreUser: {
    backgroundColor: 'yellow',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  }
});
