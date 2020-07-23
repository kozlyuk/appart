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
import PageSpinner from '../../../components/PageSpinner';
import { FiFilter } from 'react-icons/fi';
import ApartmentController from '../../../controllers/ApartmentController';
import axios from 'axios';

/**
 * Filter interface
 */
interface FilterInterface {
  isLoaded: boolean
}

export default class ApartmentFilter extends React.Component<FilterInterface, {}> {

  private ApartmentController: ApartmentController = new ApartmentController();

  public state = {
    isLoaded: false,
    filterToggle: false,
    companyChoices: undefined,
    houseChoices: undefined
  };

  public componentDidMount() {
    Promise.all(this.ApartmentController.getFilterPromise()).then(axios.spread((
      companies: any,
      houses: any
    ) => {
      this.setState({
        isLoaded: true,
        companyChoices: companies.data,
        houseChoices: houses.data
      });
    }));
  }

  protected toggleFilter = (): void => {
    this.setState({
      filterToggle: !this.state.filterToggle
    });
  };


  public render(): any {
    const {
      filterSearchHandler,
      houseSelectHandler,
      companySelectHandler,
      filterIsActiveHandler
    }: any = this.props;
    const { houseChoices, companyChoices }: any = this.state;
    const isLoaded: boolean = this.state.isLoaded;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
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
                          onChange={houseSelectHandler}
                        >
                          {houseChoices?.map(({ name, pk }: { name: string, pk: number }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="company">
                          <Text text="sidebar.company"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="company"
                          filterquery="company"
                          id="company"
                          onChange={companySelectHandler}
                        >
                          {companyChoices?.map(({ name, pk }: { name: string, pk: number }) => (
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