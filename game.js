var config = {
    apiKey: "AIzaSyDDw0n7UBY0wJ9zbXmDf17dRPd055WT81o",
    authDomain: "firetrain-a4a39.firebaseapp.com",
    databaseURL: "https://firetrain-a4a39.firebaseio.com",
    projectId: "firetrain-a4a39",
    storageBucket: "firetrain-a4a39.appspot.com",
    messagingSenderId: "205241367969"
};
firebase.initializeApp(config);

var database = firebase.database();
var playersRef = database.ref("players");
var currentTurnRef = database.ref("turn");
var currentPlayers = null;
var username = "";
var currentTurn = null;
var playerNum = false;
var playerOneExists = false;
var playerTwoExists = false;
var playerONeData = null;
var playerTwoData = null;

//start game button
$("#start").click(function() {
    if ($("#username").val() !== '') {
        username = capitalize($("#username").val());
        getInGame();
    }
});

//enter username
$("#username").keypress(function(i) {
    if (i.keyCode === 13 && $("#username").val() !== "") {
        username = capitalize($("#username").val());
        getInGame();
    }
});

playerRef.set({
    name: username,
    wins: 0,
    losses: 0,
});


//buttons for r,p,s
$(document).on("click", "li", function() {
    var btn = $(this).text();
    // for the players pick take the child or choice and select
    playerRef.child("choice").set(clickChoice);

    //when btn is clickd shows users choice
    $("#player" + playerNum + "ul").empty();
    $("#player" + playerNum + "chosen").text(clickChoice);

    currentTurnRef.transaction(function(turn) {
        return turn + 1;
    });
});

playersRef.on("value", function(snapshot) {
    currentPlayers = snapshot.numChildren();
    playerOne = snapshot.child("1").val();
    playerTwo = snapshot.child("2").val();

    if (playerOne) {
        $("#player1-name").text(playerOneData.name);
        $("#player1-wins").text("Wins: " + playerOneData.wins);
        $("#player1-losses").text("Losses " + playerOneData.losses);
    } else {
        $("#player1-name").text("looking for player 1");
        $("#player1-wins").empty();
        $("#player1-losses").empty();
    }
    //player 2
    if (playerTwo) {
        $("#player2-name").text(playerOneData.name);
        $("#player2-wins").text("Wins: " + playerOneData.wins);
        $("#player2-losses").text("Losses " + playerOneData.losses);
    } else {
        $("#player2-name").text("looking for player 2");
        $("#player2-wins").empty();
        $("#player2-losses").empty();
    }

});

//turn
currentTurnRef.on("value", function(snapshot) {
    currentTurn = snapshot.val();
    if (playerNum) {
        if (currentTurn === 1) {
            if (currentTurn === playerNum) {
                $("#current-turn").html("<h2>Your Turn</2>");
                $("#player" + playerNum + " ul").append("<li>Ninja</li><li>Cowboy</li><li>Bear</li>");
            } else {
                $("#current-turn").html('<h2>waiting for ' + playerOneData.name + " to choose.</h2>");
            }
        };
        else if (currentTurn === 2) {

            if (currentTurn === playerNum) {
                $("#current-turn").html("<h2>Your Turn</2>");
                $("#player" + playerNum + " ul").append("<li>Ninja</li><li>Cowboy</li><li>Bear</li>");
            } else {
                $("#current-turn").html('<h2>waiting for ' + playerTwoData.name + " to choose.</h2>");
            } else if (currentTurn === 3) {
                gameLogic(playerOneData.choice, playerTwoData.choice);

                $("#player1-chosen").text(playerOneData.choice);
                $("#player2-chosen").text(playerTwoData.choice);
                $("#result").empty();

                if (playerOneExists && playerTwoExists) {
                    currentTurnRef.set(1);
                }
            }
        };

    }
}
})

//makes a post and get for chat input 

//chat button
$("#chat-send").click(function() {
    if ($("#chat-input").val() !== "") {
        var message = $("#chat-input").val();
        //use fire base to hold which username id and message.
        chatData.push({
            name: username,
            message: message,
            time: firebase.database.serverValue.TIMESTAMP,
            idNum: playerNum
        });
        $("#chat-input").val("");
    }
});

$("#chat-input").keypress(function(e) {

    if (e.keyCode === 13 && $("#chat-input").val() !== "") {

        var message = $("#chat-input").val();

        chatData.push({
            name: username,
            message: message,
            time: firebase.database.ServerValue.TIMESTAMP,
            idNum: playerNum
        });

        $("#chat-input").val("");
    }
});


//setTimeout(moveOn, 2000);

else {


    $("#player1 ul").empty();
    $("#player2 ul").empty();
    $("#current-turn").html("<h2>Waiting for another player to join.</h2>");
    $("#player2").css("border", "1px solid red");
    $("#player1").css("border", "1px solid black");
}
}
});

playersRef.on("child_added", function(snapshot) {

    if (currentPlayers === 1) {

        // set turn to 1, which starts the game
        currentTurnRef.set(1);
    }
});

playerRef = database.ref("/players/" + playerNum);

playerRef.onDisconnect().remove();

currentTurnRef.onDisconnect().remove();

chatDataDisc.onDisconnect().set({
    name: username,
    time: firebase.database.ServerValue.TIMESTAMP,
    message: "has disconnected.",
    idNum: 0
});

function gameLogic(player1pick, player2pick) {

    var playerOneWon = function() {
        $("#result").html("<h2>" + playerOneData.name + "</h2><h2>Wins!</h2>");
        if (playerNum === 1) {
            playersRef.child("1").child("wins").set(playerOneData.wins + 1);
            playersRef.child("2").child("losses").set(playerTwoData.losses + 1);
        }
    };

    var playerTwoWon = function() {
        $("#result").html("<h2>" + playerTwoData.name + "</h2><h2>Wins!</h2>");
        if (playerNum === 2) {
            playersRef.child("2").child("wins").set(playerTwoData.wins + 1);
            playersRef.child("1").child("losses").set(playerOneData.losses + 1);
        }
    };

    var tie = function() {
        $("#result").html("<h2>Tie Game!</h2>");
    };

    if (player1pick === "Ninja" && player2pick === "Ninja") {
        tie();
    } else if (player1pick === "Cowboy" && player2pick === "Cowboy") {
        tie();
    } else if (player1pick === "Bear" && player2pick === "Bear") {
        tie();
    } else if (player1pick === "Ninja" && player2pick === "Cowboy") {
        playerTwoWon();
    } else if (player1pick === "Ninja" && player2pick === "Bear") {
        playerOneWon();
    } else if (player1pick === "Cowboy" && player2pick === "Ninja") {
        playerOneWon();
    } else if (player1pick === "Cowboy" && player2pick === "Bear") {
        playerTwoWon();
    } else if (player1pick === "Bear" && player2pick === "Ninja") {
        playerTwoWon();
    } else if (player1pick === "Bear" && player2pick === "Cowboy") {
        playerOneWon();
    }
}