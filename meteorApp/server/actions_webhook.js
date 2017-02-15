app = Express();

app.get('/api/hello', function(req,res){
  res.status(200).send("hi");
})
