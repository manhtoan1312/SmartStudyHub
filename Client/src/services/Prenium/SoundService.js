const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/soundconcentration";

  const getAllSoundPrenium = async () => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PRENIUM") {
        const { token } = role;
  
        const response = await fetch(`${uri}/get`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          const data = await response.json();
          return { success: true, message: data.data };
        } else {
          const data = await response.json();
          return { success: false, message: data.meta.message };
        }
      } else {
        return {
          success: false,
          message: "You don't have permission to access this function",
        };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Wrong token" };
    }
  };
  
  const getAllSoundDelete = async () => {
      try {
        const role = await getRole();
    
        if (role && role.role === "PRENIUM") {
          const { token } = role;
    
          const response = await fetch(`${uri}/get-deleted`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
    
          if (response.status === 200) {
            const data = await response.json();
            return { success: true, message: data.data };
          } else {
            const data = await response.json();
            return { success: false, message: data.meta.message };
          }
        } else {
          return {
            success: false,
            message: "You don't have permission to access this function",
          };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Wrong token" };
      }
    };
  
  const addSound = async (nameSound, url) => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PRENIUM") {
        const { token } = role;
  
        const response = await fetch(`${uri}/insert`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nameSound,
            url,
          }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          return { success: true, message: data.meta.message };
        } else {
          const data = await response.json();
          return { success: false, message: data.meta.message };
        }
      } else {
        return {
          success: false,
          message: "You don't have permission to access this function",
        };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Wrong token" };
    }
  };
  
  const updateSound = async (id, nameSound, url) => {
      try {
        const role = await getRole();
    
        if (role && role.role === "PRENIUM") {
          const { token } = role;
    
          const response = await fetch(`${uri}/update`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id,
              nameSound,
              url,
            }),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            return { success: true, message: data.meta.message };
          } else {
            const data = await response.json();
            return { success: false, message: data.meta.message };
          }
        } else {
          return {
            success: false,
            message: "You don't have permission to access this function",
          };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Wrong token" };
      }
    };
  
    const markDeleteSound = async (id) => {
      try {
        const role = await getRole();
    
        if (role && role.role === "PRENIUM") {
          const { token } = role;
    
          const response = await fetch(`${uri}/mark-deleted/${id}`, {
            method: "delete",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
    
          if (response.status === 200) {
            const data = await response.json();
            return { success: true, message: data.meta.message };
          } else {
            const data = await response.json();
            return { success: false, message: data.meta.message };
          }
        } else {
          return {
            success: false,
            message: "You don't have permission to access this function",
          };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Wrong token" };
      }
    };
  
    const deleteSound = async (id) => {
      try {
        const role = await getRole();
    
        if (role && role.role === "PRENIUM") {
          const { token } = role;
    
          const response = await fetch(`${uri}/delete/${id}`, {
            method: "delete",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
    
          if (response.status === 200) {
            const data = await response.json();
            return { success: true, message: data.meta.message };
          } else {
            const data = await response.json();
            return { success: false, message: data.meta.message };
          }
        } else {
          return {
            success: false,
            message: "You don't have permission to access this function",
          };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Wrong token" };
      }
    };
  
    const recoverSound = async (id) => {
      try {
        const role = await getRole();
    
        if (role && role.role === "PRENIUM") {
          const { token } = role;
    
          const response = await fetch(`${uri}/recover/${id}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
    
          if (response.status === 200) {
            const data = await response.json();
            return { success: true, message: data.meta.message };
          } else {
            const data = await response.json();
            return { success: false, message: data.meta.message };
          }
        } else {
          return {
            success: false,
            message: "You don't have permission to access this function",
          };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Wrong token" };
      }
    };
    
  
    export {getAllSoundPrenium, getAllSoundDelete, addSound, updateSound, markDeleteSound, deleteSound,recoverSound}