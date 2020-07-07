import { STATE_LOGIN, STATE_SIGNUP } from './components/AuthForm';
import GAListener from './components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout';
import PageSpinner from './components/PageSpinner';
import AuthPage from './pages/AuthPage';
import React from 'react';
// @ts-ignore
import componentQueries from 'react-component-queries';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import Auth from './auth/auth';
import axios from 'axios';
import RegistrationForm from './views/registration/RegistrationForm';
import PaymentList from './views/payment/paymentList';
import PaymentUpdate from './views/payment/paymentUpdate';
import BillList from './views/bill/billList';
import BillForm from './views/bill/billForm';
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
// @ts-ignore
import { setCurrentLocale } from 'react-easy-i18n';
import MainController from './controllers/MainController';
import PermissionRoute from './acl/PermissionRoute';
import { PermissionContext } from './globalContext/PermissionContext';
import NonAuthRoutes from './NonAuthRoutes';
import RateList from './views/rate/RateList';


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


class App extends React.Component<any, any> {

  private user: Auth;

  private MainController: MainController;

  constructor(props: any) {
    super(props);
    this.user = new Auth();
    this.MainController = new MainController();
  }

  state: { isAuthenticate: boolean, user: any, isLoaded: boolean, acl: object } = {
    isLoaded: false,
    isAuthenticate: false,
    user: null,
    acl: {}
  };

  /**
   * @param lang
   * @param args
   */
  changeLang = (lang: string, args = 'reload') => {
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
  setLang = (lang: string) => {
    setCurrentLocale(lang);
    this.setState({});
  };

  /**
   * @param lang
   */
  checkLang = (lang: string) => {
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
    user: object,
    acl: object
  ) {
    this.setState({
      user: user,
      acl: acl,
      isAuthenticate: true
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
        this.setState({
          isLoaded: true
        });
      }))
      .catch(error => {
        this.setState({
          isLoaded: true
        });
        console.log(error);
      });
  }

  authRoutes = () => {
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
                    component={(props: any) => (
                      <Notice {...props}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/cabinet/bills"
                    layout={CabinetLayout}
                    component={(props: any) => (
                      <BillListing {...props}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/cabinet/payments"
                    layout={CabinetLayout}
                    component={(props: any) => (
                      <PaymentListing {...props}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/cabinet/service"
                    layout={CabinetLayout}
                    component={(props: any) => (
                      <ServiceListing {...props}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/cabinet/order/new"
                    layout={CabinetLayout}
                    component={(props: any) => (
                      <OrderNew {...props} user={this.state.user}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/registration"
                    layout={EmptyLayout}
                    component={(props: any) => (
                      <RegistrationForm {...props} authState={STATE_SIGNUP}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/login"
                    layout={EmptyLayout}
                    component={(props: any) => (
                      <AuthPage {...props} authState={STATE_LOGIN}/>
                    )}
                  />
                  <LayoutRoute
                    exact
                    path="/signup"
                    layout={EmptyLayout}
                    component={(props: any) => (
                      <AuthPage {...props} authState={STATE_SIGNUP}/>
                    )}
                  />
                  <React.Suspense fallback={<PageSpinner/>}>
                    {/*
                    //@ts-ignore*/}
                    <MainLayout breakpoint={this.props.breakpoint}>
                      <Route exact path="/dashboard/" component={DashboardPage}/>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="user" permissionName="view" exact
                        path="/dashboard/user" component={UserList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="user" permissionName="add"
                          exact path="/dashboard/user/new" component={UserNew}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="user" permissionName="change"
                          exact path="/dashboard/user/:id/edit" component={UserUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="user" permissionName="delete"
                          exact path="/dashboard/user/:id/delete" component={UserDelete}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="user" permissionName="view"
                          exact path="/dashboard/user/:id" component={UserDetail}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="house" permissionName="view"
                        exact path="/dashboard/house" component={HouseList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="house" permissionName="add"
                          exact path="/dashboard/house/new" component={HouseNew}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="house" permissionName="change"
                          exact path="/dashboard/house/:id/edit" component={HouseUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="house" permissionName="delete"
                          exact path="/dashboard/house/:id/delete" component={HouseDelete}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="apartment" permissionName="view"
                        exact path="/dashboard/apartment"
                        component={(props: any) => (
                          <ApartmentList {...props}/>
                        )}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="apartment" permissionName="add"
                          exact path="/dashboard/apartment/new" component={ApartmentNew}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="apartment" permissionName="change"
                          exact path="/dashboard/apartment/:id/edit" component={ApartmentUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="apartment" permissionName="delete"
                          exact path="/dashboard/apartment/:id/delete" component={ApartmentDelete}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="choice" permissionName="view"
                        exact path="/dashboard/choice" component={ChoiceList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="choice" permissionName="add"
                          exact path="/dashboard/choice/new" component={ChoiceNew}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="choice" permissionName="change"
                          exact path="/dashboard/choice/:id/edit" component={ChoiceUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="choice" permissionName="delete"
                          exact path="/dashboard/choice/:id/delete" component={ChoiceDelete}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="news" permissionName="view"
                        exact path="/dashboard/news" component={NewsList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="news" permissionName="add"
                          exact path="/dashboard/news/new" component={NewsNew}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="news" permissionName="change"
                          exact path="/dashboard/news/:id/edit" component={NewsUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="news" permissionName="delete"
                          exact path="/dashboard/news/:id/delete" component={NewsDelete}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="work" permissionName="view"
                        exact path="/dashboard/work" component={WorkList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="work" permissionName="add"
                          exact path="/dashboard/work/new" component={WorkUpdate}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="work" permissionName="change"
                          exact path="/dashboard/work/:id/edit" component={WorkUpdate}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="order" permissionName="view"
                        exact path="/dashboard/order" component={OrderList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="order" permissionName="add"
                          exact path="/dashboard/order/new" component={OrderForm}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="order" permissionName="change"
                          exact path="/dashboard/order/:id/edit" component={OrderForm}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="payment" permissionName="view"
                        exact path="/dashboard/payment" component={PaymentList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="payment" permissionName="change"
                          exact path="/dashboard/payment/:id/edit" component={PaymentUpdate}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="bill" permissionName="view"
                        exact path="/dashboard/bill" component={BillList}
                      />
                      <Switch>
                        <PermissionRoute
                          aclList={this.state.acl} modelName="bill" permissionName="add"
                          exact path="/dashboard/bill/new" component={BillForm}
                        />
                        <PermissionRoute
                          aclList={this.state.acl} modelName="bill" permissionName="change"
                          exact path="/dashboard/bill/:id/edit" component={BillForm}
                        />
                      </Switch>
                      <PermissionRoute
                        aclList={this.state.acl} modelName="rate" permissionName="view"
                        exact path="/dashboard/rate" component={RateList}
                      />
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
  };

  render() {
    if (this.state.isLoaded) {
      console.log(this.state.isAuthenticate);
      return (
        this.state.isAuthenticate ?
          this.authRoutes()
          :
          <BrowserRouter>
            <NonAuthRoutes isAuthenticate={this.state.isAuthenticate}/>
          </BrowserRouter>
      );
    } else {
      return (
        <PageSpinner/>
      );
    }
  }
}

/**
 *
 * @param width
 * @returns {{breakpoint: string}}
 */
const query = ({ width }: { width: number }) => {
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
