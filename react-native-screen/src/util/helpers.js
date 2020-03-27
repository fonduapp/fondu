/**
 * Copyright (c) 2017
 * All Rights Reserved.
 * Author miguel.caballero
 */
'use strict';
export function matchStyle(attribute, component) {
  if (!attribute) {
    return;
  }

  if (!component) {
    throw new Error('Missing Component');
  }

  if (!component.props.style) {
    return;
  }

  const style = component.props.style;

  if (style instanceof Array) {
    for (let i = style.length; i >= 0; i--) {
      const value = find(attribute, style[i]);
      if (isNaN(value) && value) {
        return value;
      } else if (!isNaN(value)) {
        return value;
      }
    }
  } else {
    return find(attribute, style);
  }
}

function find(attr, obj) {
  for (let key in obj) {
    if (key.toLowerCase() === attr.toLowerCase()) {
      return obj[key];
    }
  }
}