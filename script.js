import { spells } from './data.js';

// Get the input elements for puissance, agilité, and dommage agilité
const puissanceInput = document.getElementById('puissance');
const agiliteInput = document.getElementById('agilite');
const dommageAgiliteInput = document.getElementById('dommageAgilite');

// Get the elements for displaying total damage and breakdown
const totalDamageElement = document.getElementById('sumTotalDamage');
const puissanceAgiDamageElement = document.getElementById('puissanceAgiDamage');
const dommageAgiDamageElement = document.getElementById('dommageAgiDamage');
const ratioElement = document.getElementById('damageRatio');

// Function to create a spell box
function createSpellBox(spell) {
  const spellBox = document.createElement('div');
  spellBox.className = 'spell-box';

  // Spell name
  const spellName = document.createElement('div');
  spellName.className = 'spell-name';
  spellName.textContent = spell.name;
  spellBox.appendChild(spellName);

  // Display the base min and max damage for the spell
  const baseDamage = document.createElement('div');
  baseDamage.className = 'base-damage';
  baseDamage.textContent = `Base Damage: ${spell.minDamage} - ${spell.maxDamage}`;
  spellBox.appendChild(baseDamage);

  // Display the calculated damage range for the spell
  const damageRange = document.createElement('div');
  damageRange.className = 'calculated-damage-range';
  spellBox.setAttribute('data-range', damageRange);
  spellBox.appendChild(damageRange);

  // -1 button
  const minusButton = document.createElement('button');
  minusButton.textContent = '-1';
  minusButton.addEventListener('click', () => updateCounter(spellBox, -1, spell));
  spellBox.appendChild(minusButton);

  // Counter
  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = '0';
  spellBox.appendChild(counter);

  // +1 button
  const plusButton = document.createElement('button');
  plusButton.textContent = '+1';
  plusButton.addEventListener('click', () => updateCounter(spellBox, 1, spell));
  spellBox.appendChild(plusButton);

  return spellBox;
}

// Function to update the counter and recalculate total damage
function updateCounter(spellBox, change, spell) {
  const counter = spellBox.querySelector('.counter');
  let count = parseInt(counter.textContent);
  count += change;
  if (count < 0) count = 0; // Prevent negative values
  counter.textContent = count;

  // Recalculate and update the damage display
  updateDamageDisplay();
}

// Function to update the total damage and calculate sum of all spell damages
function updateDamageDisplay() {
  const puissance = parseInt(puissanceInput.value);
  const agilite = parseInt(agiliteInput.value);
  const dommageAgilite = parseInt(dommageAgiliteInput.value);

  let totalDamage = 0;
  let totalPuissanceAgiDamage = 0;
  let totalDommageAgiDamage = 0;
  let totalAttacks = 0;

  const spellBoxes = document.querySelectorAll('.spell-box');
  spellBoxes.forEach(spellBox => {
    const spellName = spellBox.querySelector('.spell-name').textContent;
    const spell = spells.find(s => s.name === spellName);

    if (spell) {
      const counter = spellBox.querySelector('.counter');
      const spellCount = parseInt(counter.textContent);

      // Calculate the total damage for this spell
      const { spellDamage, puissanceAgiDamage, dommageAgiDamage } = calculateTotalDamage(spell, spellCount, puissance, agilite, dommageAgilite);

      totalDamage += spellDamage;
      totalPuissanceAgiDamage += puissanceAgiDamage;
      totalDommageAgiDamage += dommageAgiDamage;
      totalAttacks += spellCount;

      // Update the damage range
      const damageRange = spellBox.querySelector('.calculated-damage-range');
      updateDamageRange(spell, damageRange, puissance, agilite, dommageAgilite);
    }
  });

  // Display the total sum of damages for all spells
  totalDamageElement.textContent = totalDamage.toFixed(2);

  // Display the damage from Dommage Agilité and Puissance + Agilité correctly
  dommageAgiDamageElement.textContent = `Total damage from Dommage Agilité: ${totalDommageAgiDamage.toFixed(2)}`;
  puissanceAgiDamageElement.textContent = `Total damage from Puissance + Agilité: ${totalPuissanceAgiDamage.toFixed(2)}`;

  // Calculate and display the ratio of ((Puissance + Agilité) * number of attacks) / Total damage from Puissance + Agilité
  const ratioValue = ((puissance + agilite) * totalAttacks) / totalPuissanceAgiDamage;
  ratioElement.textContent = `1 Dommage Agilité = ${ratioValue.toFixed(2)}`;
}

// Function to calculate total damage for a spell based on the formula
function calculateTotalDamage(spell, count, puissance, agilite, dommageAgilite) {
  const baseDamage = (spell.minDamage + spell.maxDamage) / 2; // Average damage

  // Calculate damage from Puissance + Agilité
  const puissanceAgiDamage = baseDamage * ((puissance + agilite) / 100);

  // Calculate damage from Dommage Agilité (only contribute by dommageAgilite)
  const dommageAgiDamage = dommageAgilite;

  // Total damage is base damage + contributions from Puissance + Agilité and Dommage Agilité
  const totalDamage = baseDamage + puissanceAgiDamage + dommageAgiDamage;

  return {
    spellDamage: totalDamage * count, // Multiply by count for total damage
    puissanceAgiDamage: puissanceAgiDamage * count, // Damage from Puissance + Agilité
    dommageAgiDamage: dommageAgiDamage * count // Damage from Dommage Agilité
  };
}

// Function to update the damage range for each spell
function updateDamageRange(spell, damageRangeElement, puissance, agilite, dommageAgilite) {
  // Calculate damage for minDamage
  const minDamage = spell.minDamage + spell.minDamage * ((puissance + agilite) / 100) + dommageAgilite;

  // Calculate damage for maxDamage
  const maxDamage = spell.maxDamage + spell.maxDamage * ((puissance + agilite) / 100) + dommageAgilite;

  // Display the updated range
  damageRangeElement.textContent = `Dégâts totaux = ${minDamage.toFixed(2)} - ${maxDamage.toFixed(2)}`;
}

// Add spell boxes to the container
const spellsContainer = document.getElementById('spellsContainer');
spells.forEach(spell => {
  const spellBox = createSpellBox(spell);
  spellsContainer.appendChild(spellBox);
});

// Initialize the damage range display
updateDamageDisplay();
