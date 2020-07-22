/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Collapse, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import { FiFilter } from 'react-icons/fi';
import PageSpinner from '../../../components/PageSpinner';
import PaymentFilterController from '../../../controllers/PaymentFilterController';

interface FilterProps {
  isLoaded: boolean,
}

interface FilterStateInterface {
  isLoaded: boolean,
  filterToggle: boolean,
  houseChoices: [] | null,
  serviceChoices: [] | null,
  paymentTypeChoices: [] | null
}

export default class PaymentFilter extends Component<FilterProps, FilterStateInterface> {

  protected PaymentFilterContoller: PaymentFilterController;

  constructor(props: any) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.PaymentFilterContoller = new PaymentFilterController();
  }

  state: FilterStateInterface = {
    isLoaded: false,
    filterToggle: false,
    houseChoices: null,
    serviceChoices: null,
    paymentTypeChoices: null
  };

  protected toggleFilter(): void {
    this.setState({
      filterToggle: !this.state.filterToggle
    });
  };

  public componentDidMount() {
    // @ts-ignore
    Promise.all(this.PaymentFilterContoller.getPromiseValues())
      .then(axios.spread((
        services: any,
        houses: any,
        paymentTypes: any
        ) => {
          this.setState({
            serviceChoices: services.data,
            houseChoices: houses.data,
            paymentTypeChoices: paymentTypes.data,
            isLoaded: true
          });
        }
      ));
  }


  public render(): any {
    const {
      filterSearchHandler,
      filterHouseHandler,
      filterServiceHandler,
      filterPaymentTypeHandler
    }: any = this.props;
    const isLoaded: boolean = this.state.isLoaded;
    const paymentChoices: any = this.state.paymentTypeChoices;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted mt-2"><Text text="global.loading"/></h3>
        </div>);
    } else {
      return (
        <>
          <Row form className="mb-2">
            <Button size="sm" color="secondary" outline onClick={this.toggleFilter} className="ml-2">
              <FiFilter/> <Text text="global.filter"/>
            </Button>
            <Form inline className="ml-auto" onSubmit={filterSearchHandler}>
              <FormGroup className="mr-2">
                <Label className="mr-2" for="search"><Text text="global.search"/></Label>
                <Input
                  type="text"
                  name="search"
                  filterquery="filter"
                  id="search"
                />
                <Button size="sm" className="ml-2" type="submit" color="primary"><Text text="global.search"/></Button>
              </FormGroup>
            </Form>
          </Row>
          <Collapse isOpen={this.state.filterToggle} className="mb-2">
            <Card>
              <CardBody className="pb-0">
                <Form>
                  <Row>
                    <Col className="pb-0 col-lg-6 col-12 mb-0">
                      <FormGroup>
                        <Label className="mr-2" for="payment_type">
                          <Text text="sidebar.paymentType"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="payment_type"
                          filterquery="payment_type"
                          id="payment_type"
                          onChange={filterPaymentTypeHandler}
                        >
                          {paymentChoices?.map((item: any) => (
                            <option key={item[0]} value={item[0]}>{item[1]}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12 mb-0">
                      <FormGroup>
                        <Label className="mr-2" for="service">
                          <Text text="sidebar.service"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="service"
                          filterquery="service"
                          id="service"
                          onChange={filterServiceHandler}
                        >
                          {this.state.serviceChoices?.map(({ name, pk }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pb-0 col-lg-12 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="house">
                          <Text text="sidebar.house"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="house"
                          filterquery="house"
                          id="house"
                          onChange={filterHouseHandler}
                        >
                          {this.state.houseChoices?.map(({ name, pk }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Collapse>
        </>
      );
    }
  }
}