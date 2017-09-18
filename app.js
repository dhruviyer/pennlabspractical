const express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser'); 
const app = express();


app.set('port', process.env.PORT || 8081);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//open a connection to the DB
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pennlabsinterview"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//For testing purposes
app.get('/test', function (req, res) {
})

//Search for list by id
app.get('/findlist', function (req, res) {
  var title = req.query.title;
  var sql = "SELECT * FROM lists WHERE title='"+title+"';";
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    res.json(
    {
      "status":200,
      "title":result[0].title,
      "id":result[0].id
    });
  }); 
})

//search for card by id
app.get('/findcard', function (req, res) {
  var title = req.query.title;
  var sql = "SELECT * FROM cards WHERE title='"+title+"';";
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    res.json(
    {
      "status":200,
      "title":result[0].title,
      "id":result[0].id
    });
  }); 
})

//Gets the title, description, and listId of a given card
app.get('/card/', function (req, res) {
  var cardId = req.query.cardId;
  var sql = "SELECT * FROM cards WHERE id="+cardId+";";
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    res.json(
    {
      "status":200,
      "title":result[0].title,
      "description":result[0].description,
      "listid":result[0].listid
    });
  }); 
})


//Gets the title and order of a given list
app.get('/list/', function (req, res) {
  var listId = req.query.listId;
  var sql = "SELECT * FROM lists WHERE id="+listId+";";
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    res.json(
    {
      "status":200,
      "title":result[0].title,
      "order":result[0].listorder,
    });
  }); 
})

//Create a new card
app.post('/card', function (req, res) {
  var listId = req.body.listId; //the ID of the list
  var title = req.body.title; //the title of the list
  var description = req.body.description; //the list description

  //insert the card into the given list
  var sql = "INSERT INTO cards (title, description, listid) VALUES ('"+title+"','"+description+"',"+listId+");"
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    res.json(
    {
      "status":200,
      "title":title,
      "description":description,
      "listid":listId
    });
  }); 
})

//Create a new list
app.post('/list', function (req, res) {
  var title = req.body.title; //the title of the list
  
  //get the number of rows, by default new list will be the last in the stack
  var sql = "SELECT * FROM lists;";
  
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    var order = result.length+1;

    //insert the new list into the table tracking lists
    var sql = "INSERT INTO lists (title, listorder) VALUES ('"+title+"',"+order+")";
    console.log(sql);
    con.query(sql, function (err, result, fields){
      if (err) throw err;
       res.json(
       {
        "status":200,
        "title":title,
        "order":order
      });
    }); 
  });
})

app.post('/editlist', function (req, res) {
  var listId = req.body.listId;
  var title = req.body.title; //the title of the list
  var order = req.body.order; //the new place of the list when changing order of the lists

  //I'll make it so that if you leave one of the fields blank, then you only change the one field

  if(title!=null && !(title==="")) //do they want to change the title?
  {
    var sql = "UPDATE lists SET title = '"+title+"' WHERE id="+listId+";";
    console.log(sql)
    con.query(sql, function (err, result) {
      if (err) throw err;
      if(order!=null && !(order==="")) //do they want to alter the order too?
      {
        //To do this, we are going to first shift everything down one up until the thing we are looking to move, 
        //then take item at (listID+1) and put it where it belongs

        //shift everything else down, up until the thing we want to move
        var sql = "SELECT * FROM lists WHERE id="+listId+";";
        console.log(sql)
        con.query(sql, function (err, result, fields) {
          if (err) throw err
          var oldOrder = result[0].listsorder;
          var sql = "UPDATE lists SET listorder=listorder+1 WHERE listorder >="+order+" AND listorder<"+oldOrder+";";
          console.log(sql);
          con.query(sql, function (err, result, fields){
            if (err) throw err;
            //put the desired item back up
            var sql = "UPDATE lists SET listorder="+order+" WHERE id="+listId+";";
            console.log(sql);
            con.query(sql, function (err, result, fields){
              if (err) throw err;
              return res.json({"status":200});
            });
          });
        });
      }else
      {
         return res.json({"status":200});
      }
    });
  }
  else if(order!=null && !(order==="")) //do they want to alter just the order?
  {
    //To do this, we are going to first shift everything down one up until the thing we are looking to move, 
    //then take item at (listID+1) and put it where it belongs

    //shift everything else down, up until the thing we want to move
    var sql = "SELECT * FROM lists WHERE id="+listId+";";
    console.log(sql)
    con.query(sql, function (err, result, fields) {
      if (err) throw err
      var oldOrder = result[0].listorder;
      var sql = "UPDATE lists SET listorder=listorder+1 WHERE listorder >="+order+" AND listorder<"+oldOrder+";";
      console.log(sql);
      con.query(sql, function (err, result, fields){
        if (err) throw err;
        //put the desired item back up
        var sql = "UPDATE lists SET listorder="+order+" WHERE id="+listId+";";
        console.log(sql);
        con.query(sql, function (err, result, fields){
          if (err) throw err;
          return res.json({"status":200});
        });
      });
    });
  }
  else
  {
    return res.json({"status":200});
  }
})

