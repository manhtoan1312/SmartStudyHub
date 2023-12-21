const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/work";

const CreateWork = async (
  userId,
  projectId,
  tags,
  workName,
  priority,
  dueDate,
  numberOfPomodoros,
  timeOfPomodoro,
  timeWillStart
) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        projectId,
        tags,
        workName,
        priority,
        dueDate,
        numberOfPomodoros,
        timeOfPomodoro,
        timeWillStart,
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

const UpdateWork = async (
  id,
  userId,
  projectId,
  tagId,
  workName,
  priority,
  dueDate,
  numberOfPomodoro,
  timeOfPomodoro,
  isRemindered,
  isRepeated,
  timePassed,
  note,
  startTime,
  endTime,
  numberOfPomodorosDone,
  status,
  assigneeId
) => {
  try {
    const response = await fetch(`${uri}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        userId,
        projectId,
        tagId,
        workName,
        priority,
        dueDate,
        numberOfPomodoro,
        timeOfPomodoro,
        isRemindered,
        isRepeated,
        timePassed,
        note,
        startTime,
        endTime,
        numberOfPomodorosDone,
        status,
        assigneeId,
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

const DeleteWork = async (id) => {
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

const DeleteWorkComplete = async (id) => {
  try {
    const response = await fetch(`${uri}/delete-completely/${id}`, {
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

const GetWorkByProjectAndStatus = async (status, userId) => {
  try {
    const response = await fetch(
      `${uri}/get-in-project?status=${status}&userId=${userId}`,
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

const GetDetailWork = async (id) => {
  try {
    const response = await fetch(`${uri}/get-detail?workId=${id}`, {
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
const MarkCompleted = async (id) => {
  try {
    const response = await fetch(`${uri}/mark-completed?workId=${id}`, {
      method: "put",
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

const RecoverWork = async (id) => {
  try {
    const response = await fetch(`${uri}/recover/${id}`, {
      method: "put",
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

const SearchByWorkName = async (integerType, stringType) => {
  try {
    const response = await fetch(`${uri}/search-by-name`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        integerType,
        stringType,
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

const GetWorkByType = async (type, id) => {
  try {
    const response = await fetch(
      `${uri}/get-by-type?type=${type}&userId=${id}`,
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

const GetWorkByPriority = async (type, id) => {
  try {
    const response = await fetch(
      `${uri}/get-by-priority?priority=${type}&userId=${id}`,
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

const GetWorkByDate = async (date, id) => {
  try {
    const response = await fetch(
      `${uri}/get-by-date?date=${date}&userId=${id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          integerType,
          stringType,
        }),
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

const GetWorkCompleted = async (id) => {
  try {
    const response = await fetch(
      `${uri}/get-work-completed?userId=${id}`,
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

const GetWorkDeleted = async (id) => {
  try {
    const response = await fetch(
      `${uri}/get-work-deleted?userId=${id}`,
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
  CreateWork,
  UpdateWork,
  DeleteWork,
  DeleteWorkComplete,
  GetWorkByProjectAndStatus,
  GetDetailWork,
  MarkCompleted,
  RecoverWork,
  SearchByWorkName,
  GetWorkByDate,
  GetWorkByPriority,
  GetWorkByType,
  GetWorkCompleted,
  GetWorkDeleted
};
