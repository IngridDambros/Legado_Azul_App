/* ══════════════════════════════════════════
   LEGADO AZUL — app.js v3
   Campo unificado: emoji + mic + enviar
   Linha do Tempo: + tags de humor
   Rede Legado: emoji + mic + enviar
   Microfones REMOVIDOS de formulários
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   CAMPO UNIFICADO — la-* (módulo interno)
══════════════════════════════════════════ */
const LA_EMOJIS = {
    '😊':['😊','😂','🥰','😍','🤩','😎','🥺','😢','😡','🤔','😴','💪','👏','🙌','🤝','👍','❤️','💙','💚','💛','🧡','💜','💔','✨','🌟','🎉','🔥','💎','🙏','😷'],
    '🏥':['🏥','🩺','💊','🩹','🩻','🔬','🧬','🫀','🧠','👶','🧒','👩‍⚕️','👨‍⚕️','👩‍🏫','🦽','🦯','👁️','👂','🦷','🫁','💉','🧪','🌡️','🩼','🏃'],
    '📚':['📚','📖','✏️','📝','📋','📊','📈','🎓','🏫','🎒','📐','📏','🖊️','📌','🗂️','💻','🖥️','📱','🔔','⏰','📅','🗓️','🎯','📣','🔖','💡','🔍','📎','✂️','🖇️'],
    '🌈':['🌈','☀️','🌙','⭐','🌸','🌺','🌻','🌿','🍃','🦋','🐦','🌊','🏖️','🌲','🌴','🍀','🌱','💐','🌹','🌷','🌼','🍎','🍊','🍋','🍇','🍓','☕','🍵','🧁','🎂'],
    '🏆':['🏆','🥇','🎯','🎉','🎊','🎈','🎁','🎀','🎗️','⭐','🌟','✨','💫','🔥','💎','🏅','🥈','🥉','🎖️','🏵️','🎠','🎡','🎪','🎭','🎨','🎬','🎤','🎸','🎺','🥁'],
};
const LA_CAT_KEYS = Object.keys(LA_EMOJIS);
let _laCatAtiva = '😊';

