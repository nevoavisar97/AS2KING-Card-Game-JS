//game container const variable
const deckHtml = document.getElementById("deck");


let Suits = {
	Clubs: 1,
	Diamonds: 2,
	Hearts: 3,
	Spades: 4
}

//card element constructor
function Card(number, suit) {
	this.number = number;
	this.suit = suit;
}

//game player constructor
function Player(name) {
	this.name = name;
	this.cardsArr = [];
}

//game constructor
function Game(name1, name2) {
	this.player1 = new Player(name1);
	this.player2 = new Player(name2);
	this.activePlayer = this.player1;
	this.casheirStack = [];
	this.trashStack = [];
	this.deal =
		function () {
			//cashier stack intiallizing with 52 cards, 13 of each suit
			for (let i = 1; i <= 13; i++) {
				for (let suit in Suits)
					this.casheirStack.push(new Card(i, suit));
			}
			this.casheirStack.push(new Card('black', 'joker'));
			this.casheirStack.push(new Card('red', 'joker'));
			//randomally sort the card array with random function as sorting key.
			this.casheirStack.sort(() => Math.random() - 0.5);
			//player cards array initiazllizing,we take 13 cards from the cashier stac for each player.
			for (let i = 1; i <= 13; i++) {
				this.player1.cardsArr.push(this.casheirStack.pop());
				this.player2.cardsArr.push(this.casheirStack.pop());
			}
			//taking one card from the cashier to the trash stack
			this.trashStack.push(this.casheirStack.pop());
		}
}

//A function that refresh the game board with every change and rearrnge it.
function renderCards() {
	deckHtml.innerText = "";
	showPlayerCards(game1.player1, 'player1');
	//adding timer div
	showTimer();
	showCashier();
	showPlayerCards(game1.player2, 'player2');
	console.log(game1.casheirStack);
	CashierTrashActive();
	localStorage.setItem('prevGame', JSON.stringify(game1));
}

// the function sets onclick event on trash + cashier stacks
// it allows the current (active) player to take a card from the cashier / trash and display it in that player's deck
function CashierTrashActive() {
	document.getElementById('Trash').onclick = function () {
		if (game1.trashStack.length > 0 && game1.activePlayer.cardsArr.length == 13 && game1.activePlayer == game1.player1) {
			game1.activePlayer.cardsArr.push(game1.trashStack.pop());
			renderCards();
		}
	}
	document.getElementById('cashier').onclick = function () {
		if (game1.activePlayer.cardsArr.length == 13 && game1.activePlayer == game1.player1) {
			game1.activePlayer.cardsArr.push(game1.casheirStack.pop());
			renderCards();
		}
	}
}

//Game proggress validator, if player has 14 cards it allows him to click the desired card and get rid of it.
//with every itiration he validates if the player has won the game or not.
var winner = false;
function GameProgress(card) {
	document.getElementById('timer').innerHTML = " ";
	clearInterval(intervalID);
	var playerArr = game1.player1.cardsArr;
	if (!winner) {
		if (playerArr.length > 13) {
			let tmpCard = playerArr[playerArr.length-1];
			playerArr[playerArr.length - 1] = card;
			playerArr[playerArr.indexOf(card)] = tmpCard;
			game1.trashStack.push(playerArr.pop());
			winner = winValidation(playerArr);
			if (winner) {
				alert("You win!, New game about to start");
				renderCards();
				winner = false;
				localStorage.clear();
				setTimeout(start, 10000);
			}
			//turn switch
			game1.activePlayer = game1.player2;
			renderCards();
			setTimeout(ServerTurn1, 0);
		}
	}
}

//A function that calculates a win, assuming a sorted array of cards.
//will check if the card's suit is equal to the other cards that follow it.
//If we found 13 of the same suit then we definitely got a winning series
function winValidation(playerCardsArr) {
	var count = 1;
	var cardTmp = playerCardsArr[0];
	for (var i = 1; i < playerCardsArr.length; i++)
		if (cardTmp.suit == playerCardsArr[i].suit || playerCardsArr[i].suit == 'joker') count++;
	if (count == 13 && playerCardsArr.length <=14) {
		return true;
	}
	else return false;
}

//sort player deck by suit and number
function sortCards(playerArr) {
	return (playerArr.sort((a, b) => {
		if (a.suit == b.suit) {
			return a.number < b.number ? -1 : 1;
		} else {
			return a.suit < b.suit ? -1 : 1;
		}
	}));
}


