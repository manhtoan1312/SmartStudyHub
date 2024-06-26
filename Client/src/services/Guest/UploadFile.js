import getRole from "../RoleService";
const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/files";
const UploadAvt = async (file, roleU) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", roleU);
      const response = await fetch(`${uri}/upload`, {
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true, data: data.data.stringType };
      } else {
        const data = await response.json();
        return { success: false, message: data.meta.message };
      }
    } else {
      return { success: false, message: "Token not found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Wrong token" };
  }
};

const UploadReportFile = async (file, id) => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("type", "REPORT");
    formData.append("userId", String(id));
    const response = await fetch(
      `https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/files/upload`,
      {
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data: data.data.stringType };
    } else {
      const data = await response.json();
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const DeleteAllAvatar = async (type) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(
        `${uri}/delete-completely-all?type=${type}`,
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
export { UploadAvt, UploadReportFile, DeleteAllAvatar };
