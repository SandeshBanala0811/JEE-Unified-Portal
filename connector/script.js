// Master Verified Complete Syllabus
const SYLLABUS_DATA = {
  "Mathematics": [
    "Sets, Relations & Functions",
    "Trigonometric Ratios & Transformations",
    "Trigonometric Equations",
    "Inverse Trigonometric Functions",
    "Hyperbolic Functions",
    "Properties of Triangles & Heights & Distances",
    "Complex Numbers & De Moivre’s Theorem",
    "Quadratic Equations & Expressions",
    "Theory of Equations",
    "Linear Inequalities",
    "Permutations & Combinations",
    "Mathematical Induction",
    "Binomial Theorem",
    "Sequences and Series (AP, GP, HP)",
    "Partial Fractions",
    "Matrices & Determinants",
    "Addition of Vectors",
    "Product of Vectors",
    "Locus & Transformation of Axes",
    "The Straight Line",
    "Pair of Straight Lines",
    "Circle & System of Circles",
    "Parabola",
    "Ellipse",
    "Hyperbola",
    "Three-Dimensional Geometry (Coordinates, Lines & Planes)",
    "Direction Cosines & Direction Ratios",
    "The Plane",
    "Limits and Continuity",
    "Differentiation (Methods of Differentiation)",
    "Applications of Derivatives (Tangents, Monotonicity, Maxima-Minima)",
    "Indefinite Integration",
    "Definite Integrals & Area Under Curves",
    "Differential Equations",
    "Measures of Dispersion & Statistics",
    "Probability & Random Variables",
    "Mathematical Reasoning"
  ],
  "Physics": [
    "Physical World & Units and Measurements",
    "Motion in a Straight Line (Kinematics 1D)",
    "Motion in a Plane (Vectors, Projectile & Circular)",
    "Laws of Motion & Friction",
    "Work, Energy and Power",
    "System of Particles and Centre of Mass",
    "Rotational Motion & Rigid Body Dynamics",
    "Gravitation",
    "Mechanical Properties of Solids (Elasticity)",
    "Mechanical Properties of Fluids (Hydrostatics, Viscosity & Surface Tension)",
    "Thermal Properties of Matter & Calorimetry",
    "Thermodynamics",
    "Kinetic Theory of Gases",
    "Oscillations (Simple Harmonic Motion)",
    "Waves & Sound Waves",
    "Electric Charges and Fields (Electrostatics I)",
    "Electrostatic Potential and Capacitance (Electrostatics II)",
    "Current Electricity",
    "Moving Charges and Magnetism (Magnetic Effects of Current)",
    "Magnetism and Matter",
    "Electromagnetic Induction (EMI)",
    "Alternating Current (AC)",
    "Electromagnetic Waves",
    "Ray Optics and Optical Instruments",
    "Wave Optics (Interference, Diffraction & Polarization)",
    "Dual Nature of Radiation and Matter",
    "Atoms & Atomic Structure",
    "Nuclei & Nuclear Physics",
    "Semiconductor Electronics & Logic Gates",
    "Communication Systems",
    "Experimental Physics & Error Analysis"
  ],
  "Chemistry": [
    "Some Basic Concepts of Chemistry (Mole Concept & Stoichiometry)",
    "Structure of Atom",
    "Classification of Elements and Periodicity",
    "Chemical Bonding and Molecular Structure",
    "States of Matter: Gases and Liquids",
    "Chemical Thermodynamics & Energetics",
    "Chemical Equilibrium",
    "Ionic Equilibrium & Acid-Bases",
    "Redox Reactions & Oxidation Numbers",
    "Hydrogen and its Compounds",
    "s-Block Elements (Alkali & Alkaline Earth Metals)",
    "p-Block Elements: Group 13 & 14 (Boron & Carbon Families)",
    "Environmental Chemistry",
    "General Organic Chemistry (GOC & Isomerism)",
    "Hydrocarbons (Alkanes, Alkenes, Alkynes & Arenes)",
    "Solid State",
    "Solutions & Colligative Properties",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry",
    "General Principles and Processes of Isolation of Elements (Metallurgy)",
    "p-Block Elements: Group 15, 16, 17 & 18",
    "d and f Block Elements",
    "Coordination Compounds & Organometallics",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids",
    "Organic Compounds Containing Nitrogen (Amines & Diazonium Salts)",
    "Biomolecules",
    "Polymers",
    "Chemistry in Everyday Life",
    "Practical & Analytical Chemistry (Salt Analysis)"
  ]
};

// =========================================================================
// SUPABASE CREDENTIALS CONFIGURATION
// =========================================================================
const SUPABASE_URL = 'https://dbtcyrrcsivehdqqgmie.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HCOoHkKL2mYeYn6lbMmYDg_TtDab8yA';
// =========================================================================

