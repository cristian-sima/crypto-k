
const {validateBuffer} = require("../utils/validation")
const Module = require('../lib.js')

function sign(msg, keypair, pwd) {
  validateBuffer(msg)
  validateBuffer(pwd)
  validateBuffer(keypair, 128)

  const msgLen = msg.length
  const msgArrPtr = Module._malloc(msgLen)
  const msgArr = new Uint8Array(Module.HEAPU8.buffer, msgArrPtr, msgLen)
  const keypairArrPtr = Module._malloc(128)
  const keypairArr = new Uint8Array(Module.HEAPU8.buffer, keypairArrPtr, 128)
  const sigPtr = Module._malloc(64)
  const sigArr = new Uint8Array(Module.HEAPU8.buffer, sigPtr, 64)
  const pwdLen = pwd.length
  const pwdArrPtr = Module._malloc(pwdLen)
  const pwdArr = new Uint8Array(Module.HEAPU8.buffer, pwdArrPtr, pwdLen)

  msgArr.set(msg)
  keypairArr.set(keypair)
  pwdArr.set(pwd)

  Module._emscripten_sign(pwdArrPtr, pwdLen, keypairArrPtr, msgArrPtr, msgLen, sigPtr)
  Module._free(msgArrPtr)
  Module._free(keypairArrPtr)
  Module._free(sigPtr)
  Module._free(pwdArrPtr)

  return Buffer.from(sigArr)
}

function verify(msg, publicKey, sig) {
  validateBuffer(msg)
  validateBuffer(publicKey, 32)
  validateBuffer(sig, 64)

  const msgLen = msg.length
  const msgArrPtr = Module._malloc(msgLen)
  const msgArr = new Uint8Array(Module.HEAPU8.buffer, msgArrPtr, msgLen)
  const publicKeyArrPtr = Module._malloc(32)
  const publicKeyArr = new Uint8Array(Module.HEAPU8.buffer, publicKeyArrPtr, 32)
  const sigPtr = Module._malloc(64)
  const sigArr = new Uint8Array(Module.HEAPU8.buffer, sigPtr, 64)

  msgArr.set(msg)
  publicKeyArr.set(publicKey)
  sigArr.set(sig)

  const result = Module._emscripten_verify(msgArrPtr, msgLen, publicKeyArrPtr, sigPtr) === 0

  Module._free(msgArrPtr)
  Module._free(publicKeyArrPtr)
  Module._free(sigPtr)

  return result
}

module.exports = {
  sign,
  verify,
}
