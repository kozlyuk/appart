import { STATE_LOGIN, STATE_SIGNUP } from './components/AuthForm';
import GAListener from './components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout';
import PageSpinner from './components/PageSpinner';
import AuthPage from './pages/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import Auth from './auth/auth';
import axios from 'axios';
import RegistrationForm from './views/registration/RegistrationForm';
import PaymentList from './views/payment/paymentList';
import PaymentUpdate from './views/payment/paymentUpdate';
import BillList from './views/bill/billList';
import BillUpdate from './views/bill/billUpdate';
import OrderNew from './views/order/OrderNew';
import { UserProvider } from './globalContext/userContext';
import { LangProvider } from './globalContext/langContext';
import CabinetLayout from './components/Layout/CabinetLayout';
import PaymentListing from './views/cabinet/components/paymentListing/PaymentListing';
import BillListing from './views/cabinet/components/billListing/BillListing';
import ServiceListing from './views/cabinet/components/serviceListing/ServiceListing';
import Notice from './views/cabinet/Notice';
import WorkList from './views/work/WorkList';
import WorkUpdate from './views/work/WorkUpdate';
import OrderList from './views/order/OrderList';
import OrderForm from './views/order/OrderForm';
import { setCurrentLocale } from 'react-easy-i18n';
import MainController from './controllers/MainController';
import PermissionRoute from './acl/PermissionRoute';
import { PermissionContext } from './globalContext/PermissionContext';


