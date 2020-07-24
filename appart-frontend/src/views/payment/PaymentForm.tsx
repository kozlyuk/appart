/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { BaseSyntheticEvent, Component, FormEvent } from 'react';
import Auth from '../../auth/auth';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, Input, Label } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import PaymentController from '../../controllers/PaymentController';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import Swal, { SweetAlertResult } from 'sweetalert2';
import PageSpinner from '../../components/PageSpinner';
import Page from '../../components/Page';
import SelectWithChoices from '../../components/FormInput/SelectWithChoices';
import InputWithLabel from '../order/components/InputWithLabel';
import SelectWithButton from '../../components/FormInput/SelectWithButton';
import DataInput from '../order/components/DataInput';
import styles from '../order/styles/delimiter.module.css';

interface PaymentFormState {
  data: Payment,
  houses: Houses,
  paymentType: PaymentType,
  isLoaded: boolean,
  errors: FieldErrors,
  fieldError: FieldErrors,
  defaultInactiveBtn: boolean,
  isApartmentSelectShow: boolean,
  apartmentsData: any,
  serviceLinesFormsetQuantity: number,
  serviceLinesPk: Array<any>,
  services: Service
}

type PaymentData = {
  data: Payment
}

type Payment = {
  pk: string,
  apartment: string,
  payment_type: string,
  date: string,
  value: string,
  payment_service: PaymentService,
  apartment_name: string
}

type PaymentService = Array<ServiceLine>

type ServiceLine = {
  pk?: number
  service: string
  value: string
}

type Apartment = {
  account_number: string
  area: number | null
  description: string
  house: number
  house_name: string
  is_active: boolean
  number: number
  pk: number
  resident: number | null
  resident_name: string | null
  residents_count: number | null
}

type HousesData = {
  data: Houses
}

type Houses = {
  address: string
  apartments_count?: number
  description: string
  logo: string
  name: string
  pk?: number
}

type PaymentTypeData = {
  data: PaymentType
}

type PaymentType = {
  [x: string]: string
}

type ServiceData = {
  data: Service
}

type Service = {
  description: string
  houses: Object
  name: string
  pk?: number
  uom: string
  uom_type: string
}

type FieldErrors = {
  [x: string]: string
}

export default class PaymentForm extends Component<any, PaymentFormState> {
  /**
   * User object.
   */
  public user: Auth;
  /**
   * Endpoint for get request
   */
  private dataUrl?: string;

  private PaymentController: PaymentController;

  private successRedirect: string;

  private _successButton: string;

  constructor(props: object) {
    super(props);
    this.user = new Auth();
    this.dataUrl = process.env.REACT_APP_PAYMENT;
    this.PaymentController = new PaymentController(this.props.match.params.id);
    this.successRedirect = '/dashboard/payment';
    this._successButton = 'Повернутися до списку платежів';
  }

  public state: PaymentFormState = {
    houses: {
      address: '',
      apartments_count: undefined,
      description: '',
      logo: '',
      name: '',
      pk: undefined
    },
    paymentType: {},
    services: {
      description: '',
      houses: [],
      name: '',
      pk: undefined,
      uom: '',
      uom_type: ''
    },
    serviceLinesFormsetQuantity: 0,
    serviceLinesPk: [],
    apartmentsData: {},
    data: {
      pk: '',
      apartment: '',
      payment_type: '',
      date: '',
      value: '',
      payment_service: [],
      apartment_name: ''
    },
    isLoaded: false,
    isApartmentSelectShow: false,
    errors: {
      mobileNumber: ''
    },
    fieldError: {
      mobileNumber: ''
    },
    defaultInactiveBtn: false
  };

  private setData = (
    services: ServiceData,
    houses: HousesData,
    paymentType: PaymentTypeData,
    payment: PaymentData
  ) => {
    this.setState({
      serviceLinesPk: this.parseServiceLines(payment.data.payment_service),
      services: services.data,
      houses: houses.data,
      paymentType: paymentType.data,
      data: payment.data,
      isLoaded: true
    });
  };

  public componentDidMount(): void {
    // @ts-ignore
    Promise.all(this.PaymentController.getPromiseValues())
      .then(axios.spread((
        services: any,
        houses: any,
        paymentType: any,
        payment: any
      ) => {
        if (this.props.match.params.id) {
          this.setData(
            // @ts-ignore
            services,
            houses,
            paymentType,
            payment
          );
        } else {
          this.setState({
            services: services.data,
            data: {
              pk: '',
              apartment: '',
              payment_type: '',
              date: '',
              value: '',
              payment_service: [],
              apartment_name: ''
            },
            houses: houses.data,
            paymentType: paymentType.data,
            isLoaded: true
          });
        }
      }));
  }

  private handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { name, value } = event.target as HTMLTextAreaElement;
    let errors = this.state.errors;
    this.setState({ errors, ['defaultInactiveBtn']: false });
    switch (name) {
      // case 'mobileNumber':
      //   errors.mobileNumber =
      //     (validPhoneRegex.test(value) && value.length === 10)
      //       ? ''
      //       : [<Text text="global.validateErrors.mobileNumber"/>] as unknown as string;
      //   break;
      default:
        break;
    }

