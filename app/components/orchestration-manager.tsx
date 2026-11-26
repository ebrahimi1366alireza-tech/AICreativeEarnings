"use client";
import {useEffect,useState} from "react";
import {createWorkflowProject,getWorkflowSnapshot,updateWorkflowProject,WORKFLOW_STAGES,STAGE_LABELS} from "../../lib/orchestration-manager.mjs";
type Project=any;
const KEY="creativeops-orchestration-v1";
export default function OrchestrationManager(){
 const [projects,setProjects]=useState<Project[]>([]); const [loaded,setLoaded]=useState(false); const [title,setTitle]=useState(""); const [notice,setNotice]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))setProjects(parsed);}}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(KEY,JSON.stringify(projects));},[projects,loaded]);
 function add(e:React.FormEvent){e.preventDefault();const r=createWorkflowProject({id:crypto.randomUUID(),title});if(!r.ok){setNotice(r.error||"خطا");return;}setProjects(rows=>[r.project,...rows]);setTitle("");setNotice("پروژه در همین مرورگر ثبت شد؛ هیچ دستیار یا سرویس خارجی خودکار اجرا نشده است.");}
 function change(p:Project,status:string){const r=updateWorkflowProject(p,{status});if(!r.ok){setNotice(r.error||"تغییر انجام نشد");return;}setProjects(rows=>rows.map(x=>x.id===p.id?r.project:x));}
 return <section className="panel"><div className="panel-head"><div><span className="eyebrow">ORCHESTRATION MANAGER · SUPERVISED</span><h2>مدیر هماهنگی دستیارها</h2></div><span className="free-tag">بدون اجرای خارجی</span></div>
 <p className="hub-intro">پروژه‌ها و مرحله فعلی پنج دستیار را در یک جا پیگیری کن. این نسخه گردش‌کار را ثبت و کنترل می‌کند؛ هنوز دستیارها را به‌صورت خودکار اجرا یا داده‌های فرم‌هایشان را به هم منتقل نمی‌کند.</p>
 <form className="opportunity-form" onSubmit={add}><input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان پروژه یا فرصت درآمدی" aria-label="عنوان پروژه"/><button type="submit">+ ایجاد گردش‌کار</button></form>
 {notice&&<p role="status" className="hub-intro">{notice}</p>}
 {projects.length===0?<p className="empty-state">هنوز پروژه‌ای برای هماهنگی ثبت نشده است.</p>:<div className="saved-opportunities">{projects.map(p=>{const s=getWorkflowSnapshot(p);return <article className="saved-opportunity" key={p.id}><div><strong>{s.title}</strong><p>مرحله: {s.stage} · وضعیت: {s.status}</p><p className="opportunity-meta">اقدام بعدی: {s.nextAction}</p><p className="opportunity-meta">موانع: {s.blockers.join("، ")||"ثبت نشده"}</p><small>اولویت ارز: هیچ‌کدام · اقدام خارجی: غیرفعال</small></div><select aria-label="وضعیت پروژه" value={p.status} onChange={e=>change(p,e.target.value)}><option value="draft">پیش‌نویس</option><option value="needs_user_input">نیازمند اطلاعات</option><option value="blocked">مسدود</option><option value="ready_for_human_review">آماده بازبینی انسانی</option><option value="awaiting_user_approval">در انتظار تأیید کاربر</option></select><button type="button" className="remove-opportunity" onClick={()=>setProjects(rows=>rows.filter(x=>x.id!==p.id))} aria-label="حذف پروژه">×</button></article>})}</div>}
 <p className="hub-footnote">مراحل منطقی: {WORKFLOW_STAGES.map(x=>STAGE_LABELS[x]).join(" ← ")}. وضعیت تکمیل فقط با تأیید صریح کاربر ثبت می‌شود. این مدیر فعلاً deterministic است، نه عامل LLM خودمختار.</p></section>;
}
