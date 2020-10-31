var domain;
var hash_div = document.getElementById('hash_div');

function get_hash(el){
  	chrome.tabs.query({active: true, lastFocusedWindow: true},function(tabs){
    domain = tabs[0].url;
    var result =getExecStrs(domain);
    var cipher=AES(result.toString());
    el.innerHTML=cipher+"";
    var binary=hex_to_bin(cipher+"");
    el.innerHTML=binary+"";
});
}

function getExecStrs (str) {
	var reg =/(?<=:\/\/)[a-zA-Z\.0-9]+(?=\/)/;
    var result = reg.exec(str);
    return result;
}

function AES(message){
	var key = CryptoJS.enc.Utf8.parse("8NONwyJtHesysWpM");
	var encryptedData = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  	var encryptedBase64Str = encryptedData.toString();
  	var encryptedStr = encryptedData.ciphertext.toString();
 	return encryptedStr;
}

function hex_to_bin(str) {
	let hex_array = [{key:0,val:"0000"},{key:1,val:"0001"},{key:2,val:"0010"},{key:3,val:"0011"},{key:4,val:"0100"},{key:5,val:"0101"},{key:6,val:"0110"},{key:7,val:"0111"},
             		{key:8,val:"1000"},{key:9,val:"1001"},{key:'a',val:"1010"},{key:'b',val:"1011"},{key:'c',val:"1100"},{key:'d',val:"1101"},{key:'e',val:"1110"},{key:'f',val:"1111"}];
    let value="";
    for(let i=0;i<str.length;i++){
    	for(let j=0;j<hex_array.length;j++){
        	if(str.charAt(i).toLowerCase()== hex_array[j].key){
            	value = value.concat(hex_array[j].val);
                break;
             }
         }
     }
     return value;
}

 get_hash(hash_div);