import * as React from "react";
import PerformanceAppraisalGrid from "./PerformanceAppraisalGrid";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

const PerformanceAppraisal = ({ handleClose }) => {
  return (
    <div className=" m-2">
      <div className="row justify-between p-3">
        <p>PerformanceAppraisal</p>
      </div>
      <PerformanceAppraisalGrid handleClose={handleClose}/>
    </div>
  );
};

export default PerformanceAppraisal;