const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const UserList = React.lazy(() => import('./views/user/UserList'));
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
    this.MainController = new MainController();
  }

  /**
   * @param lang
   * @param args
   */
  changeLang = (lang, args = 'reload') => {
    axios(`${process.env.REACT_APP_CHANGE_LANG}${lang}/`, {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    })
      .then(
        (response) => {
          this.setLang(lang);
          if (args === 'reload') {
            window.location.reload(false);
          }
        });

  };

  /**
   * @param lang
   */
  setLang = (lang) => {
    setCurrentLocale(lang);
    this.setState({});
  };

  /**
   * @param lang
   */
  checkLang = (lang) => {
    switch (lang) {
      case 'uk':
        this.setLang('uk');
        break;
      case 'en':
        this.setLang('en');
        break;
      default:
        this.setLang('uk');
        break;
    }
  };

  /**
   * Set data to state
   *
   * @param user
   * @param acl
   */
  _setData(
    user,
    acl
  ) {
    this.setState({
      user: user,
      acl: acl,
      isAuthenticate: true,
      isLoaded: true
    });
  }

  componentDidMount() {
    Promise.all(this.MainController.getPromiseValues())
      .then(axios.spread((
        user,
        acl
      ) => {
        if (user.data.lang) {
          this.checkLang(user.data.lang);
        }
        this._setData(
          user.data,
          acl.data
        );
      }))
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (!this.state.isAuthenticate) {
      return (
        <BrowserRouter>
          <Switch>
            <LayoutRoute
              exact
              path="/"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN}/>
              )}
            />
            <LayoutRoute
              exact
              path="/registration"
              layout={EmptyLayout}
              component={props => (
                <RegistrationForm {...props} authState={STATE_SIGNUP}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      );
    } else {

      return (
        <LangProvider value={this.changeLang}>
          <UserProvider value={this.state.user}>
            <PermissionContext.Provider value={this.state.acl}>
              <BrowserRouter>
                <GAListener>
                  <Switch>
                    <LayoutRoute
                      exact
                      path="/cabinet"
                      layout={CabinetLayout}
                      component={(props) => (
                        <Notice {...props}/>
                      )}
                    />
                    <LayoutRoute
                      exact
                      path="/cabinet/bills"
                      layout={CabinetLayout}
                      component={(props) => (
                        <BillListing {...props}/>
                      )}
                    />
                    <LayoutRoute
                      exact
                      path="/cabinet/payments"
                      layout={CabinetLayout}
                      component={(props) => (
                        <PaymentListing {...props}/>
                      )}
                    />
                    <LayoutRoute
                      exact
                      path="/cabinet/service"
                      layout={CabinetLayout}
                      component={(props) => (
                        <ServiceListing {...props}/>
                      )}
                    />
                    <LayoutRoute
                      exact
                      path="/cabinet/order/new"
                      layout={CabinetLayout}
                      component={props => (
                        <OrderNew {...props} user={this.state.user}/>
                      )}
                    />
                    <LayoutRoute
                      exact
                      path="/registration"
                      layout={EmptyLayout}
                      component={props => (
                        <RegistrationForm {...props} authState={STATE_SIGNUP}/>
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
                        <PermissionRoute
                          aclList={this.state.acl} modelName="user" permissionName="view" exact
                          path="/user" component={UserList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="user" permissionName="add"
                            exact path="/user/new" component={UserNew}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="user" permissionName="change"
                            exact path="/user/:id/edit" component={UserUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="user" permissionName="delete"
                            exact path="/user/:id/delete" component={UserDelete}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="user" permissionName="view"
                            exact path="/user/:id" component={UserDetail}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="house" permissionName="view"
                          exact path="/house" component={HouseList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="house" permissionName="add"
                            exact path="/house/new" component={HouseNew}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="house" permissionName="change"
                            exact path="/house/:id/edit" component={HouseUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="house" permissionName="delete"
                            exact path="/house/:id/delete" component={HouseDelete}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="apartment" permissionName="view"
                          exact path="/apartment"
                          component={props => (
                            <ApartmentList {...props}/>
                          )}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="apartment" permissionName="add"
                            exact path="/apartment/new" component={ApartmentNew}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="apartment" permissionName="change"
                            exact path="/apartment/:id/edit" component={ApartmentUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="apartment" permissionName="delete"
                            exact path="/apartment/:id/delete" component={ApartmentDelete}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="choice" permissionName="view"
                          exact path="/choice" component={ChoiceList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="choice" permissionName="add"
                            exact path="/choice/new" component={ChoiceNew}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="choice" permissionName="change"
                            exact path="/choice/:id/edit" component={ChoiceUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="choice" permissionName="delete"
                            exact path="/choice/:id/delete" component={ChoiceDelete}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="news" permissionName="view"
                          exact path="/news" component={NewsList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="news" permissionName="add"
                            exact path="/news/new" component={NewsNew}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="news" permissionName="change"
                            exact path="/news/:id/edit" component={NewsUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="news" permissionName="delete"
                            exact path="/news/:id/delete" component={NewsDelete}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="work" permissionName="view"
                          exact path="/work" component={WorkList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="work" permissionName="add"
                            exact path="/work/new" component={WorkUpdate}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="work" permissionName="change"
                            exact path="/work/:id/edit" component={WorkUpdate}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="order" permissionName="view"
                          exact path="/order" component={OrderList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="order" permissionName="add"
                            exact path="/order/new" component={OrderForm}
                          />
                          <PermissionRoute
                            aclList={this.state.acl} modelName="order" permissionName="change"
                            exact path="/order/:id/edit" component={OrderForm}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="payment" permissionName="view"
                          exact path="/payment" component={PaymentList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="payment" permissionName="change"
                            exact path="/payment/:id/edit" component={PaymentUpdate}
                          />
                        </Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="bill" permissionName="view"
                          exact path="/bill" component={BillList}
                        />
                        <Switch>
                          <PermissionRoute
                            aclList={this.state.acl} modelName="bill" permissionName="change"
                            exact path="/bill/:id/edit" component={BillUpdate}
                          />
                        </Switch>
                        {/*<Route path="*">*/}
                        {/*  <div>test</div>*/}
                        {/*</Route>*/}
                      </MainLayout>
                      {/*<Redirect to="/"/>*/}
                    </React.Suspense>
                  </Switch>
                </GAListener>
              </BrowserRouter>
            </PermissionContext.Provider>
          </UserProvider>
        </LangProvider>
      );
    }
  }
}

/**
 *
 * @param width
 * @returns {{breakpoint: string}}
 */
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
