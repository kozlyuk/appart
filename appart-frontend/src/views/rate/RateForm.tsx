/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { BaseSyntheticEvent, Component, FormEvent, SyntheticEvent } from 'react';
import Page from '../../components/Page';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Row } from 'reactstrap';
import PageSpinner from '../../components/PageSpinner';
import axios, { AxiosResponse } from 'axios';
import RateController from '../../controllers/RateController';
import SelectWithChoices from '../../components/FormInput/SelectWithChoices';
import DataInput from '../order/components/DataInput';
import { Link } from 'react-router-dom';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import InputWithLabel from '../../components/FormInputs/InputWithLabel';
import Swal, { SweetAlertResult } from 'sweetalert2';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';

interface RateFormInterface {
  isLoaded: boolean,
  data?: Rate,
  fieldError: RateErrors,
  apartmentsData: any,
  housesData?: House,
  servicesData?: any,
  isApartmentSelectShow: boolean
}

type Rate = {
  from_date: string,
  house: number | string,
  house_name: string,
  pk: number | string,
  service: number | string,
  service_name: string,
  value: string
}

type RateErrors = {
  from_date: string,
  house: string,
  house_name: string,
  pk: string,
  service: string,
  service_name: string,
  value: string
}

type House = {
  account_number: string
  area: null | number
  description: string
  house: number
  house_name: string
  is_active: boolean
  number: number
  pk: number
  resident: null | number
  resident_name: null | string
  residents_count: null | number
}

export default class RateForm extends Component<any, RateFormInterface> {

  private RateController: RateController;

  constructor(props: object) {
    super(props);
    this.RateController = new RateController();
  }

  static contextType = PermissionContext;

  public state: RateFormInterface = {
    isLoaded: false,
    data: undefined,
    isApartmentSelectShow: false,
    apartmentsData: undefined,
    housesData: undefined,
    servicesData: undefined,
    fieldError: {
      from_date: '',
      house: '',
      house_name: '',
      pk: '',
      service: '',
      service_name: '',
      value: ''
    }
  };

  private emptyForm: Rate = {
    from_date: '',
    house: '',
    house_name: '',
    pk: '',
    service: '',
    service_name: '',
    value: ''
  };

  public componentDidMount(): void {
    if (this.props.match.params.id) {
      // @ts-ignore
      Promise.all(this.RateController.getUpdateFormPromise(this.props.match.params.id))
        .then(axios.spread((
          rate: any,
          houses: any,
          services: any
        ) => {
          this.setState({
            isLoaded: true,
            data: rate.data,
            housesData: houses.data,
            servicesData: services.data
          });
        }));
    } else {
      // @ts-ignore
      Promise.all(this.RateController.getCreateFormPromise())
        .then(axios.spread((
          houses: any,
          services: any
        ) => {
          this.setState({
            isLoaded: true,
            data: this.emptyForm,
            housesData: houses.data,
            servicesData: services.data
          });
        }));
    }
  }

  private loadApartments = (housePk: number) => {
    Promise.all(this.RateController.getApartments(housePk))
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
  };

  private onHouseChange = (event: BaseSyntheticEvent) => {
    this.loadApartments(event.target.value);
    return void 0;
  };

  private checkIfHasId() {
    return this.props.match.params.id;
  }

  private handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = document.querySelector('#RateForm') as HTMLFormElement | undefined;
    const formData = new FormData(form) as FormData;
    const fromDate = formData.get('from_date-formatted') as string;
    formData.set('from_date', fromDate);
    formData.delete('from_date-formatted');
    axios({
      method: this.checkIfHasId() ? 'put' : 'post',
      url: this.checkIfHasId() ? `${this.RateController.rateEndpoint}${this.props.match.params.id}/` : this.RateController.rateEndpoint,
      headers: {
        'Authorization': 'Token ' + this.RateController.user.getAuthToken()
      },
      data: formData
    })
      .then((response: AxiosResponse) => {
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
          confirmButtonText: 'Повернутися до списку тарифів'
        }).then((result: SweetAlertResult) => {
          if (result.value) {
            this.props.history.push('/dashboard/rate');
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
  }

  private onDeleteClick = (event: SyntheticEvent) => {
    Swal.fire({
      title: 'Дісно бажаєте видалити тариф для будинку ' + this.state.data?.house_name,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
      cancelButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return axios({
          method: 'delete',
          url: `${this.RateController.rateEndpoint}${this.props.match.params.id}/`,
          headers: {
            'Authorization': 'Token ' + this.RateController.user.getAuthToken()
          }
        })
          .then(response => {
            Swal.fire({
              title: 'Териф видалено!',
              confirmButtonText: 'Повернутися до списку тарифів'
            }).then((result: SweetAlertResult) => {
              this.props.history.push('/dashboard/rate');
            });
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };

  private content = () => {
    const houses = this.state.housesData as any;
    const services = this.state.servicesData as any;
    return (
      <>
        <CardHeader>Тариф для будинку {this.state.data?.house_name}</CardHeader>
        <CardBody>
          <Form onSubmit={(event: FormEvent) => this.handleSubmit(event)} id="RateForm">
            <SelectWithChoices
              label={'Сервіс'}
              name={'service'}
              defaultValue={this.state.data?.service}
              error={this.state.fieldError.service}
            >
              {services.map((item: any) => (
                <option key={item.pk} value={item.pk}>{item.name}</option>
              ))}
            </SelectWithChoices>
            <SelectWithChoices
              label={'Будинок'}
              defaultValue={this.state.data?.house}
              name={'house'}
              error={this.state.fieldError.house}
              // changeHandler={this.onHouseChange}
              // helpText={!this.state.isApartmentSelectShow && 'Для вибору апартаментів виберіть спочатку будинок'}
            >
              {houses.map((item: any) => (
                <option key={item.pk} value={item.pk}>{item.name}</option>
              ))}
            </SelectWithChoices>
            <InputWithLabel
              label={'Вартість'}
              defaultValue={this.state.data?.value}
              name={'value'}
              type={'number'}
              error={this.state.fieldError.value}
            />
            <DataInput
              calendarPlacement={'top'}
              label={'Дійсний з'}
              name={'from_date'}
              error={this.state.fieldError.from_date}
              startValue={this.state.data?.from_date}
            />
            <Row>
              <Col>
                <Link to="/dashboard/rate">
                  <Button color="warning">
                    <Text text="buttons.returnBtn"/>
                  </Button>
                </Link>
              </Col>
              {this.props.match.params.id &&
              <Col className={'text-center'}>
                <PermissionComponent
                  aclList={this.context.rate} permissionName="delete"
                >
                  <Button color="danger" onClick={(event: SyntheticEvent) => this.onDeleteClick(event)}>
                    <Text text="buttons.deleteBtn"/>
                  </Button>
                </PermissionComponent>
              </Col>
              }
              <Col className={'text-right'}>
                <Button className="mr-0" type={'submit'}><Text text="buttons.submitBtn"/></Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </>
    );
  };

  render(): JSX.Element {
    if (this.state.isLoaded) {
      return (
        // @ts-ignore
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
    } else {
      return (
        <PageSpinner/>
      );
    }
  }
}