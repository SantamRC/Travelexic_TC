import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MaterialButtonHamburger from "./components/MaterialButtonHamburger1";

function Index(props) {
  return (
    <View style={styles.container}>
      <MaterialButtonHamburger
        style={styles.materialButtonHamburger}
      ></MaterialButtonHamburger>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36
  },
  materialButtonHamburger: {
    height: 36,
    width: 36
  }
});

export default Index;
