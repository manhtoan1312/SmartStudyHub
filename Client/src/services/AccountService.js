import AsyncStorage from "@react-native-async-storage/async-storage";

const uri = "https://api-smart-study-hub.onrender.com/mobile/v1/auth";

const login = async (email, password) => {
  try {
    const response = await fetch(`${uri}/authenticate`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      await AsyncStorage.setItem("img", data.data.imageUrl);
      await AsyncStorage.setItem('accountName', `${data.data.lastName} ${data.data.firstName}`);
      return {
        success: true,
        message: data.meta.message,
        token: data.data.token,
      };
    } else {
      const data = await response.json();
      return { success: false, message: data.data.message, status:data.meta.code };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const register = async (first, last, email, password, otp, id) => {
  try {
    const response = await fetch(`${uri}/register`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: first,
        lastName: last,
        email: email,
        password: password,
        otpCode: otp,
        guestId: id
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.meta.message };
    } else {
      const data = await response.json();
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const AuthenToRecover = async (email, password) => {
  try {
    const response = await fetch(`${uri}/authenticate-to-recover`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.data };
    } else {
      const data = await response.json();
      return { success: false, message: data.meta.details };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const ResendOTP = async (email) => {
  try {
    const response = await fetch(`${uri}/resendotp`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.meta.message, data: data.data };
    } else {
      const data = await response.json();
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const Checkemail = async (email) => {
  try {
    const response = await fetch(`${uri}/check-email-exist`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.meta.message };
    } else {
      const data = await response.json();
      return { success: false, message: data.meta.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};

const ForgotPassword = async (email, password, otp) => {
  try {
    const response = await fetch(`${uri}/forgot-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        otpCode: otp,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, message: data.meta.message };
    } else {
      const data = await response.json();
      return { success: false, message: data.data.message };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Client Error" };
  }
};



export {
  login,
  register,
  AuthenToRecover,
  ResendOTP,
  Checkemail,
  ForgotPassword,
};
