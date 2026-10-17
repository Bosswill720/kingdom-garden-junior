/* Approved Kingdom concept artwork, stored locally in six transport-safe parts.
 * Reassembled once per visit; the optional art loader never blocks gameplay. */
(function(){
'use strict';
const base=new URL('.',document.currentScript.src);
const expected='cc78f5f06617b25ab9f2ea5bbb68ef2f74e1da8a09fd1d1d069c648b50061c2e';
window.KGJKingdomArt={ready:false};
Promise.all(Array.from({length:6},(_,i)=>fetch(new URL('assets/kingdom-art-'+(i+1)+'.bin',base)).then(r=>{if(!r.ok)throw Error('Artwork asset unavailable');return r.arrayBuffer();}))).then(async parts=>{
 const blob=new Blob(parts,{type:'image/webp'});
 if(blob.size!==34514)throw Error('Artwork size mismatch');
 if(globalThis.crypto?.subtle){const hash=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());const hex=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');if(hex!==expected)throw Error('Artwork integrity check failed');}
 const url=URL.createObjectURL(blob),image=new Image();
 image.onload=()=>{document.documentElement.style.setProperty('--kingdom-art','url("'+url+'")');window.KGJKingdomArt={ready:true,width:image.naturalWidth,height:image.naturalHeight};};
 image.onerror=()=>{URL.revokeObjectURL(url);console.warn('Kingdom artwork could not decode. Gameplay remains available.');};
 image.src=url;
}).catch(e=>console.warn('Optional Kingdom artwork:',e.message));
})();
