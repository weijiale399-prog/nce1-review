
const ROOT='https://raw.githubusercontent.com/weijiale399-prog/nce1-review/main/';
const $=id=>document.getElementById(id);
let lessonData=null;
async function getJson(path){const response=await fetch(ROOT+path,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});if(!response.ok)throw new Error('读取 '+path+' 失败：HTTP '+response.status);return response.json()}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
function speak(text){if(!('speechSynthesis'in window)){alert('此浏览器不支持语音朗读');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=Number($('rate').value);speechSynthesis.speak(u)}
function stop(){if('speechSynthesis'in window)speechSynthesis.cancel()}
function buttonSpeak(text){const b=el('button','sound','▶');b.type='button';b.addEventListener('click',()=>speak(text));return b}
function render(data){
 lessonData=data;$('lessonTitle').textContent=data.title;$('count').textContent=data.dialogue.length+' 句对话';$('base').textContent=data.fourTypes.base;
 const d=$('dialogue');d.replaceChildren();data.dialogue.forEach((item,i)=>{const row=el('div','line');row.append(el('span','num',String(i+1).padStart(2,'0')));const body=el('div');body.append(el('div','en',item.en),el('div','zh',item.zh));row.append(body,buttonSpeak(item.en));d.append(row)});
 const t=$('types');t.replaceChildren();[['肯定句',data.fourTypes.affirmative],['否定句',data.fourTypes.negative],['一般疑问句',data.fourTypes.generalQuestion],['特殊疑问句',data.fourTypes.specialQuestion]].forEach(([name,item])=>{const card=el('div','type');card.append(el('label','',name),el('strong','',item.en),el('p','',item.zh),buttonSpeak(item.en));t.append(card)});
 const g=$('grammar');g.replaceChildren();data.grammar.forEach(x=>{const n=el('div','grammar-item');n.append(el('b','',x.title),el('p','',x.description));g.append(n)});
 const w=$('words');w.replaceChildren();data.vocabulary.forEach(x=>{const n=el('div','word');const line=el('div');line.append(el('b','',x.word),el('span','phon',x.phonetic));n.append(line,el('div','meaning',x.meaning));w.append(n)});
 const p=$('phrases');p.replaceChildren();data.phrases.forEach(x=>{const n=el('div','phrase');n.append(el('b','',x.phrase),el('div','meaning',x.meaning));p.append(n)});
 $('playAll').onclick=()=>speak(data.dialogue.map(x=>x.en).join(' '));
}
async function init(){
 try{const [lesson,progress]=await Promise.all([getJson('data/lesson-01.json'),getJson('data/progress.json')]);render(lesson);$('progressTitle').textContent='Lesson '+progress.lesson+' · '+progress.lessonTitle;$('progressTime').textContent='最后学习：'+(progress.lastStudiedAt||'尚未写入时间')+'；位置：'+progress.lastPosition;$('cloud').textContent='✓ GitHub 云端数据已连接';}
 catch(err){$('cloud').textContent='数据读取失败';$('dialogue').textContent=err.message;console.error(err)}
}
$('stop').addEventListener('click',stop);$('rate').addEventListener('input',()=> $('rateVal').textContent=Number($('rate').value).toFixed(2)+'×');
document.addEventListener('mouseup',()=>{const s=window.getSelection()?.toString().trim();if(s&&s.length<250&&/[A-Za-z]/.test(s))speak(s)});
init();
