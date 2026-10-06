import { Connection, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { devnetUrl, memoProgram, fetchMemoTransaction, extractMemo } from "./devnet-memo.js";

export const validSignature = value => /^[1-9A-HJ-NP-Za-km-z]{86,88}$/.test(value);
export const giftTypes = { moves2: "extra-moves", key: "door-key" };
export const byteLength = text => new TextEncoder().encode(text).length;
function signatureText(bytes) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let number = 0n, text = "", zeroes = 0;
  for (const byte of bytes) number = number * 256n + BigInt(byte);
  while (number) { text = alphabet[Number(number % 58n)] + text; number /= 58n; }
  while (zeroes < bytes.length && bytes[zeroes] === 0) zeroes++;
  return "1".repeat(zeroes) + text;
}
export function encodeGift(type, note) {
  if (!Object.hasOwn(giftTypes, type)) throw new Error("Выберите подарок");
  const text = `asar1|${type}|${note}`;
  if (byteLength(text) > 160) throw new Error("Записка длиннее 160 байт вместе с типом подарка");
  return text;
}

function rpcFor(signal) {
  return new Connection(devnetUrl, { commitment: "confirmed", disableRetryOnRateLimit: true,
    fetch: (url, options) => fetch(url, { ...options, signal }) });
}
async function bounded(action, milliseconds, externalSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  externalSignal?.addEventListener("abort", abort, { once: true });
  if (externalSignal?.aborted) abort();
  const timer = setTimeout(abort, milliseconds);
  try { return await action(rpcFor(controller.signal), controller.signal); }
  catch (error) {
    if (controller.signal.aborted) throw new Error("Ожидание завершено. Можно закрыть окно и играть или попробовать снова");
    throw error;
  } finally { clearTimeout(timer); externalSignal?.removeEventListener("abort", abort); }
}

export async function readGift(signature) {
  if (!validSignature(signature)) throw new Error("Неверная ссылка на подарок");
  return bounded(async rpc => {
    let transaction;
    for (let attempt = 0; attempt < 2; attempt++) {
      transaction = await fetchMemoTransaction(signature, rpc);
      if (transaction) break;
      if (!attempt) await new Promise(resolve => setTimeout(resolve, 600));
    }
    if (!transaction) throw new Error("Запись пока не найдена в Devnet. Откройте ссылку чуть позже");
    const memo = extractMemo(transaction);
    const match = /^asar1\|(moves2|key)\|([\s\S]*)$/.exec(memo.parsed);
    const memos = transaction.transaction.message.instructions.filter(i => i.programId.equals(memoProgram));
    const signers = transaction.transaction.message.accountKeys.filter(key => key.signer);
    // Gifts created here have exactly one author and one Memo instruction.
    if (!match || byteLength(memo.parsed) > 160 || memos.length !== 1 || signers.length !== 1) throw new Error("Это не записка помощи Асар или её формат повреждён");
    const author = signers[0].pubkey.toBase58();
    return { type: match[1], note: match[2], author: `${author.slice(0, 4)}…${author.slice(-4)}` };
  }, 8000);
}

export async function createGift(type, note, { signal, onState = () => {} } = {}) {
  const text = encodeGift(type, note);
  const provider = window.phantom?.solana;
  const payer = provider?.publicKey;
  if (!provider?.isPhantom || !payer) throw new Error("Сначала подключите Phantom в шапке игры");
  onState("Проверяем Memo в Devnet…");
  const transaction = await bounded(async rpc => {
    const lifetime = await rpc.getLatestBlockhash();
    const instruction = new TransactionInstruction({ programId: memoProgram,
      keys: [{ pubkey: payer, isSigner: true, isWritable: false }], data: new TextEncoder().encode(text) });
    const message = new TransactionMessage({ payerKey: payer, recentBlockhash: lifetime.blockhash, instructions: [instruction] }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    const fee = (await rpc.getFeeForMessage(message)).value;
    if (fee === null || await rpc.getBalance(payer) < fee) throw new Error("Нужны тестовые SOL в Devnet для комиссии");
    if ((await rpc.simulateTransaction(tx, { sigVerify: false, commitment: "confirmed" })).value.err) throw new Error("Проверка Memo не прошла");
    onState(`Подтвердите в Phantom: публичный Memo в Devnet, комиссия ${fee / 1e9} тестовых SOL. Перевода SOL другу нет.`);
    return tx;
  }, 15000, signal);
  if (signal?.aborted || !provider.publicKey?.equals(payer)) throw new Error("Действие отменено или кошелёк изменился");
  // Signing cannot be cancelled inside Phantom; never submit a late signature.
  let timer;
  const signed = await Promise.race([provider.signTransaction(transaction), new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Подпись не получена. Закройте запрос Phantom и попробуйте снова")), 60000);
  })]).finally(() => clearTimeout(timer));
  if (signal?.aborted || !provider.publicKey?.equals(payer)) throw new Error("Отправка отменена");
  onState("Отправляем записку в Devnet…");
  try {
    return await bounded(rpc => rpc.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: "confirmed", maxRetries: 0 }), 15000, signal);
  } catch (error) {
    // An RPC timeout does not prove that submission failed. Keep the signed ID.
    error.signature = signatureText(signed.signatures[0]);
    throw error;
  }
}
