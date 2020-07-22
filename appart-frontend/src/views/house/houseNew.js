import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import axios from 'axios';
import SelectWithChoices from '../../components/FormInput/SelectWithChoices';
import HouseController from '../../controllers/HouseController';

export default class HouseNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      // validation fields
      password: '',
      mobileNumber: '',
      errors: {
        description: '',
        address: true,
        name: true,
        photoFormat: '',
        photoSize: ''
      },
      fieldError: {
        name: '',
        address: '',
        logo: '',
        description: ''
      }
    };
    this.dataUrl = undefined;
    this.postUrl = process.env.REACT_APP_HOUSES_URL;
    this.requestType = 'post';
    this.successRedirect = '/dashboard/house';
    this._successButton = 'Повернутися до списку будинків';
    this.HouseController = new HouseController();
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

  secondaryLoadData() {
    Promise.all(this.HouseController.getCompanyPromise())
      .then(axios.spread((
        companies
      ) => {
        this.setState({
          isSecondaryLoaded: true,
          companies: companies.data
        });
      }));
  }

  /**
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    return new FormData(document.forms.userCreate);
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
    switch (name) {
      case 'address':
        errors.address =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        break;
      case 'name':
        errors.name =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        break;
      case 'logo':
        errors.photoFormat =
          this.uploadFileValidationFormat(event)
            ? ''
            : [<Text text="global.validateErrors.pictureExtension"/>];
        errors.photoSize =
          this.uploadFileValidationSize(event)
            ? ''
            : [<Text text="global.validateErrors.pictureSize"/>];
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
        <CardHeader><Text text="houseForm.newHouse.title"/></CardHeader>
        <CardBody>
          <Form id="userCreate" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name"><Text text="houseForm.name"/></Label>
              {this.state.errors.name.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.name}</FormText>}
              <Input
                className={this.state.fieldError.name && 'is-invalid'}
                id="name"
                type="text"
                name="name"
                onChange={this.handleChange}
              />
              {this.state.fieldError.name &&
              <div className="invalid-feedback">
                {this.state.fieldError.name}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="address"><Text text="houseForm.address"/></Label>
              {this.state.errors.address.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.address}</FormText>}
              <Input
                className={this.state.fieldError.address && 'is-invalid'}
                id="address"
                type="text"
                name="address"
                onChange={this.handleChange}
              />
              {this.state.fieldError.address &&
              <div className="invalid-feedback">
                {this.state.fieldError.address}
              </div>
              }
            </FormGroup>
            <SelectWithChoices
              name={'company'}
              label={'Компанія'}
              error={this.state.fieldError.company}
            >
              {this.state.companies.map((item) => (
                <option key={item.pk} value={item.pk}>{item.name}</option>
              ))}
            </SelectWithChoices>
            <FormGroup>
              <Label for="logo"><Text text="houseForm.photo"/></Label>
              {this.state.errors.photoFormat.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.photoFormat}</FormText>}
              {this.state.errors.photoSize.length > 0 &&
              // error field
              <FormText color="danger">{this.state.errors.photoSize}</FormText>}
              <Input
                className={this.state.fieldError.logo && 'is-invalid'}
                id="logo"
                type="file"
                name="logo"
                onChange={this.handleChange}
              />
              {this.state.fieldError.logo &&
              <div className="invalid-feedback">
                {this.state.fieldError.logo}
              </div>
              }
            </FormGroup>
            <FormGroup>
              <Label for="description"><Text text="houseForm.description"/></Label>
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

            <Link to="/dashboard/house">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            {this.state.errors.address ||
            this.state.errors.name ||
            this.state.errors.photoSize ||
            this.state.errors.photoFormat ?
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
    const { error, isSecondaryLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isSecondaryLoaded) {
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
}