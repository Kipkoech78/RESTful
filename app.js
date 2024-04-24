const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express(); 

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to the database
mongoose.connect("mongodb://localhost:27017/wikiDB ");

//creating new schema
const articleSchema = {
    title: String,
    content: String
}
//creating new model
const Article = mongoose.model("Article", articleSchema);
///////////// request targeting all articles/////////////////////
app.route("/articles")
.get( async function(req, res) {
  try {
    const foundArticles = await Article.find();
    console.log(foundArticles);
    res.send(foundArticles); // Send the found articles as a response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while fetching articles.');
  }
})
.post(function(req,res){

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save().then(function(){
        res.send("successfully added a new article");

    }).catch(function(err){
        res.send(err);
    });

})
.delete( function(req,res){


    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save().then(function(){
        res.send("successfully added a new article");

    }).catch(function(err){
        res.send(err);
    });

    Article.deleteMany().then(function(){
        res.send("successfully deleted all articles");
    
    }).catch(function(err){
        res.send(err);
    });
      
});
//////////////////////////request targeting a specific article/////////////////////
app.route("/articles/:articleTitle")
//// getting specific document item
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);

        }else{
            res.send("No articles matching that title was found.");
        }
    });
})
.put(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      {overwrite:true}
    ).then(function(){
        res.send("successfully updated article");
    }).catch(function(err){
        res.send(err)
    });
})
.patch(function(req, res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
    ).then(function(){
        res.send("successfully updated article");
    }).catch(function(err){
        res.send(err);
    });
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle}).then(function(){
        res.send("successfully deleted article");
    }).catch(function(err){
        res.send(err);
    });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});