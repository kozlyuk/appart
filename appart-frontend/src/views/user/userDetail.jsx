import Page from 'components/Page';
import React from 'react';
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader, CardImg, CardText, CardTitle,
	Col,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import axios from 'axios'
import {withRouter} from "react-router";
import UserCard from "../../components/Card/UserCard";
import Container from "reactstrap/es/Container";

class UserDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			data: null,
			modal: false,
			modal_backdrop: false,
			modal_nested_parent: false,
			modal_nested: false,
			backdrop: true,
		}
	}

	loadData(url) {
		axios(url, {
			// headers: {
			// 	"Authorization": "Token " + this.authToken
			// }
		})
			.then(
				result => {
					this.setState({
						isLoaded: true,
						data: result.data,
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

	componentDidMount() {
		const {REACT_APP_USERS_URL} = process.env;
		this.loadData(REACT_APP_USERS_URL + this.props.match.params.id + "/");
		return void 0;
	}

	Content() {
		return (
			<Col md={12}>
				<UserCard
					avatar={this.state.data.avatar}
					title={this.state.data.first_name}
					subtitle={this.state.data.last_name}
					text={this.state.data.email}
					style={{
						height: 300,
					}}
				>
					<CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
						{this.state.data.mobile_number ? <CardText><Text text="userDetail.mobileNumber"/> : {this.state.data.mobile_number}</CardText>: <></> }

					</CardBody>
				</UserCard>
			</Col>
		)
	}

	render() {
		const {error, isLoaded} = this.state;
		if (error) {
			return <div><Text text="global.error"/>: {error.message}</div>;
		} else if (!isLoaded) {
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
};

export default withRouter(UserDetail)
