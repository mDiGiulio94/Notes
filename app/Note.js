import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Image} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


export default function Note( props ) {

  const { note } = props.StatiGlobali;

  return (
    <ThemedView style={styled.container}>
      <ThemedView style={styled.containerNota}>
        {note.imageUrl && (
          <Image source={{ uri: note.imageUrl }} style={styled.image} />
        )}
        <ThemedText style={styled.containerNota.titolo}>
          {note.titolo}
        </ThemedText>
        <ScrollView>
          <ThemedText style={styled.container.testo}>{note.testo}</ThemedText>
        </ScrollView>
      </ThemedView>

    </ThemedView>
  );
}


const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    zIndex: 1,

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
    minheight: 400,
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
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "left",
    },
    testo: {
      fontSize: 12,
      textAlign: "justify",
      marginTop: 10,
    },
    },

  //immagine

  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  }

});