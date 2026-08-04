"use client";

import React, { useState } from "react";
import { MessageCircle, Search, Sparkles, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, AtSign, Send, HelpCircle, Type, Edit2, Copy, Trash2, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/sonner/CustomToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SaveBeforeCommentsWarning } from "./SaveBeforeCommentsWarning";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CommentsAndReminders({
  comments,
  setComments,
  requiresSaveFirst = false
}: {
  comments: any[],
  setComments: (comments: any[]) => void,
  requiresSaveFirst?: boolean
}) {
  const [activeTab, setActiveTab] = useState<"comments" | "reminders">("comments");
  const [newCommentHtml, setNewCommentHtml] = useState("");
  const editorRef = React.useRef<HTMLDivElement>(null);
  const editEditorRef = React.useRef<HTMLDivElement>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const [showFormattingNew, setShowFormattingNew] = useState(false);
  const [showFormattingEdit, setShowFormattingEdit] = useState(true);

  const initialFormats = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    formatBlock: 'DIV'
  };
  const [activeFormatsNew, setActiveFormatsNew] = useState(initialFormats);
  const [activeFormatsEdit, setActiveFormatsEdit] = useState(initialFormats);

  const updateActiveFormats = (type: 'new' | 'edit') => {
    let blockFormat = 'DIV';
    if (document.queryCommandState("heading")) {
      // execCommand doesn't always have a straightforward way to get which heading, but we can check queryCommandValue
      blockFormat = document.queryCommandValue("formatBlock") || 'DIV';
    }

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
      formatBlock: document.queryCommandValue("formatBlock")?.toUpperCase() || 'DIV'
    };

    if (type === 'new') setActiveFormatsNew(formats);
    else setActiveFormatsEdit(formats);
  };

  const execFormat = (command: string, type: 'new' | 'edit', value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats(type);

    // Update the state based on which editor is focused
    if (type === 'edit' && editingIndex !== null && editEditorRef.current) {
      setEditCommentText(editEditorRef.current.innerHTML);
    } else if (type === 'new' && editorRef.current) {
      setNewCommentHtml(editorRef.current.innerHTML);
    }
  };

  const handlePostComment = () => {
    // Strip empty HTML tags to check if it's truly empty
    const plainText = editorRef.current?.innerText || "";
    if (!plainText.trim() && !newCommentHtml.includes('<img')) return;

    setComments([
      ...comments,
      {
        comment: newCommentHtml,
        is_internal: true,
        created_at: new Date().toISOString()
      },
    ]);
    setNewCommentHtml("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleCopy = (htmlString: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const plainText = tempDiv.innerText;
    navigator.clipboard.writeText(plainText);
    showToast("Comentario copiado exitosamente", "success", "Comentario copiado");
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditCommentText(comments[index].comment);
    // Needs to wait for render to update innerHTML
    setTimeout(() => {
      if (editEditorRef.current) {
        editEditorRef.current.innerHTML = comments[index].comment;
      }
    }, 0);
  };

  const handleSaveEdit = (index: number) => {
    const plainText = editEditorRef.current?.innerText || "";
    if (!plainText.trim() && !editCommentText.includes('<img')) return;

    const newComments = [...comments];
    newComments[index].comment = editCommentText;
    setComments(newComments);
    setEditingIndex(null);
    showToast("Comentario editado correctamente", "success", "Éxito");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditCommentText("");
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newComments = [...comments];
    newComments.splice(deletingIndex, 1);
    setComments(newComments);
    setDeletingIndex(null);
    // Not explicitly in screenshots but good UX:
    showToast("Comentario eliminado", "success", "Éxito");
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .editor-content [align="center"], .editor-content [style*="text-align: center"] { text-align: center !important; }
        .editor-content [align="right"], .editor-content [style*="text-align: right"] { text-align: right !important; }
        .editor-content [align="left"], .editor-content [style*="text-align: left"] { text-align: left !important; }
      `}} />
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 bg-white">
        <button
          className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comentarios
        </button>
        <div className="relative flex items-center">
          <button
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-primary text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('reminders')}
          >
            Recordatorios
          </button>
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
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-primary" />
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5 transition-colors">
            Recientes <span className="text-[10px]">↓</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#F8F9FB] min-h-[250px] p-6">
        {activeTab === 'reminders' ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">No hay recordatorios</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <MessageCircle className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">Aún no hay comentarios</span>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">
                  A
                </div>

                {editingIndex === i ? (
                  <div className="flex-1 bg-white border border-primary rounded-xl p-4 shadow-sm relative">
                    <div
                      ref={editEditorRef}
                      contentEditable
                      onInput={(e) => setEditCommentText(e.currentTarget.innerHTML)}
                      onKeyUp={() => updateActiveFormats('edit')}
                      onMouseUp={() => updateActiveFormats('edit')}
                      className="w-full min-h-[60px] text-sm outline-none text-slate-700 bg-transparent mb-3 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left"
                    />

                    {showFormattingEdit && (
                      <div className="flex items-center gap-3 text-slate-400 mb-4 border-b border-gray-100 pb-3 overflow-x-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-50 px-2 py-1 rounded">
                              {activeFormatsEdit.formatBlock === 'H3' ? 'Heading' : activeFormatsEdit.formatBlock === 'H4' ? 'Subheading' : 'Normal text'}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => execFormat('formatBlock', 'edit', 'H3')} className="text-base font-bold">Heading</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => execFormat('formatBlock', 'edit', 'H4')} className="text-sm font-semibold">Subheading</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => execFormat('formatBlock', 'edit', 'DIV')} className="text-sm">Normal text</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={() => execFormat('bold', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.bold ? 'bg-primary/20 text-primary' : ''}`}><Bold className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('italic', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.italic ? 'bg-primary/20 text-primary' : ''}`}><Italic className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('underline', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.underline ? 'bg-primary/20 text-primary' : ''}`}><Underline className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('strikeThrough', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.strikethrough ? 'bg-primary/20 text-primary' : ''}`}><Strikethrough className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={() => execFormat('justifyLeft', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.justifyLeft ? 'bg-primary/20 text-primary' : ''}`}><AlignLeft className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('justifyCenter', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.justifyCenter ? 'bg-primary/20 text-primary' : ''}`}><AlignCenter className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('justifyRight', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.justifyRight ? 'bg-primary/20 text-primary' : ''}`}><AlignRight className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={() => execFormat('insertUnorderedList', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.insertUnorderedList ? 'bg-primary/20 text-primary' : ''}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => execFormat('insertOrderedList', 'edit')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsEdit.insertOrderedList ? 'bg-primary/20 text-primary' : ''}`}><ListOrdered className="w-4 h-4" /></button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowFormattingEdit(!showFormattingEdit)}
                          className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${showFormattingEdit ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Type className="w-3.5 h-3.5 font-bold" />
                        </button>
                        <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <AtSign className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{editEditorRef.current?.innerText?.length || 0}/1000</span>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="h-8 rounded-lg text-sm border-gray-200 text-slate-700 font-medium px-4"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleSaveEdit(i)}
                          disabled={!editEditorRef.current?.innerText?.trim()}
                          className="h-8 rounded-lg text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4"
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all rounded-xl p-4 relative group">
                    <div className="text-[11px] text-slate-400 font-medium mb-1">{formatTime(c.created_at)}</div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left" dangerouslySetInnerHTML={{ __html: c.comment }}></div>

                    {/* Hover actions */}
                    <div className="absolute top-3 right-3 hidden group-hover:flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => handleStartEdit(i)}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-gray-200"></div>
                      <button
                        onClick={() => handleCopy(c.comment)}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-gray-200"></div>
                      <button
                        onClick={() => setDeletingIndex(i)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area (only for comments) */}
      {activeTab === 'comments' && (
        requiresSaveFirst ? (
          <div className="px-6 pb-6 pt-2 bg-[#F8F9FB]">
            <SaveBeforeCommentsWarning />
          </div>
        ) : (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="border border-primary rounded-xl p-3 focus-within:ring-1 focus-within:ring-primary/40 transition-shadow">
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setNewCommentHtml(e.currentTarget.innerHTML)}
              onKeyUp={() => updateActiveFormats('new')}
              onMouseUp={() => updateActiveFormats('new')}
              className="w-full min-h-[60px] text-sm outline-none text-slate-700 bg-transparent mb-3 editor-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 text-left empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 cursor-text"
              data-placeholder="Escribe un comentario&#10;Menciona con @, asigna tareas o agenda recordatorios para tu equipo"
            />

            {showFormattingNew && (
              <div className="flex items-center gap-3 text-slate-400 mb-4 border-b border-gray-100 pb-3 overflow-x-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-50 px-2 py-1 rounded">
                      {activeFormatsNew.formatBlock === 'H3' ? 'Heading' : activeFormatsNew.formatBlock === 'H4' ? 'Subheading' : 'Normal text'}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => execFormat('formatBlock', 'new', 'H3')} className="text-base font-bold">Heading</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => execFormat('formatBlock', 'new', 'H4')} className="text-sm font-semibold">Subheading</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => execFormat('formatBlock', 'new', 'DIV')} className="text-sm">Normal text</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button onClick={() => execFormat('bold', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.bold ? 'bg-primary/20 text-primary' : ''}`}><Bold className="w-4 h-4" /></button>
                <button onClick={() => execFormat('italic', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.italic ? 'bg-primary/20 text-primary' : ''}`}><Italic className="w-4 h-4" /></button>
                <button onClick={() => execFormat('underline', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.underline ? 'bg-primary/20 text-primary' : ''}`}><Underline className="w-4 h-4" /></button>
                <button onClick={() => execFormat('strikeThrough', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.strikethrough ? 'bg-primary/20 text-primary' : ''}`}><Strikethrough className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button onClick={() => execFormat('justifyLeft', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.justifyLeft ? 'bg-primary/20 text-primary' : ''}`}><AlignLeft className="w-4 h-4" /></button>
                <button onClick={() => execFormat('justifyCenter', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.justifyCenter ? 'bg-primary/20 text-primary' : ''}`}><AlignCenter className="w-4 h-4" /></button>
                <button onClick={() => execFormat('justifyRight', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.justifyRight ? 'bg-primary/20 text-primary' : ''}`}><AlignRight className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button onClick={() => execFormat('insertUnorderedList', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.insertUnorderedList ? 'bg-primary/20 text-primary' : ''}`}><List className="w-4 h-4" /></button>
                <button onClick={() => execFormat('insertOrderedList', 'new')} className={`hover:text-slate-600 p-1 rounded ${activeFormatsNew.insertOrderedList ? 'bg-primary/20 text-primary' : ''}`}><ListOrdered className="w-4 h-4" /></button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFormattingNew(!showFormattingNew)}
                  className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${showFormattingNew ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Type className="w-3.5 h-3.5 font-bold" />
                </button>
                <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <AtSign className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{editorRef.current?.innerText?.length || 0}/1000</span>
                <button
                  onClick={handlePostComment}
                  disabled={!(editorRef.current?.innerText?.trim() || newCommentHtml.includes('<img'))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${(editorRef.current?.innerText?.trim() || newCommentHtml.includes('<img')) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-slate-200 text-white cursor-not-allowed'
                    }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )
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
                    {formatTime(comments[deletingIndex].created_at)}
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
