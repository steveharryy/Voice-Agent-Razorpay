import { CustomerRecord, CallLogItem } from '@/types';

export interface AgentResponse {
  replyText: string;
  actionTaken?: 'SEND_PAYMENT_LINK' | 'SCHEDULE_RETRY' | 'RETRY_NOW' | 'UPDATE_MANDATE' | 'ESCALATE_TO_HUMAN';
  actionDetails?: Record<string, any>;
  nextSuggestedReplies: string[];
  isCallCompleted?: boolean;
}

export function generateInitialGreeting(customer: CustomerRecord): string {
  return `Hello ${customer.name}! This is Arya calling from Razorpay on behalf of ${customer.merchantName}. I'm reaching out regarding your ${customer.planName} autopay payment of ₹${customer.amount} that was due today. May I confirm if I am speaking with ${customer.name}?`;
}

export function processCustomerInput(
  customer: CustomerRecord,
  userInput: string,
  history: CallLogItem[]
): AgentResponse {
  const text = userInput.toLowerCase().trim();

  const hasNegation =
    text.includes("didn't") ||
    text.includes("did not") ||
    text.includes("haven't") ||
    text.includes("have not") ||
    text.includes("not paid") ||
    text.includes("never paid") ||
    text.includes("fooled") ||
    text.includes("kidding") ||
    text.includes("lied") ||
    text.includes("prank") ||
    (text.includes("fake") && !text.includes("fake call"));

  if (hasNegation) {
    return {
      replyText: `Haha, good one ${customer.name}! I appreciate your sense of humor. On a serious note, the ₹${customer.amount} autopay payment for ${customer.merchantName} (${customer.planName}) is genuinely still pending failure on our gateway. I can send you a 1-click Razorpay payment link right now on WhatsApp or SMS so you can clear it in 30 seconds via UPI. Would you like me to do that?`,
      nextSuggestedReplies: [
        'Yes, send the WhatsApp link',
        'Can you retry tomorrow morning?',
        'Why did my bank decline it?',
      ],
    };
  }

  const claimsAlreadyPaid =
    text.includes('already paid') ||
    text.includes('paid already') ||
    text.includes('paid it already') ||
    text.includes('already done') ||
    text.includes('already settled') ||
    text.includes('money was deducted') ||
    text.includes('money got deducted') ||
    text.includes('amount was deducted') ||
    text.includes('amount got deducted') ||
    text.includes('money debited') ||
    text.includes('amount debited') ||
    text.includes('debited from my') ||
    text.includes('cut from my') ||
    text.includes('already charged') ||
    (text.includes('paid') && (text.includes('already') || text.includes('before') || text.includes('earlier') || text.includes('yesterday') || text.includes('morning')));

  if (claimsAlreadyPaid) {
    return {
      replyText: `I completely understand, ${customer.name}. If funds were debited from your account, it often happens when the bank (${customer.mandateDetails.bankOrProvider}) initiates the charge but encounters a network timeout before confirming the settlement. In such cases, your bank will automatically reverse the full amount back to your account within 24 to 48 business hours. However, on our live merchant ledger, your ${customer.planName} subscription is currently marked as failed. Would you like me to send a 1-click payment link to prevent service interruption, or schedule a retry for tomorrow once your statement reconciles?`,
      nextSuggestedReplies: [
        'Send me the WhatsApp payment link',
        'Schedule a retry for tomorrow',
        'Why did my payment fail?',
        'Check my mandate details',
      ],
    };
  }

  const justPaidLink =
    text.includes('paid the link') ||
    text.includes('paid via link') ||
    text.includes('just paid') ||
    text.includes('completed the payment') ||
    text.includes('done with payment') ||
    text.includes('payment is done') ||
    text.includes('done paying') ||
    text.includes('i have paid now') ||
    text.includes('payment completed') ||
    text.includes('transferred via upi');

  if (justPaidLink) {
    return {
      replyText: `Fantastic! Our webhook has received and verified your payment of ₹${customer.amount}. Your ${customer.merchantName} subscription is active and in good standing. Thank you for choosing Razorpay. Have a wonderful day!`,
      nextSuggestedReplies: ['Thank you Arya!', 'Have a great day!'],
      isCallCompleted: true,
    };
  }

  const isFirstCustomerMessage = history.filter((h) => h.sender === 'customer').length <= 1;
  const isIdentityConfirmation =
    text === 'yes' ||
    text === 'yeah' ||
    text === 'yep' ||
    text === 'hi' ||
    text === 'hello' ||
    text.includes('speaking') ||
    /^(yes|yeah|yep|hi|hello)\b/.test(text) ||
    /\bthis is [a-z]/.test(text);

  const hasPaymentIntent =
    text.includes('send') ||
    text.includes('link') ||
    text.includes('cancel') ||
    text.includes('refund') ||
    text.includes('dispute') ||
    text.includes('pay');

  if (isFirstCustomerMessage && isIdentityConfirmation && !hasPaymentIntent) {
    const reasonText = getFailureReasonExplanation(customer);
    return {
      replyText: `Thank you for confirming, ${customer.name}. As mentioned, your scheduled recurring charge of ₹${customer.amount} for ${customer.merchantName} (${customer.planName}) could not be completed. ${reasonText} Would you prefer me to send an instant Razorpay Payment Link to your WhatsApp so you can clear this in 30 seconds via UPI, or would you like to schedule a retry?`,
      nextSuggestedReplies: [
        'Send me the WhatsApp payment link',
        'Can you retry tomorrow morning?',
        'Why did my bank decline it?',
        'I added funds, retry now',
      ],
    };
  }

  if (
    text.includes('why') ||
    text.includes('reason') ||
    text.includes('what happened') ||
    text.includes('explain') ||
    text.includes('error') ||
    text.includes('decline')
  ) {
    const detailedExplanation = getDetailedFailureReason(customer);
    return {
      replyText: `${detailedExplanation} To keep your ${customer.merchantName} subscription active without any interruption, I can send a 1-click Razorpay payment link to your registered mobile number ${customer.phone}, or schedule an automated retry. What would you like to do?`,
      nextSuggestedReplies: [
        'Send me the payment link',
        'Schedule a retry for tomorrow',
        'How safe is this payment link?',
      ],
    };
  }

  if (
    text.includes('safe') ||
    text.includes('scam') ||
    text.includes('fraud') ||
    text.includes('otp') ||
    text.includes('security') ||
    text.includes('trust') ||
    text.includes('genuine') ||
    (text.includes('pin') && !text.includes('opinion'))
  ) {
    return {
      replyText: `I completely understand your vigilance! Razorpay adheres to RBI guidelines and PCI-DSS Level 1 security. I will NEVER ask for your UPI PIN, OTP, CVV, or passwords over this call. The payment link will be sent directly from official Razorpay verified handles and opens a secure 256-bit encrypted checkout. Shall I send it to your WhatsApp now?`,
      nextSuggestedReplies: [
        'Yes, send the link to WhatsApp',
        'Send it via SMS instead',
        'Retry tomorrow instead',
      ],
    };
  }

  if (
    text.includes('cancel') ||
    text.includes('stop') ||
    text.includes('dispute') ||
    text.includes('not mine') ||
    text.includes('dont want') ||
    text.includes("don't want") ||
    text.includes('refund')
  ) {
    return {
      replyText: `I hear you, ${customer.name}. To ensure you are not charged inadvertently, I have paused future recurring debits for this plan and escalated your ticket to ${customer.merchantName}'s customer relationship desk. An executive will reach out to you within 2 business hours.`,
      actionTaken: 'ESCALATE_TO_HUMAN',
      actionDetails: {
        reason: 'Customer requested cancellation / dispute review',
      },
      nextSuggestedReplies: [
        'Thank you, appreciate it',
        'Have a good day',
      ],
      isCallCompleted: true,
    };
  }

  if (
    text.includes('send') ||
    text.includes('link') ||
    text.includes('whatsapp') ||
    text.includes('sms') ||
    text.includes('pay now') ||
    text.includes('pay link') ||
    text.includes('upi') ||
    text.includes('qr') ||
    text.includes('gpay') ||
    text.includes('phonepe')
  ) {
    const channel = text.includes('sms') ? 'SMS' : 'WhatsApp';
    const linkId = `plink_${Math.random().toString(36).substring(2, 9)}`;
    const linkUrl = `https://rzp.io/i/${linkId}`;

    return {
      replyText: `Done! I have generated a secure Razorpay Instant Payment Link for ₹${customer.amount} and dispatched it to your ${channel} at ${customer.phone}. You can tap it right now to pay via any UPI app, NetBanking, or Cards. You will also see it on your screen right now. Would you like me to hold while you complete it, or is there anything else I can help with?`,
      actionTaken: 'SEND_PAYMENT_LINK',
      actionDetails: {
        paymentLinkId: linkId,
        paymentLinkUrl: linkUrl,
        channel,
        amount: customer.amount,
      },
      nextSuggestedReplies: [
        'I am paying right now',
        'Received the link, thank you',
        'Can I update my autopay card as well?',
      ],
    };
  }

  if (
    text.includes('added funds') ||
    text.includes('added money') ||
    text.includes('topped up') ||
    text.includes('balance is available') ||
    text.includes('funds available') ||
    text.includes('try again now') ||
    text.includes('retry now')
  ) {
    return {
      replyText: `Excellent! Since you have topped up your account balance, I am initiating an immediate re-attempt via Razorpay Smart-Switch routing to ${customer.mandateDetails.bankOrProvider}. Please look out for the notification from your bank.`,
      actionTaken: 'RETRY_NOW',
      actionDetails: {
        timestamp: new Date().toISOString(),
      },
      nextSuggestedReplies: [
        'Great, thanks!',
        'Can you also send the receipt?',
      ],
      isCallCompleted: true,
    };
  }

  if (
    text.includes('tomorrow') ||
    text.includes('later') ||
    text.includes('retry') ||
    text.includes('schedule') ||
    text.includes('next week') ||
    text.includes('monday') ||
    text.includes('salary')
  ) {
    const retryDate = 'Tomorrow, 10:00 AM IST';
    return {
      replyText: `Understood, ${customer.name}. I have scheduled an automated smart retry for ${retryDate} on your ${customer.mandateDetails.bankOrProvider} account. We will notify you before the debit. Your ${customer.merchantName} access remains active in the meantime. Have a wonderful day ahead!`,
      actionTaken: 'SCHEDULE_RETRY',
      actionDetails: {
        retryDate,
        mandate: customer.mandateDetails.bankOrProvider,
      },
      nextSuggestedReplies: [
        'Thank you Arya',
        'Actually send the link instead',
      ],
      isCallCompleted: true,
    };
  }

  if (
    text.includes('expired') ||
    text.includes('new card') ||
    text.includes('switch card') ||
    text.includes('update mandate') ||
    text.includes('change bank')
  ) {
    return {
      replyText: `I can help you update your mandate immediately. I am sending a secure 1-click Mandate Update link to ${customer.phone}. You can authorize a fresh UPI Autopay mandate or add your new card in under 60 seconds with zero paperwork.`,
      actionTaken: 'UPDATE_MANDATE',
      actionDetails: {
        mandateType: 'UPI_AUTOPAY',
        phone: customer.phone,
      },
      nextSuggestedReplies: [
        'Send the mandate update link',
        'Thanks, that helps a lot',
      ],
    };
  }

  return {
    replyText: `I understand, ${customer.name}. To ensure your ${customer.merchantName} access continues without interruption, would you like me to send a WhatsApp payment link for ₹${customer.amount}, or would you prefer I schedule a retry for tomorrow?`,
    nextSuggestedReplies: [
      'Send me the WhatsApp payment link',
      'Schedule retry for tomorrow',
      'Why did it fail?',
    ],
  };
}

