README.txt for the "Lango" flashcards Web app

Authors: Daniel Ritchie and Kevin Nguyen

This is a past assignment, the domain will no longer work. We used the following technologies:

Google OAuth2
Express.js
Node.js
SQLite
React.js

Domain: http://server162.site:57019:/

Start the server with the following command: node flashCardServer.js

Landing Page: login.html
Main Page: user/lango.html (only accessible if logged in)

Both the 'review' and 'add' views are in the same jsx/html file

The Review algorithm that decides if a card is shown is as follows:

card = the proposed next card, determined by getting a random index
score = max(()/(),0.1) + max(0.05, (15-card.seen)/15))
  // this score makes the minimum chance of staying with a card 15%,
  //prioritizing cards that the user has gotten incorrect the highest percentage
  //of times, with an additional priority for cards that have been seen less in
  //general

if (randomDecimal(0,1) < score):
  display this card
else:
  get a new random card and repeat the above process
