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

export default class ApartmentUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_APARTMENTS_URL
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="apartmentForm.title" />: {this.state.data.number}</CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="house"><Text text="apartmentForm.house"/></Label>
							<Input
								type="text"
								name="house"
								defaultValue={this.state.data.house}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="number"><Text text="apartmentForm.number"/></Label>
							<Input
								type="number"
								name="number"
								defaultValue={this.state.data.number}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="area"><Text text="apartmentForm.area"/></Label>
							<Input
								type="number"
								name="area"
								defaultValue={this.state.data.area}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="residentCount"><Text text="apartmentForm.residentCount"/></Label>
							<Input
								type="number"
								name="residentCount"
								defaultValue={this.state.data.residents_count}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="apartmentForm.description"/></Label>
							<Input
								type="textarea"
								name="description"
								defaultValue={this.state.data.description}
							/>
						</FormGroup>

						<Link to="/apartment">
							<Button color="warning">
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						<Button className="float-right" onClick={this.handleSubmit}>
							<Text text="buttons.submitBtn"/>
						</Button>
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
				<Container>
					<Card>
						{this.content()}
					</Card>
				</Container>
			);
		}
	}
};
