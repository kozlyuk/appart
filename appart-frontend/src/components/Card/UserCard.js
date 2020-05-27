import React from 'react';
import PropTypes from 'utils/propTypes';

import classNames from 'classnames';

import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import Avatar from '../Avatar';

/**
 * @param avatar
 * @param avatarSize
 * @param title
 * @param subtitle
 * @param text
 * @param children
 * @param className
 * @param restProps
 * @return {*}
 * @constructor
 */
const UserCard = ({
                    avatar,
                    avatarSize,
                    title,
                    subtitle,
                    text,
                    children,
                    className,
                    ...restProps
                  }) => {
  const classes = classNames('bg-gradient-theme', className);

  return (
    <Card inverse className={classes} {...restProps}>
      <CardBody className="d-flex justify-content-center align-items-center flex-column">
        <Avatar src={avatar} size={avatarSize} className="mb-2"/>
        <CardTitle>{title}</CardTitle>
        <CardSubtitle>{subtitle}</CardSubtitle>
        <CardText>
          <small>{text}</small>
        </CardText>
      </CardBody>
      {children}
    </Card>
  );
};

UserCard.propTypes = {
  avatar: PropTypes.string,
  avatarSize: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string
};

UserCard.defaultProps = {
  avatarSize: 80
};

export default UserCard;