/* Monta o HTML do campo unificado e injeta em containerEl.
   ctx: identificador único (ex: 'lt', 'rede')
   opts.hasHumor: boolean — exibe tags de humor
   opts.placeholder: string
   opts.cor: CSS color para o botão enviar
   opts.onEnviar: function(texto, tag) chamada ao enviar texto
   opts.onAudio: function(blob, url) chamada ao enviar áudio
*/
function laRender(containerEl, ctx, opts = {}) {
    if (!containerEl) return;
    const cor = opts.cor || 'var(--azul-escuro)';
    const ph  = opts.placeholder || 'Escreva uma mensagem…';

    containerEl.innerHTML = `
        <div class="la-wrap" id="la-wrap-${ctx}">
            <div class="la-picker" id="la-pic-${ctx}">
                <div class="la-pcats" id="la-pcats-${ctx}"></div>
                <div class="la-pgrid" id="la-pgrid-${ctx}"></div>
            </div>
            <div class="la-bar">
                ${opts.hasHumor ? `
                <div class="la-tags" id="la-tags-${ctx}">
                    <button class="la-dot" id="la-dot-bom-${ctx}"     onclick="laSelTag('${ctx}','bom')"     style="--dc:#4caf50" title="Dia bom"></button>
                    <button class="la-dot" id="la-dot-desafio-${ctx}" onclick="laSelTag('${ctx}','desafio')" style="--dc:#f5a623" title="Desafiador"></button>
                    <button class="la-dot" id="la-dot-atencao-${ctx}" onclick="laSelTag('${ctx}','atencao')" style="--dc:#e05050" title="Atenção"></button>
                </div>` : ''}
                <div class="la-row">
                    <div class="la-field">
                        <textarea class="la-ta" id="la-ta-${ctx}"
                            placeholder="${ph}" rows="1"
                            oninput="laResize(this);${opts.hasHumor ? `laCheckTags('${ctx}',this)` : ''}"
                            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();laEnviar('${ctx}')}">
                        </textarea>
                        <div class="la-col">
                            <button class="la-btn" onclick="laTogglePic('${ctx}')" title="Emojis">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                                    <circle cx="9" cy="9" r=".6" fill="currentColor" stroke="none"/>
                                    <circle cx="15" cy="9" r=".6" fill="currentColor" stroke="none"/>
                                </svg>
                            </button>
                            <button class="la-btn" id="la-mic-${ctx}" onclick="laToggleMic('${ctx}')" title="Gravar áudio">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" y1="19" x2="12" y2="23"/>
                                    <line x1="8" y1="23" x2="16" y2="23"/>
                                </svg>
                            </button>
                            <button class="la-send" id="la-send-${ctx}"
                                style="--canal-cor:${cor}"
                                onclick="laEnviar('${ctx}')" title="Enviar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="19" x2="12" y2="5"/>
                                    <polyline points="5 12 12 5 19 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    laInitPicker(ctx);
    lucide.createIcons();

    // fecha picker ao clicar fora
    if (!window._laOutsideListener) {
        window._laOutsideListener = true;
        document.addEventListener('click', e => {
            if (!e.target.closest('.la-wrap'))
                document.querySelectorAll('.la-picker').forEach(p => p.classList.remove('open'));
        });
    }

    _laCallbacks[ctx] = { onEnviar: opts.onEnviar, onAudio: opts.onAudio };
    _laTags[ctx] = null;
}

/* state */
const _laCallbacks = {};
const _laTags = {};
let _laMR = null, _laChunks = [];

/* picker */
function laInitPicker(ctx) {
    const pcats = document.getElementById(`la-pcats-${ctx}`);
    const pgrid = document.getElementById(`la-pgrid-${ctx}`);
    if (!pcats || !pgrid) return;
    pcats.innerHTML = LA_CAT_KEYS.map(c =>
        `<button class="la-pcat${c === _laCatAtiva ? ' on' : ''}"
            onclick="laSwitchCat('${ctx}','${c}')">${c}</button>`
    ).join('');
    pgrid.innerHTML = laGridHtml(ctx, _laCatAtiva);
}
function laGridHtml(ctx, cat) {
    return (LA_EMOJIS[cat] || []).map(e =>
        `<span class="la-pe" onclick="laInsertEmoji('${ctx}','${e}')">${e}</span>`
    ).join('');
}
function laSwitchCat(ctx, cat) {
    _laCatAtiva = cat;
    const pgrid = document.getElementById(`la-pgrid-${ctx}`);
    const pcats = document.getElementById(`la-pcats-${ctx}`);
    if (pgrid) pgrid.innerHTML = laGridHtml(ctx, cat);
    if (pcats) pcats.querySelectorAll('.la-pcat').forEach((b, i) =>
        b.classList.toggle('on', LA_CAT_KEYS[i] === cat));
}
function laTogglePic(ctx) {
    const p = document.getElementById(`la-pic-${ctx}`);
    if (!p) return;
    const open = p.classList.contains('open');
    document.querySelectorAll('.la-picker').forEach(x => x.classList.remove('open'));
    if (!open) p.classList.add('open');
}
function laInsertEmoji(ctx, emoji) {
    const ta = document.getElementById(`la-ta-${ctx}`);
    if (!ta) return;
    const s = ta.selectionStart;
    ta.value = ta.value.slice(0, s) + emoji + ta.value.slice(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = s + emoji.length;
    ta.focus(); laResize(ta);
    document.getElementById(`la-pic-${ctx}`)?.classList.remove('open');
}

/* textarea resize */
function laResize(el) {
    el.style.height = "34px";
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

/* tags humor */
function laCheckTags(ctx, ta) {
    const row = document.getElementById(`la-tags-${ctx}`);
    if (!row) return;
    if (ta.value.trim()) row.classList.add('show');
    else { row.classList.remove('show'); _laTags[ctx] = null; laClearDots(ctx); }
}
function laSelTag(ctx, tag) {
    _laTags[ctx] = _laTags[ctx] === tag ? null : tag;
    laClearDots(ctx);
    if (_laTags[ctx]) document.getElementById(`la-dot-${tag}-${ctx}`)?.classList.add('on');
}
function laClearDots(ctx) {
    ['bom', 'desafio', 'atencao'].forEach(t =>
        document.getElementById(`la-dot-${t}-${ctx}`)?.classList.remove('on'));
}

/* enviar texto */
function laEnviar(ctx) {
    const ta = document.getElementById(`la-ta-${ctx}`);
    const txt = ta?.value.trim();
    if (!txt) return;
    const cb = _laCallbacks[ctx];
    if (cb?.onEnviar) cb.onEnviar(txt, _laTags[ctx] || null);
    ta.value = ''; ta.style.height = '44px';
    _laTags[ctx] = null;
    laClearDots(ctx);
    document.getElementById(`la-tags-${ctx}`)?.classList.remove('show');
    document.getElementById(`la-pic-${ctx}`)?.classList.remove('open');
}

/* mic */
async function laToggleMic(ctx) {
    const btn = document.getElementById(`la-mic-${ctx}`);
    if (_laMR && _laMR.state === 'recording') {
        _laMR.stop(); return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        _laChunks = [];
        _laMR = new MediaRecorder(stream);
        _laMR.ondataavailable = e => _laChunks.push(e.data);
        _laMR.onstop = () => {
            const blob = new Blob(_laChunks, { type: 'audio/webm' });
            const url  = URL.createObjectURL(blob);
            const cb   = _laCallbacks[ctx];
            if (cb?.onAudio) cb.onAudio(blob, url);
            stream.getTracks().forEach(t => t.stop());
            if (btn) { btn.classList.remove('rec'); lucide.createIcons(); }
            mostrarToast('✅ Áudio enviado');
        };
        _laMR.start();
        if (btn) btn.classList.add('rec');
        mostrarToast('🎙️ Gravando… toque novamente para parar');
    } catch {
        mostrarToast('❌ Microfone não disponível');
    }
}

/* atualiza cor do botão enviar (para troca de canal na LT) */
function laSetCor(ctx, cor) {
    const btn = document.getElementById(`la-send-${ctx}`);
    if (btn) btn.style.setProperty('--canal-cor', cor);
}

/* ── NAVEGAÇÃO ── */
function ir(id) {
    [1,2,3].forEach(n => {
        const el = document.getElementById('tela-nivel' + n);
        if (el) { el.classList.remove('nivel-pronto'); el.style.transform = 'translateY(110%)'; }
    });
    const backdrop = document.getElementById('nivel-backdrop');
    if (backdrop) backdrop.style.display = 'none';
    if (typeof _fecharRede === 'function') _fecharRede();
    document.querySelectorAll('.tela, .subtela').forEach(t => {
        t.classList.remove('ativa');
        t.style.cssText = '';
    });
    const destino = document.getElementById(id);
    if (!destino) { console.warn('ir(): tela não encontrada:', id); return; }
    destino.style.cssText = '';
    destino.classList.add('ativa');
    lucide.createIcons();
    if (id === 'tela-painel') atuConts();
    if (id === 'tela-historico') carregarHistorico();
    if (id === 'tela-agenda') setTimeout(renderAgenda, 80);
    if (id === 'tela-parceiros') _parcRenderizar(_parcAbaAtiva);
}

function _fecharRede() {
    const el = document.getElementById('tela-rede-legado');
    if (el) {
        el.classList.remove('ativa');
        el.style.display = 'none';
    }
}
function abrirRedeLegado() {
    if (!document.getElementById('tela-rede-legado')) {
        criarTelaRedeLegado();
        return;
    }
    const el = document.getElementById('tela-rede-legado');
    document.querySelectorAll('.tela').forEach(t => {
        t.classList.remove('ativa');
        t.style.display = '';
    });
    document.querySelectorAll('.subtela').forEach(t => t.classList.remove('ativa'));
    el.style.display = 'flex';
    el.classList.add('ativa');
    lucide.createIcons();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (d.rede?.municipio) {
        redeLegadoEstado = d.rede.estado;
        redeLegadoMunicipio = d.rede.municipio;
        mostrarChatRede(d.rede.estado, d.rede.municipio);
    } else mostrarSeletorRede();
}

function abrirPilar(p) {
    _fecharRede();
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('subtela-' + p).classList.add('ativa');
    lucide.createIcons();
}

function fecharPilar(p) {
    _fecharRede();
    document.getElementById('subtela-' + p).classList.remove('ativa');
    document.getElementById('tela-painel').classList.add('ativa');
    lucide.createIcons();
}

function abrirForm(id) {
    _fecharRede();
    document.getElementById('subtela-educacao').classList.remove('ativa');
    document.getElementById(id).classList.add('ativa');
    lucide.createIcons();
}

function fecharForm(id, volta) {
    document.getElementById(id).classList.remove('ativa');
    document.getElementById(volta).classList.add('ativa');
    lucide.createIcons();
}

function salvarFechar(id, volta) {
    const form = document.getElementById(id);
    const titulo = form.querySelector('.sti') ? form.querySelector('.sti').textContent : id;
    const campos = {};
    form.querySelectorAll('.fin, .fsel').forEach(el => {
        const label = el.closest('.frow')?.querySelector('.fla')?.textContent || '';
        if (el.value && label) campos[label] = el.value;
    });
    const pilar = getPilarDoForm(id);
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d[pilar]) d[pilar] = {};
    if (!d[pilar][id]) d[pilar][id] = [];
    d[pilar][id].push({ titulo, campos, data: new Date().toISOString(), pilar });
    localStorage.setItem('la', JSON.stringify(d));
    fecharForm(id, volta);
    atuConts();
    enviarNotificacaoLocal('✅ Registro salvo', titulo + ' foi adicionado ao seu legado.');
}

/* ══════════════════════════════════════════
   AGENDA
══════════════════════════════════════════ */
let _agData = new Date();
let _agCorSel = 'saude';

const AG_MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const AG_CATS = {
    // Saúde — amarelo
    saude:            { label: 'Consulta',         icon: 'stethoscope',    cls: 'amarelo'  },
    remedio:          { label: 'Medicação',         icon: 'pill',           cls: 'amarelo'  },
    exames:           { label: 'Exames',            icon: 'file-text',      cls: 'amarelo'  },
    exercicio:        { label: 'Exercício Físico',  icon: 'dumbbell',       cls: 'amarelo'  },
    dentista:         { label: 'Dentista',          icon: 'smile',          cls: 'amarelo'  },
    oftalmologista:   { label: 'Oftalmologista',    icon: 'eye',            cls: 'amarelo'  },
    vacinacao:        { label: 'Vacinação',         icon: 'syringe',        cls: 'amarelo'  },
    nutricionista:    { label: 'Nutricionista',     icon: 'apple',          cls: 'amarelo'  },
    // Família/Lazer/Viagem/Festa — vermelho
    familia:          { label: 'Família',           icon: 'heart',          cls: 'vermelho' },
    lazer:            { label: 'Lazer',             icon: 'gamepad-2',      cls: 'vermelho' },
    viagem:           { label: 'Viagem',            icon: 'plane',          cls: 'vermelho' },
    festa:            { label: 'Festa',             icon: 'party-popper',   cls: 'vermelho' },
    // Educação — verde
    educacao:         { label: 'Educação',          icon: 'graduation-cap', cls: 'verde'    },
    curso:            { label: 'Curso',             icon: 'book-open',      cls: 'verde'    }, // fallback legado
    linguas:          { label: 'Línguas',           icon: 'globe',          cls: 'verde'    },
    informatica:      { label: 'Informática',       icon: 'laptop',         cls: 'verde'    },
    robotica:         { label: 'Robótica',          icon: 'cpu',            cls: 'verde'    },
    desenho:          { label: 'Desenho',           icon: 'pencil',         cls: 'verde'    },
    musica:           { label: 'Música',            icon: 'headphones',     cls: 'verde'    },
    teatro:           { label: 'Teatro',            icon: 'star',           cls: 'verde'    },
    culinaria:        { label: 'Culinária',         icon: 'utensils',       cls: 'verde'    },
    artesanato:       { label: 'Artes',             icon: 'palette',        cls: 'verde'    },
    // Terapias — roxo (ordem alfabética)
    terapia:          { label: 'Terapia',           icon: 'brain',          cls: 'roxo'     }, // fallback legado
    aba:              { label: 'ABA',               icon: 'target',         cls: 'roxo'     },
    fisioterapia:     { label: 'Fisioterapia',      icon: 'biceps-flexed',  cls: 'roxo'     },
    fonoaudiologia:   { label: 'Fono',               icon: 'mic',            cls: 'roxo'     },
    musicoterapia:    { label: 'Musicoterapia',     icon: 'music',          cls: 'roxo'     },
    nutrterapeutica:  { label: 'Nutricionista',     icon: 'grape',          cls: 'roxo'     },
    psicologa:        { label: 'Psicóloga',         icon: 'brain',          cls: 'roxo'     },
    psicopedagogia:   { label: 'Psicopedagoga',     icon: 'book',           cls: 'roxo'     },
    terapocupacional: { label: 'TO',                icon: 'hand',           cls: 'roxo'     },
    // Esporte — azul
    natacao:          { label: 'Natação',           icon: 'waves',          cls: 'azul'     },
    futebol:          { label: 'Futebol',           icon: 'circle-dot',     cls: 'azul'     },
    luta:             { label: 'Luta',              icon: 'shield',         cls: 'azul'     },
    bale:             { label: 'Balé',              icon: 'music-2',        cls: 'azul'     },
    ginastica:        { label: 'Ginástica',         icon: 'sparkles',       cls: 'azul'     },
    danca:            { label: 'Dança',             icon: 'music-3',        cls: 'azul'     },
    yoga:             { label: 'Yoga',              icon: 'sun',            cls: 'azul'     },
    esporte:          { label: 'Esporte',           icon: 'activity',       cls: 'azul'     },
};

// Compatibilidade com eventos salvos com chaves antigas (cor = nome de cor)
const _AG_LEGACY = { azul:'saude', verde:'terapia', amarelo:'educacao', rosa:'familia', roxo:'remedio' };
function _agCat(cor) {
    const key = _AG_LEGACY[cor] || cor;
    return AG_CATS[key] || AG_CATS.saude;
}

function _agChave(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function _agSemanaInicio(d) {
    const r = new Date(d);
    r.setDate(r.getDate() - r.getDay());
    return r;
}

function renderAgenda() {
    const hoje = new Date();
    document.getElementById('ag-mes-nome').textContent = AG_MESES[_agData.getMonth()] + ' ' + _agData.getFullYear();
    _agRenderSemana(hoje);
    _agRenderTimeline();
    lucide.createIcons();
}

function _agRenderSemana(hoje) {
    const el = document.getElementById('ag-week-days');
    if (!el) return;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const agenda = la.agenda || {};
    const inicio = _agSemanaInicio(_agData);
    let html = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(inicio);
        d.setDate(d.getDate() + i);
        const eHoje = d.toDateString() === hoje.toDateString();
        const eSel  = d.toDateString() === _agData.toDateString();
        const cls = eHoje ? 'ag-week-day hoje' : eSel ? 'ag-week-day selecionado' : 'ag-week-day';
        const chave = _agChave(d);
        const eventos = agenda[chave] || [];
        const temEvento = eventos.length > 0;
        const dotCor = temEvento ? (eventos[0].cor || 'saude') : '';
        const cat = dotCor ? _agCat(dotCor) : null;
        const dot = temEvento && !eSel && !eHoje && cat
            ? `<div class="ag-week-day-icon ag-cat-${cat.cls}"><i data-lucide="${cat.icon}"></i></div>`
            : `<div class="ag-week-day-icon"></div>`;
        html += `<div class="${cls}" onclick="agSelecionarDia(${d.getFullYear()},${d.getMonth()},${d.getDate()})"><div class="ag-week-day-num">${d.getDate()}</div>${dot}</div>`;
    }
    el.innerHTML = html;
}

function _agRenderTimeline() {
    const el = document.getElementById('ag-timeline-inner');
    if (!el) return;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const agenda = la.agenda || {};
    const chave = _agChave(_agData);
    const tarefas = (agenda[chave] || []).slice().sort((a,b) => a.hora.localeCompare(b.hora));

    const PX_HR = 64;

    // Grade de horas (linhas fixas sem eventos dentro)
    let html = '';
    for (let h = 0; h <= 23; h++) {
        const label = `${String(h).padStart(2,'0')}:00`;
        html += `<div class="ag-time-row" onclick="agAbrirAdd('${label}')"><div class="ag-time-label">${label}</div></div>`;
    }

    // Eventos sobrepostos via posicionamento absoluto
    let evHtml = '';
    tarefas.forEach((t, idx) => {
        const [sh, sm] = t.hora.split(':').map(Number);
        const startMin = sh * 60 + sm;
        let dur = 60;
        if (t.fim) {
            const [eh, em] = t.fim.split(':').map(Number);
            dur = Math.max((eh * 60 + em) - startMin, 15);
        }
        const top    = (startMin / 60) * PX_HR;
        const height = Math.max((dur / 60) * PX_HR - 4, 40);
        const cat    = _agCat(t.cor || 'saude');
        const range  = t.fim ? `${t.hora} — ${t.fim}` : t.hora;
        const nota   = t.detalhe ? `<div class="ag-event-nota">${t.detalhe}</div>` : '';
        evHtml += `<div class="ag-event-block ag-ev-${cat.cls}" style="top:${top}px;height:${height}px;" onclick="event.stopPropagation()">
            <div class="ag-event-icon"><i data-lucide="${cat.icon}"></i></div>
            <div class="ag-event-body">
                <div class="ag-event-title">${t.texto}</div>
                <div class="ag-event-time-range">${range}</div>
                ${nota}
            </div>
            <button class="ag-event-del" onclick="event.stopPropagation(); agDeletar('${chave}',${idx})"><i data-lucide="x"></i></button>
            <button class="ag-event-edit" onclick="event.stopPropagation(); agAbrirDetalhe('${chave}',${idx})"><i data-lucide="pencil"></i></button>
        </div>`;
    });

    el.innerHTML = html + `<div class="ag-events-layer">${evHtml}</div>`;
}

function agSelecionarDia(ano, mes, dia) {
    _agData = new Date(ano, mes, dia);
    renderAgenda();
}

function agMover(dir) {
    const d = new Date(_agData);
    d.setDate(d.getDate() + dir * 7);
    _agData = d;
    renderAgenda();
}

function agAbrirAdd(hora = '') {
    document.getElementById('ag-inp-hora').value = hora;
    document.getElementById('ag-add-sheet').classList.add('ab');
    document.getElementById('ag-backdrop').classList.add('ab');
    lucide.createIcons();
}
function agFecharAdd() {
    document.getElementById('ag-add-sheet').classList.remove('ab');
    document.getElementById('ag-backdrop').classList.remove('ab');
}
function agSelCor(btn, cor) {
    document.querySelectorAll('.ag-cat-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    _agCorSel = cor;
}
function _agFmtHora(el) {
    let v = el.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + ':' + v.slice(2, 4);
    el.value = v;
}

function agSalvarTarefa() {
    const hora   = document.getElementById('ag-inp-hora').value;
    const horFim = document.getElementById('ag-inp-hora-fim').value;
    const reHora = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!hora || !reHora.test(hora)) { alert('Preencha o horário de início (ex: 09:00).'); return; }
    if (horFim && !reHora.test(horFim)) { alert('Horário de fim inválido (ex: 17:00).'); return; }
    const texto = _agCat(_agCorSel).label;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.agenda) la.agenda = {};
    const key = _agChave(_agData);
    if (!la.agenda[key]) la.agenda[key] = [];
    const entry = { hora, texto, cor: _agCorSel };
    if (horFim) entry.fim = horFim;
    la.agenda[key].push(entry);
    localStorage.setItem('la', JSON.stringify(la));
    document.getElementById('ag-inp-hora').value = '';
    document.getElementById('ag-inp-hora-fim').value = '';
    agFecharAdd();
    renderAgenda();
}
function agDeletar(key, idx) {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (la.agenda && la.agenda[key]) {
        la.agenda[key].splice(idx, 1);
        if (la.agenda[key].length === 0) delete la.agenda[key];
        localStorage.setItem('la', JSON.stringify(la));
    }
    renderAgenda();
}

let _agDetalheRef = null;
function agAbrirDetalhe(chave, idx) {
    _agDetalheRef = { chave, idx };
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const ev = la.agenda?.[chave]?.[idx];
    document.getElementById('ag-detalhe-txt').value = ev?.detalhe || '';
    document.getElementById('ag-detalhe-sheet').classList.add('ab');
    document.getElementById('ag-detalhe-backdrop').classList.add('ab');
    lucide.createIcons();
}
function agFecharDetalhe() {
    document.getElementById('ag-detalhe-sheet').classList.remove('ab');
    document.getElementById('ag-detalhe-backdrop').classList.remove('ab');
    _agDetalheRef = null;
}
function agSalvarDetalhe() {
    if (!_agDetalheRef) return;
    const { chave, idx } = _agDetalheRef;
    const detalhe = document.getElementById('ag-detalhe-txt').value.trim();
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (la.agenda?.[chave]?.[idx] !== undefined) {
        if (detalhe) la.agenda[chave][idx].detalhe = detalhe;
        else delete la.agenda[chave][idx].detalhe;
        localStorage.setItem('la', JSON.stringify(la));
    }
    agFecharDetalhe();
    renderAgenda();
}

function getPilarDoForm(id) {
    if (id.startsWith('ff-')) return 'familia';
    if (id.startsWith('fs-')) return 'saude';
    if (id.startsWith('ft-')) return 'terapia';
    if (id.startsWith('fn2-')) return 'nivel2';
    if (id.startsWith('fn3-')) return 'nivel3';
    if (id.startsWith('fes-')) return 'essencia';
    return 'educacao';
}

/* ── MODAL CADASTRO ── */
function abrirMo() {
    document.getElementById('mo-ov').classList.add('ab');
    document.getElementById('mo-cd').classList.add('ab');
}
function fecharMo() {
    document.getElementById('mo-ov').classList.remove('ab');
    document.getElementById('mo-cd').classList.remove('ab');
}

/* ══════════════════════════════════════════
   PLANOS
══════════════════════════════════════════ */
const dadosPlanos = {
    sem: { solo: { nome:'Gratuito — Acesso Social', icone:'minus', cor:'#5d8ab2', tagline:'Para começar a organizar. O primeiro passo do legado.', ancora:'Você organiza. Mas o histórico ainda fica só com você.', verificacao:'Para ter acesso gratuito, informe seu número de NIS, BPC ou CadÚnico.', sim:['Acesso completo aos 4 pilares de registro','1 perfil de criança','Histórico cronológico','Linha do Tempo pessoal'], nao:['Convite a profissionais por PIN','Backup automático na nuvem','Exportação em PDF','Rede Legado'] } },
    fam: { mensal: { nome:'Família · Teste', icone:'feather', cor:'#2c3e50', tagline:'Modo de teste ativo — R$ 0,00', ancora:'Explore todos os recursos sem custo durante o período de testes.', sim:['1 perfil de criança completo','Backup automático','Convite por PIN','Rede Legado','Exportação em PDF','Gravação de sessão','Notificações push'], nao:[] }, anual: { nome:'Família · Anual (Teste)', icone:'feather', cor:'#2c3e50', tagline:'Modo de teste — R$ 0,00', ancora:'Versão de testes com acesso completo.', sim:['Tudo do plano mensal','Relatórios formatados','Suporte prioritário'], nao:[] } },
    pro: { mensal: { nome:'Profissional · Teste', icone:'user-check', cor:'#4a7c59', tagline:'Modo de teste — R$ 0,00', ancora:'Acesse todos os recursos profissionais sem custo durante o teste.', sim:['Pacientes ilimitados','Gravação de sessão com relatório IA','Acesso ao bloco da especialidade','Perfil verificado'], nao:[] }, anual: { nome:'Profissional · Anual (Teste)', icone:'user-check', cor:'#4a7c59', tagline:'Modo de teste — R$ 0,00', ancora:'Versão de testes profissional.', sim:['Tudo do plano mensal','Exportação de relatórios em PDF'], nao:[] }, inst: { nome:'Plano Institucional', icone:'building-2', cor:'#6b3fa0', tagline:'Para clínicas, hospitais e escolas.', ancora:'Contato para proposta.', sim:['Todos os benefícios profissionais','Painel do coordenador','Nota fiscal mensal'], nao:[] } }
};
const planoPrecos = { sem:{solo:'Gratuito'}, fam:{mensal:'R$ 0,00 (teste)',anual:'R$ 0,00 (teste)'}, pro:{mensal:'R$ 0,00 (teste)',anual:'R$ 0,00 (teste)',inst:'A negociar'} };
let planoAtual = { tipo:'fam', modal:'mensal' };

function selPlano(tipo, modal) {
    planoAtual = { tipo, modal };
    document.querySelectorAll('.pcard').forEach(c => c.classList.remove('sel'));
    const idMap = {'sem-solo':'pc-sem','fam-mensal':'pc-fam-mensal','fam-anual':'pc-fam-anual','pro-mensal':'pc-pro-mensal','pro-anual':'pc-pro-anual','pro-inst':'pc-pro-inst'};
    document.getElementById(idMap[tipo+'-'+modal])?.classList.add('sel');
    document.getElementById('btn-plano').textContent = 'CONTINUAR COM: ' + planoPrecos[tipo]?.[modal];
    atualizarDetalhePlano(tipo, modal);
}

function mostrarPlanosPorPerfil(perfil) {
    const fam = document.getElementById('planos-familia');
    const pro  = document.getElementById('planos-profissional');
    const ds   = document.getElementById('pla-ds');
    if (perfil === 'familia') { fam.style.display='block'; pro.style.display='none'; if(ds) ds.textContent='Modo de teste ativo — explore todos os recursos sem custo.'; selPlano('fam','mensal'); }
    else { fam.style.display='none'; pro.style.display='block'; if(ds) ds.textContent='Modo de teste profissional — pacientes ilimitados, R$ 0,00.'; selPlano('pro','mensal'); }
}

function voltarDePlanos() { ir('tela-login'); if (_perfilSelecionado) abrirMo(); }

function confirmarPlano() {
    fecharDetalhePlano(); ir('tela-painel'); barra();
    const d = JSON.parse(localStorage.getItem('la')||'{}');
    d.planoAtivo = planoAtual;
    localStorage.setItem('la', JSON.stringify(d));
    atualizarExibicaoPlano(); solicitarPermissaoNotificacoes();
}

function atualizarExibicaoPlano() {
    const d = JSON.parse(localStorage.getItem('la')||'{}');
    const p = d.planoAtivo || { tipo:'fam', modal:'mensal' };
    const nomes = {'sem-solo':{nome:'Gratuito',preco:'R$ 0 — para sempre'},'fam-mensal':{nome:'Família · Teste',preco:'R$ 0,00 (teste)'},'fam-anual':{nome:'Família · Anual (Teste)',preco:'R$ 0,00 (teste)'},'pro-mensal':{nome:'Profissional · Teste',preco:'R$ 0,00 (teste)'},'pro-anual':{nome:'Pro · Anual (Teste)',preco:'R$ 0,00 (teste)'},'pro-inst':{nome:'Institucional',preco:'A negociar'}};
    const info = nomes[p.tipo+'-'+p.modal] || nomes['fam-mensal'];
    const prfNome=document.querySelector('.prf-plano-nome'); const prfStatus=document.querySelector('.prf-plano-status');
    if(prfNome) prfNome.innerHTML=`<i data-lucide="feather" style="width:14px;height:14px;opacity:.7"></i> ${info.nome}`;
    if(prfStatus) prfStatus.textContent=`Ativo · ${info.preco}`;
    const ajNome=document.querySelector('.aj-plano-nome'); const ajPreco=document.querySelector('.aj-plano-preco'); const ajStatus=document.querySelector('.aj-plano-status');
    if(ajNome) ajNome.innerHTML=`<i data-lucide="feather" style="width:14px;height:14px;opacity:.7"></i> ${info.nome}`;
    if(ajPreco) ajPreco.innerHTML=info.preco;
    if(ajStatus) ajStatus.textContent='✅ Ativo';
    const upgradeBox=document.querySelector('.aj-plano-upgrade'); if(upgradeBox) upgradeBox.style.display='none';
    lucide.createIcons();
}

function atualizarDetalhePlano(tipo, modal) {
    const sheet=document.getElementById('pla-sheet'); const overlay=document.getElementById('pla-sheet-ov'); const inner=document.getElementById('pla-sheet-inner');
    if (!sheet||!inner) return;
    const dados=dadosPlanos[tipo]?.[modal]; if(!dados) return;
    const simHtml=dados.sim.map(txt=>`<div class="pla-det-item"><div class="pla-det-item-ico sim">✓</div><span>${txt}</span></div>`).join('');
    const naoHtml=dados.nao&&dados.nao.length>0?`<div class="pla-det-secao">Não incluso</div><div class="pla-det-itens">${dados.nao.map(txt=>`<div class="pla-det-item nao-tem"><div class="pla-det-item-ico nao">×</div><span>${txt}</span></div>`).join('')}</div>`:'';
    const verHtml=dados.verificacao?`<p class="pla-det-verificacao">ℹ️ ${dados.verificacao}</p>`:'';
    inner.innerHTML=`<div class="pla-det-cabecalho"><div class="pla-det-ico" style="background:${dados.cor}"><i data-lucide="${dados.icone}"></i></div><div><div class="pla-det-nome">${dados.nome}</div><div class="pla-det-preco-inline">${planoPrecos[tipo]?.[modal]||''}</div></div></div><div class="pla-det-tagline">${dados.tagline}</div><div class="pla-det-secao">O que está incluso</div><div class="pla-det-itens">${simHtml}</div>${naoHtml}<div class="pla-det-ancora">${dados.ancora}</div>${verHtml}`;
    const sheetBtn=document.getElementById('pla-sheet-btn'); if(sheetBtn) sheetBtn.textContent='CONTINUAR — '+(planoPrecos[tipo]?.[modal]||'');
    lucide.createIcons();
    sheet.classList.add('ab');
    if(overlay){overlay.style.display='block';requestAnimationFrame(()=>overlay.classList.add('ab'));}
    document.body.style.overflow='hidden';
}

function fecharDetalhePlano() {
    const sheet=document.getElementById('pla-sheet'); const overlay=document.getElementById('pla-sheet-ov');
    if(sheet) sheet.classList.remove('ab');
    if(overlay){overlay.classList.remove('ab');setTimeout(()=>{overlay.style.display='none';},350);}
    document.body.style.overflow='';
}

/* ══════════════════════════════════════════
   MODAL UPGRADE
══════════════════════════════════════════ */
let _upgradeContexto=''; let _upgradePlanoSel='fam-mensal';

function abrirUpgrade(contexto) {
    _upgradeContexto=contexto||'';
    const sub=document.getElementById('upgrade-sub-txt'); if(sub) sub.textContent=contexto||'Este recurso está disponível a partir do plano pago.';
    selUpgrade('fam-mensal');
    document.getElementById('mo-upgrade-ov').classList.add('ab');
    document.getElementById('mo-upgrade-cd').classList.add('ab');
}
function fecharUpgrade() { document.getElementById('mo-upgrade-ov').classList.remove('ab'); document.getElementById('mo-upgrade-cd').classList.remove('ab'); }
function selUpgrade(plano) {
    _upgradePlanoSel=plano;
    document.querySelectorAll('.upgrade-card').forEach(c=>c.classList.remove('upgrade-card-sel'));
    document.querySelectorAll('.upgrade-card-radio').forEach(r=>{r.classList.remove('upgrade-card-radio-sel');r.innerHTML='';});
    const labels={'fam-mensal':'ATIVAR MODO TESTE — R$ 0,00','fam-anual':'ATIVAR MODO TESTE ANUAL — R$ 0,00','pro-mensal':'ATIVAR MODO TESTE PRO — R$ 0,00'};
    const cards=document.querySelectorAll('.upgrade-card'); const idx=['fam-mensal','fam-anual','pro-mensal'].indexOf(plano);
    if(cards[idx]){cards[idx].classList.add('upgrade-card-sel');const radio=cards[idx].querySelector('.upgrade-card-radio');if(radio){radio.classList.add('upgrade-card-radio-sel');radio.innerHTML='';}}
    const btn=document.getElementById('upgrade-cta-btn'); if(btn) btn.textContent=labels[plano]||'ATIVAR';
}
function confirmarUpgrade() {
    fecharUpgrade();
    const mapa={'fam-mensal':{tipo:'fam',modal:'mensal'},'fam-anual':{tipo:'fam',modal:'anual'},'pro-mensal':{tipo:'pro',modal:'mensal'}};
    planoAtual=mapa[_upgradePlanoSel]||{tipo:'fam',modal:'mensal'};
    confirmarPlano(); mostrarToast('✅ Modo teste ativado!');
}

/* ── PROGRESSO ── */
function barra() { setTimeout(()=>{const p=calcPct();document.getElementById('bfi').style.width=p+'%';document.getElementById('pct').textContent=p+'%';},500); }
function calcPct() { const d=JSON.parse(localStorage.getItem('la')||'{}');let t=0;['educacao','familia','saude','terapia'].forEach(p=>{Object.values(d[p]||{}).forEach(a=>{t+=a.length;});});return Math.min(Math.round(t/40*100),100); }

function atuConts() {
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    const map={educacao:'cnt-edu',familia:'cnt-fam',saude:'cnt-sau',terapia:'cnt-ter'};
    let totalN1=0;
    Object.entries(map).forEach(([p,id])=>{let t=0;Object.values(d[p]||{}).forEach(a=>{t+=a.length;});totalN1+=t;const el=document.getElementById(id);if(el) el.textContent=t+(t===1?' registro':' registros');});
    const c1=document.getElementById('pn-cnt-1');if(c1) c1.textContent=totalN1+(totalN1===1?' registro':' registros');
    const evolucao=d.evolucao||[];
    const n2=evolucao.filter(e=>e.nivel===2).length; const c2=document.getElementById('pn-cnt-2');if(c2) c2.textContent=n2+(n2===1?' registro':' registros');
    const n3=evolucao.filter(e=>e.nivel===3).length; const c3=document.getElementById('pn-cnt-3');if(c3) c3.textContent=n3+(n3===1?' registro':' registros');
    let totalEs=0;Object.values(d.essencia||{}).forEach(a=>{totalEs+=a.length;});const ces=document.getElementById('pn-cnt-es');if(ces) ces.textContent=totalEs+(totalEs===1?' registro':' registros');
    const p=calcPct(); const b=document.getElementById('bfi'); if(b) b.style.width=p+'%'; const pc=document.getElementById('pct'); if(pc) pc.textContent=p+'%';
    const sb=document.getElementById('psb'); if(sb) sb.textContent=p===0?'Comece adicionando registros em qualquer área.':p<30?'Bom começo! Continue construindo o legado.':p<70?'Ótimo progresso! O histórico já está tomando forma.':'Legado sólido. Cada registro é uma memória garantida.';
    atualizarBadgeRede();
}

/* ══════════════════════════════════════════
   PAINEL — dados e interações
══════════════════════════════════════════ */
const PP_DATA = {
    1: [
        { icon: 'graduation-cap', bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Desenvolvimento e Aprendizado', fn: "abrirPilar('educacao')" },
        { icon: 'heart',          bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Memórias e Valores',             fn: "abrirPilar('familia')" },
        { icon: 'stethoscope',    bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Dossiê de Saúde',                fn: "abrirPilar('saude')" },
        { icon: 'brain',          bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Evolução Terapêutica',           fn: "abrirPilar('terapia')" },
    ],
    2: [
        { icon: 'home',      bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Habilidade de Vida Diária', fn: "abrirSubtopico('sub-n2-vida')" },
        { icon: 'users',     bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Interação Social',          fn: "abrirSubtopico('sub-n2-social')" },
        { icon: 'activity',  bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Como foi a regulação?',     fn: "abrirSubtopico('sub-n2-regulacao')" },
        { icon: 'lightbulb', bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Tomou alguma decisão?',     fn: "abrirSubtopico('sub-n2-decisao')" },
    ],
    3: [
        { icon: 'zap',         bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Independência Funcional',  fn: "abrirSubtopico('sub-n3-independencia')" },
        { icon: 'globe',       bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Participação Social',      fn: "abrirSubtopico('sub-n3-participacao')" },
        { icon: 'trending-up', bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Autonomia Prática',        fn: "abrirSubtopico('sub-n3-autonomia')" },
        { icon: 'star',        bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Propósito e Protagonismo', fn: "abrirSubtopico('sub-n3-proposito')" },
    ],
    es: [
        { icon: 'sun',    bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Pequenas Alegrias',        fn: "abrirSubtopico('sub-es-alegria')" },
        { icon: 'repeat', bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Rotina de Cuidado',        fn: "abrirSubtopico('sub-es-rotina')" },
        { icon: 'shield', bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Protocolo de Apoio',       fn: "abrirSubtopico('sub-es-protocolo')" },
        { icon: 'users',  bg: 'rgba(92,160,199,.14)', stroke: '#5ca0c7', cardBg: '#eaf1f8', label: 'Rede de Cuidado e Futuro', fn: "abrirSubtopico('sub-es-rede')" },
    ]
};

function ppNivel(btn, nivel, idx) {
    document.querySelectorAll('#tela-painel .pp-tab').forEach(t => t.classList.remove('pp-tab-at'));
    btn.classList.add('pp-tab-at');
    const slider = document.getElementById('pp-slider');
    if (slider) slider.style.transform = `translateX(${(idx || 0) * 100}%)`;
    const area = document.getElementById('pp-cards');
    area.innerHTML = PP_DATA[nivel].map(c => `
        <div class="pp-card" onclick="${c.fn}" style="background:${c.cardBg}">
            <div class="pp-card-ico" style="background:${c.bg}">
                <i data-lucide="${c.icon}" style="width:18px;height:18px;stroke:${c.stroke};stroke-width:1.5"></i>
            </div>
            <span class="pp-card-nome">${c.label}</span>
            <div class="pp-card-arrow">
                <i data-lucide="chevron-right" style="width:13px;height:13px;stroke:rgba(93,138,178,.4)"></i>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function ppInit() {
    const btn = document.querySelector('#tela-painel .pp-tab.pp-tab-at');
    if (btn) ppNivel(btn, 1, 0);
}

/* ══════════════════════════════════════════
   COMUNICAÇÃO — chat por canal
══════════════════════════════════════════ */
const COM_CANAIS = {
    rede:     { nome: 'Rede Legado', msgs: [] },
    educacao: { nome: 'Educação',    msgs: [] },
    familia:  { nome: 'Família',     msgs: [] },
    saude:    { nome: 'Saúde',       msgs: [] },
    terapia:  { nome: 'Terapia',     msgs: [] },
};
const COM_SALAS_REDE = {
    medicacao: { nome: 'Medicação', msgs: [] },
    crise:     { nome: 'Crise',     msgs: [] },
    regulacao: { nome: 'Regulação', msgs: [] },
    escola:    { nome: 'Escola',    msgs: [] },
    mediacao:  { nome: 'Mediação',  msgs: [] },
    direitos:  { nome: 'Direitos',  msgs: [] },
    beneficios:{ nome: 'Benefícios',msgs: [] },
    conquistas:{ nome: 'Conquistas',msgs: [] },
};
const COM_SALAS_EDUCACAO = {
    administracao: { nome: 'Administração',    msgs: [] },
    coordenacao:   { nome: 'Coordenação',      msgs: [] },
    diretoria:     { nome: 'Diretoria',        msgs: [] },
    mediador:      { nome: 'Mediador/a',       msgs: [] },
    professora:    { nome: 'Professora',       msgs: [] },
    psicologa:     { nome: 'Psicóloga Escolar',msgs: [] },
};
const COM_SALAS_FAMILIA = {
    avo:      { nome: 'Avó',      msgs: [] },
    avo2:     { nome: 'Avô',      msgs: [] },
    madrinha: { nome: 'Madrinha', msgs: [] },
    mae:      { nome: 'Mãe',      msgs: [] },
    pai:      { nome: 'Pai',      msgs: [] },
    padrinho: { nome: 'Padrinho', msgs: [] },
    tia:      { nome: 'Tia',      msgs: [] },
    tio:      { nome: 'Tio',      msgs: [] },
};
const COM_SALAS_SAUDE = {
    cardiologista:      { nome: 'Cardiologista',       msgs: [] },
    dentista:           { nome: 'Dentista',             msgs: [] },
    gastroenterologista:{ nome: 'Gastroenterologista',  msgs: [] },
    geneticista:        { nome: 'Geneticista',          msgs: [] },
    neurologista:       { nome: 'Neurologista',         msgs: [] },
    oftalmologista:     { nome: 'Oftalmologista',       msgs: [] },
    ortopedista:        { nome: 'Ortopedista',          msgs: [] },
    otorrino:           { nome: 'Otorrinolaringologista',msgs: [] },
    pediatra:           { nome: 'Pediatra',             msgs: [] },
    psiquiatra:         { nome: 'Psiquiatra',           msgs: [] },
};
const COM_SALAS_TERAPIA = {
    aba:          { nome: 'ABA',          msgs: [] },
    fisioterapia: { nome: 'Fisioterapia', msgs: [] },
    fono:         { nome: 'Fono',         msgs: [] },
    musicoterapia:{ nome: 'Musicoterapia',msgs: [] },
    nutricionista:{ nome: 'Nutricionista',msgs: [] },
    psicologa:    { nome: 'Psicóloga',    msgs: [] },
    psicopedagoga:{ nome: 'Psicopedagoga',msgs: [] },
    to:           { nome: 'TO',           msgs: [] },
};
let _comCanal = 'educacao';
let _comSalaAtiva = 'medicacao';
let _comSalaTerapia = 'aba';
let _comSalaSaude   = 'consulta';
let _comSalaFamilia  = 'mae';
let _comSalaEducacao = 'professora';

function comSala(sala, btn, idx) {
    _comSalaAtiva = sala;
    document.querySelectorAll('#com-salas .pp-tab').forEach(t => t.classList.remove('pp-tab-at'));
    btn.classList.add('pp-tab-at');
    const slider = document.getElementById('com-salas-slider');
    if (slider) slider.style.transform = `translateX(${idx * 100}%)`;
    _comRenderizar();
}

function abrirComunicacao(canal) {
    if (canal === 'rede')     { ir('tela-rede-lobby');     return; }
    if (canal === 'terapia')  { ir('tela-terapia-lobby');  return; }
    if (canal === 'saude')    { ir('tela-saude-lobby');    return; }
    if (canal === 'familia')  { ir('tela-familia-lobby');  return; }
    if (canal === 'educacao') { ir('tela-educacao-lobby'); return; }
    _comCanal = canal || 'educacao';
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_CANAIS[_comCanal].nome;
    _comAplicarCor('#5ca0c7');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: 'var(--azul)',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const store = _comCanal === 'rede' ? COM_SALAS_REDE[_comSalaAtiva] : COM_CANAIS[_comCanal];
                store.msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function _comAplicarCor(cor) {
    const header = document.getElementById('com-header');
    if (header) header.style.background = cor;
    const sendBtn = document.getElementById('la-send-com');
    if (sendBtn) sendBtn.style.setProperty('--canal-cor', cor);
}

function abrirSalaEducacao(sala) {
    _comCanal = 'educacao';
    _comSalaEducacao = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_EDUCACAO[sala].nome;
    _comAplicarCor('#6aab8e');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#6aab8e',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                COM_SALAS_EDUCACAO[_comSalaEducacao].msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function abrirSalaFamilia(sala) {
    _comCanal = 'familia';
    _comSalaFamilia = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_FAMILIA[sala].nome;
    _comAplicarCor('#E57373');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#E57373',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                COM_SALAS_FAMILIA[_comSalaFamilia].msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function abrirSalaSaude(sala) {
    _comCanal = 'saude';
    _comSalaSaude = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_SAUDE[sala].nome;
    _comAplicarCor('#e6b84a');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#e6b84a',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                COM_SALAS_SAUDE[_comSalaSaude].msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function abrirSalaTerapia(sala) {
    _comCanal = 'terapia';
    _comSalaTerapia = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_TERAPIA[sala].nome;
    _comAplicarCor('#9b7bb8');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#9b7bb8',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                COM_SALAS_TERAPIA[_comSalaTerapia].msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function abrirSalaRede(sala) {
    _comCanal = 'rede';
    _comSalaAtiva = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_REDE[sala].nome;
    _comAplicarCor('#5ca0c7');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: 'var(--azul)',
            onEnviar: (texto) => {
                if (!texto.trim()) return;
                const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                COM_SALAS_REDE[_comSalaAtiva].msgs.push({ texto, lado: 'enviada', hora });
                _comRenderizar();
            }
        });
    }

    _comRenderizar();
    lucide.createIcons();
}

function _comRenderizar() {
    const area = document.getElementById('com-msgs');
    const msgs = _comCanal === 'rede'    ? COM_SALAS_REDE[_comSalaAtiva].msgs
               : _comCanal === 'terapia' ? COM_SALAS_TERAPIA[_comSalaTerapia].msgs
               : _comCanal === 'saude'   ? COM_SALAS_SAUDE[_comSalaSaude].msgs
               : _comCanal === 'familia'  ? COM_SALAS_FAMILIA[_comSalaFamilia].msgs
               : _comCanal === 'educacao' ? COM_SALAS_EDUCACAO[_comSalaEducacao].msgs
               : COM_CANAIS[_comCanal].msgs;
    if (msgs.length === 0) {
        area.innerHTML = `
            <div class="com-vazio">
                <div class="com-vazio-ico">
                    <i data-lucide="message-circle" style="width:30px;height:30px;stroke:#c8d8e8;stroke-width:1.5"></i>
                </div>
                <p class="com-vazio-txt">Nenhuma mensagem ainda</p>
                <p class="com-vazio-sub">Selecione o canal acima e escreva<br>sua primeira mensagem.</p>
            </div>`;
        lucide.createIcons();
    } else {
        area.innerHTML = msgs.map(m => `
            <div class="com-msg com-msg-${m.lado}">
                <div class="com-msg-bubble">${m.texto}</div>
                <span class="com-msg-hora">${m.hora}</span>
            </div>`).join('');
        area.scrollTop = area.scrollHeight;
    }
}


