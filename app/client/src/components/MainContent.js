import { Route } from 'react-router-dom'

import Home from '../pages/Home';
//import About from '../pages/About';
import Contact from '../pages/Contact';

function MainContent(){
    return(
        <div>
            <Route path="/">
                <Home />
            </Route>
           
            <Route path="/contactus">
                <Contact />
            </Route>
        </div>
    )
}

export default MainContent;


// <Route path="/about">
//<About />
//</Route>