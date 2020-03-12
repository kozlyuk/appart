import React from 'react';
import { shallow } from 'enzyme';
import UserNew from './userNew';

it('renders without crashing', () => {
  shallow(<UserNew/>);
});