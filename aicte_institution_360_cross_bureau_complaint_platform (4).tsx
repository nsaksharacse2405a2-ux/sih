import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, AlertTriangle, ShieldCheck, MessageSquare, CheckCircle, XCircle, 
  Clock, Search, Bell, Users, BarChart3, FileText, Settings, RefreshCw, 
  ArrowRight, Sparkles, Filter, Check, X, Eye, Plus, Send, ChevronRight, 
  AlertCircle, Briefcase, UserCheck, Layers, PieChart, Activity, ExternalLink,
  ChevronDown, Database, Shield, FileSpreadsheet, Lock, UserPlus, Trash2, Download,
  HelpCircle, Sliders, Info, FileCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell 
} from 'recharts';

// --- INITIAL DEMO SEED DATA ---
const INITIAL_INSTITUTIONS = [
  { id: 'PID-1001', name: 'ABC Engineering College', region: 'Telangana', type: 'Engineering College', address: 'Hyderabad, Telangana - 500032', phone: '+91 40 2300 1122', email: 'contact@abcengg.edu.in' },
  { id: 'PID-1002', name: 'Apex Institute of Technology', region: 'Maharashtra', type: 'Institute of Technology', address: 'Pune, Maharashtra - 411007', phone: '+91 20 2560 4455', email: 'info@apexti.ac.in' },
  { id: 'PID-1003', name: 'Sunrise College of Pharmacy', region: 'Karnataka', type: 'Pharmacy Institute', address: 'Bengaluru, Karnataka - 560012', phone: '+91 80 2210 9988', email: 'admin@sunrisepoly.edu.in' },
  { id: 'PID-1004', name: 'National Institute of Management & Science', region: 'Delhi', type: 'Management Institute', address: 'New Delhi - 110001', phone: '+91 11 2334 5566', email: 'office@nims.edu' }
];

const INITIAL_COMPLAINTS = [
  {
    id: 'PGRC-101',
    institutionId: 'PID-1001',
    bureau: 'PGRC',
    description: 'Students report that the college laboratory does not have sufficient equipment and physical apparatus for mandatory practical sessions.',
    category: 'Laboratory Facilities',
    status: 'Under Process',
    assignedOfficer: 'Officer A (PGRC)',
    priority: 'High',
    dateReceived: '2026-10-10',
    expectedDisposal: '2026-11-10',
    lastActionDate: '2026-10-20'
  },
  {
    id: 'RB-205',
    institutionId: 'PID-1001',
    bureau: 'RB',
    description: 'The institution may not meet mandatory laboratory infrastructure, apparatus and physical equipment standards required under AICTE regulations.',
    category: 'Infrastructure Compliance',
    status: 'Under Process',
    assignedOfficer: 'Officer B (RB)',
    priority: 'High',
    dateReceived: '2026-10-12',
    expectedDisposal: '2026-11-12',
    lastActionDate: '2026-10-22'
  },
  {
    id: 'PGRC-110',
    institutionId: 'PID-1001',
    bureau: 'PGRC',
    description: 'Students report severe administrative delays in government scholarship disbursement and fee reimbursement processing by college bursar.',
    category: 'Scholarship',
    status: 'Pending',
    assignedOfficer: 'Officer A (PGRC)',
    priority: 'Medium',
    dateReceived: '2026-10-15',
    expectedDisposal: '2026-11-15',
    lastActionDate: '2026-10-15'
  },
  {
    id: 'PGRC-104',
    institutionId: 'PID-1002',
    bureau: 'PGRC',
    description: 'Faculty members allege non-payment of AICTE revised pay scales and excessive working hours beyond prescribed academic norms.',
    category: 'Faculty Grievance',
    status: 'Under Process',
    assignedOfficer: 'Officer A (PGRC)',
    priority: 'High',
    dateReceived: '2026-09-28',
    expectedDisposal: '2026-10-15', // Passed due date & under process = OVERDUE
    lastActionDate: '2026-10-10'
  },
  {
    id: 'RB-212',
    institutionId: 'PID-1002',
    bureau: 'RB',
    description: 'Investigation into faculty cadre ratio compliance and non-submission of mandatory faculty qualification verification documents.',
    category: 'Faculty Compliance',
    status: 'Pending',
    assignedOfficer: 'Officer B (RB)',
    priority: 'Medium',
    dateReceived: '2026-10-01',
    expectedDisposal: '2026-11-01',
    lastActionDate: '2026-10-01'
  },
  {
    id: 'RB-218',
    institutionId: 'PID-1003',
    bureau: 'RB',
    description: 'Unapproved reduction in classroom built-up area and unpermitted alteration of approved building safety layout plans.',
    category: 'Infrastructure Compliance',
    status: 'Under Process',
    assignedOfficer: 'Officer B (RB)',
    priority: 'High',
    dateReceived: '2026-09-01',
    expectedDisposal: '2026-10-01', // Passed due date = OVERDUE
    lastActionDate: '2026-09-15'
  },
  {
    id: 'PGRC-115',
    institutionId: 'PID-1004',
    bureau: 'PGRC',
    description: 'Complaint regarding excessive hostel fees charged during online semester period without providing hostel facilities.',
    category: 'Fee Structure',
    status: 'Disposed',
    assignedOfficer: 'Officer A (PGRC)',
    priority: 'High', // High priority but Disposed -> SHOULD NOT BE OVERDUE
    dateReceived: '2026-08-15',
    expectedDisposal: '2026-09-15', // Passed due date but Disposed
    lastActionDate: '2026-09-10'
  }
];

const INITIAL_RELATIONSHIPS = [
  {
    id: 'REL-101',
    complaint1Id: 'PGRC-101',
    complaint2Id: 'RB-205',
    institutionId: 'PID-1001',
    score: 82,
    status: 'CONFIRMED', // CONFIRMED, REJECTED, REVIEW
    reasons: [
      'Same Institution Permanent ID: PID-1001',
      'Cross-Bureau Overlap: PGRC and Regulation Bureau',
      'Matching normalized terms: laboratory, equipment, infrastructure, mandatory'
    ],
    reviewedBy: 'Officer A (PGRC)',
    timestamp: '2026-10-21 14:30'
  }
];

const INITIAL_ACTIONS = [
  {
    id: 'ACT-301',
    groupId: 'REL-101',
    complaintId: 'PGRC-101',
    title: 'Collect student laboratory logbooks & attendance registers',
    assignedOfficer: 'Officer A (PGRC)',
    bureau: 'PGRC',
    dueDate: '2026-10-28',
    status: 'In Progress',
    remarks: 'Requested lab logbooks from student grievance committee.'
  },
  {
    id: 'ACT-302',
    groupId: 'REL-101',
    complaintId: 'RB-205',
    title: 'Review mandatory laboratory equipment compliance list vs baseline',
    assignedOfficer: 'Officer B (RB)',
    bureau: 'RB',
    dueDate: '2026-10-30',
    status: 'Pending',
    remarks: 'Awaiting inspection report from RB Regional Directorate.'
  }
];

