import { Content, Footer, Header, Sidebar } from 'components/Layout';
import React from 'react';
import { MdFeedback, MdImportantDevices } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { Text } from 'react-easy-i18n';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './feedback.module.css';

import axios from 'axios';
import { UserContext } from '../../globalContext/userContext';

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackOpen: false
    };
  }

  /**
   * @return {boolean}
   */
  static isSidebarOpen() {
    return document
      .querySelector('.cr-sidebar')
      .classList.contains('cr-sidebar--open');
  }

  /**
   * @param breakpoint
   */
  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);

    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }

      this.notificationSystem.addNotification({
        title: <MdImportantDevices/>,
        message: <Text text="global.welcomeNotification"/>,
        level: 'info',
        position: 'br'
      });
    }, 1500);

  }

  // close sidebar when
  handleContentClick = event => {
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
  checkBreakpoint(breakpoint) {
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
  openSidebar(openOrClose) {
    if (openOrClose === 'open') {
      return document
        .querySelector('.cr-sidebar')
        .classList.add('cr-sidebar--open');
    }
    document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  toggleFeedbackModal = () => {
    this.setState({
      feedbackOpen: !this.state.feedbackOpen
    });
  };

  static userContext = UserContext;

  feedbackSubmit = (e) => {
    e.preventDefault();
    const feedbackForm = new FormData(document.forms.feedbackForm);
    axios
      .post(`https://api.cosmicjs.com/v1/appart-feedback/add-object`, {
        type_slug: 'feedbacks',
        title: 'test123',
        content: 'Bug message',
        write_key: 'NYZKwKPpS91Gjvu24QhSKi0cnvW3A4EHNHEk7diMwu8zSBczlQ',
        metafields: [
          {
            'key': 'user_name',
            'type': 'text',
            'title': 'Bug!',
            'value': 'testaetgeatgeawtg'
          },
          {
            'key': 'message',
            'type': 'text',
            'title': 'Bug message',
            'value': feedbackForm.get('message')
          },
          {
            'key': 'create_date',
            'type': 'date',
            'title': 'Creation date',
            'value': new Date()
          }
        ]
      })
      .then(response => {
        console.log(response);
      });
  };

  render() {
    const { children } = this.props;
    return (
      <main className="cr-app bg-light">
        <div>
          <Modal isOpen={this.state.feedbackOpen} toggle={this.toggleFeedbackModal} className={'modal-dialog-centered'}>
            <Form id="feedbackForm" onSubmit={this.feedbackSubmit}>
              <ModalHeader toggle={this.toggleFeedbackModal}>Форма зворотнього зв'язку</ModalHeader>
              <ModalBody>

                <FormGroup>
                  <Label for="message">Текст повідомлення</Label>
                  <Input name="message" id="message" type="textarea"/>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleFeedbackModal}>Відмінити</Button>{' '}
                <Button type="submit" color="success" onClick={this.toggleFeedbackModal}>Відправити</Button>
              </ModalFooter>
            </Form>
          </Modal>
        </div>
        <Sidebar/>
        <Content fluid onClick={this.handleContentClick}>
          <Header breadcrumbs={this.props.breadcrumbs}/>
          {children}
          <Button onClick={this.toggleFeedbackModal} className={styles.button}><MdFeedback/> Feedback</Button>
          <Footer/>
        </Content>

        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      </main>
    );
  }
}

export default MainLayout;
