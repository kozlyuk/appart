/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { UserConsumer } from '../../globalContext/userContext';
import axios from 'axios';
import Auth from '../../auth/auth';
// @ts-ignore
import { Text } from 'react-easy-i18n';

interface NoticeInterface {
  isLoaded: boolean,
  paginationCount: number,
  paginationNext: string,
  paginationPrevious: string,
  data: NoticeData
}

type NoticeData = {
  actual_from: string,
  actual_to: string,
  apartment: number,
  notice_status: string,
  pk: number,
  text: string,
  title: string
}

export default class Notice extends Component <any, NoticeInterface> {

  private user: Auth;

  constructor(props: any) {
    super(props);
    this.user = new Auth();
  }

  public state = {
    isLoaded: false,
    data: null
  };

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType: any = UserConsumer;

  public componentDidMount(): void {
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

  public render(): JSX.Element {
    const { isLoaded } = this.state;
    const data = this.state.data as Array<NoticeData> | null;
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
              {data?.map((notice: NoticeData) => (
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
            </Col>
          </Row>
        </Container>
      );
    }
  }
}