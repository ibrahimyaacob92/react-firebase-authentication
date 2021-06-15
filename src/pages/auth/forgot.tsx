import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";

const ForgotPassword: React.FunctionComponent<IPageProps> = (props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const resetPasswordRequest = () => {
    if (error !== "") setError("");
    setSending(true);
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        logging.info("Email Sent");
        setSent(true);
        setSending(false);
      })
      .catch((error) => {
        logging.error(error);
        setError(error.message);
        setSending(false);
      });
  };

  return (
    <AuthContainer header="Sent Password Reset">
      {sent ? (
        <p>A link has ben setn to your email with instruction</p>
      ) : (
        <>
          <p>Please Enter your email</p>
          <FormGroup>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="email address"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </FormGroup>
        </>
      )}
      <Button
        disabled={sending}
        color="success"
        block
        onClick={() => resetPasswordRequest()}
      >
        Send Reset Link
      </Button>
      <ErrorText error={error} />
    </AuthContainer>
  );
};

export default ForgotPassword;
