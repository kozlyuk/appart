import React from 'react';
import { shallow } from 'enzyme';
import BillList from './billList';

it('renders without crashing', () => {
  shallow(<BillList/>);
});