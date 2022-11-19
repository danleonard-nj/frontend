import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export default function Spinner({ size }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress size={size ?? 80} />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
};