function fecharComunicacao() {
    if (_comCanal === 'rede')    { ir('tela-rede-lobby');    return; }
    if (_comCanal === 'terapia') { ir('tela-terapia-lobby'); return; }
    if (_comCanal === 'saude')   { ir('tela-saude-lobby');   return; }
    if (_comCanal === 'familia')  { ir('tela-familia-lobby');  return; }
    if (_comCanal === 'educacao') { ir('tela-educacao-lobby'); return; }
    ir('tela-painel');
}

function buildNavHTML(activeDestino) {
    const items = [
        { id: 'tela-agenda',    icon: 'calendar',    label: 'Calendário' },
        { id: 'tela-grafico',   icon: 'bar-chart-2', label: 'Gráfico' },
        { id: 'tela-painel',    icon: 'layout-grid', label: 'Painel', center: true },
        { id: 'tela-parceiros', icon: 'users',       label: 'Parceiros' },
        { id: 'tela-ajustes',   icon: 'settings',    label: 'Configuração' },
    ];
    return items.map(it => {
        const at = it.id === activeDestino ? ' at' : '';
        if (it.center) return `<div class="nit nit-center${at}" data-destino="${it.id}"><div class="nc-ico"><i data-lucide="${it.icon}"></i></div></div>`;
        return `<div class="nit${at}" data-destino="${it.id}"><i data-lucide="${it.icon}"></i></div>`;
    }).join('');
}

function initNavBars() {
    document.querySelectorAll('.ni').forEach(nav => {
        const activeEl = nav.querySelector('.nit.at');
        const activeId = activeEl ? activeEl.dataset.destino : '';
        nav.innerHTML = buildNavHTML(activeId);
    });
    document.querySelectorAll('.nit[data-destino]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.dataset.destino;
            if (destino) {
                document.querySelectorAll('.nit').forEach(n => n.classList.remove('at'));
                item.classList.add('at');
                ir(destino);
            }
        });
    });
}

window.onload = () => {
    initNavBars();
    ppInit();
    lucide.createIcons();
    requestAnimationFrame(() => {
        [1,2,3].forEach(n => document.getElementById('tela-nivel' + n)?.classList.add('nivel-pronto'));
    });
    atualizarExibicaoPlano(); solicitarPermissaoNotificacoes(); simularNotificacaoTeste(); carregarScriptsMapaBrasil();
};

/* ══════════════════════════════════════════
   MAPA BRASIL (paths mantidos do original)
══════════════════════════════════════════ */
const _mapaCorRegiao = { Norte:'#5ca0c7',Nordeste:'#e6b84a',CentroOeste:'#9b7bb8',Sudeste:'#6aab8e',Sul:'#5878b8' };
const _mapaRegiao = { AC:'Norte',AM:'Norte',AP:'Norte',PA:'Norte',RO:'Norte',RR:'Norte',TO:'Norte', AL:'Nordeste',BA:'Nordeste',CE:'Nordeste',MA:'Nordeste',PB:'Nordeste',PE:'Nordeste',PI:'Nordeste',RN:'Nordeste',SE:'Nordeste', DF:'CentroOeste',GO:'CentroOeste',MS:'CentroOeste',MT:'CentroOeste', ES:'Sudeste',MG:'Sudeste',RJ:'Sudeste',SP:'Sudeste', PR:'Sul',RS:'Sul',SC:'Sul' };


function abrirMenuMunicipiosRegiao(nomeRegiao, infoRegiao) {
    const area = document.getElementById('rede-municipios-area');
    if (!area) return;

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const munUsuario = d.rede?.municipio || null;
    const estUsuario = d.rede?.estado || null;
    const cepUsuario = d.perfil?.cep || null;

    let html = `
        <div class="rede-estado-header">
            <button class="rede-estado-back" onclick="mostrarSeletorRede()">←</button>
            <div>
                <div class="rede-estado-nome" style="color:${infoRegiao.cor}">${nomeRegiao}</div>
                <div style="font-size:.65rem;color:#888">${infoRegiao.estados.length} estados disponíveis</div>
            </div>
        </div>
    `;

    infoRegiao.estados.forEach(uf => {
        const estadoInfo = estadosMunicipios[uf];
        if (!estadoInfo) return;

        html += `
            <div style="margin-bottom:16px">
                <div style="font-family:'Quicksand',sans-serif;font-size:.7rem;font-weight:700;
                    color:${infoRegiao.cor};text-transform:uppercase;letter-spacing:1px;
                    padding:8px 4px 6px">
                    ${estadoInfo.nome} · ${uf}
                </div>
                <div class="rede-municip-lista">
                    ${estadoInfo.municipios.map(m => {
                        const ehMeu = m === munUsuario && uf === estUsuario;
                        const chave = `rede_${uf}_${m}`;
                        const msgs = (JSON.parse(localStorage.getItem('la') || '{}')[chave] || []);
                        const qtd = msgs.length > 0
                            ? `${msgs.length} ${msgs.length === 1 ? 'mensagem' : 'mensagens'}`
                            : 'Nenhuma mensagem ainda';
                        const podeFalar = ehMeu || !cepUsuario;
                        return `
                            <div class="rede-municip-item ${ehMeu ? 'meu-municipio' : ''}"
                                onclick="entrarMunicipioRede('${uf}','${m}')">
                                <div class="rede-municip-ico">${ehMeu ? '📍' : '🏙️'}</div>
                                <div style="flex:1">
                                    <div class="rede-municip-nm">${m}${ehMeu
                                        ? ' <span style="color:#2d83b0;font-size:.62rem">← seu grupo</span>'
                                        : ''}</div>
                                    <div class="rede-municip-meta">${qtd}${!podeFalar && !ehMeu
                                        ? ' · <span class="rede-municip-lock">🔒 só leitura</span>'
                                        : ''}</div>
                                </div>
                                <span style="color:#ccc;font-size:.8rem">›</span>
                            </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    });

    area.innerHTML = html;
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════════
   🔔 NOTIFICAÇÕES
══════════════════════════════════════════ */
let _notifPermissao=false;
async function solicitarPermissaoNotificacoes() { if(!('Notification' in window)) return; if(Notification.permission==='granted'){_notifPermissao=true;return;} if(Notification.permission==='denied') return; const r=await Notification.requestPermission(); _notifPermissao=r==='granted'; if(_notifPermissao) mostrarToast('🔔 Notificações ativadas!'); }
function enviarNotificacaoLocal(titulo,corpo,icone) { if(!_notifPermissao||!('Notification' in window)) return; if(document.visibilityState==='visible') return; try{new Notification(titulo,{body:corpo,icon:icone||'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%232d83b0"/></svg>',tag:'legado-azul'});}catch(e){} }
function simularNotificacaoTeste() { setTimeout(()=>{enviarNotificacaoLocal('💙 Rede Legado','Ingrid de São Paulo comentou no seu município.');},30000); }

/* ══════════════════════════════════════════
   GRAVAÇÃO DE SESSÃO TERAPÊUTICA
══════════════════════════════════════════ */
let sessaoGravacao = { stream:null, recorder:null, chunks:[], iniciou:null, duracao:0, timer:null, audioBlob:null };

function abrirGravacaoSessao() {
    _fecharRede();
    if (!document.getElementById('tela-gravacao-sessao')) { criarTelaSessao(); return; }
    document.querySelectorAll('.tela').forEach(t=>t.classList.remove('ativa'));
    document.getElementById('tela-gravacao-sessao').classList.add('ativa');
    lucide.createIcons();
}

function criarTelaSessao() {
    document.querySelectorAll('.tela').forEach(t=>t.classList.remove('ativa'));
    if (!document.getElementById('sessao-css')) {
        const s=document.createElement('style'); s.id='sessao-css';
        s.textContent=`#tela-gravacao-sessao{background:var(--creme);justify-content:flex-start;align-items:stretch;padding:0;gap:0;overflow:hidden;}.sessao-scroll{flex:1;overflow-y:auto;padding:0 0 24px;}.sessao-hero{background:linear-gradient(160deg,#2c1f4a 0%,#1a2a44 100%);padding:28px 24px 32px;display:flex;flex-direction:column;align-items:center;gap:10px;}.sessao-timer-grande{font-family:'Courier New',monospace;font-size:3.8rem;font-weight:700;color:white;letter-spacing:4px;line-height:1;}.sessao-timer-grande.gravando{color:#ff6b6b;}.sessao-status-txt{font-size:.78rem;color:rgba(255,255,255,.5);}.sessao-ondas{display:flex;gap:4px;align-items:center;height:24px;opacity:0;transition:opacity .3s;}.sessao-ondas.ativa{opacity:1;}.sessao-onda{width:3px;border-radius:3px;background:#ff6b6b;animation:onda-pulse 1s ease-in-out infinite;}.sessao-onda:nth-child(2){animation-delay:.15s;}.sessao-onda:nth-child(3){animation-delay:.30s;}.sessao-onda:nth-child(4){animation-delay:.45s;}.sessao-onda:nth-child(5){animation-delay:.15s;}@keyframes onda-pulse{0%,100%{height:6px;}50%{height:22px;}}.sessao-btn-principal{width:80px;height:80px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;margin-top:8px;}.sessao-btn-principal.parado{background:rgba(155,123,184,.25);border:2px solid rgba(155,123,184,.5);}.sessao-btn-principal.gravando{background:#e05050;border:2px solid #ff6b6b;animation:pulso-rec 1.5s ease-in-out infinite;}@keyframes pulso-rec{0%,100%{box-shadow:0 8px 24px rgba(224,80,80,.3);}50%{box-shadow:0 8px 48px rgba(224,80,80,.7);}}.sessao-btn-principal svg{width:36px;height:36px;stroke:white;}.sessao-form-area{padding:16px;display:flex;flex-direction:column;gap:12px;}.sessao-resumo-card{background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.07);display:none;}.sessao-resumo-card.visivel{display:block;}.sessao-resumo-header{background:linear-gradient(135deg,var(--terapia),#7c5cbf);padding:16px 20px;display:flex;align-items:center;gap:10px;}.sessao-resumo-titulo{font-family:var(--ft);font-size:.85rem;font-weight:700;color:white;}.sessao-resumo-corpo{padding:16px 18px;}.sessao-resumo-loading{display:flex;align-items:center;gap:10px;padding:8px 0;}.sessao-resumo-loading-dot{width:8px;height:8px;border-radius:50%;background:var(--terapia);animation:dot-pulse 1.4s ease-in-out infinite;}.sessao-resumo-loading-dot:nth-child(2){animation-delay:.2s;}.sessao-resumo-loading-dot:nth-child(3){animation-delay:.4s;}@keyframes dot-pulse{0%,100%{opacity:.3;transform:scale(.8);}50%{opacity:1;transform:scale(1.2);}}.sessao-resumo-texto{font-size:.82rem;color:#2c3e50;line-height:1.7;white-space:pre-wrap;}.rel-item{display:flex;flex-direction:column;margin-bottom:10px;}.rel-label{font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:700;margin-bottom:2px;}.rel-val{font-size:.82rem;color:#2c3e50;font-weight:600;}.rel-obs{font-size:.78rem;color:#2c3e50;line-height:1.6;margin:0;}.rel-audio-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(126,87,194,.1);border-radius:50px;padding:5px 12px;font-size:.68rem;color:var(--terapia);font-weight:600;margin-top:8px;}.sessao-acoes{display:flex;flex-direction:column;gap:8px;margin-top:12px;}`;
        document.head.appendChild(s);
    }
    const tela=document.createElement('div'); tela.id='tela-gravacao-sessao'; tela.className='tela ativa';
    tela.innerHTML=`<div class="fh2"><button class="bv" onclick="fecharGravacaoSessao()"><i data-lucide="arrow-left"></i></button><div class="stw"><div class="sti" style="color:var(--terapia)">Gravar Sessão</div></div></div><div class="sessao-scroll"><div class="sessao-hero"><div class="sessao-ondas" id="sessao-ondas"><div class="sessao-onda"></div><div class="sessao-onda"></div><div class="sessao-onda"></div><div class="sessao-onda"></div><div class="sessao-onda"></div></div><div class="sessao-timer-grande" id="sessao-timer">00:00</div><div class="sessao-status-txt" id="sessao-label">Toque para iniciar a gravação</div><button class="sessao-btn-principal parado" id="sessao-mic-btn" onclick="toggleGravacaoSessao()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button></div><div class="sessao-form-area"><div class="fblock"><div class="fblock-ti" style="color:var(--terapia)"><i data-lucide="user"></i> Dados da Sessão</div><select class="fsel" id="sessao-tipo-sel"><option>ABA</option><option>Fonoaudiologia</option><option>Terapia Ocupacional</option><option>Psicologia</option><option>Fisioterapia</option><option>Outro</option></select><input class="fin" type="text" id="sessao-prof" placeholder="Nome do profissional" style="margin-top:10px"></div><div class="fblock"><div class="fblock-ti" style="color:var(--terapia)"><i data-lucide="edit-3"></i> Observações em tempo real</div><textarea class="fin" id="sessao-obs" placeholder="Anote enquanto grava: comportamentos, reações, destaques..." style="min-height:90px"></textarea></div><div class="sessao-resumo-card" id="sessao-resumo-card"><div class="sessao-resumo-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><div><div class="sessao-resumo-titulo">Resumo gerado por IA</div><div style="font-size:.65rem;color:rgba(255,255,255,.7)">Revise antes de salvar</div></div></div><div class="sessao-resumo-corpo" id="sessao-resumo-corpo"></div></div><div class="sessao-acoes" id="sessao-acoes" style="display:none"><button class="btn-salvar" style="background:var(--terapia)" onclick="salvarRelatorioLocal()"><i data-lucide="save"></i> Salvar no Histórico</button><button class="btn-salvar" style="background:#4a7c59" onclick="enviarRelatorioFamilia()"><i data-lucide="send"></i> Enviar para a Família</button></div></div></div>`;
    document.querySelector('.app').appendChild(tela);
    lucide.createIcons();
}

function fecharGravacaoSessao() {
    pararGravacaoSessao();
    const el=document.getElementById('tela-gravacao-sessao'); if(el) el.classList.remove('ativa');
    document.getElementById('subtela-terapia').classList.add('ativa');
    lucide.createIcons();
}

async function toggleGravacaoSessao() {
    const btn=document.getElementById('sessao-mic-btn'); const label=document.getElementById('sessao-label'); const ondas=document.getElementById('sessao-ondas');
    if(sessaoGravacao.recorder&&sessaoGravacao.recorder.state==='recording'){pararGravacaoSessao();return;}
    try {
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        sessaoGravacao.stream=stream; sessaoGravacao.chunks=[]; sessaoGravacao.iniciou=new Date();
        sessaoGravacao.recorder=new MediaRecorder(stream);
        sessaoGravacao.recorder.ondataavailable=e=>sessaoGravacao.chunks.push(e.data);
        sessaoGravacao.recorder.onstop=finalizarSessao;
        sessaoGravacao.recorder.start();
        btn.classList.replace('parado','gravando'); if(label) label.textContent='Gravando… toque para finalizar'; if(ondas) ondas.classList.add('ativa');
        iniciarTimerSessao(); lucide.createIcons(); mostrarToast('🎙️ Sessão em gravação');
    } catch(e) { mostrarToast('❌ Microfone não disponível'); }
}

function pararGravacaoSessao() {
    if(sessaoGravacao.recorder&&sessaoGravacao.recorder.state==='recording') sessaoGravacao.recorder.stop();
    if(sessaoGravacao.stream){sessaoGravacao.stream.getTracks().forEach(t=>t.stop());sessaoGravacao.stream=null;}
    clearInterval(sessaoGravacao.timer);
    const btn=document.getElementById('sessao-mic-btn'); if(btn){btn.classList.replace('gravando','parado');btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;}
    const label=document.getElementById('sessao-label'); if(label) label.textContent='Toque para iniciar nova gravação';
    const ondas=document.getElementById('sessao-ondas'); if(ondas) ondas.classList.remove('ativa');
}

function iniciarTimerSessao() {
    sessaoGravacao.duracao=0;
    sessaoGravacao.timer=setInterval(()=>{sessaoGravacao.duracao++;const min=String(Math.floor(sessaoGravacao.duracao/60)).padStart(2,'0');const seg=String(sessaoGravacao.duracao%60).padStart(2,'0');const el=document.getElementById('sessao-timer');if(el){el.textContent=min+':'+seg;el.classList.add('gravando');}},1000);
}

async function finalizarSessao() {
    clearInterval(sessaoGravacao.timer);
    const blob=new Blob(sessaoGravacao.chunks,{type:'audio/webm'});
    sessaoGravacao.audioBlob=blob;
    const tipo=document.getElementById('sessao-tipo-sel')?.value||'Sessão';
    const prof=document.getElementById('sessao-prof')?.value||'Profissional';
    const obs=document.getElementById('sessao-obs')?.value||'';
    const dur=sessaoGravacao.duracao; const min=Math.floor(dur/60); const seg=dur%60;
    const card=document.getElementById('sessao-resumo-card'); if(card) card.classList.add('visivel');
    const corpo=document.getElementById('sessao-resumo-corpo');
    if(corpo) corpo.innerHTML=`<div class="sessao-resumo-loading"><div class="sessao-resumo-loading-dot"></div><div class="sessao-resumo-loading-dot"></div><div class="sessao-resumo-loading-dot"></div><span style="font-size:.75rem;color:#888;margin-left:4px">Gerando resumo com IA…</span></div>`;
    // Chama a API Anthropic para gerar o resumo
    try {
        const prompt = `Você é um assistente especializado em terapia pediátrica para crianças com TEA.
Com base nas informações abaixo, gere um resumo estruturado e empático de uma sessão terapêutica.

Tipo de terapia: ${tipo}
Profissional: ${prof}
Duração: ${min} minutos e ${seg} segundos
Observações registradas: ${obs || 'Nenhuma observação registrada.'}

Gere um resumo com:
1. **Contextualização** — tipo de sessão e profissional
2. **O que foi trabalhado** — baseado nas observações
3. **Destaques observados** — pontos positivos ou de atenção
4. **Próximos passos sugeridos** — continuidade do trabalho

Use linguagem acolhedora, clara e profissional. Máximo 200 palavras.`;

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        const data = await resp.json();
        const texto = data.content?.map(i => i.text || '').join('') || '';
        if (corpo) corpo.innerHTML = `<div class="sessao-resumo-texto">${texto.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div><div class="rel-audio-badge">🎙️ Áudio gravado · ${min}min ${seg}s</div>`;
    } catch {
        // fallback sem IA
        if(corpo) corpo.innerHTML=`<div class="rel-item"><span class="rel-label">Tipo</span><span class="rel-val">${tipo}</span></div><div class="rel-item"><span class="rel-label">Profissional</span><span class="rel-val">${prof}</span></div><div class="rel-item"><span class="rel-label">Duração</span><span class="rel-val">${min}min ${seg}s</span></div>${obs?`<div class="rel-item"><span class="rel-label">Observações</span><p class="rel-obs">${obs}</p></div>`:''}<div class="rel-audio-badge">🎙️ Áudio gravado · ${min}min ${seg}s</div>`;
    }
    const acoes=document.getElementById('sessao-acoes'); if(acoes) acoes.style.display='flex';
    lucide.createIcons();
    mostrarToast('✅ Sessão finalizada! Revise o resumo abaixo.');
}

function enviarRelatorioFamilia() {
    const tipo=document.getElementById('sessao-tipo-sel')?.value||'Sessão';
    const prof=document.getElementById('sessao-prof')?.value||'Profissional';
    const resumoEl=document.querySelector('.sessao-resumo-texto');
    const resumo=resumoEl?.textContent||'';
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    if(!d.linhatempo) d.linhatempo={};
    if(!d.linhatempo.terapeuta) d.linhatempo.terapeuta=[];
    d.linhatempo.terapeuta.push({texto:`📋 Relatório de Sessão — ${tipo}\n${resumo}`,tag:null,data:new Date().toISOString(),autor:prof,canal:'terapeuta',tipoMsg:'relatorio'});
    localStorage.setItem('la',JSON.stringify(d));
    enviarNotificacaoLocal('📋 Novo relatório de sessão',prof+' enviou o relatório de '+tipo);
    mostrarToast('✅ Relatório enviado para a família!');
    fecharGravacaoSessao();
}

function salvarRelatorioLocal() {
    const tipo=document.getElementById('sessao-tipo-sel')?.value||'Sessão';
    const prof=document.getElementById('sessao-prof')?.value||'Profissional';
    const resumoEl=document.querySelector('.sessao-resumo-texto');
    const resumo=resumoEl?.textContent||document.getElementById('sessao-obs')?.value||'';
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    if(!d.terapia) d.terapia={};
    if(!d.terapia['ft-sessao']) d.terapia['ft-sessao']=[];
    d.terapia['ft-sessao'].push({titulo:'Registro de Sessão — '+tipo,campos:{'Profissional':prof,'Tipo':tipo,'Resumo IA':resumo.slice(0,200),'Duração':Math.floor(sessaoGravacao.duracao/60)+'min'},data:new Date().toISOString(),pilar:'terapia'});
    localStorage.setItem('la',JSON.stringify(d));
    atuConts(); mostrarToast('✅ Sessão salva no histórico!'); fecharGravacaoSessao();
}

function injetarCardGravacaoSessao() {
    const scampos=document.querySelector('#subtela-terapia .scampos');
    if(!scampos||document.getElementById('card-gravar-sessao')) return;
    const card=document.createElement('div'); card.id='card-gravar-sessao'; card.className='scard scard-destaque'; card.onclick=abrirGravacaoSessao;
    card.innerHTML=`<div class="sico" style="background:var(--terapia)"><i data-lucide="mic-2"></i></div><div class="sinf"><div class="snm">🎙️ Gravar Sessão</div><div class="sqt">Grava áudio + gera resumo com IA</div></div><div class="sar"><i data-lucide="chevron-right"></i></div>`;
    scampos.insertBefore(card,scampos.firstChild); lucide.createIcons();
}

/* ══════════════════════════════════════════
   HISTÓRICO
══════════════════════════════════════════ */
const pilarInfo = { educacao:{nome:'Jornada Escolar',cor:'#4a90c4',icone:'graduation-cap'}, familia:{nome:'Memórias e Valores',cor:'#6aab8e',icone:'heart'}, saude:{nome:'Dossiê de Saúde',cor:'#e6b84a',icone:'stethoscope'}, terapia:{nome:'Evolução Terapêutica',cor:'#9b7bb8',icone:'brain'} };
let filtroAtivo='todos';

function carregarHistorico() { renderizarHistorico(filtroAtivo); lucide.createIcons(); }
function filtrarHistorico(filtro) { filtroAtivo=filtro; document.querySelectorAll('.hfbtn').forEach(b=>b.classList.remove('at')); document.querySelector(`.hfbtn[data-f="${filtro}"]`)?.classList.add('at'); renderizarHistorico(filtro); lucide.createIcons(); }

function renderizarHistorico(filtro) {
    if(filtro==='linhatempo'){renderizarHistoricoLT();return;}
    const d=JSON.parse(localStorage.getItem('la')||'{}'); const lista=[];
    ['educacao','familia','saude','terapia'].forEach(pilar=>{if(filtro!=='todos'&&filtro!==pilar) return;Object.entries(d[pilar]||{}).forEach(([,registros])=>{registros.forEach(reg=>lista.push({...reg,pilar}));});});
    lista.sort((a,b)=>new Date(b.data)-new Date(a.data));
    const container=document.getElementById('hist-lista'); if(!container) return;
    if(lista.length===0){container.innerHTML=`<div class="hist-vazio"><div class="hist-vazio-ico"><i data-lucide="inbox"></i></div><p class="hist-vazio-ti">Nenhum registro ainda</p><p class="hist-vazio-sub">Comece preenchendo qualquer área do painel para ver seu histórico aqui.</p></div>`;lucide.createIcons();return;}
    const grupos={};
    lista.forEach(reg=>{const dt=new Date(reg.data);const chave=formatarChaveData(dt);if(!grupos[chave])grupos[chave]={label:formatarLabelData(dt),items:[]};grupos[chave].items.push(reg);});
    let html='';
    Object.values(grupos).forEach(grupo=>{
        html+=`<div class="hgrupo-label">${grupo.label}</div>`;
        grupo.items.forEach(reg=>{const info=pilarInfo[reg.pilar];const campos=Object.entries(reg.campos||{}).slice(0,2);const hora=new Date(reg.data).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});html+=`<div class="hcard" style="--hcor:${info.cor}"><div class="hcard-left"><div class="hcard-dot"></div><div class="hcard-linha"></div></div><div class="hcard-body"><div class="hcard-pilar"><span class="hbadge" style="background:${info.cor}20;color:${info.cor}">${info.nome}</span><span class="hcard-hora">${hora}</span></div><div class="hcard-titulo">${reg.titulo}</div>${campos.length>0?`<div class="hcard-campos">${campos.map(([k,v])=>`<span><strong>${k}:</strong> ${v.length>30?v.slice(0,30)+'…':v}</span>`).join('')}</div>`:''}</div></div>`;});
    });
    container.innerHTML=html; if(filtro==='todos') injetarLTnoHistorico(); lucide.createIcons();
}

