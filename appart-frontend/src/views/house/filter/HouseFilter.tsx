/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';

interface FilterInterface {
  isLoaded: boolean,
}

export default class HouseFilter extends React.Component<FilterInterface, {}> {

  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }


  render(): any {
    const { filterSearchHandler }: any = this.props;
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
          <Form inline className="mx-auto mb-2" onSubmit={filterSearchHandler}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label className="mr-sm-2" for="search">Пошук</Label>
              <Input
                type="text"
                name="search"
                filterquery="filter"
                id="search"
              />
              <Button className="ml-2" type="submit" color="primary">Пошук</Button>
            </FormGroup>
          </Form>
        </Row>
      );
    }
  }
}