/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from "react"
import {Col, Row} from "reactstrap";

/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const News = (props) => {

	return (
		<Row>
			<Col sm="12">
				<div className="mt-2">
					<img
						src="https://picsum.photos/300/100"
						className="card-img-top"
						alt="..."
					/>
					<div className="alert alert-danger" role="alert">
						<h5 className="card-title mt-1">Важлива новина</h5>
						<p className="card-text">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat
							cupidatat non proident, sunt in culpa qui officia
							deserunt mollit anim id est laborum.
						</p>
					</div>
				</div>
				<div className="mt-2">
					<img
						src="https://picsum.photos/300/100"
						className="card-img-top"
						alt="..."
					/>
					<div className="alert alert-danger" role="alert">
						<h5 className="card-title mt-1">Важлива новина</h5>
						<p className="card-text">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis
							nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat
							cupidatat non proident, sunt in culpa qui officia
							deserunt mollit anim id est laborum.
						</p>
					</div>
				</div>
				<div className="mt-2">
					<div className="card mb-3">
						<img
							src="https://picsum.photos/300/100"
							className="card-img-top"
							alt="..."
						/>
						<div className="card-body">
							<a className="link" href="/">
								<h5 className="card-title mt-1">
									Стандартна новина
								</h5>
							</a>
							<p className="card-text">
								Lorem ipsum dolor sit amet, consectetur adipiscing
								elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua. Ut enim ad minim veniam, quis
								nostrud exercitation ullamco laboris nisi ut aliquip
								ex ea commodo consequat. Duis aute irure dolor in
								reprehenderit in voluptate velit esse cillum dolore
								eu fugiat nulla pariatur. Excepteur sint occaecat
								cupidatat non proident, sunt in culpa qui officia
								deserunt mollit anim id est laborum.
							</p>
							<div className="footer mt-4">
								<small className="text-muted">
									Publish date:
								</small>
								<small className="text-muted ml-2">
									Update date:
								</small>
							</div>
						</div>
					</div>
				</div>
			</Col>
		</Row>
	)
};

export default News;