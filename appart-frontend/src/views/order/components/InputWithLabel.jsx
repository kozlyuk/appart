/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { FormGroup, FormText, Input, Label } from 'reactstrap';

export default class InputWithLabel extends React.Component {
  /**
   * InputWithLabel constructor.
   * @param props
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormGroup>
        <Label for={this.props.name}>{this.props.label}</Label>
        <Input
          {...this.props}
          name={this.props.name}
          id={this.props.name}
          type={this.props.type}
          defaultValue={this.props.defaultValue}
        />
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>}
      </FormGroup>
    );
  }
}