/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component, FormEvent, SyntheticEvent } from 'react';
import PageSpinner from '../../components/PageSpinner';
import { PermissionContext } from '../../globalContext/PermissionContext';
import axios, { AxiosResponse } from 'axios';
import Page from '../../components/Page';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';
import InputWithLabel from '../../components/FormInputs/InputWithLabel';
import { Link } from 'react-router-dom';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import Swal, { SweetAlertResult } from 'sweetalert2';
import CompanyController from '../../controllers/CompanyController';

interface CompanyFormInterface {
  isLoaded: boolean,
  data?: Company,
  fieldError?: Company,
  errors?: ValidationErrors,
  uomTypes?: [any]
}

type Company = {
  address: string, //
  bank_requisites: string, //
  chief: string,
  description: string, //
  fullname: string, //
  logo: string,
  name: string, //
  phone: string, //
  pk: number,
  requisites: string
}

type ValidationErrors = {
  photoFormat: string,
  photoSize: string
}

export default class CompanyForm extends Component<any, CompanyFormInterface> {

  private CompanyController: CompanyController;

  constructor(props: any) {
    super(props);
    this.CompanyController = new CompanyController();
  }

  static contextType = PermissionContext;

  public state: CompanyFormInterface = {
    isLoaded: false,
    data: undefined,
    uomTypes: undefined,
    errors: {
      photoFormat: '',
      photoSize: ''
    }
  };

  private id = this.props.match.params.id;

  private uploadFileValidationFormat(event: any) {
    return event.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/);
  }

  private uploadFileValidationSize(event: any) {
    return Math.round((event.target.files[0].size / 1000)) < 5000;
  }

  public componentDidMount(): void {
    if (this.id) {
      Promise.all(this.CompanyController.getUpdateFormPromise(this.id))
        .then(axios.spread((
          company: any
        ) => {
          this.setState({
            isLoaded: true,
            data: company.data
          });
        }));
    } else {
      Promise.all(this.CompanyController.getCreateFormPromise())
        .then(axios.spread((
          uom: any
        ) => {
          this.setState({
            isLoaded: true
          });
        }));
    }
  }

  private handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = document.querySelector('#CompanyForm') as HTMLFormElement | undefined;
    const formData = new FormData(form) as FormData;
    axios({
      method: this.id ? 'put' : 'post',
      url: this.id ? `${this.CompanyController.companyEndpoint}${this.props.match.params.id}/` : this.CompanyController.companyEndpoint,
      headers: {
        'Authorization': 'Token ' + this.CompanyController.user.getAuthToken()
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
          confirmButtonText: 'Повернутися до списку компаній'
        }).then((result: SweetAlertResult) => {
          if (result.value) {
            this.props.history.push('/dashboard/company');
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
      title: 'Дісно бажаєте видалити компанію ' + this.state.data?.name,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Так',
      cancelButtonText: 'Ні',
      cancelButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return axios({
          method: 'delete',
          url: `${this.CompanyController.companyEndpoint}${this.props.match.params.id}/`,
          headers: {
            'Authorization': 'Token ' + this.CompanyController.user.getAuthToken()
          }
        })
          .then(response => {
            Swal.fire({
              title: 'Компанію видалено!',
              confirmButtonText: 'Повернутися до списку компаній'
            }).then((result: SweetAlertResult) => {
              this.props.history.push('/dashboard/company');
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

  handleChange = (event: any) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case 'logo':
        // @ts-ignore
        errors.photoFormat =
          this.uploadFileValidationFormat(event)
            ? ''
            : [<Text text="global.validateErrors.pictureExtension"/>];
        // @ts-ignore
        errors.photoSize =
          this.uploadFileValidationSize(event)
            ? ''
            : [<Text text="global.validateErrors.pictureSize"/>];
        break;
      default:
        break;
    }

    // @ts-ignore
    this.setState({ errors });
  };

  private companyHeader = () => {
    if (this.id) {
      return `Компанія: ${this.state.data?.name}`;
    } else {
      return `Нова компанія`;
    }
  };

  private content = () => {
    const { data, fieldError, errors } = this.state;
    return (
      <>
        <CardHeader>{this.companyHeader()}</CardHeader>
        <CardBody>
          <Form id="CompanyForm" onSubmit={(event: FormEvent) => this.handleSubmit(event)}>
            <InputWithLabel
              name="name"
              label="Назва"
              defaultValue={data?.name}
              error={fieldError?.name}
            />
            <InputWithLabel
              name="fullname"
              label="Повна назва"
              defaultValue={data?.fullname}
              error={fieldError?.fullname}
            />
            <InputWithLabel
              name="phone"
              label="Контактний телефон"
              defaultValue={data?.phone}
              error={fieldError?.phone}
            />
            <InputWithLabel
              name="address"
              label="Адреса"
              type="textarea"
              defaultValue={data?.address}
              error={fieldError?.address}
            />
            <InputWithLabel
              name="bank_requisites"
              label="Банківські реквізити"
              type="textarea"
              defaultValue={data?.bank_requisites}
              error={fieldError?.bank_requisites}
            />
            <InputWithLabel
              name="requisites"
              label="Реквізити"
              type="textarea"
              defaultValue={data?.requisites}
              error={fieldError?.requisites}
            />
            <InputWithLabel
              name="description"
              label="Додатковий опис"
              type="textarea"
              defaultValue={data?.description}
              error={fieldError?.description}
            />
            <FormGroup>
              <Label for="photo"><Text text="houseForm.photo"/></Label>
              <Input
                invalid={!!fieldError?.logo || !!errors?.photoFormat || !!errors?.photoSize}
                id="photo"
                type="file"
                name="logo"
                onChange={this.handleChange.bind(this)}
              />
              {fieldError?.logo &&
              <FormFeedback>{fieldError?.logo}</FormFeedback>
              }
              {errors?.photoFormat &&
              <FormFeedback>{errors?.photoFormat}</FormFeedback>
              }
              {errors?.photoSize &&
              <FormFeedback>{errors?.photoSize}</FormFeedback>
              }
            </FormGroup>
            <Row>
              <Col>
                <Link to="/dashboard/company">
                  <Button color="warning">
                    <Text text="buttons.returnBtn"/>
                  </Button>
                </Link>
              </Col>
              {/*{this.props.match.params.id &&*/}
              {/*<Col className={'text-center'}>*/}
              {/*  <PermissionComponent*/}
              {/*    aclList={this.context.company} permissionName="delete"*/}
              {/*  >*/}
              {/*    <Button color="danger" onClick={(event: SyntheticEvent) => this.onDeleteClick(event)}>*/}
              {/*      <Text text="buttons.deleteBtn"/>*/}
              {/*    </Button>*/}
              {/*  </PermissionComponent>*/}
              {/*</Col>*/}
              {/*}*/}
              <Col className={'text-right'}>
                <Button disabled={!!errors?.photoFormat || !!errors?.photoSize} className="mr-0" type={'submit'}><Text
                  text="buttons.submitBtn"/></Button>
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