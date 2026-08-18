"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Search, Sparkles, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, AtSign, Send, HelpCircle, Type, Edit2, Copy, Trash2, ChevronDown, Reply, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/sonner/CustomToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SaveBeforeCommentsWarning } from "./SaveBeforeCommentsWarning";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSession } from "@/common/interfaces/session";
import { useCommentsList, useCreateComment, useUpdateComment, useDeleteComment, useMentionableUsers } from "@/hooks/comments/useComments";
import type { CommentableType, Comment as ApiComment, CommentReply, MentionableUser } from "@/types/comment";
import { RemindersPanel } from "./reminder/RemindersPanel";

function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.innerText;
}

// El backend manda fechas como "DD/MM/YYYY HH:mm" (no ISO) — new Date() nativo
// las interpreta como MM/DD y devuelve "Invalid Date".
function parseApiDate(dateString?: string): Date | null {
  if (!dateString) return null;
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, day, month, year, hour, minute, second] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second || 0));
  }
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
}

// Fecha + hora completas (ej. "18/08/2026, 12:39 AM") — antes solo se mostraba
// la hora, lo que confundía comentarios de días distintos.
function formatDateTime(dateString?: string) {
  const d = parseApiDate(dateString) || new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day}/${month}/${d.getFullYear()}, ${time}`;
}

function initialsOf(name?: string) {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

const HELP_POPOVER = (
  <Popover>
    <PopoverTrigger asChild>
      <button className="ml-1.5 mb-0.5 text-primary hover:text-primary/80 transition-colors cursor-help">
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="center" sideOffset={8} className="w-[320px] p-0 rounded-xl overflow-hidden shadow-lg border-border">
      <div className="bg-[#DFF5F2] p-4 flex justify-center items-center relative">
        <div className="w-full max-w-[240px] bg-white rounded shadow-sm opacity-60 flex flex-col gap-2.5 p-3">
          <div className="w-1/2 h-2.5 bg-slate-200 rounded mb-1"></div>
          <div className="flex justify-between items-center"><div className="w-4 h-4 rounded-full bg-slate-200"></div><div className="w-4/5 h-2 bg-slate-100 rounded"></div></div>
          <div className="flex justify-between items-center"><div className="w-4 h-4 rounded-full bg-slate-200"></div><div className="w-4/5 h-2 bg-slate-100 rounded"></div></div>
          <div className="flex justify-between items-center"><div className="w-4 h-4 rounded-full bg-slate-200"></div><div className="w-4/5 h-2 bg-slate-100 rounded"></div></div>
          <div className="flex justify-between items-center"><div className="w-4 h-4 rounded-full bg-slate-200"></div><div className="w-4/5 h-2 bg-slate-100 rounded"></div></div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5 text-base">
          Control total 📋 <span className="text-[#F59E0B]">⚡</span>
        </h4>
        <p className="text-sm text-slate-500 mb-5">Revisa y crea recordatorios en segundos.</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400 font-medium">2 de 2</span>
          <button className="bg-[#36B3A4] hover:bg-[#2C9C8F] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5">
            Finalizar <span className="text-base leading-none">→</span>
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const EDITOR_STYLE = (
  <style dangerouslySetInnerHTML={{
    __html: `
    .editor-content [align="center"], .editor-content [style*="text-align: center"] { text-align: center !important; }
    .editor-content [align="right"], .editor-content [style*="text-align: right"] { text-align: right !important; }
    .editor-content [align="left"], .editor-content [style*="text-align: left"] { text-align: left !important; }
  `}} />
);

// ---------------------------------------------------------------------------
// Editor de texto enriquecido reutilizado para comentario nuevo / edición /
// respuesta. Incluye el picker de menciones "@" contra
// GET /comments/mentionable-users (ver comments-notifications.md).
// ---------------------------------------------------------------------------
function CommentEditor({
  initialHtml = "",
  placeholder,
  submitLabel,
  showFormattingByDefault = false,
  autoFocus = false,
  onSubmit,
  onCancel,
  submitting = false,
}: {
  initialHtml?: string;
  placeholder?: string;
  submitLabel: string;
  showFormattingByDefault?: boolean;
  autoFocus?: boolean;
  onSubmit: (html: string, mentionIds: number[]) => void;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(initialHtml);
  const [charCount, setCharCount] = useState(() => stripHtml(initialHtml).length);
  const [showFormatting, setShowFormatting] = useState(showFormattingByDefault);
  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, strikethrough: false,
    justifyLeft: false, justifyCenter: false, justifyRight: false,
    insertUnorderedList: false, insertOrderedList: false, formatBlock: 'DIV',
  });

  // id -> nombre visible de cada mención aún pendiente de enviar. Se usa
  // para "des-mencionar" si el usuario borra el "@Nombre" del texto.
  const mentionMapRef = useRef<Map<number, string>>(new Map());
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (initialHtml && editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
    }
    if (autoFocus) {
      setTimeout(() => editorRef.current?.focus(), 0);
    }
    // Solo al montar: es un editor "uncontrolled" (como el original).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(mentionQuery ?? ""), 250);
    return () => clearTimeout(t);
  }, [mentionQuery]);

  const syncHtml = () => {
    const el = editorRef.current;
    if (!el) return;
    const newHtml = el.innerHTML;
    setHtml(newHtml);
    setCharCount((el.innerText || "").length);

    // Reconciliar menciones: si el texto "@Nombre" ya no aparece, se quita del set.
    const plain = el.innerText || "";
    mentionMapRef.current.forEach((name, id) => {
      if (!plain.includes(`@${name}`)) {
        mentionMapRef.current.delete(id);
      }
    });
  };

  const updateActiveFormats = () => {
    const formats = {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      formatBlock: document.queryCommandValue("formatBlock")?.toUpperCase() || 'DIV',
    };
    setActiveFormats(formats);
  };

  const execFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
    syncHtml();
  };

  const detectMentionQuery = () => {
    const el = editorRef.current;
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (!el || !sel || sel.rangeCount === 0) { setMentionQuery(null); return; }
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer) || range.startContainer.nodeType !== Node.TEXT_NODE) {
      setMentionQuery(null);
      return;
    }
    const textBeforeCursor = (range.startContainer.textContent || "").slice(0, range.startOffset);
    const match = textBeforeCursor.match(/@([\p{L}\d_]*)$/u);
    setMentionQuery(match ? match[1] : null);
  };

  const handleInput = () => {
    syncHtml();
    detectMentionQuery();
  };

  const insertMention = (user: MentionableUser) => {
    const el = editorRef.current;
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (!el) return;

    if (sel && sel.rangeCount > 0 && sel.getRangeAt(0).startContainer.nodeType === Node.TEXT_NODE) {
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      const text = node.textContent || "";
      const beforeCursor = text.slice(0, range.startOffset);
      const match = beforeCursor.match(/@([\p{L}\d_]*)$/u);
      if (match) {
        const start = range.startOffset - match[0].length;
        const delRange = document.createRange();
        delRange.setStart(node, start);
        delRange.setEnd(node, range.startOffset);
        delRange.deleteContents();
        const mentionText = document.createTextNode(`@${user.name} `);
        delRange.insertNode(mentionText);
        const newRange = document.createRange();
        newRange.setStartAfter(mentionText);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    } else {
      el.appendChild(document.createTextNode(`@${user.name} `));
    }

    mentionMapRef.current.set(user.id, user.name);
    setMentionQuery(null);
    syncHtml();
    el.focus();
  };

  const insertAtSign = () => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, "@");
    syncHtml();
    detectMentionQuery();
  };

  const handleSubmit = () => {
    const plain = editorRef.current?.innerText || "";
    if (!plain.trim() && !html.includes('<img')) return;
    onSubmit(html, Array.from(mentionMapRef.current.keys()));
  };

  const canSubmit = !!(editorRef.current?.innerText?.trim() || html.includes('<img'));

  return (
    <div>
      {/* Envoltorio propio para el textarea: el dropdown de menciones se
          posiciona relativo a ESTE div (no al bloque completo con toolbar
          y botones), y se abre hacia arriba para no quedar recortado por
          el `overflow-hidden` de la tarjeta cuando el editor está pegado
          al borde inferior (el composer de comentario nuevo). */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={() => { updateActiveFormats(); detectMentionQuery(); }}
          onMouseUp={() => { updateActiveFormats(); detectMentionQuery(); }}
          onBlur={() => setTimeout(() => setMentionQuery(null), 150)}
          className="w-full min-h-[60px] text-sm outline-none text-slate-700 bg-transparent mb-3 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 cursor-text"
          data-placeholder={placeholder}
        />

        {mentionQuery !== null && (
          <div className="absolute z-30 left-0 bottom-full mb-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <MentionResults search={debouncedQuery} onSelect={insertMention} />
          </div>
        )}
      </div>

      {showFormatting && (
        <div className="flex items-center gap-3 text-slate-400 mb-4 border-b border-gray-100 pb-3 overflow-x-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-50 px-2 py-1 rounded">
                {activeFormats.formatBlock === 'H3' ? 'Heading' : activeFormats.formatBlock === 'H4' ? 'Subheading' : 'Normal text'}
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => execFormat('formatBlock', 'H3')} className="text-base font-bold">Heading</DropdownMenuItem>
              <DropdownMenuItem onClick={() => execFormat('formatBlock', 'H4')} className="text-sm font-semibold">Subheading</DropdownMenuItem>
              <DropdownMenuItem onClick={() => execFormat('formatBlock', 'DIV')} className="text-sm">Normal text</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button onClick={() => execFormat('bold')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.bold ? 'bg-primary/20 text-primary' : ''}`}><Bold className="w-4 h-4" /></button>
          <button onClick={() => execFormat('italic')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.italic ? 'bg-primary/20 text-primary' : ''}`}><Italic className="w-4 h-4" /></button>
          <button onClick={() => execFormat('underline')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.underline ? 'bg-primary/20 text-primary' : ''}`}><Underline className="w-4 h-4" /></button>
          <button onClick={() => execFormat('strikeThrough')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.strikethrough ? 'bg-primary/20 text-primary' : ''}`}><Strikethrough className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button onClick={() => execFormat('justifyLeft')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.justifyLeft ? 'bg-primary/20 text-primary' : ''}`}><AlignLeft className="w-4 h-4" /></button>
          <button onClick={() => execFormat('justifyCenter')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.justifyCenter ? 'bg-primary/20 text-primary' : ''}`}><AlignCenter className="w-4 h-4" /></button>
          <button onClick={() => execFormat('justifyRight')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.justifyRight ? 'bg-primary/20 text-primary' : ''}`}><AlignRight className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button onClick={() => execFormat('insertUnorderedList')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.insertUnorderedList ? 'bg-primary/20 text-primary' : ''}`}><List className="w-4 h-4" /></button>
          <button onClick={() => execFormat('insertOrderedList')} className={`hover:text-slate-600 p-1 rounded ${activeFormats.insertOrderedList ? 'bg-primary/20 text-primary' : ''}`}><ListOrdered className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormatting(!showFormatting)}
            className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${showFormatting ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 text-slate-700 hover:bg-slate-50'}`}
          >
            <Type className="w-3.5 h-3.5 font-bold" />
          </button>
          <button onClick={insertAtSign} className="w-7 h-7 rounded flex items-center justify-center hover:bg-slate-50 transition-colors">
            <AtSign className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{charCount}/1000</span>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="h-8 rounded-lg text-sm border-gray-200 text-slate-700 font-medium px-4">
              Cancelar
            </Button>
          )}
          {submitLabel === "__send-icon__" ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${canSubmit ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-slate-200 text-white cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="h-8 rounded-lg text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4"
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function MentionResults({ search, onSelect }: { search: string; onSelect: (u: MentionableUser) => void }) {
  const { data: users = [], isLoading } = useMentionableUsers(search, true);

  if (isLoading) {
    return <div className="px-3 py-2 text-xs text-slate-400">Buscando...</div>;
  }
  if (!users.length) {
    return <div className="px-3 py-2 text-xs text-slate-400">Sin resultados</div>;
  }
  return (
    <div className="max-h-52 overflow-y-auto py-1">
      {users.map((u) => (
        <button
          key={u.id}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onSelect(u); }}
          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initialsOf(u.name)}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-slate-700 font-medium truncate">{u.name}</div>
            <div className="text-xs text-slate-400 truncate">{u.email}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modo conectado: comentarios reales contra la API (invoice/credit_note/
// quotation/remission — los únicos tipos habilitados hoy en el backend).
// ---------------------------------------------------------------------------
function ConnectedCommentsAndReminders({ type, commentableId }: { type: CommentableType; commentableId: number | string }) {
  const [activeTab, setActiveTab] = useState<"comments" | "reminders">("comments");
  const [remindersCount, setRemindersCount] = useState(0);
  const session = getSession() as any;
  const currentUserId: number | undefined = session?.user?.id;

  const { data: comments = [], isLoading } = useCommentsList(type, commentableId);
  const createMutation = useCreateComment(type, commentableId);
  const updateMutation = useUpdateComment(type, commentableId);
  const deleteMutation = useDeleteComment(type, commentableId);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [sortDesc, setSortDesc] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const visibleComments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? comments.filter((c) => {
        const matchesOwn = stripHtml(c.comment).toLowerCase().includes(query) || (c.user?.name || "").toLowerCase().includes(query);
        const matchesReply = (c.replies || []).some(
          (r) => stripHtml(r.comment).toLowerCase().includes(query) || (r.user?.name || "").toLowerCase().includes(query)
        );
        return matchesOwn || matchesReply;
      })
      : comments;

    return [...filtered].sort((a, b) => {
      const timeA = parseApiDate(a.created_at)?.getTime() ?? 0;
      const timeB = parseApiDate(b.created_at)?.getTime() ?? 0;
      return sortDesc ? timeB - timeA : timeA - timeB;
    });
  }, [comments, searchQuery, sortDesc]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handlePost = (html: string, mentionIds: number[]) => {
    createMutation.mutate({ comment: html, mentions: mentionIds });
  };

  const handleReply = (parentId: number, html: string, mentionIds: number[]) => {
    createMutation.mutate(
      { comment: html, mentions: mentionIds, parent_id: parentId },
      { onSuccess: () => setReplyingTo(null) }
    );
  };

  const handleSaveEdit = (id: number, html: string, mentionIds: number[]) => {
    updateMutation.mutate({ id, payload: { comment: html, mentions: mentionIds } }, {
      onSuccess: () => setEditingId(null),
    });
  };

  const handleDelete = () => {
    if (deletingId == null) return;
    deleteMutation.mutate(deletingId, { onSuccess: () => setDeletingId(null) });
  };

  const handleCopy = (htmlString: string) => {
    navigator.clipboard.writeText(stripHtml(htmlString));
    showToast("Comentario copiado exitosamente", "success", "Comentario copiado");
  };

  const findComment = (id: number): { comment: string; created_at: string } | undefined => {
    for (const c of comments) {
      if (c.id === id) return c;
      const reply = c.replies?.find((r) => r.id === id);
      if (reply) return reply;
    }
    return undefined;
  };

  const renderCard = (item: ApiComment | CommentReply, opts: { isReply: boolean; parentId?: number }) => {
    const isAuthor = currentUserId != null && item.user_id === currentUserId;
    const isEditing = editingId === item.id;

    return (
      <div key={item.id} className={`flex items-start gap-4 ${opts.isReply ? 'ml-12 mt-4' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">
          {initialsOf(item.user?.name)}
        </div>

        {isEditing ? (
          <div className="flex-1 bg-white border border-primary rounded-xl p-4 shadow-sm relative">
            <CommentEditor
              initialHtml={item.comment}
              submitLabel="Guardar"
              autoFocus
              submitting={updateMutation.isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(html, mentionIds) => handleSaveEdit(item.id, html, mentionIds)}
            />
          </div>
        ) : (
          <div className="flex-1 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all rounded-xl p-4 relative group">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-600">{item.user?.name || "Usuario"}</span>
              <span className="text-[11px] text-slate-400 font-medium">{formatDateTime(item.created_at)}</span>
            </div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left" dangerouslySetInnerHTML={{ __html: item.comment }}></div>

            {!opts.isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" /> Responder
              </button>
            )}

            {/* Hover actions */}
            <div className="absolute top-3 right-3 hidden group-hover:flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {isAuthor && (
                <>
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-gray-200"></div>
                </>
              )}
              <button
                onClick={() => handleCopy(item.comment)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                title="Copiar"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-200"></div>
              <button
                onClick={() => setDeletingId(item.id)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const deletingComment = deletingId != null ? findComment(deletingId) : undefined;

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden mb-8 shadow-sm">
      {EDITOR_STYLE}
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 bg-white">
        <button
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comentarios
        </button>
        <div className="relative flex items-center gap-1.5">
          <button
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('reminders')}
          >
            Recordatorios
          </button>
          {HELP_POPOVER}
          {remindersCount > 0 && (
            <span className="inline-flex items-center justify-center text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.5 min-w-[20px]">
              {remindersCount}
            </span>
          )}
        </div>
      </div>

      {activeTab === 'reminders' ? (
        <RemindersPanel onCountChange={setRemindersCount} />
      ) : (
        <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className="text-primary hover:text-primary/80 transition-colors shrink-0"
            title="Buscar en comentarios"
          >
            <Search className="w-4 h-4" />
          </button>

          {searchOpen ? (
            <div className="flex items-center gap-2 flex-1 min-w-0 animate-in fade-in slide-in-from-left-1 duration-150">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por texto o autor..."
                className="flex-1 min-w-0 text-xs text-slate-700 border border-primary/30 rounded-full px-3 py-1 outline-none focus:border-primary transition-colors"
              />
              <button onClick={closeSearch} className="text-slate-400 hover:text-slate-600 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSortDesc((d) => !d)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
              title="Cambiar orden"
            >
              {sortDesc ? "Recientes" : "Más antiguos"} <span className="text-[10px]">{sortDesc ? "↓" : "↑"}</span>
            </button>
          )}
        </div>
        <button className="text-slate-400 hover:text-slate-600 shrink-0">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#F8F9FB] min-h-[250px] max-h-[520px] overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400 pt-10 text-sm">
            Cargando comentarios...
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <MessageCircle className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">Aún no hay comentarios</span>
          </div>
        ) : visibleComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <Search className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">Sin resultados para tu búsqueda</span>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleComments.map((c) => (
              <div key={c.id}>
                {renderCard(c, { isReply: false })}
                {c.replies?.map((r) => renderCard(r, { isReply: true, parentId: c.id }))}
                {replyingTo === c.id && (
                  <div className="ml-12 mt-4 bg-white border border-primary rounded-xl p-4 shadow-sm">
                    <CommentEditor
                      placeholder="Escribe una respuesta..."
                      submitLabel="Responder"
                      autoFocus
                      submitting={createMutation.isPending}
                      onCancel={() => setReplyingTo(null)}
                      onSubmit={(html, mentionIds) => handleReply(c.id, html, mentionIds)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area — se oculta con una transición suave mientras se está
          respondiendo a un comentario, para no mostrar dos cajas de texto
          abiertas al mismo tiempo. Reaparece al guardar o cancelar la
          respuesta (replyingTo vuelve a null). */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${replyingTo !== null ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}
        >
          <div className="overflow-hidden">
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="border border-primary rounded-xl p-3 focus-within:ring-1 focus-within:ring-primary/40 transition-shadow">
                <CommentEditor
                  placeholder={"Escribe un comentario\nMenciona con @, asigna tareas o agenda recordatorios para tu equipo"}
                  submitLabel="__send-icon__"
                  submitting={createMutation.isPending}
                  onSubmit={handlePost}
                />
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Eliminar comentario</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-4">
              ¿Estás seguro que deseas eliminar el comentario? Recuerda que esta acción es irreversible.
            </p>
            {deletingComment && (
              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">
                    {formatDateTime(deletingComment.created_at)}
                  </div>
                  <div className="text-sm text-slate-700 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left" dangerouslySetInnerHTML={{ __html: deletingComment.comment }}></div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="rounded-lg border-gray-300 font-medium text-slate-700">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] font-medium text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modo local (legacy): usado por módulos que aún no están habilitados como
// "commentable" en el backend (contactos, pagos). Sin persistencia real.
// ---------------------------------------------------------------------------
function LegacyCommentsAndReminders({
  comments,
  setComments,
  requiresSaveFirst = false,
}: {
  comments: any[];
  setComments: (comments: any[]) => void;
  requiresSaveFirst?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"comments" | "reminders">("comments");
  const [remindersCount, setRemindersCount] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const [sortDesc, setSortDesc] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Cada item conserva su índice original: editingIndex/deletingIndex se
  // manejan sobre `comments` (el array real), no sobre la vista filtrada/ordenada.
  const visibleComments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const withIndex = comments.map((c, i) => ({ ...c, __originalIndex: i }));
    const filtered = query ? withIndex.filter((c) => stripHtml(c.comment).toLowerCase().includes(query)) : withIndex;

    return [...filtered].sort((a, b) => {
      const timeA = parseApiDate(a.created_at)?.getTime() ?? 0;
      const timeB = parseApiDate(b.created_at)?.getTime() ?? 0;
      return sortDesc ? timeB - timeA : timeA - timeB;
    });
  }, [comments, searchQuery, sortDesc]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handlePostComment = (html: string) => {
    setComments([
      ...comments,
      { comment: html, is_internal: true, created_at: new Date().toISOString() },
    ]);
  };

  const handleCopy = (htmlString: string) => {
    navigator.clipboard.writeText(stripHtml(htmlString));
    showToast("Comentario copiado exitosamente", "success", "Comentario copiado");
  };

  const handleSaveEdit = (index: number, html: string) => {
    const newComments = [...comments];
    newComments[index] = { ...newComments[index], comment: html };
    setComments(newComments);
    setEditingIndex(null);
    showToast("Comentario editado correctamente", "success", "Éxito");
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newComments = [...comments];
    newComments.splice(deletingIndex, 1);
    setComments(newComments);
    setDeletingIndex(null);
    showToast("Comentario eliminado", "success", "Éxito");
  };

  if (requiresSaveFirst) {
    return (
      <div className="border border-gray-200 bg-white rounded-xl mb-8 shadow-sm">
        <div className="px-6 py-12 flex items-center justify-center">
          <SaveBeforeCommentsWarning />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden mb-8 shadow-sm">
      {EDITOR_STYLE}
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 bg-white">
        <button
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comentarios
        </button>
        <div className="relative flex items-center gap-1.5">
          <button
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('reminders')}
          >
            Recordatorios
          </button>
          {HELP_POPOVER}
          {remindersCount > 0 && (
            <span className="inline-flex items-center justify-center text-[11px] font-semibold rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.5 min-w-[20px]">
              {remindersCount}
            </span>
          )}
        </div>
      </div>

      {activeTab === 'reminders' ? (
        <RemindersPanel onCountChange={setRemindersCount} />
      ) : (
        <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className="text-primary hover:text-primary/80 transition-colors shrink-0"
            title="Buscar en comentarios"
          >
            <Search className="w-4 h-4" />
          </button>

          {searchOpen ? (
            <div className="flex items-center gap-2 flex-1 min-w-0 animate-in fade-in slide-in-from-left-1 duration-150">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en los comentarios..."
                className="flex-1 min-w-0 text-xs text-slate-700 border border-primary/30 rounded-full px-3 py-1 outline-none focus:border-primary transition-colors"
              />
              <button onClick={closeSearch} className="text-slate-400 hover:text-slate-600 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSortDesc((d) => !d)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
              title="Cambiar orden"
            >
              {sortDesc ? "Recientes" : "Más antiguos"} <span className="text-[10px]">{sortDesc ? "↓" : "↑"}</span>
            </button>
          )}
        </div>
        <button className="text-slate-400 hover:text-slate-600 shrink-0">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#F8F9FB] min-h-[250px] max-h-[520px] overflow-y-auto p-6">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <MessageCircle className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">Aún no hay comentarios</span>
          </div>
        ) : visibleComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <Search className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">Sin resultados para tu búsqueda</span>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleComments.map((c) => {
              const i = c.__originalIndex;
              return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">
                  A
                </div>

                {editingIndex === i ? (
                  <div className="flex-1 bg-white border border-primary rounded-xl p-4 shadow-sm relative">
                    <CommentEditor
                      initialHtml={c.comment}
                      submitLabel="Guardar"
                      autoFocus
                      onCancel={() => setEditingIndex(null)}
                      onSubmit={(html) => handleSaveEdit(i, html)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all rounded-xl p-4 relative group">
                    <div className="text-[11px] text-slate-400 font-medium mb-1">{formatDateTime(c.created_at)}</div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left" dangerouslySetInnerHTML={{ __html: c.comment }}></div>

                    <div className="absolute top-3 right-3 hidden group-hover:flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <button onClick={() => setEditingIndex(i)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-gray-200"></div>
                      <button onClick={() => handleCopy(c.comment)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="Copiar">
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-gray-200"></div>
                      <button onClick={() => setDeletingIndex(i)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="border border-primary rounded-xl p-3 focus-within:ring-1 focus-within:ring-primary/40 transition-shadow">
          <CommentEditor
            placeholder={"Escribe un comentario\nMenciona con @, asigna tareas o agenda recordatorios para tu equipo"}
            submitLabel="__send-icon__"
            onSubmit={handlePostComment}
          />
        </div>
      </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deletingIndex !== null} onOpenChange={(open) => !open && setDeletingIndex(null)}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Eliminar comentario</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-4">
              ¿Estás seguro que deseas eliminar el comentario? Recuerda que esta acción es irreversible.
            </p>
            {deletingIndex !== null && comments[deletingIndex] && (
              <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">
                    {formatDateTime(comments[deletingIndex].created_at)}
                  </div>
                  <div className="text-sm text-slate-700 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left" dangerouslySetInnerHTML={{ __html: comments[deletingIndex].comment }}></div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingIndex(null)} className="rounded-lg border-gray-300 font-medium text-slate-700">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] font-medium text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Punto de entrada: modo "conectado" (type + commentableId, API real) o modo
// "legacy" (comments/setComments locales, para módulos aún no soportados por
// el backend). Ver comments-notifications.md para el detalle del contrato.
// ---------------------------------------------------------------------------
export function CommentsAndReminders({
  type,
  commentableId,
  comments,
  setComments,
  requiresSaveFirst = false,
}: {
  type?: CommentableType;
  commentableId?: number | string | null;
  comments?: any[];
  setComments?: (comments: any[]) => void;
  requiresSaveFirst?: boolean;
}) {
  if (type && commentableId) {
    return <ConnectedCommentsAndReminders type={type} commentableId={commentableId} />;
  }

  return (
    <LegacyCommentsAndReminders
      comments={comments || []}
      setComments={setComments || (() => { })}
      requiresSaveFirst={requiresSaveFirst}
    />
  );
}
