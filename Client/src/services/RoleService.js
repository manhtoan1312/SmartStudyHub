import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

async function getRole() {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const subArray = decodedToken.sub.split("-");
      const id = subArray[0];
      const email = subArray[1];
      const name = subArray[3];
      const role = decodedToken.Role;
      const userInfo = { id, email, name, role, token };
      return userInfo;
    }
    else {
      return null
    }
  } catch (error) {
    return null;
  }
}


export default getRole;
