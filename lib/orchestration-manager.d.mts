export const WORKFLOW_STAGES: readonly string[];
export const STAGE_LABELS: Record<string,string>;
export function createWorkflowProject(input?: {id?:string;title?:string}): {ok:boolean;project?:any;error?:string};
export function updateWorkflowProject(project:any,input?: {status?:string;blockers?:string[];approvals?:string[];nextStage?:string;nextAction?:string}): {ok:boolean;project?:any;error?:string};
export function getWorkflowSnapshot(project:any): any;
