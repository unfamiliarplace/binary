const showAll = () => {
    app.optShow01.value(true);
    app.optShowColumns.value(true);
    app.optShowBinary.value(true);
    app.optShowDecimal.value(true);
    app.optShowHex.value(true);
    app.optShowAscii.value(true);
    toggleShowHideButtons();
}

const hideAll = () => {
    app.optShow01.value(false);
    app.optShowColumns.value(false);
    app.optShowBinary.value(false);
    app.optShowDecimal.value(false);
    app.optShowHex.value(false);
    app.optShowAscii.value(false);
    toggleShowHideButtons();
}

const reset = () => {
    app.reset();
    setDynamicOptionDefaults();

    $("#optNBits").val(8);
    handleNBitsUpdate();
}

const setRandomBits = () => {
    let dec = Tools.random(2 ** app.nBits);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const fillBits = () => {
    for (let i = 0; i < app.nBits; i++) {
        app.bitStates[i] = 1;
    }
    updateBits();
}

const clearBits = () => {
    for (let i = 0; i < app.nBits; i++) {
        app.bitStates[i] = 0;
    }
    updateBits();
}

const handleBinaryUpdate = (e) => {
    let bin = e.target.value.trim();
    if (bin.length === 0) {
        return;
    }

    let dec = parseInt(bin, 2);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleDecimalUpdate = (e) => {
    let dec = e.target.value.trim();
    if (dec.length === 0) {
        return;
    }

    dec = parseInt(dec);

    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleHexUpdate = (e) => {
    let hex = e.target.value.trim();
    if (hex.length === 0) {
        return;
    }

    let dec = parseInt(hex, 16);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleAsciiUpdate = (e) => {
    let ascii = e.target.value;
    if (ascii.length === 0) {
        return;
    }

    app.bitStates = asciiToBits(ascii);
    updateBits();
}

const handleNBitsUpdate = () => {
    let newNBits = parseInt($('#optNBits').val());

    while (newNBits < app.nBits) {
        app.nBits -= 1;
        app.bitStates.pop();
    }
    while (newNBits > app.nBits) {
        app.nBits += 1;
        app.bitStates.push(0);
    }

    updateBits();
    updateLimits();
}

const drawBit = (i) => {
    let column = 2 ** i;
    let clState, contentState;

    if (app.bitStates[i]) {
        clState = 'bit-on';
        contentState = '1';
    } else {
        clState = 'bit-off';
        contentState = '0';
    }

    let bitLabel = `<span class="bitLabel hide">${contentState}</span>`;
    let button = `<button id="bit-${i}" data-bit-index="${i}" class="bit ${clState}">${bitLabel}</button>`;
    let columnLabel = `<label class="bitColumn hide" for="bit-${i}">${column}</label>`;
    return `<div class="bitPanel flexCol">${button}${columnLabel}</div>`;
}

const drawBits = () => {
    let parent = $('#bitsPanel');
    parent.empty();

    for (let i = 0; i < app.bitStates.length; i++) {
        parent.append(drawBit(i));
    }

    // Bind
    $(".bit").click(handleBitChange);

    // Toggle labels and columns
    toggleShowing(app.optShow01, '.bitLabel');
    toggleShowing(app.optShowColumns, '.bitColumn');
}

const updateResults = () => {
    $("#binaryResult").val(formatBinary());
    $("#decimalResult").val(formatDecimal());
    $("#hexResult").val(formatHex());
    $("#asciiResult").val(formatAscii());
}

const formatBinary = () => {
    let chars = app.bitStates.slice().reverse().join("");

    // TODO add option to pad (i.e. not trim!) str to # of bits
    chars = Tools.trimChars(chars, '0', true, false);

    // at least 1 zero
    if (chars.length === 0) {
        chars = '0';
    }

    return chars;
}

const formatDecimal = () => {
    let decimal = 0;
    for (let i = 0; i < app.nBits; i++) {
        decimal += app.bitStates[i] * 2 ** i;
    }
    return decimal;
}

const formatAscii = () => {
    return String.fromCharCode(formatDecimal());
}

const formatHex = () => {
    return formatDecimal().toString(16);
}

const decimalToBits = dec => {
    let bin = [];

    if (dec < 0) {
        for (let i = 0; i < app.nBits; i++) {
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
    while (bin.length < app.nBits) {
        bin.push(0);
    }
    return bin;
}

const asciiToBits = ascii => {
    let dec = 0;

    if (ascii.length === 1) {
        dec = ascii.charCodeAt(0);
    }

    return decimalToBits(dec);
}

const updateLimits = () => {
    $("#decimalResult").attr({
        max: 2 ** app.nBits - 1
    });

    $("#hexResult").attr({
        maxlength: 2 ** (app.nBits / 4)
    });

    $("#binaryResult").attr({
        maxlength: app.nBits
    });
}

const toggleShowing = (opt, selector) => {
    let el = $(selector);
    if (opt.value()) {
        el.removeClass('hide');
    } else {
        el.addClass('hide');
    }

    toggleShowHideButtons();
}

const toggleShowHideButtons = () => {
    let values = [
        app.optShow01.value(),
        app.optShowColumns.value(),
        app.optShowBinary.value(),
        app.optShowDecimal.value(),
        app.optShowHex.value(),
        app.optShowAscii.value(),
    ];

    $('#btnShowAll').prop('disabled', values.every(Boolean));
    $('#btnHideAll').prop('disabled', ! values.some(Boolean));
}

const bindControls = () => {
    $('#optNBits').change(handleNBitsUpdate).keyup(handleNBitsUpdate).mouseup(handleNBitsUpdate);

    $("#btnFillBits").click(fillBits);
    $("#btnClearBits").click(clearBits);
    $("#btnRandomBits").click(setRandomBits);
    $("#btnReset").click(reset);

    $("#btnShowAll").click(showAll);
    $("#btnHideAll").click(hideAll);
}

const bindResults = () => {
    let mapping = {
        'binaryResult'  : handleBinaryUpdate,
        'decimalResult' : handleDecimalUpdate,
        'hexResult'     : handleHexUpdate,
        'asciiResult'   : handleAsciiUpdate
    };

    let el;
    for (const [id, cb] of Object.entries(mapping)) {
        el = $(`#${id}`);
        el.change(cb);
        el.keyup(cb);
        el.mouseup(cb);
    }
}

const handleBitChange = (e) => {
    let id = parseInt($(e.target).attr('data-bit-index'));
    app.bitStates[id] = app.bitStates[id] === 0 ? 1 : 0;
    updateBits();
}

const createDynamicOptions = () => {
    app.optShow01 = new OptionCheckbox($('#optShow01'));
    app.optShowColumns = new OptionCheckbox($('#optShowColumns'));
    app.optShowBinary = new OptionCheckbox($('#optShowBinary'));
    app.optShowDecimal = new OptionCheckbox($('#optShowDecimal'));
    app.optShowHex = new OptionCheckbox($('#optShowHex'));
    app.optShowAscii = new OptionCheckbox($('#optShowAscii'));

    bindDynamicOptions();
    setDynamicOptionDefaults();
}

const bindDynamicOptions = () => {
    app.optShow01.change(() => { toggleShowing(app.optShow01, '.bitLabel'); });
    app.optShowColumns.change(() => { toggleShowing(app.optShowColumns, '.bitColumn'); });
    app.optShowBinary.change(() => { toggleShowing(app.optShowBinary, '#binaryPanel'); });
    app.optShowDecimal.change(() => { toggleShowing(app.optShowDecimal, '#decimalPanel'); });
    app.optShowHex.change(() => { toggleShowing(app.optShowHex, '#hexPanel'); });
    app.optShowAscii.change(() => { toggleShowing(app.optShowAscii, '#asciiPanel'); });
}

const setDynamicOptionDefaults = () => {
    app.optShow01.value(optDefaultShow10);
    app.optShowColumns.value(optDefaultShowColumns);
    app.optShowBinary.value(optDefaultShowBinary);
    app.optShowDecimal.value(optDefaultShowDecimal);
    app.optShowHex.value(optDefaultShowHex);
    app.optShowAscii.value(optDefaultShowAscii);
}

const updateBits = () => {
    drawBits();
    updateResults();
}

const initialize = () => {
    app = new App();

    createDynamicOptions();
    bindControls();
    bindResults();
    reset();
}

// Constants, App, initialize

const minBits = 1;
const maxBits = 16;

const optDefaultShow10 = false;
const optDefaultShowColumns = false;
const optDefaultShowBinary = false;
const optDefaultShowDecimal = false;
const optDefaultShowHex = false;
const optDefaultShowAscii = false;


class App {
    nBits;
    bitStates;
    optShow10;
    optShowColumns;
    optShowBinary;
    optShowDecimal;
    optShowHex;
    optShowAscii;

    constructor() {
        this.reset();
    }

    reset = () => {
        this.nBits = 8;
        this.bitStates = [0, 0, 0, 0, 0, 0, 0, 0];
    }
}

let app;
$(document).ready(initialize);

// TODO replace the below with tools version

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

const pingCopy = selector => {
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
