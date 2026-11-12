// On recense ici tous les assets

import { SHIPS } from "./ships.js";

// Recense le nombre d'aliens et de boss dans les assets, nombre sujet à changement si des assets sont ajoutés ou retirés
const ALIEN_COUNT = 13;
const BOSS_COUNT = 8;

// Fonction qui détermine le chemin d'accès des assets du jeu
export function buildImagePath() {
    const paths = {
        background: "./assets/images/fond.png",
        bulletPlayer: "./assets/images/effects/bullet-player.png",
        bulletEnemy: "./assets/images/effects/bullet-enemy.png",
        explosion: "./assets/images/effects/explosion.png",
        powerupRapid: "./assets/images/effects/powerup-rapid.png",
        powerupShield: "./assets/images/effects/powerup-shield.png",
    };

    // Parcourt le tableau des vaisseaux et fait varier le chemin d'accès en fonction de l'ID du vaisseau
    for(const ship of SHIPS) {
        paths[ship.id] = `./assets/images/jet/${ship.id}.png`
    };
    
    for(let index = 1; index <= ALIEN_COUNT; index++) {
        paths[`alien${index}`] = `./assets/images/aliens/alien${index}.png`
    };

    for(let index = 1; index <= BOSS_COUNT; index++) {
        paths[`boss${index}`] = `./assets/images/aliens/boss${index}.png`
    };

    return paths;
}

export const SOUND_PATHS = {
    playerShot: './assets/sounds/player-shot.wav',
    enemyShot: './assets/sounds/enemy-shot.wav',
    explosionSmall: './assets/sounds/explosion-small.wav',
    explosionBig: './assets/sounds/explosion-big.wav',
    hit: './assets/sounds/hit.wav',
    gameOver: './assets/sounds/game-over.wav',
    victory: './assets/sounds/victory.wav',
    
    // Pour les exercices :
    menuSelect: './assets/sounds/menu-select.wav',
    bossArrive: './assets/sounds/boss-arrive.wav',
    bossDeath: './assets/sounds/boss-death.wav',
    powerup: './assets/sounds/powerup.wav',
    shield: './assets/sounds/shield.wav',
};