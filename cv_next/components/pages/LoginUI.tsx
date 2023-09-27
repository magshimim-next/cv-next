import CSS from 'csstype';

const hStyles: CSS.Properties = {
    backgroundColor: 'rgba(173, 216, 230, 0.85)',
    position: 'relative',
    padding: '0.5rem',
    fontSize: '1.5rem',
};

const h2Styles: CSS.Properties = {
    backgroundColor: 'rgba(173, 216, 230, 0.85)',
    position: 'relative',
    padding: '0.5rem',
    fontSize: '1.5rem',
    marginRight:'auto'
};

const h3Styles: CSS.Properties = {
    backgroundColor: 'rgba(173, 216, 230, 0.85)',
    position: 'relative',
    marginLeft: 'auto',
    padding: '0.5rem',
    fontSize: '1.5rem',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
            <h1 style={hStyles}>
          Select login method
            </h1>
        </div>
        <div style={{display:'flex', flexDirection:'row', gap:'300px'}}>
            <div><button style={h2Styles}>Google</button></div>
            <div><button style={h3Styles}>Twitter</button></div>
        </div>
    </main>
  )
}