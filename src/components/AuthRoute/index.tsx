import React from "react";
import { Redirect } from "react-router";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";

interface Props {}

const AuthRoute: React.FC<Props> = ({ children }) => {
  if (!auth.currentUser) {
    logging.warn("No user detected, redirecting");
    return <Redirect to="/login" />;
  }

  return <div>{children}</div>;
};

export default AuthRoute;
