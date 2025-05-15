const uri = 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/historydaily'
const getHistoryDaily = async (userId, page, size) => {
    try {
        const response = await fetch(`${uri}/get/${userId}?page=${page}&size=${size}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          }
        });
    
        const data = await response.json();
        if (response.status === 200) {
          if(data.meta.code==="14_1_f"){
            return { success: false, message: data.meta.message };
          }
          else{
            return {success:true, data:data.data}
          }
        } else {
          return { success: false, message: data.meta.message };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Client Error" };
      }
}

const deleteHistory =async (id) => {
  try {
    const response = await fetch(`${uri}/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      }
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
}

const deleteAllHistory =async (id) => {
    try {
      const response = await fetch(`${uri}/delete?userId=${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        }
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
  }

export {getHistoryDaily, deleteAllHistory, deleteHistory}