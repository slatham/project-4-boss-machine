const express = require('express');
const apiRouter = express.Router();
const database = require('./db.js');



// add a router.param to DRY the code
// parse the id for each of the models
apiRouter.param('id', (req,res,next,id) => {
debugger
	// parse the request to see what model to use
	url = req.route.path;
	// set to minions or ideas ect
	modelType = url.split('/')[1];
	// get the model Type by Id from the database
	const modelReturned = database.getFromDatabaseById(modelType, id);
	// Check if the model was returned ok
	if (modelReturned) {
		// set the modelReturned on the request 
		req.modelReturned = modelReturned;
		// move on
		next()
	} else {
		res.status(404).send('Not found!')
		// TODO: add error handling to next
	}
});

apiRouter.get('/minions', (req,res,next) => {

	res.send(database.getAllFromDatabase('minions'));

});

apiRouter.get('/minions/:id', (req,res,next) => {
//debugger
			// send back the minion - note all the hard work here is done in the
			// router.params above.
			res.send(req.modelReturned);


});





module.exports = apiRouter;








