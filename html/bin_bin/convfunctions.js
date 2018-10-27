/*
	Character conversion functions
	© 2009 ajaxBlender.com
	For any questions please visit www.ajaxblender.com 
	or email us at support@ajaxblender.com
*/

var Convert = {
	chars: " !\"#$%&'()*+'-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя",
	hex: '0123456789ABCDEF', bin: ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111', '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111'],

	decToHex: function(d){
        return (this.hex.charAt((d - d % 16)/16) + this.hex.charAt(d % 16));
    },
    toBin: function(ch){
    	/*var d = this.toDec(ch);
    	var l = this.hex.charAt(d % 16);
    	var h = this.hex.charAt((d - d % 16)/16);
        var hhex = "ABCDEF";
        var lown = l < 10 ? l : (10 + hhex.indexOf(l));
        var highn = h < 10 ? h : (10 + hhex.indexOf(h));

        return this.bin[highn] + ' ' + this.bin[lown];
	*/
	
	var d = this.toDec(ch).toString(2);
	var flag = 1;
	var incr= 0; 
	var new_str= '';
	while(flag) {
		if (d.length <=11)
			d = '0'+d;
		else
			flag=0;
	}
	for(incr;incr<=d.length;incr++) {
		new_str=new_str+d.charAt(incr);
		flag = flag+1;
		if(flag>=4) {
			new_str=new_str+' ';
			flag = 0;
		}
	}
	return new_str;
    },
	toHex: function(ch){
		return this.decToHex(this.toDec(ch));
	},
	toDec: function(ch){
		var p = this.chars.indexOf(ch);
		return (p <= -1) ? 0 : (p>=95) ? (p+945) :(p + 32); 
	}
};
