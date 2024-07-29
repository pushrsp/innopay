// const PAY_ACTION_URL = "https://pg.innopay.co.kr"
const PAY_ACTION_URL = "http://localhost:8081"
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SPECIAL_CHAR_REGEX = /[~`':;{}\[\]<>,.!@#$%^&*()_+|\\\/?]/
const NUMBER_REGEX = /^[0-9]+$/
const PAY_METHOD = ["CARD", "BANK", "VBANK", "CARS", "OUTCALL", "CSMS", "DSMS", "CKEYIN", "EPAY", "EBANK"]
const SVC_CD = {
    "CARD": "08",
    "EPAY": "08",
    "BANK": "01",
    "VBANK": "01",
    "CARS": "06",
    "OUTCALL": "12",
    "CSMS": "04",
    "DSMS": "03",
    "CKEYIN": "01",
    "EBANK": "01"
}
const ENCODING_TYPE = ["utf-8", "euc-kr"]

function getEdiDate() {
    const now = new Date()
    let h = now.getHours() ? now.getHours() : 0
    let m = now.getMinutes()
    let s = now.getSeconds()

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    let month = now.getMonth()
    let date = now.getDate()

    month = month < 10 ? '0' + month : month
    date = date < 10 ? '0' + date : date

    return `${now.getFullYear()}${month}${date}${h}${m}${s}`
}

function isMobile(userAgent) {
    return userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) ||
        userAgent.match(/LG|SAMSUNG|Samsung/)
}

function getDevice() {
    const userAgent = navigator.userAgent
    return isMobile(userAgent) ? "mobile" : "pc"
}

function isEmpty(str) {
    return !str || str.length === 0
}

function isValidEmailFormat(email) {
    return EMAIL_REGEX.test(email)
}

function hasSpecialChar(str) {
    return SPECIAL_CHAR_REGEX.test(str)
}

function isNumber(str) {
    return NUMBER_REGEX.test(str)
}

function isValidUserData({BuyerEmail, EncodingType, Moid, MID, Amt, DutyFreeAmt, GoodsName, MerchantKey, PayMethod}) {
    if (isEmpty(PayMethod)) {
        alert("지불수단을 선택해주세요.")
        return false
    }

    if (isEmpty(MID)) {
        alert("상점 MID를 입력해주세요.")
        return false
    }

    if (isEmpty(MerchantKey)) {
        alert("상점 Key를 입력해주세요.")
        return false
    }

    if (isEmpty(Amt)) {
        alert("결제요청금액을 입력해주세요.")
        return false
    }

    if (isEmpty(Moid)) {
        alert("주문번호를 입력해주세요.")
        return false
    }

    if (isEmpty(GoodsName)) {
        alert("상품명을 입력해주세요.")
        return false
    }

    if (!PAY_METHOD.includes(PayMethod)) {
        alert("존재하지 않은 지불수단입니다.")
        return false
    }

    if (!isEmpty(BuyerEmail) && !isValidEmailFormat(BuyerEmail)) {
        alert("구매자 이메일 형식이 맞지 않습니다.")
        return false
    }

    if (hasSpecialChar(Moid)) {
        alert("주문번호에는 특수문자가 허용되지 않습니다.")
        return false
    }

    if (!isNumber(Amt)) {
        alert("거래금액은 숫자만 입력 가능합니다.")
        return false
    }

    if (!isEmpty(DutyFreeAmt) && !isNumber(DutyFreeAmt)) {
        alert("면세금액은 숫자만 입력 가능합니다.")
        return false
    }

    if (EncodingType !== undefined && !ENCODING_TYPE.includes(EncodingType)) {
        alert("utf-8 또는 euc-kr 중 하나를 선택해주세요.")
        return false
    }

    return true
}

function generateKey(mid, amt, dutyFreeAmt, ediDate, merchantKey) {
    let total = parseInt(amt)
    if (!isEmpty(dutyFreeAmt)) {
        total += parseInt(dutyFreeAmt)
    }

    return `${ediDate}${mid}${total}${merchantKey}`
}

function MD5(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
        let lWordCount;
        let lMessageLength = string.length;
        let lNumberOfWords_temp1 = lMessageLength + 8;
        let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        let lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        let utftext = "";

        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext
    }

    let x = Array();
    let k, AA, BB, CC, DD, a, b, c, d;
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    const temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}

function encode64(input) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    } while (i < input.length);
    return output;
}

function getSize() {
    return [(screen.width - 680) / 2, (screen.height - 680) / 2]
}

function getParams(data, device, ediDate, encryptedData) {
    const params = {...data, device, ediDate, EncryptData: encryptedData}
    if (params.device === "pc") {
        params["RequestType"] = "Web"
    } else {
        params["RequestType"] = "Mobile"
    }

    params["svcPrdtCd"] = SVC_CD[params.PayMethod]
    if (params.PayMethod === "CSMS" || params.PayMethod === "DSMS" || params.PayMethod === "OUTCALL") {
        params["RequestType"] = "Web"
    }

    if (params["EncodingType"] === undefined) {
        params["EncodingType"] = "utf-8"
    }

    if (params["GoodsCnt"] === undefined) {
        params["GoodsCnt"] = 1
    }

    return new URLSearchParams(params).toString()
}

const innopay = {
    goPay: (data) => {
        const ediDate = getEdiDate()
        const device = getDevice()

        if (!isValidUserData(data)) {
            return
        }

        const encryptedData = encode64(MD5(generateKey(data.MID, data.Amt, data.DutyFreeAmt, ediDate, data.MerchantKey)))
        const [left, top] = getSize()
        const opts = "left=" + left + ",top=" + top + ",toolbar=no,location=no,directories=no, status=no,menubar=no,scrollbars=no, resizable=no,width=681,height=681"
        const params = getParams(data, device, ediDate, encryptedData)
        const newWindow = window.open(`${PAY_ACTION_URL}?${params}`, "", opts)
        if (newWindow === null) {
            alert("팝업차단 해제 후 다시 시도해 주시기 바랍니다")
        }
    },
}