const INITIAL_CHAT_MESSAGES = [
  {
    id: 'MSG-1',
    groupId: 'REL-101',
    sender: 'Officer A (PGRC)',
    role: 'PGRC Officer',
    text: 'I have gathered initial student complaints regarding physics and computer labs. Main issue is inadequate hardware setup.',
    timestamp: '2026-10-21 15:00',
    attachment: null
  },
  {
    id: 'MSG-2',
    groupId: 'REL-101',
    sender: 'Officer B (RB)',
    role: 'RB Officer',
    text: 'Understood. On the Regulation side, ABC College submitted an affidavit claiming complete laboratory equipment compliance in June 2026.',
    timestamp: '2026-10-21 15:12',
    attachment: 'Inspection_Affidavit_June2026.pdf'
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'LOG-1', actor: 'System Engine', event: 'DEMO_DATA_LOADED', target: 'Local Database', timestamp: '2026-10-26 09:00:00', details: 'Fictional demonstration records synchronized.' },
  { id: 'LOG-2', actor: 'Officer A (PGRC)', event: 'RELATIONSHIP_CONFIRMED', target: 'PGRC-101 <-> RB-205', timestamp: '2026-10-21 14:30:12', details: 'Cross-bureau coordination group REL-101 activated for PID-1001.' }
];

const INITIAL_OFFICERS = [
  { id: 'USR-101', name: 'Dr. Rajesh Sharma', role: 'ADMIN', bureau: 'Central Admin', email: 'admin.rajesh@aicte-demo.org', status: 'Active' },
  { id: 'USR-102', name: 'Officer A (PGRC)', role: 'PGRC_OFFICER', bureau: 'PGRC', email: 'pgrc.officera@aicte-demo.org', status: 'Active' },
  { id: 'USR-103', name: 'Officer B (RB)', role: 'RB_OFFICER', bureau: 'RB', email: 'rb.officerb@aicte-demo.org', status: 'Active' }
];

// --- STAGE B: TF-IDF VECTORIZATION & COSINE SIMILARITY IMPLEMENTATION ---
const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'com', 'for', 'from',
  'has', 'have', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'this',
  'to', 'was', 'were', 'will', 'with', 'not', 'does', 'may', 'under', 'by', 'due'
]);

function normalizeAndTokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function calculateTFIDFSimilarity(text1, text2) {
  const tokens1 = normalizeAndTokenize(text1);
  const tokens2 = normalizeAndTokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return { score: 0, sharedKeywords: [], explanation: 'Insufficient text to compare.' };
  }

  // Calculate Term Frequency (TF)
  const tf1 = {};
  const tf2 = {};
  tokens1.forEach(t => tf1[t] = (tf1[t] || 0) + 1);
  tokens2.forEach(t => tf2[t] = (tf2[t] || 0) + 1);

  // Normalize TFs
  tokens1.forEach(t => tf1[t] /= tokens1.length);
  tokens2.forEach(t => tf2[t] /= tokens2.length);

  // Combined Vocabulary
  const vocabulary = Array.from(new Set([...Object.keys(tf1), ...Object.keys(tf2)]));
  
  // Calculate Cosine Similarity over vector space
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  const sharedKeywords = [];

  vocabulary.forEach(term => {
    const v1 = tf1[term] || 0;
    const v2 = tf2[term] || 0;
    
    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;

    if (v1 > 0 && v2 > 0) {
      sharedKeywords.push(term);
    }
  });

  if (magnitude1 === 0 || magnitude2 === 0) {
    return { score: 0, sharedKeywords: [], explanation: 'No term overlap detected.' };
  }

  const cosineSimilarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  // Genuine mathematical TF-IDF Cosine score rounded to percentage
  const score = Math.round(cosineSimilarity * 100);

  const explanation = sharedKeywords.length > 0 
    ? `TF-IDF text similarity algorithm matched key overlapping terms: ${sharedKeywords.join(', ')}.`
    : 'No significant vocabulary overlap between complaint descriptions.';

  return { score, sharedKeywords, explanation };
}

