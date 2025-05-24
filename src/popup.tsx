import React, { useEffect, useState, useRef } from "react"
import './styles/popup.css'
import wordsData from "src/data/words.json" // Renamed to wordsData to avoid conflict with 'words' array

// Define the type for a word object
interface Word {
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
}

// Cast the imported data to the defined Word array type
const words: Word[] = wordsData as Word[];

function Popup() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [viewingBookmarks, setViewingBookmarks] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') // State for search term

  // Load bookmarks and dark mode preference from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  // Apply and save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])


  // Set initial word based on the day of the year
  useEffect(() => {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1) // January 1st of current year
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
    setCurrentIndex(dayOfYear % words.length)
  }, [])

  const goToNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handleBookmarkClick = (index: number) => {
    if (bookmarks.includes(index)) {
      setShowRemoveConfirm(index)
    } else {
      toggleBookmark(index)
    }
  }

  const toggleBookmark = (index: number = currentIndex) => {
    setBookmarks((prev) => 
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
    setShowRemoveConfirm(null)
  }

  const cancelRemove = () => {
    setShowRemoveConfirm(null)
  }

  const toggleViewBookmarks = () => {
    setViewingBookmarks((prev) => !prev)
    setSearchTerm('') // Clear search term when switching views for a clean slate
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const currentWord = words[currentIndex];

  // Filtered bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(index => {
    const wordItem = words[index];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      wordItem.word.toLowerCase().includes(lowerCaseSearchTerm) ||
      wordItem.pronunciation.toLowerCase().includes(lowerCaseSearchTerm) ||
      wordItem.translation.toLowerCase().includes(lowerCaseSearchTerm) ||
      wordItem.example.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const WordCard = ({ word, pronunciation, translation, example, index }: Word & { index?: number }) => (
    <div className="word-card">
      <h2 className="arabic-word">
        {word}
      </h2>
      <p className="pronunciation">
        {pronunciation}
      </p>
      <p className="translation">{translation}</p>
      <p className="example">{example}</p>
      
      {index !== undefined && (
        <div className="button-group">
          <button 
            className={`bookmark-button ${bookmarks.includes(index) ? 'bookmarked' : ''}`}
            onClick={() => handleBookmarkClick(index)}
            aria-label={bookmarks.includes(index) ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarks.includes(index) ? "🔖 Bookmarked" : "➕ Bookmark"}
          </button>
          {!viewingBookmarks && ( // Only show next button when not viewing bookmarks
            <button 
              className="next-button" 
              onClick={goToNextWord}
              aria-label="Go to next word"
            >
              👉 Next Word
            </button>
          )}
        </div>
      )}
      
      {/* Remove confirmation for bookmarked words */}
      {showRemoveConfirm === index && (
        <div className="remove-confirmation">
          <p>Remove this bookmark?</p>
          <div className="button-group">
            <button 
              className="remove-button" 
              onClick={() => toggleBookmark(index)}
              aria-label="Confirm remove bookmark"
            >
              Yes, Remove
            </button>
            <button 
              className="cancel-button" 
              onClick={cancelRemove}
              aria-label="Cancel remove bookmark"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="popup-container">
      <h1 className="title">Yawmia</h1>

      <div className="header-controls">
        <div className="header-row">
          <button 
            className="toggle-button" 
            onClick={toggleViewBookmarks}
            aria-label={viewingBookmarks ? "Back to daily word" : "View bookmarked words"}
          >
            {viewingBookmarks ? "🔙 Back to Daily" : "📚 View Bookmarks"}
          </button>

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {viewingBookmarks && bookmarks.length > 0 && (
          <div className="bookmark-counter">
            {bookmarks.length} {bookmarks.length === 1 ? 'word' : 'words'} saved
          </div>
        )}
      </div>

      {viewingBookmarks ? (
        <div className="bookmarks-list">
          <h2 className="subtitle">Bookmarked Words</h2>
          {/* Search Input for Bookmarks */}
          {bookmarks.length > 0 && ( // Only show search if there are bookmarks
            <input 
              type="search" 
              placeholder="Search bookmarks..." 
              className="bookmark-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search bookmarked words"
            />
          )}

          {filteredBookmarks.length === 0 && bookmarks.length > 0 ? (
            <p>No results found for "{searchTerm}". Try a different search.</p>
          ) : filteredBookmarks.length === 0 && bookmarks.length === 0 ? (
            <p>No bookmarks yet. Start bookmarking words to see them here!</p>
          ) : (
            filteredBookmarks.map((i) => (
              <WordCard
                key={i}
                word={words[i].word}
                pronunciation={words[i].pronunciation}
                translation={words[i].translation}
                example={words[i].example}
                index={i}
              />
            ))
          )}
        </div>
      ) : (
        <WordCard
          word={currentWord.word}
          pronunciation={currentWord.pronunciation}
          translation={currentWord.translation}
          example={currentWord.example}
          index={currentIndex}
        />
      )}
    </div>
  )
}

export default Popup