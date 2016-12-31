var SteamUser = require("steam-user");
var Prompt = require("prompt");
var client = new SteamUser();

/* This bit is the exploit.  It sets your persona state flags to an
   undocumented value that evidently was used during the 2014 holiday
   event */
SteamUser.prototype.setPersona = function(state, name) {
    this._send(SteamUser.EMsg.ClientChangeStatus, {
        "persona_state": state,
        "persona_state_flags": 4,
        "player_name": name
    });
};

/* Properties for prompt */
var properties = [
    {
        name: "username",
    },
    {
        name: "password",
        hidden: true
    }
];

/* Prompt for credentials */
Prompt.start();
Prompt.get(properties, function(err, result) {

    /* Handle (or don't) errors */
    if (err) {
        return onErr(err);
    }

    /* Log on with credentials given */
    client.logOn({
        "accountName": result.username,
        "password": result.password
    });
});

/* Handle post-login */
client.on("loggedOn", () => {
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    console.log("Logged in successfully, name should be golden...");
});