// Shared Client Session Identifier
let activeUser = localStorage.getItem('mpc_companion_user') || localStorage.getItem('mpc_v3_user') || "";

// Database SDK Client
let supabaseClient = null;

let mockTests = [];
let checkpoints = [];
let selectedDiff = "";
let balanceChart = null;

// Initialize Connection (With safeguard checks & REST endpoint filter)
if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && !SUPABASE_URL.includes('your-project-id')) {
  try {
    const cleanUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').trim();
    supabaseClient = supabase.createClient(cleanUrl, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error("Initialization issue with Supabase SDK Client:", err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const todayString = new Date().toISOString().split('T')[0];
  document.getElementById('mock-date').value = todayString;
  document.getElementById('checkpoint-date').value = todayString;

  populateMockLists();
  lucide.createIcons();
  verifyProfileSession();
  
  // Set default initial state for mock form configuration
  handleExamTypeChange();
});

// Populate scroll boxes with multi-select checkboxes
function populateMockLists() {
  const mathBox = document.getElementById('mock-math-chaps');
  const physBox = document.getElementById('mock-phys-chaps');
  const chemBox = document.getElementById('mock-chem-chaps');

  SYLLABUS_DATA["Mathematics"].forEach(ch => {
    mathBox.appendChild(createCheckboxItem("math-ch", ch));
  });
  SYLLABUS_DATA["Physics"].forEach(ch => {
    physBox.appendChild(createCheckboxItem("phys-ch", ch));
  });
  SYLLABUS_DATA["Chemistry"].forEach(ch => {
    chemBox.appendChild(createCheckboxItem("chem-ch", ch));
  });
}

function createCheckboxItem(prefix, name) {
  const label = document.createElement('label');
  label.className = "flex items-center gap-1.5 px-1 py-0.5 hover:bg-zinc-900 rounded cursor-pointer select-none text-[9px] text-zinc-400";
  
  const input = document.createElement('input');
  input.type = "checkbox";
  input.name = prefix;
  input.value = name;
  input.className = "rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-0 w-3 h-3";
  
  const span = document.createElement('span');
  span.className = "truncate";
  span.textContent = name;
  span.title = name;

  label.appendChild(input);
  label.appendChild(span);
  return label;
}

// Profile Modal authentication verification (Redirects to Portal Home if no session)
function verifyProfileSession() {
  const modeBadge = document.getElementById('app-mode-badge');

  if (!activeUser) {
    // Redirect to main portal home page to log in
    window.location.href = "../index.html";
    return;
  } else {
    document.getElementById('active-user-display').innerText = activeUser.toUpperCase();
    
    if (supabaseClient) {
      modeBadge.innerText = "CLOUD";
      modeBadge.className = "text-emerald-400 text-xs font-bold px-1 border border-emerald-500/20 bg-emerald-950/20 rounded";
    } else {
      modeBadge.innerText = "OFFLINE";
      modeBadge.className = "text-cyan-400 text-xs font-bold px-1 border border-cyan-500/20 bg-cyan-950/20 rounded";
    }

    loadProfileDatabases();
  }
}

function switchProfile() {
  activeUser = "";
  localStorage.removeItem('mpc_companion_user');
  localStorage.removeItem('mpc_v3_user');
  verifyProfileSession();
}

// Dynamic Loader: Cloud Sync or Local Storage Fallback
async function loadProfileDatabases() {
  if (supabaseClient) {
    showToast("Synchronizing with Cloud DB...", "cyan");
    try {
      const { data, error } = await supabaseClient
        .from('user_data')
        .select('mock_tests, checkpoints')
        .eq('username', activeUser.toLowerCase())
        .single();

      if (error) {
        // PGRST116 indicates no user profile row exists yet
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabaseClient
            .from('user_data')
            .insert([{ username: activeUser.toLowerCase(), mock_tests: [], checkpoints: [] }]);
          
          if (insertError) throw insertError;
          
          mockTests = [];
          checkpoints = [];
        } else {
          throw error;
        }
      } else if (data) {
        mockTests = data.mock_tests || [];
        checkpoints = data.checkpoints || [];
      }

      // Cache locally
      localStorage.setItem(`mpc_companion_tests_${activeUser}`, JSON.stringify(mockTests));
      localStorage.setItem(`mpc_companion_revisions_${activeUser}`, JSON.stringify(checkpoints));

      showToast("Cloud Sync Successful", "emerald");
    } catch (err) {
      console.warn("Cloud connection error. Loading local browser data:", err);
      showToast("Cloud connection error. Loaded local copy.", "rose");
      loadLocalBackup();
    }
  } else {
    loadLocalBackup();
  }
  refreshDashboard();
}

function loadLocalBackup() {
  mockTests = JSON.parse(localStorage.getItem(`mpc_companion_tests_${activeUser}`)) || [];
  checkpoints = JSON.parse(localStorage.getItem(`mpc_companion_revisions_${activeUser}`)) || [];
}

// Populate Dynamic Cascading Chapter Selector
function populateChapters() {
  const subject = document.getElementById('subject-select').value;
  const chapterSelect = document.getElementById('chapter-select');

  chapterSelect.innerHTML = '<option value="" disabled selected>Select Chapter</option>';
  
  if (subject && SYLLABUS_DATA[subject]) {
    SYLLABUS_DATA[subject].forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter;
      option.textContent = chapter;
      chapterSelect.appendChild(option);
    });
    chapterSelect.disabled = false;
  } else {
    chapterSelect.disabled = true;
  }
}

