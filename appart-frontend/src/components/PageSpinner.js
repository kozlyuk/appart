import PropTypes from 'prop-types';
import React from 'react';
import {Spinner} from 'reactstrap';

const PageSpinner = ({color = 'primary'}) => {
  return (
    <div className="cr-page-spinner">
      <Spinner style={{width: '3rem', height: '3rem'}} type="grow" color={color}/>
    </div>
  );
};

PageSpinner.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]),
};

export default PageSpinner;
