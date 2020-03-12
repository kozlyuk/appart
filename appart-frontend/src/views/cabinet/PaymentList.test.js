import React from 'react';
import { shallow } from 'enzyme';
import PaymentList from './PaymentList';

it('renders without crashing', () => {
  shallow(<PaymentList/>);
});