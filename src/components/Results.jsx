import React from "react";

class Results extends React.Component {

  render() {
    return <div>
  <div className="grid">
    <div className="box c">
        <div className="paragraph">
      <p>Bags: {this.props.results.bags}</p>
      <p>Thinset: {this.props.results.thinset}</p>
      <p>Tiles: {this.props.results.tiles}</p>
      </div>
    </div>
  </div>
  
</div>
  }
}

export default Results
