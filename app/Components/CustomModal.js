import React from "react";
import { StyleSheet, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const CustomModal = ({ isVisible, onConfirm, onCancel, item }) => {
    return (
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={onCancel}
        >
          <ThemedView style={styled.containerView}>
            <ThemedView style={styled.modalView}>
              <ThemedText>
                {item?.titolo
                  ? 'Sei sicuro di voler eliminare la seguente nota: "' +
                    item?.titolo +
                    '"'
                  : "Sei sicuro di voler uscire dall'app"}
                ?
              </ThemedText>

              <ThemedView style={styled.btnContainer}>
                <TouchableOpacity
                  style={[styled.button, styled.btnCancella]}
                  onPress={onCancel}
                >
                  <ThemedText style={styled.textStyle}>Annulla</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styled.button, styled.btnConfirm]}
                  onPress={item?.titolo ? () => onConfirm(item) : onConfirm}
                >
                  <ThemedText style={styled.textStyle}>
                    {item?.titolo ? "Elimina " : "Esci"}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      </>
    );
}

export default CustomModal

const styled = StyleSheet.create({
  //CONTENITORI
  containerView: {
    flex: 1,
    backgroundColor: "black",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "70%",
    borderRadius: 10,
    margin: "auto",
    alignItems: "center",
    padding: 20,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  //----------------------------------------------
  //BOTTONI
  button: {
    width: 100,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  btnCancella: {
    backgroundColor: "grey",
  },

  btnConfirm: {
    backgroundColor: "#e2cc00",
  },
  //-----------------------------------------------------
  //TESTI
  modalText: {
    fontWeight: "bold",
  },

  textStyle: {
    padding: 5,
    color: "white",
    fontWeight: "600",
  },
});