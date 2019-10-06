'use strict';

const e = React.createElement;

function translate(phrase, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "translate?english="+phrase, true);
  if (!xhr) {
    alert('Something is not working');
    return;
  }
  xhr.onload = function() {
    let responseStr = xhr.responseText;
    let translateObj = JSON.parse(responseStr);
    callback(translateObj.english, translateObj.spanish);
  }
  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  xhr.send();
}

function addToDB(en_phrase, es_phrase) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "store?english="+en_phrase+"&spanish="+es_phrase, true);
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
      login: true,
      name: 'test-user',
      showError: false,
      width: undefined
    }
    this.loginClick = this.loginClick.bind(this);
  }
  updateWidth() {
    if(window.innerWidth < 625){
      this.setState({width: 625});
    }else {
    let newWidth = window.innerWidth;
    this.setState({width: newWidth});
    }
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  loginClick(event) {
    console.log('Login: onClick: ');

}

  render(){
    if(this.state.width > 1380){
      return (
        <div className="flex-card-row-log-right border-black">

          <div className="flex-card-log-left-column">
            <div>
              <span className="Raleway-title1 login-text-color">Welcome to<br/> Lango!</span>
            </div>

            <div>
              <p className="title2-main-lighter letter-spacing-desktop">Customize your vocabulary</p>
            </div>

          </div>


          <div className="flex-card-row-log-right" >
          <div className="flex-card-row-log-right">
            <button id="google-login-title-lighter" className="google-image-container" onClick={this.loginClick}>Log in with Google
              <img className="google_translate_elementP" src="./assets/google.jpg" alt="Login with Google"></img>
            </button>
          </div>
          </div>
        </div>
      );
   }
  if(this.state.width > 720){
    return (

      <div className="flex-card-column-login-tablet border-black">

        <div className="flex-card-log-left-column-mobile">
          <div>
            <span className="Raleway-title1 login-text-color">Welcome to<br/>Lango!</span>
          </div>

          <div>
            <p className="title2-main-lighter font-25 letter-spacing-tablet">Customize your vocabulary</p>
          </div>

        </div>



        <div className="flex-card-row-log-right-mobile" >
          <div className="flex-card-row-log-right">
            <button id="google-login-title-lighter" className="google-image-container" onClick={this.loginClick}>Log in with Google
              <img className="google_translate_elementP" src="./assets/google.jpg" alt="Login with Google"></img>
            </button>
          </div>
        </div>

      </div>
    );
  }
  else{
    return (

      <div className="flex-card-column-login-mobile border-black">
        <div className="flex-card-log-left-column-mobile mobile-part1-height">
          <div>
            <span className="Raleway-title1 login-text-color">Welcome to<br/>Lango!</span>
          </div>

          <div>
            <p className="title2-main-lighter font-25">Customize your vocabulary</p>
          </div>

        </div>


        <div className="flex-card-row-log-right-mobile mobile-part2-height" >
          <div className="flex-card-row-log-right">
            <button id="google-login-title-lighter" className="google-image-container" onClick={this.loginClick}>Log in with Google
              <img className="google_translate_elementP" src="./assets/google.jpg" alt="Login with Google"></img>
            </button>
          </div>
        </div>

      </div>
    );


  }


  }
}

class LoginScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      login: false,
      name: 'test-user',
      showError: false,
      width: undefined

    }
  }

  render() {
    return ( <div> <h1>LOGIN-IN-SCREEN</h1> </div> );
  }

}

class CardContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login: true,
      name: 'test-user',
      showError: false,
      width: undefined,
      opinion: "",
      translated: "",
      CardCreate: true,
      CardReview: false

    }
    this.checkReturn = this.checkReturn.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.GoToReview = this.GoToReview.bind(this);
  }

  updateWidth() {
    if(window.innerWidth < 700){
      this.setState({width: 700});
    }else {
    let newWidth = window.innerWidth;
    this.setState({width: newWidth});
    }
  }
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  checkReturn(event) {

    this.translateCallback = (englishPhrase, spanishPhrase) => {
      document.getElementById("spanish-translated-text").value = spanishPhrase;
      document.getElementById("spanish-translated-text-mobile").value = spanishPhrase;

      console.log("Callback reached");

      this.setState ({translated: spanishPhrase});
    };

    if (event.charCode == 13) {
      let newPhrase = document.getElementById("translate-text").value;
      if(newPhrase == ""){
        console.log("Empty Input");
      }
      else{
      this.setState({opinion: newPhrase});
      console.log("checkReturn: New Phrase to Translate: " + newPhrase);
      translate(newPhrase, this.translateCallback);
      }
    }
  }
  saveCard(event){
    //document.getElementById("spanish-translated-text").value = "mobile and desktop test"; // testing...

    if(newPhrase != "" || translated !=""){
      console.log("Save Card: ");
      addToDB( this.state.opinion,  this.state.translated);
      console.log("DB->added: " + this.state.translated);

    }
    else{
      console.log("saveCard: No input?");
      console.log("Values: " + "EN: " + this.state.opinion + "SP: " + this.state.translated);
    }
  }

  GoToReview(event){
    console.log("GoToReview: ...CardCreate:" , this.state.CardCreate);
    console.log("GoToReview: ...CardReview:" , this.state.CardReview);
    this.setState({CardCreate: false});
    this.setState({CardReview: true});

      return(
        <div>
          {<CardReview product={this.state.CardReview} /> }
        </div>
      );

  }

  render() {

    if(this.state.width > 950){
    return (
        <div className="flex-card-base border-black">
            <div className="flex-card-row relative-header">
              <input className="absolute-header-review-button" id="review-button" type="button" value="Start Review" onClick={this.GoToReview}/>
              <header className="absolute-header-title Raleway-title2 ">Lango!</header>
            </div>

            <div className="flex-card-row padding-top-text">
              <input  id="translate-text" className="margin-right" type="text" placeholder="English" onKeyPress={this.checkReturn} />
              <input  id="spanish-translated-text" className="margin-left" type="text" placeholder="Spanish" value={this.state.translated} />
            </div>

          <input id="save-button" type="submit" value="Save" onClick={this.saveCard} />
          <footer><span>User: </span> {this.state.name}</footer>
        </div>
      );
        }else{
          return(
            <div className="flex-card-base border-black">
                <div className="flex-card-row relative-header">
                  <input className="absolute-header-review-button-mobile" id="review-button-mobile" type="button" value="Start Review"></input>
                  <header className="absolute-header-title-mobile Raleway-title2-mobile ">Lango!</header>
                </div>

                <div className="flex-card-column">
                  <input  id="translate-text-mobile" type="text" placeholder="English" onKeyPress={this.checkReturn} />
                  <input  id="spanish-translated-text-mobile" type="text" placeholder="Spanish" value={this.state.translated} />
                </div>

              <input id="save-button-mobile" type="submit" value="Save" onClick={this.saveCard}></input>
              <footer className="width-footer-mobile"><span>User: </span> {this.state.name}</footer>
            </div>
          );

        }
  }

}



class CardReview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login: true,
      name: 'test-user',
      showError: false,
      width: undefined,
      CardCreate: false,
      CardReview: true,
      question: undefined,
      answer: undefined
    }
    this.checkReturn = this.checkReturn.bind(this);
    this.nextCard = this.nextCard.bind(this);
    this.addCard = this.addCard.bind(this);
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
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  checkReturn(event) {
    if (event.charCode == 13) {
      let newPhrase = document.getElementById("translate-text").value;
      if(newPhrase == ""){
        console.log("Empty Input");
      }
      else{
        console.log("Input accepted");
      }
    }
  }

  nextCard(event){
    console.log("GoToReview: ...CardCreate:" , this.state.CardCreate);
    console.log("GoToReview: ...CardReview:" , this.state.CardReview);
    this.setState({CardCreate: false});
    this.setState({CardReview: true});
  }
  addCard(event){
    console.log("addCard clicked: ");

  }

  render() {

    if(this.state.width > 750){
    return (
        <div className="flex-card-base border-black">
            <div className="flex-card-row relative-header">
              <input className="absolute-header-add-button" id="add-card-button" type="button" value="Add" onClick={this.addCard}/>
              <header className="absolute-header-title Raleway-title2 ">Lango!</header>
            </div>

            <div className="flex-card-column ">

            <div className="flip-button-relative">
            <button className="flip-card-button flip-button-absolute" type="submit" value=""></button>
              <input  id="answer-text" className="" type="text" placeholder="English" onKeyPress={this.checkReturn}>
              </input>
            </div>

              <input  id="question-translated-text" className="" type="text" placeholder="Spanish" value={this.state.translated} />
            </div>

          <input id="next-button" type="submit" value="Next" onClick={this.nextCard} />
          <footer><span>User: </span> {this.state.name}</footer>
        </div>
      );
        }else{
          return(
            <div className="flex-card-base border-black">
                <div className="flex-card-row relative-header">
                  <input className="absolute-header-add-button-mobile" id="add-card-button-mobile" type="button" value="Add" onClick={this.addCard}></input>
                  <header className="absolute-header-title-mobile Raleway-title2-mobile ">Lango!</header>
                </div>

                <div className="flex-card-column">

                  <div className="flip-button-relative">
                    <button className="flip-card-button flip-button-absolute-mobile" type="submit" value=""></button>
                    <input  id="answer-text-mobile" type="text" placeholder="English" onKeyPress={this.checkReturn} />
                  </div>

                  <input  id="question-translated-text-mobile" type="text" placeholder="Spanish" value={this.state.translated} />
                </div>

              <input id="next-button-mobile" type="submit" value="Add" onClick={this.nextCard}></input>
              <footer className="width-footer-mobile"><span>User: </span> {this.state.name}</footer>
            </div>
          );

        }
  }


}



class CardRender extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login: true,
      name: 'test-user',
      showError: false,
      width: undefined,
      CardCreate: true,
      CardReview: false

    }
  }
  render(){
    return(
      <div>
        { this.state.CardCreate && <Main /> }
        { this.state.CardReview && <CardReview product={this.state.CardReview} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <CardReview />,
  document.getElementById("root")
);
