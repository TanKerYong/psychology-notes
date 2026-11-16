'use strict';
(() => {
  const topics = window.PSYCHOLOGY_TOPICS || [];
  const page = document.body.dataset.page;
  const storageKey = 'psych-notes-favorites-v1';
  function getSaved() { try { const value=JSON.parse(localStorage.getItem(storageKey)||'[]'); return Array.isArray(value)?value:[]; } catch { return []; } }
  function setSaved(items) { try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch {} }
  function el(tag, className, text) { const node=document.createElement(tag); if(className) node.className=className; if(text!==undefined) node.textContent=text; return node; }
  function topicCategoryClass(cat) { return cat==='社會心理'?'orange':cat==='學習與記憶'?'yellow':''; }
  function star(topic, onChange) {
    const btn=el('button','star-btn','☆'); btn.type='button'; btn.title='切換收藏'; btn.setAttribute('aria-label',`收藏${topic.title}`);
    const update=()=>{const yes=getSaved().includes(topic.id); btn.classList.toggle('is-saved',yes);btn.textContent=yes?'★':'☆';btn.setAttribute('aria-pressed',String(yes));};
    update(); btn.addEventListener('click', e=>{e.preventDefault(); e.stopPropagation(); const saved=getSaved();const next=saved.includes(topic.id)?saved.filter(id=>id!==topic.id):[...saved,topic.id];setSaved(next);update();if(onChange)onChange();});return btn;
  }
  function makeCard(topic,onChange) {
    const card=el('article','topic-card');
    const top=el('div','card-top'); top.append(el('span',`tag ${topicCategoryClass(topic.category)}`,topic.category),star(topic,onChange));
    const h=el('h3');const a=el('a','',topic.title); a.href=`./article.html?id=${encodeURIComponent(topic.id)}`;h.append(a);
    const p=el('p','',topic.summary);
    const bottom=el('div','card-bottom');const read=el('a','','讀這篇筆記 →');read.href=a.href;bottom.append(read);
    card.append(top,h,p,bottom);return card;
  }
  if(page==='home'){
    const grid=document.querySelector('#featured-topics'); topics.slice(0,3).forEach(t=>grid.append(makeCard(t)));
  }
  if(page==='concepts'){
    const grid=document.querySelector('#topic-list'), search=document.querySelector('#search'),counter=document.querySelector('#counter'),empty=document.querySelector('#empty-message'),favBtn=document.querySelector('#favorites-only');let category='全部',favoritesOnly=false;
    function render(){ const q=search.value.trim().toLocaleLowerCase();const saved=getSaved();const filtered=topics.filter(t=>(category==='全部'||t.category===category)&&(!favoritesOnly||saved.includes(t.id))&&[t.title,t.english,t.category,t.summary,t.detail].some(s=>s.toLocaleLowerCase().includes(q)));grid.replaceChildren();filtered.forEach(t=>grid.append(makeCard(t,render)));counter.textContent=`共找到 ${filtered.length} 篇筆記`;empty.hidden=filtered.length!==0; }
    search.addEventListener('input',render);
    document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;document.querySelectorAll('[data-category]').forEach(item=>{const active=item===btn;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});render();}));
    favBtn.addEventListener('click',()=>{favoritesOnly=!favoritesOnly;favBtn.classList.toggle('active',favoritesOnly);favBtn.setAttribute('aria-pressed',String(favoritesOnly));favBtn.textContent=favoritesOnly?'★ 只看收藏':'☆ 我的收藏';render();});render();
  }
  if(page==='article'){
    const id=new URLSearchParams(location.search).get('id');const t=topics.find(item=>item.id===id);const root=document.querySelector('#article-content');
    const back=el('a','back','← 回到概念筆記');back.href='./concepts.html';root.append(back);
    if(!t){root.append(el('h1','','找不到這篇筆記'),el('p','','這篇文章可能還沒新增，回到概念頁看看其他主題吧。'));return;}
    document.title=`${t.title}｜生活心理學小筆記`;
    root.append(el('span',`tag ${topicCategoryClass(t.category)}`,t.category),el('h1','',t.title),el('p','english',t.english),el('p','lead',t.summary));
    function box(title,text){const section=el('section','article-box');section.append(el('h2','',title),el('p','',text));return section;}
    root.append(box('這是什麼？',t.detail),box('生活裡的小例子',t.example));
    const note=el('aside','note-box');note.append(el('strong','','這篇筆記想記住的一句話'),el('span','',t.takeaway));root.append(note);
    const actions=el('div','article-actions');const quiz=el('a','btn btn-primary','去做小測驗 →');quiz.href='./quiz.html';actions.append(star(t),quiz);root.append(actions);
  }
  if(page==='quiz'){
    const root=document.querySelector('#quiz-container');let questions=[],index=0,score=0,answered=false;
    function reset(){questions=[...topics].sort(()=>Math.random()-.5); index=0;score=0;answered=false;render();}
    function render(){root.replaceChildren();if(index>=questions.length){const h=el('h2','',`完成啦！答對 ${score} / ${questions.length} 題`),p=el('p','',score===questions.length?'全部答對！你真的有認真看筆記。':'不熟的概念可以回筆記頁再看看，慢慢來就好。'),actions=el('div','actions'),again=el('button','btn btn-primary','再測一次'),notes=el('a','btn btn-light','回去翻筆記');again.type='button';again.addEventListener('click',reset);notes.href='./concepts.html';actions.append(again,notes);root.append(h,p,actions);return;}
    const t=questions[index],progress=el('div','quiz-progress');progress.append(el('span','',`第 ${index+1} / ${questions.length} 題`),el('span','',`目前答對 ${score} 題`));const bar=el('div','progress-bar');const fill=el('div','progress-fill');fill.style.width=`${index/questions.length*100}%`;bar.append(fill);const tag=el('span',`tag ${topicCategoryClass(t.category)}`,t.category),title=el('h2','',t.question),options=el('div','answer-list'),feedback=el('div','feedback');feedback.hidden=true;const footer=el('div','quiz-footer'),next=el('button','btn btn-primary',index===questions.length-1?'看成績 →':'下一題 →');next.type='button';next.hidden=true;
    t.options.forEach((option,idx)=>{const b=el('button','answer-option',`${String.fromCharCode(65+idx)}. ${option}`);b.type='button';b.addEventListener('click',()=>{if(answered)return;answered=true;const ok=idx===t.answer;if(ok)score++;options.querySelectorAll('button').forEach((item,n)=>{item.disabled=true;if(n===t.answer)item.classList.add('correct');else if(n===idx)item.classList.add('incorrect');});feedback.hidden=false;feedback.classList.toggle('bad',!ok);feedback.textContent=`${ok?'✓ 答對了！':'✎ 再記一下：'} ${t.explanation}`;next.hidden=false;});options.append(b);});
    next.addEventListener('click',()=>{index++;answered=false;render();});footer.append(next);root.append(progress,bar,tag,title,options,feedback,footer);
    }reset();
  }
})();
