import React from 'react';
import Container from 'reactstrap/lib/Container';
import { CardBody, Col } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import Card from 'reactstrap/lib/Card';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import { Link } from 'react-router-dom';
import AbstractDeleteView from '../../generics/deleteViews/abstractDeleteView';

export default class ApartmentDelete extends AbstractDeleteView {
  /**
   *
   * @param props
   * @param dataUrl
   */
  constructor(props, dataUrl) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
  }

  submitHandler() {
    console.log('delete'); // TODO!!!
  }

  /**
   *
   * @param dataUrl
   */
  loadData(dataUrl) {
    axios(dataUrl, {
      // headers: {
      // "Authorization": "Token " + this.authToken
      // }
    }).then(
      result => {
        this.setState({
          isLoaded: true,
          data: result.data
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }

  /**
   *
   * @returns {*}
   */
  componentDidMount() {
    if (this.props.match.params) {
      this.loadData(`${this.dataUrl + this.props.match.params.id}/`);
    }
    return 0;
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
            <p>
              <Text text="apartmentDelete.text"/> {this.state.data.number}
            </p>
            <ButtonGroup>
              <Link to="/apartment">
                <Button color="warning" size="sm">
                  <Text text="buttons.returnBtn"/>
                </Button>
              </Link>
              <Button onClick={this.submitHandler} color="danger" size="sm">
                <Text text="buttons.deleteBtn"/>
              </Button>
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
        </div>
      );
    }

    return <Container>{this.Content()}</Container>;
  }
}
