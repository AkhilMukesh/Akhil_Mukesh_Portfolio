import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiCpuChip,
  HiCheckCircle,
  HiChevronRight,
  HiPaperAirplane,
  HiArrowPath
} from 'react-icons/hi2';
import { FaGithub, FaCheck, FaTimes, FaCodeBranch, FaTerminal } from 'react-icons/fa';

// MOCK DATA FOR SIMULATORS
const MOCK_GIT_SUMMARY = {
  business: {
    overview: "This release implements the core customer cancellation and refund policies for the digital retail suite, enabling customers to request refunds directly via the console and mobile applications. It replaces a manual back-office workflow, reducing processing overhead by an estimated 80%.",
    value: [
      "Customer Self-Service: Cuts average cancellation-to-refund processing time from 48 hours to under 30 seconds.",
      "Fraud Prevention: Enforces automatic validation limits up to $500; transactions exceeding this require tier-2 approval.",
      "Traceability: Automatically posts ledger updates via Kafka to the central treasury service."
    ]
  },
  technical: {
    endpoints: [
      { method: "POST", path: "/api/v1/orders/{orderId}/cancel", desc: "Initiates order cancellation and calculates refund amount." },
      { method: "GET", path: "/api/v1/refunds/{refundId}/status", desc: "Fetches status of the banking ledger transaction." }
    ],
    files: [
      { name: "OrderController.java", changes: "+45 -12", author: "Khaza Shaik", reviews: "Approved by: A. Reviewer" },
      { name: "RefundService.java", changes: "+128 -8", author: "Khaza Shaik", reviews: "Approved by: B. Reviewer" },
      { name: "OrderRepository.java", changes: "+12 -2", author: "Khaza Shaik", reviews: "Approved by: A. Reviewer" },
      { name: "KafkaOrderProducer.java", changes: "+32 -0", author: "Khaza Shaik", reviews: "Approved by: B. Reviewer" }
    ],
    commits: [
      { hash: "8fbc921", msg: "feat: implement cancellation route and validation bindings", author: "Khaza Shaik" },
      { hash: "4a2de90", msg: "feat: add Kafka event producer for treasury ledger syncing", author: "Khaza Shaik" },
      { hash: "c182bef", msg: "fix: resolve concurrency issue during race-condition cancellations", author: "Khaza Shaik" }
    ],
    mrs: [
      { id: "#412", title: "Implement Self-Service Order Cancellations", author: "Khaza Shaik", reviewers: ["A. Reviewer (Principal Engineer)", "B. Reviewer (QA Architect)"] }
    ]
  }
};

const MOCK_ONBOARDING_INPUT = `package com.retail.controller;

@RestController
@RequestMapping("/api/v1/cancellations")
public class CancellationController {

    @Autowired
    private CancellationService service;

    @PostMapping("/request")
    public ResponseEntity<RefundResponse> requestCancellation(
            @Valid @RequestBody CancellationRequest request) {
        return ResponseEntity.ok(service.process(request));
    }
}

class CancellationRequest {
    @NotNull(message = "Order ID cannot be null")
    private String orderId;
    
    @Size(min = 10, max = 250)
    private String reason;
}`;

const MOCK_ONBOARDING_OUTPUT = `# Business Flow Document: Cancellation Controller
## Endpoints Detected:
* **POST** \`/api/v1/cancellations/request\`
  - Description: Initiates cancellation processing for a specified retail order.

## DTO Models & Validations:
* **CancellationRequest**:
  - \`orderId\` (String): **Mandatory** (Validation: \`@NotNull\`)
  - \`reason\` (String): **Mandatory** (Validation: Length must be between 10 and 250 characters)

## Business Logic & Dependencies Flow:
1. Validates schema bindings and checks order existence.
2. Ingests request and delegates to \`CancellationService.process()\`.
3. Evaluates inventory allocation state to decide between warehouse release or return logistics.
4. Generates refund credit payload and triggers financial settlement APIs.
`;

const MOCK_DB_SCHEMA = `CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL
);`;

const MOCK_DB_OUTPUT = `[
  {
    "table": "orders",
    "records": [
      { "id": "ORD-99218", "customer_id": "CUST-5512", "total_amount": 149.99, "status": "PENDING" },
      { "id": "ORD-99219", "customer_id": "CUST-4128", "total_amount": 89.50, "status": "PENDING" }
    ]
  },
  {
    "table": "order_items",
    "records": [
      { "id": "ITEM-1", "order_id": "ORD-99218", "product_id": "PROD-882", "quantity": 1 },
      { "id": "ITEM-2", "order_id": "ORD-99219", "product_id": "PROD-221", "quantity": 2 }
    ]
  }
]`;

