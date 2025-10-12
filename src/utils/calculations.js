export const calculateDamage = (baseDamage, stats, equipment, isPlayer = true) => {
  const str = stats?.str || 0;
  const dex = stats?.dex || 0;
  const weaponBonus = equipment?.weapon?.damage || 0;
  
  const critChance = dex * 0.05;
  const isCrit = Math.random() < critChance;
  
  let damage = baseDamage + (isPlayer ? str + weaponBonus : 0);
  if (isCrit) damage *= 2;
  
  return { damage, isCrit };
};

export const calculateDodgeChance = (dexterity) => {
  return 0.4 + (dexterity * 0.1);
};

export const calculateArmorReduction = (equipment, isDefending = false) => {
  let reduction = equipment?.armor?.defense || 0;
  if (isDefending) reduction += 2;
  return reduction;
};

export const calculateXpForLevel = (level) => {
  return level * 10;
};

export const calculateLevel = (xp) => {
  return Math.floor(xp / 10) + 1;
};

// Get XP progress within current level
export const getXpProgress = (xp) => {
  return xp % 10;
};