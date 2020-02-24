import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";
import Page from "../../components/Page";
import ApartmentPhoneChecker from "../../utils/apartmentPhoneChecker";

export default class ApartmentNew extends AbstractFormView{
	constructor(props) {
		super(props);
		this.state = {
			resident: '',
			errors: {
				house: '',
				resident: '',
				number: true,
				description: '',
				area: true,
				resident_count: '',
			}
		};
		this.dataUrl = undefined
		this.postUrl = process.env.REACT_APP_APARTMENTS_URL;
		this.requestType = "post"
	}

	submitData(target){
		const userFormData = new FormData();
		// dict of all elements
		userFormData.append("house", target.house.value);
		// userFormData.append("resident", target.resident.value);
		userFormData.append("number", target.apartmentNumber.value);
		userFormData.append("description", target.description.value);
		userFormData.append("area", target.area.value);
		userFormData.append("resident_count", target.resident_count.value);
		return userFormData;
	}

	handleSubmit(){
		console.log("new apartment")
	}

	addResidentToState(id) {
		this.setState({
			resident: id
		})
	}

	/*
	 * Form field validation
	 * handleChange(event): void
	 *
	 * check field valid and
	 * set errors str to state
	 **/
	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		let errors = this.state.errors;
		switch (name) {
			case 'apartmentNumber':
				errors.number =
					value.length < 1 || value === '0'
						? [<Text text="global.validateErrors.apartmentNumber"/>]
						: '';
				break;
			case 'area':
				errors.area =
					value.length < 1 || value === '0'
						? [<Text text="global.validateErrors.apartmentArea"/>]
						: '';
				break;
			default:
				break;
		}

		this.setState({errors, [name]: value});
	};

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="apartmentForm.newApartment.title" /></CardHeader>
				<CardBody>
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="house"><Text text="apartmentForm.house"/></Label>
							{this.state.errors.house.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.house}</FormText>}
							<Input
								type="text"
								name="house"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="number"><Text text="apartmentForm.number"/></Label>
							{this.state.errors.number.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.number}</FormText>}
							<Input
								type="number"
								min="0"
								name="apartmentNumber"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="area"><Text text="apartmentForm.area"/></Label>
							{this.state.errors.area.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.area}</FormText>}
							<Input
								type="number"
								min="0"
								name="area"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="resident_count"><Text text="apartmentForm.residentCount"/></Label>
							{this.state.errors.resident_count.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.resident_count}</FormText>}
							<Input
								type="number"
								min="0"
								name="resident_count"
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="apartmentForm.description"/></Label>
							{this.state.errors.description.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.description}</FormText>}
							<Input
								type="textarea"
								name="description"
								onChange={this.handleChange}
							/>
						</FormGroup>

						<ApartmentPhoneChecker
							callback={this.addResidentToState}
						/>

						<Link to="/apartment">
							<Button color="warning">
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						{this.state.errors.resident ||
						this.state.errors.house ||
						this.state.errors.number ||
						this.state.errors.description ||
						this.state.errors.area ||
						this.state.errors.resident_count ?
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

	render() {
		return (
			<Page
				breadcrumbs={[{name: <Text text="sidebar.apartment"/>, active: false},
					{name: <Text text="apartmentForm.newApartment.title" />, active: true}]}
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