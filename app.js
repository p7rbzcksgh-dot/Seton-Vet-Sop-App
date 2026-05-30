(() => {
  const APP_VERSION = '1.0.0';
  const CURRENT_KEY = 'seton-sop-current-v1';
  const LIBRARY_KEY = 'seton-sop-library-v1';
  const AUTOSAVE_DELAY = 450;
  const logoUrl = 'assets/seton-logo-clean.png';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const today = () => new Date().toISOString().slice(0, 10);
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const templates = [
    {
      name: 'Exam Room Reset Procedure',
      description: 'Clean, disinfect, restock, and reset the exam room between appointments.',
      sop: {
        title: 'Exam Room Reset After Appointment', department: 'Exam Rooms', number: 'CCR-001', revision: 'R01', author: 'Clinic Manager / RVT Lead', frequency: 'After Every Appointment', risk: 'Medium',
        purpose: 'Reset the exam room safely and consistently after each appointment so the next patient enters a clean, stocked, low-stress space.',
        safety: 'Use proper PPE when handling disinfectants. Dispose of sharps in approved containers only.',
        tools: 'Disinfectant, paper towels, gloves, trash bags, sharps container, clean towels, stocked drawers.',
        sections: [
          section('Preparation', 'Prepare the room and gather supplies.', ['Put on gloves and any other required PPE.', 'Remove visible debris and disposable items.', 'Confirm room is empty and safe to clean.']),
          section('Cleaning / Disinfection', 'Clean all patient contact surfaces.', ['Wipe exam table, counters, scale, chairs, door handles, and commonly touched areas.', 'Allow disinfectant to sit for the required contact time.', 'Replace towel or mat on the exam table.']),
          section('Restock Supplies', 'Prepare room for next patient.', ['Restock gloves, syringes, treats, sample bags, and cleaning supplies as needed.', 'Check garbage and sharps containers. Replace if required.'])
        ],
        steps: [
          step('Remove all items from the exam room', 'Take out trash, used materials, and equipment that does not belong in the room.'),
          step('Disinfect all surfaces', 'Wipe down patient contact surfaces with approved disinfectant and allow required contact time.'),
          step('Restock and reset', 'Replace towels, restock drawers, and prepare the room for the next appointment.'),
          step('Final check', 'Confirm the room looks clean, organized, and ready for the next patient.')
        ]
      }
    },
    {
      name: 'Surgery Prep Procedure',
      description: 'Standard setup for surgical room readiness and pre-op preparation.',
      sop: {
        title: 'Surgery Room Prep', department: 'Surgery', number: 'SUR-001', revision: 'R01', author: 'Surgery Lead / RVT', frequency: 'Daily', risk: 'High',
        purpose: 'Prepare the surgery area consistently so procedures begin with the proper equipment, cleanliness, and safety checks completed.',
        safety: 'Follow sterile handling requirements. Confirm patient identity and procedure before setup is finalized.',
        tools: 'Sterile packs, gowns, gloves, monitoring equipment, anesthesia supplies, disinfectant, surgical checklist.',
        sections: [
          section('Room Readiness', 'Confirm the surgery room is clean and ready.', ['Check that surfaces are disinfected.', 'Confirm sterile field supplies are available.', 'Confirm equipment is plugged in and functioning.']),
          section('Patient Safety Checks', 'Complete pre-op safety checks.', ['Confirm patient ID.', 'Confirm procedure and consent.', 'Confirm allergies and medication notes.'])
        ],
        steps: [
          step('Clean and inspect room', 'Confirm room is clean and ready for surgery setup.'),
          step('Stage supplies', 'Place required sterile packs and supplies in the room.'),
          step('Complete safety checklist', 'Verify patient and procedure details before proceeding.')
        ]
      }
    },
    {
      name: 'Dental Intake Procedure',
      description: 'Patient intake and preparation workflow for dental appointments.',
      sop: {
        title: 'Dental Intake and Prep', department: 'Dental', number: 'DEN-001', revision: 'R01', author: 'Dental Lead / RVT', frequency: 'As Needed', risk: 'Medium',
        purpose: 'Ensure each dental patient is admitted, assessed, and prepared consistently before dental work begins.',
        safety: 'Confirm fasting instructions, patient history, and anesthetic risk notes before proceeding.',
        tools: 'Dental chart, intake form, scale, patient kennel card, consent form, pre-anesthetic checklist.',
        sections: [
          section('Client Intake', 'Collect information from the client.', ['Confirm contact information.', 'Review consent form.', 'Ask about recent food, medication, and behaviour changes.']),
          section('Patient Prep', 'Prepare the patient for dental procedure.', ['Record weight.', 'Place kennel card.', 'Complete pre-anesthetic checklist.'])
        ],
        steps: [step('Confirm client and patient information', 'Review appointment details and consent.'), step('Complete dental intake checklist', 'Record required notes before patient prep.'), step('Move patient to treatment area', 'Use low-stress handling and update the team.')]
      }
    },
    {
      name: 'Emergency Triage Procedure',
      description: 'Initial triage flow for urgent calls or walk-in emergencies.',
      sop: {
        title: 'Emergency Triage Intake', department: 'Emergency', number: 'EMG-001', revision: 'R01', author: 'Clinic Manager / DVM', frequency: 'As Needed', risk: 'Critical',
        purpose: 'Quickly identify urgent cases, stabilize communication, and direct the client to the appropriate emergency pathway.',
        safety: 'Do not delay emergency referral when the patient needs immediate 24-hour care. Follow clinic escalation rules.',
        tools: 'Triage call guide, emergency contact list, client chart, phone script, referral contacts.',
        sections: [
          section('Initial Questions', 'Gather only the information needed for triage.', ['Species, age, and patient name.', 'Main concern and time of onset.', 'Breathing status, consciousness, bleeding, seizure, toxin exposure, or trauma.']),
          section('Escalation', 'Escalate based on triage outcome.', ['Notify DVM or RVT immediately for urgent red flags.', 'Provide emergency hospital contact if clinic cannot safely treat immediately.'])
        ],
        steps: [step('Identify red flags', 'Ask concise triage questions and listen for emergency indicators.'), step('Alert clinical team', 'Notify the appropriate clinic team member immediately.'), step('Give clear direction to client', 'Tell the client what to do next and document the call.')]
      }
    }
  ];

  function section(title, description, lines = []) { return { id: uid(), title, description, lines, images: [], collapsed: false }; }
  function step(title, details) { return { id: uid(), title, details, images: [], collapsed: false }; }
  function defaultSop() {
    return {
      id: uid(), appVersion: APP_VERSION, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'Draft',
      title: 'Exam Room Reset After Appointment', department: 'Exam Rooms', number: 'CCR-001', revision: 'R01', author: 'Clinic Manager / RVT Lead', frequency: 'After Every Appointment', effectiveDate: today(), risk: 'Medium',
      purpose: 'Reset the exam room safely and consistently after each appointment so the next patient enters a clean, stocked, low-stress space.',
      safety: 'Use proper PPE when handling disinfectants. Ensure all sharps are disposed of in approved containers.',
      tools: 'Disinfectant, paper towels, gloves, trash bags, sharps container.', attachments: [],
      sections: [section('Preparation', 'Prepare the room and gather supplies.', ['Put on gloves and any other required PPE.', 'Gather cleaning supplies and restock items as needed.', 'Open exam room door and ensure good ventilation.']), section('Procedure Steps', 'Complete the reset process in order.', ['Remove used materials.', 'Clean and disinfect patient contact surfaces.', 'Restock room supplies.']), section('Closing / Sanitization', 'Finalize the room and prepare for next patient.', ['Confirm all garbage is removed.', 'Perform a final visual check.'])],
      steps: [step('Remove all items from the exam room', 'Take out all trash, used materials, and equipment that does not belong.'), step('Clean all surfaces', 'Wipe down exam table, counters, scale, chairs, handles, and other contact points with approved disinfectant.'), step('Restock the room', 'Replace towels and restock drawers so the next appointment can begin smoothly.')]
    };
  }

  let state = loadCurrent() || defaultSop();
  let autosaveTimer = null;
  let activeView = 'builder';

  function init() {
    bindGlobalEvents();
    renderAll();
    registerServiceWorker();
    toast('Seton SOP APP ready');
  }

  function bindGlobalEvents() {
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    $('#mobileMenuBtn')?.addEventListener('click', () => $('.sidebar')?.classList.toggle('open'));
  }

  function handleClick(event) {
    const nav = event.target.closest('[data-nav]');
    if (nav) { setView(nav.dataset.nav); return; }
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    const id = actionEl.dataset.id;
    const index = Number(actionEl.dataset.index);
    switch(action) {
      case 'new-sop': newSop(); break;
      case 'save-draft': saveDraft(); break;
      case 'submit-review': setStatus('Review'); break;
      case 'publish': setStatus('Published'); break;
      case 'print-pdf': printSop(); break;
      case 'export-html': downloadHtml(); break;
      case 'export-json': downloadJson(state, fileName('json')); break;
      case 'save-file': saveToHardDrive(); break;
      case 'clear-current': clearCurrent(); break;
      case 'add-section': addSection(); break;
      case 'delete-section': deleteSection(id); break;
      case 'duplicate-section': duplicateSection(id); break;
      case 'toggle-section': toggleSection(id); break;
      case 'add-line': addLine(id); break;
      case 'delete-line': deleteLine(id, index); break;
      case 'add-step': addStep(); break;
      case 'delete-step': deleteStep(id); break;
      case 'toggle-step': toggleStep(id); break;
      case 'remove-image': removeImage(actionEl.dataset.scope, id, actionEl.dataset.imageId); break;
      case 'load-sop': loadSaved(id); break;
      case 'delete-sop': deleteSaved(id); break;
      case 'duplicate-sop': duplicateSaved(id); break;
      case 'export-saved': exportSaved(id); break;
      case 'load-template': loadTemplate(index); break;
      case 'refresh-saved': renderSaved(); break;
      default: break;
    }
  }

  function handleInput(event) {
    const target = event.target;
    if (target.matches('[data-field]')) {
      state[target.dataset.field] = target.value;
      changed();
    }
    if (target.matches('[data-section-title]')) {
      const item = findSection(target.dataset.sectionTitle); if (item) item.title = target.value; changed();
    }
    if (target.matches('[data-section-description]')) {
      const item = findSection(target.dataset.sectionDescription); if (item) item.description = target.value; changed();
    }
    if (target.matches('[data-section-line]')) {
      const item = findSection(target.dataset.sectionLine); if (item) item.lines[Number(target.dataset.index)] = target.value; changed(false);
    }
    if (target.matches('[data-step-title]')) {
      const item = findStep(target.dataset.stepTitle); if (item) item.title = target.value; changed();
    }
    if (target.matches('[data-step-details]')) {
      const item = findStep(target.dataset.stepDetails); if (item) item.details = target.value; changed(false);
    }
    if (target.matches('[data-caption]')) {
      const img = findImage(target.dataset.scope, target.dataset.id, target.dataset.imageId); if (img) img.caption = target.value; changed(false);
    }
  }

  async function handleChange(event) {
    const target = event.target;
    if (target.matches('[data-upload]')) {
      const files = Array.from(target.files || []);
      if (!files.length) return;
      const scope = target.dataset.upload;
      const targetId = target.dataset.id || null;
      await addImages(scope, targetId, files);
      target.value = '';
    }
    if (target.id === 'importInput') {
      const file = target.files?.[0];
      if (file) await importJson(file);
      target.value = '';
    }
  }

  function setView(view) {
    activeView = view;
    $$('.view').forEach(v => v.classList.remove('is-visible'));
    $(`#${view}View`)?.classList.add('is-visible');
    $$('.nav-item').forEach(n => n.classList.toggle('is-active', n.dataset.nav === view));
    $('.sidebar')?.classList.remove('open');
    $('#pageTitle').textContent = view === 'builder' ? 'Create / Edit SOP' : view === 'saved' ? 'Saved SOPs' : view === 'templates' ? 'Templates' : view === 'library' ? 'Image Library' : view === 'review' ? 'Review Queue' : 'Export / Settings';
    renderSecondaryViews();
  }

  function renderAll() {
    hydrateDetails();
    renderTopImages();
    renderSections();
    renderSteps();
    renderPreview();
    renderStatus();
    renderSecondaryViews();
  }

  function hydrateDetails() {
    $$('[data-field]').forEach(el => { el.value = state[el.dataset.field] ?? ''; });
  }

  function renderTopImages() { $('#topImageGrid').innerHTML = renderImages(state.attachments || [], 'top', 'top'); }

  function renderSections() {
    $('#sectionsList').innerHTML = (state.sections || []).map((s, idx) => `
      <article class="section-card ${s.collapsed ? 'collapsed' : ''}">
        <div class="section-top">
          <div class="number-badge">${idx + 1}</div>
          <div class="section-fields">
            <label>Full Field Title<input data-section-title="${s.id}" value="${attr(s.title)}" /></label>
            <label>Section Description<textarea data-section-description="${s.id}" rows="2">${esc(s.description)}</textarea></label>
          </div>
          <div class="row-actions">
            <button class="tiny-btn" type="button" data-action="toggle-section" data-id="${s.id}">${s.collapsed ? 'Open' : 'Collapse'}</button>
            <button class="tiny-btn" type="button" data-action="duplicate-section" data-id="${s.id}">Duplicate</button>
            <button class="tiny-btn danger" type="button" data-action="delete-section" data-id="${s.id}">Delete</button>
          </div>
        </div>
        <div class="line-list">
          ${(s.lines || []).map((line, lineIndex) => `
            <div class="line-row">
              <div class="drag-handle">⋮⋮</div>
              <input data-section-line="${s.id}" data-index="${lineIndex}" value="${attr(line)}" placeholder="Add instruction line..." />
              <button class="tiny-btn danger" type="button" data-action="delete-line" data-id="${s.id}" data-index="${lineIndex}" aria-label="Delete line">×</button>
            </div>`).join('')}
        </div>
        <div class="section-images image-grid">${renderImages(s.images || [], 'section', s.id)}</div>
        <div class="inline-actions">
          <button class="btn secondary" type="button" data-action="add-line" data-id="${s.id}">+ Add Line</button>
          <label class="image-upload-inline">+ Add Section Photos<input data-upload="section" data-id="${s.id}" type="file" multiple accept="image/*" /></label>
        </div>
      </article>`).join('');
  }

  function renderSteps() {
    $('#stepsList').innerHTML = (state.steps || []).map((s, idx) => `
      <article class="step-card ${s.collapsed ? 'collapsed' : ''}">
        <div class="step-top">
          <div class="number-badge">${idx + 1}</div>
          <div class="step-fields">
            <label>Step Title<input data-step-title="${s.id}" value="${attr(s.title)}" /></label>
          </div>
          <div class="row-actions">
            <button class="tiny-btn" type="button" data-action="toggle-step" data-id="${s.id}">${s.collapsed ? 'Open' : 'Collapse'}</button>
            <button class="tiny-btn danger" type="button" data-action="delete-step" data-id="${s.id}">Delete</button>
          </div>
        </div>
        <div class="step-body">
          <label>Step Details<textarea data-step-details="${s.id}" rows="4">${esc(s.details)}</textarea></label>
          <div class="image-grid">${renderImages(s.images || [], 'step', s.id)}</div>
        </div>
        <div class="inline-actions">
          <label class="image-upload-inline">+ Add Step Photos<input data-upload="step" data-id="${s.id}" type="file" multiple accept="image/*" /></label>
        </div>
      </article>`).join('');
  }

  function renderImages(images, scope, ownerId) {
    if (!images || images.length === 0) return `<div class="empty-images">No photos added yet.</div>`;
    return images.map(img => `
      <figure class="image-tile">
        <img src="${img.dataUrl}" alt="${attr(img.name || 'SOP photo')}" />
        <button class="remove-img" type="button" data-action="remove-image" data-scope="${scope}" data-id="${ownerId}" data-image-id="${img.id}" aria-label="Remove image">×</button>
        <input data-caption data-scope="${scope}" data-id="${ownerId}" data-image-id="${img.id}" value="${attr(img.caption || '')}" placeholder="Optional caption" />
      </figure>`).join('');
  }

  function renderPreview() {
    $('#previewPane').innerHTML = previewHtml(state);
  }

  function previewHtml(sop) {
    const statusClass = String(sop.status || 'Draft').toLowerCase().replace(/\s+/g, '-');
    const riskClass = String(sop.risk || '').toLowerCase();
    return `<article class="preview-doc">
      <div class="preview-title">
        <img src="${logoUrl}" alt="Seton Veterinary Clinic" />
        <div>
          <h3>${esc(sop.title || 'Untitled SOP')}</h3>
          <p>${esc(sop.department || '')} · ${esc(sop.number || '')} · ${esc(sop.revision || '')}</p>
          <span class="pill ${statusClass}">${esc(sop.status || 'Draft')}</span>
          <span class="pill ${riskClass}">${esc(sop.risk || 'Low')} Risk</span>
        </div>
      </div>
      <div class="meta-grid">
        <div><strong>Owner</strong><br>${esc(sop.author || '')}</div>
        <div><strong>Effective</strong><br>${esc(sop.effectiveDate || '')}</div>
        <div><strong>Review</strong><br>${esc(sop.frequency || '')}</div>
        <div><strong>Updated</strong><br>${formatDate(sop.updatedAt)}</div>
      </div>
      ${box('Purpose', sop.purpose)}
      ${box('Safety Notes', sop.safety)}
      ${box('Tools / PPE', sop.tools)}
      ${(sop.attachments || []).length ? imageStrip(sop.attachments) : ''}
      <div class="preview-box"><h4>Full Field Sections</h4>${(sop.sections || []).map(sec => `<div class="mini-section"><strong>${esc(sec.title)}</strong><p>${esc(sec.description || '')}</p><ul>${(sec.lines || []).filter(Boolean).map(l => `<li>${esc(l)}</li>`).join('')}</ul>${(sec.images || []).length ? imageStrip(sec.images) : ''}</div>`).join('')}</div>
      <div class="preview-box"><h4>Procedure Steps</h4><ol>${(sop.steps || []).map(st => `<li><strong>${esc(st.title)}</strong><br>${esc(st.details || '')}${(st.images || []).length ? imageStrip(st.images) : ''}</li>`).join('')}</ol></div>
    </article>`;
  }

  function box(title, text) { return text ? `<div class="preview-box"><h4>${esc(title)}</h4><p>${esc(text)}</p></div>` : ''; }
  function imageStrip(images) { return `<div class="print-images">${images.map(img => `<img src="${img.dataUrl}" alt="${attr(img.caption || img.name || 'SOP image')}" />`).join('')}</div>`; }

  function renderStatus() {
    $('#currentSopName').textContent = state.title || 'Untitled SOP';
    $('#currentSopStatus').textContent = state.status || 'Draft';
    $('#currentSopStatus').className = `pill ${(state.status || 'Draft').toLowerCase()}`;
    document.title = `${state.title || 'Untitled SOP'} · Seton SOP APP`;
  }

  function renderSecondaryViews() {
    renderSaved(); renderTemplates(); renderLibrary(); renderReview();
  }

  function renderSaved() {
    const list = getLibrary();
    const target = $('#savedList'); if (!target) return;
    if (!list.length) { target.innerHTML = '<div class="empty-images">No saved SOPs yet. Save a draft to add one here.</div>'; return; }
    target.innerHTML = list.sort((a,b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).map(s => savedCard(s)).join('');
  }

  function renderReview() {
    const list = getLibrary().filter(s => s.status === 'Review');
    const target = $('#reviewList'); if (!target) return;
    target.innerHTML = list.length ? list.map(s => savedCard(s, true)).join('') : '<div class="empty-images">No SOPs are currently submitted for review.</div>';
  }

  function savedCard(s, reviewMode = false) {
    return `<article class="saved-card">
      <div><h3>${esc(s.title || 'Untitled SOP')}</h3><p>${esc(s.department || '')} · ${esc(s.number || '')} · ${esc(s.revision || '')} · <span class="pill ${(s.status || '').toLowerCase()}">${esc(s.status || 'Draft')}</span><br>Updated ${formatDate(s.updatedAt)}</p></div>
      <div class="saved-actions">
        <button class="btn primary" type="button" data-action="load-sop" data-id="${s.id}">Load</button>
        ${reviewMode ? `<button class="btn navy" type="button" data-action="publish" data-id="${s.id}">Publish Current</button>` : ''}
        <button class="btn secondary" type="button" data-action="duplicate-sop" data-id="${s.id}">Duplicate</button>
        <button class="btn secondary" type="button" data-action="export-saved" data-id="${s.id}">Export</button>
        <button class="btn danger" type="button" data-action="delete-sop" data-id="${s.id}">Delete</button>
      </div>
    </article>`;
  }

  function renderTemplates() {
    const target = $('#templateList'); if (!target) return;
    target.innerHTML = templates.map((tpl, i) => `<article class="template-card"><h3>${esc(tpl.name)}</h3><p>${esc(tpl.description)}</p><button class="btn primary" type="button" data-action="load-template" data-index="${i}">Use Template</button></article>`).join('');
  }

  function renderLibrary() {
    const target = $('#libraryGrid'); if (!target) return;
    const all = [...(state.attachments || []), ...(state.sections || []).flatMap(s => s.images || []), ...(state.steps || []).flatMap(s => s.images || [])];
    target.innerHTML = all.length ? all.map(img => `<figure class="image-tile"><img src="${img.dataUrl}" alt="${attr(img.caption || img.name || 'SOP image')}" /><input value="${attr(img.caption || img.name || '')}" readonly /></figure>`).join('') : '<div class="empty-images">No images have been added to the current SOP yet.</div>';
  }

  function changed(fullRender = true) {
    state.updatedAt = new Date().toISOString();
    scheduleAutosave();
    if (fullRender) {
      renderPreview(); renderStatus(); renderLibrary();
    } else {
      renderPreview(); renderStatus();
    }
  }

  function scheduleAutosave() {
    $('#autosaveStatus').textContent = 'Saving...';
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => { saveCurrent(); $('#autosaveStatus').textContent = `Saved ${new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}`; }, AUTOSAVE_DELAY);
  }

  function saveCurrent() { localStorage.setItem(CURRENT_KEY, JSON.stringify(state)); }
  function loadCurrent() { try { return JSON.parse(localStorage.getItem(CURRENT_KEY)); } catch { return null; } }
  function getLibrary() { try { return JSON.parse(localStorage.getItem(LIBRARY_KEY)) || []; } catch { return []; } }
  function setLibrary(list) { localStorage.setItem(LIBRARY_KEY, JSON.stringify(list)); }

  function saveDraft() { state.status = state.status || 'Draft'; saveToLibrary(state); saveCurrent(); renderAll(); toast('Draft saved locally'); setView('saved'); }
  function setStatus(status) { state.status = status; saveToLibrary(state); saveCurrent(); renderAll(); toast(`SOP marked as ${status}`); }
  function saveToLibrary(sop) {
    const list = getLibrary();
    const clean = clone(sop); clean.updatedAt = new Date().toISOString(); clean.appVersion = APP_VERSION;
    const idx = list.findIndex(x => x.id === clean.id);
    if (idx >= 0) list[idx] = clean; else list.push(clean);
    setLibrary(list);
  }

  function newSop() { if (!confirm('Start a new blank SOP? Your saved SOP library will stay untouched.')) return; state = defaultSop(); saveCurrent(); renderAll(); setView('builder'); toast('New SOP started'); }
  function clearCurrent() { if (!confirm('Clear the current draft and start fresh?')) return; state = defaultSop(); saveCurrent(); renderAll(); toast('Current draft cleared'); }
  function addSection() { state.sections.push(section('New Full Field Section', 'Add a description for this section.', [''])); renderSections(); changed(); }
  function deleteSection(id) { if (!confirm('Delete this full field section?')) return; state.sections = state.sections.filter(s => s.id !== id); renderSections(); changed(); }
  function duplicateSection(id) { const s = findSection(id); if (!s) return; const copy = clone(s); copy.id = uid(); copy.title = `${copy.title} Copy`; copy.images = clone(copy.images || []).map(img => ({...img, id: uid()})); state.sections.push(copy); renderSections(); changed(); }
  function toggleSection(id) { const s = findSection(id); if (!s) return; s.collapsed = !s.collapsed; renderSections(); changed(); }
  function addLine(id) { const s = findSection(id); if (!s) return; s.lines.push(''); renderSections(); changed(); }
  function deleteLine(id, index) { const s = findSection(id); if (!s) return; s.lines.splice(index, 1); if (!s.lines.length) s.lines.push(''); renderSections(); changed(); }
  function addStep() { state.steps.push(step('New procedure step', 'Add step details here.')); renderSteps(); changed(); }
  function deleteStep(id) { if (!confirm('Delete this procedure step?')) return; state.steps = state.steps.filter(s => s.id !== id); renderSteps(); changed(); }
  function toggleStep(id) { const s = findStep(id); if (!s) return; s.collapsed = !s.collapsed; renderSteps(); changed(); }

  async function addImages(scope, ownerId, files) {
    const images = await Promise.all(files.filter(f => f.type.startsWith('image/')).map(async file => ({ id: uid(), name: file.name, caption: '', dataUrl: await compressImage(file) })));
    if (!images.length) return;
    if (scope === 'top') state.attachments.push(...images);
    if (scope === 'section') findSection(ownerId)?.images.push(...images);
    if (scope === 'step') findStep(ownerId)?.images.push(...images);
    renderTopImages(); renderSections(); renderSteps(); changed(); toast(`${images.length} photo${images.length > 1 ? 's' : ''} added`);
  }

  function compressImage(file, max = 1400, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => resolve(reader.result);
        img.onload = () => {
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(scope, ownerId, imageId) {
    const remove = (arr) => arr.filter(img => img.id !== imageId);
    if (scope === 'top') state.attachments = remove(state.attachments || []);
    if (scope === 'section') { const s = findSection(ownerId); if (s) s.images = remove(s.images || []); }
    if (scope === 'step') { const s = findStep(ownerId); if (s) s.images = remove(s.images || []); }
    renderTopImages(); renderSections(); renderSteps(); changed();
  }

  function findSection(id) { return (state.sections || []).find(s => s.id === id); }
  function findStep(id) { return (state.steps || []).find(s => s.id === id); }
  function findImage(scope, ownerId, imageId) {
    let arr = [];
    if (scope === 'top') arr = state.attachments || [];
    if (scope === 'section') arr = findSection(ownerId)?.images || [];
    if (scope === 'step') arr = findStep(ownerId)?.images || [];
    return arr.find(img => img.id === imageId);
  }

  function loadSaved(id) { const found = getLibrary().find(s => s.id === id); if (!found) return; state = clone(found); saveCurrent(); renderAll(); setView('builder'); toast('SOP loaded'); }
  function deleteSaved(id) { if (!confirm('Delete this saved SOP from this browser?')) return; setLibrary(getLibrary().filter(s => s.id !== id)); renderSaved(); renderReview(); toast('Saved SOP deleted'); }
  function duplicateSaved(id) { const found = getLibrary().find(s => s.id === id); if (!found) return; const copy = clone(found); copy.id = uid(); copy.title = `${copy.title} Copy`; copy.status = 'Draft'; copy.createdAt = new Date().toISOString(); copy.updatedAt = new Date().toISOString(); saveToLibrary(copy); renderSaved(); toast('SOP duplicated'); }
  function exportSaved(id) { const found = getLibrary().find(s => s.id === id); if (found) downloadJson(found, fileName('json', found)); }
  function loadTemplate(index) { const tpl = templates[index]; if (!tpl) return; const next = { ...defaultSop(), ...clone(tpl.sop), id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), effectiveDate: today(), status: 'Draft', attachments: [] }; state = next; saveCurrent(); renderAll(); setView('builder'); toast(`${tpl.name} loaded`); }

  function printSop() {
    const win = window.open('', '_blank');
    if (!win) { toast('Popup blocked. Allow popups to print.'); return; }
    win.document.write(buildPrintableHtml(state, true));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 450);
  }

  function downloadHtml() { downloadText(fileName('html'), buildPrintableHtml(state, false), 'text/html'); toast('Printable HTML downloaded'); }
  function downloadJson(sop, name) { downloadText(name, JSON.stringify(sop, null, 2), 'application/json'); toast('SOP data downloaded'); }
  async function saveToHardDrive() {
    const content = JSON.stringify(state, null, 2);
    const name = fileName('json');
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'Seton SOP JSON', accept: { 'application/json': ['.json'] } }] });
        const writable = await handle.createWritable();
        await writable.write(content); await writable.close(); toast('SOP saved to hard drive'); return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }
    downloadText(name, content, 'application/json'); toast('SOP backup downloaded');
  }

  function buildPrintableHtml(sop, auto = false) {
    const printStyles = `
      body{margin:0;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#123142;background:#fff} .print-root{max-width:980px;margin:0 auto}.print-header{display:flex;gap:18px;align-items:center;border-bottom:3px solid #00a9b7;padding-bottom:14px;margin-bottom:18px}.print-header img{width:210px;height:auto}.print-header h1{margin:0;color:#073653;font-size:30px}.print-header p{margin:5px 0 0;color:#69808d}.print-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}.print-meta div,.print-section{border:1px solid #dce9ee;padding:10px;border-radius:8px;break-inside:avoid}.print-section{margin:10px 0}.print-section h2{color:#073653;margin:0 0 8px;font-size:18px}.print-section p{white-space:pre-wrap}.print-section li{margin:4px 0}.print-images{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.print-images img{width:165px;height:112px;object-fit:cover;border:1px solid #dce9ee;border-radius:8px}.print-footer{margin-top:26px;color:#69808d;font-size:12px;border-top:1px solid #dce9ee;padding-top:12px}@media print{body{padding:0}.no-print{display:none}.print-root{max-width:none}.print-section{page-break-inside:avoid}.print-meta{grid-template-columns:repeat(2,1fr)}}`;
    const logo = new URL(logoUrl, location.href).href;
    const sections = (sop.sections || []).map(sec => `<section class="print-section"><h2>${esc(sec.title)}</h2><p>${esc(sec.description || '')}</p><ul>${(sec.lines || []).filter(Boolean).map(l => `<li>${esc(l)}</li>`).join('')}</ul>${imageStrip(sec.images || [])}</section>`).join('');
    const steps = (sop.steps || []).map((st, i) => `<section class="print-section"><h2>Step ${i + 1}: ${esc(st.title)}</h2><p>${esc(st.details || '')}</p>${imageStrip(st.images || [])}</section>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(sop.title || 'Seton SOP')}</title><style>${printStyles}</style></head><body><main class="print-root"><div class="no-print" style="margin-bottom:16px;padding:12px;border:1px solid #dce9ee;border-radius:10px;background:#f7fbfc"><strong>Print/PDF ready.</strong> Use your browser print dialog and choose printer or Save as PDF.</div><header class="print-header"><img src="${logo}" alt="Seton Veterinary Clinic"><div><h1>${esc(sop.title || 'Untitled SOP')}</h1><p>${esc(sop.department || '')} · ${esc(sop.number || '')} · ${esc(sop.revision || '')}</p></div></header><section class="print-meta"><div><strong>Status</strong><br>${esc(sop.status || 'Draft')}</div><div><strong>Risk</strong><br>${esc(sop.risk || '')}</div><div><strong>Owner</strong><br>${esc(sop.author || '')}</div><div><strong>Effective Date</strong><br>${esc(sop.effectiveDate || '')}</div><div><strong>Review Frequency</strong><br>${esc(sop.frequency || '')}</div><div><strong>Last Updated</strong><br>${formatDate(sop.updatedAt)}</div><div><strong>App Version</strong><br>${APP_VERSION}</div><div><strong>Exported</strong><br>${new Date().toLocaleString()}</div></section><section class="print-section"><h2>Purpose</h2><p>${esc(sop.purpose || '')}</p></section><section class="print-section"><h2>Safety Notes / Warnings</h2><p>${esc(sop.safety || '')}</p></section><section class="print-section"><h2>Required Tools / PPE</h2><p>${esc(sop.tools || '')}</p></section>${(sop.attachments || []).length ? `<section class="print-section"><h2>Photos / Attachments</h2>${imageStrip(sop.attachments || [])}</section>` : ''}<section class="print-section"><h2>Full Field Sections</h2></section>${sections}<section class="print-section"><h2>Procedure Steps</h2></section>${steps}<footer class="print-footer">Generated by Seton Vet Clinic SOP APP. Data is stored locally in the browser unless exported or printed.</footer></main>${auto ? '<script>setTimeout(() => window.print(), 600)<\/script>' : ''}</body></html>`;
  }

  function downloadText(filename, text, mime) { const blob = new Blob([text], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function fileName(ext, sop = state) { const safe = (sop.title || 'seton-sop').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'seton-sop'; return `${safe}-${sop.revision || 'R01'}.${ext}`; }

  async function importJson(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !data.title || !Array.isArray(data.sections) || !Array.isArray(data.steps)) throw new Error('Invalid SOP file');
      data.id = data.id || uid(); data.updatedAt = new Date().toISOString(); data.appVersion = APP_VERSION;
      state = data; saveCurrent(); renderAll(); setView('builder'); toast('SOP backup imported');
    } catch (err) { alert('This file could not be imported. Please choose a valid Seton SOP JSON backup.'); }
  }

  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[m])); }
  function attr(value) { return esc(value).replace(/`/g, '&#096;'); }
  function formatDate(value) { if (!value) return ''; try { return new Date(value).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }); } catch { return value; } }
  function toast(message) { const el = $('#toast'); if (!el) return; el.textContent = message; el.classList.add('show'); clearTimeout(toast._timer); toast._timer = setTimeout(() => el.classList.remove('show'), 2600); }
  function registerServiceWorker() { if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {}); }

  init();
})();
