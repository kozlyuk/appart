import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import UserCard from '../../components/Card/UserCard';
import { Link } from 'react-router-dom';
import PageSpinner from '../../components/PageSpinner';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';


export default class NewsList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = process.env.REACT_APP_NEWS_URL;
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
          <th><Text text="newsList.tableHeader.title"/></th>
          <th><Text text="newsList.tableHeader.status"/></th>
          <th><Text text="newsList.tableHeader.actualTime"/></th>
          <th><Text text="newsList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((news) => (
          <tr align="center">
            <td width="2%">{news.title}</td>
            <td>{news.news_status}</td>
            <td>{news.actual_from} - {news.actual_to}</td>
            <td width="15%">
              <PermissionComponent
                aclList={this.context.news} permissionName="change"
              >
                <Link to={`news/${news.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="newsList.tableHeader.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
              <PermissionComponent
                aclList={this.context.choice} permissionName="delete"
              >
                <Link to={`news/${news.pk}/delete`}>
                  <Badge color="danger" className="mr-1">
                    <Text text="newsList.tableHeader.deleteBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{news.name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={news.logo}
                    title={news.name}
                    subtitle={news.address}
                    text={news.description}
                    style={{
                      height: 300
                    }}
                  >
                  </UserCard>
                </Col>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggle()}>
                  <Text text="buttons.closeBtn"/>
                </Button>
              </ModalFooter>
            </Modal>
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
          breadcrumbs={[{ name: <Text text="sidebar.news"/>, active: true }]}
          className="TablePage"
        >
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.news"/>
                  <Link to="news/new">
                    <Button size="sm" className="float-right" color="success">
                      <Text text="newsList.addBtn"/>
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