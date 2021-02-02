const Sauces = require('../models/Sauce');

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
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
    Sauces.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
        .then(() => res.status(201).json({ message: 'Sauce mise à jour avec succès!' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce deleted!' }))
    .catch(error => res.status(400).json({ error: error }));
}



