const minBits = 1;
const maxBits = 16;

let nBits = 8;
let bitStates = [0, 0, 0, 0, 0, 0, 0, 0];
let hideColumns = false;
let hideLabels = false;
let hideBinary = false;
let hideDecimal = false;
let hideHex = false;
let hideAscii = false;

draw();
checkLimits();
bindBits();

$("#fillAll").click((e) => {
  for (let i = 0; i < nBits; i++) {
    bitStates[i] = 1;
  }
  draw();
});

$("#clearAll").click((e) => {
  for (let i = 0; i < nBits; i++) {
    bitStates[i] = 0;
  }
  draw();
});

$("#hideColumns").click((e) => {
  hideColumns = !hideColumns;
  toggleVisible(hideColumns, "#hideColumns", ".bitColumn", "columns");
});

$("#hideLabels").click((e) => {
  hideLabels = !hideLabels;
  toggleVisible(hideLabels, "#hideLabels", ".bitLabel", "1/0");
});

$("#hideBinary").click((e) => {
  hideBinary = !hideBinary;
  toggleVisible(hideBinary, "#hideBinary", "#binaryPanel", "binary");
});

$("#hideDecimal").click((e) => {
  hideDecimal = !hideDecimal;
  toggleVisible(hideDecimal, "#hideDecimal", "#decimalPanel", "decimal");
});

$("#hideHex").click((e) => {
  hideHex = !hideHex;
  toggleVisible(hideHex, "#hideHex", "#hexPanel", "hex");
});

$("#hideAscii").click((e) => {
  hideAscii = !hideAscii;
  toggleVisible(hideAscii, "#hideAscii", "#asciiPanel", "ASCII");
});

$("#showAll").click((e) => {
  hideColumns = false;
  hideLabels = false;
  hideBinary = false;
  hideDecimal = false;
  hideHex = false;
  hideAscii = false;
  toggleVisible(hideColumns, "#hideColumns", ".bitColumn", "columns");
  toggleVisible(hideLabels, "#hideLabels", ".bitLabel", "1/0");
  toggleVisible(hideBinary, "#hideBinary", "#binaryPanel", "binary");
  toggleVisible(hideDecimal, "#hideDecimal", "#decimalPanel", "decimal");
  toggleVisible(hideHex, "#hideHex", "#hexPanel", "hex");
  toggleVisible(hideAscii, "#hideAscii", "#asciiPanel", "ASCII");
});

$("#hideAll").click((e) => {
  hideColumns = true;
  hideLabels = true;
  hideBinary = true;
  hideDecimal = true;
  hideHex = true;
  hideAscii = true;
  toggleVisible(hideColumns, "#hideColumns", ".bitColumn", "columns");
  toggleVisible(hideLabels, "#hideLabels", ".bitLabel", "1/0");
  toggleVisible(hideBinary, "#hideBinary", "#binaryPanel", "binary");
  toggleVisible(hideDecimal, "#hideDecimal", "#decimalPanel", "decimal");
  toggleVisible(hideHex, "#hideHex", "#hexPanel", "hex");
  toggleVisible(hideAscii, "#hideAscii", "#asciiPanel", "ASCII");
});

$("#binaryResult")
  .change((e) => {
    changeBinary(e);
  })
  .keyup((e) => {
    changeBinary(e);
  })
  .mouseup((e) => {
    changeBinary(e);
  });

$("#decimalResult")
  .change((e) => {
    changeDecimal(e);
  })
  .keyup((e) => {
    changeDecimal(e);
  })
  .mouseup((e) => {
    changeDecimal(e);
  });

$("#hexResult")
  .change((e) => {
    changeHex(e);
  })
  .keyup((e) => {
    changeHex(e);
  })
  .mouseup((e) => {
    changeHex(e);
  });

$("#asciiResult")
  .change((e) => {
    changeAscii(e);
  })
  .keyup((e) => {
    changeAscii(e);
  })
  .mouseup((e) => {
    changeAscii(e);
  });

$("#nBits")
  .change((e) => {
    changeNBits(e);
  })
  .keyup((e) => {
    changeNBits(e);
  })
  .mouseup((e) => {
    changeNBits(e);
  });

$("#reset").click((e) => {
  $("#nBits").val(8);
  $("#nBits").change();
  $("#clearAll").click();

  hideColumns = true;
  hideLabels = true;
  hideBinary = true;
  hideDecimal = true;
  hideHex = true;
  hideAscii = true;
  $("#hideColumns").click();
  $("#hideLabels").click();
  $("#hideBinary").click();
  $("#hideDecimal").click();
  $("#hideHex").click();
  $("#hideAscii").click();

  draw();
  checkLimits();
});

$("#random").click((e) => {
  let dec = getRandom();
  let bits = decimalToBits(dec);
  bitStates = bits;
  draw();
});

$("#copyBinary").click((e) => {
  copyToClipboard($("#binaryResult").val());
  pingCopy("#copyBinary");
});

$("#copyDecimal").click((e) => {
  copyToClipboard($("#decimalResult").val());
  pingCopy("#copyDecimal");
});

$("#copyHex").click((e) => {
  copyToClipboard($("#decimalResult").val().toUpperCase());
  pingCopy("#copyHex");
});

$("#copyAscii").click((e) => {
  copyToClipboard($("#decimalResult").val());
  pingCopy("#copyAscii");
});

// https://www.30secondsofcode.org/js/s/copy-to-clipboard
const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

function changeBinary(e) {
  let bin = e.target.value;
  if (bin.length === 0) {
    return;
  }

  let dec = parseInt(bin, 2);
  let bits = decimalToBits(dec);
  bitStates = bits;
  draw();
}

