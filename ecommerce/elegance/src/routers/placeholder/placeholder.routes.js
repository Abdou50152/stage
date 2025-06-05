const express = require('express');
const router = express.Router();

/**
 * @route GET /api/placeholder/:width/:height
 * @description Génère une image placeholder avec texte optionnel
 * @access Public
 */
router.get('/:width/:height', (req, res) => {
  try {
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);
    const text = req.query.text || 'Placeholder';
    
    // Créer une image placeholder SVG simple qui fonctionnera sans dépendances externes
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#f1f1f1" stroke="#e0e0e0" stroke-width="2"/>
        <text x="50%" y="50%" font-family="Arial" font-size="${Math.floor(Math.min(width, height) / 10)}" 
              fill="#757575" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          ${decodeURIComponent(text)}
        </text>
      </svg>
    `.trim();

    // Définir le type MIME pour SVG et envoyer
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    console.error('Erreur lors de la génération de l\'image placeholder:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
