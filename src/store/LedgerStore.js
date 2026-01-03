export const ledgerStore = {
  entries: [],

  add(entry) {
    this.entries.unshift(entry);
  },

  post(id) {
    const e = this.entries.find((x) => x.id === id);
    if (e) e.status = "posted";
  },

  pending() {
    return this.entries.filter((e) => e.status === "pending");
  },

  posted() {
    return this.entries.filter((e) => e.status === "posted");
  },
};