const { parentPort, workerData } = require("node:worker_threads");

// Calculates the factorial of a number slowly and consuming a lot of cpu, for demo purposes
function factorial(num) {
  var bigInt = BigInt(num);
  var result = 1n;
  for (let i = 0n; i < bigInt; i++) {
    let partial = result;
    for (let j = 0n; j < i; j++) {
      for (let k = 0n; k < partial; k++) {
        result++;
      }
    }
  }

  return String(result);
}

parentPort.postMessage(factorial(workerData.value));
