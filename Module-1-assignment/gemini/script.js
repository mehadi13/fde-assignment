/* ==========================================================================
   NexusFDE - Modern Interactive Landing Page Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initTerminalSimulation();
  initCounterStats();
  initCapabilitiesFilter();
  initLifecycleTabs();
  initRoiCalculator();
  initFaqAccordion();
  initModalSystem();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Logic
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
      const icon = mobileToggle.querySelector('i');
      if (mainNav.classList.contains('mobile-active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   2. Terminal Live Stream Simulation
   ========================================================================== */
function initTerminalSimulation() {
  const terminalBody = document.getElementById('terminalBody');
  if (!terminalBody) return;

  const logsSequence = [
    { time: '09:00:01', tag: '[INIT]', text: 'Authenticating FDE Squad credentials with enterprise cluster...', type: 't-cyan' },
    { time: '09:00:03', tag: '[SPECS]', text: 'Ingesting architecture specs & SAML auth handshake', type: '' },
    { time: '09:00:05', tag: '[VECTOR]', text: 'Connecting Pinecone vector index (1536 dims, cosine)', type: 't-cyan' },
    { time: '09:00:07', tag: '[DEPT]', text: 'Deploying embedded microservices on K8s namespace `fde-prod`', type: 't-success' },
    { time: '09:00:09', tag: '[TELEMETRY]', text: 'OpenTelemetry pipeline operational. SLA uptime: 99.99%', type: 't-success' },
    { time: '09:00:11', tag: '[SQUAD]', text: 'Status: 2 FDEs embedded. Active PR #142 ready for review.', type: 't-cyan' }
  ];

  let logIndex = 0;

  function appendLog() {
    if (logIndex >= logsSequence.length) {
      // Loop or pause
      setTimeout(() => {
        terminalBody.innerHTML = '';
        logIndex = 0;
        appendLog();
      }, 8000);
      return;
    }

    const log = logsSequence[logIndex];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    lineEl.innerHTML = `
      <span class="t-time">${log.time}</span>
      <span class="t-tag ${log.type}">${log.tag}</span>
      <span class="${log.type}">${log.text}</span>
    `;

    terminalBody.appendChild(lineEl);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    logIndex++;

    setTimeout(appendLog, 1200);
  }

  appendLog();
}

/* ==========================================================================
   3. Counter Stats Animation (IntersectionObserver)
   ========================================================================== */
function initCounterStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              numEl.textContent = target;
              clearInterval(timer);
            } else {
              numEl.textContent = current;
            }
          }, 40);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   4. Capabilities Filter Tabs
   ========================================================================== */
function initCapabilitiesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.capability-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. FDE Lifecycle Interactive Step Process
   ========================================================================== */
function initLifecycleTabs() {
  const processContent = document.getElementById('processContent');
  const stepBtns = document.querySelectorAll('.step-nav-btn');
  if (!processContent) return;

  const stepDetails = {
    '1': {
      title: 'Phase 01: Architectural & Security Audit',
      description: 'Our Principal FDE Architect analyzes your repository, API contracts, security compliance guidelines (SOC2/HIPAA), and infrastructure dependencies to construct a 14-day deployment blueprint.',
      deliverables: [
        'Security & API Surface Mapping',
        'Repository Access & SAML Auth Setup',
        'Detailed Integration Spec & Milestones'
      ],
      code: `// Phase 01: Automated Dependency & Auth Check
$ nexus audit --target repo/enterprise-core
[✔] Security Scan: SOC2 Compliant
[✔] Schema Verified: PostgreSQL + Kafka
[✔] Roadmap Generated: 14-Day Delivery`
    },
    '2': {
      title: 'Phase 02: Sprint Embedding & Co-Development',
      description: 'Senior Forward Deployed Engineers embed inside your Slack/Teams workspace, join daily standups, and write production PRs directly in your repositories.',
      deliverables: [
        'Daily Production Code PRs',
        'Custom RAG / Middleware Connectors',
        'Automated Integration Test Suites'
      ],
      code: `// Phase 02: Embedded Squad Code Submission
git checkout -b feature/nexus-ai-pipeline
git commit -m "feat(fde): Add streaming gRPC connector"
git push origin feature/nexus-ai-pipeline
// PR #142 merged into main after automated CI pass`
    },
    '3': {
      title: 'Phase 03: Production Rollout & Telemetry',
      description: 'Zero-downtime deployment into live production clusters with active open-telemetry monitors, error alerts, and 99.99% SLA enforcement.',
      deliverables: [
        'Canary & Blue-Green Deployments',
        'Grafana & OpenTelemetry Dashboard',
        '24/7 Incident Escalation Bridge'
      ],
      code: `// Phase 03: Telemetry & Cluster Monitor
$ helm upgrade --install fde-mesh ./chart
[INFO] Deployment complete: 0 errors, 12ms latency
[INFO] Telemetry active: telemetry.nexus.internal`
    },
    '4': {
      title: 'Phase 04: Continuous Autonomous Hand-off',
      description: 'Comprehensive technical walkthroughs, recorded training sessions, and clear documentation guarantee your internal engineers maintain 100% control.',
      deliverables: [
        'Full IP & Repository Hand-off',
        'Engineers Walkthrough Workshop',
        '30-Day Codebase Warranty'
      ],
      code: `// Phase 04: Documentation & Handoff
$ nexus docs generate --export markdown
[SUCCESS] Spec saved to /docs/architecture.md
[SUCCESS] Handed off 100% codebase ownership to client team.`
    }
  };

  function renderStep(stepNumber) {
    const data = stepDetails[stepNumber];
    if (!data) return;

    processContent.innerHTML = `
      <div class="process-detail-info">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <ul class="deliverables-list">
          ${data.deliverables.map(item => `<li><i class="fa-solid fa-square-check"></i> ${item}</li>`).join('')}
        </ul>
      </div>
      <div class="process-detail-visual">
        <pre class="code-snippet"><code>${escapeHtml(data.code)}</code></pre>
      </div>
    `;
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const step = btn.getAttribute('data-step');
      renderStep(step);
    });
  });

  // Render step 1 by default
  renderStep('1');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   6. ROI & Time Savings Calculator
   ========================================================================== */
