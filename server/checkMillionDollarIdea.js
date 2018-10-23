const checkMillionDollarIdea = (req,res,next) => {
//debugger

		const weeklyRevenue = req.body.weeklyRevenue;
		const numWeeks = req.body.numWeeks;
		const total = weeklyRevenue*numWeeks;



		if (total < 1000000 || !weeklyRevenue  || !numWeeks || typeof weeklyRevenue !== 'number' || typeof numWeeks !== 'number') {

			return res.status(400).send();

		} else {

			next()

		}
	



	

};


// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
