import{Node}from"./node.js";class FPFlow{canvasStartX=0;canvasStartY=0;canvasTranslateX=0;canvasTranslateY=0;canvas=null;canvasEl=null;lastScale=1;lastZoomDirection=null;zoomTollerance={min:1,max:5};zoomScale=.05;isDragging=!1;maxTranslateXAllowed=0;maxTranslateYAllowed=0;ctx=null;nodes=[];isNodeDragging=!1;strokeColor="white";strokeWidth=1;element=null;constructor(){this.element=document.querySelector(".fp-scroll-container"),this.canvas=document.createElement("div"),this.canvas.id="canvas",this.canvas.classList.add("flow-container"),this.element.appendChild(this.canvas),this.canvasEl=document.createElement("canvas"),this.canvasEl.id="lineCanvas",this.canvasEl.classList.add("line-canvas"),this.canvas.appendChild(this.canvasEl),this.canvasEl.width=canvas.offsetWidth,this.canvasEl.height=canvas.offsetHeight,this.ctx=this.canvasEl.getContext("2d"),this.init()}drawLine(t,s,a,e){this.ctx.beginPath(),this.ctx.moveTo(t,s),this.ctx.lineTo(a,e),this.ctx.strokeStyle=this.strokeColor,this.ctx.lineWidth=this.strokeWidth/this.lastScale,this.ctx.stroke()}refreshCanvas(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);const i=[];this.nodes.forEach(n=>{n.connectedNodes.forEach(s=>{var t=n,a=this.nodes.find(t=>t.id===s),e=t.id>a.id?a.id+"-"+t.id:t.id+"-"+a.id;i.includes(e)||(this.drawLine(t.centerX,t.centerY,a.centerX,a.centerY),i.push(e))})})}addNode(t){var s=this.nodes.length,s=new Node(t,s);return this.canvas.appendChild(t),s.containerElement=this.element,t.style.transform=`scale(${1/this.lastScale})`,this.nodes.push(s),s.onNodeMoveStart(t=>{this.isNodeDragging=!0}),s.onNodeMove((t,s)=>{this.refreshCanvas()}),s.onNodeMoveEnd(t=>{this.isNodeDragging=!1}),s}removeNode(s){this.nodes.find(t=>t.id===s).element.remove(),this.nodes=this.nodes.filter(t=>t.id!==s),this.nodes.forEach(t=>{t.connectedNodes=t.connectedNodes.filter(t=>t!==s)}),this.refreshCanvas()}addConnection(s,a){s=parseInt(s),a=parseInt(a);var t=this.nodes.find(t=>t.id===s),e=this.nodes.find(t=>t.id===a);t.connectedNodes.includes(a)||e.connectedNodes.includes(s)||(t.connectedNodes.push(a),e.connectedNodes.push(s)),this.refreshCanvas()}removeConnection(s,a){s=parseInt(s),a=parseInt(a);var t=this.nodes.find(t=>t.id===s),e=this.nodes.find(t=>t.id===a);t.connectedNodes=t.connectedNodes.filter(t=>t!==a),e.connectedNodes=e.connectedNodes.filter(t=>t!==s),this.refreshCanvas()}init(){this.canvas.addEventListener("mousedown",t=>{this.isNodeDragging||(this.canvas.style.cursor="grabbing",this.canvasStartX=t.clientX,this.canvasStartY=t.clientY,this.isDragging=!0)}),this.canvas.addEventListener("mousemove",t=>{var s,a,e;t.preventDefault(),this.isDragging&&!this.isNodeDragging&&(s=t.clientX,t=t.clientY,a=s-this.canvasStartX,e=t-this.canvasStartY,this.canvasTranslateX+=a,this.canvasTranslateY+=e,this.canvasStartX=s,this.canvasStartY=t,this.canvasTranslateX>this.maxTranslateXAllowed&&(this.canvasTranslateX=this.maxTranslateXAllowed),this.canvasTranslateX<-this.maxTranslateXAllowed&&(this.canvasTranslateX=-this.maxTranslateXAllowed),this.canvasTranslateY>this.maxTranslateYAllowed&&(this.canvasTranslateY=this.maxTranslateYAllowed),this.canvasTranslateY<-this.maxTranslateYAllowed&&(this.canvasTranslateY=-this.maxTranslateYAllowed),this.canvas.style.transform=`translate(${this.canvasTranslateX}px, ${this.canvasTranslateY}px) scale(${this.lastScale})`)}),this.canvas.addEventListener("mouseup",t=>{this.canvas.style.cursor="initial",this.isDragging=!1}),this.canvas.addEventListener("wheel",t=>{t.preventDefault(),t.ctrlKey&&(t=0<t.wheelDelta/120?"zoomout":"zoomin","zoomout"===this.lastZoomDirection&&"zoomout"==t&&this.lastScale>=this.zoomTollerance.max||"zoomin"===this.lastZoomDirection&&"zoomin"==t&&this.lastScale<=this.zoomTollerance.min||(this.lastScale+="zoomout"==t?this.zoomScale:-1*this.zoomScale,this.lastZoomDirection=t,this.lastScale<1&&(this.lastScale=1),this.maxTranslateXAllowed=(this.canvas.offsetWidth*this.lastScale-this.canvas.offsetWidth)/2,this.maxTranslateYAllowed=(this.canvas.offsetHeight*this.lastScale-this.canvas.offsetHeight)/2,this.nodes.forEach(t=>{t.element.style.transform=`scale(${1/this.lastScale})`,t.canvasScale=this.lastScale,t.setCenter()}),this.canvas.style.transform=`scale(${this.lastScale})`,this.refreshCanvas()))})}getRenditionInfo(){const s={};["nodes","canvasTranslateX","canvasTranslateY","lastScale","canvasStartX","canvasStartY","strokeColor","strokeWidth"].forEach(t=>{s[t]=this[t]});const t=["startX","startY","data","id","connectedNodes"];return s.nodes=s.nodes.map(s=>{const a={};return t.forEach(t=>{a[t]=s[t]}),a}),s}renderSavedFlow(t){for(const s in t)"nodes"!==s&&(this[s]=t[s]);this.canvas.style.transform=`translate(${this.canvasTranslateX}px, ${this.canvasTranslateY}px) scale(${this.lastScale})`,t.nodes.forEach(t=>{var s=t.element||document.createElement("div"),a=(s.style.left=t.startX*this.lastScale+"px",s.style.top=t.startY*this.lastScale+"px",t.element||(s.innerText="Node "+t.id),this.addNode(s));for(const e in t)a[e]=t[e]}),setTimeout(()=>{this.refreshCanvas()})}}window.FPFlow=FPFlow;export{FPFlow};