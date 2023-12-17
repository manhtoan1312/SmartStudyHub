import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "./RoleService";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/user/customer";

const SendOTPChangePassword = async (email) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(`${uri}/otp-change-pass`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data: data.data };
      } else {
        const data = await response.json();
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const changePassword = async (email, password, otp) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(`${uri}/change-password`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
          otpCode: otp,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, message: data.meta.message };
      } else {
        const data = await response.json();
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const deleteAccount = async () => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;
      console.log(token)
      const response = await fetch(`${uri}/change-password`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        await AsyncStorage.clear();
        return { success: true, message: data.meta.message };
      } else {
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

export { SendOTPChangePassword, changePassword, deleteAccount };
