import mongoose from "mongoose";
const articleSchema = new mongoose.Schema(
    {
        // Titre de l'article
        titre: {
            type: String,              // Type de donnée : chaîne de caractères
            required: [true, 'Le titre est obligatoire'],  // Validation : champ requis
            trim: true,                // Supprime les espaces au début et à la fin
            minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
            maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
        },

        // Contenu de l'article
        contenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            minlength: [10, 'Le contenu doit contenir au moins 10 caractères']
        },

        // Auteur de l'article
        auteur: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        },

        // Statut de publication
        publie: {
            type: Boolean,             // Type : vrai ou faux
            default: false             // Par défaut, l'article n'est pas publié
        },

        // Catégorie de l'article (optionnel)
        categorie: {
            type: String,
            trim: true,
            enum: {                    // Liste de valeurs autorisées
                values: ['Technologie', 'Lifestyle', 'Voyage', 'Cuisine', 'Autre'],
                message: '{VALUE} n\'est pas une catégorie valide'
            },
            default: 'Autre'
        },

        // Nombre de vues (pour les statistiques)
        vues: {
            type: Number,
            default: 0,
            min: [0, 'Le nombre de vues ne peut pas être négatif']
        }
    },
    {
        // Options du schéma

        // timestamps ajoute automatiquement createdAt et updatedAt
        timestamps: true,

        // Permet de contrôler le comportement de toJSON()
        toJSON: {
            virtuals: true,            // Inclut les champs virtuels
            transform: function (doc, ret) {
                delete ret.__v;
                return ret;
            }
        }
    }
);


articleSchema.methods.publier = function () {
    this.publie = true;
    return this.save();
};


articleSchema.methods.depublier = function () {
    this.publie = false;
    return this.save();
};

articleSchema.methods.incrementerVues = function () {
    this.vues += 1;
    return this.save();
};


articleSchema.statics.findPublies = function () {
    return this.find({ publie: true }).sort({ createdAt: -1 });
};

articleSchema.statics.findByCategorie = function (categorie) {
    return this.find({ categorie, publie: true }).sort({ createdAt: -1 });
};


articleSchema.virtual('resume').get(function () {
    if (this.contenu.length <= 150) {
        return this.contenu;
    }
    return this.contenu.substring(0, 150) + '...';
});


articleSchema.virtual('dureeIecture').get(function () {
    const mots = this.contenu.split(' ').length;
    const minutes = Math.ceil(mots / 200);
    return minutes;
});

articleSchema.pre('save', function (next) {
    console.log(`💾 Sauvegarde de l'article : ${this.titre}`);

    next();
});


articleSchema.post('save', function (doc) {
    console.log(`✅ Article sauvegardé : ${doc._id}`);
});


const Article = mongoose.model('Article', articleSchema);

export default Article;
