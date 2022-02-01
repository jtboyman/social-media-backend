const {Thought, User} = require('../models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({}).then(dbThoughtData => res.json(dbThoughtData)).catch(err=>{res.status(400).json(err)});
    },
    //get single thought by _id
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.thoughtId})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought with this id...'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },
    //post create a new thought (and push to user thoughts array)
    addThought({params, body}, res) {
        console.log(body);
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$push: {thoughts: _id}}, 
                {new: true},
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
      },

    //put update a thought by _id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, body, {new: true, runValidators:true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought with this id...'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete remove a thought by _id
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {thoughts: params.thoughtId}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user with this id...'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //post create a reaction to a thought
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true, runValidators:true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
  
    },

    //delete remove a reaction from a thought
    deleteReaction({ params }, res) {
        console.log(params)
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: {_id: params.reactionId } } }, //confusing
          { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      }
}
module.exports = thoughtController;