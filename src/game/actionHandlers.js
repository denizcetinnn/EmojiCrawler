import { WEAPONS, getRandomWeapon } from '../data/weapons';
import { ARMOR, getRandomArmor } from '../data/armor';
import { getRandomRelic } from '../data/relics';
import { getSpiderEnemy } from '../data/enemies';
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
      setShowShop(true);
      dialogueText = 'The mysterious merchant shows you their wares...';
      setDialogue(dialogueText);
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