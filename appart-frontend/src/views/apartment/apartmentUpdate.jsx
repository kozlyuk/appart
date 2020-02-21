import React, {Fragment} from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	Form, FormGroup, FormText, Input, Label
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";
import AbstractFormView from "../../generics/formViews/abstractFormView";
import ApartmentPhoneChecker from "../../utils/apartmentPhoneChecker";
import Page from "../../components/Page";

export default class ApartmentUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.state = {
			// validation fields
			password: '',
			mobileNumber: '',
			residentData: '',
			errors: {
				house: '',
				resident: '',
				number: '',
				description: '',
				area: true,
				resident_count: true,
			},
			houseWithResident: false,
		};
		this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
		this.requestType = "put"
	}

	submitData(target){
		const userFormData = new FormData();
		// dict of all elements
		// userFormData.append("house.name", target.house.value);
		userFormData.append("number", target.number.value);
		userFormData.append("description", target.description.value);
		userFormData.append("area", target.area.value);
		userFormData.append("resident_count", target.residentCount.value);
		if (this.state.residentData) {
			userFormData.append("resident", this.state.residentData.pk);
		}
		return userFormData;
	}

	getResidentData = (value) => {
		this.setState({
			residentData: {
				pk: value["pk"],
				first_name: value["first_name"],
				last_name: value["last_name"],
				mobile_number: value["mobile_number"]
			}
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
			case 'house':
				errors.house =
					value.length < 1
						? [<Text text="global.validateErrors.emptyField"/>]
						: '';
				break;
			case 'number':
				errors.number =
					value < 0
						? [<Text text="global.validateErrors.apartmentNumber"/>]
						: '';
				break;
			case 'area':
				errors.area =
					value.length < 1 || value <= '0'
						? [<Text text="global.validateErrors.apartmentArea"/>]
						: '';
				break;
			case 'residentCount':
				errors.resident_count =
					value < '0'
						? [<Text text="global.validateErrors.incorrectNumber"/>]
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
				<CardHeader><Text text="apartmentForm.title" /> №{this.state.data.number}</CardHeader>
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
								readOnly
								onChange={this.handleChange}
								defaultValue={this.state.data.house_name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="number"><Text text="apartmentForm.number"/></Label>
							{this.state.errors.number.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.number}</FormText>}
							<Input
								type="number"
								name="number"
								min="0"
								onChange={this.handleChange}
								defaultValue={this.state.data.number}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="area"><Text text="apartmentForm.area"/></Label>
							{this.state.errors.area.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.area}</FormText>}
							<Input
								type="number"
								name="area"
								min="0"
								onChange={this.handleChange}
								defaultValue={this.state.data.area}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="residentCount"><Text text="apartmentForm.residentCount"/></Label>
							{this.state.errors.resident_count.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.resident_count}</FormText>}
							<Input
								type="number"
								name="residentCount"
								min="0"
								onChange={this.handleChange}
								defaultValue={this.state.data.residents_count}
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
								defaultValue={this.state.data.description}
							/>
						</FormGroup>

						<ApartmentPhoneChecker
							data={this.state.data}
							getResidentData={this.getResidentData}
						/>

						<Link to="/apartment">
							<Button color="warning">
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						{this.state.errors.house ||
						this.state.errors.resident ||
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
				<Page
					breadcrumbs={[{name: <Text text="sidebar.apartment"/>, active: false},
						{name: this.state.data.pk, active: true}]}
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
};
