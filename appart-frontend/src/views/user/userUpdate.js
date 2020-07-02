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
import axios from 'axios';

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
      isLoaded: false,
      // validation fields
      password: '',
      mobileNumber: '',
      // defaultInactiveBtn: true,
      groups: [],
      selectedGroups: [],
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
    this.successRedirect = '/dashboard/user';
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
   * @param array
   * @return {[]}
   */
  strArrayToIntArray(array) {
    let resultArray = [];
    array.map(item => {
      resultArray.push(parseInt(item));
    });
    return resultArray;
  }

  /**
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    const groups = [
      this.strArrayToIntArray(this.state.selectedGroups)
    ];
    const userFormData = {
      'mobile_number': target.mobileNumber.value,
      'first_name': target.firstName.value,
      'last_name': target.lastName.value,
      'email': target.email.value,
      'groups': groups[0],
      'is_staff': this.state.data.is_staff,
      'is_active': this.state.data.is_active
    };

    return userFormData;
  }

  /**
   * Switch toggler
   *
   * @param event
   * @param name
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
   * @param event
   */
  onSelectChange = (event) => {
    const values = [...event.target.selectedOptions].map(opt => opt.value);
    console.log(values);
    this.setState({
      selectedGroups: values
    });
  };

  saveGroups() {
    this.setState({
      selectedGroups: this.state.data.groups
    });
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

  loadData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            data: result.data
          });
          this.saveGroups();
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /**
   * @return {Promise<*>}
   */
  async componentDidMount() {
    axios({
      method: 'get',
      url: process.env.REACT_APP_GROUPS,
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(response => {
        this.setState({
          groups: response.data[0]
        });
      })
      .catch(error => {
        console.log(error.response);
      });

    return super.componentDidMount();
  }

  content() {
    return (
      <Fragment>
        <CardHeader><Text text="userForm.title"/>: {this.state.data.first_name} {this.state.data.last_name}</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
              {this.state.errors.mobileNumber.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
              <Input
                className={this.state.fieldError.mobile_number && 'is-invalid'}
                name="mobileNumber"
                disabled
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
                name="firstName"
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
              <Label for="lastName"><Text text="userForm.lastName"/></Label>
              {this.state.errors.last_name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.last_name}</FormText>}
              <Input
                className={this.state.fieldError.last_name && 'is-invalid'}
                type="text"
                name="lastName"
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
            <hr/>
            <FormGroup>
              <Label for=""><Text text="userForm.permissions"/></Label>
              <div>
                <CustomInput
                  type="switch"
                  id="is_active"
                  name={<Text text="userForm.isActive"/>}
                  label="Активний"
                  checked={this.state.data.is_active}
                  onChange={() => this.switchToggler(this, 'is_active')}
                />
                <FormText color="muted">
                  <Text text="userForm.isActiveHelpText"/>
                </FormText>
                <CustomInput
                  type="switch"
                  id="is_staff"
                  name="is_staff"
                  label={<Text text="userForm.isStaff"/>}
                  checked={this.state.data.is_staff}
                  onChange={() => this.switchToggler(this, 'is_staff')}
                />
                <FormText color="muted">
                  <Text text="userForm.isStaffHelpText"/>
                </FormText>
              </div>
            </FormGroup>
            <FormGroup className="mt-3">
              <Label fro="groups">Групи</Label>
              <Input
                required
                onChange={this.onSelectChange}
                defaultValue={this.state.data.groups}
                type="select"
                name="groups"
                id="groups"
                multiple
              >
                {this.state.groups.map(item => (
                  <option key={item[0]} value={item[0]}>{item[1]}</option>
                ))}
              </Input>
            </FormGroup>
            <ButtonToolbar>
              <Link to="/dashboard/user">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
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
                <Button disabled className="ml-auto float-right">
                  <Text text="buttons.submitBtn"/>
                </Button> : <Button className="ml-auto float-right" type="submit">
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
