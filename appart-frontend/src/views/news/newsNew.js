import React, { Fragment } from 'react';
import AbstractFormView from '../../generics/formViews/abstractFormView';
import { Button, Card, CardBody, CardHeader, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';

export default class NewsNew extends AbstractFormView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = undefined;
  }

  handleSubmit() {
    console.log('new news');
  }

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Fragment>
        <CardHeader><Text text="newsForm.newNews.title"/></CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="title"><Text text="newsForm.title"/></Label>
              <Input
                type="text"
                name="title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="house"><Text text="newsForm.houses"/></Label>
              <Input
                type="select"
                name="house"
              />
            </FormGroup>
            <FormGroup>
              <Label for="status"><Text text="newsForm.status"/></Label>
              <Input
                type="select"
                name="status"
              />
            </FormGroup>
            <FormGroup>
              <Label for="text"><Text text="newsForm.text"/></Label>
              <Input
                type="textarea"
                name="text"
              />
            </FormGroup>
            <FormGroup>
              <Label for="actualFrom"><Text text="newsForm.actualFrom"/></Label>
              <Input
                type="date"
                name="actualFrom"
              />
            </FormGroup>
            <FormGroup>
              <Label for="actualTo"><Text text="newsForm.actualTo"/></Label>
              <Input
                type="date"
                name="actualTo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="picture"><Text text="newsForm.picture"/></Label>
              <Input type="file" name="file"/>
              <FormText color="muted"/>
            </FormGroup>

            <Link to="/news">
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