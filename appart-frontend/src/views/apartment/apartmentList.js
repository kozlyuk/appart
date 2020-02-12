import AbstractListView from "../../generics/listViews/abstractListView";
import Page from 'components/Page';
import React from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader, CardText,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import UserCard from "../../components/Card/UserCard";
import {Link} from "react-router-dom";


export default class ApartmentList extends AbstractListView {
    constructor(props) {
        super(props);
        this.dataUrl = process.env.REACT_APP_APARTMENTS_URL
    }

    content() {
        return (
            <Table responsive>
                <thead>
                <tr align="center">
                    <th><Text text="apartmentList.tableHeader.number"/></th>
                    <th><Text text="apartmentList.tableHeader.house"/></th>
                    <th><Text text="apartmentList.tableHeader.area"/></th>
                    <th><Text text="apartmentList.tableHeader.resident"/></th>
                    <th><Text text="apartmentList.tableHeader.actions"/></th>
                </tr>
                </thead>
                <tbody>
                {this.state.data.map((apartment) => (
                    <tr align="center">
                        <td width="2%">{apartment.number}</td>
                        <td>{apartment.house.name}</td>
                        <td>{apartment.area}</td>
                        <td>{apartment.resident.first_name} {apartment.resident.last_name}</td>
                        <td width="15%">
                            <Link to={`apartment/${apartment.pk}/edit`}>
                                <Badge color="warning" className="mr-1">
                                    <Text text="apartmentList.tableHeader.editBtn"/>
                                </Badge>
                            </Link>
                            <Link to={`apartment/${apartment.pk}/delete`}>
                                <Badge color="danger" className="mr-1">
                                    <Text text="apartmentList.tableHeader.deleteBtn"/>
                                </Badge>
                            </Link>
                        </td>

                        <Modal
                            isOpen={this.state.modal}
                            toggle={this.toggle()}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle()}>{apartment.name}</ModalHeader>
                            <ModalBody>
                                <Col md={12}>
                                    <UserCard
                                        avatar={apartment.logo}
                                        title={apartment.name}
                                        subtitle={apartment.address}
                                        text={apartment.description}
                                        style={{
                                            height: 300,
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
        )
    }

    render() {
        const {error, isLoaded} = this.state;
        if (error) {
            return <div><Text text="global.error" />: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="loaderWrapper text-center mt-4">
                    <h3 className="text-center text-muted"><Text text="global.loading" /></h3>
                </div>)
                ;
        } else {

            return (
                <Page
                    breadcrumbs={[{name: <Text text="sidebar.apartment"/>, active: true}]}
                    className="TablePage"
                >
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader>
                                    <Text text="sidebar.apartment"/>
                                    <Link to="/apartment/new">
                                        <Button size="sm" className="float-right" color="success">
                                            <Text text="apartmentList.addBtn"/>
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
            )
        }
    }
}