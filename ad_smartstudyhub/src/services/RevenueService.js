import getRole from "./RoleService";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/admin/revenue";

const statisticalRevenue = async (type, year, month) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(
        `${uri}/statistical?typeQuery=${type}&year=${year}&month=${month}`,
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

export { statisticalRevenue };
