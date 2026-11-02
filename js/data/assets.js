// On recense tous les assets

import { SHIPS } from "./ships.js";

const ALIEN_COUNT = 13;
const BOSS_COUNT = 8;

export function buildImagePath() {
    const paths = {
        background: "./assets/images/fond.png",
        bulletPlayer: "./assets/images/effects/bullet-player.png",
        bulletEnemy: "./assets/images/effects/bullet-enemy.png",
        explosion: "./assets/images/effects/explosion.png",
        powerupRapid: "./assets/images/effects/powerup-rapid.png",
        powerupShield: "./assets/images/effects/powerup-shield.png",
    };

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