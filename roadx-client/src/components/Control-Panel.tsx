import React, {PureComponent} from 'react';

export default class ControlPanel extends PureComponent {
  render() {
    return (
      <div className="control-panel">
        <h3>Marker, Popup, NavigationControl and FullscreenControl </h3>
        <div className="source-link">
          <a
            href="https://github.com/uber/react-map-gl/tree/5.2-release/examples/controls"
            target="_new"
          >
            View Code ↗
          </a>
        </div>
      </div>
    );
  }
}
