var domain;

function get_hash(){
  domain=window.location.hostname;
  //console.log(domain+"");
  var cipher=AES(domain.toString());
  //console.log(cipher+"");
  var binary=hex_to_bin(cipher+"");
  //console.log(binary+"");
  ModifyBrowser(binary+"");
  ModifyCanvas(binary+"");
  ModifyFont(binary+"");
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
  let value = "";
  for(let i = 0;i < str.length; i++){
    for(let j = 0;j < hex_array.length; j++){
      if(str.charAt(i).toLowerCase() == hex_array[j].key){
        value = value.concat(hex_array[j].val);
        break;
      }
    }
  }
  return value;
}

function ModifyBrowser(str){
  var actualCode = `
  Object.defineProperty(navigator, 'userAgent', {
    value: ${JSON.stringify(str)},
    writable: false
  });
  `;
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
}

function ModifyCanvas(str){
  var actualCode = `
  window.HTMLCanvasElement.prototype.myToDataURL = window.HTMLCanvasElement.prototype.toDataURL;
  window.HTMLCanvasElement.prototype.toDataURL = function(){
    var imageData = this.getContext('2d').getImageData(0,0,this.width,this.height);
    var len = imageData.data.length;
    var change = ${JSON.stringify(str)};
    for(let i = 0; i < len; i++){
      imageData.data[i] = imageData.data[i]^change[i%change.length];
    }
    this.getContext('2d').putImageData(imageData,0,0);
    console.log("The canvas has been changed.")
    return this.myToDataURL(); 
  };
  `;
  var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

function ModifyFont(str){
  var actualCode = `
  Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
    get: function(){
      var rec = this.getBoundingClientRect();
      var width = rec.width;
      if (this.style.fontFamily !== undefined){
        var font = this.style.fontFamily.split(",");
        if(font.length > 1){
          var sumBit = 0;
          for(let i = 0; i < font[0].length; i++){
            sumBit += font[0][i].charCodeAt();
          }
          var change = ${JSON.stringify(str)};
          sumBit %= change.length;
          var bit = change.charAt(sumBit);
          if(bit == '1'){
            console.log('The offsetWidth has been modified.');
            return width + 1;
          }
          else{
            return width;
          }
        }
        else{
          return width;
        }
      }
      else{
        return width;
      }
    }
  });
  `;
  var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

function bin2hex(str) {
  var ret = '';
  var r = /[0-9a-zA-Z_.~!*()]/;
  for (var i = 0, l = str.length; i < l; i++) {
    if (r.test(str.charAt(i))) {
      ret += str.charCodeAt(i).toString(16);
    } else {
      ret += encodeURIComponent(str.charAt(i)).replace(/%/g, '');
    }
  }
  return ret;
}

get_hash();