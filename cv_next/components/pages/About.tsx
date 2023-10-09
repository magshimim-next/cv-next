import CSS from 'csstype';

const About: CSS.Properties =  {
  textAlign: 'center',
  backgroundColor: '#3577fc',
  color: 'white',
  minHeight: '150vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const AboutHeader: CSS.Properties =  {
  fontSize: 'calc(10px + 2vmin)'
}

const h1: CSS.Properties =  {
  fontSize: '40px'
}

const h2: CSS.Properties =  {
  fontSize: '30px'
}

const ul: CSS.Properties =  {
  fontSize: '20px'
}

const p: CSS.Properties =  {
  fontSize: '20px'
}


export default function AboutPage() {
  return (
      <div className="About" style={About}>
        <header className="About-header" style={AboutHeader}>
          <h1>About CV-Next</h1>
        </header>
        <body>
          <h2 style={h2}>Designated users</h2>
          <p style={p}>Magshimim alumni who want to <br />
          recruit or work at other alumni.</p>
          <h3 style={h2}>Work Fields</h3>
          <p style={p}>Could be Magshimim related, and unrelated: </p>
          <ul style={ul}>
            <li>Cybersecurity</li>
            <li>Software engineering</li>
            <li>Law</li>
            <li>Medicine</li>
            <li>HR</li>
            <li>Management</li>
            <li>Research</li>
            <li> ... </li>
          </ul>
          <h4 style={h2}>Structure</h4>
          <p style={p}>
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
    )
}


