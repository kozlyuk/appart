// @ts-ignore
import { Content, Footer, Header, Sidebar } from 'components/Layout';
import React, { Component } from 'react';
import { MdImportantDevices } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
// @ts-ignore
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import { UserContext } from '../../globalContext/userContext';
import FeedbackForm from './FeedbackForm';

interface MainLayoutPropsInterface {
  breakpoint: string,
  breadcrumbs: any
}

class MainLayout extends Component<MainLayoutPropsInterface, any> {

  /**
   * @return {boolean}
   */
  static isSidebarOpen() {
    return document.querySelector('.cr-sidebar')?.classList.contains('cr-sidebar--open');
  }

  /**
   * @param breakpoint
   */
  componentWillReceiveProps({ breakpoint }: any) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);

    setTimeout(() => {
      // @ts-ignore
      if (!this.notificationSystem) {
        return;
      }

      // @ts-ignore
      this.notificationSystem.addNotification({
        title: <MdImportantDevices/>,
        message: <Text text="global.welcomeNotification"/>,
        level: 'info',
        position: 'br'
      });
    }, 1500);

  }

  // close sidebar when
  handleContentClick = () => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === 'xs' ||
        this.props.breakpoint === 'sm' ||
        this.props.breakpoint === 'md')
    ) {
      this.openSidebar('close');
    }
  };

  /**
   * @param breakpoint
   * @return {void | undefined}
   */
  checkBreakpoint(breakpoint: string) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
        return this.openSidebar('close');

      case 'lg':
      case 'xl':
      default:
        return this.openSidebar('open');
    }
  }

  /**
   * @param openOrClose
   */
  openSidebar(openOrClose: string) {
    if (openOrClose === 'open') {
      const { classList }: any = document
        .querySelector('.cr-sidebar');
      return classList.add('cr-sidebar--open');
    }
    const { classList: classList1 }: any = document.querySelector('.cr-sidebar');
    classList1.remove('cr-sidebar--open');
  }

  static userContext = UserContext;

  render() {
    const { children } = this.props;
    return (
      <main className="cr-app bg-light">
        <Sidebar/>
        <Content fluid onClick={this.handleContentClick}>
          <Header breadcrumbs={this.props.breadcrumbs}/>
          <FeedbackForm/>
          {children}
          <Footer/>
        </Content>

        <NotificationSystem
          // @ts-ignore
          dismissible={false}
          // @ts-ignore
          ref={notificationSystem => (this.notificationSystem = notificationSystem)}
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      </main>
    );
  }
}

export default MainLayout;
