
const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
	const user = req.currentUser;

	res.send(user.entries.slice(-7));
});

// create new entry 
router.post('/', function(req, res) {

	const user = req.currentUser;
	if (user.isRecording) {
		res.status(400).send('Already recording');
		return
	}

	const { startTime } = req.body; // 1646386140569

	const lastEntry = user.entries.slice(-1)[0];

	const entry = {
		startTime,
		elapsedTime: 0,
		hasFinished: false,
	};
	entry.id = lastEntry ? lastEntry.id+1 : 0;

	user.entries.push(entry);
	user.isRecording = true;

	user.save( err => {
		if (err) {
			res.status(500).send("Could not create an entry");
			return
		}
		res.sendStatus(201);
	});
});

// finish the last entry
router.put('/', function(req, res) {

	const user = req.currentUser;
	if (!user.isRecording) {
		res.status(400).send('Currently is not recording');
		return
	}

	const { elapsedTime }  = req.body;

	const lastEntry = user.entries.slice(-1)[0];

	lastEntry.elapsedTime = elapsedTime;
	lastEntry.hasFinished = true;

	user.entries.splice(-1, 1, lastEntry);

	user.isRecording = false;

	user.save( err => {
		if (err) {
			res.status(500).send("Could not create an entry");
			return
		}
		res.sendStatus(202);
	});
});

module.exports = router;