//Creates the player cards according to the player object sent in the function
function showPlayerCards(player, playerId) {
	//using sortCards in order to sort the cards by number and suit
	let playerCards = sortCards(player.cardsArr);
	var playerCardsContainer = document.createElement('div');
	playerCardsContainer.className = "playerCards";
	playerCardsContainer.id = playerId;

	//card element creation
	for (let i = 0; i < playerCards.length; i++) {
		let card = playerCards[i];
		let elementCard = document.createElement('div');
		elementCard.className = "card";
		if (playerId == 'player1' || winner == true)
			if (card.suit == 'joker') elementCard.style.backgroundImage = `url(images/images/${card.number}_${card.suit}.png)`
			else elementCard.style.backgroundImage = `url(images/images/${card.number}_of_${card.suit}.png)`;
		else elementCard.style.backgroundImage = `url(images/images/back2x.png)`;

		//over effects for each card
		elementCard.onmouseover = function () {
			elementCard.style.marginRight = '-40px';
		}
		elementCard.onmouseout = function () {
			elementCard.style.marginRight = '-55px';
		}
		//game start proccess (turn activation for current player cards) - onclick event
		if (game1.activePlayer == game1.player1 && playerId == 'player1') {
			elementCard.onclick = function () {
				document.getElementById('timer').innerText = " ";
				clearInterval(intervalID); }
			elementCard.onclick = function () { GameProgress(card); }
		}
		playerCardsContainer.appendChild(elementCard);
	}
	//current turn gesture activation
	var turnGesture = document.createElement('div');
	var img = document.createElement('img');
	img.src = "images/images/turnArrow.png";
	img.className = 'playerTurn';
	img.width = 80;
	if (game1.activePlayer == player) {
		turnGesture.appendChild(img);
		playerCardsContainer.appendChild(turnGesture);
	}
	else playerCardsContainer.style.marginRight = '172px';

	deckHtml.appendChild(playerCardsContainer);
}

function showCashier() {
	if (game1.casheirStack.length == 0) {
		//randomally sort the card array with random function as sorting key.
		game1.casheirStack = game1.trashStack.sort(() => Math.random() - 0.5);
		game1.trashStack = [];
		game1.trashStack.push(game1.casheirStack.pop());
		alert("The cards in the casheir are over, the casheir stack has been reshuffled")
	}
	//container div
	var dealerBoard = document.createElement('div');
	dealerBoard.id = "dealer";
	//cashier div element creation
	var elementCashier = document.createElement('div');
	elementCashier.className = "card";
	elementCashier.id = "cashier"
	elementCashier.style.backgroundImage = `url(images/images/back2x.png)`;
	//cashier div append to container
	dealerBoard.appendChild(elementCashier);
	//trash div element creation
	var elementTrash = document.createElement('div');
	elementTrash.className = "card";
	elementTrash.id = "Trash";
	if (game1.trashStack.length > 0) {
		let card = game1.trashStack[game1.trashStack.length - 1];
		if (card.suit == 'joker') elementTrash.style.backgroundImage =`url(images/images/${card.number}_${card.suit}.png)`
		else elementTrash.style.backgroundImage = `url(images/images/${card.number}_of_${card.suit}.png)`;
	}
	dealerBoard.appendChild(elementTrash);
	deckHtml.appendChild(dealerBoard);
}

//game instruction alerts, initializing new game
var game1;

function start() {
	//if local storage not empty, offer to to resume game with confirm
	if (localStorage["prevGame"] != null) {
		if (confirm("The previous game is not over, would you like to continue where you left off?")) {
			//get info from local storage
			game1 = JSON.parse(localStorage["prevGame"]);
			//active player retriving
			if (game1.activePlayer.name == 'player1') {
				game1.activePlayer = game1.player1;
			}
			else game1.activePlayer = game1.player2;
			renderCards();
		}
		else {
			localStorage.clear();
			start();
		}
	}
	 else {
		alert('ACE 2 KING - GAME INSTRUCTIONS:  At the start of each turn, take a card from the casheir stack or trash. Then click on the card you want to remove from your deck. Victory: reaching a series of 13 cards of the same type.')
		alert("The red arrow marks the deck of the player whose turn it is to take a card from the dealer, GOOD LUCK!");
		game1 = new Game('player1', 'player2');
		game1.deal();
		renderCards();
		setPlayerTimer();
	}
}

/*////////////////////////////////////////////////********PART B*********////////////////////////////////////////////////////*/

//a function that returns an arrray of the suit/s with the most cards at player deck
function getMaxCounter(dict) {
	let maxArr = [];
	let max = dict['Clubs'];
	for (var key in Suits) {
		if (dict[key] > max)
			max = dict[key];
	}
	for (var key in Suits) {
		if (dict[key] == max)
			maxArr.push(key);
	}
	return maxArr;
}

