import axios from 'axios';
import getRole from './RoleService';
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
          "Authorization": `Bearer ${token}`,
        }
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
    return { success: false, message: data?.meta?.message ? data?.meta?.message : "Wrong token, please login again"};
  }
};


export default uploadFile;