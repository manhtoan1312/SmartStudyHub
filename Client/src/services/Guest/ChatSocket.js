const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/chatmessage";

export const getChat = async (page, size) => {
  try {
    const response = await fetch(`${uri}/get?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      if (data.meta.code === "13_2_f") {
        return { success: true, data: [] };
      } else {
        return { success: true, data: data.data };
      }
    } else {
      return { success: false, message: data.meta?.message || "Unknown error" };
    }
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "Client Error" };
  }
};
