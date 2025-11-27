/**
 * Classe personnalisée pour les erreurs applicatives
 * 
 * Cette classe étend la classe Error native de JavaScript
 * pour ajouter des propriétés spécifiques à notre API
 * 
 * Avantages :
 * - Messages d'erreur cohérents
 * - Status codes HTTP appropriés
 * - Distinction entre erreurs opérationnelles et de programmation
 * - Stack trace pour le debugging
 */
class AppError extends Error {
    /**
     * Constructeur
     * @param {string} message - Message d'erreur pour l'utilisateur
     * @param {number} statusCode - Code HTTP (400, 404, 500, etc.)
     */
    constructor(message, statusCode) {
        // Appeler le constructeur parent (Error)
        super(message);

        // Propriétés personnalisées
        this.statusCode = statusCode;
        
        // Déterminer le status basé sur le code
        // Codes 4xx = fail (erreur client)
        // Codes 5xx = error (erreur serveur)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Marquer comme erreur opérationnelle
        // (différent des erreurs de programmation)
        this.isOperational = true;

        // Capturer la stack trace
        // Exclut le constructeur de la stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
