//Import Librerie
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Linking } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

//Import Autenticazione
import { auth } from "./Firebase"
//questi sono offerti da firebase che essendo serverless offre già endpoint prestabiliti
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
//questa è la connessione che va a connettersi al database
import { getDatabase, ref, set } from "firebase/database"

import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

export default function Login({ StatiGlobali }) {
  //Destrutturazione
  const { setUserLoaded } = StatiGlobali;

  // Variabili di stato
  const [nome, setNome] = useState("");

  const [cognome, setCognome] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [ripetiPassword, setRipetiPassword] = useState("");

  const [registrazione, setRegistrazione] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [ isChecked, setIsChecked] = useState(false)

  // ------------------------------------------------------------------


  // REGEX

  //metodo per la validità email
  const isValidEmail = (email) => {
    const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    return regex.test(email);
  };
  //metodo per la validità password
  const isValidPassword = (password) => {
    const regex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

    return regex.test(password);
  };

  // ------------------------------------------------------------------

  //crea account utilizzanto i seguenti parametri
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((credenzialiUtente) => {
        // scrivo l'utente nel DB di firebase
        const db = getDatabase();
        set(ref(db, "users/" + credenzialiUtente.user.uid), {
          nome: nome,
          cognome: cognome,
          email: email,
          notes: {
            abc: {
              id: "abc",
              titolo: "Nota di cortesia",
              testo:
                "questa è una nota di cortesia, per modificare una nota clicca sulla matita in alto a destra, per eliminare la nota clicca sull'icona del cestino, per inserire una nuova nota, clicca sul pulsante in basso 'crea nota' ",
            },
          },
        })
          .then((resp) => {
            console.log("dati utente salvati con successo", resp);
            setUserLoaded(true);
          })
          .catch((error) => {
            console.error("errore nel salvataggio", error);
          });
        console.log("account creato");
        const user = credenzialiUtente.user;
        console.log("nuovo utente: ", user);
        handleSignIn();
      })
      .catch((error) => {
        console.error("errore nel auth", error);
        Alert.alert(error.message);
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credenzialiUtente) => {
        console.log("Entrato");
        const user = credenzialiUtente.user;
        console.log("utente: ", user);
      })
      .catch((error) => {
        console.error("errore nel login", error);
      });
  };



  //Metodo collegamento alla privacy
