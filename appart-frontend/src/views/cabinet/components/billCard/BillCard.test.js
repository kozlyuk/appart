import React from 'react';
import { shallow } from 'enzyme';
import BillCard from './BillCard';

it('renders without crashing', () => {
  shallow(<BillCard/>);
});