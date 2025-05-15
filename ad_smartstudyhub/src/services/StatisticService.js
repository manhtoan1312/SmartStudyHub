import getRole from "./RoleService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/admin/user/statistic";

const StatisticUserRegisterByDate = async (from, to) => {
  try {
    const role = await getRole();

    if (role) {
      const { token } = role;

      const response = await fetch(
        `${uri}/registered-by-date-range?dateFrom=${from}&dateTo=${to}`,
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

const StatisticUserRegisterByMonth = async (from, to) => {
  try {
    const role = await getRole();
    if (role) {
      const { token } = role;

      const response = await fetch(
        `${uri}/registered-by-month-range?dateFrom=${from}&dateTo=${to}`,
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

export { StatisticUserRegisterByDate, StatisticUserRegisterByMonth };