// è obbligatorio per legge
  const openTerms = () => {
    const url = 'http://www.google.com'
    //Verifica se l'url è disponibile e funzionante
    Linking.canOpenURL(url)
      .then((supported)=> {
        if (supported) {
      //Apre l'url
  Linking.openURL(url)
        } else {
          console.log('link impossibile da raggiungere')
}
      })
  }

  useEffect(() => {
    if (nome !== "" && cognome !== "" && email !== "" && password !== "" ) {
      if (!isValidEmail(email)) {
        console.log("la email inserita non è valida");
        setErrorMessage("la email inserita non è valida");
      } else {
        if (!isValidPassword(password)) {
          console.log("la password inserita non è valida");
          setErrorMessage(
            "la password deve  contenere almeno 1 maiuscola, 1 minuscola, un numero ed un carattere speciale"
          );
        } else {
          console.log("la password inserita è valida");
          if (password !== ripetiPassword) {
            console.log("le password non combaciano");
            setErrorMessage("la password inserita è valida");
            setIsButtonEnabled(false);
          } else {
            if (isChecked === false) {
              setErrorMessage("le condizioni non sono accettate")
              setIsButtonEnabled(false)
            } else {
              setIsButtonEnabled(true);
              setErrorMessage("");
            }
          }
        }
      }
    } else {
      console.log("pulsante disabilitato a causa di errori");
      setIsButtonEnabled(false);
    }
  }, [nome, cognome, email, password, ripetiPassword, isChecked]);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* container grosso */}
        <ThemedView style={styled.container}>
          {/* container del form */}
          <ThemedView style={styled.containerForm}>
            {/* input */}
            {registrazione && (
              <>
                <TextInput
                  style={styled.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome"
                />
                <TextInput
                  style={styled.input}
                  value={cognome}
                  onChangeText={setCognome}
                  placeholder="Cognome"
                />
              </>
            )}

            <TextInput
              style={styled.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />

            <ThemedView style={styled.containerPassword}>
              <TextInput
                style={styled.inputPassword}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styled.iconEye}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </ThemedView>
            {/* <ThemedView style={styled.containerPassword}>
              <TextInput
                style={styled.inputPassword}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styled.iconEye}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </ThemedView> */}
            {registrazione && (
              <>
                <ThemedView style={styled.containerPassword}>
                  <TextInput
                    style={styled.inputPassword}
                    placeholder="Ripeti Password"
                    value={ripetiPassword}
                    onChangeText={setRipetiPassword}
                    secureTextEntry={!passwordVisible}
                  />
                  {/* <TouchableOpacity style={styled.iconEye} onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color='gray' />
                                </TouchableOpacity> */}
                </ThemedView>
                <ThemedView style={styled.containerPrivacy}>
                  <Checkbox
                    style={styled.checkbox}
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={"grey"}
                  />
                  <ThemedText>Accetto i <TouchableOpacity onPress={() => {openTerms}}><ThemedText style={styled.link}>Termini</ThemedText></TouchableOpacity> e condizioni</ThemedText>
                </ThemedView>
              </>
            )}
            {/* container dei bottoni */}
          </ThemedView>
          <ThemedView style={styled.containerBtn}>
            {!registrazione && (
              <>
                <TouchableOpacity style={styled.btn} onPress={handleSignIn}>
                  <ThemedText style={styled.textBtn}>Accedi</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styled.text}>
                  Se non sei registrato, clicca qui per <TouchableOpacity onPress={() => setRegistrazione(true)}>
<ThemedText style={[styled.textGrass, styled.link]}>
                      registrarti
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedText>
              </>
            )}

            {registrazione && (
              <>
                <ThemedText>{errorMessage}</ThemedText>
                <TouchableOpacity
                  style={[styled.btn, { opacity: isButtonEnabled ? 1 : 0.3 }]}
                  onPress={handleCreateAccount}
                  disabled={!isButtonEnabled}
                >
                  <ThemedText style={styled.textBtn}>Registrati</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styled.text}>
                  Se sei già registrato, clicca qui per <TouchableOpacity onPress={() => setRegistrazione(false)}>
                    <ThemedText style={[styled.textGrass, styled.link]}>
                      accedere
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedText>
              </>
            )}
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </>
  );
}

//Guarda da danilo
const styled = StyleSheet.create({
  //STILI CONTAINER
  container: {
    backgroundColor: "#d0d0",
    flex: 1,
    justifyContent: "center",
  },

  containerForm: {
    backgroundColor: "#d0d0",
    marginLeft: 25,
    marginRight: 25,
  },

  containerBtn: {
    backgroundColor: "#d0d0",
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
  },

  containerPassword: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: null,
    height: "auto",
    padding: 0,
  },

  //STILI TEXT
  textBtn: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: 600,
  },

  text: {
    textAlign: "center",
    marginTop: 10,
  },

  textGrass: {
    fontWeight: "bold",
    marginTop: 3,
  },

  //STILI BOTTONI
  btn: {
    backgroundColor: "#edd81a",
    marginTop: 10,
    borderRadius: 5,
    height: 40,
  },

  //STILI INPUT
  input: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 14,
  },

  inputPassword: {
    borderWidth: 0,
    backgroundColor: "white",
    padding: 13,
    marginTop: 10,

    borderRadius: 4,
    width: "100%",
  },

  iconEye: {
    position: "absolute",
    right: 20,
    top: 18,
  },

  containerPrivacy: {
    backgroundColor: null,
    flexDirection: "row",
    alignItems: "baseline",
  },

  checkbox: {
    marginTop: 15,
    marginRight: 10,
  },

  link: {
    fontWeight: "bold",
    marginTop: 4,
  },
});




//colore del grigio lightgrey o d0d0



//in firebase quando si fa la registrazione offre un provider che lo aggiunge al suo interno, da un indentificatore univoco, specifica quale provider viene utilizzato e quando è avvenuta la registrazione, ancora prima di metterli nel database