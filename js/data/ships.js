/**
 * On définit nos vaisseaux jouables
 * 
 * Dans la version du cours, seul DEFAULT_SHIP est utilisé (car pas de menu)
 * Dans la version finale, un menu sélection sera disponible pour choisir entre plusieurs vaisseaux
 */
export const SHIPS = [
    { id: "jet1", name: "Aurora", tagline: "Equilibré, idéal pour débuter", stats: { speed: 3, power: 3, armor: 4 } },
    { id: "jet2", name: "Nebula", tagline: "Agile et esquive habile", stats: { speed: 5, power: 2, armor: 3 } },
    { id: "jet3", name: "Comète", tagline: "Tir soutenu, peu de blindage", stats: { speed: 4, power: 4, armor: 2 } },
    { id: "jet4", name: "Eclipse", tagline: "Blindage renforcé", stats: { speed: 2, power: 3, armor: 5 } },
    { id: "jet5", name: "Pulsar", tagline: "Cadence de tir maximale", stats: { speed: 3, power: 5, armor: 2 } },
    { id: "jet6", name: "Quasar", tagline: "Rapide et polyvalent", stats: { speed: 4, power: 3, armor: 3 } },
]

export const DEFAULT_SHIP = SHIPS[0];

/**
 * Convertir les stats (1-5) en attribut gameplay
 * -speed : vitesse de déplacement en px/s
 * -shootCooldown : délai minimal entre 2 tirs en seconde
 * -lives : nombre de vie au départ
 * -bulletDamage : dégâts d'un tir (utile pour les boss)
 */
export function computeShipAttributes(stats) {
    const {speed, power, armor} = stats;
    return {
        speed: 180 + speed * 40,
        shootCooldown: Math.round( (0.45 - power * 0.05) * 100 ) / 100,
        lives: Math.max(2, armor),
        bulletDamage: 1
    }
}