function setDiffPill(level) {
  selectedDiff = level;
  document.getElementById('selected-diff').value = level;

  ['Easy', 'Medium', 'Hard'].forEach(lvl => {
    const pill = document.getElementById(`pill-${lvl}`);
    if (lvl === level) {
      pill.className = "py-1.5 text-center border font-semibold text-black rounded transition " + 
        (lvl === 'Easy' ? 'bg-emerald-400 border-emerald-400' : 
         lvl === 'Medium' ? 'bg-amber-400 border-amber-400' : 
         'bg-red-400 border-red-400');
    } else {
      pill.className = "py-1.5 text-center border border-zinc-800 bg-zinc-950/45 text-zinc-400 hover:border-" + 
        (lvl === 'Easy' ? 'emerald' : lvl === 'Medium' ? 'amber' : 'red') + "-500/40 rounded transition";
    }
  });
}

// Handles conditional layout changes based on exam standard selection
function handleExamTypeChange() {
  const type = document.getElementById('mock-type').value;
  const nameContainer = document.getElementById('mock-name-container');
  const maxContainer = document.getElementById('mock-max-container');
  
  const nameInput = document.getElementById('mock-name');
  const maxInput = document.getElementById('mock-max');

  // Reset required state
  nameInput.required = false;
  maxInput.required = false;

  if (type === 'JEE Mains') {
    nameContainer.classList.add('hidden');
    maxContainer.classList.add('hidden');
    nameInput.value = 'JEE Mains';
    maxInput.value = 300;
  } else if (type === 'BITSAT') {
    nameContainer.classList.add('hidden');
    maxContainer.classList.add('hidden');
    nameInput.value = 'BITSAT';
    maxInput.value = 390;
  } else if (type === 'EAMCET') {
    nameContainer.classList.add('hidden');
    maxContainer.classList.add('hidden');
    nameInput.value = 'EAMCET';
    maxInput.value = 160;
  } else if (type === 'JEE Advanced') {
    nameContainer.classList.add('hidden');
    maxContainer.classList.remove('hidden');
    nameInput.value = 'JEE Advanced';
    maxInput.value = ''; // Custom entry required
    maxInput.required = true;
  } else if (type === 'Custom') {
    nameContainer.classList.remove('hidden');
    maxContainer.classList.remove('hidden');
    nameInput.value = '';
    maxInput.value = '';
    nameInput.required = true;
    maxInput.required = true;
  }
}

/* Operations Writers */
async function handleMockSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('mock-type').value;
  let name = "";
  let maxMarks = 0;

  // Extract metadata dynamically based on selection
  if (type === 'Custom') {
    name = document.getElementById('mock-name').value.trim();
    maxMarks = parseInt(document.getElementById('mock-max').value, 10);
  } else if (type === 'JEE Advanced') {
    name = "JEE Advanced";
    maxMarks = parseInt(document.getElementById('mock-max').value, 10);
  } else {
    name = type;
    if (type === 'JEE Mains') maxMarks = 300;
    else if (type === 'BITSAT') maxMarks = 390;
    else if (type === 'EAMCET') maxMarks = 160;
  }

  const maths = parseInt(document.getElementById('mock-math').value, 10);
  const phys = parseInt(document.getElementById('mock-phys').value, 10);
  const chem = parseInt(document.getElementById('mock-chem').value, 10);
  const date = document.getElementById('mock-date').value;

  const mathsChapters = Array.from(document.querySelectorAll('input[name="math-ch"]:checked')).map(el => el.value);
  const physicsChapters = Array.from(document.querySelectorAll('input[name="phys-ch"]:checked')).map(el => el.value);
  const chemistryChapters = Array.from(document.querySelectorAll('input[name="chem-ch"]:checked')).map(el => el.value);

  const total = maths + phys + chem;

  if (total > maxMarks) {
    showToast("Score cannot exceed paper maximum marks.", "rose");
    return;
  }

  const mockEntry = {
    id: 'mock_' + Date.now(),
    name,
    maxMarks,
    maths,
    phys,
    chem,
    total,
    date,
    mathsChapters,
    physicsChapters,
    chemistryChapters
  };

  mockTests.unshift(mockEntry);
  
  localStorage.setItem(`mpc_companion_tests_${activeUser}`, JSON.stringify(mockTests));

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('user_data')
      .update({ mock_tests: mockTests })
      .eq('username', activeUser.toLowerCase());
    
    if (error) {
      console.error("Cloud Write Error:", error);
      showToast("Written locally. Cloud synchronization error.", "amber");
    }
  }

  refreshDashboard();

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
  document.getElementById('mock-form').reset();
  
  // Re-apply select pre-configurations
  handleExamTypeChange();
  
  const todayString = new Date().toISOString().split('T')[0];
  document.getElementById('mock-date').value = todayString;
  showToast("Mock score registered.", "emerald");
}

