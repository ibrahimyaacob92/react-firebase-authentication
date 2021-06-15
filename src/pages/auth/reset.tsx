import React, { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input, Spinner } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";
import queryString from "querystring";

const ResetPasswordPage: React.FunctionComponent<
  IPageProps & RouteComponentProps
> = (props) => {
  const [verifying, setVerifying] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [oobCode, setOobCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  useEffect(() => {
    logging.info("Extracting Code");
    let stringParams = queryString.parse(props.location.search);

    if (stringParams) {
      let oobCode = stringParams.oobCode as string;
      if (oobCode) {
        logging.info("Code Fouind");
        verifiedPasswordResetLink(oobCode);
      } else {
        logging.error("Unable to find code");
        setVerified(false);
        setVerifying(false);
      }
    } else {
      logging.error("Unable to find code");
      setVerified(false);
      setVerifying(false);
    }
  }, []);

  // just pass the oop code
  const verifiedPasswordResetLink = (_oobCode: string) => {
    auth
      .verifyPasswordResetCode(_oobCode)
      .then((result) => {
        logging.info(result);
        setOobCode(_oobCode);
        setVerified(true);
        setVerifying(false);
      })
      .catch((error) => {
        logging.error(error);
        setVerified(false);
        setVerifying(false);
      });
  };

  const passwordChangeRequest = () => {
    if (password !== confirm) {
      setError("Make sure your passwrod are matching ");
    }

    if (error !== "") setError("");
    setChanging(true);

    auth
      .confirmPasswordReset(oobCode, password)
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        logging.error(error);
        setError(error.message);
        setChanging(false);
      });
  };

  return (
    <AuthContainer header="Reset Password">
      {verifying ? (
        <Spinner />
      ) : (
        <>
          {verified ? (
            <>
              <p>Please enter a strong password</p>
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
                Reset Password
              </Button>
              <ErrorText error={error} />
            </>
          ) : (
            <p>Invalid Link</p>
          )}
        </>
      )}
    </AuthContainer>
  );
};

export default ResetPasswordPage;
