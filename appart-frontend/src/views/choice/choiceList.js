import AbstractListView from "../../generics/listViews/abstractListView";
import Page from 'components/Page';
import React from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";


export default class ChoiceList extends AbstractListView {
    constructor(props) {
        super(props);
        this.dataUrl = process.env.REACT_APP_CHOICES_URL
    }

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
                            <Link to={`choice/${choice.pk}/edit`}>
                                <Badge color="warning" className="mr-1">
                                    <Text text="choiceList.tableHeader.editBtn"/>
                                </Badge>
                            </Link>
                            <Link to={`choice/${choice.pk}/delete`}>
                                <Badge color="danger" className="mr-1">
                                    <Text text="choiceList.tableHeader.deleteBtn"/>
                                </Badge>
                            </Link>
                        </td>
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
                    breadcrumbs={[{name: <Text text="sidebar.choice"/>, active: true}]}
                    className="TablePage"
                >
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader>
                                    <Text text="sidebar.choice"/>
                                    <Link to="/choice/new">
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
            )
        }
    }
}