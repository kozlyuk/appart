/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, {Fragment} from "react";
import {Button, Card, CardBody} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";

/**
 * Props interface
 */
interface BillCardPropsInterface {
	bill: {
		number: string;
		period: string;
		total_value: number;
		bill_lines: any|undefined;
	}
}

export default class BillCard extends React.Component <BillCardPropsInterface, {}> {
	constructor(props: BillCardPropsInterface, state: any) {
		super(props, state);
		this.state = {
			isOpen: false
		}

	}
	toggle = () => {
		const {isOpen}: any = this.state;
		this.setState({
			isOpen: !isOpen,
		});
	};

	render() {
		const {isOpen}: any = this.state;
		return (
			<Fragment>
			<tr style={{cursor: "pointer"}} onClick={this.toggle} key={this.props.bill.number.toString()}>
				<td>
					{this.props.bill.number}
				</td>
				<td className="text-center">
					{this.props.bill.period}
				</td>
				<td className="text-center">
					{this.props.bill.total_value}
				</td>
			</tr>
			<Collapse tag="tr" isOpen={isOpen}>
				{this.props.bill.bill_lines[0] &&
				<td colSpan={3}>
					  <div>{this.props.bill.bill_lines[0].previous_debt}</div>
				</td>
				}
			</Collapse>
			</Fragment>
		)
	}
}
