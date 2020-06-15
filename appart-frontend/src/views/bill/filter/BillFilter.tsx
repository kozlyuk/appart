/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import { FiFilter } from 'react-icons/fi';
import PageSpinner from '../../../components/PageSpinner';
import BillFilterController from '../../../controllers/BillFilterController';

/**
 * Filter interface.
 */
interface FilterInterface {
  isLoaded: boolean,
}

/**
 * Filter state interface.
 */
interface FilterStateInterface {
  isLoaded: boolean,
  filterToggle: boolean,
  houseChoices: [] | null,
  serviceChoices: [] | null
}

export default class BillFilter extends React.Component<FilterInterface, FilterStateInterface> {

  protected BillFilterController: BillFilterController;

  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      filterToggle: false,
      houseChoices: null,
      serviceChoices: null
    };
    this.toggleFilter = this.toggleFilter.bind(this);
    this.BillFilterController = new BillFilterController();
  }

  protected toggleFilter(): void {
    this.setState({
      filterToggle: !this.state.filterToggle
    });
  };

  public componentDidMount() {
    Promise.all(this.BillFilterController.getPromiseValues())
      .then(axios.spread((
        houses,
        services
        ) => {
          this.setState({
            houseChoices: houses.data,
            serviceChoices: services.data,
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
      filterIsActiveHandler
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
            <Form inline className="ml-auto">
              <FormGroup>
                <div>
                  <CustomInput
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    label={<Text text="global.displayInactive"/>} inline
                    onChange={filterIsActiveHandler}
                  />
                </div>
              </FormGroup>
            </Form>
            <Form inline className="ml-2" onSubmit={filterSearchHandler}>
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
                          {this.state.houseChoices?.map(({ name, pk }) => (
                            <option value={pk}>{name}</option>
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
                          {this.state.serviceChoices?.map(({ name, pk }) => (
                            <option value={pk}>{name}</option>
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