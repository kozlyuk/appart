/**
 * User update view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import {
  Button,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Container,
  CustomInput,
  Form,
  FormGroup,
  FormText,
  Input,
  Label
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import Page from '../../components/Page';
import UserService from '../../services/UserService';

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

export default class UserUpdate extends AbstractFormView {
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
      // defaultInactiveBtn: true,
      errors: {
        mobileNumber: '',
        first_name: '',
        last_name: '',
        email: '',
        birthday: '',
        avatarFormat: '',
        avatarSize: ''
      },
      fieldError: {
        username: '',
        mobile_number: '',
        email: '',
        birth_date: '',
        avatar: '',
        theme: '',
        first_name: '',
        last_name: ''
      }
    };
    this.dataUrl = process.env.REACT_APP_USERS_URL;
    if (this.props.match) {
      this._postUrl = process.env.REACT_APP_USERS_URL + this.props.match.params.id + '/';
    }
    this.requestType = 'put';
    this.successRedirect = '/user';
    this._successButton = 'Повернутися до списку користувачів';
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
  collectData(target) {
    return (
      UserService.getFormData(
        document.forms.userUpdate,
        this.state.data.is_staff,
        this.state.data.is_active
      )
    );
  }

  /**
   * Switch toggler
   *
   * @param {UserUpdate} event
   * @param {string} name
   */
  switchToggler(event, name) {
    let prevState = { ...this.state.data };
    switch (name) {
      case name = 'is_staff':
        prevState.is_staff = !this.state.data.is_staff;
        this.setState({ data: prevState });
        break;
      case name = 'is_active':
        prevState.is_active = !this.state.data.is_active;
        this.setState({ data: prevState });
        break;
      default:
        break;
    }
  }

  /**
   * Form field validation
   * handleChange(event): void
   *
   * check field valid and
   * set errors str to state
   *
   * @param event
   */
  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    this.setState({ errors, ['defaultInactiveBtn']: false });
    switch (name) {
      case 'mobile_number':
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
      case 'first_name':
        errors.first_name =
          value.length < 1
            ? [<Text text="global.validateErrors.first_name"/>]
            : '';
        break;
      case 'last_name':
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

  content() {
    return (
      <Fragment>
        <CardHeader><Text text="userForm.title"/>: {this.state.data.first_name} {this.state.data.last_name}</CardHeader>
        <CardBody>
          <Form id="userUpdate" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="mobile_number"><Text text="userForm.mobileNumber"/></Label>
              {this.state.errors.mobileNumber.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
              <Input
                className={this.state.fieldError.mobile_number && 'is-invalid'}
                name="mobile_number"
                id="mobile_number"
                value={this.state.data.mobile_number}
                onChange={this.handleChange}
                readOnly
              />
              {this.state.fieldError.mobile_number &&
              <div className="invalid-feedback">
                {this.state.fieldError.mobile_number}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="first_name"><Text text="userForm.firstName"/></Label>
              {this.state.errors.first_name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.first_name}</FormText>}
              <Input
                className={this.state.fieldError.first_name && 'is-invalid'}
                id="first_name"
                type="text"
                name="first_name"
                defaultValue={this.state.data.first_name}
                onChange={this.handleChange}
              />
              {this.state.fieldError.first_name &&
              <div className="invalid-feedback">
                {this.state.fieldError.first_name}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="last_name"><Text text="userForm.lastName"/></Label>
              {this.state.errors.last_name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.last_name}</FormText>}
              <Input
                className={this.state.fieldError.last_name && 'is-invalid'}
                type="text"
                id="last_name"
                name="last_name"
                defaultValue={this.state.data.last_name}
                onChange={this.handleChange}
              />
              {this.state.fieldError.last_name &&
              <div className="invalid-feedback">
                {this.state.fieldError.last_name}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="email"><Text text="userForm.email"/></Label>
              {this.state.errors.email.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.email}</FormText>}
              <Input
                className={this.state.fieldError.email && 'is-invalid'}
                id="email"
                type="email"
                name="email"
                defaultValue={this.state.data.email}
                onChange={this.handleChange}
              />
              {this.state.fieldError.email &&
              <div className="invalid-feedback">
                {this.state.fieldError.email}
              </div>
              }
            </FormGroup>
            {/*<FormGroup>*/}
            {/*  <Label for="birthday"><Text text="userForm.birthDate"/></Label>*/}
            {/*  {this.state.errors.birthday.length > 0 &&*/}
            {/*  // error field*/}
            {/*  <FormText color="danger">{this.state.errors.birthday}</FormText>}*/}
            {/*  <Input*/}
            {/*    className={this.state.fieldError.birth_date && 'is-invalid'}*/}
            {/*    type="date"*/}
            {/*    name="birthday"*/}
            {/*    defaultValue={this.state.data.birth_date}*/}
            {/*    onChange={this.handleChange}*/}
            {/*  />*/}
            {/*  {this.state.fieldError.birth_date &&*/}
            {/*  <div className="invalid-feedback">*/}
            {/*    {this.state.fieldError.birth_date}*/}
            {/*  </div>*/}
            {/*  }*/}
            {/*</FormGroup>*/}
            {/*<FormGroup>*/}
            {/*  <Label for="avatar"><Text text="userForm.avatar"/></Label>*/}
            {/*  {this.state.errors.avatarFormat.length > 0 &&*/}
            {/*  // error field*/}
            {/*  <FormText color="danger">{this.state.errors.avatarFormat}</FormText>}*/}
            {/*  {this.state.errors.avatarSize.length > 0 &&*/}
            {/*  // error field*/}
            {/*  <FormText color="danger">{this.state.errors.avatarSize}</FormText>}*/}
            {/*  <Input*/}
            {/*    className={this.state.fieldError.avatar && 'is-invalid'}*/}
            {/*    type="file"*/}
            {/*    name="avatar"*/}
            {/*    onChange={this.handleChange}*/}
            {/*  />*/}
            {/*  {this.state.fieldError.avatar &&*/}
            {/*  <div className="invalid-feedback">*/}
            {/*    {this.state.fieldError.avatar}*/}
            {/*  </div>*/}
            {/*  }*/}
            {/*</FormGroup>*/}
            <FormGroup>
              <Label for="exampleCheckbox">Права доступу</Label>
              <div>
                <CustomInput
                  type="switch"
                  id="is_active"
                  name="is_active"
                  label="Активний"
                  checked={this.state.data.is_active}
                  onChange={() => this.switchToggler(this, 'is_active')}
                />
                <FormText color="muted">
                  Користувач матиме доступ до особистого кабінету
                </FormText>
                <CustomInput
                  type="switch"
                  id="is_staff"
                  name="is_staff"
                  label="Персонал"
                  checked={this.state.data.is_staff}
                  onChange={() => this.switchToggler(this, 'is_staff')}
                />
                <FormText color="muted">
                  Користувач матиме доступ до адмін сторінки
                </FormText>
              </div>
            </FormGroup>
            <ButtonToolbar>
              <Link to="/user">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
              <Link className="mx-auto" to={`delete`}>
                <Button color="danger">
                  <Text text="userList.tableHeader.deleteBtn"/>
                </Button>
              </Link>
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
            </ButtonToolbar>
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
    const { error, isLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <h3 className="text-center text-muted">
            <Text text="global.loading"/>
          </h3>
        </div>)
        ;
    } else {

      return (
        <Page
          breadcrumbs={[{ name: <Text text="sidebar.user"/>, active: false },
            { name: this.state.data.first_name + ' ' + this.state.data.last_name, active: true }]}
          className="TablePage"
        >
          <Container>
            <Card>
              {this.content()}
            </Card>
          </Container>
        </Page>
      );
    }
  }
};
