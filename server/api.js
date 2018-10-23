const express = require('express');
const apiRouter = express.Router();
// merge params uses the below apiRouter.params
// middleware to pivot from one model to the next
const workRouter = express.Router({mergeParams:true});
const database = require('./db.js');
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');

// middleware to define the current working model
// (minions, ideas etc) and attach it to the req
// shoujld run for every request so at the top of the
// list in this file
apiRouter.use((req,res,next) => {
	//debugger
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

// notice the order of this Merge parameter.  
//It is after the above middleware so that runs first
// we mount our workRouter on the id param
apiRouter.use('/minions/:id/work', workRouter);


// now our work router goes here.  Note we just need "/"
// becuase we've mounted the router on the apiRouter at
// /minions/:id/work.  Becuase we set mergeParams on the
// workRouter, we get all of the params that are assigned when the 
// apiRouter is called.
// So for the route /minions/2/work, first the apiRouter is invoked
// that then matches the above apiRouter.use, then the next match is
// the next apiRouter middleware to match is the apiRouter.params below,
// this is where we pivot on each minion has many work
// once that has run our workRouter will be mounted and matched. So
// for a get request we'll match the below route. 
workRouter.get('/', (req,res,next) => {
//debugger
// get all work from the db
const work = database.getAllFromDatabase('work');

workFiltered = work.filter(el => el.minionId === req.modelReturned.id);

res.send(workFiltered);

});

workRouter.post('/', (req,res,next) => {

	//debugger
	const newModel = database.addToDatabase('work',req.body);
	res.status(201).send(newModel);

});

workRouter.delete('/:id', (req,res,next) =>{
	
	database.deleteFromDatabasebyId('work',req.params.id);
	res.status(204).send();
});

workRouter.put('/:id', (req,res,next) => {
debugger

	minionId = database.getFromDatabaseById('minions',req.body.minionId);
	if (minionId){

		const updatedModel = database.updateInstanceInDatabase('work',req.body);
		res.send(updatedModel);

	} else {

		res.status(400).send();

	}
	

	

});



// add a router.param to DRY the code
// parse the id for each of the models
apiRouter.param('id', (req,res,next,id) => {
//debugger
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
//debugger
	res.send(database.getAllFromDatabase(req.modelType));
});

// get an individual minion or idea etc
apiRouter.get(['/minions/:id','/ideas/:id'], (req,res,next) => {
	//debugger
			// send back the minion - note all the hard work here is done in the
			// router.params above.
			res.send(req.modelReturned);
});

// update a minion, idea etc
apiRouter.put(['/minions/:id','/ideas/:id'], (req,res,next) => {
//debugger
	const updatedModel = database.updateInstanceInDatabase(req.modelType,req.body);
	res.send(updatedModel);

});

apiRouter.delete(['/minions/:id','/ideas/:id'], (req,res,next) =>{
	database.deleteFromDatabasebyId(req.modelType,req.modelReturned.id);
	res.status(204).send();
});

apiRouter.post(['/minions'],  (req,res,next) => {
//debugger
	const newModel = database.addToDatabase(req.modelType,req.body);
	res.status(201).send(newModel);

});

apiRouter.post(['/ideas'], checkMillionDollarIdea, (req,res,next) => {
//debugger
	const newModel = database.addToDatabase(req.modelType,req.body);
	res.status(201).send(newModel);

});


apiRouter.delete('/meetings', (req,res,next) => {

database.deleteAllFromDatabase(req.modelType);
res.status(204).send();

});

apiRouter.post('/meetings', (req,res,next) => {

	const meeting = database.createMeeting();
	const newModel = database.addToDatabase('meetings',meeting);
	res.status(201).send(meeting);

});



module.exports = apiRouter;