const MOCK_SCENARIO_JIRA = "JIRA-128: Implement automatic refund triggers for orders cancelled within 2 hours of payment placement. Orders beyond 2 hours require manager override validation.";

const MOCK_SCENARIOS_OUTPUT = {
  positive: [
    "Verify cancel trigger within 1 hour: Order is cancelled, full refund transaction is fired automatically via API, status changes to REFUNDED.",
    "Verify cancel trigger at exactly 1h 59m: Auto-refund initiates immediately with no supervisor warning tags."
  ],
  negative: [
    "Verify cancel trigger at 2h 05m without supervisor override: Operation fails with HTTP 403 Forbidden (Requires Manager Approval).",
    "Verify cancel trigger on order that is already in SHIPPED status: Request rejected with error code 'ORDER_ALREADY_DISPATCHED'."
  ],
  edge: [
    "Verify cancellation at exactly 2h 00m 01s: Validates supervisor threshold limit controls and routes payload to warning queue.",
    "Verify cancellation double-click race condition: Enforces concurrency locks so order is not refunded twice."
  ]
};

const MOCK_CHAT_FLOW = [
  { 
    q: "Generate cancellation scenarios", 
    r: `### AI Test Agent: Cancellation Service Validation

#### 1. Complete cURL Request (Data populated from database)
\`\`\`bash
curl -X POST https://api.retail.dev/api/v1/cancellations/request \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer mock-jwt-token-xyz" \\
  -d '{
    "orderId": "ORD-99218",
    "reason": "Customer requested cancellation within 2 hours of payment placement"
  }'
\`\`\`

#### 2. Database Context (Linked Entities Audit)
* Selected **\`ORD-99218\`** from \`orders\` table (customer: \`CUST-5512\`, status: \`PENDING\`, total: \`149.99\`).
* Relational dependencies check: Item allocation \`ITEM-1\` (product \`PROD-882\`) will be automatically released back to inventory stock.

#### 3. Business Logic Explanation (Source Code Audit)
* **Threshold Verification**: Under the 2-hour payment window rules, this request qualifies for automated settlement processing with zero supervisor tags.
* **Schema Validation Enforced**: The \`reason\` field is 68 characters, passing the DTO constraint (\`@Size(min=10, max=250)\`).` 
  },
  { 
    q: "Test Transfer Order with invalid warehouse", 
    r: `### AI Test Agent: Warehouse Transfer Service Validation

#### 1. Complete cURL Request (Data populated from database)
\`\`\`bash
curl -X POST https://api.retail.dev/api/v1/warehouse/transfer \\
  -H "Content-Type: application/json" \\
  -d '{
    "transferOrderId": "TO-5512",
    "sourceWarehouseId": "WH-001",
    "destinationWarehouseId": "WH-999",
    "productId": "PROD-882",
    "quantity": 10
  }'
\`\`\`

#### 2. Database Context (Linked Entities Audit)
* Checked source entity **\`WH-001\`** (status: \`ACTIVE\`, holds sufficient stock of product \`PROD-882\`).
* Checked target entity **\`WH-999\`** → Query failed to return rows.

#### 3. Business Logic Explanation (Source Code Audit)
* **Validation Failure**: The destination warehouse ID fails check in \`WarehouseRegistry.isValid()\`, throwing an explicit \`InvalidWarehouseException\`.
* **Relational Safety**: The database transaction is rolled back, preventing creation of corrupted records in the inventory movements ledger.` 
  }
];

