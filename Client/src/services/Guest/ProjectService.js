import { CreateGuest } from "../AccountService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/project";
const CreateProject = async (id, folderId, name, color, iconUrl) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        folderId: folderId,
        projectName: name,
        colorCode: color,
        iconUrl: iconUrl,
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

const UpdateProject = async (
  id,
  folderId,
  name,
  color,
  iconUrl,
  status,
  fId
) => {
  try {
    const response = await fetch(`${uri}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        projectName: name,
        colorCode: color,
        folderId: folderId,
        status: status,
        iconUrl: iconUrl,
        folderId: fId,
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

const DeleteProject = async (id) => {
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

const GetProjectByStatus = async (id, status) => {
  try {
    const response = await fetch(
      `${uri}/get-by-user-status?userId=${id}&status=${status}`,
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

const GetProjectForUpdate = async (id, folId) => {
  try {
    const response = await fetch(
      `${uri}/get-for-updating-folder?userId=${id}&folderId=${folId}`,
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

const CheckMaxProject = async (id) => {
  try {
    const response = await fetch(`${uri}/check-maximum-project`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, isMax: data.data.booleanType };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const GetProjectForAddFolder = async (id) => {
  try {
    const response = await fetch(`${uri}/get-for-add-folder?userId=${id}`, {
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

const GetDetailProject = async (id) => {
  try {
    const response = await fetch(`${uri}/get-detail?projectId=${id}`, {
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

const GetProjectActiveAndCompleted = async (id) => {
  try {
    const response = await fetch(
      `${uri}/get-active-and-completed?userId=${id}`,
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

const MarkCompleteProject = async (id) => {
  try {
    const response = await fetch(`${uri}/mark-completed/${id}`, {
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

const DeleteCompletelyProject = async (id) => {
  try {
    const response = await fetch(`${uri}/delete-completely/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.meta.message };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const DeleteAllProject = async (id) => {
  try {
    const response = await fetch(`${uri}/delete-completely-all/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.meta.message };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const RecoverProject = async (id) => {
  try {
    const response = await fetch(`${uri}/recover/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, data: data.meta.message };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const GetProjectCompletedNewVision = async (id) => {
  try {
    const response = await fetch(`${uri}/get-project-completed?userId=${id}`, {
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

export {
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetProjectByStatus,
  GetProjectForUpdate,
  CheckMaxProject,
  GetProjectForAddFolder,
  GetProjectActiveAndCompleted,
  MarkCompleteProject,
  GetDetailProject,
  DeleteCompletelyProject,
  RecoverProject,
  GetProjectCompletedNewVision,
  DeleteAllProject,
};
