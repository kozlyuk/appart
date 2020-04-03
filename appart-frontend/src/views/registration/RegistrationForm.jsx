import logo200Image from '../../assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Button, Card, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import Auth from '../../auth/auth';
import FormText from 'reactstrap/lib/FormText';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Flip from 'react-reveal/Flip';
import axios from 'axios';
import Swal from 'sweetalert2';

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
      email: '',
      isMobileChecked: false,
      mobileCheckError: '',
      registrationSuccess: '',
      registrationError: '',
      // validation fields
      password: '',
      mobileNumber: '',
      errors: {
        userFirstName: true,
        userSecondName: true,
        mobileNumber: true,
        password: true,
        confirmPassword: true,
        email: true
      }
    };
    this._register = this._register.bind(this);
  }

  /**
   * Check is state signup
   *
   * @return {boolean}
   */
  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  /**
   * Handle submit
   *
   * @param event
   */
  _handleSubmit = event => {
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
  _handleChange = (event) => {
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
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'first_name':
        errors.userFirstName =
          value.length > 0
            ? ''
            : 'Це поле обов\'язкове!';
        break;
      case 'last_name':
        errors.userLastName =
          value.length > 0
            ? ''
            : 'Це поле обов\'язкове!';
        break;
      case 'password':
        errors.password =
          value.length < 6
            ? 'Password must be 6 characters long!'
            : '';
        break;
      case 'confirmPassword':
        errors.confirmPassword =
          value !== this.state.password
            ? 'Паролі повинні співпадати!'
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  /**
   * Check is user exist in db
   *
   * @param mobileNumber
   */
  isUserValid(mobileNumber) {
    axios.get(`${process.env.REACT_APP_CHECK_RESIDENT_BY_NUMBER_URL}${mobileNumber}/`)
      .then(r => this.setState({ isMobileChecked: true }))
      .catch(e => this.setState({ mobileCheckError: e.response.data }));
  }

  checkNumber() {
    const userNumber = this.state.mobileNumber;
    if (this.isUserValid(userNumber)) {
      this.setState({
        isMobileChecked: true
      });
    }
  }

  collectData(data) {
    const mobileNumber = this.state.mobileNumber;
    let formData = new FormData(data);
    formData.append('mobile_number', mobileNumber);

    return formData;
  }

  _register(event) {
    event.preventDefault();
    const data = this.collectData(document.forms.registration);
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_REGISTRATION}`,
      data: data
    }).then(response => {
      Swal.fire({
        title: 'Успіх!',
        text: response.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Перейти на сторінку входу'
      }).then((result) => {
        if (result.value) {
          this.props.history.push('/');
        }
      });
    })
      .catch(error => {
        this.setState({
          registrationError: error.data
        });
      });
  };

  renderButtonText() {
    const { buttonText } = this.props;

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
      emailLabel,
      emailInputProps,
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
          <Input id="userFirstName" name="first_name" {...userFirstNameInputProps} onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="userSecondName">{userSecondNameLabel}</Label>
          {this.state.errors.userSecondName.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.userSecondName}</FormText>}
          <Input id="userSecondName" name="last_name" {...userSecondNameInputProps} onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="mobileNumber">{emailLabel}</Label>
          {this.state.errors.email.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.email}</FormText>}
          <Input id="email" name="email" {...emailInputProps} onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="password">{passwordLabel}</Label>
          {this.state.errors.password.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.password}</FormText>}
          <Input id="password" name="password" {...passwordInputProps} onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">{confirmPasswordLabel}</Label>
          {this.state.errors.confirmPassword.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.confirmPassword}</FormText>}
          <Input id="confirmPassword" name="confirmPassword" {...confirmPasswordInputProps}
                 onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        {/*display inactive button when error length > 0 and active when error == 0*/}
        {this.state.errors.password ||
        this.state.errors.confirmPassword ||
        this.state.errors.userFirstName ||
        this.state.errors.userLastName ?
          <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            disabled>
            The data is incorrect
          </Button> : <Button
            size="lg" s
            className="bg-gradient-theme-left border-0"
            block
            onClick={this._register.bind(this)}
          >
            Зареєструватися
          </Button>}
      </>
    );
  }

  unCheckedForm() {
    const { phoneLabel, phoneInputProps } = this.props;
    return (
      <>
        <FormGroup>
          <Label for="mobileNumber">{phoneLabel}</Label>
          {this.state.errors.mobileNumber.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
          <Input id="mobileNumber" name="mobileNumber" {...phoneInputProps} onChange={this._handleChange}
                 autoComplete="off"/>
        </FormGroup>
        {/*display inactive button when error length > 0 and active when error == 0*/}
        {this.state.errors.mobileNumber ?
          <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            disabled>
            Введіть вірні данні
          </Button> : <Button
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={() => this.checkNumber()}
          >
            Перевірити номер
          </Button>}
      </>
    );
  }

  form() {
    const { showLogo, children, onLogoClick } = this.props;

    const defaultInfoBox = (
      <Alert color="warning">
        Введіть номер телефону для перевірки доступу до реєстрації!
      </Alert>
    );

    const successInfoBox = (
      <Alert color="success">
        Номер знайдено!
      </Alert>
    );

    const mobileCheckError = (
      <Alert color="danger">
        Помилка: {this.state.mobileCheckError}
      </Alert>
    );

    if (this.state.registrationSuccess) {
      return (
        <div>success</div>
      );
    } else {
      return (
        <TransitionGroup {...this.groupProps}>
          <Flip height={'auto'} key={'2'} top opposite cascade collapse when={this.state.isMobileChecked}
                spy={this.state.isMobileChecked}>
            <Form id={'registration'} onSubmit={this._handleSubmit}>
              {showLogo && (
                <div className="text-center pb-4">
                  <img
                    src={logo200Image}
                    className="rounded"
                    style={{ width: 60, height: 60, cursor: 'pointer' }}
                    alt="logo"
                    onClick={onLogoClick}
                  />
                </div>
              )}
              {/*errors*/}
              {this.state.isMobileChecked ? successInfoBox : defaultInfoBox}
              {this.state.mobileCheckError && mobileCheckError}
              {this.state.isMobileChecked ? this.checkedForm() : this.unCheckedForm()}
              <hr/>
              {children}
            </Form>
          </Flip>
        </TransitionGroup>
      );
    }
  }

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
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
    type: 'text'
  },
  userSecondNameLabel: 'Введіть своє прізвище',
  userSecondNameProps: {
    type: 'text'
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
