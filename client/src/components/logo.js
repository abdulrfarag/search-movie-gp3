import React, { Component } from "react";
import { Image } from "react-bootstrap";

import Logo from './images/banner-g472edf3cc_640.jpg'

class LogoTitle extends Component {
    render(){
        return(
            <Image
            
                source={Logo}
                
            />

        )
    }
}

export default LogoTitle