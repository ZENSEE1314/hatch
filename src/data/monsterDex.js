// ══ HATCHME MONSTER DEX — 150 monsters ══
// 5 elements × 3 sets × 10 each = 150

const NAMES = {
  Fire: {
    Animal: ['Flamox','Emberclaw','Scorchfang','Blazemaw','Cinderpelt','Ashsnout','Ignihide','Pyrodon','Burnlair','Flarcoil'],
    Plant:  ['Flambloom','Emberweed','Scorchvine','Blazeflora','Cinderthorn','Ashsprig','Ignibud','Pyropod','Burnfrond','Flarsap'],
    Insect: ['Flamwing','Embersting','Scorchgrub','Blazelarva','Cinderchitin','Ashmolt','Ignidrone','Pyroswarm','Burnhive','Flarvenom'],
  },
  Water: {
    Animal: ['Aquaox','Tidalclaw','Wavefang','Drizzlemaw','Frostpelt','Splashsnout','Coralhide','Dewden','Marinlair','Glacicoil'],
    Plant:  ['Aquabloom','Tidalweed','Wavevine','Drizzleflora','Frostthorn','Splashsprig','Coralbud','Dewpod','Marinfrond','Glacisap'],
    Insect: ['Aquawing','Tidalsting','Wavegrub','Drizzlelarva','Frostchitin','Splashmolt','Coraldrone','Dewswarm','Marinhive','Glacivenom'],
  },
  Earth: {
    Animal: ['Thornox','Mossclaw','Rootfang','Bramblemaw','Petalpelt','Folisnout','Leafhide','Bloomden','Fernlair','Sproutcoil'],
    Plant:  ['Thornbloom','Mossweed','Rootvine','Brambleflora','Petalthorn','Folisprig','Leafbud','Bloompod','Fernfrond','Sproutsap'],
    Insect: ['Thornwing','Mosssting','Rootgrub','Bramblelarva','Petalchitin','Folimolt','Leafdrone','Bloomswarm','Fernhive','Sproutvenom'],
  },
  Wind: {
    Animal: ['Zephox','Galeclaw','Breezefang','Cyclomaw','Driftpelt','Gustsnout','Whirlhide','Stormden','Skylair','Aerocoil'],
    Plant:  ['Zephbloom','Galeweed','Breezevine','Cycloflora','Driftthorn','Gustsprig','Whirlbud','Stormpod','Skyfrond','Aerosap'],
    Insect: ['Zephwing','Galesting','Breezegrub','Cyclolarva','Driftchitin','Gustmolt','Whirldrone','Stormswarm','Skyhive','Aerovenom'],
  },
  Shadow: {
    Animal: ['Duskox','Umbraclaw','Voidfang','Gloommaw','Darkpelt','Shadowsnout','Eclipshide','Noctuden','Phantlair','Abysscoil'],
    Plant:  ['Duskbloom','Umbraweed','Voidvine','Gloomflora','Darkthorn','Shadowsprig','Eclipsbud','Noctupod','Phantfrond','Abysssap'],
    Insect: ['Duskwing','Umbrasing','Voidgrub','Gloomlarva','Darkchitin','Shadowmolt','Eclipsdrone','Noctuswarm','Phanthive','Abyssvenom'],
  },
}

const ELEMENT_EMOJI = { Fire:'🔥', Water:'💧', Earth:'🌿', Wind:'💨', Shadow:'🌑' }

function tierForIndex(i) {
  // per group of 10: 5 Bronze, 3 Silver, 1 Gold, 1 Diamond/Mystic
  if (i < 5) return 'Bronze'
  if (i < 8) return 'Silver'
  if (i < 9) return 'Gold'
  return 'Diamond'
}

let _id = 1
const MONSTER_DEX = []

for (const element of ['Fire','Water','Earth','Wind','Shadow']) {
  for (const set of ['Animal','Plant','Insect']) {
    NAMES[element][set].forEach((name, i) => {
      // Make every 50th monster Mystic
      let tier = tierForIndex(i)
      if (_id === 50 || _id === 100 || _id === 150) tier = 'Mystic'

      MONSTER_DEX.push({
        id:      _id,
        dex:     '#' + String(_id).padStart(3, '0'),
        name,
        set,
        element,
        tier,
        emoji:   ELEMENT_EMOJI[element],
        baseHp:  80 + (_id % 20),   // 80–99
      })
      _id++
    })
  }
}

export default MONSTER_DEX

// Helper: pick a random monster from dex (for hatching)
export function rollMonster(eggTier) {
  const tierPool = {
    Bronze:  ['Bronze','Bronze','Bronze','Silver'],
    Silver:  ['Bronze','Silver','Silver','Gold'],
    Gold:    ['Silver','Gold','Gold','Diamond'],
    Diamond: ['Gold','Diamond','Diamond','Mystic'],
    Mystic:  ['Diamond','Mystic'],
  }
  const tiers = tierPool[eggTier] || ['Bronze']
  const tier  = tiers[Math.floor(Math.random() * tiers.length)]
  const pool  = MONSTER_DEX.filter(m => m.tier === tier)
  return pool[Math.floor(Math.random() * pool.length)]
}
