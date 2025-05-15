import axios from "axios";
import getRole from "./RoleService";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/admin/files";
const uploadFile = async (file, type) => {
  try {
    console.log(file)
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", type);

      const response = await axios.post(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/files/upload`,
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
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
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

const GetAllFileUploadByUser = async ({
  page,
  size,
  userId,
  startDate,
  endDate,
  fileType,
  fieldSort,
  sortType,
}) => {
  try {
    let url = `${uri}/getofuser?`;
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
    if (fieldSort) {
      url += `fieldSort=${fieldSort}&`;
    }
    if (sortType) {
      url += `sortType=${sortType}&`;
    }
    url += `page=${page}&size=${size}`;
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

      const data = await response.json();
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
          totalPage: data.extendProp.totalPages,
        };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
    return { success: false, message: "Token has expired, please log in again" };
  }
};

const DeleteFile = async (id) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(`${uri}/delete/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        return { success: true, data: data.data };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

const uploadSystemFile = async (file, type, status) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", type); 
      formData.append("statusFile", status);
      const response = await axios.post(`https://api-smart-study-hub.onrender.com/mobile/v1/user/admin/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      if (response.status === 200) {
        return { success: true, data: response.data.data.stringType };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: response.data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err)
    const data = err?.response;
    return {
      success: false,
      message: data?.data?.meta?.message
        ? data?.data?.meta?.message
        : "Wrong token, please login again",
    };
  }
};


const CreateOrUpdateFile = async (id, name, type, status, url) => {
  try {
    const role = await getRole();
    console.log(id, name, type, status, url)
    if (role) {
      const { token } = role;

      const body = {
        name,
        type,
        status,
        url,
      };

      if (id !== null) {
        body.id = id;
      }

      const response = await fetch(`${uri}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200) {
        return { success: true, data: data.data };
      } else if (response.status === 500) {
        return {
          success: false,
          message: "Token has expired, please log in again",
        };
      } else {
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error during the request:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};

const GetAllSystemFile = async ({
  page,
  size,
  fileType,
  fieldSort,
  sortType,
}) => {
  try {
    let url = `${uri}/getthemeandsound?`;
    if (fileType) {
      url += `fileType=${fileType}&`;
    }
    if (fieldSort) {
      url += `fieldSort=${fieldSort}&`;
    }
    if (sortType) {
      url += `sortType=${sortType}&`;
    }
    url += `page=${page}&size=${size}`;
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

      const data = await response.json();
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
          totalPage: data.extendProp.totalPages,
        };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

const StatisticalUserUploadFile = async ({
  userId,
  typeQuery,
  year,
  month,
}) => {
  try {
    let url = `${uri}/statistical?&typeQuery=${typeQuery}&year=${year}&month=${month}&`;
    if (userId!==null && userId !== "") {
      url += `userId=${userId}`;
    }
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

      const data = await response.json();
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

const GetDetailSystemFile = async (type, id ) => {
  try {
    let url = `${uri}/getthemeandsound/${type}/${id}`;
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

      const data = await response.json();
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

const DeleteSystemFile = async ( type, id ) => {
  try {
    let url = `${uri}/deletethemeandsound/${type}/${id}`;
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(url, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (error) {
    console.error("Error building URL:", error);
  }
};

export {
  uploadFile,
  GetAllFileUploadByUser,
  DeleteFile,
  uploadSystemFile,
  CreateOrUpdateFile,
  StatisticalUserUploadFile,
  GetAllSystemFile,
  GetDetailSystemFile,
  DeleteSystemFile,
};
