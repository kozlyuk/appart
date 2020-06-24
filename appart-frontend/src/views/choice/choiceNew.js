import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';

export default class ChoiceNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = undefined;
  }

  handleSubmit() {
    console.log('new choice');
  }

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Fragment>
        <CardHeader><Text text="choiceForm.newChoice.title"/></CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="choiceText"><Text text="choiceForm.choiceText"/></Label>
              <Input
                type="textarea"
                name="choiceText"
              />
            </FormGroup>

            <Link to="/dashboard/choice">
              <Button color="warning">
                <Text text="buttons.returnBtn"/>
              </Button>
            </Link>
            <Button className="float-right" onClick={this.handleSubmit}>
              <Text text="buttons.submitBtn"/>
            </Button>
          </Form>
        </CardBody>
      </Fragment>
    );
  }

  /**
   *
   * @returns {*}
   */
  render() {
    return (
      <Container>
        <Card>
          {this.content()}
        </Card>
      </Container>
    );
  }
}