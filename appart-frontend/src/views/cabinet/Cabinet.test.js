import React from 'react';
import { shallow } from 'enzyme';
import Cabinet from './Cabinet';

it('renders without crashing', () => {
  shallow(<Cabinet/>);
});