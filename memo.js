import { Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const memoProgram = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const ui = Object.fromEntries(["connect", "wallet", "memo", "prepare", "send", "status", "signature", "read", "explorer", "memo-result"].map(id => [id, document.getElementById(id)]));
let provider;
let prepared = null;
let busy = false;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function refresh() {
  ui.connect.disabled = busy;
  ui.prepare.disabled = busy || !provider?.publicKey;
  ui.send.disabled = busy || !prepared;
  ui.read.disabled = busy;
  ui.memo.disabled = busy;
  ui.signature.disabled = busy;
}

async function run(action) {
  if (busy) return;
  busy = true;
  refresh();
  try {
    await action();
  } catch (error) {
    prepared = null;
    ui.status.textContent = error.code === 4001
      ? "Вы отменили действие в кошельке."
      : `Не удалось завершить действие: ${error.message}. Если запись уже отправлена, нажмите «Прочитать из Devnet»; не отправляйте её повторно.`;
  } finally {
    busy = false;
    refresh();
  }
}

function walletChanged() {
  prepared = null;
  ui.wallet.textContent = provider?.publicKey ? `Ваш адрес: ${provider.publicKey.toBase58()}` : "Кошелёк отключён.";
  ui.status.textContent = "Для новой записи сначала нажмите «Проверить запись».";
  refresh();
}

ui.connect.addEventListener("click", () => run(async () => {
  const detected = window.phantom?.solana;
  if (!detected?.isPhantom) {
    throw new Error("Phantom не найден. На компьютере откройте страницу в браузере с расширением Phantom. На телефоне используйте браузер внутри Phantom и HTTPS-адрес игры");
  }
  if (provider !== detected) {
    provider = detected;
    provider.on("accountChanged", walletChanged);
    provider.on("disconnect", walletChanged);
  }
  await provider.connect();
  walletChanged();
}));

ui.memo.addEventListener("input", () => { prepared = null; refresh(); });

ui.prepare.addEventListener("click", () => run(async () => {
  prepared = null;
  const text = ui.memo.value.trim();
  const data = new TextEncoder().encode(text);
  if (!data.length || data.length > 160) throw new Error("Введите от 1 до 160 байт текста. Русские буквы занимают больше одного байта");
  const payer = provider.publicKey;
  if (!payer) throw new Error("Подключите кошелёк");
  ui.status.textContent = "Проверяем комиссию и выполнение Memo в Devnet…";
  const lifetime = await connection.getLatestBlockhash();
  const instruction = new TransactionInstruction({
    programId: memoProgram,
    keys: [{ pubkey: payer, isSigner: true, isWritable: false }],
    data,
  });
  const message = new TransactionMessage({ payerKey: payer, recentBlockhash: lifetime.blockhash, instructions: [instruction] }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  const fee = (await connection.getFeeForMessage(message)).value;
  if (fee === null) throw new Error("Не удалось рассчитать комиссию. Повторите проверку");
  if (await connection.getBalance(payer) < fee) throw new Error("Недостаточно тестовых SOL. Получите их на Solana Faucet по ссылке выше");
  const simulation = await connection.simulateTransaction(transaction, { sigVerify: false, commitment: "confirmed" });
  if (simulation.value.err) throw new Error(`Проверка Memo не прошла: ${JSON.stringify(simulation.value.err)}`);
  if (!provider.publicKey?.equals(payer)) throw new Error("Кошелёк изменился. Повторите проверку");
  prepared = { transaction, lifetime, text, payer };
  ui.status.textContent = `Проверка успешна. Сеть: Solana Devnet.\nДействие: публичная запись Memo, без перевода средств получателю.\nТекст: ${text}\nКомиссия: ${fee / 1e9} тестовых SOL. Плательщик: ${payer.toBase58()}.\nНажмите «Подписать и записать», затем подтвердите в Phantom.`;
}));

function showSignature(signature) {
  ui.signature.value = signature;
  ui.explorer.href = `https://explorer.solana.com/tx/${encodeURIComponent(signature)}?cluster=devnet`;
  ui.explorer.hidden = false;
}

async function readMemo(signature, expected) {
  ui["memo-result"].textContent = "Читаем подтверждённую транзакцию из Devnet…";
  let transaction;
  // Confirmed transactions may take a few seconds to reach the RPC history.
  for (let attempt = 0; attempt < 12; attempt++) {
    transaction = await connection.getParsedTransaction(signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
    if (transaction) break;
    await pause(1500);
  }
  if (!transaction) throw new Error("Транзакция пока не найдена в Devnet. Подождите и повторите чтение");
  if (!transaction.meta || transaction.meta.err) throw new Error("Транзакция не выполнена успешно");
  const memo = transaction.transaction.message.instructions.find(instruction => instruction.programId.equals(memoProgram) && typeof instruction.parsed === "string");
  if (!memo) throw new Error("В транзакции нет текстовой инструкции Memo");
  // Display only RPC data, never a local fallback or HTML from the chain.
  ui["memo-result"].textContent = memo.parsed;
  showSignature(signature);
  if (expected !== undefined && memo.parsed !== expected) throw new Error("Прочитанный Memo отличается от отправленного");
  ui.status.textContent = expected === undefined ? "Memo прочитан из Solana Devnet." : "Готово: запись подтверждена, прочитана из Devnet и совпадает с отправленным текстом.";
}

ui.send.addEventListener("click", () => run(async () => {
  const current = prepared;
  prepared = null;
  if (!current || !provider.publicKey?.equals(current.payer)) throw new Error("Сначала проверьте запись заново");
  if (await connection.getBlockHeight() > current.lifetime.lastValidBlockHeight) throw new Error("Проверка устарела. Нажмите «Проверить запись» ещё раз");
  ui.status.textContent = "Подтвердите запись в Phantom. Сеть — Devnet, списывается только комиссия в тестовых SOL.";
  const signed = await provider.signTransaction(current.transaction);
  // Submit through the fixed Devnet RPC, independently of the wallet's selected network.
  ui.status.textContent = "Отправляем Memo в Devnet…";
  const signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: "confirmed", maxRetries: 3 });
  showSignature(signature);
  ui.status.textContent = "Запись отправлена. Ждём подтверждения Devnet…";
  for (let attempt = 0; attempt < 30; attempt++) {
    const status = (await connection.getSignatureStatuses([signature])).value[0];
    if (status?.err) throw new Error(`Сеть отклонила транзакцию: ${JSON.stringify(status.err)}`);
    if (["confirmed", "finalized"].includes(status?.confirmationStatus)) {
      await readMemo(signature, current.text);
      return;
    }
    await pause(1500);
  }
  throw new Error("Подтверждение пока не получено. Номер транзакции сохранён в поле на странице");
}));

ui.read.addEventListener("click", () => run(async () => {
  const signature = ui.signature.value.trim();
  if (!/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(signature)) throw new Error("Вставьте полный номер транзакции Solana");
  await readMemo(signature);
}));
ui.status.textContent = "Подключите Phantom, чтобы записать Memo. Для чтения кошелёк не нужен.";
refresh();
