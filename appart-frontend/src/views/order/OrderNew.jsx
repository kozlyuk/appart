/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import Auth from '../../auth/auth';
import PageSpinner from '../../components/PageSpinner';
import { Input } from 'reactstrap';
import FormText from 'reactstrap/lib/FormText';
import { Link } from 'react-router-dom';

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
    this.successRedirect = '/cabinet/service';
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
  submitData(target) {
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
        <div className="pay-form shadow-sm py-4 my-3 bg-white">
          <div className="mx-auto col-xl-8 col-12">
            <form id="newOrder" onSubmit={this.handleSubmit}>
              <div className="form-group form-group-cabinet row align-items-center  ">
                <label htmlFor="work"
                       className="col-sm-4 col row-form-label pr-4 text-sm-right">Назва роботи</label>
                <div className="col-sm-8  my-3">
                  <Input
                    className="form-control form-control-custom"
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
                </div>
              </div>

              <div className="form-group form-group-cabinet row align-items-center">
                <label htmlFor="apartment"
                       className="col-sm-4 col row-form-label pr-4 text-sm-right">Номер апартаментів</label>
                <div className="col-sm-8  my-3">
                  <Input
                    className="form-control form-control-custom"
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
                </div>
              </div>
              <div className="form-group form-group-cabinet row align-items-center">
                <label htmlFor="information"
                       className="col-sm-4 col row-form-label pr-4 text-sm-right">Опис</label>
                <div className="col-sm-8  my-3">
                  <Input
                    className={this.state.errors.description.length ? 'form-control form-control-custom is-invalid' : 'form-control form-control-custom'}
                    type="textarea"
                    name="information"
                    id="information"
                    onChange={this._handleChange}
                  />
                  {this.state.errors.description &&
                  // error field
                  <FormText color="danger">{this.state.errors.description}</FormText>}
                </div>
              </div>
              <div className="form-group form-group-cabinet row align-items-center justify-content-sm-center">
                <div className="col-sm-4 ">
                  <Link to="/cabinet/service">
                    <button className="btn btn-warning mt-3 btn-add">
                      <Text text="buttons.returnBtn"/>
                    </button>
                  </Link>
                </div>
                <div className="col-sm-8 ">
                  <button type="submit" className="btn btn-success mt-3 btn-add">Надіслати</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}