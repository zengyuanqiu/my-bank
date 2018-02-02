
//检测元素是对象还是字符串
function _el(el){
	var _dom;
	if(typeof(el) === 'object'){
		_dom = el;
	}else if(typeof(el) === 'string'){
		if(document.getElementById(el)){
			_dom = document.getElementById(el)
		}else if(document.querySelector(el)){
			_dom = document.querySelector(el)
		}else{
			throw new Error('请正确设置拖拽容器！');
			return
		}
	}
	return _dom;
}

//拖拽的构造函数
function Drag(el) {
	var self = this;
	this.oDiv = _el(el);
	this.posX = 0;
	this.posY = 0;
	this.oDiv.onmousedown = function(){
		self.fnDown()
	}
}

Drag.prototype.fnDown = function(e){
	var e = e || event;
	var self = this
	this.posX = e.pageX - this.oDiv.offsetLeft;
	this.posY = e.pageY - this.oDiv.offsetTop;
	if(e.which === 1) {
		document.onmousemove = function(){
			self.fnMove()
		}
	}
}
Drag.prototype.fnMove = function(e){
	var e = e || event;
	var self = this
	this.oDiv.style.left = e.pageX - this.posX + 'px';
	this.oDiv.style.top = e.pageY - this.posY + 'px';
	document.onmouseup = function(){
		self.fnUp()
	}
}
Drag.prototype.fnUp = function(){
	document.onmousemove = null;
	document.onmouseup = null;
}

//四角拉伸的构造函数
function Stretch(el){
	var _this = this;
	this.el = _el(el);
	new Drag(el)
	this.ds = document.createElement('div');
	this.el.appendChild(this.ds)
	for(var i = 0; i < 4; i++) {
		this.span = document.createElement('span');
		this.span.className = '_angle';
		this.el.appendChild(this.span)
	}

	this.s = this.el.querySelectorAll('._angle');
	this.ds.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;border:2px solid #ccc;display:none;'
	this.s[0].style.cssText = 'position:absolute;width:5px;height:5px;cursor:nwse-resize;';
	this.s[1].style.cssText = 'position:absolute;width:5px;height:5px;right:0;cursor:nesw-resize;';
	this.s[2].style.cssText = 'position:absolute;\
	width:5px;height:5px;bottom:0;\
	cursor:nesw-resize;';
	this.s[3].style.cssText = 'position:absolute;\
	width:5px;height:5px;right:0;bottom:0;\
	cursor:nwse-resize;';
	
	for(var j=0;j<4;j++){
		this.s[j].style.backgroundColor = 'transparent';
		this.s[j].idx = j;
		this.s[j].onmousedown = function(){
			_this.sDown(this)

		}
	}
}

Stretch.prototype.sDown = function(_self,e){
	var _this = this;
	var e = e || event;
	if(e.which === 1){
		this.x = e.pageX;
		this.y = e.pageY;
		e.stopPropagation();
		this.ds.style.display = 'block';
		this.ds.style.top = 0;
		this.ds.style.left = 0;
		this.ds.style.right = 0;
		this.ds.style.bottom = 0;
		document.onmousemove = function() {
			_this.sMove(_self)
		}
		document.onmouseup = function(e){
			_this.sUp(_self)
		}
	}
}
Stretch.prototype.sMove = function(_self,e) {
	var e = e || event;
	if(_self.idx === 0){
		this.ds.style.top = e.pageY - this.y + 'px';
		this.ds.style.left = e.pageX - this.x + 'px';
	}
	if(_self.idx === 1){
		this.ds.style.top = e.pageY - this.y + 'px';
		this.ds.style.right = this.x - e.pageX + 'px';
	}
	if(_self.idx === 2){
		this.ds.style.left = e.pageX - this.x + 'px';
		this.ds.style.bottom = this.y -  e.pageY + 'px';
	}
	if(_self.idx === 3) {
		this.ds.style.right = this.x - e.pageX + 'px';
		this.ds.style.bottom = this.y -  e.pageY + 'px';
	}

}

Stretch.prototype .sUp = function(_self,e) {
	var e = e || event;
	if(_self.idx === 0){
		this.el.style.top = e.pageY + 'px';
		this.el.style.left = e.pageX + 'px';
	}
	if(_self.idx === 1){
		this.el.style.top = e.pageY + 'px';
	}
	if(_self.idx === 2){
		this.el.style.left = e.pageX + 'px';
	}
	this.el.style.width = this.ds.offsetWidth + 'px';
	this.el.style.height = this.ds.offsetHeight + 'px';
	this.ds.style.display = 'none';
	document.onmousemove = null;
	document.onmouseup = null;
}

//继承父类，加上四条边也可拉伸
function InheritStretch(el){
	var _this = this;

	//这里传入的el是为了改变父类的el，就会拥有自己的元素对象
	Stretch.call(this,el);
	for(var k=0;k<4;k++){
		this.side = document.createElement('p');
		this.side.className = 'side';
		this.el.appendChild(this.side)
		this.side.style.position = 'absolute';
	}
	this._side = this.el.querySelectorAll('.side');
	this._side[0].style.cssText += 'height:5px;top:0;left:5px;right:5px;cursor:n-resize;';
	this._side[1].style.cssText += 'width:5px;top:5px;bottom:5px;right:0px;cursor:w-resize;';
	this._side[2].style.cssText += 'height:5px;left:5px;bottom:0px;right:5px;cursor:n-resize;';
	this._side[3].style.cssText += 'width:5px;top:5px;bottom:5px;left:0px;cursor:w-resize;';

	for(var x=0;x<4;x++){
		this._side[x].index = x;
		this._side[x].onmousedown = function() {
			_this.pDown(this)
		}
	}
}

InheritStretch.prototype.pDown = function(sideThis,e){
	var e = e || event;
	var _this = this;
	if(e.which === 1){
		e.stopPropagation();
		e.preventDefault();
		this.x = e.pageX;
		this.y = e.pageY;
		this.ds.style.display = 'block';
		this.ds.style.top = 0;
		this.ds.style.left = 0;
		this.ds.style.right = 0;
		this.ds.style.bottom = 0;
		document.onmousemove = function() {
			_this.pMove(sideThis)
		}
		document.onmouseup = function(e){
			_this.pUp(sideThis)
		}
		// if(sideThis.index === 0){
		// 	console.log(sideThis)
		// }
	}
}

InheritStretch.prototype.pMove = function(sideThis,e){
	var e = e || event;
	var _this = this;
	if(sideThis.index === 0){
		this.ds.style.top = e.pageY - this.y + 'px';
	}
	if(sideThis.index === 1){
		this.ds.style.right = this.x - e.pageX + 'px';
	}
	if(sideThis.index === 2){
		this.ds.style.bottom = this.y - e.pageY + 'px';
	}
	if(sideThis.index === 3){
		this.ds.style.left = e.pageX - this.x + 'px';
	}
}

InheritStretch.prototype.pUp = function(sideThis,e){
	var e = e || event;
	var _this = this;
	if(sideThis.index === 0){
		this.el.style.top = e.pageY + 'px';
	}
	if(sideThis.index === 3){
		this.el.style.left = e.pageX + 'px';
	}
	this.el.style.width = this.ds.offsetWidth + 'px';
	this.el.style.height = this.ds.offsetHeight + 'px';
	this.ds.style.display = 'none';
	document.onmousemove = null;
	document.onmouseup = null;
}

//遍历拿到父类原型上的方法
for(var i in Stretch.prototype){
	InheritStretch.prototype[i] = Stretch.prototype[i];
}