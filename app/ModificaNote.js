//Librerie
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

//Necessario per il passaggio di dati (è passato anche dalle props da AppNavigation)
import { useRoute } from "@react-navigation/native";

//Per fare le crud DATABASE/REFERENCE/API
//Push fa si che ogni cosa che viene aggiunta in un oggetto aggiunge un identificativo unico e fa si che le note già presenti remangano intatte
//ogni oggetto deve evare una chiave univoca SU FIREBASE, prefereisce di più UN OGGETTO DI OGGETTI che un ARRAY DI OGGETTI
import { getDatabase, ref, update } from "firebase/database";

export default function ModificaNote({StatiGlobali, navigation}) {
    const { note, userId, prendiNote } = StatiGlobali;

    const route = useRoute();

    //recupero parametri da dove ci sono inviati (in questo caso nome e titolo della nota selezionata)
    const { nota } = route.params

  //Variabili di stato
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");

  //Funzione per il salvataggio di una nuova nota sul database
  const ModifyNote = async () => {
    try {
      const db = getDatabase();
      //questo crea una nuova nota nel database
      const notesRef = ref(db, "users/" + userId + "/notes/" + nota.id);

      //impostazione body dell'update
      const body = {
        titolo: titolo,
        testo: testo,
        dataModifica: Date.now(),
      };

      //impostare l'oggetto il push ha bisogno del PERCORSO e DEL BODY come parametri
     update(notesRef, body)
        .then(() => {
          console.log("Nota Modificata con successo");

          prendiNote();
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log("errore modifica della nota: ", error);
        });
    } catch (error) {
      console.log("errore nel salvataggio: ", error);
    }
  };

    useEffect(() => {
        setTitolo(nota.titolo)
        setTesto(nota.testo)
    }, [])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styled.container}>
        <ThemedView style={styled.containerNota}>
          <TextInput
            style={styled.input}
            placeholder="Titolo Nota"
            value={titolo}
            onChangeText={setTitolo}
          />

          <TextInput
            style={[styled.input, styled.inputTesto]}
            placeholder="Testo Nota"
            value={testo}
            onChangeText={setTesto}
            //Attibuto per impostare la text Area
            multiline={true}
          />

          <ThemedView style={styled.btnContainer}>
            <TouchableOpacity style={[styled.btn]} onPress={ModifyNote}>
              <ThemedText>Conferma Modifica</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styled.btn]}
              onPress={() => navigation.navigate("Home")}
            >
              <ThemedText>Annulla modifica</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        {/*
        <TouchableOpacity
          style={styled.tornaIndetro}
          onPress={() => props.navigation.navigate("Home")}
        >
          <ThemedText style={styled.tornaIndetro.testo}>
            Torna Indietro
          </ThemedText>
        </TouchableOpacity> */}
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",

    bloccoDiTesto: {
      paddingHorizontal: 20,

      titolo: {
        color: "orange",
        fontSize: 25,
        fontWeight: "bold",
      },
      paragrafo: {
        fontSize: 15,
        fontWeight: "400",
        textAlign: "justify",
        lineHeight: 15,
      },
    },
  },

  containerNota: {
    backgroundColor: "rgb(255,251,180)",
    width: "85%",
    height: "auto",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,

    titolo: {
      color: "black",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "left",
    },
    testo: {
      color: "black",
      fontSize: 12,
      textAlign: "justify",
      marginTop: 10,
    },
  },

  tornaIndetro: {
    marginTop: 10,
    testo: { fontWeight: 100 },
  },

  //Stili input

  input: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
  },

  inputTesto: {
    height: 200,
  },

  btn: {
    alignItems: "center",
    marginTop: 20,
    testo: {},
  },

  //Bottoni

  btnContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    backgroundColor: " rgb(255, 251, 180)",
  },
});

/*


npx expo install expo-checkbox Installazione della checkbox 

reactNative non offe checkbox native


*/
