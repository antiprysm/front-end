import React from "react";

class Results extends React.Component {

  render() {
    return <div id="resultsBox">
  <div className="grid">
    <div className="box c">
        <div className="paragraph">
      <p>Tiles: {this.props.results.tiles}</p>
      <p>Thinset: {this.props.results.thinset}{this.props.results.control==="Imperial"?' lbs':' kgs'}</p>
      <p>Grout Volume: {this.props.results.groutVolume}{this.props.results.control==='Imperial'?' lb/cu ft':' kg/cu m'}</p>
      <p>Grout: {this.props.results.grout}{this.props.results.control==='Imperial'?' lbs':' kgs'}</p>
      <p>Boxes of Tiles: {this.props.results.tpB}</p>
      </div>
    </div>
  </div>
</div>
  }
}

export default Results
