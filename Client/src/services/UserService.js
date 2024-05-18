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
      console.log(token);
      const response = await fetch(`${uri}/delete`, {
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

const CheckPasswordCorrect = async (password) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(`${uri}/check-password-correct`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          success: data.data.booleanType,
          message: data.data.stringType,
        };
      } else {
        const data = await response.json();
        return { success: false, message: data.data.stringType };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const updateInformation = async (
  phoneNumber,
  firstName,
  lastName,
  address,
  dateOfBirth,
  country,
  imageUrl,
  isTwoFactor
) => {
  try {
    const role = await getRole();
    
    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/update-info`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          firstName,
          lastName,
          address,
          dateOfBirth,
          country,
          imageUrl,
          isTwoFactor,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, message: data.data };
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

const ChangeEmailUser = async (email, otpCode) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/change-email`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          otpCode,
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

const getUserInfor = async () => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/get-info`, {
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
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const CleanData = async () => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/cleandata`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
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

const deleteCurrentAvatar = async () => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/delete-current-avatar`, {
        method: "delete",
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
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const getAvtUploaded = async (type) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await fetch(
        `${uri}/files/get-files-uploaded-user?type=${type}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

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

const deleteCompletelyAvt = async (id) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;
      const response = await fetch(
        `${uri}/files/delete-completely-files-by-id/${id}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data: data.meta.message };
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

const deleteAvtUploaded = async (publicId) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;
      const response = await fetch(`${uri}/files/delete`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicId,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data: data.meta.message };
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

export {
  SendOTPChangePassword,
  changePassword,
  deleteAccount,
  CheckPasswordCorrect,
  updateInformation,
  ChangeEmailUser,
  getUserInfor,
  CleanData,
  deleteCurrentAvatar,
  getAvtUploaded,
  deleteCompletelyAvt,
  deleteAvtUploaded,
};
