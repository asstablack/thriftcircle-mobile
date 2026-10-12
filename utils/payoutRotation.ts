type Member = {
  userId: { _id: string } | null;
  payoutOrder: number;
};
type Payout = {
  status: string;
  recipientId: string | { _id: string } | null;
};

export function paidRecipients(payouts: Payout[]) {
  return new Set(
    payouts
      .filter((p) => p.status === 'completed')
      .map((p) =>
        typeof p.recipientId === 'string'
          ? p.recipientId
          : p.recipientId?._id,
      )
      .filter((id): id is string => !!id),
  );
}

export function rotationProgress(
  members: Member[],
  payouts: Payout[],
) {
  const ids = new Set(
    members
      .map((m) => m.userId?._id)
      .filter((id): id is string => !!id),
  );
  const paid = paidRecipients(payouts);
  const received = [...ids].filter((id) =>
    paid.has(id),
  ).length;
  return {
    total: members.length,
    received,
    complete:
      members.length > 0 &&
      ids.size === members.length &&
      received === members.length,
  };
}

export function validateRemainingOrder(
  members: Member[],
  proposed: { userId: string; payoutOrder: number }[],
  locked: Set<string>,
) {
  const remaining = members.filter(
    (m) => m.userId && !locked.has(m.userId._id),
  );
  const slots = new Set(
    remaining.map((m) => m.payoutOrder),
  );
  const ids = new Set(remaining.map((m) => m.userId!._id));
  if (
    members.some(
      (m) =>
        !m.userId ||
        !Number.isInteger(m.payoutOrder) ||
        m.payoutOrder < 1,
    ) ||
    new Set(members.map((m) => m.payoutOrder)).size !==
      members.length ||
    proposed.length !== remaining.length ||
    new Set(proposed.map((p) => p.userId)).size !==
      remaining.length ||
    new Set(proposed.map((p) => p.payoutOrder)).size !==
      slots.size ||
    proposed.some(
      (p) =>
        !ids.has(p.userId) || !slots.has(p.payoutOrder),
    )
  ) {
    throw new Error(
      'The payout order changed or contains locked members. Refresh and review the remaining members again.',
    );
  }
}
