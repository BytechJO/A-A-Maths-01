const units = [
  ['1A', 'Let’s Count!'], ['1B', 'Add it Up!'], ['1C', 'Take It Away!'],
  ['Review', 'Units 1A–1C'], ['1D', 'Split It Up!'], ['1E', 'What’s the Time?'],
  ['1F', 'How Much Is It?'], ['Review', 'Units 1D–1F'],
];

export default function MathsHome({screen,onStart,onUnit}:{screen:'intro'|'units';onStart:()=>void;onUnit:()=>void}) {
  return <main className={'maths-home '+screen}>
    <header className="maths-home-header"><strong>A&amp;A Maths <b>1</b></strong><button onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen().catch(()=>{});}} aria-label="Full screen">⛶</button></header>
    {screen==='intro'?<section className="maths-welcome">
      <img className="maths-intro-title" src="/maths/intro-title.png" alt="A&A Maths — English through Maths"/>
      <img className="maths-intro-number" src="/maths/intro-number.png" alt="Book 1"/>
      <button className="maths-start" onClick={onStart}><span>Start</span><span className="maths-start-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></span></button>
    </section>:<section className="maths-unit-menu"><div className="maths-menu-title"><h1>Contents</h1></div><div className="maths-unit-grid">{units.map(([number,title],i)=><button key={i} disabled={i!==0} onClick={onUnit}><strong>{number==='Review'?'Review':title}</strong>{number!=='Review'&&<span>{number}</span>}</button>)}</div></section>}
  </main>;
}