    // @ts-ignore
    this.setState({ errors, [name]: value });
  };

  submitData(): object | undefined {
    const el = document.getElementById('PaymentForm') as HTMLFormElement;
    const paymentForm: FormData = new FormData(el);
    const paymentData = {
      apartment: paymentForm.get('apartment'),
      payment_type: paymentForm.get('payment_type'),
      date: paymentForm.get('date-formatted'),
      value: paymentForm.get('value')
    };
    if (el) {
      return paymentData;
    }
  }

  private handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const updateEndpoint: string = process.env.REACT_APP_PAYMENT + this.props.match.params.id + '/';
    const createEndpoint: string = process.env.REACT_APP_PAYMENT as string;
    const requestEndpoint = this.props.match.params.id ? updateEndpoint : createEndpoint;
    axios({
      method: this.props.match.params.id ? 'put' : 'post',
      url: requestEndpoint,
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      },
      data: this.submitData()
    }).then((response: AxiosResponse) => {
      this.secondaryRequests(response);
      let successMessage = '';
      if (typeof response.data == 'string') {
        successMessage = response.data;
      }
      Swal.fire({
        title: 'Успіх!',
        text: successMessage,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: this._successButton
      }).then((result: SweetAlertResult) => {
        if (result.value) {
          this.props.history.push(this.successRedirect);
        }
      });
    })
      .catch((error: any) => {
        console.log(error);
        this.setState({
          fieldError: error.response.data
        });
        let errorArr = [];
        for (let i in error.response.data) {
          errorArr.push(error.response.data[i]);
        }
        const errorString: string[] = (errorArr.map(item => {
          const errorValue: string = item[0].toString();
          console.log(errorValue);
          return (`<div>${errorValue}</div>`);
        }));
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: errorString.join('')
        });
      });
  };

  private secondaryRequests(response: { data: { pk: number } }) {
    console.log(response);
    this.submitPaymentLines(response.data.pk);
  }

  private collectFormsetData = (): any => {
    if (this.state.serviceLinesFormsetQuantity) {
      let counter = this.state.serviceLinesFormsetQuantity;
      let serviceLinesArray: Array<any> = [];
      const getFormsetData: any = (counter: number, data: any = null) => {
        const form: string = `paymentServiceForm-${counter}`;
        // @ts-ignore
        const formset: FormData = new FormData(document.getElementById(form));
        let serviceLine = {
          'pk': parseInt(formset.get('pk') as string),
          'previous_debt': formset.get('previous_debt'),
          'service': parseInt(formset.get('service') as string),
          'value': formset.get('value'),
          'total_debt': formset.get('total_debt')
        };
        data.push(serviceLine);
        if (counter === 1) {
          return data;
        } else {
          return getFormsetData(counter - 1, data);
        }
      };

      return getFormsetData(counter, serviceLinesArray);
    }
  };

  private submitPaymentLines = (paymentPk: number) => {
    const formsetData = this.collectFormsetData();
    let counter = this.state.serviceLinesFormsetQuantity;
    /**
     * @return {array}
     * @param {number} counter
     * @param {array} data
     */
    const submitData = async (counter: number, data: any): Promise<any> => {
      if (counter) {
        const paymentLinePk = parseInt(data[counter - 1].pk);
        axios({
          method: this.isPaymentlLineExist(paymentLinePk) ? 'put' : 'post',
          url: this.isPaymentlLineExist(paymentLinePk) ? `${process.env.REACT_APP_PAYMENT}${this.state.data.pk}/paymentservice/${data[counter - 1].pk}/` : `${process.env.REACT_APP_PAYMENT}${paymentPk}/paymentservice/`,
          headers: {
            'Authorization': 'Token ' + this.user.getAuthToken()
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

  private isPaymentlLineExist = (paymentLinePk: number) => {
    return this.state.serviceLinesPk.includes(paymentLinePk);
  };

  private onHouseItemSelect = (event: BaseSyntheticEvent) => {
    this.loadApartments(event.target.value);
    return void 0;
  };

  private loadApartments(housePk: number) {
    Promise.all(this.PaymentController.getApartments(housePk))
      .then(
        axios.spread((
          apartments: AxiosResponse
        ) => {
          this.setState({
            isApartmentSelectShow: true,
            apartmentsData: apartments.data
          });
        })
      );
  }

  protected deleteSuccess = (id: number) => {
    const { data } = { ...this.state };
    data.payment_service.splice(id, 1);
    this.setState({
      data: data
    });
    this.decreaseFormsetQuantity();
  };

  private parseServiceLines = (data: PaymentService) => {
    let serviceLinesArray: Array<any> = [];
    data.map((serviceLine: ServiceLine) => {
      serviceLinesArray.push(serviceLine.pk);
    });
    return serviceLinesArray;
  };

  private increaseFormsetQuantity = (e: FormEvent) => {
    this.addFormSet(e);
    // increase formset counter.
    this.setState((prevState: PaymentFormState) => ({
      serviceLinesFormsetQuantity: ++prevState.serviceLinesFormsetQuantity
    }));
  };

  private decreaseFormsetQuantity = () => {
    // decrease formset counter.
    this.setState((prevState: PaymentFormState) => ({
      serviceLinesFormsetQuantity: --prevState.serviceLinesFormsetQuantity
    }));
  };

  private addFormSet = (e: FormEvent) => {
    const emptyFormset: ServiceLine = { pk: undefined, service: '', value: '' };
    this.setState((prevState: PaymentFormState) => ({
      data: {
        ...prevState.data,
        payment_service: [
          ...prevState.data.payment_service,
          emptyFormset
        ]
      }
    }));
  };

  content(): React.ReactNode {
    const houses: any = this.state.houses;
    const paymentTypes: any = this.state.paymentType;
    const services: any = this.state.services;
    return (
      <>
        <Card>
          <CardHeader><Text text="paymentForm.header"/> {this.state.data.apartment}</CardHeader>
          <CardBody>
            <Form onSubmit={(event: FormEvent) => this.handleSubmit(event)} id="PaymentForm">
              <SelectWithChoices
                changeHandler={this.onHouseItemSelect}
                label={'House'}
                name={'house'}
                error={this.state.fieldError.house}
                helpText={!this.state.isApartmentSelectShow && 'Для вибору апартаментів виберіть спочатку будинок'}
              >
                {houses.map((item: Houses) => (
                  <option key={item.pk} value={item.pk}>{item.name}</option>
                ))}
              </SelectWithChoices>
              {this.state.isApartmentSelectShow ?
                <SelectWithChoices
                  label={<Text text="paymentForm.apartment"/>}
                  name="apartment"
                  error={this.state.fieldError.apartment}
                  defaultValue={this.state.data.apartment}
                >
                  {this.state.apartmentsData.map((item: Apartment) => (
                    <option key={item.pk}
                            value={item.pk}>
                      №: {item.number} {item.resident_name && `${item.resident_name}`}
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
              <SelectWithChoices
                label={'Payment type'}
                name={'payment_type'}
                error={this.state.fieldError.paymentType}
              >
                {paymentTypes.map((item: PaymentType) => (
                  <option key={item[0]} value={item[0]}>{item[1]}</option>
                ))}
              </SelectWithChoices>
              <DataInput
                label={<Text text="paymentForm.date"/>}
                calendarPlacement={'top'}
                name={'date'}
                error={this.state.fieldError.date}
                startValue={this.state.data.date}
              />
              <FormGroup>
                <Label for="value"><Text text="paymentForm.value"/></Label>
                <Input
                  type="text"
                  name="value"
                  defaultValue={this.state.data.value}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Link to="/dashboard/payment">
                <Button color="warning">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
              <Button className="float-right" type={'submit'}><Text text="buttons.submitBtn"/></Button>
            </Form>
          </CardBody>
        </Card>
        {this.state.data.payment_service[0] &&
        <h6 className="text-center mt-2"><Text text="paymentForm.purpose"/></h6>}
        {this.state.data.payment_service.map((serviceLine: ServiceLine, index: number) => (
          <Card className={'mt-2'}>
            <CardBody>
              <Form id={`paymentServiceForm-${index + 1}`}>
                <input id="pk" name="pk" type="hidden" value={serviceLine.pk}/>
                <SelectWithButton
                  name={'service'}
                  label={<Text text="paymentForm.serviceLine.service"/>}
                  alertText={'Дійсно бажаєте видалити послугу?'}
                  defaultValue={this.state.data.payment_service[index].service}
                  buttonText={'Видалити'}
                  deleteEndpoint={`${process.env['REACT_APP_PAYMENT']}${this.state.data.pk}/paymentservice/`}
                  token={this.user.getAuthToken()}
                  index={index}
                  id={serviceLine.pk}
                  callback={this.deleteSuccess}
                  error={this.state.fieldError.service}
                >
                  {services.map((item: Service) => (
                    <option key={item.pk} value={item.pk}>{item.name} ({item.uom})</option>
                  ))}
                </SelectWithButton>
                <InputWithLabel
                  label={<Text text="paymentForm.serviceLine.value"/>}
                  name="value"
                  defaultValue={this.state.data.payment_service[index].value}
                  error={this.state.fieldError.value}
                />
              </Form>
            </CardBody>
          </Card>
        ))}
        <div className={styles.orSpacer}>
          <span onClick={this.increaseFormsetQuantity} className={styles.orSpacerSpan}>
                <i className={styles.orSpacerSpanI}>+</i>
              </span>
        </div>
      </>
    );
  }

  render(): JSX.Element {
    if (this.state.isLoaded) {
      return (
        // @ts-ignore
        <Page
          className="TablePage"
        >
          <Container>
            {this.content()}
          </Container>
        </Page>
      );
    } else {
      return (
        <PageSpinner/>
      );
    }
  }
}