'use strict';

const e = React.createElement;

function addToDB(en_phrase, es_phrase) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "../store?english="+en_phrase+"&spanish="+es_phrase, true);
  if (!xhr) {
    alert('Something is not working');
    return;
  }
  xhr.onload = function() {
    console.log('Added to database');
  }
  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  xhr.send();
}

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      cardReview: true,
      name: 'test-user',
      showError: false,
    }
    this.switchToAdd = this.switchToAdd.bind(this);
    this.switchToReview = this.switchToReview.bind(this);
  }

  switchToAdd() {
    this.setState({cardReview: false});
  }

  switchToReview() {
    this.setState({cardReview: true});
  }

  render(){
    if (this.state.cardReview) {
      return(<CardReview switchFunction={this.switchToAdd}/>);
    }
    else {
      return(<CardContainer switchFunction={this.switchToReview}/>);
    }
  }
}


class CardContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'test-user',
      showError: false,
      width: undefined,
      opinion: "",
      translated: "",
      switchFunction: props.switchFunction
    }
    this.checkReturn = this.checkReturn.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.translate = this.translate.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getUserName();
  }

  getUserName() {
    let req = new XMLHttpRequest();
    req.open("GET", "../getUserName", true);
    let card = this;
    if (!req) {
      alert('Something went wrong with the request');
      return;
    }
    req.onload = function() {
      let resStr = req.responseText;
      let resObj = JSON.parse(resStr);
      card.setState({name: resObj.first});
    }
    req.onerror = function() {
      console.log('There was an error making the request.');
    }
    req.send();
  }

  updateWidth() {
    if(window.innerWidth < 500){
      this.setState({width: 500});
    }else {
    let newWidth = window.innerWidth;
    this.setState({width: newWidth});
    }
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  translate(phrase) {
    let xhr = new XMLHttpRequest();
    let that = this;
    xhr.open("GET", "../translate?english="+phrase, true);
     
    if (!xhr) {
      alert('Something is not working');
      return;
    }
      
    xhr.onload = function() {
      let responseStr = xhr.responseText;
      let translateObj = JSON.parse(responseStr);
      that.setState({translated: translateObj.Spanish});
    }
      
    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };
      
    xhr.send();
  }

  checkReturn(event) {


    if (event.charCode == 13) {
      let newPhrase = "";
      if(this.state.width > 950){
        newPhrase = document.getElementById("translate-text").value;
      } 
      else {
        newPhrase = document.getElementById("translate-text-mobile").value
      }
      if(newPhrase == ""){
        console.log("Empty Input");
      }
      else{
      this.setState({opinion: newPhrase});
      console.log("checkReturn: New Phrase to Translate: " + newPhrase);
      //this.setState({translated: "Test " + newPhrase});

      this.translate(newPhrase);
      }
    }
  }
  saveCard(event){
    if(this.state.opinion != "" || this.state.translated !=""){
      console.log("Save Card: ");
      addToDB( this.state.opinion,  this.state.translated);
    }
    else{
      console.log("saveCard: No input?");
      console.log("Values: " + "EN: " + this.state.opinion + "SP: " + this.state.translated);
    }
  }


  render() {

    if(this.state.width > 950){
    return (
        <div className="flex-card-base">
            <div className="flex-card-row relative-header">
              <input className="absolute-header-review-button" id="review-button" type="button" value="Start Review" onClick={this.state.switchFunction}/>
              <header className="absolute-header-title Raleway-title2 ">Lango!</header>
            </div>

            <div className="flex-card-row padding-top-text">
              <input  id="translate-text" className="margin-right" type="text" placeholder="English" onKeyPress={this.checkReturn} />
              <input  id="spanish-translated-text" className="margin-left" type="text" placeholder="Spanish" defaultValue={this.state.translated} />
            </div>

          <input id="save-button" type="submit" value="Save" onClick={this.saveCard} />
          <footer><span>User: </span> {this.state.name}</footer>
        </div>
      );
        }else{
          return(
            <div className="flex-card-base">
                <div className="flex-card-row relative-header">
                  <input className="absolute-header-review-button-mobile" id="review-button-mobile" type="button" value="Start Review" onClick={this.state.switchFunction}></input>
                  <header className="absolute-header-title-mobile Raleway-title2-mobile ">Lango!</header>
                </div>

                <div className="flex-card-column">
                  <input  id="translate-text-mobile" type="text" placeholder="English" onKeyPress={this.checkReturn}></input>
                  <input  id="spanish-translated-text-mobile" type="text" placeholder="Spanish" defaultValue={this.state.translated}></input>
                </div>

              <input id="save-button-mobile" type="submit" value="Save" onClick={this.saveCard}></input>
              <footer className="width-footer-mobile"><span>User: </span> {this.state.name}</footer>
            </div>
          );

        }
  }

}

