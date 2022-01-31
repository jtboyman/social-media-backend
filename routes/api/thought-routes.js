const router = require('express').Router();
const {getAllThoughts, getThoughtById, addThought, updateThought, deleteThought, addReaction, deleteReaction} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/').get(getAllThoughts)

// /api/thoughts/userId
router.route('/:userId').post(addThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought);

// /api/thoughts/:userId/:thoughtId
router.route('/:userId/:thoughtId').delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').put(addReaction);

// /api/thoughts/:thoughtId/reactions/reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;