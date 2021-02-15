const Sauces = require('../models/Sauce');
const fs = require('fs');

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then((sauce) => {
            res.status(200).json(sauce);
        }
        ).catch((error) => {
            res.status(404).json({ error: error });
        }
    );
}

exports.createSauce = (req,res,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
    .then((sauces) => {
            res.status(200).json(sauces);
        }
    )
    .catch((error) => {
            res.status(400).json({ error });s
        }
    );
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(201).json({ message: 'Sauce mise à jour avec succès!' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    console.log(req.body);
    switch (req.body.like) {
        case 0:
            Sauces.findOne({ _id: req.params.id })
                .then(sauce => {
                    if(sauce.usersLiked.find( user => user === req.body.userId )) {
                        Sauces.updateOne({ _id: req.params.id},  {  
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id,
                        })
                            .then(() => res.status(201).json({ message: "Tu as changé d'avis sur cette sauce !" }))
                            .catch(error => res.status(400).json({ error }));
                    } if(sauce.usersDisliked.find( user => user === req.body.userId )) {
                        Sauces.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1},
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Tu as changé d'avis sur cette sauce !" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;
        case 1:
            Sauces.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
                _id: req.params.id 
            })
                .then(() => res.status(200).json({ message: 'Vous aimé cette sauce !'}))
                .catch(error => res.status(400).json({ error }));
            break;
        case -1:
            Sauces.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1},
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id,
            })
                .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce !" }))
                .catch(error => res.status(400).json({ error }));
            break;
            default:
                console.log('Requête mal effectuée !',req.params)
                res.status(400).json();
    }
}    


