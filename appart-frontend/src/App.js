import { STATE_LOGIN, STATE_SIGNUP } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import React, {Fragment} from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import { Text } from 'react-easy-i18n';
import UserList from "./views/user/list";
import UserDetail from "./views/user/userDetail";
import UserUpdate from "./views/user/userUpdate";
import UserNew from "./views/user/userNew";
import UserDelete from "./views/user/userDelete";
import HouseList from "./views/house/houseList";
import HouseNew from "./views/house/houseNew";
import HouseUpdate from "./views/house/houseUpdate";
import HouseDelete from "./views/house/houseDelete";
import ApartmentList from "./views/apartment/apartmentList";
import ApartmentNew from "./views/apartment/apartmentNew";
import ApartmentUpdate from "./views/apartment/apartmentUpdate";
import ApartmentDelete from "./views/apartment/apartmentDelete";
import ChoiceList from "./views/choice/choiceList";
import ChoiceNew from "./views/choice/choiceNew";
import ChoiceUpdate from "./views/choice/choiceUpdate";
import ChoiceDelete from "./views/choice/choiceDelete";
import NewsList from "./views/news/newsList";
import NewsNew from "./views/news/newsNew";
import NewsUpdate from "./views/news/newsUpdate";
import NewsDelete from "./views/news/newsDelete";
import Auth from "./auth/auth"
import axios from "axios"

//TODO!!! add lazy imports
const AlertPage = React.lazy(() => import('pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/DashboardPage'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticate: false,
      user: null
    };
    this.user = new Auth();
  }

  componentDidMount() {
    axios(process.env.REACT_APP_USER_DATA, {
      headers: {
        "Authorization": "Token " + this.user.getAuthToken(),
      }
    })
      .then(
        (response) => {
          console.log(response.status)
          if (response.status >= 400) {
            this.setState({
              isAuthenticate: false,
            })

          } else if (response.status < 400) {
            this.setState({
              isAuthenticate: true,
              user: response.data
            })
          }
        });
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 1000)
  }

  render() {
    if (this.state.isAuthenticate) {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
                <LayoutRoute
                  exact
                  path="/login"
                  layout={EmptyLayout}
                  component={props => (
                    <AuthPage {...props} authState={STATE_LOGIN} />
                  )}
                />
                <LayoutRoute exact path="/signup" layout={EmptyLayout} component={props => (
                    <AuthPage {...props} authState={STATE_SIGNUP} />
                  )}/>
                  <Fragment>
                    <MainLayout breakpoint={this.props.breakpoint}>
                      <React.Suspense fallback={<PageSpinner />}>
                        <Route exact path="/" component={DashboardPage} />
                        <Route exact path="/login-modal" component={AuthModalPage} />
                        <Route exact path="/user" component={UserList} />
                        <Switch>
                          <Route exact path="/user/new" component={UserNew} />
                          <Route exact path="/user/:id/edit" component={UserUpdate} />
                          <Route exact path="/user/:id/delete" component={UserDelete} />
                          <Route exact path="/user/:id" component={UserDetail} />
                        </Switch>
                        <Route exact path="/house" component={HouseList} />
                        <Switch>
                          <Route exact path="/house/new" component={HouseNew} />
                          <Route exact path="/house/:id/edit" component={HouseUpdate} />
                          <Route exact path="/house/:id/delete" component={HouseDelete} />
                        </Switch>
                        <Route exact path="/apartment" component={ApartmentList} />
                        <Switch>
                          <Route exact path="/apartment/new" component={ApartmentNew} />
                          <Route exact path="/apartment/:id/edit" component={ApartmentUpdate} />
                          <Route exact path="/apartment/:id/delete" component={ApartmentDelete} />
                        </Switch>
                        <Route exact path="/choice" component={ChoiceList} />
                        <Switch>
                          <Route exact path="/choice/new" component={ChoiceNew} />
                          <Route exact path="/choice/:id/edit" component={ChoiceUpdate} />
                          <Route exact path="/choice/:id/delete" component={ChoiceDelete} />
                        </Switch>
                        <Route exact path="/news" component={NewsList} />
                        <Switch>
                          <Route exact path="/news/new" component={NewsNew} />
                          <Route exact path="/news/:id/edit" component={NewsUpdate} />
                          <Route exact path="/news/:id/delete" component={NewsDelete} />
                        </Switch>
                        <Route
                          exact
                          path="/button-groups"
                          component={ButtonGroupPage}
                        />
                        <Route exact path="/dropdowns" component={DropdownPage} />
                        <Route exact path="/progress" component={ProgressPage} />
                        <Route exact path="/modals" component={ModalPage} />
                        <Route exact path="/forms" component={FormPage} />
                        <Route exact path="/input-groups" component={InputGroupPage} />
                        <Route exact path="/charts" component={ChartPage} />
                      </React.Suspense>
                    </MainLayout>
                    {/*<Redirect to="/" />*/}
                  </Fragment>

          </Switch>
        </GAListener>
      </BrowserRouter>
    );} else {
      return (
        <BrowserRouter basename={getBasename()}>
          <GAListener>
            <Switch>
              <LayoutRoute
                exact
                path="/"
                layout={EmptyLayout}
                component={props => (
                  <AuthPage {...props} authState={STATE_LOGIN} />
                )}
              />
            </Switch>
          </GAListener>
        </BrowserRouter>
      )
    }
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
