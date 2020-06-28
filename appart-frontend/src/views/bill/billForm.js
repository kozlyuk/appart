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
import Auth from '../../auth/auth';
import BillController from '../../controllers/BillController';
import axios from 'axios';
import SelectWithChoices from '../../components/FormInput/SelectWithChoices';
import InputWithLabel from '../order/components/InputWithLabel';
import DataInput from '../order/components/DataInput';
import styles from '../order/styles/delimiter.module.css';
import InputWithButton from '../../components/FormInputs/InputWithButton';
import Swal from 'sweetalert2';

export default class BillForm extends AbstractFormView {
  /**
   * Bill constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      billLinesFormsetQuantity: 0,
      // validation fields
      password: '',
      mobileNumber: '',
      // defaultInactiveBtn: true,
      fieldError: {
        apartment: null,
        number: null,
        total_value: null,
        purpose: null
      }
    };
    /**
     * User object.
     *
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
    this.BillController = new BillController(this.props.match.params.id);
    if (this.props.match.params.id) {
      /**
       * @type {string}
       * @private
       */
      this._postUrl = process.env.REACT_APP_BILLS + this.props.match.params.id + '/';
      this.dataUrl = process.env.REACT_APP_BILLS;
      this.requestType = 'put';
    } else {
      this.dataUrl = undefined;
      this.requestType = 'post';
      this._postUrl = process.env.REACT_APP_BILLS;
    }
    this.successRedirect = '/dashboard/bills';
    this._successButton = 'Повернутися до списку рахунків';
  }

  /**
   * Collect data before submit
   *
   * @param target
   * @returns {FormData}
   */
  submitData(target) {
    return new FormData(document.forms.billForm);
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
    let fieldError = this.state.fieldError;
    this.setState({ fieldError, ['defaultInactiveBtn']: false });
    switch (name) {
      case 'number':
        fieldError.number =
          value.length < 1
            ? [<Text text="global.validateErrors.emptyField"/>]
            : '';
        break;
      default:
        break;
    }

    this.setState({ fieldError, [name]: value });
  };

  /**
   * Set data to state.
   *
   * @param houses
   * @private
   */
  _setDataWithLoading(houses) {
    this.setState({
      billLinesPk: [],
      housesData: houses.data,
      isLoaded: true
    });
  }

  _setDataWithoutLoading(houses, services, bill) {
    this.setState({
      billLinesPk: this.parseBillLines(bill.data.bill_lines),
      housesData: houses.data,
      services: services.data,
      data: bill.data,
      isLoaded: true
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

  /**
   * @return {*}
   * @private
   */
  _onHouseItemSelect = (event) => {
    this._loadApartments(event.target.value);
    return void 0;
  };

  componentDidMount() {
    if (!this.props.match.params.id) {
      this.setState({
        billLinesFormsetQuantity: 1
      });
    }
    Promise.all(this.BillController.getPromiseValues())
      .then(axios.spread((
        houses,
        services,
        bill
      ) => {
        if (this.props.match.params.id) {
          this._setDataWithoutLoading(
            houses,
            services,
            bill
          );
          return super.componentDidMount();
        } else {
          this.setState({
            services: services.data,
            data: {
              apartment: '',
              apartment_name: '',
              number: '',
              total_value: '',
              purpose: '',
              period: '',
              bill_lines: [{
                previous_debt: '',
                value: '',
                total_debt: ''
              }],
              is_active: false
            }
          }, () => {
            this._setDataWithLoading(
              houses
            );
          });
        }
      }));
  }

  /**
   * Collect data before submit.
   *
   * @param target
   * @return {Promise<FormData>}
   */
  submitData(target) {
    let billForm = new FormData(document.forms.billForm);
    billForm.delete('house');
    const billData = {
      apartment: billForm.get('apartment'),
      number: billForm.get('number'),
      total_value: billForm.get('total_value'),
      period: billForm.get('period-formatted')
    };

    return billData;
  }

  /**
   * Collect formset data.
   *
   * @return {object}
   */
  collectFormsetData = (billPk) => {
    if (this.state.billLinesFormsetQuantity) {
      let counter = this.state.billLinesFormsetQuantity;
      let billLinesArray = [];
      const getFormsetData = (counter, data = null) => {
        const form = `billLineForm-${counter}`;
        const formset = new FormData(document.getElementById(form));
        let billLine = {
          'pk': parseInt(formset.get('pk')),
          'previous_debt': formset.get('previous_debt'),
          'service': parseInt(formset.get('service')),
          'value': formset.get('value'),
          'total_debt': formset.get('total_debt')
        };
        data.push(billLine);
        if (counter === 1) {
          return data;
        } else {
          return getFormsetData(counter - 1, data);
        }
      };

      return getFormsetData(counter, billLinesArray);
    }
  };

  /**
   * Secondary request.
   *
   * @return {*}
   */
  secondaryRequests(response) {
    super.secondaryRequests();
    this.submitBillLines(response.data.pk);
  }

  submitBillLines = (billPk) => {
    const formsetData = this.collectFormsetData(billPk);
    let counter = this.state.billLinesFormsetQuantity;
    /**
     * @return {array}
     * @param {number} counter
     * @param {array} data
     */
    const submitData = async (counter, data) => {
      if (counter) {
        const billLinePk = parseInt(data[counter - 1].pk);
        axios({
          method: this._isBillLineExist(billLinePk) ? 'put' : 'post',
          url: this._isBillLineExist(billLinePk) ? `${process.env.REACT_APP_BILLS}${this.state.data.pk}/billline/${data[counter - 1].pk}/` : `${process.env.REACT_APP_BILLS}${billPk}/billline/`,
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
   * @return {boolean}
   * @private
   * @param billLinePk
   */
  _isBillLineExist = (billLinePk) => {
    return this.state.billLinesPk.includes(billLinePk);
  };

  /**
   * Parse bill line set to array
   * @param data
   * @return {[]}
   */
  parseBillLines = (data) => {
    let billLinesArray = [];
    data.map(billLine => {
      billLinesArray.push(billLine.pk);
    });
    return billLinesArray;
  };

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
    const emptyFormset = { previous_debt: '', value: '', total_debt: '' };
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        bill_lines: [
          ...prevState.data.bill_lines,
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
      billLinesFormsetQuantity: ++prevState.billLinesFormsetQuantity
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
      billLinesFormsetQuantity: --prevState.billLinesFormsetQuantity
    }));
  };

  /**
   * Clear formset data when pressing delete button.
   *
   * @param id
   */
  deleteSuccess = (id) => {
    const { data } = { ...this.state };
    data.bill_lines.splice(id, 1);
    this.setState({
      data: data
    });
    this._decreaseFormsetQuantity();
  };

  content() {
    return (
      <Fragment>
        <CardHeader>{this.state.data.number ? this.state.data.number : 'New bill'}</CardHeader>
        <CardBody>
          <Form id='billForm' onSubmit={this.handleSubmit}>
            <SelectWithChoices
              changeHandler={this._onHouseItemSelect}
              label={<Text text="billForm.house"/>}
              name="house"
              helpText={!this.state.isApartmentSelectShow && 'Для вибору апартаментів виберіть спочатку будинок'}
            >
              {this.state.housesData.map(item => (
                <option key={item.pk} value={item.pk}>{item.name}</option>
              ))}
            </SelectWithChoices>
            {this.state.isApartmentSelectShow ?
              <SelectWithChoices
                label={<Text text="billForm.apartment"/>}
                name="apartment"
                error={this.state.fieldError.apartment}
                defaultValue={this.state.data.apartment}
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
                <input type={'hidden'} name="apartment" value={this.state.data.apartment}/>
                <SelectWithChoices
                  type="text"
                  label={<Text text="billForm.apartment"/>}
                  name="apartment" disabled
                  error={this.state.fieldError.apartment}
                  value={this.state.data.apartment_name}
                />
              </>
            }
            <InputWithLabel
              name={'number'}
              label={<Text text="billForm.number"/>}
              type={'text'}
              defaultValue={this.state.data.number}
              error={this.state.fieldError.number}
              onChange={this.handleChange}
            />
            <InputWithLabel
              name={'total_value'}
              label={<Text text="billForm.totalValue"/>}
              type={'number'}
              defaultValue={this.state.data.total_value}
              error={this.state.fieldError.total_value}
            />
            <DataInput
              label={<Text text="billForm.period"/>}
              name={'period'}
              error={this.state.fieldError.period}
              startValue={this.state.data.period}
            />
            <Link to="/dashboard/bill">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            <Button type="submit" color="success" onClick={this.handleSubmit} className="float-right">
              <Text text="buttons.submitBtn"/>
            </Button>
          </Form>
          <hr/>
          {this.state.data.bill_lines[0] && <h6 className="text-center"><Text text="billForm.purpose"/></h6>}
          {this.state.data.bill_lines.map((billLine, index) => (
            <>
              <Form id={`billLineForm-${index + 1}`}>
                <hr/>
                <input id="pk" name="pk" type="hidden" value={billLine.pk}/>
                <InputWithButton
                  name={'previous_debt'}
                  label={'Попередня заборгованість'}
                  defaultValue={this.state.data.bill_lines[index].previous_debt}
                  buttonText={'Видалити'}
                  deleteEndpoint={this.dataUrl}
                  token={this._user.getAuthToken()}
                  index={index}
                  id={billLine.pk}
                  callback={this.deleteSuccess}
                  error={this.state.fieldError.bill_lines}
                />
                <SelectWithChoices
                  label={'Service'}
                  name={'service'}
                  defaultValue={this.state.bill_lines && this.state.bill_lines[index].service}
                  error={this.state.fieldError.bill_lines}
                >
                  {this.state.services.map(item => (
                    <option key={item.pk} value={item.pk}>{item.name}</option>
                  ))}
                </SelectWithChoices>
                <InputWithLabel
                  label={'Ціна'}
                  name="value"
                  defaultValue={this.state.data.bill_lines[index].value}
                  error={this.state.fieldError.bill_lines}
                />
              </Form>
            </>
          ))}
          <div className={styles.orSpacer}>
            <hr/>
            <span onClick={this._increaseFormsetQuantity} className={styles.orSpacerSpan}>
                <i className={styles.orSpacerSpanI}>+</i>
              </span>
          </div>
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
