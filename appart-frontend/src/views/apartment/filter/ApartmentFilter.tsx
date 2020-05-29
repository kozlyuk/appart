/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';

/**
 * Filter interface
 */
interface FilterInterface {
  isLoaded: boolean
}

export default class ApartmentFilter extends React.Component<FilterInterface, {}> {

  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }


  render(): any {
    const { filterSearchHandler }: any = this.props;
    const { filterSelectHandler }: any = this.props;
    const isLoaded: boolean = this.props.isLoaded;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <Row form>
          <Col md={6}>
            <Form inline className="mx-auto mb-2">
              <FormGroup style={{ width: '100%' }}>
                <Label sm={2} for="houseFilter"><Text text="apartmentList.tableHeader.house"/></Label>
                <Col className="col-sm-10 pl-0 pr-0">
                  <Input
                    style={{ width: '100%' }}
                    onChange={filterSelectHandler}
                    type="select"
                    name="houseFilter"
                    filterquery="house"
                    id="houseFilter"
                  >
                    {/*
                   // @ts-ignore*/}
                    {this.props.data.map(option => (
                      <option key={option.pk} value={option.pk}>
                        {option.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col md={6}>
            <Form inline className="mx-auto mb-2" onSubmit={filterSearchHandler}>
              <FormGroup style={{ width: '100%' }}>
                <Label sm={2} for="search"><Text text="global.search"/></Label>
                <Col className="col-sm-8 pr-0 pl-0">
                  <Input
                    style={{ width: '100%' }}
                    type="text"
                    name="search"
                    filterquery="filter"
                    id="search"
                  />
                </Col>
                <Col className="col-sm-2 pr-0 pl-0">
                  <Button size="sm" className="ml-2" type="submit" color="primary"><Text text="global.search"/></Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      );
    }
  }
}