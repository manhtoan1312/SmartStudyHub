const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/statistical";
const statisticalTimeFocus = async (startDate, endDate, userId, type) => {
  try {
    const response = await fetch(
      `${uri}/time-focus?startDate=${startDate}&endDate=${endDate}&userId=${userId}&type=${type}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      if (data.metacode === "15_1_f") {
        return { success: true, data: [] };
      }
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const statisticalWorks = async (startDate, endDate, userId, type) => {
  try {
    const response = await fetch(
      `${uri}/work-completed?startDate=${startDate}&endDate=${endDate}&userId=${userId}&type=${type}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      if (data.metacode === "15_3_f") {
        return { success: true, data: [] };
      }
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const statisticalWorksByUnit = async (startDate, endDate, userId, unit) => {
  try {
    const response = await fetch(
      `${uri}/time-focus-by-work?startDate=${startDate}&endDate=${endDate}&userId=${userId}&unit=${unit}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      if (data.meta.code === "15_2_f") {
        return { success: true, data: null };
      }
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

export { statisticalTimeFocus, statisticalWorks, statisticalWorksByUnit };
