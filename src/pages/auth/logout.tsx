import React from "react";
import { useHistory } from "react-router";
import { Button } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";

const LogoutPage: React.FunctionComponent<IPageProps> = (props) => {
  const history = useHistory();

  const logout = () => {
    auth
      .signOut()
      .then(() => history.push("/login"))
      .catch((error) => logging.error(error));
  };

  return (
    <AuthContainer header="Logout">
      <p>Are you sure you want to logout</p>
      <div>
        <Button color="danger" onClick={() => history.goBack()}>
          Cancel
        </Button>
        <Button color="info" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </AuthContainer>
  );
};

export default LogoutPage;
