/**
 * main.js est notre point d'entrée javascript (c'est le seul fichier chargé par index.html)
 * tous les autres fichiers js seront importés en cascade grâce aux "import"
 * 
 * Son rôle : préparer les ressouces, créer le jeu, le lancer. Il n'y aura aucune logique de jeu ici
 */


// --- Imports ---
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./core/constants.js";

// On récupère l'élément HTML du canvas
const canvas = document.getElementById("game");
// On récupère l'élément HTML pour les textes
const status = document.getElementById("status");

// Taille interne du canvas (en px), vient des constantes
// Une seule source de vérité pour 1024x768
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

async function main() {
    console.log("App Démarrée");   
}

main();