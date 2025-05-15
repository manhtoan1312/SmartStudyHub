import getRole from "../RoleService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/bot";
const SendMessage = async (message) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;
      const response = await fetch(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/bot/chat`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(message),
        }
      );

      const data = await response.json();
      console.log(data)
      if (response.status === 200) {
        return { success: true, data: data.data.choices };
      } else {
        if (response.status === 500) {
          return {
            success: false,
            message: "Token has expired, please log in again",
          };
        }
        return { success: false, message: "Unexpected error occurred" };
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

const GetMessage = async () => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;
      const response = await fetch(
        `https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/bot/get-messages`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

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
        return { success: false, message: "Unexpected error occurred" };
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

export { SendMessage, GetMessage };
