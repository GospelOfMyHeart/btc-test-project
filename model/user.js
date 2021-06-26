const fs = require("fs");
const path = require("path");
const usersDbFilePath = "files/userDb.txt"
const hash = require("bcrypt");

const authCodeLength = 10;
const saltRoundsNumber = 1;
class User {

    constructor() {
        createDatabaseIfNotExists(usersDbFilePath);
    }
    //check user exists in database
    isUserExistInDatabase(email) {
        return isUserExistsInDatabase(email, getDatabase());
    }
    //finds user with passed credentials, if user not found return false
    findUserWithCredentials(email, password) {
        return findUserInDb(email,password,getDatabase());
    }

    //saving user to "database"
    saveUserWithCredentials(email,password) {
 
        var db = getDatabase();
        //getting all users from db
        var users = getUsersListFromDb(db);

        //creating new user
        var newUser = {};
        newUser.email = email;
        newUser.hashedPassword = hash.hashSync(password, saltRoundsNumber);

        //saving new user  
        users.push(newUser);

        // //in case if we didn`t have any data in database and array won`t reference to "database", we should assign it explicitly
        fs.writeFileSync(usersDbFilePath, JSON.stringify(db));
        return true;
        
    }

    //authenticate user with database and return token
    authUser(user) {
        var userAuthCode = generateAuthCode();
        setUserAuthCode(userAuthCode, user, getDatabase())
        return userAuthCode;
    }

    checkUserAuth(userId, authCode) {
        var db = getDatabase();

        var user = db.users.find((user)=> {
            return user.email === userId && user.auth == authCode;
        });
        return !!user;
    }
}

function createDatabaseIfNotExists(filePath) {
    //checking if file ever existed. If function just created directories for file,
    //'false' will be returned, which means that we should create file itself

    ensureDirectoryExistence(filePath);
    //creating database
    if(!fs.existsSync(filePath)) {
        createDatabase(filePath);
    } else {
        //ensure that database is correct
        try {
            var dbJson = fs.readFileSync(filePath);
            var db = JSON.parse(dbJson);
        } catch(exception) {
            //if json failed to parse, that means the data is corrupted and we should create new db
            createDatabase(filePath);
        }
    }   
}

function createDatabase(filePath) {
    fs.writeFileSync(filePath,JSON.stringify(getDatabaseSchema()));
}

function getDatabaseSchema() {
    return {
        users:[]
    };
}

//Creates directory for file is not exist
function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function getDatabase() {
    
       //json with users list
       var db;
       //retrieving our "database"  
       var dbJson = fs.readFileSync(usersDbFilePath);

        db = JSON.parse(dbJson);
       return db;
}

function getUsersListFromDb(db) {
    return db.users
}

//try to find user in db and return it or returns false
function findUserInDb(email,password,db) {
    //  var hashedPassword = hash.hashSync(password,saltRoundsNumber);
    var users = getUsersListFromDb(db);
    
    //console.log("hashedPassword: "+hashedPassword);
    return users.find((user)=>  {
        return (user.email === email && hash.compareSync(password,user.hashedPassword)) || false;
    });
}

function isUserExistsInDatabase(email,db) {
    var users = getUsersListFromDb(db);
    return (!!users.find((user)=> user.email === email ))  || false;
}

//generating random auth code for user
function generateAuthCode() {
    //set of characters to create random code
    var dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789"
    code = "";
    //generating random characters sequence from dictionary depenting on authCodeLength
    for (let index = 0; index < authCodeLength; index++) {
        var randomIndex = Math.round(Math.random()*dictionary.length);
        code+=dictionary[randomIndex];
    }
    return code;
}
//save user auth code to "database"
function setUserAuthCode(authCode,userData, db) {
    var user = findUserInDb(userData.email, userData.password, db);
    user.auth = authCode;
    saveDbState(db);
}
function saveDbState(db) {
    fs.writeFileSync(usersDbFilePath, JSON.stringify(db));
}
module.exports = {
    User: User
};