const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post('/',(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName,lastName,email);

    const data = {
        members:[
            {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME : firstName,
                LNAME : lastName,
            }
        }
    ]
    }
    const jsonData = JSON.stringify(data);
    const url = 'https://us17.api.mailchimp.com/3.0/lists/d2f50328a6';

    const options = {
        method: "POST",
        auth: "fahad:39bff73e40c357e7fc99d243f7e99b11-us17"
    }

    const request= https.request(url,options,function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on('data',function(data){
            console.log(JSON.parse(data));
        })

        

       
    })
    request.write(jsonData);
    request.end();
})

app.post('/failure',(req,res)=>{
    res.redirect('/')
})

app.listen(process.env.PORT || 3000,()=>{//  process.env.Port is for the deployment because they might assign any other port no
    console.log(`Server is listening on port 3000.`)
})


// API KEY = 39bff73e40c357e7fc99d243f7e99b11-us17

// Audience id/List id: d2f50328a6