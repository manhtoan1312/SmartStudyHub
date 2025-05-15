import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../RoleService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/event";

const CreateEvent = async (
  userId,
  eventName,
  startTime,
  endTime,
  isAllDay,
  place,
  typeRemindered,
  dateRemindered,
  colorCode,
  descriptions,
  isPresent
) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        startTime,
        endTime,
        isAllDay,
        place,
        typeRemindered,
        dateRemindered,
        colorCode,
        descriptions,
        isPresent,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const UpdateEvent = async (
  id,
  eventName,
  startTime,
  endTime,
  isAllDay,
  place,
  typeRemindered,
  dateRemindered,
  colorCode,
  descriptions,
  isPresent
) => {
  try {
    const response = await fetch(`${uri}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        eventName,
        startTime,
        endTime,
        isAllDay,
        place,
        typeRemindered,
        dateRemindered,
        colorCode,
        descriptions,
        isPresent,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const getEventDetail = async (id) => {
  try {
    const response = await fetch(`${uri}/get/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${uri}/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const getTimeLineEvent = async (startDate, endDate) => {
  try {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await fetch(
      `${uri}/get-time-line?userId=${id}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

export {
  CreateEvent,
  UpdateEvent,
  getEventDetail,
  deleteEvent,
  getTimeLineEvent,
};
