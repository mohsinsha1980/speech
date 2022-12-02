import { useState, useRef } from 'react';

import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import classes from './Card.module.css';

const Card = (props) => {
  const hostSpeakEndHandler = () => {
    showOptions(card);
  };
  const { card, setCard, showOptions } = props;
  const [isEdit, setIsEdit] = useState(false);
  const textRef = useRef('');
  const [text, setText] = useState(card.text);
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({ onEnd: hostSpeakEndHandler });
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setText(result);
    },
  });

  const handleSpeak = (e) => {
    // e.cancelBubble = true;
    // if (e.stopPropagation) {
    //   e.stopPropagation();
    // }

    speak({ text: text, voice: card.isHost ? voices[0] : voices[3] });
  };

  const handleEdit = () => {
    if (isEdit) {
      setIsEdit(false);
      setCard(card, text);
    } else {
      setIsEdit(true);
    }
  };

  const handleSpeech = () => {
    if (!listening) {
      listen();
    } else {
      stop();
      setCard(card, text);
    }
  };

  return <>
    <div className={classes.card}>
      <div className={classes.type}>{card.type}</div>
      {isEdit ? <div><textarea type='text' rows='5' columns='5' onChange={(e) => setText(e.target.value)} value={text} style={{ height: '50px', width: '100%' }} /></div> : <div className={classes.content}>{card.text}
      </div>}
      {card.tags.length > 0 ? <div>
        {card.tags.map((tag, index) => <span className={classes.tag} key={tag + index}>{tag}</span>)}
      </div> : null}
      <button onClick={handleSpeak}>Speak</button>&nbsp;
      <button onClick={handleEdit}>Edit</button>&nbsp;
      <button onClick={handleSpeech}>Speech {listening ? 'on' : 'off'}</button>
    </div>
  </>;
};

export default Card;