const showAll = () => {
    app.optShow01.value(true);
    app.optShowColumns.value(true);
    app.optShowBinary.value(true);
    app.optShowDecimal.value(true);
    app.optShowHex.value(true);
    app.optShowAscii.value(true);
    toggleShowHideButtons();
    toggleResetButton();
}

const hideAll = () => {
    app.optShow01.value(false);
    app.optShowColumns.value(false);
    app.optShowBinary.value(false);
    app.optShowDecimal.value(false);
    app.optShowHex.value(false);
    app.optShowAscii.value(false);
    toggleShowHideButtons();
    toggleResetButton();
}

const reset = () => {
    app.reset();
    setDynamicOptionDefaults();

    $("#optNBits").val(8);
    handleNBitsUpdate();

    toggleResetButton();
}

const toggleButton = (el, enabled) => {
    el.prop('disabled', ! enabled);
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

const setRandomBits = () => {
    let dec = Random.random(2 ** app.nBits);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleBinaryFocusout = (e) => {
    let bin = e.target.value.trim();
    if (bin.length === 0) {
        e.target.value = (app.optPadBinary.value()) ? '0'.repeat(app.nBits) : '0';
        handleBinaryUpdate(e);
    }
}

const handleDecimalFocusout = (e) => {
    let dec = e.target.value.trim();
    if (dec.length === 0) {
        e.target.value = '0';
        handleDecimalUpdate(e)
    }
}

const handleHexFocusout = (e) => {
    let hex = e.target.value.trim();
    if (hex.length === 0) {
        e.target.value = '0';
        handleHexUpdate(e);
    }
}

const handleAsciiFocusout = (e) => {
    let ascii = e.target.value;
    if (ascii.length === 0) {
        e.target.value = '&#00;';
        handleAsciiUpdate(e)
    }
}

const handleBinaryUpdate = (e) => {
    let bin = e.target.value.trim();
    if (bin.length === 0) {
        return;
        // bin = 0;
    }

    let dec = parseInt(bin, 2);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleDecimalUpdate = (e) => {
    let dec = e.target.value.trim();
    if (dec.length === 0) {
        return;
        // dec = '0';
    }

    dec = parseInt(dec);

    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleHexUpdate = (e) => {
    let hex = e.target.value.trim();
    if (hex.length === 0) {
        return;
        // hex = '0';
    }

    let dec = parseInt(hex, 16);
    app.bitStates = decimalToBits(dec);
    updateBits();
}

const handleAsciiUpdate = (e) => {
    let ascii = e.target.value;
    if (ascii.length === 0) {
        return;
        // ascii = '';
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

const handlePadBinaryUpdate = () => {
    updateResults();
    toggleResetButton();
}

const handleBitUpdate = (e) => {
    let id = parseInt($(e.target).attr('data-bit-index'));
    app.bitStates[id] = app.bitStates[id] === 0 ? 1 : 0;
    updateBits();
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
    $(".bit").click(handleBitUpdate);

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

    if (! app.optPadBinary.value()) {
        chars = JSTools.trimChars(chars, '0', true, false);

        // at least 1 zero
        if (chars.length === 0) {
            chars = '0';
        }
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

const updateBits = () => {
    drawBits();
    updateResults();
    toggleFillClearButtons();
    toggleResetButton();
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
    toggleResetButton();
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

    toggleButton($('#btnShowAll'), ! values.every(Boolean));
    toggleButton($('#btnHideAll'), values.some(Boolean));
}

const toggleFillClearButtons = () => {
    toggleButton($('#btnFillBits'), ! app.bitStates.every(Boolean));
    toggleButton($('#btnClearBits'), app.bitStates.some(Boolean));
}

const toggleResetButton = () => {
    let checks = [
        app.nBits === 8,
        ! app.bitStates.some(Boolean),

        app.optShow01.value() === optDefaultShow10,
        app.optShowColumns.value() === optDefaultShowColumns,
        app.optShowBinary.value() === optDefaultShowBinary,

        app.optShowDecimal.value() === optDefaultShowDecimal,
        app.optShowHex.value() === optDefaultShowHex,
        app.optShowAscii.value() === optDefaultShowAscii,
        app.optPadBinary.value() === optDefaultPadBinary
    ];

    toggleButton($('#btnReset'), ! checks.every(Boolean));
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
        'binaryResult'  : [handleBinaryUpdate, handleBinaryFocusout],
        'decimalResult' : [handleDecimalUpdate, handleDecimalFocusout],
        'hexResult'     : [handleHexUpdate, handleHexFocusout],
        'asciiResult'   : [handleAsciiUpdate, handleAsciiFocusout]
    };

    let el;
    for (const [id, cbs] of Object.entries(mapping)) {
        [cbUpdate, cbFocusout] = cbs;
        el = $(`#${id}`);
        el.change(cbUpdate);
        el.keyup(cbUpdate);
        el.mouseup(cbUpdate);
        el.focusout(cbFocusout);
    }
}

const copyResult = (el, keyword) => {
    let val = el.val();
    copyToast = Copy.toast(copyToast, val, `Copied ${keyword}: ${val}`);
}

const bindCopyButtons = () => {
    $('#btnCopyBinary').click(() => { copyResult($('#binaryResult'), 'binary'); } );
    $('#btnCopyDecimal').click(() => { copyResult($('#decimalResult'), 'decimal'); } );
    $('#btnCopyHex').click(() => { copyResult($('#hexResult'), 'hex'); } );
    $('#btnCopyAscii').click(() => { copyResult($('#asciiResult'), 'ASCII'); } );
}

const createDynamicOptions = () => {
    app.optShow01 = new OptionCheckbox($('#optShow01'));
    app.optShowColumns = new OptionCheckbox($('#optShowColumns'));
    app.optShowBinary = new OptionCheckbox($('#optShowBinary'));
    app.optShowDecimal = new OptionCheckbox($('#optShowDecimal'));
    app.optShowHex = new OptionCheckbox($('#optShowHex'));
    app.optShowAscii = new OptionCheckbox($('#optShowAscii'));
    app.optPadBinary = new OptionCheckbox($('#optPadBinary'));

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
    app.optPadBinary.change(handlePadBinaryUpdate);
}

const setDynamicOptionDefaults = () => {
    app.optShow01.value(optDefaultShow10);
    app.optShowColumns.value(optDefaultShowColumns);
    app.optShowBinary.value(optDefaultShowBinary);
    app.optShowDecimal.value(optDefaultShowDecimal);
    app.optShowHex.value(optDefaultShowHex);
    app.optShowAscii.value(optDefaultShowAscii)
    app.optPadBinary.value(optDefaultPadBinary);
}

const initialize = () => {
    app = new App();

    createDynamicOptions();
    bindControls();
    bindResults();
    bindCopyButtons();
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
const optDefaultPadBinary = false;

let copyToast = null;

class App {
    nBits;
    bitStates;
    optShow10;
    optShowColumns;
    optShowBinary;
    optShowDecimal;
    optShowHex;
    optShowAscii;
    optPadBinary;

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
