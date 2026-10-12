type Member = { userId: { _id: string } | null };
type Contribution = {
  memberId: string;
  cycleNumber: number;
  amount: number;
  status: string;
};

export function payoutReadiness(
  members: Member[],
  contributions: Contribution[],
  cycleNumber: number,
) {
  const records = contributions.filter(
    (item) => item.cycleNumber === cycleNumber,
  );
  const ready =
    members.length > 0 &&
    members.every((member) => {
      const obligations = records.filter(
        (item) => item.memberId === member.userId?._id,
      );
      return (
        obligations.length === 1 &&
        obligations[0].status === 'CONFIRMED'
      );
    });
  const total = records
    .filter((item) => item.status === 'CONFIRMED')
    .reduce((sum, item) => sum + item.amount, 0);
  return { ready, total };
}
