import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (value, key) => {
  try {
    // console.log(value);
    // console.log(key);
    // await AsyncStorage.clear();
    await AsyncStorage.setItem(key, JSON.stringify(value));
    // alert("Data successfully saved");
  } catch (e) {
    // alert("Failed to save the data to the storage");
  }
};

export const saveDataString = async (value, key) => {
  try {
    // console.log(value);
    // console.log(key);
    // await AsyncStorage.clear();
    await AsyncStorage.setItem(key, value);
    // alert("Data successfully saved");
  } catch (e) {
    // alert("Failed to save the data to the storage");
  }
};

// export const readData = async (key) => {
//   try {
//     const docsDateJSON = await AsyncStorage.getItem(key);
//     const docsDate = jsonValue != null ? JSON.parse(docsDateJSON) : null;
//     console.log("Common: " + docsDate);
//     return docsDate;
//   } catch (e) {
//     alert("Failed to fetch the data from storage");
//   }
// };
