import { CreateGuest } from "../AccountService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/folder";
const CreateFolder = async (id, name, color, listProjectActive, iconUrl) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        folderName: name,
        colorCode: color,
        listProjectActive: listProjectActive,
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

const UpdateFolder = async (id, name, color, listProject, iconUrl) => {
  try {
    const response = await fetch(`${uri}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        folderName: name,
        colorCode: color,
        listProject: listProject,
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

const DeleteFolder = async (idUser, id, name, color, listProject, iconUrl) => {
  try {
    const response = await fetch(`${uri}/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idUser,
        folderName: name,
        colorCode: color,
        listProjectActive: listProject,
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

const GetAllFolder = async (id) => {
  try {
    const response = await fetch(`${uri}/get-by-user?userId=${id}`, {
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

const GetAllFolderDelete = async (id) => {
  try {
    const response = await fetch(`${uri}/get-deleted-by-user?userId=${id}`, {
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

const GetDetailFolder = async (id) => {
  try {
    const response = await fetch(`${uri}/get-detail?userId=${id}`, {
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

const CheckMaxFolder = async (id) => {
  try {
    const response = await fetch(`${uri}/check-maximum-folder`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        id: id
      })
    });

    const data = await response.json();
    if (response.status === 200) {
      return { success: true, isMax:data.data.booleanType };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
}


export {
  CreateFolder,
  UpdateFolder,
  DeleteFolder,
  GetAllFolderDelete,
  GetDetailFolder,
  GetAllFolder,
  CheckMaxFolder
};
