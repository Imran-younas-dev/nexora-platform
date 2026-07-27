'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type Incident = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  severity: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/incidents`);
      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }
      const data = (await response.json()) as Incident[];
      setIncidents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reach the API. Is the backend running?',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Create failed with ${response.status}`);
      }

      setTitle('');
      setDescription('');
      await loadIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          Nexora · Phase 0
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Incidents
        </h1>
        <p className="max-w-xl text-base leading-7 text-zinc-600">
          Foundation check: the web app talks to the Nest API and Postgres.
          Auth, AI triage, and queues come in later phases.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-zinc-900">Create incident</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
            required
            minLength={3}
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create'}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-900">Open list</h2>
          <button
            type="button"
            onClick={() => void loadIncidents()}
            className="text-sm text-zinc-600 underline-offset-2 hover:underline"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : incidents.length === 0 ? (
          <p className="text-sm text-zinc-500">No incidents yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 border border-zinc-200">
            {incidents.map((incident) => (
              <li key={incident.id} className="space-y-1 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-950">
                    {incident.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {incident.status} · {incident.severity}
                  </span>
                </div>
                {incident.description ? (
                  <p className="text-sm text-zinc-600">{incident.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
