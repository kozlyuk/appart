/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from "react"
import {Col, Row} from "reactstrap";
import axios from "axios";
import Auth from "../../auth/auth";
// @ts-ignore
import {Text} from "react-easy-i18n";

interface PaymentListStateInterface {
	apartments: undefined,
	isLoaded: boolean|null,
	data: any,
	paginationCount: number|null,
	paginationNext: number|null,
	paginationPrevious: number|null,
	user: any
}

interface PaymentListPropsInterface {
	user: any;
}

export default class PaymentList extends React.Component<PaymentListPropsInterface, PaymentListStateInterface>{

	/**
	 * User object
	 */
	private user: Auth;

	/**
	 * Constructor
	 *
	 * @param props
	 * @param context
	 */
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			isLoaded: false,
			data: null,
		};
		this.user = new Auth();
	}

	componentDidMount() {
		const {apartments} = this.props.user;
		axios(`${process.env.REACT_APP_GET_BILLS}${apartments[0]}/`, {
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
					});
				}
			)
	}

	render() {
		const {isLoaded} = this.state;
		if (!isLoaded) {
			return (
				<div className="loaderWrapper text-center mt-4">
					{/*
					// @ts-ignore*/}
					<h3 className="text-center text-muted"><Text text="global.loading" /></h3>
				</div>)
				;
		} else {
			return (
				<Row>
					<Col sm="12">
						<table className="table bg-white table-striped">
							<thead>
							<tr>
								<th scope="col">
									Номер рахунку
								</th>
								<th className="text-center" scope="col">
									Виписаний
								</th>
								<th className="text-center" scope="col">
									Сума
								</th>
							</tr>
							</thead>
							<tbody>
							{/*
							// @ts-ignore*/}
								{this.state.data.map((item) => (
								<tr>
									<td>
										{item.number}
									</td>
									<td className="text-center">
										{item.period}
									</td>
									<td className="text-center">
										{item.total_value}
									</td>
								</tr>))}
							</tbody>
						</table>
					</Col>
				</Row>
			)
		}
	}
}