import getRole from "./RoleService";

import axios from "axios";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/admin/report";


const GetAllReport = async (page, size) => {
    try {
      const role = await getRole();
      if (role) {
        const { token } = role;
        const response = await axios.get(
          `${uri}/get?page=${page}&size=${size}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response;
        if (response.status === 200) {
          return {
            success: true,
            data: data.data,
          };
        }
      } else {
        return {
          success: false,
          message: "Token not found or expired, please login again",
        };
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        const { data } = err.response;
        return {
          success: false,
          message: data.data.message,
        };
      }
      return { success: false, message: "Wrong token, please login again" };
    }
  };

  const GetReportDetail = async (id) => {
    try {
      const role = await getRole();
      if (role) {
        const { token } = role;
        const response = await axios.get(
          `${uri}/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response;
        if (response.status === 200) {
          return {
            success: true,
            data: data.data,
          };
        }
      } else {
        return {
          success: false,
          message: "Token not found or expired, please login again",
        };
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        const { data } = err.response;
        return {
          success: false,
          message: data.data.message,
        };
      }
      return { success: false, message: "Wrong token, please login again" };
    }
  };
  const UpdateReport = async (id) => {
    try {
      const role = await getRole();
  
      if (role) {
        const { token } = role;
  
        const response = await fetch(`${uri}/update/${id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          const data = await response.json();
          return { success: true, message: data.data.stringType };
        } else {
          const data = await response.json();
          return { success: false, message: data.meta.message };
        }
      } else {
        return { success: false, message: "Token not found" };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Client Error" };
    }
  };

  const DeleteReport = async (id) => {
    try {
      const role = await getRole();
  
      if (role) {
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
          return { success: true, message: data.data.stringType };
        } else {
          const data = await response.json();
          return { success: false, message: data.meta.message };
        }
      } else {
        return { success: false, message: "Token not found" };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Client Error" };
    }
  };


  export {GetAllReport, GetReportDetail, DeleteReport, UpdateReport}