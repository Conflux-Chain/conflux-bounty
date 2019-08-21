import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types;
import { withRouter } from 'react-router-dom';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Message from '../../components/Message';

class Example extends Component {
  constructor(...args) {
    super(...args);
    this.a = 1;
  }

  render() {
    const domId = 'email';
    return (
      <div>
        <button className="btn waves-effect waves-light primary" type="button">
          button
        </button>
        <button className="btn default" type="button">
          button
        </button>
        <button className="btn btnTextPrimary" type="button">
          button
        </button>
        <button className="btn btnTextDefault" type="button">
          button
        </button>
        <br />

        <a href="1">This is a link</a>
        <a href="2" className="disabled">
          This is a link
        </a>
        <a href="3" className="default">
          This is a link
        </a>

        <br />

        <div style={{ width: 500, paddingBottom: 1000, marginLeft: 30 }}>
          <div className="row">
            <form className="col s12">
              <div className="input-field">
                <input id={domId} type="text" className="validate" />
                <label htmlFor={domId}>Email</label>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input placeholder="Placeholder" id="first_name" type="text" />
                  <label htmlFor="first_name">First Name</label>
                </div>
                <div className="input-field col s6">
                  <input id="last_name" type="text" className="validate" />
                  <label htmlFor="last_name">Last Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input id="email" type="email" className="validate" />
                  <label htmlFor="email">Email</label>
                  <span className="helper-text" data-error="wrong" data-success="right">
                    Helper text
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input id="email" type="email" readOnly disabled />
                  <label htmlFor="email">Email</label>
                  <span className="helper-text" data-error="wrong" data-success="right">
                    Helper text
                  </span>
                </div>
              </div>

              <div>
                <Input
                  // errMsg="asdads"
                  id="dd"
                  value="asdad"
                  onChange={() => {}}
                  label="this is label"
                  placeHolder="pls enter"
                />
              </div>

              <Select
                label="asdasda"
                onSelect={v => {
                  console.log(v);
                }}
                options={[
                  {
                    label: 'lab1',
                    value: 'val1',
                  },
                  {
                    label: 'lab2',
                    value: 'val2',
                  },
                ]}
                selected={{
                  value: 'val2',
                  label: 'lab2',
                }}
              />
            </form>

            <br />
            <div style={{ clear: 'both' }} />

            <Message type="message-notice"> adasdadada </Message>
            <Message type="message-important"> adasdadada </Message>
            <Message type="message-error"> adasdadada </Message>
            <Message type="message-success"> adasdadada </Message>
            <Message type="message-system"> adasdadada </Message>
            <Message type="message-notice-light"> adasdadada </Message>
            <Message type="message-important-light"> adasdadada </Message>
            <Message type="message-error-light"> adasdadada </Message>
            <Message type="message-success-light"> adasdadada </Message>

            <br />
            <div style={{ clear: 'both' }} />

            <label>
              <input type="checkbox" className="filled-in" />
              <span>Filled in</span>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Example);
