const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier les champs
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email déjà utilisé'
            });
        }

        // Crypter le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        res.status(201).json({
            message: 'Inscription réussie',
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

const jwt = require('jsonwebtoken');

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

// GET USER
exports.getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable'
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};