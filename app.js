const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const http = require('https');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/{lists_id}";
  const options = {
    method: "POST",
    auth: "tushar:{API_KEY}"
  }


  const request = http.request(url, options, function(response) {
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else {
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data", function(data) {
            console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server up and running at port 3000.");
})



//API kEY
// cfe067fd614cfb9cad2cf64573ac2b4d-us6
//
// Audience
// c25e0c6330
