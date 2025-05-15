import getRole from "../RoleService";

const DeleteAllFileByType = async (type) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/files/delete-completely-all?type=${type}`,
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

export default DeleteAllFileByType;