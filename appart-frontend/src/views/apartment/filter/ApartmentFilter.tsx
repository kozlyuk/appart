/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
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
            <FormGroup>
              <Label for="houseFilter"><Text text="apartmentList.tableHeader.house"/></Label>
              <Input
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
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="search">Пошук</Label>
              <Input
                onChange={filterSearchHandler}
                type="text"
                name="search"
                filterquery="filter"
                id="search"
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }
  }
}