app.post('/editcard', function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var cardid = req.body.cardId;
  var listId = req.body.listId;

  var editTitle = false;
  var editDescription = false;
  var editListId = false;

  if(title!=null && !(title===""))
  {
    title = " title='"+title+"'";
    editTitle = true;
  }
  if(description!=null && !(description===""))
  {
    description = " description='"+description+"'";
    editDescription = true;
  }
  if(listId!=null && !(listId===""))
  {
    listId = " listId='"+listId+ "'";
    editListId = true;
  }

  var sql="UPDATE cards SET";
  if(editTitle && editDescription && editListId) sql+=title+","+description+","+listId + " WHERE id="+cardid+";";
  else if(editTitle && editDescription) sql+=title+","+description+ " WHERE id="+cardid+";";
  else if(editTitle && editListId) sql+=title+","+listId+ " WHERE id="+cardid+";";
  else if(editDescription && editListId) sql+=description+","+listId+ " WHERE id="+cardid+";";
  else if(editTitle) sql+=title+ " WHERE id="+cardid+";";
  else if(editDescription) sql+=description+ " WHERE id="+cardid+";";
  else if(editListId)sql+=listId+ " WHERE id="+cardid+";";
  else sql="";

  if(sql==="")
    res.json({"status":200});
  else
  {
    console.log(sql);
      con.query(sql, function (err, result, fields){
        if (err) throw err;
         res.json(
         {
          "status":200,
          "title":req.body.title,
          "description":req.body.description,
          "list id":req.body.listId
        });
      }); 
  }


});
//Given a card id, delete it from its list
app.delete('/card/:cardId', function (req, res) { 
  var cardId = req.params.cardId;

  var sql = "DELETE FROM cards WHERE id="+cardId+";"
  console.log(sql);
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    return res.json({"status":200});
  }); 
})

//Delete a list and its contained cards
app.delete('/list/:listId', function (req, res) {
  var listId = req.params.listId;

  //first, get the position of the list, so we can shift everything back later on
  var sql = "SELECT * FROM lists WHERE id="+listId+";"
  console.log(sql)
  con.query(sql, function (err, result, fields){
    if (err) throw err;
    
    //save where the list was
    var order = result[0].listorder;

    //Remove the list
    var sql = "DELETE FROM lists WHERE id="+listId+";"
    console.log(sql);
    con.query(sql, function (err, result, fields){
      if (err) throw err;
       //Delete all associated cards
       var sql = "DELETE FROM cards WHERE listid="+listId+";"
       console.log(sql);
       con.query(sql, function (err, result, fields){
        if (err) throw err;
        //now, shift everything to close the gap
        var sql = "UPDATE lists SET listorder=listorder-1 WHERE listorder>"+order+";"
        console.log(sql);
        con.query(sql, function (err, result, fields){
          if (err) throw err;
          return res.json({"status":200});
        });
      });
    }); 
  }); 
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})