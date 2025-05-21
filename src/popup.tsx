import React, { useEffect, useState } from "react"
import './styles/popup.css'
import words from "src/data/words.json"

function Popup() {
  const [currentIndex, setCurrentIndex] = useState(() => new Date().getDate() % words.length)
  const [favorites, setFavorites] = useState<string[]>([])

  const todayWord = words[currentIndex]

  useEffect(() => {
    const savedFavs = localStorage.getItem("favorites")
    if(savedFavs) setFavorites(JSON.parse(savedFavs))
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = () => {
    if(!favorites.includes(todayWord.word)) {
      setFavorites([...favorites, todayWord.word])
    }
  }

  const showNewWord = () => {
    let newIndex = currentIndex
    while(newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * words.length)
    }
    setCurrentIndex(newIndex)
  }

  // const speak = () => {
  //   const utterance = new SpeechSynthesisUtterance(todayWord.word)
  //   utterance.lang = 'ar'

  //   const voices = speechSynthesis.getVoices()
  //   const arabicVoice = voices.find(v => v.lang.startsWith("ar")) || voices[0]
  //   if(arabicVoice) {
  //     utterance.voice = arabicVoice
  //   }

  //   setTimeout(() => speechSynthesis.speak(utterance), 100)
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
        <button onClick={addToFavorites} className="favorite-button">⭐ Add to Favorites</button>
        <button onClick={showNewWord} className="new-word-button">🔄 New Word</button>
      </div>
    </div>
  )
}

export default Popup
