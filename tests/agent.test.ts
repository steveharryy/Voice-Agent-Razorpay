
import { processCustomerInput, AgentResponse, generateInitialGreeting } from '../src/lib/agent';
import { CustomerRecord, CallLogItem } from '../src/types';
import { INITIAL_CUSTOMERS } from '../src/data/customers';

const c = (idx: number): CustomerRecord => INITIAL_CUSTOMERS[idx];
const emptyHistory: CallLogItem[] = [];

function firstReply(customer: CustomerRecord): CallLogItem[] {
  return [
    { id: '1', timestamp: new Date().toISOString(), sender: 'agent', message: generateInitialGreeting(customer) },
    { id: '2', timestamp: new Date().toISOString(), sender: 'customer', message: 'yes speaking' },
  ];
}

function multiTurnHistory(customer: CustomerRecord, turns: string[]): CallLogItem[] {
  const history: CallLogItem[] = [
    { id: '0', timestamp: new Date().toISOString(), sender: 'agent', message: generateInitialGreeting(customer) },
  ];
  turns.forEach((msg, i) => {
    history.push({ id: String(i + 1), timestamp: new Date().toISOString(), sender: i % 2 === 0 ? 'customer' : 'agent', message: msg });
  });
  return history;
}

interface TestCase {
  id: number;
  category: string;
  description: string;
  customer: CustomerRecord;
  input: string;
  history: CallLogItem[];
  assertions: (result: AgentResponse, customer: CustomerRecord) => string | null;
}

const tests: TestCase[] = [];
let nextId = 1;
function t(category: string, description: string, customer: CustomerRecord, input: string, history: CallLogItem[], assertions: (r: AgentResponse, c: CustomerRecord) => string | null) {
  tests.push({ id: nextId++, category, description, customer, input, history, assertions });
}

t('Negation', "Detects \"didn't pay\" negation", c(0), "I didn't pay actually", firstReply(c(0)),
  (r) => r.replyText.includes('good one') || r.replyText.includes('humor') ? null : 'Should detect negation');

