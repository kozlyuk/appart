/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from "react"
import {CardBody, CardImg, CardText, CardTitle, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import axios from "axios";
import Auth from "../../auth/auth";
import Button from "reactstrap/es/Button";
import Card from "reactstrap/es/Card";

// ugly regular expression for validate length of phone number
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

export default class ApartmentPhoneChecker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileNumber: '',
			responseData: '',
			errors: {
				mobileNumber: '',
			}
		};
		this.user = new Auth();
		this.checkByNumberUrl = process.env.REACT_APP_CHECK_BY_NUMBER_URL;
		this.getUserById.bind(this)
	}

	getUserById = (event) => {
		event.preventDefault();
		axios({
			method: "get",
			url: this.checkByNumberUrl + this.state.mobileNumber + '/',
			headers: {
				"Authorization": "Token " + this.user.getAuthToken()
			}
		}).then((response) => {
			this.setState({
				responseData: response.data
			})
			console.log(response.data);
		})
	}

	handleChange = (event) => {
		event.preventDefault();
		const { value } = event.target;
		// check valid of input field
		if (validPhoneRegex.test(value) && value.length === 10) {
			this.setState({errors: {
					mobileNumber: ''
				},
				mobileNumber: event.target.value},
				);
		} else {
			this.setState({errors: {
				mobileNumber: [<Text text="global.validateErrors.mobileNumber"/>]
				}})
		}
	};

	render() {

		let buttonText = "Введіть номер телефону для перевірки корисутвача";
		let ifButtonDisabled = true;
		if (this.state.errors.mobileNumber.length === 0) {
			buttonText = "Перевірити наявність в базі";
			ifButtonDisabled = false;
		}

		// check if house have resident
		if (this.props.data.resident) {
			return (
				<FormGroup>
					<Label for="phoneNumber">Номер телефону жителя</Label>
					{this.state.errors.mobileNumber.length > 0 &&
					// error field
					<FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
					<div>
					<Input
						style={{width: "120px", display: "inline-block"}}
						type="tel"
						maxLength="10"
						name="phoneNumber"
						onChange={this.handleChange}
						defaultValue={this.props.data.resident.mobile_number}
					/>
						<Button onClick={this.getUserById} disabled={ifButtonDisabled} style={{display: "inline-block", marginLeft: "10px"}}>{buttonText}</Button>
					</div>
					{this.state.responseData &&
					<Card className="flex-row mt-2">
						<CardImg
							className="card-img-left"
							src={process.env.REACT_APP_BACKEND_URL + this.state.responseData.avatar}
							style={{ width: 'auto', height: 150 }}
						/>
						<CardBody>
							<CardTitle>{this.state.responseData.first_name} {this.state.responseData.last_name}</CardTitle>
							<CardText>
								<p>email: <strong>{this.state.responseData.email}</strong></p>
								<p>birth_date: <strong>{this.state.responseData.birth_date}</strong></p>
							</CardText>
						</CardBody>
					</Card>
					}
				</FormGroup>
			);
		} else {
			return (
				<FormGroup>
					<Label for="phoneNumber">Введіть номер телефону жителя, щоб підв'язати його до апартаментів</Label>
					{this.state.errors.mobileNumber.length > 0 &&
					// error field
					<FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
					<Input
						type="tel"
						maxLength="10"
						name="phoneNumber"
						onChange={this.handleChange}
					/>
				</FormGroup>
			);
		}
	}
}


// {
// 	"mobileNumber": "0987212959",
// 	"responseData": {
// 	"pk": 1,
// 		"first_name": "",
// 		"last_name": "",
// 		"mobile_number": "0987212959",
// 		"email": "wervvolf@gmail.com",
// 		"is_active": true,
// 		"birth_date": null,
// 		"avatar": "/media/avatars/user_1/planeta_kosmos_vselennaia_127497_1920x1080.jpg",
// 		"theme": "LT"
// },
// 	"errors": {
// 	"mobileNumber": ""
// }
// }