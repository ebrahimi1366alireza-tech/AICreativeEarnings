export const WORKFLOW_STAGES = ["opportunity_triage","creative_production","quality_review","delivery_preparation","earnings_audit"];
export const STAGE_LABELS = { opportunity_triage:"بررسی فرصت", creative_production:"برنامه تولید", quality_review:"کنترل کیفیت", delivery_preparation:"آماده‌سازی تحویل", earnings_audit:"حسابرسی درآمد" };
const VALID_STATUSES = new Set(["draft","needs_user_input","blocked","ready_for_human_review","awaiting_user_approval","completed"]);
export function createWorkflowProject(input = {}) {
  const title = String(input.title || "").trim();
  if (!title) return { ok:false, error:"عنوان پروژه الزامی است." };
  return { ok:true, project:{ id:String(input.id || ""), title, currentStage:WORKFLOW_STAGES[0], status:"draft", blockers:["اطلاعات و مدارک فرصت هنوز وارد و بررسی نشده‌اند."], nextAction:"تکمیل اطلاعات فرصت و مدارک مستقل", approvals:[], eventLog:[{event:"project_created",stage:WORKFLOW_STAGES[0],status:"draft"}], currency:null, externalActionsPerformed:false } };
}
export function updateWorkflowProject(project, input = {}) {
  if (!project || !WORKFLOW_STAGES.includes(project.currentStage)) return { ok:false, error:"پروژه یا مرحله معتبر نیست." };
  const status = String(input.status || project.status);
  if (!VALID_STATUSES.has(status)) return { ok:false, error:"وضعیت نامعتبر است." };
  const blockers = Array.isArray(input.blockers) ? input.blockers.map(String).filter(Boolean) : project.blockers;
  const approvals = Array.isArray(input.approvals) ? input.approvals.map(String) : project.approvals;
  const nextStage = input.nextStage || project.currentStage;
  if (!WORKFLOW_STAGES.includes(nextStage)) return { ok:false, error:"مرحله بعدی معتبر نیست." };
  if (nextStage !== project.currentStage && status !== "ready_for_human_review" && status !== "awaiting_user_approval" && status !== "completed") return { ok:false, error:"پیشروی مرحله بدون عبور از دروازه بازبینی مجاز نیست." };
  if (status === "completed" && !approvals.includes("completion_confirmed_by_user")) return { ok:false, error:"تکمیل فقط با تأیید صریح کاربر ثبت می‌شود." };
  if (status === "awaiting_user_approval" && blockers.length) return { ok:false, error:"تا رفع موانع، پروژه نمی‌تواند منتظر تأیید نهایی باشد." };
  const updated = { ...project, currentStage:nextStage, status, blockers, approvals, nextAction:String(input.nextAction || project.nextAction), currency:null, externalActionsPerformed:false, eventLog:[...(project.eventLog || []),{event:"project_updated",stage:nextStage,status}] };
  return { ok:true, project:updated };
}
export function getWorkflowSnapshot(project) {
  if (!project) return null;
  return { title:project.title, stage:STAGE_LABELS[project.currentStage] || "نامشخص", status:project.status, blockers:[...(project.blockers || [])], nextAction:project.nextAction || "نیازمند بررسی انسانی", currencyPriority:"none", externalActionsPerformed:false };
}
