import axios from "axios";
import getRole from "./RoleService";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/admin/user";

const createUser = async (
  userName,
  firstName,
  lastName,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  country,
  imageUrl,
  role
) => {
  try {
    console.log(
      userName,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      dateOfBirth,
      country,
      imageUrl,
      role
    );
    const adRole = await getRole();
    if (adRole) {
      const { token } = adRole;
      const response = await axios.post(
        `${uri}/create`,
        {
          userName,
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
          dateOfBirth,
          country,
          imageUrl,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response;
      console.log(data);
      if (response.status === 200) {
        return {
          success: true,
          message: data.data.meta.message,
        };
      }
    } else {
      return { success: false, message: "Token not found, please login again" };
    }
  } catch (err) {
    const data = err?.response?.data;
    return {
      success: false,
      message: data?.logInfo
        ? data?.logInfo
        : "Wrong token, please login again",
    };
  }
};

const updateUser = async (
  id,
  userName,
  firstName,
  lastName,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  country,
  imageUrl,
  role
) => {
  try {
    const adRole = await getRole();
    if (adRole) {
      const { token } = adRole;
      const response = await axios.put(
        `${uri}/update`,
        {
          id,
          userName,
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
          dateOfBirth,
          country,
          imageUrl,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (response.status === 200) {
        return {
          success: true,
          message: data.meta.message,
        };
      } else {
        return {
          success: false,
          message: data.meta.message,
        };
      }
    } else {
      return { success: false, message: "Token not found, please login again" };
    }
  } catch (err) {
    const data = err?.response;
    return {
      success: false,
      message: data?.meta?.message
        ? data?.meta?.message
        : "Wrong token, please login again",
    };
  }
};

const markUser = async (userId, status) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await axios.put(
        `${uri}/markstatus`,
        {
          id: userId,
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (response.status === 200) {
        return {
          success: true,
          message: data.meta.message,
        };
      } else {
        return {
          success: false,
          message: data.meta.message,
        };
      }
    } else {
      return { success: false, message: "Token not found, please login again" };
    }
  } catch (err) {
    const data = err?.response;
    return {
      success: false,
      message: data?.meta?.message
        ? data?.meta?.message
        : "Wrong token, please login again",
    };
  }
};

const getAllUser = async (page, size) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await axios.get(
        `https://api-smart-study-hub.onrender.com/mobile/v1/admin/user/getall?page=${page}&size=${size}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response;
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      }
    } else {
      return {
        success: false,
        message: "Token not found or expired, please login again",
      };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.data.message,
      };
    }
    return { success: false, message: "Wrong token, please login again" };
  }
};

const permanentlyDeleted = async (userId) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await axios.delete(`${uri}/delete/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (response.status === 200) {
        return {
          success: true,
          message: data.meta.message,
        };
      } else {
        return {
          success: false,
          message: data.meta.message,
        };
      }
    } else {
      return {
        success: false,
        message: "Token not found or expired, please login again",
      };
    }
  } catch (err) {
    const data = err?.response;
    return {
      success: false,
      message: data?.meta?.message
        ? data?.meta?.message
        : "Wrong token, please login again",
    };
  }
};

const SearchUser = async (key) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await axios.get(`${uri}/search?key=${key}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = response;
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      }
    } else {
      return {
        success: false,
        message: "Token not found or expired, please login again",
      };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.data.message,
      };
    }
    return { success: false, message: "Wrong token, please login again" };
  }
};

const AdminUploadFile = async (file, type, id) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", type);
      formData.append("userId", id);

      const response = await axios.post(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return { success: true, data: response.data.data.stringType };
      } else {
        return { success: false, message: response.data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    const data = err?.response;
    return {
      success: false,
      message: data?.meta?.message
        ? data?.meta?.message
        : "Wrong token, please login again",
    };
  }
};

const GetUserDetailById = async (id) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await axios.get(`${uri}/get/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = response;
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      }
    } else {
      return {
        success: false,
        message: "Token not found or expired, please login again",
      };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.data.message,
      };
    }
    return { success: false, message: "Wrong token, please login again" };
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
      const response = await fetch(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/update-info`,
        {
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
        }
      );

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

const getUserInfor = async () => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const response = await fetch(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/get-info`,
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

const StatisticalRole = async (type, year, month, day) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(
        `${uri}/statistical-register?type=${type}&year=${year}&month=${month}&day=${day}`,
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

export {
  createUser,
  updateUser,
  markUser,
  permanentlyDeleted,
  getAllUser,
  SearchUser,
  AdminUploadFile,
  GetUserDetailById,
  getUserInfor,
  updateInformation,
  StatisticalRole,
};
