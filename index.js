const fs = require("fs");
const request = require('request');
const stream = fs.createReadStream("vnps.csv");
const csv = require("fast-csv");
const Twitter = require("twitter");
var client = new Twitter({
    consumer_key: 'yeYRu5thXCY45aP48wG7VXACz',
    consumer_secret: 'woZpDUJRqH4BN5X6HZAeMIkCoUIWo52aoFS7ZKYujk2tAuukPP',
    access_token_key: '960623759588777984-1PmRY5c9Q6sws0ofIki3XLCvKUGkfsV',
    access_token_secret: '2Ocpj2tJL8jirQ3O5hjthsA12A75yCOPBcSYjgB0X7H4E'
});

const userNames = [];
const followers = [];
const promises = [];
const csvStream = csv()
    .on("data", function (data) {
        userNames.push(data[1]);
    })
    .on("end", function () {
        new Promise(resolve=> {resolve()}).then( () => {
            for(let i = 1; i< userNames; i++){
                promises.push(getUser(userNames[i]));
             }
        }).then(() => {
            Promise.all(promises).then(function() {
                const myList = arguments[0];
                myList.sort(function(a, b){
                    if(a.followers< b.followers) return 1;
                    else if(a.followers> b.followers) return -1;
                    else return 0;
                })
                console.log(myList);
            }).catch(err => console.log(err))
        })
        
    });

function getUser(user){
    return new Promise(function(resolve, reject){
        client.get('users/show', { screen_name: user }, function (error, tweets, response) {
            if(error) reject(error);
            resolve({followers: tweets.followers_count, name:user});
        })
    });
}  

stream.pipe(csvStream);



