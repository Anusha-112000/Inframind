var express = require('express');
var opn = require('opn');
const bodyParser = require('body-parser');

var AWS = require("aws-sdk");
app = express(),
    port = process.env.PORT || 3000;

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIA2PNU57XCKEC5Y7EF',
    secretAccessKey: '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'
});

var cloudformation = new AWS.CloudFormation();

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    res.sendFile(__dirname + 'registration.html')
});

app.post('/done', (req, res) => {
    let data = require('poi.json');

    data.Parameters.KeyName.Default = req.body.Keypair
    data.Parameters.InstanceType.Default = req.body.InstanceType
    data.Parameters.DBName.Default = req.body.DBName
    data.Parameters.DBUser.Default = req.body.DBuser
    data.Parameters.DBPassword.Default = req.body.DBpassword
    data.Parameters.DBRootPassword.Default = req.body.DBrootpassword


    var params = {
        StackName: req.body.stackname,
        DisableRollback: false,
        TemplateBody: JSON.stringify(data)
    };
    cloudformation.createStack(params, function(err, data) {
        if (err) console.log(err);

        cloudformation.waitFor('stackCreateComplete', { StackName: req.body.stackname }, function(err, data) {
            if (err) console.log(err);
            // else {
            //     res.sendFile(__dirname + '/index1.html')
            // }
        })

    });
});

app.listen(port);