function changeDecimal(e) {
  let dec = e.target.value;
  dec = parseInt(dec);

  let bits = decimalToBits(dec);
  bitStates = bits;
  draw();
}

function changeHex(e) {
  let hex = e.target.value;
  if (hex.length === 0) {
    return;
  }

  let dec = parseInt(hex, 16);
  let bits = decimalToBits(dec);
  bitStates = bits;
  draw();
}

function changeAscii(e) {
  let ascii = e.target.value;
  if (ascii.length === 0) {
    return;
  }
  let bits = asciiToBits(ascii);
  bitStates = bits;
  draw();
}

function changeNBits(e) {
  let newNBits = parseInt(e.target.value);
  while (newNBits < nBits) {
    removeBit();
  }
  while (newNBits > nBits) {
    addBit();
  }
}

function removeBit() {
  if (nBits === minBits) {
    return;
  }

  nBits -= 1;
  bitStates.pop();

  $("#bitsPanel").children().last().remove();
  draw();
  bindBits();
  checkLimits();
}

function addBit() {
  if (nBits === maxBits) {
    return;
  }

  let bit = "";
  let col = 2 ** nBits;
  let hideColumn = hideColumns ? "hide" : "";
  let hideLabel = hideLabels ? "hide" : "";

  nBits += 1;
  bitStates.push(0);

  bit += `<div class='bitPanel flexCol'>`;
  bit += `<button id='bit-${nBits - 1}' class='bit bit-off'><span class="bitLabel ${hideLabel}">0</span></button>`;
  bit += `<div class='bitColumn ${hideColumn}'>${col}</div>`;
  bit += `</div>`;

  $("#bitsPanel").append(bit);

  draw();
  bindBits();
  checkLimits();
}

function draw() {
  let el;

  for (let i = 0; i < nBits; i++) {
    el = $(`#bit-${i}`);
    el.find('.bitLabel').html(bitStates[i]);
    if (bitStates[i] === 0) {
      el.removeClass("bit-on");
      el.addClass("bit-off");
    } else {
      el.removeClass("bit-off");
      el.addClass("bit-on");
    }
  }

  let binary = getBinary();
  $("#binaryResult").val(binary);

  let decimal = getDecimal();
  $("#decimalResult").val(decimal);

  let hex = getHex(decimal);
  $("#hexResult").val(hex);

  let ascii = getAscii(decimal);
  $("#asciiResult").val(ascii);
}

function getRandom() {
  let max = 2 ** nBits;
  return Math.floor(Math.random() * max);
}

function toggleVisible(state, buttonSelector, concernSelector, word) {
  if (state) {
    $(concernSelector).addClass("hide");
    $(`${buttonSelector} > i`).removeClass("fa-eye-slash");
    $(`${buttonSelector} > i`).addClass("fa-eye");
    $(`${buttonSelector} > .controlText`).html(`Show ${word}`);
  } else {
    $(concernSelector).removeClass("hide");
    $(`${buttonSelector} > i`).removeClass("fa-eye");
    $(`${buttonSelector} > i`).addClass("fa-eye-slash");
    $(`${buttonSelector} > .controlText`).html(`Hide ${word}`);
  }
}

function toggleEnabled(buttonSelector, state) {
  $(buttonSelector).prop("disabled", !state);

  if (state) {
    $(buttonSelector).removeClass("disabled");
  } else {
    $(buttonSelector).addClass("disabled");
  }
}

function getBinary() {
  bitStates.reverse();
  let binary = bitStates.join("");
  bitStates.reverse();
  return binary;
}

function getDecimal() {
  let decimal = 0;
  for (let i = 0; i < nBits; i++) {
    decimal += bitStates[i] * 2 ** i;
  }
  return decimal;
}

function getAscii(decimal) {
  if (typeof decimal === "undefined") {
    let decimal = getDecimal();
  }

  return String.fromCharCode(decimal);
}

function getHex(decimal) {
  if (typeof decimal === "undefined") {
    let decimal = getDecimal();
  }

  return decimal.toString(16);
}

function decimalToBits(dec) {
  let bin = [];

  if (dec < 0) {
    for (let i = 0; i < nBits; i++) {
      bin.push(0);
    }
    return bin;
  }

  let r;
  while (dec > 1) {
    r = dec % 2;
    dec = Math.floor(dec / 2);
    bin.push(r);
  }
  bin.push(dec);
  while (bin.length < nBits) {
    bin.push(0);
  }
  return bin;
}

function asciiToBits(ascii) {
  let dec = 0;

  if (ascii.length === 1) {
    dec = ascii.charCodeAt(0);
  }

  return decimalToBits(dec);
}

function checkLimits() {
  $("#decimalResult").attr({
    max: 2 ** nBits - 1
  });

  $("#hexResult").attr({
    maxlength: 2 ** (nBits / 4)
  });

  $("#binaryResult").attr({
    maxlength: nBits
  });
}

function bindBits() {  
  $(".bit").unbind();
  $(".bit").click((e) => {
    console.log(e.target.id);
    let id = parseInt(e.target.id.split("-")[1]);
    bitStates[id] = bitStates[id] === 0 ? 1 : 0;
    draw();
  });
  
}

function pingCopy(selector) {
  $('.copyButton').removeClass('copied');
  $('.copyButton').removeClass('fade');
  
  $(selector).addClass("copied");
  setTimeout(() => {
    $(selector).removeClass("copied");
    $(selector).addClass("fade");
  }, 1000);
  setTimeout(() => {
    $(selector).removeClass("fade");
  }, 2000);
}