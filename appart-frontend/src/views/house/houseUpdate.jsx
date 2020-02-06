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

export default class HouseUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_HOUSES_URL
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="houseForm.newHouse.title" /></CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="name"><Text text="houseForm.name"/></Label>
							<Input
								type="text"
								name="name"
								defaultValue={this.state.data.name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="address"><Text text="houseForm.address"/></Label>
							<Input
								type="text"
								name="address"
								defaultValue={this.state.data.address}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="photo"><Text text="houseForm.photo"/></Label>
							<Input type="file" name="file" />
							<FormText color="muted" />
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="houseForm.description"/></Label>
							<Input
								type="textarea"
								name="description"
								defaultValue={this.state.data.description}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="apartmentCount"><Text text="houseForm.apartmentCount"/></Label>
							<Input
								type="number"
								name="apartmentCount"
								min="0"
								defaultValue={this.state.data.apartments_count}
							/>
						</FormGroup>

						<Link to="/house">
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
