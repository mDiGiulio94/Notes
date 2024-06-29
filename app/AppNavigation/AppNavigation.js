//Import librerie
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";

//import navigazione
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//autenticazione firebase
import { auth } from "../Firebase";

//Import che controlla il cambio di stato de auth (autenticato o no)
import { onAuthStateChanged } from "firebase/auth";

//Import componenti
import Footer from "../Components/Footer";
import Header from "../Components/Header";

// Import Screens
import Home from "../Home";
import Note from "../Note";
import CreateNote from "../CreateNote";
import Login from "../Login";

//Impostazine della navigazione
const Stack = createNativeStackNavigator();

export default function AppNavigation({ StatiGlobali }) {
  //Variabili di stato
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);

  //Use-EFFECT
  useEffect(() => {
    //onAuthStateChaged è un listener
    const unsubscibe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscibe; //clean up per rimuovere il listener, se l'utente è loggato non richiede di loggare di nuovo
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "yellow" }}>
      <Header StatiGlobali={StatiGlobali} />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* se loggato mostro questo  */}
        {user ? (
          <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home">
                {(props) => <Home {...props} StatiGlobali={StatiGlobali} />}
              </Stack.Screen>
              <Stack.Screen name="Note">
                {(props) => <Note {...props} StatiGlobali={StatiGlobali} />}
              </Stack.Screen>
              <Stack.Screen name="CreateNote">
                {(props) => <CreateNote {...props} StatiGlobali={StatiGlobali} />}
              </Stack.Screen>
            </Stack.Navigator>
            <Footer />
          </>
        ) : (
          // se non loggato questo
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Login" component={Login} /> */}
            <Stack.Screen name="Login">
              {(props) => <Login {...props} StatiGlobali={StatiGlobali} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </ThemeProvider>
    </SafeAreaView>
  );
}

/*
Colore Status Bar

la status bar può essere importata direttamente da react native, tuttavia la 
safeAreaView potrebbe inibire la statusbar, ma siccome ci gestisce tutto in IOS gestisce tutto lei


*/