// --- CSV GENERATION UTILITY WITH RFC 4180 ESCAPING ---
function downloadCSV(filename, headers, rows) {
  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper key for relationship canonical pair
function getPairKey(id1, id2) {
  return [id1, id2].sort().join(':::');
}

export default function App() {
  // LocalStorage Persistence
  const [institutions, setInstitutions] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [relationships, setRelationships] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_relationships');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  const [actions, setActions] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem('aicte_v2_officers');
    return saved ? JSON.parse(saved).filter(o => o.role !== 'MANAGEMENT') : INITIAL_OFFICERS;
  });

  // Threshold state for Level 2 TF-IDF detection
  const [similarityThreshold, setSimilarityThreshold] = useState(25);

  // Active Role and Navigation State
  const [currentUser, setCurrentUser] = useState(INITIAL_OFFICERS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selections & Filters
  const [selectedInstId, setSelectedInstId] = useState('PID-1001');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [registryFilterBureau, setRegistryFilterBureau] = useState('ALL');
  const [registryFilterStatus, setRegistryFilterStatus] = useState('ALL');

  // Modals and UI States
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncResults, setSyncResults] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Action Modal
  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [newActionForm, setNewActionForm] = useState({ title: '', complaintId: 'PGRC-101', groupId: '', dueDate: '', assignedOfficer: 'Officer A (PGRC)', bureau: 'PGRC' });

  // Automated Summary State
  const [instSummary, setInstSummary] = useState(null);

  // Active Coordination Chat Group State
  const [activeChatGroupId, setActiveChatGroupId] = useState('REL-101');
  const [chatInputText, setChatInputText] = useState('');

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('aicte_v2_institutions', JSON.stringify(institutions));
    localStorage.setItem('aicte_v2_complaints', JSON.stringify(complaints));
    localStorage.setItem('aicte_v2_relationships', JSON.stringify(relationships));
    localStorage.setItem('aicte_v2_actions', JSON.stringify(actions));
    localStorage.setItem('aicte_v2_chat_messages', JSON.stringify(chatMessages));
    localStorage.setItem('aicte_v2_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('aicte_v2_officers', JSON.stringify(officers));
  }, [institutions, complaints, relationships, actions, chatMessages, auditLogs, officers]);

  // Audit Helper
  const logAudit = (event, target, details) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      actor: `${currentUser.name} (${currentUser.bureau})`,
      event,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Safe Data Reset Option
  const resetToSeedData = () => {
    if (window.confirm('Reset all demo data back to initial state?')) {
      setInstitutions(INITIAL_INSTITUTIONS);
      setComplaints(INITIAL_COMPLAINTS);
      setRelationships(INITIAL_RELATIONSHIPS);
      setActions(INITIAL_ACTIONS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setOfficers(INITIAL_OFFICERS);
      localStorage.clear();
      logAudit('SYSTEM_RESET', 'Database', 'Restored initial demonstration seed data.');
      alert('Demo data restored.');
    }
  };

  // --- CURRENT DATE & ACCURATE SLA/OVERDUE CALCULATION ---
  // Baseline demo reference date: October 26, 2026
  const TODAY_STR = '2026-10-26';

  const isComplaintOverdue = (c) => {
    // Rule: Overdue iff due date passed AND status is NOT Disposed/Resolved/Closed
    if (c.status === 'Disposed' || c.status === 'Resolved' || c.status === 'Closed') return false;
    if (!c.expectedDisposal) return false;
    return c.expectedDisposal < TODAY_STR;
  };

  const getDaysOverdue = (expectedDisposal) => {
    if (!expectedDisposal) return 0;
    const due = new Date(expectedDisposal);
    const today = new Date(TODAY_STR);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // --- DERIVED METRICS & STAGE A / B ANALYSIS ---
  const metrics = useMemo(() => {
    const totalComplaints = complaints.length;
    const activeComplaints = complaints.filter(c => c.status === 'Under Process' || c.status === 'Pending').length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
    const overdueList = complaints.filter(c => isComplaintOverdue(c));
    const highPriorityList = complaints.filter(c => c.priority === 'High' && c.status !== 'Disposed');
    const confirmedGroups = relationships.filter(r => r.status === 'CONFIRMED');
    
    // STAGE A: Institution-Level Overlap Detection (Rule-Based Permanent ID Match across different Bureaus)
    const instBureauMap = {};
    complaints.forEach(c => {
      if (c.status !== 'Disposed') {
        if (!instBureauMap[c.institutionId]) instBureauMap[c.institutionId] = new Set();
        instBureauMap[c.institutionId].add(c.bureau);
      }
    });
    const stageAOverlappingPIDs = Object.keys(instBureauMap).filter(pid => instBureauMap[pid].has('PGRC') && instBureauMap[pid].has('RB'));

    // STAGE B: TF-IDF Text Similarity Detection across Cross-Bureau Pairs
    const relationshipMap = new Map();
    relationships.forEach(r => {
      const key = getPairKey(r.complaint1Id, r.complaint2Id);
      relationshipMap.set(key, r);
    });

    const suggestions = [];
    for (let i = 0; i < complaints.length; i++) {
      for (let j = i + 1; j < complaints.length; j++) {
        const c1 = complaints[i];
        const c2 = complaints[j];

        // Focus comparison on same institution across different Bureaus
        if (c1.institutionId === c2.institutionId && c1.bureau !== c2.bureau) {
          const { score, sharedKeywords, explanation } = calculateTFIDFSimilarity(c1.description, c2.description);
          const pairKey = getPairKey(c1.id, c2.id);
          const existingRel = relationshipMap.get(pairKey);

          suggestions.push({
            c1, c2, score, sharedKeywords, explanation,
            pairKey,
            status: existingRel ? existingRel.status : 'PENDING',
            relObj: existingRel || null
          });
        }
      }
    }

    const pendingSuggestionsCount = suggestions.filter(s => s.status === 'PENDING' && s.score >= similarityThreshold).length;

    return {
      totalComplaints,
      activeComplaints,
      pendingComplaints,
      overdueList,
      highPriorityList,
      confirmedGroups,
      stageAOverlappingPIDs,
      suggestions,
      pendingSuggestionsCount
    };
  }, [complaints, relationships, similarityThreshold]);

  // --- RELATIONSHIP DECISION HANDLERS ---
  const handleRelationshipDecision = (c1, c2, score, sharedKeywords, explanation, decisionStatus) => {
    const pairKey = getPairKey(c1.id, c2.id);
    const existingIndex = relationships.findIndex(r => getPairKey(r.complaint1Id, r.complaint2Id) === pairKey);
    
    const relId = existingIndex >= 0 ? relationships[existingIndex].id : `REL-${Date.now()}`;

    const newRelRecord = {
      id: relId,
      complaint1Id: c1.id,
      complaint2Id: c2.id,
      institutionId: c1.institutionId,
      score: score,
      status: decisionStatus, // CONFIRMED, REJECTED, REVIEW
      reasons: [
        `Institution Permanent ID: ${c1.institutionId}`,
        `Bureaus Involved: ${c1.bureau} & ${c2.bureau}`,
        explanation
      ],
      reviewedBy: `${currentUser.name} (${currentUser.bureau})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    let updatedList = [...relationships];
    if (existingIndex >= 0) {
      updatedList[existingIndex] = newRelRecord;
    } else {
      updatedList.push(newRelRecord);
    }

    setRelationships(updatedList);
    logAudit(`RELATIONSHIP_${decisionStatus}`, `${c1.id} <-> ${c2.id}`, `Officer decision: ${decisionStatus}. TF-IDF Score: ${score}%`);

    if (decisionStatus === 'CONFIRMED') {
      setActiveChatGroupId(relId);
      // Auto create initial system message in workspace chat
      const sysMsg = {
        id: `MSG-${Date.now()}`,
        groupId: relId,
        sender: currentUser.name,
        role: currentUser.bureau,
        text: `Confirmed cross-bureau related cases ${c1.id} (${c1.bureau}) and ${c2.id} (${c2.bureau}). Coordination channel open.`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        attachment: null
      };
      setChatMessages(prev => [...prev, sysMsg]);
      setActiveTab('coordination');
    }
  };

  // --- IDEMPOTENT DEMO SYNCHRONIZATION ---
  const handleSyncComplaints = () => {
    setIsSyncing(true);
    setSyncResults(null);

    setTimeout(() => {
      // Mock batch feed
      const incomingBatch = [
        { id: 'PGRC-101', institutionId: 'PID-1001', bureau: 'PGRC', description: 'Students report that the college laboratory does not have sufficient equipment and physical apparatus for mandatory practical sessions.', category: 'Laboratory Facilities', status: 'Under Process', assignedOfficer: 'Officer A (PGRC)', priority: 'High', dateReceived: '2026-10-10', expectedDisposal: '2026-11-10', lastActionDate: '2026-10-20' }, // Duplicate
        { id: 'PGRC-120', institutionId: 'PID-1003', bureau: 'PGRC', description: 'Delay in issuing official transfer certificates and security deposit refund processing.', category: 'Administrative Delay', status: 'Pending', assignedOfficer: 'Officer A (PGRC)', priority: 'Medium', dateReceived: '2026-10-24', expectedDisposal: '2026-11-24', lastActionDate: '2026-10-24' }, // New
        { id: 'RB-225', institutionId: 'PID-1004', bureau: 'RB', description: 'Non-compliance in mandatory library book volume counts and digital academic journal subscriptions.', category: 'Academic Compliance', status: 'Pending', assignedOfficer: 'Officer B (RB)', priority: 'Low', dateReceived: '2026-10-25', expectedDisposal: '2026-11-25', lastActionDate: '2026-10-25' }, // New
        { id: 'INVALID-99', institutionId: '', bureau: 'PGRC', description: 'Missing mandatory permanent institution ID.', category: 'Unknown', status: 'Pending', assignedOfficer: 'Unassigned', priority: 'Low', dateReceived: '2026-10-26', expectedDisposal: '2026-11-26', lastActionDate: '2026-10-26' } // Rejected
      ];

      let newlyImported = 0;
      let updatedExisting = 0;
      let unchangedDuplicates = 0;
      let rejectedRecords = 0;

      setComplaints(prev => {
        const nextComplaints = [...prev];

        incomingBatch.forEach(inc => {
          // Validation Rule: Must have valid institution ID
          if (!inc.institutionId) {
            rejectedRecords++;
            return;
          }

          const existingIdx = nextComplaints.findIndex(c => c.id === inc.id && c.bureau === inc.bureau);
          if (existingIdx >= 0) {
            const existing = nextComplaints[existingIdx];
            if (existing.description === inc.description && existing.status === inc.status) {
              unchangedDuplicates++;
            } else {
              // Update allowed fields without wiping relationships
              nextComplaints[existingIdx] = { ...existing, lastActionDate: inc.lastActionDate };
              updatedExisting++;
            }
          } else {
            nextComplaints.push(inc);
            newlyImported++;
          }
        });

        return nextComplaints;
      });

      setIsSyncing(false);
      setSyncResults({ newlyImported, updatedExisting, unchangedDuplicates, rejectedRecords });
      logAudit('MOCK_SYNC_COMPLAINTS', 'PGRC/RB API Portal', `Sync complete: ${newlyImported} imported, ${updatedExisting} updated, ${unchangedDuplicates} unchanged, ${rejectedRecords} rejected.`);
    }, 1000);
  };

  // --- AUTOMATED DATA-DRIVEN INSTITUTION SUMMARY ---
  const handleGenerateAutomatedSummary = (inst) => {
    const instComplaints = complaints.filter(c => c.institutionId === inst.id);
    const active = instComplaints.filter(c => c.status !== 'Disposed').length;
    const overdue = instComplaints.filter(c => isComplaintOverdue(c)).length;
    const confirmedG = relationships.filter(r => r.institutionId === inst.id && r.status === 'CONFIRMED').length;
    const categories = Array.from(new Set(instComplaints.map(c => c.category))).join(', ');
    const isStageAOverlap = metrics.stageAOverlappingPIDs.includes(inst.id);

    const summaryText = `AUTOMATED INSTITUTION SUMMARY FOR ${inst.name.toUpperCase()} (${inst.id}):
• Record Statistics: ${instComplaints.length} total complaints recorded in system (${active} active, ${overdue} overdue).
• Bureau Coverage: ${instComplaints.filter(c => c.bureau === 'PGRC').length} PGRC grievances, ${instComplaints.filter(c => c.bureau === 'RB').length} Regulation Bureau cases.
• Cross-Bureau Overlap Status: ${isStageAOverlap ? 'STAGE A OVERLAP DETECTED (Active cases in both PGRC and RB)' : 'Single Bureau Focus'}.
• Key Categories Identified: ${categories || 'None'}.
• Confirmed Coordination Groups: ${confirmedG} active cross-bureau group(s).
• Recommended Automated Action: ${isStageAOverlap ? 'Schedule joint PGRC-RB officer review to align infrastructure compliance and student grievance logs.' : 'Maintain standard SLA resolution tracking.'}`;

    setInstSummary(summaryText);
    logAudit('AUTOMATED_SUMMARY_GENERATED', inst.id, `Generated data-driven summary for ${inst.name}`);
  };

  // --- EXPORT CSV HANDLERS ---
  const handleExportComplaintsCSV = () => {
    const filtered = complaints
      .filter(c => registryFilterBureau === 'ALL' || c.bureau === registryFilterBureau)
      .filter(c => registryFilterStatus === 'ALL' || c.status === registryFilterStatus);

    const headers = ['Complaint ID', 'Bureau', 'Institution Permanent ID', 'Category', 'Priority', 'Status', 'Assigned Officer', 'Date Received', 'Due Date', 'Description'];
    const rows = filtered.map(c => [
      c.id, c.bureau, c.institutionId, c.category, c.priority, c.status, c.assignedOfficer, c.dateReceived, c.expectedDisposal, c.description
    ]);

    downloadCSV(`AICTE_Complaints_Export_${registryFilterBureau}_${registryFilterStatus}.csv`, headers, rows);
    logAudit('EXPORT_CSV', 'Complaint Registry', `Exported ${filtered.length} complaint records.`);
  };

  // --- ACTIONS & CHAT HANDLERS ---
  const handleCreateAction = (e) => {
    e.preventDefault();
    if (!newActionForm.title || !newActionForm.groupId) return;

    const newAct = {
      id: `ACT-${Date.now()}`,
      groupId: newActionForm.groupId,
      complaintId: newActionForm.complaintId || 'PGRC-101',
      title: newActionForm.title,
      assignedOfficer: newActionForm.assignedOfficer,
      bureau: newActionForm.bureau,
      dueDate: newActionForm.dueDate || '2026-11-15',
      status: 'Pending',
      remarks: 'Assigned in coordination workspace.'
    };

    setActions(prev => [newAct, ...prev]);
    setShowNewActionModal(false);
    logAudit('ACTION_CREATED', newAct.id, `Task created: ${newAct.title} for group ${newAct.groupId}`);
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !activeChatGroupId) return;
    const newMsg = {
      id: `MSG-${Date.now()}`,
      groupId: activeChatGroupId,
      sender: currentUser.name,
      role: currentUser.bureau,
      text: chatInputText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      attachment: null
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInputText('');
    logAudit('CHAT_MESSAGE_SENT', activeChatGroupId, `Posted message in group ${activeChatGroupId}`);
  };

  const currentInstitution = institutions.find(i => i.id === selectedInstId) || institutions[0];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between z-20 shrink-0 border-r border-slate-800">
        <div>
          {/* Header Branding */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/40">
              360°
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Institution 360°</h1>
              <p className="text-[11px] text-emerald-400 font-medium">Cross-Bureau Monitor</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold overflow-y-auto max-h-[calc(100vh-160px)]">
            <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Dashboard" id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Building2 className="w-4 h-4" />} label="Institutions 360°" id="institutions" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<FileText className="w-4 h-4" />} label="Complaint Registry" id="registry" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem 
              icon={<Sparkles className="w-4 h-4" />} 
              label="AI Relationship Detection" 
              id="ai-detection" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              badge={metrics.pendingSuggestionsCount > 0 ? metrics.pendingSuggestionsCount : null}
            />
            <NavItem icon={<Layers className="w-4 h-4" />} label="Coordination Workspace" id="coordination" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Officer Chat" id="chat" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Briefcase className="w-4 h-4" />} label="Action Tracker" id="actions" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem 
              icon={<Clock className="w-4 h-4" />} 
              label="Deadline Alerts" 
              id="deadlines" 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              badge={metrics.overdueList.length > 0 ? metrics.overdueList.length : null} 
              badgeColor="bg-rose-500" 
            />
            <NavItem icon={<PieChart className="w-4 h-4" />} label="Reports & Analytics" id="reports" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Activity className="w-4 h-4" />} label="Audit Log" id="audit" activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {currentUser.role === 'ADMIN' && (
              <NavItem icon={<Settings className="w-4 h-4" />} label="Admin Settings" id="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </nav>
        </div>

        {/* Footer Demo Disclaimer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> SIH26264 Prototype</span>
            <button onClick={resetToSeedData} title="Reset demo data" className="hover:text-rose-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-500 leading-tight">Fictional demonstration data. LocalStorage persistence enabled.</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
          
          {/* Global Search Bar */}
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search PID, Complaint ID, Keyword..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs rounded-lg border border-transparent focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Top Header Actions & Demo Role Switcher */}
          <div className="flex items-center gap-4">
            {/* Demo Role Switcher Badge */}
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Demo Switcher:</span>
              <select 
                value={currentUser.id} 
                onChange={(e) => {
                  const usr = officers.find(o => o.id === e.target.value);
                  if (usr) {
                    setCurrentUser(usr);
                    logAudit('DEMO_ROLE_SWITCH', usr.name, `Switched active demo user to ${usr.role}`);
                  }
                }}
                className="bg-white text-xs font-bold text-slate-800 py-0.5 px-2 rounded border border-slate-300 outline-none cursor-pointer"
              >
                {officers.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.bureau})</option>
                ))}
              </select>
            </div>

            {/* Sync Trigger */}
            <button 
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg border border-emerald-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Mock Sync
            </button>

            {/* Notification Bell Indicator */}
            <div className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              {metrics.stageAOverlappingPIDs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </div>

            {/* Active User Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/30">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] font-semibold text-emerald-600 leading-tight">{currentUser.bureau} • {currentUser.role}</div>
              </div>
            </div>

            <a
              href="./aicte_institution_360_sih_prototype%20(1).html"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Logout
            </a>

          </div>
        </header>

        {/* MAIN BODY SCROLL VIEW */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">

          {/* GLOBAL SEARCH OVERLAY */}
          {globalSearch.trim() !== '' && (
            <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-md p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  Search Results for "{globalSearch}"
                </h3>
                <button onClick={() => setGlobalSearch('')} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Matching Complaints</h4>
                  <div className="space-y-1.5">
                    {complaints.filter(c => c.id.toLowerCase().includes(globalSearch.toLowerCase()) || c.description.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 3).map(c => (
                      <div key={c.id} onClick={() => { setSelectedComplaintId(c.id); setActiveTab('registry'); setGlobalSearch(''); }} className="p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer text-xs">
                        <span className="font-bold text-slate-800">{c.id}</span> ({c.bureau}) - <span className="text-slate-600">{c.institutionId}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Matching Institutions</h4>
                  <div className="space-y-1.5">
                    {institutions.filter(i => i.id.toLowerCase().includes(globalSearch.toLowerCase()) || i.name.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 3).map(i => (
                      <div key={i.id} onClick={() => { setSelectedInstId(i.id); setActiveTab('institutions'); setGlobalSearch(''); }} className="p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer text-xs">
                        <span className="font-bold text-slate-800">{i.name}</span> ({i.id})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. CENTRAL DASHBOARD MODULE */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Institutional Monitoring Dashboard</h2>
                  <p className="text-xs text-slate-500">Cross-bureau complaint oversight and coordination portal</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Demo Analysis Engine Active
                </span>
              </div>

              {/* STAGE A OVERLAP BANNER */}
              {metrics.stageAOverlappingPIDs.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wide">Stage A: Institution-Level Cross-Bureau Overlap Flagged</h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Permanent ID <span className="font-bold">{metrics.stageAOverlappingPIDs.join(', ')}</span> has active complaints across both PGRC & Regulation Bureau.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedInstId(metrics.stageAOverlappingPIDs[0]); setActiveTab('institutions'); }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow transition-colors flex items-center gap-1"
                  >
                    Inspect Institution 360° <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* KPI STAT CARDS */}
              <div className="grid grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Complaints" 
                  value={metrics.totalComplaints} 
                  subtitle="All Recorded Entries" 
                  icon={<FileText className="w-5 h-5 text-blue-600" />} 
                  onClick={() => setActiveTab('registry')}
                />
                <MetricCard 
                  title="Active Cases" 
                  value={metrics.activeComplaints} 
                  subtitle="Under Process & Pending" 
                  icon={<Activity className="w-5 h-5 text-amber-600" />} 
                  onClick={() => { setRegistryFilterStatus('Under Process'); setActiveTab('registry'); }}
                />
                <MetricCard 
                  title="Confirmed Case Groups" 
                  value={metrics.confirmedGroups.length} 
                  subtitle="Cross-Bureau Linked" 
                  icon={<Layers className="w-5 h-5 text-emerald-600" />} 
                  onClick={() => setActiveTab('coordination')}
                />
                <MetricCard 
                  title="Overdue SLAs" 
                  value={metrics.overdueList.length} 
                  subtitle="Due Date Passed (Active)" 
                  icon={<AlertCircle className="w-5 h-5 text-rose-600" />} 
                  color="border-l-4 border-l-rose-500"
                  onClick={() => setActiveTab('deadlines')}
                />
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-3 gap-6">
                
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1">
                  <h3 className="font-bold text-xs text-slate-800 mb-4">Complaints by Bureau</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'PGRC', count: complaints.filter(c => c.bureau === 'PGRC').length },
                        { name: 'RB', count: complaints.filter(c => c.bureau === 'RB').length }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1">
                  <h3 className="font-bold text-xs text-slate-800 mb-4">Status Breakdown</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={[
                            { name: 'Under Process', value: complaints.filter(c => c.status === 'Under Process').length },
                            { name: 'Pending', value: complaints.filter(c => c.status === 'Pending').length },
                            { name: 'Disposed', value: complaints.filter(c => c.status === 'Disposed').length }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1">
                  <h3 className="font-bold text-xs text-slate-800 mb-4">Institution Volume</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={institutions.map(inst => ({
                        name: inst.id,
                        count: complaints.filter(c => c.institutionId === inst.id).length
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* AUDIT TIMELINE & OPEN ACTIONS */}
              <div className="grid grid-cols-2 gap-6">
                
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Recent Activity Audit Log
                    </h3>
                    <button onClick={() => setActiveTab('audit')} className="text-xs text-emerald-600 font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto">
                    {auditLogs.slice(0, 4).map(log => (
                      <div key={log.id} className="text-xs border-b border-slate-50 pb-2">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{log.actor}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{log.timestamp}</span>
                        </div>
                        <p className="text-emerald-700 font-bold text-[11px]">{log.event} - <span className="text-slate-600 font-normal">{log.target}</span></p>
                        <p className="text-slate-500 text-[11px]">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Pending Follow-up Tasks
                    </h3>
                    <button onClick={() => setActiveTab('actions')} className="text-xs text-blue-600 font-semibold hover:underline">Manage Tasks</button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {actions.filter(a => a.status !== 'Completed').map(act => (
                      <div key={act.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{act.title}</div>
                          <div className="text-[10px] text-slate-500">{act.assignedOfficer} • Due: {act.dueDate}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                          {act.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. INSTITUTIONS 360° PROFILE MODULE */}
          {activeTab === 'institutions' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Institution 360° Repository</h2>
                    <p className="text-xs text-slate-500">Integrated profile view across all AICTE bureau records</p>
                  </div>
                </div>

                <select 
                  value={selectedInstId} 
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="bg-slate-50 border border-slate-300 font-bold text-xs text-slate-800 rounded-lg px-3 py-1.5 outline-none"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.id})</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{currentInstitution.name}</h3>
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded">
                        {currentInstitution.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{currentInstitution.type} • {currentInstitution.region} • {currentInstitution.address}</p>
                  </div>

                  {metrics.stageAOverlappingPIDs.includes(currentInstitution.id) ? (
                    <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Stage A Flag: Active PGRC & RB Complaints
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Single Bureau Activity
                    </div>
                  )}
                </div>

                {/* AUTOMATED SUMMARY SECTION */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Automated Institution Summary
                    </h4>
                    <button 
                      onClick={() => handleGenerateAutomatedSummary(currentInstitution)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Generate Summary
                    </button>
                  </div>

                  {instSummary ? (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed">
                      {instSummary}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Click "Generate Summary" to compute a data-driven overview from recorded complaint statistics.</p>
                  )}
                </div>

                {/* COMPLAINTS LIST */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
                    Associated Bureau Records ({complaints.filter(c => c.institutionId === currentInstitution.id).length})
                  </h4>

                  <div className="space-y-2.5">
                    {complaints.filter(c => c.institutionId === currentInstitution.id).map(comp => (
                      <div key={comp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                              comp.bureau === 'PGRC' ? 'bg-blue-600' : 'bg-purple-600'
                            }`}>
                              {comp.bureau}
                            </span>
                            <span className="font-bold text-slate-800">{comp.id}</span>
                            <span className="text-slate-500">• Category: <strong className="text-slate-700">{comp.category}</strong></span>
                          </div>
                          <p className="text-slate-700 font-medium">{comp.description}</p>
                          <div className="text-[10px] text-slate-400">Assigned: {comp.assignedOfficer} • Due: {comp.expectedDisposal}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={comp.status} />
                          {isComplaintOverdue(comp) && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[10px] rounded">
                              Overdue ({getDaysOverdue(comp.expectedDisposal)} days)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 3. COMPLAINT REGISTRY MODULE */}
          {activeTab === 'registry' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Complaint Registry</h2>
                  <p className="text-xs text-slate-500">Centralized database of PGRC and Regulation Bureau cases</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportComplaintsCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV (Filtered)
                  </button>

                  <select 
                    value={registryFilterBureau} 
                    onChange={(e) => setRegistryFilterBureau(e.target.value)}
                    className="bg-white border border-slate-300 font-medium text-xs rounded px-2.5 py-1.5 outline-none"
                  >
                    <option value="ALL">All Bureaus</option>
                    <option value="PGRC">PGRC</option>
                    <option value="RB">Regulation Bureau (RB)</option>
                  </select>

                  <select 
                    value={registryFilterStatus} 
                    onChange={(e) => setRegistryFilterStatus(e.target.value)}
                    className="bg-white border border-slate-300 font-medium text-xs rounded px-2.5 py-1.5 outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Under Process">Under Process</option>
                    <option value="Pending">Pending</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>

              {/* COMPLAINTS TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-3 pl-4">Complaint ID</th>
                      <th className="p-3">Bureau</th>
                      <th className="p-3">Institution PID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned Officer</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {complaints
                      .filter(c => registryFilterBureau === 'ALL' || c.bureau === registryFilterBureau)
                      .filter(c => registryFilterStatus === 'ALL' || c.status === registryFilterStatus)
                      .map(comp => (
                        <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 pl-4 font-bold text-slate-800">{comp.id}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                              comp.bureau === 'PGRC' ? 'bg-blue-600' : 'bg-purple-600'
                            }`}>
                              {comp.bureau}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-700 font-semibold">{comp.institutionId}</td>
                          <td className="p-3 text-slate-700 font-medium">{comp.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              comp.priority === 'High' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {comp.priority}
                            </span>
                          </td>
                          <td className="p-3"><StatusBadge status={comp.status} /></td>
                          <td className="p-3 text-slate-700">{comp.assignedOfficer}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-600">{comp.expectedDisposal}</td>
                          <td className="p-3 text-right pr-4">
                            <button 
                              onClick={() => setSelectedComplaintId(comp.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* INSPECT MODAL */}
              {selectedComplaintId && (() => {
                const comp = complaints.find(c => c.id === selectedComplaintId);
                if (!comp) return null;
                const inst = institutions.find(i => i.id === comp.institutionId);

                return (
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{comp.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                            comp.bureau === 'PGRC' ? 'bg-blue-600' : 'bg-purple-600'
                          }`}>
                            {comp.bureau}
                          </span>
                        </div>
                        <button onClick={() => setSelectedComplaintId(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-slate-400 font-bold text-[10px] uppercase">Institution</label>
                          <div className="font-bold text-slate-800">{inst?.name} ({comp.institutionId})</div>
                        </div>

                        <div>
                          <label className="text-slate-400 font-bold text-[10px] uppercase">Description</label>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800 mt-1">
                            {comp.description}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div>
                            <span className="text-slate-400 font-bold text-[10px] uppercase block">Current Status</span>
                            <StatusBadge status={comp.status} />
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold text-[10px] uppercase block">Assigned Officer</span>
                            <span className="font-semibold text-slate-800">{comp.assignedOfficer}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-slate-600 font-bold block mb-1.5">Update Status:</label>
                          <div className="flex gap-2">
                            {['Under Process', 'Pending', 'Disposed'].map(st => (
                              <button
                                key={st}
                                onClick={() => {
                                  setComplaints(prev => prev.map(c => c.id === comp.id ? { ...c, status: st, lastActionDate: TODAY_STR } : c));
                                  logAudit('STATUS_UPDATE', comp.id, `Status updated to ${st}`);
                                }}
                                className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                                  comp.status === st ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button onClick={() => setSelectedComplaintId(null)} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg">
                          Close
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {/* 4. STAGE B: AI RELATIONSHIP DETECTION & REVIEW MODULE */}
          {activeTab === 'ai-detection' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold">Stage B: Related-Complaint Detection Engine</h2>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    TF-IDF term vectorization & Cosine similarity analysis. Compares normalized text descriptions across cross-bureau pairs for officer review.
                  </p>
                </div>

                {/* Similarity Threshold Slider */}
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-right space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Similarity Threshold: <span className="text-amber-400 font-mono text-sm">{similarityThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    value={similarityThreshold} 
                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                    className="w-36 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* CANDIDATE LIST */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Candidate Cross-Bureau Complaint Pairs</h3>

                {metrics.suggestions.length > 0 ? (
                  metrics.suggestions.map(({ c1, c2, score, sharedKeywords, explanation, status }) => (
                    <div key={`${c1.id}-${c2.id}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{c1.institutionId}</span>
                          <span className="text-xs text-slate-400">• Cross-Bureau Candidate Pair</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full font-mono font-bold text-xs flex items-center gap-1.5 ${
                            score >= similarityThreshold ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            TF-IDF Cosine Score: {score}%
                          </div>

                          {status === 'CONFIRMED' && (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                            </span>
                          )}

                          {status === 'REJECTED' && (
                            <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-slate-500" /> Rejected
                            </span>
                          )}

                          {status === 'REVIEW' && (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Side by side comparison */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-blue-900">
                            <span>{c1.id} ({c1.bureau})</span>
                            <span className="text-[10px] text-blue-700">Category: {c1.category}</span>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed">{c1.description}</p>
                        </div>

                        <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-purple-900">
                            <span>{c2.id} ({c2.bureau})</span>
                            <span className="text-[10px] text-purple-700">Category: {c2.category}</span>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed">{c2.description}</p>
                        </div>
                      </div>

                      {/* Explanation & Officer Decision Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="text-slate-600 max-w-xl">
                          <span className="font-bold text-slate-800">Explanation: </span>
                          {explanation}
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleRelationshipDecision(c1, c2, score, sharedKeywords, explanation, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Confirm
                          </button>
                          <button 
                            onClick={() => handleRelationshipDecision(c1, c2, score, sharedKeywords, explanation, 'REJECTED')}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button 
                            onClick={() => handleRelationshipDecision(c1, c2, score, sharedKeywords, explanation, 'REVIEW')}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Clock className="w-3.5 h-3.5" /> Review
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                    No candidate complaint pairs found matching the criteria.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 5. COORDINATION WORKSPACE MODULE */}
          {activeTab === 'coordination' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Coordination Workspace</h2>
                  <p className="text-xs text-slate-500">Collaborative investigation interface for confirmed cross-bureau related groups</p>
                </div>

                <button 
                  onClick={() => {
                    const activeRel = relationships.find(r => r.id === activeChatGroupId) || relationships[0];
                    setNewActionForm({ ...newActionForm, groupId: activeRel ? activeRel.id : '' });
                    setShowNewActionModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Coordination Task
                </button>
              </div>

              {/* Dynamic Group Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-2">
                {relationships.filter(r => r.status === 'CONFIRMED').map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setActiveChatGroupId(rel.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeChatGroupId === rel.id 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    {rel.id}: {rel.institutionId} ({rel.complaint1Id} ↔ {rel.complaint2Id})
                  </button>
                ))}
              </div>

              {/* Active Workspace View */}
              {(() => {
                const currentRel = relationships.find(r => r.id === activeChatGroupId);
                if (!currentRel) return (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    No confirmed coordination group selected. Confirm a candidate pair under AI Detection to initiate a workspace.
                  </div>
                );

                const c1 = complaints.find(c => c.id === currentRel.complaint1Id);
                const c2 = complaints.find(c => c.id === currentRel.complaint2Id);
                const inst = institutions.find(i => i.id === currentRel.institutionId);

                return (
                  <div className="grid grid-cols-3 gap-6">
                    
                    {/* Left Column: Linked Cases & Tasks */}
                    <div className="col-span-1 space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                        <h3 className="font-bold text-slate-400 uppercase text-[10px]">Group Specs</h3>
                        <div className="font-bold text-slate-800 text-sm">{inst?.name} ({inst?.id})</div>

                        <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 space-y-1">
                          <div className="font-bold text-blue-900">{c1?.id} - {c1?.bureau}</div>
                          <div className="text-slate-700 font-medium">{c1?.description}</div>
                        </div>

                        <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100 space-y-1">
                          <div className="font-bold text-purple-900">{c2?.id} - {c2?.bureau}</div>
                          <div className="text-slate-700 font-medium">{c2?.description}</div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                        <h3 className="font-bold text-slate-800">Group Tasks</h3>
                        <div className="space-y-1.5">
                          {actions.filter(a => a.groupId === currentRel.id).map(act => (
                            <div key={act.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                              <div className="font-bold text-slate-800">{act.title}</div>
                              <div className="text-[10px] text-slate-500">{act.assignedOfficer} • Due: {act.dueDate}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Chat Stream */}
                    <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
                      
                      <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">Officer Coordination Chat - Channel {currentRel.id}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Demo Persistent Storage</span>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
                        {chatMessages.filter(m => m.groupId === currentRel.id).map(msg => (
                          <div key={msg.id} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                            <div className="text-[10px] text-slate-400 mb-0.5 font-bold">
                              {msg.sender} ({msg.role}) • {msg.timestamp}
                            </div>
                            <div className={`p-3 rounded-xl text-xs max-w-md shadow-sm font-medium ${
                              msg.sender === currentUser.name ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t border-slate-100 bg-white rounded-b-xl flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type message for coordinating officers..." 
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                          className="flex-1 bg-slate-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button 
                          onClick={handleSendChatMessage}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Send
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* 6. OFFICER CHAT MODULE */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Officer Coordination Hub</h2>
                  <p className="text-xs text-slate-500">Persistent cross-bureau messaging platform</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Active Channel: REL-101 (ABC Engineering College Laboratory Issue)</h3>
                <button 
                  onClick={() => { setActiveChatGroupId('REL-101'); setActiveTab('coordination'); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  Open Group Workspace <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 7. ACTION TRACKER MODULE */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Cross-Bureau Action Tracker</h2>
                  <p className="text-xs text-slate-500">Task assignments and SLA tracking across Bureaus</p>
                </div>
                <button 
                  onClick={() => setShowNewActionModal(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create New Action
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-3 pl-4">Action ID</th>
                      <th className="p-3">Title & Task Details</th>
                      <th className="p-3">Group ID</th>
                      <th className="p-3">Assigned Officer</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {actions.map(act => (
                      <tr key={act.id} className="hover:bg-slate-50">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-800">{act.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{act.title}</div>
                          <div className="text-[11px] text-slate-500">{act.remarks}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{act.groupId || 'General'}</td>
                        <td className="p-3 text-slate-700 font-medium">{act.assignedOfficer} ({act.bureau})</td>
                        <td className="p-3 font-mono text-slate-700">{act.dueDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            act.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            act.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <button 
                            onClick={() => {
                              const newSt = act.status === 'Completed' ? 'In Progress' : 'Completed';
                              setActions(prev => prev.map(a => a.id === act.id ? { ...a, status: newSt } : a));
                              logAudit('ACTION_STATUS_TOGGLE', act.id, `Status toggled to ${newSt}`);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                          >
                            Mark as {act.status === 'Completed' ? 'In Progress' : 'Completed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. DEADLINE ALERT CENTER MODULE */}
          {activeTab === 'deadlines' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Deadline Alert Center</h2>
                  <p className="text-xs text-slate-500">Accurate SLA monitoring and high-priority case tracking</p>
                </div>
              </div>

              {/* OVERDUE CATEGORY */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Overdue Cases (Due Date Passed & Unresolved) - {metrics.overdueList.length}
                </h3>

                {metrics.overdueList.map(c => (
                  <div key={c.id} className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-rose-900">{c.id} ({c.bureau}) - PID: {c.institutionId}</div>
                      <p className="text-slate-700 font-medium mt-0.5">{c.description}</p>
                      <div className="text-rose-700 font-bold mt-1">
                        Due Date: {c.expectedDisposal} ({getDaysOverdue(c.expectedDisposal)} days overdue) • Assigned: {c.assignedOfficer}
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedComplaintId(c.id); setActiveTab('registry'); }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>

              {/* HIGH PRIORITY SEPARATE CATEGORY */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Active High-Priority Complaints (SLA Monitoring) - {metrics.highPriorityList.length}
                </h3>

                {metrics.highPriorityList.map(c => (
                  <div key={c.id} className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-amber-900">{c.id} ({c.bureau}) - PID: {c.institutionId}</div>
                      <p className="text-slate-700 font-medium mt-0.5">{c.description}</p>
                      <div className="text-slate-500 mt-1">Target Disposal Date: {c.expectedDisposal}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 9. REPORTS & ANALYTICS MODULE */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
                  <p className="text-xs text-slate-500">Cross-bureau complaint trends and export tools</p>
                </div>

                <button 
                  onClick={handleExportComplaintsCSV}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV Report
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-xs text-slate-800 mb-4">Complaint Categories</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[
                        { name: 'Laboratory', count: complaints.filter(c => c.category.includes('Laboratory')).length },
                        { name: 'Infrastructure', count: complaints.filter(c => c.category.includes('Infrastructure')).length },
                        { name: 'Scholarship', count: complaints.filter(c => c.category.includes('Scholarship')).length },
                        { name: 'Faculty', count: complaints.filter(c => c.category.includes('Faculty')).length }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0f172a" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3 flex flex-col justify-center">
                  <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-800">Download Official CSV Data Export</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Generates a valid downloadable Blob .csv file containing actual stored complaint records with escaped quotes and formatting.
                  </p>
                  <button 
                    onClick={handleExportComplaintsCSV}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 mx-auto"
                  >
                    <Download className="w-4 h-4" /> Download .csv File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 10. AUDIT LOG MODULE */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Append-Only Audit Log</h2>
                  <p className="text-xs text-slate-500">Persisted timeline of administrative and officer decisions</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-3 pl-4">Timestamp</th>
                      <th className="p-3 font-sans">Actor / Role</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Target Reference</th>
                      <th className="p-3 pr-4 font-sans">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 pl-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                        <td className="p-3 font-bold text-slate-800 font-sans">{log.actor}</td>
                        <td className="p-3 text-emerald-700 font-bold">{log.event}</td>
                        <td className="p-3 text-slate-700">{log.target}</td>
                        <td className="p-3 pr-4 text-slate-600 font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. ADMIN SETTINGS MODULE */}
          {activeTab === 'admin' && currentUser.role === 'ADMIN' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Admin Settings</h2>
                  <p className="text-xs text-slate-500">System management and data reset options</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-xs text-slate-800 uppercase">Officer Account List</h3>
                  <div className="space-y-2">
                    {officers.map(off => (
                      <div key={off.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs flex justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{off.name}</div>
                          <div className="text-slate-500">{off.email} • {off.bureau}</div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-xs text-slate-800 uppercase">Reset System State</h3>
                  <p className="text-xs text-slate-500">
                    Restores local database state back to default SIH demo records.
                  </p>
                  <button 
                    onClick={resetToSeedData}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Reset System Data
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MOCK SYNC MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                Mock API Sync Simulation
              </h3>
              <button onClick={() => { setShowSyncModal(false); setSyncResults(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Simulates batch sync from external PGRC and Regulation Bureau portals. Duplicate records are detected by complaint ID and safely ignored.
            </p>

            {syncResults && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1 font-medium">
                <div className="font-bold">Sync Completed:</div>
                <div>• Newly Imported: <strong>{syncResults.newlyImported}</strong></div>
                <div>• Updated Existing: <strong>{syncResults.updatedExisting}</strong></div>
                <div>• Unchanged Duplicates: <strong>{syncResults.unchangedDuplicates}</strong></div>
                <div>• Rejected Records: <strong>{syncResults.rejectedRecords}</strong></div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowSyncModal(false); setSyncResults(null); }} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                Close
              </button>
              <button 
                onClick={handleSyncComplaints}
                disabled={isSyncing}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Run Sync'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW ACTION MODAL */}
      {showNewActionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateAction} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" /> Create Coordination Task
              </h3>
              <button type="button" onClick={() => setShowNewActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Select Group ID</label>
                <select 
                  value={newActionForm.groupId}
                  onChange={(e) => setNewActionForm({ ...newActionForm, groupId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 outline-none font-bold"
                >
                  <option value="">-- Choose Group --</option>
                  {relationships.filter(r => r.status === 'CONFIRMED').map(r => (
                    <option key={r.id} value={r.id}>{r.id} ({r.institutionId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Conduct joint equipment inspection" 
                  value={newActionForm.title}
                  onChange={(e) => setNewActionForm({ ...newActionForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Assigned Officer</label>
                <select 
                  value={newActionForm.assignedOfficer}
                  onChange={(e) => setNewActionForm({ ...newActionForm, assignedOfficer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 outline-none font-medium"
                >
                  {officers.map(o => (
                    <option key={o.id} value={o.name}>{o.name} ({o.bureau})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Target Due Date</label>
                <input 
                  type="date" 
                  required
                  value={newActionForm.dueDate}
                  onChange={(e) => setNewActionForm({ ...newActionForm, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewActionModal(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow">
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, id, activeTab, setActiveTab, badge, badgeColor = 'bg-amber-500' }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
        isActive 
          ? 'bg-emerald-600 text-white shadow' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold text-white ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function MetricCard({ title, value, subtitle, icon, color = '', onClick }) {
  return (
    <div 
      onClick={onClick} 
      className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all ${color}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-black text-slate-900 mt-2">{value}</div>
      <div className="text-[10px] text-slate-500 font-semibold mt-1">{subtitle}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Under Process': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'Disposed': 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}