import React from 'react';
import { shallow } from 'enzyme';
import NewsUpdate from './newsUpdate';

it('renders without crashing', () => {
  shallow(<NewsUpdate/>);
});