function formatarChaveData(dt){return dt.toISOString().slice(0,10);}
function formatarLabelData(dt){const hoje=new Date();const ontem=new Date();ontem.setDate(ontem.getDate()-1);if(dt.toDateString()===hoje.toDateString()) return 'Hoje';if(dt.toDateString()===ontem.toDateString()) return 'Ontem';return dt.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});}

/* ══════════════════════════════════════════
   LINHA DO TEMPO — usa campo unificado la-*
══════════════════════════════════════════ */
const canalInfo = { escola:{nome:'Família → Escola',cor:'#4a90c4'}, terapeuta:{nome:'Família → Terapeuta',cor:'#9b7bb8'}, saude:{nome:'Família → Saúde',cor:'#e6b84a'}, familia:{nome:'Família → Família',cor:'#6aab8e'} };
const tagInfo = { bom:{label:'🟢 Dia bom',cls:'tag-bom'}, desafio:{label:'🟡 Desafiador',cls:'tag-desafio'}, atencao:{label:'🔴 Atenção',cls:'tag-atencao'} };
let canalAtivoLT='escola';
let filtroAtivoLT='todos-lt';

function iniciarLT() {
    // Substitui a .lt-bar original pelo campo unificado
    const telaLT = document.getElementById('tela-linhatempo');
    if (!telaLT) return;

    // Remove barra antiga se existir
    telaLT.querySelectorAll('.lt-bar').forEach(el => el.remove());

    // Container para o campo unificado (antes do .ni)
    let inputContainer = document.getElementById('lt-input-container');
    if (!inputContainer) {
        inputContainer = document.createElement('div');
        inputContainer.id = 'lt-input-container';
        const ni = telaLT.querySelector('.ni');
        if (ni) telaLT.insertBefore(inputContainer, ni);
        else telaLT.appendChild(inputContainer);
    }

    laRender(inputContainer, 'lt', {
        hasHumor: true,
        placeholder: 'Escreva uma mensagem…',
        cor: canalInfo[canalAtivoLT]?.cor || 'var(--azul-escuro)',
        onEnviar: (texto, tag) => {
            const d=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d.linhatempo) d.linhatempo={};
            if(!d.linhatempo[canalAtivoLT]) d.linhatempo[canalAtivoLT]=[];
            d.linhatempo[canalAtivoLT].push({texto,tag,data:new Date().toISOString(),autor:'Família',canal:canalAtivoLT});
            localStorage.setItem('la',JSON.stringify(d));
            renderizarFeedLT();
            enviarNotificacaoLocal('💬 Nova mensagem na Linha do Tempo','Você enviou uma mensagem para '+canalInfo[canalAtivoLT].nome);
        },
        onAudio: (blob, url) => {
            const d=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d.linhatempo) d.linhatempo={};
            if(!d.linhatempo[canalAtivoLT]) d.linhatempo[canalAtivoLT]=[];
            d.linhatempo[canalAtivoLT].push({texto:'🎙️ Nota de voz ('+Math.round(blob.size/1024)+'KB)',audioUrl:url,tag:null,data:new Date().toISOString(),autor:'Família',canal:canalAtivoLT});
            localStorage.setItem('la',JSON.stringify(d));
            renderizarFeedLT();
        }
    });

    filtrarLT('todos-lt');
    renderizarFeedLT();
}

function filtrarLT(f) {
    filtroAtivoLT=f;
    document.querySelectorAll('#tela-linhatempo .hfbtn').forEach(b=>b.classList.toggle('at',b.dataset.f===f));
    renderizarFeedLT();
}

function renderizarFeedLT() {
    const container=document.getElementById('lt-feed'); if(!container) return;
    const d=JSON.parse(localStorage.getItem('la')||'{}'); const lt=d.linhatempo||{}; const lista=[];
    Object.entries(lt).forEach(([canal,msgs])=>{
        if(filtroAtivoLT!=='todos-lt'&&filtroAtivoLT!==canal&&!(filtroAtivoLT==='saude-lt'&&canal==='saude')&&!(filtroAtivoLT==='familia-lt'&&canal==='familia')) return;
        msgs.forEach(msg=>lista.push({...msg,_canal:canal}));
    });
    lista.sort((a,b)=>new Date(b.data)-new Date(a.data));
    if(lista.length===0){container.innerHTML=`<div class="lt-vazio"><div class="lt-vazio-ico"><i data-lucide="message-circle"></i></div><p><strong>Nenhuma mensagem ainda</strong>Selecione o canal acima e escreva sua primeira mensagem.</p></div>`;lucide.createIcons();return;}
    const grupos={};
    lista.forEach(msg=>{const dt=new Date(msg.data);const chave=formatarChaveData(dt);if(!grupos[chave])grupos[chave]={label:formatarLabelData(dt),items:[]};grupos[chave].items.push(msg);});
    let html='';
    Object.values(grupos).forEach(grupo=>{
        html+=`<div class="hgrupo-label">${grupo.label}</div>`;
        grupo.items.forEach(msg=>{const info=canalInfo[msg._canal];const hora=new Date(msg.data).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});const tagHtml=msg.tag?`<span class="lt-feed-tag ${tagInfo[msg.tag].cls}">${tagInfo[msg.tag].label}</span>`:'';const audioHtml=msg.audioUrl?`<audio src="${msg.audioUrl}" controls style="width:100%;margin-top:6px;border-radius:8px"></audio>`:'';html+=`<div class="lt-feed-msg" style="--ltcor:${info.cor}"><div class="lt-feed-topo"><span class="lt-feed-badge" style="background:${info.cor}20;color:${info.cor}">${info.nome}</span><span class="lt-feed-hora">${hora}</span></div><div class="lt-feed-texto">${msg.texto}</div>${tagHtml}${audioHtml}</div>`;});
    });
    container.innerHTML=html; lucide.createIcons();
    setTimeout(()=>{const feed=document.getElementById('lt-feed');if(feed) feed.scrollTop=feed.scrollHeight;},50);
}

function renderizarHistoricoLT() {
    const d=JSON.parse(localStorage.getItem('la')||'{}');const lt=d.linhatempo||{};const lista=[];
    Object.entries(lt).forEach(([canal,msgs])=>msgs.forEach(msg=>lista.push({...msg,_ltCanal:canal})));
    lista.sort((a,b)=>new Date(b.data)-new Date(a.data));
    const container=document.getElementById('hist-lista');if(!container) return;
    if(lista.length===0){container.innerHTML=`<div class="hist-vazio"><div class="hist-vazio-ico"><i data-lucide="hourglass"></i></div><p class="hist-vazio-ti">Sem mensagens ainda</p><p class="hist-vazio-sub">As mensagens da Linha do Tempo aparecerão aqui.</p></div>`;lucide.createIcons();return;}
    const grupos={};
    lista.forEach(msg=>{const dt=new Date(msg.data);const chave=formatarChaveData(dt);if(!grupos[chave])grupos[chave]={label:formatarLabelData(dt),items:[]};grupos[chave].items.push(msg);});
    let html='';
    Object.values(grupos).forEach(grupo=>{html+=`<div class="hgrupo-label">${grupo.label}</div>`;grupo.items.forEach(msg=>{const info=canalInfo[msg._ltCanal];const hora=new Date(msg.data).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});const tagHtml=msg.tag?`<span class="lt-feed-tag ${tagInfo[msg.tag].cls}">${tagInfo[msg.tag].label}</span>`:'';html+=`<div class="hcard" style="--hcor:${info.cor}"><div class="hcard-left"><div class="hcard-dot"></div><div class="hcard-linha"></div></div><div class="hcard-body"><div class="hcard-pilar"><span class="hbadge" style="background:${info.cor}20;color:${info.cor}">⧗ ${info.nome}</span><span class="hcard-hora">${hora}</span></div><div class="hcard-titulo">${msg.texto.length>60?msg.texto.slice(0,60)+'…':msg.texto}</div>${tagHtml?`<div class="hcard-campos" style="margin-top:6px">${tagHtml}</div>`:''}</div></div>`;});});
    container.innerHTML=html; lucide.createIcons();
}

function injetarLTnoHistorico() {
    const d=JSON.parse(localStorage.getItem('la')||'{}');const lt=d.linhatempo||{};const container=document.getElementById('hist-lista');if(!container) return;
    Object.entries(lt).forEach(([canal,msgs])=>msgs.forEach(msg=>{const info=canalInfo[canal];const hora=new Date(msg.data).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});const tagHtml=msg.tag?`<span class="lt-feed-tag ${tagInfo[msg.tag].cls}">${tagInfo[msg.tag].label}</span>`:'';container.insertAdjacentHTML('beforeend',`<div class="hcard" style="--hcor:${info.cor}"><div class="hcard-left"><div class="hcard-dot"></div><div class="hcard-linha"></div></div><div class="hcard-body"><div class="hcard-pilar"><span class="hbadge" style="background:${info.cor}20;color:${info.cor}">⧗ ${info.nome}</span><span class="hcard-hora">${hora}</span></div><div class="hcard-titulo">${msg.texto.length>60?msg.texto.slice(0,60)+'…':msg.texto}</div>${tagHtml?`<div class="hcard-campos" style="margin-top:6px">${tagHtml}</div>`:''}</div></div>`);}));
    lucide.createIcons();
}

/* ══════════════════════════════════════════
   REDE LEGADO — usa campo unificado la-*
══════════════════════════════════════════ */
const palavrasBloqueadas=['deus','jesus','cristo','allah','buda','bíblia','alcorão','oração','pastor','padre','sermão','igreja','templo','mesquita','lula','bolsonaro','partido','eleição','voto','político','presidente','governo','esquerda','direita','racista','fascista','comunista','idiota','burro','vagabundo','lixo','imbecil','cretino','merda','porra','caralho','comprar','vender','produto','desconto','promoção','link','clique aqui'];

function moderarMensagem(texto) {
    const lower=texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    for(const palavra of palavrasBloqueadas){const pNorm=palavra.normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(lower.includes(pNorm)) return {bloqueada:true,palavra};}
    return {bloqueada:false};
}

let redeLegadoEstado=null; let redeLegadoMunicipio=null;

function mostrarChatRede(estado, municipio) {
    const body=document.getElementById('rede-body'); if(!body) return;
    const sub=document.getElementById('rede-subtitulo'); if(sub) sub.innerHTML=`📍 ${municipio} — ${estadosMunicipios[estado]?.nome||estado}`;

    const d2=JSON.parse(localStorage.getItem('la')||'{}');
    const munUsuario=d2.rede?.municipio||null; const estUsuario=d2.rede?.estado||null;
    const cepCadastrado=d2.perfil?.cep||null;
    const podeFalar=(municipio===munUsuario&&estado===estUsuario);

    body.innerHTML=`
        <div style="padding:8px 14px 0;display:flex;align-items:center;justify-content:space-between">
            <div class="rede-municipio-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${municipio}${podeFalar?' · <span style="color:#3a9e72">seu grupo</span>':''}
            </div>
            <button style="font-size:.65rem;color:#888;background:none;border:none;cursor:pointer" onclick="mostrarSeletorRede()">← Mapa</button>
        </div>
        <div class="rede-chat" id="rede-chat-feed"></div>
        <div id="rede-input-container"></div>`;

    if (podeFalar) {
        // Campo unificado la-*
        laRender(document.getElementById('rede-input-container'), 'rede', {
            placeholder: `Escreva para as famílias de ${municipio}…`,
            cor: 'var(--azul-escuro)',
            onEnviar: (texto) => {
                const mod=moderarMensagem(texto);
                if(mod.bloqueada){
                    const aviso=document.getElementById('rede-aviso-mod');
                    if(aviso){aviso.style.display='block';setTimeout(()=>aviso.style.display='none',4000);}
                    return;
                }
                const d=JSON.parse(localStorage.getItem('la')||'{}');
                const chave=`rede_${redeLegadoEstado}_${redeLegadoMunicipio}`;
                if(!d[chave]) d[chave]=[];
                const nomeUsuario=d.perfil?.['tea-nome']?'Família de '+d.perfil['tea-nome']:'Família anônima';
                d[chave].push({texto,autor:nomeUsuario,data:new Date().toISOString()});
                localStorage.setItem('la',JSON.stringify(d));
                renderizarChatRede(redeLegadoEstado,redeLegadoMunicipio);
            },
            onAudio: (blob, url) => {
                // Áudio na Rede Legado — salva como mensagem
                const d=JSON.parse(localStorage.getItem('la')||'{}');
                const chave=`rede_${redeLegadoEstado}_${redeLegadoMunicipio}`;
                if(!d[chave]) d[chave]=[];
                const nomeUsuario=d.perfil?.['tea-nome']?'Família de '+d.perfil['tea-nome']:'Família anônima';
                d[chave].push({texto:'🎙️ Nota de voz ('+Math.round(blob.size/1024)+'KB)',audioUrl:url,autor:nomeUsuario,data:new Date().toISOString()});
                localStorage.setItem('la',JSON.stringify(d));
                renderizarChatRede(redeLegadoEstado,redeLegadoMunicipio);
            }
        });
    } else {
        document.getElementById('rede-input-container').innerHTML=`<div class="rede-input-bloqueado"><span>🔒 Você só pode escrever no grupo de <strong>${munUsuario||'seu município'}</strong>${!cepCadastrado?' — <button onclick="irParaPerfil()" style="background:none;border:none;color:#2d83b0;font-weight:700;cursor:pointer">cadastre seu CEP</button>':''}</span></div>`;
    }

    lucide.createIcons();
    renderizarChatRede(estado, municipio);
}

function renderizarChatRede(estado, municipio) {
    const feed=document.getElementById('rede-chat-feed'); if(!feed) return;
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    const chave=`rede_${estado}_${municipio}`; const msgs=d[chave]||[];
    const simuladas=getMsgSimuladas(municipio);
    const todas=[...simuladas,...msgs].sort((a,b)=>new Date(a.data)-new Date(b.data));
    if(todas.length===0){feed.innerHTML=`<div class="rede-vazio"><p>💙</p><p>Seja a primeira família a escrever aqui!<br>Compartilhe uma experiência, dica ou pedido de indicação.</p></div>`;return;}
    feed.innerHTML=todas.map((msg,i)=>`<div class="rede-msg"><div class="rede-msg-topo"><span class="rede-msg-autor">${msg.autor}</span><div style="display:flex;align-items:center;gap:4px"><span class="rede-msg-hora">${new Date(msg.data).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span><button class="rede-msg-denuncia" onclick="denunciarMsg(${i})" title="Denunciar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></button></div></div><div class="rede-msg-texto">${msg.texto}</div>${msg.audioUrl?`<audio src="${msg.audioUrl}" controls style="width:100%;margin-top:5px;border-radius:8px"></audio>`:''}</div>`).join('');
    feed.scrollTop=feed.scrollHeight; lucide.createIcons();
}

function getMsgSimuladas(municipio) { return []; }
function denunciarMsg(idx) { mostrarToast('🚩 Mensagem denunciada. Obrigada por nos ajudar a manter a Rede Legado segura.'); }

function abrirRedeLegado() {
    if(!document.getElementById('tela-rede-legado')){criarTelaRedeLegado();return;}
    const el=document.getElementById('tela-rede-legado');
    document.querySelectorAll('.tela').forEach(t=>{t.classList.remove('ativa');});
    document.querySelectorAll('.subtela').forEach(t=>t.classList.remove('ativa'));
    el.style.display='';el.classList.add('ativa');
    lucide.createIcons();
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    if(d.rede?.municipio){redeLegadoEstado=d.rede.estado;redeLegadoMunicipio=d.rede.municipio;mostrarChatRede(d.rede.estado,d.rede.municipio);}
    else mostrarSeletorRede();
}

function criarTelaRedeLegado() {
    const tela=document.createElement('div'); tela.id='tela-rede-legado'; tela.className='tela form-subtela ativa';
    tela.innerHTML=`<div class="rede-header"><button class="bv" onclick="fecharRedeLegado()" style="flex-shrink:0"><i data-lucide="arrow-left"></i></button><div style="flex:1"><div class="rede-titulo">💙 Rede Legado</div><div class="rede-subtitulo" id="rede-subtitulo">Famílias que entendem de verdade</div></div></div><div id="rede-body" style="flex:1;display:flex;flex-direction:column;overflow:hidden"></div><div class="rede-aviso-moderacao" id="rede-aviso-mod">⚠️ Esta mensagem não está alinhada com os valores da Rede Legado.</div>`;
    document.querySelector('.app').appendChild(tela); lucide.createIcons();
    const d=JSON.parse(localStorage.getItem('la')||'{}');
    if(d.rede?.municipio){redeLegadoEstado=d.rede.estado;redeLegadoMunicipio=d.rede.municipio;mostrarChatRede(d.rede.estado,d.rede.municipio);}
    else mostrarSeletorRede();
}

function fecharRedeLegado(){_fecharRede();ir('tela-painel');}
async function consultarCEP(cep){const cepLimpo=cep.replace(/\D/g,'');if(cepLimpo.length!==8) return null;try{const r=await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);const data=await r.json();if(data.erro) return null;return{uf:data.uf,municipio:data.localidade};}catch(e){return null;}}
async function vincularCEPRedeAoPerfil(cep){const resultado=await consultarCEP(cep);if(!resultado){mostrarToast('❌ CEP não encontrado.');return;}const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.perfil) d.perfil={};if(!d.rede) d.rede={};d.perfil.cep=cep;d.rede.estado=resultado.uf;d.rede.municipio=resultado.municipio;localStorage.setItem('la',JSON.stringify(d));redeLegadoEstado=resultado.uf;redeLegadoMunicipio=resultado.municipio;mostrarToast('📍 Município vinculado: '+resultado.municipio+' — '+resultado.uf);mostrarChatRede(resultado.uf,resultado.municipio);}
function entrarMunicipioRede(estado,municipio){redeLegadoEstado=estado;redeLegadoMunicipio=municipio;const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.rede) d.rede={};d.rede.estado=estado;d.rede.municipio=municipio;localStorage.setItem('la',JSON.stringify(d));mostrarChatRede(estado,municipio);}
function irParaPerfil(){fecharRedeLegado();setTimeout(()=>ir('tela-perfil'),100);}

function injetarIconeRedeLegado(){const ph=document.querySelector('#tela-painel .ph');if(!ph||document.getElementById('btn-rede-header')) return;const btn=document.createElement('div');btn.id='btn-rede-header';btn.className='pav pav-rede';btn.title='Rede Legado';btn.style.cursor='pointer';btn.onclick=abrirRedeLegado;btn.innerHTML=`<i data-lucide="users" style="width:17px;height:17px"></i><div class="pav-rede-badge oculto" id="rede-notif-badge">0</div>`;const avatar=ph.querySelector('.pav');if(avatar) avatar.after(btn);else ph.appendChild(btn);lucide.createIcons();}
function atualizarBadgeRede(){const badge=document.getElementById('rede-notif-badge');if(!badge) return;const d=JSON.parse(localStorage.getItem('la')||'{}');const novas=d.redeUltimoAcesso===0?2:0;if(novas>0){badge.textContent=novas;badge.classList.remove('oculto');}else badge.classList.add('oculto');}

/* ══════════════════════════════════════════
   SAÚDE / TERAPIA / FAMÍLIA — forms
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   SAÚDE / TERAPIA / FAMÍLIA / EDUCAÇÃO — forms padronizados
══════════════════════════════════════════ */

// Abre o formulário mantendo a subtela do pilar ativa por trás
function abrirForm(id) {
    if (typeof _fecharRede === 'function') _fecharRede();
    
    const form = document.getElementById(id);
    if (form) {
        form.classList.add('ativa');
        form.scrollTop = 0; // Garante que abra rolado no topo
    }
}

// Fecha apenas o formulário, revelando a subtela que já estava ali atrás
function fecharForm(id) {
    const form = document.getElementById(id);
    if (form) {
        form.classList.remove('ativa');
    }
}

/* ══════════════════════════════════════════
   PERFIL
══════════════════════════════════════════ */
function carregarPerfil(){const d=JSON.parse(localStorage.getItem('la')||'{}');const p=d.perfil||{};const textos=['cidade','email','tel','tea-nome','tea-cid','tea-frase','tea-cpf','tea-ciptea','tea-medico','resp1-nome','resp1-tel','ps-operadora','ps-numero','cep'];textos.forEach(c=>{const el=document.getElementById('prf-'+c);if(el&&p[c]) el.value=p[c];});['tea-nasc','tea-diag','ps-validade'].forEach(c=>{const el=document.getElementById('prf-'+c);if(el&&p[c]) el.value=p[c];});['tea-sexo','tea-nivel','resp1-vinculo','plano-saude-tipo','ps-cobre'].forEach(c=>{const el=document.getElementById('prf-'+c);if(el&&p[c]) el.value=p[c];});const psTipo=p['plano-saude-tipo'];if(psTipo) togglePlanoSaude(psTipo);if(p.cidsExtras&&p.cidsExtras.length) p.cidsExtras.forEach(cid=>adicionarCIDChip(cid));const heroNome=document.getElementById('prf-hero-nome');const heroSub=document.getElementById('prf-hero-sub');if(heroNome&&p['tea-nome']) heroNome.textContent=p['tea-nome'];if(heroSub&&p['tea-nome']) heroSub.textContent='Legado de '+p['tea-nome'];if(p.avatarSrc){const img=document.getElementById('prf-avatar-img');const ico=document.getElementById('prf-avatar-ico');if(img&&ico){img.src=p.avatarSrc;img.style.display='block';ico.style.display='none';}}const rede=d.rede;const cepStatus=document.getElementById('prf-cep-status');if(cepStatus&&rede?.municipio){cepStatus.textContent='📍 '+rede.municipio+' — '+(estadosMunicipios[rede.estado]?.nome||rede.estado);cepStatus.style.display='block';}}

function salvarPerfil(){const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.perfil) d.perfil={};const textos=['cidade','email','tel','tea-nome','tea-cid','tea-frase','tea-cpf','tea-ciptea','tea-medico','resp1-nome','resp1-tel','ps-operadora','ps-numero','cep'];textos.forEach(c=>{const el=document.getElementById('prf-'+c);if(el) d.perfil[c]=el.value;});['tea-nasc','tea-diag','ps-validade'].forEach(c=>{const el=document.getElementById('prf-'+c);if(el) d.perfil[c]=el.value;});['tea-sexo','tea-nivel','resp1-vinculo','plano-saude-tipo','ps-cobre'].forEach(c=>{const el=document.getElementById('prf-'+c);if(el) d.perfil[c]=el.value;});d.perfil.cidsExtras=Array.from(document.querySelectorAll('.prf-cid-chip')).map(chip=>chip.dataset.cid);localStorage.setItem('la',JSON.stringify(d));const nomeProtagonista=d.perfil['tea-nome'];if(nomeProtagonista){const heroNome=document.getElementById('prf-hero-nome');const heroSub=document.getElementById('prf-hero-sub');const ps=document.querySelector('#tela-painel .ps');if(heroNome) heroNome.textContent=nomeProtagonista;if(heroSub) heroSub.textContent='Legado de '+nomeProtagonista;if(ps) ps.innerHTML=`<small>bom dia,</small>${nomeProtagonista}`;}const cep=d.perfil['cep'];if(cep&&cep.replace(/\D/g,'').length===8){vincularCEPRedeAoPerfil(cep).catch(()=>{});}mostrarToast('✅ Perfil salvo com sucesso!');}

function togglePlanoSaude(val){const det=document.getElementById('prf-plano-saude-detalhes');if(det) det.style.display=val==='sim'?'block':'none';}
function adicionarCID(){const inp=document.getElementById('prf-cid-novo');const val=inp.value.trim();if(!val) return;adicionarCIDChip(val);inp.value='';}
function adicionarCIDChip(texto){const lista=document.getElementById('prf-cids-lista');if(!lista) return;const chip=document.createElement('div');chip.className='prf-cid-chip';chip.dataset.cid=texto;chip.innerHTML=`<span>${texto}</span><button onclick="removerCID(this)" title="Remover"><i data-lucide="x"></i></button>`;lista.appendChild(chip);lucide.createIcons();}
function removerCID(btn){btn.closest('.prf-cid-chip').remove();}
function trocarFotoPerfil(){const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=e=>{const file=e.target.files[0];if(!file) return;const reader=new FileReader();reader.onload=ev=>{const src=ev.target.result;const img=document.getElementById('prf-avatar-img');const ico=document.getElementById('prf-avatar-ico');if(img){img.src=src;img.style.display='block';}if(ico) ico.style.display='none';const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.perfil) d.perfil={};d.perfil.avatarSrc=src;localStorage.setItem('la',JSON.stringify(d));};reader.readAsDataURL(file);};input.click();}

function mostrarToast(msg){let t=document.getElementById('prf-toast-el');if(!t){t=document.createElement('div');t.id='prf-toast-el';t.className='prf-toast';document.body.appendChild(t);}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}

