import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";

const RegisterPage: React.FunctionComponent<IPageProps> = (props) => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const signUpWithEmailAndPassword = () => {
    if (password !== confirm) setError("Please make sure your password match");

    if (error !== "") setError("");
    setRegistering(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        logging.info(result);
        history.push("./login");
      })
      .catch((error) => {
        logging.error(error);
        if (error.code.includes("auth/weak-password")) {
          setError("Please enter a stronger password");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setError("Email already in Use");
        } else {
          setError("Unable to register. Please try ageain lateer");
        }
      });
  };

  return (
    <AuthContainer header="Register">
      <FormGroup>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter Passowrd"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </FormGroup>
      <FormGroup>
        <Input
          autoComplete="new-password"
          type="password"
          name="password"
          id="password"
          placeholder="Confirm PasswordX"
          onChange={(event) => setConfirm(event.target.value)}
          value={confirm}
        />
      </FormGroup>
      <Button
        disabled={registering}
        color="success"
        block
        onClick={() => signUpWithEmailAndPassword()}
      >
        Sign Up
      </Button>
      <small>
        <p className="m-1 text-center">
          Already have an account? <Link to="/login"> Login</Link>
        </p>
      </small>
      <ErrorText error={error} />
    </AuthContainer>
  );
};

export default RegisterPage;
