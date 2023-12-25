const uri = 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/report'

const CreateReport = async (id, email, phoneNumber, title, content, typeReport, urlFile) => {
    try {
      const response = await fetch(`${uri}/create?userId=${id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email, phoneNumber, title, content, typeReport, urlFile
        }),
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
  };


  export {CreateReport}