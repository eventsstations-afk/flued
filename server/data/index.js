/**
 * CHRISTMAS FEUD — EDITION BANK MANAGER, 15 CATEGORIES & VALIDATOR
 * Provides independent deep-cloned all-Christmas question banks for:
 *  - classic  (70 unique rounds)
 *  - deluxe   (100 unique rounds)
 *  - ultimate (150 unique rounds)
 * Plus Private Fast Money bank (30 unique questions with notes & categories).
 */

const STANDARD_CLASSIC_ROUNDS = require('./standardClassic');
const STANDARD_DELUXE_EXTRA_ROUNDS = require('./standardDeluxe');
const STANDARD_ULTIMATE_EXTRA_ROUNDS = require('./standardUltimate');
const FAST_MONEY_QUESTIONS = require('./fastMoneyBank');

const CHRISTMAS_CATEGORIES = [
  'Christmas Traditions',
  'Christmas Gifts',
  'Christmas Movies',
  'Christmas Music',
  'Christmas Decorations',
  'Santa Claus and the North Pole',
  'Christmas Activities',
  'Christmas Family and Friends',
  'Winter and Snow',
  'Christmas Travel',
  'Christmas Parties',
  'Christmas Food and Drinks',
  'Christmas Shopping',
  'Christmas Characters and Stories',
  'Funny Christmas Situations'
];

const EDITION_META = {
  classic: {
    id: 'classic',
    label: '70 ROUNDS – CLASSIC',
    shortName: 'Classic Edition',
    pdfTitle: 'CHRISTMAS FEUD CLASSIC – 70 ROUND ANSWER KEY',
    pdfFilename: 'CHRISTMAS FEUD CLASSIC – 70 ROUND ANSWER KEY.pdf',
    expectedCount: 70
  },
  deluxe: {
    id: 'deluxe',
    label: '100 ROUNDS – DELUXE',
    shortName: 'Deluxe Edition',
    pdfTitle: 'CHRISTMAS FEUD DELUXE – 100 ROUND ANSWER KEY',
    pdfFilename: 'CHRISTMAS FEUD DELUXE – 100 ROUND ANSWER KEY.pdf',
    expectedCount: 100
  },
  ultimate: {
    id: 'ultimate',
    label: '150 ROUNDS – ULTIMATE',
    shortName: 'Ultimate Edition',
    pdfTitle: 'CHRISTMAS FEUD ULTIMATE – 150 ROUND ANSWER KEY',
    pdfFilename: 'CHRISTMAS FEUD ULTIMATE – 150 ROUND ANSWER KEY.pdf',
    expectedCount: 150
  }
};

const GAME_DATA_DISCLAIMER =
  'Note: All survey point values are illustrative game-show entertainment data totaling 100 points per standard round, not verified statistical survey research.';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getDefaultEditionBank(edition = 'classic') {
  if (edition === 'deluxe') {
    return deepClone([...STANDARD_CLASSIC_ROUNDS, ...STANDARD_DELUXE_EXTRA_ROUNDS]);
  }
  if (edition === 'ultimate') {
    return deepClone([
      ...STANDARD_CLASSIC_ROUNDS,
      ...STANDARD_DELUXE_EXTRA_ROUNDS,
      ...STANDARD_ULTIMATE_EXTRA_ROUNDS
    ]);
  }
  return deepClone(STANDARD_CLASSIC_ROUNDS);
}

function getDefaultAllEditionBanks() {
  return {
    classic: getDefaultEditionBank('classic'),
    deluxe: getDefaultEditionBank('deluxe'),
    ultimate: getDefaultEditionBank('ultimate')
  };
}

function getDefaultFastMoneyBank() {
  return deepClone(FAST_MONEY_QUESTIONS);
}

function validateStandardRound(round) {
  const errors = [];
  if (!round || typeof round !== 'object') {
    return { valid: false, errors: ['Round must be an object.'] };
  }
  if (!round.question || typeof round.question !== 'string' || !round.question.trim()) {
    errors.push('Question text is required.');
  }
  if (!Array.isArray(round.answers) || round.answers.length !== 8) {
    errors.push('Every standard round must contain exactly 8 answers.');
  } else {
    let sum = 0;
    const seen = new Set();
    round.answers.forEach((ans, idx) => {
      if (!ans || typeof ans.text !== 'string' || !ans.text.trim()) {
        errors.push(`Answer #${idx + 1} text is required.`);
      } else {
        const key = ans.text.trim().toLowerCase();
        if (seen.has(key)) {
          errors.push(`Duplicate answer "${ans.text.trim()}" in round.`);
        }
        seen.add(key);
      }
      const pts = Number(ans.points);
      if (!Number.isInteger(pts) || pts < 1 || pts > 99) {
        errors.push(`Answer #${idx + 1} points must be an integer between 1 and 99.`);
      } else {
        sum += pts;
      }
    });
    if (sum !== 100) {
      errors.push(`Answer points must total exactly 100 (currently ${sum}).`);
    }
  }
  return { valid: errors.length === 0, errors };
}

