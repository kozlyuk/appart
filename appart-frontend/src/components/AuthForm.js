import PropTypes from 'prop-types';
import React from 'react';
import logo200Image from 'assets/img/logo/logo_main.png';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Auth from '../auth/auth';
import FormText from 'reactstrap/lib/FormText';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';

// ugly regular expression for validate length of phone number
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // validation fields
      password: '',
      mobileNumber: '',
      errors: {
        mobileNumber: '',
        password: ''
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * @return {boolean}
   */
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  /**
   * @return {boolean}
   */
  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  /**
   * @param authState
   * @return {function(...[*]=)}
   */
  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  /**
   * @param event
   */
  handleSubmit = event => {
    event.preventDefault();
    let user = new Auth();
    const target = event.target;
    const mobileNumber = target.mobileNumber.value;
    const password = target.password.value;
    this.setState({
      password: password,
      mobileNumber: mobileNumber
    });

    axios({
      method: 'post',
      url: process.env.REACT_APP_LOGIN,
      data: { username: mobileNumber, password }
    })
      .then(response => {
        localStorage.setItem('auth', 'key: ' + response.data.key);
        window.location.assign('/dashboard');
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Упс...',
          text: error.response.data.non_field_errors[0]
        });
      });

  };

  /*
   * Form field validation
   * handleChange(event): void
   *
   * check field valid and
   * set errors str to state
   **/
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'mobileNumber':
        errors.mobileNumber =
          validPhoneRegex.test(value)
            ? ''
            : 'Mobile number is not valid!';
        break;
      case 'password':
        errors.password =
          value.length < 6
            ? 'Password must be 6 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Вхід';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }

  onRegisterButtonClick = () => {
    this.props.history.push('/registration');
  };

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      children,
      onLogoClick
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              style={{ height: 100 }}
              alt="logo"
            />
          </div>
        )}
        <FormGroup>
          <Label for="mobileNumber">{usernameLabel}</Label>
          {this.state.errors.mobileNumber.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
          <Input id="mobileNumber" name="mobileNumber" {...usernameInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="password">{passwordLabel}</Label>
          {this.state.errors.password.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.password}</FormText>}
          <Input id="password" name="password" {...passwordInputProps} onChange={this.handleChange} autoComplete="off"/>
        </FormGroup>
        {/*<FormGroup check>*/}
        {/*  <Label check>*/}
        {/*    <Input type="checkbox"/>{' '}*/}
        {/*    {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}*/}
        {/*  </Label>*/}
        {/*</FormGroup>*/}
        <hr/>
        {/*display inactive button when error length > 0 and active when error == 0*/}
        {this.state.errors.password.length > 0 || this.state.errors.mobileNumber.length > 0 ?
          <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            disabled>
            Введено некорректні данні
          </Button> : <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            type="submit">
            {this.renderButtonText()}
          </Button>}
        <Button
          size="lg"
          className="secondary border-0"
          block
          onClick={() => {
            this.onRegisterButtonClick();
          }}
          type="button">
          Реєстрація
        </Button>
        <ResetPassword/>
        {children}
      </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Номер мобільного телефону',
  usernameInputProps: {
    type: 'text',
    placeholder: '0**********'
  },
  passwordLabel: 'Пароль',
  passwordInputProps: {
    type: 'password',
    placeholder: 'Ваш пароль'
  },
  confirmPasswordLabel: 'Підтвердіть пароль',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'підтвердіть ваш пароль'
  },
  onLogoClick: () => {
  }
};

export default withRouter(AuthForm);
