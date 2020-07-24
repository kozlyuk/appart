/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Button, Card, CardBody, CardHeader, Container, Form } from 'reactstrap';
import InputWithLabel from '../../components/FormInputs/InputWithLabel';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class ResetActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      successResponse: false,
      errorResponse: false,
      password2Valid: true,
      fieldError: {
        password: null
      }
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios(process.env.REACT_APP_ACTIVATION_RESET, {
      method: 'post',
      data: {
        password: this.state.password,
        token: this.props.match.params.token
      }
    })
      .then(response => {
        console.log(response);
        Swal.fire({
          title: 'Пароль змінено!',
          confirmButtonText: 'Повернутися на сторінку входу'
        }).then((result) => {
          this.props.history.push('/dashboard');
        });
      })
      .catch(error => {
        this.setState({ fieldError: error.response.data });
      });
  };

  onPasswordChange = (event) => {
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value });
    }
    if (event.target.name === 'password2') {
      this.setState({
        password2: event.target.value,
        password2Valid: this.validatePassword(event.target.value),
        submitButtonActive: this.validatePassword(event.target.value)
      });
    }
  };

  validatePassword = (value) => {
    return (this.state.password === value);
  };

  render() {
    return (
      <Container>
        <Card className="mt-4" style={{ top: '20vh' }}>
          <CardHeader>Форма зміни паролю</CardHeader>
          <CardBody>
            <Form id="resetConfirm" onSubmit={(event => this.handleSubmit(event))}>
              <InputWithLabel
                name={'password'}
                onChange={(event) => this.onPasswordChange(event)}
                label={'Пароль'}
                type={'password'}
                error={this.state.fieldError.password}
              />
              <InputWithLabel
                name={'password2'}
                onChange={(event) => this.onPasswordChange(event)}
                label={'Підтвердіть пароль'}
                type={'password'}
                error={this.state.password2Valid ? '' : 'Паролі повинні співпадати!'}
              />
              <Button className="float-left" type="button" color="warning">Сторінка логіну</Button>
              <Button disabled={!this.state.submitButtonActive} className="float-right" type="submit"
                      color="success">Надіслати</Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    );
  }
}