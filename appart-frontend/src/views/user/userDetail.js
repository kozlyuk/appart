import React from 'react';
import {
	CardBody,
	CardText,
	Col,
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import {withRouter} from "react-router";
import UserCard from "../../components/Card/UserCard";
import Container from "reactstrap/es/Container";
import AbstractDetailView from "../../generics/detailViews/abstractDetailView";

class UserDetail extends AbstractDetailView {
	/**
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_USERS_URL
	}

	/**
	 *
	 * @returns {*}
	 * @constructor
	 */
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

	/**
	 *
	 * @returns {*}
	 */
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