async function handleCheckpointSubmit(e) {
  e.preventDefault();

  const subject = document.getElementById('subject-select').value;
  const chapter = document.getElementById('chapter-select').value;
  const confidence = document.getElementById('selected-diff').value;
  const date = document.getElementById('checkpoint-date').value;

  if (!confidence) {
    showToast("Please choose confidence index.", "rose");
    return;
  }

  const checkpointEntry = {
    id: 'rev_' + Date.now(),
    subject,
    chapter,
    confidence,
    date
  };

  // Filter duplicates of this specific chapter before registering
  checkpoints = checkpoints.filter(cp => cp.chapter !== chapter);
  checkpoints.unshift(checkpointEntry);
  
  localStorage.setItem(`mpc_companion_revisions_${activeUser}`, JSON.stringify(checkpoints));

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('user_data')
      .update({ checkpoints: checkpoints })
      .eq('username', activeUser.toLowerCase());
    
    if (error) {
      console.error("Cloud write error:", error);
      showToast("Saved locally. Cloud synchronization issues.", "amber");
    }
  }

  refreshDashboard();

  document.getElementById('checkpoint-form').reset();
  document.getElementById('chapter-select').disabled = true;
  document.getElementById('chapter-select').innerHTML = '<option value="" disabled selected>Select Subject first</option>';
  
  selectedDiff = "";
  document.getElementById('selected-diff').value = "";
  ['Easy', 'Medium', 'Hard'].forEach(lvl => {
    document.getElementById(`pill-${lvl}`).className = "py-1.5 text-center border border-zinc-800 bg-zinc-950/45 text-zinc-400 hover:border-" + (lvl === 'Easy' ? 'emerald' : lvl === 'Medium' ? 'amber' : 'red') + "-500/40 rounded transition";
  });

  const todayString = new Date().toISOString().split('T')[0];
  document.getElementById('checkpoint-date').value = todayString;
  showToast("Revision checkpoint registered.", "emerald");
}

async function deleteMockRecord(id) {
  mockTests = mockTests.filter(t => t.id !== id);
  localStorage.setItem(`mpc_companion_tests_${activeUser}`, JSON.stringify(mockTests));

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('user_data')
      .update({ mock_tests: mockTests })
      .eq('username', activeUser.toLowerCase());
    
    if (error) console.error("Cloud deletion issues:", error);
  }

  refreshDashboard();
  showToast("Mock record cleared.", "rose");
}

async function deleteCheckpointRecord(id) {
  checkpoints = checkpoints.filter(c => c.id !== id);
  localStorage.setItem(`mpc_companion_revisions_${activeUser}`, JSON.stringify(checkpoints));

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('user_data')
      .update({ checkpoints: checkpoints })
      .eq('username', activeUser.toLowerCase());
    
    if (error) console.error("Cloud deletion issues:", error);
  }

  refreshDashboard();
  showToast("Checkpoint record cleared.", "rose");
}

async function resetAllData() {
  if (!activeUser) return;
  if (confirm(`Wipe mock scores under "${activeUser}"?`)) {
    localStorage.removeItem(`mpc_companion_tests_${activeUser}`);
    localStorage.removeItem(`mpc_companion_revisions_${activeUser}`);
    mockTests = [];
    checkpoints = [];

    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('user_data')
        .update({ mock_tests: [], checkpoints: [] })
        .eq('username', activeUser.toLowerCase());
      
      if (error) console.error("Cloud reset issues:", error);
    }

    refreshDashboard();
    showToast("Database reset.", "rose");
  }
}

