import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetReportDetail, DeleteReport } from "~/services/ReportService";
import { Snackbar, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ReportDetail = () => {
  const [report, setReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetReportDetail(id);
      if (response.success) {
        setReport(response.data.data);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    setDialogOpen(false);
    const response = await DeleteReport(id);
    if (response.success) {
      setAlertSeverity("success");
      setAlertMessage("Report deleted successfully");
      setOpen(true);
      navigate("/report");
    } else {
      setAlertSeverity("error");
      setAlertMessage("Failed to delete the report");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Report Detail</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Title:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.title}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Description:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.descriptionDetail}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Email:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.email}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Phone Number:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.phoneNumber}</p>
        </div>
        {report.userWasReportedName && (
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Reported User:</h2>
            <p className="text-gray-700 dark:text-gray-300">{report.userWasReportedName}</p>
          </div>
        )}
        {report.whereProblemOccur && (
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Where Problem Occurred:</h2>
            <p className="text-gray-700 dark:text-gray-300">{report.whereProblemOccur}</p>
          </div>
        )}
        {report.howProblemAffect && (
          <div>
            <h2 className="text-lg font-semibold dark:text-white">How Problem Affects:</h2>
            <p className="text-gray-700 dark:text-gray-300">{report.howProblemAffect}</p>
          </div>
        )}
        {report.thingMostSatisfy && (
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Most Satisfying Thing:</h2>
            <p className="text-gray-700 dark:text-gray-300">{report.thingMostSatisfy}</p>
          </div>
        )}
        {report.thingToImprove && (
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Things to Improve:</h2>
            <p className="text-gray-700 dark:text-gray-300">{report.thingToImprove}</p>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold dark:text-white">What Help is Needed:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.whatHelp}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Created Date:</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {new Date(report.createdDate).toLocaleString()}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Type of Report:</h2>
          <p className="text-gray-700 dark:text-gray-300">{report.typeReport}</p>
        </div>
        {report.urlFile && (
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold dark:text-white">Attached File:</h2>
            <img
              src={report.urlFile}
              alt="Report Attachment"
              className="max-w-full h-auto rounded-lg mt-2"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
        >
          Back
        </Button>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="contained"
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Delete
        </Button>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} style={{ color: 'red' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportDetail;
