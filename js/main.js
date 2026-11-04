/**
 * main.js est notre point d'entrée javascript (c'est le seul fichier chargé par index.html)
 * tous les autres fichiers js seront importés en cascade grâce aux "import"
 * 
 * Son rôle : préparer les ressouces, créer le jeu, le lancer. Il n'y aura aucune logique de jeu ici
 */


// --- Imports ---
import { AssetLoader } from "./core/AssetLoader.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./core/constants.js";
import { Game } from "./core/Game.js";
import { buildImagePath, SOUND_PATHS } from "./data/assets.js";
import { LEVELS } from "./data/levels.js";
import { DEFAULT_SHIP } from "./data/ships.js";
import { SoundManager } from "./managers/SoundManager.js";

// On récupère l'élément HTML du canvas
const canvas = document.getElementById("game");
// On récupère l'élément HTML pour les textes
const status = document.getElementById("status");

// Taille interne du canvas (en px), vient des constantes
// Une seule source de vérité pour 1024x768
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

async function main() {
    // try / catch: si une étape échoue (image introuvable) on tombe dans le catch au lieu de laisser le jeu planter brutalement
    try {
        const assetLoader = new AssetLoader();
        const soundManager = new SoundManager();

        status.textContent = "Chargement des ressources.."
        soundManager.load(SOUND_PATHS); // Les sont chargés en arrière-plan
        await assetLoader.loadAll(buildImagePath()); // On ATTEND les images: indispensable pour jouer

        const game = new Game(canvas, assetLoader, soundManager);

        // TODO: chargement du level
        game.startLevel(LEVELS[0], DEFAULT_SHIP);
        // Démarrage de la boucle de jeu
        game.start();

        status.textContent = "";

    } catch (e) {
        status.textContent = `Erreur au chargement du jeu : ${e.message}`;
        console.log(e);
    }
}

main();