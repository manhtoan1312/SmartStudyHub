import getRole from "../RoleService";

const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/premium/theme";

const getAllThemePREMIUM = async () => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
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
        return { success: true, data: data.data };
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

const getAllThemeDelete = async () => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PREMIUM") {
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
          return { success: true,data: data.data };
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

const addTheme = async (nameTheme, url) => {
  try {
    const role = await getRole();

    if (role && role.role === "PREMIUM") {
      const { token } = role;

      const response = await fetch(`${uri}/insert`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nameTheme,
          url,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return { success: true,  data: data.data };
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

const updateTheme = async (id, nameTheme, url) => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PREMIUM") {
        const { token } = role;
  
        const response = await fetch(`${uri}/update`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            nameTheme,
            url,
          }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          return { success: true, data: data.data };
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

  const markDeleteTheme = async (id) => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PREMIUM") {
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
          return { success: true, data: data.data };
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

  const deleteTheme = async (id) => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PREMIUM") {
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
          return { success: true,  data: data.data };
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

  const recoverTheme = async (id) => {
    try {
      const role = await getRole();
  
      if (role && role.role === "PREMIUM") {
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
          return { success: true,  data: data.data };
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
  

  export {getAllThemePREMIUM, getAllThemeDelete, addTheme, updateTheme, markDeleteTheme, deleteTheme,recoverTheme}