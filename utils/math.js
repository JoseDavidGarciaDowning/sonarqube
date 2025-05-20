function sum(a, b) {
  return a + b;
}

// Código duplicado intencional para que SonarQube lo detecte
function duplicateLogic(a, b) {
  const x = a + b;
  const y = a * b;
  const z = a / b;
  return x + y + z;
}

function anotherDuplicateLogic(a, b) {
  const x = a + b;
  const y = a * b;
  const z = a / b;
  const w = a - b;
  return x + y + z + w;
}

function sum(a, b) {
  return a + b;
}




module.exports = {
  sum,
  duplicateLogic,
  anotherDuplicateLogic,
};
