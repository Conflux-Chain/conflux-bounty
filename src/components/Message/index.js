import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Message extends PureComponent {
  render() {
    const { type, children } = this.props;

    let iconType;
    switch (type) {
      case 'message-notice':
      case 'message-important':
      case 'message-notice-light':
      case 'message-important-light':
      case 'message-system':
        iconType = 'info';
        break;
      case 'message-error':
      case 'message-error-light':
        iconType = 'cancel';
        break;
      case 'message-success':
      case 'message-success-light':
        iconType = 'check_circle';
        break;
      default:
        iconType = '';
    }

    return (
      <div className={`message ${type}`}>
        <i className="material-icons dp48">{iconType}</i>
        <span>{children}</span>
      </div>
    );
  }
}

Message.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  type: PropTypes.string.isRequired,
};
export default Message;
