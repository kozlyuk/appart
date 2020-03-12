import React from 'react';
import { shallow } from 'enzyme';
import NewsDelete from './newsDelete';

it('renders without crashing', () => {
  shallow(<NewsDelete/>);
});