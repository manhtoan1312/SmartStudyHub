const uri="http://192.168.11.1:8080/mobile/v1/auth"

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
        console.log(response.status)
        if (response.status === 200) {
          const data = await response.json();
          
          console.log(data)
          return { success: true, message: data.meta.message, token: data.data.token };
        } else {
          const data = await response.json();
          console.log(data)
          return { success: false, message: data.message };
        }
      } catch (err) {
        console.log(err);
        return { success: false, message: "Client Error" };
      }
}

const register = async (first,last, email, password) => {
    try {
        const response = await fetch(`${uri}/register`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: first,
            lastName:last,
            email: email,
            password: password,
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
}

export  {login, register}
