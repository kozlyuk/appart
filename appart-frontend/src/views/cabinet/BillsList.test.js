import React from 'react';
import { shallow } from 'enzyme';
import BillsList from './BillsList';

it('renders without crashing', () => {
  shallow(<BillsList/>);
});