const express = require('express');
const apiRouter = express.Router();
const database = require('./db.js');


// middleware to define the current working model
// (minions, ideas etc) and attach it to the req
apiRouter.use((req,res,next) => {
	// pull the url from the req
	const url = req.url;
	// get the part of the url that says minions, ideas etc..
	const modelType = url.split('/')[1];
	// use this array to validate model types
	const validModels = ['minions','ideas','meetings'];
	// validate the model type
	if(validModels.find(element => element === modelType) !== -1) {
		// attach the model type to the req for future use
		req.modelType = modelType
		// pass on control to the next middleware
		next()
	} else {
		// something went wrong
		res.status(404).send('Model not found!');

	}

});

// add a router.param to DRY the code
// parse the id for each of the models
apiRouter.param('id', (req,res,next,id) => {
debugger

	// get the model Type by Id from the database
	const modelReturned = database.getFromDatabaseById(req.modelType, id);
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

// handle get requests.  Note we don't specify the
// /api base becuase this is a router mounted at
// /api. get all minions, ideas etc ...
apiRouter.get(['/minions','/ideas','/meetings'], (req,res,next) => {
debugger
	res.send(database.getAllFromDatabase(req.modelType));
});

// get an individual minion or idea etc
apiRouter.get(['/minions/:id','/ideas/:id'], (req,res,next) => {
			// send back the minion - note all the hard work here is done in the
			// router.params above.
			res.send(req.modelReturned);
});

// update a minion, idea etc
apiRouter.put(['/minions/:id','/ideas/:id'], (req,res,next) => {
debugger
	const updatedModel = database.updateInstanceInDatabase(req.modelType,req.body);
	res.send(updatedModel);

});




module.exports = apiRouter;








