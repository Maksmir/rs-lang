import React, { Component } from 'react';
import WordTilesList from './components/WordTilesList';
import WordInfo from './components/WordInfo';
import Recognition from './components/Recognition';
import Stars from './components/Stars';
import Results from './components/Results';
import StartScreen from './components/StartScreen';

class SpeakIt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          word: 'alcohol',
          transcription: '[ǽlkəhɔ̀ːl]',
          translate: 'Алкоголь',
          id: '1',
          image:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.jpg',
          audio:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0002.mp3',
          guessed: false,
        },
        {
          word: 'boat',
          transcription: '[bout]',
          translate: 'Лодка',
          id: '2',
          image:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.jpg',
          audio:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0005.mp3',
          guessed: false,
        },
        {
          word: 'agree',
          transcription: '[əgríː]',
          translate: 'Согласна',
          id: '3',
          image:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.jpg',
          audio:
            'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/files/01_0001.mp3',
          guessed: false,
        },
      ],
      selectedWord: {},
      isGame: false,
      recognizedWord: '',
      showResults: false,
      isStart: true,
    };

    this.selectWord = this.selectWord.bind(this);
    this.checkWord = this.checkWord.bind(this);
    this.startGame = this.startGame.bind(this);
    this.showResults = this.showResults.bind(this);
    this.hideResults = this.hideResults.bind(this);
    this.restart = this.restart.bind(this);
    this.hideStartScreen = this.hideStartScreen.bind(this);
  }

  selectWord(id) {
    this.setState(({ data }) => {
      const index = data.findIndex((elem) => elem.id === id);
      return { selectedWord: data[index] };
    });
  }

  checkWord(recognizedWord) {
    let words = this.state.data;
    this.setState({ recognizedWord: recognizedWord });
    words.forEach(({ word }, index) => {
      if (recognizedWord.toLowerCase() === word.toLowerCase()) {
        this.setState(({ data }) => {
          const guessedWord = data[index];
          guessedWord.guessed = true;
          const before = data.slice(0, index);
          const after = data.slice(index + 1);
          return [...before, guessedWord, ...after];
        });
      }
    });
    if (words.length === words.filter((word) => word.guessed).length) {
      this.setState({
        showResults: true,
      });
    }
  }

  startGame() {
    this.setState({ isGame: true });
    console.log('start game click');
  }

  showResults() {
    this.setState({
      isGame: false,
      showResults: true,
    });
    console.log('app state when show: ', this.state);
  }

  hideResults() {
    this.setState({
      showResults: false,
      selectedWord: {},
    });
  }

  restart() {
    this.setState({
      selectedWord: {},
      isGame: false,
      recognizedWord: '',
      showResults: false,
    });
  }

  hideStartScreen() {
    this.setState({ isStart: false });
  }

  render() {
    const errorsWordsArr = this.state.data.filter((elem) => !elem.guessed);
    const guessedWordsArr = this.state.data.filter((elem) => elem.guessed);
    const guessedCount = guessedWordsArr.length;

    return (
      <>
        {this.state.isStart ? (
          <StartScreen onClick={this.hideStartScreen} />
        ) : null}
        <Stars n={guessedCount}></Stars>
        {this.state.isGame ? (
          <Recognition onRecognition={this.checkWord} />
        ) : null}
        <WordInfo
          word={this.state.selectedWord}
          isGame={this.state.isGame}
          recognizedWord={this.state.recognizedWord}
        />
        <WordTilesList
          tiles={this.state.data}
          selectId={this.state.isGame ? null : this.state.selectedWord.id}
          onSelect={this.selectWord}
        />
        <button onClick={this.restart}>Restart</button>
        <button onClick={this.startGame}>Start Game!</button>
        <button onClick={this.showResults}>Results</button>
        {this.state.showResults ? (
          <Results
            errorsWords={errorsWordsArr}
            knownWords={guessedWordsArr}
            onReturn={this.hideResults}
            onNewGame={this.restart}
          />
        ) : null}
      </>
    );
  }
}

export default SpeakIt;
