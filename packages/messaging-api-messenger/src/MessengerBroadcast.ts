function and(
  // FIXME: [type] label type
  ...labels: any[]
): {
  operator: 'AND';
  values: any[];
} {
  return {
    operator: 'AND',
    values: labels,
  };
}

function or(
  // FIXME: [type] label type
  ...labels: any[]
): {
  operator: 'OR';
  values: any[];
} {
  return {
    operator: 'OR',
    values: labels,
  };
}

function not(
  // FIXME: [type] label type
  ...labels: any[]
): {
  operator: 'NOT';
  values: any[];
} {
  return {
    operator: 'NOT',
    values: labels,
  };
}

export default {
  and,
  or,
  not,
};
