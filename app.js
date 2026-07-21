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
                        <button class="la-btn la-btn-emoji" onclick="laTogglePic('${ctx}')" title="Emojis">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                                <circle cx="9" cy="9" r=".6" fill="currentColor" stroke="none"/>
                                <circle cx="15" cy="9" r=".6" fill="currentColor" stroke="none"/>
                            </svg>
                        </button>
                        <textarea class="la-ta" id="la-ta-${ctx}"
                            placeholder="${ph}" rows="1"
                            oninput="laResize(this);${opts.hasHumor ? `laCheckTags('${ctx}',this)` : ''}"
                            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();laEnviar('${ctx}')}">
                        </textarea>
                        <div class="la-col">
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
let _telaAnterior = 'tela-painel';
function irAnterior() { ir(_telaAnterior); }

function abrirSubtela(id) {
    const ativa = document.querySelector('.tela.ativa, .subtela.ativa');
    if (ativa) _telaAnterior = ativa.id;
    document.querySelectorAll('.tela, .subtela, .form-subtela').forEach(t => {
        t.classList.remove('ativa');
        t.style.cssText = '';
    });
    document.getElementById(id).classList.add('ativa');
    lucide.createIcons();
}
function abrirAprendizado() { abrirSubtela('tela-aprendizado'); }

const _navStack = [];
let _navegandoParaTras = false;

function voltar() {
    const anterior = _navStack.pop() || 'tela-painel';
    _navegandoParaTras = true;
    ir(anterior);
}

function ir(id) {
    _pp2FecharSeletor();
    const voltando = _navegandoParaTras;
    const telaAtiva = document.querySelector('.tela.ativa');
    if (telaAtiva && telaAtiva.id && telaAtiva.id !== id) {
        _telaAnterior = telaAtiva.id;
        if (!voltando) {
            _navStack.push(telaAtiva.id);
            if (_navStack.length > 40) _navStack.shift();
        }
    }
    _navegandoParaTras = false;
    const backdrop = document.getElementById('nivel-backdrop');
    if (backdrop) backdrop.style.display = 'none';
    if (typeof _fecharRede === 'function') _fecharRede();
    // Anima a tela saindo, depois remove ativa; demais telas somem imediatamente
    const telaASair = (telaAtiva && telaAtiva.id !== id) ? telaAtiva : null;
    document.querySelectorAll('.tela, .subtela, .form-subtela').forEach(t => {
        if (t === telaASair) return;
        t.classList.remove('ativa');
        t.style.cssText = '';
    });
    if (telaASair) {
        const exitClass = voltando ? 'tela-exit-right' : 'tela-exit-left';
        telaASair.classList.add(exitClass);
        telaASair.addEventListener('animationend', () => {
            telaASair.classList.remove('ativa', exitClass);
            telaASair.style.cssText = '';
        }, { once: true });
    }
    if (id === 'tela-agenda') setTimeout(calculateAgCardHeights, 80);
    // Travar todos os painéis de nível fora da tela
    document.querySelectorAll('[id^="tela-nivel"]').forEach(el => {
        el.classList.remove('nivel-pronto');
        el.style.transform = 'translateY(110%)';
    });
    const seletor = document.getElementById('tela-seletor-msg');
    if (seletor) seletor.style.transform = 'translateY(110%)';
    const destino = document.getElementById(id);
    if (!destino) { console.warn('ir(): tela não encontrada:', id); return; }
    destino.style.cssText = '';
    destino.classList.add('ativa');
    const _animClass = voltando ? 'tela-enter-left' : 'tela-enter-right';
    destino.classList.add(_animClass);
    destino.addEventListener('animationend', () => destino.classList.remove(_animClass), { once: true });
    lucide.createIcons();
    if (id === 'tela-painel') { atuConts(); _atuSaudacao(); _renderHojeCard(); }
    _injectHubBar(id);
    if (id === 'tela-agenda') setTimeout(renderAgenda, 80);
    if (id === 'tela-parceiros') { const tipos = ['educacao','familia','saude','terapia']; selecionarParcTab(Math.max(0, tipos.indexOf(_parcFiltroAtivo))); }
    if (id === 'tela-graficos')  iniciarGraficos();
    if (id === 'tela-grafico') _inicializarRede();
    if (id === 'tela-mensagens') _renderMensagensTab(_msgTabAtiva);
    if (id === 'tela-desabafo') iniciarDesabafo();
    if (id === 'tela-saude-cuidador') renderSaudeCuidadorCategorias();
    if (id === 'tela-saude-cuidador-lista') renderSaudeCuidadorListaFiltrada();
    if (id === 'tela-cuidadores-hub') _renderCuidPerfilHeader();
    if (id === 'tela-cuidadores-mensagens') renderCuidadoresMensagens();
    // Título dinâmico no header — mostra o nome do card clicado
    const _TELA_TITULOS = {
        'tela-educacao':      { el:'edu-greeting', titulo:'Educação' },
        'tela-familia-pilar': { el:'fam-greeting', titulo:'Família' },
        'tela-saude-pilar':   { el:'sau-greeting', titulo:'Saúde' },
        'tela-terapia-pilar': { el:'ter-greeting', titulo:'Terapia' },
        'tela-perfil':        { el:'prf-greeting',  titulo:'Perfil' },
        'tela-financeiro':    { el:'fin-greeting',  titulo:'Financeiro' },
        'tela-seguranca':     { el:'seg-greeting',  titulo:'Segurança' },
        'tela-ajustes':       { el:'cfg-greeting',  titulo:'Configurações' },
        'tela-agenda':        { el:'ag-greeting',  titulo:'Agenda' },
        'tela-grafico':       { el:'rede-greeting',      titulo:'Rede Legado' },
        'tela-parceiros':     { el:'parc-greeting',      titulo:'Rede Parceiros' },
        'tela-documentos':    { el:'doc-greeting',       titulo:'Documentos' },
        'tela-partilhar':     { el:'partilhar-greeting', titulo:'Acesso PIN' },
        'tela-grafico-traj':  { el:'gtraj-greeting',     titulo:'Gráfico' },
        'tela-linhatempo':    { el:'ldt-greeting',       titulo:'Linha do Tempo' },
    };
    const _tt = _TELA_TITULOS[id];
    if (_tt) { const el = document.getElementById(_tt.el); if (el) el.textContent = _tt.titulo; }
    if (id === 'tela-ajustes') iniciarCfgTela();
    if (id === 'tela-documentos') renderDocumentos();
}

function _fecharRede() {
    const el = document.getElementById('tela-rede-legado');
    if (el) {
        el.classList.remove('ativa');
        el.style.display = 'none';
    }
}
function abrirPilar(p) {
    fecharNivel();
    _fecharRede();
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('subtela-' + p).classList.add('ativa');
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
let _agVista = 2; // 0=Dia 1=Semana 2=Mês 3=Ano

const AG_MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const AG_DIAS_ABREV = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

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
    const dia = r.getDay(); // 0=Dom, 1=Seg...
    const diff = dia === 0 ? -6 : 1 - dia; // ajusta para segunda
    r.setDate(r.getDate() + diff);
    return r;
}

let _agVistaAtual = 'mes'; // 'mes' | 'dia'

function renderAgenda() {
    agFecharAdd();
    agFecharDetalhe();
    _agVistaAtual = 'mes';
    _agRenderCalendario();
}

function agNavBack() {
    if (_agVistaAtual === 'dia') agVoltarMes();
    else voltar();
}

function agVoltarMes() {
    _agVistaAtual = 'mes';
    const el = document.getElementById('ag-compromissos');
    if (el) el.style.animation = 'none';
    _agRenderCalendario();
    // restaura animação de entrada do mês
    const wrap = el && el.querySelector('.agcal-wrap');
    if (wrap) { wrap.style.animation = 'none'; wrap.offsetWidth; wrap.style.animation = 'agSlideInLeft .22s ease'; }
}

function _agNavDia(delta) {
    const d = new Date(_agData);
    d.setDate(d.getDate() + delta);
    _agData = d;
    _agRenderCompromissos();
}

function _agNavSemana(delta) {
    const d = new Date(_agData);
    d.setDate(d.getDate() + delta * 7);
    _agData = d;
    _agRenderSemana();
}

function _agVerDia(data) {
    _agData = data;
    _agRenderCompromissos();
}

function selecionarAgendaTab(idx) {
    if (idx === 3) { mostrarToast('Em breve disponível!'); return; }
    const cores = ['#72C8EC', '#3D9EC9', '#1F7BAA', '#1a3a5c'];
    _agVista = idx;
    const slider = document.getElementById('ag-nivel-slider');
    if (slider) {
        slider.style.transform = `translateX(${idx * 100}%)`;
        slider.style.background = cores[idx];
    }
    document.querySelectorAll('#ag-filtro-tabs .pp-nivel-tab').forEach((t, i) =>
        t.classList.toggle('pp-nivel-tab-at', i === idx)
    );
    const vistas = ['dia', 'semana', 'mes', 'ano'];
    const telaAg = document.getElementById('tela-agenda');
    if (telaAg) telaAg.setAttribute('data-vista', vistas[idx] || 'dia');
    if (idx === 0) _agRenderCompromissos();
    if (idx === 1) _agRenderSemanaVista();
    if (idx === 2) _agRenderMes();
}

function _agRenderSemanaVista() {
    const el = document.getElementById('ag-compromissos');
    if (!el) return;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const agenda = la.agenda || {};
    const hoje = new Date();
    const inicio = _agSemanaInicio(_agData);
    const diasNome = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const mesesAbr = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const cores = ['#72C8EC','#5AB8E2','#42A9D8','#3D9EC9','#2D8AB5','#1F7BAA','#165F8C'];
    const html = [];
    for (let i = 0; i < 7; i++) {
        const data = new Date(inicio);
        data.setDate(data.getDate() + i);
        const chave = _agChave(data);
        const tarefas = (agenda[chave] || []).slice().sort((a,b) => a.hora.localeCompare(b.hora));
        const diaSem = data.getDay();
        const ehHoje = data.toDateString() === hoje.toDateString();
        const cor = ehHoje ? '#3D9EC9' : cores[diaSem];
        const d = String(data.getDate()).padStart(2,'0');
        const ano = data.getFullYear();
        const mes = data.getMonth();
        const corpo = tarefas.length === 0
            ? `<span class="agse-livre">Livre</span>`
            : tarefas.map((t, idx) => {
                const cat = _agCat(t.cor || 'saude');
                const hora = t.fim ? `${t.hora}–${t.fim}` : t.hora;
                return `<div class="agse-ev" onclick="event.stopPropagation();agAbrirDetalhe('${chave}',${idx})">
                    <i data-lucide="${cat.icon}" style="width:12px;height:12px;stroke:#3D9EC9;stroke-width:2;flex-shrink:0"></i>
                    <span class="agse-ev-nome">${t.texto}</span>
                    <span class="agse-ev-hora">${hora}</span>
                </div>`;
            }).join('');
        html.push(`<div class="agse-item${ehHoje ? ' agse-hoje' : ''}" onclick="_agData=new Date(${ano},${mes},${parseInt(d)});selecionarAgendaTab(0)">
            <div class="agse-time">${diasNome[diaSem]}</div>
            <div class="agse-node" style="background:${cor}">
                <span class="agse-num">${d}</span>
                <span class="agse-mes">${mesesAbr[mes]}</span>
            </div>
            <div class="agse-body">
                <div class="agse-card">${corpo}</div>
            </div>
            <button class="agse-add-btn" onclick="event.stopPropagation();_agData=new Date(${ano},${mes},${parseInt(d)});agAbrirAdd('')">
                <i data-lucide="plus"></i>
            </button>
        </div>`);
    }
    el.innerHTML = `<div class="agse-wrap"><div class="agse-spine"></div>${html.join('')}</div>`;
    lucide.createIcons();
}

function _agRenderMes() {
    const el = document.getElementById('ag-compromissos');
    if (!el) return;
    const la     = JSON.parse(localStorage.getItem('la') || '{}');
    const agenda = la.agenda || {};
    const hoje   = new Date();
    const ano    = _agData.getFullYear();
    const mes    = _agData.getMonth();
    const total  = new Date(ano, mes + 1, 0).getDate();

    const diasNome = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const mesesAbr = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const cores    = ['#72C8EC','#5AB8E2','#42A9D8','#3D9EC9','#2D8AB5','#1F7BAA','#165F8C'];

    const html = [];
    for (let d = 1; d <= total; d++) {
        const data    = new Date(ano, mes, d);
        const chave   = _agChave(data);
        const tarefas = (agenda[chave] || []).slice().sort((a,b) => a.hora.localeCompare(b.hora));
        const diaSem  = data.getDay();
        const ehHoje  = data.toDateString() === hoje.toDateString();
        const cor     = ehHoje ? '#3D9EC9' : cores[diaSem];

        const corpo = tarefas.length === 0
            ? `<span class="agse-livre">Livre</span>`
            : tarefas.map((t, idx) => {
                const cat  = _agCat(t.cor || 'saude');
                const hora = t.fim ? `${t.hora}–${t.fim}` : t.hora;
                return `<div class="agse-ev" onclick="event.stopPropagation();agAbrirDetalhe('${chave}',${idx})">
                    <i data-lucide="${cat.icon}" style="width:12px;height:12px;stroke:#3D9EC9;stroke-width:2;flex-shrink:0"></i>
                    <span class="agse-ev-nome">${t.texto}</span>
                    <span class="agse-ev-hora">${hora}</span>
                </div>`;
            }).join('');

        html.push(`<div class="agse-item${ehHoje ? ' agse-hoje' : ''}" onclick="_agData=new Date(${ano},${mes},${d});selecionarAgendaTab(0)">
            <div class="agse-time">${diasNome[diaSem]}</div>
            <div class="agse-node" style="background:${cor}">
                <span class="agse-num">${String(d).padStart(2,'0')}</span>
                <span class="agse-mes">${mesesAbr[mes]}</span>
            </div>
            <div class="agse-body">
                <div class="agse-card">${corpo}</div>
            </div>
            <button class="agse-add-btn" onclick="event.stopPropagation();_agData=new Date(${ano},${mes},${d});agAbrirAdd('')">
                <i data-lucide="plus"></i>
            </button>
        </div>`);
    }

    el.innerHTML = `<div class="agse-wrap"><div class="agse-spine"></div>${html.join('')}</div>`;
    lucide.createIcons();
    setTimeout(() => {
        const scroll   = document.querySelector('.ag-new-scroll');
        const hojeItem = el.querySelector('.agse-hoje');
        if (scroll && hojeItem) scroll.scrollTop = Math.max(0, hojeItem.offsetTop - 40);
    }, 80);
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
        html += `<div class="${cls}" onclick="agSelecionarDia(${d.getFullYear()},${d.getMonth()},${d.getDate()})"><span class="ag-week-day-label">${AG_DIAS_ABREV[i]}</span><div class="ag-week-day-num">${d.getDate()}</div>${dot}</div>`;
    }
    el.innerHTML = html;
}

/* ── Rotina hipotética para demonstração do "Hoje" ── */
const _AG_HOJE_MOCK = [
    { hora:'06:00', fim:'06:30', texto:'Acordar',           icon:'sunrise',        cor:'#72C8EC' },
    { hora:'06:30', fim:'07:00', texto:'Café da Manhã',     icon:'coffee',         cor:'#5AB8E2' },
    { hora:'07:00', fim:'07:30', texto:'Banho e se Arrumar',icon:'droplets',       cor:'#42A9D8' },
    { hora:'07:30', fim:'08:00', texto:'Ir para a Creche',  icon:'car',            cor:'#3D9EC9' },
    { hora:'08:00', fim:'17:00', texto:'Creche',            icon:'school',         cor:'#2D8AB5' },
    { hora:'17:30', fim:'18:00', texto:'Lanche em Casa',    icon:'apple',          cor:'#1F7BAA' },
    { hora:'18:00', fim:'20:00', texto:'Estudo e Lazer',    icon:'book-open',      cor:'#3D9EC9' },
    { hora:'20:30', fim:'21:30', texto:'Dormir',            icon:'moon',           cor:'#1a3a5c' },
];

function _agRenderHojeTimeline(eventos) {
    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;
    const dataDia   = `${String(agora.getDate()).padStart(2,'0')}/${String(agora.getMonth()+1).padStart(2,'0')}`;
    const AZUL_ATIVO = '#3D9EC9';
    const AZUL_PAST  = '#a8cce8';
    let agoraMostrado = false;

    let html = `<div class="aght-wrap"><div class="aght-spine"></div>`;

    /* Círculo de data no topo */
    html += `<div class="aght-item">
        <span class="aght-time"></span>
        <div class="aght-node aght-node-data" style="background:${AZUL_ATIVO}">
            <span class="aght-data-txt">${dataDia}</span>
        </div>
        <span class="aght-data-label">Hoje</span>
    </div>`;

    eventos.forEach(ev => {
        if (!agoraMostrado && horaAtual < ev.hora) {
            agoraMostrado = true;
            html += `<div class="aght-item aght-agora-row">
                <span class="aght-time aght-agora-time">${horaAtual}</span>
                <div class="aght-agora-dot"></div>
                <span class="aght-agora-label">Agora</span>
            </div>`;
        }
        const isPast = horaAtual > (ev.fim || ev.hora);
        let dur = ev.hora;
        if (ev.fim) {
            const [sh, sm] = ev.hora.split(':').map(Number);
            const [eh, em] = ev.fim.split(':').map(Number);
            const mins = (eh * 60 + em) - (sh * 60 + sm);
            dur = `${ev.hora} – ${ev.fim} · ${mins} min`;
        }
        html += `<div class="aght-item${isPast ? ' aght-past' : ''}">
            <span class="aght-time">${ev.hora}</span>
            <div class="aght-node" style="background:${isPast ? AZUL_PAST : AZUL_ATIVO}">
                <i data-lucide="${ev.icon}" style="width:18px;height:18px;stroke:white;stroke-width:2"></i>
            </div>
            <div class="aght-card">
                <div class="aght-ev-nome">${ev.texto}</div>
                <div class="aght-ev-dur">${dur}</div>
            </div>
        </div>`;
    });

    if (!agoraMostrado) {
        html += `<div class="aght-item aght-agora-row">
            <span class="aght-time aght-agora-time">${horaAtual}</span>
            <div class="aght-agora-dot"></div>
            <span class="aght-agora-label">Agora</span>
        </div>`;
    }
    html += `</div>`;
    return html;
}

function _agRenderCompromissos() {
    const el = document.getElementById('ag-compromissos');
    if (!el) return;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const chave = _agChave(_agData);
    const tarefas = ((la.agenda || {})[chave] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));

    const diasNome  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const mesesNome = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const ehHoje    = _agData.toDateString() === new Date().toDateString();
    const dataLabel = ehHoje
        ? `Hoje · ${diasNome[_agData.getDay()]}, ${_agData.getDate()} ${mesesNome[_agData.getMonth()]}`
        : `${diasNome[_agData.getDay()]}, ${_agData.getDate()} ${mesesNome[_agData.getMonth()]} ${_agData.getFullYear()}`;

    const corBanda = { amarelo:'#C8A020', verde:'#3A9A6A', vermelho:'#C84040', roxo:'#7855C8', azul:'#3D9EC9' };
    const catLabel = { amarelo:'Saúde', verde:'Educação', vermelho:'Família', roxo:'Terapia', azul:'Esporte' };

    let html = `<div class="ag-date-nav">
        <button class="ag-date-btn" onclick="_agRenderSemana()">
            <i data-lucide="chevron-left" style="width:22px;height:22px;stroke:rgba(26,58,92,.6);stroke-width:2.5"></i>
        </button>
        <span class="ag-date-label">${dataLabel}</span>
        <button class="ag-date-btn" onclick="_agNavDia(1)">
            <i data-lucide="chevron-right" style="width:22px;height:22px;stroke:rgba(26,58,92,.6);stroke-width:2.5"></i>
        </button>
    </div>`;

    if (tarefas.length === 0) {
        html += `<div class="ag-compromisso-vazio">
            <i data-lucide="calendar-check" style="width:44px;height:44px;stroke:rgba(26,58,92,.18);stroke-width:1.2"></i>
            <p class="ag-vazio-txt">Nenhum compromisso para este dia</p>
        </div>`;
        el.innerHTML = html;
        lucide.createIcons();
        return;
    }

    html += tarefas.map((t, idx) => {
        const cat   = _agCat(t.cor || 'saude');
        const banda = corBanda[cat.cls] || '#3D9EC9';
        const label = catLabel[cat.cls] || cat.cls;
        const hora  = t.fim ? `${t.hora} — ${t.fim}` : t.hora;
        const nota  = t.detalhe ? ` · ${t.detalhe.slice(0, 28)}` : '';
        const [hh, mm] = (t.hora || '00:00').split(':');
        return `<div class="ag-banner-wrap" onclick="agAbrirDetalhe('${chave}',${idx})">
            <span class="ag-banner-num">${+hh}</span>
            <div class="ag-banner-card">
                <div class="ag-banner-left" style="background:${banda}">
                    <span class="ag-banner-hora-m">:${mm}</span>
                    <span class="ag-banner-cat-txt">${label}</span>
                </div>
                <div class="ag-banner-body">
                    <div class="ag-banner-titulo">${t.texto}</div>
                    <div class="ag-banner-sub">${hora}${nota}</div>
                </div>
                <div class="ag-banner-ico">
                    <i data-lucide="${cat.icon}" style="width:28px;height:28px;stroke:${banda};stroke-width:1.8"></i>
                </div>
            </div>
        </div>`;
    }).join('');

    el.innerHTML = html;
    lucide.createIcons();
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
    d.setDate(1);
    d.setMonth(d.getMonth() + dir);
    _agData = d;
    renderAgenda();
}

let _agNumSemanas = 4;
let _agDiasSel = new Set();

function agAbrirAdd(hora = '') {
    const DIAS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const d = _agData;
    const txt = `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
    const dataTxt = document.getElementById('ag-data-txt');
    if (dataTxt) dataTxt.textContent = txt;
    document.getElementById('ag-inp-hora').value = hora;
    document.getElementById('ag-inp-hora-fim').value = '';
    document.getElementById('ag-inp-nome').value = '';
    const chk = document.getElementById('ag-chk-recorr');
    if (chk) { chk.checked = false; agToggleRecorr(false); }
    document.getElementById('ag-sem-num').textContent = _agNumSemanas;
    document.getElementById('ag-add-sheet').classList.add('ab');
    document.getElementById('ag-backdrop').classList.add('ab');
    lucide.createIcons();
}
function agFecharAdd() {
    document.getElementById('ag-add-sheet').classList.remove('ab');
    document.getElementById('ag-backdrop').classList.remove('ab');
}
function agToggleRecorr(on) {
    const row = document.getElementById('ag-semanas-row');
    row.style.display = on ? 'flex' : 'none';
    if (on) {
        // pré-seleciona o dia da semana atual (0=Seg … 6=Dom, segunda-first)
        const jsDay = _agData.getDay(); // 0=Dom,1=Seg…6=Sab
        const idx = (jsDay + 6) % 7;   // converte para Seg=0…Dom=6
        _agDiasSel = new Set([idx]);
        _agRenderDiasBtns();
    }
}
function _agRenderDiasBtns() {
    document.querySelectorAll('.ag-dia-btn').forEach(btn => {
        const idx = parseInt(btn.dataset.idx);
        btn.classList.toggle('ag-dia-sel', _agDiasSel.has(idx));
    });
}
function agToggleDia(idx) {
    if (_agDiasSel.has(idx)) {
        if (_agDiasSel.size > 1) _agDiasSel.delete(idx); // pelo menos 1 dia
    } else {
        _agDiasSel.add(idx);
    }
    _agRenderDiasBtns();
}
function agAlterarSemanas(delta) {
    _agNumSemanas = Math.max(1, Math.min(52, _agNumSemanas + delta));
    document.getElementById('ag-sem-num').textContent = _agNumSemanas;
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
    const hora    = document.getElementById('ag-inp-hora').value;
    const horFim  = document.getElementById('ag-inp-hora-fim').value;
    const nomeRaw = document.getElementById('ag-inp-nome').value.trim();
    const reHora  = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!hora || !reHora.test(hora)) { alert('Preencha o horário de início (ex: 09:00).'); return; }
    if (horFim && !reHora.test(horFim)) { alert('Horário de fim inválido (ex: 17:00).'); return; }
    const texto  = nomeRaw || _agCat(_agCorSel).label;
    const recorr = document.getElementById('ag-chk-recorr')?.checked;
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.agenda) la.agenda = {};

    if (recorr && _agDiasSel.size > 0) {
        // Encontra a segunda-feira da semana do dia selecionado
        const jsDay = _agData.getDay(); // 0=Dom
        const diffToMon = (jsDay === 0) ? -6 : 1 - jsDay;
        const segunda = new Date(_agData);
        segunda.setDate(segunda.getDate() + diffToMon);
        // Para cada semana e cada dia selecionado (0=Seg…6=Dom)
        for (let s = 0; s < _agNumSemanas; s++) {
            _agDiasSel.forEach(idx => {
                const dataEntry = new Date(segunda);
                dataEntry.setDate(dataEntry.getDate() + s * 7 + idx);
                const key = _agChave(dataEntry);
                if (!la.agenda[key]) la.agenda[key] = [];
                const entry = { hora, texto, cor: _agCorSel };
                if (horFim) entry.fim = horFim;
                la.agenda[key].push(entry);
            });
        }
    } else {
        const key = _agChave(_agData);
        if (!la.agenda[key]) la.agenda[key] = [];
        const entry = { hora, texto, cor: _agCorSel };
        if (horFim) entry.fim = horFim;
        la.agenda[key].push(entry);
    }

    localStorage.setItem('la', JSON.stringify(la));
    document.getElementById('ag-inp-hora').value = '';
    document.getElementById('ag-inp-hora-fim').value = '';
    document.getElementById('ag-inp-nome').value = '';
    agFecharAdd();
    if (_agVistaAtual === 'dia') _agRenderDiaDetalhe();
    else renderAgenda();
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

/* ═══════════════ CALENDÁRIO MENSAL (estilo referência) ═══════════════ */
function _agRenderCalendario() {
    const el = document.getElementById('ag-compromissos');
    if (!el) return;

    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const agenda = la.agenda || {};
    const hoje = new Date();
    const ano = _agData.getFullYear();
    const mes = _agData.getMonth();

    const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const DIAS_LABEL = ['S','T','Q','Q','S','S','D'];
    const CLS_PILL = { amarelo:'agcal-epill-amarelo', verde:'agcal-epill-verde', vermelho:'agcal-epill-vermelho', roxo:'agcal-epill-roxo', azul:'agcal-epill-azul' };

    function pillsHtml(chave) {
        const ts = (agenda[chave] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));
        if (!ts.length) return '';
        const MAX = 2;
        let h = '';
        ts.slice(0, MAX).forEach(t => {
            const cat = _agCat(t.cor || 'saude');
            const cls = CLS_PILL[cat.cls] || 'agcal-epill-azul';
            const nome = t.texto.length > 9 ? t.texto.slice(0, 8) + '…' : t.texto;
            h += `<span class="agcal-epill ${cls}">${nome}</span>`;
        });
        if (ts.length > MAX) h += `<span class="agcal-epill agcal-epill-mais">+${ts.length - MAX}</span>`;
        return h;
    }

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const offset = primeiroDia === 0 ? 6 : primeiroDia - 1;
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const totalAnterior = new Date(ano, mes, 0).getDate();
    const cells = [];

    for (let i = offset - 1; i >= 0; i--) {
        const d = totalAnterior - i;
        const data = new Date(ano, mes - 1, d);
        const chave = _agChave(data);
        cells.push(`<div class="agcal-cell outro-mes" data-chave="${chave}" onclick="agcalVerDia(${data.getFullYear()},${data.getMonth()},${d})"><span class="agcal-cell-num">${d}</span>${pillsHtml(chave)}</div>`);
    }

    for (let d = 1; d <= totalDias; d++) {
        const data = new Date(ano, mes, d);
        const chave = _agChave(data);
        const ehHoje = data.toDateString() === hoje.toDateString();
        cells.push(`<div class="agcal-cell${ehHoje ? ' hoje' : ''}" data-chave="${chave}" onclick="agcalVerDia(${ano},${mes},${d})"><span class="agcal-cell-num">${d}</span>${pillsHtml(chave)}</div>`);
    }

    const resto = cells.length % 7;
    if (resto > 0) {
        for (let d = 1; d <= 7 - resto; d++) {
            const data = new Date(ano, mes + 1, d);
            const chave = _agChave(data);
            cells.push(`<div class="agcal-cell outro-mes" data-chave="${chave}" onclick="agcalVerDia(${data.getFullYear()},${data.getMonth()},${d})"><span class="agcal-cell-num">${d}</span>${pillsHtml(chave)}</div>`);
        }
    }

    const semanas = [];
    for (let i = 0; i < cells.length; i += 7) {
        semanas.push(`<div class="agcal-week-row">${cells.slice(i, i + 7).join('')}</div>`);
    }

    el.innerHTML = `<div class="agcal-wrap">
        <div class="agcal-mes-nav-bar">
            <button class="agcal-nav-btn" onclick="event.stopPropagation();agCalNavMes(-1)">&#9664;</button>
            <span class="agcal-mes-titulo">${MESES[mes]}, ${ano}</span>
            <button class="agcal-nav-btn" onclick="event.stopPropagation();agCalNavMes(1)">&#9654;</button>
        </div>
        <div class="agcal-grid-wrap">
            <div class="agcal-dia-labels">${DIAS_LABEL.map(l => `<span>${l}</span>`).join('')}</div>
            ${semanas.join('')}
        </div>
    </div>`;
}

function agCalNavMes(dir) {
    _agData = new Date(_agData.getFullYear(), _agData.getMonth() + dir, 1);
    _agRenderCalendario();
}

function agcalVerDia(ano, mes, dia) {
    _agData = new Date(ano, mes, dia);
    _agVistaAtual = 'dia';
    _agRenderDiaDetalhe();
}

function _agRenderDiaDetalhe() {
    const el = document.getElementById('ag-compromissos');
    if (!el) return;
    const d = _agData;
    const ano = d.getFullYear(), mes = d.getMonth(), dia = d.getDate();
    const chave = _agChave(d);

    const DIAS_FULL = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const MESES_FULL = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const COR_MAP = { amarelo:'#C8A020', verde:'#3A9A6A', vermelho:'#C84040', roxo:'#7855C8', azul:'#3D9EC9' };

    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const tarefas = ((la.agenda || {})[chave] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));

    const eventosHtml = tarefas.length === 0
        ? `<div class="agdia-vazio">
               <i data-lucide="calendar-x" style="width:36px;height:36px;stroke:rgba(30,58,71,.2);stroke-width:1.4"></i>
               <p>Nenhuma atividade neste dia</p>
           </div>`
        : tarefas.map((t, idx) => {
            const cat = _agCat(t.cor || 'saude');
            const cor = COR_MAP[cat.cls] || '#3D9EC9';
            const horaFim = t.fim ? `<span class="agdia-fim">${t.fim}</span>` : '';
            return `<div class="agdia-item">
                <div class="agdia-hora-col">
                    <span class="agdia-hora">${t.hora}</span>
                    ${horaFim}
                </div>
                <div class="agdia-cor-bar" style="background:${cor}"></div>
                <div class="agdia-info">
                    <span class="agdia-nome">${t.texto}</span>
                    <span class="agdia-cat">${cat.label}</span>
                </div>
                <button class="agdia-del" onclick="_agcalDeletar('${chave}',${idx},${ano},${mes},${dia})">
                    <i data-lucide="trash-2" style="width:14px;height:14px;stroke:#C84040;stroke-width:2"></i>
                </button>
            </div>`;
        }).join('');

    el.innerHTML = `<div class="agdia-wrap">
        <div class="agdia-cabecalho">
            <span class="agdia-diaSem">${DIAS_FULL[d.getDay()]}</span>
            <span class="agdia-numDia">${dia}</span>
            <span class="agdia-mesAno">${MESES_FULL[mes]} · ${ano}</span>
        </div>
        <div class="agdia-lista">${eventosHtml}</div>
    </div>`;

    lucide.createIcons();
}

function agcalFecharDia() {
    document.querySelectorAll('.agcal-expand-row').forEach(r => r.remove());
    document.querySelectorAll('.agcal-cell.selecionado').forEach(c => c.classList.remove('selecionado'));
}

function _agcalDeletar(chave, idx, ano, mes, dia) {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (la.agenda?.[chave]) {
        la.agenda[chave].splice(idx, 1);
        if (!la.agenda[chave].length) delete la.agenda[chave];
        localStorage.setItem('la', JSON.stringify(la));
    }
    // se estiver na vista dia, apenas re-renderiza o detalhe
    if (_agVistaAtual === 'dia') {
        _agRenderDiaDetalhe();
    } else {
        _agRenderCalendario();
    }
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

function voltarDePlanos() { ir('tela-impacto'); }

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
    [['pn-badge-1',totalN1],['pn-badge-2',n2],['pn-badge-3',n3],['pn-badge-es',totalEs]].forEach(([id,n])=>{const b=document.getElementById(id);if(b) b.textContent=n>0?n:'';});
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
        <div class="pp-card" onclick="${c.fn}">
            <div class="pp-card-ico">
                <i data-lucide="${c.icon}" style="width:18px;height:18px;stroke-width:1.5"></i>
            </div>
            <span class="pp-card-nome">${c.label}</span>
            <div class="pp-card-arrow">
                <i data-lucide="chevron-right" style="width:13px;height:13px;stroke-width:1.5"></i>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

/* ══════════════════════════════════════════
   EDUCAÇÃO — campos selecionáveis
══════════════════════════════════════════ */
const _EDU_SUB_TABS = [
    { id:'basica',    label:'Básica',              icon:'school' },
    { id:'superior',  label:'Superior',            icon:'graduation-cap' },
    { id:'especiais', label:'Modalidades',         icon:'layers' },
    { id:'vida',      label:'Vivências', icon:'leaf' },
];

let _eduSubAtiva = 'basica';

const _EDU_CAMPOS = [
    // Educação Formal — Educação Básica
    { id:'edu-infantil',        nome:'Ensino Infantil',                    grupo:'formal', sub:'basica', icon:'baby' },
    { id:'ens-fundamental',     nome:'Ensino Fundamental',                 grupo:'formal', sub:'basica', icon:'book' },
    { id:'ens-medio',           nome:'Ensino Médio',                       grupo:'formal', sub:'basica', icon:'school' },
    { id:'edu-especial',        nome:'Ensino Especial (AEE)',              grupo:'formal', sub:'basica', icon:'puzzle' },
    { id:'formatura',           nome:'Formatura',                          grupo:'formal', sub:'basica', icon:'star' },
    // Educação Formal — Ensino Superior
    { id:'graduacao',           nome:'Graduação',                          grupo:'formal', sub:'superior', icon:'graduation-cap' },
    { id:'pos-graduacao',       nome:'Pós-graduação / MBA',                grupo:'formal', sub:'superior', icon:'award' },
    { id:'mestrado',            nome:'Mestrado',                           grupo:'formal', sub:'superior', icon:'library' },
    { id:'doutorado',           nome:'Doutorado',                          grupo:'formal', sub:'superior', icon:'microscope' },
    { id:'intercambio',         nome:'Intercâmbio',                        grupo:'formal', sub:'superior', icon:'plane' },
    // Educação Formal — Modalidades Especiais de Ensino
    { id:'eja',                 nome:'EJA — Educação de Jovens e Adultos', grupo:'formal', sub:'especiais', icon:'users' },
    { id:'curso-tecnico',       nome:'Educação Profissional e Tecnológica',grupo:'formal', sub:'especiais', icon:'wrench' },
    { id:'indigena-quilombola', nome:'Educação Indígena e Quilombola',     grupo:'formal', sub:'especiais', icon:'landmark' },
    { id:'edu-campo',           nome:'Educação do Campo',                  grupo:'formal', sub:'especiais', icon:'wheat' },
    { id:'ead',                 nome:'EaD — Educação a Distância',         grupo:'formal', sub:'especiais', icon:'monitor' },
    // Educação Formal — Modalidades — cursos diversos
    { id:'cursos-livres',       nome:'Cursos livres',                      grupo:'formal', sub:'especiais', icon:'bookmark' },
    { id:'musica',              nome:'Música',                             grupo:'formal', sub:'especiais', icon:'music' },
    { id:'teatro',              nome:'Teatro',                             grupo:'formal', sub:'especiais', icon:'drama' },
    { id:'conquistas',          nome:'Conquistas & Prêmios',               grupo:'formal', sub:'especiais', icon:'trophy' },
    // Aprendizado de vida — ordem alfabética
    { id:'mais-velhos',       nome:'Aprendi com os mais velhos',         grupo:'vida', icon:'users' },
    { id:'aprendeu-casa',     nome:'Aprendi em casa com a família',      grupo:'vida', icon:'home' },
    { id:'comunidade',        nome:'Aprendi na comunidade',              grupo:'vida', icon:'map-pin' },
    { id:'trabalhando',       nome:'Aprendi trabalhando',                grupo:'vida', icon:'briefcase' },
    { id:'oficio',            nome:'Aprendi um ofício',                  grupo:'vida', icon:'hammer' },
    { id:'fe',                nome:'Fé e espiritualidade',               grupo:'vida', icon:'sun' },
    { id:'autodidata',        nome:'Me tornei autodidata',               grupo:'vida', icon:'lightbulb' },
    { id:'sabedoria',         nome:'Sabedoria da vida',                  grupo:'vida', icon:'leaf' },
];

const _FAM_CAMPOS = [
    // Memórias
    { id:'infancia',     nome:'Histórias de infância',           icon:'book-open',  sub:'memorias' },
    { id:'memorias',     nome:'Memórias afetivas',               icon:'heart',      sub:'memorias' },
    { id:'carta',        nome:'Carta para o futuro',             icon:'mail',       sub:'memorias' },
    // Raízes
    { id:'arvore',       nome:'Árvore genealógica',              icon:'git-branch', sub:'raizes' },
    { id:'tradicoes',    nome:'Tradições e costumes',            icon:'star',       sub:'raizes' },
    { id:'valores',      nome:'Valores familiares',              icon:'shield',     sub:'raizes' },
    // Convivência
    { id:'dinamica',     nome:'Dinâmica familiar',                icon:'users',      sub:'convivencia' },
    { id:'aniversarios', nome:'Aniversários e datas especiais',  icon:'cake',       sub:'convivencia' },
    { id:'receitas',     nome:'Receitas da família',             icon:'utensils',   sub:'convivencia' },
    // Conquistas
    { id:'conquistas',   nome:'Conquistas em família',           icon:'trophy',     sub:'conquistas' },
    { id:'viagens',      nome:'Viagens em família',               icon:'map-pin',    sub:'conquistas' },
];

const _FAM_SUB_TABS = [
    { id:'memorias',    label:'Memórias' },
    { id:'raizes',       label:'Raízes' },
    { id:'convivencia',  label:'Convivência' },
    { id:'conquistas',   label:'Conquistas' },
];

let _famSubAtiva = 'memorias';

const _SAU_CAMPOS = [
    // Neuro/Desenvolvimento
    { id:'neurologista',      nome:'Neurologista',      icon:'zap',      sub:'neuro' },
    { id:'neuropediatra',     nome:'Neuropediatra',     icon:'brain',    sub:'neuro' },
    { id:'neuropsicologo',    nome:'Neuropsicólogo',    icon:'puzzle',   sub:'neuro' },
    { id:'psiquiatra',        nome:'Psiquiatra',        icon:'pill',     sub:'neuro' },
    // Cuidados Gerais
    { id:'assistente_social', nome:'Assistente Social', icon:'users',    sub:'geral' },
    { id:'pediatra',          nome:'Pediatra',          icon:'baby',     sub:'geral' },
    // Saúde Física
    { id:'cardiologista',     nome:'Cardiologista',     icon:'activity', sub:'fisica' },
    { id:'dentista',          nome:'Dentista',          icon:'smile',    sub:'fisica' },
    { id:'oftalmologista',    nome:'Oftalmologista',    icon:'eye',      sub:'fisica' },
];

const _SAU_SUB_TABS = [
    { id:'neuro',  label:'Neuro' },
    { id:'geral',  label:'Geral' },
    { id:'fisica', label:'Física' },
];

let _sauSubAtiva = 'neuro';

const _TER_CAMPOS = [
    { id:'fono',       nome:'Fonoaudiologia',        icon:'speech',          grupo:'autonomia' },
    { id:'neuropeda',  nome:'Neuropsicopedagogia',    icon:'brain',           grupo:'autonomia' },
    { id:'nutricao',   nome:'Nutrição',               icon:'apple',           grupo:'autonomia' },
    { id:'psico',      nome:'Psicologia',             icon:'heart',           grupo:'autonomia' },
    { id:'psicopeda',  nome:'Psicopedagogia',         icon:'book-open',       grupo:'autonomia' },
    { id:'to',         nome:'Terapia Ocupacional',    icon:'grab',            grupo:'autonomia' },
    { id:'aba',        nome:'ABA — Análise do Comportamento',  icon:'bar-chart-2', grupo:'comportamental' },
    { id:'act_dbt',    nome:'ACT e DBT',               icon:'layers',          grupo:'comportamental' },
    { id:'tcc',        nome:'TCC — Cognitivo-Comportamental', icon:'zap',      grupo:'comportamental' },
    { id:'equo',       nome:'Equoterapia',             icon:'activity',        grupo:'motora' },
    { id:'fisio',      nome:'Fisioterapia',            icon:'person-standing', grupo:'motora' },
    { id:'musico',     nome:'Musicoterapia',           icon:'music',           grupo:'motora' },
    { id:'psicomotri', nome:'Psicomotricidade',        icon:'move',            grupo:'motora' },
];

const _TER_SUB_TABS = [
    { id:'autonomia',      label:'Desenvolvimento' },
    { id:'comportamental', label:'Comportamento' },
    { id:'motora',         label:'Motora' },
];

let _terSubAtiva = 'autonomia';

const _EU_CAMPOS = [
    { id:'identificacao', nome:'Identificação',     icon:'user' },
    { id:'diagnostico',   nome:'Diagnóstico',        icon:'file-heart' },
    { id:'nos',           nome:'Nós',                icon:'users' },
    { id:'plano-saude',   nome:'Plano de Saúde',     icon:'shield-check' },
    { id:'sobre',         nome:'Quem é essa pessoa', icon:'sparkles' },
];

const _EU_CAMPO_FORMS = {
    'identificacao': '_abrirFormEuIdentificacao',
    'diagnostico':   '_abrirFormEuDiagnostico',
    'nos':           '_abrirTelaNos',
    'plano-saude':   '_abrirFormEuPlanoSaude',
    'sobre':         '_abrirFormEuSobre',
};

const _EU_BUNDLE = ['identificacao', 'diagnostico', 'plano-saude', 'sobre'];

function _euSelItemsHtml() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d.eu_campos || [];
    const euAtivo  = _EU_BUNDLE.some(id => sel.includes(id));
    const nosAtivo = sel.includes('nos');
    return `<div class="edu-toggle-item${euAtivo ? ' sel' : ''}" onclick="_euSelToggleEu(this)">
        <i data-lucide="user" class="edu-toggle-bg-icon" style="stroke:#3A7A9C"></i>
        <span class="edu-toggle-nome">Eu</span>
    </div>
    <div class="edu-toggle-item${nosAtivo ? ' sel' : ''}" onclick="_euSelToggleNos(this)">
        <i data-lucide="users" class="edu-toggle-bg-icon" style="stroke:#3A7A9C"></i>
        <span class="edu-toggle-nome">Nós</span>
    </div>`;
}

function _euSelToggleEu(btn) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    let sel = d.eu_campos || [];
    const ativo = _EU_BUNDLE.some(id => sel.includes(id));
    sel = ativo ? sel.filter(id => !_EU_BUNDLE.includes(id)) : [...new Set([...sel, ..._EU_BUNDLE])];
    d.eu_campos = sel;
    localStorage.setItem('la', JSON.stringify(d));
    btn.classList.toggle('sel');
}

function _euSelToggleNos(btn) {
    togglePilarCampo('eu', 'nos');
    btn.classList.toggle('sel');
}

const _PILAR_CAMPOS_MAP = {
    educacao: _EDU_CAMPOS,
    familia:  _FAM_CAMPOS,
    saude:    _SAU_CAMPOS,
    terapia:  _TER_CAMPOS,
    eu:       _EU_CAMPOS,
};

function _hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
}

function togglePilarCampo(pilar, id) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const key = pilar + '_campos';
    const sel = d[key] || [];
    const idx = sel.indexOf(id);
    const on = idx === -1;
    if (on && idx === -1) sel.push(id);
    if (!on && idx !== -1) sel.splice(idx, 1);
    d[key] = sel;
    localStorage.setItem('la', JSON.stringify(d));
}

function _renderPilarToggleHtml(pilar, camposArr, cor) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d[pilar + '_campos'] || [];
    return camposArr.map(c => {
        const on = sel.includes(c.id);
        return `<div class="edu-toggle-item">
            <i data-lucide="${c.icon}" class="edu-toggle-bg-icon" style="stroke:${cor}"></i>
            <span class="edu-toggle-nome">${c.nome}</span>
            <label class="fe-toggle-sw pil-sw-${pilar}" style="cursor:pointer">
                <input type="checkbox" ${on ? 'checked' : ''} onchange="togglePilarCampo('${pilar}','${c.id}',this)">
                <span class="fe-toggle-track"></span>
            </label>
        </div>`;
    }).join('');
}

function _renderPilarCardsHtml(pilar, cor) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const camposArr = _PILAR_CAMPOS_MAP[pilar] || [];
    const habilitados = d[pilar + '_campos'] || [];
    if (habilitados.length === 0) {
        return `<div class="pil-empty-state">
            <i data-lucide="plus-circle" style="width:44px;height:44px;stroke:rgba(26,58,92,.22);stroke-width:1.4;fill:none"></i>
            <p>Toque em <strong>+</strong> para<br>selecionar os campos</p>
        </div>`;
    }
    return `<div class="pil-cards-grid">${habilitados.map(id => {
        const campo = camposArr.find(c => c.id === id);
        if (!campo) return '';
        const registros = ((d[pilar] || {})[id]) || [];
        const count = registros.length;
        const ultimo = registros[registros.length - 1];
        const dataStr = ultimo ? _dataRelativa(ultimo.data) : 'Nenhum registro';
        const sub = count > 0 ? `${count} registro${count > 1 ? 's' : ''} · ${dataStr}` : dataStr;
        return `<div class="pil-card" onclick="_abrirFormPilar('${pilar}','${id}')">
            <div class="pil-card-ico" style="background:${_hexToRgba(cor,.12)}">
                <i data-lucide="${campo.icon}" style="width:22px;height:22px;stroke:${cor};stroke-width:1.7;fill:none"></i>
            </div>
            <div class="pil-card-info">
                <div class="pil-card-nome">${campo.nome}</div>
                <div class="pil-card-sub">${sub}</div>
            </div>
            <i data-lucide="chevron-right" style="width:18px;height:18px;stroke:rgba(26,58,92,.28);stroke-width:2;fill:none;flex-shrink:0"></i>
        </div>`;
    }).join('')}</div>`;
}

function _toggleItemHtml(pilar, c, cor) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d[pilar + '_campos'] || [];
    const on = sel.includes(c.id);
    return `<div class="edu-toggle-item${on ? ' sel' : ''}" onclick="this.classList.toggle('sel'); togglePilarCampo('${pilar}','${c.id}')">
        <i data-lucide="${c.icon}" class="edu-toggle-bg-icon" style="stroke:${cor}"></i>
        <span class="edu-toggle-nome">${c.nome}</span>
    </div>`;
}

function _eduFormalBarHtml() {
    return _EDU_SUB_TABS.map(t => {
        const ativo = t.id === _eduSubAtiva;
        return `<button class="ter-form-tab${ativo ? ' ativa' : ''}" onclick="_eduSelecionarSub('${t.id}')">${t.label}</button>`;
    }).join('');
}

function _eduFormalItemsHtml() {
    const campos = _eduSubAtiva === 'vida'
        ? _EDU_CAMPOS.filter(c => c.grupo === 'vida')
        : _EDU_CAMPOS.filter(c => c.grupo === 'formal' && c.sub === _eduSubAtiva);
    campos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return campos.map(c => _toggleItemHtml('educacao', c, '#3A7A9C')).join('');
}

function _eduSelecionarSub(sub) {
    _eduSubAtiva = sub;
    document.getElementById('edu-formal-sub-bar').innerHTML = _eduFormalBarHtml();
    document.getElementById('edu-formal-sub-items').innerHTML = _eduFormalItemsHtml();
    lucide.createIcons();
}

function _terFormalBarHtml() {
    return _TER_SUB_TABS.map(t => {
        const ativo = t.id === _terSubAtiva;
        return `<button class="ter-form-tab${ativo ? ' ativa' : ''}" onclick="_terSelecionarSub('${t.id}')">${t.label}</button>`;
    }).join('');
}

function _terFormalItemsHtml() {
    return _TER_CAMPOS.filter(c => c.grupo === _terSubAtiva)
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(c => _toggleItemHtml('terapia', c, '#3A7A9C')).join('');
}

function _terSelecionarSub(sub) {
    _terSubAtiva = sub;
    document.getElementById('ter-formal-sub-bar').innerHTML = _terFormalBarHtml();
    document.getElementById('ter-formal-sub-items').innerHTML = _terFormalItemsHtml();
    lucide.createIcons();
}

function _famFormalBarHtml() {
    return _FAM_SUB_TABS.map(t => {
        const ativo = t.id === _famSubAtiva;
        return `<button class="ter-form-tab${ativo ? ' ativa' : ''}" onclick="_famSelecionarSub('${t.id}')">${t.label}</button>`;
    }).join('');
}

function _famFormalItemsHtml() {
    return _FAM_CAMPOS.filter(c => c.sub === _famSubAtiva)
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(c => _toggleItemHtml('familia', c, '#3A7A9C')).join('');
}

function _famSelecionarSub(sub) {
    _famSubAtiva = sub;
    document.getElementById('fam-formal-sub-bar').innerHTML = _famFormalBarHtml();
    document.getElementById('fam-formal-sub-items').innerHTML = _famFormalItemsHtml();
    lucide.createIcons();
}

function _sauFormalBarHtml() {
    return _SAU_SUB_TABS.map(t => {
        const ativo = t.id === _sauSubAtiva;
        return `<button class="ter-form-tab${ativo ? ' ativa' : ''}" onclick="_sauSelecionarSub('${t.id}')">${t.label}</button>`;
    }).join('');
}

function _sauFormalItemsHtml() {
    return _SAU_CAMPOS.filter(c => c.sub === _sauSubAtiva)
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(c => _toggleItemHtml('saude', c, '#3A7A9C')).join('');
}

function _sauSelecionarSub(sub) {
    _sauSubAtiva = sub;
    document.getElementById('sau-formal-sub-bar').innerHTML = _sauFormalBarHtml();
    document.getElementById('sau-formal-sub-items').innerHTML = _sauFormalItemsHtml();
    lucide.createIcons();
}

function _abrirSeletorPilar(pilar) {
    const pilarInfo = _PILARES.find(p => p.id === pilar);
    const cor = '#3A7A9C';
    let conteudo;
    let barraExtra = '';
    if (pilar === 'educacao') {
        _eduSubAtiva = 'basica';
        barraExtra = `<div class="ter-form-tabs edu-formal-tabs" id="edu-formal-sub-bar">${_eduFormalBarHtml()}</div>`;
        conteudo = `<div id="edu-formal-sub-items">${_eduFormalItemsHtml()}</div>`;
    } else if (pilar === 'terapia') {
        _terSubAtiva = 'autonomia';
        barraExtra = `<div class="ter-form-tabs edu-formal-tabs" id="ter-formal-sub-bar">${_terFormalBarHtml()}</div>`;
        conteudo = `<div id="ter-formal-sub-items">${_terFormalItemsHtml()}</div>`;
    } else if (pilar === 'familia') {
        _famSubAtiva = 'memorias';
        barraExtra = `<div class="ter-form-tabs edu-formal-tabs" id="fam-formal-sub-bar">${_famFormalBarHtml()}</div>`;
        conteudo = `<div id="fam-formal-sub-items">${_famFormalItemsHtml()}</div>`;
    } else if (pilar === 'saude') {
        _sauSubAtiva = 'neuro';
        barraExtra = `<div class="ter-form-tabs edu-formal-tabs" id="sau-formal-sub-bar">${_sauFormalBarHtml()}</div>`;
        conteudo = `<div id="sau-formal-sub-items">${_sauFormalItemsHtml()}</div>`;
    } else if (pilar === 'eu') {
        conteudo = `<div id="eu-sel-items">${_euSelItemsHtml()}</div>`;
    } else {
        const camposArr = [..._PILAR_CAMPOS_MAP[pilar] || []].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        conteudo = camposArr.map(c => _toggleItemHtml(pilar, c, cor)).join('');
    }
    const overlay = document.getElementById('pil-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <span class="pil-sel-titulo">${pilar === 'eu' ? 'Perfil' : (pilarInfo?.nome || 'Campos')}</span>
            <button class="pp2-nav-btn" onclick="_fecharSeletorPilar('${pilar}')" style="margin-left:auto;margin-right:-8px">
                <i data-lucide="x" style="width:22px;height:22px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        ${barraExtra}
        <div class="pil-sel-body">${conteudo}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharSeletorPilar('${pilar}')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-seletor-overlay').style.display='none';abrirMensagens('${pilar}')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _fecharSeletorPilar(pilar) {
    document.getElementById('pil-seletor-overlay').style.display = 'none';
    irPilar(pilar);
}

function _abrirFormPilar(pilar, campoId) {
    const pilarInfo = _PILARES.find(p => p.id === pilar);
    const camposArr = _PILAR_CAMPOS_MAP[pilar] || [];
    const campo = camposArr.find(c => c.id === campoId);
    if (!campo) return;
    const cor = pilarInfo?.cor || '#1E3A47';
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d[pilar] || {})[campoId]) || [];
    const listaHtml = registros.length > 0
        ? registros.slice().reverse().map(r => `
            <div class="pil-form-entry">
                <div class="pil-form-entry-txt">${r.texto}</div>
                <div class="pil-form-entry-data">${_dataRelativa(r.data)}</div>
            </div>`).join('')
        : `<div class="pil-form-empty">Nenhum registro ainda</div>`;
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('${pilar}')" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.85rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">${pilarInfo?.nome || ''}</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-form-entries">${listaHtml}</div>
        <div class="pil-form-input-area">
            <textarea class="pil-form-ta" id="pil-form-ta" placeholder="Escreva aqui..." rows="3"></textarea>
            <button class="pil-form-save-btn" onclick="_salvarEntradaPilar('${pilar}','${campoId}')">
                <i data-lucide="send" style="width:18px;height:18px;stroke:#fff;stroke-width:2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _fecharFormPilar(pilar) {
    document.getElementById('pil-form-overlay').style.display = 'none';
    irPilar(pilar);
}

function _salvarEntradaPilar(pilar, campoId) {
    const ta = document.getElementById('pil-form-ta');
    const texto = ta?.value.trim();
    if (!texto) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d[pilar]) d[pilar] = {};
    if (!d[pilar][campoId]) d[pilar][campoId] = [];
    d[pilar][campoId].push({ texto, data: new Date().toISOString() });
    localStorage.setItem('la', JSON.stringify(d));
    _abrirFormPilar(pilar, campoId);
}

/* ══════════════════════════════════════
   EDUCAÇÃO — ENSINO INFANTIL — FORMULÁRIO RICO
══════════════════════════════════════ */
const _EDUI_RECURSOS = [
    { id:'mediador',              label:'Mediador escolar',      icon:'user-check' },
    { id:'aee',                   label:'AEE',                   icon:'puzzle' },
    { id:'adaptacao-curricular',  label:'Adaptação curricular',  icon:'sliders-horizontal' },
    { id:'nenhum',                label:'Nenhum',                icon:'minus-circle' },
];

function _eduInfantilDadosHtml(dados) {
    const turno = dados.turno || '';
    const fields = [
        { id:'escola',      label:'Escola',                  ph:'Nome da instituição',           type:'text' },
        { id:'serie',       label:'Série',                   ph:'Ex: Maternal I, Jardim II…',     type:'text' },
        { id:'professor',   label:'Professor(a)',            ph:'Educador(a) de referência',      type:'text' },
        { id:'auxiliar',    label:'Auxiliar',                ph:'Nome do(a) auxiliar',            type:'text' },
        { id:'entrada',     label:'Entrada',                 ph:'',                                type:'time' },
        { id:'saida',       label:'Saída',                   ph:'',                                type:'time' },
        { id:'diretor',     label:'Diretor(a) / Coord.',     ph:'Responsável pelo espaço',         type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="edui-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Turno</label>
        <div class="ter-ori-opcoes" id="edui-d-turno-opcoes">
            ${[['manha','Manhã'],['tarde','Tarde'],['integral','Integral']].map(([id, label]) =>
                `<button class="ter-ori-btn${turno === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEduInfantil()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _eduInfantilSetOpcao(btn) {
    btn.parentElement.querySelectorAll('.ter-ori-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
}

function _salvarDadosEduInfantil() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['edu-infantil'] = {
        escola:    document.getElementById('edui-d-escola')?.value || '',
        serie:     document.getElementById('edui-d-serie')?.value || '',
        professor: document.getElementById('edui-d-professor')?.value || '',
        auxiliar:  document.getElementById('edui-d-auxiliar')?.value || '',
        entrada:   document.getElementById('edui-d-entrada')?.value || '',
        saida:     document.getElementById('edui-d-saida')?.value || '',
        diretor:   document.getElementById('edui-d-diretor')?.value || '',
        turno:     document.querySelector('#edui-d-turno-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _eduInfantilRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const adaptacaoLabel = { tranquila:'Tranquila', apoio:'Com apoio', desafiadora:'Desafiadora' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${_dataRelativa(r.data)}</div>
        ${r.adaptacao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Adaptação escolar</div>
            <div class="ter-reg-valor">${adaptacaoLabel[r.adaptacao] || r.adaptacao}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Registro</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEduInfantil() {
    const overlay = document.getElementById('ter-nova-overlay');
    const hoje = new Date().toISOString().split('T')[0];
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="edui-n-data" type="date" value="${hoje}">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Adaptação escolar</label>
                <div class="ter-ori-opcoes" id="edui-n-adaptacao-opcoes">
                    ${[['tranquila','Tranquila'],['apoio','Com apoio'],['desafiadora','Desafiadora']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="edui-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Registro livre</label>
                <textarea class="ter-ta" id="edui-n-texto" rows="4" placeholder="Marcos, memórias, observações do dia a dia…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEduInfantil()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEduInfantil() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['edu-infantil']) d.educacao['edu-infantil'] = [];
    const adaptacao = document.querySelector('#edui-n-adaptacao-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos = [...document.querySelectorAll('#edui-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto = document.getElementById('edui-n-texto')?.value || '';
    const data = document.getElementById('edui-n-data')?.value || new Date().toISOString().split('T')[0];
    d.educacao['edu-infantil'].push({ data, adaptacao, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _eduInfantilTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormEduInfantil() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'edu-infantil');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['edu-infantil'] || {};
    const registros = ((d.educacao || {})['edu-infantil']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'edu-infantil';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="edui-tab-dados" onclick="_eduInfantilTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="edui-tab-regs" onclick="_eduInfantilTab('registros')">Registros</button>
        </div>
        <div id="edui-painel-dados" class="ter-dados-form">${_eduInfantilDadosHtml(dados)}</div>
        <div id="edui-painel-regs" class="ter-reg-list" style="display:none">${_eduInfantilRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_eduInfantilTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="edui-add-btn" style="display:none" onclick="_abrirNovoRegistroEduInfantil()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _eduInfantilTab(aba) {
    document.getElementById('edui-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('edui-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('edui-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('edui-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('edui-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEduInfantil();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — ENSINO FUNDAMENTAL — FORMULÁRIO RICO
══════════════════════════════════════ */
const _EFUND_ANOS = ['1º ano','2º ano','3º ano','4º ano','5º ano','6º ano','7º ano','8º ano','9º ano'];

function _efundDadosHtml(dados) {
    const turno = dados.turno || '';
    const fields = [
        { id:'escola',  label:'Escola',              ph:'Nome da instituição',   type:'text' },
        { id:'diretor', label:'Diretor(a) / Coord.', ph:'Responsável pelo espaço', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="efund-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Turno</label>
        <div class="ter-ori-opcoes" id="efund-d-turno-opcoes">
            ${[['manha','Manhã'],['tarde','Tarde'],['integral','Integral']].map(([id, label]) =>
                `<button class="ter-ori-btn${turno === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEnsFundamental()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEnsFundamental() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['ens-fundamental'] = {
        escola:  document.getElementById('efund-d-escola')?.value || '',
        diretor: document.getElementById('efund-d-diretor')?.value || '',
        turno:   document.querySelector('#efund-d-turno-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _efundRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum ano letivo registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.ano || '—'}</div>
        ${r.professor ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Professor(a) titular</div>
            <div class="ter-reg-valor">${r.professor}</div>
        </div>` : ''}
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no ano</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do ano</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEnsFundamental() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo ano letivo</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Ano/Série</label>
                    <select class="ter-field-input" id="efund-n-ano">
                        ${_EFUND_ANOS.map(a => `<option value="${a}">${a}</option>`).join('')}
                    </select>
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Professor(a)</label>
                    <input class="ter-field-input" id="efund-n-professor" type="text" placeholder="Professor(a) titular">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no ano</label>
                <div class="ter-ori-opcoes" id="efund-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="efund-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do ano</label>
                <textarea class="ter-ta" id="efund-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do ano…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEnsFundamental()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar ano letivo
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEnsFundamental() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['ens-fundamental']) d.educacao['ens-fundamental'] = [];
    const ano        = document.getElementById('efund-n-ano')?.value || '';
    const professor  = document.getElementById('efund-n-professor')?.value || '';
    const desempenho = document.querySelector('#efund-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#efund-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('efund-n-texto')?.value || '';
    d.educacao['ens-fundamental'].push({ data: new Date().toISOString(), ano, professor, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _efundTab('registros');
    mostrarToast('Ano letivo salvo!');
}

function _abrirFormEnsFundamental() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'ens-fundamental');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['ens-fundamental'] || {};
    const registros = ((d.educacao || {})['ens-fundamental']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'ens-fundamental';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="efund-tab-dados" onclick="_efundTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="efund-tab-regs" onclick="_efundTab('registros')">Registros</button>
        </div>
        <div id="efund-painel-dados" class="ter-dados-form">${_efundDadosHtml(dados)}</div>
        <div id="efund-painel-regs" class="ter-reg-list" style="display:none">${_efundRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_efundTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="efund-add-btn" style="display:none" onclick="_abrirNovoRegistroEnsFundamental()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _efundTab(aba) {
    document.getElementById('efund-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('efund-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('efund-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('efund-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('efund-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEnsFundamental();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — ENSINO MÉDIO — FORMULÁRIO RICO
══════════════════════════════════════ */
const _EMEDIO_SERIES = ['1ª série', '2ª série', '3ª série'];

function _emedioDadosHtml(dados) {
    const turno = dados.turno || '';
    const fields = [
        { id:'escola',  label:'Escola',              ph:'Nome da instituição',     type:'text' },
        { id:'diretor', label:'Diretor(a) / Coord.', ph:'Responsável pelo espaço', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="emedio-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Turno</label>
        <div class="ter-ori-opcoes" id="emedio-d-turno-opcoes">
            ${[['manha','Manhã'],['tarde','Tarde'],['integral','Integral']].map(([id, label]) =>
                `<button class="ter-ori-btn${turno === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEnsMedio()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEnsMedio() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['ens-medio'] = {
        escola:  document.getElementById('emedio-d-escola')?.value || '',
        diretor: document.getElementById('emedio-d-diretor')?.value || '',
        turno:   document.querySelector('#emedio-d-turno-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _emedioRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma série registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.serie || '—'}</div>
        ${r.professor ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Professor(a) de referência</div>
            <div class="ter-reg-valor">${r.professor}</div>
        </div>` : ''}
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no ano</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do ano</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEnsMedio() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova série</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Série</label>
                    <select class="ter-field-input" id="emedio-n-serie">
                        ${_EMEDIO_SERIES.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Professor(a)</label>
                    <input class="ter-field-input" id="emedio-n-professor" type="text" placeholder="Professor(a) de referência">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no ano</label>
                <div class="ter-ori-opcoes" id="emedio-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="emedio-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do ano</label>
                <textarea class="ter-ta" id="emedio-n-texto" rows="4" placeholder="Marcos, dificuldades, vestibular/ENEM, evolução ao longo do ano…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEnsMedio()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar série
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEnsMedio() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['ens-medio']) d.educacao['ens-medio'] = [];
    const serie      = document.getElementById('emedio-n-serie')?.value || '';
    const professor  = document.getElementById('emedio-n-professor')?.value || '';
    const desempenho = document.querySelector('#emedio-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#emedio-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('emedio-n-texto')?.value || '';
    d.educacao['ens-medio'].push({ data: new Date().toISOString(), serie, professor, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _emedioTab('registros');
    mostrarToast('Série salva!');
}

function _abrirFormEnsMedio() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'ens-medio');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['ens-medio'] || {};
    const registros = ((d.educacao || {})['ens-medio']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'ens-medio';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="emedio-tab-dados" onclick="_emedioTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="emedio-tab-regs" onclick="_emedioTab('registros')">Registros</button>
        </div>
        <div id="emedio-painel-dados" class="ter-dados-form">${_emedioDadosHtml(dados)}</div>
        <div id="emedio-painel-regs" class="ter-reg-list" style="display:none">${_emedioRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_emedioTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="emedio-add-btn" style="display:none" onclick="_abrirNovoRegistroEnsMedio()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _emedioTab(aba) {
    document.getElementById('emedio-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('emedio-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('emedio-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('emedio-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('emedio-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEnsMedio();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — ENSINO ESPECIAL (AEE) — FORMULÁRIO RICO
══════════════════════════════════════ */
const _ESPECIAL_AREAS = [
    { id:'comunicacao',            label:'Comunicação',            icon:'message-circle' },
    { id:'autonomia',              label:'Autonomia',              icon:'footprints' },
    { id:'habilidades-sociais',    label:'Habilidades sociais',    icon:'users' },
    { id:'tecnologia-assistiva',   label:'Tecnologia assistiva',   icon:'laptop' },
    { id:'adaptacao-curricular',   label:'Adaptação curricular',   icon:'sliders-horizontal' },
];

function _especialDadosHtml(dados) {
    const fields = [
        { id:'escola',      label:'Escola / Sala',      ph:'Escola ou sala de recursos',   type:'text' },
        { id:'professor',   label:'Professor(a) AEE',   ph:'Educador(a) especializado(a)', type:'text' },
        { id:'frequencia',  label:'Frequência',         ph:'Ex: 2x por semana, terças e quintas', type:'text' },
        { id:'diretor',     label:'Diretor(a) / Coord.', ph:'Responsável pelo espaço',      type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="especial-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEduEspecial()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEduEspecial() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['edu-especial'] = {
        escola:     document.getElementById('especial-d-escola')?.value || '',
        professor:  document.getElementById('especial-d-professor')?.value || '',
        frequencia: document.getElementById('especial-d-frequencia')?.value || '',
        diretor:    document.getElementById('especial-d-diretor')?.value || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _especialRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const progressoLabel = { avancou:'Avançou', manteve:'Manteve', dificuldade:'Com dificuldade' };
    const areaLabel = Object.fromEntries(_ESPECIAL_AREAS.map(a => [a.id, a.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${_dataRelativa(r.data)}</div>
        ${r.areas && r.areas.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Áreas trabalhadas</div>
            <div class="ter-reg-valor">${r.areas.map(id => areaLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.progresso ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Progresso observado</div>
            <div class="ter-reg-valor">${progressoLabel[r.progresso] || r.progresso}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Observações</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEduEspecial() {
    const overlay = document.getElementById('ter-nova-overlay');
    const hoje = new Date().toISOString().split('T')[0];
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="especial-n-data" type="date" value="${hoje}">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Áreas trabalhadas</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="especial-n-areas-chips">
                    ${_ESPECIAL_AREAS.map(a => `<button class="edu-tipo-chip" data-val="${a.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${a.icon}" style="stroke-width:1.7;fill:none"></i> ${a.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Progresso observado</label>
                <div class="ter-ori-opcoes" id="especial-n-progresso-opcoes">
                    ${[['avancou','Avançou'],['manteve','Manteve'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Observações</label>
                <textarea class="ter-ta" id="especial-n-texto" rows="4" placeholder="Evolução, estratégias que funcionaram, dificuldades observadas…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEduEspecial()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEduEspecial() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['edu-especial']) d.educacao['edu-especial'] = [];
    const data      = document.getElementById('especial-n-data')?.value || new Date().toISOString().split('T')[0];
    const areas     = [...document.querySelectorAll('#especial-n-areas-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const progresso = document.querySelector('#especial-n-progresso-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const texto     = document.getElementById('especial-n-texto')?.value || '';
    d.educacao['edu-especial'].push({ data, areas, progresso, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _especialTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormEduEspecial() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'edu-especial');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['edu-especial'] || {};
    const registros = ((d.educacao || {})['edu-especial']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'edu-especial';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="especial-tab-dados" onclick="_especialTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="especial-tab-regs" onclick="_especialTab('registros')">Registros</button>
        </div>
        <div id="especial-painel-dados" class="ter-dados-form">${_especialDadosHtml(dados)}</div>
        <div id="especial-painel-regs" class="ter-reg-list" style="display:none">${_especialRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_especialTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="especial-add-btn" style="display:none" onclick="_abrirNovoRegistroEduEspecial()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _especialTab(aba) {
    document.getElementById('especial-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('especial-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('especial-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('especial-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('especial-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEduEspecial();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — FORMATURA — FORMULÁRIO RICO
══════════════════════════════════════ */
const _FORMATURA_NIVEIS = ['Educação Infantil', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior'];

function _formaturaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma formatura registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nivel || '—'}</div>
        ${r.escola ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Escola / Instituição</div>
            <div class="ter-reg-valor">${r.escola}</div>
        </div>` : ''}
        <div class="ter-reg-campo">
            <div class="ter-reg-label">Data</div>
            <div class="ter-reg-valor">${_dataRelativa(r.data)}</div>
        </div>
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como foi esse dia</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroFormatura() {
    const overlay = document.getElementById('ter-nova-overlay');
    const hoje = new Date().toISOString().split('T')[0];
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova formatura</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nível</label>
                    <select class="ter-field-input" id="formatura-n-nivel">
                        ${_FORMATURA_NIVEIS.map(n => `<option value="${n}">${n}</option>`).join('')}
                    </select>
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Escola</label>
                    <input class="ter-field-input" id="formatura-n-escola" type="text" placeholder="Nome da instituição">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="formatura-n-data" type="date" value="${hoje}">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como foi esse dia</label>
                <textarea class="ter-ta" id="formatura-n-texto" rows="4" placeholder="O que aconteceu, quem estava presente, como foi o sentimento…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroFormatura()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar formatura
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroFormatura() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['formatura']) d.educacao['formatura'] = [];
    const nivel  = document.getElementById('formatura-n-nivel')?.value || '';
    const escola = document.getElementById('formatura-n-escola')?.value || '';
    const data   = document.getElementById('formatura-n-data')?.value || new Date().toISOString().split('T')[0];
    const texto  = document.getElementById('formatura-n-texto')?.value || '';
    d.educacao['formatura'].push({ data, nivel, escola, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormFormatura();
    mostrarToast('Formatura salva!');
}

function _abrirFormFormatura() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'formatura');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.educacao || {})['formatura']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'formatura';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_formaturaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroFormatura()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — GRADUAÇÃO — FORMULÁRIO RICO
══════════════════════════════════════ */
const _GRAD_RECURSOS = [
    { id:'nucleo-acessibilidade', label:'Núcleo de Acessibilidade', icon:'accessibility' },
    { id:'tutoria',                label:'Tutoria',                  icon:'book-open' },
    { id:'adaptacao-provas',       label:'Adaptação de provas',      icon:'edit-3' },
    { id:'monitoria',              label:'Monitoria',                icon:'users' },
    { id:'nenhum',                 label:'Nenhum',                   icon:'minus-circle' },
];

function _graduacaoDadosHtml(dados) {
    const modalidade = dados.modalidade || '';
    const turno = dados.turno || '';
    const fields = [
        { id:'instituicao', label:'Instituição', ph:'Faculdade / Universidade', type:'text' },
        { id:'curso',        label:'Curso',       ph:'Nome do curso',           type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="grad-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Modalidade</label>
        <div class="ter-ori-opcoes" id="grad-d-modalidade-opcoes">
            ${[['presencial','Presencial'],['ead','EaD'],['semipresencial','Semipresencial']].map(([id, label]) =>
                `<button class="ter-ori-btn${modalidade === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Turno</label>
        <div class="ter-ori-opcoes" id="grad-d-turno-opcoes">
            ${[['manha','Manhã'],['tarde','Tarde'],['noite','Noite'],['integral','Integral']].map(([id, label]) =>
                `<button class="ter-ori-btn${turno === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosGraduacao()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosGraduacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['graduacao'] = {
        instituicao: document.getElementById('grad-d-instituicao')?.value || '',
        curso:       document.getElementById('grad-d-curso')?.value || '',
        modalidade:  document.querySelector('#grad-d-modalidade-opcoes .ter-ori-btn.sel')?.dataset.val || '',
        turno:       document.querySelector('#grad-d-turno-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _graduacaoRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum período registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_GRAD_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.periodo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroGraduacao() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo período</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Período</label>
                    <input class="ter-field-input" id="grad-n-periodo" type="text" placeholder="Ex: 3º período ou 2024.1">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="grad-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="grad-n-recursos-chips">
                    ${_GRAD_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="grad-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do período…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroGraduacao()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar período
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroGraduacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['graduacao']) d.educacao['graduacao'] = [];
    const periodo    = document.getElementById('grad-n-periodo')?.value || '';
    const desempenho = document.querySelector('#grad-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#grad-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('grad-n-texto')?.value || '';
    d.educacao['graduacao'].push({ data: new Date().toISOString(), periodo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _graduacaoTab('registros');
    mostrarToast('Período salvo!');
}

function _abrirFormGraduacao() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'graduacao');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['graduacao'] || {};
    const registros = ((d.educacao || {})['graduacao']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'graduacao';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="grad-tab-dados" onclick="_graduacaoTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="grad-tab-regs" onclick="_graduacaoTab('registros')">Registros</button>
        </div>
        <div id="grad-painel-dados" class="ter-dados-form">${_graduacaoDadosHtml(dados)}</div>
        <div id="grad-painel-regs" class="ter-reg-list" style="display:none">${_graduacaoRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_graduacaoTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="grad-add-btn" style="display:none" onclick="_abrirNovoRegistroGraduacao()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _graduacaoTab(aba) {
    document.getElementById('grad-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('grad-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('grad-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('grad-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('grad-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroGraduacao();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — PÓS-GRADUAÇÃO / MBA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _posDadosHtml(dados) {
    const modalidade = dados.modalidade || '';
    const fields = [
        { id:'instituicao',    label:'Instituição',        ph:'Faculdade / Universidade',      type:'text' },
        { id:'curso',           label:'Curso / Área',       ph:'Especialização, MBA…',          type:'text' },
        { id:'cargaHoraria',    label:'Carga horária',      ph:'Ex: 360h',                      type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="pos-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Modalidade</label>
        <div class="ter-ori-opcoes" id="pos-d-modalidade-opcoes">
            ${[['presencial','Presencial'],['ead','EaD'],['semipresencial','Semipresencial']].map(([id, label]) =>
                `<button class="ter-ori-btn${modalidade === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosPosGraduacao()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosPosGraduacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['pos-graduacao'] = {
        instituicao:  document.getElementById('pos-d-instituicao')?.value || '',
        curso:        document.getElementById('pos-d-curso')?.value || '',
        cargaHoraria: document.getElementById('pos-d-cargaHoraria')?.value || '',
        modalidade:   document.querySelector('#pos-d-modalidade-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _posRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum módulo registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_GRAD_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no módulo</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do módulo</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroPosGraduacao() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo módulo</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo</label>
                    <input class="ter-field-input" id="pos-n-modulo" type="text" placeholder="Ex: Módulo 3 — Gestão de Projetos">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no módulo</label>
                <div class="ter-ori-opcoes" id="pos-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="pos-n-recursos-chips">
                    ${_GRAD_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do módulo</label>
                <textarea class="ter-ta" id="pos-n-texto" rows="4" placeholder="Marcos, dificuldades, TCC/monografia, evolução…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroPosGraduacao()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar módulo
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroPosGraduacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['pos-graduacao']) d.educacao['pos-graduacao'] = [];
    const modulo     = document.getElementById('pos-n-modulo')?.value || '';
    const desempenho = document.querySelector('#pos-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#pos-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('pos-n-texto')?.value || '';
    d.educacao['pos-graduacao'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _posTab('registros');
    mostrarToast('Módulo salvo!');
}

function _abrirFormPosGraduacao() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'pos-graduacao');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['pos-graduacao'] || {};
    const registros = ((d.educacao || {})['pos-graduacao']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'pos-graduacao';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="pos-tab-dados" onclick="_posTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="pos-tab-regs" onclick="_posTab('registros')">Registros</button>
        </div>
        <div id="pos-painel-dados" class="ter-dados-form">${_posDadosHtml(dados)}</div>
        <div id="pos-painel-regs" class="ter-reg-list" style="display:none">${_posRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_posTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="pos-add-btn" style="display:none" onclick="_abrirNovoRegistroPosGraduacao()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _posTab(aba) {
    document.getElementById('pos-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('pos-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('pos-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('pos-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('pos-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroPosGraduacao();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — MESTRADO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _mestradoDadosHtml(dados) {
    const fields = [
        { id:'instituicao', label:'Instituição',          ph:'Faculdade / Universidade',   type:'text' },
        { id:'programa',    label:'Programa / Área',      ph:'Área de concentração',       type:'text' },
        { id:'orientador',  label:'Orientador(a)',        ph:'Nome do(a) orientador(a)',   type:'text' },
        { id:'bolsa',       label:'Bolsa',                ph:'Ex: CAPES, CNPq, Sem bolsa', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="mest-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosMestrado()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosMestrado() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['mestrado'] = {
        instituicao: document.getElementById('mest-d-instituicao')?.value || '',
        programa:    document.getElementById('mest-d-programa')?.value || '',
        orientador:  document.getElementById('mest-d-orientador')?.value || '',
        bolsa:       document.getElementById('mest-d-bolsa')?.value || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _mestradoRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma etapa registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_GRAD_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.etapa || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroMestrado() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova etapa</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Semestre/Etapa</label>
                    <input class="ter-field-input" id="mest-n-etapa" type="text" placeholder="Ex: 1º semestre, Qualificação, Defesa">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="mest-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="mest-n-recursos-chips">
                    ${_GRAD_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="mest-n-texto" rows="4" placeholder="Qualificação, publicações, defesa, dificuldades…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroMestrado()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar etapa
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroMestrado() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['mestrado']) d.educacao['mestrado'] = [];
    const etapa      = document.getElementById('mest-n-etapa')?.value || '';
    const desempenho = document.querySelector('#mest-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#mest-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('mest-n-texto')?.value || '';
    d.educacao['mestrado'].push({ data: new Date().toISOString(), etapa, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _mestradoTab('registros');
    mostrarToast('Etapa salva!');
}

function _abrirFormMestrado() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'mestrado');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['mestrado'] || {};
    const registros = ((d.educacao || {})['mestrado']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'mestrado';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="mest-tab-dados" onclick="_mestradoTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="mest-tab-regs" onclick="_mestradoTab('registros')">Registros</button>
        </div>
        <div id="mest-painel-dados" class="ter-dados-form">${_mestradoDadosHtml(dados)}</div>
        <div id="mest-painel-regs" class="ter-reg-list" style="display:none">${_mestradoRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_mestradoTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="mest-add-btn" style="display:none" onclick="_abrirNovoRegistroMestrado()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _mestradoTab(aba) {
    document.getElementById('mest-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('mest-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('mest-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('mest-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('mest-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroMestrado();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — DOUTORADO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _doutoradoDadosHtml(dados) {
    const fields = [
        { id:'instituicao',   label:'Instituição',      ph:'Faculdade / Universidade',   type:'text' },
        { id:'programa',      label:'Programa / Área',  ph:'Área de concentração',       type:'text' },
        { id:'orientador',    label:'Orientador(a)',    ph:'Nome do(a) orientador(a)',   type:'text' },
        { id:'coorientador',  label:'Coorientador(a)',  ph:'Nome do(a) coorientador(a)', type:'text' },
        { id:'bolsa',         label:'Bolsa',            ph:'Ex: CAPES, CNPq, Sem bolsa', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="dout-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosDoutorado()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosDoutorado() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['doutorado'] = {
        instituicao:  document.getElementById('dout-d-instituicao')?.value || '',
        programa:     document.getElementById('dout-d-programa')?.value || '',
        orientador:   document.getElementById('dout-d-orientador')?.value || '',
        coorientador: document.getElementById('dout-d-coorientador')?.value || '',
        bolsa:        document.getElementById('dout-d-bolsa')?.value || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _doutoradoRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma etapa registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_GRAD_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.etapa || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroDoutorado() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova etapa</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Semestre/Etapa</label>
                    <input class="ter-field-input" id="dout-n-etapa" type="text" placeholder="Ex: 1º semestre, Qualificação, Defesa">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="dout-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="dout-n-recursos-chips">
                    ${_GRAD_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="dout-n-texto" rows="4" placeholder="Qualificação, publicações, doutorado sanduíche, defesa, dificuldades…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroDoutorado()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar etapa
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroDoutorado() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['doutorado']) d.educacao['doutorado'] = [];
    const etapa      = document.getElementById('dout-n-etapa')?.value || '';
    const desempenho = document.querySelector('#dout-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#dout-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('dout-n-texto')?.value || '';
    d.educacao['doutorado'].push({ data: new Date().toISOString(), etapa, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _doutoradoTab('registros');
    mostrarToast('Etapa salva!');
}

function _abrirFormDoutorado() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'doutorado');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['doutorado'] || {};
    const registros = ((d.educacao || {})['doutorado']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'doutorado';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="dout-tab-dados" onclick="_doutoradoTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="dout-tab-regs" onclick="_doutoradoTab('registros')">Registros</button>
        </div>
        <div id="dout-painel-dados" class="ter-dados-form">${_doutoradoDadosHtml(dados)}</div>
        <div id="dout-painel-regs" class="ter-reg-list" style="display:none">${_doutoradoRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_doutoradoTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="dout-add-btn" style="display:none" onclick="_abrirNovoRegistroDoutorado()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _doutoradoTab(aba) {
    document.getElementById('dout-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('dout-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('dout-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('dout-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('dout-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroDoutorado();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — INTERCÂMBIO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _intercambioRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum intercâmbio registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.pais || '—'}</div>
        ${r.instituicao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Instituição / Programa</div>
            <div class="ter-reg-valor">${r.instituicao}</div>
        </div>` : ''}
        ${r.periodo ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Período</div>
            <div class="ter-reg-valor">${r.periodo}</div>
        </div>` : ''}
        ${r.idioma ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Idioma</div>
            <div class="ter-reg-valor">${r.idioma}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como foi a experiência</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroIntercambio() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo intercâmbio</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">País / Cidade</label>
                    <input class="ter-field-input" id="inter-n-pais" type="text" placeholder="Destino do intercâmbio">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Instituição</label>
                    <input class="ter-field-input" id="inter-n-instituicao" type="text" placeholder="Escola, universidade ou programa">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Período</label>
                    <input class="ter-field-input" id="inter-n-periodo" type="text" placeholder="Ex: Jan–Jun 2024">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Idioma</label>
                    <input class="ter-field-input" id="inter-n-idioma" type="text" placeholder="Idioma principal">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como foi a experiência</label>
                <textarea class="ter-ta" id="inter-n-texto" rows="4" placeholder="Adaptação, desafios, conquistas, memórias…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroIntercambio()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar intercâmbio
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroIntercambio() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['intercambio']) d.educacao['intercambio'] = [];
    const pais        = document.getElementById('inter-n-pais')?.value || '';
    const instituicao = document.getElementById('inter-n-instituicao')?.value || '';
    const periodo     = document.getElementById('inter-n-periodo')?.value || '';
    const idioma      = document.getElementById('inter-n-idioma')?.value || '';
    const texto       = document.getElementById('inter-n-texto')?.value || '';
    d.educacao['intercambio'].push({ data: new Date().toISOString(), pais, instituicao, periodo, idioma, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormIntercambio();
    mostrarToast('Intercâmbio salvo!');
}

function _abrirFormIntercambio() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'intercambio');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.educacao || {})['intercambio']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'intercambio';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_intercambioRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroIntercambio()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — EJA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _ejaDadosHtml(dados) {
    const etapa = dados.etapa || '';
    const turno = dados.turno || '';
    const fields = [
        { id:'escola',    label:'Escola',              ph:'Nome da instituição',      type:'text' },
        { id:'professor', label:'Professor(a) / Coord.', ph:'Referência na escola',   type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="eja-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Etapa</label>
        <div class="ter-ori-opcoes" id="eja-d-etapa-opcoes">
            ${[['fundamental','Fundamental'],['medio','Médio']].map(([id, label]) =>
                `<button class="ter-ori-btn${etapa === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Turno</label>
        <div class="ter-ori-opcoes" id="eja-d-turno-opcoes">
            ${[['manha','Manhã'],['tarde','Tarde'],['noite','Noite']].map(([id, label]) =>
                `<button class="ter-ori-btn${turno === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEja()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEja() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['eja'] = {
        escola:    document.getElementById('eja-d-escola')?.value || '',
        professor: document.getElementById('eja-d-professor')?.value || '',
        etapa:     document.querySelector('#eja-d-etapa-opcoes .ter-ori-btn.sel')?.dataset.val || '',
        turno:     document.querySelector('#eja-d-turno-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _ejaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEja() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo/Etapa</label>
                    <input class="ter-field-input" id="eja-n-modulo" type="text" placeholder="Ex: 1º segmento, Módulo 3">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="eja-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="eja-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="eja-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do período…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEja()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEja() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['eja']) d.educacao['eja'] = [];
    const modulo     = document.getElementById('eja-n-modulo')?.value || '';
    const desempenho = document.querySelector('#eja-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#eja-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('eja-n-texto')?.value || '';
    d.educacao['eja'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _ejaTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormEja() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'eja');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['eja'] || {};
    const registros = ((d.educacao || {})['eja']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'eja';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="eja-tab-dados" onclick="_ejaTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="eja-tab-regs" onclick="_ejaTab('registros')">Registros</button>
        </div>
        <div id="eja-painel-dados" class="ter-dados-form">${_ejaDadosHtml(dados)}</div>
        <div id="eja-painel-regs" class="ter-reg-list" style="display:none">${_ejaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_ejaTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="eja-add-btn" style="display:none" onclick="_abrirNovoRegistroEja()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _ejaTab(aba) {
    document.getElementById('eja-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('eja-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('eja-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('eja-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('eja-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEja();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _ctecDadosHtml(dados) {
    const modalidade = dados.modalidade || '';
    const fields = [
        { id:'curso',        label:'Curso técnico',   ph:'Ex: Técnico em Informática',        type:'text' },
        { id:'instituicao',  label:'Instituição',     ph:'Ex: SENAI, IF, Escola Técnica',      type:'text' },
        { id:'cargaHoraria', label:'Carga horária',   ph:'Ex: 1200h',                          type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="ctec-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Modalidade</label>
        <div class="ter-ori-opcoes" id="ctec-d-modalidade-opcoes">
            ${[['integrado','Integrado ao Médio'],['subsequente','Subsequente'],['concomitante','Concomitante']].map(([id, label]) =>
                `<button class="ter-ori-btn${modalidade === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosCursoTecnico()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosCursoTecnico() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['curso-tecnico'] = {
        curso:        document.getElementById('ctec-d-curso')?.value || '',
        instituicao:  document.getElementById('ctec-d-instituicao')?.value || '',
        cargaHoraria: document.getElementById('ctec-d-cargaHoraria')?.value || '',
        modalidade:   document.querySelector('#ctec-d-modalidade-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _ctecRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroCursoTecnico() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo/Etapa</label>
                    <input class="ter-field-input" id="ctec-n-modulo" type="text" placeholder="Ex: Módulo 2">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="ctec-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="ctec-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="ctec-n-texto" rows="4" placeholder="Estágio, prática profissional, dificuldades, evolução…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroCursoTecnico()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroCursoTecnico() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['curso-tecnico']) d.educacao['curso-tecnico'] = [];
    const modulo     = document.getElementById('ctec-n-modulo')?.value || '';
    const desempenho = document.querySelector('#ctec-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#ctec-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('ctec-n-texto')?.value || '';
    d.educacao['curso-tecnico'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _ctecTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormCursoTecnico() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'curso-tecnico');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['curso-tecnico'] || {};
    const registros = ((d.educacao || {})['curso-tecnico']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'curso-tecnico';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="ctec-tab-dados" onclick="_ctecTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="ctec-tab-regs" onclick="_ctecTab('registros')">Registros</button>
        </div>
        <div id="ctec-painel-dados" class="ter-dados-form">${_ctecDadosHtml(dados)}</div>
        <div id="ctec-painel-regs" class="ter-reg-list" style="display:none">${_ctecRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_ctecTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="ctec-add-btn" style="display:none" onclick="_abrirNovoRegistroCursoTecnico()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _ctecTab(aba) {
    document.getElementById('ctec-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('ctec-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('ctec-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('ctec-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('ctec-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroCursoTecnico();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — EDUCAÇÃO INDÍGENA E QUILOMBOLA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _indigDadosHtml(dados) {
    const etapa = dados.etapa || '';
    const fields = [
        { id:'comunidade', label:'Comunidade / Território',   ph:'Nome da comunidade',        type:'text' },
        { id:'escola',     label:'Escola',                     ph:'Nome da instituição',       type:'text' },
        { id:'lingua',     label:'Língua / Cultura trabalhada', ph:'Ex: língua indígena, práticas culturais', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="indig-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Etapa</label>
        <div class="ter-ori-opcoes" id="indig-d-etapa-opcoes">
            ${[['infantil','Infantil'],['fundamental','Fundamental'],['medio','Médio']].map(([id, label]) =>
                `<button class="ter-ori-btn${etapa === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosIndigena()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosIndigena() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['indigena-quilombola'] = {
        comunidade: document.getElementById('indig-d-comunidade')?.value || '',
        escola:     document.getElementById('indig-d-escola')?.value || '',
        lingua:     document.getElementById('indig-d-lingua')?.value || '',
        etapa:      document.querySelector('#indig-d-etapa-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _indigRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroIndigena() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo/Etapa</label>
                    <input class="ter-field-input" id="indig-n-modulo" type="text" placeholder="Ex: 1º trimestre">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="indig-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="indig-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="indig-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do período…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroIndigena()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroIndigena() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['indigena-quilombola']) d.educacao['indigena-quilombola'] = [];
    const modulo     = document.getElementById('indig-n-modulo')?.value || '';
    const desempenho = document.querySelector('#indig-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#indig-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('indig-n-texto')?.value || '';
    d.educacao['indigena-quilombola'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _indigTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormIndigena() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'indigena-quilombola');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['indigena-quilombola'] || {};
    const registros = ((d.educacao || {})['indigena-quilombola']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'indigena-quilombola';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="indig-tab-dados" onclick="_indigTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="indig-tab-regs" onclick="_indigTab('registros')">Registros</button>
        </div>
        <div id="indig-painel-dados" class="ter-dados-form">${_indigDadosHtml(dados)}</div>
        <div id="indig-painel-regs" class="ter-reg-list" style="display:none">${_indigRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_indigTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="indig-add-btn" style="display:none" onclick="_abrirNovoRegistroIndigena()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _indigTab(aba) {
    document.getElementById('indig-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('indig-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('indig-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('indig-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('indig-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroIndigena();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — EDUCAÇÃO DO CAMPO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _campoDadosHtml(dados) {
    const etapa = dados.etapa || '';
    const regime = dados.regime || '';
    const fields = [
        { id:'escola',      label:'Escola',                 ph:'Nome da instituição',     type:'text' },
        { id:'comunidade',  label:'Comunidade / Assentamento', ph:'Nome da comunidade',   type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="campo-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Etapa</label>
        <div class="ter-ori-opcoes" id="campo-d-etapa-opcoes">
            ${[['infantil','Infantil'],['fundamental','Fundamental'],['medio','Médio']].map(([id, label]) =>
                `<button class="ter-ori-btn${etapa === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Regime</label>
        <div class="ter-ori-opcoes" id="campo-d-regime-opcoes">
            ${[['regular','Regular'],['alternancia','Pedagogia da Alternância']].map(([id, label]) =>
                `<button class="ter-ori-btn${regime === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEduCampo()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEduCampo() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['edu-campo'] = {
        escola:     document.getElementById('campo-d-escola')?.value || '',
        comunidade: document.getElementById('campo-d-comunidade')?.value || '',
        etapa:      document.querySelector('#campo-d-etapa-opcoes .ter-ori-btn.sel')?.dataset.val || '',
        regime:     document.querySelector('#campo-d-regime-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _campoRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EDUI_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de apoio</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEduCampo() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo/Etapa</label>
                    <input class="ter-field-input" id="campo-n-modulo" type="text" placeholder="Ex: 1º trimestre">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="campo-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de apoio</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="campo-n-recursos-chips">
                    ${_EDUI_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="campo-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do período…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEduCampo()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEduCampo() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['edu-campo']) d.educacao['edu-campo'] = [];
    const modulo     = document.getElementById('campo-n-modulo')?.value || '';
    const desempenho = document.querySelector('#campo-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#campo-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('campo-n-texto')?.value || '';
    d.educacao['edu-campo'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _campoTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormEduCampo() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'edu-campo');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['edu-campo'] || {};
    const registros = ((d.educacao || {})['edu-campo']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'edu-campo';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="campo-tab-dados" onclick="_campoTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="campo-tab-regs" onclick="_campoTab('registros')">Registros</button>
        </div>
        <div id="campo-painel-dados" class="ter-dados-form">${_campoDadosHtml(dados)}</div>
        <div id="campo-painel-regs" class="ter-reg-list" style="display:none">${_campoRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_campoTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="campo-add-btn" style="display:none" onclick="_abrirNovoRegistroEduCampo()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _campoTab(aba) {
    document.getElementById('campo-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('campo-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('campo-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('campo-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('campo-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEduCampo();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — CURSOS LIVRES — FORMULÁRIO RICO
══════════════════════════════════════ */
function _livresRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum curso registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.instituicao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Instituição / Plataforma</div>
            <div class="ter-reg-valor">${r.instituicao}</div>
        </div>` : ''}
        ${r.periodo ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Período</div>
            <div class="ter-reg-valor">${r.periodo}</div>
        </div>` : ''}
        ${r.cargaHoraria ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Carga horária</div>
            <div class="ter-reg-valor">${r.cargaHoraria}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como foi a experiência</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroCursosLivres() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo curso</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome do curso</label>
                    <input class="ter-field-input" id="livres-n-nome" type="text" placeholder="Ex: Inglês Básico">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Instituição</label>
                    <input class="ter-field-input" id="livres-n-instituicao" type="text" placeholder="Ex: Cultura Inglesa, Udemy, SENAC">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Período</label>
                    <input class="ter-field-input" id="livres-n-periodo" type="text" placeholder="Ex: Jan–Mar 2024">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Carga horária</label>
                    <input class="ter-field-input" id="livres-n-cargaHoraria" type="text" placeholder="Ex: 40h">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como foi a experiência</label>
                <textarea class="ter-ta" id="livres-n-texto" rows="4" placeholder="Certificado obtido, aprendizado, conquistas…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroCursosLivres()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar curso
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroCursosLivres() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['cursos-livres']) d.educacao['cursos-livres'] = [];
    const nome         = document.getElementById('livres-n-nome')?.value || '';
    const instituicao  = document.getElementById('livres-n-instituicao')?.value || '';
    const periodo      = document.getElementById('livres-n-periodo')?.value || '';
    const cargaHoraria = document.getElementById('livres-n-cargaHoraria')?.value || '';
    const texto        = document.getElementById('livres-n-texto')?.value || '';
    d.educacao['cursos-livres'].push({ data: new Date().toISOString(), nome, instituicao, periodo, cargaHoraria, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormCursosLivres();
    mostrarToast('Curso salvo!');
}

function _abrirFormCursosLivres() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'cursos-livres');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.educacao || {})['cursos-livres']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'cursos-livres';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_livresRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroCursosLivres()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — MÚSICA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _musicaDadosHtml(dados) {
    const nivel = dados.nivel || '';
    const fields = [
        { id:'escola',      label:'Escola / Conservatório', ph:'Nome da instituição',    type:'text' },
        { id:'professor',   label:'Professor(a)',           ph:'Educador(a) de referência', type:'text' },
        { id:'instrumento', label:'Instrumento',            ph:'Ex: piano, violão, canto', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="musica-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Nível</label>
        <div class="ter-ori-opcoes" id="musica-d-nivel-opcoes">
            ${[['iniciante','Iniciante'],['intermediario','Intermediário'],['avancado','Avançado']].map(([id, label]) =>
                `<button class="ter-ori-btn${nivel === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosMusica()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosMusica() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['musica'] = {
        escola:      document.getElementById('musica-d-escola')?.value || '',
        professor:   document.getElementById('musica-d-professor')?.value || '',
        instrumento: document.getElementById('musica-d-instrumento')?.value || '',
        nivel:       document.querySelector('#musica-d-nivel-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _musicaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const evolucaoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.marco || '—'}</div>
        ${r.evolucao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Evolução observada</div>
            <div class="ter-reg-valor">${evolucaoLabel[r.evolucao] || r.evolucao}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroMusica() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Marco/Etapa</label>
                    <input class="ter-field-input" id="musica-n-marco" type="text" placeholder="Ex: Recital de fim de ano">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Evolução observada</label>
                <div class="ter-ori-opcoes" id="musica-n-evolucao-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios</label>
                <textarea class="ter-ta" id="musica-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroMusica()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroMusica() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['musica']) d.educacao['musica'] = [];
    const marco    = document.getElementById('musica-n-marco')?.value || '';
    const evolucao = document.querySelector('#musica-n-evolucao-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const texto    = document.getElementById('musica-n-texto')?.value || '';
    d.educacao['musica'].push({ data: new Date().toISOString(), marco, evolucao, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _musicaTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormMusica() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'musica');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['musica'] || {};
    const registros = ((d.educacao || {})['musica']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'musica';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="musica-tab-dados" onclick="_musicaTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="musica-tab-regs" onclick="_musicaTab('registros')">Registros</button>
        </div>
        <div id="musica-painel-dados" class="ter-dados-form">${_musicaDadosHtml(dados)}</div>
        <div id="musica-painel-regs" class="ter-reg-list" style="display:none">${_musicaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_musicaTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="musica-add-btn" style="display:none" onclick="_abrirNovoRegistroMusica()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _musicaTab(aba) {
    document.getElementById('musica-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('musica-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('musica-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('musica-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('musica-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroMusica();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — TEATRO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _teatroDadosHtml(dados) {
    const nivel = dados.nivel || '';
    const fields = [
        { id:'escola',    label:'Escola / Grupo',        ph:'Nome da instituição ou grupo', type:'text' },
        { id:'professor', label:'Professor(a) / Diretor(a)', ph:'Educador(a) de referência', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="teatro-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Nível</label>
        <div class="ter-ori-opcoes" id="teatro-d-nivel-opcoes">
            ${[['iniciante','Iniciante'],['intermediario','Intermediário'],['avancado','Avançado']].map(([id, label]) =>
                `<button class="ter-ori-btn${nivel === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosTeatro()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosTeatro() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['teatro'] = {
        escola:    document.getElementById('teatro-d-escola')?.value || '',
        professor: document.getElementById('teatro-d-professor')?.value || '',
        nivel:     document.querySelector('#teatro-d-nivel-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _teatroRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const evolucaoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.marco || '—'}</div>
        ${r.evolucao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Evolução observada</div>
            <div class="ter-reg-valor">${evolucaoLabel[r.evolucao] || r.evolucao}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroTeatro() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Marco/Etapa</label>
                    <input class="ter-field-input" id="teatro-n-marco" type="text" placeholder="Ex: Peça de fim de ano">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Evolução observada</label>
                <div class="ter-ori-opcoes" id="teatro-n-evolucao-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios</label>
                <textarea class="ter-ta" id="teatro-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroTeatro()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroTeatro() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['teatro']) d.educacao['teatro'] = [];
    const marco    = document.getElementById('teatro-n-marco')?.value || '';
    const evolucao = document.querySelector('#teatro-n-evolucao-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const texto    = document.getElementById('teatro-n-texto')?.value || '';
    d.educacao['teatro'].push({ data: new Date().toISOString(), marco, evolucao, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _teatroTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormTeatro() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'teatro');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['teatro'] || {};
    const registros = ((d.educacao || {})['teatro']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'teatro';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="teatro-tab-dados" onclick="_teatroTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="teatro-tab-regs" onclick="_teatroTab('registros')">Registros</button>
        </div>
        <div id="teatro-painel-dados" class="ter-dados-form">${_teatroDadosHtml(dados)}</div>
        <div id="teatro-painel-regs" class="ter-reg-list" style="display:none">${_teatroRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_teatroTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="teatro-add-btn" style="display:none" onclick="_abrirNovoRegistroTeatro()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _teatroTab(aba) {
    document.getElementById('teatro-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('teatro-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('teatro-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('teatro-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('teatro-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroTeatro();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — EAD — FORMULÁRIO RICO
══════════════════════════════════════ */
const _EAD_RECURSOS = [
    { id:'legendas-libras',    label:'Legendas/Libras',              icon:'captions' },
    { id:'leitor-tela',        label:'Leitor de tela',                icon:'headphones' },
    { id:'material-acessivel', label:'Material em formato acessível', icon:'accessibility' },
    { id:'suporte-tecnico',    label:'Suporte técnico especializado', icon:'life-buoy' },
    { id:'nenhum',             label:'Nenhum',                        icon:'minus-circle' },
];

function _eadDadosHtml(dados) {
    const etapa = dados.etapa || '';
    const fields = [
        { id:'instituicao', label:'Instituição/Plataforma', ph:'Nome da escola ou plataforma', type:'text' },
        { id:'ferramenta',  label:'Ferramenta utilizada',   ph:'Ex: Moodle, Google Classroom', type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="ead-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <div class="ter-ta-wrap">
        <label class="ter-ta-label">Etapa</label>
        <div class="ter-ori-opcoes" id="ead-d-etapa-opcoes">
            ${[['fundamental','Fundamental'],['medio','Médio'],['superior','Superior'],['livre','Curso livre']].map(([id, label]) =>
                `<button class="ter-ori-btn${etapa === id ? ' sel' : ''}" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
            ).join('')}
        </div>
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosEad()">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosEad() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao_dados) d.educacao_dados = {};
    d.educacao_dados['ead'] = {
        instituicao: document.getElementById('ead-d-instituicao')?.value || '',
        ferramenta:  document.getElementById('ead-d-ferramenta')?.value || '',
        etapa:       document.querySelector('#ead-d-etapa-opcoes .ter-ori-btn.sel')?.dataset.val || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _eadRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const desempenhoLabel = { 'muito-bem':'Muito bem', 'bem':'Bem', 'dificuldade':'Com dificuldade' };
    const recursoLabel = Object.fromEntries(_EAD_RECURSOS.map(r => [r.id, r.label]));
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.modulo || '—'}</div>
        ${r.desempenho ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Desempenho no período</div>
            <div class="ter-reg-valor">${desempenhoLabel[r.desempenho] || r.desempenho}</div>
        </div>` : ''}
        ${r.recursos && r.recursos.length > 0 ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Recursos de acessibilidade digital</div>
            <div class="ter-reg-valor">${r.recursos.map(id => recursoLabel[id] || id).join(', ')}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Conquistas e desafios do período</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroEad() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Módulo/Etapa</label>
                    <input class="ter-field-input" id="ead-n-modulo" type="text" placeholder="Ex: Módulo 2">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Desempenho no período</label>
                <div class="ter-ori-opcoes" id="ead-n-desempenho-opcoes">
                    ${[['muito-bem','Muito bem'],['bem','Bem'],['dificuldade','Com dificuldade']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Recursos de acessibilidade digital</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="ead-n-recursos-chips">
                    ${_EAD_RECURSOS.map(r => `<button class="edu-tipo-chip" data-val="${r.id}" onclick="this.classList.toggle('sel')">
                        <i data-lucide="${r.icon}" style="stroke-width:1.7;fill:none"></i> ${r.label}
                    </button>`).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Conquistas e desafios do período</label>
                <textarea class="ter-ta" id="ead-n-texto" rows="4" placeholder="Marcos, dificuldades, evolução ao longo do período…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroEad()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroEad() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['ead']) d.educacao['ead'] = [];
    const modulo     = document.getElementById('ead-n-modulo')?.value || '';
    const desempenho = document.querySelector('#ead-n-desempenho-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const recursos   = [...document.querySelectorAll('#ead-n-recursos-chips .edu-tipo-chip.sel')].map(b => b.dataset.val);
    const texto      = document.getElementById('ead-n-texto')?.value || '';
    d.educacao['ead'].push({ data: new Date().toISOString(), modulo, desempenho, recursos, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _eadTab('registros');
    mostrarToast('Registro salvo!');
}

function _abrirFormEad() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'ead');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.educacao_dados || {})['ead'] || {};
    const registros = ((d.educacao || {})['ead']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'ead';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="ead-tab-dados" onclick="_eadTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="ead-tab-regs" onclick="_eadTab('registros')">Registros</button>
        </div>
        <div id="ead-painel-dados" class="ter-dados-form">${_eadDadosHtml(dados)}</div>
        <div id="ead-painel-regs" class="ter-reg-list" style="display:none">${_eadRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_eadTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="ead-add-btn" style="display:none" onclick="_abrirNovoRegistroEad()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _eadTab(aba) {
    document.getElementById('ead-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('ead-painel-regs').style.display  = aba === 'registros' ? 'flex' : 'none';
    document.getElementById('ead-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('ead-tab-regs').classList.toggle('ativa', aba === 'registros');
    const btn = document.getElementById('ead-add-btn');
    if (!btn) return;
    btn.style.display = aba === 'registros' ? 'inline-flex' : 'none';
    btn.onclick = () => _abrirNovoRegistroEad();
}

/* ══════════════════════════════════════
   EDUCAÇÃO — CONQUISTAS & PRÊMIOS — FORMULÁRIO RICO
══════════════════════════════════════ */
function _conquistasRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma conquista registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.instituicao ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Instituição / Evento</div>
            <div class="ter-reg-valor">${r.instituicao}</div>
        </div>` : ''}
        <div class="ter-reg-campo">
            <div class="ter-reg-label">Data</div>
            <div class="ter-reg-valor">${_dataRelativa(r.data)}</div>
        </div>
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Descrição</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroConquistas() {
    const overlay = document.getElementById('ter-nova-overlay');
    const hoje = new Date().toISOString().split('T')[0];
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova conquista</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Conquista</label>
                    <input class="ter-field-input" id="conq-n-nome" type="text" placeholder="Ex: 1º lugar na Olimpíada de Matemática">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Instituição</label>
                    <input class="ter-field-input" id="conq-n-instituicao" type="text" placeholder="Quem concedeu">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="conq-n-data" type="date" value="${hoje}">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="conq-n-texto" rows="4" placeholder="Contexto, como foi, importância desse momento…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroConquistas()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar conquista
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroConquistas() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao['conquistas']) d.educacao['conquistas'] = [];
    const nome        = document.getElementById('conq-n-nome')?.value || '';
    const instituicao = document.getElementById('conq-n-instituicao')?.value || '';
    const data        = document.getElementById('conq-n-data')?.value || new Date().toISOString().split('T')[0];
    const texto       = document.getElementById('conq-n-texto')?.value || '';
    d.educacao['conquistas'].push({ data, nome, instituicao, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormConquistas();
    mostrarToast('Conquista salva!');
}

function _abrirFormConquistas() {
    const campo = _EDU_CAMPOS.find(c => c.id === 'conquistas');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.educacao || {})['conquistas']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'conquistas';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Educação</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_conquistasRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('educacao')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroConquistas()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — DINÂMICA FAMILIAR — FORMULÁRIO RICO
══════════════════════════════════════ */
function _dinamicaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const statusLabel = { harmoniosa:'Harmoniosa', ajuste:'Em ajuste', desafiadora:'Desafiadora' };
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.tema || '—'}</div>
        ${r.status ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como está a dinâmica</div>
            <div class="ter-reg-valor">${statusLabel[r.status] || r.status}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Descrição</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroDinamica() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo registro</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Tema/Marco</label>
                    <input class="ter-field-input" id="dinamica-n-tema" type="text" placeholder="Ex: Mudança de rotina">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como está a dinâmica agora</label>
                <div class="ter-ori-opcoes" id="dinamica-n-status-opcoes">
                    ${[['harmoniosa','Harmoniosa'],['ajuste','Em ajuste'],['desafiadora','Desafiadora']].map(([id, label]) =>
                        `<button class="ter-ori-btn" data-val="${id}" onclick="_eduInfantilSetOpcao(this)">${label}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="dinamica-n-texto" rows="4" placeholder="O que aconteceu, como a família reagiu, aprendizados…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroDinamica()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroDinamica() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['dinamica']) d.familia['dinamica'] = [];
    const tema   = document.getElementById('dinamica-n-tema')?.value || '';
    const status = document.querySelector('#dinamica-n-status-opcoes .ter-ori-btn.sel')?.dataset.val || '';
    const texto  = document.getElementById('dinamica-n-texto')?.value || '';
    d.familia['dinamica'].push({ data: new Date().toISOString(), tema, status, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormDinamica();
    mostrarToast('Registro salvo!');
}

function _abrirFormDinamica() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'dinamica');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['dinamica']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'dinamica';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_dinamicaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroDinamica()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — HISTÓRIAS DE INFÂNCIA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _infanciaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma história registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.titulo || '—'}</div>
        ${r.fase ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Fase/Idade</div>
            <div class="ter-reg-valor">${r.fase}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">A história</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroInfancia() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova história</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Título</label>
                    <input class="ter-field-input" id="infancia-n-titulo" type="text" placeholder="Ex: A primeira vez que andou de bicicleta">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Fase/Idade</label>
                    <input class="ter-field-input" id="infancia-n-fase" type="text" placeholder="Ex: aos 3 anos, bebê">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">A história</label>
                <textarea class="ter-ta" id="infancia-n-texto" rows="5" placeholder="Conte como foi…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroInfancia()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar história
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroInfancia() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['infancia']) d.familia['infancia'] = [];
    const titulo = document.getElementById('infancia-n-titulo')?.value || '';
    const fase   = document.getElementById('infancia-n-fase')?.value || '';
    const texto  = document.getElementById('infancia-n-texto')?.value || '';
    d.familia['infancia'].push({ data: new Date().toISOString(), titulo, fase, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormInfancia();
    mostrarToast('História salva!');
}

function _abrirFormInfancia() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'infancia');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['infancia']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'infancia';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_infanciaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroInfancia()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — MEMÓRIAS AFETIVAS — FORMULÁRIO RICO
══════════════════════════════════════ */
function _memoriasRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma memória registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.titulo || '—'}</div>
        ${r.comQuem ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Com quem</div>
            <div class="ter-reg-valor">${r.comQuem}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">A memória</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroMemorias() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova memória</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Título</label>
                    <input class="ter-field-input" id="memorias-n-titulo" type="text" placeholder="Ex: O Natal na casa da vovó">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Com quem</label>
                    <input class="ter-field-input" id="memorias-n-comQuem" type="text" placeholder="Ex: vovó, toda a família">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">A memória</label>
                <textarea class="ter-ta" id="memorias-n-texto" rows="5" placeholder="O que aconteceu, o que esse momento significa…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroMemorias()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar memória
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroMemorias() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['memorias']) d.familia['memorias'] = [];
    const titulo  = document.getElementById('memorias-n-titulo')?.value || '';
    const comQuem = document.getElementById('memorias-n-comQuem')?.value || '';
    const texto   = document.getElementById('memorias-n-texto')?.value || '';
    d.familia['memorias'].push({ data: new Date().toISOString(), titulo, comQuem, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormMemorias();
    mostrarToast('Memória salva!');
}

function _abrirFormMemorias() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'memorias');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['memorias']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'memorias';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_memoriasRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroMemorias()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — CARTA PARA O FUTURO — FORMULÁRIO RICO
══════════════════════════════════════ */
function _cartaRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma carta registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.destinatario || '—'}</div>
        ${r.dataLeitura ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Data prevista para leitura</div>
            <div class="ter-reg-valor">${r.dataLeitura}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">A carta</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroCarta() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova carta</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Destinatário</label>
                    <input class="ter-field-input" id="carta-n-destinatario" type="text" placeholder="Ex: Para você, quando fizer 18 anos">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data de leitura</label>
                    <input class="ter-field-input" id="carta-n-dataLeitura" type="date">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">A carta</label>
                <textarea class="ter-ta" id="carta-n-texto" rows="6" placeholder="Escreva sua mensagem…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroCarta()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar carta
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroCarta() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['carta']) d.familia['carta'] = [];
    const destinatario = document.getElementById('carta-n-destinatario')?.value || '';
    const dataLeitura  = document.getElementById('carta-n-dataLeitura')?.value || '';
    const texto        = document.getElementById('carta-n-texto')?.value || '';
    d.familia['carta'].push({ data: new Date().toISOString(), destinatario, dataLeitura, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormCarta();
    mostrarToast('Carta salva!');
}

function _abrirFormCarta() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'carta');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['carta']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'carta';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_cartaRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroCarta()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — ÁRVORE GENEALÓGICA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _arvoreRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma pessoa registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.parentesco ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Parentesco</div>
            <div class="ter-reg-valor">${r.parentesco}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">História</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroArvore() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova pessoa</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="arvore-n-nome" type="text" placeholder="Nome completo">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Parentesco</label>
                    <input class="ter-field-input" id="arvore-n-parentesco" type="text" placeholder="Ex: avó materna, tio">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">História</label>
                <textarea class="ter-ta" id="arvore-n-texto" rows="4" placeholder="Uma breve história sobre essa pessoa…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroArvore()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar pessoa
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroArvore() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['arvore']) d.familia['arvore'] = [];
    const nome       = document.getElementById('arvore-n-nome')?.value || '';
    const parentesco = document.getElementById('arvore-n-parentesco')?.value || '';
    const texto      = document.getElementById('arvore-n-texto')?.value || '';
    d.familia['arvore'].push({ data: new Date().toISOString(), nome, parentesco, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormArvore();
    mostrarToast('Pessoa salva!');
}

function _abrirFormArvore() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'arvore');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['arvore']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'arvore';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_arvoreRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroArvore()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — TRADIÇÕES E COSTUMES — FORMULÁRIO RICO
══════════════════════════════════════ */
function _tradicoesRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma tradição registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.quando ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Quando acontece</div>
            <div class="ter-reg-valor">${r.quando}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Descrição</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroTradicoes() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova tradição</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="tradicoes-n-nome" type="text" placeholder="Ex: Ceia de Natal na casa da avó">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Quando acontece</label>
                    <input class="ter-field-input" id="tradicoes-n-quando" type="text" placeholder="Ex: todo ano em dezembro">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="tradicoes-n-texto" rows="4" placeholder="O que é, como surgiu, o que significa pra família…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroTradicoes()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar tradição
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroTradicoes() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['tradicoes']) d.familia['tradicoes'] = [];
    const nome   = document.getElementById('tradicoes-n-nome')?.value || '';
    const quando = document.getElementById('tradicoes-n-quando')?.value || '';
    const texto  = document.getElementById('tradicoes-n-texto')?.value || '';
    d.familia['tradicoes'].push({ data: new Date().toISOString(), nome, quando, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormTradicoes();
    mostrarToast('Tradição salva!');
}

function _abrirFormTradicoes() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'tradicoes');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['tradicoes']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'tradicoes';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_tradicoesRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroTradicoes()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — VALORES FAMILIARES — FORMULÁRIO RICO
══════════════════════════════════════ */
function _valoresRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum valor registrado ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.valor || '—'}</div>
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Por que é importante</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroValores() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo valor</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Valor</label>
                    <input class="ter-field-input" id="valores-n-valor" type="text" placeholder="Ex: Honestidade, União">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Por que é importante</label>
                <textarea class="ter-ta" id="valores-n-texto" rows="4" placeholder="O que esse valor significa pra família, como é praticado no dia a dia…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroValores()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar valor
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroValores() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['valores']) d.familia['valores'] = [];
    const valor = document.getElementById('valores-n-valor')?.value || '';
    const texto = document.getElementById('valores-n-texto')?.value || '';
    d.familia['valores'].push({ data: new Date().toISOString(), valor, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormValores();
    mostrarToast('Valor salvo!');
}

function _abrirFormValores() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'valores');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['valores']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'valores';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_valoresRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroValores()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — ANIVERSÁRIOS E DATAS ESPECIAIS — FORMULÁRIO RICO
══════════════════════════════════════ */
function _aniversariosRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma data registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.dataEvento ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Data</div>
            <div class="ter-reg-valor">${r.dataEvento}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como celebram</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroAniversarios() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova data</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Evento/Pessoa</label>
                    <input class="ter-field-input" id="aniversarios-n-nome" type="text" placeholder="Ex: Aniversário do João">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="aniversarios-n-dataEvento" type="text" placeholder="Ex: 15 de março">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como celebram</label>
                <textarea class="ter-ta" id="aniversarios-n-texto" rows="4" placeholder="Tradições dessa data, o que costumam fazer…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroAniversarios()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar data
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroAniversarios() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['aniversarios']) d.familia['aniversarios'] = [];
    const nome       = document.getElementById('aniversarios-n-nome')?.value || '';
    const dataEvento = document.getElementById('aniversarios-n-dataEvento')?.value || '';
    const texto      = document.getElementById('aniversarios-n-texto')?.value || '';
    d.familia['aniversarios'].push({ data: new Date().toISOString(), nome, dataEvento, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormAniversarios();
    mostrarToast('Data salva!');
}

function _abrirFormAniversarios() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'aniversarios');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['aniversarios']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'aniversarios';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_aniversariosRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroAniversarios()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — RECEITAS DA FAMÍLIA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _receitasRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma receita registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.deQuem ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">De quem é a receita</div>
            <div class="ter-reg-valor">${r.deQuem}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Ingredientes e modo de preparo</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroReceitas() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova receita</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="receitas-n-nome" type="text" placeholder="Nome da receita">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">De quem é</label>
                    <input class="ter-field-input" id="receitas-n-deQuem" type="text" placeholder="Ex: receita da vovó">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Ingredientes e modo de preparo</label>
                <textarea class="ter-ta" id="receitas-n-texto" rows="6" placeholder="Liste os ingredientes e o passo a passo…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroReceitas()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar receita
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroReceitas() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['receitas']) d.familia['receitas'] = [];
    const nome   = document.getElementById('receitas-n-nome')?.value || '';
    const deQuem = document.getElementById('receitas-n-deQuem')?.value || '';
    const texto  = document.getElementById('receitas-n-texto')?.value || '';
    d.familia['receitas'].push({ data: new Date().toISOString(), nome, deQuem, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormReceitas();
    mostrarToast('Receita salva!');
}

function _abrirFormReceitas() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'receitas');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['receitas']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'receitas';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_receitasRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroReceitas()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — CONQUISTAS EM FAMÍLIA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _conquistasFamRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma conquista registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        <div class="ter-reg-campo">
            <div class="ter-reg-label">Data</div>
            <div class="ter-reg-valor">${_dataRelativa(r.data)}</div>
        </div>
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Descrição</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroConquistasFam() {
    const overlay = document.getElementById('ter-nova-overlay');
    const hoje = new Date().toISOString().split('T')[0];
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova conquista</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Conquista</label>
                    <input class="ter-field-input" id="conqfam-n-nome" type="text" placeholder="Ex: Compramos nossa casa própria">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="conqfam-n-data" type="date" value="${hoje}">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="conqfam-n-texto" rows="4" placeholder="Como foi conquistado, o que significa pra família…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroConquistasFam()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar conquista
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroConquistasFam() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['conquistas']) d.familia['conquistas'] = [];
    const nome  = document.getElementById('conqfam-n-nome')?.value || '';
    const data  = document.getElementById('conqfam-n-data')?.value || new Date().toISOString().split('T')[0];
    const texto = document.getElementById('conqfam-n-texto')?.value || '';
    d.familia['conquistas'].push({ data, nome, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormConquistasFam();
    mostrarToast('Conquista salva!');
}

function _abrirFormConquistasFam() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'conquistas');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['conquistas']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'conquistas';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_conquistasFamRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroConquistasFam()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   FAMÍLIA — VIAGENS EM FAMÍLIA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _viagensRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma viagem registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.destino || '—'}</div>
        ${r.periodo ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Período</div>
            <div class="ter-reg-valor">${r.periodo}</div>
        </div>` : ''}
        ${r.texto ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Como foi a viagem</div>
            <div class="ter-reg-valor">${r.texto}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirNovoRegistroViagens() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova viagem</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Destino</label>
                    <input class="ter-field-input" id="viagens-n-destino" type="text" placeholder="Cidade, praia, país…">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Período</label>
                    <input class="ter-field-input" id="viagens-n-periodo" type="text" placeholder="Ex: Julho 2023">
                </div>
            </div>
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Como foi a viagem</label>
                <textarea class="ter-ta" id="viagens-n-texto" rows="4" placeholder="Memórias, momentos marcantes…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoRegistroViagens()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar viagem
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoRegistroViagens() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.familia) d.familia = {};
    if (!d.familia['viagens']) d.familia['viagens'] = [];
    const destino = document.getElementById('viagens-n-destino')?.value || '';
    const periodo = document.getElementById('viagens-n-periodo')?.value || '';
    const texto   = document.getElementById('viagens-n-texto')?.value || '';
    d.familia['viagens'].push({ data: new Date().toISOString(), destino, periodo, texto });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    _abrirFormViagens();
    mostrarToast('Viagem salva!');
}

function _abrirFormViagens() {
    const campo = _FAM_CAMPOS.find(c => c.id === 'viagens');
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const registros = ((d.familia || {})['viagens']) || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = 'viagens';
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-reg-list" style="display:flex">${_viagensRegsHtml(registros)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('familia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirNovoRegistroViagens()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

/* ══════════════════════════════════════
   TERAPIA — FORMULÁRIO RICO
══════════════════════════════════════ */
function _semanaFormatada(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T12:00:00');
    const fim = new Date(d);
    fim.setDate(d.getDate() + 6);
    const fmt = x => x.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
    return `${fmt(d)} a ${fmt(fim)}`;
}

function _terDadosHtml(campoId, dados) {
    const fields = [
        { id:'profissional',   label:'Profissional',    ph:'Nome completo',         type:'text'   },
        { id:'registro',       label:'Registro',        ph:'CRP / CRFa / CREFITO…', type:'text'   },
        { id:'contato',        label:'Contato',         ph:'Telefone / WhatsApp',   type:'tel'    },
        { id:'local',          label:'Local',           ph:'Clínica ou endereço',   type:'text'   },
        { id:'inicio',         label:'Início',          ph:'',                      type:'date'   },
        { id:'sessoes_semana', label:'Sessões/semana',  ph:'Ex: 2',                 type:'number' },
        { id:'duracao',        label:'Duração (min)',   ph:'Ex: 45',                type:'number' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="ter-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosTerapia('${campoId}')">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _terRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhum registro semanal ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const cols = [
        { key:'sessoes_realizadas',  label:'Sessões realizadas' },
        { key:'abordado',            label:'O que foi abordado' },
        { key:'evolucao',            label:'Evolução observada' },
        { key:'tarefas',             label:'Orientações para casa' },
        { key:'observacoes_familia', label:'Observações da família' },
        { key:'humor',               label:'Humor / comportamento' },
        { key:'duvidas',             label:'Dúvidas para o profissional' },
    ];
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">Semana · ${_semanaFormatada(r.semana)}</div>
        ${cols.filter(c => r[c.key]).map(c => `<div class="ter-reg-campo">
            <div class="ter-reg-label">${c.label}</div>
            <div class="ter-reg-valor">${r[c.key]}</div>
        </div>`).join('')}
    </div>`).join('');
}

function _abrirFormTerapia(campoId) {
    const campo = _TER_CAMPOS.find(c => c.id === campoId);
    if (!campo) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.terapia_dados || {})[campoId] || {};
    const registros = ((d.terapia || {})[campoId]) || [];
    const orientacoes = (d.terapia_orientacoes || {})[campoId] || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = campoId;
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Terapia</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="ter-tab-dados" onclick="_terTab('dados')">Dados Gerais</button>
            <button class="ter-form-tab" id="ter-tab-regs" onclick="_terTab('registros')">Registros</button>
            <button class="ter-form-tab" id="ter-tab-casa" onclick="_terTab('casa')">Orientações para casa</button>
        </div>
        <div id="ter-painel-dados" class="ter-dados-form">${_terDadosHtml(campoId, dados)}</div>
        <div id="ter-painel-regs" class="ter-reg-list" style="display:none">${_terRegsHtml(registros)}</div>
        <div id="ter-painel-casa" class="ter-reg-list" style="display:none">${_terOrientacoesHtml(campoId, orientacoes)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('terapia')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_terTab('registros')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="ter-add-btn" style="display:none" onclick="_abrirNovaSemana('${campoId}')">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _terTab(aba) {
    document.getElementById('ter-painel-dados').style.display = aba === 'dados'     ? 'flex' : 'none';
    document.getElementById('ter-painel-regs').style.display = aba === 'registros'  ? 'flex' : 'none';
    document.getElementById('ter-painel-casa').style.display = aba === 'casa'       ? 'flex' : 'none';
    document.getElementById('ter-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('ter-tab-regs').classList.toggle('ativa', aba === 'registros');
    document.getElementById('ter-tab-casa').classList.toggle('ativa', aba === 'casa');
    const btn = document.getElementById('ter-add-btn');
    if (!btn) return;
    const campoId = document.getElementById('pil-form-overlay').dataset.campoId;
    if (aba === 'registros') {
        btn.style.display = 'inline-flex';
        btn.onclick = () => _abrirNovaSemana(campoId);
    } else if (aba === 'casa') {
        btn.style.display = 'inline-flex';
        btn.onclick = () => _abrirNovaOrientacao(campoId);
    } else {
        btn.style.display = 'none';
    }
}

function _salvarDadosTerapia(campoId) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.terapia_dados) d.terapia_dados = {};
    d.terapia_dados[campoId] = {
        profissional:   document.getElementById('ter-d-profissional')?.value   || '',
        registro:       document.getElementById('ter-d-registro')?.value       || '',
        contato:        document.getElementById('ter-d-contato')?.value        || '',
        local:          document.getElementById('ter-d-local')?.value          || '',
        inicio:         document.getElementById('ter-d-inicio')?.value         || '',
        sessoes_semana: document.getElementById('ter-d-sessoes_semana')?.value || '',
        duracao:        document.getElementById('ter-d-duracao')?.value        || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _abrirNovaSemana(campoId) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sessoes = (d.terapia_dados || {})[campoId]?.sessoes_semana || '?';
    const hoje = new Date();
    const diff = (hoje.getDay() + 6) % 7;
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() - diff);
    const semanaIso = segunda.toISOString().split('T')[0];
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova semana</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Semana</label>
                    <input class="ter-field-input" id="ter-n-semana" type="date" value="${semanaIso}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Sessões realizadas</label>
                    <input class="ter-field-input" id="ter-n-sessoes" type="text" placeholder="Ex: 2 de ${sessoes}">
                </div>
            </div>
            ${[
                { id:'abordado',            label:'O que foi abordado',         ph:'Descreva o que foi trabalhado nas sessões desta semana…' },
                { id:'evolucao',            label:'Evolução observada',          ph:'Como o paciente respondeu às abordagens…' },
                { id:'tarefas',             label:'Orientações para casa',       ph:'Atividades e orientações para praticar em casa…' },
                { id:'observacoes_familia', label:'Observações da família',      ph:'O que a família observou em casa durante a semana…' },
                { id:'humor',               label:'Humor / comportamento',       ph:'Como foi o humor e comportamento ao longo da semana…' },
                { id:'duvidas',             label:'Dúvidas para o profissional', ph:'Perguntas para levar à próxima sessão…' },
            ].map(f => `<div class="ter-ta-wrap">
                <label class="ter-ta-label">${f.label}</label>
                <textarea class="ter-ta" id="ter-n-${f.id}" rows="3" placeholder="${f.ph}"></textarea>
            </div>`).join('')}
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovaSemana('${campoId}')">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar registro
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _terOriCardHtml(campoId, o, realIdx, isDemo) {
    const sel = o.resposta || '';
    return `<div class="ter-ori-item">
        ${isDemo ? '<div class="ter-ori-demo-badge">Exemplo</div>' : ''}
        <div class="ter-ori-semana">Semana · ${_semanaFormatada(o.semana)}</div>
        <div class="ter-ori-instrucao">${o.texto}</div>
        <div class="ter-ori-opcoes">
            <button class="ter-ori-btn${sel==='sim'?' sel-sim':''}" onclick="_setOriResposta('${campoId}',${realIdx},'sim')">✓ Realizado</button>
            <button class="ter-ori-btn${sel==='parcial'?' sel-parcial':''}" onclick="_setOriResposta('${campoId}',${realIdx},'parcial')">~ Parcialmente</button>
            <button class="ter-ori-btn${sel==='nao'?' sel-nao':''}" onclick="_setOriResposta('${campoId}',${realIdx},'nao')">✗ Não realizado</button>
        </div>
        <textarea class="ter-ta" rows="2" placeholder="Observação da família…" onblur="_salvarOriObs('${campoId}',${realIdx},this.value)">${o.obs||''}</textarea>
    </div>`;
}

function _terOrientacoesHtml(campoId, orientacoes) {
    if (!orientacoes || orientacoes.length === 0) {
        const demo = { semana: new Date().toISOString().split('T')[0], texto: 'Praticar os exercícios de respiração 2x ao dia antes de dormir e estimular o contato visual durante as refeições.', resposta: 'parcial', obs: 'Fizemos quase todos os dias, mas no fim de semana ele ficou agitado e resistiu um pouco.' };
        return _terOriCardHtml(campoId, demo, -1, true);
    }
    return orientacoes.slice().reverse().map((o, di) => {
        const realIdx = orientacoes.length - 1 - di;
        return _terOriCardHtml(campoId, o, realIdx, false);
    }).join('');
}

function _setOriResposta(campoId, realIdx, resposta) {
    if (realIdx < 0) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const list = (d.terapia_orientacoes || {})[campoId];
    if (!list || list[realIdx] === undefined) return;
    list[realIdx].resposta = list[realIdx].resposta === resposta ? '' : resposta;
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-painel-casa').innerHTML = _terOrientacoesHtml(campoId, list);
    lucide.createIcons();
}

function _salvarOriObs(campoId, realIdx, valor) {
    if (realIdx < 0) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const list = (d.terapia_orientacoes || {})[campoId];
    if (!list || list[realIdx] === undefined) return;
    list[realIdx].obs = valor;
    localStorage.setItem('la', JSON.stringify(d));
}

function _toggleOrientacao(campoId, idx) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const list = (d.terapia_orientacoes || {})[campoId];
    if (!list || list[idx] === undefined) return;
    list[idx].feito = !list[idx].feito;
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-painel-casa').innerHTML = _terOrientacoesHtml(campoId, list);
    lucide.createIcons();
}

function _abrirNovaOrientacao(campoId) {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Orientação para casa</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="ter-o-texto" rows="6" placeholder="Descreva a orientação recebida do profissional…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovaOrientacao('${campoId}')">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar orientação
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovaOrientacao(campoId) {
    const texto = document.getElementById('ter-o-texto')?.value?.trim();
    if (!texto) { mostrarToast('Escreva a orientação antes de salvar'); return; }
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.terapia_orientacoes) d.terapia_orientacoes = {};
    if (!d.terapia_orientacoes[campoId]) d.terapia_orientacoes[campoId] = [];
    d.terapia_orientacoes[campoId].push({ texto, feito: false, data: new Date().toISOString().split('T')[0] });
    localStorage.setItem('la', JSON.stringify(d));
    _fecharNovaSemana();
    _abrirFormTerapia(campoId);
    _terTab('casa');
}

function _fecharNovaSemana() {
    document.getElementById('ter-nova-overlay').style.display = 'none';
}

function _salvarNovaSemana(campoId) {
    const semana = document.getElementById('ter-n-semana')?.value;
    if (!semana) { mostrarToast('Informe a semana de referência'); return; }
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.terapia) d.terapia = {};
    if (!d.terapia[campoId]) d.terapia[campoId] = [];
    d.terapia[campoId].push({
        semana,
        sessoes_realizadas:  document.getElementById('ter-n-sessoes')?.value            || '',
        abordado:            document.getElementById('ter-n-abordado')?.value           || '',
        evolucao:            document.getElementById('ter-n-evolucao')?.value           || '',
        tarefas:             document.getElementById('ter-n-tarefas')?.value            || '',
        observacoes_familia: document.getElementById('ter-n-observacoes_familia')?.value || '',
        humor:               document.getElementById('ter-n-humor')?.value              || '',
        duvidas:             document.getElementById('ter-n-duvidas')?.value            || '',
        clima:               d.clima_cache ? { temp: d.clima_cache.temp, code: d.clima_cache.code } : null,
        data: new Date().toISOString(),
    });
    localStorage.setItem('la', JSON.stringify(d));
    _fecharNovaSemana();
    _abrirFormTerapia(campoId);
    _terTab('registros');
}

/* ══════════════════════════════════════
   SAÚDE — FORMULÁRIO RICO (mesma base do Terapia,
   adaptado para consultas médicas em vez de sessões) ══════════════════════════════════════ */
function _sauDadosHtml(campoId, dados) {
    const fields = [
        { id:'profissional', label:'Profissional',            ph:'Nome completo',            type:'text' },
        { id:'registro',     label:'Registro',                 ph:'CRM / CRO / CFP…',         type:'text' },
        { id:'contato',      label:'Contato',                  ph:'Telefone / WhatsApp',      type:'tel'  },
        { id:'local',        label:'Local',                    ph:'Clínica ou consultório',   type:'text' },
        { id:'inicio',       label:'Início',                   ph:'',                          type:'date' },
        { id:'frequencia',   label:'Frequência das consultas', ph:'Ex: a cada 6 meses',       type:'text' },
        { id:'convenio',     label:'Convênio / Particular',    ph:'Ex: Unimed, particular…',   type:'text' },
    ];
    return `<div class="ter-field-group">
        ${fields.map(f => `<div class="ter-field">
            <label class="ter-field-label">${f.label}</label>
            <input class="ter-field-input" id="sau-d-${f.id}" type="${f.type}" placeholder="${f.ph}" value="${dados[f.id] || ''}">
        </div>`).join('')}
    </div>
    <button class="ter-save-btn" onclick="_salvarDadosSaude('${campoId}')">
        <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
        Salvar dados gerais
    </button>`;
}

function _salvarDadosSaude(campoId) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.saude_dados) d.saude_dados = {};
    d.saude_dados[campoId] = {
        profissional: document.getElementById('sau-d-profissional')?.value || '',
        registro:     document.getElementById('sau-d-registro')?.value     || '',
        contato:      document.getElementById('sau-d-contato')?.value     || '',
        local:        document.getElementById('sau-d-local')?.value       || '',
        inicio:       document.getElementById('sau-d-inicio')?.value      || '',
        frequencia:   document.getElementById('sau-d-frequencia')?.value  || '',
        convenio:     document.getElementById('sau-d-convenio')?.value    || '',
    };
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('Dados gerais salvos!');
}

function _sauRegsHtml(registros) {
    if (registros.length === 0) {
        return `<div class="pil-form-empty">Nenhuma consulta registrada ainda.<br>Toque em <strong>+</strong> para adicionar.</div>`;
    }
    const cols = [
        { key:'motivo',              label:'Motivo da consulta' },
        { key:'avaliacao',           label:'O que foi avaliado' },
        { key:'diagnostico',         label:'Diagnóstico / conduta' },
        { key:'tarefas',             label:'Orientações para casa' },
        { key:'observacoes_familia', label:'Observações da família' },
        { key:'duvidas',             label:'Dúvidas para o profissional' },
    ];
    return registros.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">Consulta · ${r.data ? new Date(r.data + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}</div>
        ${cols.filter(c => r[c.key]).map(c => `<div class="ter-reg-campo">
            <div class="ter-reg-label">${c.label}</div>
            <div class="ter-reg-valor">${r[c.key]}</div>
        </div>`).join('')}
    </div>`).join('');
}

function _abrirFormSaude(campoId) {
    const campo = _SAU_CAMPOS.find(c => c.id === campoId);
    if (!campo) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const dados = (d.saude_dados || {})[campoId] || {};
    const registros = ((d.saude || {})[campoId]) || [];
    const orientacoes = (d.saude_orientacoes || {})[campoId] || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.dataset.campoId = campoId;
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${campo.nome}</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Saúde</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-form-tabs">
            <button class="ter-form-tab ativa" id="sau-tab-dados" onclick="_sauTab('dados')">Registro</button>
            <button class="ter-form-tab" id="sau-tab-regs" onclick="_sauTab('regs')">Consulta</button>
            <button class="ter-form-tab" id="sau-tab-casa" onclick="_sauTab('casa')">Orientação para casa</button>
        </div>
        <div id="sau-painel-dados" class="ter-dados-form">${_sauDadosHtml(campoId, dados)}</div>
        <div id="sau-painel-regs" class="ter-reg-list" style="display:none">${_sauRegsHtml(registros)}</div>
        <div id="sau-painel-casa" class="ter-reg-list" style="display:none">${_sauOrientacoesHtml(campoId, orientacoes)}</div>
        <div class="pp2-bottom" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="_fecharFormPilar('saude')">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="_sauTab('regs')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" id="sau-add-btn" style="display:none" onclick="_abrirNovaConsulta('${campoId}')">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2;fill:none"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _sauTab(aba) {
    document.getElementById('sau-painel-dados').style.display = aba === 'dados' ? 'flex' : 'none';
    document.getElementById('sau-painel-regs').style.display = aba === 'regs'  ? 'flex' : 'none';
    document.getElementById('sau-painel-casa').style.display = aba === 'casa'  ? 'flex' : 'none';
    document.getElementById('sau-tab-dados').classList.toggle('ativa', aba === 'dados');
    document.getElementById('sau-tab-regs').classList.toggle('ativa', aba === 'regs');
    document.getElementById('sau-tab-casa').classList.toggle('ativa', aba === 'casa');
    const btn = document.getElementById('sau-add-btn');
    if (!btn) return;
    const campoId = document.getElementById('pil-form-overlay').dataset.campoId;
    if (aba === 'regs') {
        btn.style.display = 'inline-flex';
        btn.onclick = () => _abrirNovaConsulta(campoId);
    } else if (aba === 'casa') {
        btn.style.display = 'inline-flex';
        btn.onclick = () => _abrirNovaOrientacaoSaude(campoId);
    } else {
        btn.style.display = 'none';
    }
}

function _abrirNovaConsulta(campoId) {
    const hoje = new Date().toISOString().split('T')[0];
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova consulta</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Data da consulta</label>
                    <input class="ter-field-input" id="sau-n-data" type="date" value="${hoje}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Motivo da consulta</label>
                    <input class="ter-field-input" id="sau-n-motivo" type="text" placeholder="Ex: retorno, rotina, avaliação…">
                </div>
            </div>
            ${[
                { id:'avaliacao',           label:'O que foi avaliado',              ph:'Descreva o que foi avaliado na consulta…' },
                { id:'diagnostico',         label:'Diagnóstico / conduta',           ph:'Diagnóstico, conduta ou prescrição…' },
                { id:'tarefas',             label:'Orientações para casa',           ph:'Orientações recebidas para seguir em casa…' },
                { id:'observacoes_familia', label:'Observações da família',          ph:'O que a família observou antes ou depois da consulta…' },
                { id:'duvidas',             label:'Dúvidas para o profissional',     ph:'Perguntas para levar à próxima consulta…' },
            ].map(f => `<div class="ter-ta-wrap">
                <label class="ter-ta-label">${f.label}</label>
                <textarea class="ter-ta" id="sau-n-${f.id}" rows="3" placeholder="${f.ph}"></textarea>
            </div>`).join('')}
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovaConsulta('${campoId}')">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar consulta
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovaConsulta(campoId) {
    const data = document.getElementById('sau-n-data')?.value;
    if (!data) { mostrarToast('Informe a data da consulta'); return; }
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.saude) d.saude = {};
    if (!d.saude[campoId]) d.saude[campoId] = [];
    d.saude[campoId].push({
        data,
        motivo:              document.getElementById('sau-n-motivo')?.value              || '',
        avaliacao:           document.getElementById('sau-n-avaliacao')?.value           || '',
        diagnostico:         document.getElementById('sau-n-diagnostico')?.value         || '',
        tarefas:             document.getElementById('sau-n-tarefas')?.value             || '',
        observacoes_familia: document.getElementById('sau-n-observacoes_familia')?.value || '',
        duvidas:             document.getElementById('sau-n-duvidas')?.value             || '',
        criado: new Date().toISOString(),
    });
    localStorage.setItem('la', JSON.stringify(d));
    _fecharNovaSemana();
    _abrirFormSaude(campoId);
    _sauTab('regs');
}

function _sauOriCardHtml(campoId, o, realIdx, isDemo) {
    const sel = o.resposta || '';
    const dataStr = o.data ? new Date(o.data + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
    return `<div class="ter-ori-item">
        ${isDemo ? '<div class="ter-ori-demo-badge">Exemplo</div>' : ''}
        <div class="ter-ori-semana">${dataStr}</div>
        <div class="ter-ori-instrucao">${o.texto}</div>
        <div class="ter-ori-opcoes">
            <button class="ter-ori-btn${sel==='sim'?' sel-sim':''}" onclick="_setOriRespostaSaude('${campoId}',${realIdx},'sim')">✓ Realizado</button>
            <button class="ter-ori-btn${sel==='parcial'?' sel-parcial':''}" onclick="_setOriRespostaSaude('${campoId}',${realIdx},'parcial')">~ Parcialmente</button>
            <button class="ter-ori-btn${sel==='nao'?' sel-nao':''}" onclick="_setOriRespostaSaude('${campoId}',${realIdx},'nao')">✗ Não realizado</button>
        </div>
        <textarea class="ter-ta" rows="2" placeholder="Observação da família…" onblur="_salvarOriObsSaude('${campoId}',${realIdx},this.value)">${o.obs||''}</textarea>
    </div>`;
}

function _sauOrientacoesHtml(campoId, orientacoes) {
    if (!orientacoes || orientacoes.length === 0) {
        const demo = { data: new Date().toISOString().split('T')[0], texto: 'Manter a rotina de sono regular e retornar em 6 meses para reavaliação.', resposta: 'parcial', obs: 'Conseguimos manter o horário na maioria dos dias.' };
        return _sauOriCardHtml(campoId, demo, -1, true);
    }
    return orientacoes.slice().reverse().map((o, di) => {
        const realIdx = orientacoes.length - 1 - di;
        return _sauOriCardHtml(campoId, o, realIdx, false);
    }).join('');
}

function _setOriRespostaSaude(campoId, realIdx, resposta) {
    if (realIdx < 0) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const list = (d.saude_orientacoes || {})[campoId];
    if (!list || list[realIdx] === undefined) return;
    list[realIdx].resposta = list[realIdx].resposta === resposta ? '' : resposta;
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('sau-painel-casa').innerHTML = _sauOrientacoesHtml(campoId, list);
    lucide.createIcons();
}

function _salvarOriObsSaude(campoId, realIdx, valor) {
    if (realIdx < 0) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const list = (d.saude_orientacoes || {})[campoId];
    if (!list || list[realIdx] === undefined) return;
    list[realIdx].obs = valor;
    localStorage.setItem('la', JSON.stringify(d));
}

function _abrirNovaOrientacaoSaude(campoId) {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Orientação para casa</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-ta-wrap">
                <label class="ter-ta-label">Descrição</label>
                <textarea class="ter-ta" id="sau-o-texto" rows="6" placeholder="Descreva a orientação recebida do profissional…"></textarea>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovaOrientacaoSaude('${campoId}')">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar orientação
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovaOrientacaoSaude(campoId) {
    const texto = document.getElementById('sau-o-texto')?.value?.trim();
    if (!texto) { mostrarToast('Escreva a orientação antes de salvar'); return; }
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.saude_orientacoes) d.saude_orientacoes = {};
    if (!d.saude_orientacoes[campoId]) d.saude_orientacoes[campoId] = [];
    d.saude_orientacoes[campoId].push({ texto, data: new Date().toISOString().split('T')[0] });
    localStorage.setItem('la', JSON.stringify(d));
    _fecharNovaSemana();
    _abrirFormSaude(campoId);
    _sauTab('casa');
}

function renderFamilia() {
    const sec = document.getElementById('fam-cards');
    if (!sec) return;
    sec.innerHTML = _renderPilarPanelHtml('familia', 'white');
    lucide.createIcons();
}
function renderSaude() {
    const sec = document.getElementById('sau-cards');
    if (!sec) return;
    sec.innerHTML = _renderPilarPanelHtml('saude', 'white');
    lucide.createIcons();
}
function renderTerapia() {
    const sec = document.getElementById('ter-cards');
    if (!sec) return;
    sec.innerHTML = _renderPilarPanelHtml('terapia', 'white');
    lucide.createIcons();
}

function _getEduSelecionados() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    return d.educacao_campos || [];
}

function toggleEduCampo(id) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d.educacao_campos || [];
    const idx = sel.indexOf(id);
    const on = idx === -1;
    if (on && idx === -1) sel.push(id);
    if (!on && idx !== -1) sel.splice(idx, 1);
    d.educacao_campos = sel;
    localStorage.setItem('la', JSON.stringify(d));
}

function irSecaoEdu(sec) {
    document.querySelectorAll('#tela-educacao .edu-tab-btn').forEach((btn, i) =>
        btn.classList.toggle('edu-tab-at', (i === 0 && sec === 'formal') || (i === 1 && sec === 'vida'))
    );
    document.getElementById('edu-sec-formal').style.display = sec === 'formal' ? '' : 'none';
    document.getElementById('edu-sec-vida').style.display   = sec === 'vida'   ? '' : 'none';
}

function _eduPillsHtml(grupo) {
    const sel = _getEduSelecionados();
    return _EDU_CAMPOS.filter(c => c.grupo === grupo).map(c => {
        const on = sel.includes(c.id);
        return `<div class="edu-toggle-item${on ? ' sel' : ''}" id="edu-item-${c.id}" onclick="this.classList.toggle('sel'); toggleEduCampo('${c.id}')">
            <i data-lucide="${c.icon}" class="edu-toggle-bg-icon" style="stroke:#3A7A9C"></i>
            <span class="edu-toggle-nome">${c.nome}</span>
        </div>`;
    }).join('');
}

const _EDU_CAMPO_FORMS = {
    'edu-infantil':        '_abrirFormEduInfantil',
    'ens-fundamental':     '_abrirFormEnsFundamental',
    'ens-medio':           '_abrirFormEnsMedio',
    'edu-especial':        '_abrirFormEduEspecial',
    'formatura':           '_abrirFormFormatura',
    'graduacao':           '_abrirFormGraduacao',
    'pos-graduacao':       '_abrirFormPosGraduacao',
    'mestrado':            '_abrirFormMestrado',
    'doutorado':           '_abrirFormDoutorado',
    'intercambio':         '_abrirFormIntercambio',
    'eja':                 '_abrirFormEja',
    'curso-tecnico':       '_abrirFormCursoTecnico',
    'indigena-quilombola': '_abrirFormIndigena',
    'edu-campo':           '_abrirFormEduCampo',
    'cursos-livres':       '_abrirFormCursosLivres',
    'musica':              '_abrirFormMusica',
    'teatro':              '_abrirFormTeatro',
    'ead':                 '_abrirFormEad',
    'conquistas':          '_abrirFormConquistas',
};

const _FAM_CAMPO_FORMS = {
    'dinamica':     '_abrirFormDinamica',
    'infancia':     '_abrirFormInfancia',
    'memorias':     '_abrirFormMemorias',
    'carta':        '_abrirFormCarta',
    'arvore':       '_abrirFormArvore',
    'tradicoes':    '_abrirFormTradicoes',
    'valores':      '_abrirFormValores',
    'aniversarios': '_abrirFormAniversarios',
    'receitas':     '_abrirFormReceitas',
    'conquistas':   '_abrirFormConquistasFam',
    'viagens':      '_abrirFormViagens',
};

function _renderPilarPanelHtml(pilar, cor) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const camposArr = _PILAR_CAMPOS_MAP[pilar] || [];
    const habilitados = (d[pilar + '_campos'] || [])
        .map(id => camposArr.find(c => c.id === id))
        .filter(Boolean)
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    if (habilitados.length === 0) {
        return `<div class="pil-empty-state">
            <i data-lucide="plus-circle" style="width:44px;height:44px;stroke:rgba(26,58,92,.22);stroke-width:1.4;fill:none"></i>
            <p>Toque em <strong>+</strong> para<br>selecionar os campos</p>
        </div>`;
    }
    return `<div class="pil-cards-grid">${habilitados.map(campo => {
        const id = campo.id;
        const registros = ((d[pilar] || {})[id]) || [];
        const count = registros.length;
        const ultimo = registros[registros.length - 1];
        const dataStr = ultimo ? _dataRelativa(ultimo.data) : 'Nenhum registro';
        const sub = count > 0 ? `${count} registro${count > 1 ? 's' : ''} · ${dataStr}` : dataStr;
        const eduFormFn = pilar === 'educacao' ? _EDU_CAMPO_FORMS[id] : null;
        const famFormFn = pilar === 'familia' ? _FAM_CAMPO_FORMS[id] : null;
        const euFormFn  = pilar === 'eu' ? _EU_CAMPO_FORMS[id] : null;
        const onclickFn = pilar === 'terapia' ? `_abrirFormTerapia('${id}')`
            : pilar === 'saude' ? `_abrirFormSaude('${id}')`
            : eduFormFn ? `${eduFormFn}()`
            : famFormFn ? `${famFormFn}()`
            : euFormFn ? `${euFormFn}()`
            : `_abrirFormPilar('${pilar}','${id}')`;
        return `<div class="edu-panel-card" onclick="${onclickFn}">
            <i data-lucide="${campo.icon}" class="edu-panel-bg-icon" style="width:78px;height:78px;stroke:${cor};stroke-width:1.1;fill:none;opacity:.18;pointer-events:none"></i>
            <div class="edu-panel-card-info">
                <div class="edu-panel-card-nome">${campo.nome}</div>
                <div class="edu-panel-card-sub">${sub}</div>
            </div>
        </div>`;
    }).join('')}</div>`;
}

function renderEu() {
    const sec = document.getElementById('eu-cards');
    if (!sec) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.eu_campos) {
        d.eu_campos = _EU_CAMPOS.map(c => c.id);
        localStorage.setItem('la', JSON.stringify(d));
    }
    sec.innerHTML = _renderPilarPanelHtml('eu', '#3A7A9C');
    lucide.createIcons();
}

function renderEducacao() {
    const sec = document.getElementById('edu-cards');
    if (!sec) return;
    sec.innerHTML = _renderPilarPanelHtml('educacao', 'white');
    lucide.createIcons();
}

function voltarParaRegistros() {
    ir('tela-painel');
    irSecao('registros');
}

const _PILARES = [
    { id: 'educacao', nome: 'Educação', icon: 'graduation-cap', cor: '#3A9A6A', bg: 'rgba(58,154,106,.15)'  },
    { id: 'familia',  nome: 'Família',  icon: 'users',          cor: '#C84040', bg: 'rgba(200,64,64,.13)'   },
    { id: 'saude',    nome: 'Saúde',    icon: 'heart-pulse',    cor: '#C8A020', bg: 'rgba(200,160,32,.13)'  },
    { id: 'terapia',  nome: 'Terapia',  icon: 'brain',          cor: '#7855C8', bg: 'rgba(120,85,200,.13)'  },
];

function _contPilar(pilar) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const entries = d[pilar] || {};
    return Object.values(entries).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
}

function _getRecentRegistros(pilar, max) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const entries = d[pilar] || {};
    const lista = [];
    Object.entries(entries).forEach(([id, arr]) => {
        if (Array.isArray(arr)) arr.forEach(r => lista.push({ ...r, _sub: id }));
    });
    lista.sort((a, b) => new Date(b.data) - new Date(a.data));
    return lista.slice(0, max);
}

function _dataRelativa(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Hoje';
    if (d === 1) return 'Ontem';
    if (d < 7) return `Há ${d} dias`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function _getPilarCamposHabilitados(pilar) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const camposArr = _PILAR_CAMPOS_MAP[pilar] || [];
    const selecionados = d[pilar + '_campos'] || [];
    return selecionados.map(id => {
        const campo = camposArr.find(c => c.id === id);
        const registros = ((d[pilar] || {})[id]) || [];
        const ultimo = registros[registros.length - 1];
        return { id, nome: campo ? campo.nome : id, count: registros.length, ultimaData: ultimo?.data || null };
    });
}

function renderRegistros() {
    const grid = document.getElementById('pp-reg-grid');
    if (!grid) return;
    grid.innerHTML = _PILARES.map(p => {
        const campos = _getPilarCamposHabilitados(p.id);
        const itensHtml = campos.length > 0
            ? campos.map(c => `<div class="preg-item" onclick="irPilar('${p.id}')">
                <span class="preg-item-titulo">${c.nome}</span>
                <div class="preg-item-tags">
                    ${c.ultimaData ? `<span class="preg-item-tag">${_dataRelativa(c.ultimaData)}</span>` : ''}
                    <span class="preg-item-tag">${c.count > 0 ? c.count + ' reg.' : 'Vazio'}</span>
                </div>
            </div>`).join('')
            : `<p class="preg-vazio">Nenhum tópico habilitado ainda</p>`;
        return `<div class="preg-card" data-pilar="${p.id}">
            <div class="preg-header" onclick="irPilar('${p.id}')">
                <span class="preg-pilar-nome">${p.nome}</span>
                <div class="preg-header-ico">
                    <i data-lucide="${p.icon}" style="width:20px;height:20px;stroke:${p.cor};stroke-width:1.8;fill:none"></i>
                </div>
            </div>
            <div class="preg-body">${itensHtml}</div>
            <button class="preg-ver-btn" onclick="togglePregCard('${p.id}')">
                <i data-lucide="chevron-down"></i>
                <span>Ver mais</span>
            </button>
        </div>`;
    }).join('');
    lucide.createIcons();
}

function togglePregCard(pilarId) {
    const card = document.querySelector(`.preg-card[data-pilar="${pilarId}"]`);
    if (!card) return;
    const expanded = card.classList.toggle('preg-expanded');
    const lbl = card.querySelector('.preg-ver-btn span');
    const ico = card.querySelector('.preg-ver-btn i');
    if (lbl) lbl.textContent = expanded ? 'Ver menos' : 'Ver mais';
    if (ico) ico.setAttribute('data-lucide', expanded ? 'chevron-up' : 'chevron-down');
    lucide.createIcons();
}

function irPilar(id) {
    if (id === 'educacao') { ir('tela-educacao');      renderEducacao(); return; }
    if (id === 'familia')  { ir('tela-familia-pilar'); renderFamilia();  return; }
    if (id === 'saude')    { ir('tela-saude-pilar');   renderSaude();    return; }
    if (id === 'terapia')  { ir('tela-terapia-pilar'); renderTerapia();  return; }
    if (id === 'eu')       { ir('tela-eu-hub');        renderEu();       return; }
    mostrarToast('Em breve — ' + (_PILARES.find(p => p.id === id)?.nome || ''));
}

function _atuSaudacao() {
    const el = document.getElementById('pp-greeting');
    if (!el) return;
    const h = new Date().getHours();
    const periodo = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const primeiroNome = (d.perfil?.['tea-nome'] || '').trim().split(/\s+/)[0];
    el.textContent = primeiroNome ? `${periodo}, ${primeiroNome}!` : `${periodo}!`;
}

const _HUB_BARS = {
    eu:   [
        { icon: 'user',      acao: "ir('tela-perfil')" },
        { icon: 'settings',  acao: "ir('tela-ajustes')" },
        { icon: 'calendar',  acao: "ir('tela-agenda')" },
        { icon: 'wallet',    acao: "ir('tela-financeiro')" },
    ],
    traj: [
        { icon: 'hourglass',   acao: "ir('tela-linhatempo')" },
        { icon: 'file-text',   acao: "ir('tela-documentos')" },
        { icon: 'bar-chart-2', acao: "ir('tela-grafico-traj')" },
    ],
    seg:  [
        { icon: 'eye-off', acao: "ir('tela-seguranca')" },
        { icon: 'lock',    acao: "ir('tela-senhas')" },
        { icon: 'scale',   acao: "ir('tela-juridico')" },
        { icon: 'users',   acao: "ir('tela-acessos')" },
    ],
};
let _hubBarAtivo = null;

function abrirHubBar(id) {
    const bar = document.getElementById('pn-hub-bar');
    if (!bar) return;
    ['eu','traj','seg'].forEach(k => {
        const sq = document.getElementById('pn-hub-sq-' + k);
        if (sq) sq.style.background = k === id && _hubBarAtivo !== id ? 'rgba(30,58,92,.55)' : '#3A7A9C';
    });
    if (_hubBarAtivo === id) {
        bar.style.display = 'none';
        _hubBarAtivo = null;
        document.getElementById('pn-hub-sq-' + id).style.background = '#3A7A9C';
        return;
    }
    _hubBarAtivo = id;
    const itens = _HUB_BARS[id] || [];
    bar.innerHTML = itens.map(it =>
        `<button class="pil-pilar-btn sel" style="background:rgba(0,0,0,.12)" onclick="${it.acao}">
            <i data-lucide="${it.icon}" style="width:18px;height:18px;stroke:white;stroke-width:1.8;fill:none"></i>
        </button>`
    ).join('');
    bar.style.display = 'flex';
    bar.style.margin = '0';
    lucide.createIcons();
}

function _renderHojeCard() {
    const el = document.getElementById('pn-hoje-card');
    if (!el) return;
    const hoje = new Date();
    const chave = _agChave(hoje);
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    const eventos = ((la.agenda || {})[chave] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));
    const diasSem = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const dataLabel = `${diasSem[hoje.getDay()]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]}`;
    const _corBarra = { amarelo:'#E6B84A', roxo:'#9B7BB8', verde:'#6AAB8E', vermelho:'#E55A5A', azul:'#5D8AB2' };
    const nascStr = la.perfil?.['tea-nasc'] || '';
    let aniversarioHtml = '';
    if (nascStr) {
        const nasc = new Date(nascStr + 'T12:00:00');
        if (nasc.getDate() === hoje.getDate() && nasc.getMonth() === hoje.getMonth()) {
            const nomeProtagonista = la.perfil?.['tea-nome'] || 'quem você ama';
            aniversarioHtml = `<div class="pn-hoje-aniversario">🎉 Hoje é aniversário de ${nomeProtagonista}!</div>`;
        }
    }
    if (eventos.length === 0) {
        el.innerHTML = `<div class="pn-hoje" onclick="ir('tela-agenda')">
            ${aniversarioHtml}
            <div class="pn-hoje-header">
                <span class="pn-hoje-data">${dataLabel}</span>
                <span id="pn-hoje-clima-mini"></span>
            </div>
            <div class="pn-hoje-vazio">Nenhum compromisso hoje</div>
        </div>`;
        _renderClimaCard();
        return;
    }

    // Posições em sequência (não por horário real): reserva um número mínimo de posições
    // na régua para que poucos compromissos não "ocupem" a linha toda, deixando espaço pro resto do dia.
    const SLOTS_MIN = 5;
    const passos = Math.max(eventos.length - 1, SLOTS_MIN - 1);
    const pctPorIndice = (i) => {
        const pct = 8 + (i / passos) * (92 - 8);
        return Math.max(8, Math.min(92, pct));
    };
    const quebrarNome = (texto) => {
        const partes = (texto || '').trim().split(/\s+/);
        return partes.length > 1 ? `${partes[0]}<br>${partes.slice(1).join(' ')}` : (texto || '');
    };
    const marcasHtml = eventos.map((ev, i) => {
        const cat = _agCat(ev.cor);
        const corPonto = _corBarra[cat.cls] || '#97CBE0';
        const pct = pctPorIndice(i);
        const fimHtml = ev.fim ? `<div class="pn-hoje-marca-fim">${ev.fim}</div>` : '';
        return `<div class="pn-hoje-marca" style="left:${pct}%">
            <div class="pn-hoje-marca-hora">${ev.hora}</div>
            <div class="pn-hoje-marca-ponto" style="background:${corPonto}"></div>
            ${fimHtml}
            <div class="pn-hoje-marca-nome">${quebrarNome(ev.texto)}</div>
        </div>`;
    }).join('');
    el.innerHTML = `<div class="pn-hoje" onclick="ir('tela-agenda')">
        ${aniversarioHtml}
        <div class="pn-hoje-header">
            <span class="pn-hoje-data">${dataLabel}</span>
            <span id="pn-hoje-clima-mini"></span>
        </div>
        <div class="pn-hoje-linha-tempo">
            <div class="pn-hoje-trilho"></div>
            ${marcasHtml}
        </div>
    </div>`;
    lucide.createIcons();
    _renderClimaCard();
}

/* ══════════════════════════════════════
   CLIMA DO DIA — Open-Meteo (sem chave, uso não-comercial)
   Mostrado no painel e guardado junto dos registros de humor/comportamento
   da Terapia, para no futuro cruzar mudança de tempo com comportamento. ══════════════════════════════════════ */
function _climaInfo(code) {
    const mapa = {
        0:  { icon:'sun',            label:'Céu limpo' },
        1:  { icon:'cloud-sun',      label:'Poucas nuvens' },
        2:  { icon:'cloud-sun',      label:'Parcialmente nublado' },
        3:  { icon:'cloud',          label:'Nublado' },
        45: { icon:'cloud-fog',      label:'Neblina' },
        48: { icon:'cloud-fog',      label:'Neblina' },
        51: { icon:'cloud-drizzle',  label:'Garoa fraca' },
        53: { icon:'cloud-drizzle',  label:'Garoa' },
        55: { icon:'cloud-drizzle',  label:'Garoa forte' },
        56: { icon:'cloud-drizzle',  label:'Garoa congelante' },
        57: { icon:'cloud-drizzle',  label:'Garoa congelante' },
        61: { icon:'cloud-rain',     label:'Chuva fraca' },
        63: { icon:'cloud-rain',     label:'Chuva' },
        65: { icon:'cloud-rain',     label:'Chuva forte' },
        66: { icon:'cloud-rain',     label:'Chuva congelante' },
        67: { icon:'cloud-rain',     label:'Chuva congelante' },
        71: { icon:'snowflake',      label:'Neve fraca' },
        73: { icon:'snowflake',      label:'Neve' },
        75: { icon:'snowflake',      label:'Neve forte' },
        77: { icon:'snowflake',      label:'Grãos de neve' },
        80: { icon:'cloud-rain',     label:'Pancada de chuva' },
        81: { icon:'cloud-rain',     label:'Pancada de chuva' },
        82: { icon:'cloud-rain',     label:'Pancada de chuva forte' },
        85: { icon:'snowflake',      label:'Pancada de neve' },
        86: { icon:'snowflake',      label:'Pancada de neve' },
        95: { icon:'cloud-lightning',label:'Trovoada' },
        96: { icon:'cloud-lightning',label:'Trovoada com granizo' },
        99: { icon:'cloud-lightning',label:'Trovoada com granizo' },
    };
    return mapa[code] || { icon:'cloud', label:'—' };
}

function _ativarClima() {
    if (!navigator.geolocation) { mostrarToast('Seu navegador não permite localização.'); return; }
    mostrarToast('Buscando sua localização…');
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude: lat, longitude: lon } = pos.coords;
            const d = JSON.parse(localStorage.getItem('la') || '{}');
            d.clima_local = { lat, lon };
            localStorage.setItem('la', JSON.stringify(d));
            _renderClimaCard();
        },
        () => mostrarToast('Não foi possível acessar sua localização.'),
        { timeout: 8000 }
    );
}

async function _buscarClimaAtual(lat, lon) {
    const hoje = new Date().toISOString().split('T')[0];
    const hora = new Date().getHours();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const cache = d.clima_cache;
    if (cache && cache.data === hoje && cache.hora === hora) return cache;
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
        const json = await res.json();
        const novoCache = {
            data: hoje, hora,
            temp: Math.round(json.current.temperature_2m),
            code: json.current.weather_code,
        };
        d.clima_cache = novoCache;
        localStorage.setItem('la', JSON.stringify(d));
        return novoCache;
    } catch { return null; }
}

async function _renderClimaCard() {
    // Ícone+temperatura vivem no cabeçalho do cartão Hoje (#pn-hoje-card) e são recriados
    // a cada _renderHojeCard() — por isso reconsulta o elemento após o await, pra não
    // escrever num nó já substituído se o cartão for redesenhado nesse meio-tempo.
    const el0 = document.getElementById('pn-hoje-clima-mini');
    if (!el0) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const local = d.clima_local;
    if (!local) {
        el0.innerHTML = `<span class="pn-hoje-clima pn-hoje-clima-off" onclick="event.stopPropagation(); _ativarClima()">
            <i data-lucide="cloud-sun" style="width:16px;height:16px;stroke:rgba(26,58,92,.7);stroke-width:1.8;fill:none"></i>
        </span>`;
        lucide.createIcons();
        return;
    }
    const clima = await _buscarClimaAtual(local.lat, local.lon);
    const el = document.getElementById('pn-hoje-clima-mini');
    if (!el) return;
    if (!clima) {
        el.innerHTML = `<span class="pn-hoje-clima pn-hoje-clima-off" onclick="event.stopPropagation(); _ativarClima()">
            <i data-lucide="cloud-off" style="width:16px;height:16px;stroke:rgba(26,58,92,.7);stroke-width:1.8;fill:none"></i>
        </span>`;
        lucide.createIcons();
        return;
    }
    const info = _climaInfo(clima.code);
    el.innerHTML = `<span class="pn-hoje-clima">
        <i data-lucide="${info.icon}" style="width:16px;height:16px;stroke:#1A3A5C;stroke-width:1.8;fill:none"></i>
        ${clima.temp}°C <span class="pn-hoje-clima-desc">${info.label}</span>
    </span>`;
    lucide.createIcons();
}

function ppInit() {
    _atuSaudacao();
    _pp2RenderAtalhos();
}

const _PP2_ATALHOS = [
    { id: 'agenda', icone: 'calendar', acao: "ir('tela-agenda')" },
    { id: 'perfil', icone: 'user',     acao: "ir('tela-perfil')" },
];

function _pp2AbrirSeletor() {
    const salvos = JSON.parse(localStorage.getItem('pp2_atalhos') || '[]');
    _PP2_ATALHOS.forEach(a => {
        const tog = document.getElementById('pp2-tog-' + a.id);
        if (tog) tog.checked = salvos.includes(a.id);
    });
    const g = document.getElementById('pp-greeting');
    const sg = document.getElementById('pp2-sheet-greeting');
    if (g && sg) sg.textContent = g.textContent;
    document.getElementById('pp2-sheet')?.classList.add('pp2-aberto');
    lucide.createIcons();
}

function _pp2FecharSeletor() {
    document.getElementById('pp2-sheet')?.classList.remove('pp2-aberto');
}


function _pp2SalvarSeletor() {
    const ativos = _PP2_ATALHOS
        .filter(a => document.getElementById('pp2-tog-' + a.id)?.checked)
        .map(a => a.id);
    localStorage.setItem('pp2_atalhos', JSON.stringify(ativos));
    _pp2RenderAtalhos();
}

function _pp2RenderAtalhos() {
    const pinned = document.getElementById('pp2-pinned');
    if (!pinned) return;
    const ativos = JSON.parse(localStorage.getItem('pp2_atalhos') || '[]');
    pinned.innerHTML = _PP2_ATALHOS
        .filter(a => ativos.includes(a.id))
        .map(a => `<button class="pp2-btn" onclick="${a.acao}">
            <i data-lucide="${a.icone}" style="width:22px;height:22px;stroke:rgba(26,58,92,.7);stroke-width:1.8"></i>
        </button>`).join('');
    lucide.createIcons();
}

// Linha do tempo única — array plano do topo (Sonhos) à base (História)
// sec: 3=Legado 2=Vida Adulta 1=Adolescência 0=Infância
// Coordenadas: x alterna 80(R)↔240(L), y aumenta 45px por nó (gap 60px entre fases)
const _TL_ALL = [
    // ── Legado (60+) ──
    { icon: 'star',            label: 'Autonomia',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:   60, side: 'r', sec: 3 },
    { icon: 'medal',           label: 'Reconhecim.',  cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  105, side: 'l', sec: 3 },
    { icon: 'bookmark',        label: 'Mem. Viva',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  150, side: 'r', sec: 3 },
    { icon: 'mail',            label: 'Cartas',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  195, side: 'l', sec: 3 },
    { icon: 'lightbulb',       label: 'Sabedoria',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  240, side: 'r', sec: 3 },
    { icon: 'globe',           label: 'Conexões',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  285, side: 'l', sec: 3 },
    { icon: 'leaf',            label: 'Paz Interior', cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  330, side: 'r', sec: 3 },
    { icon: 'sparkles',        label: 'Espiritualid.',cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  375, side: 'l', sec: 3 },
    { icon: 'heart-pulse',     label: 'Saúde',        cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  420, side: 'r', sec: 3 },
    { icon: 'cake',            label: 'Bodas',        cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  465, side: 'l', sec: 3 },
    { icon: 'baby',            label: 'Netos',        cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  510, side: 'r', sec: 3 },
    { icon: 'coffee',          label: 'Aposentadoria',cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  555, side: 'l', sec: 3 },
    // ── Vida Adulta (20–60) ──
    { icon: 'heart-handshake', label: 'Casamento',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  615, side: 'r', sec: 2 },
    { icon: 'baby',            label: 'Filhos',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  660, side: 'l', sec: 2 },
    { icon: 'key',             label: 'Casa Própria', cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  705, side: 'r', sec: 2 },
    { icon: 'building-2',      label: 'Carreira',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  750, side: 'l', sec: 2 },
    { icon: 'award',           label: 'Conquistas',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  795, side: 'r', sec: 2 },
    { icon: 'store',           label: 'Negócio',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  840, side: 'l', sec: 2 },
    { icon: 'piggy-bank',      label: 'Finanças',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  885, side: 'r', sec: 2 },
    { icon: 'map-pin',         label: 'Viagem',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py:  930, side: 'l', sec: 2 },
    { icon: 'stethoscope',     label: 'Saúde',        cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py:  975, side: 'r', sec: 2 },
    { icon: 'church',          label: 'Fé',           cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1020, side: 'l', sec: 2 },
    { icon: 'hand-heart',      label: 'Voluntariado', cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1065, side: 'r', sec: 2 },
    { icon: 'users',           label: 'Amizades',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1110, side: 'l', sec: 2 },
    { icon: 'flower',          label: 'Perdas',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1155, side: 'r', sec: 2 },
    { icon: 'activity',        label: 'Diagnóstico',  cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1200, side: 'l', sec: 2 },
    { icon: 'brain',           label: 'Terapia',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1245, side: 'r', sec: 2 },
    // ── Adolescência (12–19) ──
    { icon: 'school',          label: 'Escola',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1305, side: 'l', sec: 1 },
    { icon: 'heart',           label: '1º Amor',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1350, side: 'r', sec: 1 },
    { icon: 'users',           label: 'Amizades',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1395, side: 'l', sec: 1 },
    { icon: 'trophy',          label: 'Conquistas',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1440, side: 'r', sec: 1 },
    { icon: 'headphones',      label: 'Música',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1485, side: 'l', sec: 1 },
    { icon: 'dumbbell',        label: 'Esporte',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1530, side: 'r', sec: 1 },
    { icon: 'car',             label: 'Habilitação',  cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1575, side: 'l', sec: 1 },
    { icon: 'wallet',          label: '1º Emprego',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1620, side: 'r', sec: 1 },
    { icon: 'plane',           label: '1ª Viagem',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1665, side: 'l', sec: 1 },
    { icon: 'compass',         label: 'Vocação',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1710, side: 'r', sec: 1 },
    { icon: 'clipboard-list',  label: 'Vestibular',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1755, side: 'l', sec: 1 },
    { icon: 'graduation-cap',  label: 'Formatura',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1800, side: 'r', sec: 1 },
    // ── Infância (0–11) ──
    { icon: 'camera',          label: 'Memórias',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1860, side: 'l', sec: 0 },
    { icon: 'gift',            label: 'Tradições',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1905, side: 'r', sec: 0 },
    { icon: 'map',             label: '1ª Viagem',    cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 1950, side: 'l', sec: 0 },
    { icon: 'smile',           label: 'Amizades',     cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 1995, side: 'r', sec: 0 },
    { icon: 'book-open',       label: 'Escola',       cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 2040, side: 'l', sec: 0 },
    { icon: 'gamepad-2',       label: 'Brincadeiras', cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 2085, side: 'r', sec: 0 },
    { icon: 'paw-print',       label: 'Meu Pet',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 2130, side: 'l', sec: 0 },
    { icon: 'footprints',      label: '1ºs Passos',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px:  80, py: 2175, side: 'r', sec: 0 },
    { icon: 'sun',             label: 'Batismo',      cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 2220, side: 'l', sec: 0 },
    { icon: 'users',           label: 'Família',      cor: '#5ca0c7', fn: "abrirNivel(1)",      px:  80, py: 2265, side: 'r', sec: 0 },
    { icon: 'baby',            label: 'Nascimento',   cor: '#5ca0c7', fn: "ir('tela-ajustes')", px: 240, py: 2310, side: 'l', sec: 0 },
];
const _TL_W = 320, _TL_H = 2370;

function renderTimeline() {
    const stack = document.getElementById('pp-content-cards');
    if (!stack) return;
    const W = _TL_W, H = _TL_H;
    const CX = 160; // eixo central vertical

    // Âncoras invisíveis para irSecao
    const anchors = [
        { name: 'legado',        y:    0 },
        { name: 'vida-adulta',   y:  585 },
        { name: 'adolescencia',  y: 1275 },
        { name: 'infancia',      y: 1830 },
    ].map(a =>
        `<div id="la-sec-${a.name}" class="la-tl-anchor" style="top:${(a.y / H * 100).toFixed(2)}%"></div>`
    ).join('');

    // Nós: ícone rente ao eixo + label ao lado
    const nodeEls = _TL_ALL.map(it => {
        const yp = (it.py / H * 100).toFixed(2);
        if (it.side === 'l') {
            // direita: esquerda do nó começa em CX+7
            const xp = ((CX + 7) / W * 100).toFixed(2);
            return `<div class="la-tl-node la-tl-r" onclick="${it.fn}" style="left:${xp}%;top:${yp}%;">
                <i data-lucide="${it.icon}" style="width:28px;height:28px;stroke:${it.cor};stroke-width:1.5"></i>
                <span class="la-tl-lbl">${it.label}</span>
            </div>`;
        } else {
            // esquerda: direita do nó termina em CX-7
            const xp = ((CX - 7) / W * 100).toFixed(2);
            return `<div class="la-tl-node la-tl-l" onclick="${it.fn}" style="left:${xp}%;top:${yp}%;">
                <i data-lucide="${it.icon}" style="width:28px;height:28px;stroke:${it.cor};stroke-width:1.5"></i>
                <span class="la-tl-lbl">${it.label}</span>
            </div>`;
        }
    }).join('');

    // SVG: linha + dots (sem conectores — ícone fica colado ao dot)
    const firstPy = _TL_ALL[0].py;
    const lastPy  = _TL_ALL[_TL_ALL.length - 1].py;

    const svgNodes = _TL_ALL.map(it =>
        `<circle cx="${CX}" cy="${it.py}" r="5" fill="url(#la-pg-tl)"/>`
    ).join('');

    stack.innerHTML = `<div class="la-tl"><div class="la-tl-wrap">
        <svg class="la-tl-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" overflow="hidden">
            <defs>
                <linearGradient id="la-pg-tl" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stop-color="#4a8ab8" stop-opacity="1"/>
                    <stop offset="50%"  stop-color="#2668a0" stop-opacity="1"/>
                    <stop offset="100%" stop-color="#1a4a7a" stop-opacity="1"/>
                </linearGradient>
            </defs>
            <line x1="${CX}" y1="${firstPy}" x2="${CX}" y2="${lastPy}"
                  stroke="url(#la-pg-tl)" stroke-width="1.5" stroke-linecap="round"/>
            ${svgNodes}
        </svg>
        ${anchors}
        ${nodeEls}
    </div></div>`;

    lucide.createIcons();
}

function renderAllPilares() {
    renderTimeline();
}

function _scrollToSec(name, smooth) {
    const el = document.getElementById('la-sec-' + name);
    const scroll = el && el.closest('.pp-panel-scroll');
    if (!el || !scroll) return;
    const top = el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
    scroll.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}

function irSecao(name) {
    const order = ['como-estou', 'registros', 'evolucao', 'historia'];
    document.querySelectorAll('.pp-tl-item').forEach((it, i) =>
        it.classList.toggle('pp-tl-at', order[i] === name)
    );
    // mostra a seção ativa, esconde as demais
    order.forEach(s => {
        const el = document.getElementById('pp-sec-' + s);
        if (el) el.style.display = s === name ? '' : 'none';
    });
    if (name === 'historia') {
        const cards = document.getElementById('pp-content-cards');
        if (cards && !cards.hasChildNodes()) renderTimeline();
    }
    if (name === 'registros') renderRegistros();
    if (name === 'como-estou') setTimeout(desenharLinhaConexao, 80);
    lucide.createIcons();
}

function desenharLinhaConexao() {
    const board = document.querySelector('.ce-board');
    if (!board) return;
    const old = board.querySelector('.ce-svg-linha');
    if (old) old.remove();
    const pins = board.querySelectorAll('.ce-pin3d');
    if (pins.length < 2) return;
    const bRect = board.getBoundingClientRect();
    const pts = Array.from(pins).map(p => {
        const r = p.getBoundingClientRect();
        return { x: r.left + r.width / 2 - bRect.left, y: r.top + r.height / 2 - bRect.top };
    });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('ce-svg-linha');
    svg.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible');
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(30,58,71,0.2)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '6 5');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    board.insertBefore(svg, board.firstChild);
}
let _linhaTimer;
window.addEventListener('resize', () => { clearTimeout(_linhaTimer); _linhaTimer = setTimeout(desenharLinhaConexao, 150); });

/* ── dados dos painéis de expansão ── */
const _EXP_DATA = {
    'pp-expand-familia': [
        { label: '', items: [
            { icon: 'utensils', nome: 'Alimentação e Afeto',   fn: "abrirForm('ff-alimentacao')" },
            { icon: 'calendar', nome: 'Autonomia e Rotina',    fn: "abrirForm('ff-rotina')" },
            { icon: 'heart',    nome: 'Interesses e Conforto', fn: "abrirForm('ff-interesses')" },
            { icon: 'phone',    nome: 'Rede de Apoio',         fn: "abrirForm('ff-apoio')" },
        ]},
    ],
    'pp-expand-saude': [
        { label: '', items: [
            { icon: 'user-check', nome: 'Especialistas',          fn: "abrirForm('fs-especialista')" },
            { icon: 'activity',   nome: 'Histórico de Consultas', fn: "abrirForm('fs-consulta')" },
            { icon: 'pill',       nome: 'Medicamentos',           fn: "abrirForm('fs-medicamento')" },
            { icon: 'zap',        nome: 'Protocolo de Crise',     fn: "abrirForm('fs-crise')" },
        ]},
    ],
    'pp-expand-terapia': [
        { label: 'Equipe', items: [
            { icon: 'brain',          nome: 'Profissionais e Clínicas', fn: "abrirForm('ft-profissional')" },
            { icon: 'clipboard-list', nome: 'Metodologias Aplicadas',   fn: "abrirForm('ft-metodologia')" },
            { icon: 'target',         nome: 'Plano Terapêutico',        fn: "abrirForm('ft-plano')" },
            { icon: 'calendar-check', nome: 'Registro de Sessão',       fn: "abrirForm('ft-sessao')" },
        ]},
        { label: 'Evolução', items: [
            { icon: 'sparkles',    nome: 'Conquistas e Marcos', fn: "abrirForm('ft-conquista')" },
            { icon: 'trending-up', nome: 'Evolução Periódica',  fn: "abrirForm('ft-evolucao')" },
        ]},
    ],
    /* ── Caminho ── */
    'pp-expand-vida': [
        { label: '', items: [
            { icon: 'droplets',  nome: 'Higiene e Autocuidado',       fn: "abrirForm('fn2-higiene')" },
            { icon: 'utensils',  nome: 'Alimentação Independente',    fn: "abrirForm('fn2-alimentacao')" },
            { icon: 'clock',     nome: 'Rotina do Dia',               fn: "abrirForm('fn2-rotina')" },
            { icon: 'star',      nome: 'Nova Habilidade',             fn: "abrirForm('fn2-habilidade')" },
        ]},
    ],
    'pp-expand-social': [
        { label: '', items: [
            { icon: 'users',          nome: 'Interação com Par',          fn: "abrirForm('fn2-interacao')" },
            { icon: 'map-pin',        nome: 'Situação Social Nova',       fn: "abrirForm('fn2-situacao')" },
            { icon: 'message-circle', nome: 'Comunicação Espontânea',     fn: "abrirForm('fn2-comunicacao')" },
            { icon: 'heart',          nome: 'Vínculo Afetivo',            fn: "abrirForm('fn2-vinculo-social')" },
        ]},
    ],
    'pp-expand-regulacao': [
        { label: '', items: [
            { icon: 'heart',   nome: 'Estado Emocional',           fn: "abrirForm('fn2-emocional')" },
            { icon: 'shield',  nome: 'Estratégia que Funcionou',   fn: "abrirForm('fn2-estrategia')" },
            { icon: 'zap',     nome: 'Momento Desafiador',         fn: "abrirForm('fn2-desafio')" },
            { icon: 'battery', nome: 'Nível de Energia',           fn: "abrirForm('fn2-energia')" },
        ]},
    ],
    'pp-expand-decisao': [
        { label: '', items: [
            { icon: 'lightbulb',    nome: 'Decisão Tomada',    fn: "abrirForm('fn2-decisao')" },
            { icon: 'help-circle',  nome: 'Pediu Ajuda',       fn: "abrirForm('fn2-ajuda')" },
            { icon: 'check-circle', nome: 'Escolha Própria',   fn: "abrirForm('fn2-escolha')" },
            { icon: 'rocket',       nome: 'Iniciativa Própria',fn: "abrirForm('fn2-iniciativa')" },
        ]},
    ],
    /* ── Topo ── */
    'pp-expand-independencia': [
        { label: '', items: [
            { icon: 'flag',         nome: 'Marco de Independência', fn: "abrirForm('fn3-marco')" },
            { icon: 'check-square', nome: 'Tarefa Sozinho',         fn: "abrirForm('fn3-tarefa')" },
            { icon: 'trending-up',  nome: 'Superação do Dia',       fn: "abrirForm('fn3-superacao')" },
            { icon: 'trophy',       nome: 'Conquista Semanal',      fn: "abrirForm('fn3-conquista-ind')" },
        ]},
    ],
    'pp-expand-participacao': [
        { label: '', items: [
            { icon: 'calendar',  nome: 'Evento ou Atividade',       fn: "abrirForm('fn3-evento')" },
            { icon: 'user-plus', nome: 'Novo Vínculo Social',       fn: "abrirForm('fn3-vinculo')" },
            { icon: 'globe',     nome: 'Contribuição Comunitária',  fn: "abrirForm('fn3-contribuicao')" },
            { icon: 'users',     nome: 'Liderança em Grupo',        fn: "abrirForm('fn3-lideranca')" },
        ]},
    ],
    'pp-expand-autonomia': [
        { label: '', items: [
            { icon: 'lightbulb',      nome: 'Decisão Autônoma',    fn: "abrirForm('fn3-decisao-aut')" },
            { icon: 'puzzle',         nome: 'Problema Resolvido',  fn: "abrirForm('fn3-problema')" },
            { icon: 'clipboard-list', nome: 'Planejou e Executou', fn: "abrirForm('fn3-planejou')" },
            { icon: 'refresh-cw',     nome: 'Adaptação a Mudança', fn: "abrirForm('fn3-adaptacao')" },
        ]},
    ],
    'pp-expand-proposito': [
        { label: '', items: [
            { icon: 'star',  nome: 'Sonho ou Meta',        fn: "abrirForm('fn3-sonho')" },
            { icon: 'award', nome: 'Ato de Protagonismo',  fn: "abrirForm('fn3-protagonismo')" },
            { icon: 'sun',   nome: 'Inspirou Alguém',      fn: "abrirForm('fn3-inspirou')" },
            { icon: 'medal', nome: 'Conquista Pessoal',    fn: "abrirForm('fn3-conquista-pes')" },
        ]},
    ],
    /* ── Essência ── */
    'pp-expand-alegria': [
        { label: '', items: [
            { icon: 'sun',      nome: 'Momento de Alegria',   fn: "abrirForm('fes-momento')" },
            { icon: 'heart',    nome: 'O Que Acalma',         fn: "abrirForm('fes-acalma')" },
            { icon: 'star',     nome: 'Preferência Revelada', fn: "abrirForm('fes-preferencia')" },
            { icon: 'sparkles', nome: 'Gratidão do Dia',      fn: "abrirForm('fes-gratidao')" },
        ]},
    ],
    'pp-expand-rotina-cuidado': [
        { label: '', items: [
            { icon: 'check-circle', nome: 'Etapa que Funcionou',  fn: "abrirForm('fes-passo')" },
            { icon: 'settings-2',   nome: 'Adaptação Necessária', fn: "abrirForm('fes-adaptacao')" },
            { icon: 'trophy',       nome: 'Conquista na Rotina',  fn: "abrirForm('fes-conquista-rotina')" },
            { icon: 'zap',          nome: 'Momento Difícil',      fn: "abrirForm('fes-desafio-rotina')" },
        ]},
    ],
    'pp-expand-protocolo': [
        { label: '', items: [
            { icon: 'alert-circle', nome: 'Sinal de Alerta',         fn: "abrirForm('fes-alerta')" },
            { icon: 'shield-check', nome: 'Estratégia que Funciona', fn: "abrirForm('fes-estrategia')" },
            { icon: 'file-text',    nome: 'Instrução de Cuidado',    fn: "abrirForm('fes-instrucao')" },
            { icon: 'phone',        nome: 'Contato de Emergência',   fn: "abrirForm('fes-contato')" },
        ]},
    ],
    'pp-expand-rede-cuidado': [
        { label: '', items: [
            { icon: 'user-heart',  nome: 'Quem Cuida',                 fn: "abrirForm('fes-cuidador')" },
            { icon: 'stethoscope', nome: 'Profissional de Referência', fn: "abrirForm('fes-profissional')" },
            { icon: 'handshake',   nome: 'Momento de Apoio',           fn: "abrirForm('fes-apoio')" },
            { icon: 'globe',       nome: 'Rede de Apoio Futuro',       fn: "abrirForm('fes-futuro-rede')" },
        ]},
    ],
};

function _renderExpPanel(panelId, tabIdx) {
    const tabs = _EXP_DATA[panelId];
    const pct = 100 / tabs.length;
    const tabBar = tabs.length > 1 ? `
        <div class="pp-exp-tabs-wrap">
            <div class="pp-exp-slider" style="width:${pct}%;transform:translateX(${tabIdx * 100}%)"></div>
            ${tabs.map((t, i) =>
                `<button class="pp-exp-tab${i===tabIdx?' at':''}" onclick="_mudarExpTab('${panelId}',${i})">${t.label}</button>`
            ).join('')}
        </div>` : '';
    const items = tabs[tabIdx].items.map(it =>
        `<div class="pp-exp-item" onclick="${it.fn}">
            <div class="pp-exp-ico"><i data-lucide="${it.icon}" style="width:16px;height:16px;stroke-width:1.5"></i></div>
            <span class="pp-exp-nome">${it.nome}</span>
            <i data-lucide="chevron-right" style="width:14px;height:14px;stroke:rgba(26,58,92,.25);stroke-width:2;flex-shrink:0"></i>
        </div>`
    ).join('');
    return `${tabBar}<div class="pp-exp-body">${items}</div>`;
}

function _mudarExpTab(panelId, idx) {
    const panel = document.getElementById(panelId);
    if (panel) { panel.innerHTML = _renderExpPanel(panelId, idx); lucide.createIcons(); }
}

function _expandirCard(el, panelId) {
    const existing = document.getElementById(panelId);
    if (existing) { existing.remove(); el.classList.remove('expandido'); return; }
    document.querySelectorAll('.pp-panel-card.expandido').forEach(c => {
        c.classList.remove('expandido');
        if (c.nextElementSibling?.classList.contains('pp-expand-panel')) c.nextElementSibling.remove();
    });
    el.classList.add('expandido');
    const div = document.createElement('div');
    div.id = panelId;
    div.className = 'pp-expand-panel';
    div.innerHTML = _renderExpPanel(panelId, 0);
    el.insertAdjacentElement('afterend', div);
    lucide.createIcons();
}

const EDU_TABS = [
    { label: '🏫 Matriculado', items: [
        { icon: 'school',         nome: 'Escolas e Instituições',    formId: 'form-escola' },
        { icon: 'users',          nome: 'Mediadores e Professores',  formId: 'form-mediador' },
        { icon: 'file-text',      nome: 'Plano de Ensino Individual',formId: 'form-pei' },
        { icon: 'star',           nome: 'Conquistas e Marcos',       formId: 'form-conquista' },
    ]},
    { label: '⏳ Fora da escola', items: [
        { icon: 'alert-triangle', nome: 'Motivo do Afastamento',     formId: 'form-barreira' },
        { icon: 'clock',          nome: 'Lacuna Escolar',            formId: 'form-lacuna' },
        { icon: 'sun',            nome: 'Atividades do Dia a Dia',   formId: 'form-ativ-diaria' },
        { icon: 'award',          nome: 'Marcos de Autonomia',       formId: 'form-avd' },
    ]},
    { label: '🏠 Adaptado', items: [
        { icon: 'home',           nome: 'Local / Instituição',       formId: 'form-escola' },
        { icon: 'users',          nome: 'Educadores e Facilitadores',formId: 'form-mediador' },
        { icon: 'sun',            nome: 'Plano de Atividades',       formId: 'form-ativ-diaria' },
        { icon: 'star',           nome: 'Conquistas e Marcos',       formId: 'form-conquista' },
    ]},
];

/* Rola o card aberto para ficar visível abaixo do header sticky */
function _ppScrollCardEmView(el) {
    setTimeout(() => {
        const scroll = document.querySelector('.pp-panel-scroll');
        const header = document.querySelector('.pp-pc-top');
        if (!scroll || !el) return;
        const headerBottom = header ? header.getBoundingClientRect().bottom : 80;
        const cardTop = el.getBoundingClientRect().top;
        if (cardTop < headerBottom + 8) {
            scroll.scrollBy({ top: cardTop - headerBottom - 8, behavior: 'smooth' });
        }
    }, 60);
}

function abrirCardEdu(el) {
    if (el.classList.contains('edu-aberto')) {
        el.classList.remove('edu-aberto');
        return;
    }
    document.querySelectorAll('.pp-panel-card.card-aberto').forEach(c => c.classList.remove('card-aberto'));
    el.classList.add('edu-aberto');
    if (!el.querySelector('.edu-exp-wrap')) _renderEduContent(el, 0);
    _ppScrollCardEmView(el);
}

function _abrirCardGeneric(el, panelId) {
    if (el.classList.contains('card-aberto')) {
        el.classList.remove('card-aberto');
        return;
    }
    const eduCard = document.getElementById('card-edu');
    if (eduCard?.classList.contains('edu-aberto')) eduCard.classList.remove('edu-aberto');
    document.querySelectorAll('.pp-panel-card.card-aberto').forEach(c => c.classList.remove('card-aberto'));
    el.classList.add('card-aberto');
    if (!el.querySelector('.edu-exp-wrap')) _renderCardGeneric(el, panelId, 0);
    _ppScrollCardEmView(el);
}

function _renderCardGeneric(cardEl, panelId, tabIdx) {
    const oldWrap = cardEl.querySelector('.edu-exp-wrap');
    if (oldWrap) oldWrap.remove();
    const tabs = _EXP_DATA[panelId];
    if (!tabs) return;
    const tabBar = tabs.length > 1 ? `
        <div class="edu-tabs-bar">
            ${tabs.map((t, i) =>
                `<button class="edu-tab-btn${i===tabIdx?' ativo':''}" onclick="event.stopPropagation();_renderCardGeneric(this.closest('.pp-panel-card'),'${panelId}',${i})">${t.label}</button>`
            ).join('')}
        </div>` : '';
    const itemsHtml = tabs[tabIdx].items.map(it =>
        `<div class="edu-item" onclick="event.stopPropagation();${it.fn}">
            <div class="edu-item-header">
                <div class="edu-item-ico"><i data-lucide="${it.icon}" style="width:16px;height:16px;stroke:white;stroke-width:1.5"></i></div>
                <span class="edu-item-nome">${it.nome}</span>
                <i data-lucide="chevron-right" class="edu-item-chevron" style="width:15px;height:15px;stroke-width:2;flex-shrink:0"></i>
            </div>
        </div>`
    ).join('');
    const wrap = document.createElement('div');
    wrap.className = 'edu-exp-wrap';
    wrap.innerHTML = tabBar + itemsHtml;
    cardEl.appendChild(wrap);
    lucide.createIcons();
}

function abrirCardFamilia(el) { _abrirCardGeneric(el, 'pp-expand-familia'); }
function abrirCardSaude(el)   { _abrirCardGeneric(el, 'pp-expand-saude'); }
function abrirCardTerapia(el) { _abrirCardGeneric(el, 'pp-expand-terapia'); }

/* ── Novos cards Educação ── */
function _abrirCardSimples(el) {
    if (el.classList.contains('card-aberto')) { el.classList.remove('card-aberto'); return; }
    const eduCard = document.getElementById('card-edu');
    if (eduCard?.classList.contains('edu-aberto')) eduCard.classList.remove('edu-aberto');
    document.querySelectorAll('.pp-panel-card.card-aberto').forEach(c => c.classList.remove('card-aberto'));
    el.classList.add('card-aberto');
    _ppScrollCardEmView(el);
}
function abrirCardTrajetoria(el)  { _abrirCardSimples(el); }
function abrirCardAprendizado(el) { _abrirCardSimples(el); }
function abrirCardSuporte(el)     { _abrirCardSimples(el); }
function abrirCardVidaAlem(el)    { _abrirCardSimples(el); }

/* ── 5º card: Mensagem — expansão inline com lista de profissionais ── */
function abrirCardMensagem(el, area) {
    if (el.classList.contains('card-aberto')) {
        el.classList.remove('card-aberto');
        const w = el.querySelector('.edu-exp-wrap');
        if (w) w.remove();
        return;
    }
    const eduCard = document.getElementById('card-edu');
    if (eduCard?.classList.contains('edu-aberto')) eduCard.classList.remove('edu-aberto');
    document.querySelectorAll('.pp-panel-card.card-aberto').forEach(c => {
        c.classList.remove('card-aberto');
        const w = c.querySelector('.edu-exp-wrap');
        if (w) w.remove();
    });
    el.classList.add('card-aberto');

    const cor = MSG_CORES[area];
    const wrap = document.createElement('div');
    wrap.className = 'edu-exp-wrap';
    wrap.innerHTML = MSG_CATALOGO[area].map(item => `
        <div class="edu-item" style="display:flex;align-items:center;justify-content:space-between;padding:13px 26px;cursor:pointer" onclick="event.stopPropagation();abrirChatArea('${area}','${item.id}')">
            <span style="font-family:var(--ft);font-size:.82rem;font-weight:600;color:rgba(255,255,255,.88)">${item.nome}</span>
            <div style="width:30px;height:30px;border-radius:8px;background:${cor.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i data-lucide="${item.icon}" style="width:15px;height:15px;stroke:${cor.hex};stroke-width:1.6"></i>
            </div>
        </div>`).join('');
    el.appendChild(wrap);
    lucide.createIcons();
    _ppScrollCardEmView(el);
}

let _chatReturnArea = null;
const _AREA_TAB_IDX = { educacao: 0, familia: 1, saude: 2, terapia: 3 };

function abrirChatArea(area, sala) {
    document.querySelectorAll('.pp-panel-card.card-aberto').forEach(c => {
        c.classList.remove('card-aberto');
        const w = c.querySelector('.edu-exp-wrap');
        if (w) w.remove();
    });
    const laContainer = document.getElementById('com-input-la');
    if (laContainer) laContainer.innerHTML = '';
    _comDirecto = true;
    _chatReturnArea = area;
    _sheetArea = area;
    setTimeout(() => _SHEET_FN[area](sala), 60);
}

function _renderEduContent(cardEl, tabIdx) {
    const oldWrap = cardEl.querySelector('.edu-exp-wrap');
    if (oldWrap) oldWrap.remove();
    const tabsHtml = `
        <div class="edu-tabs-bar">
            ${EDU_TABS.map((t, i) =>
                `<button class="edu-tab-btn${i===tabIdx?' ativo':''}" onclick="event.stopPropagation();_renderEduContent(this.closest('.pp-panel-card'),${i})">${t.label}</button>`
            ).join('')}
        </div>`;
    const itemsHtml = EDU_TABS[tabIdx].items.map(it =>
        `<div class="edu-item" onclick="event.stopPropagation();_toggleEduItem(this,'${it.formId}')">
            <div class="edu-item-header">
                <div class="edu-item-ico"><i data-lucide="${it.icon}" style="width:16px;height:16px;stroke:white;stroke-width:1.5"></i></div>
                <span class="edu-item-nome">${it.nome}</span>
                <i data-lucide="chevron-right" class="edu-item-chevron" style="width:15px;height:15px;stroke-width:2;flex-shrink:0"></i>
            </div>
            <div class="edu-item-body"></div>
        </div>`
    ).join('');
    const wrap = document.createElement('div');
    wrap.className = 'edu-exp-wrap';
    wrap.innerHTML = tabsHtml + itemsHtml;
    cardEl.appendChild(wrap);
    lucide.createIcons();
}

function _toggleEduItem(itemEl, formId) {
    const isOpen = itemEl.classList.contains('aberto');
    itemEl.closest('.edu-exp-wrap').querySelectorAll('.edu-item.aberto').forEach(it => it.classList.remove('aberto'));
    if (isOpen) return;
    const body = itemEl.querySelector('.edu-item-body');
    if (!body.innerHTML.trim()) {
        const formEl = document.getElementById(formId);
        if (!formEl) return;
        let uid = Date.now();
        formEl.querySelectorAll('.fblock').forEach(bl => {
            const clone = bl.cloneNode(true);
            const idMap = {};
            clone.querySelectorAll('[id]').forEach(el => {
                const newId = el.id + '_ei' + uid++;
                idMap[el.id] = newId;
                el.id = newId;
            });
            clone.querySelectorAll('[for]').forEach(el => {
                const orig = el.getAttribute('for');
                if (idMap[orig]) el.setAttribute('for', idMap[orig]);
            });
            body.appendChild(clone);
        });
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-salvar';
        saveBtn.textContent = 'SALVAR';
        saveBtn.onclick = e => { e.stopPropagation(); salvarEduItem(formId, body); };
        body.appendChild(saveBtn);
        lucide.createIcons();
    }
    itemEl.classList.add('aberto');
}

function salvarEduItem(formId, bodyEl) {
    const campos = {};
    bodyEl.querySelectorAll('.fin, .fsel').forEach(el => {
        const label = el.closest('.frow')?.querySelector('.fla')?.textContent
                   || el.closest('.frow2 > div')?.querySelector('.fla')?.textContent || '';
        if (el.value.trim() && label) campos[label] = el.value.trim();
    });
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.educacao) d.educacao = {};
    if (!d.educacao[formId]) d.educacao[formId] = [];
    d.educacao[formId].push({ campos, data: new Date().toISOString(), pilar: 'educacao' });
    localStorage.setItem('la', JSON.stringify(d));
    atuConts();
    mostrarToast('✅ Registro salvo');
    bodyEl.querySelectorAll('.fin').forEach(el => { el.value = ''; });
}

function expandirCardFamilia(el)   { _expandirCard(el, 'pp-expand-familia'); }
function expandirCardSaude(el)     { _expandirCard(el, 'pp-expand-saude'); }
function expandirCardTerapia(el)   { _expandirCard(el, 'pp-expand-terapia'); }
function abrirCardVida(el)           { _abrirCardGeneric(el, 'pp-expand-vida'); }
function abrirCardSocial(el)         { _abrirCardGeneric(el, 'pp-expand-social'); }
function abrirCardRegulacao(el)      { _abrirCardGeneric(el, 'pp-expand-regulacao'); }
function abrirCardDecisao(el)        { _abrirCardGeneric(el, 'pp-expand-decisao'); }
function abrirCardIndependencia(el)  { _abrirCardGeneric(el, 'pp-expand-independencia'); }
function abrirCardParticipacao(el)   { _abrirCardGeneric(el, 'pp-expand-participacao'); }
function abrirCardAutonomia(el)      { _abrirCardGeneric(el, 'pp-expand-autonomia'); }
function abrirCardProposito(el)      { _abrirCardGeneric(el, 'pp-expand-proposito'); }
function abrirCardAlegria(el)        { _abrirCardGeneric(el, 'pp-expand-alegria'); }
function abrirCardRotinaCuidado(el)  { _abrirCardGeneric(el, 'pp-expand-rotina-cuidado'); }
function abrirCardProtocolo(el)      { _abrirCardGeneric(el, 'pp-expand-protocolo'); }
function abrirCardRede(el)           { _abrirCardGeneric(el, 'pp-expand-rede-cuidado'); }
const FE_FIXOS = [
    { icon: 'palette',  txt: 'Cursos e Atividades',      fn: "abrirSubtela('tela-fe-comunicacao')" },
    { icon: 'star',     txt: 'Conquistas e Marcos',       fn: "abrirSubtela('tela-fe-conquistas')" },
    { icon: 'sprout',   txt: 'Vida além da Sala de Aula', fn: "abrirSubtela('tela-fe-vida-alem')"   },
];
const FE_OPCIONALS = [
    { id: 'fe-documentos', icon: 'folder-open', txt: 'Documentos',              fn: "abrirAprendizado()" },
    { id: 'fe-mediadores', icon: 'users',        txt: 'Mediadores e Professores', fn: "abrirSubtela('tela-fe-mediadores')" },
    { id: 'fe-pei',        icon: 'file-text',    txt: 'Plano Educacional',       fn: "abrirSubtela('tela-fe-pei')" },
    { id: 'fe-relatorios', icon: 'file-check',   txt: 'Relatórios',              fn: "abrirSubtela('tela-fe-avaliacoes')" },
    { id: 'fe-suporte',    icon: 'shield',        txt: 'Suporte Escolar',         fn: "abrirSubtela('tela-fe-suporte')" },
    { id: 'fe-trajetoria', icon: 'milestone',     txt: 'Trajetória Escolar',      fn: "abrirSubtela('tela-fe-trajetoria')" },
];
function getEducacaoCards() {
    const hab = JSON.parse(localStorage.getItem('la_fe_opcionais') || '[]');
    const msg = { icon: 'message-circle', txt: 'Mensagens', fn: "abrirComunicacao('educacao')", id: 'card-mensagem' };
    return [...FE_FIXOS, ...FE_OPCIONALS.filter(c => hab.includes(c.id)), msg]
        .sort((a, b) => a.txt.localeCompare(b.txt, 'pt-BR'));
}
function toggleCardFe(cb) {
    const hab = JSON.parse(localStorage.getItem('la_fe_opcionais') || '[]');
    if (cb.checked) { if (!hab.includes(cb.id)) hab.push(cb.id); }
    else { const i = hab.indexOf(cb.id); if (i > -1) hab.splice(i, 1); }
    localStorage.setItem('la_fe_opcionais', JSON.stringify(hab));
}
function abrirConfigEducacao() {
    const hab = JSON.parse(localStorage.getItem('la_fe_opcionais') || '[]');
    FE_OPCIONALS.forEach(c => { const el = document.getElementById(c.id); if (el) el.checked = hab.includes(c.id); });
    abrirSubtela('tela-fe-config');
}
function fecharConfigEducacao() {
    irAnterior();
    renderAllPilares();
}

const FF_FIXOS = [
    { icon: 'home',      txt: 'Conquistas em Casa',     fn: "abrirSubtela('ff-conquistas')" },
    { icon: 'book-open', txt: 'Registros do Dia a Dia', fn: "abrirSubtela('ff-registros')"  },
];
const FF_OPCIONALS = [
    { id: 'ff-opt-alimentacao', icon: 'utensils',  txt: 'Alimentação e Afeto',     fn: "abrirSubtela('ff-alimentacao')" },
    { id: 'ff-opt-rotina',      icon: 'calendar',  txt: 'Autonomia e Rotina',      fn: "abrirSubtela('ff-rotina')" },
    { id: 'ff-opt-comunicacao', icon: 'mic',       txt: 'Comunicação e Expressão', fn: "abrirSubtela('ff-comunicacao')" },
    { id: 'ff-opt-dinamica',    icon: 'heart',     txt: 'Dinâmica Familiar',       fn: "abrirSubtela('ff-dinamica')" },
    { id: 'ff-opt-interesses',  icon: 'smile',     txt: 'Interesses e Conforto',   fn: "abrirSubtela('ff-interesses')" },
    { id: 'ff-opt-lazer',       icon: 'sun',       txt: 'Momentos de Lazer',       fn: "abrirSubtela('ff-lazer')" },
    { id: 'ff-opt-apoio',       icon: 'users',     txt: 'Rede de Apoio',           fn: "abrirSubtela('ff-apoio')" },
];
function getFamiliaCards() {
    const hab = JSON.parse(localStorage.getItem('la_ff_opcionais') || '[]');
    const msg = { icon: 'message-circle', txt: 'Mensagens', fn: "abrirComunicacao('familia')", id: 'card-mensagem' };
    return [...FF_FIXOS, ...FF_OPCIONALS.filter(c => hab.includes(c.id)), msg]
        .sort((a, b) => a.txt.localeCompare(b.txt, 'pt-BR'));
}
function toggleCardFf(cb) {
    const hab = JSON.parse(localStorage.getItem('la_ff_opcionais') || '[]');
    if (cb.checked) { if (!hab.includes(cb.id)) hab.push(cb.id); }
    else { const i = hab.indexOf(cb.id); if (i > -1) hab.splice(i, 1); }
    localStorage.setItem('la_ff_opcionais', JSON.stringify(hab));
}
function abrirConfigFamilia() {
    const hab = JSON.parse(localStorage.getItem('la_ff_opcionais') || '[]');
    FF_OPCIONALS.forEach(c => { const el = document.getElementById(c.id); if (el) el.checked = hab.includes(c.id); });
    abrirSubtela('tela-ff-config');
}
function fecharConfigFamilia() { irAnterior(); renderAllPilares(); }

const FS_FIXOS = [
    { icon: 'clipboard', txt: 'Diagnósticos e Laudos', fn: "abrirSubtela('fs-diagnostico')" },
    { icon: 'pill',      txt: 'Medicamentos',           fn: "abrirSubtela('fs-medicamento')" },
];
const FS_OPCIONALS = [
    { id: 'fs-opt-especialista', icon: 'user-check',     txt: 'Especialistas e Equipe',  fn: "abrirSubtela('fs-especialista')" },
    { id: 'fs-opt-consulta',     icon: 'activity',       txt: 'Histórico de Consultas',  fn: "abrirSubtela('fs-consulta')" },
    { id: 'fs-opt-crise',        icon: 'zap',            txt: 'Protocolo de Crise',      fn: "abrirSubtela('fs-crise')" },
    { id: 'fs-opt-nutricao',     icon: 'apple',          txt: 'Nutrição',                fn: "abrirSubtela('fs-nutricao')" },
    { id: 'fs-opt-saude-mental', icon: 'brain',          txt: 'Saúde Mental',            fn: "abrirSubtela('fs-saude-mental')" },
    { id: 'fs-opt-sono',         icon: 'moon',           txt: 'Sono e Bem-estar',        fn: "abrirSubtela('fs-sono')" },
    { id: 'fs-opt-vacinas',      icon: 'syringe',        txt: 'Vacinas e Exames',        fn: "abrirSubtela('fs-vacinas')" },
];
function getSaudeCards() {
    const hab = JSON.parse(localStorage.getItem('la_fs_opcionais') || '[]');
    const msg = { icon: 'message-circle', txt: 'Mensagens', fn: "abrirComunicacao('saude')", id: 'card-mensagem' };
    return [...FS_FIXOS, ...FS_OPCIONALS.filter(c => hab.includes(c.id)), msg]
        .sort((a, b) => a.txt.localeCompare(b.txt, 'pt-BR'));
}
function toggleCardFs(cb) {
    const hab = JSON.parse(localStorage.getItem('la_fs_opcionais') || '[]');
    if (cb.checked) { if (!hab.includes(cb.id)) hab.push(cb.id); }
    else { const i = hab.indexOf(cb.id); if (i > -1) hab.splice(i, 1); }
    localStorage.setItem('la_fs_opcionais', JSON.stringify(hab));
}
function abrirConfigSaude() {
    const hab = JSON.parse(localStorage.getItem('la_fs_opcionais') || '[]');
    FS_OPCIONALS.forEach(c => { const el = document.getElementById(c.id); if (el) el.checked = hab.includes(c.id); });
    abrirSubtela('tela-fs-config');
}
function fecharConfigSaude() { irAnterior(); renderAllPilares(); }

const PP_PANEL_DATA = [
    [], // Educação — gerenciado via FE_FIXOS + FE_OPCIONALS
    [], // Família  — gerenciado via FF_FIXOS + FF_OPCIONALS
    [], // Saúde    — gerenciado via FS_FIXOS + FS_OPCIONALS
    [], // Terapia — gerenciado via FT_FIXOS + FT_OPCIONALS
];

const FT_FIXOS = [
    { icon: 'ear',   txt: 'Fonoaudiologia',     fn: "abrirSubtela('ft-fono')" },
    { icon: 'brain', txt: 'Psicologia',          fn: "abrirSubtela('ft-psicologia')" },
    { icon: 'hand',  txt: 'Terapia Ocupacional', fn: "abrirSubtela('ft-to')" },
];
const FT_OPCIONALS = [
    { id: 'ft-opt-aba',            icon: 'repeat',        txt: 'ABA',                       fn: "abrirSubtela('ft-aba')" },
    { id: 'ft-opt-arteterapia',    icon: 'palette',       txt: 'Arteterapia',               fn: "abrirSubtela('ft-arteterapia')" },
    { id: 'ft-opt-equo',           icon: 'waves',         txt: 'Equoterapia e Hidroterapia', fn: "abrirSubtela('ft-equo')" },
    { id: 'ft-opt-fisio',          icon: 'biceps-flexed', txt: 'Fisioterapia',               fn: "abrirSubtela('ft-fisio')" },
    { id: 'ft-opt-musico',         icon: 'music',         txt: 'Musicoterapia',              fn: "abrirSubtela('ft-musico')" },
    { id: 'ft-opt-psicopedagogia', icon: 'book-open',     txt: 'Psicopedagogia',             fn: "abrirSubtela('ft-psicopedagogia')" },
    { id: 'ft-opt-nutricao',       icon: 'apple',         txt: 'Terapia Nutricional',        fn: "abrirSubtela('ft-nutricao')" },
];
function getTerapiaCards() {
    const hab = JSON.parse(localStorage.getItem('la_ft_opcionais') || '[]');
    const msg = { icon: 'message-circle', txt: 'Mensagens', fn: "abrirComunicacao('terapia')", id: 'card-mensagem' };
    return [...FT_FIXOS, ...FT_OPCIONALS.filter(c => hab.includes(c.id)), msg]
        .sort((a, b) => a.txt.localeCompare(b.txt, 'pt-BR'));
}
function toggleCardFt(cb) {
    const hab = JSON.parse(localStorage.getItem('la_ft_opcionais') || '[]');
    if (cb.checked) { if (!hab.includes(cb.id)) hab.push(cb.id); }
    else { const i = hab.indexOf(cb.id); if (i > -1) hab.splice(i, 1); }
    localStorage.setItem('la_ft_opcionais', JSON.stringify(hab));
}
function abrirConfigTerapia() {
    const hab = JSON.parse(localStorage.getItem('la_ft_opcionais') || '[]');
    FT_OPCIONALS.forEach(c => { const el = document.getElementById(c.id); if (el) el.checked = hab.includes(c.id); });
    abrirSubtela('tela-ft-config');
}
function fecharConfigTerapia() { irAnterior(); renderAllPilares(); }

function selecionarNivelTab(idx) {
    const cores = ['#72C8EC', '#3D9EC9', '#1F7BAA', '#1a3a5c'];
    const cardCores = ['pp-pc-1', 'pp-pc-2', 'pp-pc-3', 'pp-pc-4'];
    const areaMap = ['educacao', 'familia', 'saude', 'terapia'];
    const slider = document.getElementById('pp-nivel-slider');
    if (slider) {
        slider.style.transform = `translateX(${idx * 100}%)`;
        slider.style.background = cores[idx];
    }
    document.querySelectorAll('#pp-nivel-tabs .pp-nivel-tab').forEach((t, i) =>
        t.classList.toggle('pp-nivel-tab-at', i === idx)
    );
    const stack = document.getElementById('pp-content-cards');
    if (!stack) return;
    const area = areaMap[idx];

    const allCards = idx === 0 ? getEducacaoCards()
        : idx === 1 ? getFamiliaCards()
        : idx === 2 ? getSaudeCards()
        : idx === 3 ? getTerapiaCards()
        : [...PP_PANEL_DATA[idx], { icon:'message-circle', txt:'Mensagens', fn:`abrirComunicacao('${area}')`, id:'card-mensagem' }];
    stack.innerHTML = allCards.map((c, i) => {
        const idAttr = c.id ? `id="${c.id}"` : '';
        const cor = cardCores[i % cardCores.length];
        return `
            <div class="pp-panel-card ${cor}" ${idAttr} onclick="${c.fn}">
                <div class="pp-card-row">
                    <div class="pp-card-ico"><i data-lucide="${c.icon}"></i></div>
                    <span class="pp-card-txt">${c.txt}</span>
                </div>
            </div>`;
    }).join('');
    lucide.createIcons();

}

function initCardsHoverScroll() {
    const el = document.getElementById('pp-content-cards');
    if (!el) return;

    let target = 0;
    let current = 0;
    let raf = null;
    let active = false;

    function tick() {
        current += (target - current) * 0.08;
        el.scrollLeft = current;
        if (Math.abs(target - current) > 0.3) {
            raf = requestAnimationFrame(tick);
        } else {
            el.scrollLeft = target;
            raf = null;
        }
    }

    function startAnim() {
        if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(x) {
        if (!active) return;
        const rect = el.getBoundingClientRect();
        const relX = Math.max(0, Math.min(x - rect.left, rect.width));
        const pct = relX / rect.width;
        const max = el.scrollWidth - el.clientWidth;
        target = pct * max;
        current = el.scrollLeft;
        startAnim();
    }

    // Mouse
    el.addEventListener('mouseenter', () => {
        active = true;
        current = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { active = false; });
    el.addEventListener('mousemove', e => onMove(e.clientX));

    // Touch
    el.addEventListener('touchstart', () => {
        active = true;
        current = el.scrollLeft;
    }, { passive: true });
    el.addEventListener('touchend', () => { active = false; });
    el.addEventListener('touchmove', e => {
        if (e.touches.length > 0) onMove(e.touches[0].clientX);
    }, { passive: true });
}

function initDragScroll() {
    let active = null, sx = 0, sy = 0, sl = 0, st = 0, dragged = false;

    document.addEventListener('mousemove', e => {
        if (!active) return;
        const dx = e.pageX - sx;
        const dy = e.pageY - sy;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragged = true;
        if (dragged) {
            active.scrollLeft = sl - dx;
            active.scrollTop  = st - dy;
        }
    });

    document.addEventListener('mouseup', () => {
        if (active) { active.classList.remove('drag-active'); active = null; }
    });

    document.addEventListener('click', e => {
        if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; }
    }, true);

    function attach(el) {
        el.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            active = el;
            sx = e.pageX; sy = e.pageY;
            sl = el.scrollLeft; st = el.scrollTop;
            dragged = false;
            el.classList.add('drag-active');
            e.preventDefault();
            e.stopPropagation();
        });
    }

    const scroll = document.querySelector('.pp-scroll');
    if (scroll) attach(scroll);
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
    alergia:    { nome: 'Alergia',     msgs: [] },
    alimentacao:{ nome: 'Alimentação', msgs: [] },
    beneficios: { nome: 'Benefícios',  msgs: [] },
    crise:      { nome: 'Crise',       msgs: [] },
    direitos:   { nome: 'Direitos',    msgs: [] },
    justica:    { nome: 'Justiça',     msgs: [] },
    medicacao:  { nome: 'Medicação',   msgs: [] },
    mediacao:   { nome: 'Mediação',    msgs: [] },
    regulacao:  { nome: 'Regulação',   msgs: [] },
    transporte: { nome: 'Transporte',  msgs: [] },
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
    mae:   { nome: 'Mãe',   msgs: [] },
    pai:   { nome: 'Pai',   msgs: [] },
    irma:  { nome: 'Irmã',  msgs: [] },
    irmao: { nome: 'Irmão', msgs: [] },
    avo:   { nome: 'Avó',   msgs: [] },
    avo2:  { nome: 'Avô',   msgs: [] },
};
const COM_SALAS_SAUDE = {
    dentista:      { nome: 'Dentista',              msgs: [] },
    geneticista:   { nome: 'Geneticista',           msgs: [] },
    neurologista:  { nome: 'Neurologista',          msgs: [] },
    oftalmologista:{ nome: 'Oftalmologista',        msgs: [] },
    otorrino:      { nome: 'Otorrinolaringologista',msgs: [] },
    pediatra:      { nome: 'Pediatra',              msgs: [] },
};
const COM_SALAS_TERAPIA = {
    fisioterapia: { nome: 'Fisioterapia', msgs: [] },
    fono:         { nome: 'Fono',         msgs: [] },
    musicoterapia:{ nome: 'Musicoterapia',msgs: [] },
    nutricionista:{ nome: 'Nutricionista',msgs: [] },
    psicologa:    { nome: 'Psicóloga',    msgs: [] },
    to:           { nome: 'TO',           msgs: [] },
};
/* ══════════════════════════════════════════
   MENSAGENS — catálogo e personalização
══════════════════════════════════════════ */
const MSG_CATALOGO = {
    educacao: [
        { id: 'administracao', nome: 'Administração',     icon: 'building-2' },
        { id: 'coordenacao',   nome: 'Coordenação',       icon: 'layers' },
        { id: 'diretoria',     nome: 'Diretoria',         icon: 'briefcase' },
        { id: 'mediador',      nome: 'Mediador/a',        icon: 'user' },
        { id: 'professora',    nome: 'Professor/a',       icon: 'graduation-cap' },
        { id: 'psicologa',     nome: 'Psicóloga Escolar', icon: 'brain' },
    ],
    familia: [
        { id: 'avo',   nome: 'Avó',   icon: 'users' },
        { id: 'avo2',  nome: 'Avô',   icon: 'users' },
        { id: 'irma',  nome: 'Irmã',  icon: 'smile' },
        { id: 'irmao', nome: 'Irmão', icon: 'smile' },
        { id: 'mae',   nome: 'Mãe',   icon: 'heart' },
        { id: 'pai',   nome: 'Pai',   icon: 'user' },
    ],
    saude: [
        { id: 'dentista',       nome: 'Dentista',               icon: 'smile' },
        { id: 'geneticista',    nome: 'Geneticista',            icon: 'dna' },
        { id: 'neurologista',   nome: 'Neurologista',           icon: 'brain' },
        { id: 'oftalmologista', nome: 'Oftalmologista',         icon: 'eye' },
        { id: 'otorrino',       nome: 'Otorrinolaringologista', icon: 'ear' },
        { id: 'pediatra',       nome: 'Pediatra',               icon: 'baby' },
    ],
    terapia: [
        { id: 'fisioterapia',  nome: 'Fisioterapia',        icon: 'dumbbell' },
        { id: 'fono',          nome: 'Fonoaudiologia',      icon: 'mic' },
        { id: 'musicoterapia', nome: 'Musicoterapia',       icon: 'music' },
        { id: 'nutricionista', nome: 'Nutricionista',       icon: 'apple' },
        { id: 'psicologa',     nome: 'Psicóloga',           icon: 'brain' },
        { id: 'to',            nome: 'Terapia Ocupacional', icon: 'hand' },
    ],
    rede: [
        { id: 'alergia',     nome: 'Alergia',      icon: 'shield-alert' },
        { id: 'alimentacao', nome: 'Alimentação',  icon: 'utensils' },
        { id: 'beneficios',  nome: 'Benefícios',   icon: 'wallet' },
        { id: 'crise',       nome: 'Crise',         icon: 'alert-triangle' },
        { id: 'direitos',    nome: 'Direitos',      icon: 'scale' },
        { id: 'justica',     nome: 'Justiça',       icon: 'gavel' },
        { id: 'medicacao',   nome: 'Medicação',     icon: 'pill' },
        { id: 'mediacao',    nome: 'Mediação',      icon: 'message-circle' },
        { id: 'regulacao',   nome: 'Regulação',     icon: 'activity' },
        { id: 'transporte',  nome: 'Transporte',    icon: 'bus' },
    ],
};
const MSG_DEFAULTS = {
    educacao: ['coordenacao', 'mediador', 'professora', 'psicologa'],
    familia:  ['avo', 'avo2', 'irma', 'irmao', 'mae', 'pai'],
    saude:    ['dentista', 'geneticista', 'neurologista', 'pediatra'],
    terapia:  ['fisioterapia', 'fono', 'psicologa', 'to'],
    rede:     ['beneficios', 'crise', 'direitos', 'regulacao'],
};
const MSG_CORES = {
    educacao: { hex: '#6aab8e', bg: 'rgba(106,171,142,.2)' },
    familia:  { hex: '#E57373', bg: 'rgba(229,115,115,.18)' },
    saude:    { hex: '#e6b84a', bg: 'rgba(230,184,74,.18)' },
    terapia:  { hex: '#9b7bb8', bg: 'rgba(155,123,184,.2)' },
    rede:     { hex: '#5d8ab2', bg: 'rgba(93,138,178,.2)' },
};
const MSG_NIVEL = { educacao: 6, familia: 7, saude: 8, terapia: 9, rede: 10 };
const MSG_FN    = {
    educacao: 'abrirSalaEducacao',
    familia:  'abrirSalaFamilia',
    saude:    'abrirSalaSaude',
    terapia:  'abrirSalaTerapia',
    rede:     'abrirSalaRede',
};

let _msgAtivas  = {};
let _seletorCat = '';

function _msgCarregar() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('legado_msg_ativas') || '{}'); } catch(e) {}
    for (const cat of Object.keys(MSG_DEFAULTS)) {
        _msgAtivas[cat] = Array.isArray(saved[cat]) ? saved[cat] : [...MSG_DEFAULTS[cat]];
    }
}

function _msgSalvar() {
    localStorage.setItem('legado_msg_ativas', JSON.stringify(_msgAtivas));
}

function _renderNivelMensagens(cat) {
    const container = document.getElementById('nivel-lista-' + cat);
    if (!container) return;
    const cor   = MSG_CORES[cat];
    const fn    = MSG_FN[cat];
    const n     = MSG_NIVEL[cat];
    const ids   = _msgAtivas[cat];
    const catalog = MSG_CATALOGO[cat];
    container.innerHTML = ids.map(id => {
        const item = catalog.find(c => c.id === id);
        if (!item) return '';
        return `<button class="parc-item" onclick="${fn}('${id}',${n})">
            <div class="parc-ico" style="background:${cor.bg}"><i data-lucide="${item.icon}" style="width:16px;height:16px;stroke:${cor.hex};stroke-width:1.5"></i></div>
            <span class="parc-nome">${item.nome}</span>
            <i data-lucide="chevron-right" class="parc-chev" style="width:12px;height:12px;stroke:rgba(255,255,255,.25)"></i>
        </button>`;
    }).join('');
    lucide.createIcons();
}

function _renderTodosMensagens() {
    for (const cat of Object.keys(MSG_NIVEL)) _renderNivelMensagens(cat);
}

function abrirSeletorMensagens(cat) {
    _seletorCat = cat;
    _renderSeletorLista();
    document.getElementById('tela-seletor-msg').style.transform = 'translateY(0)';
}

function fecharSeletorMensagens() {
    document.getElementById('tela-seletor-msg').style.transform = 'translateY(110%)';
}

function _renderSeletorLista() {
    const cat  = _seletorCat;
    const cor  = MSG_CORES[cat];
    const ativos = _msgAtivas[cat];
    const nomes = { educacao:'Educação', familia:'Família', saude:'Saúde', terapia:'Terapia', rede:'Rede Legado' };
    document.getElementById('seletor-msg-titulo').textContent = nomes[cat] || '';
    const container = document.getElementById('seletor-msg-lista');
    container.innerHTML = MSG_CATALOGO[cat].map(item => {
        const ativo = ativos.includes(item.id);
        return `<button class="parc-item" onclick="toggleMensagem('${item.id}')">
            <div class="parc-ico" style="background:${cor.bg}"><i data-lucide="${item.icon}" style="width:16px;height:16px;stroke:${cor.hex};stroke-width:1.5"></i></div>
            <span class="parc-nome">${item.nome}</span>
            <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${ativo ? cor.bg : 'rgba(255,255,255,.08)'}">
                <i data-lucide="${ativo ? 'check' : 'plus'}" style="width:14px;height:14px;stroke:${ativo ? cor.hex : 'rgba(255,255,255,.4)'};stroke-width:2.5"></i>
            </div>
        </button>`;
    }).join('');
    lucide.createIcons();
}

function toggleMensagem(id) {
    const ativos = _msgAtivas[_seletorCat];
    const idx = ativos.indexOf(id);
    if (idx === -1) {
        ativos.push(id);
        const ordem = MSG_CATALOGO[_seletorCat].map(c => c.id);
        _msgAtivas[_seletorCat] = ordem.filter(x => ativos.includes(x));
    } else {
        ativos.splice(idx, 1);
    }
    _msgSalvar();
    _renderSeletorLista();
    _renderNivelMensagens(_seletorCat);
}

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

/* ══════════════════════════════════════════════════════
   MENSAGENS — responsáveis por pilar
══════════════════════════════════════════════════════ */
const MSG_RESPONSAVEIS = {
    educacao: [
        { chave:'prof',    titulo:'Professor(a)',         desc:'Comunicação com a escola',        icon:'graduation-cap' },
        { chave:'coord',   titulo:'Coordenador(a)',       desc:'Acompanhamento pedagógico',       icon:'clipboard-list' },
        { chave:'monitor', titulo:'Monitor(a) de Apoio', desc:'Suporte especializado em sala',   icon:'users' },
    ],
    saude: [
        { chave:'medico',   titulo:'Médico(a)',        desc:'Consultas e prescrições',       icon:'stethoscope' },
        { chave:'pediatra', titulo:'Pediatra',          desc:'Saúde geral',                   icon:'baby' },
        { chave:'neuroped', titulo:'Neuropediatra',     desc:'Desenvolvimento neurológico',   icon:'brain' },
    ],
    terapia: [
        { chave:'fono_msg',  titulo:'Fonoaudiólogo(a)',    desc:'Comunicação e fala',            icon:'mic' },
        { chave:'to_msg',    titulo:'Ter. Ocupacional',    desc:'Habilidades do dia a dia',      icon:'wrench' },
        { chave:'psico_ter', titulo:'Psicólogo(a)',        desc:'Saúde mental e comportamento',  icon:'smile' },
        { chave:'aba_msg',   titulo:'Terapeuta ABA',       desc:'Análise do comportamento',      icon:'bar-chart-2' },
    ],
};

const MSG_FAMILIA_EU = { chave:'fam_eu', titulo:'Eu', desc:'Meu acesso ao Legado Azul', icon:'user' };

const MSG_FAMILIA_PRESETS = [
    { chave:'fam_mae',   titulo:'Mãe',   icon:'user-round' },
    { chave:'fam_pai',   titulo:'Pai',   icon:'user-round' },
    { chave:'fam_avo',   titulo:'Avó',   icon:'user-round' },
    { chave:'fam_avop',  titulo:'Avô',   icon:'user-round' },
    { chave:'fam_irmao', titulo:'Irmão', icon:'user-round' },
    { chave:'fam_irma',  titulo:'Irmã',  icon:'user-round' },
];

const MSG_FAMILIA_TIPOS = [
    ...MSG_FAMILIA_PRESETS,
    { chave:'fam_tio',      titulo:'Tio',      icon:'user-round' },
    { chave:'fam_tia',      titulo:'Tia',      icon:'user-round' },
    { chave:'fam_padrinho', titulo:'Padrinho', icon:'user-round' },
    { chave:'fam_madrinha', titulo:'Madrinha', icon:'user-round' },
];

let _famTipoSelecionado = null;

function _getMsgFamiliaMembros() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_familia_membros'] || [];
    const custom = d['msg_familia_custom'] || [];
    const presets = MSG_FAMILIA_PRESETS
        .filter(m => sel.includes(m.chave))
        .map(m => ({ ...m, desc:'Acesso compartilhado' }));
    const customMapped = custom.map(c => ({
        chave: c.chave,
        titulo: c.nome ? `${c.titulo} ${c.nome}` : c.titulo,
        desc: 'Acesso compartilhado',
        icon: c.icon
    }));
    return [MSG_FAMILIA_EU, ...presets, ...customMapped];
}

function toggleMsgFamiliaMembro(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_familia_membros'] ? [...d['msg_familia_membros']] : [];
    const idx = sel.indexOf(chave);
    const on = idx === -1;
    if (on && idx === -1) sel.push(chave);
    if (!on && idx !== -1) sel.splice(idx, 1);
    d['msg_familia_membros'] = sel;
    localStorage.setItem('la', JSON.stringify(d));
}

function _abrirSeletorMsgFamilia() {
    const cor = '#3A7A9C';
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_familia_membros'] || [];
    const custom = d['msg_familia_custom'] || [];

    const presetsHtml = MSG_FAMILIA_PRESETS.map(m => {
        const on = sel.includes(m.chave);
        return `<div class="edu-toggle-item${on ? ' sel' : ''}" onclick="this.classList.toggle('sel'); toggleMsgFamiliaMembro('${m.chave}')">
            <i data-lucide="${m.icon}" class="edu-toggle-bg-icon" style="stroke:${cor}"></i>
            <span class="edu-toggle-nome">${m.titulo}</span>
        </div>`;
    }).join('');

    const customHtml = custom.length > 0
        ? `<p class="pil-sel-group-title" style="margin-top:16px">Perfis criados</p>
           ${custom.map(c => `
            <div class="fam-custom-item">
                <div class="fam-custom-ico">
                    <i data-lucide="${c.icon}" style="width:16px;height:16px;stroke:${cor};stroke-width:1.7;fill:none"></i>
                </div>
                <span class="fam-custom-nome">${c.nome ? c.titulo + ' ' + c.nome : c.titulo}</span>
                <button class="fam-custom-del" onclick="_removerPerfilFamiliaCustom('${c.chave}')">
                    <i data-lucide="trash-2" style="width:16px;height:16px;stroke:rgba(200,64,64,.55);stroke-width:1.7;fill:none"></i>
                </button>
            </div>`).join('')}`
        : '';

    const overlay = document.getElementById('msg-familia-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Família</span>
                <span class="com-canal-sub-txt">Mensagens</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Selecionar membro</p>
            ${presetsHtml}
            ${customHtml}
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_fecharSeletorMsgFamilia()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirCriarPerfilFamilia()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _abrirCriarPerfilFamilia() {
    _famTipoSelecionado = null;
    const tiposHtml = MSG_FAMILIA_TIPOS.map(m => `
        <button class="fam-tipo-chip" onclick="_famSelecionarTipo('${m.chave}','${m.titulo}','${m.icon}',this)">
            <i data-lucide="${m.icon}" style="width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none"></i>
            ${m.titulo}
        </button>`).join('');
    const overlay = document.getElementById('msg-familia-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Novo perfil</span>
                <span class="com-canal-sub-txt">Família</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Vínculo familiar</p>
            <div class="fam-tipo-grid">${tiposHtml}</div>
            <p class="pil-sel-group-title" style="margin-top:20px">Nome <span style="font-weight:400;opacity:.6">(opcional)</span></p>
            <input class="fam-nome-input" id="fam-cria-nome" type="text" placeholder="Ex: Joana, Ana...">
            <button class="fam-cria-salvar" onclick="_salvarPerfilFamiliaCustom()">Adicionar perfil</button>
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_abrirSeletorMsgFamilia()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_salvarPerfilFamiliaCustom()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _famSelecionarTipo(chave, titulo, icon, btn) {
    _famTipoSelecionado = { chave, titulo, icon };
    document.querySelectorAll('.fam-tipo-chip').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    lucide.createIcons();
}

function _salvarPerfilFamiliaCustom() {
    if (!_famTipoSelecionado) { mostrarToast('Selecione um vínculo familiar'); return; }
    const nome = (document.getElementById('fam-cria-nome')?.value || '').trim();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const custom = d['msg_familia_custom'] || [];
    custom.push({ chave:'custom_' + Date.now(), titulo:_famTipoSelecionado.titulo, nome, icon:_famTipoSelecionado.icon });
    d['msg_familia_custom'] = custom;
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgFamilia();
}

function _removerPerfilFamiliaCustom(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    d['msg_familia_custom'] = (d['msg_familia_custom'] || []).filter(c => c.chave !== chave);
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgFamilia();
}

function _fecharSeletorMsgFamilia() {
    document.getElementById('msg-familia-seletor-overlay').style.display = 'none';
    _renderMensagensTab(_msgTabAtiva);
}

/* ── EDUCAÇÃO MENSAGENS ─────────────────────────────── */

const MSG_EDUCACAO_TIPOS = [
    { chave:'edu_prof',    titulo:'Professor(a)',         icon:'circle-user' },
    { chave:'edu_coord',   titulo:'Coordenador(a)',       icon:'circle-user' },
    { chave:'edu_monitor', titulo:'Monitor(a) de Apoio', icon:'circle-user' },
    { chave:'edu_dir',     titulo:'Diretor(a)',           icon:'circle-user' },
    { chave:'edu_psico',   titulo:'Psicopedagogo(a)',     icon:'circle-user' },
    { chave:'edu_apoio',   titulo:'Prof. de Apoio',       icon:'circle-user' },
];

let _eduTipoSelecionado = null;

function _getMsgEducacaoContatos() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_edu_contatos'] || ['prof','coord','monitor'];
    const custom = d['msg_edu_custom'] || [];
    const presets = (MSG_RESPONSAVEIS.educacao || []).filter(m => sel.includes(m.chave)).map(m => ({ ...m, icon: 'user-round' }));
    const customMapped = custom.map(c => ({
        chave: c.chave,
        titulo: c.nome ? `${c.titulo} ${c.nome}` : c.titulo,
        desc: 'Comunicação escolar',
        icon: c.icon
    }));
    return [...presets, ...customMapped];
}

function toggleMsgEducacaoContato(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_edu_contatos'] ? [...d['msg_edu_contatos']] : ['prof','coord','monitor'];
    const idx = sel.indexOf(chave);
    const on = idx === -1;
    if (on && idx === -1) sel.push(chave);
    if (!on && idx !== -1) sel.splice(idx, 1);
    d['msg_edu_contatos'] = sel;
    localStorage.setItem('la', JSON.stringify(d));
}

function _abrirSeletorMsgEducacao() {
    const cor = '#3A7A9C';
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_edu_contatos'] || ['prof','coord','monitor'];
    const custom = d['msg_edu_custom'] || [];

    const presetsHtml = (MSG_RESPONSAVEIS.educacao || []).map(m => {
        const on = sel.includes(m.chave);
        return `<div class="edu-toggle-item${on ? ' sel' : ''}" onclick="this.classList.toggle('sel'); toggleMsgEducacaoContato('${m.chave}')">
            <i data-lucide="${m.icon}" class="edu-toggle-bg-icon" style="stroke:${cor}"></i>
            <span class="edu-toggle-nome">${m.titulo}</span>
        </div>`;
    }).join('');

    const customHtml = custom.length > 0
        ? `<p class="pil-sel-group-title" style="margin-top:16px">Contatos criados</p>
           ${custom.map(c => `
            <div class="fam-custom-item">
                <div class="fam-custom-ico" style="background:${_hexToRgba(cor,.10)}">
                    <i data-lucide="${c.icon}" style="width:16px;height:16px;stroke:${cor};stroke-width:1.7;fill:none"></i>
                </div>
                <span class="fam-custom-nome">${c.nome ? c.titulo + ' ' + c.nome : c.titulo}</span>
                <button class="fam-custom-del" onclick="_removerContatoEducacaoCustom('${c.chave}')">
                    <i data-lucide="trash-2" style="width:16px;height:16px;stroke:rgba(58,154,106,.55);stroke-width:1.7;fill:none"></i>
                </button>
            </div>`).join('')}`
        : '';

    const overlay = document.getElementById('msg-edu-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Educação</span>
                <span class="com-canal-sub-txt">Mensagens</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Selecionar contato</p>
            ${presetsHtml}
            ${customHtml}
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_fecharSeletorMsgEducacao()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirCriarContatoEducacao()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _abrirCriarContatoEducacao() {
    _eduTipoSelecionado = null;
    const tiposHtml = MSG_EDUCACAO_TIPOS.map(m => `
        <button class="edu-tipo-chip" onclick="_eduSelecionarTipo('${m.chave}','${m.titulo}','${m.icon}',this)">
            <i data-lucide="${m.icon}" style="width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none"></i>
            ${m.titulo}
        </button>`).join('');
    const overlay = document.getElementById('msg-edu-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Novo contato</span>
                <span class="com-canal-sub-txt">Educação</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Função</p>
            <div class="fam-tipo-grid">${tiposHtml}</div>
            <p class="pil-sel-group-title" style="margin-top:20px">Nome <span style="font-weight:400;opacity:.6">(opcional)</span></p>
            <input class="fam-nome-input" id="edu-cria-nome" type="text" placeholder="Ex: Ana, Carlos...">
            <button class="edu-cria-salvar" onclick="_salvarContatoEducacaoCustom()">Adicionar contato</button>
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_abrirSeletorMsgEducacao()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_salvarContatoEducacaoCustom()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _eduSelecionarTipo(chave, titulo, icon, btn) {
    _eduTipoSelecionado = { chave, titulo, icon };
    document.querySelectorAll('.edu-tipo-chip').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    lucide.createIcons();
}

function _salvarContatoEducacaoCustom() {
    if (!_eduTipoSelecionado) { mostrarToast('Selecione uma função'); return; }
    const nome = (document.getElementById('edu-cria-nome')?.value || '').trim();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const custom = d['msg_edu_custom'] || [];
    custom.push({ chave:'educ_' + Date.now(), titulo:_eduTipoSelecionado.titulo, nome, icon:_eduTipoSelecionado.icon });
    d['msg_edu_custom'] = custom;
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgEducacao();
}

function _removerContatoEducacaoCustom(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    d['msg_edu_custom'] = (d['msg_edu_custom'] || []).filter(c => c.chave !== chave);
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgEducacao();
}

function _fecharSeletorMsgEducacao() {
    document.getElementById('msg-edu-seletor-overlay').style.display = 'none';
    _renderMensagensTab(_msgTabAtiva);
}

/* ── SAÚDE MENSAGENS ─────────────────────────────────── */

const MSG_SAUDE_TIPOS = [
    { chave:'sau_medico',   titulo:'Médico(a)',        icon:'circle-user' },
    { chave:'sau_ped',      titulo:'Pediatra',          icon:'circle-user' },
    { chave:'sau_neuro',    titulo:'Neuropediatra',     icon:'circle-user' },
    { chave:'sau_cardio',   titulo:'Cardiologista',     icon:'circle-user' },
    { chave:'sau_oftalmo',  titulo:'Oftalmologista',    icon:'circle-user' },
    { chave:'sau_dentista', titulo:'Dentista',          icon:'circle-user' },
    { chave:'sau_nutri',    titulo:'Nutricionista',     icon:'circle-user' },
    { chave:'sau_fisio',    titulo:'Fisioterapeuta',    icon:'circle-user' },
    { chave:'sau_enfer',    titulo:'Enfermeiro(a)',     icon:'circle-user' },
];

let _saudeTipoSelecionado = null;

function _getMsgSaudeContatos() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_sau_contatos'] || ['medico','pediatra','neuroped'];
    const custom = d['msg_sau_custom'] || [];
    const presets = (MSG_RESPONSAVEIS.saude || []).filter(m => sel.includes(m.chave)).map(m => ({ ...m, icon:'user-round' }));
    const customMapped = custom.map(c => ({
        chave: c.chave,
        titulo: c.nome ? `${c.titulo} ${c.nome}` : c.titulo,
        desc: 'Acompanhamento de saúde',
        icon: c.icon
    }));
    return [...presets, ...customMapped];
}

function toggleMsgSaudeContato(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_sau_contatos'] ? [...d['msg_sau_contatos']] : ['medico','pediatra','neuroped'];
    const idx = sel.indexOf(chave);
    const on = idx === -1;
    if (on && idx === -1) sel.push(chave);
    if (!on && idx !== -1) sel.splice(idx, 1);
    d['msg_sau_contatos'] = sel;
    localStorage.setItem('la', JSON.stringify(d));
}

function _abrirSeletorMsgSaude() {
    const cor = '#3A7A9C';
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const sel = d['msg_sau_contatos'] || ['medico','pediatra','neuroped'];
    const custom = d['msg_sau_custom'] || [];

    const presetsHtml = (MSG_RESPONSAVEIS.saude || []).map(m => {
        const on = sel.includes(m.chave);
        return `<div class="edu-toggle-item${on ? ' sel' : ''}" onclick="this.classList.toggle('sel'); toggleMsgSaudeContato('${m.chave}')">
            <i data-lucide="${m.icon}" class="edu-toggle-bg-icon" style="stroke:${cor}"></i>
            <span class="edu-toggle-nome">${m.titulo}</span>
        </div>`;
    }).join('');

    const customHtml = custom.length > 0
        ? `<p class="pil-sel-group-title" style="margin-top:16px">Contatos criados</p>
           ${custom.map(c => `
            <div class="fam-custom-item">
                <div class="fam-custom-ico" style="background:${_hexToRgba(cor,.10)}">
                    <i data-lucide="${c.icon}" style="width:16px;height:16px;stroke:${cor};stroke-width:1.7;fill:none"></i>
                </div>
                <span class="fam-custom-nome">${c.nome ? c.titulo + ' ' + c.nome : c.titulo}</span>
                <button class="fam-custom-del" onclick="_removerContatoSaudeCustom('${c.chave}')">
                    <i data-lucide="trash-2" style="width:16px;height:16px;stroke:rgba(200,160,32,.55);stroke-width:1.7;fill:none"></i>
                </button>
            </div>`).join('')}`
        : '';

    const overlay = document.getElementById('msg-sau-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Saúde</span>
                <span class="com-canal-sub-txt">Mensagens</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Selecionar contato</p>
            ${presetsHtml}
            ${customHtml}
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_fecharSeletorMsgSaude()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_abrirCriarContatoSaude()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _abrirCriarContatoSaude() {
    _saudeTipoSelecionado = null;
    const tiposHtml = MSG_SAUDE_TIPOS.map(m => `
        <button class="sau-tipo-chip" onclick="_saudeSelecionarTipo('${m.chave}','${m.titulo}','${m.icon}',this)">
            <i data-lucide="${m.icon}" style="width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none"></i>
            ${m.titulo}
        </button>`).join('');
    const overlay = document.getElementById('msg-sau-seletor-overlay');
    overlay.innerHTML = `<div class="pil-seletor">
        <div class="pp2-header" style="flex-shrink:0">
            <div class="com-header-info">
                <span class="pp2-nome">Novo contato</span>
                <span class="com-canal-sub-txt">Saúde</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="pil-sel-body">
            <p class="pil-sel-group-title">Especialidade</p>
            <div class="fam-tipo-grid">${tiposHtml}</div>
            <p class="pil-sel-group-title" style="margin-top:20px">Nome <span style="font-weight:400;opacity:.6">(opcional)</span></p>
            <input class="fam-nome-input" id="sau-cria-nome" type="text" placeholder="Ex: Dr. Carlos, Dra. Ana...">
            <button class="sau-cria-salvar" onclick="_salvarContatoSaudeCustom()">Adicionar contato</button>
        </div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="_abrirSeletorMsgSaude()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="mostrarToast('Em breve!')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="_salvarContatoSaudeCustom()">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _saudeSelecionarTipo(chave, titulo, icon, btn) {
    _saudeTipoSelecionado = { chave, titulo, icon };
    document.querySelectorAll('.sau-tipo-chip').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    lucide.createIcons();
}

function _salvarContatoSaudeCustom() {
    if (!_saudeTipoSelecionado) { mostrarToast('Selecione uma especialidade'); return; }
    const nome = (document.getElementById('sau-cria-nome')?.value || '').trim();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const custom = d['msg_sau_custom'] || [];
    custom.push({ chave:'saude_' + Date.now(), titulo:_saudeTipoSelecionado.titulo, nome, icon:_saudeTipoSelecionado.icon });
    d['msg_sau_custom'] = custom;
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgSaude();
}

function _removerContatoSaudeCustom(chave) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    d['msg_sau_custom'] = (d['msg_sau_custom'] || []).filter(c => c.chave !== chave);
    localStorage.setItem('la', JSON.stringify(d));
    _abrirSeletorMsgSaude();
}

function _fecharSeletorMsgSaude() {
    document.getElementById('msg-sau-seletor-overlay').style.display = 'none';
    _renderMensagensTab(_msgTabAtiva);
}

function _msgFabClick() {
    const pilar = _MSG_PILAR_KEYS[_msgTabAtiva];
    if (pilar === 'familia') _abrirSeletorMsgFamilia();
    else if (pilar === 'educacao') _abrirSeletorMsgEducacao();
    else if (pilar === 'saude') _abrirSeletorMsgSaude();
    else mostrarToast('Em breve!');
}

let _msgTabAtiva = 0;
const _MSG_PILAR_KEYS = ['educacao', 'familia', 'saude', 'terapia'];

function abrirCuidadores() {
    ir('tela-cuidadores');
}

function _renderCuidPerfilHeader() {
    const avatarEl = document.getElementById('cuid-prf-avatar');
    const nomeEl = document.getElementById('cuid-prf-nome');
    if (!avatarEl || !nomeEl) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const nome = d.respNome || d.teaNome || (d.perfil && (d.perfil['resp1-nome'] || d.perfil['tea-nome'])) || 'Usuário';
    const partes = nome.trim().split(/\s+/);
    const iniciais = partes.length >= 2
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : nome.slice(0, 2).toUpperCase();
    avatarEl.textContent = iniciais;
    nomeEl.textContent = nome;
}

const _HUB_CFG = {
    eu: {
        hubTela: 'tela-eu-hub',
        secs: [
            { icon: 'user',      tela: 'tela-eu-hub' },
            { icon: 'settings',  tela: 'tela-ajustes' },
            { icon: 'calendar',  tela: 'tela-agenda' },
            { icon: 'wallet',    tela: 'tela-financeiro' },
        ]
    },
    cuid: {
        hubTela: 'tela-cuidadores-hub',
        secs: [
            { icon: 'user',                 tela: 'tela-cuidadores-hub' },
            { icon: 'message-square',       tela: 'tela-cuidadores-mensagens' },
            { icon: 'message-circle-heart', tela: 'tela-desabafo' },
            { icon: 'brain',                tela: 'tela-saude-cuidador' },
        ]
    },
    traj: {
        hubTela: 'tela-traj-hub',
        secs: [
            { icon: 'compass',     tela: 'tela-traj-hub' },
            { icon: 'hourglass',   tela: 'tela-linhatempo' },
            { icon: 'file-text',   tela: 'tela-documentos' },
            { icon: 'bar-chart-2', tela: 'tela-grafico-traj' },
        ]
    },
    seg: {
        hubTela: 'tela-seg-hub',
        secs: [
            { icon: 'shield',  tela: 'tela-seg-hub' },
            { icon: 'eye-off', tela: 'tela-seguranca' },
            { icon: 'lock',    tela: 'tela-senhas' },
            { icon: 'scale',   tela: 'tela-juridico' },
        ]
    }
};
const _HUB_TELA_MAP = {};
Object.entries(_HUB_CFG).forEach(([hubId, cfg]) =>
    cfg.secs.forEach(s => { _HUB_TELA_MAP[s.tela] = hubId; })
);

function _injectHubBar(screenId) {
    const hubId = _HUB_TELA_MAP[screenId];
    if (!hubId) return;
    const hub = _HUB_CFG[hubId];
    if (hub.hubTela === screenId) return; // hub screen has static bar already

    const prevHub = _telaAnterior && _HUB_TELA_MAP[_telaAnterior];
    const screen = document.getElementById(screenId);
    if (!screen) return;

    const oldBar = screen.querySelector('.hub-injected-bar');
    if (prevHub !== hubId) { if (oldBar) oldBar.remove(); return; }

    if (oldBar) oldBar.remove();
    if (screen.querySelector('.pil-nav-bar:not(.hub-injected-bar)')) return; // tela já tem barra própria (ex: filtro de parceiros)
    const header = screen.querySelector('.pp2-header');
    if (!header) return;

    const bar = document.createElement('div');
    bar.className = 'pil-nav-bar hub-injected-bar';
    bar.style.cssText = 'margin:0 16px 10px;flex-shrink:0';
    bar.innerHTML = hub.secs.map(s => {
        const ativo = s.tela === screenId;
        return `<button class="pil-pilar-btn${ativo ? ' sel' : ''}" ${ativo ? '' : `onclick="ir('${s.tela}')"`}>
            <i data-lucide="${s.icon}" style="width:18px;height:18px;stroke:#1A3A5C;stroke-width:1.8;fill:none"></i>
        </button>`;
    }).join('');
    header.insertAdjacentElement('afterend', bar);
    lucide.createIcons();
}

function _renderPilarBar(barId, pilarIdx, secaoAtiva) {
    const el = document.getElementById(barId);
    if (!el) return;
    const info = [
        { id: 'educacao', cor: '#6ECFA4', icon: 'graduation-cap' },
        { id: 'familia',  cor: '#E87878', icon: 'heart' },
        { id: 'saude',    cor: '#DEC455', icon: 'stethoscope' },
        { id: 'terapia',  cor: '#A888DC', icon: 'brain' },
    ];
    const p = info[pilarIdx] || info[0];
    const secoes = [
        { id: 'pilar',    icon: p.icon,           acao: `irPilar('${p.id}')` },
        { id: 'mensagem', icon: 'message-square',  acao: `abrirMensagens('${p.id}')` },
        { id: 'rede',     icon: 'globe',            acao: `abrirRedeLegado('${p.id}')` },
        { id: 'parceiro', icon: 'handshake',         acao: `abrirParceiros('${p.id}')` },
    ];
    el.innerHTML = secoes.map(s => {
        const ativo = s.id === secaoAtiva;
        return `<button class="pil-pilar-btn${ativo ? ' sel' : ''}" ${ativo ? '' : `onclick="${s.acao}"`}>
            <i data-lucide="${s.icon}" style="width:18px;height:18px;stroke:#3A7A9C;stroke-width:1.8;fill:none"></i>
        </button>`;
    }).join('');
    lucide.createIcons();
}

function abrirMensagens(pilar) {
    const idx = _MSG_PILAR_KEYS.indexOf(pilar);
    if (idx >= 0) _msgTabAtiva = idx;
    const _pilarTelas = { educacao:'tela-educacao', familia:'tela-familia-pilar', saude:'tela-saude-pilar', terapia:'tela-terapia-pilar' };
    const origem = _pilarTelas[pilar];
    if (origem) { _navStack.push(origem); if (_navStack.length > 40) _navStack.shift(); }
    ir('tela-mensagens');
    _renderMensagensTab(_msgTabAtiva);
}

function _renderMensagensTab(idx) {
    _msgTabAtiva = idx;
    const pilarKey = _MSG_PILAR_KEYS[idx];
    const pilarInfo = _PILARES.find(p => p.id === pilarKey);
    const cor = pilarInfo?.cor || '#1E3A47';

    const mg = document.getElementById('msg-greeting');
    if (mg) mg.textContent = 'Mensagens';

    const stack = document.getElementById('msg-content-cards');
    if (!stack) return;
    const responsaveis = pilarKey === 'familia' ? _getMsgFamiliaMembros()
        : pilarKey === 'educacao' ? _getMsgEducacaoContatos()
        : pilarKey === 'saude'    ? _getMsgSaudeContatos()
        : (MSG_RESPONSAVEIS[pilarKey] || []);
    const shades = REDE_PILAR_SHADES[idx];
    const d = JSON.parse(localStorage.getItem('la') || '{}');

    const cards = responsaveis.map((r, i) => {
        const msgs  = d[`msg_${r.chave}`] || [];
        const nMsgs = msgs.length;
        const bc    = shades[i % 4];
        const subTxt = nMsgs === 0 ? 'Iniciar conversa' : `${nMsgs} ${nMsgs === 1 ? 'mensagem' : 'mensagens'}`;
        return `
        <div class="msg-edu-card-wrap">
            <div class="edu-panel-card" onclick="_abrirChatResponsavel('${r.chave}','${r.titulo}','${pilarInfo?.nome}',${idx})">
                <i data-lucide="${r.icon}" class="edu-panel-bg-icon" style="width:78px;height:78px;stroke:white;stroke-width:1.1;fill:none;opacity:.18;pointer-events:none"></i>
                <div class="edu-panel-card-info">
                    <div class="edu-panel-card-nome">${r.titulo}</div>
                    <div class="edu-panel-card-sub">${r.desc} · ${subTxt}</div>
                </div>
            </div>
        </div>`;
    });

    stack.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;padding:8px 0">${cards.join('')}</div>`;
    lucide.createIcons();
    _renderPilarBar('msg-pil-nav-bar', idx, 'mensagem');
}

function _msgNavPrev() {
    if (_msgTabAtiva === 0) { ir('tela-painel'); return; }
    _renderMensagensTab(_msgTabAtiva - 1);
}

function _msgNavNext() {
    const tipos = ['educacao', 'familia', 'saude', 'terapia'];
    abrirRedeLegado(tipos[_msgTabAtiva]);
}

function _abrirChatResponsavel(chave, titulo, subTitulo, pilarIdx) {
    const tela = document.getElementById('tela-mensagens');
    const existing = document.getElementById('msg-chat-overlay');
    if (existing) existing.remove();
    const cor = REDE_PILAR_CORES[pilarIdx];
    const d   = JSON.parse(localStorage.getItem('la') || '{}');
    const msgs = d[`msg_${chave}`] || [];

    const overlay = document.createElement('div');
    overlay.id        = 'msg-chat-overlay';
    overlay.className = 'rl-sala';
    overlay.innerHTML = `
        <div class="pp2-header">
            <div class="com-header-info">
                <span class="pp2-nome">${titulo}</span>
                <span class="com-canal-sub-txt">${subTitulo}</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="rede-chat" id="msg-chat-feed">${_msgChatBubbles(msgs)}</div>
        <div id="msg-chat-input"></div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="voltarMsgChat()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <button class="pp2-nav-btn" onclick="ir('tela-painel')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>`;
    tela.appendChild(overlay);

    laRender(document.getElementById('msg-chat-input'), 'msg-chat', {
        placeholder: 'Escreva uma mensagem…',
        cor,
        onEnviar: (texto) => {
            if (!texto.trim()) return;
            const d2 = JSON.parse(localStorage.getItem('la') || '{}');
            if (!d2[`msg_${chave}`]) d2[`msg_${chave}`] = [];
            d2[`msg_${chave}`].push({ texto, lado:'enviada', hora: new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) });
            localStorage.setItem('la', JSON.stringify(d2));
            const feed = document.getElementById('msg-chat-feed');
            if (feed) feed.innerHTML = _msgChatBubbles(d2[`msg_${chave}`]);
        },
        onAudio: (blob, url) => {
            const d2 = JSON.parse(localStorage.getItem('la') || '{}');
            if (!d2[`msg_${chave}`]) d2[`msg_${chave}`] = [];
            d2[`msg_${chave}`].push({ texto: '🎙️ Nota de voz ('+Math.round(blob.size/1024)+'KB)', audioUrl: url, lado:'enviada', hora: new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) });
            localStorage.setItem('la', JSON.stringify(d2));
            const feed = document.getElementById('msg-chat-feed');
            if (feed) feed.innerHTML = _msgChatBubbles(d2[`msg_${chave}`]);
        }
    });
    lucide.createIcons();
}

function _msgChatBubbles(msgs) {
    if (msgs.length === 0)
        return `<div class="rede-vazio"><p>Nenhuma mensagem ainda.<br>Inicie a conversa!</p></div>`;
    return msgs.map(m => {
        const lado = m.lado === 'enviada' ? 'dir' : 'esq';
        const audioHtml = m.audioUrl ? `<audio src="${m.audioUrl}" controls style="width:100%;margin-top:6px;border-radius:8px"></audio>` : '';
        return `
        <div class="rb rb-${lado}">
            <div class="rb-card">
                <div class="rb-texto">${m.texto}</div>
                ${audioHtml}
                <div class="rb-rodape"><span class="rb-hora">${m.hora || ''}</span></div>
            </div>
        </div>`;
    }).join('');
}

function voltarMsgChat() {
    const overlay = document.getElementById('msg-chat-overlay');
    if (overlay) overlay.remove();
}

function abrirComunicacao(canal) {
    const nivelMap = { educacao: 6, familia: 7, saude: 8, terapia: 9, rede: 10 };
    if (nivelMap[canal]) { abrirNivel(nivelMap[canal]); return; }
    _comCanal = canal || 'educacao';
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_CANAIS[_comCanal].nome;
    document.getElementById('com-canal-sub').textContent = 'Rede Legado';
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
    const tela = document.getElementById('tela-comunicacao');
    if (tela) tela.style.background = cor;
    const sendBtn = document.getElementById('la-send-com');
    if (sendBtn) sendBtn.style.setProperty('--canal-cor', cor);
}

function abrirSalaEducacao(sala, nivelOrigem) {
    if (nivelOrigem) fecharNivel();
    _comCanal = 'educacao';
    _comSalaEducacao = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_EDUCACAO[sala].nome;
    document.getElementById('com-canal-sub').textContent = 'Educação';
    _comAplicarCor('#6aab8e');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#5ca0c7',
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

function abrirSalaFamilia(sala, nivelOrigem) {
    if (nivelOrigem) fecharNivel();
    _comCanal = 'familia';
    _comSalaFamilia = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_FAMILIA[sala].nome;
    document.getElementById('com-canal-sub').textContent = 'Família';
    _comAplicarCor('#E57373');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#5ca0c7',
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

function abrirSalaSaude(sala, nivelOrigem) {
    if (nivelOrigem) fecharNivel();
    _comCanal = 'saude';
    _comSalaSaude = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_SAUDE[sala].nome;
    document.getElementById('com-canal-sub').textContent = 'Saúde';
    _comAplicarCor('#e6b84a');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#5ca0c7',
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

function abrirSalaTerapia(sala, nivelOrigem) {
    if (nivelOrigem) fecharNivel();
    _comCanal = 'terapia';
    _comSalaTerapia = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_TERAPIA[sala].nome;
    document.getElementById('com-canal-sub').textContent = 'Terapia';
    _comAplicarCor('#9b7bb8');

    const laContainer = document.getElementById('com-input-la');
    if (laContainer && !laContainer.hasChildNodes()) {
        laRender(laContainer, 'com', {
            placeholder: 'Escreva uma mensagem…',
            cor: '#5ca0c7',
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

function abrirSalaRede(sala, nivelOrigem) {
    if (nivelOrigem) fecharNivel();
    _comCanal = 'rede';
    _comSalaAtiva = sala;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = COM_SALAS_REDE[sala].nome;
    document.getElementById('com-canal-sub').textContent = 'Rede Legado';
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

/* ══ BOTTOM SHEET — seleção de profissional (genérico) ══ */
const _SHEET_FN = {
    educacao: (sala) => abrirSalaEducacao(sala),
    familia:  (sala) => abrirSalaFamilia(sala),
    saude:    (sala) => abrirSalaSaude(sala),
    terapia:  (sala) => abrirSalaTerapia(sala),
    rede:     (sala) => abrirSalaRede(sala),
};
let _sheetArea = null;

function abrirSheetCanal(area) {
    _sheetArea = area;
    const cor = MSG_CORES[area];
    document.getElementById('bs-canal-titulo').textContent = _CANAL_NOMES[area];
    const grid = document.getElementById('bs-canal-grid');
    grid.innerHTML = MSG_CATALOGO[area].map(item => `
        <button class="bs-card" onclick="selecionarProfCanal('${item.id}')">
            <div class="bs-card-ico" style="background:${cor.bg}">
                <i data-lucide="${item.icon}" style="width:18px;height:18px;stroke:${cor.hex};stroke-width:1.6"></i>
            </div>
            <span class="bs-card-nome">${item.nome}</span>
        </button>`).join('');
    lucide.createIcons();
    document.getElementById('sheet-canal').classList.add('aberto');
}

function fecharSheetCanal(e) {
    if (e && e.target !== document.getElementById('sheet-canal')) return;
    document.getElementById('sheet-canal').classList.remove('aberto');
}

function selecionarProfCanal(sala) {
    document.getElementById('sheet-canal').classList.remove('aberto');
    const laContainer = document.getElementById('com-input-la');
    if (laContainer) laContainer.innerHTML = '';
    _comDirecto = false;
    setTimeout(() => _SHEET_FN[_sheetArea](sala), 60);
}

/* ══ CANAL DIRETO — conversa de área sem sala específica ══ */
const _CANAL_MSGS  = { educacao: [], familia: [], saude: [], terapia: [], rede: [] };
const _CANAL_NOMES = { educacao: 'Educação', familia: 'Família', saude: 'Saúde', terapia: 'Terapia', rede: 'Rede Legado' };

let _comDirecto = false;

function abrirCanalDirecto(area) {
    _comDirecto = true;
    _comCanal = area;
    document.querySelectorAll('.tela').forEach(t => { t.classList.remove('ativa'); t.style.display = ''; });
    const tela = document.getElementById('tela-comunicacao');
    tela.classList.add('ativa');
    tela.style.display = 'flex';
    document.getElementById('com-canal-nome').textContent = _CANAL_NOMES[area];
    document.getElementById('com-canal-sub').textContent = _CANAL_NOMES[area];
    _comAplicarCor(MSG_CORES[area].hex);

    const laContainer = document.getElementById('com-input-la');
    laContainer.innerHTML = '';
    laRender(laContainer, 'com', {
        placeholder: 'Escreva uma mensagem…',
        cor: MSG_CORES[area].hex,
        onEnviar: (texto) => {
            if (!texto.trim()) return;
            const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            _CANAL_MSGS[area].push({ texto, lado: 'enviada', hora });
            _renderCanalMsgs(area);
        }
    });

    _renderCanalMsgs(area);
    lucide.createIcons();
}

function _renderCanalMsgs(area) {
    const el = document.getElementById('com-msgs');
    if (!el) return;
    const msgs = _CANAL_MSGS[area] || [];
    if (!msgs.length) {
        el.innerHTML = `
            <div class="com-vazio">
                <div class="com-vazio-ico">
                    <i data-lucide="message-circle" style="width:30px;height:30px;stroke:#c8d8e8;stroke-width:1.5"></i>
                </div>
                <p class="com-vazio-txt">Nenhuma mensagem ainda</p>
                <p class="com-vazio-sub">Inicie a conversa de ${_CANAL_NOMES[area]}.</p>
            </div>`;
        lucide.createIcons();
        return;
    }
    const { nomeFamilia, iniciais } = _getNomeFamilia();
    el.innerHTML = msgs.map(m => _comBubbleHtml(m, nomeFamilia, iniciais)).join('');
    el.scrollTop = el.scrollHeight;
}

function _getNomeFamilia() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const nomeFamilia = d.perfil?.['tea-nome'] ? 'Família de ' + d.perfil['tea-nome'] : 'Família';
    const palavras = nomeFamilia.trim().split(/\s+/);
    const iniciais = palavras.length >= 2
        ? (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase()
        : nomeFamilia.slice(0, 2).toUpperCase();
    return { nomeFamilia, iniciais };
}

function _comBubbleHtml(m, nomeFamilia, iniciais) {
    const ehMinha = m.lado === 'enviada';
    const dir = ehMinha ? 'dir' : 'esq';
    const av = ehMinha ? iniciais : (m.autor || '?').slice(0, 2).toUpperCase();
    const nome = ehMinha ? nomeFamilia : (m.autor || 'Profissional');
    return `
    <div class="rb rb-${dir}">
        <div class="rb-av">${av}</div>
        <div class="rb-card">
            <div class="rb-nome">${nome}</div>
            <div class="rb-texto">${m.texto}</div>
            <div class="rb-rodape">
                <span class="rb-hora">${m.hora}</span>
            </div>
        </div>
    </div>`;
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
        const { nomeFamilia, iniciais } = _getNomeFamilia();
        area.innerHTML = msgs.map(m => _comBubbleHtml(m, nomeFamilia, iniciais)).join('');
        area.scrollTop = area.scrollHeight;
    }
}


function fecharComunicacao() {
    const nivelMap = { educacao: 6, familia: 7, saude: 8, terapia: 9 };
    const isRede = _comCanal === 'rede';
    const n = _comDirecto ? null : nivelMap[_comCanal];
    const returnArea = _comDirecto ? _chatReturnArea : null;
    _comDirecto = false;
    _chatReturnArea = null;
    document.querySelectorAll('.tela, .subtela').forEach(t => {
        t.classList.remove('ativa');
        t.style.cssText = '';
    });
    document.getElementById('nivel-backdrop').style.display = 'none';
    if (isRede) { ir('tela-grafico'); return; }
    document.getElementById('tela-painel').classList.add('ativa');
    atuConts();
    lucide.createIcons();
    if (n) { setTimeout(() => abrirNivel(n), 50); return; }
    if (returnArea) {
        selecionarNivelTab(_AREA_TAB_IDX[returnArea]);
        setTimeout(() => {
            const msgCard = document.querySelector('.pp-pc-5');
            if (msgCard) abrirCardMensagem(msgCard, returnArea);
        }, 80);
    }
}

function buildNavHTML(activeDestino) {
    const items = [
        { id: 'tela-painel', logo: true, label: 'Home' },
    ];
    return items.map(it => {
        const at = it.id === activeDestino ? ' at' : '';
        if (it.logo) return `<div class="nit nit-logo${at}" data-destino="${it.id}"><img src="LAazul.png" alt="Home" class="ni-la-logo"></div>`;
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

/* ══════════════════════════════════════════
   TEMA — cor de fundo do app
══════════════════════════════════════════ */
function aplicarTema(cor, claro) {
    const app = document.querySelector('.app');
    app.style.setProperty('--cor-fundo', cor);
    if (claro) {
        app.setAttribute('data-modo', 'claro');
    } else {
        app.removeAttribute('data-modo');
    }
    document.querySelectorAll('.tema-swatch').forEach(s => {
        s.classList.toggle('tema-ativo', s.dataset.cor === cor);
    });
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    d.tema = { cor, claro: !!claro };
    localStorage.setItem('la', JSON.stringify(d));
}

function initTema() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.tema || d.tema.cor === '#1a3a5c' || d.tema.cor === '#F4EFE6') {
        d.tema = { cor: '#97CBE0', claro: true };
        localStorage.setItem('la', JSON.stringify(d));
    }
    aplicarTema(d.tema.cor, d.tema.claro);
}

// Tooltip de toque para os nós da linha do tempo
document.addEventListener('touchstart', function(e) {
    const node = e.target.closest('.la-tl-node');
    if (!node) return;
    node.classList.add('la-tl-peek');
    clearTimeout(node._peekTimer);
    node._peekTimer = setTimeout(() => node.classList.remove('la-tl-peek'), 1400);
}, { passive: true });

function setTimeline(idx) {
    const names = ['como-estou', 'registros', 'evolucao', 'historia'];
    irSecao(names[idx] || 'como-estou');
}

/* ══ AGENDA — cards semanais ══ */
const AG_DIAS_NOMES  = ['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado','Domingo'];
const AG_MESES_ABREV = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const AG_CORES_DIA   = ['#72C8EC','#5AB8E2','#42A9D8','#3D9EC9','#2D8AB5','#1F7BAA','#165F8C'];
let _agSemanaOffset  = 0;
let _agCardHeight  = 88;
let _agPadTop      = 82; // padding-top uniforme (todos os 7 cards têm 58px ocultos)

function calculateAgCardHeights() {
    const scrollArea = document.querySelector('#tela-agenda .ag-scroll-area');
    const topCard    = document.querySelector('#tela-agenda .ag-top-card');
    if (!scrollArea || !topCard) return;
    const available = scrollArea.clientHeight - topCard.offsetHeight;
    if (available <= 0) return;
    const overlap   = 58;
    const n         = 7;
    // Todos os 7 cards têm margin-top: -58px → fórmula usa n×overlap
    _agCardHeight   = Math.max(50, Math.round((available + n * overlap) / n));
    const visivel   = Math.round(available / n);   // área visível uniforme por card
    const conteudo  = 25;                          // título (desc oculta no fechado)
    const buffer    = Math.max(6, Math.round((visivel - conteudo) / 2));
    _agPadTop       = overlap + buffer;            // 58px ocultos + buffer de centralização
    document.querySelectorAll('.ag-card-dia:not(.card-aberto)').forEach(c => {
        c.style.minHeight  = _agCardHeight + 'px';
        c.style.maxHeight  = _agCardHeight + 'px';
        c.style.paddingTop = _agPadTop + 'px';
    });
}

function _agGetSemana(offset) {
    const hoje = new Date();
    const dow = hoje.getDay();
    const diffSeg = dow === 0 ? -6 : 1 - dow;
    const seg = new Date(hoje);
    seg.setDate(hoje.getDate() + diffSeg + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(seg);
        d.setDate(seg.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return d;
    });
}

function renderAgendaCards() {
    const dias = _agGetSemana(_agSemanaOffset);
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

    const label = document.getElementById('ag-semana-label');
    if (label) {
        const d0 = dias[0], d6 = dias[6];
        label.textContent = d0.getMonth() === d6.getMonth()
            ? `${d0.getDate()}–${d6.getDate()} ${AG_MESES_ABREV[d0.getMonth()]} ${d0.getFullYear()}`
            : `${d0.getDate()} ${AG_MESES_ABREV[d0.getMonth()]} – ${d6.getDate()} ${AG_MESES_ABREV[d6.getMonth()]} ${d6.getFullYear()}`;
    }

    const stack = document.getElementById('ag-cards-stack');
    if (!stack) return;
    stack.innerHTML = dias.map((d, i) => {
        const ehHoje = d.getTime() === hoje.getTime();
        return `
        <div class="pp-panel-card ag-card-dia" style="background:${AG_CORES_DIA[i]}" onclick="abrirCardDia(this,${i})">
            <div class="pp-pc-topo">
                <h2 class="pp-pc-titulo">${AG_DIAS_NOMES[i]}${ehHoje ? ' <span class="ag-hoje-badge">Hoje</span>' : ''}</h2>
                <span class="ag-data-num">${d.getDate()}</span>
            </div>
            <p class="pp-pc-desc">${AG_MESES_ABREV[d.getMonth()]} ${d.getFullYear()}</p>
        </div>`;
    }).join('');
    lucide.createIcons();
    requestAnimationFrame(() => calculateAgCardHeights());
}

function _restoreAgCard(c) {
    c.style.minHeight  = _agCardHeight + 'px';
    c.style.maxHeight  = _agCardHeight + 'px';
    c.style.paddingTop = _agPadTop + 'px';
}

function abrirCardDia(el, idx) {
    if (el.classList.contains('card-aberto')) {
        el.classList.remove('card-aberto');
        _restoreAgCard(el);
        const w = el.querySelector('.edu-exp-wrap');
        if (w) w.remove();
        return;
    }
    document.querySelectorAll('.ag-card-dia.card-aberto').forEach(c => {
        c.classList.remove('card-aberto');
        _restoreAgCard(c);
        const w = c.querySelector('.edu-exp-wrap');
        if (w) w.remove();
    });
    el.classList.add('card-aberto');
    el.style.minHeight  = '0';
    el.style.maxHeight  = '2000px';
    el.style.paddingTop = '26px';
    const wrap = document.createElement('div');
    wrap.className = 'edu-exp-wrap';
    wrap.innerHTML = `<p style="font-family:var(--ft);font-size:.8rem;color:rgba(255,255,255,.45);text-align:center;padding:20px 0">Nenhum evento neste dia</p>`;
    el.appendChild(wrap);
}

function agMoverSemana(dir) {
    document.querySelectorAll('.ag-card-dia.card-aberto').forEach(c => {
        c.classList.remove('card-aberto');
        const w = c.querySelector('.edu-exp-wrap');
        if (w) w.remove();
    });
    _agSemanaOffset += dir;
    renderAgendaCards();
}

window.onload = () => {
    initNavBars();
    initTema();
    ppInit();
    renderAgendaCards();
    initDragScroll();
    initCardsHoverScroll();
    lucide.createIcons();
    requestAnimationFrame(() => {
        [1,2,3].forEach(n => document.getElementById('tela-nivel' + n)?.classList.add('nivel-pronto'));
    });
    atualizarExibicaoPlano(); solicitarPermissaoNotificacoes(); simularNotificacaoTeste(); carregarScriptsMapaBrasil();
};

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

/* ══════════════════════════════════════════
   REDE LEGADO — pilares e salas de chat
══════════════════════════════════════════ */
const REDE_DATA = [
    [ // Educação
        { icon:'book-open',      titulo:'Aprendizado',      desc:'Alfabetização, métodos e conquistas',  chave:'esc_apr'  },
        { icon:'graduation-cap', titulo:'Inclusão Escolar', desc:'Matrícula, adaptação e direitos',      chave:'esc_incl' },
        { icon:'users',          titulo:'Mediadores',       desc:'Apoio especializado em sala',          chave:'esc_med'  },
        { icon:'file-text',      titulo:'PEI e AEE',        desc:'Plano educacional e atendimento',      chave:'esc_pei'  },
    ],
    [ // Família
        { icon:'utensils',       titulo:'Alimentação',      desc:'Seletividade, alergias e refeições',   chave:'rot_alim'   },
        { icon:'sun',            titulo:'Saúde Mental',     desc:'Suporte emocional para cuidadores',    chave:'fam_mental' },
        { icon:'zap',            titulo:'Sensorialidade',   desc:'Estímulos, texturas e ambiente',       chave:'rot_sens'   },
        { icon:'moon',           titulo:'Sono',             desc:'Rituais, insônia e descanso',          chave:'rot_sono'   },
    ],
    [ // Saúde
        { icon:'clipboard',      titulo:'Diagnóstico',      desc:'Processo, laudos e especialistas',     chave:'sau_diag' },
        { icon:'pill',           titulo:'Medicação',        desc:'Tratamentos, dúvidas e ajustes',       chave:'sau_med'  },
        { icon:'map-pin',        titulo:'Deslocamento',     desc:'Transporte, passeios e saídas',        chave:'rot_desl' },
        { icon:'heart-pulse',    titulo:'Bem-estar',        desc:'Prevenção e qualidade de vida',        chave:'sau_bem'  },
    ],
    [ // Terapia
        { icon:'brain',          titulo:'ABA',              desc:'Terapia comportamental e estratégias', chave:'ter_aba'   },
        { icon:'mic',            titulo:'Fonoaudiologia',   desc:'Fala, linguagem e comunicação',        chave:'ter_fono'  },
        { icon:'heart',          titulo:'Psicologia',       desc:'Saúde emocional e comportamento',      chave:'ter_psico' },
        { icon:'activity',       titulo:'Terapia Ocup.',   desc:'Integração sensorial e habilidades',   chave:'ter_to'    },
    ],
];
const REDE_PILAR_SHADES = [
    ['#3A9A6A','#2E8058','#4DB880','#1E6040'],
    ['#C84040','#A83030','#D45555','#8F2020'],
    ['#C8A020','#A88010','#D4B035','#8F7010'],
    ['#7855C8','#6040B0','#9068D5','#4A2FA0'],
];
let _redeTabAtiva = 0;

const _REDE_MSGS_SIMULADAS = {
    esc_apr:    [{ autor:'Família Santos',   texto:'Meu filho começou a ler com fichas visuais. Foi uma conquista enorme!',                                data:'2026-06-10T08:31:00.000Z', likes:5  },
                 { autor:'Família Oliveira', texto:'Aqui usamos o PECS, funcionou muito bem pra introduzir as primeiras palavras.',                        data:'2026-06-12T14:20:00.000Z', likes:3  }],
    esc_incl:   [{ autor:'Família Costa',    texto:'A escola não queria aceitar sem laudo. Tivemos que acionar o conselho tutelar.',                       data:'2026-06-08T09:15:00.000Z', likes:8  },
                 { autor:'Família Ramos',    texto:'Dica: peçam tudo por escrito. Guardem os e-mails!',                                                   data:'2026-06-09T11:30:00.000Z', likes:12 }],
    esc_med:    [{ autor:'Família Ferreira', texto:'O mediador faz toda a diferença. Minha filha só fica na sala com apoio.',                              data:'2026-06-05T13:00:00.000Z', likes:6  },
                 { autor:'Família Alves',    texto:'Quem custeia quando a escola não oferece? Alguém passou por isso?',                                    data:'2026-06-11T16:45:00.000Z', likes:4  }],
    esc_pei:    [{ autor:'Família Rocha',    texto:'Conseguimos o AEE após 6 meses de luta. Não desistam!',                                               data:'2026-06-03T08:00:00.000Z', likes:15 },
                 { autor:'Família Mendes',   texto:'Como vocês acompanham as metas do PEI? Peço relatório bimestral à escola.',                           data:'2026-06-14T10:20:00.000Z', likes:7  }],
    rot_alim:   [{ autor:'Família Barbosa',  texto:'Meu filho só come 4 alimentos. Estamos em terapia alimentar há 8 meses.',                             data:'2026-06-06T12:00:00.000Z', likes:9  },
                 { autor:'Família Dias',     texto:'A fono nos ensinou a introduzir novos alimentos devagar, pelo cheiro primeiro.',                       data:'2026-06-10T14:30:00.000Z', likes:11 }],
    fam_mental: [{ autor:'Família Carvalho', texto:'Lembrem de cuidar de vocês também. Entrei em colapso e precisei de ajuda profissional.',               data:'2026-06-07T20:00:00.000Z', likes:18 },
                 { autor:'Família Araújo',   texto:'Tem grupo de apoio para pais aqui na cidade? Estou precisando muito conversar.',                       data:'2026-06-13T09:00:00.000Z', likes:6  }],
    rot_sens:   [{ autor:'Família Cardoso',  texto:'Roupas sem costura mudaram a vida aqui! Muito menos choro na hora de vestir.',                        data:'2026-06-04T07:30:00.000Z', likes:14 },
                 { autor:'Família Pereira',  texto:'Alguém usa cobertor com peso? Estou pensando em comprar.',                                            data:'2026-06-12T21:00:00.000Z', likes:5  }],
    rot_sono:   [{ autor:'Família Martins',  texto:'Melatonina prescrita pelo neurologista ajudou muito. Mas cada caso é um caso.',                       data:'2026-06-02T06:30:00.000Z', likes:10 },
                 { autor:'Família Ribeiro',  texto:'A rotina da hora de dormir é sagrada aqui. Banho, história, música. Sempre igual.',                   data:'2026-06-09T22:15:00.000Z', likes:8  }],
    sau_diag:   [{ autor:'Família Nunes',    texto:'Esperamos 14 meses pelo diagnóstico. Se puder fazer particular para agilizar, faça.',                 data:'2026-06-01T10:00:00.000Z', likes:20 },
                 { autor:'Família Gomes',    texto:'O CAPS faz avaliação gratuita. Demora, mas funciona. Não desistam do SUS.',                           data:'2026-06-08T11:00:00.000Z', likes:13 }],
    sau_med:    [{ autor:'Família Sousa',    texto:'Minha filha usou risperidona por 2 anos. Acompanhem sempre com psiquiatra.',                          data:'2026-06-05T15:00:00.000Z', likes:9  },
                 { autor:'Família Teixeira', texto:'Nunca mude medicação por conta própria. Aprendi da forma difícil.',                                   data:'2026-06-11T18:00:00.000Z', likes:16 }],
    rot_desl:   [{ autor:'Família Vieira',   texto:'Criamos um kit para saídas: fones, fidget, snack favorito. Ajuda muito.',                             data:'2026-06-03T14:00:00.000Z', likes:12 },
                 { autor:'Família Freitas',  texto:'Ônibus cheio ainda é difícil. Preferimos horários alternativos.',                                     data:'2026-06-10T16:00:00.000Z', likes:7  }],
    sau_bem:    [{ autor:'Família Correia',  texto:'Caminhadas diárias ajudaram muito na regulação emocional do meu filho.',                              data:'2026-06-06T08:00:00.000Z', likes:11 },
                 { autor:'Família Lopes',    texto:'A hidroterapia foi transformadora. Super recomendo buscar na APAE.',                                  data:'2026-06-14T09:30:00.000Z', likes:8  }],
    ter_aba:    [{ autor:'Família Monteiro', texto:'A ABA intensiva (20h/semana) fez meu filho dar um salto enorme em comunicação.',                      data:'2026-06-02T10:30:00.000Z', likes:14 },
                 { autor:'Família Cunha',    texto:'Tem como fazer ABA em casa com orientação do terapeuta? Estamos no interior.',                        data:'2026-06-09T14:00:00.000Z', likes:6  }],
    ter_fono:   [{ autor:'Família Azevedo',  texto:'A fono nos ensinou a criar situações comunicativas em casa. É o mais importante!',                    data:'2026-06-04T11:00:00.000Z', likes:10 },
                 { autor:'Família Pinto',    texto:'Minha filha não fala mas se comunica pelo CAA. A fono montou o board com ela.',                       data:'2026-06-12T13:00:00.000Z', likes:9  }],
    ter_psico:  [{ autor:'Família Castro',   texto:'A psicóloga trabalha ansiedade com meu filho de 10 anos. Muito positivo.',                            data:'2026-06-05T16:00:00.000Z', likes:13 },
                 { autor:'Família Moreira',  texto:'Busquem psicólogos com experiência em autismo. A abordagem precisa ser diferente.',                   data:'2026-06-13T11:30:00.000Z', likes:15 }],
    ter_to:     [{ autor:'Família Xavier',   texto:'A TO trabalhou a integração sensorial. Meu filho come sozinho agora!',                                data:'2026-06-07T09:00:00.000Z', likes:17 },
                 { autor:'Família Nascimento',texto:'Sala sensorial não precisa ser cara. Balancinho e pelúcias já ajudam.',                              data:'2026-06-11T15:00:00.000Z', likes:8  }],
};

function _inicializarRede() {
    selecionarRedeTab(_redeTabAtiva || 0);
    try {
        const d = JSON.parse(localStorage.getItem('la') || '{}');
        const nome = d.perfil?.['resp1-nome'] || d.perfil?.['tea-nome'] || 'MA';
        const partes = nome.trim().split(/\s+/);
        const iniciais = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nome.slice(0, 2).toUpperCase();
        const av = document.getElementById('rl-comp-av');
        if (av) av.textContent = iniciais;
    } catch(e) {}
}

function _ajustarAlturaCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = [...container.querySelectorAll(':scope > .pp-panel-card')];
    const n = cards.length;
    if (n === 0) return;
    const h = container.clientHeight;
    if (h <= 0) { requestAnimationFrame(() => _ajustarAlturaCards(containerId)); return; }
    const cardH    = Math.round((h + n * 56) / n);
    const visivel  = Math.round(h / n);          // altura visível por card
    const conteudo = 40;                          // título (~21px) + gap (2px) + desc (~17px)
    const buffer   = Math.max(6, Math.round((visivel - conteudo) / 2));
    const padTop   = 56 + buffer;                 // 56px ocultos + buffer centrado
    cards.forEach(c => {
        c.style.minHeight  = cardH + 'px';
        c.style.maxHeight  = cardH + 'px';
        c.style.paddingTop = padTop + 'px';
    });
}

const REDE_PILAR_NOMES = ['Educação', 'Família', 'Saúde', 'Terapia'];
const REDE_PILAR_CORES = ['#3A9A6A', '#C84040', '#C8A020', '#7855C8'];

function _redeNavNext() {
    const tipos = ['educacao', 'familia', 'saude', 'terapia'];
    abrirParceiros(tipos[_redeTabAtiva]);
}

function selecionarRedeTab(idx) {
    _redeTabAtiva = idx;
    const rg = document.getElementById('rede-greeting');
    if (rg) rg.textContent = 'Rede Legado';
    const _tipos = ['educacao','familia','saude','terapia'];
    _renderPilarBar('rede-pil-nav-bar', idx, 'rede');

    const stack = document.getElementById('rede-content-cards');
    if (!stack) return;
    const temas = REDE_DATA[idx];
    const shades = REDE_PILAR_SHADES[idx];

    const d = JSON.parse(localStorage.getItem('la') || '{}');

    const cards = temas.map((t, i) => {
        const userMsgs = d[`rede_${t.chave}`] || [];
        const simMsgs  = _REDE_MSGS_SIMULADAS[t.chave] || [];
        const nMsgs = userMsgs.length + simMsgs.length;
        const bc = shades[i % 4];
        const subTxt = `${t.desc} · ${nMsgs} ${nMsgs === 1 ? 'mensagem' : 'mensagens'}`;
        return `
        <div class="msg-edu-card-wrap">
            <div class="edu-panel-card" onclick="abrirSalaRede('${t.chave}','${t.titulo}')">
                <i data-lucide="${t.icon}" class="edu-panel-bg-icon" style="width:78px;height:78px;stroke:white;stroke-width:1.1;fill:none;opacity:.18;pointer-events:none"></i>
                <div class="edu-panel-card-info">
                    <div class="edu-panel-card-nome">${t.titulo}</div>
                    <div class="edu-panel-card-sub">${subTxt}</div>
                </div>
            </div>
        </div>`;
    });
    stack.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;padding:8px 0">${cards.join('')}</div>`;
    lucide.createIcons();
}

function _redeBubbleHtml(msgs, chave, nomeUsuario) {
    if (msgs.length === 0)
        return `<div class="rede-vazio"><p>Nenhuma mensagem ainda.<br>Seja a primeira família a compartilhar!</p></div>`;
    return msgs.map((m, i) => {
        const lado = m.autor === nomeUsuario ? 'dir' : 'esq';
        const palavras = (m.autor || 'FA').trim().split(/\s+/);
        const iniciais = palavras.length >= 2
            ? (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase()
            : (m.autor || 'FA').slice(0, 2).toUpperCase();
        const hora = m.data
            ? new Date(m.data).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})
            : '';
        const likes = m.likes || 0;
        const audioHtml = m.audioUrl ? `<audio src="${m.audioUrl}" controls style="width:100%;margin-top:6px;border-radius:8px"></audio>` : '';
        return `
        <div class="rb rb-${lado}">
            <div class="rb-av">${iniciais}</div>
            <div class="rb-card">
                <div class="rb-nome">${m.autor || 'Família anônima'}</div>
                <div class="rb-texto">${m.texto}</div>
                ${audioHtml}
                <div class="rb-rodape">
                    <span class="rb-hora">${hora}</span>
                    <button class="rb-like" onclick="curtirMsgRede('${chave}',${i},this)">❤️${likes > 0 ? ' ' + likes : ''}</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function curtirMsgRede(chave, idx, btn) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const arr = d[`rede_${chave}`];
    if (!arr || !arr[idx]) return;
    arr[idx].likes = (arr[idx].likes || 0) + 1;
    localStorage.setItem('la', JSON.stringify(d));
    if (btn) btn.innerHTML = `❤️ ${arr[idx].likes}`;
}

function abrirSalaRede(chave, titulo) {
    const tela = document.getElementById('tela-grafico');
    const existing = document.getElementById('rl-sala-overlay');
    if (existing) existing.remove();

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const nomeUsuario = d.perfil?.['tea-nome'] ? 'Família de ' + d.perfil['tea-nome'] : 'Família anônima';
    const simMsgs = _REDE_MSGS_SIMULADAS[chave] || [];
    const msgs = [...simMsgs, ...(d[`rede_${chave}`] || [])].sort((a, b) => new Date(a.data) - new Date(b.data));

    const overlay = document.createElement('div');
    overlay.id = 'rl-sala-overlay';
    overlay.className = 'rl-sala';
    overlay.innerHTML = `
        <div class="pp2-header">
            <div class="com-header-info">
                <span class="pp2-nome">${titulo}</span>
                <span class="com-canal-sub-txt">Rede Legado</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="rede-chat" id="rede-chat-feed">${_redeBubbleHtml(msgs, chave, nomeUsuario)}</div>
        <div id="rede-chat-input"></div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="voltarRedeCards()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="ir('tela-painel')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>`;
    tela.appendChild(overlay);

    setTimeout(() => { const f=document.getElementById('rede-chat-feed'); if(f) f.scrollTop=f.scrollHeight; }, 50);
    laRender(document.getElementById('rede-chat-input'), 'rede-sala', {
        placeholder: `Escreva para ${titulo}…`,
        cor: 'var(--azul-escuro)',
        onEnviar: (texto) => {
            const mod = moderarMensagem(texto);
            if (mod.bloqueada) { const av=document.getElementById('rede-aviso-mod'); if(av){av.style.display='block';setTimeout(()=>av.style.display='none',4000);} return; }
            const d2=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d2[`rede_${chave}`]) d2[`rede_${chave}`]=[];
            d2[`rede_${chave}`].push({texto, autor:nomeUsuario, data:new Date().toISOString(), likes:0});
            localStorage.setItem('la',JSON.stringify(d2));
            abrirSalaRede(chave,titulo);
        },
        onAudio: (blob, url) => {
            const d2=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d2[`rede_${chave}`]) d2[`rede_${chave}`]=[];
            d2[`rede_${chave}`].push({texto:'🎙️ Nota de voz ('+Math.round(blob.size/1024)+'KB)', audioUrl:url, autor:nomeUsuario, data:new Date().toISOString(), likes:0});
            localStorage.setItem('la',JSON.stringify(d2));
            abrirSalaRede(chave,titulo);
        }
    });
    lucide.createIcons();
}

function voltarRedeCards() {
    const overlay = document.getElementById('rl-sala-overlay');
    if (overlay) overlay.remove();
}

function abrirRedeLegado(pilar) {
    const tipos = ['educacao', 'familia', 'saude', 'terapia'];
    const idx = tipos.indexOf(pilar);
    if (idx >= 0) _redeTabAtiva = idx;
    ir('tela-grafico');
    _renderPilarBar('rede-pil-nav-bar', idx >= 0 ? idx : _redeTabAtiva, 'rede');
}

/* ══════════════════════════════════════════
   DESABAFO — espaço exclusivo para cuidadores
══════════════════════════════════════════ */
const DESABAFO_DATA = [
    { icon:'repeat',          titulo:'Rotina do Cuidador',   desc:'Horários, tarefas e correria',       chave:'desab_rotina'      },
    { icon:'heart',           titulo:'Sentimentos',          desc:'Alegria, cansaço e tudo mais',       chave:'desab_sentimentos' },
    { icon:'sparkles',        titulo:'Desejos',              desc:'Sonhos, planos e vontades',          chave:'desab_desejos'     },
    { icon:'message-circle',  titulo:'Desabafo Livre',       desc:'Qualquer assunto, sem julgamento',   chave:'desab_livre'       },
];
const DESABAFO_SHADES = ['#7855C8', '#A888DC', '#8878B8', '#9A6FC0'];
const _DESABAFO_MSGS_SIMULADAS = {};

function iniciarDesabafo() {
    const stack = document.getElementById('desabafo-content-cards');
    if (!stack) return;
    if (DESABAFO_DATA.length === 0) {
        stack.innerHTML = `<div class="parc-vazio"><i data-lucide="message-circle-heart" style="width:36px;height:36px;stroke:rgba(255,255,255,.35);stroke-width:1.4"></i><p style="color:rgba(255,255,255,.55)">Nenhuma sala de desabafo cadastrada ainda.</p></div>`;
        lucide.createIcons();
        return;
    }
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const cards = DESABAFO_DATA.map((t, i) => {
        const userMsgs = d[`desabafo_${t.chave}`] || [];
        const simMsgs  = _DESABAFO_MSGS_SIMULADAS[t.chave] || [];
        const nMsgs = userMsgs.length + simMsgs.length;
        const bc = DESABAFO_SHADES[i % 4];
        const subTxt = `${t.desc} · ${nMsgs} ${nMsgs === 1 ? 'mensagem' : 'mensagens'}`;
        return `
        <div class="edu-panel-card" onclick="abrirSalaDesabafo('${t.chave}','${t.titulo}')">
            <i data-lucide="${t.icon}" class="edu-panel-bg-icon" style="width:78px;height:78px;stroke:white;stroke-width:1.1;fill:none;opacity:.18;pointer-events:none"></i>
            <div class="edu-panel-card-info">
                <div class="edu-panel-card-nome">${t.titulo}</div>
                <div class="edu-panel-card-sub">${subTxt}</div>
            </div>
        </div>`;
    });
    stack.innerHTML = `<div class="pil-cards-grid">${cards.join('')}</div>`;
    lucide.createIcons();
}

function _desabafoBubbleHtml(msgs, chave, nomeUsuario) {
    if (msgs.length === 0)
        return `<div class="rede-vazio"><p>Nenhuma mensagem ainda.<br>Seja o primeiro a compartilhar!</p></div>`;
    return msgs.map((m, i) => {
        const lado = m.autor === nomeUsuario ? 'dir' : 'esq';
        const palavras = (m.autor || 'CA').trim().split(/\s+/);
        const iniciais = palavras.length >= 2
            ? (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase()
            : (m.autor || 'CA').slice(0, 2).toUpperCase();
        const hora = m.data
            ? new Date(m.data).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})
            : '';
        const likes = m.likes || 0;
        const audioHtml = m.audioUrl ? `<audio src="${m.audioUrl}" controls style="width:100%;margin-top:6px;border-radius:8px"></audio>` : '';
        return `
        <div class="rb rb-${lado}">
            <div class="rb-av">${iniciais}</div>
            <div class="rb-card">
                <div class="rb-nome">${m.autor || 'Cuidador anônimo'}</div>
                <div class="rb-texto">${m.texto}</div>
                ${audioHtml}
                <div class="rb-rodape">
                    <span class="rb-hora">${hora}</span>
                    <button class="rb-like" onclick="curtirMsgDesabafo('${chave}',${i},this)">❤️${likes > 0 ? ' ' + likes : ''}</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function curtirMsgDesabafo(chave, idx, btn) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const arr = d[`desabafo_${chave}`];
    if (!arr || !arr[idx]) return;
    arr[idx].likes = (arr[idx].likes || 0) + 1;
    localStorage.setItem('la', JSON.stringify(d));
    if (btn) btn.innerHTML = `❤️ ${arr[idx].likes}`;
}

function abrirSalaDesabafo(chave, titulo) {
    const tela = document.getElementById('tela-desabafo');
    const existing = document.getElementById('desabafo-sala-overlay');
    if (existing) existing.remove();

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const nomeUsuario = d.perfil?.['tea-nome'] ? 'Cuidador(a) de ' + d.perfil['tea-nome'] : 'Cuidador anônimo';
    const simMsgs = _DESABAFO_MSGS_SIMULADAS[chave] || [];
    const msgs = [...simMsgs, ...(d[`desabafo_${chave}`] || [])].sort((a, b) => new Date(a.data) - new Date(b.data));

    const overlay = document.createElement('div');
    overlay.id = 'desabafo-sala-overlay';
    overlay.className = 'rl-sala';
    overlay.innerHTML = `
        <div class="pp2-header">
            <div class="com-header-info">
                <span class="pp2-nome">${titulo}</span>
                <span class="com-canal-sub-txt">Desabafo entre Cuidadores</span>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="rede-chat" id="desabafo-chat-feed">${_desabafoBubbleHtml(msgs, chave, nomeUsuario)}</div>
        <div id="desabafo-chat-input"></div>
        <div class="pp2-bottom">
            <button class="pp2-nav-btn" onclick="voltarDesabafoCards()">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn" onclick="ir('tela-painel')">
                <i data-lucide="arrow-right" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2"></i>
            </button>
            <button class="pp2-nav-btn pp2-btn-add" onclick="">
                <i data-lucide="plus" style="width:26px;height:26px;stroke:rgba(26,58,92,.55);stroke-width:2.2"></i>
            </button>
        </div>`;
    tela.appendChild(overlay);

    setTimeout(() => { const f=document.getElementById('desabafo-chat-feed'); if(f) f.scrollTop=f.scrollHeight; }, 50);
    laRender(document.getElementById('desabafo-chat-input'), 'desabafo-sala', {
        placeholder: `Escreva para ${titulo}…`,
        cor: 'var(--azul-escuro)',
        onEnviar: (texto) => {
            const mod = moderarMensagem(texto);
            if (mod.bloqueada) { const av=document.getElementById('desabafo-aviso-mod'); if(av){av.style.display='block';setTimeout(()=>av.style.display='none',4000);} return; }
            const d2=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d2[`desabafo_${chave}`]) d2[`desabafo_${chave}`]=[];
            d2[`desabafo_${chave}`].push({texto, autor:nomeUsuario, data:new Date().toISOString(), likes:0});
            localStorage.setItem('la',JSON.stringify(d2));
            abrirSalaDesabafo(chave,titulo);
        },
        onAudio: (blob, url) => {
            const d2=JSON.parse(localStorage.getItem('la')||'{}');
            if(!d2[`desabafo_${chave}`]) d2[`desabafo_${chave}`]=[];
            d2[`desabafo_${chave}`].push({texto:'🎙️ Nota de voz ('+Math.round(blob.size/1024)+'KB)', audioUrl:url, autor:nomeUsuario, data:new Date().toISOString(), likes:0});
            localStorage.setItem('la',JSON.stringify(d2));
            abrirSalaDesabafo(chave,titulo);
        }
    });
    lucide.createIcons();
}

function voltarDesabafoCards() {
    const overlay = document.getElementById('desabafo-sala-overlay');
    if (overlay) overlay.remove();
}

/* ══════════════════════════════════════════
   TELA GRÁFICOS — dashboard combinado
══════════════════════════════════════════ */
function iniciarGraficos() {
    selecionarGrafTab(0);
    const d = JSON.parse(localStorage.getItem('la') || '{}');

    const barHtml = (label, val, max, cor) => `
        <div class="graf-bar-row">
            <span class="graf-bar-label">${label}</span>
            <div class="graf-bar-track">
                <div class="graf-bar-fill" style="width:${max > 0 ? Math.round(val/max*100) : 0}%;background:${cor}"></div>
            </div>
            <span class="graf-bar-val">${val}</span>
        </div>`;
    const empty = txt => `<div class="graf-empty">${txt}</div>`;

    // Agenda por cor de pilar
    const agCor = { verde:0, vermelho:0, amarelo:0, roxo:0 };
    Object.values(d.agenda || {}).forEach(dia => {
        (Array.isArray(dia) ? dia : []).forEach(ev => {
            const c = ev.cor || '';
            if (agCor[c] !== undefined) agCor[c]++;
        });
    });

    const pilares = [
        { key:'educacao', label:'Educação', cor:'#6aab8e', agKey:'verde',    elId:'graf-edu' },
        { key:'familia',  label:'Família',  cor:'#E57373', agKey:'vermelho', elId:'graf-fam' },
        { key:'saude',    label:'Saúde',    cor:'#e6b84a', agKey:'amarelo',  elId:'graf-sau' },
        { key:'terapia',  label:'Terapia',  cor:'#9b7bb8', agKey:'roxo',     elId:'graf-ter' },
    ];

    pilares.forEach(p => {
        const el = document.getElementById(p.elId);
        if (!el) return;
        const entries = Object.entries(d[p.key] || {})
            .filter(([, v]) => Array.isArray(v) && v.length > 0)
            .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v.length])
            .sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, [, n]) => s + n, 0);
        const max = Math.max(...entries.map(([, n]) => n), 1);
        const agN = agCor[p.agKey] || 0;

        let html = total
            ? `<div class="graf-total">Registros: <strong>${total}</strong></div>` +
              entries.map(([k, n]) => barHtml(k, n, max, p.cor)).join('')
            : empty(`Nenhum registro em ${p.label} ainda.`);

        if (agN > 0) {
            html += `<div class="graf-total" style="margin-top:10px">Compromissos na agenda: <strong>${agN}</strong></div>`;
        }

        el.innerHTML = html;
    });

    lucide.createIcons();
}

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
    if (form) form.classList.remove('ativa');
}
function fecharFormFamilia(id) { fecharForm(id, 'subtela-familia'); }
function fecharFormSaude(id)   { fecharForm(id, 'subtela-saude');   }

/* ══════════════════════════════════════════
   PERFIL
══════════════════════════════════════════ */
function iniciarPerfil() {
    try {
        const d = JSON.parse(localStorage.getItem('la') || '{}');
        const nome = d.respNome || d.teaNome || (d.perfil && (d.perfil['resp1-nome'] || d.perfil['tea-nome'])) || 'Usuário';
        const partes = nome.trim().split(/\s+/);
        const iniciais = partes.length >= 2
            ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
            : nome.slice(0, 2).toUpperCase();
        const avatarEl = document.getElementById('prf-avatar-initials');
        const nomeEl   = document.getElementById('prf-user-nome');
        if (avatarEl) avatarEl.textContent = iniciais;
        if (nomeEl)   nomeEl.textContent   = nome;
        const tema = d.tema;
        const modoEscuroEl = document.getElementById('prf-modo-escuro');
        if (modoEscuroEl && tema) modoEscuroEl.checked = !tema.claro;
    } catch(e) {}
    lucide.createIcons();
}

/* ══════════════════════════════════════
   PERFIL — EU (IDENTIFICAÇÃO, DIAGNÓSTICO, PLANO DE SAÚDE, QUEM É ESSA PESSOA)
══════════════════════════════════════ */
function abrirFormPerfil() { irPilar('eu'); }

function _euAtualizarNomeUI(nome) {
    if (!nome) return;
    const heroNome = document.getElementById('prf-hero-nome');
    const heroSub  = document.getElementById('prf-hero-sub');
    const ps = document.querySelector('#tela-painel .ps');
    if (heroNome) heroNome.textContent = nome;
    if (heroSub)  heroSub.textContent  = 'Legado de ' + nome;
    if (ps) ps.innerHTML = `<small>bom dia,</small>${nome}`;
    iniciarPerfil();
}

function _abrirFormEuIdentificacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.perfil || {};
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-form-overlay').style.display='none';irPilar('eu')" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Identificação</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">Perfil</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-dados-form">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="eui-nome" type="text" placeholder="Nome completo da pessoa" value="${p['tea-nome'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Nascimento</label>
                    <input class="ter-field-input" id="eui-nasc" type="date" value="${p['tea-nasc'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Sexo</label>
                    <select class="ter-field-input" id="eui-sexo">
                        <option value="">Selecionar</option>
                        <option value="m" ${p['tea-sexo']==='m'?'selected':''}>Masculino</option>
                        <option value="f" ${p['tea-sexo']==='f'?'selected':''}>Feminino</option>
                        <option value="o" ${p['tea-sexo']==='o'?'selected':''}>Outro</option>
                    </select>
                </div>
            </div>
            <button class="ter-save-btn" onclick="_salvarEuIdentificacao()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarEuIdentificacao() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil) d.perfil = {};
    d.perfil['tea-nome'] = document.getElementById('eui-nome')?.value || '';
    d.perfil['tea-nasc'] = document.getElementById('eui-nasc')?.value || '';
    d.perfil['tea-sexo'] = document.getElementById('eui-sexo')?.value || '';
    localStorage.setItem('la', JSON.stringify(d));
    _euAtualizarNomeUI(d.perfil['tea-nome']);
    mostrarToast('✅ Identificação salva!');
    document.getElementById('pil-form-overlay').style.display = 'none';
    irPilar('eu');
}

function _abrirFormEuDiagnostico() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.perfil || {};
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-form-overlay').style.display='none';irPilar('eu')" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Diagnóstico</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">Perfil</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-dados-form">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Diagnóstico</label>
                    <input class="ter-field-input" id="eud-cid" type="text" placeholder="Ex: CID ou descrição" value="${p['tea-cid'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Data</label>
                    <input class="ter-field-input" id="eud-diag" type="month" value="${p['tea-diag'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Nível de suporte</label>
                    <select class="ter-field-input" id="eud-nivel">
                        <option value="">—</option>
                        <option value="1" ${p['tea-nivel']==='1'?'selected':''}>Nível 1</option>
                        <option value="2" ${p['tea-nivel']==='2'?'selected':''}>Nível 2</option>
                        <option value="3" ${p['tea-nivel']==='3'?'selected':''}>Nível 3</option>
                        <option value="outro" ${p['tea-nivel']==='outro'?'selected':''}>Outro</option>
                    </select>
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Profissional</label>
                    <input class="ter-field-input" id="eud-medico" type="text" placeholder="Nome e especialidade" value="${p['tea-medico'] || ''}">
                </div>
            </div>
            <div class="ter-ta-wrap" style="margin-top:12px">
                <label class="ter-ta-label">Diagnósticos adicionais</label>
                <div class="prf-cids-area" id="eud-cids-lista"></div>
                <div class="prf-cid-add-row"><input class="ter-field-input" id="eud-cid-novo" type="text" placeholder="Ex: TDAH, Epilepsia..."><button class="prf-cid-btn" onclick="_euAdicionarCID()"><i data-lucide="plus"></i></button></div>
            </div>
            <button class="ter-save-btn" style="margin-top:12px" onclick="_salvarEuDiagnostico()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
    (p.cidsExtras || []).forEach(cid => _euAdicionarCIDChip(cid));
}

function _euAdicionarCID() {
    const inp = document.getElementById('eud-cid-novo');
    const val = inp.value.trim();
    if (!val) return;
    _euAdicionarCIDChip(val);
    inp.value = '';
}
function _euAdicionarCIDChip(texto) {
    const lista = document.getElementById('eud-cids-lista');
    if (!lista) return;
    const chip = document.createElement('div');
    chip.className = 'prf-cid-chip';
    chip.dataset.cid = texto;
    chip.innerHTML = `<span>${texto}</span><button onclick="this.closest('.prf-cid-chip').remove()" title="Remover"><i data-lucide="x"></i></button>`;
    lista.appendChild(chip);
    lucide.createIcons();
}

function _salvarEuDiagnostico() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil) d.perfil = {};
    d.perfil['tea-cid']    = document.getElementById('eud-cid')?.value || '';
    d.perfil['tea-diag']   = document.getElementById('eud-diag')?.value || '';
    d.perfil['tea-nivel']  = document.getElementById('eud-nivel')?.value || '';
    d.perfil['tea-medico'] = document.getElementById('eud-medico')?.value || '';
    d.perfil.cidsExtras = Array.from(document.querySelectorAll('#eud-cids-lista .prf-cid-chip')).map(chip => chip.dataset.cid);
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('✅ Diagnóstico salvo!');
    document.getElementById('pil-form-overlay').style.display = 'none';
    irPilar('eu');
}

function _abrirFormEuPlanoSaude() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.perfil || {};
    const tipo = p['plano-saude-tipo'] || 'nao';
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-form-overlay').style.display='none';irPilar('eu')" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Plano de Saúde</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">Perfil</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-dados-form">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Possui plano?</label>
                    <select class="ter-field-input" id="eup-tipo" onchange="_euTogglePlanoSaude(this.value)">
                        <option value="nao" ${tipo==='nao'?'selected':''}>Não possui</option>
                        <option value="sim" ${tipo==='sim'?'selected':''}>Sim, possui</option>
                        <option value="sus" ${tipo==='sus'?'selected':''}>SUS</option>
                    </select>
                </div>
            </div>
            <div id="eup-detalhes" class="ter-field-group" style="margin-top:12px;display:${tipo==='sim'?'block':'none'}">
                <div class="ter-field">
                    <label class="ter-field-label">Operadora</label>
                    <input class="ter-field-input" id="eup-operadora" type="text" placeholder="Ex: Unimed…" value="${p['ps-operadora'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Carteirinha</label>
                    <input class="ter-field-input" id="eup-numero" type="text" placeholder="0000 0000 0000" value="${p['ps-numero'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Validade</label>
                    <input class="ter-field-input" id="eup-validade" type="month" value="${p['ps-validade'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Cobre terapias?</label>
                    <select class="ter-field-input" id="eup-cobre">
                        <option value="">Não sei</option>
                        <option value="sim" ${p['ps-cobre']==='sim'?'selected':''}>Sim</option>
                        <option value="parcial" ${p['ps-cobre']==='parcial'?'selected':''}>Parcialmente</option>
                        <option value="nao" ${p['ps-cobre']==='nao'?'selected':''}>Não</option>
                    </select>
                </div>
            </div>
            <button class="ter-save-btn" style="margin-top:12px" onclick="_salvarEuPlanoSaude()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _euTogglePlanoSaude(val) {
    const det = document.getElementById('eup-detalhes');
    if (det) det.style.display = val === 'sim' ? 'block' : 'none';
}

function _salvarEuPlanoSaude() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil) d.perfil = {};
    d.perfil['plano-saude-tipo'] = document.getElementById('eup-tipo')?.value || '';
    d.perfil['ps-operadora']     = document.getElementById('eup-operadora')?.value || '';
    d.perfil['ps-numero']        = document.getElementById('eup-numero')?.value || '';
    d.perfil['ps-validade']      = document.getElementById('eup-validade')?.value || '';
    d.perfil['ps-cobre']         = document.getElementById('eup-cobre')?.value || '';
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('✅ Plano de saúde salvo!');
    document.getElementById('pil-form-overlay').style.display = 'none';
    irPilar('eu');
}

function _abrirFormEuSobre() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.perfil || {};
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-form-overlay').style.display='none';irPilar('eu')" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Quem é essa pessoa</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">Perfil</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-dados-form">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Frase</label>
                    <input class="ter-field-input" id="eus-frase" type="text" placeholder="Ex: Criativa, intensa e cheia de energia…" value="${p['tea-frase'] || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Cidade</label>
                    <input class="ter-field-input" id="eus-cidade" type="text" placeholder="Cidade — Estado" value="${p['cidade'] || ''}">
                </div>
            </div>
            <button class="ter-save-btn" onclick="_salvarEuSobre()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarEuSobre() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil) d.perfil = {};
    d.perfil['tea-frase'] = document.getElementById('eus-frase')?.value || '';
    d.perfil['cidade']    = document.getElementById('eus-cidade')?.value || '';
    localStorage.setItem('la', JSON.stringify(d));
    mostrarToast('✅ Salvo!');
    document.getElementById('pil-form-overlay').style.display = 'none';
    irPilar('eu');
}

/* ══════════════════════════════════════
   AJUSTES — CONTA DE ACESSO
══════════════════════════════════════ */
function _abrirFormConta() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.perfil || {};
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <button class="pp2-nav-btn" onclick="document.getElementById('pil-form-overlay').style.display='none'" style="margin-left:-8px">
                <i data-lucide="arrow-left" style="width:24px;height:24px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
            <div style="flex:1;text-align:center;padding:0 8px;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Conta de acesso</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em">Ajustes</div>
            </div>
            <img src="LApetroleo.png" alt="Legado Azul" class="pp2-logo">
        </div>
        <div class="ter-dados-form">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">E-mail</label>
                    <input class="ter-field-input" id="conta-email" type="email" placeholder="seu@email.com" value="${p.email || ''}">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Telefone</label>
                    <input class="ter-field-input" id="conta-tel" type="tel" placeholder="(00) 00000-0000" value="${p.tel || ''}">
                </div>
            </div>
            <button class="ter-save-btn" onclick="_salvarConta()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarConta() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil) d.perfil = {};
    d.perfil.email = document.getElementById('conta-email')?.value || '';
    d.perfil.tel   = document.getElementById('conta-tel')?.value || '';
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('pil-form-overlay').style.display = 'none';
    mostrarToast('✅ Conta atualizada!');
}

function trocarFotoPerfil(){const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=e=>{const file=e.target.files[0];if(!file) return;const reader=new FileReader();reader.onload=ev=>{const src=ev.target.result;const img=document.getElementById('prf-avatar-img');const ico=document.getElementById('prf-avatar-ico');if(img){img.src=src;img.style.display='block';}if(ico) ico.style.display='none';const ppi=document.getElementById('pp-panel-avatar-img');if(ppi){ppi.src=src;ppi.style.display='block';const plic=ppi.previousElementSibling;if(plic)plic.style.display='none';}const d=JSON.parse(localStorage.getItem('la')||'{}');if(!d.perfil) d.perfil={};d.perfil.avatarSrc=src;localStorage.setItem('la',JSON.stringify(d));};reader.readAsDataURL(file);};input.click();}

/* ══════════════════════════════════════
   PERFIL — NÓS (FAMÍLIA, RESPONSÁVEIS E REDE DE APOIO)
══════════════════════════════════════ */
function _nosComposicaoHtml() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const pessoas = ((d.familia || {})['arvore']) || [];
    if (pessoas.length === 0) {
        return `<div class="pil-form-empty">Nenhuma pessoa cadastrada ainda.<br>Adicione em Família → Raízes → Árvore genealógica.</div>`;
    }
    return pessoas.slice().reverse().map(p => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${p.nome || '—'}</div>
        ${p.parentesco ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Parentesco</div>
            <div class="ter-reg-valor">${p.parentesco}</div>
        </div>` : ''}
    </div>`).join('');
}

function _nosResponsaveisHtml(lista) {
    if (lista.length === 0) {
        return `<div class="pil-form-empty">Nenhum responsável cadastrado ainda.</div>`;
    }
    return lista.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.vinculo ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Vínculo</div>
            <div class="ter-reg-valor">${r.vinculo}</div>
        </div>` : ''}
        ${r.telefone ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Telefone</div>
            <div class="ter-reg-valor">${r.telefone}</div>
        </div>` : ''}
    </div>`).join('');
}

function _nosRedeApoioHtml(lista) {
    if (lista.length === 0) {
        return `<div class="pil-form-empty">Nenhuma pessoa na rede de apoio ainda.</div>`;
    }
    return lista.slice().reverse().map(r => `<div class="ter-reg-card">
        <div class="ter-reg-semana">${r.nome || '—'}</div>
        ${r.papel ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Papel</div>
            <div class="ter-reg-valor">${r.papel}</div>
        </div>` : ''}
        ${r.contato ? `<div class="ter-reg-campo">
            <div class="ter-reg-label">Contato</div>
            <div class="ter-reg-valor">${r.contato}</div>
        </div>` : ''}
    </div>`).join('');
}

function _abrirTelaNos() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const nos = d.perfil_nos || {};
    const responsaveis = nos.responsaveis || [];
    const redeApoio = nos.redeApoio || [];
    const overlay = document.getElementById('pil-form-overlay');
    overlay.innerHTML = `<div class="pil-form-screen">
        <div class="pp2-header" style="flex-shrink:0">
            <div style="flex:1;min-width:0">
                <div style="font-family:var(--ft);font-size:.92rem;font-weight:700;color:rgba(26,58,92,.80)">Nós</div>
                <div style="font-family:var(--ft);font-size:.65rem;color:#3A7A9C;letter-spacing:.03em;margin-top:1px">Família, responsáveis e rede de apoio</div>
            </div>
            <button class="pp2-nav-btn" onclick="_fecharTelaNos()" style="margin-left:auto;margin-right:-8px">
                <i data-lucide="x" style="width:22px;height:22px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-reg-list" style="display:flex">
            <div class="pil-sel-group-title">Composição familiar</div>
            ${_nosComposicaoHtml()}
            <div class="pil-sel-group-title" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between">
                <span>Responsáveis e contatos</span>
                <button class="prf-cid-btn" onclick="_abrirNovoResponsavel()"><i data-lucide="plus"></i></button>
            </div>
            <div id="nos-responsaveis-lista">${_nosResponsaveisHtml(responsaveis)}</div>
            <div class="pil-sel-group-title" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between">
                <span>Rede de apoio</span>
                <button class="prf-cid-btn" onclick="_abrirNovaRedeApoio()"><i data-lucide="plus"></i></button>
            </div>
            <div id="nos-rede-apoio-lista">${_nosRedeApoioHtml(redeApoio)}</div>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _fecharTelaNos() {
    document.getElementById('pil-form-overlay').style.display = 'none';
    voltar();
}

function _abrirNovoResponsavel() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Novo responsável</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="nos-resp-nome" type="text" placeholder="Nome completo">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Vínculo</label>
                    <input class="ter-field-input" id="nos-resp-vinculo" type="text" placeholder="Ex: mãe, pai, avó, tutor">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Telefone</label>
                    <input class="ter-field-input" id="nos-resp-telefone" type="tel" placeholder="(00) 00000-0000">
                </div>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovoResponsavel()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar responsável
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovoResponsavel() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil_nos) d.perfil_nos = {};
    if (!d.perfil_nos.responsaveis) d.perfil_nos.responsaveis = [];
    const nome     = document.getElementById('nos-resp-nome')?.value || '';
    const vinculo  = document.getElementById('nos-resp-vinculo')?.value || '';
    const telefone = document.getElementById('nos-resp-telefone')?.value || '';
    d.perfil_nos.responsaveis.push({ nome, vinculo, telefone });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    document.getElementById('nos-responsaveis-lista').innerHTML = _nosResponsaveisHtml(d.perfil_nos.responsaveis);
    mostrarToast('Responsável salvo!');
}

function _abrirNovaRedeApoio() {
    const overlay = document.getElementById('ter-nova-overlay');
    overlay.innerHTML = `<div class="ter-nova-sheet">
        <div class="ter-nova-header">
            <span class="ter-nova-titulo">Nova pessoa na rede</span>
            <button class="ter-nova-close" onclick="_fecharNovaSemana()">
                <i data-lucide="x" style="width:18px;height:18px;stroke:rgba(26,58,92,.55);stroke-width:2;fill:none"></i>
            </button>
        </div>
        <div class="ter-nova-body">
            <div class="ter-field-group">
                <div class="ter-field">
                    <label class="ter-field-label">Nome</label>
                    <input class="ter-field-input" id="nos-rede-nome" type="text" placeholder="Nome completo">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Papel</label>
                    <input class="ter-field-input" id="nos-rede-papel" type="text" placeholder="Ex: mediador, vizinha, madrinha">
                </div>
                <div class="ter-field">
                    <label class="ter-field-label">Contato</label>
                    <input class="ter-field-input" id="nos-rede-contato" type="tel" placeholder="(00) 00000-0000">
                </div>
            </div>
        </div>
        <div class="ter-nova-footer">
            <button class="ter-save-btn" onclick="_salvarNovaRedeApoio()">
                <i data-lucide="check" style="width:16px;height:16px;stroke:white;stroke-width:2.5;fill:none"></i>
                Salvar
            </button>
        </div>
    </div>`;
    overlay.style.display = 'flex';
    lucide.createIcons();
}

function _salvarNovaRedeApoio() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.perfil_nos) d.perfil_nos = {};
    if (!d.perfil_nos.redeApoio) d.perfil_nos.redeApoio = [];
    const nome    = document.getElementById('nos-rede-nome')?.value || '';
    const papel   = document.getElementById('nos-rede-papel')?.value || '';
    const contato = document.getElementById('nos-rede-contato')?.value || '';
    d.perfil_nos.redeApoio.push({ nome, papel, contato });
    localStorage.setItem('la', JSON.stringify(d));
    document.getElementById('ter-nova-overlay').style.display = 'none';
    document.getElementById('nos-rede-apoio-lista').innerHTML = _nosRedeApoioHtml(d.perfil_nos.redeApoio);
    mostrarToast('Salvo!');
}

/* ══════════════════════════════════════════
   ACESSOS — PIN DE CONVITE
══════════════════════════════════════════ */
function gerarPinAcesso() {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const agora = new Date();
    const expira = new Date(agora.getTime() + 48 * 60 * 60 * 1000);
    const fmt = d => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;

    const d = JSON.parse(localStorage.getItem('la') || '{}');
    if (!d.acessos) d.acessos = { pins: [], historico: [] };
    d.acessos.pins.push({ pin, criado: agora.toISOString(), expira: expira.toISOString() });
    localStorage.setItem('la', JSON.stringify(d));

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px';
    modal.innerHTML = `<div style="background:white;border-radius:20px;padding:28px 24px;max-width:320px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.18)">
        <div style="margin-bottom:16px"><i data-lucide="key-round" style="width:36px;height:36px;stroke:#3A7A9C;stroke-width:1.5;fill:none"></i></div>
        <p style="font-size:.78rem;color:rgba(26,58,92,.55);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">PIN de convite</p>
        <p style="font-size:2.4rem;font-weight:800;letter-spacing:8px;color:#1E3A47;margin-bottom:8px">${pin}</p>
        <p style="font-size:.75rem;color:rgba(26,58,92,.4);margin-bottom:20px">Válido até ${fmt(expira)}</p>
        <p style="font-size:.8rem;color:rgba(26,58,92,.6);line-height:1.55;margin-bottom:22px">Compartilhe este código com o profissional. Ele será usado uma única vez para solicitar acesso ao Legado.</p>
        <button onclick="this.closest('[data-pin-modal]').remove()" style="width:100%;padding:13px;background:#3A7A9C;color:white;border:none;border-radius:12px;font-size:.88rem;font-weight:700;cursor:pointer">ENTENDIDO</button>
    </div>`;
    modal.setAttribute('data-pin-modal', '');
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    lucide.createIcons();
}

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
function confirmarSair(){if(confirm('Deseja sair da sua conta?')) ir('tela-impacto');}

/* ══════════════════════════════════════════
   AJUSTES — tabs e cards por tipo de config
══════════════════════════════════════════ */
const AJUSTES_DATA = [
    [ // Conta
        { icon:'user',        titulo:'Perfil da Família',   desc:'Nome, foto e dados cadastrais',      tipo:'perfil' },
        { icon:'shield',      titulo:'Segurança',           desc:'Senha, biometria e privacidade',     tipo:'seguranca' },
        { icon:'share-2',     titulo:'Acesso Partilhado',   desc:'PINs para profissionais e equipe',   tipo:'partilhar' },
        { icon:'database',    titulo:'Meus Dados',          desc:'Exportar, backup e exclusão',        tipo:'dados' },
        { icon:'log-out',     titulo:'Sair da Conta',       desc:'Encerrar sessão no dispositivo',     tipo:'sair' },
    ],
    [ // Visual
        { icon:'palette',     titulo:'Cor de Fundo',        desc:'7 temas visuais disponíveis',        tipo:'cores' },
        { icon:'sun',         titulo:'Modo de Exibição',    desc:'Claro ou escuro',                    tipo:'modo' },
        { icon:'type',        titulo:'Tipografia',          desc:'Em breve',                           tipo:'breve' },
        { icon:'layout',      titulo:'Interface',           desc:'Em breve',                           tipo:'breve' },
        { icon:'sliders',     titulo:'Personalização',      desc:'Em breve',                           tipo:'breve' },
    ],
    [ // Avisos
        { icon:'calendar',    titulo:'Consultas',           desc:'Lembrete 1 dia antes',               tipo:'ntf-consulta' },
        { icon:'activity',    titulo:'Sessões de Terapia',  desc:'Aviso no dia da sessão',             tipo:'ntf-sessao' },
        { icon:'message-square', titulo:'Novas Mensagens',  desc:'Linha do Tempo',                     tipo:'ntf-msgs' },
        { icon:'info',        titulo:'Dicas e Conteúdo',    desc:'Novidades do Legado Azul',           tipo:'ntf-dicas' },
        { icon:'bell',        titulo:'Canal de Avisos',     desc:'Em breve',                           tipo:'breve' },
    ],
    [ // Plano
        { icon:'credit-card', titulo:'Meu Plano',           desc:'Gerencie sua assinatura',            tipo:'plano' },
        { icon:'zap',         titulo:'Upgrade',             desc:'Desbloqueie recursos avançados',     tipo:'upgrade' },
        { icon:'download',    titulo:'Exportar Legado',     desc:'Relatório completo em PDF',          tipo:'exportar' },
        { icon:'cloud',       titulo:'Backup',              desc:'Cópia segura na nuvem',              tipo:'backup' },
        { icon:'database',    titulo:'Dados e Privacidade', desc:'Exclusão e política de dados',       tipo:'dados-priv' },
    ],
];
const AJ_CORES_TAB = ['#72C8EC','#3D9EC9','#1F7BAA','#165F8C'];
const AJ_CARD_CLS  = ['pp-pc-1','pp-pc-2','pp-pc-3','pp-pc-4','pp-pc-5'];
let _ajTabAtiva = 0;

function _headerPlus() {
    const ativa = document.querySelector('.tela.ativa');
    const id = ativa ? ativa.id : '';
    if (id === 'tela-agenda')     { agAbrirAdd(''); return; }
    if (id === 'tela-documentos') { mostrarToast('Upload de documentos em breve!'); return; }
    if (id === 'tela-grafico')    { mostrarToast('Nova publicação em breve!'); return; }
    if (id === 'tela-painel') {
        const tabs = document.querySelectorAll('#pp-nivel-tabs .pp-nivel-tab');
        const tabIdx = [...tabs].findIndex(t => t.classList.contains('pp-nivel-tab-at'));
        if (tabIdx === 0) { abrirConfigEducacao(); return; }
        if (tabIdx === 1) { abrirConfigFamilia();  return; }
        if (tabIdx === 2) { abrirConfigSaude();    return; }
        if (tabIdx === 3) { abrirConfigTerapia();  return; }
    }
    mostrarToast('Em breve disponível!');
}

function iniciarCfgTela() {
    selecionarAjustesTab(0);
    lucide.createIcons();
}

function toggleModoEscuro(escuro) {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const tema = d.tema || {};
    if (escuro) {
        aplicarTema(tema.corEscura || '#1a3a5c', false);
    } else {
        aplicarTema(tema.corClara || '#97CBE0', true);
    }
}

function abrirCardAjuste(el, tipo) {
    if (tipo === 'perfil')    { ir('tela-perfil'); return; }
    if (tipo === 'partilhar') { ir('tela-partilhar'); return; }
    if (tipo === 'sair')      { confirmarSair(); return; }
    if (tipo === 'upgrade')   { ir('tela-planos'); return; }
    if (tipo === 'exportar')  { exportarPDF(); return; }
    if (tipo === 'backup')    { backupDados(); return; }
    if (tipo === 'breve')     { mostrarToast('✨ Em breve disponível!'); return; }
    if (el.classList.contains('card-aberto')) {
        el.classList.remove('card-aberto');
        const w = el.querySelector('.edu-exp-wrap'); if (w) w.remove();
        return;
    }
    document.querySelectorAll('#ajustes-content-cards .pp-panel-card.card-aberto').forEach(c => {
        c.classList.remove('card-aberto');
        const w = c.querySelector('.edu-exp-wrap'); if (w) w.remove();
    });
    el.classList.add('card-aberto');
    const wrap = document.createElement('div');
    wrap.className = 'edu-exp-wrap';
    wrap.innerHTML = _ajusteConteudo(tipo);
    el.appendChild(wrap);
    lucide.createIcons();
}

function _ajusteConteudo(tipo) {
    const sw = (id, label, sub, checked) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1)">
            <div><div style="font-family:var(--ft);font-size:.82rem;font-weight:600;color:rgba(255,255,255,.9)">${label}</div>
            <div style="font-size:.68rem;color:rgba(255,255,255,.5);margin-top:2px">${sub}</div></div>
            <label class="aj-sw" style="flex-shrink:0"><input type="checkbox" id="${id}" ${checked?'checked':''}><span class="aj-sw-track"></span></label>
        </div>`;
    const btn = (label, sub, icon, fn, danger) => `
        <button onclick="${fn}" style="width:100%;background:none;border:none;display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1);cursor:pointer;text-align:left">
            <div><div style="font-family:var(--ft);font-size:.82rem;font-weight:600;color:${danger?'#ff8080':'rgba(255,255,255,.9)'}">${label}</div>
            ${sub?`<div style="font-size:.68rem;color:rgba(255,255,255,.5);margin-top:2px">${sub}</div>`:''}
            </div>
            <i data-lucide="${icon}" style="width:15px;height:15px;stroke:${danger?'#ff8080':'rgba(255,255,255,.5)'};flex-shrink:0"></i>
        </button>`;
    const wrap = c => `<div style="padding:4px 22px 16px">${c}</div>`;

    if (tipo === 'seguranca') return wrap(
        btn('Alterar senha','Última alteração: nunca','lock','alterarSenha()') +
        sw('ntf-bio','Biometria / Face ID','Impressão digital ou rosto',false));
    if (tipo === 'dados') return wrap(
        btn('Exportar em PDF','Relatório completo de registros','download','exportarPDF()') +
        btn('Backup na nuvem','Salvar cópia segura','cloud','backupDados()') +
        btn('Apagar todos os dados','Ação irreversível','trash-2','apagarDados()',true));
    if (tipo === 'cores') return wrap(`
        <div style="padding:6px 0 4px">
            <div style="font-family:var(--ft);font-size:.65rem;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-bottom:10px">COR DE FUNDO</div>
            <div class="tema-grid" style="padding:0">
                <button class="tema-swatch" data-cor="#0e1f33"  onclick="aplicarTema('#0e1f33',false)"  style="background:#0e1f33"  title="Azul Noite"></button>
                <button class="tema-swatch tema-ativo" data-cor="#1a3a5c" onclick="aplicarTema('#1a3a5c',false)" style="background:#1a3a5c" title="Azul Profundo"></button>
                <button class="tema-swatch" data-cor="#1d5a8a"  onclick="aplicarTema('#1d5a8a',false)"  style="background:#1d5a8a"  title="Azul Oceano"></button>
                <button class="tema-swatch" data-cor="#5ca0c7"  onclick="aplicarTema('#5ca0c7',false)"  style="background:#5ca0c7"  title="Azul Claro"></button>
                <button class="tema-swatch" data-cor="#faf8f4" data-claro onclick="aplicarTema('#faf8f4',true)"  style="background:#faf8f4;border-color:#ddd" title="Creme"></button>
                <button class="tema-swatch" data-cor="#f0f4f8" data-claro onclick="aplicarTema('#f0f4f8',true)"  style="background:#f0f4f8;border-color:#ddd" title="Branco Azulado"></button>
                <button class="tema-swatch" data-cor="#1e1e2e"  onclick="aplicarTema('#1e1e2e',false)"  style="background:#1e1e2e"  title="Grafite"></button>
            </div>
        </div>`);
    if (tipo === 'modo') return wrap(sw('aj-modo-claro','Modo Claro','Fundo creme com texto escuro',false));
    if (tipo.startsWith('ntf-')) {
        const labels = {
            'ntf-consulta':['Lembretes de consultas','Aviso 1 dia antes'],
            'ntf-sessao':  ['Lembretes de sessões','Aviso no dia da terapia'],
            'ntf-msgs':    ['Novas mensagens','Linha do Tempo'],
            'ntf-dicas':   ['Dicas e conteúdo','Novidades do Legado Azul'],
        };
        const [l,s] = labels[tipo]||[tipo,''];
        return wrap(sw(tipo,l,s,tipo!=='ntf-dicas'));
    }
    if (tipo === 'plano') return wrap(`
        <div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:14px;margin:6px 0 10px">
            <div style="font-family:var(--ft);font-size:.88rem;font-weight:700;color:white;margin-bottom:4px">Família · Mensal</div>
            <div style="font-size:.75rem;color:rgba(255,255,255,.65);margin-bottom:10px">R$ 19,90/mês · ✅ Ativo</div>
            <button onclick="ir('tela-planos')" style="width:100%;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:9px;font-family:var(--ft);font-size:.75rem;font-weight:700;color:white;cursor:pointer">Ver todos os planos</button>
        </div>`);
    if (tipo === 'dados-priv') return wrap(
        btn('Política de privacidade','','chevron-right','') +
        btn('Apagar todos os dados','Ação irreversível','trash-2','apagarDados()',true));
    return wrap(`<p style="font-size:.78rem;color:rgba(255,255,255,.45);text-align:center;padding:8px 0">✨ Em breve</p>`);
}

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
let _perfilSelecionado = null;
let _planoSelecionado  = null;

const _credenciais = {
    medico:    { campos: [{ label:'Especialidade', placeholder:'Ex: Neuropediatria, Psiquiatria...', tipo:'text' }, { label:'Nº do conselho (CRM)', placeholder:'Ex: CRM 12345/SP', tipo:'text' }, { label:'Instituição / Clínica', placeholder:'Nome da instituição (opcional)', tipo:'text' }] },
    terapeuta: { campos: [{ label:'Especialidade / Abordagem', placeholder:'Ex: TO, Fonoaudiologia, Psicologia...', tipo:'text' }, { label:'Nº do conselho', placeholder:'Ex: CRP 00000, CREFITO 00000...', tipo:'text' }, { label:'Instituição / Clínica', placeholder:'Nome da instituição (opcional)', tipo:'text' }] },
    educacao:  { campos: [{ label:'Nome da escola / instituição', placeholder:'Nome completo', tipo:'text' }, { label:'CNPJ ou código MEC', placeholder:'Para verificação da instituição', tipo:'text' }, { label:'Seu cargo', placeholder:'Ex: Educador especial, coordenador...', tipo:'text' }] }
};

function selecionarPerfil(p) {
    _perfilSelecionado = p;
    _planoSelecionado  = null;
    document.querySelectorAll('.mo-perfil-btn').forEach(b => b.classList.remove('sel'));
    document.getElementById('mpb-' + p).classList.add('sel');
    const prof = document.getElementById('mo-prof-campos');
    const cfg  = _credenciais[p];
    if (cfg) {
        prof.innerHTML = cfg.campos.map(c =>
            `<div class="cg"><label class="cl">${c.label}</label><input type="${c.tipo}" class="ci" placeholder="${c.placeholder}" oninput="moValidar()"></div>`
        ).join('');
        prof.classList.add('visivel');
    } else {
        prof.innerHTML = '';
        prof.classList.remove('visivel');
    }
    const ind = document.getElementById('mo-plano-ind');
    if (ind) ind.style.display = 'none';
    moValidar();
    setTimeout(() => abrirPlanosSheet(), 160);
}

function moValidar() {
    const nome  = (document.getElementById('mo-nome')?.value  || '').trim();
    const email = (document.getElementById('mo-email')?.value || '').trim();
    const senha  = document.getElementById('mo-senha')?.value  || '';
    const senha2 = document.getElementById('mo-senha2')?.value || '';
    const erroEl = document.getElementById('mo-senha-erro');
    const senhasIguais = senha === senha2;
    if (erroEl) erroEl.style.display = (senha2.length > 0 && !senhasIguais) ? 'block' : 'none';
    const ok = nome && email && senha.length >= 8 && senhasIguais && _perfilSelecionado && _planoSelecionado;
    const btn = document.getElementById('mo-btn-continuar');
    if (btn) { btn.style.opacity = ok ? '1' : '.45'; btn.style.pointerEvents = ok ? 'auto' : 'none'; }
}

function moToggleSenha(id, btn) {
    const input = document.getElementById(id);
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    const svg = btn.querySelector('svg');
    if (mostrar) {
        svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

function moAvancarPlanos() {
    if (!_perfilSelecionado || !_planoSelecionado) return;
    const cadastro = {
        nome:      document.getElementById('mo-nome')?.value   || '',
        email:     document.getElementById('mo-email')?.value  || '',
        tel:       document.getElementById('mo-tel')?.value    || '',
        cidade:    document.getElementById('mo-cidade')?.value || '',
        uf:        document.getElementById('mo-uf')?.value     || '',
        perfil:    _perfilSelecionado,
        plano:     _planoSelecionado.id,
        beneficio: document.getElementById('ps-beneficio')?.value || ''
    };
    localStorage.setItem('la_cadastro_pendente', JSON.stringify(cadastro));
    fecharMo();
}

/* ── Sheet de planos do cadastro ── */
const _planosData = {
    familia: {
        label: 'Família',
        planos: [
            { id:'social',    nome:'LA Social',    preco:'R$ 9,90',  periodo:'/mês' },
            { id:'essencial', nome:'LA Essencial',  preco:'R$ 29,90', periodo:'/mês', badge:'Ideal' },
            { id:'premium',   nome:'LA Premium',    preco:'R$ 49,90', periodo:'/mês', badge:'Recomendado', destaque:true }
        ],
        tabela: [
            { recurso:'Acesso Partilhado',        valores:['—',         '✓',         '✓'] },
            { recurso:'Exportação PDF',          valores:['—',         '✓',         '✓'] },
            { recurso:'IA do Legado',            valores:['Básica',    'Completa',  'Avançada'] },
            { recurso:'Linha do Tempo',          valores:['Limitada',  'Completa',  'Completa'] },
            { recurso:'Membros',                 valores:['2',         '4',         '6'] },
            { recurso:'Mensagens',               valores:['Limitadas', 'Ampliadas', 'Ilimitadas'] },
            { recurso:'Narrativas automáticas',  valores:['—',         '—',         '✓'] },
            { recurso:'Suporte',                 valores:['E-mail',    'Prioritário','Prioritário'] }
        ]
    }
};

let _psPlanoAtivo = 1;

function abrirPlanosSheet() {
    const data = _planosData['familia'];
    document.getElementById('ps-perfil-label').textContent = `Para o perfil ${data.label}`;

    document.getElementById('ps-seletor').innerHTML = data.planos.map((p, i) =>
        `<button class="ps-btn${p.destaque?' ps-sel':''}" id="ps-btn-${i}" onclick="selecionarPlano(${i})">
            <div class="ps-btn-nome">${p.nome}${p.badge ? `<span class="ps-badge-rec${p.destaque?' ps-badge-dest':''}">${p.badge}</span>`:''}</div>
            <div class="ps-btn-preco">${p.preco}<small>${p.periodo}</small></div>
        </button>`
    ).join('');

    data.planos.forEach((p, i) => {
        const th = document.getElementById('ps-th-' + i);
        if (th) th.textContent = p.nome;
    });

    const CHECK = `<svg class="ps-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    document.getElementById('ps-tbody').innerHTML = data.tabela.map(l =>
        `<tr>
            <td class="ps-td ps-td-rec">${l.recurso}</td>
            ${l.valores.map((v,i) => `<td class="ps-td" data-col="${i}">${v==='✓' ? CHECK : v==='—' ? '<span class="ps-dash">—</span>' : v}</td>`).join('')}
        </tr>`
    ).join('');

    _psPlanoAtivo = _planoSelecionado
        ? _planosData['familia'].planos.findIndex(p => p.id === _planoSelecionado.id)
        : 2;
    if (_psPlanoAtivo < 0) _psPlanoAtivo = 2;
    _psAtualizar();
    document.getElementById('ps-ov').classList.add('ab');
    document.getElementById('ps-cd').classList.add('ab');
}

function fecharPlanosSheet() {
    document.getElementById('ps-ov').classList.remove('ab');
    document.getElementById('ps-cd').classList.remove('ab');
}

function selecionarPlano(i) {
    _psPlanoAtivo = i;
    _psAtualizar();
}

function _psAtualizar() {
    const data  = _planosData['familia'];
    const plano = data.planos[_psPlanoAtivo];
    document.querySelectorAll('.ps-btn').forEach((b, i) => b.classList.toggle('ps-sel', i === _psPlanoAtivo));
    document.getElementById('ps-tabela').setAttribute('data-ativo', _psPlanoAtivo);
    const isSocial = _psPlanoAtivo === 0;
    document.getElementById('ps-social-info').style.display = isSocial ? 'block' : 'none';
    document.getElementById('ps-btn-confirmar').textContent = `CONTINUAR COM ${plano.nome.toUpperCase()}`;
    psValidar();
}

function psValidar() {
    const isSocial = _psPlanoAtivo === 0;
    const beneficio = document.getElementById('ps-beneficio')?.value || '';
    const ok = !isSocial || beneficio !== '';
    const btn = document.getElementById('ps-btn-confirmar');
    btn.style.opacity = ok ? '1' : '.45';
    btn.style.pointerEvents = ok ? 'auto' : 'none';
}

function confirmarPlano() {
    const data  = _planosData['familia'];
    _planoSelecionado = data.planos[_psPlanoAtivo];
    fecharPlanosSheet();

    const ind = document.getElementById('mo-plano-ind');
    if (ind) {
        ind.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5ca0c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${_planoSelecionado.nome}</span>
            <span class="mo-plano-preco">${_planoSelecionado.preco}/mês</span>
            <button onclick="abrirPlanosSheet()" class="mo-plano-troca">Trocar</button>`;
        ind.style.display = 'flex';
    }
    moValidar();
}

/* ── Override ir() ── */
const _irBase=ir;
ir=function(id){
    _irBase(id);
    if(id==='tela-linhatempo') setTimeout(()=>{renderizarLDT();lucide.createIcons();},50);
    if(id==='tela-perfil')     setTimeout(()=>{iniciarPerfil();lucide.createIcons();},50);
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
function formatarTel(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 6)  v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0)  v = `(${v}`;
    input.value = v;
}

function formatarCEP(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
    input.value = v;

    const endDiv = document.getElementById('mo-end-auto');
    if (!endDiv) return;

    if (v.length === 9) {
        input.style.borderColor = '#5ca0c7';
        fetch(`https://viacep.com.br/ws/${v.replace('-','')}/json/`)
            .then(r => r.json())
            .then(d => {
                if (!d.erro) {
                    document.getElementById('mo-rua').value    = d.logradouro || '';
                    document.getElementById('mo-bairro').value = d.bairro     || '';
                    document.getElementById('mo-cidade').value = d.localidade || '';
                    document.getElementById('mo-uf').value     = d.uf         || '';
                    endDiv.classList.add('visivel');
                } else {
                    input.style.borderColor = '#e57373';
                    endDiv.classList.remove('visivel');
                }
            })
            .catch(() => {});
    } else {
        input.style.borderColor = '';
        endDiv.classList.remove('visivel');
    }
}

/* ══════════════════════════════════════════
   NÍVEL 2 — seleção de opção e salvar
══════════════════════════════════════════ */
let _nivelAtivo = 0;

function abrirNivel(n) {
    _nivelAtivo = n;
    const el = document.getElementById('tela-nivel' + n);
    el.classList.add('nivel-pronto');
    document.getElementById('nivel-backdrop').style.display = 'block';
    el.style.transform = 'translateY(0)';
    const msgCatMap = { 6:'educacao', 7:'familia', 8:'saude', 9:'terapia', 10:'rede' };
    if (msgCatMap[n]) _renderNivelMensagens(msgCatMap[n]);
    if (n === 1) atuConts();
    lucide.createIcons();
}

function fecharNivel() {
    _nivelAtivo = 0;
    document.querySelectorAll('[id^="tela-nivel"]').forEach(el => {
        el.style.transform = 'translateY(110%)';
    });
    const seletor = document.getElementById('tela-seletor-msg');
    if (seletor) seletor.style.transform = 'translateY(110%)';
    document.getElementById('nivel-backdrop').style.display = 'none';
}

let _linhatempoNivel = 0;

function abrirLinhaDoTempo(filtro) {
    _linhatempoNivel = _nivelAtivo;
    fecharNivel();
    ir('tela-linhatempo');
    if (filtro) setTimeout(() => filtrarLDT(filtro), 80);
}

function fecharLinhaDoTempo() {
    ir('tela-painel');
    if (_linhatempoNivel) {
        const n = _linhatempoNivel;
        _linhatempoNivel = 0;
        setTimeout(() => abrirNivel(n), 0);
    }
}

let _subtopicoOrigem = 'tela-painel';
let _subtopicoNivel  = 0;

function abrirSubtopico(id) {
    _subtopicoNivel = _nivelAtivo;   // guarda qual bottom sheet estava aberto
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
    if (_subtopicoNivel) { abrirNivel(_subtopicoNivel); _subtopicoNivel = 0; }
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
const PARCEIROS = {
    educacao: [],
    familia: [],
    saude: [],
    terapia: [],
};

function abrirParceiros(aba) {
    ir('tela-parceiros');
    _parcAbaAtiva = aba;
    const abas = ['educacao','familia','saude','terapia'];
    const idx = abas.indexOf(aba);
    if (idx >= 0) selecionarParcTab(idx);
    else _parcRenderizar(aba);
}

let _parcAbaAtiva = 'educacao';
let _parcFiltroAtivo = 'educacao';

const _PARC_GRUPOS = {
    educacao: ['educacao'],
    familia:  ['familia'],
    saude:    ['saude'],
    terapia:  ['terapia'],
};
const _PARC_CAT_LABEL = {
    educacao:'Educação', familia:'Família', saude:'Saúde', terapia:'Terapia'
};
const _RATINGS = [4.9,4.8,4.7,4.8,4.6,4.9,4.7,4.8,4.5,4.9];
const _DISTS   = ['1.2 km','2.4 km','0.8 km','3.1 km','1.7 km','2.0 km','0.5 km','4.2 km','1.1 km','2.8 km'];

const _PARC_DESC = {
    'edu-creche':        'Ambientes seguros e acolhedores para os pequenos.',
    'edu-escola':        'Ensino infantil, fundamental e médio com qualidade.',
    'edu-faculdade':     'Graduação e pós-graduação para impulsionar seu futuro.',
    'edu-profissionais': 'Especialistas e prestadores de serviços para apoiar você.',
    'edu-cursos':        'Cursos livres, profissionalizantes e de desenvolvimento pessoal.',
    'edu-artes':         'Cultura, criatividade e expressão para inspirar.',
    'edu-esportes':      'Atividades físicas e esportivas para o desenvolvimento.',
    'sau-cardio':        'Cuidado especializado para o coração e circulação.',
    'sau-dentista':      'Saúde bucal e cuidados odontológicos completos.',
    'sau-gastro':        'Diagnóstico e tratamento do sistema digestivo.',
    'sau-geneti':        'Avaliação e aconselhamento genético especializado.',
    'sau-neuro':         'Cuidado especializado do sistema nervoso.',
    'sau-oftalmo':       'Cuidados completos para a saúde dos olhos.',
    'sau-orto':          'Tratamento de ossos, músculos e articulações.',
    'sau-otorrino':      'Saúde dos ouvidos, nariz e garganta.',
    'sau-pediatra':      'Acompanhamento especializado do crescimento infantil.',
    'sau-psiqui':        'Saúde mental e equilíbrio emocional.',
    'ter-aba':           'Intervenção comportamental para o desenvolvimento.',
    'ter-fisio':         'Reabilitação motora e funcional especializada.',
    'ter-fono':          'Comunicação, linguagem e deglutição.',
    'ter-musico':        'Música como ferramenta terapêutica e de expressão.',
    'ter-nutri':         'Alimentação saudável e planos nutricionais personalizados.',
    'ter-psi':           'Suporte emocional e psicológico especializado.',
    'ter-psicoped':      'Apoio à aprendizagem e desenvolvimento educacional.',
    'ter-to':            'Autonomia e participação nas atividades do dia a dia.',
    'inc-apae':          'Inclusão e suporte para pessoas com deficiência.',
    'inc-cras':          'Proteção social e assistência às famílias.',
    'inc-cultura':       'Lazer, cultura e integração social inclusiva.',
    'inc-esporte':       'Esporte e atividade física adaptada para todos.',
    'inc-ong':           'Organizações de apoio e assistência social.',
    'inc-trans':         'Transporte acessível e adaptado.',
};

function selecionarParcTab(idx) {
    const cores = ['#3A9A6A', '#C84040', '#C8A020', '#7855C8'];
    const tipos = ['educacao', 'familia', 'saude', 'terapia'];
    _renderPilarBar('parc-pil-nav-bar', idx, 'parceiro');
    document.querySelectorAll('.parc-tab-card').forEach((card, i) => {
        card.classList.toggle('parc-tab-at', i === idx);
        card.style.setProperty('--parc-cor', cores[i]);
    });
    const pg = document.getElementById('parc-greeting');
    if (pg) pg.textContent = 'Rede Parceiros';
    _parcFiltroAtivo = tipos[idx];
    _parcAbaAtiva = tipos[idx];
    _parcRenderizar(tipos[idx]);
}

function _parcNavNext() {
    ir('tela-painel');
}

function parcFiltro(tipo, btn) {
    const tipos = ['educacao', 'familia', 'saude', 'terapia'];
    const idx = tipos.indexOf(tipo);
    if (idx >= 0) { selecionarParcTab(idx); return; }
    _parcFiltroAtivo = tipo;
    _parcAbaAtiva = tipo;
    _parcRenderizar(tipo);
}

function _parcRenderizar(filtro) {
    const lista = document.getElementById('parc-lista');
    if (!lista) return;
    const parceiros = PARCEIROS[filtro] || [];

    if (parceiros.length === 0) {
        lista.innerHTML = `<div class="parc-vazio"><i data-lucide="package-open" style="width:36px;height:36px;stroke:rgba(30,58,71,.25);stroke-width:1.4"></i><p>Nenhum parceiro cadastrado ainda.</p></div>`;
        lucide.createIcons();
        return;
    }

    lista.innerHTML = parceiros.map(p => `
        <div class="parcnew-card" onclick="abrirFicha('${p.id}')" style="--pc:${p.cor}">
            <div class="parcnew-body">
                <div class="parcnew-nome">${p.nome}</div>
                <div class="parcnew-desc">${p.subTitulo} · ★ ${p.rating.toFixed(1)}</div>
            </div>
            <i data-lucide="${p.icone}" class="parcnew-bg-icon" style="width:78px;height:78px;stroke:var(--pc);stroke-width:1.1;fill:none;opacity:.18"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

function parcAba(btn, aba, idx) { parcFiltro(aba, btn); }

let _parcNivel = 0;

function abrirFicha(id, nivelOrigem) {
    if (nivelOrigem) { _parcNivel = nivelOrigem; fecharNivel(); } else { _parcNivel = 0; }
    const allList = [...PARCEIROS.educacao, ...PARCEIROS.familia, ...PARCEIROS.saude, ...PARCEIROS.terapia];
    const p = allList.find(x => x.id === id);
    if (!p) return;
    document.getElementById('parc-ficha-body').innerHTML = `
        <div class="pf-hero">
            <div class="pf-hero-nome">${p.nome}</div>
            <div class="pf-hero-cat">${p.subTitulo}</div>
            <div class="pf-hero-rating">
                <i data-lucide="star" style="width:14px;height:14px;stroke:#C8A020;fill:#C8A020;stroke-width:0"></i>
                <span>${p.rating.toFixed(1)}</span>
            </div>
            <div class="pf-hero-desc">${p.desc}</div>
        </div>
        <div class="pf-em-breve">
            <div class="pf-eb-ico">
                <i data-lucide="clock" style="width:28px;height:28px;stroke:${p.cor};stroke-width:1.5"></i>
            </div>
            <p class="pf-eb-txt">Informações de contato e agenda disponíveis em breve.</p>
        </div>
        <button class="pf-cta-btn" style="background:${p.cor}" onclick="mostrarToast('Contato disponível em breve!')">
            <i data-lucide="phone" style="width:18px;height:18px;stroke:white;stroke-width:1.8"></i>
            Entrar em contato
        </button>
    `;
    const fichaG = document.getElementById('parc-ficha-greeting');
    if (fichaG) fichaG.textContent = p.nome;
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('tela-parc-ficha').classList.add('ativa');
    lucide.createIcons();
}

function fecharFicha() {
    const n = _parcNivel;
    document.querySelectorAll('.tela, .subtela').forEach(t => {
        t.classList.remove('ativa');
        t.style.cssText = '';
    });
    document.getElementById('nivel-backdrop').style.display = 'none';
    document.getElementById('tela-painel').classList.add('ativa');
    atuConts();
    lucide.createIcons();
    if (n) setTimeout(() => abrirNivel(n), 50);
    else { ir('tela-parceiros'); }
}

/* ══════════════════════════════════════════
   SAÚDE DO CUIDADOR — profissionais de saúde mental
══════════════════════════════════════════ */
const PROFISSIONAIS_SAUDE = [];
const SAUDE_CUID_ESPECIALIDADES = [
    { esp: 'Todos',        icon: 'layout-grid',     cor: '#7855C8', desc: 'Ver todos os profissionais' },
    { esp: 'Psicólogo',    icon: 'brain',           cor: '#7855C8', desc: 'Psicologia e terapia' },
    { esp: 'Psicanalista', icon: 'heart-handshake', cor: '#7855C8', desc: 'Escuta psicanalítica' },
    { esp: 'Psiquiatra',   icon: 'pill',            cor: '#7855C8', desc: 'Acompanhamento psiquiátrico' },
];
let _saudeCuidFiltroAtivo = 'Todos';

function _saudeCuidCombina(esp, filtro) {
    if (filtro === 'Todos') return true;
    if (filtro === 'Psicólogo') return esp === 'Psicólogo' || esp === 'Psicóloga';
    return esp === filtro;
}

function renderSaudeCuidadorCategorias() {
    const el = document.getElementById('saude-cuid-categorias');
    if (!el) return;
    el.innerHTML = `<div class="pil-cards-grid">${SAUDE_CUID_ESPECIALIDADES.map(c => {
        const n = PROFISSIONAIS_SAUDE.filter(p => _saudeCuidCombina(p.especialidade, c.esp)).length;
        const subTxt = `${c.desc} · ${n} ${n === 1 ? 'profissional' : 'profissionais'}`;
        return `
        <div class="edu-panel-card" onclick="abrirSaudeCuidadorLista('${c.esp}')">
            <i data-lucide="${c.icon}" class="edu-panel-bg-icon" style="width:78px;height:78px;stroke:white;stroke-width:1.1;fill:none;opacity:.18;pointer-events:none"></i>
            <div class="edu-panel-card-info">
                <div class="edu-panel-card-nome">${c.esp}</div>
                <div class="edu-panel-card-sub">${subTxt}</div>
            </div>
        </div>`;
    }).join('')}</div>`;
    lucide.createIcons();
}

function abrirSaudeCuidadorLista(esp) {
    _saudeCuidFiltroAtivo = esp;
    ir('tela-saude-cuidador-lista');
}

function renderSaudeCuidadorListaFiltrada() {
    const titulo = document.getElementById('saude-cuid-lista-titulo');
    if (titulo) titulo.textContent = _saudeCuidFiltroAtivo === 'Todos' ? 'Todos os profissionais' : _saudeCuidFiltroAtivo;

    const lista = document.getElementById('saude-cuid-lista');
    if (!lista) return;
    const profissionais = PROFISSIONAIS_SAUDE.filter(p => _saudeCuidCombina(p.especialidade, _saudeCuidFiltroAtivo));

    if (profissionais.length === 0) {
        lista.innerHTML = `<div class="parc-vazio"><i data-lucide="package-open" style="width:36px;height:36px;stroke:rgba(30,58,71,.25);stroke-width:1.4"></i><p>Nenhum profissional encontrado.</p></div>`;
        lucide.createIcons();
        return;
    }

    lista.innerHTML = profissionais.map(p => `
        <div class="parcnew-card" onclick="abrirFichaSaudeCuidador('${p.id}')" style="--pc:${p.cor}">
            <div class="parcnew-body">
                <div class="parcnew-nome">${p.nome}</div>
                <div class="parcnew-desc">${p.especialidade} · ★ ${p.rating.toFixed(1)}</div>
            </div>
            <i data-lucide="${p.icone}" class="parcnew-bg-icon" style="width:78px;height:78px;stroke:var(--pc);stroke-width:1.1;fill:none;opacity:.18"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

function abrirFichaSaudeCuidador(id) {
    const p = PROFISSIONAIS_SAUDE.find(x => x.id === id);
    if (!p) return;
    document.getElementById('saude-cuid-ficha-body').innerHTML = `
        <div class="pf-hero">
            <div class="pf-hero-nome">${p.nome}</div>
            <div class="pf-hero-cat">${p.especialidade}</div>
            <div class="pf-hero-rating">
                <i data-lucide="star" style="width:14px;height:14px;stroke:#C8A020;fill:#C8A020;stroke-width:0"></i>
                <span>${p.rating.toFixed(1)}</span>
            </div>
            <div class="pf-hero-desc">${p.desc}</div>
        </div>
        <div class="pf-info-row">
            <span class="pf-info-label">Valor da sessão</span>
            <span class="pf-info-value">${p.valorSessao}</span>
        </div>
        <div class="pf-info-row">
            <span class="pf-info-label">Formação acadêmica</span>
            <span class="pf-info-value">${p.formacao}</span>
        </div>
        <button class="pf-cta-btn" style="background:${p.cor}" onclick="ir('tela-mensagens'); _abrirChatResponsavel('prof_${p.id}', '${p.nome}', '${p.especialidade}', 3)">
            <i data-lucide="message-circle" style="width:18px;height:18px;stroke:white;stroke-width:1.8"></i>
            Entrar em contato
        </button>
    `;
    const fichaG = document.getElementById('saude-cuid-ficha-greeting');
    if (fichaG) fichaG.textContent = p.nome;
    document.querySelectorAll('.tela, .subtela').forEach(t => t.classList.remove('ativa'));
    document.getElementById('tela-saude-cuidador-ficha').classList.add('ativa');
    lucide.createIcons();
}

function renderCuidadoresMensagens() {
    const lista = document.getElementById('cuid-msg-lista');
    if (!lista) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const conversas = PROFISSIONAIS_SAUDE
        .map(p => ({ p, msgs: d['msg_prof_' + p.id] || [] }))
        .filter(c => c.msgs.length > 0);

    if (conversas.length === 0) {
        lista.innerHTML = `<div class="parc-vazio"><i data-lucide="message-square" style="width:36px;height:36px;stroke:rgba(30,58,71,.25);stroke-width:1.4"></i><p>Nenhuma conversa iniciada ainda.<br>Fale com um profissional em Atendimento psicológico.</p></div>`;
        lucide.createIcons();
        return;
    }

    lista.innerHTML = conversas.map(({ p, msgs }) => {
        const ultima = msgs[msgs.length - 1];
        return `
        <div class="parcnew-card" onclick="ir('tela-mensagens'); _abrirChatResponsavel('prof_${p.id}', '${p.nome}', '${p.especialidade}', 3)" style="--pc:${p.cor}">
            <div class="parcnew-body">
                <div class="parcnew-nome">${p.nome}</div>
                <div class="parcnew-desc">${ultima.texto}</div>
            </div>
            <i data-lucide="${p.icone}" class="parcnew-bg-icon" style="width:78px;height:78px;stroke:var(--pc);stroke-width:1.1;fill:none;opacity:.18"></i>
        </div>`;
    }).join('');
    lucide.createIcons();
}

/* ── LINHA DO TEMPO — JORNADA ──────────────────────── */
let _ldtFiltro = 'todos';

function filtrarLDT(s) {
    _ldtFiltro = s;
    document.querySelectorAll('#ldt-filtros .ldt-fbtn').forEach(b => b.classList.toggle('ldt-at', b.dataset.s === s));
    renderizarLDT();
}

function renderizarLDT() {
    const container = document.getElementById('ldt-feed');
    if (!container) return;
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const f = _ldtFiltro;
    const lista = [];

    const COR    = { raiz: '#6aab8e', caminho: '#E57373', topo: '#e6b84a', essencia: '#9b7bb8' };
    const RGBA   = { raiz: 'rgba(106,171,142,.2)', caminho: 'rgba(229,115,115,.2)', topo: 'rgba(230,184,74,.2)', essencia: 'rgba(155,123,184,.2)' };
    const _add   = (secao, titulo, ncampos, data) => lista.push({ secao, cor: COR[secao], rgba: RGBA[secao], titulo, ncampos, data: data || new Date().toISOString() });

    if (f === 'todos' || f === 'raiz') {
        ['educacao','familia','saude','terapia'].forEach(p => {
            Object.values(d[p] || {}).forEach(regs => regs.forEach(r => _add('raiz', r.titulo || p, Object.keys(r.campos||{}).length, r.data)));
        });
    }
    if (f === 'todos' || f === 'caminho') {
        Object.values(d.nivel2 || {}).forEach(regs => regs.forEach(r => _add('caminho', r.titulo || 'Caminho', Object.keys(r.campos||{}).length, r.data)));
        (d.evolucao || []).filter(e => e.nivel === 2).forEach(r => _add('caminho', r.tipo || r.titulo || 'Registro', 0, r.data));
    }
    if (f === 'todos' || f === 'topo') {
        Object.values(d.nivel3 || {}).forEach(regs => regs.forEach(r => _add('topo', r.titulo || 'Topo', Object.keys(r.campos||{}).length, r.data)));
        (d.evolucao || []).filter(e => e.nivel === 3).forEach(r => _add('topo', r.tipo || r.titulo || 'Registro', 0, r.data));
    }
    if (f === 'todos' || f === 'essencia') {
        Object.values(d.essencia || {}).forEach(regs => regs.forEach(r => _add('essencia', r.titulo || 'Essência', Object.keys(r.campos||{}).length, r.data)));
    }

    if (lista.length === 0) {
        container.innerHTML = `<div class="ldt-vazio"><div class="ldt-vazio-ico"><i data-lucide="hourglass" style="width:24px;height:24px;stroke:rgba(255,255,255,.4)"></i></div><p><strong style="color:rgba(255,255,255,.6);display:block;margin-bottom:4px">Nenhum registro ainda</strong>Adicione registros em Raiz, Caminho, Topo ou Essência para ver o histórico aqui.</p></div>`;
        lucide.createIcons();
        return;
    }

    lista.sort((a, b) => new Date(b.data) - new Date(a.data));
    const grupos = {};
    lista.forEach(item => {
        const chave = new Date(item.data).toISOString().slice(0, 10);
        if (!grupos[chave]) grupos[chave] = { label: formatarLabelData(new Date(item.data)), items: [] };
        grupos[chave].items.push(item);
    });

    let html = '';
    const gArr = Object.values(grupos);
    gArr.forEach((grupo, gi) => {
        html += `<div class="ldt-grupo-label">${grupo.label}</div>`;
        grupo.items.forEach((item, idx) => {
            const hora = new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const isLast = gi === gArr.length - 1 && idx === grupo.items.length - 1;
            const sub = item.ncampos > 0 ? `<div class="ldt-item-sub">${item.ncampos} campo${item.ncampos !== 1 ? 's' : ''} preenchido${item.ncampos !== 1 ? 's' : ''}</div>` : '';
            html += `<div class="ldt-item"><div class="ldt-item-left"><div class="ldt-item-dot" style="background:${item.cor}"></div>${!isLast ? '<div class="ldt-item-linha"></div>' : ''}</div><div class="ldt-item-body"><div class="ldt-item-top"><span class="ldt-badge" style="background:${item.rgba};color:${item.cor}">${item.secao.charAt(0).toUpperCase()+item.secao.slice(1)}</span><span class="ldt-hora">${hora}</span></div><div class="ldt-item-titulo">${item.titulo}</div>${sub}</div></div>`;
        });
    });
    container.innerHTML = html;
    lucide.createIcons();
}

/* ── DOCUMENTOS ─────────────────────────────────────── */
const DOC_LABELS = {
    diagnostico: 'Diagnóstico',
    laudo: 'Laudo',
    encaminhamento: 'Encaminhamento',
    receita: 'Receita',
    exame: 'Exame',
    beneficio: 'Benefício',
    outro: 'Outro'
};

function abrirFormDoc(tipo) {
    document.getElementById('form-doc-titulo').textContent = DOC_LABELS[tipo] || 'Documento';
    const sel = document.getElementById('fd-tipo');
    if (sel) sel.value = tipo;
    abrirForm('form-documento');
}

function salvarFormDoc() {
    const doc = {
        tipo: document.getElementById('fd-tipo').value,
        titulo: document.getElementById('fd-titulo').value,
        emissor: document.getElementById('fd-emissor').value,
        data: document.getElementById('fd-data').value,
        validade: document.getElementById('fd-validade').value,
        numero: document.getElementById('fd-numero').value,
        obs: document.getElementById('fd-obs').value,
        criadoEm: new Date().toISOString()
    };
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.documentos) la.documentos = [];
    la.documentos.push(doc);
    localStorage.setItem('la', JSON.stringify(la));
    fecharForm('form-documento');
    mostrarToast('Documento salvo!');
    renderDocumentos();
}

/* ══════════════════════════════════════════
   DOCUMENTOS — renderização
══════════════════════════════════════════ */
let _docFiltro = 'beneficio';
let _docBusca  = '';

const _docTipoGrupo = {
    diagnostico:'saude', laudo:'saude', receita:'saude', exame:'saude',
    encaminhamento:'educacao', beneficio:'beneficio', outro:'outro'
};
const _docTipoIcon = {
    diagnostico:'file-heart', laudo:'file-text', receita:'pill', exame:'activity',
    encaminhamento:'send', beneficio:'shield', outro:'file'
};
const _docTipoLabel = {
    diagnostico:'Diagnóstico', laudo:'Laudo', receita:'Receita', exame:'Exame',
    encaminhamento:'Encaminhamento', beneficio:'Benefício', outro:'Outro'
};

function renderDocumentos() {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    let docs = (la.documentos || []).slice().reverse();

    if (_docFiltro !== 'todos')
        docs = docs.filter(d => (_docTipoGrupo[d.tipo] || 'outro') === _docFiltro);
    if (_docBusca.trim()) {
        const q = _docBusca.toLowerCase();
        docs = docs.filter(d => (d.titulo||'').toLowerCase().includes(q) || (d.emissor||'').toLowerCase().includes(q));
    }

    const card = (doc, destaque) => {
        const icon = _docTipoIcon[doc.tipo] || 'file';
        const label = _docTipoLabel[doc.tipo] || 'Documento';
        const dataFmt = doc.data
            ? new Date(doc.data + 'T12:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'})
            : '—';
        return `
        <div class="doc-card">
            <div class="doc-card-ico ${destaque ? 'doc-card-ico-destaque' : ''}">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="doc-card-txt">
                <div class="doc-card-nome">${doc.titulo || 'Sem título'}</div>
                <div class="doc-card-meta">${dataFmt} · ${label}</div>
            </div>
            <button class="doc-card-dots" onclick="event.stopPropagation()"><i data-lucide="more-vertical"></i></button>
        </div>`;
    };

    const recentesEl = document.getElementById('doc-lista-recentes');
    const todosEl    = document.getElementById('doc-lista-todos');
    if (!recentesEl || !todosEl) return;

    const recentes = docs.slice(0, 4);
    recentesEl.innerHTML = recentes.length
        ? `<div class="doc-sec-label">Adicionados Recentemente</div>${recentes.map((d,i) => card(d, i===0)).join('')}`
        : '';

    todosEl.innerHTML = docs.length
        ? `<div class="doc-sec-label">Todos os Arquivos</div>${docs.map((d,i) => card(d, i===0)).join('')}`
        : `<div class="doc-vazio"><i data-lucide="folder-open"></i><p>Nenhum documento ainda.<br>Toque em + para adicionar.</p></div>`;

    lucide.createIcons();
}

function selecionarDocTab(idx) {
    const cores = ['#72C8EC', '#3D9EC9', '#1F7BAA', '#1a3a5c'];
    const tipos = ['beneficio', 'educacao', 'saude', 'outro'];
    const slider = document.getElementById('doc-nivel-slider');
    if (slider) {
        slider.style.transform = `translateX(${idx * 100}%)`;
        slider.style.background = cores[idx];
    }
    document.querySelectorAll('#doc-filtro-tabs .pp-nivel-tab').forEach((t, i) =>
        t.classList.toggle('pp-nivel-tab-at', i === idx)
    );
    _docFiltro = tipos[idx];
    renderDocumentos();
}

function filtrarDoc(tipo, btn) {
    const tipos = ['beneficio', 'educacao', 'saude', 'outro'];
    const idx = tipos.indexOf(tipo);
    if (idx >= 0) { selecionarDocTab(idx); return; }
    _docFiltro = tipo;
    renderDocumentos();
}

function selecionarGrafTab(idx) {
    const cores = ['#72C8EC', '#3D9EC9', '#1F7BAA', '#1a3a5c'];
    const slider = document.getElementById('graf-nivel-slider');
    if (slider) {
        slider.style.transform = `translateX(${idx * 100}%)`;
        slider.style.background = cores[idx];
    }
    document.querySelectorAll('#graf-filtro-tabs .pp-nivel-tab').forEach((t, i) =>
        t.classList.toggle('pp-nivel-tab-at', i === idx)
    );
    ['graf-card-0', 'graf-card-1', 'graf-card-2', 'graf-card-3'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.style.display = i === idx ? '' : 'none';
    });
}

function selecionarAjustesTab() {
    ['cfg-sec-docs','cfg-card-docs',
     'cfg-sec-graf','cfg-card-graf','cfg-sec-seg','cfg-card-seg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
    });
    _cfgRenderGraficos();
}

function _cfgRenderGraficos() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const barHtml = (label, val, max, cor) => `
        <div class="graf-bar-row">
            <span class="graf-bar-label">${label}</span>
            <div class="graf-bar-track">
                <div class="graf-bar-fill" style="width:${max > 0 ? Math.round(val/max*100) : 0}%;background:${cor}"></div>
            </div>
            <span class="graf-bar-val">${val}</span>
        </div>`;
    const empty = txt => `<div class="graf-empty">${txt}</div>`;
    const pilares = [
        { key:'educacao', label:'Educação', cor:'#6aab8e', elId:'cfg-graf-edu' },
        { key:'familia',  label:'Família',  cor:'#E57373', elId:'cfg-graf-fam' },
        { key:'saude',    label:'Saúde',    cor:'#e6b84a', elId:'cfg-graf-sau' },
        { key:'terapia',  label:'Terapia',  cor:'#9b7bb8', elId:'cfg-graf-ter' },
    ];
    pilares.forEach(p => {
        const el = document.getElementById(p.elId);
        if (!el) return;
        const entries = Object.entries(d[p.key] || {})
            .filter(([, v]) => Array.isArray(v) && v.length > 0)
            .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v.length])
            .sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, [, n]) => s + n, 0);
        const max = Math.max(...entries.map(([, n]) => n), 1);
        el.innerHTML = total
            ? `<div class="graf-total">Registros: <strong>${total}</strong></div>` +
              entries.map(([k, n]) => barHtml(k, n, max, p.cor)).join('')
            : empty(`Nenhum registro ainda.`);
    });
    lucide.createIcons();
}

function filtrarDocBusca(val) {
    _docBusca = val;
    renderDocumentos();
}

/* ══════════════════════════════════════════
   TELA DE ENTRADA — perfil, login, cadastro, termos
══════════════════════════════════════════ */
let _perfilLogin = 'familia';

function setLoginTab(tab) {
    _perfilLogin = tab;
    ['eu','familia','profissional'].forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (btn) btn.classList.toggle('en-tab-at', t === tab);
    });
    const erro = document.getElementById('en-erro');
    if (erro) erro.textContent = '';
}

function enAbrirForm() {
    document.getElementById('en-splash')?.classList.add('oculto');
    document.getElementById('en-form-phase')?.classList.add('aberto');
}

function enFecharForm() {
    document.getElementById('en-form-phase')?.classList.remove('aberto');
    document.getElementById('en-splash')?.classList.remove('oculto');
}

/* ── Auth sheet — abrir/fechar/trocar modo ── */
function abrirAuth(modo) {
    document.getElementById('en-auth-ov')?.classList.add('ab');
    document.getElementById('en-auth-sheet')?.classList.add('aberta');
    _mostrarFormAuth(modo || 'login');
    lucide.createIcons();
}

function fecharAuth() {
    document.getElementById('en-auth-ov')?.classList.remove('ab');
    document.getElementById('en-auth-sheet')?.classList.remove('aberta');
}

function _mostrarFormAuth(modo) {
    const isLogin = modo === 'login';
    const titulo  = document.getElementById('en-auth-title');
    if (titulo) titulo.textContent = isLogin ? 'Entrar' : 'Criar conta';
    const fl = document.getElementById('en-form-login');
    const fc = document.getElementById('en-form-cadastro');
    if (fl) fl.style.display = isLogin ? '' : 'none';
    if (fc) fc.style.display = isLogin ? 'none' : '';
}

function iniciarCadastro() {
    const email = document.getElementById('en-email-cad')?.value?.trim() || '';
    const dst   = document.getElementById('cad-email');
    if (dst && email) dst.value = email;
    fecharAuth();
    abrirCadastro();
}

function entrarSemCadastro() {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.perfil) la.perfil = { 'tea-nome': 'Visitante' };
    if (!la.plano)  la.plano  = { tipo: 'fam', modal: 'mensal' };
    localStorage.setItem('la', JSON.stringify(la));
    ir('tela-painel'); barra();
}

function entrarNoLegado() {
    const email = document.getElementById('en-email')?.value?.trim() || '';
    const senha = document.getElementById('en-senha')?.value || '';
    const erro  = document.getElementById('en-erro');
    if (!email || !senha) {
        if (erro) erro.textContent = 'Preencha e-mail e senha para continuar.';
        return;
    }
    if (erro) erro.textContent = '';
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.plano) { fecharAuth(); abrirCadastro(); return; }
    fecharAuth();
    ir('tela-painel'); barra();
}

function entrarComGoogle() {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.plano) { fecharAuth(); abrirCadastro(true); return; }
    fecharAuth(); ir('tela-painel'); barra();
}

function entrarComApple() {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.plano) { fecharAuth(); abrirCadastro(true); return; }
    fecharAuth(); ir('tela-painel'); barra();
}

function entrarComOutlook() {
    const la = JSON.parse(localStorage.getItem('la') || '{}');
    if (!la.plano) { fecharAuth(); abrirCadastro(true); return; }
    fecharAuth(); ir('tela-painel'); barra();
}

/* ── Termos ── */
function abrirTermos() {
    document.getElementById('en-termos-ov')?.classList.add('ab');
    document.getElementById('en-termos-sheet')?.classList.add('ab');
}
function fecharTermos() {
    document.getElementById('en-termos-ov')?.classList.remove('ab');
    document.getElementById('en-termos-sheet')?.classList.remove('ab');
}

/* ══════════════════════════════════════════
   CADASTRO — bottom sheet / 3 passos
══════════════════════════════════════════ */
let _cadPlanoSel = null;

function abrirCadastro(social = false) {
    _cadPlanoSel = null;
    _cadMostrarPasso(1);
    if (social) {
        const src = document.getElementById('en-email');
        const dst = document.getElementById('cad-email');
        if (src && dst) dst.value = src.value;
    }
    document.getElementById('cad-ov')?.classList.add('ab');
    document.getElementById('cad-sheet')?.classList.add('ab');
}

function fecharCadastro() {
    document.getElementById('cad-ov')?.classList.remove('ab');
    document.getElementById('cad-sheet')?.classList.remove('ab');
}

function cadSelecionarPerfil(perfil, btn) {
    _perfilLogin = perfil;
    document.querySelectorAll('.cad-perfil-btn').forEach(b => b.classList.remove('cad-perfil-sel'));
    if (btn) btn.classList.add('cad-perfil-sel');
    setLoginTab(perfil);
}

function _cadMostrarPasso(p) {
    [1,2,3,4,5].forEach(n => {
        const el = document.getElementById('cad-p' + n);
        if (el) el.style.display = n === p ? 'block' : 'none';
    });
    const pcts = {1:'20%', 2:'40%', 3:'60%', 4:'80%', 5:'100%'};
    const fill = document.getElementById('cad-step-fill');
    const txt  = document.getElementById('cad-step-txt');
    if (fill) fill.style.width = pcts[p];
    if (txt)  txt.textContent  = 'Passo ' + p + ' de 5';
    if (p === 3) _cadMontarIdentidade();
    if (p === 4) _cadMontarPlanos();
    if (p === 5) _cadMontarPagamento();
    document.getElementById('cad-sheet')?.scrollTo(0, 0);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function _cadMontarIdentidade() {
    ['eu','cuidador','prof'].forEach(id => {
        const el = document.getElementById('cad-id-' + id);
        if (el) el.style.display = 'none';
    });
    const cfg = {
        eu:           { titulo: 'Sobre você',     desc: 'Confirme sua data de nascimento.',                            id: 'cad-id-eu' },
        familia:      { titulo: 'Sobre a pessoa',  desc: 'Essas informações vinculam o histórico corretamente.',        id: 'cad-id-cuidador' },
        profissional: { titulo: 'Sua atuação',     desc: 'Confirme seu registro para ativar o perfil profissional.',   id: 'cad-id-prof' }
    };
    const c = cfg[_perfilLogin] || cfg.familia;
    const titulo = document.getElementById('cad-p2-titulo');
    const desc   = document.getElementById('cad-p2-desc');
    if (titulo) titulo.textContent = c.titulo;
    if (desc)   desc.textContent   = c.desc;
    const bloco = document.getElementById(c.id);
    if (bloco) bloco.style.display = 'block';
}

const _cadPlanos = {
    familia: [
        { id:'social',    nome:'LA Social',    preco:'R$ 9,90',   periodo:'/mês',  itens:['IA Básica do Legado','Linha do Tempo limitada','Até 2 membros','Mensagens limitadas'] },
        { id:'essencial', nome:'LA Essencial', preco:'R$ 29,90',  periodo:'/mês',  badge:'Ideal',        itens:['IA Completa do Legado','Linha do Tempo completa','Até 4 membros','Exportação em PDF'] },
        { id:'premium',   nome:'LA Premium',   preco:'R$ 49,90',  periodo:'/mês',  badge:'Recomendado',  destaque:true, itens:['IA Avançada · Narrativas automáticas','Até 6 membros','Suporte prioritário','Tudo do LA Essencial'] }
    ],
    eu: [
        { id:'social',    nome:'LA Social',    preco:'R$ 9,90',   periodo:'/mês',  itens:['IA Básica do Legado','Linha do Tempo limitada','Registro pessoal'] },
        { id:'essencial', nome:'LA Essencial', preco:'R$ 29,90',  periodo:'/mês',  badge:'Ideal',        itens:['IA Completa','Linha do Tempo completa','Exportação em PDF'] },
        { id:'premium',   nome:'LA Premium',   preco:'R$ 49,90',  periodo:'/mês',  badge:'Recomendado',  destaque:true, itens:['IA Avançada · Narrativas automáticas','Suporte prioritário','Tudo do LA Essencial'] }
    ],
    profissional: [
        { id:'essencial', nome:'LA Essencial', preco:'R$ 79,90',  periodo:'/mês',  itens:['Pacientes ilimitados','Acesso ao bloco da especialidade','Perfil verificado · visível às famílias'] },
        { id:'premium',   nome:'LA Premium',   preco:'R$ 109,90', periodo:'/mês',  badge:'Recomendado',  destaque:true, itens:['Tudo do LA Essencial','Exportação de relatórios em PDF','IA Clínica completa'] },
        { id:'elite',     nome:'LA Elite',     preco:'R$ 129,90', periodo:'/mês',  badge:'Completo',     itens:['Tudo do LA Premium','IA Clínica avançada · todas as especialidades','Linha do Tempo completa'] }
    ]
};

function _cadMontarPlanos() {
    const container = document.getElementById('cad-planos');
    if (!container) return;
    const lista = _cadPlanos[_perfilLogin] || _cadPlanos.familia;

    container.innerHTML = lista.map((p, i) => `
        <div class="pcard pc-leg${p.destaque?' pcard-destaque':''}${i===1?' sel':''}" id="cpla-${p.id}" onclick="cadSelPlano('${p.id}')">
            <div class="rdot"></div>
            ${p.badge ? `<div class="pla-badge-destaque">${p.badge}</div>` : ''}
            <div class="ptop2" ${p.badge?'style="margin-top:6px"':''}>
                <div><div class="pnome">${p.nome}</div></div>
                <div class="pprec">${p.preco}<small>${p.periodo}</small></div>
            </div>
            <ul class="pitens" style="margin-top:8px">${p.itens.map(it=>`<li>${it}</li>`).join('')}</ul>
        </div>`).join('');

    _cadPlanoSel = lista[1] || lista[0];
}

function cadSelPlano(id) {
    const lista = _cadPlanos[_perfilLogin] || _cadPlanos.familia;
    _cadPlanoSel = lista.find(p => p.id === id) || lista[0];
    document.querySelectorAll('#cad-planos .pcard').forEach(c => c.classList.remove('sel'));
    document.getElementById('cpla-' + id)?.classList.add('sel');
}

function cadIr(passo) {
    if (passo === 2) {
        const err = document.getElementById('cad-err-0');
        if (!_perfilLogin) { if (err) err.textContent = 'Selecione quem é você para continuar.'; return; }
        if (err) err.textContent = '';
    }
    if (passo === 3) {
        const nome     = document.getElementById('cad-nome')?.value?.trim()  || '';
        const email    = document.getElementById('cad-email')?.value?.trim() || '';
        const senha    = document.getElementById('cad-senha')?.value         || '';
        const confirma = document.getElementById('cad-confirma')?.value      || '';
        const err = document.getElementById('cad-err-1');
        if (!nome || !email || !senha) { if (err) err.textContent = 'Preencha todos os campos.'; return; }
        if (senha.length < 8)          { if (err) err.textContent = 'Senha precisa ter pelo menos 8 caracteres.'; return; }
        if (senha !== confirma)         { if (err) err.textContent = 'As senhas não coincidem.'; return; }
        if (err) err.textContent = '';
    }
    if (passo === 4) {
        let ok = true;
        if (_perfilLogin === 'eu')
            ok = !!document.getElementById('cad-nasc')?.value;
        else if (_perfilLogin === 'familia')
            ok = !!(document.getElementById('cad-crianca')?.value?.trim()) &&
                 !!(document.getElementById('cad-vinculo')?.value);
        else
            ok = !!(document.getElementById('cad-area')?.value) &&
                 !!(document.getElementById('cad-registro')?.value?.trim());
        const err = document.getElementById('cad-err-2');
        if (!ok) { if (err) err.textContent = 'Preencha os campos obrigatórios.'; return; }
        if (err) err.textContent = '';
    }
    if (passo === 5) {
        if (!_cadPlanoSel) { mostrarToast('Escolha um plano para continuar.'); return; }
    }
    _cadMostrarPasso(passo);
}

function _cadMontarPagamento() {
    const nome = document.getElementById('cad-plano-nome-sel');
    if (nome && _cadPlanoSel) nome.textContent = _cadPlanoSel.nome + ' · ' + _cadPlanoSel.preco + _cadPlanoSel.periodo;
    cadPayTab('cartao');
}

function cadPayTab(tab) {
    const cartao = document.getElementById('cad-pay-cartao');
    const pix    = document.getElementById('cad-pay-pix');
    const btnC   = document.getElementById('cad-pt-cartao');
    const btnP   = document.getElementById('cad-pt-pix');
    if (cartao) cartao.style.display = tab === 'cartao' ? 'block' : 'none';
    if (pix)    pix.style.display    = tab === 'pix'    ? 'block' : 'none';
    if (btnC)   { btnC.classList.toggle('cad-pay-at', tab === 'cartao'); }
    if (btnP)   { btnP.classList.toggle('cad-pay-at', tab === 'pix'); }
}

function cadMaskCard(el) {
    let v = el.value.replace(/\D/g,'').slice(0,16);
    el.value = v.replace(/(.{4})/g,'$1 ').trim();
}

function cadMaskVal(el) {
    let v = el.value.replace(/\D/g,'').slice(0,4);
    if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
    el.value = v;
}

function cadFinalizarPagamento() {
    const tab = document.getElementById('cad-pt-cartao')?.classList.contains('cad-pay-at') ? 'cartao' : 'pix';
    const err = document.getElementById('cad-err-4');

    if (tab === 'cartao') {
        const num  = document.getElementById('cad-card-num')?.value?.replace(/\s/g,'')  || '';
        const nome = document.getElementById('cad-card-nome')?.value?.trim()             || '';
        const val  = document.getElementById('cad-card-val')?.value                      || '';
        const cvv  = document.getElementById('cad-card-cvv')?.value                      || '';
        if (num.length < 16 || !nome || val.length < 5 || cvv.length < 3) {
            if (err) err.textContent = 'Preencha todos os dados do cartão.';
            return;
        }
    }
    if (err) err.textContent = '';

    const la = JSON.parse(localStorage.getItem('la') || '{}');
    la.plano  = _cadPlanoSel;
    la.perfil = _perfilLogin;
    localStorage.setItem('la', JSON.stringify(la));
    fecharCadastro();
    mostrarToast('Bem-vindo ao Legado Azul!');
    ir('tela-painel');
    barra();
}

/* ── linha zigzag do check-in ao carregar ── */
setTimeout(desenharLinhaConexao, 400);

/* ── inicialização das listas de Mensagens ── */
_msgCarregar();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _renderTodosMensagens);
} else {
    _renderTodosMensagens();
}

/* ── logo LA: clique em qualquer tela volta ao painel ── */
document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('pp2-logo')) return;
    ['pil-seletor-overlay', 'pil-form-overlay', 'ter-nova-overlay',
     'msg-familia-seletor-overlay', 'msg-edu-seletor-overlay', 'msg-sau-seletor-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    ['msg-chat-overlay', 'rl-sala-overlay', 'desabafo-sala-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
    ir('tela-painel');
});
