import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import routes from "./config/routes";

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
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
