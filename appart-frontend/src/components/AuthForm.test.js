import React from 'react';
import { shallow } from 'enzyme';
import AuthForm from './AuthForm';

it('renders without crashing', () => {
  shallow(<AuthForm/>);
});