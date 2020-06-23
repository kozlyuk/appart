/**
 * Work update view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import { Button, Card, CardBody, CardHeader, Container, Form } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import Page from '../../components/Page';
import Auth from '../../auth/auth';
import InputWithLabel from '../../components/FormInputs/InputWithLabel';
import SelectWithChoices from '../../components/FormInputs/SelectWithChoices';

export default class WorkUpdate extends AbstractFormView {
  /**
   * Work update constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rangeValue: null,
      // validation fields
      password: '',
      duration: null,
      mobileNumber: '',
      // defaultInactiveBtn: true,
      nameRequired: true,
      price_codeRequired: true,
      errors: {
        name: '',
        price_code: '',
        price: ''
      }
    };
    /**
     * User object.
     *
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
    if (this.props.match.params.id) {
      this.dataUrl = process.env.REACT_APP_WORKS;
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_WORKS + this.props.match.params.id + '/';
      this.requestType = 'put';

    } else {
      this.dataUrl = undefined;
      this.requestType = 'post';
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_WORKS;
    }
    this.successRedirect = '/dashboard/work';
    /**
     * @type {string}
     * @private
     */
    this._successButton = 'Повернутися до списку робіт';
  }

  /**
   * Collect data before submit
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    return new FormData(document.forms.workForm);
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
      case 'name':
        errors.name =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        this.setState({ nameRequired: false });
        break;
      case 'price_code':
        errors.price_code =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        this.setState({ price_codeRequired: false });
        break;
      case 'price':
        errors.price =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  /**
   * @param {string} max
   * @param {string} min
   * @private
   */
  _getTimeRangeOptionsValue(max, min) {
    const [maxValueArr, minValueArr] = [
      max.toString().split(':'),
      min.toString().split(':')
    ];
    const halfHours = ['00', '30'];
    let times = [];
    for (let i = parseInt(minValueArr[0]); i <= parseInt(maxValueArr[0]); i++) {
      if (i === parseInt(maxValueArr[0])) {
        for (let j = parseInt(minValueArr[1]); j < 1; j++) {
          times.push(('0' + i).slice(-2) + ':' + halfHours[j]);
        }
      } else {
        for (let j = parseInt(minValueArr[1]); j < 2; j++) {
          times.push(('0' + i).slice(-2) + ':' + halfHours[j]);
        }
      }
    }
    this.setState({ duration: times });
  }

  /**
   * @return {*}
   */
  componentDidMount() {
    this._getTimeRangeOptionsValue('8:00', '1:00');
    if (this.props.match.params.id) {
      this._getTimeRangeOptionsValue('8:00', '1:00');
      return super.componentDidMount();
    } else {
      this.setState({
        isLoaded: true,
        data: {
          name: '',
          price_code: '',
          price: '',
          description: ''
        }
      });
    }
  }

  /**
   * @private
   * @param {string} date input date
   * @param {string} parameter format parameter
   */
  _reformatDate(date, parameter) {
    if (this.props.match.params.id) {
      if (parameter === 'woSeconds') {
        return date.substring(0, date.length - 3);
      }
      if (parameter === 'wSeconds') {
        return date += ':00';
      }
    } else {
      if (parameter === 'wSeconds') {
        return date += ':00';
      }
    }
  }

  content() {
    return (
      <Fragment>
        <CardHeader>{this.state.data.name ? this.state.data.name : 'Нова робота'}</CardHeader>
        <CardBody>
          <Form id="workForm" onSubmit={this.handleSubmit}>
            <InputWithLabel
              name={'name'}
              label={<Text text="workForm.name"/>}
              type={'text'}
              error={this.state.errors.name}
              onChange={this.handleChange}
              defaultValue={this.state.data.name}
            />
            <InputWithLabel
              name={'price_code'}
              label={<Text text="workForm.priceCode"/>}
              type={'text'}
              error={this.state.errors.price_code}
              onChange={this.handleChange}
              defaultValue={this.state.data.price_code}
            />
            <InputWithLabel
              name={'price'}
              label={<Text text="workForm.price"/>}
              type={'number'}
              error={this.state.errors.price}
              onChange={this.handleChange}
              defaultValue={this.state.data.price}
            />
            <InputWithLabel
              name={'description'}
              label={<Text text="workForm.description"/>}
              type={'textarea'}
              error={this.state.errors.description}
              onChange={this.handleChange}
              defaultValue={this.state.data.description}
            />
            <SelectWithChoices
              name={'duration'}
              label={<Text text="workForm.duration"/>}
              type={'select'}
              error={this.state.errors.duration}
              onChange={this.handleChange}
            >
              {this.state.duration.map(item => (
                <option selected={this._reformatDate(this.state.data.duration, 'woSeconds') === item}
                        key={item}
                        value={this._reformatDate(item, 'wSeconds')}
                >
                  {item}
                </option>
              ))}
            </SelectWithChoices>
            <Link to="/dashboard/work">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            {!this.props.match.params.id ?
              this.state.nameRequired ||
              this.state.price_codeRequired ?
                <Button disabled className="float-right">
                  <Text text="buttons.submitBtn"/>
                </Button> :
                <Button type="submit" color="success" onClick={this.handleSubmit} className="float-right">
                  <Text text="buttons.submitBtn"/>
                </Button>
              :
              <Button type="submit" color="success" onClick={this.handleSubmit} className="float-right">
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
