import React, {Component } from "react";
import "./HomePage.css";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
import {Row,Container} from "react-bootstrap";
import { withRouter } from 'react-router';
import Axios from 'axios';

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const download = require("downloadjs");
const myTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundColor": "#151515",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

class HomePage extends Component {
  
  state={
    imageSrc:'', 
    setImageSrc:""
  }
  
  onDidMount = () => {
    this.imageEditor.current.addImageObject(this.state.imageSrc).then(objectProps => {
      console.log(objectProps.id);
    });
  }
  imageEditor = React.createRef();
  saveImageToDisk = () => {
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    if (data) {
      const mimeType = data.split(";")[0];
      const extension = data.split(";")[0].split("/")[1];
      download(data, `image.${extension}`, mimeType);
    }
  }

   magicLoad =()=>{
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    this.props.updateImage(data);
    this.props.history.push('magic');
  }

  segmentPost= ()=>{
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    Axios.post('https://segmentor.azurewebsites.net', {img:data}).then(response=>{ 
      this.imageEditor.current.addImageObject(response).then(objectProps => {
        console.log(objectProps.id);
      });
    });
  }

  render(){
    return (
      <div className="home-page">
        <div className="center">
          <h1>Welcome to Harmonies photo Editor</h1>
          <Button className='button' onClick={this.saveImageToDisk}>Save Image to Disk</Button>
          <Button style={{marginLeft:'50px'}} className='button' onClick={this.segmentPost}>Segment</Button>
          <Button style={{marginLeft:'50px'}} className='button' onClick={this.magicLoad}>Harmonize</Button>
        </div>
        <Container>
          <Row>
          <ImageEditor
                includeUI={{
                  loadImage: {
                    path: this.state.imageSrc,
                    name: "image",
                  },
                  theme: myTheme,
                  menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
                  initMenu: "",
                  uiSize: {
                    height: `calc(79vh)`,
                    width: `calc(250vh)`
                  },
                  menuBarPosition: "left",
                }}
                cssMaxHeight={window.innerHeight}
                cssMaxWidth={window.innerWidth}
                selectionStyle={{
                  cornerSize: 20,
                  rotatingPointOffset: 70,
                }}
                usageStatistics={true}
                ref={this.imageEditor}
              />
          </Row>
        </Container>
      </div>
    );
  }
}
export default withRouter(HomePage);