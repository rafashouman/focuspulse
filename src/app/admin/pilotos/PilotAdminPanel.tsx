"use client";

import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { Lock, LogOut, MessageCircle, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase/client";

const ADMIN_EMAIL = "contato@focuspulse.site";
const db = getFirestore(auth.app);
const STATUSES = ["novo", "contatado", "cotado", "fechado", "perdido"];
const MODALITY_LABELS: Record<string, string> = {
  agricola: "Aviação Agrícola",
  executivo: "Executiva / Táxi Aéreo",
  comercial: "Linha Aérea",
  helicoptero: "Helicópteros",
  instrucao: "Instrução / Geral",
};

interface PilotLeadRecord {
  id: string;
  name: string;
  whatsapp: string;
  modality: string;
  capitalInsured: number;
  status: string;
  createdAt: number;
  deleteAfter: number;
}

const EMPTY_LEADS: PilotLeadRecord[] = [];

function toLeadRecord(id: string, data: DocumentData): PilotLeadRecord {
  return {
    id,
    name: String(data.name ?? ""),
    whatsapp: String(data.whatsapp ?? ""),
    modality: String(data.modality ?? ""),
    capitalInsured: Number(data.capitalInsured ?? 0),
    status: String(data.status ?? "novo"),
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : 0,
    deleteAfter:
      data.deleteAfter instanceof Timestamp ? data.deleteAfter.toMillis() : 0,
  };
}

const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export default function PilotAdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState<PilotLeadRecord[] | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [filter, setFilter] = useState("todos");
  const [pending, startTransition] = useTransition();

  useEffect(
    () =>
      onAuthStateChanged(
        auth,
        (nextUser) => {
          if (nextUser && nextUser.email !== ADMIN_EMAIL) {
            void signOut(auth).catch((authError) => {
              console.error("Could not end an unauthorized Costi session.", authError);
            });
            setUser(null);
            setError("Esta conta não tem acesso ao painel Costi.");
          } else {
            setUser(nextUser);
            if (!nextUser) setLeads(null);
            setError("");
          }
          setAuthLoading(false);
        },
        (authError) => {
          console.error("Could not verify the Costi panel session.", authError);
          setError("Não foi possível verificar o acesso. Atualize a página.");
          setAuthLoading(false);
        }
      ),
    []
  );

  useEffect(() => {
    if (!user) return;
    const leadsQuery = query(
      collection(db, "pilot_leads"),
      orderBy("createdAt", "desc"),
      limit(500)
    );

    return onSnapshot(
      leadsQuery,
      (snapshot) => {
        setLeads(snapshot.docs.map((lead) => toLeadRecord(lead.id, lead.data())));
      },
      (loadError) => {
        console.error("Could not load Costi leads.", loadError);
        setNotice({
          type: "error",
          message: "Não foi possível carregar os leads. Confira as regras do Firestore.",
        });
        setLeads([]);
      }
    );
  }, [user]);

  const currentLeads = leads ?? EMPTY_LEADS;
  const visible = useMemo(
    () =>
      filter === "todos"
        ? currentLeads
        : currentLeads.filter((lead) => lead.status === filter),
    [currentLeads, filter]
  );

  const run = (task: () => Promise<unknown>) => {
    setNotice(null);
    startTransition(async () => {
      try {
        await task();
      } catch (actionError) {
        console.error("Could not update Costi leads.", actionError);
        setNotice({
          type: "error",
          message: "Não foi possível concluir a ação. Tente novamente.",
        });
      }
    });
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        setPassword("");
      } catch (loginError) {
        console.error("Could not sign into the Costi lead panel.", loginError);
        setError("Senha inválida. Tente novamente.");
      }
    });
  };

  const removeExpiredLeads = () => {
    if (!confirm("Excluir permanentemente os leads com prazo de retenção vencido?")) {
      return;
    }

    run(async () => {
      const cutoff = Timestamp.now();
      let deletedCount = 0;

      while (true) {
        const expired = await getDocs(
          query(
            collection(db, "pilot_leads"),
            where("deleteAfter", "<=", cutoff),
            limit(450)
          )
        );
        if (expired.empty) break;

        const batch = writeBatch(db);
        expired.docs.forEach((lead) => batch.delete(lead.ref));
        await batch.commit();
        deletedCount += expired.size;
      }

      setNotice({
        type: "success",
        message: `${deletedCount} lead(s) expirado(s) removido(s).`,
      });
    });
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Verificando acesso...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <form
          className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-8"
          onSubmit={handleLogin}
        >
          <div className="flex items-center gap-2 text-orange-500">
            <Lock size={20} />
            <h1 className="text-lg font-bold text-white">Leads Costi</h1>
          </div>
          <p className="text-sm text-slate-400">{ADMIN_EMAIL}</p>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            required
            className="w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-orange-500"
          />
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button
            disabled={pending || !password}
            className="w-full rounded-lg bg-orange-600 py-3 font-bold hover:bg-orange-500 disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Leads • Seguro para Pilotos</h1>
            <p className="text-sm text-slate-400">
              {currentLeads.length} leads •{" "}
              {currentLeads.filter((lead) => lead.status === "novo").length} novos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="todos">Todos</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={pending}
              onClick={removeExpiredLeads}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 size={14} /> Limpar expirados
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => signOut(auth))}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </header>

        {notice && (
          <p
            role={notice.type === "error" ? "alert" : "status"}
            className={`mb-4 text-sm ${
              notice.type === "error" ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {notice.message}
          </p>
        )}

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Modalidade</th>
                <th className="p-3">Capital</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => {
                const digits = lead.whatsapp.replace(/\D/g, "");
                const phone = digits.startsWith("55") ? digits : `55${digits}`;
                return (
                  <tr key={lead.id} className="border-t border-white/5">
                    <td className="p-3 text-slate-400">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleString("pt-BR")
                        : "—"}
                    </td>
                    <td className="p-3 font-semibold">
                      {lead.name}
                      <div className="text-xs font-normal text-slate-400">{lead.whatsapp}</div>
                    </td>
                    <td className="p-3">{MODALITY_LABELS[lead.modality] ?? lead.modality}</td>
                    <td className="p-3">{brl(lead.capitalInsured)}</td>
                    <td className="p-3">
                      <select
                        value={lead.status}
                        disabled={pending}
                        onChange={(event) =>
                          run(() =>
                            updateDoc(doc(db, "pilot_leads", lead.id), {
                              status: event.target.value,
                            })
                          )
                        }
                        className="rounded-md border border-white/10 bg-slate-800 px-2 py-1"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="flex gap-2 p-3">
                      <a
                        href={`https://wa.me/${phone}?text=${encodeURIComponent(
                          `Olá ${lead.name}, aqui é da Costi Seguros. Recebi seu pedido de cotação de seguro para pilotos.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-green-600 p-2 hover:bg-green-500"
                        aria-label="Chamar no WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`Excluir o lead de ${lead.name}?`)) {
                            run(() => deleteDoc(doc(db, "pilot_leads", lead.id)));
                          }
                        }}
                        className="rounded-md bg-red-600/80 p-2 hover:bg-red-500"
                        aria-label="Excluir lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {leads === null ? "Carregando leads..." : "Nenhum lead encontrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
