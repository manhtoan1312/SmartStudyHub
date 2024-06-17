import getRole from "../RoleService";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/device";

const getIPAddress = async () => {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};

const detailedMapLocalizationToName = (locale) => {
  const localizationMap = {
    "vi-VN": "Vietnam",
    "en-US": "United States",
  };

  return localizationMap[locale] || locale;
};

const CreateOrUpdateDevice = async () => {
  try {
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      const { token } = role;
      const id = Device.osInternalBuildId || "unknown";
      const deviceName = Device.modelName;
      const deviceType = Device.osName;
      const ipAddress = await getIPAddress();
      const localization = Localization.locale;
      const detailLocation = detailedMapLocalizationToName(localization);
      const response = await fetch(`${uri}/create-update`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          deviceName,
          deviceType,
          ipAddress,
          location: detailLocation,
          status: "LOGIN",
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.meta.message };
      }
    } else {
      return {
        success: false,
        message: "You don't have permission to access this function",
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};

const CheckStatusDevice = async () => {
  try {
    const role = await getRole();
    const id = Device.osInternalBuildId || "unknown";
    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(`${uri}/get/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        if (data.meta.code === "16_5_f") return { success: false };
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.meta.message };
      }
    } else {
      return {
        success: false,
        message: "You don't have permission to access this function",
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};

const LogOut = async (ids) => {
  try {
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      const { token } = role;
      const response = await fetch(`${uri}/logout`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ids),
      });

      const data = await response.json();
      if (response.status === 200) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.meta.message };
      }
    } else {
      return {
        success: false,
        message: "You don't have permission to access this function",
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};

const DeleteDevice = async (id) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(`${uri}/delete`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
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
      return {
        success: false,
        message: "You don't have permission to access this function",
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};
const GetDevices = async () => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(`${uri}/get`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data: data.data };
      } else {
        const data = await response.json();
        return { success: false, message: data.meta.message };
      }
    } else {
      return {
        success: false,
        message: "You don't have permission to access this function",
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};

export {
  CreateOrUpdateDevice,
  CheckStatusDevice,
  DeleteDevice,
  GetDevices,
  LogOut,
};