//function that returns the suit with the least cardss at player's deck
function getMinCounter(dict) {
	console.log(dict);
	var suitKey;
	for (var suit in Suits)
		if (dict[suit] > 0) {
			var min = dict[suit];
			suitKey = suit;
			break;
		}
	for (var key in Suits) {
		if (dict[key] < min && dict[key] > 0) {
			min = dict[key];
			suitKey = key;
		}
	}
	return suitKey;
}



//server turn proggress
function ServerTurn1() {
	document.getElementById('timer').innerHTML = " ";
	clearInterval(intervalID);

	setTimeout(function turn() {

		//dictionary : counter for each suit
		let count = {
			Clubs: 0,
			Diamonds: 0,
			Hearts: 0,
			Spades: 0
		};
		let playerCardsArr = game1.player2.cardsArr;
		//if thers no winner continue your turn
		if (!winner) {
			//filling the counters 
			for (var i = 0; i < playerCardsArr.length; i++)
				if (playerCardsArr[i].suit != 'joker')
					count[playerCardsArr[i].suit]++;
			let addedSuit; // saves the suit, count purpose.
			let maxSuits = getMaxCounter(count); // recieves the maximal suit/s of the deck as an array
			let popedFromTrash = false; //flag
			//for each maximal suit/s, checking if it has the same suit as of the card at the trash
			let trashHeadSuit = game1.trashStack[game1.trashStack.length - 1].suit;
			for (var i = 0; i < maxSuits.length; i++) {
				if (trashHeadSuit == maxSuits[i] || trashHeadSuit == 'joker') {
					game1.player2.cardsArr.push(game1.trashStack.pop());
					popedFromTrash = true;
					if (trashHeadSuit == 'joker')
						addedSuit = 'joker';
					else addedSuit = maxSuits[i];
					break;
				}
			}
			//if we havent found the maximal suit, take a card from the cashier
			if (popedFromTrash == false) {
				addedSuit = game1.casheirStack[game1.casheirStack.length - 1].suit;
				game1.player2.cardsArr.push(game1.casheirStack.pop());
			}
			//updating counters
			if (addedSuit != 'joker')
				count[addedSuit]++;
			renderCards();
			//delay of 5 sec between throwing cards
			setTimeout(serverTurn2, 5000, count, playerCardsArr);
		}
	}, 5000);
}

//part 2 of player turn
function serverTurn2(count, playerCardsArr) {
	//get minimal amount suit
	let minSuit = getMinCounter(count);
	console.log(minSuit);
	//throwing cards
	for (var i = 0; i < playerCardsArr.length; i++) {
		if (playerCardsArr[i].suit == minSuit) {
			let tmpCard = playerCardsArr[playerCardsArr.length - 1];
			playerCardsArr[playerCardsArr.length - 1] = playerCardsArr[i];
			playerCardsArr[i] = tmpCard;
			count[minSuit]--;
			game1.trashStack.push(playerCardsArr.pop());
			break;
		}
	}
	//validates wining deck
	winner = winValidation(game1.player2.cardsArr);
	if (winner) {
		renderCards();
		setTimeout(alert("You Lost, PC won!, New game about to start"), 10000);
		winner = false;
		localStorage.clear();
		setTimeout(start, 10000);
	}
	else {
		game1.activePlayer = game1.player1;
		renderCards();
		setPlayerTimer();
	}
}

//////////////////////////////////////////  תוספת לשלישיה  ///////////////////////////////////////////////////////


// a function that displays the timer
function showTimer() {
	divElement = document.createElement('div');
	divElement.id = "timer";
	deckHtml.appendChild(divElement);
}

var intervalID;
function setPlayerTimer() {
	// create a new div element
	var timerDiv = document.getElementById("timer");
	// get the current time
	var startTime = new Date();
	// set an interval to update the timer every 1 second
	intervalID = setInterval(updateTimer, 1000);
	// function that update the timer
		function updateTimer() {
			// get the current time
			var currentTime = new Date();
		   // Calculate time in seconds
			var elapsedTime = (currentTime - startTime) / 1000;
			// calculate remaining time in seconds
			var remainingTime = 20 - elapsedTime;
			timerDiv.innerHTML = "Time remaining: " + remainingTime.toFixed(1) + " seconds";
			// If the timer has reached 0 stop the interval and update the text 
			if (remainingTime <= 0) {
				game1.player1.cardsArr.push(game1.casheirStack.pop());
				game1.activePlayer = game1.player2;
				clearInterval(intervalID);
				timerDiv.innerHTML = " ";
				renderCards();
				ServerTurn1();
			}
		}
	var timerStyle = document.createElement("style");
	timerStyle.innerHTML = "#timer {text-align: center;}";
	document.head.appendChild(timerStyle);
}


