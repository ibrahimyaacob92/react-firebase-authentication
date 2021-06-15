import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button, FormGroup, Input } from "reactstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth, Providers } from "../../config/firebase";
import logging from "../../config/logging";
import IPageProps from "../../interface/page";
import firebase from "firebase";
import { SignInWithSocialMedia } from "./modules";

const LoginPage: React.FunctionComponent<IPageProps> = (props) => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const signInWithEmailAndPassword = () => {
    if (error !== "") setError("");
    setAuthenticating(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        logging.info(result);
        history.push("/");
      })
      .catch((error) => {
        logging.error(error);
        setAuthenticating(false);
        setError("Unable to sign in. Please tyr agian later");
      });
  };

  if (auth.currentUser) history.push("/");

  const signInWithSocMed = (provider: firebase.auth.AuthProvider) => {
    if (error !== "") setError("");
    setAuthenticating(true);
    SignInWithSocialMedia(provider)
      .then((result) => {
        logging.info(result);
        history.push("/");
      })
      .catch((error) => {
        logging.error(error);
        setAuthenticating(false);
        setError(error.message);
      });
  };
  return (
    <AuthContainer header="Login">
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
      <Button
        disabled={authenticating}
        color="success"
        block
        onClick={() => signInWithEmailAndPassword()}
      >
        Sign In
      </Button>
      <small>
        <p className="m-1 text-center">
          Dont have account yet? <Link to="/register">Register</Link>
        </p>
        <p className="m-1 text-center">
          Forgot your password? go <Link to="/forgot">here</Link>
        </p>
      </small>
      <ErrorText error={error} />
      <hr className="" />
      <Button
        disabled={authenticating}
        block
        onClick={() => SignInWithSocialMedia(Providers.google)}
      >
        Sign In with Google
      </Button>
      <Button
        disabled={authenticating}
        block
        onClick={() => SignInWithSocialMedia(Providers.facebook)}
      >
        Sign In with Facebook
      </Button>
    </AuthContainer>
  );
};

export default LoginPage;
