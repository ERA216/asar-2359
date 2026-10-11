import { Connection, PublicKey } from "@solana/web3.js";

export const devnetUrl = "https://api.devnet.solana.com";
export const connection = new Connection(devnetUrl, "confirmed");
export const memoProgram = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export async function fetchMemoTransaction(signature, rpc = connection) {
  return rpc.getParsedTransaction(signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
}

export function extractMemo(transaction) {
  if (!transaction?.meta || transaction.meta.err) throw new Error("Транзакция не выполнена успешно");
  const memo = transaction.transaction.message.instructions.find(instruction => instruction.programId.equals(memoProgram) && typeof instruction.parsed === "string");
  if (!memo) throw new Error("В транзакции нет текстовой инструкции Memo");
  return memo;
}
