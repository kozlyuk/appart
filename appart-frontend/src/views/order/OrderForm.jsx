/**
 * Bill update view
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
import axios from 'axios';
import Auth from '../../auth/auth';
import SelectWithChoices from './components/SelectWithChoices';
import InputWithLabel from './components/InputWithLabel';
import styles from './styles/delimiter.module.css';
import DataInput from './components/DataInput';
import Swal from 'sweetalert2';
import SelectWithButton from './components/SelectWithButton';

export default class OrderForm extends AbstractFormView {
  /**
   * Bill constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      executorFormsetQuantity: null,
      // data objects
      orderData: null,
      worksData: null,
      housesData: null,
      execChoices: null,
      paymentChoices: null,
      apartmentsData: null,
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

  componentDidMount() {
    const orderEndpoint = process.env.REACT_APP_ORDER + this.props.match.params.id + '/';
    const workEndpoint = process.env.REACT_APP_WORKS_WITHOUT_PAGINATION;
    const housesEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;
    const execChoicesEndpoint = process.env.REACT_APP_EXECUTION_CHOICES;
    const paymentChoicesEndpoint = process.env.REACT_APP_PAYMENT_CHOICES;
    const usersChoicesEndpoint = process.env.REACT_APP_USERS_WITHOUT_PAGINATION;
    const executorChoicesEndpoint = process.env.REACT_APP_EXECUTOR_CHOICES;
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
     * Users choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const usersChoicesPromise = axios.get(usersChoicesEndpoint, headers);
    /**
     * Executor choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const executorChoicesPromise = axios.get(executorChoicesEndpoint, headers);
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
      paymentChoicesPromise,
      usersChoicesPromise,
      executorChoicesPromise
    ])
      .then(axios.spread((
        order,
        works,
        houses,
        execChoices,
        paymentChoices,
        usersChoices,
        executorChoices
      ) => {
        // set quantity of formsets to state before rendering component.
        if (order) {
          this.setState({
            executorFormsetQuantity: order.data.execution_set.length
          });
        }
        this._setData(
          order,
          works,
          houses,
          execChoices,
          paymentChoices,
          usersChoices,
          executorChoices
        );
        if (order.data.house) {
          this._loadApartments(order.data.house);
        }
      }))
      .catch(error => {
        this._setError(error);
      });
  }

  /**
   * Set data to state
   *
   * @param {AxiosResponse<Object>} order
   * @param {AxiosResponse<Object>} works
   * @param {AxiosResponse<Object>} houses
   * @param {AxiosResponse<Object>} execChoices
   * @param {AxiosResponse<Object>} paymentChoices
   * @param {AxiosResponse<Object>} usersChoices
   * @param {AxiosResponse<Object>} executorChoices
   */
  _setData(
    order,
    works,
    houses,
    execChoices,
    paymentChoices,
    usersChoices,
    executorChoices
  ) {
    this.setState({
      orderData: order.data,
      executorsPk: this.parseExecutors(order.data.execution_set),
      worksData: works.data,
      housesData: houses.data,
      execChoices: execChoices.data,
      paymentChoices: paymentChoices.data,
      usersChoices: usersChoices.data,
      executorChoices: executorChoices.data,
      isLoaded: true
    });
  }

  deleteSuccess = (id) => {
    const { orderData } = { ...this.state };
    orderData.execution_set.splice(id, 1);
    this.setState({
      orderData: orderData
    });
  };

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

  /**
   * Collect data before submit
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    let orderForm = new FormData(document.forms.orderForm);
    // let executorForm = new FormData(document.forms.executorForm);
    orderForm.delete('house');
    this.submitExecutors();

    return orderForm;
  }

  /**
   * Collect formset data.
   *
   * @return {object}
   */
  collectFormsetData = () => {
    if (this.state.executorFormsetQuantity) {
      let counter = this.state.executorFormsetQuantity;
      let executorArray = [];
      const getFormsetData = (counter, data = null) => {
        const form = `executorForm-${counter}`;
        const formset = new FormData(document.getElementById(form));
        let executions = {
          'pk': formset.get('pk'),
          'order': this.state.orderData.pk,
          'executor': formset.get('executor'),
          'exec_status': formset.get('exec_status'),
          'scheduled_time': formset.get(`scheduled_time_${counter - 1}`)
        };
        data.push(executions);
        if (counter === 1) {
          return data;
        } else {
          return getFormsetData(counter - 1, data);
        }
      };

      return getFormsetData(counter, executorArray);
    }
  };

  submitExecutors = () => {
    const formsetData = this.collectFormsetData();
    let counter = this.state.executorFormsetQuantity;
    /**
     * @return {array}
     * @param {number} counter
     * @param {array} data
     */
    const submitData = (counter, data) => {
      const executorPk = parseInt(data[counter - 1].executor);
      const isExecutorExist = this._isExecutorExist(executorPk);
      axios({
        method: this._isExecutorExist(executorPk) ? 'put' : 'post',
        url: this._isExecutorExist(executorPk) ? `${process.env.REACT_APP_EXECUTIONS}${data[counter - 1].pk}/` : process.env.REACT_APP_EXECUTIONS,
        headers: {
          'Authorization': 'Token ' + this._user.getAuthToken()
        },
        data: data[counter - 1]
      }).then((response) => {
      })
        .catch((error) => {
          this.setState({
            fieldError: error.response.data
          });
          let errorArr = [];
          for (let i in error.response.data) {
            errorArr.push(error.response.data[i]);
          }
          const errorString = (errorArr.map(item => {
            const errorValue = item[0].toString();
            return (`<div>${errorValue}</div>`);
          }));
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errorString.join('')
          });
        });
      if (counter === 1) {
        return data;
      } else {
        return submitData(counter - 1, data);
      }
    };
    submitData(counter, formsetData);
  };

  /**
   * Check if executor exist in order form.
   *
   * @param executorPk
   * @return {boolean}
   * @private
   */
  _isExecutorExist = (executorPk) => {
    return this.state.executorsPk.includes(executorPk);
  };

  /**
   * Parse executors set to array
   * @param data
   * @return {[]}
   */
  parseExecutors = (data) => {
    let executorsArray = [];
    data.map(executor => {
      executorsArray.push(executor.executor);
    });
    return executorsArray;
  };

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
   * Add formset.
   *
   * @private
   * @param {React.MouseEvent<HTMLSpanElement>} e
   */
  _addFormSet = (e) => {
    const emptyFormset = { executor: '', exec_status: '', isEditable: true };
    this.setState(prevState => ({
      orderData: {
        ...prevState.orderData,
        execution_set: [
          ...prevState.orderData.execution_set,
          emptyFormset
        ]
      }
    }));
  };

  /**
   * Increase formset quantity
   *
   * @param e
   * @private
   */
  _increaseFormsetQuantity = (e) => {
    this._addFormSet(e);
    // increase formset counter.
    this.setState(prevState => ({
      executorFormsetQuantity: ++prevState.executorFormsetQuantity
    }));
  };

  content() {
    return (
      <Fragment>
        <CardHeader>{this.state.orderData.work_name}</CardHeader>
        <CardBody>
          <Form id="orderForm" onSubmit={this.handleSubmit}>
            <SelectWithChoices changeHandler={this._onHouseItemSelect}
                               label="Будинок" name="house"
                               helpText={!this.state.isApartmentSelectShow && 'Для вибору номеру апартаментів спочатку виберіть будинок'}
            >
              {this.state.housesData.map(house => (
                <option selected={parseInt(this.state.orderData.house) === house.pk}
                        key={house.pk}
                        value={house.pk}
                >
                  {house.name}
                </option>
              ))}
            </SelectWithChoices>
            {this.state.isApartmentSelectShow ?
              <SelectWithChoices label="Апартаменти" name="apartment">
                {this.state.apartmentsData.map(apartment => (
                  <option selected={this.state.orderData.apartment === apartment.pk} key={apartment.pk}
                          value={apartment.pk}>
                    Апартаменти №: {apartment.number} {apartment.resident_name && `Житель: ${apartment.resident_name}`}
                  </option>
                ))}
              </SelectWithChoices>
              :
              <SelectWithChoices type="text" label="Апартаменти" name="apartment" disabled
                                 value={this.state.orderData.apartment_name}/>
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
                            helpText={'Додатковий коментар'}
            />
            <InputWithLabel name={'warning'}
                            label={'Зауваження'}
                            type={'textarea'}
                            defaultValue={this.state.orderData.warning}
            />
          </Form>
          <hr/>
          {this.state.orderData.execution_set[0] && <h6 className="text-center">Виконавці</h6>}
          {this.state.orderData.execution_set.map((executor, index) => (
            <Form id={`executorForm-${index + 1}`}>
              <hr/>
              <input id="pk" name="pk" type="hidden" value={executor.pk}/>
              <SelectWithButton label="Виконавець" name="executor"
                                disabled={(!executor.isEditable)}
                                index={index}
                                id={executor.pk}
                                token={this._user.getAuthToken()}
                                callback={this.deleteSuccess}
                                buttonText={'Видалити'}>
                {this.state.usersChoices.map(item => (
                  <option selected={executor.executor === item.pk} key={item.pk} value={item.pk}>
                    {`${item.first_name} ${item.last_name}`}
                  </option>
                ))}
              </SelectWithButton>
              <SelectWithChoices label="Статус виконання" name="exec_status">
                {this.state.executorChoices[0].map(item => (
                  <option selected={executor.exec_status === item[1]} key={item[0]} value={item[1]}>
                    {item[1]}
                  </option>
                ))}
              </SelectWithChoices>
              <DataInput label={'Запланований час'} name={`scheduled_time_${index}`}
                         value={executor.scheduled_time} helpText={'Плановий час закінчення роботи'}
              />
            </Form>
          ))}
          <div className={styles.orSpacer}>
            <hr/>
            <span onClick={this._increaseFormsetQuantity} className={styles.orSpacerSpan}>
                <i className={styles.orSpacerSpanI}>+</i>
              </span>
          </div>
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
        </div>);
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
