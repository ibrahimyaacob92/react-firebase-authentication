import React, { useEffect, useState } from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Spinner } from "reactstrap";
import AuthRoute from "./components/AuthRoute";
import { auth } from "./config/firebase";
import logging from "./config/logging";
import routes from "./config/routes";

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);

  // firebase mechanism to save the user state if they're logged in
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        logging.info("User detected");
      } else {
        logging.info("No user detected");
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner color="info" />;

  return (
    <div>
      <Switch>
        {routes.map((route: any, index: number) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={(routeProps: RouteComponentProps<any>) => {
              if (route.protected)
                return (
                  <AuthRoute>
                    <route.component {...routeProps} />
                  </AuthRoute>
                );

              return <route.component {...routeProps} />;
            }}
          />
        ))}
      </Switch>
    </div>
  );
};

export default App;
