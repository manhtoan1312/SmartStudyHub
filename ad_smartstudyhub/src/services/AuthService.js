import axios from "axios";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/auth";

const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${uri}/authenticate`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { status, data } = response;
    if (status === 200) {
      return {
        success: true,
        message: data.meta.message,
        token: data.data.token,
        image: data.data.imageUrl,
      };
    }
  } catch (err) {
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.meta.message,
      };
    }
    return { success: false, message: "Client Error" };
  }
};

const resendOTP = async (email) => {
  try {
    const response = await axios.post(
      `${uri}/resendotp`,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (response.status === 200) {
      return { success: true, message: data.meta.message, data: data.data };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.meta.message,
      };
    }
    return { success: false, message: "Client Error" };
  }
};

const checkEmail = async (email) => {
  try {
    const response = await axios.post(
      `${uri}/check-email-exist`,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (response.status === 200) {
      return { success: true, message: data.meta.message };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.meta.message,
      };
    }
    return { success: false, message: "Client Error" };
  }
};

const forgotPassword = async (email, password, otpCode) => {
  try {
    const response = await axios.post(
      `${uri}/forgot-password`,
      {
        email,
        password,
        otpCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (response.status === 200) {
      return { success: true, message: data.meta.message };
    } else {
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: data.meta.message,
      };
    }
    return { success: false, message: "Client Error" };
  }
};

export { login, checkEmail, resendOTP, forgotPassword };
