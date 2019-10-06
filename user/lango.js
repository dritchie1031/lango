'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

function addToDB(en_phrase, es_phrase) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../store?english=" + en_phrase + "&spanish=" + es_phrase, true);
  if (!xhr) {
    alert('Something is not working');
    return;
  }
  xhr.onload = function () {
    console.log('Added to database');
  };
  xhr.onerror = function () {
    alert('Woops, there was an error making the request.');
  };
  xhr.send();
}

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

    _this.state = {
      cardReview: true,
      name: 'test-user',
      showError: false
    };
    _this.switchToAdd = _this.switchToAdd.bind(_this);
    _this.switchToReview = _this.switchToReview.bind(_this);
    return _this;
  }

  _createClass(Main, [{
    key: "switchToAdd",
    value: function switchToAdd() {
      this.setState({ cardReview: false });
    }
  }, {
    key: "switchToReview",
    value: function switchToReview() {
      this.setState({ cardReview: true });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.cardReview) {
        return React.createElement(CardReview, { switchFunction: this.switchToAdd });
      } else {
        return React.createElement(CardContainer, { switchFunction: this.switchToReview });
      }
    }
  }]);

  return Main;
}(React.Component);

var CardContainer = function (_React$Component2) {
  _inherits(CardContainer, _React$Component2);

  function CardContainer(props) {
    _classCallCheck(this, CardContainer);

    var _this2 = _possibleConstructorReturn(this, (CardContainer.__proto__ || Object.getPrototypeOf(CardContainer)).call(this, props));

    _this2.state = {
      name: 'test-user',
      showError: false,
      width: undefined,
      opinion: "",
      translated: "",
      switchFunction: props.switchFunction
    };
    _this2.checkReturn = _this2.checkReturn.bind(_this2);
    _this2.saveCard = _this2.saveCard.bind(_this2);
    _this2.translate = _this2.translate.bind(_this2);
    _this2.getUserName = _this2.getUserName.bind(_this2);
    _this2.getUserName();
    return _this2;
  }

  _createClass(CardContainer, [{
    key: "getUserName",
    value: function getUserName() {
      var req = new XMLHttpRequest();
      req.open("GET", "../getUserName", true);
      var card = this;
      if (!req) {
        alert('Something went wrong with the request');
        return;
      }
      req.onload = function () {
        var resStr = req.responseText;
        var resObj = JSON.parse(resStr);
        card.setState({ name: resObj.first });
      };
      req.onerror = function () {
        console.log('There was an error making the request.');
      };
      req.send();
    }
  }, {
    key: "updateWidth",
    value: function updateWidth() {
      if (window.innerWidth < 500) {
        this.setState({ width: 500 });
      } else {
        var newWidth = window.innerWidth;
        this.setState({ width: newWidth });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth.bind(this));
    }
  }, {
    key: "translate",
    value: function translate(phrase) {
      var xhr = new XMLHttpRequest();
      var that = this;
      xhr.open("GET", "../translate?english=" + phrase, true);

      if (!xhr) {
        alert('Something is not working');
        return;
      }

      xhr.onload = function () {
        var responseStr = xhr.responseText;
        var translateObj = JSON.parse(responseStr);
        that.setState({ translated: translateObj.Spanish });
      };

      xhr.onerror = function () {
        alert('Woops, there was an error making the request.');
      };

      xhr.send();
    }
  }, {
    key: "checkReturn",
    value: function checkReturn(event) {

      if (event.charCode == 13) {
        var newPhrase = "";
        if (this.state.width > 950) {
          newPhrase = document.getElementById("translate-text").value;
        } else {
          newPhrase = document.getElementById("translate-text-mobile").value;
        }
        if (newPhrase == "") {
          console.log("Empty Input");
        } else {
          this.setState({ opinion: newPhrase });
          console.log("checkReturn: New Phrase to Translate: " + newPhrase);
          //this.setState({translated: "Test " + newPhrase});

          this.translate(newPhrase);
        }
      }
    }
  }, {
    key: "saveCard",
    value: function saveCard(event) {
      if (this.state.opinion != "" || this.state.translated != "") {
        console.log("Save Card: ");
        addToDB(this.state.opinion, this.state.translated);
      } else {
        console.log("saveCard: No input?");
        console.log("Values: " + "EN: " + this.state.opinion + "SP: " + this.state.translated);
      }
    }
  }, {
    key: "render",
    value: function render() {

      if (this.state.width > 950) {
        return React.createElement(
          "div",
          { className: "flex-card-base" },
          React.createElement(
            "div",
            { className: "flex-card-row relative-header" },
            React.createElement("input", { className: "absolute-header-review-button", id: "review-button", type: "button", value: "Start Review", onClick: this.state.switchFunction }),
            React.createElement(
              "header",
              { className: "absolute-header-title Raleway-title2 " },
              "Lango!"
            )
          ),
          React.createElement(
            "div",
            { className: "flex-card-row padding-top-text" },
            React.createElement("input", { id: "translate-text", className: "margin-right", type: "text", placeholder: "English", onKeyPress: this.checkReturn }),
            React.createElement("input", { id: "spanish-translated-text", className: "margin-left", type: "text", placeholder: "Spanish", defaultValue: this.state.translated })
          ),
          React.createElement("input", { id: "save-button", type: "submit", value: "Save", onClick: this.saveCard }),
          React.createElement(
            "footer",
            null,
            React.createElement(
              "span",
              null,
              "User: "
            ),
            " ",
            this.state.name
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "flex-card-base" },
          React.createElement(
            "div",
            { className: "flex-card-row relative-header" },
            React.createElement("input", { className: "absolute-header-review-button-mobile", id: "review-button-mobile", type: "button", value: "Start Review", onClick: this.state.switchFunction }),
            React.createElement(
              "header",
              { className: "absolute-header-title-mobile Raleway-title2-mobile " },
              "Lango!"
            )
          ),
          React.createElement(
            "div",
            { className: "flex-card-column" },
            React.createElement("input", { id: "translate-text-mobile", type: "text", placeholder: "English", onKeyPress: this.checkReturn }),
            React.createElement("input", { id: "spanish-translated-text-mobile", type: "text", placeholder: "Spanish", defaultValue: this.state.translated })
          ),
          React.createElement("input", { id: "save-button-mobile", type: "submit", value: "Save", onClick: this.saveCard }),
          React.createElement(
            "footer",
            { className: "width-footer-mobile" },
            React.createElement(
              "span",
              null,
              "User: "
            ),
            " ",
            this.state.name
          )
        );
      }
    }
  }]);

  return CardContainer;
}(React.Component);

