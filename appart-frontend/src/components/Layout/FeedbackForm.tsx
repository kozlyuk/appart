/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component, FormEvent } from 'react';
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InputWithLabel from '../FormInputs/InputWithLabel';
import Auth from '../../auth/auth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdFeedback } from 'react-icons/md';

import styles from './feedback.module.css';

interface FeedbackFormStateInterface {
  isLoaded: boolean,
  feedbackOpen: boolean,
  fieldErrors: {
    title: string,
    text: string
  }
}

export default class FeedbackForm extends Component<any, FeedbackFormStateInterface> {

  private user: Auth;

  constructor(props: any) {
    super(props);
    this.user = new Auth();
  }

  public state: FeedbackFormStateInterface = {
    isLoaded: true,
    feedbackOpen: false,
    fieldErrors: {
      title: '',
      text: ''
    }
  };

  private toggleFeedbackModal = () => {
    this.setState({
      feedbackOpen: !this.state.feedbackOpen
    });
  };

  feedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { feedbackForm: feedbackForm1 }: any = document.forms;
    const feedbackForm = new FormData(feedbackForm1);
    const feedbackEndpoint = process.env['REACT_APP_FEEDBACK'] as string;
    axios.post(feedbackEndpoint, feedbackForm,
      {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
        }
      })
      .then(response => {
        Swal.fire({
          title: 'Успіх!',
          text: 'Вашу заявку прийнято в обробку',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'ОК'
        }).then(() => {
          this.toggleFeedbackModal();
        });
      })
      .catch(error => {
        this.setState({
          fieldErrors: error.response.data
        });
      });
  };

  render() {
    return (
      <>
        <Modal isOpen={this.state.feedbackOpen} toggle={this.toggleFeedbackModal} className={'modal-dialog-centered'}>
          <Form id="feedbackForm" onSubmit={(event: FormEvent) => this.feedbackSubmit(event)}>
            <ModalHeader toggle={this.toggleFeedbackModal}>Форма зворотнього зв'язку</ModalHeader>
            <ModalBody>
              <InputWithLabel
                label={'Тема повідомлення'}
                name={'title'}
                error={this.state.fieldErrors.title}
              />
              <InputWithLabel
                label={'Текст повідомлення'}
                name={'text'}
                error={this.state.fieldErrors.text}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleFeedbackModal}>Відмінити</Button>{' '}
              <Button type="submit" color="success">Відправити</Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Button onClick={this.toggleFeedbackModal} className={styles.button}><MdFeedback/> Feedback</Button>
      </>
    );
  }
}