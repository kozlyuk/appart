import React, {Fragment} from 'react';
import {
	Alert,
	Card,
	CardBody,
	CardHeader, Col,
	Form, FormGroup, FormText, Input, Label, Row
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";
import AbstractFormView from "../../generics/formViews/abstractFormView";
import ApartmentPhoneChecker from "../../utils/apartmentPhoneChecker";
import Page from "../../components/Page";

export default class ApartmentUpdate extends AbstractFormView {

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
			residentData: '',
			residentIsPinned: '',
			residentIdIsPinned: '',
			addedUserToForm: '',
			enableNativeMobileInput: true,
			errors: {
				house: '',
				resident: '',
				number: '',
				description: '',
				area: '',
				resident_count: true,
			},
			houseWithResident: false,
		};
		this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
		this.requestType = "put";
		this.addResidentToAppartment.bind(this)
	}

	/**
	 *
	 * @param target
	 * @returns {FormData}
	 */
	submitData(target){
		const userFormData = new FormData();
		// dict of all elements
		userFormData.append("house", this.state.data.house);
		userFormData.append("number", target.number.value);
		userFormData.append("description", target.description.value);
		userFormData.append("area", target.area.value);
		userFormData.append("residents_count", target.residentCount.value);
		if (this.state.residentIsPinned) {
			userFormData.append("resident", this.state.residentIdIsPinned);
		}
		return userFormData;
	}

	/**
	 *
	 * @param value
	 */
	getResidentData = (value) => {
		this.setState({
			residentData: {
				pk: value["pk"],
				first_name: value["first_name"],
				last_name: value["last_name"],
				mobile_number: value["mobile_number"]
			}
		})
	};

	/**
	 *
	 * @param resident_phone
	 * @param id
	 */
	addResidentToAppartment= (resident_phone, id) => {
		this.setState({
			residentIsPinned: resident_phone,
			residentIdIsPinned: id,
			addedUserToForm: resident_phone,
			enableNativeMobileInput: false,
		})
	}

	/*
	 * Form field validation
	 * handleChange(event): void
	 *
	 * check field valid and
	 * set errors str to state
	 *
	 * @param event
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

	/**
	 *
	 * @returns {*}
	 */
	content() {
		return (
			<Fragment>
				<CardHeader><Text text="apartmentForm.title" /> №{this.state.data.number}</CardHeader>
				<CardBody>
					<Form id="apartmentForm" onSubmit={this.handleSubmit}>
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
						{this.state.residentIsPinned &&
						<FormGroup>
							<Label for="resident"><Text text="apartmentForm.resident"/></Label>
							<Input
								type="tel"
								name="resident"
								readOnly
								defaultValue={this.state.residentIsPinned}
							/>
						</FormGroup>
						}
						{this.state.enableNativeMobileInput &&
						<FormGroup>
							<Label for="resident"><Text text="apartmentForm.resident"/></Label>
							<Input
								type="tel"
								name="resident"
								readOnly
								defaultValue={this.state.data.resident_phone}
							/>
						</FormGroup>
						}
						{this.state.addedUserToForm &&
						<Alert className="mt-2" color="success">
							При збереженні форми, користувача з номером {this.state.residentIsPinned} буде додано до апартаментів.
						</Alert>
						}
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
				<Page
					breadcrumbs={[{name: <Text text="sidebar.apartment"/>, active: false},
						{name: this.state.data.pk, active: true}]}
					className="TablePage"
				>
					<Row>
						<Col xl={7}>
							<Card>
								{this.content()}
							</Card>
						</Col>
						<Col xl={5}>
							<Card>
								<CardBody>
									<Form>
										<FormGroup>
											<ApartmentPhoneChecker
												data={this.state.data}
												addResidentToAppartment={this.addResidentToAppartment}
											/>
										</FormGroup>
									</Form>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Page>
			);
		}
	}
};
