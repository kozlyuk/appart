/**
 * Bill update view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import Page from '../../components/Page';
import axios from 'axios';
import Auth from '../../auth/auth';
import SelectWithChoices from './components/SelectWithChoices';
import InputWithLabel from './components/InputWithLabel';
import DatePicker from 'reactstrap-date-picker';

export default class OrderForm extends AbstractFormView {
  /**
   * Bill constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      // data objects
      orderData: null,
      worksData: null,
      housesData: null,
      execChoices: null,
      paymentChoices: null,
      apartmentsData: null,
      // validation fields
      password: '',
      mobileNumber: '',
      // defaultInactiveBtn: true,
      isApartmentSelectShow: false
    };

    /**
     * User object.
     *
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
    this.dataUrl = process.env.REACT_APP_ORDER;
    if (this.props.match) {
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_ORDER + this.props.match.params.id + '/';
    }
    this._onHouseItemSelect = this._onHouseItemSelect.bind(this);
    this.requestType = 'put';
    this.successRedirect = '/order';
    this._successButton = 'Повернутися до списку замовлень';
  }

  /**
   * Collect data before submit
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    let orderForm = new FormData(document.forms.orderForm);
    let executorForm = new FormData(document.forms.executorForm);
    orderForm.delete('house');
    let executions = [{
      'pk': this.state.orderData.executions[0].pk,
      'executor': executorForm.get('executor'),
      'exec_status': executorForm.get('exec_status'),
      'scheduled_time': executorForm.get('scheduled_time')

    }];
    executions = JSON.stringify(executions);
    orderForm.set('executions', executions);

    return orderForm;
  }

  /**
   * Set data to state
   *
   * @param {AxiosResponse<Object>} order
   * @param {AxiosResponse<Object>} works
   * @param {AxiosResponse<Object>} houses
   * @param {AxiosResponse<Object>} execChoices
   * @param {AxiosResponse<Object>} paymentChoices
   */
  _setData(
    order,
    works,
    houses,
    execChoices,
    paymentChoices
  ) {
    this.setState({
      orderData: order.data,
      worksData: works.data,
      housesData: houses.data,
      execChoices: execChoices.data,
      paymentChoices: paymentChoices.data,
      isLoaded: true
    });
  }

  /**
   * @return {*}
   * @private
   */
  _onHouseItemSelect(event) {
    this._loadApartments(event.target.value);
    return void 0;
  }

  /**
   * Set error to state
   *
   * @param error
   * @private
   */
  _setError(error) {
    this.setState({ error });
  }

  /**
   * Date picker handle change.
   *
   * @param value
   * @param formattedValue
   */
  handleChange(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
    });
  }

  /**
   * Load apartments data and set to state
   *
   * @private
   * @param housePk
   */
  _loadApartments(housePk) {
    axios(`${process.env.REACT_APP_APARTMENTS_WITHOUT_PAGINATION}?house=${housePk}`, {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isApartmentSelectShow: true,
            apartmentsData: result.data
          });
        },
        error => {
          this.setState({
            isApartmentSelectShow: true,
            error
          });
        }
      );
  }

  componentDidMount() {
    const orderEndpoint = process.env.REACT_APP_ORDER + this.props.match.params.id + '/';
    const workEndpoint = process.env.REACT_APP_WORKS_WITHOUT_PAGINATION;
    const housesEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;
    const execChoicesEndpoint = process.env.REACT_APP_EXECUTION_CHOICES;
    const paymentChoicesEndpoint = process.env.REACT_APP_PAYMENT_CHOICES;
    const headers = {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    };

    /**
     * Execution choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const execChoicesPromise = axios.get(execChoicesEndpoint, headers);
    /**
     * Payment choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const paymentChoicesPromise = axios.get(paymentChoicesEndpoint, headers);
    /**
     * Order promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const orderPromise = axios.get(orderEndpoint, headers);
    /**
     * Works promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const worksPromise = axios.get(workEndpoint, headers);
    /**
     * Houses promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const housesPromise = axios.get(housesEndpoint, headers);

    Promise.all([
      orderPromise,
      worksPromise,
      housesPromise,
      execChoicesPromise,
      paymentChoicesPromise
    ])
      .then(axios.spread((
        order,
        works,
        houses,
        execChoices,
        paymentChoices
      ) => {
        this._setData(
          order,
          works,
          houses,
          execChoices,
          paymentChoices
        );
      }))
      .catch(error => {
        this._setError(error);
      });
  }

  content() {
    return (
      <Fragment>
        <CardHeader>{this.state.orderData.work_name}</CardHeader>
        <CardBody>
          <Form id="orderForm" onSubmit={this.handleSubmit}>
            <SelectWithChoices changeHandler={this._onHouseItemSelect} label="Будинок" name="house">
              {this.state.housesData.map(house => (
                <option selected={parseInt(this.state.orderData.house) === house.pk}
                        key={house.pk}
                        value={house.pk}
                >
                  {house.name}
                </option>
              ))}
            </SelectWithChoices>
            {this.state.isApartmentSelectShow &&
            <SelectWithChoices label="Апартаменти" name="apartment">
              {this.state.apartmentsData.map(apartment => (
                <option selected={this.state.orderData.pk === apartment.pk} key={apartment.pk}
                        value={apartment.pk}>
                  Апартаменти №: {apartment.number} {apartment.resident_name && `Житель: ${apartment.resident_name}`}
                </option>
              ))}
            </SelectWithChoices>
            }
            <SelectWithChoices label="Робота" name="work">
              {this.state.worksData.map(work => (
                <option key={work.pk} value={work.pk}>
                  {work.name}
                </option>
              ))}
            </SelectWithChoices>
            <SelectWithChoices label="Статус виконання" name="exec_status">
              {this.state.execChoices[0].map(item => (
                <option selected={this.state.orderData.exec_status === item[1]} key={item[0]} value={item[1]}>
                  {item[1]}
                </option>
              ))}
            </SelectWithChoices>
            <SelectWithChoices label="Статус оплати" name="pay_status">
              {this.state.paymentChoices[0].map(item => (
                <option selected={this.state.orderData.pay_status === item[1]} key={item[0]} value={item[1]}>
                  {item[1]}
                </option>
              ))}
            </SelectWithChoices>
            <InputWithLabel name={'information'}
                            label={'Інформація'}
                            type={'textarea'}
                            defaultValue={this.state.orderData.information}
            />
            <InputWithLabel name={'warning'}
                            label={'Зауваження'}
                            type={'textarea'}
                            defaultValue={this.state.orderData.warning}
            />
          </Form>
          <Form id="executorForm">
            <hr/>
            <h6 className="text-center">Виконавці</h6>
            <hr/>
            {this.state.orderData.executions.map((executor, index) => (
              <>
                <InputWithLabel name={'executor'}
                                label={'Виконавець'}
                                type={'text'}
                                defaultValue={executor.executor_name}
                />
                <InputWithLabel name={'exec_status'}
                                label={'Статус виконання'}
                                type={'text'}
                                defaultValue={executor.exec_status}
                />
                <FormGroup>
                  <Label>Запланований час</Label>
                  <DatePicker id="scheduled_time" name="scheduled_time"
                              showClearButton={false}
                              value={executor.scheduled_time}
                              onChange={(v, f) => this.handleChange(v, f)}/>
                  {/*<FormText>Help</FormText>*/}
                </FormGroup>
              </>
            ))}
          </Form>
          <Link to="/order">
            <Button color="warning">
              <Text text="buttons.returnBtn"/>
            </Button>
          </Link>
          <Button type="submit" color="success" onClick={this.handleSubmit} className="float-right">
            <Text text="buttons.submitBtn"/>
          </Button>

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
            { name: this.state.orderData.number, active: true }]}
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
