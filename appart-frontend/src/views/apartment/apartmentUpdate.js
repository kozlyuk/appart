import React, { Fragment } from 'react';
import {
  Alert,
  Button,
  ButtonToolbar,
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
import AbstractFormView from '../../generics/formViews/abstractFormView';
import ApartmentPhoneChecker from '../../utils/apartmentPhoneChecker';
import Page from '../../components/Page';

export default class ApartmentUpdate extends AbstractFormView {

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
      residentData: '',
      residentIsPinned: '',
      residentIdIsPinned: '',
      addedUserToForm: '',
      enableNativeMobileInput: false,
      errors: {
        house: '',
        resident: '',
        number: '',
        description: '',
        area: '',
        resident_count: '',
        account_number: ''
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
      },
      houseWithResident: false
    };
    this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
    if (this.props.match) {
      this._postUrl = process.env.REACT_APP_APARTMENTS_URL + this.props.match.params.id + '/';
    }
    this.requestType = 'put';
    this.addResidentToAppartment.bind(this);
    this.successRedirect = '/dashboard/apartment';
    this._successButton = 'Повернутися до списку апартаментів';
  }

  /**
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    const userFormData = new FormData();
    // dict of all elements
    userFormData.append('house', this.state.data.house);
    userFormData.append('number', target.number.value);
    userFormData.append('description', target.description.value);
    userFormData.append('area', target.area.value);
    userFormData.append('residents_count', target.residentCount.value);
    userFormData.append('account_number', target.account_number.value);
    if (this.state.residentIsPinned) {
      userFormData.append('resident', this.state.residentIdIsPinned);
    }
    return userFormData;
  }

  handleSubmit() {
    console.log('update apartment');
  }

  /**
   *
   * @param value
   */
  getResidentData = (value) => {
    this.setState({
      residentData: {
        pk: value['pk'],
        first_name: value['first_name'],
        last_name: value['last_name'],
        mobile_number: value['mobile_number']
      }
    });
  };

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
      case 'house':
        errors.house =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        break;
      case 'number':
        errors.number =
          value < 0
            ? [<Text text="global.validateErrors.apartmentNumber"/>]
            : '';
        break;
      case 'area':
        errors.area =
          value.length < 1 || value <= '0'
            ? [<Text text="global.validateErrors.apartmentArea"/>]
            : '';
        break;
      case 'residentCount':
        errors.resident_count =
          value < '0'
            ? [<Text text="global.validateErrors.incorrectNumber"/>]
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
        <CardHeader><Text text="apartmentForm.title"/> №{this.state.data.number}</CardHeader>
        <CardBody>
          <Form id="apartmentForm" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="house"><Text text="apartmentForm.house"/></Label>
              {this.state.errors.house.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.house}</FormText>}
              <Input
                className={this.state.fieldError.house && 'is-invalid'}
                type="text"
                name="house"
                disabled
                onChange={this.handleChange}
                defaultValue={this.state.data.house_name}
              />
              <input name="house" type="hidden" value={this.state.data.house}/>
              {this.state.fieldError.house &&
              <div className="invalid-feedback">
                {this.state.fieldError.house}
              </div>
              }
            </FormGroup>
            {this.state.data.resident_name &&
            <FormGroup>
              <Label for="resident">Житель</Label>
              <Input
                className={this.state.fieldError.resident && 'is-invalid'}
                id="resident"
                type="tel"
                name="resident"
                readOnly
                defaultValue={this.state.data.resident_name}
              />
              {this.state.fieldError.resident &&
              <div className="invalid-feedback">
                {this.state.fieldError.resident}
              </div>
              }
            </FormGroup>
            }
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
            {this.state.enableNativeMobileInput &&
            <FormGroup>
              <Label for="resident"><Text text="apartmentForm.resident"/></Label>
              <Input
                className={this.state.fieldError.resident && 'is-invalid'}
                id="resident"
                type="tel"
                name="resident"
                readOnly
                defaultValue={this.state.data.resident_phone}
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
              При збереженні форми, користувача з номером {this.state.residentIsPinned} буде додано до апартаментів.
            </Alert>
            }
            <FormGroup>
              <Label for="account_number"><Text text="apartmentForm.accountNumber"/></Label>
              {this.state.errors.account_number.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.account_number}</FormText>}
              <Input
                className={this.state.fieldError.account_number && 'is-invalid'}
                type="text"
                name="account_number"
                onChange={this.handleChange}
                defaultValue={this.state.data.account_number}
              />
              {this.state.fieldError.account_number &&
              <div className="invalid-feedback">
                {this.state.fieldError.account_number}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="number"><Text text="apartmentForm.number"/></Label>
              {this.state.errors.number.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.number}</FormText>}
              <Input
                className={this.state.fieldError.number && 'is-invalid'}
                type="number"
                name="number"
                min="0"
                onChange={this.handleChange}
                defaultValue={this.state.data.number}
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
                name="area"
                min="0"
                onChange={this.handleChange}
                defaultValue={this.state.data.area}
              />
              {this.state.fieldError.area &&
              <div className="invalid-feedback">
                {this.state.fieldError.area}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="residentCount"><Text text="apartmentForm.residentCount"/></Label>
              {this.state.errors.resident_count.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.resident_count}</FormText>}
              <Input
                className={this.state.fieldError.residents_count && 'is-invalid'}
                id="residentCount"
                type="number"
                name="residentCount"
                min="0"
                onChange={this.handleChange}
                defaultValue={this.state.data.residents_count}
              />
              {this.state.fieldError.residents_count &&
              <div className="invalid-feedback">
                {this.state.fieldError.residents_count}
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
                defaultValue={this.state.data.description}
              />
              {this.state.fieldError.description &&
              <div className="invalid-feedback">
                {this.state.fieldError.description}
              </div>
              }
            </FormGroup>
            <ButtonToolbar>
              <Link to="/dashboard/apartment">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
              {this.state.errors.house ||
              this.state.errors.resident ||
              this.state.errors.number ||
              this.state.errors.description ||
              this.state.errors.area ||
              this.state.errors.resident_count ?
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
          <Row>
            <Col xl={7}>
              <Card>
                {this.content()}
              </Card>
            </Col>
            <Col xl={5}>
              <Card>
                <CardBody>
                  <ApartmentPhoneChecker
                    data={this.state.data}
                    addResidentToAppartment={this.addResidentToAppartment}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      );
    }
  }
};
