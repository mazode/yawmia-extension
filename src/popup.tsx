import React from "react"
import './styles/popup.css'
import words from "src/data/words.json"

function Popup() {
  const todayIndex = new Date().getDate() % words.length;
  const todayWord = words[todayIndex];

  // const speak = () => {
  //   const utterance = new SpeechSynthesisUtterance(todayWord.word);
  //   utterance.lang = 'ar';

  //   const voices = speechSynthesis.getVoices();
  //   const arabicVoice = voices.find(v => v.lang.startsWith("ar")) || voices[0];
  //   if(arabicVoice) {
  //     utterance.voice = arabicVoice;
  //   }

  //   setTimeout(() => speechSynthesis.speak(utterance), 100);
  //   console.log(todayWord.word)
  // }

  return (
    <div className="popup-container">
      <h1 className="title">Yawmia</h1>
      <div className="word-card">
        <h2 className="arabic-word">{todayWord.word}</h2>
        <p className="pronunciation">{todayWord.pronunciation}</p>
        <p className="translation">{todayWord.translation}</p>
        <p className="example">{todayWord.example}</p>
        {/* <button onClick={speak} className="sound-button">🔊 Hear</button> */}
      </div>
    </div>
  )
}

export default Popup
