const uri= 'https://api-smart-study-hub.onrender.com/mobile/v1/user/guest';
const rankByFocusAllTime = async  (id) => {
    try {
        const response = await fetch(`${uri}/rank-by-focus-all-time?userId=${id}`, {
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

const rankByFocusPreviousMonth = async  (id) => {
    try {
        const response = await fetch(`${uri}/rank-by-focus-previous-month?userId=${id}`, {
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

export {rankByFocusAllTime, rankByFocusPreviousMonth}