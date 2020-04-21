/**
 * Bill update view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

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

export default class BillUpdate extends AbstractFormView {
  /**
   * Bill constructor
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
    this.dataUrl = process.env.REACT_APP_BILLS;
    this.requestType = 'put';
  }

  /**
   * Collect data before submit
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
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  content() {
    return (
      <Fragment>
        <CardHeader>{this.state.data.number}</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="apartment">Apartment</Label>
              <Input
                name="apartment"
                type="text"
                value={this.state.data.apartment}
                onChange={this.handleChange}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="number">Number</Label>
              <Input
                type="text"
                name="number"
                defaultValue={this.state.data.number}
                onChange={this.handleChange}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="total_value">Total value</Label>
              <Input
                type="number"
                name="total_value"
                defaultValue={this.state.data.total_value}
                onChange={this.handleChange}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="period">Period</Label>
              <Input
                type="text"
                name="period"
                defaultValue={this.state.data.period}
                onChange={this.handleChange}
                disabled
              />
            </FormGroup>
            <ListGroup className="mb-3">
              <ListGroupItem disabled className="justify-content-between">Purpose:</ListGroupItem>
              {this.state.data.bill_lines.map(item => {
                return (
                  <>
                    <ListGroupItem className="justify-content-between">
                      Попередня заборгованість <Badge pill>{item.previous_debt}</Badge>
                    </ListGroupItem>
                    <ListGroupItem className="justify-content-between">
                      Загальна заборгованість <Badge pill>{item.total_debt}</Badge>
                    </ListGroupItem>
                    <ListGroupItem className="justify-content-between">
                      Загально <Badge pill>{item.value}</Badge>
                    </ListGroupItem>
                  </>);
              })}
            </ListGroup>
            <Link to="/bill">
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
          breadcrumbs={[{ name: <Text text="sidebar.bills"/>, active: false },
            { name: this.state.data.number, active: true }]}
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
