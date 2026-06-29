"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, MessageCircle } from "lucide-react";
import { useContactForm } from "./ContactFormProvider";
import { Button } from "@/components/ui/button";

export function ContactComments() {
  const [expanded, setExpanded] = useState(true);
  const { comments, setComments } = useContactForm();

  const [newCommentText, setNewCommentText] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;
    setComments([
      ...comments,
      { comment: newCommentText.trim(), is_internal: true },
    ]);
    setNewCommentText("");
  };

  const handleDelete = (index: number) => {
    const newComments = [...comments];
    // If it has an ID from backend, we might need to mark as deleted
    if (newComments[index].id) {
      newComments[index].isDeleted = true;
    } else {
      newComments.splice(index, 1);
    }
    setComments(newComments);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditCommentText(comments[index].comment);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditCommentText("");
  };

  const handleSaveEdit = (index: number) => {
    if (!editCommentText.trim()) return;
    const newComments = [...comments];
    newComments[index].comment = editCommentText.trim();
    setComments(newComments);
    setEditingIndex(null);
  };

  // Filtrar los comentarios que no están eliminados
  const visibleComments = comments.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => !c.isDeleted);

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">Comentarios</span>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Registra aquí las observaciones importantes sobre tu contacto.</p>
        </div>
        <div className="flex items-center gap-3">
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6 border-t border-gray-100 bg-white">
            
            {/* Main Input Area */}
            <div className="flex items-start gap-4 mb-8 relative">
              {/* Timeline line */}
              {visibleComments.length > 0 && (
                <div className="absolute left-[19px] top-10 bottom-[-32px] w-px bg-gray-200 z-0"></div>
              )}
              
              <div className="w-10 h-10 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-sm font-bold shrink-0 relative z-10 shadow-sm">
                A
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <textarea
                    placeholder="Escribe un comentario..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full min-h-[80px] text-sm p-4 border border-gray-300 rounded-xl resize-none outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors bg-white text-slate-700 placeholder:text-gray-400 shadow-sm"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500 font-medium ml-1">Solo tú puedes ver los comentarios</span>
                    <Button 
                      type="button" 
                      onClick={handlePostComment}
                      disabled={!newCommentText.trim()}
                      className="bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 rounded-lg px-4 shadow-sm font-medium text-sm disabled:opacity-50"
                    >
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {visibleComments.map((item, idx) => {
                const isLast = idx === visibleComments.length - 1;
                const isEditing = editingIndex === item.originalIndex;

                return (
                  <div key={item.originalIndex} className="flex items-start gap-4 relative">
                    {/* Timeline line for items */}
                    {!isLast && (
                      <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-gray-200 z-0"></div>
                    )}

                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 shrink-0 relative z-10 shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-[10px] font-bold">
                          A
                        </div>
                        <span className="text-sm font-medium text-slate-700">Hiciste un comentario</span>
                        <span className="text-slate-400 text-xs">• {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Hoy"}</span>
                      </div>

                      {isEditing ? (
                        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm mt-2">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full min-h-[60px] text-sm resize-none outline-none text-slate-700 placeholder:text-gray-400"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              className="h-8 px-3 text-xs font-medium border-gray-300 text-slate-700 hover:bg-slate-50 rounded-lg"
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="button" 
                              onClick={() => handleSaveEdit(item.originalIndex)}
                              disabled={!editCommentText.trim()}
                              className="h-8 px-3 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg border-transparent shadow-none disabled:opacity-50"
                            >
                              Guardar cambios
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-sm text-slate-700 min-h-[70px]">
                            {item.comment}
                          </div>
                          <div className="flex items-center justify-end gap-4 mt-2 mr-1">
                            <button 
                              type="button" 
                              onClick={() => handleDelete(item.originalIndex)}
                              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleStartEdit(item.originalIndex)}
                              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
