import React, { Component } from 'react';

class LoadableContent extends Component {
  render() {
    if (this.props.isLoading) {
      return (<>Loading</>)
    } else {
      return this.props.children;
    }
  }
}

export default LoadableContent;