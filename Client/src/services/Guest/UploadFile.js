const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/customer/files";
const UploadAvt = async (file) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;
      const formData = new FormData()
      formData.append("files", file);
      formData.append("type", "USER");

      const response = await fetch(`${uri}/upload`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