// Dynamic resolution trigger for backlogs
async function quickResolveBacklog(subject, chapter, confidence) {
  const resolvedConfidence = confidence === "Critical" ? "Medium" : confidence;
  const todayString = new Date().toISOString().split('T')[0];

  const checkpointEntry = {
    id: 'rev_' + Date.now(),
    subject,
    chapter,
    confidence: resolvedConfidence,
    date: todayString
  };

  checkpoints = checkpoints.filter(cp => cp.chapter !== chapter);
  checkpoints.unshift(checkpointEntry);

  localStorage.setItem(`mpc_companion_revisions_${activeUser}`, JSON.stringify(checkpoints));

  if (supabaseClient) {
    showToast(`Syncing resolution for ${chapter}...`, "cyan");
    const { error } = await supabaseClient
      .from('user_data')
      .update({ checkpoints: checkpoints })
      .eq('username', activeUser.toLowerCase());

    if (error) {
      console.error("Cloud resolution write failed:", error);
      showToast("Saved locally. Cloud sync failure.", "amber");
    } else {
      showToast(`${chapter} backlog resolved!`, "emerald");
    }
  } else {
    showToast(`${chapter} backlog resolved locally!`, "emerald");
  }

  refreshDashboard();
}

// Preparation balance symmetry radar chart
function updateSymmetryChart(mathAvg, physAvg, chemAvg) {
  const ctx = document.getElementById('subjectBalanceChart');
  if (!ctx) return;

  if (balanceChart) {
    balanceChart.destroy();
  }

  balanceChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Mathematics', 'Physics', 'Chemistry'],
      datasets: [{
        data: [mathAvg, physAvg, chemAvg],
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderColor: '#22d3ee',
        borderWidth: 1.5,
        pointBackgroundColor: '#22d3ee'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 100,
          angleLines: { color: '#1e293b' },
          grid: { color: '#1e293b' },
          pointLabels: { color: '#94a3b8', font: { family: 'monospace', size: 8 } },
          ticks: { display: false }
        }
      }
    }
  });
}

