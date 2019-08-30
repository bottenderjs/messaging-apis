function and(...labels) {
  return {
    operator: 'AND',
    values: labels,
  };
}

function or(...labels) {
  return {
    operator: 'OR',
    values: labels,
  };
}

function not(...labels) {
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
