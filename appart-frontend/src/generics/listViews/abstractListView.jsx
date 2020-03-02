import React from "react"
import axios from 'axios'
import Auth from "../../auth/auth";

export default class AbstractListView extends React.Component{
	dataUrl;
	constructor(props, dataUrl) {
		super(props);
		this.state = {
			isLoaded: false,
			data: null,
			paginationCount: null,
			paginationNext: null,
			paginationPrevious: null,
			//paginator settings
			itemsCountPerPage: 20,
			pageRangeDisplayed: 10,
			//paginator settings end
			modal: false,
			modal_backdrop: false,
			modal_nested_parent: false,
			modal_nested: false,
			backdrop: true,
		};
		dataUrl = this.dataUrl;
		this.user = new Auth();
	}

	handlePageChange(pageNumber) {
		this.setState({activePage: pageNumber});
		this.refreshData(pageNumber)
	}

	refreshData(page) {
		axios(`${this.dataUrl}?page=${page}`, {
			headers: {
				"Authorization": "Token " + this.user.getAuthToken()
			}
		})
			.then(
				result => {
					this.setState({
						isLoaded: true,
						data: result.data.results,
						paginationCount: result.data.count,
						paginationNext: result.data.next,
						paginationPrevious: result.data.previous
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
						data: result.data.results,
						paginationCount: result.data.count,
						paginationNext: result.data.next,
						paginationPrevious: result.data.previous
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

	toggle = modalType => () => {
		if (!modalType) {
			return this.setState({
				modal: !this.state.modal,
			});
		}

		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`],
		});
	};

	componentDidMount() {
		this.loadData(this.dataUrl);
		return void 0;
	}
}