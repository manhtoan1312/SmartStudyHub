import getRole from "../RoleService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/work";

const RepeatWork = async (id) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(`${uri}/repeat?workId=${id}`, {
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


export default RepeatWork;