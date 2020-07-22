/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';

export default class InputWithLabel extends React.Component {

  render() {
    return (
      <FormGroup>
        <Label for={this.props.name}>{this.props.label}</Label>
        <Input
          {...this.props}
          invalid={!!this.props.error}
          name={this.props.name}
          id={this.props.name}
          type={this.props.type}
          defaultValue={this.props.defaultValue}
        />
        <FormFeedback>{this.props.error}</FormFeedback>
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>}
      </FormGroup>
    );
  }
}