import axios from "axios";
import getRole from "./RoleService";
const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/files";
const uploadFile = async (file, type) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", type);

      const response = await axios.post(`${uri}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

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

const StatisticalFile = async ({
  userId,
  startDate,
  endDate,
  fileType,
  fieldSort,
  sortType,
  page,
  size,
}) => {
  try {
    let url = `https://api-smart-study-hub.onrender.com/mobile/v1/admin/files/getofuser?`;
    if (userId) {
      url += `userId=${userId}&`;
    }
    if (startDate) {
      url += `startDate=${startDate}&`;
    }
    if (endDate) {
      url += `endDate=${endDate}&`;
    }
    if (fileType) {
      url += `fileType=${fileType}&`;
    }
    if (fieldSort && sortType) {
      url += `fieldSort=${fieldSort}&sortType=${sortType}&`;
    }
    if (page) {
      url += `page=${page}&`;
    }
    if (size) {
      url += `size=${size}&`;
    }
    url = url.slice(0, -1);
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(url, {
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
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

export {uploadFile};
