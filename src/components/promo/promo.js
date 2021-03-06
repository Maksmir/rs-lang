import React, { Component } from 'react';
import s from './promo.module.css';
import graph from './assets/stat2.png';
import owl from './assets/learn/owl3.png';
import settingsImg from './assets/learn/settings.png';
import books from './assets/books/book.png';
import video from './assets/rs-lang.mp4'
class GallerySlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentGallerySlide: `${this.props.slide}1`
    }
  }

  changeImage = (event) => {
    const id = event.target.dataset.id;
    this.setState({ currentGallerySlide: id });
  }

  render() {
    const { slide } = this.props;
    const { currentGallerySlide } = this.state;
    const slides = [];
    
    for (let i = 0; i < 5; i++) {
      let slideClassNames = `${s[`${slide}${i + 1}`]} ${s.thumbnail}`;
      if (currentGallerySlide === `${slide}${i + 1}`) {
        slideClassNames += ` ${s.choosen}`;
      }

      slides.push(<li className={slideClassNames} onClick={this.changeImage} data-id={`${slide}${i + 1}`} key={`${slide}${i + 1}`}/>);
    }

    return (
      <div className={s.gameGallery}>
        <div className={s.cssSlider}>

          <ul className={s.slides}>
            <li className={`${s[currentGallerySlide]} ${s.slide}`} id={currentGallerySlide}></li>
          </ul>

          <ul className={s.thumbnails}>
            {slides}
          </ul>
        </div>
      </div>
    )
  }
}

const GameCard = ({ slidesData, currentGamesSlide, previouseGamesSlide, direction }) => {
  
  const slides = slidesData.map(({key, name, description}) => {

    let animation = ' ';

    if (key === currentGamesSlide) {
      animation = direction ? s.showRight : s.showLeft;
    }

    if (key === previouseGamesSlide) {
      animation = direction ? s.hideRight : s.hideLeft;
    }


    return (
      <div className={`${s.gameCardWrapper} ${animation}`} key={key}>
        <div className={`${s.gameCard} `}>
          <div className={s.game}>                    
            <h4 className={s.gameTitle}>{name}</h4>
            <p className={s.gameDescription}>{description}</p>
          </div>
          <GallerySlider slide={key} />
        </div>        
      </div>
    )
  })

  return (
    <>
      {slides }
    </>
  );
}


export default class Promo extends Component {
  constructor(props) {
    super(props);
    this.games = [
      { 
        key: 'audiocall', 
        name: 'audiocall', 
        description: 'During the game you\'ll mprove your listening skills. '
      }, 
      { 
        key: 'sprint',
        name: 'sprint',
        description: 'You have 60 seconds to specify as many correct translation options as possible. The larger series of correct answers, the more points are given for each answer.' 
      }, 
      { 
        key: 'speakit',
        name: 'speak it',
        description: 'This mini-game will help you check your pronunciation.'
      }, 
      { 
        key: 'savannah', 
        name: 'savannah', 
        description: 'The Savannah training will help you build your vocabulary. The more words you know, the more experience points you\'ll get.'
      }, 
      { 
        key: 'englishPuzzle',
        name: 'english puzzle',
        description: 'This game will let you learn new English phrases. Collect sentences from words as if they were puzzles and remember their order.'
      }, 
      { 
        key: 'wordConstructor',
        name: 'word constructor',
        description: 'Let\'s find out if you can correctly assemble a word from letters. You have seven lives and 60 seconds.'
      },
    ];
    this.state = {
      currentGallerySlide: 'audiocall1',
      currentGamesSlide: 'audiocall',
      previouseGamesSlide: 'Let\'s check how many words you can guess in 1 minute. Choose correct tranclation to get best score.',
      sliderDirection: true,
    }
  }

  showNextSlide = () => {
    console.log('showNextSlide')
    const { currentGamesSlide } = this.state;
    let index = this.games.findIndex((item) => item.key === currentGamesSlide);
    index += 1;

    if (index === this.games.length) {
      index = 0;
    }

    this.setState({
      previouseGamesSlide: currentGamesSlide, 
      currentGamesSlide: this.games[index].key, 
      sliderDirection: true,
    });
  }

  showPrevSlide = () => {
    const { currentGamesSlide } = this.state;
    let index = this.games.findIndex((item) => item.key === currentGamesSlide);
    index -= 1;

    if (index < 0) {
      index = this.games.length - 1;
    }    

    this.setState({
      previouseGamesSlide: currentGamesSlide, 
      currentGamesSlide: this.games[index].key, 
      sliderDirection: false,
    });
  }


