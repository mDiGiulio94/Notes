//Librerie
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


//Per fare le crud DATABASE/REFERENCE/API
//Push fa si che ogni cosa che viene aggiunta in un oggetto aggiunge un identificativo unico e fa si che le note già presenti remangano intatte
//ogni oggetto deve evare una chiave univoca SU FIREBASE, prefereisce di più UN OGGETTO DI OGGETTI che un ARRAY DI OGGETTI
import { getDatabase, ref, set, push  } from "firebase/database";

//Import image picker di expo
import * as ImagePicker from 'expo-image-picker'

//Import dello storage il ref è per non condonderlo col ref del database
import{ getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from 'firebase/storage'
import { storage } from "./Firebase";

export default function CreateNote(props) {
  const { note, userId, prendiNote } = props.StatiGlobali;

  //Variabili di stato
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");

  const [imageUrl, setImageUrl] = useState(null);

  //Funzione per il salvataggio di una nuova nota sul database
  const saveNote = async () => {
    try {
      const db = getDatabase();
      //questo crea una nuova nota nel database
      const notesRef = ref(db, "users/" + userId + "/notes");
      //Questo invece genera un identificatore univoco(id)
      const newNotesRef = push(notesRef);

      //impostazione body del push
      const body = {
        id: newNotesRef.key.toString(),
        titolo: titolo,
        testo: testo,
        data: Date.now(),
        imageUrl: imageUrl,
      };

      //impostare l'oggetto il push ha bisogno del PERCORSO e DEL BODY come parametri
      set(newNotesRef, body)
        .then(() => {
          console.log("dati della nota salvati");

          prendiNote();
          props.navigation.navigate("Home");
        })
        .catch((error) => {
          console.log("errore creazione della nota: ", error);
        });
    } catch (error) {
      console.log("errore nel salvataggio: ", error);
    }
  };

  //METODO SELEZIONE IMMAGINE
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      // aspect: [
      //   1,1 o 4,3 o 16,9 serve per impostare volendo la risoluzione immagine
      // ]
      // base64: true conversione dell'immagine in base64
    });
    //se result è andato a buon fine
    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      uploadImage(source.uri);
    }
  };

  //Upload Image
  const uploadImage = async (uri) => {
    try {
      //aspetta che abbia funzionato fetch uri
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageReference = storageRef(storage, `images/${filename}`);
      await uploadBytes(storageReference, blob);

      //prendo l'url del bucket nello storage e lo metto in setImageUrl
      const url = await getDownloadURL(storageReference);
      setImageUrl(url);
      console.log("immagine caricata con successo", url);
    } catch (error) {
      console.error("ci sono stati errori nel caricamento", error);
    }
  };


  //Metodo eliminazione immagine
  const deleteImage = async (noteImageUrl) => {
    try {
      const imageRef = storageRef(storage, noteImageUrl);
      await deleteObject(imageRef);
      console.log('immagine eliminata')
      setImageUrl(null)
    } catch (error) {
      console.error("errore nell'eliminazione", error)
    }
  }


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

          {!imageUrl && (
            <TouchableOpacity style={styled.btn} onPress={selectImage}>
              <ThemedText style={styled.btn.testo}>
                SELEZIONA IMMAGINE
              </ThemedText>
            </TouchableOpacity>
          )}

          {imageUrl && (
            <>
              <ThemedView style={styled.imagePreview}>
                <Image source={{ uri: imageUrl }} style={styled.image} />
              </ThemedView>
              <TouchableOpacity
                style={styled.btn}
                onPress={() => deleteImage(imageUrl)}
              >
                <ThemedText style={styled.btnTesto}>ELIMINA FOTO</ThemedText>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={[styled.btn]} onPress={saveNote}>
            <ThemedText>Inserisci Nota</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* <TouchableOpacity
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
    width: "90%",
    height: 'auto',
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

  imagePreview: {
    marginTop: 10,
    alignItems: "center",
    height: 200,
    backgroundColor: null,
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
  },

  //immagine

  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  }
});


/*
FIREBASE

aggiunta di possibilità di fare login tramite gmail e inserimento di note all'itento di database dedicato e dare la possibilità di aggiungerle in locale e renderle visualizzabili anche senza internet

FIREBASE è un servizio offerto da google spesso gratuito, e solo in specifici casi diventa a pagamento se si vogliono funzioni speciali ecc..

firebase offre da se un parte backend, è un servizio senza server perché offre già degli endpoint (API) per fare tutte le CRUD, all'interno dei suoi databese, offre database in tempo reale, o anche di un altro tipo (tipo mongo). il primo caso è che se si fa una modifica, in tempo reale senza ricaricare la pagina cambia il contenuto dell'app.

Firebase offre i BUCKET che servono per caricare tutte le immagini che vogliono (ad esempio per fare note con immagini o dare la possibilità all'utente di caricare le proprie immagini), non ha limite quindi ci si può caricare e fare quello che gli pare

INOLTRE offre FCM che è integrato nei servizi gratuiti di FIREBASE e si occupa della gestione delle notifiche push

INOLTRE offre il login, la registrazione e l'hosting tramite provider (gmail, icloud, ecc...).

FIREBASE può essere utilizzato non solo per REACT NATIVE ma anche per REACT, nel caso gratuito l'hosting che offre in generale è "brutto" visivamente, e ne da uno migliore nella versione a pagamento, ma interessa poco nel caso dello sviluppo app perché l'hosting non appare mai

...........................................

le stesse procedure per la gestione progetto su firebase valgono anche per REACT

il Firebase Hosting va spuntato solo se si usa react non reactNative

dopo aver registrato l'app, si apre su firebase si va su autentication o e si vedono i vari provider

*/