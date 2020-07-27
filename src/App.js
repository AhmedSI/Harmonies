import React,{Component} from "react";
import "./App.css";
import TopBar from "./TopBar";
import { Router, Route} from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import HomePage from "./HomePage";
import MagicStation from "./MagicStation";

const history = createHistory();

class App extends Component {
  state = {
    primaryImg:'',
    image:''
  }
  updateImage =(image)=>{
    this.setState({
      image:image
    });
  }
  render(){
    return (
      <div className="App">
        <Router history={history}>
          <TopBar />
          <Route
            path="/"
            exact
            component={(props)=> <HomePage updateImage={this.updateImage} image={this.state.image} />}
          />
          <Route path="/magic" exact component={(props)=> <MagicStation image={this.state.image} />} />
        </Router>
      </div>
    );
  }

  
}
export default App;