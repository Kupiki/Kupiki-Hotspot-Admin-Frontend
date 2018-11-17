import React, {Component} from 'react';

export const getObjWhenPropertyEquals = (arrayObj, prop, val)  => {
    for (let i = 0, l = arrayObj.length; i < l; i++) {
      if (typeof arrayObj[i][prop] === 'undefined') continue;
      if (arrayObj[i][prop] === val) return arrayObj[i];
    }
    return false;
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
// export const shallowEqual = (objA: mixed, objB: mixed): boolean => {
export const shallowEqual = (objA, objB) => {
    if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

export const shallowCompare = (instance, nextProps, nextState) => {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}