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
      const response = await fetch(`${uri}/update`, {
        method: "put",
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
  
  const getEventDetail = async (
    id
  ) => {
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
  
  const deleteEvent = async (
    id
  ) => {
    try {
      const response = await fetch(`${uri}/delete/${id}`, {
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

  const getTimeLineEvent = async (
    id, startDate, endDate
  ) => {
    try {
      const response = await fetch(`${uri}/get-time-line?userId=${id}&startDate=${startDate}&endDate=${endDate}`, {
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