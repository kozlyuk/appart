import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import PageSpinner from '../../components/PageSpinner';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';


export default class ChoiceList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED)
      //paginator settings end
    };
    this.dataUrl = process.env.REACT_APP_CHOICES_URL;
  }

  static contextType = PermissionContext;

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Table responsive>
        <thead>
        <tr align="center">
          <th><Text text="choiceList.tableHeader.choiceText"/></th>
          <th><Text text="choiceList.tableHeader.votes"/></th>
          <th><Text text="apartmentList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((choice) => (
          <tr align="center">
            <td width="2%">{choice.choice_text}</td>
            <td>{choice.votes}</td>
            <td width="15%">
              <PermissionComponent
                aclList={this.context.choice} permissionName="change"
              >
                <Link to={`choice/${choice.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="choiceList.tableHeader.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
              <PermissionComponent
                aclList={this.context.choice} permissionName="delete"
              >
                <Link to={`choice/${choice.pk}/delete`}>
                  <Badge color="danger" className="mr-1">
                    <Text text="choiceList.tableHeader.deleteBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  }

  /**
   *
   * @returns {*}
   */
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {

      return (
        <Page
          breadcrumbs={[{ name: <Text text="sidebar.choice"/>, active: true }]}
          className="TablePage"
        >
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.choice"/>
                  <Link to="choice/new">
                    <Button size="sm" className="float-right" color="success">
                      <Text text="choiceList.addBtn"/>
                    </Button>
                  </Link>
                </CardHeader>
                <CardBody>
                  {this.content()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      );
    }
  }
}