function Card(props) {
  let isMobile = props.width < 750;
  const frontElem = <p id="front">{props.frontText}</p>;
  let backElem;
  if (props.isCorrect) {
    backElem = <p id="back" className="correct hidden">Correct!</p>;
  } else {
    backElem = <p id="back" className="hidden">{props.backText}</p>;
  }

  if (isMobile) {
    return(
      <div id="card" className="answer-text-mobile">
      {frontElem}
      {backElem}
      </div>
    );
  } else {
    return(
      <div id="card" className="answer-text">
      {frontElem}
      {backElem}
      </div>
    );
  }
}


class CardReview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'test-user',
      showError: false,
      isFirstView: true,
      width: undefined,
      currentCard: {spanish: "", english: ""},
      cards: [{spanish: "", english: ""}],
      switchFunction: props.switchFunction,
      correctAns: false,
      isFlipped: false,
    }
    this.checkAnswer = this.checkAnswer.bind(this);
    this.checkAnswerKey = this.checkAnswerKey.bind(this);
    this.nextCard = this.nextCard.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getCards = this.getCards.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  getCards() {
    console.log('getting cards');
    let req = new XMLHttpRequest();
    let view = this;
    req.open("GET", '../getCards',true);

    if (!req) {
      alert("Something went wrong getting the cards");
      return;
    }
    req.onload = function() {
      let resStr = req.responseText;
      let resObj = JSON.parse(resStr);
      console.log(resObj);
      if (resObj.length === 0) {
        view.state.switchFunction();
        console.log('Switching views.'); 
      }
      else {
        view.setState({cards: resObj});
        console.log('Got cards');
        view.nextCard();
      }
    }
    req.onerror = function() {
      console.log('There was an error getting the cards');
    }
    req.send();
  }

  getUserName() {
    let req = new XMLHttpRequest();
    req.open("GET", "../getUserName", true);
    let card = this;
    if (!req) {
      alert('Something went wrong with the request');
      return;
    }
    req.onload = function() {
      let resStr = req.responseText;
      let resObj = JSON.parse(resStr);
      console.log(resObj);
      card.setState({name: resObj.first});
    }
    req.onerror = function() {
      console.log('There was an error making the request.');
    }
    req.send();
  }

  flipCard() {
    let card = document.getElementById('card');
    let frontSide = document.getElementById('front');
    let backSide = document.getElementById('back');
    let flipped;
    if (backSide.classList.contains('hidden')) {
      backSide.classList.remove('hidden');
    } else {
      backSide.classList.add('hidden');
    }
    if (card.classList.contains('flipped')) {
      card.classList.remove('flipped');
      flipped = false;
    } else {
      card.classList.add('flipped');
      flipped = true;
    }
    if (frontSide.classList.contains('frontHide')) {
      frontSide.classList.remove('frontHide');
    } else {
      frontSide.classList.add('frontHide');
    }
    this.setState({isFlipped: flipped});
    console.log('Flipping');
  }
  

  updateWidth() {
    if(window.innerWidth < 460){
      this.setState({width: 460});
    }else {
    let newWidth = window.innerWidth;
    this.setState({width: newWidth});
    }
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
    this.getCards();
    this.getUserName();
  }

  checkAnswerKey(event) {
    if (event.charCode == 13) {
      this.checkAnswer();
    }
  }
  checkAnswer() {
    if (this.state.isFlipped) {
      this.nextCard();
      return;
    }
    let userInput = document.getElementById('review-user-input').value;
    let isCorrect = userInput === this.state.currentCard.english;

    let req = new XMLHttpRequest();
    req.open("GET", '../incSeen?english=' + this.state.currentCard.english + '&correct=' + isCorrect, true);
    let view = this;
    if (!req) {
      alert("Something went wrong with the request");
      return;
    }
    req.onerror = function () {
      console.log('There was an error making the request');
    }
    req.onload = function () {
      let updatedCard = {};
      Object.assign(updatedCard, view.state.currentCard);
      updatedCard.seen++;
      updatedCard.correct += isCorrect;
      console.log(updatedCard)
      view.setState({
        currentCard: updatedCard,
        correctAns: isCorrect
      });
      console.log('Increment Successful');
      view.flipCard();
    }
    req.send();
  }

  nextCard(){ 
    if (this.state.isFlipped) {
      this.flipCard();
    }
    let cardsLen = this.state.cards.length;
    let index = 0;
    while(true) {
      index = Math.floor(Math.random() * cardsLen);
      let card = this.state.cards[index];
      let score = Math.max((card.seen-card.correct)/(card.seen+1), 0.1);
      score += Math.max(0.05, (15-card.seen)/15);
      if (Math.random() < score) {
        this.setState({currentCard: card});
        break;
      }
    }

  }

  render() {

    if(this.state.width > 750){
    return (
        <div className="flex-card-base">
            <div className="flex-card-row relative-header">
              <input className="absolute-header-add-button" id="add-card-button" type="button" value="Add" 
                onClick={this.state.switchFunction}/>
              <header className="absolute-header-title Raleway-title2 ">Lango!</header>
            </div>

            <div className="flex-card-column ">

            <div className="flip-button-relative">
              <button className="flip-card-button flip-button-absolute" type="submit" onClick={this.checkAnswer}></button>

            <Card frontText={this.state.currentCard.spanish} width={this.state.width}
              backText={this.state.currentCard.english} isCorrect={this.state.correctAns}/>

            </div>

              <input  id="review-user-input" className="question-translated-text" type="text" placeholder="Enter your answer here" 
                onKeyPress={this.checkAnswerKey} />
            </div>

          <input id="next-button" type="submit" value="Next" onClick={this.nextCard} />
          <footer><span>User: </span> {this.state.name}</footer>
        </div>
      );
        }else{
          return(
            <div className="flex-card-base">
                <div className="flex-card-row relative-header">
                  <input className="absolute-header-add-button-mobile" id="add-card-button-mobile" 
                    type="button" value="Add" onClick={this.state.switchFunction}></input>
                  <header className="absolute-header-title-mobile Raleway-title2-mobile ">Lango!</header>
                </div>

                <div className="flex-card-column">

                  <div className="flip-button-relative">
                    <button className="flip-card-button flip-button-absolute-mobile" type="submit" 
                      onClick={this.checkAnswer}></button>
                    <Card frontText={this.state.currentCard.spanish} width={this.state.width}
                      backText={this.state.currentCard.english} isCorrect={this.state.correctAns}/>                
                  </div>

                  <input  id="review-user-input" className="question-translated-text-mobile" 
                    type="text" 
                    placeholder="Enter your answer here" onKeyPress={this.checkAnswerKey} />
                </div>

              <input id="next-button-mobile" type="submit" value="Next" onClick={this.nextCard}></input>
              <footer className="width-footer-mobile"><span>User: </span> {this.state.name}</footer>
            </div>
          );

    }
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById("root")
);
