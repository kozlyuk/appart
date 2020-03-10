import React from "react";
import AbstractDeleteView from "../../generics/deleteViews/abstractDeleteView";
import Container from "reactstrap/es/Container";
import UserCard from "../../components/Card/UserCard";
import {CardBody, CardText, Col} from "reactstrap";
import {Text} from "react-easy-i18n";
import axios from "axios";
import Card from "reactstrap/es/Card";
import Button from "reactstrap/es/Button";
import ButtonGroup from "reactstrap/es/ButtonGroup";
import {Link} from "react-router-dom";

export default class HouseDelete extends AbstractDeleteView {
	/**
	 *
	 * @param props
	 * @param dataUrl
	 */
	constructor(props, dataUrl) {
		super(props);
		this.state = {
			isLoaded: false,
		};
		this.dataUrl = process.env.REACT_APP_HOUSES_URL
	}

	submitHandler() {
		console.log("delete")  //TODO!!!
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

	/**
	 *
	 * @returns {*}
	 */
	componentDidMount() {
		this.loadData(this.dataUrl + this.props.match.params.id + "/");
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
						<p><Text text="houseDelete.text" /> {this.state.data.name}</p>
						<ButtonGroup>
							<Link to="/house">
								<Button color="warning" size="sm"><Text text="buttons.returnBtn" /></Button>
							</Link>
							<Button onClick={this.submitHandler} color="danger" size="sm"><Text text="buttons.deleteBtn" /></Button>
						</ButtonGroup>
					</CardBody>
				</Card>
			</Col>
		)
	}

	/**
	 *
	 * @returns {*}
	 */
	render() {
		const {isLoaded} = this.state;
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
			)
		}
	}
}