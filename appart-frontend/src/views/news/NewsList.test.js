import React from 'react';
import { shallow } from 'enzyme';
import NewsList from './newsList';

it('renders without crashing', () => {
  shallow(<NewsList/>);
});