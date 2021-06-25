const fs = require("fs");
const path = require("path");
const usersDbFilePath = "files/userDb.txt"
const hash = require("password-hash");
class UserDb {

    constructor() {
        createDatabaseIfNotExists(usersDbFilePath);
    }
    //check user exists in database
    isUserExistInDatabase(login) {
        return isUserExistsInDatabase(login, getDatabase());
    }
    //finds user with passed credentials, if user not found return false
    findUserWithCredentials(login, password) {
        return findUserInDb(login,password,getDatabase());
    }

    saveUserWithCredentials(login,password) {
 
        var db = getDatabase();
        //getting all users from db
        var users = getUsersListFromDb(db);

        //creating new user
        var newUser = {};
        newUser.login = login;
        newUser.hashedPassword = hash.generate(password);

        //saving new user  
        users.push(newUser);

        // //in case if we didn`t have any data in database and array won`t reference to "database", we should assign it explicitly
        fs.writeFileSync(usersDbFilePath, JSON.stringify(db));
        return true;
        
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
function findUserInDb(login,password,db) {
    var hashedPassword = hash.generate(password);
    var users = getUsersListFromDb(db);
    return users.find((user)=> user.login === login && user.hashedPassword == hashedPassword) || false;
}
function isUserExistsInDatabase(login,db) {
    var users = getUsersListFromDb(db);
    return (!!users.find((user)=> user.login === login ))  || false;
}
module.exports = {
    UserDb: UserDb
};