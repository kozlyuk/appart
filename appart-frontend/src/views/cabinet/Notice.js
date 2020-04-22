/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { UserConsumer } from '../../globalContext/userContext';
import axios from 'axios';
import Auth from '../../auth/auth';
import { Text } from 'react-easy-i18n';

/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
export default class Notice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this.user = new Auth();
  }

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType = UserConsumer;

  componentDidMount() {
    if (this.context) {
      axios(`${process.env.REACT_APP_NOTICE_URL}${this.context.apartment[0].pk}/`, {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
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
              isLoaded: true
            });
          }
        );
    }
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          {/*
           // @ts-ignore*/}
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <Container>
          <Row>
            <Col sm="12">
              {this.state.data.map((notice) => (
                <div style={{ borderRadius: '0.75rem' }} className={
                  notice.notice_status === 'Warning' ? 'card border-danger mb-3' : 'card bg-light mb-3'
                }>
                  <div className="card-body">
                    <h5 className="card-title mt-1">{notice.title}</h5>
                    <p className="card-text">{notice.text}</p>
                    <div className="footer mt-4">
                      <small className="text-muted">
                        Дійсна з: {notice.actual_from}
                      </small>
                      <small className="text-muted float-right">
                        Дійсна до: {notice.actual_to}
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {/*<div className="mt-2">*/}
              {/*  <div className="alert alert-danger" role="alert">*/}
              {/*    <h5 className="card-title mt-1">Важлива новина</h5>*/}
              {/*    <p className="card-text">*/}
              {/*      Lorem ipsum dolor sit amet, consectetur adipiscing*/}
              {/*      elit, sed do eiusmod tempor incididunt ut labore et*/}
              {/*      dolore magna aliqua. Ut enim ad minim veniam, quis*/}
              {/*      nostrud exercitation ullamco laboris nisi ut aliquip*/}
              {/*      ex ea commodo consequat. Duis aute irure dolor in*/}
              {/*      reprehenderit in voluptate velit esse cillum dolore eu*/}
              {/*      fugiat nulla pariatur. Excepteur sint occaecat*/}
              {/*      cupidatat non proident, sunt in culpa qui officia*/}
              {/*      deserunt mollit anim id est laborum.*/}
              {/*    </p>*/}
              {/*  </div>*/}
              {/*</div>*/}
              {/*<div className="mt-2">*/}
              {/*  <div className="card mb-3">*/}
              {/*    <div className="card-body">*/}
              {/*      <a className="link" href="/">*/}
              {/*        <h5 className="card-title mt-1">*/}
              {/*          Стандартна новина*/}
              {/*        </h5>*/}
              {/*      </a>*/}
              {/*      <p className="card-text">*/}
              {/*        Lorem ipsum dolor sit amet, consectetur adipiscing*/}
              {/*        elit, sed do eiusmod tempor incididunt ut labore et*/}
              {/*        dolore magna aliqua. Ut enim ad minim veniam, quis*/}
              {/*        nostrud exercitation ullamco laboris nisi ut aliquip*/}
              {/*        ex ea commodo consequat. Duis aute irure dolor in*/}
              {/*        reprehenderit in voluptate velit esse cillum dolore*/}
              {/*        eu fugiat nulla pariatur. Excepteur sint occaecat*/}
              {/*        cupidatat non proident, sunt in culpa qui officia*/}
              {/*        deserunt mollit anim id est laborum.*/}
              {/*      </p>*/}

              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </Col>
          </Row>
        </Container>
      );
    }
  }
}