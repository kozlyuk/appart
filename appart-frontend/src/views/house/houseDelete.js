import React from 'react';
import AbstractDeleteView from '../../generics/deleteViews/abstractDeleteView';
import { Button, ButtonGroup, Card, CardBody, Col, Container } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Auth from '../../auth/auth';

export default class HouseDelete extends AbstractDeleteView {
  /**
   * House delete constructor
   *
   * @param props
   * @param dataUrl
   */
  constructor(props, dataUrl) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this.dataUrl = process.env.REACT_APP_HOUSES_URL;
    this.user = new Auth();
    this.successRedirect = '/house';
    this.successButton = 'Повернутися до списку будинків';
    this.submitHandler = this.submitHandler.bind(this);
  }

  /**
   *
   * @returns {*}
   */
  componentDidMount() {
    if (this.props.match) {
      this.loadData(this.dataUrl + this.props.match.params.id + '/');
    }
    return void 0;
  }

  /**
   *
   * @returns {*}
   * @constructor
   */
  Content() {
    return (
      <Col md={12}>
        <Card>
          <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
            <p><Text text="houseDelete.text"/> {this.state.data.name}</p>
            <ButtonGroup>
              <Link to="/house">
                <Button color="warning" size="sm"><Text text="buttons.returnBtn"/></Button>
              </Link>
              <Button onClick={this.submitHandler} color="danger" size="sm"><Text text="buttons.deleteBtn"/></Button>
            </ButtonGroup>
          </CardBody>
        </Card>
      </Col>
    );
  }

  /**
   *
   * @returns {*}
   */
  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <h3 className="text-center text-muted">
            <Text text="global.loading"/>
          </h3>
        </div>)
        ;
    } else {

      return (
        <Container>
          {this.Content()}
        </Container>
      );
    }
  }
}