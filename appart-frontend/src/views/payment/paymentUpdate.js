import React, { Fragment } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import AbstractFormView from '../../generics/formViews/abstractFormView';
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

export default class PaymentUpdate extends AbstractFormView {
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
      }
    };
    this.dataUrl = process.env.REACT_APP_PAYMENT;
    this.requestType = 'put';
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

  content() {
    return (
      <Fragment>
        <CardHeader><Text text="paymentForm.header"/> {this.state.data.apartment}</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="apartment"><Text text="paymentForm.apartment"/></Label>
              <Input
                name="apartment"
                type="text"
                value={this.state.data.apartment}
                onChange={this.handleChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="payment_type"><Text text="paymentForm.paymentType"/></Label>
              <Input
                type="text"
                name="payment_type"
                defaultValue={this.state.data.payment_type}
                onChange={this.handleChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="date"><Text text="paymentForm.date"/></Label>
              <Input
                type="text"
                name="date"
                defaultValue={this.state.data.date}
                onChange={this.handleChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="value"><Text text="paymentForm.value"/></Label>
              <Input
                type="text"
                name="value"
                value={this.state.data.value}
                onChange={this.handleChange}
                readOnly
              />
            </FormGroup>
            {!this.state.data.payment_service &&
            <ListGroup className="mb-3">
              <ListGroupItem disabled className="justify-content-between"><Text
                text="paymentForm.purpose"/></ListGroupItem>
              {this.state.data.payment_service.map(item => {
                return (
                  <ListGroupItem className="justify-content-between">{item.service} <Badge
                    pill>{item.value}</Badge></ListGroupItem>
                );
              })}
            </ListGroup>
            }
            <Link to="/dashboard/payment">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
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
