import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import M from 'materialize-css';

class MaterialHook extends Component {
  constructor(...args) {
    super(...args);
    this.doInit = debounce(
      () => {
        M.AutoInit();
      },
      100,
      { maxWait: 400 }
    );
  }

  componentDidMount() {
    this.doInit();
  }

  componentDidUpdate() {
    this.doInit();
  }

  render() {
    return <noscript />;
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(MaterialHook);
