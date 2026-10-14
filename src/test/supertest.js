
const  request  =  require ( 'supertest' ) ;

app.get('/pokedex', function (req, res) {

})

describe("POST/pokedex", function() {
    it("return pokedex", function(done) {
    return request(app). get ( '/pokedex' )
            . expect ( 'Content-Type' ,  / j s o n / )
            . expect ( 200 )
    })
})