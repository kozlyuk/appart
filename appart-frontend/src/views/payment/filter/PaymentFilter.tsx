/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import {Col, FormGroup, Input, Label, Row} from 'reactstrap';
// @ts-ignore
import {Text} from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';

interface FilterInterface {
  isLoaded: boolean,
}

export default class PaymentFilter extends React.Component<FilterInterface, {}> {

  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }


  render(): any {
    const {filterSearchHandler}: any = this.props;
    const isLoaded: boolean = this.props.isLoaded;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted mt-2"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <Row form>
          <Col md={8}/>
          <Col md={4}>
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