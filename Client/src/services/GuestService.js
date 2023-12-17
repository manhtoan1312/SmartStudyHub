import AsyncStorage from "@react-native-async-storage/async-storage";

const uri = 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest'

const CreateGuest = async () => {
    try {
      const response = await fetch(`${uri}/create`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        await AsyncStorage.setItem('id', String(data.data.id));
        await AsyncStorage.setItem('img', data.data.imageUrl)
        return { success: true, message: data.meta.message };
      } else {
        return { success: false, message: data.data.message };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Client Error!!" };
    }
  };


  const DeleteGuest = async (id) => {
    try {
      const response = await fetch(`${uri}/delete/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        return { success: true, message: data.meta.message };
      } else {
        return { success: false, message: data.meta.message };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Client Error!!" };
    }
  };

  const recoverAccount = async (id) => {
    try {
      const response = await fetch(`${uri}/recover-account`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          id:id
        })
      });
      const data = await response.json();
      if (response.status === 200) {
        return { success: true, message: data.meta.message };
      } else {
        return { success: false, message: data.data.message };
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: "Client Error!!" };
    }
  }

  export { CreateGuest, DeleteGuest, recoverAccount}