import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

const CenterAlign = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 9999;
`;

const Mask = styled.div`
  background: rgba(255, 255, 255, 0.4);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
`;
// eslint-disable-next-line react/prefer-stateless-function
export class PageLoadingComp extends Component {
  render() {
    const { show, showMask } = this.props;
    if (show === false) {
      return null;
    }

    let maskDiv;
    if (showMask) {
      maskDiv = <Mask />;
    }

    return (
      <Fragment>
        <CenterAlign>
          <div className="preloader-wrapper small active">
            <div className="spinner-layer">
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
          </div>
        </CenterAlign>
        {maskDiv}
      </Fragment>
    );
  }
}

PageLoadingComp.propTypes = {
  show: PropTypes.bool.isRequired,
  showMask: PropTypes.bool.isRequired,
};
PageLoadingComp.defaultProps = {};

function mapStateToProps(state) {
  return {
    show: state.frameworks.loading.loadingCount > 0,
    showMask: state.frameworks.loading.maskCount > 0,
  };
}

export const PageLoading = connect(mapStateToProps)(PageLoadingComp);
