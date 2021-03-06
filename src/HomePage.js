import React, {Component } from "react";
import "tui-image-editor/dist/tui-image-editor.css";
import "./HomePage.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
import {Row,Container} from "react-bootstrap";
import { withRouter } from 'react-router';
import Axios from 'axios';
import Loader from 'react-loader-spinner';

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const download = require("downloadjs");
const myTheme = {
  // 'common.bi.image': '',
  'common.border': '0px',
  'common.bisize.height': '0px',
  "common.backgroundColor": "#414551",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
  'menu.normalIcon.color': '#d25a46',
  'menu.activeIcon.color': '#eb5f4b',
  'menu.disabledIcon.color': '#dbbdb9',
  'menu.hoverIcon.color': '#e6887b',
  'submenu.normalIcon.color': '#8a8a8a',
  'submenu.activeIcon.color': '#e9e9e9',
  'menu.iconSize.width': '20px',
  'menu.iconSize.height': '20px',
  'loadButton.backgroundColor': '#eb5f4b',
  'loadButton.color': '#414551',
  'loadButton.fontSize': '20px',
};

class HomePage extends Component {
  
  state={
    imageSrc:'', 
    setImageSrc:"",
    loading:false
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

   dataURLtoFile = (dataurl, filename) => {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  }

  segmentPost= ()=>{
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    const that = this;
    this.setState({loading:true},()=>{
      Axios.post('https://segmentor.azurewebsites.net', {img:data}).then(response=>{
        imageEditorInst.loadImageFromFile(this.dataURLtoFile(response.data.res, 'lena')).then(()=>{
          this.setState({loading:false});
        });
      });
    });
  }

  render(){
    return (
      <div className="home-page">
        {this.state.loading===false?
          <div className="center"><h1>Welcome to Harmonies photo Editor</h1>
            <Button className='button' onClick={this.saveImageToDisk}>Save Image to Disk</Button>
            <Button style={{marginLeft:'50px'}} className='button' onClick={this.segmentPost}>Segment</Button>
            <Button style={{marginLeft:'50px'}} className='button' onClick={this.magicLoad}>Harmonize</Button>
          </div>
          :<div></div>
        }
        <div style={{display:this.state.loading===false? "flex":"none", justifyContent: "center", alignItems: "center"}} >
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
                height: `calc(77vh)`,
                width: `calc(150vh)`
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
        </div>
        <div>
            <div style={{display:this.state.loading===true?"flex":"none", justifyContent: "center", alignItems: "center"}}>
              <img src="harmonies-logo-2.png" height='300px' />
            </div>
            <div style={{width: "100%", height: "100", display:this.state.loading===true?"flex":"none", justifyContent: "center", alignItems: "center" }}>
              <Loader type="Grid" color="#d25a46" height="100" width="100" />
            </div>
          </div>
      </div>
    );
  }
}
export default withRouter(HomePage);