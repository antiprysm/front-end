import React from "react";

class Results extends React.Component {

  render() {
    return <div id="resultsBox">
  <div className="grid">
    <div className="box c">
        <div className="paragraph">
      <p>Tiles: {this.props.results.tiles}</p>
      <p>Grout Volume: {this.props.results.groutVolume}{this.props.results.control==='Imperial'?' lb/ft3':' kg/m3'}</p>
      <p>Grout: {this.props.results.grout}{this.props.results.control==='Imperial'?' lbs':' kgs'}</p>
      <p>Boxes of Tiles: {this.props.results.tpB}</p>
      </div>
    </div>
  </div>
</div>
  }
}

export default Results