// Compiles and renders comparison between latest exam and previous exam
function updateDeltaAnalysis() {
  const container = document.getElementById('delta-analysis-container');
  if (!container) return;

  if (mockTests.length < 2) {
    container.innerHTML = `
      <div class="flex items-center gap-2 p-3 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-500 font-bold uppercase">
        <i data-lucide="info" class="w-4 h-4"></i>
        <span>Velocity Tracker: Log at least 2 mock exams to analyze score progression velocity.</span>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Retrieve top two chronological logs
  const latest = mockTests[0];
  const previous = mockTests[1];

  const latestPct = Math.round((latest.total / latest.maxMarks) * 100);
  const previousPct = Math.round((previous.total / previous.maxMarks) * 100);
  const totalDelta = latestPct - previousPct;

  const subMaxLatest = latest.maxMarks / 3;
  const subMaxPrev = previous.maxMarks / 3;

  const mathLatestPct = Math.round((latest.maths / subMaxLatest) * 100);
  const mathPrevPct = Math.round((previous.maths / subMaxPrev) * 100);
  const mathDelta = mathLatestPct - mathPrevPct;

  const physLatestPct = Math.round((latest.phys / subMaxLatest) * 100);
  const physPrevPct = Math.round((previous.phys / subMaxPrev) * 100);
  const physDelta = physLatestPct - physPrevPct;

  const chemLatestPct = Math.round((latest.chem / subMaxLatest) * 100);
  const chemPrevPct = Math.round((previous.chem / subMaxPrev) * 100);
  const chemDelta = chemLatestPct - chemPrevPct;

  const formatDelta = (val) => {
    if (val > 0) return `<span class="text-emerald-400 font-semibold">▲ +${val}%</span>`;
    if (val < 0) return `<span class="text-red-400 font-semibold">▼ ${val}%</span>`;
    return `<span class="text-zinc-500 font-semibold">■ 0%</span>`;
  };

  container.innerHTML = `
    <div class="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded space-y-3">
      <div class="flex justify-between items-center text-[10px] uppercase font-bold border-b border-zinc-900 pb-2">
        <span class="text-zinc-400">Comparing: "${latest.name}" vs "${previous.name}"</span>
        <span>Total Increase In Marks: ${formatDelta(totalDelta)}</span>
      </div>
      
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-zinc-900/40 p-2 border border-zinc-900 rounded">
          <span class="block text-[8px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Mathematics</span>
          <span class="block text-xs font-bold text-zinc-100">${mathLatestPct}%</span>
          <span class="block text-[9px] mt-0.5">${formatDelta(mathDelta)}</span>
        </div>
        <div class="bg-zinc-900/40 p-2 border border-zinc-900 rounded">
          <span class="block text-[8px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Physics</span>
          <span class="block text-xs font-bold text-zinc-100">${physLatestPct}%</span>
          <span class="block text-[9px] mt-0.5">${formatDelta(physDelta)}</span>
        </div>
        <div class="bg-zinc-900/40 p-2 border border-zinc-900 rounded">
          <span class="block text-[8px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Chemistry</span>
          <span class="block text-xs font-bold text-zinc-100">${chemLatestPct}%</span>
          <span class="block text-[9px] mt-0.5">${formatDelta(chemDelta)}</span>
        </div>
      </div>

      <div class="text-[9px] text-zinc-500 leading-relaxed uppercase pt-1 font-semibold">
        ${totalDelta > 0 
          ? `<span class="text-emerald-400/90 font-bold">▼ Increase In Marks:</span> Performance improved by ${totalDelta}% compared to your last test.`
          : totalDelta < 0 
            ? `<span class="text-red-400/90 font-bold">▼ Decrease In Marks:</span> Backslide of ${Math.abs(totalDelta)}% detected.`
            : `<span>■ STEADY STABILITY:</span> Overall accuracy remains equal to your previous test.`
        }
      </div>
    </div>
  `;
  lucide.createIcons();
}

/* Calculations & Board Sync */
function refreshDashboard() {
  // Update Header Metric Indicator
  document.getElementById('global-test-count').innerText = mockTests.length;

  // 1. Calculate Average Score Accuracy Percentage
  let mathSumPct = 0, physSumPct = 0, chemSumPct = 0;
  let totalTestsCount = mockTests.length;

  if (totalTestsCount > 0) {
    mockTests.forEach(test => {
      const subjectMaxMarks = test.maxMarks / 3;
      mathSumPct += (test.maths / subjectMaxMarks) * 100;
      physSumPct += (test.phys / subjectMaxMarks) * 100;
      chemSumPct += (test.chem / subjectMaxMarks) * 100;
    });

    const mathAvg = Math.min(100, Math.round(mathSumPct / totalTestsCount));
    const physAvg = Math.min(100, Math.round(physSumPct / totalTestsCount));
    const chemAvg = Math.min(100, Math.round(chemSumPct / totalTestsCount));

    document.getElementById('maths-avg-pct').innerText = `${mathAvg}%`;
    document.getElementById('maths-avg-bar').style.width = `${mathAvg}%`;

    document.getElementById('physics-avg-pct').innerText = `${physAvg}%`;
    document.getElementById('physics-avg-bar').style.width = `${physAvg}%`;

    document.getElementById('chemistry-avg-pct').innerText = `${chemAvg}%`;
    document.getElementById('chemistry-avg-bar').style.width = `${chemAvg}%`;

    updateSymmetryChart(mathAvg, physAvg, chemAvg);
  } else {
    ['maths', 'physics', 'chemistry'].forEach(sub => {
      document.getElementById(`${sub}-avg-pct`).innerText = '0%';
      document.getElementById(`${sub}-avg-bar`).style.width = '0%';
    });
    updateSymmetryChart(0, 0, 0);
  }

  // 2. Populate Ledger list (With interactive search/sort handles)
  const testLedger = document.getElementById('mock-test-ledger');
  const searchQuery = document.getElementById('ledger-search')?.value.toLowerCase().trim() || "";
  const sortBy = document.getElementById('ledger-sort')?.value || "newest";

  // Filter array
  let filteredTests = mockTests.filter(test => test.name.toLowerCase().includes(searchQuery));

  // Sort array
  if (sortBy === "oldest") {
    filteredTests.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "highest") {
    filteredTests.sort((a, b) => (b.total / b.maxMarks) - (a.total / a.maxMarks));
  } else {
    filteredTests.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (filteredTests.length === 0) {
    testLedger.innerHTML = '<p class="text-[10px] text-zinc-600 text-center py-12">No matching mock exams registered.</p>';
  } else {
    testLedger.innerHTML = '';
    filteredTests.forEach(test => {
      const pct = Math.round((test.total / test.maxMarks) * 100);
      const colorMarker = pct >= 75 ? 'border-l-emerald-500' : pct >= 50 ? 'border-l-amber-500' : 'border-l-red-500';

      const card = document.createElement('div');
      card.className = `p-2.5 bg-zinc-950 border border-zinc-800/80 rounded border-l-2 ${colorMarker} flex justify-between items-center text-[10px]`;
      card.innerHTML = `
        <div class="min-w-0 flex-1 pr-2">
          <span class="font-bold text-zinc-300 truncate block">${test.name}</span>
          <div class="flex items-center gap-2 text-[8px] text-zinc-500 uppercase mt-0.5 font-semibold">
            <span>Date: ${test.date}</span>
            <span>Marks: ${test.total}/${test.maxMarks} (${pct}%)</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right text-[8px] text-zinc-400 font-bold hidden sm:block">
            <span>M:${test.maths} P:${test.phys} C:${test.chem}</span>
          </div>
          <button onclick="deleteMockRecord('${test.id}')" class="text-zinc-600 hover:text-red-400 p-1 transition" title="Delete Score">
            <i data-lucide="trash" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
      testLedger.appendChild(card);
    });
  }

  // 3. Process Warnings & decay
  const alertsFeed = document.getElementById('backlog-alerts-feed');
  alertsFeed.innerHTML = '';

  const now = new Date();
  let urgentCount = 0;
  let decayWarningsList = [];

  // Create mapping of the latest checkpoint dates for resolution validation
  const latestCheckpointDate = {};
  checkpoints.forEach(cp => {
    if (!latestCheckpointDate[cp.chapter]) {
      latestCheckpointDate[cp.chapter] = new Date(cp.date);
    }
  });

  // Part A: Process Mock Exam < 60% failures
  mockTests.forEach(test => {
    const testDate = new Date(test.date);
    const maxSubMarks = test.maxMarks / 3;

    if (test.mathsChapters && test.mathsChapters.length > 0) {
      const mathPct = Math.round((test.maths / maxSubMarks) * 100);
      if (mathPct < 60) {
        test.mathsChapters.forEach(chap => {
          const lastRevised = latestCheckpointDate[chap];
          if (!lastRevised || lastRevised < testDate) {
            decayWarningsList.push({
              chapter: chap,
              subject: "Mathematics",
              days: Math.floor(Math.abs(now - testDate) / (1000 * 60 * 60 * 24)),
              confidence: "Critical",
              label: `FAILED EXAM PERFORMANCE WARNING // SCORED ${mathPct}% IN MATHS ON EXAM "${test.name.toUpperCase()}"`
            });
            urgentCount++;
          }
        });
      }
    }

    if (test.physicsChapters && test.physicsChapters.length > 0) {
      const physPct = Math.round((test.phys / maxSubMarks) * 100);
      if (physPct < 60) {
        test.physicsChapters.forEach(chap => {
          const lastRevised = latestCheckpointDate[chap];
          if (!lastRevised || lastRevised < testDate) {
            decayWarningsList.push({
              chapter: chap,
              subject: "Physics",
              days: Math.floor(Math.abs(now - testDate) / (1000 * 60 * 60 * 24)),
              confidence: "Critical",
              label: `FAILED EXAM PERFORMANCE WARNING // SCORED ${physPct}% IN PHYSICS ON EXAM "${test.name.toUpperCase()}"`
            });
            urgentCount++;
          }
        });
      }
    }

    if (test.chemistryChapters && test.chemistryChapters.length > 0) {
      const chemPct = Math.round((test.chem / maxSubMarks) * 100);
      if (chemPct < 60) {
        test.chemistryChapters.forEach(chap => {
          const lastRevised = latestCheckpointDate[chap];
          if (!lastRevised || lastRevised < testDate) {
            decayWarningsList.push({
              chapter: chap,
              subject: "Chemistry",
              days: Math.floor(Math.abs(now - testDate) / (1000 * 60 * 60 * 24)),
              confidence: "Critical",
              label: `FAILED EXAM PERFORMANCE WARNING // SCORED ${chemPct}% IN CHEMISTRY ON EXAM "${test.name.toUpperCase()}"`
            });
            urgentCount++;
          }
        });
      }
    }
  });

  // Part B: Process Time Decay Revisions
  checkpoints.forEach(cp => {
    const cpDate = new Date(cp.date);
    const elapsedDays = Math.floor(Math.abs(now - cpDate) / (1000 * 60 * 60 * 24));

    let conditionMet = false;
    let warningLabel = "";

    if (cp.confidence === 'Hard' && elapsedDays > 7) {
      conditionMet = true;
      warningLabel = "HARD TOPIC ROT WARNING // NEGLECTED OVER 7 DAYS";
    } else if (cp.confidence === 'Medium' && elapsedDays > 14) {
      conditionMet = true;
      warningLabel = "MEDIUM TOPIC ROT WARNING // NEGLECTED OVER 14 DAYS";
    } else if (cp.confidence === 'Easy' && elapsedDays > 28) {
      conditionMet = true;
      warningLabel = "EASY TOPIC DECAY WARNING // NEGLECTED OVER 28 DAYS";
    }

    if (conditionMet) {
      const exists = decayWarningsList.some(item => item.chapter === cp.chapter);
      if (!exists) {
        decayWarningsList.push({
          chapter: cp.chapter,
          subject: cp.subject,
          days: elapsedDays,
          confidence: cp.confidence,
          label: warningLabel
        });
        urgentCount++;
      }
    }
  });

  document.getElementById('global-backlog-count').innerText = urgentCount;

  if (decayWarningsList.length === 0) {
    alertsFeed.innerHTML = `
      <div class="flex items-center gap-2 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-bold">
        <i data-lucide="shield-check" class="w-4 h-4"></i>
        <span>SYSTEM MONITOR STABLE // ALL TESTED & LEARNED TOPICS OPTIMIZED</span>
      </div>
    `;
  } else {
    decayWarningsList.sort((a, b) => b.days - a.days);
    decayWarningsList.forEach(item => {
      const warnCard = document.createElement('div');
      const borderStyle = item.confidence === 'Critical' ? 'border-red-500 bg-red-950/20 text-red-200' : item.confidence === 'Hard' ? 'border-red-500/30 bg-red-950/10 text-red-300' : 'border-amber-500/30 bg-amber-950/10 text-amber-300';
      warnCard.className = `p-2.5 border rounded flex justify-between items-center text-[10px] leading-tight font-bold ${borderStyle}`;
      warnCard.innerHTML = `
        <div class="truncate pr-2">
          <span class="text-[8px] tracking-wider opacity-85 font-bold uppercase block text-xs">${item.label}</span>
          <span class="block truncate font-bold text-zinc-200 mt-1" title="${item.chapter}">${item.chapter}</span>
        </div>
        <div class="shrink-0 flex items-center gap-3 ml-2 text-right text-[9px]">
          <div>
            <span>Elapsed: ${item.days}d</span>
            <span class="block text-[8px] text-cyan-400 opacity-80 mt-0.5">Status: ${item.confidence}</span>
          </div>
          <button onclick="quickResolveBacklog('${item.subject}', '${item.chapter}', '${item.confidence}')" class="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-950/30 text-zinc-400 hover:text-emerald-400 rounded transition" title="Mark as Revised Today">
            <i data-lucide="check" class="w-3 h-3"></i>
          </button>
        </div>
      `;
      alertsFeed.appendChild(warnCard);
    });
  }

  // Populate Checkpoint Ledger
  const checkpointLedger = document.getElementById('checkpoint-ledger');
  if (checkpoints.length === 0) {
    checkpointLedger.innerHTML = '<p class="text-[10px] text-zinc-600 text-center py-12">No registered revision checkpoints found.</p>';
  } else {
    checkpointLedger.innerHTML = '';
    checkpoints.forEach(cp => {
      const cpDateStr = new Date(cp.date).toLocaleDateString();
      const subBorder = cp.subject === "Mathematics" ? "border-l-cyan-500" : cp.subject === "Physics" ? "border-l-amber-500" : "border-l-emerald-500";
      const diffBadge = cp.confidence === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : cp.confidence === 'Medium' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';

      const card = document.createElement('div');
      card.className = `p-2.5 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center border-l-2 ${subBorder} text-[10px]`;
      card.innerHTML = `
        <div class="min-w-0 flex-1 pr-2">
          <span class="font-bold text-zinc-300 block truncate" title="${cp.chapter}">${cp.chapter}</span>
          <span class="text-[8px] text-zinc-500 uppercase tracking-wider">${cp.subject} &bull; Checkpoint: ${cpDateStr}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] px-1.5 py-0.5 rounded border ${diffBadge}">${cp.confidence}</span>
          <button onclick="deleteCheckpointRecord('${cp.id}')" class="text-zinc-600 hover:text-red-400 p-1 transition" title="Delete checkpoint">
            <i data-lucide="trash" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
      checkpointLedger.appendChild(card);
    });
  }

  // Compile momentum comparison metrics between recent logs
  updateDeltaAnalysis();
  lucide.createIcons();
}

/* Notification Alerts */
function showToast(message, type = "cyan") {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  const styleClasses = {
    cyan: "bg-zinc-900 border-cyan-500/40 text-cyan-200",
    emerald: "bg-zinc-900 border-emerald-500/40 text-emerald-200",
    rose: "bg-zinc-900 border-red-500/40 text-red-200",
    amber: "bg-zinc-900 border-amber-500/40 text-amber-200"
  };

  toast.className = `flex items-center justify-between gap-3 px-3 py-2.5 border rounded shadow-md pointer-events-auto transition-all duration-300 max-w-xs animate-slide-in ${styleClasses[type] || styleClasses.cyan}`;
  toast.innerHTML = `
    <span class="text-[10px] font-semibold leading-relaxed">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-zinc-100 p-0.5">
      <i data-lucide="x" class="w-3.5 h-3.5"></i>
    </button>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.className += " opacity-0 translate-x-2";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
