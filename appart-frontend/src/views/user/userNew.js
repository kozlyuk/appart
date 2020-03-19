import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';

/**
 * ugly regular expression for validate length of phone number
 *
 * @type {RegExp}
 */
// eslint-disable-next-line
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

/**
 * ugly regular expression for validate email
 *
 * @type {RegExp}
 */
// eslint-disable-next-line
const validEmailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

export default class UserNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      // validation fields
      password: '',
      mobileNumber: '',
      errors: {
        mobileNumber: true,
        first_name: '',
        last_name: '',
        email: true,
        birthday: '',
        avatarFormat: '',
        avatarSize: ''
      }
    };
    this.dataUrl = undefined;
    this.postUrl = process.env.REACT_APP_USERS_URL;
    this.requestType = 'post';
  }

  /**
   *
   * @param event
   * @returns {*}
   */
  uploadFileValidationFormat(event) {
    return event.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/);
  }

  /**
   *
   * @param event
   * @returns {boolean}
   */
  uploadFileValidationSize(event) {
    return Math.round((event.target.files[0].size / 1000)) < 5000;
  }

  /**
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    const userFormData = new FormData();
    // dict of all elements
    userFormData.append('mobile_number', target.mobileNumber.value);
    userFormData.append('first_name', target.firstName.value);
    userFormData.append('last_name', target.lastName.value);
    userFormData.append('email', target.email.value);
    userFormData.append('birthday', target.birthday.value);
    if (target.avatar.files[0]) {
      userFormData.append('avatar', target.avatar.files[0]);
    }
    return userFormData;
  }

  handleSubmit() {
    console.log('new user');
  }

  /*
   * Form field validation
   * handleChange(event): void
   *
   * check field valid and
   * set errors str to state
   *
   * @param event
   **/
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case 'mobileNumber':
        errors.mobileNumber =
          (validPhoneRegex.test(value) && value.length === 10)
            ? ''
            : [<Text text="global.validateErrors.mobileNumber"/>];
        break;
      case 'password':
        errors.password =
          value.length < 6
            ? [<Text text="global.validateErrors.password"/>]
            : '';
        break;
      case 'firstName':
        errors.first_name =
          value.length < 1
            ? [<Text text="global.validateErrors.first_name"/>]
            : '';
        break;
      case 'lastName':
        errors.last_name =
          value.length < 1
            ? [<Text text="global.validateErrors.last_name"/>]
            : '';
        break;
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : [<Text text="global.validateErrors.email"/>];
        break;
      case 'avatar':
        errors.avatarFormat =
          this.uploadFileValidationFormat(event)
            ? ''
            : [<Text text="global.validateErrors.pictureExtension"/>];
        errors.avatarSize =
          this.uploadFileValidationSize(event)
            ? ''
            : [<Text text="global.validateErrors.pictureSize"/>];
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  update() {
    if (this.props.mobileNumber) {
      this.setState({
        mobileNumber: this.props.mobileNumber,
        errors: {
          mobileNumber: '',
          first_name: '',
          last_name: '',
          email: true,
          birthday: '',
          avatar: ''
        }
      });
    }
  }

  content() {
    return (
      <Fragment>
        <CardHeader><Text text="userForm.newUser.title"/></CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            {this.props.mobileNumber ?
              <FormGroup>
                <Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
                {this.state.errors.mobileNumber.length > 0 &&
                // error field
                <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
                <Input
                  name="mobileNumber"
                  type="number"
                  defaultValue={this.props.mobileNumber}
                  onChange={this.handleChange}
                />
              </FormGroup>
              :
              <FormGroup>
                <Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
                {this.state.errors.mobileNumber.length > 0 &&
                // error field
                <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
                <Input
                  name="mobileNumber"
                  type="number"
                  onChange={this.handleChange}
                />
              </FormGroup>
            }
            <FormGroup>
              <Label for="firstName"><Text text="userForm.firstName"/></Label>
              {this.state.errors.first_name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.first_name}</FormText>}
              <Input
                type="text"
                name="firstName"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastName"><Text text="userForm.lastName"/></Label>
              {this.state.errors.last_name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.last_name}</FormText>}
              <Input
                type="text"
                name="lastName"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email"><Text text="userForm.email"/></Label>
              {this.state.errors.email.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.email}</FormText>}
              <Input
                type="email"
                name="email"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="birthday"><Text text="userForm.birthDate"/></Label>
              {this.state.errors.birthday.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.birthday}</FormText>}
              <Input
                type="date"
                name="birthday"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="avatar"><Text text="userForm.avatar"/></Label>
              {this.state.errors.avatarFormat.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.avatarFormat}</FormText>}
              {this.state.errors.avatarSize.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.avatarSize}</FormText>}
              <Input
                type="file"
                name="avatar"
                onChange={this.handleChange}
              />
              <FormText color="muted">
                {/*This is some placeholder block-level help text for the above*/}
                {/*input. It's a bit lighter and easily wraps to a new line.*/}
              </FormText>
            </FormGroup>
            {this.props.hasCloseBtn ?
              <Button color="warning" onClick={this.props.hasCloseBtn}>
                <Text text="buttons.closeBtn"/>
              </Button>
              :
              <Link to="/user">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
            }
            {this.state.defaultInactiveBtn ||
            this.state.errors.mobileNumber ||
            this.state.errors.first_name ||
            this.state.errors.last_name ||
            this.state.errors.email ||
            this.state.errors.birthday ||
            this.state.errors.avatarSize ||
            this.state.errors.avatarFormat ?
              <Button disabled className="float-right">
                <Text text="buttons.submitBtn"/>
              </Button> : <Button className="float-right" type="submit">
                <Text text="buttons.submitBtn"/>
              </Button>
            }
          </Form>
        </CardBody>
      </Fragment>
    );
  }

  /**
   *
   * @returns {*}
   */
  render() {
    return (
      <Fragment>
        {this.props.containerDisable ?
          <Card>
            {this.content()}
          </Card>
          :
          <Page
            breadcrumbs={[{ name: <Text text="sidebar.user"/>, active: false },
              { name: <Text text="userForm.newUser.title"/>, active: true }]}
            className="TablePage"
          >
            <Container>
              <Card>
                {this.content()}
              </Card>
            </Container>
          </Page>
        }
      </Fragment>
    );
  }
}