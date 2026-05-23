import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeCloneUpload } from '../clone/ResumeCloneUpload';
import { Plus, Copy, Trash2, Globe, FileText, CheckCircle2, Cloud, Pencil } from 'lucide-react';

export const VersionSidebar: React.FC = () => {
  const {
    id: activeId,
    resumesList,
    isLoadingList,
    loadAllResumes,
    selectResume,
    createNewResume,
    duplicateResume,
    deleteResume,
    publishResume,
    isPublished,
    slug,
  } = useResumeStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [publishOpenId, setPublishOpenId] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState('');

  useEffect(() => {
    loadAllResumes();
  }, []);

  const handleCreate = async () => {
    const title = prompt('Enter a name for the new resume version:', 'My Resume');
    if (title) {
      await createNewResume(title);
    }
  };

  const handleDuplicate = async (id: string, currentTitle: string) => {
    const nextTitle = prompt('Enter duplicate name:', `${currentTitle} Copy`);
    if (nextTitle) {
      await duplicateResume(id, nextTitle);
    }
  };

  const handleRename = async (id: string) => {
    if (!newName.trim()) return;
    // We update using update action + server save
    const { updatePersonalInfo, saveResumeToServer } = useResumeStore.getState();
    // For simplicity, we can implement rename directly on useResumeStore if we want, or just trigger a quick fetch PUT /resumes/:id
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user-123',
        },
        body: JSON.stringify({ title: newName }),
      });
      if (res.ok) {
        setRenamingId(null);
        await loadAllResumes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async (id: string) => {
    if (!customSlug.trim()) {
      alert('Please enter a unique URL slug.');
      return;
    }
    try {
      await publishResume(id, customSlug.trim());
      setPublishOpenId(null);
      setCustomSlug('');
      alert(`Resume published successfully! Slug: ${customSlug}`);
    } catch (err) {
      alert('Failed to publish. Slug might already be in use.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-slate-800 select-none">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Resume Versions
          </h3>
          <p className="text-[10px] text-slate-450 mt-0.5">Manage job-specific resumes</p>
        </div>
        <button
          onClick={handleCreate}
          className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-650 hover:text-slate-900 transition"
          title="Create New Blank Version"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {isLoadingList ? (
          <div className="text-center py-6 text-xs text-slate-400">Loading versions...</div>
        ) : resumesList.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 italic">
            No versions saved on database. Work edits will autosave.
          </div>
        ) : (
          resumesList.map((res) => {
            const isActive = res.id === activeId;
            return (
              <div
                key={res.id}
                onClick={() => !isActive && selectResume(res.id)}
                className={`p-3 rounded-xl border transition flex flex-col justify-between cursor-pointer gap-2 ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50/15 shadow-sm'
                    : 'border-slate-150 hover:border-slate-250 hover:bg-slate-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-indigo-650' : 'text-slate-400'}`} />
                    <div className="min-w-0 flex-1">
                      {renamingId === res.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border border-slate-300 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-indigo-500 w-full"
                          />
                          <button
                            onClick={() => handleRename(res.id)}
                            className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {res.title}
                        </h4>
                      )}
                      <p className="text-[9.5px] text-slate-400 mt-0.5">
                        ATS: {res.atsScore || 0}% • Updated {new Date(res.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setNewName(res.title);
                        setRenamingId(res.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-700 transition"
                      title="Rename"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(res.id, res.title)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-700 transition"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setPublishOpenId(publishOpenId === res.id ? null : res.id);
                        setCustomSlug(res.slug || '');
                      }}
                      className={`p-1 hover:bg-slate-100 rounded transition ${
                        res.isPublished ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-450 hover:text-slate-700'
                      }`}
                      title={res.isPublished ? "Published (click to manage)" : "Publish Version"}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    {resumesList.length > 1 && (
                      <button
                        onClick={() => deleteResume(res.id)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Publish sub-panel */}
                {publishOpenId === res.id && (
                  <div className="mt-1 border-t border-slate-100 pt-2 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Custom URL Slug
                    </label>
                    <div className="flex gap-1.5">
                      <div className="flex-1 flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <span className="px-2 py-1 text-slate-400 bg-slate-100 border-r border-slate-200">/portfolio/</span>
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          placeholder="google-sde"
                          className="px-2 py-1 bg-white focus:outline-none flex-1 font-sans"
                        />
                      </div>
                      <button
                        onClick={() => handlePublish(res.id)}
                        className="px-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10.5px] font-bold transition shrink-0"
                      >
                        Publish
                      </button>
                    </div>
                    {res.isPublished && (
                      <a
                        href={`/portfolio/${res.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9.5px] text-indigo-600 hover:underline font-semibold"
                      >
                        Open public link: /portfolio/{res.slug}
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* OCR Cloner Container at the bottom */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 shrink-0">
        <div className="mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            AI Cloning Scanner
          </span>
        </div>
        <ResumeCloneUpload />
      </div>
    </div>
  );
};
