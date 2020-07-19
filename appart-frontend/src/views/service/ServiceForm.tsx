/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component, FormEvent, SyntheticEvent } from 'react';
import PageSpinner from '../../components/PageSpinner';
import ServiceController from '../../controllers/ServiceController';
import { PermissionContext } from '../../globalContext/PermissionContext';
import axios, { AxiosResponse } from 'axios';
import Page from '../../components/Page';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Row } from 'reactstrap';
import InputWithLabel from '../../components/FormInputs/InputWithLabel';
import SelectWithChoices from '../../components/FormInput/SelectWithChoices';
import { Link } from 'react-router-dom';
import PermissionComponent from '../../acl/PermissionComponent';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import Swal, { SweetAlertResult } from 'sweetalert2';

interface ServiceFormInterface {
  isLoaded: boolean,
  data?: Service,
  fieldError?: Service,
  uomTypes?: [any]
}

type Service = {
  pk: number,
  houses: [],
  name: string,
  description: string,
  uom_type: string,
  uom: string
}

export default class ServiceForm extends Component<any, ServiceFormInterface> {

  private ServiceController: ServiceController;

  constructor(props: any) {
    super(props);
    this.ServiceController = new ServiceController();
  }

  static contextType = PermissionContext;

  public state: ServiceFormInterface = {
    isLoaded: false,
    data: undefined,
    uomTypes: undefined
  };

  private id = this.props.match.params.id;

  public componentDidMount(): void {
    if (this.id) {
      Promise.all(this.ServiceController.getUpdateFormPromise(this.id))
        .then(axios.spread((
          service: any,
          uom: any
        ) => {
          this.setState({
            isLoaded: true,
            data: service.data,
            uomTypes: uom.data
          });
        }));
    } else {
      Promise.all(this.ServiceController.getCreateFormPromise())
        .then(axios.spread((
          uom: any
        ) => {
          this.setState({
            isLoaded: true,
            uomTypes: uom.data
          });
        }));
    }
  }

  private handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = document.querySelector('#ServiceForm') as HTMLFormElement | undefined;
    const formData = new FormData(form) as FormData;
    axios({
      method: this.id ? 'put' : 'post',
      url: this.id ? `${this.ServiceController.serviceEndpoint}${this.props.match.params.id}/` : this.ServiceController.serviceEndpoint,
      headers: {
        'Authorization': 'Token ' + this.ServiceController.user.getAuthToken()
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
          confirmButtonText: 'Повернутися до списку сервісів'
        }).then((result: SweetAlertResult) => {
          if (result.value) {
            this.props.history.push('/dashboard/service');
          }
        });
      })
      .catch((error: any) => {
        // @ts-ignore
        this.setState({ fieldError: error.response.data });
        let errorArr = [];
        for (let i in error.response.data) {
          errorArr.push(error.response.data[i]);
        }
        const errorString: string[] = (errorArr.map(item => {
          const errorValue: string = item[0].toString();
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
      title: 'Дісно бажаєте видалити сервіс ' + this.state.data?.name,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
      cancelButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return axios({
          method: 'delete',
          url: `${this.ServiceController.serviceEndpoint}${this.props.match.params.id}/`,
          headers: {
            'Authorization': 'Token ' + this.ServiceController.user.getAuthToken()
          }
        })
          .then(response => {
            Swal.fire({
              title: 'Сервіс видалено!',
              confirmButtonText: 'Повернутися до списку сервісів'
            }).then((result: SweetAlertResult) => {
              this.props.history.push('/dashboard/service');
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

  private serviceHeader = () => {
    if (this.id) {
      return `Сервіс: ${this.state.data?.name}`;
    } else {
      return `Новий сервіс`;
    }
  };

  private content = () => {
    const { data, fieldError, uomTypes } = this.state;
    return (
      <>
        <CardHeader>{this.serviceHeader()}</CardHeader>
        <CardBody>
          <Form id="ServiceForm" onSubmit={(event: FormEvent) => this.handleSubmit(event)}>
            <InputWithLabel
              name="name"
              label="Назва"
              defaultValue={data?.name}
              error={fieldError?.name}
            />
            <InputWithLabel
              name="description"
              label="Опис"
              type="textarea"
              defaultValue={data?.description}
              error={fieldError?.description}
            />
            <SelectWithChoices
              name="uom_type"
              label="Одиниця виміру"
              defaultValue={data?.uom_type}
              error={fieldError?.uom_type}
            >
              {uomTypes?.map(item => (
                <option key={item[0]} value={item[0]}>{item[1]}</option>
              ))}
            </SelectWithChoices>
            <Row>
              <Col>
                <Link to="/dashboard/service">
                  <Button color="warning">
                    <Text text="buttons.returnBtn"/>
                  </Button>
                </Link>
              </Col>
              {this.props.match.params.id &&
              <Col className={'text-center'}>
                <PermissionComponent
                  aclList={this.context.service} permissionName="delete"
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