/* ══════════════════════════════════════════
   PARTILHAR
══════════════════════════════════════════ */
const nivelInfo={ver:'👁️ Somente visualizar',preencher:'✏️ Visualizar + preencher',chat:'💬 Visualizar + Linha do Tempo',total:'✅ Acesso completo'};
const tipoInfo={escola:{emoji:'🎓',cor:'#4a90c4'},terapeuta:{emoji:'🧠',cor:'#9b7bb8'},saude:{emoji:'🩺',cor:'#e6b84a'},outro:{emoji:'👤',cor:'#8e9bb8'}};
let pinAtual=null;

function gerarPIN(){const nome=document.getElementById('pin-nome').value.trim();if(!nome){const el=document.getElementById('pin-nome');el.style.borderColor='#e05050';el.focus();setTimeout(()=>el.style.borderColor='',1500);return;}const tipo=document.getElementById('pin-tipo').value;const nivel=document.getElementById('pin-nivel').value;const validade=document.getElementById('pin-validade').value;const pilares={educacao:document.getElementById('pp-edu').checked,familia:document.getElementById('pp-fam').checked,saude:document.getElementById('pp-sau').checked,terapia:document.getElementById('pp-ter').checked};const codigo=String(Math.floor(100000+Math.random()*900000));const expira=validade==='0'?null:new Date(Date.now()+parseInt(validade)*86400000).toLocaleDateString('pt-BR');pinAtual={codigo,nome,tipo,nivel,validade,pilares,expira,criado:new Date().toISOString(),ativo:true};const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.pins) d.pins=[];d.pins.push(pinAtual);localStorage.setItem('la',JSON.stringify(d));document.getElementById('pt-pin-profnome').textContent=nome;document.getElementById('pt-pin-codigo').textContent=codigo.slice(0,3)+' '+codigo.slice(3);document.getElementById('pt-pin-meta').innerHTML=nivelInfo[nivel]+(expira?'<br>Válido até '+expira:'<br>Sem validade definida');document.getElementById('pt-pin-resultado').style.display='block';document.getElementById('pt-qr-area').style.display='none';document.getElementById('pt-pin-resultado').scrollIntoView({behavior:'smooth'});document.getElementById('pin-nome').value='';lucide.createIcons();renderizarPINs();}
function copiarPIN(){if(!pinAtual) return;const txt=`Acesso ao Legado Azul\nPIN: ${pinAtual.codigo.slice(0,3)} ${pinAtual.codigo.slice(3)}\nAcesso: ${nivelInfo[pinAtual.nivel]}${pinAtual.expira?'\nVálido até: '+pinAtual.expira:''}`;navigator.clipboard.writeText(txt).then(()=>{const btn=document.getElementById('pt-btn-copiar');if(btn){btn.innerHTML='✅ Copiado!';setTimeout(()=>{btn.innerHTML='<i data-lucide="copy"></i> Copiar';lucide.createIcons();},2000);}});}
function compartilharWhats(){if(!pinAtual) return;const txt=encodeURIComponent(`Olá! Seu acesso ao *Legado Azul*:\n\nPIN: *${pinAtual.codigo.slice(0,3)} ${pinAtual.codigo.slice(3)}*\nAcesso: ${nivelInfo[pinAtual.nivel]}${pinAtual.expira?'\nVálido até: '+pinAtual.expira:''}`);window.open('https://wa.me/?text='+txt,'_blank');}
function mostrarQR(){const area=document.getElementById('pt-qr-area');const visivel=area.style.display!=='none';area.style.display=visivel?'none':'flex';if(!visivel&&pinAtual) desenharQRSimples(pinAtual.codigo);}
function desenharQRSimples(codigo){const el=document.getElementById('pt-qr-display');if(!el) return;const size=13;el.style.gridTemplateColumns=`repeat(${size}, 10px)`;let html='';const seed=parseInt(codigo);for(let i=0;i<size*size;i++){const r=(seed*(i+7)*31337)%100;const row=Math.floor(i/size),col=i%size;const canto=(row<3&&col<3)||(row<3&&col>=size-3)||(row>=size-3&&col<3);const filled=canto?true:r>45;html+=`<div style="width:10px;height:10px;background:${filled?'#2c3e50':'transparent'};border-radius:1px"></div>`;}el.innerHTML=html;}
function renderizarPINs(){const container=document.getElementById('pt-lista-pins');if(!container) return;const d=JSON.parse(localStorage.getItem('la')||'{}');const pins=(d.pins||[]).filter(p=>p.ativo);if(pins.length===0){container.innerHTML=`<div class="pt-vazio"><i data-lucide="users"></i><p>Nenhum acesso compartilhado ainda.<br>Gere um PIN acima para começar.</p></div>`;lucide.createIcons();return;}container.innerHTML=pins.map((p,i)=>{const info=tipoInfo[p.tipo]||tipoInfo.outro;const pilaresAtivos=Object.entries(p.pilares||{}).filter(([,v])=>v).map(([k])=>({educacao:'🎓',familia:'💚',saude:'🩺',terapia:'🧠'}[k])).join(' ');return `<div class="pt-pin-card"><div class="pt-pin-card-ico" style="background:${info.cor}">${info.emoji}</div><div class="pt-pin-card-info"><div class="pt-pin-card-nome">${p.nome}</div><div class="pt-pin-card-meta">${nivelInfo[p.nivel]} · ${p.expira?'até '+p.expira:'sem validade'}<br>${pilaresAtivos}</div></div><div class="pt-pin-card-codigo">${p.codigo.slice(0,3)} ${p.codigo.slice(3)}</div><button class="pt-pin-revogar" onclick="revogarPIN(${i})" title="Revogar acesso"><i data-lucide="x"></i></button></div>`;}).join('');lucide.createIcons();}
function revogarPIN(idx){if(!confirm('Revogar este acesso?')) return;const d=JSON.parse(localStorage.getItem('la')||'{}');const ativos=(d.pins||[]).filter(p=>p.ativo);if(ativos[idx]) ativos[idx].ativo=false;localStorage.setItem('la',JSON.stringify(d));renderizarPINs();}

/* ── AJUSTES ── */
function alterarSenha(){mostrarToast('🔒 Funcionalidade em breve');}
function exportarPDF(){mostrarToast('📄 Exportação em breve');}
function backupDados(){mostrarToast('☁️ Backup realizado!');}
function apagarDados(){if(confirm('⚠️ Tem certeza? Todos os registros serão apagados. Esta ação é irreversível.')){localStorage.removeItem('la');mostrarToast('🗑️ Dados apagados.');ir('tela-painel');atuConts();}}
function confirmarSair(){if(confirm('Deseja sair da sua conta?')) ir('tela-login');}

/* ── Educação status ── */
function setEduStatus(status, btn, idx) {
    document.querySelectorAll('#subtela-educacao .pp-tab').forEach(b => b.classList.remove('pp-tab-at'));
    const activeBtn = btn || document.getElementById('ebtn-' + status);
    if (activeBtn) activeBtn.classList.add('pp-tab-at');
    const slider = document.getElementById('edu-slider');
    if (slider) slider.style.transform = `translateX(${(idx ?? ['matriculado','nao-matriculado','adaptado'].indexOf(status)) * 100}%)`;
    ['matriculado','nao-matriculado','adaptado'].forEach(s => {
        const el = document.getElementById('edu-' + s);
        if (el) el.classList.toggle('oculto', s !== status);
    });
    try { const d = JSON.parse(localStorage.getItem('la')||'{}'); d.eduStatus = status; localStorage.setItem('la', JSON.stringify(d)); } catch(e) {}
}
function carregarEduStatus() { try { const d = JSON.parse(localStorage.getItem('la')||'{}'); if (d.eduStatus) setEduStatus(d.eduStatus); } catch(e) {} }

function setTerTab(tab, btn, idx) {
    document.querySelectorAll('#subtela-terapia .pp-tab').forEach(b => b.classList.remove('pp-tab-at'));
    if (btn) btn.classList.add('pp-tab-at');
    const slider = document.getElementById('ter-slider');
    if (slider) slider.style.transform = `translateX(${idx * 100}%)`;
    ['equipe','evolucao'].forEach(t => {
        const el = document.getElementById('ter-' + t);
        if (el) el.classList.toggle('oculto', t !== tab);
    });
}

/* ── Modal cadastro ── */
let _perfilSelecionado=null;
const _credenciais={medico:{titulo:'Suas credenciais — Saúde',sub:'Informe seu registro para verificação',campos:[{label:'CRM',placeholder:'CRM 000000 / UF',tipo:'text'},{label:'Especialidade',placeholder:'Ex: Neuropediatria, Psiquiatria...',tipo:'text'},{label:'Instituição / Clínica',placeholder:'Nome da instituição (opcional)',tipo:'text'}]},terapeuta:{titulo:'Suas credenciais — Terapia',sub:'Informe seu registro para verificação',campos:[{label:'Conselho e registro',placeholder:'Ex: CRP 00000, CREFITO 00000...',tipo:'text'},{label:'Especialidade / Abordagem',placeholder:'Ex: TO, Fonoaudiologia, Psicologia...',tipo:'text'},{label:'Instituição / Clínica',placeholder:'Nome da instituição (opcional)',tipo:'text'}]},escola:{titulo:'Suas credenciais — Escola',sub:'Informe os dados da instituição',campos:[{label:'Nome da escola / instituição',placeholder:'Nome completo',tipo:'text'},{label:'CNPJ ou código MEC',placeholder:'Para verificação da instituição',tipo:'text'},{label:'Seu cargo',placeholder:'Ex: Educador especial, coordenador...',tipo:'text'}]}};

function selecionarPerfil(p){_perfilSelecionado=p;document.querySelectorAll('.mo-perfil-btn').forEach(b=>b.classList.remove('sel'));document.getElementById('mpb-'+p).classList.add('sel');const btn=document.getElementById('mo-btn-continuar');btn.style.opacity='1';btn.style.pointerEvents='auto';}
function moAvancarPlanos(){if(!_perfilSelecionado) return;if(_perfilSelecionado==='familia'){fecharMo();ir('tela-planos');mostrarPlanosPorPerfil('familia');return;}const cfg=_credenciais[_perfilSelecionado];document.getElementById('mo-etapa2-titulo').textContent=cfg.titulo;document.getElementById('mo-etapa2-sub').textContent=cfg.sub;document.getElementById('mo-etapa2-campos').innerHTML=cfg.campos.map(c=>`<div class="cg"><label class="cl">${c.label}</label><input type="${c.tipo}" class="ci" placeholder="${c.placeholder}"></div>`).join('');document.getElementById('mo-etapa1').style.display='none';document.getElementById('mo-etapa2').style.display='block';lucide.createIcons();}
function moVoltarEtapa(){document.getElementById('mo-etapa1').style.display='block';document.getElementById('mo-etapa2').style.display='none';}
function moVoltarEtapaDesktop(){document.getElementById('mo-etapa-desktop').style.display='none';document.getElementById('mo-etapa1').style.display='block';}
function entrarAreaProfissional(){fecharMo();ir('tela-planos');mostrarPlanosPorPerfil('profissional');}

/* ── Override ir() ── */
const _irBase=ir;
ir=function(id){
    _irBase(id);
    if(id==='tela-linhatempo') setTimeout(()=>{iniciarLT();lucide.createIcons();},50);
    if(id==='tela-perfil')     setTimeout(()=>{carregarPerfil();lucide.createIcons();},50);
    if(id==='tela-partilhar')  setTimeout(()=>{renderizarPINs();lucide.createIcons();},50);
    if(id==='tela-ajustes')    setTimeout(()=>{atualizarExibicaoPlano();lucide.createIcons();},50);
    if(id==='subtela-educacao') setTimeout(()=>{carregarEduStatus();lucide.createIcons();},50);
    if(id==='subtela-terapia') setTimeout(()=>{injetarCardGravacaoSessao();lucide.createIcons();},50);
};

/* ── estadosMunicipios ── */
const estadosMunicipios = window.estadosMunicipios || {
    AC:{nome:'Acre',municipios:['Rio Branco','Cruzeiro do Sul','Sena Madureira','Tarauacá','Feijó']},
    AL:{nome:'Alagoas',municipios:['Maceió','Arapiraca','Palmeira dos Índios','Rio Largo','Penedo']},
    AM:{nome:'Amazonas',municipios:['Manaus','Parintins','Itacoatiara','Manacapuru','Coari']},
    AP:{nome:'Amapá',municipios:['Macapá','Santana','Laranjal do Jari','Oiapoque','Porto Grande']},
    BA:{nome:'Bahia',municipios:['Salvador','Feira de Santana','Vitória da Conquista','Camaçari','Itabuna','Juazeiro','Ilhéus','Lauro de Freitas']},
    CE:{nome:'Ceará',municipios:['Fortaleza','Caucaia','Juazeiro do Norte','Maracanaú','Sobral','Crato','Itapipoca','Maranguape']},
    DF:{nome:'Distrito Federal',municipios:['Brasília','Ceilândia','Taguatinga','Samambaia','Planaltina']},
    ES:{nome:'Espírito Santo',municipios:['Vitória','Serra','Vila Velha','Cariacica','Cachoeiro de Itapemirim','Linhares','São Mateus']},
    GO:{nome:'Goiás',municipios:['Goiânia','Aparecida de Goiânia','Anápolis','Rio Verde','Luziânia','Águas Lindas de Goiás','Valparaíso de Goiás']},
    MA:{nome:'Maranhão',municipios:['São Luís','Imperatriz','São José de Ribamar','Timon','Caxias','Codó','Paço do Lumiar']},
    MG:{nome:'Minas Gerais',municipios:['Belo Horizonte','Uberlândia','Contagem','Juiz de Fora','Betim','Montes Claros','Ribeirão das Neves','Uberaba']},
    MS:{nome:'Mato Grosso do Sul',municipios:['Campo Grande','Dourados','Três Lagoas','Corumbá','Ponta Porã']},
    MT:{nome:'Mato Grosso',municipios:['Cuiabá','Várzea Grande','Rondonópolis','Sinop','Tangará da Serra','Cáceres','Sorriso']},
    PA:{nome:'Pará',municipios:['Belém','Ananindeua','Santarém','Marabá','Parauapebas','Castanhal','Abaetetuba']},
    PB:{nome:'Paraíba',municipios:['João Pessoa','Campina Grande','Santa Rita','Patos','Bayeux','Sousa','Cajazeiras']},
    PE:{nome:'Pernambuco',municipios:['Recife','Caruaru','Olinda','Petrolina','Paulista','Jaboatão dos Guararapes','Gravatá']},
    PI:{nome:'Piauí',municipios:['Teresina','Parnaíba','Picos','Piripiri','Floriano','Campo Maior']},
    PR:{nome:'Paraná',municipios:['Curitiba','Londrina','Maringá','Ponta Grossa','Cascavel','São José dos Pinhais','Foz do Iguaçu']},
    RJ:{nome:'Rio de Janeiro',municipios:['Rio de Janeiro','São Gonçalo','Duque de Caxias','Nova Iguaçu','Niterói','Belford Roxo','São João de Meriti']},
    RN:{nome:'Rio Grande do Norte',municipios:['Natal','Mossoró','Parnamirim','São Gonçalo do Amarante','Macaíba','Ceará-Mirim']},
    RO:{nome:'Rondônia',municipios:['Porto Velho','Ji-Paraná','Ariquemes','Vilhena','Cacoal','Jaru','Rolim de Moura']},
    RR:{nome:'Roraima',municipios:['Boa Vista','Caracaraí','Rorainópolis','Alto Alegre','Mucajaí']},
    RS:{nome:'Rio Grande do Sul',municipios:['Porto Alegre','Caxias do Sul','Pelotas','Canoas','Santa Maria','Gravataí','Viamão']},
    SC:{nome:'Santa Catarina',municipios:['Joinville','Florianópolis','Blumenau','São José','Chapecó','Criciúma','Itajaí']},
    SE:{nome:'Sergipe',municipios:['Aracaju','Nossa Senhora do Socorro','Lagarto','Itabaiana','São Cristóvão','Estância']},
    SP:{nome:'São Paulo',municipios:['São Paulo','Guarulhos','Campinas','São Bernardo do Campo','Santo André','São José dos Campos','Ribeirão Preto','Osasco']},
    TO:{nome:'Tocantins',municipios:['Palmas','Araguaína','Gurupi','Porto Nacional','Paraíso do Tocantins','Colinas do Tocantins']}
};
// ═══════════════════════════════════════════════════════════════
// LEGADO AZUL — Substitua a função mostrarSeletorRede() no app.js
// Paths SVG geográficos reais — funciona 100% offline (file://)
// ═══════════════════════════════════════════════════════════════

