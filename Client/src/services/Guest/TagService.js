const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/tag";

const CreateTag = async (userId, tagName, colorCode) => {
  try {
    const response = await fetch(`${uri}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        tagName,
        colorCode,
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

const UpdateTag = async (id, tagName, colorCode, status) => {
  try {
    const response = await fetch(`${uri}/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id, tagName, colorCode, status
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

const DeleteTag = async (id) => {
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

const GetTagDetail = async (id) => {
    try {
      const response = await fetch(`${uri}/detail?tagId=${id}`, {
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

  const GetAllTagOfUser = async (id) => {
    try {
      const response = await fetch(`${uri}/get-active?userId=${id}`, {
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

export { CreateTag, UpdateTag, DeleteTag, GetTagDetail, GetAllTagOfUser };
