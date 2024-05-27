const uri = 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest'
const getAllThemeOfGuest = async () => {
    try {
        const response = await fetch(`${uri}/theme/get`, {
          method: "get",
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

const getAllSoundDoneOfGuest =async  () => {
  try {
    const response = await fetch(`${uri}/sounddone/get`, {
      method: "get",
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

const getAllSoundConcentrationOfGuest =async  () => {
  try {
    const response = await fetch(`${uri}/soundconcentration/get`, {
      method: "get",
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

const getDataInApp =async  (id) => {
  try {
    const response = await fetch(`${uri}/get-data/${id}`, {
      method: "get",
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

export {getAllThemeOfGuest, getAllSoundConcentrationOfGuest, getAllSoundDoneOfGuest, getDataInApp}