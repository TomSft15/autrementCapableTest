// Adaptateur pour mettre à jour vos données existantes avec le système standardisé
import { scenarios as originalScenarios } from '@/data/data.js';
import { skillsList, penaltySkills } from '@/data/skills-list';

/**
 * Fonction pour vérifier si une compétence est dans la liste standardisée
 * @param {string} skill - Nom de la compétence à vérifier
 * @returns {boolean} - True si la compétence existe dans la liste standardisée
 */
function isStandardSkill(skill) {
  const allSkills = getAllSkillsFlat();
  return allSkills.includes(skill);
}

/**
 * Fonction pour obtenir toutes les compétences en une seule liste plate
 * @returns {Array} - Liste de toutes les compétences
 */
function getAllSkillsFlat() {
  const skills = [];
  
  Object.values(skillsList).forEach(category => {
    Object.keys(category).forEach(skill => {
      skills.push(skill);
    });
  });
  
  return skills;
}

/**
 * Fonction pour suggérer une compétence standardisée à partir d'une compétence non standard
 * @param {string} nonStandardSkill - Compétence non standard
 * @returns {string} - Suggestion de compétence standardisée
 */
function suggestStandardSkill(nonStandardSkill) {
  // Mapping de correspondance pour les compétences non standard
  const skillMapping = {
    // Compétences négatives à éviter
    'indifference': 'empathie', // on utilisera en tant que pénalité
    'detachement': 'empathie', // on utilisera en tant que pénalité
    'passivite': 'initiative', // on utilisera en tant que pénalité
    
    // Autres compétences à standardiser
    'confiance': 'confianceEnSoi',
    'motivation': 'soutien',
    'priseDeRisque': 'initiative'
  };
  
  return skillMapping[nonStandardSkill] || nonStandardSkill;
}

/**
 * Fonction pour mettre à jour un scénario avec les compétences standardisées
 * @param {Object} scenario - Scénario original
 * @returns {Object} - Scénario mis à jour avec des compétences standardisées
 */
function standardizeScenario(scenario) {
  const updatedScenario = JSON.parse(JSON.stringify(scenario)); // Copie profonde
  
  // Mise à jour des réponses
  updatedScenario.reponses.forEach(reponse => {
    // Traitement des compétences positives
    if (reponse.skills) {
      const standardSkills = {};
      
      Object.entries(reponse.skills).forEach(([skill, value]) => {
        // Si c'est une compétence négative, la déplacer vers penalties
        if (['indifference', 'detachement', 'passivite'].includes(skill)) {
          // Si pas déjà de penalties, créer l'objet
          if (!reponse.penalties) {
            reponse.penalties = {};
          }
          
          // Ajouter la pénalité pour la compétence correspondante
          const standardSkill = suggestStandardSkill(skill);
          reponse.penalties[standardSkill] = value;
        } else {
          // Sinon, standardiser la compétence
          const standardSkill = suggestStandardSkill(skill);
          standardSkills[standardSkill] = value;
        }
      });
      
      reponse.skills = standardSkills;
    }
    
    // S'assurer que les skills et penalties sont des objets
    if (!reponse.skills) reponse.skills = {};
    if (!reponse.penalties) reponse.penalties = {};
  });
  
  return updatedScenario;
}

/**
 * Fonction pour standardiser tous les scénarios
 * @returns {Array} - Liste des scénarios standardisés
 */
export function getStandardizedScenarios() {
  return originalScenarios.map(scenario => standardizeScenario(scenario));
}

/**
 * Fonction pour vérifier les compétences non standard dans les scénarios
 * @returns {Object} - Rapport sur les compétences non standard
 */
export function checkNonStandardSkills() {
  const report = {
    nonStandardSkills: [],
    suggestedReplacements: {},
    scenariosWithIssues: []
  };
  
  originalScenarios.forEach(scenario => {
    let hasIssue = false;
    
    scenario.reponses.forEach(reponse => {
      if (reponse.skills) {
        Object.keys(reponse.skills).forEach(skill => {
          if (!isStandardSkill(skill)) {
            if (!report.nonStandardSkills.includes(skill)) {
              report.nonStandardSkills.push(skill);
              report.suggestedReplacements[skill] = suggestStandardSkill(skill);
            }
            hasIssue = true;
          }
        });
      }
      
      if (reponse.penalties) {
        Object.keys(reponse.penalties).forEach(skill => {
          if (!isStandardSkill(skill)) {
            if (!report.nonStandardSkills.includes(skill)) {
              report.nonStandardSkills.push(skill);
              report.suggestedReplacements[skill] = suggestStandardSkill(skill);
            }
            hasIssue = true;
          }
        });
      }
    });
    
    if (hasIssue) {
      report.scenariosWithIssues.push(scenario.id);
    }
  });
  
  return report;
}

// Export pour le test ou l'utilisation dans la console
export const testFunctions = {
  isStandardSkill,
  suggestStandardSkill,
  standardizeScenario
};