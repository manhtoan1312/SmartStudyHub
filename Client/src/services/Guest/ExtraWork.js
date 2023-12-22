const uri = 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/extrawork'

const CreateExtraWork = async (workId, extraWorkName) => {
    try {
      const response = await fetch(`${uri}/create`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            workId, extraWorkName
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

  const UpdateExtraWork = async (id, workId, extraWorkName, status) => {
    try {
      const response = await fetch(`${uri}/update`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id, workId, extraWorkName, status
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

  const ExtraMarkCompleted = async (id) => {
    try {
      const response = await fetch(`${uri}/mark-completed?extraWorkId=${id}`, {
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

  const DeleteExtraWork = async (id) => {
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

  const MarkDelete = async (id) => {
    try {
      const response = await fetch(`${uri}/mark-deleted/${id}`, {
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

  const RecoverExtraWork = async (id) => {
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

  export {CreateExtraWork, UpdateExtraWork, ExtraMarkCompleted, DeleteExtraWork, MarkDelete, RecoverExtraWork}

  