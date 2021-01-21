import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { useAuth } from './hooks/auth.hook';
//createBrowserHistory - Дозволяє курувати історією силок і руху по силках, наприклад встановити кнопку щоб перейти на попередню силку, або наступну(яку вкажу), замінити щось в історії.
import { createBrowserHistory } from 'history';
import { PrivateRoute } from './components/Helpers/PrivateRoute.jsx';
import { PubliсOnlyRoute } from './components/Helpers/PubliсOnlyRoute.jsx';
import { routes } from './routes';
import './css/style.sass';
import { reactiveVarToken } from './GraphQLApp/reactiveVariables';
import { useReactiveVar } from '@apollo/client';
import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat.js';
import { FilterContacts } from './pages/FilterContacts/FilterContacts.jsx';

const history = createBrowserHistory();

export default function App() {
  const token = useReactiveVar(reactiveVarToken);
  function handleClickHistory(path) {
    //.push() - додає в історію - руху по силках значення path. (де крім доданого є ті переходи які додаються автоматично після переходів по силках)
    history.push(path); //"/home" ;
  }

  //console.log(renderRoutes(routes));

  /*   function RouteWithSubRoutes(route) {
    console.log(route);
    return (
      <Route
        path={route.path}
        render={(props) => (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  }

  return (
    <Router history={history}>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </Router>
  ); */

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/filterContacts'>
          <FilterContacts handleClickHistory={handleClickHistory} />
        </Route>
        <PubliсOnlyRoute exact path='/signIn' component={SignInPage} />
        <PubliсOnlyRoute exact path='/signUp' component={SignUpPage} />
        <PrivateRoute exact path='/chat' component={Chat} />
        <PrivateRoute path='/' component={Chat} />
      </Switch>
      ;
    </Router>
  );
}

/* Для зміни теми
import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const initialState = {
  Page: {
    Theme: "light"
  },
};

const theme = createMuiTheme({
  palette: {
    type: "light",
  }
});

class App extends Component {
  render() {
      return (
        <MuiThemeProvider theme={theme}>
          <>page content</>
        <MuiThemeProvider theme={theme(this.props.pageTheme)}>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    pageTheme: state.Page.Theme
  };
}

function theme(mode) {
  return createMuiTheme({
    palette: {
      type: mode,
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff"
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000"
      }
    }
  });
}

export default connect(
  mapStateToProps
)(App); */

/* 
Для зміни теми 
import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const initialState = {
  Page: {
    Theme: "light"
  },
};

const theme = createMuiTheme({
  palette: {
    type: "light",
  }
});

class App extends Component {
  render() {
      return (
        <MuiThemeProvider theme={theme}>
          <>page content</>
        <MuiThemeProvider theme={theme(this.props.pageTheme)}>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    pageTheme: state.Page.Theme
  };
}

function theme(mode) {
  return createMuiTheme({
    palette: {
      type: mode,
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff"
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000"
      }
    }
  });
}

export default connect(
  mapStateToProps
)(App); */