export default function DemoDashboard({ isOpen, onClose, initialProject }) {
  const [activeTab, setActiveTab] = useState('git'); // git | test-agent
  const [gitStatus, setGitStatus] = useState('idle'); // idle | loading | success
  const [loadingStep, setLoadingStep] = useState(0);
  const [gitActivePanel, setGitActivePanel] = useState('business'); // business | technical
  
  // Test Agent States
  const [agentStep, setAgentStep] = useState('onboard'); // onboard | data-gen | scenarios | chat
  const [onboardInput, setOnboardInput] = useState(MOCK_ONBOARDING_INPUT);
  const [onboardOutput, setOnboardOutput] = useState('');
  const [dbInput, setDbInput] = useState(MOCK_DB_SCHEMA);
  const [dbOutput, setDbOutput] = useState('');
  const [jiraInput, setJiraInput] = useState(MOCK_SCENARIO_JIRA);
  const [scenariosOutput, setScenariosOutput] = useState(null);
  
  // Chat States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: "Hello! I am your AI Test Agent. Ask me to generate scenarios, validations, or edge cases for your services." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (initialProject) {
      if (initialProject === 'Git Release Analyzer') setActiveTab('git');
      else setActiveTab('test-agent');
    }
  }, [initialProject]);

  // Loading simulator steps
  const loadingPhrases = [
    "Diffing release branch with main production...",
    "Retrieving commit log history via Git API...",
    "Parsing Pull Request templates & reviewer bindings...",
    "Synthesizing technical modules altered...",
    "Drafting Business Summary & auditing risks..."
  ];

  const handleRunGit = () => {
    setGitStatus('loading');
    setLoadingStep(0);
    
    // Simulate loading cycles
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingPhrases.length - 1) {
          clearInterval(interval);
          setGitStatus('success');
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleRunOnboarding = () => {
    setOnboardOutput('Analyzing code structure...');
    setTimeout(() => {
      setOnboardOutput(MOCK_ONBOARDING_OUTPUT);
    }, 1500);
  };

  const handleRunDataGen = () => {
    setDbOutput('Analyzing relationships and foreign keys...');
    setTimeout(() => {
      setDbOutput(MOCK_DB_OUTPUT);
    }, 1500);
  };

  const handleRunScenarios = () => {
    setScenariosOutput('Generating negative and edge scenarios...');
    setTimeout(() => {
      setScenariosOutput(MOCK_SCENARIOS_OUTPUT);
    }, 1500);
  };

  const handleSendChat = (text) => {
    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      // Find matches in mock database
      const match = MOCK_CHAT_FLOW.find(x => text.toLowerCase().includes(x.q.toLowerCase()) || x.q.toLowerCase().includes(text.toLowerCase()));
      const reply = match ? match.r : "I've analyzed that request and generated test scenarios for your endpoint. It is fully compliant with schema validation controls.";
      
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4 lg:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative flex h-[92vh] w-full max-w-6xl flex-col rounded-3xl border border-neutral-200 bg-neutral-50 shadow-2xl dark:border-white/[0.08] dark:bg-ink-950 overflow-hidden"
        >
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-neutral-200/80 px-6 py-4 dark:border-white/[0.06] bg-white dark:bg-ink-900">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
                <HiCpuChip className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                    AI Product Walkthrough
                  </h2>
                  {/* Say plainly that this is scripted. A reviewer who discovers
                      it themselves trusts everything else on the page less. */}
                  <span
                    title="Recorded walkthrough — responses are fixed, no live model calls"
                    className="rounded-full border border-amber-400/40 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300"
                  >
                    Scripted demo
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-glow-100/40">
                  Fixed responses, no live model calls — the production systems run behind enterprise SSO
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex rounded-full border border-neutral-200 p-0.5 dark:border-white/10 bg-neutral-100 dark:bg-ink-950">
                <button
                  type="button"
                  onClick={() => setActiveTab('git')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'git'
                      ? 'bg-white text-neutral-900 shadow dark:bg-ink-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-glow-100/40 dark:hover:text-glow-100'
                  }`}
                >
                  <FaCodeBranch className="size-3.5" />
                  Release Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('test-agent')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'test-agent'
                      ? 'bg-white text-neutral-900 shadow dark:bg-ink-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-glow-100/40 dark:hover:text-glow-100'
                  }`}
                >
                  <FaTerminal className="size-3.5" />
                  AI Test Agent
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer"
              >
                <HiXMark className="size-5" />
              </button>
            </div>
          </header>

          {/* Main workspace */}
          <div className="flex flex-1 overflow-hidden p-6">
            {activeTab === 'git' ? (
              <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Control Panel */}
                <div className="w-80 shrink-0 flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/[0.08] dark:bg-ink-900">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Inputs</h3>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Production Branch</label>
                      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-ink-950 font-mono text-neutral-600 dark:text-glow-100/60">
                        <FaCodeBranch className="size-4 text-neutral-400" />
                        <span>main</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Compare Branch</label>
                      <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-ink-950 font-mono text-neutral-800 dark:text-glow-100 focus:outline-none focus:ring-1 focus:ring-teal-500">
                        <option>release/v2.4.0</option>
                        <option>release/v2.3.1</option>
                        <option>hotfix/ledger-sync</option>
                      </select>
                    </div>

                    <div className="rounded-xl bg-teal-500/5 border border-teal-500/10 p-3 text-xs text-neutral-600 dark:text-glow-100/50 leading-relaxed">
                      This POC uses a simulated Git workspace to run branches comparison. Click "Generate Summary" to view the output reports.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunGit}
                    disabled={gitStatus === 'loading'}
                    className="w-full py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {gitStatus === 'loading' ? 'Analyzing...' : 'Generate Summary'}
                  </button>
                </div>

                {/* Output Screen */}
                <div className="flex-1 flex flex-col rounded-2xl border border-neutral-200 bg-white dark:border-white/[0.08] dark:bg-ink-900 overflow-hidden">
                  {gitStatus === 'idle' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <FaCodeBranch className="size-12 text-neutral-300 dark:text-glow-200/10 mb-3" />
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">No Analysis Executed</h4>
                      <p className="text-xs text-neutral-500 dark:text-glow-100/45 max-w-sm">Trigger the release summaries analyzer from the left control panel to view outputs.</p>
                    </div>
                  )}

                  {gitStatus === 'loading' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50/50 dark:bg-ink-950/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-500 animate-spin mb-4">
                        <HiArrowPath className="size-6" />
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">{loadingPhrases[loadingStep]}</p>
                      <div className="w-64 h-1.5 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300" 
                          style={{ width: `${((loadingStep + 1) / loadingPhrases.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {gitStatus === 'success' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex border-b border-neutral-200/80 px-4 bg-neutral-50 dark:border-white/[0.06] dark:bg-ink-950">
                        <button
                          type="button"
                          onClick={() => setGitActivePanel('business')}
                          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                            gitActivePanel === 'business'
                              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                              : 'border-transparent text-neutral-400 hover:text-neutral-950'
                          }`}
                        >
                          Business Summary
                        </button>
                        <button
                          type="button"
                          onClick={() => setGitActivePanel('technical')}
                          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                            gitActivePanel === 'technical'
                              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                              : 'border-transparent text-neutral-400 hover:text-neutral-950'
                          }`}
                        >
                          Technical Summary
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 font-sans">
                        {gitActivePanel === 'business' ? (
                          <div className="space-y-6 max-w-prose">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">High-Level Value</h4>
                              <p className="text-sm text-neutral-800 dark:text-glow-100/90 leading-relaxed font-medium">
                                {MOCK_GIT_SUMMARY.business.overview}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Core Deliverables &amp; Benefits</h4>
                              <ul className="space-y-3">
                                {MOCK_GIT_SUMMARY.business.value.map((val, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-glow-100/60 leading-relaxed">
                                    <HiCheckCircle className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                                    <span>{val}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">APIs Exposed &amp; Altered</h4>
                              <div className="divide-y divide-neutral-200/60 dark:divide-white/[0.04] border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden">
                                {MOCK_GIT_SUMMARY.technical.endpoints.map((ep, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-ink-950/20 text-xs">
                                    <span className="font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 rounded font-bold">{ep.method}</span>
                                    <span className="font-mono text-neutral-800 dark:text-glow-100 font-bold">{ep.path}</span>
                                    <span className="text-neutral-500 dark:text-glow-100/40 ml-auto">{ep.desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Auditable File Traceability</h4>
                              <table className="w-full text-left text-xs border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden">
                                <thead>
                                  <tr className="bg-neutral-50 dark:bg-ink-950 border-b border-neutral-200 dark:border-white/10 text-neutral-400 font-semibold">
                                    <th className="p-3">File Name</th>
                                    <th className="p-3">Changes</th>
                                    <th className="p-3">Primary Author</th>
                                    <th className="p-3 text-right">PR Approvers</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.04]">
                                  {MOCK_GIT_SUMMARY.technical.files.map((file, idx) => (
                                    <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-ink-950/10 text-neutral-600 dark:text-glow-100/70">
                                      <td className="p-3 font-mono font-semibold text-neutral-800 dark:text-glow-100">{file.name}</td>
                                      <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{file.changes}</td>
                                      <td className="p-3">{file.author}</td>
                                      <td className="p-3 text-right text-neutral-500 dark:text-glow-100/45 italic">{file.reviews}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Commits List</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border border-neutral-200 dark:border-white/10 rounded-xl p-3">
                                  {MOCK_GIT_SUMMARY.technical.commits.map((c, idx) => (
                                    <div key={idx} className="flex gap-2 text-xs">
                                      <span className="font-mono text-neutral-400 bg-neutral-100 dark:bg-ink-950 px-1 rounded">{c.hash}</span>
                                      <span className="truncate text-neutral-700 dark:text-glow-100/80">{c.msg}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Merge Request Approval</h4>
                                <div className="border border-neutral-200 dark:border-white/10 rounded-xl p-4 bg-neutral-50/50 dark:bg-ink-950/20 text-xs">
                                  {MOCK_GIT_SUMMARY.technical.mrs.map((mr, idx) => (
                                    <div key={idx} className="space-y-2">
                                      <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                        <FaGithub className="size-4" />
                                        <span>{mr.id}: {mr.title}</span>
                                      </div>
                                      <div className="text-neutral-500 dark:text-glow-100/40">Opened by: {mr.author}</div>
                                      <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex flex-wrap gap-2">
                                        {mr.reviewers.map((rev, i) => (
                                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 font-medium">
                                            <FaCheck className="size-2.5" />
                                            {rev}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Control Panel / Menu */}
                <div className="w-64 shrink-0 flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/[0.08] dark:bg-ink-900">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">AI Agent Capabilities</h3>
                  
                  <nav className="space-y-1 flex-1">
                    {[
                      { id: 'onboard', label: '1. Service Onboarding', badge: 'P1' },
                      { id: 'data-gen', label: '2. Relational Data Gen', badge: 'P1' },
                      { id: 'scenarios', label: '3. Scenario Generation', badge: 'P2' },
                      { id: 'chat', label: '4. Conversational Testing', badge: 'P3' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAgentStep(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                          agentStep === tab.id
                            ? 'bg-teal-500 text-white shadow'
                            : 'text-neutral-500 hover:bg-neutral-100 dark:text-glow-100/50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          agentStep === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-ink-950 dark:text-glow-100/40'
                        }`}>{tab.badge}</span>
                      </button>
                    ))}
                  </nav>
                  
                  <div className="rounded-xl border border-neutral-200 dark:border-white/10 p-3 bg-neutral-50/50 dark:bg-ink-950/20 text-[11px] text-neutral-500 dark:text-glow-100/40 leading-relaxed">
                    The AI Test Agent analyzes controller source code, validations, DDL schemas, and tickets to automate QA pipelines.
                  </div>
                </div>

                {/* Workspace Output */}
                <div className="flex-1 flex flex-col rounded-2xl border border-neutral-200 bg-white dark:border-white/[0.08] dark:bg-ink-900 overflow-hidden">
                  
                  {/* Onboarding Use Case */}
                  {agentStep === 'onboard' && (
                    <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                      <div className="flex-1 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Input: Java Controller Code</label>
                        <textarea 
                          value={onboardInput} 
                          onChange={(e) => setOnboardInput(e.target.value)}
                          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-3 font-mono text-xs text-neutral-700 dark:text-glow-100 focus:outline-none resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleRunOnboarding}
                          className="mt-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition cursor-pointer"
                        >
                          Analyze Controller
                        </button>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Output: Flow Document</label>
                        <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-4 overflow-y-auto text-xs font-mono text-neutral-600 dark:text-glow-100/70 whitespace-pre-wrap leading-relaxed">
                          {onboardOutput || "Click 'Analyze Controller' to parse validations and map endpoint contracts."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Relational Data Gen Use Case */}
                  {agentStep === 'data-gen' && (
                    <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                      <div className="flex-1 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Input: SQL DDL Schema</label>
                        <textarea 
                          value={dbInput} 
                          onChange={(e) => setDbInput(e.target.value)}
                          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-3 font-mono text-xs text-neutral-700 dark:text-glow-100 focus:outline-none resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleRunDataGen}
                          className="mt-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition cursor-pointer"
                        >
                          Generate Valid Datasets
                        </button>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Output: Compliant JSON Payloads</label>
                        <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-4 overflow-y-auto text-xs font-mono text-neutral-600 dark:text-glow-100/70 whitespace-pre-wrap leading-relaxed">
                          {dbOutput || "Click 'Generate Datasets' to inspect foreign key links and produce mock rows."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scenario Gen Use Case */}
                  {agentStep === 'scenarios' && (
                    <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                      <div className="flex-1 flex flex-col max-w-sm">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Input: Jira Story / Requirement</label>
                        <textarea 
                          value={jiraInput} 
                          onChange={(e) => setJiraInput(e.target.value)}
                          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-3 text-xs text-neutral-700 dark:text-glow-100 focus:outline-none resize-none leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={handleRunScenarios}
                          className="mt-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition cursor-pointer"
                        >
                          Generate Test Scenarios
                        </button>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Output: Scenarios Generated</label>
                        <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-ink-950 p-4 overflow-y-auto text-xs leading-relaxed">
                          {typeof scenariosOutput === 'string' && (
                            <p className="font-mono text-neutral-400">{scenariosOutput}</p>
                          )}
                          
                          {scenariosOutput && typeof scenariosOutput === 'object' && (
                            <div className="space-y-4 font-sans">
                              <div>
                                <h5 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                  <FaCheck className="size-3" /> Positive Cases
                                </h5>
                                <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-glow-100/60">
                                  {scenariosOutput.positive.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-bold text-red-500 flex items-center gap-1.5 mb-1.5">
                                  <FaTimes className="size-3" /> Negative Cases
                                </h5>
                                <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-glow-100/60">
                                  {scenariosOutput.negative.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-bold text-amber-500 flex items-center gap-1.5 mb-1.5">
                                  <HiChevronRight className="size-3.5" /> Edge Cases
                                </h5>
                                <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-glow-100/60">
                                  {scenariosOutput.edge.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                              </div>
                            </div>
                          )}

                          {!scenariosOutput && (
                            <p className="font-mono text-neutral-400">Click 'Generate Test Scenarios' to build positive, negative, and edge assertions.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conversational Testing */}
                  {agentStep === 'chat' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50/50 dark:bg-ink-950/20 p-4">
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scroll-smooth">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl rounded-2xl px-4 py-2.5 text-xs whitespace-pre-wrap leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-teal-600 text-white rounded-tr-none'
                                : 'bg-white border border-neutral-200 text-neutral-800 dark:border-white/10 dark:bg-ink-900 dark:text-glow-100/90 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-neutral-200 dark:border-white/10 dark:bg-ink-900 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-neutral-400">
                              Agent is reasoning...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat suggestions — these are the only supported prompts,
                          so lead with them rather than a free-text box that
                          would return the same canned answer for any input. */}
                      <p className="mb-2 text-[11px] text-neutral-400 dark:text-glow-100/35">
                        Pick a prompt to replay — this walkthrough has recorded answers for these two.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => handleSendChat("Generate cancellation scenarios")}
                          className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-600 dark:border-white/10 dark:bg-ink-900 dark:text-glow-100/60 hover:border-teal-500/60 transition-all cursor-pointer"
                        >
                          Generate cancellation scenarios
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendChat("Test Transfer Order with invalid warehouse")}
                          className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-600 dark:border-white/10 dark:bg-ink-900 dark:text-glow-100/60 hover:border-teal-500/60 transition-all cursor-pointer"
                        >
                          Test Transfer Order with invalid warehouse
                        </button>
                      </div>

                      {/* Input bar — deliberately disabled. A live box that
                          returns a fixed reply for any question reads as a fake
                          product; saying so outright costs nothing. */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled
                          placeholder="Free-text chat is disabled in this walkthrough — the live agent runs internally"
                          className="flex-1 cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-xs text-neutral-500 placeholder-neutral-400 focus:outline-none dark:border-white/10 dark:bg-ink-900/60 dark:text-glow-100/40"
                        />
                        <button
                          type="button"
                          disabled
                          aria-label="Sending is disabled in this walkthrough"
                          className="shrink-0 cursor-not-allowed rounded-xl bg-neutral-300 p-2.5 text-white dark:bg-white/10"
                        >
                          <HiPaperAirplane className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* How it actually works — the engineering behind the screens above.
              This is what an engineer reviewing the portfolio is looking for;
              the animations alone don't show it. */}
          <footer className="shrink-0 border-t border-neutral-200/80 bg-white px-6 py-3 dark:border-white/[0.06] dark:bg-ink-900">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-neutral-500 dark:text-glow-100/45">
              <span className="font-semibold text-neutral-700 dark:text-glow-100/70">
                Under the hood
              </span>
              <span>
                <strong className="font-semibold">Narrow LLM boundary</strong> — the model
                extracts and proposes; deterministic code executes and validates
              </span>
              <span>
                <strong className="font-semibold">Schema-valid by construction</strong> — generated
                payloads are checked against the spec, with a repair loop on failure
              </span>
              <span>
                <strong className="font-semibold">RAG over service context</strong> — spec, source
                and runbooks embedded per service
              </span>
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