function validateFastMoneyQuestion(q) {
  const errors = [];
  if (!q || typeof q !== 'object') {
    return { valid: false, errors: ['Fast Money question must be an object.'] };
  }
  if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
    errors.push('Fast Money question text is required.');
  }
  if (!Array.isArray(q.acceptedAnswers) || q.acceptedAnswers.length < 5 || q.acceptedAnswers.length > 8) {
    errors.push('Fast Money question must have between 5 and 8 accepted sample answers.');
  } else {
    q.acceptedAnswers.forEach((ans, idx) => {
      if (!ans || typeof ans.text !== 'string' || !ans.text.trim()) {
        errors.push(`Accepted answer #${idx + 1} text is required.`);
      }
      const pts = Number(ans.points);
      if (!Number.isInteger(pts) || pts < 1 || pts > 100) {
        errors.push(`Accepted answer #${idx + 1} points must be a positive integer.`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

function validateAllDefaultBanks() {
  const all = getDefaultAllEditionBanks();
  const report = {
    ok: true,
    categoriesCount: CHRISTMAS_CATEGORIES.length,
    editions: {},
    fastMoneyCount: FAST_MONEY_QUESTIONS.length,
    errors: []
  };
  const validCatSet = new Set(CHRISTMAS_CATEGORIES);

  for (const [ed, rounds] of Object.entries(all)) {
    const meta = EDITION_META[ed];
    const seenQ = new Set();
    const seenCats = new Set();
    let edErrors = 0;
    if (rounds.length !== meta.expectedCount) {
      report.errors.push(`${ed}: expected ${meta.expectedCount} rounds, got ${rounds.length}`);
      edErrors++;
    }
    rounds.forEach((r, idx) => {
      const v = validateStandardRound(r);
      if (!v.valid) {
        report.errors.push(`${ed} round #${idx + 1} (${r.id}): ${v.errors.join('; ')}`);
        edErrors++;
      }
      if (!validCatSet.has(r.category)) {
        report.errors.push(`${ed} round #${idx + 1} invalid category "${r.category}"`);
        edErrors++;
      } else {
        seenCats.add(r.category);
      }
      const qKey = r.question.trim().toLowerCase();
      if (seenQ.has(qKey)) {
        report.errors.push(`${ed} duplicate question: "${r.question}"`);
        edErrors++;
      }
      seenQ.add(qKey);
    });
    if (seenCats.size !== CHRISTMAS_CATEGORIES.length) {
      report.errors.push(`${ed}: covers only ${seenCats.size}/${CHRISTMAS_CATEGORIES.length} categories`);
      edErrors++;
    }
    report.editions[ed] = { count: rounds.length, categoriesCovered: seenCats.size, errors: edErrors };
  }

  const fmSeen = new Set();
  FAST_MONEY_QUESTIONS.forEach((q, idx) => {
    const v = validateFastMoneyQuestion(q);
    if (!v.valid) {
      report.errors.push(`fastMoney #${idx + 1} (${q.id}): ${v.errors.join('; ')}`);
    }
    if (!validCatSet.has(q.category)) {
      report.errors.push(`fastMoney #${idx + 1} invalid category "${q.category}"`);
    }
    const key = q.question.trim().toLowerCase();
    if (fmSeen.has(key)) report.errors.push(`fastMoney duplicate question: "${q.question}"`);
    fmSeen.add(key);
  });

  report.ok = report.errors.length === 0;
  return report;
}

module.exports = {
  CHRISTMAS_CATEGORIES,
  EDITION_META,
  GAME_DATA_DISCLAIMER,
  getDefaultEditionBank,
  getDefaultAllEditionBanks,
  getDefaultFastMoneyBank,
  validateStandardRound,
  validateFastMoneyQuestion,
  validateAllDefaultBanks,
  deepClone
};
