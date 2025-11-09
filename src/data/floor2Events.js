// Floor 2 Event Rooms - The Abyssal Depths
// More dangerous and rewarding events for experienced adventurers

export const FLOOR_2_EVENT_TYPES = {
  CURSED_ALTAR: 'cursed_altar',
  DEMON_CONTRACT: 'demon_contract',
  ANCIENT_LIBRARY: 'ancient_library',
  TORTURE_CHAMBER: 'torture_chamber',
  SUMMONING_CIRCLE: 'summoning_circle',
  DARK_FOUNTAIN: 'dark_fountain',
  NECROMANCER_LAB: 'necromancer_lab',
  VOID_PORTAL: 'void_portal',
};

// Get random Floor 2 event
export const getRandomFloor2Event = () => {
  const events = Object.values(FLOOR_2_EVENT_TYPES);
  return events[Math.floor(Math.random() * events.length)];
};

// Create Floor 2 event room
export const createFloor2EventRoom = (x, y, from, eventType = null) => {
  const type = eventType || getRandomFloor2Event();

  switch (type) {
    case FLOOR_2_EVENT_TYPES.CURSED_ALTAR:
      return {
        x,
        y,
        type: 'event',
        name: 'Cursed Altar',
        description: 'A dark altar radiates malevolent power. Blood stains tell of dark rituals.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'altar_sacrifice', name: 'Offer Blood', description: 'Lose 5 HP for a powerful blessing', completed: false },
          { id: 'altar_desecrate', name: 'Desecrate Altar', description: 'Destroy it (STR 5+)', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.DEMON_CONTRACT:
      return {
        x,
        y,
        type: 'event',
        name: 'Demon\'s Bargain',
        description: 'A bound demon offers you a dark contract written in glowing runes.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'contract_accept', name: 'Sign Contract', description: 'Lose 10 max HP for legendary weapon', completed: false },
          { id: 'contract_banish', name: 'Banish Demon', description: 'Requires INT 6+', completed: false },
          { id: 'contract_refuse', name: 'Refuse', description: 'Walk away safely', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.ANCIENT_LIBRARY:
      return {
        x,
        y,
        type: 'event',
        name: 'Forbidden Library',
        description: 'Countless ancient tomes line dusty shelves. The knowledge here could be priceless.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'library_study', name: 'Study Tomes', description: 'Learn skills (50 gold)', completed: false },
          { id: 'library_steal', name: 'Steal Book', description: 'Free but risky (DEX 5+)', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.TORTURE_CHAMBER:
      return {
        x,
        y,
        type: 'event',
        name: 'Torture Chamber',
        description: 'Rusted implements of pain surround a central rack. Gold coins are scattered about.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'torture_search', name: 'Search Carefully', description: 'Slow but safe', completed: false },
          { id: 'torture_rush', name: 'Grab Everything', description: 'More gold but trigger traps', completed: false },
          { id: 'torture_prisoner', name: 'Free Prisoner', description: 'Someone is still alive!', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.SUMMONING_CIRCLE:
      return {
        x,
        y,
        type: 'event',
        name: 'Summoning Circle',
        description: 'A glowing pentagram hums with power. Something powerful was summoned here.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'summon_fight', name: 'Complete Ritual', description: 'Fight elite enemy for legendary loot', completed: false },
          { id: 'summon_disrupt', name: 'Disrupt Circle', description: 'Gain magic resistance', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.DARK_FOUNTAIN:
      return {
        x,
        y,
        type: 'event',
        name: 'Dark Fountain',
        description: 'Black water bubbles from an ornate fountain. The liquid seems... alive.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'fountain_drink', name: 'Drink', description: 'Unknown effect', completed: false },
          { id: 'fountain_purify', name: 'Purify Curse', description: 'Remove debuffs (if any)', completed: false },
          { id: 'fountain_empower', name: 'Dark Empowerment', description: 'Lose 3 HP, gain +1 to all stats', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.NECROMANCER_LAB:
      return {
        x,
        y,
        type: 'event',
        name: 'Necromancer\'s Laboratory',
        description: 'Bubbling potions and body parts fill this horrific workspace.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'lab_experiment', name: 'Experiment', description: 'Random powerful effect', completed: false },
          { id: 'lab_loot', name: 'Loot Supplies', description: 'Gain potions and gold', completed: false },
          { id: 'lab_destroy', name: 'Destroy Lab', description: 'Prevent evil (XP reward)', completed: false }
        ]
      };

    case FLOOR_2_EVENT_TYPES.VOID_PORTAL:
      return {
        x,
        y,
        type: 'event',
        name: 'Void Portal',
        description: 'A tear in reality swirls before you. Strange whispers emanate from within.',
        visited: false,
        cleared: false,
        exits: { north: false, east: false, south: false, west: false, [from]: true },
        eventType: type,
        actions: [
          { id: 'portal_enter', name: 'Enter Portal', description: 'High risk, high reward', completed: false },
          { id: 'portal_seal', name: 'Seal Portal', description: 'Requires INT 7+ for relic', completed: false }
        ]
      };

    default:
      return createFloor2EventRoom(x, y, from, FLOOR_2_EVENT_TYPES.CURSED_ALTAR);
  }
};

// Floor 2 event descriptions for UI
export const FLOOR_2_EVENT_DESCRIPTIONS = {
  [FLOOR_2_EVENT_TYPES.CURSED_ALTAR]: {
    name: 'Cursed Altar',
    emoji: '⛧',
    description: 'A dark altar that demands sacrifice for power.'
  },
  [FLOOR_2_EVENT_TYPES.DEMON_CONTRACT]: {
    name: 'Demon\'s Bargain',
    emoji: '📜',
    description: 'A demon offers forbidden power for a terrible price.'
  },
  [FLOOR_2_EVENT_TYPES.ANCIENT_LIBRARY]: {
    name: 'Forbidden Library',
    emoji: '📚',
    description: 'Ancient knowledge at a cost.'
  },
  [FLOOR_2_EVENT_TYPES.TORTURE_CHAMBER]: {
    name: 'Torture Chamber',
    emoji: '🔗',
    description: 'A place of suffering with hidden treasures.'
  },
  [FLOOR_2_EVENT_TYPES.SUMMONING_CIRCLE]: {
    name: 'Summoning Circle',
    emoji: '⭐',
    description: 'A ritual site of immense power.'
  },
  [FLOOR_2_EVENT_TYPES.DARK_FOUNTAIN]: {
    name: 'Dark Fountain',
    emoji: '⛲',
    description: 'Corrupted waters with mysterious properties.'
  },
  [FLOOR_2_EVENT_TYPES.NECROMANCER_LAB]: {
    name: 'Necromancer\'s Lab',
    emoji: '🧪',
    description: 'A workspace of dark experiments.'
  },
  [FLOOR_2_EVENT_TYPES.VOID_PORTAL]: {
    name: 'Void Portal',
    emoji: '🌀',
    description: 'A tear in reality itself.'
  },
};
