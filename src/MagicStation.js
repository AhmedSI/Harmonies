import React,{Component} from "react";
import {Button,Modal } from "react-bootstrap";
import "./MagicStation.css";

class MagicStation extends Component{
    primaryImage = React.createRef();
    fileSrc = React.createRef();
    secondaryImage = React.createRef();
    canvasObj = React.createRef();
    holder = React.createRef();
    state={
        image:this.props.image,
        showModal:false
    }

    launchModal = () => {
        this.setState({showModal:true})
    }
    handleClose = () => {
        this.setState({showModal:false})
    }

    handleOpen = () => {
        var file = this.fileSrc.current.files[0];
        var reader  = new FileReader();
        const that = this;
        reader.onloadend = function () {
            var imageElement = that.secondaryImage.current
            imageElement.src = reader.result;
            imageElement.style.position = 'absolute';
            imageElement.style.zIndex = 1000;
            that.holder.current.append(imageElement);
            imageElement.style.left = '323px';
            imageElement.style.top = '147px';
            imageElement.onmousedown = function(event) {
                // (1) prepare to moving: make absolute and on top by z-index
                
                
                // move it out of any current parents directly into body
                // to make it positioned relative to the body
                // document.body.append(imageElement);

                that.holder.current.append(imageElement);
                // centers the ball at (pageX, pageY) coordinates
                function moveAt(pageX, pageY) {
                    imageElement.style.left = pageX - imageElement.offsetWidth / 2 + 'px';
                    imageElement.style.top = pageY - imageElement.offsetHeight / 2 + 'px';
    
                    // center_input.innerText= 'y= '+ (pageY-target.offsetTop+target.offsetHeight/2) + ' ,x= ' + (pageX-target.offsetLeft+target.offsetWidth/2);
                }
    
                // move our absolutely positioned ball under the pointer
                moveAt(event.pageX, event.pageY);
    
                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }
    
                // (2) move the ball on mousemove
                document.addEventListener('mousemove', onMouseMove);
    
                // (3) drop the ball, remove unneeded handlers
                imageElement.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    imageElement.onmouseup = null;
                };
            };
            
            imageElement.ondragstart = function() {
                return false;
            };
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            that.secondaryImage.current.src  = '';
        }
        this.handleClose()
    }
    
    handleMerge = () => {
        var ctx = this.canvasObj.current.getContext('2d');        
        var imageObj1 = new Image();
        var imageObj2 = new Image();
        imageObj1.src = this.primaryImage.current.src;
        var that = this;
        imageObj1.onload = function() {
            var i = new Image(); 
            i.onload = function(){
                console.log(i.width,i.height);
                that.canvasObj.current.height = i.height;
                that.canvasObj.current.width = i.width;
                ctx.drawImage(imageObj1, 0, 0,i.width,i.height,0,0,i.width,i.height);
            imageObj2.src = that.secondaryImage.current.src;
            imageObj2.onload = function() {
                console.log(that.secondaryImage.current.offsetLeft-that.primaryImage.current.offsetLeft,that.secondaryImage.current.offsetTop,that.primaryImage.current.offsetTop);
                ctx.drawImage(imageObj2, 0, 0, that.secondaryImage.current.offsetWidth, that.secondaryImage.current.offsetHeight,(that.secondaryImage.current.offsetLeft-that.primaryImage.current.offsetLeft),(that.secondaryImage.current.offsetTop-that.primaryImage.current.offsetTop),that.secondaryImage.current.offsetWidth,that.secondaryImage.current.offsetHeight);
                // var img = that.canvasObj.current.toDataURL('image/jpeg');
                // document.getElementById('merged').src=img;
            }
            };
            i.src = that.state.image;
            
        };
        
    }

    render(){
        return(
            <div style={{textAlign:'center',marginTop:'50px'}}>
                {this.state.image!==''?<Button className='button' style={{backgroundColor:"#eb5f4b"}} onClick={this.launchModal}>Harmonization</Button>:<h1>go back to Home and specify your background image please!</h1>}
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Choose your secodary Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><input type='file' ref={this.fileSrc}/></Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleOpen} style={{backgroundColor:"#eb5f4b"}} className='button'>
                        Open Image
                    </Button>
                    </Modal.Footer>
                </Modal>
                {/* <div ref={this.holder} style={{border:"3px red solid",overflow:'auto',maxHeight:'600px'}}> */}
                <div ref={this.holder} style={{backgroundColor:"#414551",border:"1px #eb5f4b solid",borderRadius:'10px',overflow:'auto',maxHeight:'600px',margin:'30px auto',display:this.state.image===''?'none':"block"}} >
                    <img src={this.state.image} alt='' style={{maxHeight:'600px'}} ref={this.primaryImage} />
                    <img style={{maxHeight:'400px'}} alt=''  ref={this.secondaryImage} />
                </div>
                
                <canvas ref={this.canvasObj}style={{display:'none'}}>canvas</canvas>
                <Button className='button' onClick={this.handleMerge} style={{backgroundColor:"#eb5f4b",display:this.state.image===''?'none':"inline"}}>Harmonize Now!</Button>
            </div>
        );
        
    }
}
export default MagicStation;