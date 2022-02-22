
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs")

const app = express();

const globalUnit = "";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){

  var city = req.body.city;
  var unit = req.body.unit;

  var baseURL_1 = "http://api.openweathermap.org/data/2.5/weather?q="
  var baseURL_2 = "&units="
  var baseURL_3 = "&appid=9d20255677ea1b799d8ea618e2d13279"
  var finalURL = baseURL_1 + city + baseURL_2 + unit + baseURL_3;

  const globalUnit = unit;

  request(finalURL, function(error,response,body){
    var data = JSON.parse(body);
    if(error){
      res.render("error");
    }else{
      if(response.statusCode!=200){
        res.render("error");
      }else{
        var temp = data.main.temp;
        var icon = data.weather[0].icon.slice(0,2);
        var atm = data.weather[0].description;
        var tempMin = data.main.temp_min;
        var tempMax = data.main.temp_max;
        var pressure = data.main.pressure;
        var humidity = data.main.humidity;
        if(globalUnit === "metric"){
          var units = "°C";
        }else{
          var units = "°F";
        }
        res.render("result", {
          city: city,
          temp: temp,
          unit: units,
          icon: icon,
          atm: atm,
          tempMin: tempMin,
          tempMax: tempMax,
          pressure: pressure,
          humidity: humidity});
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
