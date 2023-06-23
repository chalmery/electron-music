import React from 'react'

import icon from '/icons/music256x256.png';

export default function Lyrics(props) {
  const {show, metadata} = props;

  const containerStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    backdropFilter: 'blur(8px)',
  }
  if (metadata) {
    containerStyle.backgroundImage = `url(${'file://' + metadata.picture})`;
  } else {
    containerStyle.backgroundImage = null;
  }
  const lyricsClass = show ? 'lyrics-container show' : 'lyrics-container hide';

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(71,71,71,0.8)', // 设置毛玻璃效果的颜色和透明度
    padding: '5% 5% 10% 5%'
  };

  return (
    <div className={lyricsClass} style={containerStyle}>
      <div style={overlayStyle}>
        <div style={{display: "fixed", height: "100%"}}>
          <div style={{
            float: "left", height: "100%", width: "50%", display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img className='img' width={"250px"} src={metadata === null ? icon : `file://${metadata.picture}`}
                 alt={icon}/>
          </div>
          <div style={{float: "right", height: "100%", width: "50%"}}>
            右
          </div>
        </div>
      </div>
    </div>
  )
}