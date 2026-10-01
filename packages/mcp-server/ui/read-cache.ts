// View-local, short-lived reads only. Never persisted across accounts or frames.
export class ReadCache {
  private entries = new Map<
    string,
    { value?: unknown; expires?: number; pending?: Promise<unknown> }
  >();
  private maximum: number;
  private ttl: number;
  constructor(maximum = 40, ttl = 30_000) {
    this.maximum = maximum;
    this.ttl = ttl;
  }

  seed(key: string, value: unknown) {
    if (!this.entries.has(key)) {
      this.makeRoom();
      if (this.entries.size >= this.maximum) return;
    }
    this.entries.set(key, { value, expires: Date.now() + this.ttl });
  }

  peek<T>(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry || entry.value === undefined || (entry.expires ?? 0) <= Date.now()) return undefined;
    return entry.value as T;
  }

  read<T>(key: string, load: () => Promise<T>, fresh = false): Promise<T> {
    const entry = this.entries.get(key);
    if (entry?.pending) return entry.pending as Promise<T>;
    const value = fresh ? undefined : this.peek<T>(key);
    if (value !== undefined) return Promise.resolve(value);
    this.entries.delete(key);
    this.makeRoom();
    if (this.entries.size >= this.maximum) return load();
    const next: { value?: unknown; expires?: number; pending?: Promise<unknown> } = {};
    const pending = Promise.resolve()
      .then(load)
      .then((data) => {
        if (this.entries.get(key) === next) {
          next.value = data;
          next.expires = Date.now() + this.ttl;
        }
        return data;
      })
      .catch((error: unknown) => {
        if (this.entries.get(key) === next) this.entries.delete(key);
        throw error;
      })
      .finally(() => {
        delete next.pending;
      });
    next.pending = pending;
    this.entries.set(key, next);
    return pending;
  }

  private makeRoom() {
    for (const [key, value] of this.entries) {
      if (this.entries.size < this.maximum) break;
      if (!value.pending) this.entries.delete(key);
    }
  }
}
