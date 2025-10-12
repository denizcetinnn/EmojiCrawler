import { calculateDamage, calculateDodgeChance, calculateArmorReduction } from '../utils/calculations';

export const processCombatMove = (moveName, player, enemy, playerDefending, playerDodging, enemyDefending, enemyDodging) => {
  const result = {
    log: [],
    playerUpdate: {},
    enemyUpdate: {},
    newPlayerDefending: false,
    newPlayerDodging: false,
    newEnemyDefending: false,
    newEnemyDodging: false,
    shouldTriggerEnemyTurn: true
  };

  switch (moveName) {
    case 'Punch':
      return handleAttack(player, enemy, 1, 2, result, enemyDefending, enemyDodging);
      
    case 'Take a Breather':
      const energyRestore = 3;
      result.playerUpdate.energy = Math.min(player.energy + energyRestore, player.maxEnergy);
      result.log.push(`You take a breather. Restored ${energyRestore} energy.`);
      return result;
      
    case 'Dodge':
      result.playerUpdate.energy = player.energy - 3;
      result.newPlayerDodging = true;
      result.log.push('You prepare to dodge!');
      return result;
      
    case 'Block':
      result.playerUpdate.energy = player.energy - 2;
      result.newPlayerDefending = true;
      result.log.push('You raise your guard!');
      return result;
      
    default:
      return handleAttack(player, enemy, 2, 3, result, enemyDefending, enemyDodging);
  }
};

const handleAttack = (player, enemy, baseDamage, energyCost, result, enemyDefending, enemyDodging) => {
  if (player.energy < energyCost) {
    result.log.push("Not enough energy!");
    result.shouldTriggerEnemyTurn = false;
    return result;
  }

  // Check enemy dodge
  if (enemyDodging) {
    const dodgeChance = 0.5; // Enemies have 50% dodge when dodging
    if (Math.random() < dodgeChance) {
      result.log.push(`${enemy.name} dodges your attack!`);
      result.playerUpdate.energy = player.energy - energyCost;
      return result;
    } else {
      result.log.push(`${enemy.name} tried to dodge but failed!`);
    }
  }

  const damageResult = calculateDamage(baseDamage, player.stats, player.equipment, true);
  let finalDamage = damageResult.damage;
  
  // Apply enemy blocking
  if (enemyDefending) {
    finalDamage = Math.max(0, finalDamage - 2);
    if (finalDamage === 0) {
      result.log.push(`You attack but ${enemy.name} blocks all the damage!`);
      result.playerUpdate.energy = player.energy - energyCost;
      return result;
    }
    result.log.push(`${enemy.name} is blocking!`);
  }
  
  result.playerUpdate.energy = player.energy - energyCost;
  result.enemyUpdate.hp = enemy.hp - finalDamage;
  result.log.push(`You attack${damageResult.isCrit ? ' (CRIT!)' : ''} for ${finalDamage} damage!`);
  
  return result;
};

export const processEnemyTurn = (enemy, player, playerDodging, playerDefending) => {
  const result = {
    log: [],
    playerUpdate: {},
    newPlayerDefending: false,
    newPlayerDodging: false,
    newEnemyDefending: false,
    newEnemyDodging: false
  };

  const enemyMove = chooseEnemyMove(enemy);
  
  if (enemyMove === 'Dodge') {
    result.log.push(`${enemy.name} prepares to dodge!`);
    result.newEnemyDodging = true;
    return result;
  }
  
  if (enemyMove === 'Block') {
    result.log.push(`${enemy.name} raises its guard!`);
    result.newEnemyDefending = true;
    return result;
  }
  
  if (playerDodging) {
    const dodgeChance = calculateDodgeChance(player.stats.dex);
    const dodged = Math.random() < dodgeChance;
    
    if (dodged) {
      result.log.push(`${enemy.name} uses ${enemyMove}... but you dodge it!`);
      return result;
    } else {
      result.log.push('You tried to dodge but failed!');
    }
  }
  
  const damageResult = calculateDamage(enemy.damage, {}, {}, false);
  const armorReduction = calculateArmorReduction(player.equipment, playerDefending);
  const finalDamage = Math.max(0, damageResult.damage - armorReduction);
  
  result.playerUpdate.hp = player.hp - finalDamage;
  
  if (finalDamage === 0) {
    result.log.push(`${enemy.name} uses ${enemyMove} but you block all damage!`);
  } else {
    result.log.push(`${enemy.name} uses ${enemyMove} for ${finalDamage} damage!`);
  }
  
  return result;
};

const chooseEnemyMove = (enemy) => {
  const pattern = enemy.pattern || 'aggressive';
  
  if (pattern === 'defensive' && Math.random() < 0.4) {
    return 'Block';
  } else if (pattern === 'evasive' && Math.random() < 0.5) {
    return 'Dodge';
  } else if (pattern === 'mixed' && Math.random() < 0.2) {
    return 'Dodge';
  }
  
  const attackMoves = enemy.moves.filter(m => !['Block', 'Dodge'].includes(m));
  return attackMoves[Math.floor(Math.random() * attackMoves.length)];
};