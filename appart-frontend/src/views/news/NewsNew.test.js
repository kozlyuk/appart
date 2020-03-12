import React from 'react';
import { shallow } from 'enzyme';
import NewsNew from './newsNew';

it('renders without crashing', () => {
  shallow(<NewsNew/>);
});