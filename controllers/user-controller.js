const {User} = require('../models');

const userController = {
    //get all users
    getAllUsers(req, res) {
        User.find({}).then(dbUserData => res.json(dbUserData)).catch(err=>{res.status(400).json(err)});
    },

    //get a single user by _id, populated thought and friend data
    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user with this id...'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    //post a new user
    createUser({body}, res) { //destructure body out of the req object bc dont need anything else
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    //put update a user
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators:true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user with this id...'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete remove a user
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //post a new friend to a user's friends list
    addFriend({params, body}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$push: {friends: params.friendId}},
            {new: true, runValidators:true}
        )
        .then( dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id...'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err =>res.json(err));
    },

    //delete remove a friend from user friend list :(
        removeFriend({ params }, res) {
            User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { friends: params.friendId } }, //$pull removes the specific user from the array where friendId matches params.friendId
              { new: true }
            )
              .then(dbUserData => res.json(dbUserData))
              .catch(err => res.json(err));
          }
};

module.exports = userController;