function initRoiCalculator() {
  const integrationsRange = document.getElementById('integrationsRange');
  const engineersRange = document.getElementById('engineersRange');
  const rateRange = document.getElementById('rateRange');

  const integrationsVal = document.getElementById('integrationsVal');
  const engineersVal = document.getElementById('engineersVal');
  const rateVal = document.getElementById('rateVal');

  const timeSaved = document.getElementById('timeSaved');
  const hoursSaved = document.getElementById('hoursSaved');
  const costSaved = document.getElementById('costSaved');
  const speedupX = document.getElementById('speedupX');

  if (!integrationsRange) return;

  function calculate() {
    const numIntegrations = parseInt(integrationsRange.value, 10);
    const numEngineers = parseInt(engineersRange.value, 10);
    const hourlyRate = parseInt(rateRange.value, 10);

    // Update labels
    integrationsVal.textContent = `${numIntegrations} Integration${numIntegrations > 1 ? 's' : ''}`;
    engineersVal.textContent = `${numEngineers} Engineer${numEngineers > 1 ? 's' : ''}`;
    rateVal.textContent = `$${hourlyRate} / hr`;

    // Math:
    // Traditional dev time: ~1.2 months per integration
    const standardDays = numIntegrations * 35;
    const fdeDays = Math.max(7, Math.round(numIntegrations * 3.5));

    // Hours calculation
    const savedDays = Math.max(10, standardDays - fdeDays);
    const totalHoursSaved = Math.round(savedDays * 8 * (numEngineers * 0.5));
    const totalCostSaved = totalHoursSaved * hourlyRate;
    const multiplier = (standardDays / fdeDays).toFixed(1);

    // Render results
    timeSaved.textContent = `${fdeDays} Days`;
    hoursSaved.textContent = `${totalHoursSaved.toLocaleString()} Hours`;
    costSaved.textContent = `$${totalCostSaved.toLocaleString()}`;
    speedupX.textContent = `${multiplier}x Faster`;
  }

  [integrationsRange, engineersRange, rateRange].forEach(range => {
    range.addEventListener('input', calculate);
  });

  calculate();
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all active
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. Modal Consultation Booking System
   ========================================================================== */
function initModalSystem() {
  const modalBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const auditModal = document.getElementById('auditModal');
  const auditForm = document.getElementById('auditForm');
  const formSuccess = document.getElementById('formSuccess');
  const modalResetBtn = document.getElementById('modalResetBtn');
  const ticketId = document.getElementById('ticketId');

  if (!auditModal) return;

  function openModal() {
    auditModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    auditModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Close when clicking overlay backdrop
  auditModal.addEventListener('click', (e) => {
    if (e.target === auditModal) closeModal();
  });

  // Handle form submission
  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Generate random ticket ID
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      if (ticketId) ticketId.textContent = `#FDE-${randomCode}-NEXUS`;

      // Hide form & show success state
      auditForm.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  if (modalResetBtn) {
    modalResetBtn.addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        auditForm.reset();
        auditForm.style.display = 'flex';
        formSuccess.style.display = 'none';
      }, 400);
    });
  }
}