function mostrarSeletorRede() {
    const body = document.getElementById('rede-body');
    if (!body) return;

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const estUsuario   = d.rede?.estado    || null;
    const munUsuario   = d.rede?.municipio || null;
    const cepUsuario   = d.perfil?.cep     || null;

    // Injeta CSS uma única vez
    if (!document.getElementById('rede-mapa-css')) {
        const s = document.createElement('style');
        s.id = 'rede-mapa-css';
        s.textContent = `
            .mapa-wrap{width:100%;background:linear-gradient(135deg,#e8f4fb,#f0f8ff);border-radius:18px;padding:8px 4px 4px;border:1px solid rgba(168,204,232,.3);}
            .mapa-wrap svg{width:100%;height:auto;display:block;}
            .est-shape{stroke:#fff;stroke-width:.8;stroke-linejoin:round;cursor:pointer;transition:filter .15s ease;}
            .est-shape:hover{filter:brightness(.78);}
            .est-shape.meu-estado{stroke:#e05050;stroke-width:2.5;}
            .est-label{font-family:'Quicksand',sans-serif;font-size:8px;font-weight:700;fill:#fff;pointer-events:none;text-anchor:middle;dominant-baseline:middle;}
            .mapa-legenda{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:6px 4px 4px;}
            .mapa-leg-item{display:flex;align-items:center;gap:5px;font-family:'Quicksand',sans-serif;font-size:11px;color:#555;}
            .mapa-leg-dot{width:11px;height:11px;border-radius:3px;flex-shrink:0;}
            .mapa-hover-info{text-align:center;font-family:'Quicksand',sans-serif;font-size:12px;color:#2c3e50;min-height:18px;padding:4px 0 2px;}
            .rede-cep-aviso{display:flex;align-items:center;gap:8px;background:#fff8e8;border:1px solid #f0c060;border-radius:10px;padding:10px 13px;font-size:.72rem;color:#856404;margin-bottom:12px;flex-wrap:wrap;}
            .rede-estado-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
            .rede-estado-back{background:white;border:1px solid #e0eaf2;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
            .rede-estado-nome{font-size:.88rem;font-weight:700;color:#2c3e50;font-family:'Quicksand',sans-serif;}
            .rede-municip-lista{display:flex;flex-direction:column;gap:6px;}
            .rede-municip-item{background:white;border:1px solid #e0eaf2;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .2s;}
            .rede-municip-item:hover{border-color:#a8cce8;background:#f0f8ff;transform:translateX(2px);}
            .rede-municip-item.meu-municipio{border-color:#2d83b0;background:#e8f4fb;}
            .rede-municip-ico{width:32px;height:32px;border-radius:9px;background:#e8f4fb;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;}
            .rede-municip-nm{font-size:.82rem;font-weight:700;color:#2c3e50;flex:1;}
            .rede-municip-meta{font-size:.62rem;color:#888;margin-top:1px;}
        `;
        document.head.appendChild(s);
    }

    const COR = {
    Norte:          '#4a9e6b',  // verde
    Nordeste:       '#d94f4f',  // vermelho
    Sudeste:        '#9b7bb8',  // roxo
    Sul:            '#4a90c4',  // azul
    'Centro-Oeste': '#e6b84a'   // amarelo
};

    const REGIAO = {
        AM:'Norte', RR:'Norte', AP:'Norte', PA:'Norte', TO:'Norte', RO:'Norte', AC:'Norte',
        MA:'Nordeste', PI:'Nordeste', CE:'Nordeste', RN:'Nordeste', PB:'Nordeste',
        PE:'Nordeste', AL:'Nordeste', SE:'Nordeste', BA:'Nordeste',
        MG:'Sudeste', ES:'Sudeste', RJ:'Sudeste', SP:'Sudeste',
        PR:'Sul', SC:'Sul', RS:'Sul',
        MT:'Centro-Oeste', MS:'Centro-Oeste', GO:'Centro-Oeste', DF:'Centro-Oeste'
    };

    const NOME = {
        AM:'Amazonas', RR:'Roraima', AP:'Amapá', PA:'Pará', TO:'Tocantins',
        RO:'Rondônia', AC:'Acre', MA:'Maranhão', PI:'Piauí', CE:'Ceará',
        RN:'Rio Grande do Norte', PB:'Paraíba', PE:'Pernambuco', AL:'Alagoas',
        SE:'Sergipe', BA:'Bahia', MG:'Minas Gerais', ES:'Espírito Santo',
        RJ:'Rio de Janeiro', SP:'São Paulo', PR:'Paraná', SC:'Santa Catarina',
        RS:'Rio Grande do Sul', MT:'Mato Grosso', MS:'Mato Grosso do Sul',
        GO:'Goiás', DF:'Distrito Federal'
    };

    // Paths reais extraídos do SVG geográfico
    const PATHS = {
        BA: "m 396.7483,280.14568 c 0.71501,-2.34867 2.32435,-8.20598 2.77544,-10.88304 1.06631,-4.36755 3.22976,-8.56454 2.89307,-13.15018 0.24433,-9.74093 0.23297,-19.53715 1.88542,-29.15165 -1.15228,-2.73068 4.27262,-3.15317 1.98097,-5.4068 -1.73917,-0.58345 0.40641,-3.0821 1.62874,-3.43559 1.53619,-0.44426 2.9396,0.42062 4.0554,2.55291 1.73062,0.80718 2.10721,-1.34658 3.44153,-2.3963 1.76038,-3.59872 4.5629,-7.82465 6.35375,-9.78217 -2.85539,-2.53678 -4.39697,-3.48364 -5.47699,-5.95478 -1.15551,-2.64388 -2.51321,-6.38726 -0.69554,-8.62811 0.8232,-1.01486 3.09325,0.53899 3.88851,-0.49791 1.1238,-1.46527 -0.15589,-3.75867 -0.74511,-5.48947 -1.13553,-3.33554 -2.18056,-8.25892 -3.93647,-11.01495 -1.1871,-1.86324 -2.8669,-3.41295 -4.68577,-4.65245 -1.85469,-1.26391 -3.96204,-2.60677 -6.16293,-2.71187 -2.38216,-0.11376 -4.32187,2.50569 -6.51221,3.70588 -2.22637,1.21993 -3.59855,3.30495 -6.73716,3.55179 -2.5361,0.19943 -4.2372,-1.37704 -4.99484,-3.97769 -1.27754,-2.23433 -2.44172,-3.74646 -4.4687,-3.83434 -1.22531,-0.0531 -2.13234,1.21325 -3.13497,1.91584 -1.84821,1.29512 -3.35747,3.05441 -5.28854,4.22383 -2.25784,1.3673 -4.62557,2.88087 -7.24986,3.19641 -4.15038,0.49906 -7.72576,-3.98224 -11.99836,-2.01778 -1.36462,0.62742 -0.32681,2.83249 -0.58534,4.30555 -0.33094,1.88625 -0.65365,3.87203 -1.6678,5.49956 -1.355,2.17451 -3.19835,4.27941 -5.45026,5.51555 -2.29861,1.26176 -5.1901,2.01727 -7.79672,1.71113 -2.61965,-0.30767 -5.09356,-1.52312 -7.08001,-3.18076 -1.74634,-1.45727 -2.82984,-5.60291 -3.86531,-5.62313 -1.87079,-0.0365 -3.74146,7.10626 -5.89576,11.98985 -0.63247,1.43375 3.11949,4.1232 3.31557,6.66498 0.12788,1.65771 -1.66882,3.00996 -1.75071,4.67058 -0.10329,2.09443 1.48709,2.87468 1.61775,6.07936 0.0931,2.28225 -0.95868,4.37663 -1.04047,6.60343 -0.12668,3.44858 0.0489,6.69098 0.85673,10.31719 0.72509,3.2546 3.17304,5.19269 -0.24445,10.0002 5.13924,1.05891 11.15958,-5.0548 16.30713,-7.39931 2.60854,-0.70728 4.8401,-1.06363 6.82943,0.0373 1.54993,0.85775 1.35847,3.49706 2.83011,4.48183 2.27406,1.5217 5.47244,0.63594 8.09762,1.41941 5.655,1.68766 6.77439,7.11151 16.25437,6.99917 2.75517,-0.0327 3.16261,4.36921 5.5539,5.73076 3.11222,2.36598 11.11558,0.63149 12.80505,4.85243 2.29565,5.73537 -7.71302,12.19482 -7.12466,15.98706 0.43899,2.82945 3.71881,5.52173 6.1833,7.75474 0.97504,0.88346 2.13673,2.26039 3.46556,2.05997 0.51461,-0.0776 0.78079,-0.71097 1.04711,-1.15809 0.26778,-0.44957 0.52248,-1.48034 0.52248,-1.48034 z",
        SE: "m 426.78167,203.57812 c 1.64447,-3.64352 3.42828,-4.24703 5.65355,-5.03924 0.7999,-0.47026 1.75861,-1.31119 2.62132,-2.07247 1.41405,-0.97145 2.25072,-1.02012 3.68672,-1.58986 -4.04896,-2.86239 -7.79503,-5.819 -11.61154,-8.83301 -1.44855,-1.14396 -2.89164,-2.2969 -4.28272,-3.51008 -1.8488,-1.61237 -4.21709,-3.83037 -5.39571,-5.00464 -0.68913,0.29035 0.62068,3.13542 1.40885,5.58396 0.91366,2.83838 1.4495,3.92905 2.02235,5.94236 0.72816,2.55913 0.69119,4.41636 0.47121,5.49087 -0.14526,0.70943 -0.74247,1.41382 -1.42358,1.66008 -1.08126,0.39093 -2.12116,-1.61768 -3.33247,-0.28322 -0.98648,1.08677 -0.0189,3.2511 0.65831,4.66967 1.22373,2.5632 2.30258,5.60329 5.81317,6.23013 0.68452,0.11035 1.33713,-0.37081 2.00568,-0.5562 0.74465,-0.75158 1.28679,-1.71089 1.70483,-2.68835 z",
        PE: "m 441.9826,173.10391 c 2.36676,-0.70977 4.58715,-0.13527 7.22191,0.13138 1.82638,0.18483 3.44025,0.87342 4.41808,0.23325 1.00624,-0.65877 1.63869,-4.51633 1.41834,-6.31378 0.0595,-3.34539 0.21633,-6.20496 0.15389,-9.22199 -1.73161,0 -3.46321,0 -5.19482,0 -0.54521,0.77482 -1.3153,1.48135 -2.16966,1.94193 -1.10574,0.5961 -2.3991,0.78957 -3.64305,0.96443 -1.73074,0.24329 -3.59216,-0.46872 -5.24218,0.10758 -2.19267,0.76583 -1.94183,2.81779 -5.54043,4.22519 -2.04335,-0.2539 -2.45818,-0.42452 -3.34444,-1.21233 -0.956,-0.84979 -1.55304,-1.59561 -1.72159,-3.42942 0.2967,-1.83175 1.09129,-3.04116 2.01034,-4.62397 -0.37066,-2.15268 -1.6376,-2.3687 -2.34872,-1.43263 -3.06771,3.52234 -5.81468,4.79938 -9.80446,5.49254 -3.67278,0.6381 -5.45493,-3.31495 -7.97288,-2.75408 -7.44533,1.65844 -6.67752,-2.83728 -10.27057,-3.86914 -3.15212,-0.77802 -5.03805,1.98704 -8.53566,1.1163 -2.65553,-0.6611 0.0134,5.24326 -1.27421,7.49682 -0.84237,1.47427 -1.81076,1.77483 -4.15158,2.95161 -1.29847,0.65276 -3.05831,0.95663 -3.13529,2.23844 -0.091,1.51555 2.29776,1.99001 3.36363,3.07127 1.273,1.29138 1.98102,3.53737 3.61016,4.06947 4.89624,1.5992 8.71339,-6.05409 13.73053,-6.17679 2.60291,-0.0637 5.00739,1.56698 7.27159,2.85251 2.13919,1.21455 4.21629,3.73116 5.83486,4.51839 1.78404,-0.50316 4.35199,-2.38062 6.52333,-2.43443 4.34574,-0.10769 7.64389,4.75741 12.03796,4.32411 2.42901,-0.92385 4.30578,-3.53218 6.75492,-4.26666 z",
        AL: "m 453.46387,177.17818 c 0.29049,-0.78832 0.95205,-1.88642 -1.08674,-2.2741 -1.84328,-0.19775 -7.57404,-1.02914 -10.51605,0.28446 -1.68548,0.75255 -2.34466,2.27573 -4.10208,3.09228 -4.41746,3.01846 -8.11775,-1.68491 -12.32575,-3.00427 -1.23213,-0.35909 -2.95429,-0.58741 -4.0963,0 -1.51768,0.78064 -1.81516,0.71019 -2.84926,1.57671 5.65758,4.10096 10.23737,8.17407 15.37059,12.24282 1.89201,1.49966 3.79987,3.17707 5.6867,4.48548 1.39908,-1.39976 3.19423,-3.10758 4.59331,-4.50733 3.16784,-3.85441 7.67462,-7.41578 9.32558,-11.89605 z",
        AM: "m 85.966736,177.23229 c 1.199049,-0.9651 2.097067,-2.7261 3.353172,-3.17466 3.305207,-0.0661 7.758246,1.47554 11.389492,0.36112 3.70782,-1.13792 8.53877,-5.42599 9.4207,-6.82904 4.38755,-6.98014 5.02799,-8.65162 9.23711,-10.85562 2.40622,-1.25995 4.63756,-1.09996 8.10852,-0.80503 2.67991,0.22772 3.89841,4.02839 5.84072,5.56689 1.59248,1.2614 3.45147,2.25448 5.40357,2.81879 8.22025,2.37629 17.12739,2.07423 25.58727,2.10456 5.10856,-0.019 13.74027,-0.32558 15.28309,-1.3167 1.60111,-1.34103 3.56726,-16.80884 3.74129,-18.05051 -0.48584,-0.97818 -2.5308,-4.04833 -3.30135,-6.86727 -0.707,-2.58646 2.24806,-8.32967 3.57579,-10.88379 1.29514,-2.49141 4.30522,-8.71573 6.95306,-13.12034 1.62338,-3.54696 4.84872,-9.53017 7.39323,-15.2024 2.68904,-5.994415 5.46325,-9.236698 3.99576,-13.456964 -1.07366,-3.08766 -4.10398,-3.91473 -8.20282,-5.039217 -3.77151,-1.034686 -8.3815,-1.057561 -11.64202,-3.452932 -3.26066,-2.395478 -5.2466,-5.653555 -7.1127,-9.895583 -1.46623,-3.333053 -2.77581,-7.900294 -2.88061,-9.684285 -2.56762,-0.30482 -5.85484,-1.4376 -8.69084,0.01986 -3.88726,1.997714 -1.08178,7.288883 -5.92069,10.137036 -4.75349,2.797869 -6.74739,-1.219877 -9.87455,-0.190801 -3.12391,1.028009 -3.49067,5.763404 -7.82342,6.011231 -3.8635,0.220987 -6.34555,-2.519384 -8.06909,-4.99528 -5.45339,-7.833864 -1.11407,-18.971611 -5.45746,-27.469 -1.17847,-2.305564 -2.93591,-5.403241 -5.47072,-5.948141 -1.58797,-0.341362 -1.56698,0.39064 -3.79638,1.361051 l -4.03007,1.764383 0,1.411506 0,1.411507 -1.54343,1.323287 c -0.85747,0.705754 -3.42985,2.293698 -5.83074,3.352328 l -4.28731,2.029041 -3.172614,3.352328 c -3.515594,3.705205 -4.115818,3.969862 -4.115818,2.11726 0,-0.705754 -0.342984,-1.499726 -0.771715,-1.764383 l -0.771716,-0.529315 -3.344102,1.235068 -3.344102,1.235068 -3.344102,-2.558356 -3.344101,-2.558355 -1.543432,0 -1.543431,0 -0.514478,-3.616986 -0.514477,-3.616985 -1.543431,-1.940822 -1.543432,-1.940821 -2.572386,2.558356 -2.572386,2.558355 -1.114701,-0.970411 -1.1147,-0.97041 -1.629178,1.235068 -1.629178,1.235068 -7.974396,0 -7.974397,0 0,1.676164 c 0,0.970411 -0.257238,2.293698 -0.514477,3.087671 l -0.514477,1.411506 3.344102,0 c 3.432227,-0.287339 5.765931,1.085744 5.40201,4.499177 -0.449673,3.816457 -2.555383,2.831759 -4.801787,1.676164 -1.772088,0.705753 -3.544176,1.411507 -5.316264,2.11726 l 0,3.616985 0,3.616986 3.001117,2.999451 3.001117,2.999452 c -1.279263,1.388133 -0.381312,2.182174 0.428731,3.793424 l 1.286193,2.558355 c 1.796303,10.638115 -1.239304,30.646811 -6.430965,39.963281 -2.936421,-0.11653 -5.096036,-0.97162 -8.060143,-1.85261 -3.322682,3.82376 -8.668819,2.2321 -12.144213,3.53164 -1.750321,0.70001 -4.49055,3.43768 -4.49055,3.43768 -3.603215,1.45275 -5.181181,-1.38313 -6.919407,0.13356 -2.410594,2.10337 -1.48372,6.4061 -1.48372,9.48233 0.156812,3.08526 -1.019949,4.69688 -2.4008937,7.23397 0.5915266,5.53869 -3.8355555,6.47183 -5.2853015,11.76766 5.6456029,4.333 10.4135992,4.97732 16.6676682,5.99276 18.08602,2.93656 25.075134,6.33284 35.495774,10.50958 8.680602,3.47931 21.764427,9.54469 25.583782,11.51503 1.926577,-0.85389 3.289365,-2.05004 4.795403,-3.26223 z",
        PA: "m 286.69466,158.05116 c 0.96048,-3.183 -0.736,-6.80596 0.28828,-9.9701 1.28047,-3.95552 4.11144,-7.58331 7.01624,-10.32348 2.40459,-2.26831 4.90523,-4.91945 5.07399,-8.09722 0.14854,-2.79687 -4.30544,-7.06671 -3.68601,-7.5567 3.0455,-2.40908 9.4202,-5.94995 13.15555,-9.99148 3.6103,-3.90623 6.20631,-8.68389 8.61482,-13.421367 2.89303,-5.6905 5.56767,-12.503043 6.92342,-17.850674 0.74204,-2.926881 1.52128,-3.891378 -2.86329,-5.904282 -2.56986,-1.179791 -5.94015,-3.082689 -12.36549,-4.228621 -13.51053,-2.391387 -6.41979,-5.497379 -9.99177,-7.729821 -5.74644,-3.59145 -9.09921,-5.826368 -18.23217,-9.005728 -2.15211,0.865559 -4.15606,0.358453 -6.03691,0.10815 -3.82363,3.446277 -11.39704,11.34998 -13.19111,14.404201 -7.6488,13.021314 -7.1472,7.425659 -10.77217,3.294924 -1.63972,-1.868495 -2.64369,-3.304413 -3.46731,-6.105445 -1.35808,-3.229745 -3.96488,-1.725413 -4.8106,-5.033126 0.13801,-9.621923 -2.74945,-10.645502 -6.60589,-16.650464 -2.19934,-3.424662 -6.90367,-4.917027 -11.3286,-4.617053 -3.36082,-0.06275 -1.80358,-4.103648 -2.46238,-6.352032 -0.74638,-2.389069 -4.16182,-1.344016 -6.05663,-0.65209 -2.26763,1.13395 -4.59032,0.440952 -6.90881,-0.111973 -2.52079,1.958231 2.43659,5.045631 -0.0948,6.638611 -1.86774,1.973384 -4.95597,0.09028 -7.3702,0.336849 -3.08528,0.01217 -6.35577,-1.289821 -9.31156,-0.359023 -2.00233,1.788998 -15.40637,8.098012 -17.86013,9.078435 -0.33697,4.890314 -0.40551,8.121748 0.16806,12.585907 0.82326,6.407592 3.72736,12.519776 7.90611,16.334595 3.49247,3.18829 9.91736,3.40027 13.42605,4.633961 2.27241,0.799001 6.74414,0.965241 8.4067,5.950445 1.54257,4.625454 -4.48071,12.622621 -7.04934,18.861651 -2.34759,5.70215 -5.6098,11.39779 -8.60112,17.01565 -2.99132,5.61786 -5.58861,9.19749 -6.85264,14.58848 -0.61038,2.60321 1.78879,5.63443 3.57528,8.33369 2.21297,3.34363 4.18393,7.93805 4.17874,12.95668 0.15312,4.51962 1.16083,5.20063 3.27655,7.36097 2.36877,2.41872 3.98568,4.62226 6.88696,5.64687 4.65617,1.64437 13.45668,1.33188 19.78235,1.62482 6.32568,0.29293 12.65669,0.5925 18.94185,0.89582 6.28515,0.30332 12.52444,0.6104 18.66666,0.91838 6.14221,0.30797 12.18736,0.61684 18.08421,0.92373 1.73292,-5.91558 9.44448,-11.56407 11.54711,-18.53214 z",
        MT: "m 209.85936,266.5957 c 3.49378,0.53305 6.5571,3.73946 10.07243,3.31091 6.27014,0.34151 15.63099,-2.14796 17.20752,-1.17707 1.00296,1.73061 0.46134,5.01326 2.5549,5.6948 2.67093,1.55937 1.18782,-3.26333 1.36915,-4.69435 0.62851,-2.4079 1.7785,-6.45573 3.31388,-9.40312 1.39009,-2.66848 3.06399,-5.27766 5.25697,-7.33775 1.90841,-1.79277 3.60883,-3.00448 6.6587,-4.16724 1.01987,-0.38883 0.42752,-7.58699 6.4794,-9.27216 2.89832,-1.34081 2.74318,-3.15542 3.32844,-5.27821 1.0941,-6.03339 3.35857,-11.71813 5.93524,-17.25236 -0.65351,-2.89469 -1.82476,-5.58498 -2.02558,-8.47737 -0.43538,-6.27074 -0.17074,-12.50962 0.8746,-18.70793 0.64035,-3.79709 2.57837,-7.65982 3.69847,-11.28307 -6.11289,-0.51248 -13.68189,-1.00707 -21.63269,-1.4603 -7.9508,-0.45323 -16.28341,-0.86511 -23.92352,-1.21219 -7.64012,-0.34708 -14.23942,-0.28105 -19.42024,-0.47507 -5.18082,-0.19403 -7.06415,-0.28388 -10.73518,-1.33881 -1.82469,-0.52436 -3.06537,-1.84622 -4.65445,-3.2827 -1.99491,-1.80333 -3.67545,-3.17556 -5.03567,-5.49536 -1.54465,-2.63434 -1.41355,-5.12141 -1.90946,-9.16175 -0.34196,-2.78616 -1.0169,-6.22955 -2.95396,-7.90574 -0.39583,2.2169 -0.43955,6.30315 -1.03312,9.08226 -0.68012,3.18435 -1.42682,8.58964 -2.80249,9.65226 -1.38211,1.28578 -10.76597,1.01504 -16.17312,1.2379 -6.07136,0.25023 -16.31167,-0.74912 -17.89582,-0.78606 0.26407,3.32157 0.33965,6.69406 0.39028,10.31591 0.0394,2.8152 -1.61306,5.73631 -1.02919,8.49056 0.44048,2.07788 1.79876,3.4402 3.479,4.73957 2.85131,2.20499 7.73313,0.63733 10.32912,3.13788 3.95226,3.80695 5.40273,10.74477 4.90221,16.20945 -1.15554,11.14188 -12.01168,12.79376 -5.72733,18.57716 3.82573,4.9554 -0.1759,11.29489 0.52191,15.75581 0.43397,2.30386 4.3241,3.27266 3.60134,6.04113 0.24653,1.92397 -0.49482,4.81115 0.3598,6.14221 6.85409,0.17341 13.70818,0.34681 20.56227,0.52021 0.77987,2.999 -1.69713,5.65045 -0.81475,8.27948 1.74932,4.54268 6.42763,4.32916 7.99561,8.63303 0.63117,3.38778 1.95337,2.67162 3.3504,0.0821 2.38972,-5.37258 6.53404,-6.68843 9.23941,-7.64115 2.54003,-0.80959 4.21409,-0.40893 6.28552,-0.0929 z",
        RO: "m 155.12778,222.33146 c 4.23103,-2.7517 7.34389,-8.02424 7.63402,-13.07604 0.29633,-5.15959 -2.02832,-12.20437 -5.68637,-14.38115 -2.8324,-1.61668 -7.34308,-1.01836 -9.58999,-3.12177 -1.82436,-1.70785 -3.62517,-4.49375 -3.64668,-6.59977 -0.028,-2.74438 1.43753,-5.52897 1.34644,-8.31932 -0.11157,-3.41768 -0.38776,-5.91638 -0.50578,-9.68933 -3.3538,-0.31377 -8.19759,-1.06113 -11.52574,-3.1709 -2.27715,-1.44353 -3.53913,-5.10488 -5.92265,-6.13152 -6.25052,-0.68917 -6.98581,0.97191 -9.77279,2.91908 -3.44743,2.40859 -4.66913,8.09839 -7.54863,10.10904 -3.06939,2.14325 -6.17712,4.78435 -9.86273,5.6929 -3.275425,0.80745 -6.354872,-0.28813 -10.112304,-0.40576 -1.380099,1.61046 -2.935304,2.76337 -4.591479,4.08556 12.932629,1.0805 15.031903,1.35296 16.469333,10.49751 -0.0551,3.26214 -1.08312,6.76866 0.13836,9.78297 3.11397,5.08396 7.74471,9.89173 12.81885,11.96593 4.13273,1.60416 9.12335,0.0237 13.1374,1.88333 1.82952,0.8476 2.73455,3.08814 4.5264,4.01272 1.77101,0.91383 4.0112,0.67214 5.8247,1.34788 1.18876,1.36 1.88272,3.42547 3.56627,4.08 4.15863,1.61678 9.56296,0.95125 13.30337,-1.48136 z",
        AC: "m 51.426219,196.79147 c 2.043929,-0.0388 4.14835,-0.49209 6.153797,-0.26733 1.482067,0.55578 2.964135,1.11155 4.446203,1.66733 5.072314,-3.11365 10.501235,-5.75058 14.855078,-9.89121 1.690821,-1.60802 1.97387,-3.30296 3.354026,-6.13945 -9.693274,-4.60021 -13.216466,-6.23665 -19.949124,-9.07072 -7.886313,-3.31969 -15.728343,-6.85138 -23.931454,-9.28515 -8.485762,-2.51763 -22.593742,-4.68461 -25.98872,-5.45031 -2.8288599,-0.63802 -7.6460086,-4.07413 -7.6460086,-4.07413 -0.3975961,1.44846 -1.0037821,2.77385 -1.88621717,4.85922 1.50689257,2.19103 2.35347917,3.56816 2.78304527,5.95956 2.0106518,4.76245 6.0400075,8.14457 9.1093745,12.19219 -0.333333,1.13333 -0.666667,2.26667 -1,3.4 3.015066,-0.21103 5.981946,0.51921 8.7,1.8 0.666667,1.46667 1.333333,2.93333 2,4.4 3.066667,0 6.133333,0 9.2,0 2.2,-2.33333 3.346435,-3.64775 5.122246,-4.90651 1.775811,-1.25876 3.316434,-0.32138 3.354608,0.8299 0.158245,4.77248 0.123146,9.11744 0.123146,14.47661 0.680577,1.18446 1.579142,1.6591 2.840434,0.95261 2.794245,-0.71452 5.693869,-0.91583 8.559566,-1.15261 l -0.104798,-0.1572 z",
        AP: "m 260.769,66.023156 c 3.8349,-4.788158 8.79324,-8.576249 12.7991,-13.224205 1.75034,-2.886256 3.43676,-4.132595 5.93865,-4.863527 1.36048,-1.366469 0.7359,-3.785632 1.10386,-5.678447 -0.76366,-0.838347 -1.35457,-2.029861 -2.22664,-2.646575 -0.99259,-0.08879 -2.12712,0.169001 -3.03839,-0.118352 -1.30495,-1.404354 -2.86845,-2.614797 -4.1339,-4.011836 -2.15241,-6.618271 -4.5275,-13.195742 -5.71384,-20.074944 -1.99173,-9.307097 -2.15055,-5.084229 -4.23803,-2.694703 -1.89331,2.261054 -3.97742,4.394485 -5.75197,6.734975 -2.17919,4.369109 -4.35839,8.738218 -6.53758,13.107327 -1.71492,1.11744 -3.42985,2.234883 -5.14477,3.352328 -1.4828,-0.470312 -2.96182,-1.251763 -4.44692,-1.533208 -4.79877,2.860083 -3.39481,-3.099681 -4.61322,-1.645561 -0.83557,0.646548 -3.16443,2.417752 -4.33214,2.171548 -2.60394,0.20477 -3.7511,-0.08068 -6.2436,-0.757161 -3.3e-4,1.040982 -0.36041,4.077489 1.15977,3.597984 1.14715,0.14345 2.47104,-0.492629 3.62131,0.0082 3.61471,1.043297 7.56377,3.356319 10.11497,7.322839 4.58458,7.718114 4.36102,8.17007 5.13813,13.923417 0.58204,4.309185 2.91437,2.859459 4.04981,4.539599 1.2544,1.856164 1.73521,3.698395 2.9847,6.021742 1.82746,3.202236 1.66695,4.37289 3.5547,4.410115 1.50738,0.02972 2.06302,-2.206341 2.97507,-3.406861 1.09428,-1.440386 1.85013,-3.122803 2.98093,-4.534694 z",
        RJ: "m 363.1,338.2328 c -0.0989,-0.51798 -0.82693,-1.16771 -0.15989,-1.52532 1.41996,-1.35823 2.83993,-2.71645 4.25989,-4.07468 2.2642,-0.71602 4.79084,-1.08547 6.54236,-2.83667 0.8029,-1.10993 0.22161,-2.9683 0.65536,-4.37163 0.25563,-1.46596 1.89871,-3.55233 1.11345,-4.76511 -2.65501,-0.33392 -4.3289,-0.72891 -6.46223,-1.06224 -0.73333,-1.4 -1.84008,-3.79576 -2.57341,-5.19576 -1.13938,1.07281 -1.89546,3.86104 -2.64428,5.22203 -0.99781,2.1121 -1.21129,4.72686 -2.83125,6.40938 -2.10933,2.1908 -5.20042,3.4986 -8.2,4 -2.08387,0.34833 -4.18551,-0.95315 -6.29077,-0.77508 -3.67506,0.31085 -6.64821,2.0917 -10.59824,3.17834 -0.26524,0.21021 -4.06632,1.16243 -3.04305,0.97227 2.8224,1.38251 3.92047,1.68102 4.27851,3.48532 0.43577,2.196 -2.5134,4.51542 -3.19301,5.90894 0.62984,0.95526 3.90098,-2.15861 4.69564,-2.5089 0.50603,-0.28559 3.20451,-1.38137 3.6768,-0.77517 1.60225,1.25939 4.33171,0.16742 6.27411,0.11428 0.53333,-1 0.53078,-2.62421 1.6,-3 0.95799,-0.33669 1.86667,0.8 2.8,1.2 -0.33333,0.53333 -0.66667,1.06667 -1,1.6 3.56206,0.19651 7.13314,0.52715 10.7,0.3 0.79269,-0.0892 0.72066,-0.60731 0.4717,-1.21318 -0.0239,-0.0956 -0.0478,-0.19121 -0.0717,-0.28682 z",
        RS: "m 242.11056,462.62126 c 1.35817,-1.18772 3.20101,-1.99871 3.63103,-3.90789 1.77754,-4.00665 3.51215,-8.04062 5.62956,-11.88333 -2.92146,-0.1739 -1.3621,-2.74001 -0.68597,-4.5874 0.12352,-3.09896 2.52997,-4.85973 5.00078,-6.24816 2.31112,-0.58398 0.39097,-3.46969 2.37742,-4.52836 1.90599,-2.6023 3.34604,-5.49998 4.96926,-8.27882 1.49243,0.016 5.95991,-0.25711 4.43823,1.79461 -2.02741,2.61551 -2.75274,5.99927 -5.04318,8.44202 -1.7924,2.33901 -3.33721,4.93398 -5.94576,6.48142 -1.70112,0.76129 -5.17623,5.74248 -1.38973,4.03472 1.82656,-0.25826 2.63073,-2.24722 3.97667,-3.31906 2.24404,-2.46528 4.74731,-4.74284 6.83015,-7.32486 3.20057,-5.89487 6.73649,-12.45041 10.29854,-18.12453 -1.59742,-1.66563 -2.40411,-3.73135 -3.97752,-5.9823 2.42463,-2.5904 4.50502,-3.73714 3.48904,-5.32886 -1.10179,-1.72618 -2.43138,-0.49631 -6.4418,0.3727 -6.3042,-8.33932 -10.66585,-11.53132 -18.65439,-14.43941 -4.74964,-1.72902 -12.46981,-2.11555 -16.60352,-2.16628 -5.39303,2.77958 -8.56156,5.02766 -13.0352,9.24847 -9.9071,6.63516 -16.68815,18.28787 -24.13756,26.66425 1.66139,1.25186 2.5652,-0.008 3.94433,-0.94836 1.75116,-0.74549 3.45717,-0.29857 4.45373,1.29602 2.34542,2.41306 4.69084,4.82613 7.03626,7.23919 0.21862,0.95263 -0.64161,3.95346 0.91008,2.37523 1.06858,-0.73293 2.13715,-1.46587 3.20573,-2.1988 4.64671,5.21745 10.77044,8.68175 15.60581,13.05644 4.47965,0.33278 5.43298,6.12758 9.60358,9.43945 -1.16497,2.49324 -2.60007,4.92295 -3.60134,7.45469 -0.40421,2.16749 0.51498,4.53918 2.68342,1.94168 0.50538,-0.0356 1.06622,-1.57398 1.43239,-0.57448 z",
        SC: "m 287.45669,399.80963 c -0.83307,-2.04011 1.41704,-2.50552 1.70191,-4.08433 0.34732,-1.99088 0.69465,-3.98177 1.04197,-5.97265 -0.77048,-1.8543 -2.29092,-3.52785 -2.14479,-5.63715 -0.14253,-2.59072 -0.2235,-4.87357 -0.36603,-7.46429 2.0717,0.50126 1.04411,-1.23292 0.68764,-1.70282 -0.82328,-1.08526 -1.89742,-0.84578 -2.89897,-0.80115 -2.05186,0.0915 -3.74177,1.83635 -5.76951,2.1631 -2.20073,0.35462 -4.32805,-0.70881 -6.68223,-0.26188 -4.9135,0.93281 -9.5345,4.66455 -14.70504,5.1328 -4.71762,0.42723 -9.50858,-0.81646 -14.03997,-2.19669 -3.15394,-0.96066 -5.62648,-2.04376 -8.96514,-4.17828 -0.51999,4.39616 -1.06867,8.03867 -1.06867,10.86168 9.74943,-0.18659 19.15738,1.18565 26.29132,6.77664 3.00847,2.42635 7.16335,5.90324 9.19979,9.21642 3.0297,-0.32167 6.34609,-1.26391 7.65726,0.94871 1.43615,2.42353 -1.25553,5.18066 -3.1161,7.85583 0.78266,1.19557 1.52983,1.94276 2.43564,3.01519 3.37268,-3.52877 7.62551,-8.28973 10.99819,-11.8185 -0.20398,-0.33007 0.38482,-2.16962 -0.25724,-1.85259 z",
        PR: "m 258.03551,378.95631 c 4.31029,-0.45585 9.25404,-3.89252 14.04739,-5.00703 2.46193,-0.57242 4.66331,0.69344 6.96337,0.35923 2.17501,-0.31604 4.04967,-1.82771 6.21582,-2.19969 1.91305,-0.32853 4.54939,-3e-5 5.82316,-3e-5 1.38104,-2.74255 -3.49097,-3.17463 -2.75505,-4.89689 0.88208,-2.06431 5.2776,0.19632 6.5241,-1.67068 0.34834,-0.52174 0.40079,-0.9668 -0.26773,-1.86289 -0.60774,-0.92323 -1.56,-0.774 -2.40263,-0.9547 -0.71134,-0.15255 -1.72622,0.47173 -2.18039,-0.0966 -0.86776,-1.08587 0.49247,-2.73605 0.73871,-4.10408 -2.45806,0 -4.84941,0.77734 -6.59715,-0.57079 -2.08604,-1.60908 1.88536,-2.74417 -2.78155,-7.01206 -1.70332,-1.91028 -2.43449,-4.50619 -2.13744,-6.98311 -0.10204,-2.78642 -0.004,-5.04655 -2.33085,-6.42397 -2.71703,-1.49686 -6.89649,-0.81036 -10.27647,-1.57556 -2.90932,-0.65865 -5.88557,-2.07685 -8.56707,-2.58589 -4.90733,-0.93157 -9.2481,-1.25017 -14.13938,-0.23773 -2.28712,0.47341 -5.57588,1.34239 -6.86956,3.61292 -2.50649,4.39913 -2.51066,8.96923 -4.08312,14.06505 -1.34584,4.36139 -3.17205,10.14306 -4.55925,13.27986 -0.4273,1.0844 -0.85459,2.16879 -1.28189,3.25319 1.6006,-0.35288 3.20119,-0.70575 4.80179,-1.05863 1.37647,2.2244 0.97019,4.43524 4.18228,6.46834 5.66008,3.58256 13.60998,6.59788 20.63988,6.26328 z",
        SP: "m 305.56275,356.22896 c 2.59228,-1.64314 4.93719,-3.75132 7.69269,-5.08759 2.45384,-1.46001 4.82665,-2.72988 7.33102,-3.29805 1.31842,-0.13647 2.76782,0.76696 4.09291,0.41411 3.11319,-0.829 4.78572,-2.08645 7.85869,-5.62617 5.84421,-6.06847 1.27436,-7.26676 -0.78399,-8.72719 -4.80838,2.20283 -8.42647,2.87519 -12.74728,3.97531 -1.4402,0.15821 -3.26863,-0.76012 -3.80592,-1.85683 -1.76489,-3.60249 -2.97177,-7.07815 -4.7913,-12.2496 -0.68593,-2.33048 -1.46861,-4.76581 -1.88767,-6.82125 -0.41906,-2.05544 -0.84394,-3.9157 -1.06055,-6.45065 -0.224,-1.78361 -0.68535,-6.04563 -2.03445,-7.18124 -0.92898,-0.78197 -2.4579,-0.0373 -3.63698,0.20687 -1.14222,0.2365 -2.23387,0.68503 -3.37688,0.91767 -2.62759,0.53481 -5.32557,1.53759 -7.96986,1.0926 -2.96719,-0.49933 -8.22973,-4.26188 -11.12789,-5.07074 -4.79723,-1.33889 -9.9749,-1.13743 -13.19846,0.21161 -1.45326,0.60818 -3.76888,6.51503 -4.79138,8.39976 -3.04861,5.61938 -4.89738,10.01338 -8.16308,14.49488 -1.21651,1.66942 -2.5531,3.31312 -4.20847,4.54868 -2.2162,1.65415 -7.83802,3.37538 -7.44079,3.66938 0.39724,0.29399 7.14186,-1.40445 10.73649,-1.1929 4.90751,0.28881 9.54371,2.37928 14.36559,3.33665 3.74434,0.74343 8.1613,0.18902 11.29904,1.86724 1.70399,0.97552 2.23542,1.86424 2.89205,3.71466 0.78273,2.20579 -0.1066,5.20674 0.55601,7.45154 0.7439,2.5202 3.02944,3.50301 3.79287,6.01737 0.25645,0.84461 0.3652,3.03235 0.95022,3.69332 1.51417,1.71075 4.32623,-0.77309 5.90951,0.87391 0.74623,0.77626 -0.43617,2.32105 0.3727,3.20875 0.94998,1.04256 2.79514,1.58666 4.28027,1.38152 3.52695,-0.48717 5.52394,-3.78545 8.89493,-5.9136 z",
        MS: "m 215.67236,335.104 c 0.62652,2.69297 0.80879,11.82233 3.03708,13.03775 7.2336,-0.99637 4.95537,-6.5452 13.20226,-2.51297 1.05732,-4.34407 1.20806,-5.72127 2.44472,-8.34159 0.98037,-2.07728 2.17261,-4.15524 3.87284,-5.69972 2.55591,-2.32179 6.37629,-2.83487 9.08651,-4.97452 1.73754,-1.37174 3.13512,-3.14829 4.45411,-4.92621 2.17287,-2.92891 3.04404,-4.57267 5.63855,-9.3758 2.59451,-4.80313 4.99914,-8.55852 6.88199,-12.68748 0.77236,-1.69373 1.13522,-3.29844 1.7337,-5.30863 -6.13992,-2.75355 -13.18855,-5.62998 -16.15794,-7.08836 -2.13509,-1.01069 -4.09573,-1.09848 -5.25683,-2.49201 -0.80513,-0.96631 1.07519,-2.79664 -0.69745,-3.4367 -1.36032,-0.49118 -3.7665,-1.83089 -3.29639,-3.44234 0.81018,-2.61565 -2.36246,-1.56903 -3.27156,-3.07405 -0.61435,-1.01707 -0.74951,-4.66026 -1.93081,-4.52935 -6.84967,0.75908 -12.46432,1.76908 -15.80513,1.62815 -3.95692,-0.32485 -7.33897,-3.53384 -11.30298,-3.75595 -2.18739,-0.12256 -4.16633,0.58219 -6.42962,1.36286 -2.99202,1.03199 -6.98146,6.0135 -8.85255,10.28454 -0.61856,1.85544 -2.14561,12.59856 -5.36109,18.49732 0.85746,1.29388 1.71492,2.58777 2.57238,3.88165 -0.81957,1.08663 -2.22464,2.04782 -2.67306,3.21397 0.97546,3.12462 2.1644,6.21915 3.00727,9.36245 -0.24612,3.81344 0.0512,5.64047 -1.19167,9.30686 4.34941,1.26963 7.46571,-0.40941 11.96819,-0.0833 0.89986,-0.66632 4.9804,-3.95962 6.14124,-3.14951 6.37353,3.87286 6.0294,6.70349 8.18624,14.30294",
        GO: "m 269.0819,289.24096 c 5.738,-7.05714 7.80891,-4.46138 12.76452,-5.70805 2.18459,-0.57774 5.99743,-2.6334 8.22458,-3.01548 4.18366,-0.71773 7.39291,2.48104 11.49956,1.407 1.73553,-0.4539 3.35988,-1.45036 4.40308,-2.90976 0.90273,-1.26289 1.33782,-3.10464 1.30043,-4.65655 -0.0386,-1.60161 -1.31311,-2.75932 -1.25493,-4.36034 0.0861,-2.36835 3.10304,-4.18823 2.79367,-6.53786 -1.09775,-8.33734 -3.45726,-8.18185 -15.25453,-8.94765 0.18357,-2.79161 0.25221,-5.59013 0.42869,-8.38082 15.89865,-0.75036 9.37733,0.22081 14.57686,7.23397 1.25761,-0.58813 2.51522,-1.17626 3.77283,-1.76438 2.14339,-2.23638 -0.72409,-6.80589 1.28044,-9.1393 2.83573,-3.30098 4.87603,-1.29564 7.09782,-2.44756 1.21484,-0.62985 2.8101,-1.13478 3.33025,-2.40047 0.5658,-1.37677 0.2299,-2.82343 -0.73963,-4.40381 -0.75589,-1.81131 -0.79154,-2.84363 -1.27192,-5.43394 -1.28044,-6.90435 0.66339,-7.95603 -0.92629,-8.38568 -2.70024,-0.72981 -4.63886,-1.52718 -8.68379,-1.83668 -3.65156,-0.2794 -5.35468,6.02489 -9.04636,6.82403 -3.88901,0.84186 -7.68001,-2.87624 -11.64978,-2.60401 -1.64011,0.11247 -3.14507,1.38518 -4.62119,1.7228 -1.86238,0.42597 -3.71811,0.67024 -5.46201,0.14489 -1.81995,-0.54826 -3.20804,-1.93629 -4.66817,-3.27469 -0.96307,-0.88278 0.52987,-5.50419 -2.60562,-3.0065 -2.95363,2.91716 -5.06396,10.70683 -5.78331,13.62768 -0.26339,1.67637 -0.48094,6.2902 -2.33541,8.61818 -1.28773,1.61654 -4.11209,1.36083 -5.47039,2.91855 -1.7448,2.00097 -2.01435,5.00184 -2.75748,7.47198 -2.11261,0.9894 -4.61742,2.48122 -6.54738,4.21754 -2.13712,1.92268 -4.00352,4.20958 -5.408,6.71785 -1.55109,2.77009 -2.83174,6.21781 -3.204,8.96927 -0.28786,2.12762 -0.082,4.40747 0.20395,6.3522 -1.10275,3.92974 0.54619,2.49978 3.43888,5.11745 0.0635,0.96046 -0.98628,2.36869 -0.004,2.60663 4.48248,1.57767 7.04463,2.59192 10.43254,4.05614 3.24829,1.58453 6.59023,3.36293 9.90671,4.80071 0.76107,-1.11556 1.32811,-2.32334 2.23938,-3.59334 z",
        MG: "m 366.03943,309.83247 c 1.98769,-2.38743 4.89385,-3.81651 6.9863,-6.43444 1.81091,-2.26569 4.21981,-4.18486 4.39741,-7.07989 0.13453,-2.19288 -1.53622,-4.80922 -2.6712,-6.56061 2.6665,-0.80073 4.01571,-3.02441 1.48711,-4.57197 0.20128,-1.99946 1.09446,-3.55064 3.90956,-3.02944 1.49968,-3.73979 2.37497,-3.34247 4.42934,-2.9878 1.61713,0.49239 3.59842,1.36354 3.92352,0.91904 0.3251,-0.44454 -1.39778,-1.42109 -2.44335,-2.36016 -1.59437,-1.432 -2.77757,-3.98175 -2.63865,-6.46266 0.18181,-3.24693 9.04768,-8.36395 7.22657,-13.25227 -1.46588,-3.9348 -7.95227,-1.96742 -11.37768,-4.09103 -2.29938,-1.42552 -3.05014,-5.52065 -5.85625,-5.61939 -9.26595,-0.32603 -11.39621,-5.90751 -15.60316,-6.80987 -4.20696,-0.90236 -7.11895,-0.55997 -9.55306,-2.19656 -1.37556,-0.92489 -1.3548,-3.88369 -3.06656,-4.38176 -4.24572,-1.2354 -8.15181,3.42955 -12.24973,5.09072 -2.17961,0.88355 -1.42218,1.34648 -6.56175,2.59343 -1.7333,0.42053 -3.32435,-0.23408 -5.41794,-0.54861 -1.44684,-0.21736 -4.42782,-0.18526 -5.32944,0.78806 -2.29793,2.40703 1.37845,8.95934 -2.41712,10.44655 -3.47945,0.92574 -4.12288,1.74319 -4.41497,3.67715 -0.17292,1.14495 1.88674,4.64334 1.61355,7.14682 -0.23903,2.19045 -2.50535,3.37279 -2.66494,5.57046 -0.12064,1.6613 0.99899,2.5533 1.28916,5.07726 0.31446,2.73525 -0.90037,4.95018 -2.49232,6.35862 -2.36718,2.09429 -5.82764,3.29106 -8.90871,2.58633 -1.77117,-0.40512 -4.56712,-1.89432 -7.18438,-1.51861 -2.20114,0.31597 -4.77083,2.34579 -6.89894,2.99078 -2.61369,0.79216 -5.96762,0.0121 -8.41406,1.22615 -2.6093,1.29483 -4.72959,3.7538 -6.28143,6.21893 -1.09963,1.74677 -1.55538,2.81916 -2.53049,6.37357 2.14345,-0.62571 3.06272,-0.86702 4.63816,-0.92528 3.53343,-0.13065 8.16767,0.40476 10.52741,1.30131 2.70858,1.02908 6.14511,3.94174 8.99918,4.44143 2.4191,0.42353 5.11453,-0.6687 7.54148,-1.04469 2.56877,-0.39796 5.56129,-2.40623 7.88108,-1.23341 3.14767,2.61375 2.72808,4.78199 3.29308,8.25105 0.29373,1.78391 0.73161,5.47675 1.16591,7.23025 0.4343,1.7535 0.92659,3.47643 1.45227,5.13806 0.52568,1.66164 1.08474,3.26198 1.65259,4.7703 1.14572,3.04345 2.12994,7.80369 4.02198,8.88825 2.04246,1.17078 4.61128,-0.67552 6.9533,-1.23819 2.08441,-0.50078 6.29226,-2.15947 10.71511,-3.85239 4.54714,-1.84752 7.60381,-3.22523 11.48679,-3.49439 2.19751,-0.15233 4.43676,1.56035 6.59897,1.13948 2.89869,-0.56422 6.3632,-2.42159 7.2045,-4.20303 1.67082,-3.5379 3.76474,-9.60567 5.18727,-11.15764",
        ES: "m 378.36793,315.90595 c 0.97738,-0.2519 1.91685,-0.5871 2.74917,-1.1577 0.9434,-0.46306 1.38603,-1.48549 2.0905,-2.21544 0.77555,-1.13012 1.35721,-2.41046 2.45475,-3.29106 0.41373,-0.40299 0.82744,-0.80597 1.24116,-1.20895 0.39424,-1.17102 -1.80739,-3.53766 0.22738,-3.67637 0.94553,0.27061 1.3906,-0.44046 1.89196,-1.06085 1.04255,-1.09399 1.53763,-2.54565 2.31159,-3.81513 0.40861,-0.78315 0.25755,-1.73225 0.42901,-2.58572 0.39907,-3.72064 2.58716,-8.56152 2.98624,-12.28216 -2.12173,-1.46667 -4.32303,-2.5334 -6.7949,-3.08718 -1.96951,-0.44123 -4.23818,-1.26826 -5.87649,-0.19259 -0.7789,0.51141 -0.68443,1.73333 -1.02664,2.6 -0.88976,0 -2.52282,-0.48189 -3.05262,0.37341 -0.49196,0.7942 0.036,0.89693 1.00663,2.60424 -0.25409,1.47236 -0.42599,2.26436 -2.01336,3.15012 0.5256,1.34392 2.28431,3.73075 2.15185,5.77435 -0.1992,3.07336 -2.40677,5.77578 -4.3317,8.21866 -1.80788,2.29435 -5.19579,4.23722 -6.60309,5.82393 -1.20027,1.35327 -0.59023,2.84706 -0.24628,4.21329 0.35919,1.42677 0.93786,1.71742 1.8705,4.15836 3.46069,0.49466 4.38495,0.704 6.42374,1.08052 1.56428,-1.42029 1.14909,-1.81741 2.1106,-3.42373 z",
        PI: "m 342.86666,191.0427 c 1.71157,-0.76053 3.72216,-1.64622 5.08494,-3.157 1.45907,-1.61755 2.60356,-3.66178 3.00814,-5.62005 0.73993,-3.58142 -0.70047,-5.49338 1.00819,-7.22229 1.22486,-1.23938 3.4035,-0.87239 5.16844,-0.78369 3.00159,0.15087 5.61418,2.68076 8.59973,2.33615 3.141,-0.36257 5.87335,-3.26492 8.83816,-4.66384 5.90432,-5.31311 4.76125,-4.19589 6.80894,-6.44034 1.59387,-1.74702 5.51619,-2.01461 6.87422,-4.36474 1.33942,-2.31791 -0.65227,-5.05496 0.34423,-8.02387 1.23526,-2.46056 2.65663,-5.77513 1.6777,-8.48797 -0.57701,-1.59901 -3.06556,-1.7705 -3.95572,-3.21874 -1.98466,-3.22896 -1.96609,-7.34702 -2.42002,-11.10986 -0.67003,-5.55422 0.3916,-11.24415 -0.43018,-16.77795 -0.64587,-4.34923 -4.03259,-6.99132 -3.50843,-12.71565 0.10022,-1.094478 0.19783,-1.779789 -2.16065,-2.23737 -1.45908,-0.143546 -1.40169,2.23455 -2.04818,3.18981 -2.71209,2.20372 -4.44852,1.29913 -6.19009,2.73226 -2.41369,1.98621 -4.22325,4.78066 -5.36732,7.68962 -2.47138,6.28383 0.82915,14.88422 -2.82753,20.05875 -1.27568,1.80518 6.66294,5.91192 0.7688,10.36343 -3.89092,2.46893 -7.83077,-1.08747 -11.30576,0.37541 -2.7318,1.15002 -4.12988,4.50372 -6.59477,6.1493 -3.57761,2.38843 -11.71491,1.76833 -11.01893,6.561 0.67283,4.63325 -4.93668,7.88965 -5.80067,12.35718 -0.46621,2.41064 0.17994,4.91032 0.41825,7.35403 0.26356,2.70273 0.0503,5.5726 1.11751,8.06964 1.16199,2.71873 2.78446,5.3586 5.50949,6.95133 3.4523,1.41612 5.45178,1.94566 8.40151,0.63545 z",
        CE: "m 410.49252,153.37689 c -1.37326,-4.50502 1.41792,-7.68879 2.30887,-11.49361 0.52772,-2.25364 -1.24337,-4.03731 1.79716,-6.70722 2.33781,-2.05285 3.28256,-3.28881 4.83648,-5.01463 1.23678,-1.37361 2.3792,-2.82933 3.5669,-4.24558 0.62388,-0.74392 2.94231,-1.62112 1.86963,-2.23341 -12.56793,-7.17383 -9.21188,-15.43258 -25.23955,-22.07066 -4.4412,-1.839383 -10.07521,-2.223242 -14.32531,-1.659474 -0.6422,0.595794 -3.97137,-1.822914 -4.03961,-0.632221 -0.32937,5.746695 3.30353,9.618705 4.03221,14.621765 0.79541,5.46128 -0.76186,11.14433 0.33409,16.55331 0.83879,4.13983 0.7925,10.45934 4.696,11.76959 5.40645,1.81473 -0.78433,9.77211 0.76432,10.6075 3.65369,0.53702 5.60978,-2.21188 8.60496,-1.40223 2.48506,0.67176 5.50605,4.68994 8.40771,4.32035 1.12222,-0.14294 2.71599,-1.33134 2.38612,-2.41348 z",
        RR: "m 156.29028,68.019096 c 4.67931,-1.988204 -0.12418,-10.666555 10.32783,-11.26589 1.83984,-0.1055 3.04194,0.379201 5.51291,0.764346 0.069,-1.457882 0.39368,-7.513956 0.18783,-9.0114 -0.20581,-1.497443 -2.17888,-0.886775 -3.88749,-1.604662 -2.9137,-2.004347 -3.60967,-4.508091 -4.90279,-7.066947 -1.43623,-2.842048 -2.74829,-5.873666 -3.08935,-9.039685 -0.38465,-3.570722 1.01485,-7.116117 1.23297,-10.703361 1.08612,-0.941004 2.17224,-1.882009 3.25836,-2.823013 -0.40015,-1.882008 -0.8003,-3.764017 -1.20045,-5.646025 -1.881,-1.240819 -5.47796,-1.429412 -4.39448,-4.3669975 0.12147,-1.7496304 0.24294,-3.4992608 0.36441,-5.2488912 -1.71492,0 -3.42985,0 -5.14477,0 1.55912,1.9274484 0.0233,3.2815506 -1.44728,4.4870662 -4.33942,4.6764345 -17.98037,9.8959195 -21.082,8.7530705 -0.2683,-2.332216 -2.37086,2.393413 -3.28353,0.596362 1.34212,2.644214 0.18957,5.899268 -2.70665,6.345448 -2.3295,-1.915206 -4.30895,-5.103085 -7.56114,-3.218799 -3.12217,0.22867 -5.92518,-1.40308 -8.60189,-2.759866 -1.57069,-0.466831 -4.99248,0.07945 -1.89293,1.516781 2.16684,0.932005 4.2283,1.962703 3.53082,4.572657 0,1.793017 0,3.586035 0,5.379053 3.17614,1.071151 2.57339,6.821091 5.18841,6.882203 6.54256,0.152896 6.52233,0.756564 8.9075,3.546429 5.61657,6.569528 3.49195,14.688396 5.04055,24.775964 0.71231,4.639968 4.29374,10.456375 8.59444,10.753658 2.6538,0.183442 4.77082,-4.041744 6.62733,-5.400138 6.44957,-2.977631 3.60533,1.641529 10.42139,-0.217363 z",
        TO: "m 322.14907,216.92168 c 2.12498,-9.05841 -4.27296,-6.94687 0.33801,-12.23516 1.97776,-2.26829 -3.02148,-4.45747 -3.10597,-7.01263 -0.15778,-4.77157 4.40851,-10.47661 4.92235,-13.4501 0,0 -3.77329,-1.77787 -4.81878,-3.45523 -0.77625,-1.24541 -0.34908,-3.81793 -1.15853,-5.51193 -0.55019,-1.15142 -1.83321,-1.8332 -2.42016,-2.96632 -0.72995,-1.40917 -1.18923,-3.00199 -1.27696,-4.58657 -0.10849,-1.95935 0.5524,-3.88797 0.94323,-5.81101 0.32238,-1.58623 1.79599,-3.23046 1.15474,-4.71669 -0.63385,-1.46909 -3.07005,-1.21127 -4.17495,-2.36851 -2.05911,-2.15666 -3.40893,-5.06416 -4.04942,-7.97635 -0.67917,-3.08808 0.0751,-6.17341 0.34899,-9.47924 0.20927,-2.52596 0.19594,-5.66535 -0.99981,-8.11419 -0.98027,-2.00756 -2.82945,-3.58147 -4.74152,-4.73699 -1.64849,-0.99623 -2.82284,-1.26538 -5.51643,-1.72016 1.1855,2.21273 3.28774,2.97213 3.39066,7.1118 0.0388,1.55932 -0.94842,3.60143 -2.15397,5.16746 -1.82192,2.36671 -5.24017,5.09511 -6.22682,6.44307 -1.24551,1.7016 -3.32963,4.62976 -3.97456,7.33474 -0.52308,2.19388 0.51951,4.53182 0.19266,6.76339 -0.4021,2.74535 -1.36378,5.42569 -2.61323,7.90309 -2.08161,4.12739 -6.50443,6.95062 -7.99984,11.32779 -1.68941,1.81187 -6.88769,16.67328 -6.44193,25.70469 -0.0277,5.11757 0.1017,10.37468 1.72428,15.26591 1.76803,-1.93409 4.36561,-2.30806 4.22182,1.11486 -0.15113,3.28101 2.85424,4.64394 5.25178,5.34131 2.93291,0.85309 5.87411,-2.17297 8.92679,-2.06879 3.19081,0.10889 4.37943,1.50864 9.16157,2.79349 4.38112,0.76344 6.36051,-6.02115 10.3089,-7.06932 3.4801,-0.92385 8.00457,3.44255 10.7871,1.00759 z",
        MA: "m 325.54664,168.10519 c 1.13397,-4.23882 3.85117,-6.75275 5.52766,-10.55434 0.60474,-2.32057 -0.214,-5.03098 1.43275,-5.87078 4.03248,-2.98188 6.80244,-2.17467 9.86537,-3.95531 3.03686,-1.76548 4.96398,-5.31222 8.24779,-6.55964 3.49622,-1.3281 7.91843,3.01591 11.20346,-0.60763 2.74103,-2.56399 -3.12201,-6.97387 -2.06711,-8.55256 3.1262,-4.67847 1.16327,-16.60461 2.33127,-19.64631 1.23507,-3.21629 3.68826,-6.57413 6.26256,-9.27333 1.84684,-1.93645 7.04758,-0.0247 6.43265,-4.802794 -3.07562,-0.94921 -6.38671,-1.656278 -9.38594,-3.216143 -2.33229,-0.902907 -4.46202,-2.716859 -7.09213,-2.28071 -1.9246,-0.594415 -1.6353,2.663168 -3.74844,1.740667 -1.73522,0.068 -3.71245,-0.557527 -4.43845,1.501322 -2.10132,4.374668 -6.43538,5.213598 -5.76586,1.460223 0.75011,-2.038948 -3.18895,-1.284628 -1.15412,-3.306771 1.12436,-1.504586 1.35376,-2.771109 -0.64704,-3.444444 0.007,-1.820306 1.69098,-3.915394 0.27288,-5.619897 -0.88823,-1.450265 -3.768,-5.142531 -5.41188,-3.123228 -1.08813,1.897358 -2.21634,-0.890671 -3.64917,-1.451452 -3.51121,-1.374216 -3.28289,-1.443441 -7.47914,-2.418729 -0.50748,3.364722 -1.12014,5.493937 -1.97565,8.157813 -1.09177,3.399573 -2.51379,6.690977 -4.01186,9.932098 -1.83062,3.960615 -3.62705,7.981655 -6.06805,11.598165 -1.89546,2.80824 -4.07199,5.47155 -6.59001,7.73839 -2.71237,2.44181 -6.45719,4.4168 -9.03308,6.18692 2.06303,0.51698 4.81429,0.97201 6.77487,2.33629 1.85089,1.28797 3.38994,3.16266 4.28936,5.22983 0.99467,2.28602 0.89991,4.92084 0.99777,7.41177 0.13064,3.32457 -1.00326,6.28377 -0.42835,9.35042 0.47746,2.54684 1.48443,5.11959 3.14435,7.10933 1.3245,1.58766 4.33864,1.57556 5.13102,3.48529 0.50567,1.21872 -0.3153,2.41162 -0.73795,3.889 -0.83255,2.91029 -1.8499,6.05101 -1.18248,9.0035 0.52571,2.32538 3.14155,3.73894 3.89122,6.00214 0.4113,1.24162 -0.37945,2.77058 0.253,3.91555 0.81528,1.4759 3.06478,3.5911 4.53063,3.47855 3.25167,-1.45242 -0.95782,-10.22315 0.2781,-14.8432 z",
        RN: "m 440.08193,141.8455 c 0.93731,-0.19208 1.64446,0.33175 2.77439,0.73601 1.51759,0.77865 7.76505,0.81048 11.64757,1.21572 -0.9147,-2.95401 -0.90023,-6.20869 -2.2294,-8.99836 -0.50783,-1.06584 -1.2653,-2.03181 -2.1334,-2.82734 -1.57341,-1.3898 -3.64876,-1.87266 -5.6876,-1.99881 -1.90687,-0.21248 -3.81126,-0.4706 -5.73456,-0.37878 -0.78937,-0.0354 -1.6221,0.0704 -2.38464,-0.0523 -2.4895,-1.68813 -4.48795,-4.65979 -7.46851,-5.0644 -1.39215,-0.18898 -2.58071,0.42206 -3.55079,1.4383 -1.99274,2.08756 -2.97902,3.77929 -4.49238,5.64981 -2.15346,2.66168 -6.25737,4.65598 -6.52779,7.93001 0.95051,3.10284 2.51822,3.32872 4.18673,2.8371 1.59896,-0.47113 4.2471,-1.59473 6.21436,-2.70568 1.64445,-0.92865 2.75874,-2.95671 4.61933,-3.28044 0.69288,-0.12055 1.53332,0.0727 2.03174,0.56882 0.45517,0.45312 0.56364,1.21181 0.52784,1.85307 -0.1362,2.43956 -4.05443,4.69745 -2.78033,6.78232 0.71619,1.17195 2.30165,0.73241 4.10562,0.34837 0.68597,0.82338 1.72681,2.22386 2.98151,2.31322 0.96913,0.069 2.10132,-0.57184 2.53289,-1.44231 0.52149,-1.05183 -0.93759,-2.24394 -0.46568,-3.4911 0.2745,-0.72543 1.07326,-1.27751 1.8331,-1.43323 z",
        PB: "m 435.46824,161.79394 c 0.65739,-0.73516 1.07303,-1.80029 1.97217,-2.20548 2.0088,-0.90524 4.46314,0.4591 6.60993,-0.0369 1.57348,-0.36354 3.75635,-0.6053 4.36558,-2.10091 0.51702,-1.26924 2.82492,-1.23439 4.28731,-1.19248 1.25048,-0.0523 2.29431,0.003 2.91741,-0.78802 0.98953,-1.25694 0.18214,-3.19857 0.12889,-4.79739 -0.0386,-1.15931 -0.58704,-4.25305 -1.20857,-5.23243 -6.00145,-0.38968 -5.99459,-0.46153 -11.09039,-0.851 -1.08612,-0.58812 -2.4624,-1.42422 -3.52352,-0.79211 -1.01054,0.60198 0.49904,2.46362 0,3.52876 -0.5712,1.21916 -1.75887,2.51662 -3.10347,2.58498 -1.61996,0.0824 -3.06381,-1.8957 -4.0356,-2.71908 -1.45584,0.12447 -3.20042,0.63419 -4.49199,-0.12447 -0.67682,-0.39756 -1.15483,-1.24077 -1.20322,-2.02422 -0.1606,-2.60036 5.11782,-5.46716 3.13655,-7.15897 -1.61282,-1.37719 -3.48887,2.42832 -5.35575,3.43459 -1.91683,1.03319 -3.83588,2.21652 -5.96885,2.65485 -1.53499,0.31544 -3.34699,-0.85106 -4.70078,-0.0618 -1.0562,0.61577 -1.48907,2.02417 -1.76484,3.21525 -0.65131,2.8131 -1.30395,6.32669 0.40662,8.653 1.33064,1.80962 2.76066,2.90313 6.33074,2.30863 2.50944,-0.41788 3.89965,-1.5985 6.58421,-3.85948 1.47824,-1.42636 3.14028,-2.07873 4.62493,-1.44319 0.89568,0.38342 1.21031,1.35593 1.29598,2.61988 0.0929,1.3707 -2.34295,3.38993 -2.04408,5.24118 0.23406,1.44981 1.28661,2.93117 2.81116,3.39234 1.19484,-0.003 2.67685,-1.30563 3.01958,-2.24549 z"
    };

    // Labels — posições centrais de cada estado (cx, cy)
    const LABELS = {
        BA:{x:365,y:246}, SE:{x:425,y:201}, PE:{x:412,y:170}, AL:{x:439,y:186},
        AM:{x:95,y:112},  PA:{x:241,y:111}, MT:{x:207,y:216}, RO:{x:121,y:198},
        AC:{x:48,y:186},  AP:{x:249,y:45},  RJ:{x:357,y:333}, RS:{x:233,y:419},
        SC:{x:267,y:392}, PR:{x:249,y:358}, SP:{x:285,y:332}, MS:{x:218,y:305},
        GO:{x:267,y:268}, MG:{x:331,y:288}, ES:{x:384,y:308}, PI:{x:358,y:160},
        CE:{x:395,y:126}, RR:{x:137,y:41},  TO:{x:289,y:190}, MA:{x:325,y:122},
        RN:{x:434,y:130}, PB:{x:441,y:155}, DF:{x:294,y:255}
    };

    // Gera os paths coloridos
    const svgEstados = Object.entries(PATHS).map(([uf, d]) => {
        const cor   = COR[REGIAO[uf]] || '#aac8e0';
        const ehMeu = uf.toUpperCase() === (estUsuario || '').toUpperCase();
        const lb    = LABELS[uf];
        return `
            <path class="est-shape${ehMeu ? ' meu-estado' : ''}"
                  fill="${cor}" d="${d}"
                  onmouseenter="mapaHoverEstado('${uf}')"
                  onmouseleave="mapaHoverEstadoOut()"
                  onclick="selecionarEstadoRedeMapa('${uf.toUpperCase()}')"/>
            ${lb ? `<text class="est-label" x="${lb.x}" y="${lb.y}">${uf}</text>` : ''}
            ${ehMeu ? `<circle cx="${lb?.x||0}" cy="${(lb?.y||0)-16}" r="6" fill="#e05050" stroke="#fff" stroke-width="1.5" pointer-events="none"/>` : ''}
        `;
    }).join('');

    // DF é um círculo (sem path no SVG original)
    const dfCor = COR['Centro-Oeste'];
    const dfMeu = (estUsuario || '').toUpperCase() === 'DF';
    const dfExtra = `
        <circle class="est-shape${dfMeu ? ' meu-estado' : ''}"
                r="12" cx="301" cy="251" fill="${dfCor}"
                onmouseenter="mapaHoverEstado('DF')"
                onmouseleave="mapaHoverEstadoOut()"
                onclick="selecionarEstadoRedeMapa('DF')"/>
        <text class="est-label" x="294" y="255">DF</text>
    `;

    const legendaHTML = Object.entries(COR).map(([r, c]) =>
        `<div class="mapa-leg-item"><div class="mapa-leg-dot" style="background:${c}"></div>${r}</div>`
    ).join('');

    body.innerHTML = `
        <div style="flex:1;overflow-y:auto;padding:14px">
            <div class="rede-regras-banner" style="margin-bottom:14px">
                <p>💙 A <strong>Rede Legado</strong> é um espaço de apoio entre famílias.<br>
                Para <strong>escrever</strong>, só no município do seu CEP cadastrado.<br>
                <strong>Política:</strong> sem política, religião, propagandas ou discriminação.</p>
            </div>
            ${!cepUsuario ? `<div class="rede-cep-aviso">📍 Cadastre seu CEP no
                <button onclick="irParaPerfil()" style="background:none;border:none;color:#2d83b0;font-weight:700;cursor:pointer;font-size:inherit">Perfil</button>
                para participar do seu grupo municipal.</div>` : ''}
            <p style="font-size:.78rem;color:#888;margin-bottom:8px;text-align:center">Toque no seu estado</p>
            <div class="mapa-wrap">
                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
                    ${svgEstados}
                    ${dfExtra}
                </svg>
                <div class="mapa-hover-info" id="mapa-hover-info"></div>
                <div class="mapa-legenda">${legendaHTML}</div>
            </div>
            <div id="rede-municipios-area" style="margin-top:14px"></div>
        </div>`;

    // Guarda referências para hover
    window._mapaREGIAO = REGIAO;
    window._mapaNOME   = NOME;
    window._mapaCOR    = COR;
    lucide.createIcons();
}

