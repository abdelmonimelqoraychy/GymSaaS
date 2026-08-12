export const members = [
  {
    id: 1,
    firstName: "Ahmed",
    lastName: "Benali",
    phone: "0612345678",
    subscription: "Premium",
    status: "ACTIVE",
  },
  {
    id: 2,
    firstName: "Sara",
    lastName: "Amrani",
    phone: "0623456789",
    subscription: "Basic",
    status: "EXPIRING_SOON",
  },
  {
    id: 3,
    firstName: "Youssef",
    lastName: "Alami",
    phone: "0634567890",
    subscription: "Premium",
    status: "EXPIRED",
  },
];

export const plans = [
  { id: 1, name: "Basic", durationDays: 30, price: 200 },
  { id: 2, name: "Premium", durationDays: 30, price: 350 },
];

export const payments = [
  { id: 1, member: "Ahmed Benali", amount: 350, method: "Cash", date: "2026-08-10" },
  { id: 2, member: "Sara Amrani", amount: 200, method: "Card", date: "2026-08-11" },
];
