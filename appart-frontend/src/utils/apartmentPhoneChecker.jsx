/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import Auth from '../auth/auth';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import UserNew from '../views/user/userNew';

/**
 * ugly regular expression for validate length of phone number
 *
 * @type {RegExp}
 */
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

export default class ApartmentPhoneChecker extends React.Component {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      checkMobileNumber: '',
      mobileNumber: '',
      responseData: '',
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: true,
      userDoesNotExist: '',
      addedUserToForm: false,
      errors: {
        mobileNumber: ''
      }
    };
    this.user = new Auth();
    this.checkByNumberUrl = process.env.REACT_APP_CHECK_BY_NUMBER_URL;
    this.getUserById.bind(this);
  }

  /**
   *
   * @param modalType
   * @returns {function(...[*]=)}
   */
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`]
    });
  };

  /**
   *
   * @param event
   */
  getUserById = (event) => {
    event.preventDefault();
    axios({
      method: 'get',
      url: this.checkByNumberUrl + this.state.mobileNumber + '/',
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    }).then((response) => {
      this.setState({
        responseData: response.data,
        userDoesNotExist: false
      });
    }).catch(() => {
      this.setState({
        responseData: '',
        userDoesNotExist: true
      });
    });
  };

  /**
   *
   * @param event
   */
  addUserPkToForm = (event) => {
    event.preventDefault();
    this.props.addResidentToAppartment(this.state.responseData.mobile_number, this.state.responseData.pk);
  };

  /**
   *
   * @param event
   */
  handleChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    // check valid of input field
    if (validPhoneRegex.test(value) && value.length === 10) {
      this.setState({
          errors: {
            mobileNumber: ''
          },
          mobileNumber: event.target.value
        }
      );
    } else {
      this.setState({
        errors: {
          mobileNumber: [<Text text="global.validateErrors.mobileNumber"/>]
        }
      });
    }
  };

  /**
   *
   * @returns {*}
   */
  render() {
    let responseData;
    if (this.state.responseData) {
      responseData = (
        <Fragment>
          <Card className="flex-row mt-2">
            <CardImg
              className="card-img-left"
              src={process.env.REACT_APP_BACKEND_URL + this.state.responseData.avatar}
              style={{ width: 'auto', height: 150 }}
            />
            <CardBody>
              <CardTitle>{this.state.responseData.first_name} {this.state.responseData.last_name}
                <Link to={`/user/${this.state.responseData.pk}/edit`}><FaExternalLinkAlt className="ml-2"/></Link>
              </CardTitle>
              <CardText>
                <p>email: <strong>{this.state.responseData.email}</strong></p>
                {/*<p>birth_date: <strong>{this.state.responseData.birth_date}</strong></p>*/}
                <Button onClick={this.addUserPkToForm} color="success">Додати користувача до апартаментів</Button>
              </CardText>
            </CardBody>
          </Card>
        </Fragment>
      );
    } else if (this.state.userDoesNotExist) {
      responseData = (
        <Alert className="mt-2" color="danger">
          Користувач з номером {this.state.mobileNumber} відсутній в базі.
        </Alert>
      );
    }

    let userInfo;
    if (this.state.responseData) {
      userInfo = (
        <Card className="flex-row mt-2">
          <CardImg
            className="card-img-left"
            src={process.env.REACT_APP_BACKEND_URL + this.state.responseData.avatar}
            style={{ width: 'auto', height: 150 }}
          />
          <CardBody>
            <CardTitle>{this.state.responseData.first_name} {this.state.responseData.last_name}
              <Link to={`/user/${this.state.responseData.pk}/edit`}><FaExternalLinkAlt className="ml-2"/></Link>
            </CardTitle>
            <CardText>
              <p>email: <strong>{this.state.responseData.email}</strong></p>
              {/*<p>birth_date: <strong>{this.state.responseData.birth_date}</strong></p>*/}
              <Button onClick={this.addUserPkToForm} color="success">Додати користувача до апартаментів</Button>
            </CardText>
          </CardBody>
        </Card>
      );
    } else if (this.state.userDoesNotExist) {
      userInfo = (
        <Alert className="mt-2" color="danger">
          Користувач з номером {this.state.mobileNumber} відсутній в базі.
        </Alert>
      );
    } else {
      userInfo = ('');
    }

    let buttonText = 'Введіть номер телефону для перевірки користувача';
    let ifButtonDisabled = true;
    if (this.state.errors.mobileNumber.length === 0) {
      buttonText = 'Перевірити';
      ifButtonDisabled = false;
    }

    const userCanNotExist = (
      <Fragment>
        <FormGroup>
          <Label for="phoneNumber">Введіть номер телефону жителя, щоб підв'язати його до апартаментів</Label>
          {this.state.errors.mobileNumber.length > 0 &&
          // error field
          <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
          <div>
            <Input
              style={{ width: '120px', display: 'inline-block' }}
              type="tel"
              maxLength="10"
              name="phoneNumber"
              onChange={this.handleChange}
            />
            {this.state.userDoesNotExist &&
            <Button color="success" onClick={this.toggle()}
                    style={{ display: 'inline-block', marginLeft: '10px' }}>+</Button>
            }
            <Button onClick={this.getUserById} disabled={ifButtonDisabled}
                    style={{ display: 'inline-block', marginLeft: '10px' }}>{buttonText}</Button>
          </div>
          {responseData}
        </FormGroup>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle()}
          className={this.props.className}>
          <UserNew mobileNumber={this.state.mobileNumber} hasCloseBtn={this.toggle()} containerDisable/>
        </Modal>
      </Fragment>
    );

    if (!this.props.data) {
      return (userCanNotExist);
    } else if (this.props.data.resident) {
      return (
        <Fragment>
          <FormGroup>
            <Label for="phoneNumber">Номер телефону жителя</Label>
            {this.state.errors.mobileNumber.length > 0 &&
            // error field
            <FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
            <div>
              <Input
                style={{ width: '120px', display: 'inline-block' }}
                type="tel"
                maxLength="10"
                name="phoneNumber"
                onChange={this.handleChange}
                defaultValue={this.props.data.resident_mobile_number}
              />
              {this.state.userDoesNotExist &&
              <Button color="success" onClick={this.toggle()}
                      style={{ display: 'inline-block', marginLeft: '10px' }}>+</Button>
              }
              <Button onClick={this.getUserById} disabled={ifButtonDisabled}
                      style={{ display: 'inline-block', marginLeft: '10px' }}>{buttonText}</Button>
            </div>
            {userInfo}
          </FormGroup>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle()}
            className={this.props.className}>
            <UserNew mobileNumber={this.state.mobileNumber} hasCloseBtn={this.toggle()} containerDisable/>
          </Modal>
        </Fragment>
      );
    } else {
      return (userCanNotExist);
    }
  }
}
