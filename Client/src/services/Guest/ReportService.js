const uri =
  "https://api-smart-study-hub.onrender.com/mobile/v1/user/guest/report";

const CreateReport = async (id, report) => {
  try {
    const response = await fetch(`${uri}/create?userId=${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...report,
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

const GetReportList = async (id, page, size) => {
  try {
    const response = await fetch(
      `${uri}/get-by-user/${id}?page=${page}&size=${size}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

const GetReportDetail = async (id) => {
  try {
    const response = await fetch(`${uri}/get/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
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

export { CreateReport, GetReportList, GetReportDetail };
