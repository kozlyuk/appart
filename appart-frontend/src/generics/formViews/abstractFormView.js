import React from 'react';
import axios from 'axios'
import Auth from "../../auth/auth";

export default class AbstractFormView extends React.Component {

	constructor(props, dataUrl, requestType, postUrl) {
		super(props);
		this.state = {
			isLoaded: false,
			data: null,
			url: '',
		};
		this.dataUrl = dataUrl;
		this.postUrl = postUrl;
		this.requestType = requestType;
		this.user = new Auth();
	}

	loadData(dataUrl) {
		axios(dataUrl, {
			headers: {
				"Authorization": "Token " + this.user.getAuthToken()
			}
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

	submitData(target){
		return void 0
	}

	handleSubmit = (event) => {
		event.preventDefault();
			axios({
				method: this.requestType,
				url: this.state.url,
				headers: {
					"Authorization": "Token " + this.user.getAuthToken()
				},
				data: this.submitData(event.target)
			}).then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				});
	};

	update() {
		return void 0
	}

	componentDidMount() {
		if (this.dataUrl) {
			this.loadData(this.dataUrl + this.props.match.params.id + "/");
			this.setState({
				url: this.dataUrl + this.props.match.params.id + "/"
			});
			return void 0;
		} else {
			console.log(this.dataUrl)
			this.setState({
				data: "new",
				url: this.postUrl
			})
		}
		this.update()
	}
};
