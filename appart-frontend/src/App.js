import {STATE_LOGIN, STATE_SIGNUP} from 'components/AuthForm';
import GAListener from 'components/GAListener';
import {EmptyLayout, LayoutRoute, MainLayout} from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import React, {Fragment} from 'react';
import componentQueries from 'react-component-queries';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './styles/reduction.scss';
import Auth from "./auth/auth"
import axios from "axios"
import Cabinet from "./views/cabinet/Cabinet";

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const UserList = React.lazy(() => import('./views/user/list'));
const UserDetail = React.lazy(() => import('./views/user/userDetail'));
const UserUpdate = React.lazy(() => import('./views/user/userUpdate'));
const UserNew = React.lazy(() => import('./views/user/userNew'));
const UserDelete = React.lazy(() => import('./views/user/userDelete'));
const HouseList = React.lazy(() => import('./views/house/houseList'));
const HouseNew = React.lazy(() => import('./views/house/houseNew'));
const HouseUpdate = React.lazy(() => import('./views/house/houseUpdate'));
const HouseDelete = React.lazy(() => import('./views/house/houseDelete'));
const ApartmentList = React.lazy(() => import('./views/apartment/apartmentList'));
const ApartmentNew = React.lazy(() => import('./views/apartment/apartmentNew'));
const ApartmentUpdate = React.lazy(() => import('./views/apartment/apartmentUpdate'));
const ApartmentDelete = React.lazy(() => import('./views/apartment/apartmentDelete'));
const ChoiceList = React.lazy(() => import('./views/choice/choiceList'));
const ChoiceNew = React.lazy(() => import('./views/choice/choiceNew'));
const ChoiceUpdate = React.lazy(() => import('./views/choice/choiceUpdate'));
const ChoiceDelete = React.lazy(() => import('./views/choice/choiceDelete'));
const NewsList = React.lazy(() => import('./views/news/newsList'));
const NewsNew = React.lazy(() => import('./views/news/newsNew'));
const NewsUpdate = React.lazy(() => import('./views/news/newsUpdate'));
const NewsDelete = React.lazy(() => import('./views/news/newsDelete'));


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
          console.log(response.status);
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
        <Fragment>
          <BrowserRouter>
            <GAListener>
              <Switch>
                <LayoutRoute
                  exact
                  path="/cabinet"
                  layout={EmptyLayout}
                  component={() => (
                    <Cabinet user={this.state.user}/>
                  )}
                />
                <LayoutRoute
                  exact
                  path="/login"
                  layout={EmptyLayout}
                  component={props => (
                    <AuthPage {...props} authState={STATE_LOGIN}/>
                  )}
                />
                <LayoutRoute
                  exact
                  path="/signup"
                  layout={EmptyLayout}
                  component={props => (
                    <AuthPage {...props} authState={STATE_SIGNUP}/>
                  )}
                />
                <React.Suspense fallback={<PageSpinner/>}>
                  <MainLayout breakpoint={this.props.breakpoint}>
                    <Route exact path="/" component={DashboardPage}/>
                    <Route exact path="/user" component={UserList}/>
                    <Switch>
                      <Route exact path="/user/new" component={UserNew}/>
                      <Route exact path="/user/:id/edit" component={UserUpdate}/>
                      <Route exact path="/user/:id/delete" component={UserDelete}/>
                      <Route exact path="/user/:id" component={UserDetail}/>
                    </Switch>
                    <Route exact path="/house" component={HouseList}/>
                    <Switch>
                      <Route exact path="/house/new" component={HouseNew}/>
                      <Route exact path="/house/:id/edit" component={HouseUpdate}/>
                      <Route exact path="/house/:id/delete" component={HouseDelete}/>
                    </Switch>
                    <Route exact path="/apartment" component={ApartmentList}/>
                    <Switch>
                      <Route exact path="/apartment/new" component={ApartmentNew}/>
                      <Route exact path="/apartment/:id/edit" component={ApartmentUpdate}/>
                      <Route exact path="/apartment/:id/delete" component={ApartmentDelete}/>
                    </Switch>
                    <Route exact path="/choice" component={ChoiceList}/>
                    <Switch>
                      <Route exact path="/choice/new" component={ChoiceNew}/>
                      <Route exact path="/choice/:id/edit" component={ChoiceUpdate}/>
                      <Route exact path="/choice/:id/delete" component={ChoiceDelete}/>
                    </Switch>
                    <Route exact path="/news" component={NewsList}/>
                    <Switch>
                      <Route exact path="/news/new" component={NewsNew}/>
                      <Route exact path="/news/:id/edit" component={NewsUpdate}/>
                      <Route exact path="/news/:id/delete" component={NewsDelete}/>
                    </Switch>
                  </MainLayout>
                </React.Suspense>
                {/*<Redirect to="/" />*/}
              </Switch>
            </GAListener>
          </BrowserRouter>
        </Fragment>
      );
    } else {
      return (
        <BrowserRouter>
          <LayoutRoute
            exact
            path="/"
            layout={EmptyLayout}
            component={props => (
              <AuthPage {...props} authState={STATE_LOGIN}/>
            )}
          />
        </BrowserRouter>
      )
    }
  }
}

/**
 *
 * @param width
 * @returns {{breakpoint: string}}
 */
const query = ({width}) => {
  if (width < 575) {
    return {breakpoint: 'xs'};
  }

  if (576 < width && width < 767) {
    return {breakpoint: 'sm'};
  }

  if (768 < width && width < 991) {
    return {breakpoint: 'md'};
  }

  if (992 < width && width < 1199) {
    return {breakpoint: 'lg'};
  }

  if (width > 1200) {
    return {breakpoint: 'xl'};
  }

  return {breakpoint: 'xs'};
};

export default componentQueries(query)(App);
