import './App.css';
import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

import Card from './components/Card';
import { getRowsFromChapter } from './utility/helper';

function App() {

  const [groups, setGroups] = useState([]);
  const [showCards, setShowCards] = useState([]);
  const { supported } = useSpeechSynthesis();

  useEffect(() => {
    fetch('chapter-1.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const groups = getRowsFromChapter(data);
        setGroups(groups);
        setShowCards(groups[0].cards);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  if (!supported) {
    return <p>Speech is not supported!</p>
  }

  const showOptions = (card) => {
    const filteredCards = [];
    card.next.forEach(nextCard => {
      for (let i = 0; i < groups.length; i++) {
        const filteredCard = groups[i].cards.filter(uniqueCard => nextCard.indexOf(uniqueCard.id) !== -1);
        if (filteredCard.length) {
          filteredCards.push(filteredCard);
        }
      }
    });

    if (filteredCards.length) {
      function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }
      const randomNum = getRandomArbitrary(0, filteredCards.length - 1);
      const exist = showCards.find(card => card.id === filteredCards[randomNum.toFixed()]);
      if (!exist) {
        setShowCards(currState => {
          const updatedState = [...currState, ...filteredCards[randomNum.toFixed()]];
          return updatedState;
        });
      }
    }
  };

  const setCardHandler = (card, text) => {
    setShowCards(currState => {
      debugger;
      const updatedState = [...currState];
      updatedState.forEach(updatedCard => {
        if (updatedCard.id === card.id) {
          updatedCard.text = text;
        }
      });
      return updatedState;
    });
  };

  return (
    <div className='App'>
      <div className='chart'>
        {showCards.map((card, index) => {
          return <Card key={card.id} card={card} setCard={setCardHandler} showOptions={showOptions} />
        })}
      </div>
    </div>
  );
}

export default App;
