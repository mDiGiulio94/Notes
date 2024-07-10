import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  TextInput,
    ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import chatApi from "./AI/Api"
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

import Voice from "@react-native-voice/voice"


export default function AskBot(props) {
  const [domanda, setDomanda] = useState("");
  const [risposta, setRisposta] = useState("");
  const [titoloRicetta, setTitoloRicetta] = useState("");
  const [personNumber, setPersonNumber] = useState("4");

  const [isLoading, setIsLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

    async function getChatBot() {
      setIsLoading(true);
      setRisposta("");
      try {
        const response = await chatApi.getChatGPTResponse(
          domanda,
          personNumber
        );
        console.log("response : " + response);
        if (response && response.length > 0) {
          const risposta = response;
          setRisposta(risposta);
          setTitoloRicetta(domanda);
          setDomanda("");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setDomanda("");
      }
    }

    const copiaRisposta = () => {
      const testoDaCopiare = `${titoloRicetta}\n${risposta}`;
      Clipboard.setStringAsync(testoDaCopiare);
      Toast.show({
        type: "success",
        text1: "Ingredienti copiati",
      });
  };
  
  const ricarica = () => {
    setDomanda(""),
      setPersonNumber("2")
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <ThemedView style={styles.container}>
        <ThemedView style={styles.container.containerParteSopra}>
          <ThemedView style={styles.container.containerNota}>
            <ThemedText style={styles.container.containerNota.titolo}>
              Scrivi il nome della ricetta:
            </ThemedText>

            <TextInput
              style={[styles.input, styles.inputTestoRicetta]}
              placeholder="es. spaghetti alla carbonara"
              onChangeText={setDomanda}
              value={domanda}
              multiline={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            <ThemedView style={styles.containerPerson}>
              <ThemedText>n. persone:</ThemedText>
              <ThemedView style={styles.pickerContainer}>
                <Picker
                  selectedValue={personNumber}
                  onValueChange={(itemValue, itemIndex) =>
                    setPersonNumber(itemValue)
                  }
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="6" value="6" />
                  <Picker.Item label="8" value="8" />
                </Picker>
              </ThemedView>
              <ThemedView style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={getChatBot}
                  style={styles.container.tornaIndietro}
                >
                  <ThemedText style={styles.btnCerca}>Cerca <Feather
                    name="search"
                      color="black"
                      size={17}
                    style={styles.iconaSearch}
                  /></ThemedText>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={ricarica}
                  style={styles.container.tornaIndietro}
                >
                  <ThemedText style={styles.btnCerca}>Ricarica <Feather
                      name="repeat"
                      color="black"
                      size={15}
                      style={styles.iconaSearch}
                    />
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.containerParteSotto}>
          {risposta?.length > 0 && !isFocused && (
            <>
              <ScrollView style={styles.containerRisposta}>
                <ThemedText style={styles.container.containerNota.titolo}>
                  {titoloRicetta}
                </ThemedText>
                <ThemedText style={styles.testoRisposta}>{risposta}</ThemedText>
                <ThemedView style={styles.containerCopy}>
                  <TouchableOpacity
                    onPress={copiaRisposta}
                    style={styles.btnInsert}
                  >
                    <Feather
                      name="copy"
                      size={25}
                      color={"black"}
                      style={styles.iconaCopy}
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ScrollView>
            </>
          )}
          {isLoading && <ActivityIndicator size={"large"} />}
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",

    bloccoDiTesto: {
      paddingHorizontal: 20,

      titolo: {
        color: "orange",
        fontSize: 25,
        fontWeight: "bold",
      },
      paragrafo: {
        fontSize: 10,
        textAlign: "justify",
      },
    },
    containerParteSopra: {
      flex: 1,
      width: "95%",
    },
    containerNota: {
      backgroundColor: "rgb(255, 251, 180)",
      padding: 10,
      height: 230,
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,

      titolo: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "left",
        marginTop: 10,
      },
      testo: {
        fontSize: 12,
        textAlign: "justify",
        marginTop: 10,
      },
    },

    tornaIndietro: {
      // borderWidth: 1,
      // borderColor: "red",
      flexDirection: "row",

      testo: {
        fontWeight: "700",
      },
    },
  },

  input: {
    borderWidth: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
    verticalAlign: "top",
  },
  inputTestoNota: {
    height: 50,
  },
  btnInsert: {
    fontWeight: "bold",
    color: "grey",
    marginTop: -10,
    backgroundColor: null,
  },
  btnCerca: {
    fontWeight: "bold",
    color: "grey",
    marginTop: -10,
    backgroundColor: null,
    fontSize: 18,
    // borderWidth: 1,
    // borderColor: "red",
  },
  containerParteSotto: {
    borderWidth: 0,
    borderColor: "red",
    flex: 1,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgb(255, 251, 220)",
    padding: 5,
    marginTop: -30,
    marginBottom: 10,
  },
  containerRisposta: {
    marginTop: 0,
    borderColor: "black",
    backgroundColor: "rgb(255, 251, 220)",
    padding: 10,
    height: 250,
  },
  testoRisposta: {
    fontSize: 15,
  },
  containerPerson: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    // borderWidth: 1,
    // borderColor: "red",
    width: "70%",
    backgroundColor: null,
  },
  pickerContainer: {
    height: 60, // Imposta l'altezza desiderata qui
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  picker: {
    position: "relative",
    top: -80,
    color: "white", // Imposta il colore del testo del Picker
  },
  inputPicker: {
    color: "#fff",
    fontSize: 20,
    backgroundColor: "#0F141E",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  iconaSearch: {
    borderWidth: 1,
    borderColor: "red",
  },
  containerCopy: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 0,
    paddingBottom: 15,
    backgroundColor: null,
  },
  titoloRicetta: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconaCopy: {
    marginTop: -15,
    paddingBottom: 15,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: null,
    width: "100%",
  },
});