t('Negation', "Detects \"did not pay\" negation", c(1), "I did not pay for that", firstReply(c(1)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "did not"');

t('Negation', "Detects \"haven't paid\"", c(2), "I haven't paid anything", firstReply(c(2)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "haven\'t"');

t('Negation', "Detects \"have not paid\"", c(3), "I have not paid this bill", firstReply(c(3)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "have not"');

t('Negation', "Detects \"not paid\"", c(4), "This is not paid yet you know", firstReply(c(4)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "not paid"');

t('Negation', "Detects \"never paid\"", c(5), "I never paid for this subscription", firstReply(c(5)),
  (r) => r.replyText.includes('humor') || r.replyText.includes('good one') ? null : 'Should detect "never paid"');

t('Negation', "Detects \"fooled\" prank", c(0), "haha I fooled you there", firstReply(c(0)),
  (r) => r.replyText.includes('good one') ? null : 'Should detect "fooled"');

t('Negation', "Detects \"kidding\" prank", c(1), "I was just kidding bro", firstReply(c(1)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "kidding"');

t('Negation', "Detects \"lied\" admission", c(2), "I lied about making the payment", firstReply(c(2)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "lied"');

t('Negation', "Detects \"prank\" word", c(3), "That was just a prank", firstReply(c(3)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "prank"');

t('Negation', "Detects \"fake\" claim", c(4), "that payment confirmation was fake", firstReply(c(4)),
  (r) => r.replyText.includes('humor') ? null : 'Should detect "fake"');

t('Negation', "Negation includes customer name", c(0), "I didn't pay", firstReply(c(0)),
  (r) => r.replyText.includes(c(0).name) ? null : 'Reply should address customer by name');

t('Negation', "Negation includes amount", c(0), "I didn't pay", firstReply(c(0)),
  (r) => r.replyText.includes(String(c(0).amount)) ? null : 'Reply should include pending amount');

t('Negation', "Negation includes merchant name", c(0), "I fooled you lol", firstReply(c(0)),
  (r) => r.replyText.includes(c(0).merchantName) ? null : 'Reply should include merchant name');

t('Negation', "Negation offers payment link as next step", c(0), "I didn't pay", firstReply(c(0)),
  (r) => r.nextSuggestedReplies.some(s => s.toLowerCase().includes('whatsapp') || s.toLowerCase().includes('link')) ? null : 'Should suggest payment link');

t('PriorPay', "Detects \"already paid\"", c(0), "I already paid this amount", firstReply(c(0)),
  (r) => r.replyText.includes('debited') || r.replyText.includes('ledger') ? null : 'Should handle already paid claim');

t('PriorPay', "Detects \"paid already\"", c(1), "I paid already last night", firstReply(c(1)),
  (r) => r.replyText.includes('ledger') || r.replyText.includes('failed') ? null : 'Should handle "paid already"');

t('PriorPay', "Detects \"paid it already\"", c(2), "I paid it already via UPI", firstReply(c(2)),
  (r) => r.replyText.includes('failed') ? null : 'Should handle "paid it already"');

t('PriorPay', "Detects \"already done\"", c(3), "The payment is already done", firstReply(c(3)),
  (r) => r.replyText.includes('ledger') || r.replyText.includes('failed') ? null : 'Should handle "already done"');

t('PriorPay', "Detects \"money was deducted\"", c(4), "The money was deducted from my bank", firstReply(c(4)),
  (r) => r.replyText.includes('reverse') || r.replyText.includes('48') ? null : 'Should explain reversal');

t('PriorPay', "Detects \"money got deducted\"", c(5), "money got deducted yesterday", firstReply(c(5)),
  (r) => r.replyText.includes('reverse') || r.replyText.includes('48') ? null : 'Should explain reversal');

t('PriorPay', "Detects \"amount was deducted\"", c(6), "the amount was deducted from my account", firstReply(c(6)),
  (r) => r.replyText.includes('reverse') || r.replyText.includes('48') || r.replyText.includes('failed') ? null : 'Should handle amount deducted');

t('PriorPay', "Detects \"amount debited\"", c(7), "the full amount debited from my savings", firstReply(c(7)),
  (r) => r.replyText.includes('failed') || r.replyText.includes('ledger') ? null : 'Should handle "amount debited"');

t('PriorPay', "Detects \"money debited\"", c(8), "money debited but no confirmation", firstReply(c(8)),
  (r) => r.replyText.includes('failed') || r.replyText.includes('reverse') ? null : 'Should handle "money debited"');

t('PriorPay', "Detects \"debited from my\"", c(9), "already debited from my account", firstReply(c(9)),
  (r) => r.replyText.includes('failed') || r.replyText.includes('reverse') ? null : 'Should handle "debited from my"');

t('PriorPay', "Detects \"cut from my\"", c(0), "amount cut from my account", firstReply(c(0)),
  (r) => r.replyText.includes('reverse') || r.replyText.includes('failed') ? null : 'Should handle "cut from my"');

t('PriorPay', "Detects \"already charged\"", c(1), "I was already charged for this", firstReply(c(1)),
  (r) => r.replyText.includes('failed') || r.replyText.includes('ledger') ? null : 'Should handle "already charged"');

t('PriorPay', "Detects \"paid before\"", c(2), "But I paid this before calling", firstReply(c(2)),
  (r) => r.replyText.includes('failed') ? null : 'Should handle "paid before"');

t('PriorPay', "Detects \"paid yesterday\"", c(3), "I paid yesterday afternoon", firstReply(c(3)),
  (r) => r.replyText.includes('failed') || r.replyText.includes('ledger') ? null : 'Should handle "paid yesterday"');

t('PriorPay', "Detects \"paid this morning\"", c(4), "I paid this morning via neft", firstReply(c(4)),
  (r) => r.replyText.includes('failed') ? null : 'Should handle "paid this morning"');

t('JustPaid', "Detects \"paid the link\"", c(0), "I just paid the link you sent", firstReply(c(0)),
  (r) => r.isCallCompleted === true && r.replyText.includes('verified') ? null : 'Should confirm payment and complete call');

t('JustPaid', "Detects \"paid via link\"", c(1), "paid via link right now", firstReply(c(1)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call on "paid via link"');

t('JustPaid', "Detects \"just paid\"", c(2), "just paid it from my gpay", firstReply(c(2)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call on "just paid"');

t('JustPaid', "Detects \"completed the payment\"", c(3), "I completed the payment successfully", firstReply(c(3)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"done with payment\"", c(4), "I am done with payment", firstReply(c(4)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"payment is done\"", c(5), "the payment is done now", firstReply(c(5)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"done paying\"", c(6), "I am done paying you", firstReply(c(6)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"i have paid now\"", c(7), "i have paid now check it", firstReply(c(7)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"payment completed\"", c(8), "payment completed from my side", firstReply(c(8)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('JustPaid', "Detects \"transferred via upi\"", c(9), "transferred via upi to your account", firstReply(c(9)),
  (r) => r.isCallCompleted === true ? null : 'Should complete call');

t('Identity', "Confirms identity with \"yes\"", c(0), "yes", emptyHistory,
  (r) => r.replyText.includes('confirming') || r.replyText.includes('Thank you') ? null : 'Should acknowledge confirmation');

t('Identity', "Confirms identity with \"speaking\"", c(1), "speaking", emptyHistory,
  (r) => r.replyText.includes('confirming') || r.replyText.includes('Thank you') ? null : 'Should acknowledge "speaking"');

t('Identity', "Confirms identity with \"this is\"", c(2), "this is Rajesh", emptyHistory,
  (r) => r.replyText.includes(c(2).name) ? null : 'Should use customer name');

t('Identity', "Confirms identity with \"yeah\"", c(3), "yeah that's me", emptyHistory,
  (r) => r.replyText.includes('confirming') || r.replyText.includes('Thank you') ? null : 'Should acknowledge "yeah"');

t('Identity', "Confirms identity with \"yep\"", c(4), "yep", emptyHistory,
  (r) => r.replyText.includes('confirming') || r.replyText.includes('Thank you') ? null : 'Should acknowledge "yep"');

t('Identity', "Confirms with \"hello yes\"", c(5), "hello yes I am Priya", emptyHistory,
  (r) => r.replyText.includes(c(5).amount.toString()) ? null : 'Should mention the pending amount');

t('Identity', "Confirms with \"hi\"", c(6), "hi there", emptyHistory,
  (r) => r.replyText.includes(c(6).merchantName) ? null : 'Should mention merchant');

t('Identity', "Identity confirmation includes failure reason", c(0), "yes speaking", emptyHistory,
  (r) => r.replyText.includes('low balance') || r.replyText.includes('balance') || r.replyText.includes('insufficient') || r.replyText.includes(c(0).mandateDetails.bankOrProvider) ? null : 'Should explain failure reason');

t('Identity', "Only triggers on first customer message", c(0), "yes I got it",
  multiTurnHistory(c(0), ['yes speaking', 'Your payment...', 'ok tell me more', 'Sure here...']),
  (r) => !r.replyText.includes('confirming') ? null : 'Should NOT trigger identity confirmation on subsequent yes');

t('Identity', "Suggests payment link and retry after identity confirm", c(0), "yes", emptyHistory,
  (r) => r.nextSuggestedReplies.some(s => s.toLowerCase().includes('link') || s.toLowerCase().includes('whatsapp')) ? null : 'Should suggest payment link');

t('FailReason', "Asks \"why did it fail\"", c(0), "why did my payment fail?", firstReply(c(0)),
  (r) => r.replyText.includes(c(0).razorpayErrorCode) ? null : 'Should include error code');

t('FailReason', "Asks for \"reason\"", c(1), "what is the reason for this failure", firstReply(c(1)),
  (r) => r.replyText.includes('gateway') || r.replyText.includes(c(1).razorpayErrorCode) || r.replyText.includes('failure') ? null : 'Should explain failure reason');

t('FailReason', "Asks \"what happened\"", c(2), "what happened to my payment", firstReply(c(2)),
  (r) => r.replyText.includes('gateway') || r.replyText.includes(c(2).razorpayErrorCode) ? null : 'Should explain what happened');

t('FailReason', "Asks to \"explain\"", c(3), "can you explain the issue?", firstReply(c(3)),
  (r) => r.replyText.includes(c(3).razorpayErrorCode) ? null : 'Should explain with error code');

t('FailReason', "Asks about \"error\"", c(4), "I see an error on my app", firstReply(c(4)),
  (r) => r.replyText.includes(c(4).razorpayErrorCode) ? null : 'Should include error code');

t('FailReason', "Asks about \"decline\"", c(5), "why was it declined by the bank?", firstReply(c(5)),
  (r) => r.replyText.includes(c(5).phone) ? null : 'Should include phone number for link delivery');

t('FailReason', "Failure reason response includes merchant name", c(6), "why did it fail?", firstReply(c(6)),
  (r) => r.replyText.includes(c(6).merchantName) ? null : 'Should include merchant name');

t('FailReason', "Failure reason response offers next steps", c(7), "explain why it failed", firstReply(c(7)),
  (r) => r.nextSuggestedReplies.length >= 2 ? null : 'Should offer at least 2 next steps');

t('FailReason', "Includes phone in failure reason reply", c(8), "tell me the reason please", firstReply(c(8)),
  (r) => r.replyText.includes(c(8).phone) ? null : 'Should include customer phone');

t('FailReason', "Does NOT complete call on failure query", c(9), "why did this happen?", firstReply(c(9)),
  (r) => r.isCallCompleted !== true ? null : 'Should NOT complete call');

t('Security', "Handles \"is this safe?\"", c(0), "is this payment link safe?", firstReply(c(0)),
  (r) => r.replyText.includes('PCI-DSS') || r.replyText.includes('RBI') ? null : 'Should mention security standards');

t('Security', "Handles \"scam\" concern", c(1), "this sounds like a scam", firstReply(c(1)),
  (r) => r.replyText.includes('NEVER') || r.replyText.includes('never') ? null : 'Should assure never asks for PIN');

t('Security', "Handles \"fraud\" concern", c(2), "Is this some kind of fraud?", firstReply(c(2)),
  (r) => r.replyText.includes('PCI-DSS') || r.replyText.includes('encrypted') ? null : 'Should mention encryption');

t('Security', "Handles OTP concern", c(3), "will you ask for my OTP?", firstReply(c(3)),
  (r) => r.replyText.includes('NEVER') || r.replyText.includes('never') ? null : 'Should assure no OTP request');

t('Security', "Handles PIN concern", c(4), "you're not going to ask for my pin right?", firstReply(c(4)),
  (r) => r.replyText.includes('NEVER') || r.replyText.includes('never') ? null : 'Should assure no PIN request');

t('Security', "Handles \"security\" question", c(5), "what security measures do you have?", firstReply(c(5)),
  (r) => r.replyText.includes('256') || r.replyText.includes('encrypted') || r.replyText.includes('PCI') ? null : 'Should mention encryption level');

t('Security', "Handles \"trust\" concern", c(6), "how can I trust this call?", firstReply(c(6)),
  (r) => r.replyText.includes('Razorpay') ? null : 'Should mention Razorpay');

t('Security', "Handles \"genuine\" query", c(7), "is this genuine or a fake call?", firstReply(c(7)),
  (r) => r.replyText.includes('RBI') || r.replyText.includes('PCI') ? null : 'Should reference standards');

t('PayLink', "Requests via \"send link\"", c(0), "yes send me the link", multiTurnHistory(c(0), ['yes speaking', 'Thank you for confirming...']),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should take SEND_PAYMENT_LINK action');

t('PayLink', "Requests via \"WhatsApp\"", c(1), "send it on whatsapp", firstReply(c(1)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' && r.actionDetails?.channel === 'WhatsApp' ? null : 'Should send via WhatsApp');

t('PayLink', "Requests via \"SMS\"", c(2), "can you send it via sms?", firstReply(c(2)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' && r.actionDetails?.channel === 'SMS' ? null : 'Should send via SMS');

t('PayLink', "Requests via \"UPI\"", c(3), "let me pay via upi", firstReply(c(3)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should trigger payment link');

t('PayLink', "Requests via \"GPay\"", c(4), "I'll pay through gpay", firstReply(c(4)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should trigger payment link');

t('PayLink', "Requests via \"PhonePe\"", c(5), "send me phonepe link", firstReply(c(5)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should trigger payment link');

t('PayLink', "Requests \"QR code\"", c(6), "can you share a qr code?", firstReply(c(6)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should trigger payment link');

t('PayLink', "Requests \"pay now\"", c(7), "let me pay now", firstReply(c(7)),
  (r) => r.actionTaken === 'SEND_PAYMENT_LINK' ? null : 'Should trigger payment link');

t('PayLink', "Payment link includes amount", c(0), "send me the link", firstReply(c(0)),
  (r) => r.actionDetails?.amount === c(0).amount ? null : 'Amount should match customer record');

t('PayLink', "Payment link generates unique URL", c(0), "send me the link", firstReply(c(0)),
  (r) => r.actionDetails?.paymentLinkUrl?.startsWith('https://rzp.io/i/') ? null : 'Should generate rzp.io URL');

t('Retry', "Schedules for \"tomorrow\"", c(0), "can you retry tomorrow?", firstReply(c(0)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' && r.isCallCompleted === true ? null : 'Should schedule retry and complete call');

t('Retry', "Schedules for \"later\"", c(1), "try later please", firstReply(c(1)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Handles \"retry\" keyword", c(2), "please retry the payment", firstReply(c(2)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Handles \"schedule\" keyword", c(3), "schedule it for later", firstReply(c(3)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Handles \"next week\"", c(4), "try next week", firstReply(c(4)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Handles \"monday\"", c(5), "please retry on monday", firstReply(c(5)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Handles \"salary\" context", c(6), "my salary comes on 5th, try after salary", firstReply(c(6)),
  (r) => r.actionTaken === 'SCHEDULE_RETRY' ? null : 'Should schedule retry');

t('Retry', "Retry response includes bank/provider", c(0), "retry tomorrow morning", firstReply(c(0)),
  (r) => r.replyText.includes(c(0).mandateDetails.bankOrProvider) ? null : 'Should mention bank/provider');

t('ImmRetry', "Handles \"added funds\"", c(0), "I added funds to my account, try again", firstReply(c(0)),
  (r) => r.actionTaken === 'RETRY_NOW' && r.isCallCompleted === true ? null : 'Should retry now and complete call');

t('ImmRetry', "Handles \"added money\"", c(1), "I added money just now", firstReply(c(1)),
  (r) => r.actionTaken === 'RETRY_NOW' ? null : 'Should retry now');

t('ImmRetry', "Handles \"topped up\"", c(2), "my account is topped up", firstReply(c(2)),
  (r) => r.actionTaken === 'RETRY_NOW' ? null : 'Should retry now');

t('ImmRetry', "Handles \"try again now\"", c(3), "please try again now", firstReply(c(3)),
  (r) => r.actionTaken === 'RETRY_NOW' ? null : 'Should retry now');

t('ImmRetry', "Handles \"retry now\"", c(4), "retry now please", firstReply(c(4)),
  (r) => r.actionTaken === 'RETRY_NOW' ? null : 'Should retry now');

t('Mandate', "Handles \"expired\" card", c(3), "my card expired last month", firstReply(c(3)),
  (r) => r.actionTaken === 'UPDATE_MANDATE' ? null : 'Should trigger mandate update');

t('Mandate', "Handles \"new card\"", c(3), "I have a new card now", firstReply(c(3)),
  (r) => r.actionTaken === 'UPDATE_MANDATE' ? null : 'Should trigger mandate update');

t('Mandate', "Handles \"switch card\"", c(9), "can I switch card for autopay?", firstReply(c(9)),
  (r) => r.actionTaken === 'UPDATE_MANDATE' ? null : 'Should trigger mandate update');

t('Mandate', "Handles \"update mandate\"", c(4), "I want to update mandate details", firstReply(c(4)),
  (r) => r.actionTaken === 'UPDATE_MANDATE' ? null : 'Should trigger mandate update');

t('Cancel', "Handles \"cancel subscription\"", c(0), "I want to cancel my subscription", firstReply(c(0)),
  (r) => r.actionTaken === 'ESCALATE_TO_HUMAN' && r.isCallCompleted === true ? null : 'Should escalate and complete');

t('Cancel', "Handles \"stop charging\"", c(1), "stop charging me please", firstReply(c(1)),
  (r) => r.actionTaken === 'ESCALATE_TO_HUMAN' ? null : 'Should escalate');

t('Cancel', "Handles \"dispute\"", c(2), "I want to dispute this charge", firstReply(c(2)),
  (r) => r.actionTaken === 'ESCALATE_TO_HUMAN' ? null : 'Should escalate');

t('Cancel', "Handles \"refund\"", c(3), "I need a refund for this", firstReply(c(3)),
  (r) => r.actionTaken === 'ESCALATE_TO_HUMAN' ? null : 'Should escalate');

t('Cancel', "Handles \"don't want\" subscription", c(4), "I don't want this anymore", firstReply(c(4)),
  (r) => r.actionTaken === 'ESCALATE_TO_HUMAN' ? null : 'Should escalate');

let passed = 0;
let failed = 0;
const failures: { id: number; category: string; description: string; reason: string }[] = [];

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║     Autopay Recovery Agent — 100 Test Cases                     ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log('');

const categoryResults: Record<string, { total: number; passed: number }> = {};

for (const tc of tests) {
  const result = processCustomerInput(tc.customer, tc.input, tc.history);
  const failureReason = tc.assertions(result, tc.customer);

  if (!categoryResults[tc.category]) {
    categoryResults[tc.category] = { total: 0, passed: 0 };
  }
  categoryResults[tc.category].total++;

  if (failureReason === null) {
    passed++;
    categoryResults[tc.category].passed++;
    console.log(`  ✅ #${String(tc.id).padStart(3, '0')} [${tc.category.padEnd(10)}] ${tc.description}`);
  } else {
    failed++;
    failures.push({ id: tc.id, category: tc.category, description: tc.description, reason: failureReason });
    console.log(`  ❌ #${String(tc.id).padStart(3, '0')} [${tc.category.padEnd(10)}] ${tc.description}`);
    console.log(`       └─ ${failureReason}`);
  }
}

console.log('');
console.log('────────────────────────────────────────────────────────────────────');
console.log('  CATEGORY BREAKDOWN');
console.log('────────────────────────────────────────────────────────────────────');
for (const [cat, stats] of Object.entries(categoryResults)) {
  const icon = stats.passed === stats.total ? '✅' : '⚠️';
  console.log(`  ${icon} ${cat.padEnd(12)} ${stats.passed}/${stats.total} passed`);
}

console.log('');
console.log('════════════════════════════════════════════════════════════════════');
console.log(`  TOTAL: ${passed}/${tests.length} passed, ${failed} failed`);
if (failed === 0) {
  console.log('  🎉 ALL 100 TESTS PASSED!');
} else {
  console.log(`  ⚠️  ${failed} TESTS FAILED:`);
  for (const f of failures) {
    console.log(`     #${f.id} [${f.category}] ${f.description}: ${f.reason}`);
  }
}
console.log('════════════════════════════════════════════════════════════════════');
console.log('');

process.exit(failed > 0 ? 1 : 0);
