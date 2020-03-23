import logo200Image from '../../assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, Button, Card, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import Auth from '../../auth/auth';
import FormText from 'reactstrap/lib/FormText';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Flip from "react-reveal/Flip";

/**
 * Ugly regular expression for validate length of phone number
 *
 * @type {RegExp}
 */
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

/**
 * Ugly regular expression for validate email
 *
 * @type {RegExp}
 */
const validEmailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

/**
 * Registration form class
 *
 * Lifecycle ( name - description ):
 * 1. userUndefined - Check available mobile or email in backend.
 * 2. userFind -      Display full form.
 */
class RegistrationForm extends React.Component {

  /**
   * Registration form constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isMobileChecked: false,
      mobileCheckError: '',
      // validation fields
      password: '',
      mobileNumber: '',
      errors: {
        userFirstName: '',
        userSecondName: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        email: ''
      }
    };
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  handleSubmit = event => {
    event.preventDefault();
    let user = new Auth();
    const target = event.target;
    console.log(target.mobileNumber.value);
    const mobileNumber = target.mobileNumber.value;
    const password = target.password.value;
    this.setState({
      password: password,
      mobileNumber: mobileNumber
    });
    user.login(mobileNumber, password).then(r => {
      return r;
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
    const {name, value} = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'mobileNumber':
        errors.mobileNumber =
          validPhoneRegex.test(value)
            ? ''
            : 'Mobile number is not valid!';
        break;
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password':
        errors.password =
          value.length < 6
            ? 'Password must be 6 characters long!'
            : '';
        break;
      case 'confirmPassword':
        errors.confirmPassword =
          value.length < 6
            ? 'Password must be 6 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value});
  };

  isUserValid(mobileNumber) {
    return true;
    // axios.get(`${process.env.REACT_APP_CHECK_BY_NUMBER_URL}${mobileNumber}`)
    //   .then(r => this.setState({isMobileChecked: true}))
    //   .catch(e => this.setState({mobileCheckError: e}))
  }

  checkNumber() {
    const userNumber = this.state.mobileNumber;
    if (this.isUserValid(userNumber)) {
      this.setState({
        isMobileChecked: true
      });
    }
    console.log("test")
  }

  renderButtonText() {
    const {buttonText} = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }
    return buttonText;
  }

  checkedForm() {
    const {
      userSecondNameLabel,
      userSecondNameInputProps,
      userFirstNameLabel,
      userFirstNameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps
    } = this.props;
    return (
      <>
        <FormGroup>
          <Label for="userFirstName">{userFirstNameLabel}</Label>
          {this.state.errors.userFirstName.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.userFirstName}</FormText>}
          <Input id="userFirstName" name="userFirstName" {...userFirstNameInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="userSecondName">{userSecondNameLabel}</Label>
          {this.state.errors.userSecondName.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.userSecondName}</FormText>}
          <Input id="userSecondName" name="userSecondName" {...userSecondNameInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="password">{passwordLabel}</Label>
          {this.state.errors.password.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.password}</FormText>}
          <Input id="password" name="password" {...passwordInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">{confirmPasswordLabel}</Label>
          {this.state.errors.confirmPassword.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.confirmPassword}</FormText>}
          <Input id="confirmPassword" name="confirmPassword" {...confirmPasswordInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
      </>
    )
  }

  unCheckedForm() {
    const {
      phoneLabel,
      emailLabel,
      phoneInputProps,
      emailInputProps,
    } = this.props;
    return (
      <>
        <FormGroup>
          <Label for="mobileNumber">{phoneLabel}</Label>
          {this.state.errors.mobileNumber.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
          <Input id="mobileNumber" name="mobileNumber" {...phoneInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="mobileNumber">{emailLabel}</Label>
          {this.state.errors.email.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.email}</FormText>}
          <Input id="email" name="email" {...emailInputProps} onChange={this.handleChange}
                 autoComplete="off"/>
        </FormGroup>
      </>
    )
  }

  form() {
    const {
      showLogo,
      children,
      onLogoClick
    } = this.props;

    const defaultInfoBox = (
      <Alert color="warning">
        Введіть номер телефону та адресу поштової скриньки для перевірки доступу до реєстрації!
      </Alert>
    );

    const successInfoBox = (
      <Alert color="success">
        Номер знайдено!
      </Alert>
    );

    const mobileCheckError = (
      <Alert color="warning">
        Помилка: {this.state.mobileCheckError}
      </Alert>
    );

    return (
      <TransitionGroup {...this.groupProps}>
        <Flip key={'2'} top opposite cascade collapse when={this.state.isMobileChecked}
              spy={this.state.isMobileChecked}>
          <Form onSubmit={this.handleSubmit}>
            {showLogo && (
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{width: 60, height: 60, cursor: 'pointer'}}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
            )}
            {this.state.isMobileChecked ? successInfoBox : defaultInfoBox}
            {this.state.mobileCheckError && mobileCheckError}


            {this.state.isMobileChecked ? this.checkedForm() : this.unCheckedForm()}
            <hr/>
            {/*display inactive button when error length > 0 and active when error == 0*/}
            {this.state.errors.password.length > 0 || this.state.errors.mobileNumber.length > 0 ?
              <Button
                size="lg"
                className="bg-gradient-theme-left border-0"
                block
                disabled>
                The data is incorrect
              </Button> : <Button
                size="lg"
                className="bg-gradient-theme-left border-0"
                block
                onClick={() => this.checkNumber()}
              >
                {this.renderButtonText()}
              </Button>}
            {children}
          </Form>
        </Flip>
      </TransitionGroup>
    )
  }

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Col md={6} lg={4}>
          <Card body>
            {this.form()}
          </Card>
        </Col>
      </Row>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

RegistrationForm.propTypes = {
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

RegistrationForm.defaultProps = {
  authState: 'SIGNUP',
  showLogo: true,
  phoneLabel: 'Номер мобільного телефону',
  phoneInputProps: {
    type: 'text',
    placeholder: '0**********'
  },
  userFirstNameLabel: 'Введіть своє ім\'я',
  userFirstNameProps: {
    type: 'text',
  },
  userSecondNameLabel: 'Введіть своє прізвище',
  userSecondNameProps: {
    type: 'text',
  },
  emailLabel: 'Введіть адресу електронної скриньки',
  emailInputProps: {
    type: 'email',
    placeholder: 'sample@mail.com'
  },
  passwordLabel: 'Введіть пароль',
  passwordInputProps: {
    type: 'password',
    placeholder: 'Ваш пароль'
  },
  confirmPasswordLabel: 'Підтвердіть пароль',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'Введіть поторно пароль'
  },
  onLogoClick: () => {
  }
};

export default RegistrationForm;
