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
import OrderController from '../../controllers/OrderController';

export default class OrderForm extends AbstractFormView {
  /**
   * Bill constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      executorFormsetQuantity: 0,
      // data objects
      orderData: null,
      worksData: null,
      housesData: null,
      execChoices: null,
      paymentChoices: null,
      apartmentsData: null,
      isApartmentSelectShow: false,
      fieldError: {
        house: null,
        apartment: null,
        work: null,
        exec_status: null,
        pay_status: null,
        information: null,
        warning: null
      }
    };

    /**
     * User object.
     *
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
    this.OrderController = new OrderController(this.props.match.params.id);
    if (this.props.match.id) {
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_ORDER + this.props.match.params.id + '/';
      this.dataUrl = process.env.REACT_APP_ORDER;
      this.requestType = 'put';
    } else {
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_ORDER;
      this.requestType = 'post';
    }
    this._onHouseItemSelect = this._onHouseItemSelect.bind(this);
    this.successRedirect = '/dashboard/order';
    this._successButton = 'Повернутися до списку замовлень';
  }

  componentDidMount() {

    Promise.all(this.OrderController.getPromiseValues())
      .then(axios.spread((
        works,
        houses,
        execChoices,
        paymentChoices,
        usersChoices,
        executorChoices,
        order
      ) => {
        // set quantity of formsets to state before rendering component.
        if (order) {
          this.setState({
            executorFormsetQuantity: order.data.execution_set.length
          });
        }
        this._setData(
          works,
          houses,
          execChoices,
          paymentChoices,
          usersChoices,
          executorChoices,
          order
        );
        if (order && order.data.house) {
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
    works,
    houses,
    execChoices,
    paymentChoices,
    usersChoices,
    executorChoices,
    order = { data: { execution_set: [] } }
  ) {
    this.setState({
      executorsPk: this.parseExecutors(order.data.execution_set),
      worksData: works.data,
      housesData: houses.data,
      execChoices: execChoices.data,
      paymentChoices: paymentChoices.data,
      usersChoices: usersChoices.data,
      executorChoices: executorChoices.data,
      orderData: order.data,
      isLoaded: true
    });
  }

  /**
   * Clear formset data when pressing delete button.
   *
   * @param id
   */
  deleteSuccess = (id) => {
    const { orderData } = { ...this.state };
    orderData.execution_set.splice(id, 1);
    this.setState({
      orderData: orderData
    });
    this._decreaseFormsetQuantity();
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
   * Collect data before submit.
   *
   * @param target
   * @return {Promise<FormData>}
   */
  submitData(target) {
    let orderForm = new FormData(document.forms.orderForm);
    // let executorForm = new FormData(document.forms.executorForm);
    orderForm.delete('house');

    return orderForm;
  }

  /**
   * Collect formset data.
   *
   * @return {object}
   */
  collectFormsetData = (orderPk) => {
    if (this.state.executorFormsetQuantity) {
      let counter = this.state.executorFormsetQuantity;
      let executorArray = [];
      const getFormsetData = (counter, data = null) => {
        const form = `executorForm-${counter}`;
        const formset = new FormData(document.getElementById(form));
        let executions = {
          'pk': parseInt(formset.get('pk')),
          'order': this.state.orderData.pk || orderPk,
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

  /**
   * Secondary request.
   *
   * @return {*}
   */
  secondaryRequests(response) {
    super.secondaryRequests();
    this.submitExecutors(response.data.pk);
  }

  submitExecutors = (orderPk) => {
    const formsetData = this.collectFormsetData(orderPk);
    let counter = this.state.executorFormsetQuantity;
    /**
     * @return {array}
     * @param {number} counter
     * @param {array} data
     */
    const submitData = async (counter, data) => {
      if (counter) {
        const executorPk = parseInt(data[counter - 1].pk);
        axios({
          method: this._isExecutorExist(executorPk) ? 'put' : 'post',
          url: this._isExecutorExist(executorPk) ? `${process.env.REACT_APP_ORDER}${this.state.orderData.pk}/execution/${data[counter - 1].pk}/` : `${process.env.REACT_APP_ORDER}${this.state.orderData.pk}/execution/`,
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
    console.log(executorPk, this.state.executorsPk);
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
      executorsArray.push(executor.pk);
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
   * Increase formset quantity.
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

  /**
   * Decrease formset quantity.
   *
   * @param e
   * @private
   */
  _decreaseFormsetQuantity = (e) => {
    // decrease formset counter.
    this.setState(prevState => ({
      executorFormsetQuantity: --prevState.executorFormsetQuantity
    }));
  };

  content() {
    return (
      <Fragment>
        <Card>
          <CardHeader>{this.state.orderData.work_name || <Text text="orderForm.newOrderHeader"/>}</CardHeader>
          <CardBody>
            <Form id="orderForm" onSubmit={this.handleSubmit}>
              <SelectWithChoices changeHandler={this._onHouseItemSelect}
                                 defaultValue={this.state.orderData.house}
                                 label={<Text text="orderForm.house"/>}
                                 name="house"
                                 error={this.state.fieldError.house}
                                 helpText={!this.state.isApartmentSelectShow && <Text text="orderForm.houseHelpText"/>}
              >
                {this.state.housesData.map(house => (
                  <option
                    key={house.pk}
                    value={house.pk}
                  >
                    {house.name}
                  </option>
                ))}
              </SelectWithChoices>
              {this.state.isApartmentSelectShow ?
                <SelectWithChoices
                  label={<Text text="orderForm.apartment"/>}
                  name="apartment"
                  error={this.state.fieldError.apartment}
                  defaultValue={this.state.orderData.apartment}
                >
                  {this.state.apartmentsData.map(apartment => (
                    <option key={apartment.pk}
                            value={apartment.pk}>
                      №: {apartment.number} {apartment.resident_name && `${apartment.resident_name}`}
                    </option>
                  ))}
                </SelectWithChoices>
                :
                <>
                  <input type={'hidden'} name="apartment" value={this.state.orderData.apartment}/>
                  <SelectWithChoices
                    type="text"
                    label={<Text text="orderForm.apartment"/>}
                    name="apartment" disabled
                    error={this.state.fieldError.apartment}
                    value={this.state.orderData.apartment_name}
                  />
                </>
              }
              <SelectWithChoices
                label={<Text text="orderForm.work"/>}
                name="work"
                error={this.state.fieldError.work}
              >
                {this.state.worksData.map(work => (
                  <option key={work.pk} value={work.pk}>
                    {work.name}
                  </option>
                ))}
              </SelectWithChoices>
              <SelectWithChoices
                label={<Text text="orderForm.execStatus"/>}
                name="exec_status"
                error={this.state.fieldError.exec_status}
                defaultValue={this.state.orderData.exec_status}
              >
                {this.state.execChoices[0].map(item => (
                  <option key={item[0]} value={item[1]}>
                    {item[1]}
                  </option>
                ))}
              </SelectWithChoices>
              <SelectWithChoices
                label={<Text text="orderForm.payStatus"/>}
                name="pay_status"
                error={this.state.fieldError.pay_status}
                defaultValue={this.state.orderData.pay_status}
              >
                {this.state.paymentChoices[0].map(item => (
                  <option key={item[0]} value={item[1]}>
                    {item[1]}
                  </option>
                ))}
              </SelectWithChoices>
              <InputWithLabel
                name={'information'}
                label={<Text text="orderForm.information"/>}
                type={'textarea'}
                defaultValue={this.state.orderData.information}
                helpText={<Text text="orderForm.informationHelpText"/>}
                error={this.state.fieldError.information}
              />
              <InputWithLabel
                name={'warning'}
                label={<Text text="orderForm.warning"/>}
                type={'textarea'}
                defaultValue={this.state.orderData.warning}
                error={this.state.fieldError.warning}
              />
              <Link to="/dashboard/order">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
              <Button type="submit" color="success" onClick={this.handleSubmit} className="float-right">
                <Text text="buttons.submitBtn"/>
              </Button>
            </Form>
          </CardBody>
        </Card>
        {this.state.orderData.execution_set[0] && <h6 className="text-center mt-2">Виконавці</h6>}
        {this.state.orderData.execution_set.map((executor, index) => (
          <Card className={'mt-2'}>
            <CardBody>
              <Form id={`executorForm-${index + 1}`}>
                <input id="pk" name="pk" type="hidden" value={executor.pk}/>
                {(!executor.isEditable) &&
                <input id="executor" name="executor" type="hidden" value={executor.executor}/>}
                <SelectWithButton
                  label={<Text text="orderForm.executorsSet.executor"/>}
                  name="executor"
                  alertText={'Дійсно бажаєте видалити виконавця?'}
                  disabled={(!executor.isEditable)}
                  index={index}
                  orderPk={this.state.orderData.pk}
                  id={executor.pk}
                  token={this._user.getAuthToken()}
                  callback={this.deleteSuccess}
                  buttonText={<Text text="buttons.deleteBtn"/>}
                >
                  {this.state.usersChoices.map(item => (
                    <option selected={executor.executor === item.pk} key={item.pk} value={item.pk}>
                      {`${item.first_name} ${item.last_name}`}
                    </option>
                  ))}
                </SelectWithButton>
                <SelectWithChoices
                  label={<Text text="orderForm.execStatus"/>}
                  name="exec_status"
                >
                  {this.state.executorChoices[0].map(item => (
                    <option selected={executor.exec_status === item[1]} key={item[0]} value={item[1]}>
                      {item[1]}
                    </option>
                  ))}
                </SelectWithChoices>
                <DataInput
                  label={<Text text="orderForm.executorsSet.scheduledTime"/>}
                  name={`scheduled_time_${index}`}
                  startValue={executor.scheduled_time}
                  helpText={<Text text="orderForm.executorsSet.scheduledTimeHelpText"/>}
                />
              </Form>
            </CardBody>
          </Card>
        ))}
        <div className={styles.orSpacer}>
          <span onClick={this._increaseFormsetQuantity} className={styles.orSpacerSpan}>
                <i className={styles.orSpacerSpanI}>+</i>
              </span>
        </div>
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
          className="TablePage"
        >
          <Container>
            {this.content()}
          </Container>
        </Page>
      );
    }
  }
};
