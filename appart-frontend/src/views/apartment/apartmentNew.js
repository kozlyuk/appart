import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';

import Page from '../../components/Page';
import ApartmentPhoneChecker from '../../utils/apartmentPhoneChecker';
import axios from 'axios';
import PageSpinner from '../../components/PageSpinner';


export default class ApartmentNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      resident: '',
      residentIsPinned: '',
      residentIdIsPinned: '',
      addedUserToForm: '',
      enableNativeMobileInput: true,
      houseData: '',
      errors: {
        house: '',
        resident: '',
        number: true,
        description: '',
        area: true,
        resident_count: ''
      },
      fieldError: {
        house: '',
        resident: '',
        number: '',
        account_number: '',
        area: '',
        residents_count: '',
        description: '',
        is_active: '',
        debt: ''
      }
    };
    this.dataUrl = undefined;
    this.postUrl = process.env.REACT_APP_APARTMENTS_URL;
    this.requestType = 'post';
    this.successRedirect = '/dashboard/apartment';
    this._successButton = 'Повернутися до списку апартаментів';
  }

  secondaryLoadData() {
    axios(process.env.REACT_APP_HOUSES_URL, {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            houseData: result.data
          });
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
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    const userFormData = new FormData();
    // dict of all elements
    userFormData.append('house', target.house.value);
    userFormData.append('number', target.apartmentNumber.value);
    userFormData.append('description', target.description.value);
    userFormData.append('area', target.area.value);
    userFormData.append('residents_count', target.resident_count.value);
    if (this.state.residentIsPinned) {
      userFormData.append('resident', this.state.residentIdIsPinned);
    }
    return userFormData;
  }

  handleSubmit() {
    console.log('new apartment');
  }

  /**
   *
   * @param id
   */
  addResidentToState(id) {
    this.setState({
      resident: id
    });
  }

  /**
   *
   * @param resident_phone
   * @param id
   */
  addResidentToAppartment = (resident_phone, id) => {
    this.setState({
      residentIsPinned: resident_phone,
      residentIdIsPinned: id,
      addedUserToForm: resident_phone,
      enableNativeMobileInput: false
    });
  };

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
    switch (name) {
      case 'apartmentNumber':
        errors.number =
          value.length < 1 || value === '0'
            ? [<Text text="global.validateErrors.apartmentNumber"/>]
            : '';
        break;
      case 'area':
        errors.area =
          value.length < 1 || value === '0'
            ? [<Text text="global.validateErrors.apartmentArea"/>]
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Fragment>
        <CardHeader><Text text="apartmentForm.newApartment.title"/></CardHeader>
        <CardBody>
          <Form id="apartmentCreate" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="house"><Text text="apartmentForm.house"/></Label>
              {this.state.errors.house.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.house}</FormText>}
              <Input
                className={this.state.fieldError.house && 'is-invalid'}
                type="select"
                name="house"
                id="house"
                onChange={this.handleChange}
              >
                {this.state.houseData.results.map(option => (
                  <option key={option.pk} value={option.pk}>
                    {option.name}
                  </option>
                ))}
              </Input>
              {this.state.fieldError.house &&
              <div className="invalid-feedback">
                {this.state.fieldError.house}
              </div>
              }
            </FormGroup>
            {this.state.residentIsPinned &&
            <FormGroup>
              <Label for="resident"><Text text="apartmentForm.resident"/></Label>
              <Input
                className={this.state.fieldError.resident && 'is-invalid'}
                id="resident"
                type="tel"
                name="resident"
                readOnly
                defaultValue={this.state.residentIsPinned}
              />
              {this.state.fieldError.resident &&
              <div className="invalid-feedback">
                {this.state.fieldError.resident}
              </div>
              }
            </FormGroup>
            }
            {this.state.addedUserToForm &&
            <Alert className="mt-2" color="success">
              <Text text="apartmentForm.successUserAddMessage" params={{ user: this.state.residentIsPinned }}/>
            </Alert>
            }
            <FormGroup>
              <Label for="number"><Text text="apartmentForm.number"/></Label>
              {this.state.errors.number.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.number}</FormText>}
              <Input
                className={this.state.fieldError.number && 'is-invalid'}
                id="number"
                type="number"
                min="0"
                name="apartmentNumber"
                onChange={this.handleChange}
              />
              {this.state.fieldError.number &&
              <div className="invalid-feedback">
                {this.state.fieldError.number}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="area"><Text text="apartmentForm.area"/></Label>
              {this.state.errors.area.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.area}</FormText>}
              <Input
                className={this.state.fieldError.area && 'is-invalid'}
                id="area"
                type="number"
                min="0"
                name="area"
                onChange={this.handleChange}
              />
              {this.state.fieldError.area &&
              <div className="invalid-feedback">
                {this.state.fieldError.area}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="resident_count"><Text text="apartmentForm.residentCount"/></Label>
              {this.state.errors.resident_count.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.resident_count}</FormText>}
              <Input
                className={this.state.fieldError.resident_count && 'is-invalid'}
                id="resident_count"
                type="number"
                min="0"
                name="resident_count"
                onChange={this.handleChange}
              />
              {this.state.fieldError.resident_count &&
              <div className="invalid-feedback">
                {this.state.fieldError.resident_count}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="description"><Text text="apartmentForm.description"/></Label>
              {this.state.errors.description.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.description}</FormText>}
              <Input
                className={this.state.fieldError.description && 'is-invalid'}
                id="description"
                type="textarea"
                name="description"
                onChange={this.handleChange}
              />
              {this.state.fieldError.description &&
              <div className="invalid-feedback">
                {this.state.fieldError.description}
              </div>
              }
            </FormGroup>

            <Link to="/dashboard/apartment">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            {this.state.errors.resident ||
            this.state.errors.house ||
            this.state.errors.number ||
            this.state.errors.description ||
            this.state.errors.area ||
            this.state.errors.resident_count ?
              <Button disabled className="float-right">
                <Text text="buttons.submitBtn"/>
              </Button>
              :
              <Button className="float-right" type="submit">
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
    const { error, isLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <Page
          className="TablePage"
        >
          <Row>
            <Col xl={7}>
              <Card>
                {this.content()}
              </Card>
            </Col>
            <Col xl={5}>
              <Card>
                <CardBody>
                  <Form>
                    <FormGroup>
                      <ApartmentPhoneChecker
                        data={this.state.data}
                        addResidentToAppartment={this.addResidentToAppartment}
                      />
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      );
    }
  }
}