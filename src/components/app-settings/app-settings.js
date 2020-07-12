import React, {Component} from 'react';
import styled from 'styled-components'
import s from './app-settings.module.css'
import Header from '../app-header/app-header'
import Sidebar from '../app-sidebar/app-sidebar'
import ProgressBar from './progress-bar/index'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import Page from '../app-page-structure/app-page-structure';

const ProggresBarContainer = styled.div`
    width: 100%;
`
const token = window.localStorage.getItem('token');
const userId = window.localStorage.getItem('userId');

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           answer: '',
           settingPage: true,
           audio: false,
           translation: false,
           transcription: false,
           textExample: false,
           textExampleTranslate: false,
           meaning: false,
           meaningRu: false,
           meaningAudio: false,
           audioExample: false,
           example: false,
           image: false,
           deleteButton: false,
           hardButton: false,
           showWordButton: false,
           voiceAllow: false,
           stopAudio: true,
           answerButton: false,
           translationButton: true,
           countOfWords: '',
           countOfCards: '',
           level: '',
           data: [],
           line: 0,
           page: 1,
           count: 0,
           endGame: true,
           percentage: 0,
           isCheck: false,
           isAnswerWrong: false,
           sound: true,
           showTranslation: true,
           arrayOfDeletedWords:[],
           arrayOfHardWords: [],
           arrayOfLearnedWords: [],
           customLevelWords: [],
           customLine: 0,
           repeat: true,
           usedWord: true, 
           match: 0,
           mistake: 0,
           miss: 0,
           complexity: false, 
           isRightAnswer: false,
           response: [],
           currentWord: {},
           allCustomWords: [],
           isAllow: true, 
           isActiveDeleteBtn: false,
           isActiveHardBtn: false,
           isActiveAgainBtn: false,
           isActiveBadBtn: false,
           isActiveGoodBtn: false,
           isActiveEasyBtn: false
        };
        this.setResults = this.setResults.bind(this)
        this.myRef = React.createRef();
        this.setUserWord = this.setUserWord.bind(this)
        this.setWord = this.setWord.bind(this)
    }

    continueGame() {
        this.setState({answer: ''})
        this.setState({settingPage: true})
        this.setState({audio: false})
        this.setState({translation: false})
        this.setState({transcription: false})
        this.setState({textExample: false})
        this.setState({textExampleTranslate: false})
        this.setState({meaning: false})
        this.setState({meaningRu: false})
        this.setState({meaningAudio: false})
        this.setState({audioExample: false})
        this.setState({example: false})
        this.setState({image: false})
        this.setState({deleteButton: false})
        this.setState({hardButton: false})
        this.setState({showWordButton: false})
        this.setState({voiceAllow: false})
        this.setState({stopAudio: true})
        this.setState({answerButton: false})
        this.setState({translationButton: true})
        this.setState({countOfWords: ''})
        this.setState({countOfCards: ''})
        this.setState({level: ''})
        this.setState({data: []})
        this.setState({line: 0})
        this.setState({page: 1})
        this.setState({count: 0})
        this.setState({endGame: true})
        this.setState({percentage: 0})
        this.setState({isCheck: false})
        this.setState({isAnswerWrong: false})
        this.setState({sound: true})
        this.setState({showTranslation: true})
        this.setState({arrayOfDeletedWords: []})
        this.setState({arrayOfHardWords: []})
        this.setState({arrayOfLearnedWords: []})
        this.setState({customLevelWords: []})
        this.setState({customLine: 0})
        this.setState({repeat: true})
        this.setState({usedWord: true})
        this.setState({match: 0})
        this.setState({mistake: 0})
        this.setState({miss: 0})
        this.setState({complexity: false})
        this.setState({isRightAnswer: false})
        this.getUserWord(userId)
        console.log(this.state)
    }

    toggleSpeaking() {
        this.setState({stopAudio: !this.state.stopAudio});
        this.setState({sound: !this.state.sound});
    };

    async toggleAnswer(data,line) {
        const {stopAudio, meaningAudio, audioExample, answerButton, countOfCards, percentage, count, repeat, endGame, customLevelWords, miss} = this.state;
        console.log('Вы сдались')
        this.setState({miss: miss + 1})
        
        this.myRef.current.textContent = data[line].word;

        // Увеличен счёт карточек
        this.setState({ count: count + 1 });

        // Фокус в поле ввода
        this.myRef.current.focus();

        // Показывает слово 
        this.setState({answerButton: true});

        // Произносит слово и предложения
        if(stopAudio) {
            await this.sayWord(data[line].word)
            if (meaningAudio) {
            await this.sayWord(data[line].textMeaning)
            }
            if (audioExample) {
                await this.sayWord(data[line].textExample)
            }
        }

        // Скрывает слово 
        this.setState({answerButton: false});
        // Очищает поле ввода
        this.myRef.current.textContent = '';

        //  Когда кончаются слова для повторения подкидывает новые
        if (repeat && count === data.length - 1) {
            this.setState({usedWord: false})
            this.setState({repeat: false})
        } else if (count === countOfCards - 1) {
            this.setState({endGame: false})
        } 

        // Чекаем есть ли слова для повторения
        if (!customLevelWords.length && line === 0) {
            this.setState({repeat: false});
            this.setState({line: line + 1})
        };

        // Переход к следующему слову
        if (repeat) {
            this.setState({customLine: line + 1})
        } else {
            if (line === data.length - 1) {
                this.setState({ line: 0 });
                this.setState({ page: this.state.page + 1 });
                this.getResults();
            } else {
                this.setState({line: line + 1})
            }
        }

        console.log(this.state)
    };

    toggletranslationButton() {
        this.setState({translationButton: !this.state.translationButton});
        this.setState({showTranslation: !this.state.showTranslation});
    };

    handleChange = (event) => {
        this.setState({[event.target.id]: +event.target.value})
    };

    handleChangeInput = (event) => {
        this.setState({[event.target.id]: event.target.value})
        console.log(this.state)
    };

    handleChangeDiv = (event) => {
        this.setState({answer: event.target.textContent})
    };

    handleCheck = (event) => {
        this.setState({[event.target.id]: event.target.checked})
        localStorage.setItem(`${event.target.id}`, `${event.target.checked}`)
    };

    handleSelect = (event) => {
        this.setState({level : +event.target.value})
    };

    getResults() {
        const group = !this.state.level ? 0 : this.state.level - 1;
        fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${this.state.page}&group=${group}`)
            .then(data => {
                return data.json()
            })
            .then(this.setResults)
            .catch(err => {
                console.log(err)
            })
    };

    async setResults(data) {
        data = await this.filterArray(this.state.allCustomWords, data)
        if (!this.state.customLevelWords.length) {
            this.setState({usedWord: false})
            this.setState({repeat: false})
        }
        if (data.length === 0) {
            this.setState({ page: this.state.page + 1 });
            this.getResults();
        } else {
            this.setState({data: data})
            console.log(this.state)
            if ((this.state.translation || this.state.meaning || this.state.textExample) && (this.state.countOfWords > 0 && this.state.countOfCards > 0)) {
                this.setState({ settingPage: false });
    
                // Фокус в поле ввода
                this.myRef.current.focus();
    
            } else {
                this.setState({isCheck: true})
            }
        }
    };

    displaySettings() {
        return (
            <>
                <div>
                <form className={s.settings_form}>
                    <label>
                        Уровень сложности:
                        <div className={s.select}>
                            <select value={this.state.level} onChange={this.handleSelect}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                            </select>
                        </div>
                    </label>

                    <label>
                        Новых слов в день:
                        <input id='countOfWords' type="number" onChange = {this.handleChange} min="1" max="50" required autoComplete='false'/>
                    </label>

                    <label>
                        Максимальное количество карточек в день:
                        <input id='countOfCards' type="number" onChange = {this.handleChange} min="1" max="50" required autoComplete='false'/>
                    </label>


                    <input className={s.game_checkbox} id='translation' type="checkbox" checked={this.state.translation} onChange = {this.handleCheck}/>
                    <label htmlFor='translation' className={s.game_checkbox_label}>Перевод слова</label>

                    <input className={s.game_checkbox} id='audio' type="checkbox" checked={this.state.audio} onChange = {this.handleCheck}/>
                    <label htmlFor='audio' className={s.game_checkbox_label}>Аудио</label>

                    <input className={s.game_checkbox} id='meaning' type="checkbox" checked={this.state.meaning} onChange = {this.handleCheck}/>
                    <label htmlFor='meaning' className={s.game_checkbox_label}>Предложение с объяснением значения слова</label>

                    <input className={s.game_checkbox} id='meaningRu' type="checkbox" checked={this.state.meaningRu} onChange = {this.handleCheck}/>
                    <label htmlFor='meaningRu' className={s.game_checkbox_label}>Предложение с объяснением значения слова на русском</label>

                    <input className={s.game_checkbox} id='meaningAudio' type="checkbox" checked={this.state.meaningAudio} onChange = {this.handleCheck}/>
                    <label htmlFor='meaningAudio' className={s.game_checkbox_label}>Аудио с объяснением значения слова</label>

                    <input className={s.game_checkbox} id='textExample' type="checkbox" checked={this.state.textExample} onChange = {this.handleCheck}/>
                    <label htmlFor='textExample' className={s.game_checkbox_label}>Предложение с примером использования изучаемого слова</label>

                    <input className={s.game_checkbox} id='textExampleTranslate' type="checkbox" checked={this.state.textExampleTranslate} onChange = {this.handleCheck}/>
                    <label htmlFor='textExampleTranslate' className={s.game_checkbox_label}>Предложение с примером использования изучаемого слова на русском</label>

                    <input className={s.game_checkbox} id='audioExample' type="checkbox" checked={this.state.audioExample} onChange = {this.handleCheck}/>
                    <label htmlFor='audioExample' className={s.game_checkbox_label}>Аудио с примером использования изучаемого слова</label>

                    <input className={s.game_checkbox} id='transcription' type="checkbox" checked={this.state.transcription} onChange = {this.handleCheck}/>
                    <label htmlFor='transcription' className={s.game_checkbox_label}>Транскрипция</label>

                    <input className={s.game_checkbox} id='image' type="checkbox" checked={this.state.image} onChange = {this.handleCheck}/>
                    <label htmlFor='image' className={s.game_checkbox_label}>Картинка</label>

                    <input className={s.game_checkbox} id='deleteButton' type="checkbox" checked={this.state.deleteButton} onChange = {this.handleCheck}/>
                    <label htmlFor='deleteButton' className={s.game_checkbox_label}>Кнопка удалить</label>

                    <input className={s.game_checkbox} id='hardButton' type="checkbox" checked={this.state.hardButton} onChange = {this.handleCheck}/>
                    <label htmlFor='hardButton' className={s.game_checkbox_label}>Кнопка cложные слова</label>

                    <input className={s.game_checkbox} id='showWordButton' type="checkbox" checked={this.state.showWordButton} onChange = {this.handleCheck}/>
                    <label htmlFor='showWordButton' className={s.game_checkbox_label}>Кнопка показать ответ</label>

                    <input className={s.game_checkbox} id='voiceAllow' type="checkbox" checked={this.state.voiceAllow} onChange = {this.handleCheck}/>
                    <label htmlFor='voiceAllow' className={s.game_checkbox_label}>Кнопка звука</label>

                    <input className={s.game_checkbox} id='complexity' type="checkbox" checked={this.state.complexity} onChange = {this.handleCheck}/>
                    <label htmlFor='complexity' className={s.game_checkbox_label}>Индивидуальная сложность изучаемого слова</label>
                </form>
                </div>
                <button className={s.game_btn} type="button" onClick={() => this.getResults()}>Начать</button>
                {this.state.isCheck ? <div className={s.error_settings}>Необходимо указать количество новых слов, которые планируете выучить за день, а также максимальное количество карточек со словами на день.<p>Хотя бы один пункт из нижеперечисленных должен быть отмечен:<br/>перевод слова<br/>предложение с объяснением значения слова<br/> предложение с примером использования изучаемого слова </p></div> : null}
            </>
        )
    };

    displayCards(data, line = 0) {
        const {translation, transcription,answerButton, audio, image, meaning, meaningRu, textExample, meaningAudio, 
            textExampleTranslate, audioExample, deleteButton, showWordButton, voiceAllow, hardButton, translationButton, 
            isAnswerWrong, sound, showTranslation, usedWord, match, mistake, miss, isRightAnswer, isAllow, isActiveDeleteBtn, isActiveHardBtn, isActiveAgainBtn, isActiveBadBtn, isActiveGoodBtn, isActiveEasyBtn} = this.state;

        let hideTextMeaning = !answerButton ? this.hideWord(data[line].textMeaning, data[line].word) : this.showWords(data[line].textMeaning, data[line].word);
        let hideTextExample = !answerButton ? this.hideWord(data[line].textExample, data[line].word) : this.showWords(data[line].textExample, data[line].word);
        
        const inputWidth = data[line].word.length * 18;
        const {endGame} = this.state;
        let answerBox = (<div style={{width: inputWidth + 'px'}} className={s.card_answer} contentEditable={true} onBlur = {this.handleChangeDiv} id="answer" onKeyPress={(event) => this.handleKeyPress(event, data, line)} ref={this.myRef}></div>);
        let errorBox =  this.compareWords(data[line].word, this.state.answer);
        const page = endGame ? (<div>
            <div className={s.card}>
                <div className={s.answer}>Слово: {!isAnswerWrong ? answerBox : errorBox}</div>
                {translation && translationButton ? <div className={s.card_word}>Перевод: {data[line].wordTranslate}</div> : null}
                {transcription ? <div className={s.card_word}>Транскрипция: {data[line].transcription}</div> : null}
                {audio ? <div className={s.card_word}>Аудио: <audio controls src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${data[line].audio}`}></audio></div> : null}
                {image ? <div className={s.card_word}>Картинка:  <img src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${data[line].image}`} alt='meaning' /></div> : null}
                {meaning ? <div className={s.card_word}>Предложение на англе: {hideTextMeaning} </div> : null}
                {meaningRu && translationButton ? <div className={s.card_word}>Предложение на русском: {data[line].textMeaningTranslate}</div> : null}
                {meaningAudio ? <div className={s.card_word}>Аудио значение на англе: <audio controls src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${data[line].audioMeaning}`}></audio></div> : null}
                {textExample ? <div className={s.card_word}>Предложение с примером использования изучаемого слова: {hideTextExample}</div> : null}
                {textExampleTranslate && translationButton ? <div className={s.card_word}>Предложение с примером использования изучаемого слова на русском: {data[line].textExampleTranslate}</div> : null}
                {audioExample ? <div className={s.card_word}>Аудио предложение на англе: <audio controls src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${data[line].audioExample}`}></audio></div> : null}
                <div className={s.btn_inner}>
                    {deleteButton && !usedWord ? <button  className={isActiveDeleteBtn ? s.game_btn_active : s.game_btn} onClick={() => this.deleteUserWord(data, line)}>Удалить</button> : null}
                    {hardButton && !usedWord ? <button className={isActiveHardBtn ? s.game_btn_active : s.game_btn} onClick={() => this.hardUserWord(data, line)}>Сложные</button> : null }
                    <button className={!showTranslation ? s.game_btn_translaition : s.game_btn_translaition_active} onClick={() => this.toggletranslationButton()}>Показывать перевод</button>
                    {voiceAllow ? <button className={!sound ? s.game_btn_audio : s.game_btn_audio_active} onClick={(event) => this.toggleSpeaking(event)}><i className="fas fa-volume-up"/></button> : null}
                </div>
                <div className={s.complexity_btns}>
                    {isRightAnswer ? <button  className={isActiveAgainBtn ? s.game_btn_active : s.game_btn} onClick={(event) => this.setComplexityOfWord(event, data, line)}>Снова</button> : null}
                    {isRightAnswer ? <button  className={isActiveBadBtn ? s.game_btn_active : s.game_btn} onClick={(event) => this.setComplexityOfWord(event, data, line)}>Трудно</button> : null}
                    {isRightAnswer ? <button  className={isActiveGoodBtn ? s.game_btn_active : s.game_btn} onClick={(event) => this.setComplexityOfWord(event, data, line)}>Хорошо</button> : null}
                    {isRightAnswer ? <button  className={isActiveEasyBtn ? s.game_btn_active : s.game_btn} onClick={(event) => this.setComplexityOfWord(event, data, line)}>Легко</button> : null}
                </div>
                <div className={s.result_btns}>
                    {showWordButton && !isRightAnswer && isAllow ? <button className={s.game_btn} onClick={() => this.toggleAnswer(data,line)}>Показать ответ</button> : null}
                    {!isRightAnswer && isAllow ? <button className={s.game_btn} type="button" onClick={() => this.increment(data,line)}>Ответить</button> : null}
                </div>
                <ProggresBarContainer className={s.progress_bar}>
                    {this.state.match}
                    <ProgressBar percentage={this.state.percentage}/>
                    {this.state.countOfCards}
                </ProggresBarContainer>
            </div>
        </div>) : (<div className={s.card}>
                <h2 className={s.card_word}>Ура! На сегодня всё.</h2>
                <p className={s.card_word}>Слов отгадано - {match}</p>
                <p className={s.card_word_error}>Сделано ошибок - {mistake}</p>
                <p className={s.card_word_miss}>Слов пропущено - {miss}</p>
                <p className={s.card_word}>Есть ещё новые карточки, но дневной лимит исчерпан. Вы можете увеличить лимит в настройках, но, пожалуйста, имейте в виду, что чем больше новых карточек вы просмотрите, тем больше вам надо будет повтороять в ближайшее время.</p>
                <p className={s.card_word}>Для обучения сверх обычного расписания, нажмите кнопку 'Учить ещё' ниже</p>
                <div className={s.game_btn_inner}> 
                    <button className={s.game_btn} onClick={() => this.continueGame()}>Учить ещё</button>
                    <button className={s.game_btn}><Link to="/app-words">Словарь</Link></button>
                    <button className={s.game_btn}><Link to="/">На главную</Link></button>
                </div>
        </div>)

        return(
            <>
                {page}
            </>
        )
    };

    async increment(data, line) {
        const {answer, stopAudio, meaningAudio, audioExample, answerButton, countOfCards, percentage, count, repeat, endGame, customLevelWords, usedWord, match, mistake, isRightAnswer, complexity} = this.state;
        this.setState({isActiveAgainBtn: false})
        this.setState({isActiveBadBtn: false})
        this.setState({isActiveGoodBtn: false})
        this.setState({isActiveEasyBtn: false})

        // Чекаем есть ли слова для повторения
        if (!customLevelWords.length && line === 0) {
            this.setState({page: this.state.page + 1})
            if (!this.state.data.length) {
                this.getResults();
            }
            this.getWord(userId, data[line].id);
            // Добавляем слова в изученые
            this.createUserWord({
                userId: userId,
                wordId: data[line].id,
                word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 5).toISOString().split('T')[0], 'repeat' : 0}},
                });
        };
        // Если слово отгадано
        if (answer.toLowerCase() === data[line].word.toLowerCase()) {
            this.setState({match: match + 1});

            // Добавляем слова в изученые
            if (!usedWord) {
                this.createUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 5).toISOString().split('T')[0], 'repeat' : 0}},
                });
            } else if (customLevelWords.length){
                this.getWord(userId, data[line].id);
                setTimeout(() => {
                    this.updateUserWord({
                        userId: userId,
                        wordId: data[line].id,
                        word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 5).toISOString().split('T')[0], 'repeat' : this.state.currentWord.optional.repeat}},
                    });
                }, 1000)
            }
            
            // Увеличен счёт карточек
            this.setState({ count: count + 1 });

            // Показывает слово 
            this.setState({answerButton: true});

            // Увеличивает прогресс бар
            const step = 1 / countOfCards*100;
            this.setState({percentage: percentage + step})

            // Произносит слово и предложения
            if(stopAudio) {
                await this.sayWord(data[line].word)
                if (meaningAudio) {
                await this.sayWord(data[line].textMeaning)
                }
                if (audioExample) {
                    await this.sayWord(data[line].textExample)
                }
            }

             // Фокус в поле ввода
             this.myRef.current.focus();

            this.setState({isRightAnswer: true});

            if (!complexity) {
                // Скрывает слово 
                this.setState({answerButton: false});
                // Очищает поле ввода
                this.myRef.current.textContent = '';

                //  Когда кончаются слова для повторения подкидывает новые
                if (repeat && count === data.length - 1) {
                    this.setState({repeat: false})
                    this.setState({usedWord: false})
                }  
                if (count === countOfCards - 1) {
                    this.setState({endGame: false})
                } 

                // Переход к следующему слову
                if (repeat) {
                    this.setState({customLine: line + 1})
                } else {
                    if (line === data.length - 1) {
                        this.setState({ line: 0 });
                        this.setState({ page: this.state.page + 1 });
                        this.getResults();
                    } else {
                        this.setState({line: line + 1})
                    }
                }

                this.setState({isRightAnswer: false});
            } else {
                setTimeout(() => {
                     // Скрывает слово 
                    this.setState({answerButton: false});
                    // Очищает поле ввода
                    this.myRef.current.textContent = '';

                    //  Когда кончаются слова для повторения подкидывает новые
                    if (repeat && count === data.length - 1) {
                        this.setState({repeat: false})
                        this.setState({usedWord: false})
                    } 
                    if (count === countOfCards - 1) {
                        this.setState({endGame: false})
                    } 

                    // Переход к следующему слову
                    if (repeat) {
                        this.setState({customLine: line + 1})
                    } else {
                        if (line === data.length - 1) {
                            this.setState({ line: 0 });
                            this.setState({ page: this.state.page + 1 });
                            this.getResults();
                        } else {
                            this.setState({line: line + 1})
                        }
                    }

                    this.setState({isRightAnswer: false});
                }, 3000)
            }
        } else {
            this.setState({isAllow: false});
            data.push(data[line]);
            // Счетчик ошибок
            this.setState({mistake: mistake + 1})

            // Выводит слово с ошибкой
            this.myRef.current.textContent = '';
            this.setState({isAnswerWrong: true})

            // Произносит слово и предложения
            if(stopAudio) {
                await this.sayWord(data[line].word)
                if (meaningAudio) {
                await this.sayWord(data[line].textMeaning)
                }
                if (audioExample) {
                    await this.sayWord(data[line].textExample)
                }
            }

            setTimeout(()=> {
                    this.setState({isAnswerWrong: false});
                    this.setState({isAllow: true});
            }, 2000)
        }
    };

    setComplexityOfWord(event, data, line) {
        const {customLevelWords, usedWord} = this.state;
        if (!this.state.currentWord.optional || !usedWord) {
            if (event.target.textContent === 'Снова') {
                this.setState({isActiveAgainBtn: true})
                data.push(data[line]);
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "hard", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': new Date().toISOString().split('T')[0], 'repeat' : 0}},
                });
            } 

            if (event.target.textContent === 'Трудно') {
                this.setState({isActiveBadBtn: true})
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "hard", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 1).toISOString().split('T')[0], 'repeat' : 0}},
                });
            } 
    
            if (event.target.textContent === 'Хорошо') {
                this.setState({isActiveGoodBtn: true})
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 7).toISOString().split('T')[0], 'repeat' : 0}},
                });
            }
    
            if (event.target.textContent === 'Легко') {
                this.setState({isActiveEasyBtn: true})
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 21).toISOString().split('T')[0], 'repeat' : 0}},
                });
            }
        } else {
            if (event.target.textContent === 'Снова') {
                this.setState({isActiveAgainBtn: true})
                data.push(data[line]);
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "hard", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': new Date().toISOString().split('T')[0], 'repeat' : this.state.currentWord.optional.repeat + 1}},
                });
            } 

            if (event.target.textContent === 'Трудно') {
                this.setState({isActiveBadBtn: true})
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "hard", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 1).toISOString().split('T')[0], 'repeat' : this.state.currentWord.optional.repeat + 1}},
                });
            } 
    
            if (event.target.textContent === 'Хорошо') {
                this.setState({isActiveGoodBtn: true})
                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 7).toISOString().split('T')[0], 'repeat' : this.state.currentWord.optional.repeat + 1}},
                });
            }
    
            if (event.target.textContent === 'Легко') {
                this.setState({isActiveEasyBtn: true})

                this.updateUserWord({
                    userId: userId,
                    wordId: data[line].id,
                    word: { "difficulty": "weak", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 21).toISOString().split('T')[0], 'repeat' : this.state.currentWord.optional.repeat + 1}},
                });
            }
        }
        
    }

    handleKeyPress(event,data,line) {
        if (event.key === 'Enter') {       
            this.setState({answer: event.target.textContent})     
            setTimeout(() => {
                this.increment(data,line)          
            }, 1000)
        }
    };

    async sayWord(word) {
        const msg = new SpeechSynthesisUtterance();
        msg.volume = .7;
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = word;
        const voice =  {
            'lang': 'en-US',
        };
        msg.lang = voice.lang;
        speechSynthesis.speak(msg);

        return new Promise(resolve => {
            msg.onend = resolve;
        });
    };

    hideWord(str,word) {
        var hiden = '';
        for (let i = 0; i < word.length; i++) {
            hiden = hiden + '*'
        }
        let hidenString = str.replace(new RegExp(word, 'gi'), hiden).replace(new RegExp('<i>', 'g'), '').replace(new RegExp('</i>', 'g'), '').replace(new RegExp('<b>', 'g'), '').replace(new RegExp('</b>', 'g'), '');
        return hidenString
    };

    showWords(str, keyWord) {
        const string = str.replace(new RegExp('<i>', 'g'), '').replace(new RegExp('</i>', 'g'), '').replace(new RegExp('<b>', 'g'), '').replace(new RegExp('</b>', 'g'), '');
        const array = string.split(' ').map(word => {
            let newWord = word;
            if (word === keyWord) {
                newWord = (<b>{keyWord}</b>);
            }
            return newWord
        })
        return (array.map(element => (<span>{element} </span>)))
    };

    compareWords(word, answer) {
        let arrayOfWordLetters = word.split('');
        let arrayOfAnswerLetters = answer.split('');
        let result=[];
        let count = 0
        for (let i = 0; i < arrayOfWordLetters.length; i++) {
            if (arrayOfWordLetters[i] !== arrayOfAnswerLetters[i]) {
                count = count + 1;
            }
        }
        for (let i = 0; i < arrayOfWordLetters.length; i++) {
            if (arrayOfWordLetters[i] !== arrayOfAnswerLetters[i]) {
                arrayOfWordLetters[i] = (<span className={count > 2 ? s.red : s.orange}>{arrayOfWordLetters[i]}</span>)
            } else {
                arrayOfWordLetters[i] = (<span className={s.green}>{arrayOfWordLetters[i]}</span>)
            }
            result.push(arrayOfWordLetters[i]);
        }
        return <div className={s.card_answer} contentEditable={true}>{result.map(element => (element))}</div>
    };

    createUserWord = async ({ userId, wordId, word }) => {
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
            method: 'POST',
            withCredentials: true,
            headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        });
        const content = await rawResponse.json();
        
        console.log(content);
    };

    updateUserWord = async ({ userId, wordId, word }) => {
        const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
            method: 'PUT',
            withCredentials: true,
            headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        });
        const content = await rawResponse.json();
        
        console.log(content);
    };
    

    async deleteUserWord (data,line) {
        this.setState({isActiveDeleteBtn: true})
        this.createUserWord({
            userId: userId,
            wordId: data[line].id,
            word: { "difficulty": "weak", "optional": {'word': data[line], 'deleted': true, 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': 'Deleted', 'repeat' : 0}},
        });
        await this.toggleAnswer(data, line)
        this.setState({isActiveDeleteBtn: false})
    }

    async hardUserWord (data,line) {
        this.setState({isActiveHardBtn: true})
        this.createUserWord({
            userId: userId,
            wordId: data[line].id,
            word: { "difficulty": "hard", "optional": {'word': data[line], 'currentDate': new Date().toISOString().split('T')[0], 'repeatDate': this.addDays(new Date(), 1).toISOString().split('T')[0], 'repeat' : 0}}
        });
        await this.toggleAnswer(data, line)
        this.setState({isActiveHardBtn: false})
    }

    getWord (userId, wordId) {
        fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
          method: 'GET',
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }).then(data => {
            return data.json();
        }).then(this.setWord)
        .catch(err => console.log(err))
    };

    setWord(data) {
        this.setState({currentWord: data})
    }


    componentDidMount() {
        this.getUserWord(userId);
    }

    getUserWord (userId) {
        fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words`, {
          method: 'GET',
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }).then(data => {
            return data.json();
        }).then(this.setUserWord)
        .catch(err => console.log(err))
    };

    setUserWord(data) {
        this.setState({response: data})
        for (let i = 0; i < data.length; i++) {
            this.state.allCustomWords.push(data[i].optional.word)
        }
        data = data.filter(element => element.optional.repeatDate === new Date().toISOString().split('T')[0])
        for (let i = 0; i < data.length; i++) {
            if (data[i].optional.deleted) {
                this.state.arrayOfDeletedWords.push(data[i].optional.word)
            } else if (data[i].difficulty === 'hard') {
                this.state.arrayOfHardWords.push(data[i].optional.word);
                this.state.customLevelWords.push(data[i].optional.word);
            } else {
                this.state.arrayOfLearnedWords.push(data[i].optional.word);
                this.state.customLevelWords.push(data[i].optional.word);
            }
        }
        console.log(this.state)
    }

    filterArray(arr1, arr2) {
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].id === arr2[j].id) {
                    arr2.splice(j, 1);
                }
            }
        }
        return arr2;
    }

    addDays(theDate, days) {
        return new Date(theDate.getTime() + days*24*60*60*1000);
    }

    

    render() {
        const { settingPage, data, customLevelWords, repeat, line, customLine} = this.state;
        const page = settingPage ? (<div className={s.settings_inner}>
             {this.displaySettings()}
        </div>) :
        (<div>
            {repeat && customLevelWords.length  ? this.displayCards(customLevelWords,customLine) :this.displayCards(data,line)}
        </div>);

        return (
            <Page>
                <div className={s.container}>
                    <div className={s.form_inner}>
                        {page}
                    </div>
                </div>
            </Page>

        );
    }
}
