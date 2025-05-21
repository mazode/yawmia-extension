import React, { useEffect, useState } from "react"
import './styles/popup.css'
import words from "src/data/words.json"

function Popup() {
  // 
  const [currentIndex, setCurrentIndex] = useState(
    () => new Date().getDate() % words.length
  )
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [viewingBookmarks, setViewingBookmarks] = useState(false)

  
  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks")
    if(stored) setBookmarks(JSON.parse(stored))
    }, [])
  
  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])
  
  const currentWord = words[currentIndex]

  const toggleBookmark = () => {
    setBookmarks((prev) => 
      prev.includes(currentIndex)
        ? prev.filter((i) => i !== currentIndex)
        : [...prev, currentIndex]
    )
  }

  const goToNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const toggleViewBookmarks = () => {
    setViewingBookmarks((prev) => !prev)
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

      <button className="toggle-button" onClick={toggleViewBookmarks}>
        {viewingBookmarks ? "🔙 Back to Daily" : "📚 View Bookmarks"}
      </button>

      {viewingBookmarks ? (
        <div className="bookmarks-list">
          <h2 className="subtitle">Bookmarked Words</h2>
          {bookmarks.length === 0 ? (
            <p>No bookmarks yet.</p>
          ) : (
            bookmarks.map((i) => (
              <div key={i} className="word-card">
                <h2 className="arabic-word">{words[i].word}</h2>
                <p className="pronunciation">{words[i].pronunciation}</p>
                <p className="translation">{words[i].translation}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="word-card">
          <h2 className="arabic-word">{currentWord.word}</h2>
          <p className="pronunciation">{currentWord.pronunciation}</p>
          <p className="translation">{currentWord.translation}</p>

          <div className="button-group">
            <button className="bookmark-button" onClick={toggleBookmark}>
              {bookmarks.includes(currentIndex) ? "🔖 Bookmarked" : "➕ Bookmark"}
            </button>

            <button className="next-button" onClick={goToNextWord}>
              👉 Next Word
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Popup
