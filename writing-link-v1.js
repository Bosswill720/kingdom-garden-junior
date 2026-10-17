/* Optional navigation only: no changes to reader, artwork, wallet or saved kingdom. */
(function(){'use strict';
 if(document.querySelector('[data-writing-launch]'))return;
 const url='./writing.html?release=writing-1';
 const style=document.createElement('style');style.textContent='.writing-nav-link{display:flex;align-items:center;gap:12px;min-height:48px;padding:12px 16px;margin:8px 0 14px;border:1px solid #cbdcc8;border-radius:14px;background:#eaf2e0;color:#37674e;font-weight:700;font-size:14px}.writing-nav-link svg,.writing-top-link svg{width:21px;height:21px;flex-shrink:0}.writing-top-link{display:inline-flex;gap:6px;align-items:center;justify-content:center;min-width:46px;min-height:46px;padding:8px 12px;border:1px solid #cbdcc8;border-radius:23px;background:#eaf2e0;color:#37674e;font-size:12px;font-weight:750}.writing-top-link:focus-visible,.writing-nav-link:focus-visible{outline:3px solid #bc793c;outline-offset:3px}@media(max-width:550px){.top-actions{gap:6px}.writing-top-link{min-width:44px;min-height:44px;padding:8px}.writing-top-link span{display:none}.topbar .top-note{display:none}}@media(max-width:390px){.topbar .avatar{display:none}.topbar{gap:7px;padding-left:13px;padding-right:13px}}';document.head.appendChild(style);
 const pen='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m4 16 11-11 4 4-11 11-5 1 1-5ZM13 7l4 4M16 4l1-1a2 2 0 0 1 3 3l-1 1"/></svg>';
 function link(cls,label){const a=document.createElement('a');a.className=cls;a.href=url;a.setAttribute('data-writing-launch','1');a.setAttribute('aria-label','Open guided writing practice');a.innerHTML=pen+'<span>'+label+'</span>';return a;}
 const nav=document.getElementById('mainNav');if(nav)nav.insertAdjacentElement('afterend',link('writing-nav-link','Writing practice'));
 const actions=document.querySelector('.top-actions');if(actions)actions.prepend(link('writing-top-link','Write'));
})();