function getFailureReasonExplanation(customer: CustomerRecord): string {
  switch (customer.failureReason) {
    case 'INSUFFICIENT_FUNDS':
      return `Our system received a notification from ${customer.mandateDetails.bankOrProvider} indicating low balance at the time of debit.`;
    case 'MANDATE_EXPIRED':
      return `Your 1-year autopay mandate tenure with ${customer.mandateDetails.bankOrProvider} has ended, so it needs a quick 1-click renewal.`;
    case 'BANK_DOWNTIME':
      return `There was a temporary technical timeout on ${customer.mandateDetails.bankOrProvider}'s servers during processing.`;
    case 'CARD_EXPIRED':
      return `The registered card on file expired last month, causing the recurring authorization to fail.`;
    case 'MANDATE_LIMIT_EXCEEDED':
      return `The bill amount of ₹${customer.amount} was slightly higher than the mandate ceiling limit of ₹${customer.mandateDetails.mandateLimit}.`;
    case 'PAYMENT_DECLINED_BY_BANK':
      return `Your issuing bank temporarily restricted this e-commerce transaction under standard security checks.`;
    case 'ACCOUNT_KYC_PENDING':
      return `The debit was paused as your bank flagged a periodic KYC compliance update.`;
    case 'CUSTOMER_PAUSED_MANDATE':
      return `The mandate appears to be temporarily paused in your UPI app settings.`;
    case 'AUTHENTICATION_FAILED':
      return `The recurring 2FA step-up authentication challenge could not be completed.`;
    default:
      return 'The scheduled autopay charge could not be processed by your bank.';
  }
}

function getDetailedFailureReason(customer: CustomerRecord): string {
  return `According to the Razorpay gateway status (${customer.razorpayErrorCode}), the failure occurred because ${customer.failureDescription.toLowerCase()}`;
}
