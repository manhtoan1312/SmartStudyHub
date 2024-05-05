const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/pomodoro";

const CreatePomodoro = async (
  userId,
  workId,
  extraWorkId,
  timeOfPomodoro,
  startTime,
  endTime
) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        workId,
        extraWorkId,
        timeOfPomodoro,
        startTime,
        endTime,
        isEndPomo: false,
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

const GetPomodoro = async (id) => {
  try {
    const response = await fetch(`${uri}/get?userId=${id}`, {
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

const DeletePomodoro = async (id) => {
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

export { CreatePomodoro, GetPomodoro, DeletePomodoro };
