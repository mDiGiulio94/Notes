//Import Componenti
import CustomModal from "./Components/CustomModal";

//Import Librerie
import React, { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

//Import delle icone
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

//Import Firebase, del Database e delle Crud
import { getDatabase, ref, remove } from "firebase/database";

//Import dello storage il ref è per non condonderlo col ref del database
import { ref as storageRef, deleteObject } from "firebase/storage";
import { storage } from "./Firebase";

export default function Home({ StatiGlobali, navigation }) {
  //DEstrutturazione degli stati globali
  const { allNotes, setNote, userId, prendiNote, offline } = StatiGlobali;

  const imgOffline = "../assets/images/offline.png";

  //Variabili di stato
  const [modalVisible, setModalVisible] = useState(false);

  const [itemToDelate, setItemToDelete] = useState(null);

  //Navigazione sul dettaglio della nota
  const handlePress = (nota) => {
    console.log("nota: ", nota);
    setNote(nota);
    navigation.navigate("Note");
  };

  //Metodo per la delate
  const deleteItem = (id, titolo, imageUrl) => {
    const notaDaEliminare = { id: id, titolo: titolo, imageUrl: imageUrl };
    setItemToDelete(notaDaEliminare);
    setModalVisible(true);
  };

  //Metodo per la conferma del delete
  const confirmDeleteItem = (item) => {
    setModalVisible(false);
    delateImage(item.imageUrl);
    removeNote(item.id);
  };

  //Metodo per rimuovere l'item dal database
  const removeNote = (itemId) => {
    const db = getDatabase();
    const notaRef = ref(db, "users/" + userId + "/notes/" + itemId);
    remove(notaRef)
      .then(() => {
        console.log("nota rimossa con successo");
        prendiNote();
      })
      .catch((error) => {
        console.error("errore nella rimozione nota", error);
      });
  };

  //Split trasforma in array una stringa

  //Metodo eliminazione immagine
  const delateImage = async (noteImageUrl) => {
    try {
      //nel caso avessio un path
      // const path = decodeURIComponent(noteImageUrl.split('/o/')[1].split(/?/)[0])
      const imageRef = storageRef(storage, noteImageUrl);
      await deleteObject(imageRef);
      console.log("immagine eliminata");
    } catch (error) {
      console.error("errore nell'eliminazione", error);
    }
  };

  //prende i valori di un oggetto e li trasforma in un array in modo tale da permettere il ciclo
  const notesArray = Object.values(allNotes).sort((a, b) => {
    return b.data - a.data;
  });

  console.log("Questo è notesArray in home ", notesArray);

  return (
    <>
      {notesArray.length > 0 ? (
        <ScrollView style={styles.scroll}>
          <ThemedView style={styles.container}>
            {offline && (
              <>
                <Image source={require(imgOffline)} style={styles.offline} />

                <ThemedView style={styles.containerOffline}>
                  <Feather name="wifi-off" size={20} color={"black"} />
                  <ThemedText>Offline - Modalità sola lettura</ThemedText>
                </ThemedView>
              </>
            )}

            {notesArray.map((nota, index) => (
              <ThemedView style={styles.containerNota} key={index}>
                {!offline && (
                  <ThemedView style={styles.containerBtnUpdate}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ModificaNote", { nota: nota })
                      }
                    >
                      <FontAwesome5 name="pen" size={20} color="black" />
                    </TouchableOpacity>
                  </ThemedView>
                )}

                <TouchableOpacity
                  onPress={() => handlePress(nota)}
                  style={styles.containerCorpoNota}
                >
                  {nota.imageUrl && (
                    <Image
                      source={{ uri: nota.imageUrl }}
                      style={styles.image}
                    />
                  )}
                  <ThemedText style={styles.containerNota.titolo}>
                    {nota.titolo}
                  </ThemedText>
                  <ThemedText style={styles.containerNota.testo}>
                    {nota.testo}
                  </ThemedText>
                </TouchableOpacity>

                {!offline && (
                  <ThemedView style={styles.containerBtnDelete}>
                    <TouchableOpacity
                      onPress={() =>
                        deleteItem(nota.id, nota.titolo, nota.imageUrl)
                      }
                    >
                      <Feather name="trash-2" size={20} color="black" />
                    </TouchableOpacity>
                  </ThemedView>
                )}
              </ThemedView>
            ))}
          </ThemedView>
          <CustomModal
            isVisible={modalVisible}
            onConfirm={confirmDeleteItem}
            onCancel={() => setModalVisible(false)}
            item={itemToDelate}
          />
        </ScrollView>
      ) : (
        <ThemedView style={styles.centro}>
          <ThemedText>Nessuna nota</ThemedText>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: null,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    zIndex: 1,
    padding: 20,

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
    minHeight: 200,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,
    marginBottom: 10,
    marginTop: 10,

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
      marginTop: 3,
      height: 120,
      width: "98%",
    },
  },

  containerBtnUpdate: {
    backgroundColor: null,
    alignItems: "flex-end",
    position: "absolute",
    right: 10,
    top: 10,
  },

  containerBtnDelete: {
    backgroundColor: null,
    alignItems: "flex-end",
    position: "absolute",
    right: 10,
    bottom: 10,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //immagine

  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
  },
});
