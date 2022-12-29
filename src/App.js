import React from "react";
import ProductReviewForm from "./components/ReviewForm";
import Results from "./components/Results";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {results:null}

  }
  setResults(r) {
     this.setState({results:r})
  }
  render() {
    return (
      <React.Fragment>
        <ProductReviewForm setResults={(r)=>this.setResults(r)}/>

      {this.state.results && <Results results={this.state.results} />}
      </React.Fragment>
    )
  }
}

export default App;
