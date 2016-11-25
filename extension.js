// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Trello = require('node-trello');
var yaml = require('js-yaml');
var fs = require('fs');
var slug = require('slug');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-trello" is now active!');
    var config;

    var path = vscode.workspace.rootPath + '/.trello';
    vscode.workspace.openTextDocument(path).then((doc) => {

        config = yaml.load(doc.getText());  
        var t = new Trello("8f3fe5394daa99284f74ea2c08999667", config['token']);
        t.get("/1/members/me", function (err, data) {
            if (err) throw err;
            console.log(data);
        });

        var listId = config['list'];
        t.get("/1/lists/cards" + listId, { cards: "open", card_fields: ["name","desc"] }, function(err, data){
       
            data['cards'].forEach(function(card) {
                var fileName = slug(card.name);
                var path = vscode.workspace.rootPath + '\\cards\\' + fileName + '.md';
                fs.writeFile(path, card.desc, (err) => {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });
            }, this);
        });
    }, (reason) => {
        console.log(reason);
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;