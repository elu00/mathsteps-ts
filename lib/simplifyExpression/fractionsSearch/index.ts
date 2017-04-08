/*
 * Performs simpifications on fractions: adding and cancelling out.
 *
 * Note: division is represented in mathjs as an operator node with op '/'
 * and two args, where arg[0] is the numerator and arg[1] is the denominator

// This module manipulates fractions with constants in the numerator and
// denominator. For more complex/general fractions, see Fraction.js

 */

import addConstantAndFraction = require('./addConstantAndFraction');
import addConstantFractions = require('./addConstantFractions');
import cancelLikeTerms = require('./cancelLikeTerms');
import divideByGCD = require('./divideByGCD');
import simplifyFractionSigns = require('./simplifyFractionSigns');
import simplifyPolynomialFraction = require('./simplifyPolynomialFraction');
import mathNode = require('../../mathnode');
import TreeSearch = require('../../TreeSearch');
const SIMPLIFICATION_FUNCTIONS = [
  // e.g. 2/3 + 5/6
  addConstantFractions,
  // e.g. 4 + 5/6 or 4.5 + 6/8
  addConstantAndFraction,
  // e.g. 2/-9  ->  -2/9      e.g. -2/-9  ->  2/9
  simplifyFractionSigns,
  // e.g. 8/12  ->  2/3 (divide by GCD 4)
  divideByGCD,
  // e.g. 2x/4 -> x/2 (divideByGCD but for coefficients of polynomial terms)
  simplifyPolynomialFraction,
  // e.g. (2x * 5) / 2x  ->  5
  cancelLikeTerms,
];

const search = TreeSearch.preOrder(simplifyFractions);

// Look for step(s) to perform on a node. Returns a mathNode.Status object.
function simplifyFractions(node: any);
function simplifyFractions(node) {
  for (let i = 0; i < SIMPLIFICATION_FUNCTIONS.length; i++) {
    const nodeStatus = SIMPLIFICATION_FUNCTIONS[i](node);
    if (nodeStatus.hasChanged()) {
      return nodeStatus;
    }
    else {
      node = nodeStatus.newNode;
    }
  }
  return mathNode.Status.noChange(node);
}

export = search;
