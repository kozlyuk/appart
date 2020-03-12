import React from 'react';
import AbstractDeleteView from '../../generics/deleteViews/abstractDeleteView';
import { Button, ButtonGroup, Card, CardBody, Col, Container } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class ChoiceDelete extends AbstractDeleteView {
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
    this.dataUrl = process.env.REACT_APP_CHOICES_URL;
  }

  submitHandler() {
    console.log('delete');  //TODO!!!
  }

  /**
   *
   * @param dataUrl
   */
  loadData(dataUrl) {
    axios(dataUrl, {
      // headers: {
      // 	"Authorization": "Token " + this.authToken
      // }
    })
      .then(
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
            <p><Text text="choiceDelete.text"/> {this.state.data.choice_text}</p>
            <ButtonGroup>
              <Link to="/choice">
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