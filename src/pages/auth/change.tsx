import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";

const ChangePasswordPage: React.FunctionComponent<IPageProps> = (props) => {
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [old, setOld] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const passwordChangeRequest = () => {
    if (password !== confirm){
      setError('Make sure your passwrod are matching ')
    }

    if (error !== "") setError("");
    setChanging(true);

    auth.currentUser
      ?.updatePassword(password)
      .then((result) => {
        logging.info("Password Changed Successfuly");
        history.push("/");
      })
      .catch((error) => {
        logging.error(error);
        setChanging(false);
        setError("Unable to change pass23ord");
      });
  };

  // firebase package keep track of current user state
  console.log(auth.currentUser)
  if (auth.currentUser?.providerData[0]?.providerId !== "password") {
    return <Redirect to="/" />;
  }

  return (
    <AuthContainer header="Change Password">
      <FormGroup>
        <Input
          type="password"
          name="oldpassword"
          id="oldpassword"
          placeholder="Enter Current Password"
          onChange={(event) => setOld(event.target.value)}
          value={old}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter New Passowrd"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          name="confirm"
          id="confirm"
          placeholder="Re-enter password"
          onChange={(event) => setConfirm(event.target.value)}
          value={confirm}
        />
      </FormGroup>
      <Button
        disabled={changing}
        color="success"
        block
        onClick={() => passwordChangeRequest()}
      >
        Change Password
      </Button>
      <ErrorText error={error} />
    </AuthContainer>
  );
};

export default ChangePasswordPage;
