/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Auth from '../../auth/auth';
import PageSpinner from '../../components/PageSpinner';

export default class OrderNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      errors: {
        description: true
      }
    };
    this.dataUrl = undefined;
    this._user = new Auth();
    this.postUrl = process.env.REACT_APP_ORDER;
    this.requestType = 'post';
    this.successRedirect = '/cabinet';
    this._successButton = 'Повернутися до кабінету';
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
  _handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case 'information':
        errors.description =
          value.length < 1
            ? [<Text text="global.validateErrors.description"/>]
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  /**
   * Set data to state
   *
   * @param works
   * @param user
   * @private
   */
  _setData(works, user) {
    this.setState({
      userData: user.data,
      workData: works.data,
      isLoaded: true
    });
  }

  /**
   * Set error to state
   *
   * @param error
   * @private
   */
  _setError(error) {
    this.setState({
      error: error
    });
  }

  /**
   * Prepare a data
   *
   * @param target
   * @return {FormData}
   */
  collectData(target) {
    return new FormData(document.forms.newOrder);
  }

  componentDidMount() {
    const worksEndpoint = process.env.REACT_APP_WORKS;
    const userEndpoint = process.env.REACT_APP_USER_DATA;
    const headers = {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    };

    const worksPromise = axios.get(worksEndpoint, headers);
    const userPromise = axios.get(userEndpoint, headers);

    Promise.all([worksPromise, userPromise])
      .then(axios.spread((works, user) => {
        this._setData(works, user);
      }))
      .catch(error => {
        this._setError(error);
      });
  }

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Fragment>
        <CardHeader>Order</CardHeader>
        <CardBody>
          <Form id="newOrder" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="work">Назва роботи</Label>
              <Input
                type="select"
                name="work"
                id="work"
              >
                {this.state.workData.results.map(option => (
                  <option key={option.pk} value={option.pk}>
                    {option.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="apartment">Номер апартаментів</Label>
              <Input
                type="select"
                name="apartment"
                id="apartment"
              >
                {this.state.userData.apartment.map(option => (
                  <option key={option.pk} value={option.pk}>
                    {option.number}, {option.house}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="information">Опис</Label>
              <Input
                className={this.state.errors.description.length && 'is-invalid'}
                id="information"
                type="textarea"
                name="information"
                onChange={this._handleChange}
              />
              {this.state.errors.description &&
              // error field
              <FormText color="danger">{this.state.errors.description}</FormText>}
            </FormGroup>

            <Link to="/cabinet">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            {this.state.errors.description ?
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
        <Container>
          <Card>
            {this.content()}
          </Card>
        </Container>
      );
    }
  }
}