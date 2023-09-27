import React, { Component } from "react";
import "./About.css";

class About extends Component {
  render() {
    return (
      <div className="About">
        <header className="About-header">
          <h1>About CV-Next</h1>
        </header>
        <body>
          <h2>Designated users</h2>
          <p>Magshimim alumni who want to <br />
          recruit or work at other alumni.</p>
          <h3>Work Fields</h3>
          <p>Could be Magshimim related, and unrelated: </p>
          <ul>
            <li>Cybersecurity</li>
            <li>Software engineering</li>
            <li>Law</li>
            <li>Medicine</li>
            <li>HR</li>
            <li>Management</li>
            <li>Research</li>
            <li> ... </li>
          </ul>
          <h4>Structure</h4>
          <p>
            It's similar to Twitter, in some ways. <br />
            First, login. With either a Google or <br />
            a Twitter account. Moreover, there's a <br/>
            whitelist of alumni, to restrict the <br/>
            website access. After that, you get to <br />
            a feed of CVs. You may comment, share, <br/>
            upload your own CV.. A Twitter of CVs. <br/>
          </p>
        </body>
      </div>
    );
  }
}

export default About;
