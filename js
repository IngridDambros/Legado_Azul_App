/* ══════════════════════════════════════════
   LEGADO AZUL — app.js v2 + Mapa Real Brasil
   Alteração: mapa geográfico real via D3 + TopoJSON IBGE
   Todo o resto do código permanece idêntico ao original.
══════════════════════════════════════════ */

/* ── NAVEGAÇÃO ── */
function ir(id) {
    if (typeof _fecharRede === 'function') _fecharRede();
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    const destino = document.getElementById(id);
    if (!destino) { console.warn('ir(): tela não encontrada:', id); return; }
    destino.classList.add('ativa');
    lucide.createIcons();
    if (id === 'tela-painel') atuConts();
    if (id === 'tela-historico') carregarHistorico();
}

/* ── Fecha a Rede Legado em qualquer contexto de navegação ── */
function _fecharRede() {
    const el = document.getElementById('tela-rede-legado');
    if (el) { el.classList.remove('ativa'); el.style.display = 'none'; }
}



function abrirPilar(p) {
    _fecharRede();
    document.getElementById('tela-painel').classList.remove('ativa');
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
    injetarMicrofonesNoForm(id);
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

function getPilarDoForm(id) {
    if (id.startsWith('ff-')) return 'familia';
    if (id.startsWith('fs-')) return 'saude';
    if (id.startsWith('ft-')) return 'terapia';
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
    sem: {
        solo: {
            nome: 'Gratuito — Acesso Social',
            icone: 'minus', cor: '#5d8ab2',
            tagline: 'Para começar a organizar. O primeiro passo do legado.',
            ancora: 'Você organiza. Mas o histórico ainda fica só com você.',
            verificacao: 'Para ter acesso gratuito, informe seu número de NIS, BPC ou CadÚnico.',
            sim: ['Acesso completo aos 4 pilares de registro','1 perfil de criança','Histórico cronológico','Linha do Tempo pessoal'],
            nao: ['Convite a profissionais por PIN','Backup automático na nuvem','Exportação em PDF','Rede Legado']
        }
    },
    fam: {
        mensal: {
            nome: 'Família · Teste',
            icone: 'feather', cor: '#2c3e50',
            tagline: 'Modo de teste ativo — R$ 0,00',
            ancora: 'Explore todos os recursos sem custo durante o período de testes.',
            sim: ['1 perfil de criança completo','Backup automático','Convite por PIN','Rede Legado','Exportação em PDF','Gravação de sessão','Notificações push'],
            nao: []
        },
        anual: {
            nome: 'Família · Anual (Teste)',
            icone: 'feather', cor: '#2c3e50',
            tagline: 'Modo de teste — R$ 0,00',
            ancora: 'Versão de testes com acesso completo.',
            sim: ['Tudo do plano mensal','Relatórios formatados','Suporte prioritário'],
            nao: []
        }
    },
    pro: {
        mensal: {
            nome: 'Profissional · Teste',
            icone: 'user-check', cor: '#4a7c59',
            tagline: 'Modo de teste — R$ 0,00',
            ancora: 'Acesse todos os recursos profissionais sem custo durante o teste.',
            sim: ['Pacientes ilimitados','Gravação de sessão com relatório','Acesso ao bloco da especialidade','Perfil verificado'],
            nao: []
        },
        anual: {
            nome: 'Profissional · Anual (Teste)',
            icone: 'user-check', cor: '#4a7c59',
            tagline: 'Modo de teste — R$ 0,00',
            ancora: 'Versão de testes profissional.',
            sim: ['Tudo do plano mensal','Exportação de relatórios em PDF'],
            nao: []
        },
        inst: {
            nome: 'Plano Institucional',
            icone: 'building-2', cor: '#6b3fa0',
            tagline: 'Para clínicas, hospitais e escolas.',
            ancora: 'Contato para proposta.',
            sim: ['Todos os benefícios profissionais','Painel do coordenador','Nota fiscal mensal'],
            nao: []
        }
    }
};

const planoPrecos = {
    sem:  { solo:   'Gratuito' },
    fam:  { mensal: 'R$ 0,00 (teste)', anual: 'R$ 0,00 (teste)' },
    pro:  { mensal: 'R$ 0,00 (teste)', anual: 'R$ 0,00 (teste)', inst: 'A negociar' }
};

const planoLabels = {
    sem:  { solo:   'CONTINUAR GRATUITAMENTE' },
    fam:  { mensal: 'ATIVAR MODO TESTE', anual: 'ATIVAR MODO TESTE ANUAL' },
    pro:  { mensal: 'ATIVAR MODO TESTE PRO', anual: 'ATIVAR MODO TESTE PRO ANUAL', inst: 'SOLICITAR PROPOSTA' }
};

let planoAtual = { tipo: 'fam', modal: 'mensal' };

function selPlano(tipo, modal) {
    planoAtual = { tipo, modal };
    document.querySelectorAll('.pcard').forEach(c => c.classList.remove('sel'));
    const idMap = {
        'sem-solo':'pc-sem','fam-mensal':'pc-fam-mensal','fam-anual':'pc-fam-anual',
        'pro-mensal':'pc-pro-mensal','pro-anual':'pc-pro-anual','pro-inst':'pc-pro-inst'
    };
    const card = document.getElementById(idMap[tipo+'-'+modal]);
    if (card) card.classList.add('sel');
    const btnLabel = 'CONTINUAR COM: ' + planoPrecos[tipo]?.[modal];
    const btn = document.getElementById('btn-plano');
    if (btn) btn.textContent = btnLabel;
    atualizarDetalhePlano(tipo, modal);
}

function mostrarPlanosPorPerfil(perfil) {
    const fam = document.getElementById('planos-familia');
    const pro = document.getElementById('planos-profissional');
    const ds  = document.getElementById('pla-ds');
    if (!fam || !pro) return;
    if (perfil === 'familia') {
        fam.style.display = 'block'; pro.style.display = 'none';
        if (ds) ds.textContent = 'Modo de teste ativo — explore todos os recursos sem custo.';
        selPlano('fam','mensal');
    } else {
        fam.style.display = 'none'; pro.style.display = 'block';
        if (ds) ds.textContent = 'Modo de teste profissional — pacientes ilimitados, R$ 0,00.';
        selPlano('pro','mensal');
    }
}

function voltarDePlanos() {
    ir('tela-login');
    if (_perfilSelecionado) abrirMo();
}

function confirmarPlano() {
    fecharDetalhePlano();
    ir('tela-painel');
    barra();
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    d.planoAtivo = planoAtual;
    localStorage.setItem('la', JSON.stringify(d));
    atualizarExibicaoPlano();
    solicitarPermissaoNotificacoes();
}

function atualizarExibicaoPlano() {
    const d = JSON.parse(localStorage.getItem('la') || '{}');
    const p = d.planoAtivo || { tipo: 'fam', modal: 'mensal' };
    const nomes = {
        'sem-solo':   { nome:'Gratuito',              preco:'R$ 0 — para sempre',      cor:'#5d8ab2' },
        'fam-mensal': { nome:'Família · Teste',        preco:'R$ 0,00 (teste)',         cor:'#2c3e50' },
        'fam-anual':  { nome:'Família · Anual (Teste)',preco:'R$ 0,00 (teste)',         cor:'#2d7a3a' },
        'pro-mensal': { nome:'Profissional · Teste',   preco:'R$ 0,00 (teste)',         cor:'#4a7c59' },
        'pro-anual':  { nome:'Pro · Anual (Teste)',    preco:'R$ 0,00 (teste)',         cor:'#4a7c59' },
        'pro-inst':   { nome:'Institucional',          preco:'A negociar',             cor:'#6b3fa0' }
    };
    const key = p.tipo+'-'+p.modal;
    const info = nomes[key] || nomes['fam-mensal'];
    const prfNome   = document.querySelector('.prf-plano-nome');
    const prfStatus = document.querySelector('.prf-plano-status');
    if (prfNome)   prfNome.innerHTML = `<i data-lucide="feather" style="width:14px;height:14px;opacity:.7"></i> ${info.nome}`;
    if (prfStatus) prfStatus.textContent = `Ativo · ${info.preco}`;
    const ajNome   = document.querySelector('.aj-plano-nome');
    const ajPreco  = document.querySelector('.aj-plano-preco');
    const ajStatus = document.querySelector('.aj-plano-status');
    if (ajNome)   ajNome.innerHTML = `<i data-lucide="feather" style="width:14px;height:14px;opacity:.7"></i> ${info.nome}`;
    if (ajPreco)  ajPreco.innerHTML = info.preco;
    if (ajStatus) ajStatus.textContent = `✅ Ativo`;
    const upgradeBox = document.querySelector('.aj-plano-upgrade');
    if (upgradeBox) upgradeBox.style.display = 'none';
    lucide.createIcons();
}

/* ── BOTTOM SHEET detalhe do plano ── */
function atualizarDetalhePlano(tipo, modal) {
    const sheet   = document.getElementById('pla-sheet');
    const overlay = document.getElementById('pla-sheet-ov');
    const inner   = document.getElementById('pla-sheet-inner');
    if (!sheet || !inner) return;
    const dados = dadosPlanos[tipo]?.[modal];
    if (!dados) return;
    const simHtml = dados.sim.map(txt => `<div class="pla-det-item"><div class="pla-det-item-ico sim">✓</div><span>${txt}</span></div>`).join('');
    const naoHtml = dados.nao && dados.nao.length > 0 ? `<div class="pla-det-secao">Não incluso</div><div class="pla-det-itens">${dados.nao.map(txt => `<div class="pla-det-item nao-tem"><div class="pla-det-item-ico nao">×</div><span>${txt}</span></div>`).join('')}</div>` : '';
    const verHtml = dados.verificacao ? `<p class="pla-det-verificacao">ℹ️ ${dados.verificacao}</p>` : '';
    inner.innerHTML = `
        <div class="pla-det-cabecalho">
            <div class="pla-det-ico" style="background:${dados.cor}"><i data-lucide="${dados.icone}"></i></div>
            <div><div class="pla-det-nome">${dados.nome}</div><div class="pla-det-preco-inline">${planoPrecos[tipo]?.[modal]||''}</div></div>
        </div>
        <div class="pla-det-tagline">${dados.tagline}</div>
        <div class="pla-det-secao">O que está incluso</div>
        <div class="pla-det-itens">${simHtml}</div>
        ${naoHtml}
        <div class="pla-det-ancora">${dados.ancora}</div>${verHtml}`;
    const sheetBtn = document.getElementById('pla-sheet-btn');
    if (sheetBtn) sheetBtn.textContent = 'CONTINUAR — '+(planoPrecos[tipo]?.[modal]||'');
    lucide.createIcons();
    sheet.classList.add('ab');
    if (overlay) { overlay.style.display='block'; requestAnimationFrame(()=>overlay.classList.add('ab')); }
    document.body.style.overflow = 'hidden';
}

function fecharDetalhePlano() {
    const sheet = document.getElementById('pla-sheet');
    const overlay = document.getElementById('pla-sheet-ov');
    if (sheet)   sheet.classList.remove('ab');
    if (overlay) { overlay.classList.remove('ab'); setTimeout(()=>{overlay.style.display='none';},350); }
    document.body.style.overflow = '';
}

/* ══════════════════════════════════════════
   MODAL UPGRADE
══════════════════════════════════════════ */
let _upgradeContexto = '';
let _upgradePlanoSel = 'fam-mensal';

function abrirUpgrade(contexto) {
    _upgradeContexto = contexto || '';
    const sub = document.getElementById('upgrade-sub-txt');
    if (sub) sub.textContent = contexto || 'Este recurso está disponível a partir do plano pago.';
    selUpgrade('fam-mensal');
    document.getElementById('mo-upgrade-ov').classList.add('ab');
    document.getElementById('mo-upgrade-cd').classList.add('ab');
}

function fecharUpgrade() {
    document.getElementById('mo-upgrade-ov').classList.remove('ab');
    document.getElementById('mo-upgrade-cd').classList.remove('ab');
}

function selUpgrade(plano) {
    _upgradePlanoSel = plano;
    document.querySelectorAll('.upgrade-card').forEach(c=>c.classList.remove('upgrade-card-sel'));
    document.querySelectorAll('.upgrade-card-radio').forEach(r=>{r.classList.remove('upgrade-card-radio-sel');r.innerHTML='';});
    const labels = {
        'fam-mensal':'ATIVAR MODO TESTE — R$ 0,00',
        'fam-anual':'ATIVAR MODO TESTE ANUAL — R$ 0,00',
        'pro-mensal':'ATIVAR MODO TESTE PRO — R$ 0,00'
    };
    const cards = document.querySelectorAll('.upgrade-card');
    const idx = ['fam-mensal','fam-anual','pro-mensal'].indexOf(plano);
    if (cards[idx]) {
        cards[idx].classList.add('upgrade-card-sel');
        const radio = cards[idx].querySelector('.upgrade-card-radio');
        if (radio) { radio.classList.add('upgrade-card-radio-sel'); radio.innerHTML=''; }
    }
    const btn = document.getElementById('upgrade-cta-btn');
    if (btn) btn.textContent = labels[plano]||'ATIVAR';
}

function confirmarUpgrade() {
    fecharUpgrade();
    const mapa = {'fam-mensal':{tipo:'fam',modal:'mensal'},'fam-anual':{tipo:'fam',modal:'anual'},'pro-mensal':{tipo:'pro',modal:'mensal'}};
    planoAtual = mapa[_upgradePlanoSel]||{tipo:'fam',modal:'mensal'};
    confirmarPlano();
    mostrarToast('✅ Modo teste ativado!');
}

/* ── PROGRESSO ── */
function barra() {
    setTimeout(() => {
        const p = calcPct();
        document.getElementById('bfi').style.width = p+'%';
        document.getElementById('pct').textContent = p+'%';
    }, 500);
}

function calcPct() {
    const d = JSON.parse(localStorage.getItem('la')||'{}');
    let t = 0;
    ['educacao','familia','saude','terapia'].forEach(p=>{Object.values(d[p]||{}).forEach(a=>{t+=a.length;});});
    return Math.min(Math.round(t/40*100),100);
}

function atuConts() {
    const d = JSON.parse(localStorage.getItem('la')||'{}');
    const map = {educacao:'cnt-edu',familia:'cnt-fam',saude:'cnt-sau',terapia:'cnt-ter'};
    Object.entries(map).forEach(([p,id])=>{
        let t=0; Object.values(d[p]||{}).forEach(a=>{t+=a.length;});
        const el=document.getElementById(id);
        if(el) el.textContent=t+(t===1?' registro':' registros');
    });
    const p=calcPct();
    const b=document.getElementById('bfi'); if(b) b.style.width=p+'%';
    const pc=document.getElementById('pct'); if(pc) pc.textContent=p+'%';
    const sb=document.getElementById('psb');
    if(sb) sb.textContent=p===0?'Comece adicionando registros em qualquer área.'
        :p<30?'Bom começo! Continue construindo o legado.'
        :p<70?'Ótimo progresso! O histórico já está tomando forma.'
        :'Legado sólido. Cada registro é uma memória garantida.';
    atualizarBadgeRede();
}

window.onload = () => {
    lucide.createIcons();
    document.querySelectorAll('.nit').forEach(item=>{
        item.addEventListener('click',()=>{
            const destino = item.dataset.destino;
            if(destino){
                document.querySelectorAll('.nit').forEach(n=>n.classList.remove('at'));
                item.classList.add('at');
                ir(destino);
            }
        });
    });
    atualizarExibicaoPlano();
    injetarIconeRedeLegado();
    solicitarPermissaoNotificacoes();
    simularNotificacaoTeste();
    /* Pré-carrega D3 + TopoJSON para o mapa */
    carregarScriptsMapaBrasil();
};

/* ══════════════════════════════════════════
   🗺️  MAPA REAL DO BRASIL — SVG Inline
   Paths extraídos do pacote npm brazil-map
   Viewport 340x380 — sem dependências externas
══════════════════════════════════════════ */

/* Paleta por região */
const _mapaCorRegiao = {
    Norte:'#5ca0c7', Nordeste:'#e6b84a', CentroOeste:'#9b7bb8',
    Sudeste:'#6aab8e', Sul:'#5878b8'
};
const _mapaRegiao = {
    AC:'Norte',AM:'Norte',AP:'Norte',PA:'Norte',RO:'Norte',RR:'Norte',TO:'Norte',
    AL:'Nordeste',BA:'Nordeste',CE:'Nordeste',MA:'Nordeste',PB:'Nordeste',
    PE:'Nordeste',PI:'Nordeste',RN:'Nordeste',SE:'Nordeste',
    DF:'CentroOeste',GO:'CentroOeste',MS:'CentroOeste',MT:'CentroOeste',
    ES:'Sudeste',MG:'Sudeste',RJ:'Sudeste',SP:'Sudeste',
    PR:'Sul',RS:'Sul',SC:'Sul'
};

/* Paths SVG do Brasil — extraídos do pacote npm brazil-map, re-escalados para viewport 340x380 */
const BRASIL_PATHS = [
  {sigla:'AC',cx:33.0,cy:142.3,d:'M 23.1 146.5 L 21.9 146.5 L 22.2 145.5 L 22.1 145.1 L 22.0 144.8 L 21.3 144.5 L 21.2 144.2 L 21.4 143.6 L 21.0 142.6 L 20.4 142.2 L 17.4 141.6 L 13.5 141.5 L 13.6 141.2 L 15.0 140.0 L 15.4 139.3 L 15.6 138.7 L 15.5 138.0 L 15.1 137.5 L 14.7 137.3 L 13.8 135.7 L 13.4 135.5 L 12.9 135.4 L 12.3 134.8 L 11.8 133.5 L 10.7 132.7 L 10.2 130.8 L 9.7 129.9 L 8.7 129.3 L 8.7 128.7 L 9.1 128.7 L 9.3 128.5 L 9.4 128.1 L 9.3 127.9 L 8.1 127.4 L 8.0 127.0 L 6.8 126.0 L 6.8 125.8 L 7.2 125.8 L 7.4 125.1 L 7.4 124.4 L 9.0 124.2 L 9.3 124.0 L 9.2 123.3 L 8.5 122.4 L 8.5 122.4 L 18.1 126.4 L 30.7 129.4 L 37.2 131.1 L 51.3 138.7 L 66.5 145.1 L 66.5 145.1 L 68.1 145.8 L 68.1 145.8 L 67.9 146.1 L 67.1 146.4 L 66.0 147.3 L 64.5 148.8 L 63.6 149.2 L 63.2 149.1 L 62.4 149.2 L 62.4 149.5 L 61.4 150.2 L 60.3 150.7 L 59.5 151.7 L 59.3 152.3 L 58.9 152.5 L 58.3 152.1 L 57.9 152.0 L 56.6 152.0 L 56.3 152.2 L 55.9 152.4 L 55.7 152.9 L 54.4 154.7 L 52.4 155.4 L 52.0 155.8 L 50.9 156.0 L 50.4 156.1 L 50.4 154.9 L 49.7 155.0 L 47.8 154.6 L 45.0 154.4 L 42.3 154.6 L 42.0 154.3 L 40.8 154.2 L 38.9 155.2 L 37.4 155.5 L 36.5 155.1 L 35.8 154.4 L 34.9 155.0 L 34.9 145.6 L 34.9 145.0 L 35.2 144.7 L 35.2 143.4 L 35.1 142.9 L 35.6 142.3 L 35.9 141.7 L 35.2 141.8 L 33.6 143.2 L 32.8 143.7 L 31.7 145.0 L 30.7 145.3 L 30.3 145.9 L 29.3 146.5 z'},
  {sigla:'AL',cx:316.5,cy:141.5,d:'M 306.5 142.5 L 306.4 142.2 L 305.6 141.7 L 305.4 141.8 L 304.8 141.6 L 304.5 140.9 L 304.5 140.9 L 305.3 140.3 L 305.6 139.7 L 306.8 139.3 L 308.0 137.6 L 308.1 137.2 L 308.5 136.9 L 309.0 137.5 L 309.9 137.7 L 310.5 137.6 L 311.9 138.7 L 312.9 139.8 L 313.8 140.4 L 314.8 140.7 L 316.2 140.3 L 317.9 140.5 L 318.5 140.4 L 319.5 139.8 L 320.1 139.9 L 321.1 139.3 L 322.2 138.1 L 322.3 137.8 L 323.1 137.2 L 324.2 137.0 L 325.4 137.5 L 326.7 136.8 L 327.5 136.7 L 328.5 137.1 L 330.1 137.3 L 330.2 137.4 L 330.2 137.4 L 328.8 140.0 L 326.3 142.8 L 324.4 144.7 L 322.8 147.1 L 321.0 148.7 L 320.5 149.7 L 319.8 150.7 L 319.8 150.7 L 319.5 150.0 L 317.5 148.8 L 317.3 148.8 L 316.4 148.4 L 315.5 147.6 L 314.8 146.3 L 311.9 144.6 L 309.9 144.1 z'},
  {sigla:'AM',cx:84.6,cy:87.5,d:'M 95.2 44.9 L 95.6 45.4 L 96.0 45.5 L 96.3 45.5 L 96.9 45.3 L 97.3 45.4 L 97.3 45.9 L 98.0 46.5 L 98.5 46.7 L 98.9 46.6 L 99.7 46.7 L 100.7 47.2 L 101.0 47.5 L 100.5 49.3 L 100.1 50.1 L 101.6 52.1 L 102.5 54.6 L 102.6 55.8 L 103.0 56.4 L 103.0 56.7 L 102.2 57.4 L 102.4 58.3 L 102.7 59.1 L 102.3 60.8 L 102.0 61.3 L 102.2 63.9 L 102.6 65.1 L 103.3 65.5 L 103.6 66.0 L 104.2 68.3 L 104.2 68.6 L 103.6 69.3 L 102.6 69.2 L 102.5 69.8 L 105.2 72.1 L 105.5 72.1 L 106.5 72.8 L 107.3 73.7 L 107.8 74.8 L 108.1 74.8 L 108.8 74.6 L 110.1 75.2 L 109.9 74.0 L 110.3 72.8 L 110.4 71.9 L 110.2 70.9 L 110.6 69.4 L 111.2 68.7 L 111.9 68.3 L 113.0 67.9 L 113.3 67.5 L 114.1 67.4 L 115.6 67.9 L 116.6 69.0 L 117.1 70.4 L 118.1 70.5 L 118.8 70.2 L 119.5 69.5 L 120.6 69.2 L 120.8 69.0 L 120.8 68.7 L 120.2 67.9 L 120.1 67.6 L 120.2 67.2 L 120.8 65.8 L 120.8 65.2 L 121.7 63.6 L 122.9 61.8 L 122.9 61.5 L 132.8 61.5 L 132.8 61.5 L 133.0 64.1 L 132.8 64.9 L 132.9 66.1 L 133.0 66.5 L 133.9 66.9 L 134.0 67.1 L 133.8 67.5 L 133.8 68.6 L 134.8 69.7 L 134.9 69.8 L 135.3 69.7 L 136.3 70.3 L 136.6 71.3 L 136.6 71.8 L 136.8 72.1 L 139.2 74.1 L 141.7 75.4 L 142.0 75.9 L 142.7 76.5 L 143.7 76.8 L 145.0 77.5 L 146.2 77.9 L 146.9 78.0 L 147.6 78.4 L 147.7 78.7 L 148.4 79.4 L 149.8 80.2 L 150.4 81.4 L 151.4 81.8 L 151.8 81.5 L 152.6 81.3 L 152.7 81.5 L 152.6 81.9 L 153.6 82.8 L 137.6 117.1 L 137.2 117.8 L 136.4 118.4 L 136.1 118.9 L 136.1 119.5 L 136.6 120.8 L 136.8 121.1 L 137.3 121.4 L 138.2 122.2 L 138.5 122.9 L 138.6 123.9 L 138.9 124.2 L 138.9 124.2 L 138.3 124.9 L 138.2 125.2 L 138.1 125.6 L 138.3 126.0 L 138.2 126.6 L 137.5 127.6 L 137.1 127.9 L 136.8 128.4 L 136.9 128.8 L 137.2 129.5 L 137.5 130.6 L 136.8 132.8 L 136.1 135.6 L 135.5 136.0 L 110.0 136.2 L 110.0 136.2 L 110.0 135.8 L 109.8 135.6 L 109.1 135.4 L 108.0 136.0 L 107.7 136.9 L 107.4 137.0 L 105.6 136.3 L 105.3 134.7 L 105.0 134.6 L 104.4 134.7 L 104.2 134.6 L 103.5 132.8 L 102.2 132.3 L 101.5 131.6 L 101.0 130.6 L 100.8 130.3 L 99.6 129.7 L 93.9 129.8 L 93.2 131.1 L 92.2 131.4 L 92.3 132.0 L 92.1 132.1 L 90.8 132.4 L 90.2 133.3 L 90.2 133.6 L 90.6 134.0 L 90.7 134.3 L 90.5 134.8 L 90.1 135.4 L 89.0 136.1 L 88.9 137.0 L 89.1 137.8 L 87.0 137.6 L 85.9 137.8 L 85.2 138.3 L 84.3 138.3 L 83.8 138.0 L 83.6 138.0 L 82.7 138.6 L 82.4 139.1 L 82.5 140.0 L 81.2 141.7 L 80.8 141.7 L 80.4 141.5 L 80.1 140.3 L 79.9 140.2 L 78.9 140.8 L 78.2 141.4 L 77.5 141.6 L 77.1 141.5 L 76.5 141.8 L 76.3 142.1 L 76.2 142.5 L 75.6 142.9 L 75.4 142.9 L 74.1 141.7 L 73.7 141.5 L 72.2 141.6 L 70.1 141.5 L 70.2 142.2 L 70.1 142.5 L 69.3 143.5 L 68.3 143.8 L 66.5 145.1 L 66.5 145.1 L 51.3 138.7 L 37.2 131.1 L 30.7 129.4 L 18.1 126.4 L 8.5 122.4 L 8.5 122.4 L 8.5 122.1 L 8.9 120.5 L 9.5 119.8 L 12.2 117.9 L 13.4 117.8 L 13.6 117.6 L 14.1 116.8 L 14.2 116.3 L 13.2 113.9 L 13.5 113.2 L 14.1 112.1 L 14.8 111.3 L 15.3 110.7 L 15.5 110.2 L 15.6 109.2 L 15.5 108.5 L 15.8 107.4 L 16.0 106.2 L 16.4 105.8 L 18.3 104.9 L 19.5 104.3 L 20.1 103.7 L 20.4 103.0 L 20.8 102.8 L 21.5 102.7 L 22.4 102.2 L 24.3 100.8 L 25.6 100.5 L 26.4 100.7 L 28.6 100.0 L 29.4 99.6 L 30.4 99.4 L 32.2 99.6 L 32.9 98.8 L 33.2 98.0 L 33.8 97.7 L 34.9 97.8 L 35.3 98.1 L 36.0 98.0 L 36.6 97.6 L 37.5 97.6 L 37.6 97.9 L 37.6 98.5 L 38.5 99.2 L 40.0 99.3 L 40.3 99.1 L 40.5 98.7 L 40.5 98.4 L 41.1 95.8 L 44.7 76.0 L 45.3 74.4 L 44.8 71.8 L 44.8 71.7 L 44.1 71.1 L 43.4 69.6 L 43.3 69.4 L 43.7 68.6 L 43.4 67.7 L 43.2 67.5 L 42.3 67.1 L 40.7 65.9 L 39.7 64.7 L 39.8 58.5 L 41.8 58.4 L 42.8 57.8 L 44.6 57.3 L 46.1 58.2 L 46.7 58.3 L 47.4 58.1 L 47.1 57.2 L 47.3 56.2 L 46.6 55.1 L 46.3 54.8 L 45.6 54.5 L 44.8 54.8 L 43.3 54.5 L 41.4 54.5 L 41.4 49.2 L 41.9 49.3 L 42.6 48.9 L 43.8 48.6 L 45.4 49.1 L 55.5 49.1 L 55.3 48.8 L 54.8 48.7 L 54.6 48.1 L 55.1 47.0 L 55.9 47.2 L 56.2 48.0 L 56.7 48.8 L 57.1 48.9 L 57.5 48.9 L 58.4 48.6 L 59.4 47.5 L 59.6 47.1 L 60.2 46.4 L 61.6 45.7 L 62.3 45.9 L 62.9 47.3 L 63.8 48.3 L 64.2 49.0 L 64.5 50.0 L 64.6 50.8 L 64.4 52.7 L 64.5 53.7 L 66.2 53.3 L 70.6 57.0 L 71.0 57.2 L 72.4 57.3 L 73.6 56.8 L 74.5 55.9 L 75.6 55.2 L 76.8 55.2 L 77.1 55.3 L 77.5 55.9 L 77.5 56.4 L 76.9 57.3 L 77.1 57.9 L 77.4 58.0 L 78.1 57.6 L 78.4 57.1 L 78.5 56.5 L 79.1 55.8 L 79.3 55.7 L 79.9 55.8 L 80.2 55.7 L 80.4 55.4 L 80.6 54.1 L 80.9 53.9 L 81.7 53.7 L 83.3 52.8 L 83.8 53.1 L 84.3 52.9 L 85.1 52.4 L 85.7 51.5 L 86.8 50.9 L 87.9 51.2 L 89.1 50.3 L 89.4 49.9 L 89.7 48.4 L 89.6 47.7 L 90.1 47.3 L 90.6 47.0 L 91.5 47.0 L 92.3 46.8 L 93.3 46.0 L 93.9 45.8 L 95.1 45.6 z'},
  {sigla:'AP',cx:189.7,cy:50.6,d:'M 190.8 72.9 L 190.3 72.9 L 189.9 73.0 L 189.2 73.1 L 187.7 72.7 L 186.9 72.2 L 186.7 71.4 L 185.7 70.6 L 185.6 70.0 L 185.7 69.6 L 185.6 68.7 L 185.4 68.5 L 184.9 68.4 L 184.7 67.9 L 184.7 66.6 L 183.2 64.8 L 182.7 65.0 L 182.3 64.9 L 181.5 63.1 L 181.6 62.2 L 181.3 61.3 L 180.9 61.0 L 180.6 60.2 L 180.5 59.0 L 180.7 57.4 L 180.6 57.2 L 179.2 56.8 L 178.2 55.6 L 177.8 54.1 L 177.9 53.7 L 178.2 53.6 L 178.0 52.9 L 177.6 53.0 L 176.1 51.5 L 175.6 51.6 L 175.4 51.8 L 174.7 51.9 L 174.2 51.8 L 173.8 51.3 L 173.2 50.8 L 172.6 50.7 L 172.3 50.1 L 171.9 49.6 L 170.9 49.1 L 170.2 48.8 L 168.4 48.6 L 167.8 48.8 L 167.2 48.8 L 167.0 48.5 L 166.9 47.7 L 167.1 45.3 L 167.4 44.6 L 167.2 43.4 L 166.9 43.1 L 166.9 43.1 L 167.0 42.9 L 167.6 43.1 L 167.6 43.5 L 167.4 43.6 L 167.6 44.1 L 168.4 44.1 L 168.8 44.2 L 169.0 44.7 L 169.4 45.1 L 170.6 45.5 L 172.4 45.9 L 173.9 45.0 L 174.1 44.6 L 175.0 43.9 L 175.4 43.8 L 175.8 44.3 L 177.2 44.8 L 177.8 44.7 L 178.7 44.2 L 178.8 44.0 L 179.0 44.0 L 179.7 44.7 L 179.6 45.1 L 180.9 45.0 L 181.2 45.3 L 181.7 45.4 L 182.0 45.4 L 182.5 45.1 L 183.4 44.3 L 184.3 43.7 L 185.3 42.5 L 185.5 42.0 L 185.4 41.7 L 187.0 38.2 L 187.1 37.3 L 187.7 36.6 L 188.1 36.5 L 190.0 33.4 L 190.1 32.8 L 190.6 32.1 L 191.5 31.3 L 191.9 30.4 L 193.0 29.8 L 193.2 29.3 L 193.8 29.0 L 194.1 29.8 L 194.5 30.5 L 193.7 28.0 L 193.6 27.3 L 193.7 27.1 L 195.5 28.4 L 196.1 29.0 L 196.6 29.7 L 196.9 30.3 L 196.9 31.2 L 197.1 31.3 L 197.3 31.1 L 197.5 31.0 L 197.6 31.2 L 197.7 35.4 L 198.1 37.5 L 199.5 40.7 L 200.9 45.5 L 202.7 48.2 L 203.3 48.3 L 205.0 48.3 L 206.5 48.8 L 207.2 49.3 L 207.6 50.7 L 207.5 52.4 L 206.8 53.0 L 205.9 53.2 L 205.7 53.4 L 206.6 53.3 L 207.2 53.1 L 207.3 53.2 L 207.4 53.5 L 207.3 53.9 L 204.6 56.0 L 204.0 57.2 L 202.9 57.9 L 201.8 59.9 L 200.3 61.8 L 199.9 62.0 L 199.4 62.0 L 198.6 62.2 L 197.5 63.8 L 197.5 63.8 L 196.8 63.9 L 196.4 64.4 L 196.4 64.4 L 195.6 65.2 L 195.1 66.4 L 194.5 67.4 L 194.1 67.8 L 192.5 69.6 L 192.3 70.9 L 192.4 71.9 L 191.3 72.8 L 190.8 72.9 z M 203.2 47.8 L 203.0 47.6 L 202.4 46.7 L 202.5 46.2 L 202.6 46.0 L 203.5 45.7 L 203.7 45.9 L 204.1 47.1 L 203.6 47.7 L 203.2 47.8 z M 204.6 57.2 L 204.4 57.1 L 204.3 56.7 L 204.9 56.1 L 205.4 56.0 L 206.0 56.2 L 206.3 56.1 L 206.5 55.8 L 206.6 56.1 L 206.0 56.8 L 205.5 57.1 L 204.6 57.2 z M 206.4 55.7 L 206.0 55.6 L 206.0 55.3 L 206.4 54.7 L 207.0 54.7 L 207.1 54.8 L 207.1 55.1 L 206.4 55.7 z M 202.6 45.9 L 202.2 45.6 L 202.3 45.2 L 202.8 45.1 L 203.2 45.2 L 203.2 45.6 L 202.6 45.9 z'},
  {sigla:'BA',cx:277.8,cy:167.8,d:'M 288.1 214.6 L 287.9 214.1 L 288.3 213.4 L 288.3 213.1 L 288.0 212.6 L 285.8 210.9 L 285.7 210.7 L 285.9 209.9 L 285.5 209.2 L 285.2 209.3 L 285.1 209.6 L 284.9 209.7 L 284.8 209.5 L 285.1 207.2 L 285.5 205.4 L 286.0 205.0 L 287.3 205.1 L 287.8 204.7 L 287.8 204.5 L 287.5 203.9 L 287.6 202.5 L 290.2 200.3 L 291.0 198.6 L 290.8 198.0 L 290.4 197.5 L 289.9 197.4 L 289.5 197.2 L 288.0 195.9 L 286.9 195.9 L 285.7 195.6 L 284.5 195.0 L 283.1 194.7 L 282.0 194.7 L 281.3 195.2 L 280.5 195.5 L 279.1 195.2 L 278.8 195.3 L 278.6 193.2 L 275.1 189.9 L 274.9 189.8 L 272.6 190.5 L 271.7 189.8 L 271.5 189.9 L 271.0 189.8 L 269.6 189.1 L 268.5 188.3 L 267.9 188.4 L 265.6 186.4 L 265.0 186.2 L 263.6 185.8 L 262.6 185.9 L 261.6 186.4 L 261.2 187.0 L 260.9 187.1 L 258.0 186.3 L 257.7 186.0 L 257.5 185.2 L 257.6 184.7 L 258.3 183.3 L 257.9 183.0 L 256.6 182.8 L 255.5 182.7 L 254.8 182.5 L 253.9 182.4 L 251.8 183.3 L 249.6 184.9 L 249.2 185.5 L 247.4 186.5 L 246.3 186.7 L 245.8 187.3 L 244.9 188.1 L 244.1 188.4 L 243.6 188.3 L 242.6 189.7 L 242.0 190.1 L 240.9 189.9 L 240.5 190.0 L 240.1 190.5 L 239.4 191.0 L 239.2 190.9 L 240.0 189.1 L 239.7 187.8 L 239.7 187.8 L 240.5 186.7 L 240.6 186.3 L 240.5 185.6 L 240.2 184.7 L 240.2 184.4 L 240.6 183.6 L 240.6 183.4 L 238.8 182.0 L 237.9 180.1 L 237.6 178.2 L 237.6 177.4 L 238.3 175.4 L 239.1 174.8 L 239.3 174.6 L 239.3 174.1 L 238.4 173.7 L 238.4 173.5 L 238.6 172.1 L 239.4 171.6 L 239.4 171.4 L 237.9 170.1 L 237.9 170.1 L 237.9 169.6 L 238.6 168.3 L 238.6 167.7 L 238.5 167.5 L 237.7 167.3 L 237.2 166.9 L 237.0 166.2 L 237.1 164.7 L 237.2 164.2 L 238.2 163.3 L 238.8 163.1 L 239.3 162.7 L 239.2 162.4 L 238.9 162.1 L 238.4 162.0 L 237.8 162.1 L 237.6 161.9 L 237.6 161.6 L 237.8 161.1 L 238.9 160.7 L 239.2 160.4 L 239.2 160.0 L 238.2 159.5 L 236.3 159.1 L 235.3 158.1 L 235.2 157.6 L 235.4 157.0 L 236.0 156.6 L 236.8 154.7 L 237.3 154.4 L 237.8 154.3 L 238.0 154.1 L 237.3 153.1 L 237.4 152.9 L 239.1 151.5 L 241.1 150.4 L 241.4 150.2 L 241.6 149.7 L 241.9 149.3 L 241.9 149.3 L 243.2 149.3 L 243.9 150.0 L 244.3 150.6 L 244.6 151.7 L 245.5 153.1 L 247.7 154.1 L 248.7 153.8 L 249.8 153.9 L 250.0 153.8 L 250.4 153.0 L 251.0 152.8 L 251.4 152.3 L 252.0 151.9 L 253.2 151.5 L 253.9 151.6 L 254.7 151.8 L 255.4 151.6 L 257.0 150.3 L 258.5 147.6 L 258.9 147.2 L 259.1 146.7 L 259.2 145.3 L 259.2 144.7 L 258.0 142.3 L 258.0 141.8 L 259.7 141.0 L 260.8 140.9 L 261.6 141.2 L 261.8 141.7 L 261.9 141.8 L 263.1 141.6 L 263.8 141.3 L 264.5 141.5 L 265.4 142.0 L 265.4 142.3 L 265.5 142.5 L 265.9 142.7 L 267.5 142.6 L 268.3 142.3 L 269.2 142.2 L 269.6 141.5 L 270.4 140.8 L 271.9 140.7 L 272.3 140.5 L 272.7 139.9 L 273.9 139.9 L 274.2 140.3 L 274.4 140.3 L 275.4 139.3 L 275.3 138.1 L 276.4 137.9 L 276.8 138.0 L 277.4 137.6 L 278.2 136.4 L 278.4 135.8 L 278.4 135.8 L 278.9 136.0 L 279.5 135.8 L 280.7 136.0 L 282.2 136.7 L 282.4 137.0 L 282.4 138.4 L 282.8 139.5 L 284.0 140.0 L 284.1 141.0 L 283.6 141.9 L 284.6 142.3 L 285.1 142.1 L 285.5 141.7 L 287.1 141.2 L 287.5 139.3 L 287.7 138.8 L 288.1 138.7 L 288.6 139.0 L 288.9 139.0 L 290.2 138.5 L 290.8 137.8 L 290.8 137.5 L 290.7 136.8 L 290.9 136.7 L 292.1 136.4 L 292.5 135.3 L 293.3 135.1 L 294.7 134.3 L 295.0 134.3 L 295.8 134.6 L 296.3 135.3 L 297.0 135.8 L 298.2 136.2 L 299.8 136.4 L 300.7 137.0 L 301.0 137.9 L 301.2 138.0 L 301.4 137.9 L 301.6 137.0 L 301.8 136.8 L 302.3 136.8 L 302.6 136.9 L 302.6 137.3 L 302.2 137.7 L 302.5 138.2 L 302.7 138.4 L 303.9 138.8 L 303.9 139.3 L 304.5 141.0 L 304.5 141.0 L 304.8 141.7 L 305.4 141.9 L 305.6 141.8 L 306.4 142.2 L 306.5 142.6 L 306.5 142.6 L 306.1 143.2 L 306.2 144.4 L 306.9 145.7 L 308.0 146.8 L 308.4 147.4 L 308.3 149.0 L 308.0 149.9 L 307.9 150.4 L 308.3 151.8 L 308.2 152.1 L 307.8 152.4 L 306.4 153.0 L 305.8 152.6 L 304.9 152.6 L 304.8 152.7 L 304.4 153.6 L 304.4 154.0 L 305.0 154.8 L 305.5 155.2 L 305.8 156.0 L 306.6 156.8 L 306.7 157.0 L 306.6 157.8 L 306.4 158.0 L 306.5 158.2 L 306.8 158.5 L 307.8 159.0 L 308.1 159.3 L 308.4 159.5 L 309.2 159.9 L 310.7 159.4 L 310.7 159.4 L 311.1 159.4 L 311.3 159.6 L 309.1 164.3 L 307.0 167.1 L 306.5 168.3 L 303.8 171.4 L 302.5 172.0 L 302.0 172.0 L 302.2 171.3 L 302.4 171.2 L 302.5 170.6 L 302.2 169.6 L 301.2 169.5 L 301.0 168.8 L 300.6 168.4 L 300.4 168.7 L 300.2 169.9 L 299.9 170.4 L 299.6 170.6 L 299.3 170.4 L 299.1 169.5 L 299.1 169.3 L 299.3 169.3 L 299.3 169.1 L 298.8 169.7 L 299.3 170.6 L 299.6 170.8 L 299.8 170.7 L 300.4 170.8 L 300.1 171.8 L 299.5 172.4 L 299.4 173.4 L 298.7 173.9 L 298.5 174.3 L 298.4 174.7 L 298.5 175.2 L 297.8 174.9 L 297.7 175.2 L 297.5 176.5 L 297.7 176.1 L 298.1 176.2 L 298.2 176.5 L 298.1 176.7 L 298.1 177.1 L 298.3 177.2 L 298.4 177.8 L 297.9 179.1 L 298.2 180.9 L 297.9 181.2 L 297.6 181.1 L 297.5 181.7 L 297.8 181.9 L 298.5 181.0 L 298.2 179.8 L 298.7 179.5 L 298.8 179.8 L 298.8 180.7 L 298.2 182.1 L 297.9 185.0 L 297.6 186.0 L 297.7 187.3 L 298.1 188.8 L 298.2 191.2 L 298.7 194.7 L 299.2 196.5 L 298.0 200.0 L 297.3 203.6 L 297.0 204.1 L 297.0 205.6 L 296.4 207.6 L 296.3 208.9 L 296.6 211.2 L 297.0 212.1 L 295.8 213.7 L 294.9 214.1 L 294.4 214.4 L 292.9 216.5 L 292.6 217.6 L 292.6 217.6 L 288.3 214.8 L 288.1 214.6 z M 300.0 173.0 L 299.9 172.3 L 300.3 172.1 L 300.9 171.6 L 300.9 171.2 L 300.7 170.8 L 301.1 170.9 L 301.6 171.5 L 301.6 171.7 L 300.0 173.0 z M 298.7 176.6 L 298.3 176.6 L 298.3 176.2 L 298.5 176.1 L 298.0 175.9 L 297.8 175.7 L 297.9 175.2 L 298.9 175.1 L 299.0 175.2 L 299.0 175.8 L 298.7 176.6 z'},
  {sigla:'CE',cx:294.1,cy:109.9,d:'M 312.8 103.4 L 310.2 104.2 L 308.8 105.3 L 307.1 108.9 L 306.6 109.5 L 306.1 109.8 L 305.8 110.7 L 305.9 111.1 L 305.1 112.4 L 304.4 113.2 L 304.1 113.7 L 303.5 113.9 L 303.1 113.6 L 302.8 113.6 L 302.4 114.1 L 301.6 115.3 L 301.4 116.4 L 301.8 116.5 L 302.1 116.3 L 302.1 116.3 L 302.1 116.5 L 301.6 117.2 L 301.1 118.8 L 301.4 119.5 L 301.0 120.2 L 300.4 120.5 L 300.3 120.7 L 300.3 121.2 L 300.4 121.4 L 300.7 121.6 L 300.9 121.9 L 300.9 122.8 L 301.6 123.3 L 301.9 123.3 L 302.1 124.0 L 301.2 125.8 L 300.6 126.4 L 300.7 126.6 L 300.7 126.6 L 299.9 126.8 L 299.3 127.3 L 298.5 128.5 L 297.6 128.5 L 297.2 127.7 L 296.8 127.3 L 296.1 127.1 L 295.6 126.5 L 295.3 126.0 L 294.3 125.6 L 292.8 124.5 L 291.2 124.3 L 290.5 124.4 L 289.3 124.8 L 288.5 124.9 L 288.0 124.8 L 285.4 124.7 L 285.4 124.7 L 285.4 124.0 L 285.0 123.6 L 285.0 123.1 L 285.6 121.4 L 286.4 120.2 L 286.4 119.9 L 286.0 119.2 L 284.6 119.0 L 283.9 118.6 L 283.4 117.2 L 282.8 114.4 L 282.4 113.1 L 282.6 112.8 L 282.1 108.5 L 282.0 108.3 L 281.5 107.9 L 281.9 107.6 L 282.3 106.8 L 281.9 105.2 L 281.4 104.1 L 281.7 103.2 L 281.2 101.2 L 281.6 100.4 L 281.6 100.0 L 280.9 99.2 L 280.7 98.3 L 279.0 94.8 L 278.0 92.3 L 277.9 91.6 L 278.0 90.9 L 278.8 89.8 L 279.4 88.8 L 279.5 88.4 L 279.5 88.4 L 279.6 88.3 L 279.5 88.0 L 279.3 87.6 L 279.7 87.2 L 283.3 87.1 L 284.8 86.9 L 285.9 86.5 L 289.9 86.9 L 291.0 87.5 L 292.0 88.3 L 294.2 89.5 L 295.0 89.8 L 297.6 91.4 L 298.2 91.5 L 299.4 92.7 L 301.0 93.8 L 302.4 94.2 L 303.7 95.8 L 304.3 96.1 L 305.9 98.1 L 308.1 99.8 L 308.9 100.8 L 309.5 101.3 L 310.3 101.8 L 310.9 101.8 L 312.1 102.3 L 312.6 102.7 z'},
  {sigla:'DF',cx:225.7,cy:195.5,d:'M 229.0 197.8 L 221.2 197.8 L 220.9 196.0 L 221.4 195.1 L 221.6 193.1 L 228.0 193.1 L 229.0 194.1 L 229.0 195.3 L 228.7 195.9 L 228.6 197.2 z'},
  {sigla:'ES',cx:283.0,cy:227.0,d:'M 274.3 239.1 L 274.2 239.0 L 274.4 237.8 L 274.7 237.1 L 274.4 235.4 L 274.5 235.2 L 275.4 234.1 L 278.2 234.1 L 278.4 234.0 L 279.0 232.2 L 279.6 231.6 L 280.0 230.3 L 280.2 229.4 L 280.3 229.2 L 281.0 228.7 L 281.9 227.6 L 282.2 226.0 L 282.0 224.7 L 281.3 223.2 L 280.7 222.6 L 280.5 222.5 L 280.2 222.7 L 279.8 222.5 L 279.6 222.1 L 279.8 221.8 L 280.6 221.8 L 281.0 222.0 L 281.5 222.0 L 282.0 221.9 L 282.2 221.6 L 282.1 220.7 L 281.4 220.5 L 281.3 220.3 L 281.5 219.5 L 281.5 218.5 L 281.2 218.1 L 280.5 217.8 L 280.3 217.4 L 280.9 216.4 L 282.1 215.7 L 282.3 215.7 L 282.8 216.0 L 283.4 216.1 L 283.4 215.7 L 282.5 214.5 L 283.3 214.5 L 284.4 214.4 L 284.9 214.1 L 285.5 213.9 L 286.3 213.8 L 287.6 214.3 L 288.1 214.6 L 288.1 214.6 L 288.1 214.6 L 288.1 214.6 L 288.3 214.8 L 292.6 217.6 L 292.6 217.6 L 292.1 219.4 L 292.0 220.9 L 292.0 222.8 L 292.4 226.1 L 292.2 227.4 L 291.4 229.1 L 290.0 229.9 L 289.7 230.2 L 288.8 231.9 L 288.3 234.0 L 287.9 234.8 L 287.4 234.4 L 286.9 234.3 L 286.8 235.0 L 287.5 235.3 L 286.5 237.5 L 284.6 239.6 L 284.5 239.5 L 283.5 239.8 L 283.1 240.5 L 283.1 241.2 L 282.8 241.9 L 282.0 242.9 L 281.8 243.5 L 281.8 243.5 L 281.0 243.0 L 279.4 243.2 L 277.1 242.6 L 275.7 242.0 L 275.4 239.5 z'},
  {sigla:'GO',cx:212.9,cy:196.4,d:'M 229.0 197.8 L 228.6 197.3 L 228.7 196.0 L 229.0 195.3 L 229.0 194.1 L 228.0 193.1 L 221.6 193.1 L 221.4 195.1 L 220.9 196.0 L 221.2 197.8 L 229.0 197.8 L 229.0 197.8 L 229.0 197.8 L 229.0 197.8 L 228.8 198.6 L 228.9 199.4 L 228.6 200.3 L 228.0 201.0 L 227.8 201.7 L 228.2 202.4 L 228.7 202.6 L 229.5 203.1 L 230.3 205.5 L 230.3 205.9 L 229.1 207.3 L 227.4 208.9 L 227.1 210.1 L 227.7 210.7 L 228.2 210.4 L 229.0 210.7 L 229.3 211.0 L 229.4 211.6 L 229.3 211.9 L 228.9 212.4 L 228.6 213.4 L 229.3 215.3 L 227.6 216.4 L 227.0 216.5 L 226.5 217.0 L 226.3 217.6 L 223.7 219.0 L 223.3 218.6 L 221.0 217.6 L 220.7 217.9 L 220.4 217.9 L 219.5 217.9 L 218.7 217.8 L 216.6 217.9 L 215.5 217.4 L 213.3 218.8 L 211.8 220.4 L 211.6 220.4 L 210.9 219.6 L 210.1 219.4 L 208.4 220.3 L 206.4 220.0 L 205.1 220.5 L 203.9 220.8 L 203.2 221.9 L 202.5 223.2 L 202.5 223.7 L 202.1 224.4 L 201.7 224.6 L 201.2 224.5 L 201.0 224.6 L 200.5 225.0 L 199.6 226.1 L 199.3 227.1 L 199.6 227.4 L 199.6 227.6 L 199.4 227.7 L 198.9 227.5 L 198.9 227.5 L 198.8 227.2 L 197.4 226.1 L 195.7 225.7 L 194.8 224.9 L 193.8 224.7 L 193.0 224.7 L 191.2 223.9 L 190.9 223.5 L 189.2 222.7 L 188.9 222.3 L 188.1 221.9 L 187.5 221.9 L 186.1 221.0 L 184.6 221.0 L 182.6 220.7 L 182.5 220.5 L 182.6 220.0 L 182.9 219.4 L 183.6 218.5 L 183.6 218.3 L 182.4 217.8 L 181.8 218.1 L 181.4 218.0 L 181.3 217.8 L 181.2 217.2 L 181.3 215.9 L 181.2 214.9 L 181.2 214.9 L 180.7 213.7 L 180.6 211.9 L 179.8 210.7 L 179.8 210.4 L 180.0 208.5 L 181.3 206.5 L 181.5 204.9 L 181.9 204.5 L 183.0 204.1 L 184.0 203.1 L 184.7 202.1 L 184.8 201.0 L 185.1 200.5 L 185.8 199.9 L 186.2 199.2 L 186.3 198.3 L 187.2 197.8 L 188.0 196.4 L 189.4 196.4 L 190.8 195.9 L 191.0 195.7 L 192.0 193.5 L 192.4 193.0 L 192.8 190.8 L 193.0 190.4 L 194.0 189.4 L 194.9 188.8 L 195.4 188.7 L 196.1 189.1 L 196.7 188.7 L 197.5 187.9 L 197.9 186.4 L 198.6 184.8 L 198.6 184.4 L 198.3 183.8 L 198.6 182.3 L 199.5 180.7 L 199.4 177.9 L 200.0 177.5 L 200.6 176.1 L 201.7 174.4 L 201.9 173.8 L 201.8 172.4 L 202.0 171.9 L 202.5 171.4 L 202.6 170.8 L 202.6 170.5 L 202.6 170.5 L 202.8 170.3 L 202.9 169.3 L 203.2 168.6 L 204.2 167.5 L 204.5 167.3 L 204.5 168.2 L 203.8 169.2 L 203.5 170.5 L 204.8 170.7 L 206.0 171.3 L 208.1 171.5 L 209.7 172.4 L 211.9 173.1 L 212.3 173.0 L 213.1 169.9 L 213.9 168.6 L 214.5 168.1 L 215.1 168.8 L 215.7 169.8 L 216.3 171.7 L 216.6 173.4 L 217.2 173.4 L 217.6 173.0 L 217.8 172.5 L 218.1 172.2 L 219.6 172.4 L 222.0 172.1 L 222.1 172.5 L 221.8 173.3 L 223.5 174.1 L 225.2 174.5 L 225.6 174.4 L 225.9 172.7 L 226.2 172.7 L 227.0 174.1 L 227.2 174.2 L 228.2 173.7 L 229.5 172.6 L 231.9 172.1 L 232.8 172.1 L 234.1 171.5 L 235.1 170.8 L 237.9 170.0 L 237.9 170.0 L 239.4 171.3 L 239.4 171.5 L 238.6 172.1 L 238.4 173.5 L 238.4 173.6 L 239.3 174.1 L 239.3 174.6 L 239.1 174.8 L 238.3 175.3 L 237.6 177.4 L 237.6 178.2 L 238.0 180.1 L 238.9 181.9 L 240.6 183.3 L 240.6 183.6 L 240.2 184.3 L 240.2 184.7 L 240.5 185.6 L 240.6 186.3 L 240.5 186.7 L 239.7 187.7 L 239.7 187.7 L 239.2 188.3 L 237.5 188.1 L 237.0 187.2 L 235.7 186.4 L 235.1 187.2 L 235.4 189.2 L 235.1 189.5 L 234.9 189.5 L 233.4 188.9 L 232.8 189.1 L 232.6 189.2 L 232.2 190.9 L 232.6 191.0 L 232.8 191.6 L 232.5 192.1 L 232.1 192.4 L 232.1 193.5 L 232.4 193.8 L 232.7 193.9 L 233.0 196.2 L 232.7 196.4 L 230.9 196.9 L 229.7 197.7 z'},
  {sigla:'MA',cx:246.7,cy:99.6,d:'M 251.4 88.5 L 251.3 88.7 L 250.3 89.8 L 250.0 89.9 L 250.0 90.7 L 251.1 89.7 L 251.4 89.1 L 252.6 88.3 L 253.0 87.7 L 253.6 84.3 L 254.2 83.9 L 254.8 83.8 L 255.7 83.3 L 256.0 83.3 L 256.3 83.3 L 256.3 84.2 L 256.2 84.5 L 255.4 85.5 L 253.7 86.4 L 253.7 86.8 L 254.1 86.8 L 254.3 86.4 L 255.0 86.2 L 255.1 86.7 L 254.8 86.9 L 254.9 87.1 L 257.1 84.5 L 257.6 84.6 L 259.0 84.1 L 261.1 84.4 L 260.9 83.1 L 261.2 83.0 L 262.5 83.0 L 263.5 83.2 L 264.9 83.8 L 265.4 83.8 L 266.6 84.6 L 267.3 84.6 L 268.0 85.3 L 269.0 86.0 L 270.3 86.3 L 270.9 86.2 L 271.2 86.6 L 271.4 86.6 L 272.3 86.6 L 273.6 86.9 L 273.7 86.4 L 273.4 86.2 L 274.2 86.0 L 274.5 86.0 L 274.5 86.3 L 274.5 86.3 L 274.3 87.0 L 274.4 87.4 L 274.7 87.7 L 274.5 88.5 L 273.6 89.7 L 271.4 91.8 L 269.6 92.1 L 269.2 92.0 L 267.6 93.8 L 267.6 94.8 L 267.2 95.8 L 266.1 96.7 L 265.7 97.8 L 265.4 97.9 L 265.0 98.4 L 265.1 99.5 L 265.8 99.9 L 266.0 100.6 L 265.9 101.4 L 265.2 102.9 L 266.1 104.4 L 266.4 106.0 L 266.3 107.3 L 266.2 107.6 L 264.0 109.9 L 263.9 111.3 L 264.0 112.4 L 264.3 113.6 L 265.2 114.7 L 266.1 115.2 L 266.2 115.5 L 266.2 115.9 L 266.0 117.1 L 265.9 117.3 L 265.8 118.0 L 265.5 118.7 L 264.9 119.4 L 263.7 119.6 L 263.3 119.4 L 262.9 119.5 L 261.6 119.9 L 260.8 120.0 L 259.5 119.0 L 258.9 118.9 L 258.1 119.0 L 257.6 119.3 L 257.0 119.5 L 256.9 119.3 L 256.4 119.4 L 256.2 119.5 L 255.1 120.6 L 255.2 120.8 L 254.8 121.3 L 253.7 122.3 L 252.5 122.8 L 251.0 124.2 L 250.3 124.5 L 249.7 124.5 L 248.8 125.3 L 248.2 125.5 L 246.8 125.7 L 245.4 126.1 L 244.2 127.1 L 243.7 128.7 L 243.5 130.3 L 243.2 131.5 L 242.4 133.0 L 242.2 133.1 L 242.1 133.5 L 242.0 134.3 L 241.3 135.7 L 240.4 136.4 L 240.0 137.5 L 240.4 138.5 L 240.7 140.2 L 241.6 141.8 L 241.6 142.1 L 241.2 142.9 L 241.1 146.3 L 240.5 147.6 L 240.4 148.1 L 240.3 149.2 L 240.3 149.2 L 239.6 148.8 L 239.3 148.4 L 238.9 148.1 L 238.4 148.0 L 237.4 148.1 L 237.0 148.0 L 236.3 146.9 L 235.8 145.4 L 234.6 144.5 L 234.6 143.6 L 235.4 142.7 L 235.4 142.4 L 233.3 141.4 L 233.0 140.8 L 233.0 139.9 L 232.6 139.1 L 232.1 138.7 L 231.0 138.5 L 230.8 138.3 L 231.0 137.9 L 232.4 136.6 L 232.2 135.9 L 232.6 134.5 L 232.9 133.7 L 233.3 133.4 L 234.0 133.1 L 235.8 132.9 L 235.6 132.2 L 235.9 130.5 L 235.9 129.5 L 234.9 128.9 L 232.6 129.4 L 231.5 130.1 L 230.3 128.5 L 229.8 128.0 L 228.2 125.8 L 227.7 125.9 L 227.3 125.1 L 227.6 124.5 L 227.5 124.0 L 227.4 123.8 L 226.7 123.7 L 226.4 123.8 L 225.4 123.1 L 225.5 122.7 L 226.5 122.4 L 227.4 121.3 L 227.5 120.5 L 227.4 119.9 L 227.5 118.7 L 228.5 115.4 L 228.5 115.2 L 228.1 114.5 L 228.0 114.0 L 228.1 112.0 L 227.8 111.2 L 227.5 109.3 L 227.1 108.8 L 225.3 108.0 L 224.6 108.0 L 224.5 107.8 L 224.4 107.3 L 224.1 106.9 L 223.2 106.8 L 222.7 107.0 L 221.9 107.0 L 220.4 106.2 L 220.0 106.1 L 218.9 106.4 L 217.5 107.4 L 217.2 107.8 L 217.2 107.8 L 217.0 107.7 L 224.8 101.4 L 226.1 101.5 L 226.7 101.0 L 227.5 99.9 L 227.8 99.3 L 228.6 98.6 L 228.9 97.1 L 229.5 96.9 L 230.8 95.6 L 231.1 95.0 L 231.2 94.0 L 232.1 91.5 L 233.1 90.6 L 233.9 89.7 L 234.4 88.9 L 234.6 88.2 L 234.5 87.3 L 234.9 86.8 L 234.4 86.0 L 236.3 84.4 L 236.3 83.5 L 236.5 82.2 L 237.5 81.4 L 237.7 81.0 L 238.1 79.4 L 238.2 78.5 L 237.9 78.2 L 237.4 78.3 L 237.3 78.1 L 237.3 77.7 L 237.9 77.7 L 238.2 77.3 L 238.6 74.9 L 238.5 74.2 L 238.8 73.6 L 239.2 73.4 L 239.2 73.4 L 239.5 73.4 L 239.6 73.3 L 239.6 73.0 L 239.8 72.6 L 240.1 72.3 L 240.8 72.8 L 241.0 73.8 L 241.7 73.9 L 242.1 73.1 L 242.4 74.7 L 242.9 74.7 L 243.1 74.5 L 243.1 74.0 L 243.6 73.9 L 244.5 74.2 L 244.8 74.6 L 244.0 75.5 L 244.4 75.9 L 244.4 76.2 L 245.0 75.1 L 245.3 74.3 L 245.5 74.3 L 245.7 74.8 L 245.7 75.1 L 245.3 75.6 L 245.1 76.1 L 245.2 77.6 L 245.3 77.7 L 245.5 77.8 L 245.9 77.7 L 246.4 77.2 L 246.1 76.7 L 246.2 76.4 L 246.9 75.6 L 247.5 75.5 L 248.6 75.8 L 249.4 75.2 L 249.4 75.7 L 249.2 75.8 L 248.6 76.6 L 248.9 76.9 L 249.0 76.7 L 249.7 76.4 L 250.0 76.8 L 249.9 77.5 L 250.8 78.4 L 251.2 78.2 L 252.1 78.5 L 252.5 79.8 L 252.4 80.3 L 251.2 81.8 L 251.0 82.3 L 251.1 82.6 L 251.4 82.1 L 252.4 81.2 L 252.8 81.2 L 253.3 81.6 L 253.5 82.6 L 253.4 83.2 L 252.9 83.3 L 252.3 83.8 L 251.7 84.6 L 251.7 85.0 L 251.1 86.3 L 250.8 88.2 L 250.9 88.4 L 251.4 88.5 z M 251.6 88.7 L 251.6 88.3 L 251.9 87.5 L 251.7 86.9 L 251.7 86.6 L 252.2 85.9 L 252.5 85.8 L 252.6 87.0 L 252.4 87.8 L 252.0 88.1 L 251.6 88.7 z M 248.3 75.0 L 248.1 74.7 L 248.0 74.4 L 248.4 73.8 L 248.9 73.8 L 249.2 74.0 L 249.3 74.2 L 249.2 74.4 L 248.3 75.0 z M 250.2 77.2 L 250.0 77.0 L 250.0 76.8 L 250.6 76.3 L 250.9 76.3 L 251.1 76.8 L 251.0 77.1 L 250.8 77.0 L 250.2 77.2 z M 242.6 74.6 L 242.5 74.6 L 243.0 72.7 L 243.2 72.8 L 243.2 72.9 L 243.0 74.5 L 242.6 74.6 z'},
  {sigla:'MG',cx:246.3,cy:220.7,d:'M 288.1 214.6 L 287.6 214.3 L 286.3 213.8 L 285.5 213.9 L 284.9 214.0 L 284.4 214.4 L 283.3 214.5 L 282.5 214.5 L 283.4 215.7 L 283.4 216.1 L 282.8 216.0 L 282.3 215.6 L 282.1 215.7 L 280.9 216.4 L 280.3 217.4 L 280.5 217.8 L 281.2 218.1 L 281.5 218.5 L 281.5 219.5 L 281.3 220.3 L 281.4 220.5 L 282.1 220.7 L 282.2 221.6 L 282.0 221.9 L 281.5 222.0 L 281.0 222.0 L 280.6 221.8 L 279.8 221.8 L 279.6 222.1 L 279.8 222.5 L 280.2 222.7 L 280.5 222.5 L 280.7 222.5 L 281.3 223.2 L 282.0 224.7 L 282.2 226.0 L 281.9 227.6 L 281.0 228.7 L 280.3 229.2 L 280.2 229.4 L 280.0 230.3 L 279.6 231.6 L 279.0 232.2 L 278.4 234.0 L 278.2 234.1 L 275.4 234.1 L 274.5 235.2 L 274.4 235.4 L 274.7 237.1 L 274.4 237.8 L 274.2 239.0 L 274.3 239.1 L 274.3 239.1 L 273.0 240.4 L 272.3 240.5 L 272.0 240.8 L 272.4 241.2 L 271.2 244.4 L 270.1 246.4 L 270.1 246.8 L 270.9 246.8 L 271.0 247.2 L 270.9 247.4 L 269.6 248.0 L 264.5 250.4 L 263.8 250.5 L 263.8 250.2 L 263.5 250.1 L 262.2 250.0 L 261.9 250.0 L 261.0 250.5 L 260.3 250.6 L 258.6 250.7 L 258.4 250.5 L 258.2 250.5 L 256.0 251.5 L 255.4 251.9 L 254.5 252.3 L 254.2 252.1 L 252.8 252.2 L 251.3 253.0 L 250.0 253.3 L 249.6 253.6 L 249.6 253.6 L 249.0 254.0 L 247.8 254.1 L 246.8 254.7 L 246.1 255.3 L 245.2 255.7 L 243.9 255.8 L 242.6 255.8 L 242.6 255.5 L 242.8 255.2 L 242.8 255.1 L 242.1 255.2 L 242.0 256.5 L 242.2 256.6 L 242.1 257.0 L 241.7 257.6 L 241.1 257.7 L 240.8 257.5 L 238.8 258.0 L 238.7 257.7 L 237.7 257.9 L 237.1 257.7 L 236.0 256.0 L 236.6 255.6 L 236.3 254.7 L 235.4 254.2 L 234.4 253.6 L 234.1 252.7 L 234.3 251.9 L 234.4 250.1 L 234.3 248.5 L 235.3 247.0 L 235.7 245.9 L 235.7 245.2 L 235.6 245.0 L 233.6 244.3 L 233.1 244.3 L 232.9 244.5 L 232.5 244.7 L 231.6 244.7 L 231.7 244.3 L 231.2 243.2 L 230.5 242.2 L 230.3 241.1 L 230.2 240.7 L 229.7 240.3 L 229.8 239.3 L 230.6 238.2 L 230.7 237.9 L 230.5 237.1 L 229.5 236.4 L 229.2 236.1 L 229.3 234.9 L 229.6 234.3 L 229.5 233.8 L 227.8 232.0 L 227.1 232.1 L 226.6 232.5 L 225.7 232.1 L 224.5 232.1 L 224.3 232.4 L 224.4 232.7 L 224.2 233.2 L 222.7 233.6 L 222.1 233.3 L 221.3 232.6 L 220.8 233.2 L 216.4 233.6 L 216.1 233.9 L 215.9 234.5 L 216.0 235.9 L 215.8 236.1 L 215.2 235.8 L 215.2 234.3 L 215.0 233.8 L 214.8 233.6 L 214.5 233.6 L 214.4 233.7 L 214.2 234.3 L 213.8 234.8 L 213.5 235.0 L 213.2 234.9 L 212.6 233.8 L 212.4 233.1 L 212.5 232.6 L 211.6 232.2 L 210.4 231.4 L 209.3 231.7 L 208.5 231.6 L 207.6 231.8 L 205.3 231.3 L 203.9 231.2 L 203.0 230.4 L 202.6 230.3 L 201.8 230.7 L 201.1 231.6 L 200.0 231.8 L 198.9 232.3 L 198.2 232.9 L 198.2 232.9 L 198.4 231.6 L 198.1 229.8 L 198.6 227.6 L 198.9 227.5 L 198.9 227.5 L 199.4 227.7 L 199.6 227.6 L 199.6 227.4 L 199.3 227.1 L 199.6 226.1 L 200.5 225.0 L 201.0 224.6 L 201.2 224.5 L 201.7 224.6 L 202.1 224.4 L 202.5 223.7 L 202.5 223.2 L 203.2 221.9 L 203.9 220.8 L 205.1 220.5 L 206.4 220.0 L 208.4 220.3 L 210.1 219.4 L 210.9 219.6 L 211.6 220.3 L 211.8 220.3 L 213.3 218.8 L 215.5 217.4 L 216.6 217.9 L 218.7 217.8 L 219.5 217.9 L 220.4 217.9 L 220.7 217.9 L 221.0 217.6 L 223.3 218.6 L 223.7 219.0 L 226.3 217.5 L 226.5 216.9 L 227.0 216.5 L 227.6 216.4 L 229.3 215.3 L 228.6 213.4 L 228.9 212.4 L 229.3 211.9 L 229.4 211.6 L 229.3 211.0 L 229.0 210.7 L 228.2 210.4 L 227.7 210.6 L 227.1 210.0 L 227.4 208.9 L 229.1 207.3 L 230.3 205.9 L 230.3 205.5 L 229.5 203.1 L 228.7 202.6 L 228.2 202.4 L 227.8 201.7 L 228.0 200.9 L 228.6 200.3 L 228.9 199.4 L 228.8 198.6 L 229.0 197.8 L 229.7 197.7 L 230.9 196.9 L 232.7 196.4 L 233.0 196.1 L 232.7 193.9 L 232.4 193.8 L 232.1 193.5 L 232.1 192.4 L 232.5 192.1 L 232.8 191.6 L 232.6 190.9 L 232.2 190.9 L 232.6 189.2 L 232.8 189.0 L 233.4 188.9 L 234.9 189.5 L 235.1 189.5 L 235.4 189.2 L 235.1 187.2 L 235.7 186.4 L 237.0 187.2 L 237.5 188.1 L 239.2 188.3 L 239.7 187.7 L 239.7 187.7 L 240.0 189.0 L 239.2 190.9 L 239.4 191.0 L 240.2 190.5 L 240.5 190.0 L 240.9 189.9 L 242.0 190.1 L 242.6 189.7 L 243.6 188.3 L 244.1 188.4 L 244.9 188.1 L 245.8 187.3 L 246.4 186.7 L 247.4 186.4 L 249.2 185.5 L 249.6 184.9 L 251.8 183.2 L 253.9 182.4 L 254.8 182.4 L 255.5 182.7 L 256.6 182.7 L 257.9 183.0 L 258.3 183.3 L 257.6 184.7 L 257.5 185.2 L 257.7 186.0 L 258.0 186.3 L 260.9 187.0 L 261.2 186.9 L 261.6 186.3 L 262.6 185.9 L 263.6 185.7 L 265.0 186.1 L 265.6 186.4 L 267.9 188.4 L 268.5 188.3 L 269.6 189.1 L 271.0 189.8 L 271.5 189.9 L 271.7 189.8 L 272.5 190.4 L 274.9 189.8 L 275.1 189.9 L 278.6 193.2 L 278.8 195.3 L 279.1 195.2 L 280.5 195.4 L 281.3 195.2 L 282.0 194.6 L 283.1 194.7 L 284.5 195.0 L 285.7 195.6 L 286.9 195.9 L 288.0 195.9 L 289.5 197.2 L 289.9 197.4 L 290.4 197.5 L 290.8 198.0 L 291.0 198.6 L 290.2 200.3 L 287.6 202.5 L 287.5 203.9 L 287.8 204.5 L 287.8 204.7 L 287.3 205.1 L 285.9 205.0 L 285.5 205.4 L 285.1 207.2 L 284.8 209.5 L 284.9 209.7 L 285.1 209.6 L 285.2 209.3 L 285.5 209.2 L 285.9 209.9 L 285.7 210.7 L 285.8 210.9 L 288.0 212.6 L 288.3 213.1 L 288.3 213.4 L 287.9 214.1 z'},
  {sigla:'MS',cx:168.3,cy:234.6,d:'M 198.2 232.9 L 198.0 234.3 L 197.9 234.5 L 197.1 234.9 L 196.4 234.9 L 196.1 235.0 L 195.5 235.6 L 194.4 237.0 L 194.0 237.4 L 193.5 237.5 L 193.2 238.4 L 193.1 240.0 L 191.7 241.9 L 191.2 242.2 L 191.1 242.4 L 191.2 243.4 L 191.2 243.9 L 190.5 245.2 L 189.5 246.4 L 189.7 246.8 L 189.5 247.5 L 188.7 248.0 L 188.5 248.7 L 187.6 249.6 L 186.9 250.9 L 185.9 251.9 L 181.9 254.3 L 181.2 254.9 L 180.8 255.7 L 180.3 256.3 L 180.3 256.3 L 177.5 257.5 L 176.9 257.9 L 176.4 259.2 L 176.4 259.8 L 175.6 261.7 L 175.2 262.1 L 174.4 262.6 L 173.8 262.8 L 173.6 263.0 L 172.8 267.2 L 172.6 267.6 L 171.3 268.5 L 171.3 268.5 L 169.9 267.2 L 168.1 266.2 L 166.0 267.3 L 165.6 267.7 L 164.7 267.9 L 163.4 268.1 L 162.1 267.9 L 161.6 267.6 L 161.3 265.3 L 161.1 264.9 L 160.7 264.4 L 160.5 263.1 L 160.8 262.4 L 160.5 261.9 L 160.4 261.7 L 160.4 260.2 L 160.0 259.1 L 159.6 257.7 L 159.6 257.3 L 159.9 256.6 L 159.9 255.7 L 159.1 255.1 L 158.9 254.7 L 158.8 253.5 L 157.9 252.6 L 156.8 252.4 L 156.0 252.6 L 155.0 252.4 L 153.7 251.4 L 153.4 250.6 L 152.6 250.8 L 151.4 252.2 L 150.9 251.9 L 149.9 252.3 L 149.4 252.4 L 148.4 252.1 L 147.1 251.8 L 145.2 251.9 L 143.3 251.5 L 143.0 251.1 L 142.0 251.0 L 141.5 251.3 L 140.2 250.8 L 140.6 246.9 L 140.4 245.7 L 140.7 244.9 L 141.3 244.1 L 141.6 240.9 L 141.2 239.7 L 141.2 238.7 L 140.8 238.2 L 140.6 238.2 L 140.3 238.5 L 140.0 236.8 L 139.5 235.8 L 138.9 234.7 L 138.7 233.7 L 140.9 232.5 L 141.3 232.0 L 139.0 230.0 L 141.9 223.9 L 142.5 223.9 L 142.3 222.7 L 141.9 222.7 L 143.7 217.1 L 144.0 216.5 L 142.4 213.4 L 142.4 212.4 L 142.4 212.4 L 142.8 212.5 L 143.3 213.1 L 144.4 213.9 L 147.4 212.8 L 148.5 211.8 L 149.6 210.2 L 149.7 209.6 L 150.4 208.8 L 151.8 208.8 L 152.6 208.7 L 153.0 208.9 L 153.9 208.6 L 154.6 207.9 L 155.7 207.7 L 156.4 207.8 L 156.8 208.4 L 158.3 209.1 L 159.7 209.3 L 160.0 209.5 L 160.2 210.0 L 160.6 210.5 L 162.2 211.1 L 162.9 211.7 L 163.5 212.0 L 166.0 211.7 L 166.6 211.3 L 166.9 210.8 L 167.6 210.5 L 168.9 210.5 L 169.8 211.1 L 170.0 211.8 L 170.1 211.9 L 170.6 212.0 L 171.7 211.5 L 172.3 211.5 L 175.3 208.3 L 176.0 208.2 L 175.3 211.8 L 174.4 212.1 L 173.5 213.7 L 173.4 213.9 L 173.5 214.2 L 174.2 214.2 L 175.1 214.9 L 177.6 215.1 L 177.9 214.8 L 179.3 214.7 L 179.7 214.8 L 180.4 215.1 L 181.2 214.9 L 181.2 214.9 L 181.3 215.8 L 181.2 217.2 L 181.3 217.8 L 181.4 218.0 L 181.8 218.1 L 182.4 217.8 L 183.6 218.3 L 183.6 218.5 L 182.9 219.4 L 182.6 220.0 L 182.5 220.5 L 182.6 220.7 L 184.6 221.0 L 186.1 220.9 L 187.5 221.8 L 188.1 221.9 L 188.9 222.3 L 189.2 222.6 L 190.9 223.5 L 191.2 223.9 L 193.0 224.6 L 193.8 224.7 L 194.8 224.9 L 195.7 225.7 L 197.4 226.0 L 198.8 227.2 L 198.9 227.5 L 198.9 227.5 L 198.6 227.6 L 198.1 229.8 L 198.4 231.6 z'},
  {sigla:'MT',cx:156.7,cy:177.2,d:'M 117.2 177.6 L 118.0 176.8 L 120.2 175.5 L 120.4 174.2 L 121.2 172.2 L 121.7 171.6 L 122.6 171.3 L 122.8 171.1 L 123.1 170.6 L 123.4 169.4 L 124.3 168.4 L 124.6 167.2 L 124.6 166.3 L 124.3 165.5 L 124.3 164.4 L 123.5 162.6 L 123.0 162.6 L 122.7 162.3 L 122.5 160.6 L 122.6 159.9 L 123.3 159.3 L 124.0 158.4 L 124.1 158.0 L 123.4 156.1 L 122.8 155.8 L 122.2 155.8 L 120.3 155.8 L 119.7 155.2 L 119.8 154.9 L 110.7 154.9 L 111.1 150.1 L 110.3 148.6 L 110.2 147.7 L 110.2 147.3 L 110.7 145.4 L 110.5 144.4 L 111.0 143.5 L 110.6 142.3 L 110.5 141.5 L 110.4 141.2 L 110.0 140.9 L 109.9 140.8 L 110.6 138.1 L 111.0 137.3 L 110.7 136.7 L 110.0 136.2 L 110.0 136.2 L 135.5 136.0 L 136.1 135.6 L 136.8 132.8 L 137.5 130.6 L 137.2 129.5 L 136.9 128.8 L 136.8 128.4 L 137.1 127.9 L 137.5 127.6 L 138.2 126.6 L 138.3 126.0 L 138.1 125.6 L 138.2 125.2 L 138.3 124.9 L 138.9 124.2 L 138.9 124.2 L 139.5 124.8 L 140.8 127.0 L 141.0 127.9 L 141.8 130.0 L 142.5 131.1 L 142.9 131.9 L 142.8 133.2 L 143.0 134.5 L 143.4 135.7 L 144.2 136.3 L 145.8 137.7 L 147.6 138.6 L 147.7 139.1 L 147.7 139.7 L 147.9 140.0 L 148.4 140.2 L 148.8 140.1 L 149.7 140.3 L 150.0 140.7 L 150.1 141.3 L 150.2 141.5 L 151.0 141.2 L 152.9 142.0 L 171.1 143.3 L 204.7 145.2 L 204.7 145.2 L 204.3 145.7 L 204.0 146.7 L 203.5 147.4 L 203.2 149.1 L 203.0 149.5 L 202.8 149.7 L 201.8 152.5 L 201.5 154.1 L 201.4 155.6 L 200.4 158.8 L 200.5 159.3 L 201.2 160.0 L 201.1 160.5 L 200.7 161.0 L 200.7 161.2 L 201.3 162.4 L 201.0 164.2 L 201.0 165.0 L 201.3 165.3 L 201.5 167.0 L 201.1 168.4 L 201.6 170.2 L 202.2 170.5 L 202.6 170.5 L 202.6 170.5 L 202.6 170.8 L 202.5 171.4 L 202.0 171.9 L 201.8 172.4 L 201.9 173.8 L 201.7 174.4 L 200.6 176.1 L 200.0 177.5 L 199.4 177.9 L 199.5 180.7 L 198.6 182.3 L 198.3 183.8 L 198.6 184.4 L 198.6 184.8 L 197.9 186.3 L 197.5 187.9 L 196.7 188.7 L 196.1 189.1 L 195.4 188.7 L 194.9 188.8 L 194.0 189.4 L 193.0 190.4 L 192.8 190.8 L 192.4 193.0 L 192.0 193.5 L 191.0 195.7 L 190.8 195.9 L 189.4 196.3 L 188.0 196.4 L 187.2 197.8 L 186.3 198.3 L 186.2 199.1 L 185.8 199.9 L 185.1 200.5 L 184.8 201.0 L 184.7 202.0 L 184.0 203.1 L 183.0 204.1 L 181.9 204.5 L 181.5 204.9 L 181.3 206.5 L 180.0 208.5 L 179.8 210.3 L 179.8 210.7 L 180.6 211.9 L 180.7 213.7 L 181.2 214.9 L 181.2 214.9 L 180.4 215.1 L 179.7 214.8 L 179.3 214.7 L 177.9 214.8 L 177.6 215.1 L 175.1 214.9 L 174.2 214.2 L 173.5 214.2 L 173.4 213.9 L 173.5 213.7 L 174.4 212.1 L 175.3 211.8 L 176.0 208.2 L 175.3 208.3 L 172.3 211.5 L 171.7 211.5 L 170.6 212.0 L 170.1 211.9 L 170.0 211.8 L 169.8 211.1 L 168.9 210.5 L 167.6 210.5 L 166.9 210.8 L 166.6 211.3 L 165.9 211.7 L 163.5 212.0 L 162.9 211.7 L 162.2 211.1 L 160.6 210.5 L 160.2 210.0 L 160.0 209.5 L 159.7 209.3 L 158.3 209.1 L 156.8 208.4 L 156.4 207.8 L 155.7 207.7 L 154.6 207.9 L 153.9 208.6 L 153.0 208.9 L 152.6 208.7 L 151.8 208.8 L 150.4 208.8 L 149.7 209.6 L 149.6 210.2 L 148.5 211.8 L 147.4 212.8 L 144.4 213.9 L 143.3 213.1 L 142.8 212.5 L 142.4 212.4 L 142.4 212.4 L 142.0 212.0 L 141.9 211.6 L 142.1 211.2 L 140.8 210.1 L 140.2 210.4 L 139.9 210.4 L 139.3 210.0 L 139.0 209.6 L 137.9 208.9 L 136.9 208.5 L 136.8 208.3 L 136.6 207.7 L 136.5 206.2 L 136.2 205.2 L 136.1 203.3 L 136.5 202.4 L 137.1 201.8 L 137.3 200.9 L 137.3 199.9 L 136.8 199.9 L 136.6 200.2 L 136.4 200.3 L 122.0 199.7 L 121.5 193.0 L 118.6 189.7 L 121.2 189.7 L 121.0 185.6 L 119.6 182.8 L 119.4 181.7 L 119.5 181.2 L 119.8 180.9 L 120.2 180.2 L 119.4 178.6 L 117.7 178.1 z'},
  {sigla:'PA',cx:195.8,cy:76.3,d:'M 204.7 145.2 L 171.1 143.3 L 152.9 142.0 L 151.0 141.2 L 150.3 141.5 L 150.1 141.3 L 150.0 140.7 L 149.7 140.4 L 148.8 140.1 L 148.4 140.2 L 147.9 140.0 L 147.7 139.7 L 147.7 139.1 L 147.6 138.6 L 145.8 137.7 L 144.2 136.3 L 143.4 135.7 L 143.0 134.5 L 142.8 133.2 L 142.9 131.9 L 142.5 131.1 L 141.8 130.0 L 141.0 127.9 L 140.8 127.0 L 139.5 124.8 L 138.9 124.2 L 138.9 124.2 L 138.6 123.9 L 138.5 122.9 L 138.2 122.2 L 137.3 121.4 L 136.7 121.1 L 136.5 120.8 L 136.1 119.5 L 136.1 118.9 L 136.4 118.4 L 137.2 117.8 L 137.6 117.1 L 153.6 82.8 L 152.6 82.0 L 152.7 81.5 L 152.6 81.3 L 151.8 81.5 L 151.4 81.8 L 150.4 81.4 L 149.8 80.2 L 148.4 79.4 L 147.7 78.7 L 147.6 78.4 L 146.9 78.0 L 146.2 77.9 L 145.0 77.5 L 143.7 76.8 L 142.7 76.5 L 142.0 75.9 L 141.7 75.4 L 139.2 74.1 L 136.8 72.1 L 136.6 71.8 L 136.6 71.3 L 136.3 70.4 L 135.3 69.7 L 134.9 69.8 L 134.7 69.7 L 133.8 68.6 L 133.8 67.5 L 134.0 67.1 L 133.9 66.9 L 133.0 66.5 L 132.8 66.1 L 132.8 64.9 L 133.0 64.1 L 132.8 61.5 L 132.8 61.5 L 131.9 52.5 L 131.9 52.5 L 132.3 52.7 L 132.5 53.0 L 132.5 53.2 L 132.8 53.4 L 133.3 53.6 L 134.0 53.2 L 134.3 52.8 L 135.7 52.9 L 136.1 52.3 L 135.8 51.4 L 136.8 51.2 L 137.5 50.3 L 139.0 50.8 L 140.0 50.9 L 140.2 50.1 L 142.0 49.2 L 143.1 49.4 L 143.7 49.3 L 144.0 49.2 L 144.6 48.4 L 144.8 47.7 L 145.6 47.1 L 146.0 47.0 L 146.4 47.3 L 147.5 46.7 L 147.7 46.7 L 147.9 47.3 L 148.3 47.5 L 149.4 47.7 L 150.3 47.9 L 150.6 47.6 L 151.5 47.4 L 151.9 47.5 L 152.3 47.5 L 152.8 47.3 L 154.0 47.5 L 156.4 48.2 L 157.0 48.1 L 157.5 47.7 L 157.5 46.5 L 156.4 45.1 L 155.7 44.8 L 156.0 43.9 L 156.7 43.1 L 156.8 42.5 L 157.0 42.4 L 157.4 42.5 L 157.8 42.9 L 159.1 43.5 L 165.3 42.3 L 166.1 43.2 L 166.6 43.2 L 166.9 43.1 L 166.9 43.1 L 167.2 43.4 L 167.4 44.6 L 167.1 45.3 L 166.9 47.7 L 167.1 48.5 L 167.2 48.8 L 167.9 48.8 L 168.4 48.6 L 170.2 48.8 L 170.9 49.1 L 172.0 49.6 L 172.3 50.1 L 172.6 50.8 L 173.2 50.8 L 173.8 51.3 L 174.2 51.8 L 174.7 51.9 L 175.4 51.9 L 175.6 51.6 L 176.1 51.6 L 177.6 53.0 L 178.0 53.0 L 178.2 53.6 L 177.9 53.7 L 177.8 54.1 L 178.2 55.6 L 179.3 56.8 L 180.6 57.2 L 180.7 57.4 L 180.5 59.1 L 180.6 60.2 L 181.0 61.0 L 181.3 61.3 L 181.6 62.3 L 181.5 63.1 L 182.3 64.9 L 182.8 65.1 L 183.2 64.9 L 184.7 66.6 L 184.7 67.9 L 184.9 68.4 L 185.4 68.5 L 185.6 68.8 L 185.8 69.6 L 185.7 70.0 L 185.7 70.7 L 186.7 71.4 L 186.9 72.2 L 187.7 72.8 L 189.2 73.1 L 189.9 73.1 L 190.3 72.9 L 190.8 72.9 L 190.8 72.9 L 190.5 73.3 L 190.7 74.1 L 190.6 74.4 L 189.9 75.0 L 189.2 75.1 L 188.9 75.0 L 188.4 74.6 L 188.1 74.5 L 186.3 75.4 L 186.1 75.6 L 185.2 76.0 L 184.9 76.0 L 184.1 76.3 L 184.1 76.6 L 187.5 76.1 L 188.0 76.4 L 188.1 76.7 L 188.1 77.0 L 187.8 77.3 L 187.9 77.5 L 188.3 77.4 L 188.7 76.8 L 189.3 76.8 L 189.5 76.7 L 189.9 76.8 L 190.4 76.5 L 191.0 76.2 L 192.8 75.0 L 193.6 74.8 L 194.6 74.4 L 196.3 73.4 L 196.5 72.8 L 196.9 72.6 L 198.0 72.0 L 198.4 71.6 L 198.2 71.3 L 198.3 71.1 L 198.9 70.9 L 199.5 71.0 L 199.7 71.1 L 199.9 73.1 L 199.7 74.5 L 199.8 75.3 L 200.3 76.2 L 201.0 76.9 L 201.1 77.8 L 201.1 78.0 L 200.1 79.0 L 199.8 79.1 L 199.4 78.8 L 198.4 78.5 L 197.7 78.4 L 197.2 78.4 L 196.1 77.9 L 196.0 77.3 L 195.5 77.0 L 194.3 79.0 L 194.0 80.3 L 194.3 81.9 L 194.6 82.2 L 195.1 82.6 L 194.5 82.0 L 194.3 80.5 L 194.4 80.2 L 195.7 78.0 L 197.0 78.6 L 197.0 78.9 L 198.4 80.2 L 198.2 81.2 L 197.8 81.5 L 198.1 82.8 L 198.3 83.4 L 198.9 83.8 L 199.3 83.9 L 199.6 84.1 L 199.4 83.8 L 199.0 83.7 L 198.4 83.1 L 198.3 82.7 L 198.4 80.5 L 198.9 79.9 L 199.6 80.3 L 200.1 80.9 L 200.0 81.3 L 200.7 81.8 L 200.8 81.6 L 200.3 80.9 L 199.8 79.8 L 199.8 79.6 L 201.0 78.4 L 201.8 78.4 L 202.9 78.7 L 203.1 79.0 L 202.7 79.4 L 202.9 79.5 L 203.2 79.5 L 203.7 79.4 L 204.4 78.9 L 206.6 78.4 L 207.0 78.5 L 207.9 79.1 L 209.6 78.9 L 210.2 78.7 L 210.7 78.1 L 211.3 77.8 L 212.2 77.5 L 212.6 77.6 L 212.6 78.0 L 211.5 80.1 L 211.4 80.9 L 211.2 81.5 L 210.7 82.0 L 210.7 82.5 L 211.0 83.3 L 210.9 84.6 L 211.3 84.0 L 211.3 83.2 L 212.2 81.6 L 212.8 79.9 L 213.4 79.1 L 213.5 78.9 L 213.9 78.9 L 214.2 78.7 L 215.2 78.6 L 215.7 77.9 L 216.5 77.0 L 217.2 75.8 L 217.5 75.5 L 217.9 75.8 L 218.2 75.5 L 219.1 76.8 L 219.7 77.1 L 219.7 76.7 L 219.5 76.3 L 219.8 75.8 L 221.7 75.5 L 221.2 75.3 L 219.3 75.6 L 219.1 75.5 L 219.3 74.2 L 219.5 74.0 L 219.9 74.2 L 220.4 74.3 L 221.0 72.6 L 220.7 71.9 L 220.7 71.5 L 221.3 70.5 L 222.8 69.2 L 223.0 69.2 L 223.6 69.8 L 225.2 68.7 L 225.4 68.6 L 225.6 68.9 L 225.7 69.2 L 225.5 69.5 L 226.1 69.5 L 226.5 69.1 L 226.7 68.7 L 227.0 68.6 L 227.2 68.7 L 227.6 69.4 L 228.3 70.1 L 228.4 69.8 L 228.3 69.6 L 227.8 69.3 L 227.7 69.2 L 227.7 68.5 L 227.8 68.3 L 228.0 68.2 L 229.2 68.3 L 229.8 68.7 L 230.2 69.2 L 231.0 69.6 L 231.9 69.2 L 232.2 70.3 L 231.9 70.5 L 231.9 70.8 L 232.4 70.5 L 233.0 69.3 L 233.2 69.4 L 233.1 70.1 L 233.3 70.4 L 234.7 70.2 L 234.9 70.6 L 235.2 71.5 L 234.8 72.0 L 235.3 71.7 L 235.4 71.9 L 236.4 72.0 L 238.3 71.3 L 238.2 72.1 L 237.8 73.1 L 238.5 72.9 L 238.9 72.5 L 239.2 73.4 L 239.2 73.4 L 238.8 73.6 L 238.5 74.2 L 238.6 74.9 L 238.2 77.3 L 237.9 77.7 L 237.3 77.7 L 237.3 78.1 L 237.4 78.3 L 238.0 78.2 L 238.2 78.5 L 238.2 79.4 L 237.7 81.0 L 237.5 81.4 L 236.6 82.2 L 236.3 83.5 L 236.4 84.4 L 234.4 86.0 L 234.9 86.8 L 234.5 87.3 L 234.6 88.3 L 234.4 88.9 L 233.9 89.7 L 233.1 90.6 L 232.1 91.5 L 231.2 94.0 L 231.1 95.0 L 230.8 95.6 L 229.5 96.9 L 228.9 97.1 L 228.6 98.6 L 227.8 99.3 L 227.6 99.9 L 226.7 101.0 L 226.1 101.5 L 224.9 101.4 L 217.0 107.7 L 217.3 107.8 L 217.3 107.8 L 218.5 108.2 L 219.5 108.1 L 220.2 108.1 L 220.7 109.0 L 220.9 109.2 L 221.4 109.3 L 222.1 109.9 L 222.0 110.2 L 221.8 110.6 L 221.5 110.8 L 220.9 110.8 L 220.8 111.0 L 220.8 111.7 L 221.4 112.4 L 220.9 113.9 L 220.5 114.1 L 219.8 114.4 L 219.6 114.6 L 219.8 115.3 L 219.7 116.0 L 219.0 116.1 L 218.2 116.8 L 217.7 117.5 L 217.8 118.3 L 217.7 118.5 L 216.4 119.2 L 214.5 119.8 L 213.2 120.7 L 213.1 120.9 L 213.3 122.1 L 213.4 123.5 L 212.7 124.6 L 211.9 125.5 L 211.9 125.8 L 212.0 126.3 L 212.3 126.8 L 213.2 127.7 L 213.6 127.9 L 213.6 128.1 L 213.3 130.2 L 212.3 133.0 L 211.8 133.4 L 210.9 135.1 L 210.8 135.7 L 210.3 136.5 L 209.9 136.9 L 209.3 137.0 L 208.6 137.5 L 208.0 138.5 L 207.4 139.4 L 206.8 140.0 L 206.1 140.9 L 205.5 143.2 L 204.7 145.2 z M 216.0 75.7 L 213.6 76.7 L 211.8 77.0 L 210.7 76.8 L 210.3 77.4 L 209.3 78.1 L 209.0 77.8 L 208.6 76.9 L 208.5 77.1 L 208.7 77.7 L 208.6 78.2 L 208.2 78.4 L 206.2 77.5 L 205.7 77.9 L 203.5 78.6 L 201.8 78.3 L 201.4 77.9 L 201.2 77.0 L 201.1 76.7 L 200.5 76.2 L 200.0 75.3 L 199.9 74.4 L 200.1 72.9 L 200.5 72.7 L 201.4 72.9 L 201.9 72.5 L 201.9 72.2 L 201.2 72.4 L 200.6 72.4 L 200.1 72.0 L 200.0 71.4 L 200.2 68.7 L 200.6 68.3 L 200.8 68.7 L 201.7 69.0 L 202.0 69.0 L 201.7 68.8 L 201.1 68.7 L 200.6 67.5 L 200.8 66.6 L 201.2 65.6 L 202.0 64.9 L 202.5 64.6 L 203.2 64.3 L 203.9 64.2 L 205.7 64.5 L 209.6 65.5 L 211.6 65.2 L 211.6 65.0 L 212.2 64.7 L 213.4 64.5 L 214.9 64.7 L 216.4 65.1 L 219.9 65.6 L 220.2 65.8 L 220.2 66.5 L 219.8 66.9 L 219.4 67.7 L 219.2 69.1 L 218.8 70.8 L 218.1 71.2 L 217.9 71.6 L 218.0 72.2 L 217.0 73.6 L 216.2 75.4 L 216.0 75.7 z M 190.8 75.6 L 190.4 75.3 L 191.0 74.1 L 190.9 73.2 L 191.1 73.1 L 192.3 72.8 L 192.8 72.3 L 192.9 72.1 L 192.8 70.8 L 193.2 69.5 L 193.9 68.7 L 195.1 67.9 L 196.6 67.8 L 197.0 69.0 L 196.4 70.2 L 196.0 71.8 L 195.4 72.2 L 194.7 73.3 L 194.3 73.6 L 191.6 75.4 L 190.8 75.6 z M 206.0 63.4 L 205.4 63.2 L 204.1 63.3 L 203.7 63.2 L 203.6 63.1 L 203.3 62.5 L 203.4 61.8 L 204.2 61.6 L 205.2 61.6 L 206.3 60.9 L 208.9 60.6 L 209.3 60.8 L 209.7 61.1 L 209.6 61.7 L 208.2 62.4 L 207.3 63.7 L 206.7 64.0 L 206.0 63.4 z M 208.5 63.4 L 209.5 62.7 L 210.6 62.8 L 211.5 63.1 L 211.7 63.6 L 211.8 63.9 L 211.3 64.4 L 209.8 64.5 L 209.2 64.7 L 208.0 64.2 L 207.9 63.9 L 208.5 63.4 z M 199.5 65.7 L 199.2 65.6 L 198.9 65.6 L 198.1 65.2 L 198.2 64.6 L 198.5 64.1 L 199.5 63.9 L 200.8 63.4 L 201.5 63.5 L 201.9 63.8 L 202.0 63.9 L 201.0 64.8 L 200.4 64.9 L 199.5 65.7 z M 204.5 60.6 L 204.1 60.4 L 204.0 59.5 L 204.1 59.2 L 204.7 58.5 L 206.0 58.0 L 206.1 58.1 L 206.4 58.4 L 206.4 58.9 L 205.4 60.0 L 204.5 60.6 z M 197.1 71.3 L 197.1 71.1 L 197.2 70.6 L 197.7 69.1 L 199.1 68.2 L 199.5 68.1 L 199.8 68.1 L 199.8 69.1 L 198.9 69.3 L 198.1 70.5 L 197.1 71.3 z M 202.9 62.0 L 202.3 61.8 L 202.2 61.5 L 202.6 61.0 L 203.0 58.9 L 203.5 58.3 L 203.6 58.3 L 203.7 58.5 L 203.7 59.8 L 204.0 60.8 L 203.8 61.3 L 203.3 61.5 L 202.9 62.0 z M 195.1 67.4 L 194.9 67.3 L 195.0 67.0 L 195.3 66.8 L 195.9 65.9 L 196.3 65.1 L 196.7 64.7 L 197.5 64.4 L 197.4 65.2 L 197.1 65.7 L 196.2 66.6 L 195.1 67.4 z M 202.4 63.7 L 202.1 63.6 L 201.7 63.2 L 201.2 62.3 L 201.1 62.1 L 201.3 62.0 L 201.7 61.7 L 202.7 62.1 L 202.8 62.3 L 203.0 63.4 L 202.4 63.7 z M 199.6 80.0 L 199.2 79.9 L 198.8 79.6 L 198.4 79.9 L 198.0 79.7 L 197.1 78.8 L 197.1 78.5 L 197.8 78.5 L 199.4 79.2 L 199.6 80.0 z M 188.3 77.0 L 188.3 76.4 L 188.2 76.3 L 188.5 75.8 L 189.8 75.3 L 190.2 75.5 L 190.7 76.0 L 190.5 76.1 L 190.0 76.4 L 188.6 76.6 L 188.3 77.0 z M 195.1 73.4 L 195.0 73.4 L 195.0 73.2 L 195.3 72.7 L 196.2 71.9 L 196.4 71.2 L 196.5 70.5 L 196.6 70.3 L 196.8 70.6 L 196.8 71.4 L 196.3 72.8 L 196.0 73.2 L 195.1 73.4 z M 198.4 68.1 L 199.3 66.6 L 199.8 66.5 L 200.2 66.6 L 200.3 67.0 L 200.0 67.4 L 198.4 68.1 z M 215.2 78.3 L 214.7 78.1 L 214.6 77.5 L 215.1 76.6 L 215.7 76.4 L 215.8 76.5 L 215.8 76.9 L 215.4 78.1 L 215.2 78.3 z M 197.3 67.9 L 197.0 67.8 L 197.2 66.7 L 197.9 65.7 L 198.0 65.7 L 198.7 66.2 L 198.7 66.3 L 197.9 66.7 L 197.3 67.9 z M 198.5 70.6 L 198.9 70.6 L 198.7 70.8 L 198.2 71.0 L 198.1 71.6 L 197.7 72.0 L 196.8 72.4 L 196.7 72.3 L 196.9 71.9 L 197.1 71.5 L 198.0 70.6 L 198.5 70.6 z M 186.5 76.0 L 186.2 75.9 L 186.2 75.7 L 186.4 75.5 L 188.3 74.7 L 188.6 75.0 L 188.6 75.1 L 187.8 75.5 L 186.5 76.0 z M 220.4 73.5 L 219.8 73.4 L 219.4 72.9 L 219.9 72.3 L 220.6 72.3 L 220.7 72.9 L 220.6 73.2 L 220.4 73.5 z M 200.5 63.4 L 199.2 63.8 L 198.9 63.8 L 198.8 63.6 L 199.4 63.1 L 199.9 62.8 L 200.5 62.9 L 200.7 63.1 L 200.8 63.2 L 200.7 63.3 L 200.5 63.4 z M 197.7 68.0 L 197.7 67.6 L 197.8 67.3 L 199.1 66.5 L 198.6 67.6 L 198.2 67.9 L 197.7 68.0 z M 198.8 70.4 L 198.6 70.3 L 198.6 70.2 L 199.0 69.4 L 199.6 69.4 L 199.5 70.1 L 198.8 70.4 z M 213.8 78.8 L 213.6 78.7 L 214.1 77.8 L 214.5 77.6 L 214.6 78.0 L 214.9 78.2 L 214.7 78.5 L 214.5 78.7 L 214.2 78.6 L 213.8 78.8 z M 199.6 66.4 L 199.1 66.3 L 199.1 66.2 L 200.4 65.3 L 200.4 65.8 L 200.3 66.1 L 200.1 66.3 L 199.6 66.4 z M 235.6 71.8 L 235.3 71.6 L 235.5 71.1 L 236.0 70.7 L 236.1 70.7 L 236.3 71.7 L 235.6 71.8 z'},
  {sigla:'PB',cx:314.9,cy:122.5,d:'M 332.4 125.9 L 331.0 124.8 L 330.6 124.7 L 329.2 124.6 L 327.9 125.2 L 327.2 125.8 L 326.9 126.8 L 325.9 127.3 L 324.8 127.6 L 324.2 127.6 L 324.2 127.9 L 323.8 128.2 L 322.6 128.3 L 320.6 128.2 L 319.7 128.7 L 319.4 129.0 L 318.4 129.1 L 318.0 129.4 L 317.7 129.8 L 317.9 130.2 L 317.9 130.5 L 317.7 130.8 L 316.7 131.6 L 316.0 131.7 L 315.1 132.1 L 314.3 131.7 L 313.8 131.2 L 313.6 130.0 L 313.7 129.7 L 313.6 129.6 L 313.0 129.4 L 312.8 129.6 L 312.0 129.7 L 312.0 129.5 L 313.3 128.0 L 313.4 127.8 L 313.1 126.8 L 313.0 126.6 L 313.2 126.2 L 314.8 125.6 L 314.9 125.4 L 314.6 124.7 L 312.8 123.7 L 312.0 123.9 L 310.8 124.5 L 310.3 125.4 L 309.5 125.8 L 308.9 126.0 L 307.5 127