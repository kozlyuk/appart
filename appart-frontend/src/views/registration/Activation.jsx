/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import axios from 'axios';
import { Button, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';

export default class Activation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      successResponse: false,
      errorResponse: false
    };
  }

  componentDidMount() {
    axios(`${process.env.REACT_APP_ACTIVATION}${this.props.match.params.uidb64}/${this.props.match.params.token}/`)
      .then((response) => {
        this.setState({
          successResponse: response.data
        });
      }).catch((error) => {
      this.setState({
        errorResponse: error.response.data
      });
    });
  }

  render() {
    return (
      <Container>
        {this.state.successResponse &&
        <>
          <div className="mt-4">
            <div className="checkmark-circle ml-auto mr-auto">
            </div>
            <h3 className="text-success text-center">{this.state.successResponse}</h3>
            <Row>
              <Link className="mx-auto" to="/dashboard/">
                <Button className="btn-success">
                  Перейти до сторінки входу
                </Button>
              </Link>
            </Row>
          </div>
        </>
        }
        {this.state.errorResponse &&
        <>
          <div className="mt-4">
            <div className="checkmark-circle ml-auto mr-auto text-center">
              <AiOutlineCloseCircle className="text-danger" size={'10em'}/>
            </div>
            <h3 className="text-danger text-center">{this.state.errorResponse}</h3>
          </div>
        </>
        }
      </Container>
    );
  }
}