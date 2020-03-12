import logo200Image from '../assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Auth from '../auth/auth';
import FormText from 'reactstrap/lib/FormText';

// ugly regular expression for validate length of phone number
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
};

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
  }

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

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
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      // confirmPasswordLabel,
      // confirmPasswordInputProps,
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
              style={{ width: 60, height: 60, cursor: 'pointer' }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}
        <FormGroup>
          <Label for={usernameLabel}>{usernameLabel}</Label>
          {this.state.errors.mobileNumber.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
          <Input name="mobileNumber" {...usernameInputProps} onChange={this.handleChange} autoComplete="off"/>
        </FormGroup>
        <FormGroup>
          <Label for={passwordLabel}>{passwordLabel}</Label>
          {this.state.errors.password.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.password}</FormText>}
          <Input name="password" {...passwordInputProps} onChange={this.handleChange} autoComplete="off"/>
        </FormGroup>
        {/*{this.isSignup && (*/}
        {/*  <FormGroup>*/}
        {/*    <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>*/}
        {/*    <Input {...confirmPasswordInputProps} />*/}
        {/*  </FormGroup>*/}
        {/*)}*/}
        <FormGroup check>
          <Label check>
            <Input type="checkbox"/>{' '}
            {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
          </Label>
        </FormGroup>
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
            type="submit">
            {this.renderButtonText()}
          </Button>}

        {/*<div className="text-center pt-1">*/}
        {/*  <h6>or</h6>*/}
        {/*  <h6>*/}
        {/*    {this.isSignup ? (*/}
        {/*      <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>*/}
        {/*        Login*/}
        {/*      </a>*/}
        {/*    ) : (*/}
        {/*      <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>*/}
        {/*        Signup*/}
        {/*      </a>*/}
        {/*    )}*/}
        {/*  </h6>*/}
        {/*</div>*/}

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
  usernameLabel: 'Mobile number',
  usernameInputProps: {
    type: 'text',
    placeholder: '0**********'
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password'
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password'
  },
  onLogoClick: () => {
  }
};

export default AuthForm;
