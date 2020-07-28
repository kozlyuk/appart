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
import RateController from '../../../controllers/RateController';

/**
 * Filter interface.
 */
interface FilterProps {
  filterSearchHandler: any,
  filterHouseHandler: any,
  filterServiceHandler: any,
  isLoaded: boolean,
}

/**
 * Filter state interface.
 */
interface FilterStateInterface {
  isLoaded: boolean,
  filterToggle: boolean,
  houseChoices: [] | any,
  serviceChoices: [] | any
}

export default class RateFilter extends Component<FilterProps, FilterStateInterface> {

  protected RateController: RateController;

  constructor(props: any) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.RateController = new RateController();
  }

  state: FilterStateInterface = {
    isLoaded: false,
    filterToggle: false,
    houseChoices: null,
    serviceChoices: null
  };

  protected toggleFilter(): void {
    this.setState({
      filterToggle: !this.state.filterToggle
    });
  };

  public componentDidMount() {
    const emptyHouse = { pk: '', name: '----------' };
    const emptyService = { pk: '', name: '----------' };
    Promise.all(this.RateController.getFilterPromise())
      .then(axios.spread((
        houses,
        services
        ) => {
          this.setState({
            houseChoices: [emptyHouse, ...houses.data],
            serviceChoices: [emptyService, ...services.data],
            isLoaded: true
          });
        }
      ));
  }


  public render(): any {
    const {
      filterSearchHandler,
      filterHouseHandler,
      filterServiceHandler
    }: any = this.props;
    const isLoaded: boolean = this.state.isLoaded;
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
          </Row>
          <Collapse isOpen={this.state.filterToggle} className="mb-2">
            <Card>
              <CardBody className="pb-0">
                <Form>
                  <Row>
                    <Col className="pb-0 col-lg-6 col-12">
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
                          {this.state.houseChoices?.map(({ name, pk }: any) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12">
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
                          {this.state.serviceChoices?.map(({ name, pk }: any) => (
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