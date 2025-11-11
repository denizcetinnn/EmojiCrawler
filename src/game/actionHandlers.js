import { WEAPONS, getRandomWeapon } from '../data/weapons';
import { ARMOR, getRandomArmor } from '../data/armor';
import { getRandomRelic } from '../data/relics';
import { getSpiderEnemy } from '../data/enemies';
import { getRandomFloor2Enemy } from '../data/floor2Enemies';
import { randomInt } from '../utils/helpers';
import { calculateLevel } from '../utils/calculations';

export const handleRoomAction = (actionId, room, player, setPlayer, setDialogue, startCombat, setItemChoice, setGoldChoice, setShowShop, updateChoices) => {
  const updates = {};
  let dialogueText = '';
  
  switch (actionId) {
    case 'wardrobe':
      const armor = { ...ARMOR[0], type: 'armor' };
      setItemChoice({
        item: armor,
        message: 'You find a tattered cloak in the wardrobe.'
      });
      return;
      
    case 'chest':
      if (room.type === 'start') {
        const weapon = { ...WEAPONS[0], type: 'weapon' };
        setItemChoice({
          item: weapon,
          message: 'You find a rusty dagger in the chest.'
        });
      } else {
        const loot = Math.random();
        const maxRarity = Math.random() < 0.1 ? 5 : 3;
        
        if (loot < 0.5) {
          const weapon = getRandomWeapon(maxRarity);
          setItemChoice({
            item: weapon,
            message: `You find a ${weapon.name} in the chest!`
          });
        } else {
          const armorItem = getRandomArmor(maxRarity);
          setItemChoice({
            item: armorItem,
            message: `You find ${armorItem.name} in the chest!`
          });
        }
      }
      return;
      
    case 'book':
      updates.hasMap = true;
      dialogueText = 'You take the book and quill. You can now map the dungeon as you explore!';
      break;
      
    case 'coins':
      const gold = randomInt(5, 15);
      setGoldChoice(gold);
      return;
      
    case 'pedestal':
      const relic = getRandomRelic();
      setItemChoice({
        item: relic,
        message: `You see ${relic.name} on the pedestal. ${relic.effect}`
      });
      return;
      
    case 'locked_door':
      if (player.keys > 0) {
        updates.keys = player.keys - 1;
        room.locked = false;
        room.name = 'Treasure Room';
        room.description = 'Glittering items catch your eye.';
        room.actions = [
          { id: 'chest', name: 'Treasure Chest', description: 'Open it', completed: false },
          { id: 'coins', name: 'Gold Pile', description: 'Take the gold', completed: false },
          { id: 'pedestal', name: 'Relic Pedestal', description: 'A mysterious artifact', completed: false }
        ];
        dialogueText = 'You use a key to unlock the door. The treasure room is now open!';
        
        // Apply updates first
        if (Object.keys(updates).length > 0) {
          setPlayer(p => ({ ...p, ...updates }));
        }
        setDialogue(dialogueText);
          
        updateChoices(room);
      } else {
        dialogueText = 'The door is locked. You need a key to open it.';
        setDialogue(dialogueText);
      }
      return;
      
    case 'rest':
      const hpRestore = Math.floor(player.maxHp * 0.75);
      updates.hp = Math.min(player.hp + hpRestore, player.maxHp);
      dialogueText = `Rested and recovered ${hpRestore} HP!`;
      break;
      
    case 'skeleton':
      const journalExists = room.actions.some(a => a.id === 'journal');
      if (!journalExists) {
        room.actions.push({
          id: 'journal',
          name: 'Tattered Journal',
          description: 'Read the entries',
          completed: false
        });
      }
      dialogueText = 'You search the skeleton and find a tattered journal.';
      updateChoices(room);
      break;
      
    case 'journal':
      const xpGain = randomInt(3, 8);
      const newXp = player.xp + xpGain;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > player.level;
      
      updates.xp = newXp;
      dialogueText = `You read the journal carefully. Gained ${xpGain} XP!`;
      
      if (leveledUp) {
        updates.level = newLevel;
        updates.skillPoints = player.skillPoints + 2;
        dialogueText += ` Level up! Now level ${newLevel}. Gained 2 skill points!`;
      }
      break;
      
    case 'trap':
      const intCheck = player.stats.int >= 3;
      if (intCheck) {
        const trapGold = randomInt(15, 30);
        setGoldChoice(trapGold);
        dialogueText = 'Your intelligence helps you disarm the trap safely!';
      } else {
        dialogueText = 'You trigger the trap! Lost 2 HP.';
        const newHp = player.hp - 2;
        if (newHp <= 0) {
          updates.hp = 0;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('playerDeath'));
          }, 500);
        } else {
          updates.hp = newHp;
        }
      }
      break;
      
    case 'spider':
      const spiderEnemy = getSpiderEnemy();
      startCombat(spiderEnemy);
      return;
      
    case 'enemy':
      // Handle both single enemy and multiple enemies
      if (Array.isArray(room.enemy)) {
        // Multiple enemies - reset HP for each
        const enemiesToFight = room.enemy.map(e => ({ ...e, hp: e.maxHp }));
        startCombat(enemiesToFight);
      } else {
        // Single enemy
        const enemyToFight = { ...room.enemy, hp: room.enemy.maxHp };
        startCombat(enemyToFight);
      }
      return;
      
    case 'boss':
      const bossToFight = { ...room.boss, hp: room.boss.maxHp };
      startCombat(bossToFight, true); // Pass true to indicate it's a boss
      return;

    case 'shop':
      if (room.shopActive === false) {
        dialogueText = 'The shopkeeper refuses to do business with you after your insult.';
        setDialogue(dialogueText);
        return;
      }
      setShowShop(true);
      dialogueText = 'The mysterious merchant shows you their wares...';
      setDialogue(dialogueText);
      return;

    // FLOOR 2 EVENTS
    case 'altar_sacrifice':
      if (player.hp > 5) {
        updates.hp = player.hp - 5;
        const relic = getRandomRelic();
        setItemChoice({
          item: relic,
          message: `You offer your blood to the altar. ${relic.name} materializes before you!`
        });
      } else {
        dialogueText = 'You don\'t have enough health to make this sacrifice.';
      }
      break;

    case 'altar_desecrate':
      if (player.stats.str >= 5) {
        const xpGain = randomInt(40, 60);
        const newXp = player.xp + xpGain;
        const newLevel = calculateLevel(newXp);
        const leveledUp = newLevel > player.level;
        updates.xp = newXp;
        dialogueText = `You destroy the cursed altar! Gained ${xpGain} XP!`;
        if (leveledUp) {
          updates.level = newLevel;
          updates.skillPoints = player.skillPoints + 2;
          dialogueText += ` Level up! Now level ${newLevel}!`;
        }
      } else {
        dialogueText = 'You lack the strength to destroy the altar. (STR 5+ required)';
      }
      break;

    case 'altar_ignore':
      dialogueText = 'You wisely leave the cursed altar alone.';
      break;

    case 'contract_accept':
      if (player.maxHp > 10) {
        updates.maxHp = player.maxHp - 10;
        updates.hp = Math.min(player.hp, updates.maxHp);
        const weapon = getRandomWeapon({ legendary: 1.0 }); // 100% legendary weapon
        setItemChoice({
          item: weapon,
          message: `The demon grins wickedly as you sign. You feel your life force drain away, but gain ${weapon.name}!`
        });
      } else {
        dialogueText = 'The demon laughs. "Your soul is too weak for this bargain."';
      }
      break;

    case 'contract_banish':
      if (player.stats.int >= 6) {
        const gold = randomInt(80, 120);
        setGoldChoice(gold);
        dialogueText = 'Your magical knowledge lets you banish the demon and claim its hoard!';
      } else {
        dialogueText = 'Your attempt to banish the demon fails. It mocks your weakness. (INT 6+ required)';
      }
      break;

    case 'contract_refuse':
      dialogueText = 'The demon vanishes in disappointment.';
      break;

    case 'library_study':
      if (player.gold >= 50) {
        updates.gold = player.gold - 50;
        updates.skillPoints = player.skillPoints + 3;
        dialogueText = 'You study the ancient tomes intensely. Gained 3 skill points!';
      } else {
        dialogueText = 'The knowledge here costs 50 gold. You cannot afford it.';
      }
      break;

    case 'library_steal':
      if (player.stats.dex >= 5) {
        updates.skillPoints = player.skillPoints + 2;
        dialogueText = 'You stealthily pocket a valuable tome. Gained 2 skill points!';
      } else {
        const damage = randomInt(8, 12);
        updates.hp = player.hp - damage;
        dialogueText = `You trigger a magical ward! Lost ${damage} HP!`;
        if (updates.hp <= 0) {
          updates.hp = 0;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('playerDeath'));
          }, 500);
        }
      }
      break;

    case 'library_leave':
      dialogueText = 'You leave the library, its secrets remaining hidden.';
      break;

    case 'torture_search':
      const safeGold = randomInt(30, 50);
      setGoldChoice(safeGold);
      dialogueText = 'You carefully search the room, avoiding traps.';
      break;

    case 'torture_rush':
      const bigGold = randomInt(60, 100);
      const trapDamage = randomInt(5, 10);
      updates.hp = player.hp - trapDamage;
      updates.gold = player.gold + bigGold;
      dialogueText = `You grab everything! Gained ${bigGold} gold but triggered traps! Lost ${trapDamage} HP!`;
      if (updates.hp <= 0) {
        updates.hp = 0;
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('playerDeath'));
        }, 500);
      }
      break;

    case 'torture_prisoner':
      const prisonerKey = Math.random() < 0.5;
      if (prisonerKey) {
        updates.keys = (player.keys || 0) + 1;
        dialogueText = 'The grateful prisoner gives you a key before fleeing!';
      } else {
        const relic = getRandomRelic();
        setItemChoice({
          item: relic,
          message: 'The grateful prisoner gives you their only possession before fleeing!'
        });
      }
      break;

    case 'summon_fight':
      const eliteEnemy = getRandomFloor2Enemy('late');
      // Mark enemy as having legendary loot
      eliteEnemy.isBoss = true;
      eliteEnemy.legendaryWeapon = getRandomWeapon({ legendary: 1.0 }); // 100% legendary
      startCombat(eliteEnemy, false); // Pass false for isBoss to avoid boss-specific mechanics
      return;

    case 'summon_disrupt':
      const magicRelic = getRandomRelic();
      setItemChoice({
        item: magicRelic,
        message: 'You disrupt the summoning circle and absorb its power!'
      });
      break;

    case 'summon_leave':
      dialogueText = 'You decide not to tempt fate.';
      break;

    case 'fountain_drink':
      const fountainRoll = Math.random();
      if (fountainRoll < 0.4) {
        const heal = randomInt(15, 25);
        updates.hp = Math.min(player.hp + heal, player.maxHp);
        dialogueText = `The dark water restores your vitality! Healed ${heal} HP!`;
      } else if (fountainRoll < 0.7) {
        const damage = randomInt(10, 15);
        updates.hp = player.hp - damage;
        dialogueText = `The water burns like acid! Lost ${damage} HP!`;
        if (updates.hp <= 0) {
          updates.hp = 0;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('playerDeath'));
          }, 500);
        }
      } else {
        const statBoost = ['str', 'dex', 'int'][Math.floor(Math.random() * 3)];
        updates.stats = { ...player.stats, [statBoost]: player.stats[statBoost] + 1 };
        dialogueText = `The water grants you power! ${statBoost.toUpperCase()} +1!`;
      }
      break;

    case 'fountain_purify':
      updates.hp = Math.min(player.hp + 10, player.maxHp);
      dialogueText = 'You feel cleansed. Restored 10 HP and removed any curses.';
      break;

    case 'fountain_empower':
      if (player.hp > 3) {
        updates.hp = player.hp - 3;
        updates.stats = {
          str: player.stats.str + 1,
          dex: player.stats.dex + 1,
          int: player.stats.int + 1
        };
        dialogueText = 'Dark power surges through you! All stats +1! Lost 3 HP.';
      } else {
        dialogueText = 'You don\'t have enough health for this ritual.';
      }
      break;

    case 'lab_experiment':
      const expRoll = Math.random();
      if (expRoll < 0.33) {
        updates.maxHp = player.maxHp + 10;
        updates.hp = player.hp + 10;
        dialogueText = 'The experiment succeeds! Max HP +10!';
      } else if (expRoll < 0.66) {
        const potion = { name: 'Greater Health Potion', type: 'potion', effect: 'Restore 25 HP', healAmount: 25, value: 50 };
        updates.potions = [...(player.potions || []), potion, potion, potion];
        dialogueText = 'You brew 3 Greater Health Potions!';
      } else {
        const expDamage = randomInt(8, 15);
        updates.hp = player.hp - expDamage;
        dialogueText = `The experiment explodes! Lost ${expDamage} HP!`;
        if (updates.hp <= 0) {
          updates.hp = 0;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('playerDeath'));
          }, 500);
        }
      }
      break;

    case 'lab_loot':
      const labGold = randomInt(40, 70);
      const potion = { name: 'Greater Health Potion', type: 'potion', effect: 'Restore 25 HP', healAmount: 25, value: 50 };
      updates.gold = player.gold + labGold;
      updates.potions = [...(player.potions || []), potion];
      dialogueText = `Found ${labGold} gold and a Greater Health Potion!`;
      break;

    case 'lab_destroy':
      const xpGain2 = randomInt(50, 80);
      const newXp2 = player.xp + xpGain2;
      const newLevel2 = calculateLevel(newXp2);
      const leveledUp2 = newLevel2 > player.level;
      updates.xp = newXp2;
      dialogueText = `You destroy the evil laboratory! Gained ${xpGain2} XP!`;
      if (leveledUp2) {
        updates.level = newLevel2;
        updates.skillPoints = player.skillPoints + 2;
        dialogueText += ` Level up! Now level ${newLevel2}!`;
      }
      break;

    case 'portal_enter':
      const portalRoll = Math.random();
      if (portalRoll < 0.5) {
        const relic = getRandomRelic();
        setItemChoice({
          item: relic,
          message: 'You emerge from the void with a powerful artifact!'
        });
      } else {
        const voidDamage = randomInt(12, 20);
        updates.hp = player.hp - voidDamage;
        dialogueText = `The void tears at your essence! Lost ${voidDamage} HP!`;
        if (updates.hp <= 0) {
          updates.hp = 0;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('playerDeath'));
          }, 500);
        } else {
          const gold = randomInt(50, 100);
          updates.gold = player.gold + gold;
          dialogueText += ` But you found ${gold} gold in the void!`;
        }
      }
      break;

    case 'portal_seal':
      if (player.stats.int >= 7) {
        const relic = getRandomRelic();
        setItemChoice({
          item: relic,
          message: 'You seal the portal using advanced magic! The void energy condenses into an artifact!'
        });
      } else {
        dialogueText = 'You lack the magical knowledge to seal this portal. (INT 7+ required)';
      }
      break;

    case 'portal_avoid':
      dialogueText = 'You back away from the terrifying portal.';
      break;

    case 'descend':
      // This will be handled by the Game component to generate new floor
      window.dispatchEvent(new CustomEvent('descendFloor'));
      return;

    default:
      dialogueText = `You examine the action. Nothing happens.`;
  }
  
  if (Object.keys(updates).length > 0) {
    setPlayer(p => ({ ...p, ...updates }));
  }
  setDialogue(dialogueText);
};

export const applyRelicEffect = (relic, player, setPlayer) => {
  if (relic.type === 'stat') {
    setPlayer(p => ({
      ...p,
      stats: { ...p.stats, [relic.stat]: p.stats[relic.stat] + (relic.statValue || 2) }
    }));
  } else if (relic.type === 'maxenergy') {
    setPlayer(p => ({ 
      ...p, 
      maxEnergy: p.maxEnergy + 5,
      energy: p.energy + 5
    }));
  }
};