function mapaHoverEstado(uf) {
    const el = document.getElementById('mapa-hover-info');
    if (!el) return;
    const reg  = (window._mapaREGIAO || {})[uf] || '';
    const nome = (window._mapaNOME   || {})[uf] || uf;
    const cor  = (window._mapaCOR    || {})[reg] || '#2c3e50';
    el.innerHTML = `<strong style="color:${cor}">${nome}</strong> <span style="color:#aaa;font-size:10px">${reg}</span>`;
}

function mapaHoverEstadoOut() {
    const el = document.getElementById('mapa-hover-info');
    if (el) el.textContent = '';
}
function abrirMenuMunicipiosRegiao(nomeRegiao, infoRegiao, municipiosPorEstado) {
    const area = document.getElementById('rede-municipios-area');
    if (!area) return;

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const munUsuario = d.rede?.municipio || null;
    const estUsuario = d.rede?.estado || null;

    let html = `
        <div class="rede-estado-header">
            <button class="rede-estado-back" onclick="mostrarSeletorRede()">←</button>
            <div>
                <div class="rede-estado-nome">${nomeRegiao}</div>
                <div style="font-size:.65rem;color:#888">${infoRegiao.estados.length} estados</div>
            </div>
        </div>
    `;

    infoRegiao.estados.forEach(uf => {
        const estadoInfo = municipiosPorEstado[uf];
        if (!estadoInfo) return;
        html += `
            <div style="margin-bottom:14px">
                <div style="font-family:'Quicksand',sans-serif;font-size:.7rem;font-weight:700;
                    color:${infoRegiao.cor};text-transform:uppercase;letter-spacing:1px;
                    padding:6px 4px 6px;margin-bottom:4px">
                    ${estadoInfo.nome} (${uf})
                </div>
                <div class="rede-municip-lista">
                    ${estadoInfo.municipios.map(m => {
                        const ehMeu = m === munUsuario && uf === estUsuario;
                        const chave = `rede_${uf}_${m}`;
                        const msgs = JSON.parse(localStorage.getItem('la') || '{}')[chave] || [];
                        return `<div class="rede-municip-item ${ehMeu ? 'meu-municipio' : ''}"
                            onclick="entrarMunicipioRede('${uf}','${m}')">
                            <div class="rede-municip-ico">${ehMeu ? '📍' : '🏙️'}</div>
                            <div style="flex:1">
                                <div class="rede-municip-nm">${m}${ehMeu ? ' <span style="color:#2d83b0;font-size:.62rem">← seu grupo</span>' : ''}</div>
                                <div class="rede-municip-meta">${msgs.length > 0 ? msgs.length + ' mensagem(ns)' : 'Nenhuma mensagem ainda'}</div>
                            </div>
                            <span style="color:#ccc;font-size:.8rem">›</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    });

    area.innerHTML = html;
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function criarTelaRedeLegado() {
    const tela = document.createElement('div');
    tela.id = 'tela-rede-legado';
    tela.className = 'tela ativa';
    tela.style.cssText = 'display:flex;flex-direction:column;height:100vh;max-height:100vh;overflow:hidden;padding:0;gap:0;justify-content:flex-start;align-items:stretch;';
    tela.innerHTML = `
        <div class="rede-header" style="flex-shrink:0">
            <button class="bv" onclick="fecharRedeLegado()" style="flex-shrink:0">
                <i data-lucide="arrow-left"></i>
            </button>
            <div style="flex:1">
                <div class="rede-titulo">💙 Rede Legado</div>
                <div class="rede-subtitulo" id="rede-subtitulo">Famílias que entendem de verdade</div>
            </div>
        </div>
        <div id="rede-body" style="flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0"></div>
        <div class="rede-aviso-moderacao" id="rede-aviso-mod" style="flex-shrink:0">⚠️ Esta mensagem não está alinhada com os valores da Rede Legado.</div>
        <div class="ni"></div>`;
    document.querySelector('.app').appendChild(tela);
    tela.querySelector('.ni').innerHTML = buildNavHTML('');
    lucide.createIcons();

    tela.querySelectorAll('.nit[data-destino]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.dataset.destino;
            if (destino) ir(destino);
        });
    });

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (d.rede?.municipio) {
        redeLegadoEstado = d.rede.estado;
        redeLegadoMunicipio = d.rede.municipio;
        mostrarChatRede(d.rede.estado, d.rede.municipio);
    } else mostrarSeletorRede();
}
function formatarCEP(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
    input.value = v;

    if (v.length === 9) {
        fetch(`https://viacep.com.br/ws/${v.replace('-','')}/json/`)
            .then(r => r.json())
            .then(d => {
                const el = document.getElementById('mo-cep-cidade');
                if (!d.erro) {
                    el.textContent = `📍 ${d.localidade} — ${d.uf}`;
                    el.style.display = 'block';
                } else {
                    el.textContent = 'CEP não encontrado';
                    el.style.display = 'block';
                }
            })
            .catch(() => {});
    }
}

