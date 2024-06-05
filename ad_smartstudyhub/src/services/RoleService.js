import {jwtDecode} from "jwt-decode";

function getRole() {
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
  const remember = localStorage.getItem("rememberme") ? JSON.parse(localStorage.getItem("rememberme")) : false;

  let role = {
    isLogin: sessionStorage.getItem('isLogin') || false,
    rememberme: remember,
    token: token,
    role: null,
    name: null,
    email: null,
  };

  if ((!role.isLogin && !role.rememberme) || !role.token) {
    role.token = "";
    role.role = null;
    role.rememberme = false;
    role.name = null;
    role.email = null;
  }

  if (role.token) {
    try {
      const decode =jwtDecode(role.token);
      role.role = decode.Role;
      role.name = decode.sub.split("-")[3];
      role.email = decode.sub.split("-")[1];
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return role;
}

export default getRole;
