/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from "react"
import {Col, Row} from "reactstrap";

const PaymentList = (props) => {

	return (
		<Row>
			<Col sm="12">
				<table className="table bg-white table-striped">
					<thead>
					<tr>
						<th className="text-center" scope="col">
							Послуги
						</th>
						<th className="text-center" scope="col">
							Виписаний
						</th>
						<th className="text-center" scope="col">
							Сума
						</th>
						<th className="text-center" scope="col">
							Статус оплати
						</th>
					</tr>
					</thead>
					<tbody>
					<tr className="table-danger">
						<td>
							Внески на управління багатоквартирним Будинком
						</td>
						<td>01.02.2020</td>
						<td>1000</td>
						<td>Не оплачений</td>
					</tr>
					<tr className="table-danger">
						<td>Внески на теплову енергію</td>
						<td>01.02.2020</td>
						<td>2000</td>
						<td>Не оплачений</td>
					</tr>
					<tr className="table-danger">
						<td>
							Обслуговування кредиту на опорядження дитячого
							майданчика
						</td>
						<td>01.02.2020</td>
						<td>500</td>
						<td>Не оплачений</td>
					</tr>
					<tr className="table-success">
						<td>
							Внески на управління багатоквартирним Будинком
						</td>
						<td>01.01.2020</td>
						<td>1000</td>
						<td>Оплачений</td>
					</tr>
					<tr className="table-success">
						<td>Внески на теплову енергію</td>
						<td>01.01.2020</td>
						<td>2000</td>
						<td>Оплачений</td>
					</tr>
					<tr className="table-success">
						<td>
							Обслуговування кредиту на опорядження дитячого
							майданчика
						</td>
						<td>01.01.2020</td>
						<td>500</td>
						<td>Оплачений</td>
					</tr>
					<tr className="table-success">
						<td>
							Внески на управління багатоквартирним Будинком
						</td>
						<td>01.12.2019</td>
						<td>1000</td>
						<td>Оплачений</td>
					</tr>
					<tr className="table-success">
						<td>Внески на теплову енергію</td>
						<td>01.12.2019</td>
						<td>2000</td>
						<td>Оплачений</td>
					</tr>
					<tr className="table-success">
						<td>
							Обслуговування кредиту на опорядження дитячого
							майданчика
						</td>
						<td>01.12.2019</td>
						<td>500</td>
						<td>Оплачений</td>
					</tr>
					</tbody>
				</table>
			</Col>
		</Row>
	)
};

export default PaymentList