/* ══════════════════════════════════════════
   NÍVEL 2 — seleção de opção e salvar
══════════════════════════════════════════ */
function abrirNivel(n) {
    const el = document.getElementById('tela-nivel' + n);
    el.classList.add('nivel-pronto');
    document.getElementById('nivel-backdrop').style.display = 'block';
    el.style.transform = 'translateY(0)';
    if (n === 1) atuConts();
    lucide.createIcons();
}

function fecharNivel() {
    [1, 2, 3].forEach(n => {
        const el = document.getElementById('tela-nivel' + n);
        if (el) el.style.transform = 'translateY(110%)';
    });
    document.getElementById('nivel-backdrop').style.display = 'none';
}

let _subtopicoOrigem = 'tela-painel';

function abrirSubtopico(id) {
    fecharNivel();
    const ativa = document.querySelector('.tela.ativa, .subtela.ativa');
    _subtopicoOrigem = ativa ? ativa.id : 'tela-painel';
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    lucide.createIcons();
}

function fecharSubtopico() {
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(_subtopicoOrigem || 'tela-painel').classList.add('ativa');
    lucide.createIcons();
}

function fecharOverlay() {
    fecharNivel();
}

function salvarSubtopico(nivelNum, dadoKey, inputId) {
    const val = document.getElementById(inputId)?.value?.trim();
    if (!val) { alert('Preencha o campo antes de salvar.'); return; }
    _salvarEntrada({ nivel: nivelNum, data: new Date().toISOString(), dados: { [dadoKey]: val } });
    document.getElementById(inputId).value = '';
    fecharSubtopico();
}

function salvarSubtopicoOpcao(nivelNum, dadoKey, containerId) {
    const sel = document.querySelector('#' + containerId + ' .n2-op.sel');
    if (!sel) { alert('Selecione uma opção antes de salvar.'); return; }
    _salvarEntrada({ nivel: nivelNum, data: new Date().toISOString(), dados: { [dadoKey]: sel.textContent } });
    document.querySelectorAll('#' + containerId + ' .n2-op').forEach(b => b.classList.remove('sel'));
    fecharSubtopico();
}

function selOp(btn) {
    btn.closest('.n2-opcoes').querySelectorAll('.n2-op')
        .forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
}

function salvarNivel2() {
    const campos = document.querySelectorAll('#tela-nivel2 .n2-campo');
    const opcaoSel = document.querySelector('#tela-nivel2 .n2-op.sel');
    const temConteudo = [...campos].some(c => c.value.trim()) || opcaoSel;
    if (!temConteudo) {
        alert('Preencha ao menos um campo antes de salvar.');
        return;
    }
    const entrada = {
        nivel: 2,
        data: new Date().toISOString(),
        dados: {
            vidaDiaria: campos[0]?.value.trim(),
            interacao: campos[1]?.value.trim(),
            regulacao: opcaoSel?.textContent,
            decisao: campos[2]?.value.trim()
        }
    };
    _salvarEntrada(entrada);
    campos.forEach(c => c.value = '');
    document.querySelectorAll('#tela-nivel2 .n2-op').forEach(b => b.classList.remove('sel'));
    fecharNivel();
}

/* ══════════════════════════════════════════
   NÍVEL 3 — salvar
══════════════════════════════════════════ */
function salvarNivel3() {
    const campos = document.querySelectorAll('#tela-nivel3 .n2-campo');
    const opcaoSel = document.querySelector('#tela-nivel3 .n2-op.sel');
    const temConteudo = [...campos].some(c => c.value.trim()) || opcaoSel;
    if (!temConteudo) {
        alert('Preencha ao menos um campo antes de salvar.');
        return;
    }
    const entrada = {
        nivel: 3,
        data: new Date().toISOString(),
        dados: {
            independencia: campos[0]?.value.trim(),
            participacao: campos[1]?.value.trim(),
            autonomia: opcaoSel?.textContent,
            proposito: campos[2]?.value.trim()
        }
    };
    _salvarEntrada(entrada);
    campos.forEach(c => c.value = '');
    document.querySelectorAll('#tela-nivel3 .n2-op').forEach(b => b.classList.remove('sel'));
    fecharNivel();
}

function _salvarEntrada(entrada) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.evolucao) d.evolucao = [];
    d.evolucao.push(entrada);
    localStorage.setItem('la', JSON.stringify(d));
}

/* ══════════════════════════════════════════
   REDE DE PARCEIROS
══════════════════════════════════════════ */
const _PARC_COR  = '#5ca0c7';
const _PARC_RGBA = 'rgba(92,160,199,.14)';
const PARCEIROS = {
    educacao: [
        { id:'edu-creche',       nome:'Creche',       icone:'baby',           cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-escola',       nome:'Escola',       icone:'graduation-cap', cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-faculdade',    nome:'Faculdade',    icone:'building',       cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-profissionais',nome:'Profissionais',icone:'users',          cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-cursos',       nome:'Cursos',       icone:'laptop',         cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-artes',        nome:'Artes',        icone:'palette',        cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'edu-esportes',     nome:'Esportes',     icone:'activity',       cor:_PARC_COR, rgba:_PARC_RGBA },
    ],
    saude: [
        { id:'sau-cardio',   nome:'Cardiologista',          icone:'heart-pulse', cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-dentista', nome:'Dentista',               icone:'smile',       cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-gastro',   nome:'Gastroenterologista',    icone:'activity',    cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-geneti',   nome:'Geneticista',            icone:'dna',         cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-neuro',    nome:'Neurologista',           icone:'brain',       cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-oftalmo',  nome:'Oftalmologista',         icone:'eye',         cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-orto',     nome:'Ortopedista',            icone:'bone',        cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-otorrino', nome:'Otorrinolaringologista', icone:'ear',         cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-pediatra', nome:'Pediatra',               icone:'baby',        cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'sau-psiqui',   nome:'Psiquiatra',             icone:'zap',         cor:_PARC_COR, rgba:_PARC_RGBA },
    ],
    terapia: [
        { id:'ter-aba',      nome:'ABA',           icone:'target',    cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-fisio',    nome:'Fisioterapia',  icone:'dumbbell',  cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-fono',     nome:'Fono',          icone:'mic',       cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-musico',   nome:'Musicoterapia', icone:'music',     cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-nutri',    nome:'Nutricionista', icone:'apple',     cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-psi',      nome:'Psicóloga',     icone:'brain',     cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-psicoped', nome:'Psicopedagoga', icone:'book-open', cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'ter-to',       nome:'TO',            icone:'hand',      cor:_PARC_COR, rgba:_PARC_RGBA },
    ],
    trabalho: [
        { id:'trab-empresa',  nome:'Empresas Parceiras', icone:'briefcase',   cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'trab-aprendiz', nome:'Jovem Aprendiz',     icone:'award',       cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'trab-apoio',    nome:'Prof. de Apoio',     icone:'user-check',  cor:_PARC_COR, rgba:_PARC_RGBA },
        { id:'trab-capacita', nome:'Capacitação',        icone:'trending-up', cor:_PARC_COR, rgba:_PARC_RGBA },
    ]
};

let _parcAbaAtiva = 'educacao';

function parcAba(btn, aba, idx) {
    _parcAbaAtiva = aba;
    document.querySelectorAll('#parc-tabs .pp-tab').forEach(t => t.classList.remove('pp-tab-at'));
    btn.classList.add('pp-tab-at');
    const slider = document.getElementById('parc-slider');
    if (slider) slider.style.transform = `translateX(${idx * 100}%)`;
    _parcRenderizar(aba);
}

function _parcRenderizar(aba) {
    const lista = document.getElementById('parc-lista');
    if (!lista) return;
    lista.innerHTML = `<div class="rl-grid">${
        (PARCEIROS[aba] || []).map(p => `
            <div class="rl-card" onclick="abrirFicha('${p.id}')">
                <div class="rl-ico" style="background:${p.rgba}"><i data-lucide="${p.icone}" style="width:22px;height:22px;stroke:${p.cor};stroke-width:1.5"></i></div>
                <span class="rl-nome">${p.nome}</span>
            </div>
        `).join('')
    }</div>`;
    lucide.createIcons();
}

function abrirFicha(id) {
    const todos = [...PARCEIROS.educacao, ...PARCEIROS.saude, ...PARCEIROS.terapia, ...PARCEIROS.trabalho];
    const p = todos.find(x => x.id === id);
    if (!p) return;
    document.getElementById('parc-ficha-header').style.background = p.cor;
    document.getElementById('parc-ficha-tipo').textContent = p.nome;
    document.getElementById('parc-ficha-body').innerHTML = `
        <p class="parc-ficha-desc">Em breve: profissionais e instituições cadastradas nessa especialidade aparecerão aqui.</p>
        <button class="parc-ficha-btn" style="background:${p.cor}" onclick="mostrarToast('Cadastro de parceiros em breve!')">Quero ser parceiro</button>
    `;
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('tela-parc-ficha').classList.add('ativa');
    lucide.createIcons();
}

function fecharFicha() {
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('tela-parceiros').classList.add('ativa');
    lucide.createIcons();
}