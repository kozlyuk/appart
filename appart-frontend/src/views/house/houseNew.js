import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";
import Page from "../../components/Page";

export default class HouseNew extends AbstractFormView{
	/**
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			// validation fields
			password: '',
			mobileNumber: '',
			errors: {
				description: '',
				address: true,
				name: true,
				photoFormat: '',
				photoSize: '',
				apartmentCount: true,
			}
		};
		this.dataUrl = undefined
		this.postUrl = process.env.REACT_APP_HOUSES_URL;
		this.requestType = "post"
	}

	/**
	 *
	 * @param event
	 * @returns {*}
	 */
	uploadFileValidationFormat(event) {
		return event.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)
	}

	/**
	 *
	 * @param event
	 * @returns {boolean}
	 */
	uploadFileValidationSize(event) {
		return Math.round((event.target.files[0].size / 1000)) < 5000;
	}

	/**
	 *
	 * @param target
	 * @returns {FormData}
	 */
	submitData(target){
		const userFormData = new FormData();
		// dict of all elements
		console.log(target)
		userFormData.append("description", target.description.value);
		userFormData.append("address", target.address.value);
		userFormData.append("name", target.name.value);
		if (target.photo.files[0]) {
			userFormData.append("logo", target.photo.files[0]);
		}
		userFormData.append("apartments_count", target.apartmentCount.value);
		return userFormData;
	}

	/**
	 * Form field validation
	 * handleChange(event): void
	 *
	 * check field valid and
	 * set errors str to state
	 *
	 * @param event
	 */
	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		let errors = this.state.errors;
		switch (name) {
			case 'address':
				errors.address =
					value.length < 1
						? [<Text text="global.validateErrors.emptyField"/>]
						: '';
				break;
			case 'name':
				errors.name =
					value.length < 1
						? [<Text text="global.validateErrors.emptyField"/>]
						: '';
				break;
			case 'apartmentCount':
				errors.apartmentCount =
					value === '0' || value === ""
						? [<Text text="global.validateErrors.houseApartmentsCount"/>]
						: '';
				break;
			case 'photo':
				errors.photoFormat =
					this.uploadFileValidationFormat(event)
						? ''
						: [<Text text="global.validateErrors.pictureExtension"/>];
				errors.photoSize =
					this.uploadFileValidationSize(event)
						? ''
						: [<Text text="global.validateErrors.pictureSize"/>];
				break;
			default:
				break;
		}

		this.setState({errors, [name]: value});
	};

	/**
	 *
	 * @returns {*}
	 */
	content() {
		return (
			<Fragment>
				<CardHeader><Text text="houseForm.newHouse.title" /></CardHeader>
				<CardBody>
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="name"><Text text="houseForm.name"/></Label>
							{this.state.errors.name.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.name}</FormText>}
							<Input
								type="text"
								name="name"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="address"><Text text="houseForm.address"/></Label>
							{this.state.errors.address.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.address}</FormText>}
							<Input
								type="text"
								name="address"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="photo"><Text text="houseForm.photo"/></Label>
							{this.state.errors.photoFormat.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.photoFormat}</FormText>}
							{this.state.errors.photoSize.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.photoSize}</FormText>}
							<Input
								type="file"
								name="photo"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="houseForm.description"/></Label>
							{this.state.errors.description.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.description}</FormText>}
							<Input
								type="textarea"
								name="description"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="apartmentCount"><Text text="houseForm.apartmentCount"/></Label>
							{this.state.errors.apartmentCount.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.apartmentCount}</FormText>}
							<Input
								type="number"
								name="apartmentCount"
								min="0"
								onChange={this.handleChange}
							/>
						</FormGroup>

						<Link to="/house">
							<Button color="warning">
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						{this.state.errors.address ||
						this.state.errors.name ||
						this.state.errors.photoSize ||
						this.state.errors.photoFormat ||
						this.state.errors.apartmentCount ?
							<Button disabled className="float-right">
								<Text text="buttons.submitBtn"/>
							</Button>:<Button className="float-right" type="submit">
								<Text text="buttons.submitBtn"/>
							</Button>
						}
					</Form>
				</CardBody>
			</Fragment>
		)
	}

	/**
	 *
	 * @returns {*}
	 */
	render() {
		return (
			<Page
				breadcrumbs={[{name: <Text text="sidebar.house"/>, active: false},
					{name: <Text text="houseForm.newHouse.title" />, active: true}]}
				className="TablePage"
			>
				<Container>
					<Card>
						{this.content()}
					</Card>
				</Container>
			</Page>
		);
	}
}