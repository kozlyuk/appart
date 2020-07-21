/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component, SyntheticEvent } from 'react';
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InputWithLabel from './FormInputs/InputWithLabel';
import axios, { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';

export default class ResetPassword extends Component<any, any> {

  public state = {
    isLoaded: true,
    toggleModal: false,
    email: null,
    errors: {
      email: null
    }
  };

  validEmailRegex = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  private toggleModal = (event: SyntheticEvent): void => {
    event?.preventDefault();
    this.setState({ toggleModal: !this.state.toggleModal });
  };

  private handleSumbit = (event: SyntheticEvent): void => {
    event.preventDefault();

    axios(process.env['REACT_APP_PASSWORD_RESET'] as string, {
      method: 'post',
      data: {
        email: this.state.email
      }
    })
      .then((response: AxiosResponse) => {
        Swal.fire({
          title: 'Посилання на зміну пароля відправлено на електронну пошту!',
          confirmButtonText: 'ОК'
        })
          .then(() => {
            this.setState({ toggleModal: false });
          });
      })
      .catch((error: AxiosResponse) => {
        Swal.showValidationMessage(
          `Request failed: ${error}`
        );
      });
  };

  private onEmailChange = (event: SyntheticEvent): void => {
    const { name, value } = event.target as any;
    let errors = this.state.errors;
    this.setState({
      email: value
    });
    switch (name) {
      case 'email':
        // @ts-ignore
        errors.email =
          this.validEmailRegex.test(value)
            ? ''
            : 'Введіть корректну електронну адресу!';
        break;
      default:
        break;
    }
  };

  public render(): JSX.Element {
    return (
      <>
        <div className="text-center mt-2">
          <a href="" onClick={(event) => this.toggleModal(event)}>Скинути пароль</a>
        </div>
        <Form id={'resetPassword'} onSubmit={(event) => this.handleSumbit(event)}>
          <Modal isOpen={this.state.toggleModal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Форма відновлення паролю</ModalHeader>
            <ModalBody>
              <InputWithLabel
                onChange={(event: SyntheticEvent<Element, Event>) => this.onEmailChange(event)}
                name={'email'}
                label={'Email'}
                error={this.state.errors.email}
              />
            </ModalBody>
            <ModalFooter>
              <Button disabled={!!this.state.errors.email || this.state.errors.email === null} color="primary"
                      onClick={(event) => this.handleSumbit(event)}>Надіслати</Button>{' '}
              <Button color="secondary" onClick={this.toggleModal}>Відмінити</Button>
            </ModalFooter>
          </Modal>
        </Form>
      </>
    );
  }
}