function Card(props) {
  var isMobile = props.width < 750;
  var frontElem = React.createElement(
    "p",
    { id: "front" },
    props.frontText
  );
  var backElem = void 0;
  if (props.isCorrect) {
    backElem = React.createElement(
      "p",
      { id: "back", className: "correct hidden" },
      "Correct!"
    );
  } else {
    backElem = React.createElement(
      "p",
      { id: "back", className: "hidden" },
      props.backText
    );
  }

  if (isMobile) {
    return React.createElement(
      "div",
      { id: "card", className: "answer-text-mobile" },
      frontElem,
      backElem
    );
  } else {
    return React.createElement(
      "div",
      { id: "card", className: "answer-text" },
      frontElem,
      backElem
    );
  }
}

var CardReview = function (_React$Component3) {
  _inherits(CardReview, _React$Component3);

  function CardReview(props) {
    _classCallCheck(this, CardReview);

    var _this3 = _possibleConstructorReturn(this, (CardReview.__proto__ || Object.getPrototypeOf(CardReview)).call(this, props));

    _this3.state = {
      name: 'test-user',
      showError: false,
      isFirstView: true,
      width: undefined,
      currentCard: { spanish: "", english: "" },
      cards: [{ spanish: "", english: "" }],
      switchFunction: props.switchFunction,
      correctAns: false,
      isFlipped: false
    };
    _this3.checkAnswer = _this3.checkAnswer.bind(_this3);
    _this3.checkAnswerKey = _this3.checkAnswerKey.bind(_this3);
    _this3.nextCard = _this3.nextCard.bind(_this3);
    _this3.getUserName = _this3.getUserName.bind(_this3);
    _this3.getCards = _this3.getCards.bind(_this3);
    _this3.componentDidMount = _this3.componentDidMount.bind(_this3);
    _this3.updateWidth = _this3.updateWidth.bind(_this3);
    _this3.flipCard = _this3.flipCard.bind(_this3);
    return _this3;
  }

  _createClass(CardReview, [{
    key: "getCards",
    value: function getCards() {
      console.log('getting cards');
      var req = new XMLHttpRequest();
      var view = this;
      req.open("GET", '../getCards', true);

      if (!req) {
        alert("Something went wrong getting the cards");
        return;
      }
      req.onload = function () {
        var resStr = req.responseText;
        var resObj = JSON.parse(resStr);
        console.log(resObj);
        if (resObj.length === 0) {
          view.state.switchFunction();
          console.log('Switching views.');
        } else {
          view.setState({ cards: resObj });
          console.log('Got cards');
          view.nextCard();
        }
      };
      req.onerror = function () {
        console.log('There was an error getting the cards');
      };
      req.send();
    }
  }, {
    key: "getUserName",
    value: function getUserName() {
      var req = new XMLHttpRequest();
      req.open("GET", "../getUserName", true);
      var card = this;
      if (!req) {
        alert('Something went wrong with the request');
        return;
      }
      req.onload = function () {
        var resStr = req.responseText;
        var resObj = JSON.parse(resStr);
        console.log(resObj);
        card.setState({ name: resObj.first });
      };
      req.onerror = function () {
        console.log('There was an error making the request.');
      };
      req.send();
    }
  }, {
    key: "flipCard",
    value: function flipCard() {
      var card = document.getElementById('card');
      var frontSide = document.getElementById('front');
      var backSide = document.getElementById('back');
      var flipped = void 0;
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
      this.setState({ isFlipped: flipped });
      console.log('Flipping');
    }
  }, {
    key: "updateWidth",
    value: function updateWidth() {
      if (window.innerWidth < 460) {
        this.setState({ width: 460 });
      } else {
        var newWidth = window.innerWidth;
        this.setState({ width: newWidth });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth);
      this.getCards();
      this.getUserName();
    }
  }, {
    key: "checkAnswerKey",
    value: function checkAnswerKey(event) {
      if (event.charCode == 13) {
        this.checkAnswer();
      }
    }
  }, {
    key: "checkAnswer",
    value: function checkAnswer() {
      if (this.state.isFlipped) {
        this.nextCard();
        return;
      }
      var userInput = document.getElementById('review-user-input').value;
      var isCorrect = userInput === this.state.currentCard.english;

      var req = new XMLHttpRequest();
      req.open("GET", '../incSeen?english=' + this.state.currentCard.english + '&correct=' + isCorrect, true);
      var view = this;
      if (!req) {
        alert("Something went wrong with the request");
        return;
      }
      req.onerror = function () {
        console.log('There was an error making the request');
      };
      req.onload = function () {
        var updatedCard = {};
        Object.assign(updatedCard, view.state.currentCard);
        updatedCard.seen++;
        updatedCard.correct += isCorrect;
        console.log(updatedCard);
        view.setState({
          currentCard: updatedCard,
          correctAns: isCorrect
        });
        console.log('Increment Successful');
        view.flipCard();
      };
      req.send();
    }
  }, {
    key: "nextCard",
    value: function nextCard() {
      if (this.state.isFlipped) {
        this.flipCard();
      }
      var cardsLen = this.state.cards.length;
      var index = 0;
      while (true) {
        index = Math.floor(Math.random() * cardsLen);
        var card = this.state.cards[index];
        var score = Math.max((card.seen - card.correct) / (card.seen + 1), 0.1);
        score += Math.max(0.05, (15 - card.seen) / 15);
        if (Math.random() < score) {
          this.setState({ currentCard: card });
          break;
        }
      }
    }
  }, {
    key: "render",
    value: function render() {

      if (this.state.width > 750) {
        return React.createElement(
          "div",
          { className: "flex-card-base" },
          React.createElement(
            "div",
            { className: "flex-card-row relative-header" },
            React.createElement("input", { className: "absolute-header-add-button", id: "add-card-button", type: "button", value: "Add",
              onClick: this.state.switchFunction }),
            React.createElement(
              "header",
              { className: "absolute-header-title Raleway-title2 " },
              "Lango!"
            )
          ),
          React.createElement(
            "div",
            { className: "flex-card-column " },
            React.createElement(
              "div",
              { className: "flip-button-relative" },
              React.createElement("button", { className: "flip-card-button flip-button-absolute", type: "submit", onClick: this.checkAnswer }),
              React.createElement(Card, { frontText: this.state.currentCard.spanish, width: this.state.width,
                backText: this.state.currentCard.english, isCorrect: this.state.correctAns })
            ),
            React.createElement("input", { id: "review-user-input", className: "question-translated-text", type: "text", placeholder: "Enter your answer here",
              onKeyPress: this.checkAnswerKey })
          ),
          React.createElement("input", { id: "next-button", type: "submit", value: "Next", onClick: this.nextCard }),
          React.createElement(
            "footer",
            null,
            React.createElement(
              "span",
              null,
              "User: "
            ),
            " ",
            this.state.name
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "flex-card-base" },
          React.createElement(
            "div",
            { className: "flex-card-row relative-header" },
            React.createElement("input", { className: "absolute-header-add-button-mobile", id: "add-card-button-mobile",
              type: "button", value: "Add", onClick: this.state.switchFunction }),
            React.createElement(
              "header",
              { className: "absolute-header-title-mobile Raleway-title2-mobile " },
              "Lango!"
            )
          ),
          React.createElement(
            "div",
            { className: "flex-card-column" },
            React.createElement(
              "div",
              { className: "flip-button-relative" },
              React.createElement("button", { className: "flip-card-button flip-button-absolute-mobile", type: "submit",
                onClick: this.checkAnswer }),
              React.createElement(Card, { frontText: this.state.currentCard.spanish, width: this.state.width,
                backText: this.state.currentCard.english, isCorrect: this.state.correctAns })
            ),
            React.createElement("input", { id: "review-user-input", className: "question-translated-text-mobile",
              type: "text",
              placeholder: "Enter your answer here", onKeyPress: this.checkAnswerKey })
          ),
          React.createElement("input", { id: "next-button-mobile", type: "submit", value: "Next", onClick: this.nextCard }),
          React.createElement(
            "footer",
            { className: "width-footer-mobile" },
            React.createElement(
              "span",
              null,
              "User: "
            ),
            " ",
            this.state.name
          )
        );
      }
    }
  }]);

  return CardReview;
}(React.Component);

ReactDOM.render(React.createElement(Main, null), document.getElementById("root"));