  render() {
    const { currentGamesSlide,  previouseGamesSlide, sliderDirection } = this.state;

    return (
      <>
        <div className={s.page}>
          <div className={s.promoWrapper}>
            <div className={s.promo}>                  
              <div className={s.promoHeader}>
                <h2 className={s.promoHeaderTitle}>Welcome to RSLang</h2>
                <p className={s.mainDescription}>
                  It is an application for learning English words with interval repetition techniques, mini-games and with functionality for tracking individual progress.
                </p>
              </div>        
              <div className={s.promoOpportunities}>
                <div className={s.promoAboutWrapper}>                        
                  <h2 className={s.aboutHeader}>About application</h2>
                  <p className={s.aboutDescription}>
                    The application contains trainings for learning 3600 commonly used English words and is based on the collection of "4000 essential english words". The first 400 most frequently used words are not included in the collection. It is believed that they represent basic vocabulary, that is left after previous attempts to learn language in school/ university or others.
                  </p>
                </div>        
                <div>
                  <div  className={s.mainApplication}>
                    <h3 className={s.mainApplicationHeader}>Main application</h3>
                    <div className={s.mainAppDescriptionBlock}>
                      <p className={s.mainApplicationDescription}>
                        The main functionality of the application is to learn and repeat words. It is presented in the form of cards with words to be guessed. Word cards contain both new words and words that need to be repeated. During the game, both knowledge of English words and their spelling are checked.
                      </p>
                      <div className={s.mainAppImgBlock}>
                        <img className={s.mainAppImg} src={owl} alt='Illustration - owl' />
                      </div>
                    </div>
                    <div className={s.mainAppDescriptionBlock}>
                      <p className={s.mainApplicationDescription}>
                        You can specify the number of new words that you plan to learn per day and the maximum number of cards with words per day in the application settings. You can also indicate what information has to be displayed on cards with words: translation of the word, sentence with an explanation of the word meaning, sentence with an example of the word use case.
                      </p>
                      <div className={s.mainAppImgBlock}>
                        <img className={s.mainAppImg} src={settingsImg} alt='Illustration - settings' />
                      </div>
                    </div>
                    <div className={s.mainAppDescriptionBlock}>
                      <p className={s.mainApplicationDescription}>
                        The application has a dictionary that contains information on what words were learned, what were removed from the study and what were marked as difficult words. The user can manage the words in his dictionary: delete from the study, return difficult words to the general list of words to be studied.
                      </p>
                      <div className={s.mainAppImgBlock}>
                          <img className={s.mainAppImg} src={books} alt='Illustration - books' />
                      </div>
                    </div>
                    <div className={s.intervalMethodDescription}>   
                      <p className={s.intervalMethod}>
                        The application implements a technique of interval repetition for better memorization of words. In the process of learning words, the user has the opportunity to mark the word as difficult, medium difficulty, easy or repeat it again. There are four buttons in the  game card: "Again", "Hard", "Good", "Easy". If the user marks the word as easy by pressing the "Easy" button, it will appear in the study after 21 days. If the user marks the word as medium-heavy (should be pressed "Good"), it will appear in the study after 7 days. If the word is marked out as heavy (button "Heavy"), it will appear in the study the next day. If the user press "Again", it will appear in the current workout.
                      </p>
                    </div>  
                  </div>                   
                </div>        
                <div className={s.games}>
                  <h3 className={s.gamesHeader}>Games</h3>
                  <p className={s.gamesDescription}>
                    There are 6 mini games in the application that help you to consolidate the previously acquired knowledge. You can play mini-games with previously learned words or by choosing one of the six presented difficulty levels.
                  </p>        
                  <div className={s.gameSlider}>
                    <div className={s.gameSlides}>        
                      <GameCard 
                        slidesData={this.games} 
                        direction={sliderDirection} 
                        previouseGamesSlide={previouseGamesSlide} 
                        currentGamesSlide={currentGamesSlide} />        
                    </div>        
                    <button className={s.btnNext} onClick={this.showPrevSlide}/>
                    <button className={s.btnPrev} onClick={this.showNextSlide}/>        
                  </div>
                          
                </div>        
                <div  className={s.statistics}>
                  <h3 className={s.statisticsHeader}>Statistics</h3>                          
                  <div className={s.statisticsDescriptionBlock}>
                    <p className={s.statisticsDescription}>
                      There is a statistics page in the application, where you can find information on the learning outcomes for every day in the form of a graph. Moreover this page provides long-term statistics on mini-games, you can see when and how many times you played a mini-game and the results.
                    </p>
                    <div className={s.statsImgBlock}>
                      <img className={s.statisticsImg} src={graph} />
                    </div>
                  </div>
                </div>
                          
              </div>
              <div>                           
                <div className={s.promoVideo}>
                <video className={s.video} controls >
                  <source src={video} type="video/mp4"/>
                </video>
                  <div>
                    <span className={s.linkRepoTitle}>Repository link: </span>
                    <a className={s.linkRepo} href='https://github.com/AntonL-tech/rs-lang' target='_blank'>https://github.com/AntonL-tech/rs-lang</a>
                  </div>                  
                </div>
              </div>        
            </div>
          </div>
        </div>
      </>      
    ) 
  }
}