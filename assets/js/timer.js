var myVar = setInterval(myTimer, 1);  // months in JS Date() starts with 0 - so Dec is 11 not 12
var secondsPerYear = 3600. * 24 * 365.25;
var startDate = new Date(2021, 00, 01, 00, 00, 00);
var initialAnnualEmissions = 42.2 * 1e+9;
var annualGrowthRate = 1.022; // 1.022;
var totalBudget = 1111 * 1e+9;


function myTimer() {

    $("#currentrate").text(getCurrentEmissionsPerS().toFixed(0).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'"));
    // .replace(',','*').replace('.',',').replace('*','.')
    var dd = countdownTime(getDoomTime()).split(" ").reverse();
    //console.log(dd.length+' '+dd);
    if (getBudgetLeft() > 0) {
        $("#time-to-two").html("Time left until CO<sub>2</sub> budget on earth depleted")
        if (6 < dd.length)
            $("#timecountdown #years").text(parseInt(dd[6])).css('color', '#000');
        else
            $("#timecountdown #years").text('0').css('color', '#000');
        if (5 < dd.length)
            $("#timecountdown #months").text(parseInt(dd[5])).css('color', '#000');
        else
            $("#timecountdown #months").text('0').css('color', '#000');
        if (4 < dd.length)
            $("#timecountdown #days").text(parseInt(dd[4])).css('color', '#000');
        else
            $("#timecountdown #days").text('0').css('color', '#000');
        $("#timecountdown #hours").text(parseInt(dd[3])).css('color', '#000');
        $("#timecountdown #minutes").text(parseInt(dd[2])).css('color', '#000');
        $("#timecountdown #seconds").text(parseInt(dd[1])).css('color', '#000');
        $("#timecountdown #milliseconds").text(dd[0]).css('color', '#000');  // AR: erased "parseInt" in order to          preserve leading zero
    }
    else {
        $("#time-to-two").html("time since CO<sub>2</sub> budget exhausted")
        if (6 < dd.length)
            $("#timecountdown #years").text(parseInt(dd[6])).css('color', '#f00');
        else
            $("#timecountdown #years").text('0').css('color', '#f00');
        if (5 < dd.length)
            $("#timecountdown #months").text(parseInt(dd[5])).css('color', '#f00');
        else
            $("#timecountdown #months").text('0').css('color', '#f00');
        if (4 < dd.length)
            $("#timecountdown #days").text(parseInt(dd[4])).css('color', '#f00');
        else
            $("#timecountdown #days").text('0').css('color', '#f00');
        $("#timecountdown #hours").text(parseInt(dd[3])).css('color', '#f00');
        $("#timecountdown #minutes").text(parseInt(dd[2])).css('color', '#f00');
        $("#timecountdown #seconds").text(parseInt(dd[1])).css('color', '#f00');
        $("#timecountdown #milliseconds").text(dd[0]).css('color', '#f00');  // AR: erased "parseInt" in order to          preserve leading zero
    }

    var out = [];
    if (getBudgetLeft() > 0) {
        out.push(getBudgetLeft().toFixed(0));
        out.join("")
        $("#carbontonnes").text(out.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'")).css('color', '#000');
    }
    else {
        out.push("exhausted by: " + -getBudgetLeft().toFixed(0));
        out.join("")
        $("#carbontonnes").text(out.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'")).css('color', '#f00');
    }

}

function countdownTime(target) {
    // target should be a Date object

    var now = new Date(), yd, md, dd, hd, nd, sd, ms, out = [];

    if ((target.getTime() - now.getTime()) > 0) {
        yd = target.getFullYear() - now.getFullYear();
        md = target.getMonth() - now.getMonth();
        dd = target.getDate() - now.getDate();
        hd = target.getHours() - now.getHours();
        nd = target.getMinutes() - now.getMinutes();
        sd = target.getSeconds() - now.getSeconds();
    }
    else {
        yd = -target.getFullYear() + now.getFullYear();
        md = -target.getMonth() + now.getMonth();
        dd = -target.getDate() + now.getDate();
        hd = -target.getHours() + now.getHours();
        nd = -target.getMinutes() + now.getMinutes();
        sd = -target.getSeconds() + now.getSeconds();

        if (sd<0) {
          sd+=60
        }
    }
    // negatives need to be dealt with regardless whether the deadline has passed!
    while (true) {
        if (md < 0) {
            yd--;
            md += 12;
        }
        if (dd < 0) {
            md--;
            dd += getDaysInMonth(now.getMonth() - 1, now.getFullYear());
        }
        if (hd < 0) {
            dd--;
            hd += 24;
        }
        if (nd < 0) {
            hd--;
            nd += 60;
        }
        if (sd < 0) {
            nd--;
            sd += 60;
        }
        if (md >= 0 && yd >= 0 && dd >= 0 && hd >= 0 && nd >= 0 && sd >= 0)
            break;
    }

    if (true) //(yd > 0)
        out.push(yd + "y " + (yd == 1 ? "" : ""));
    if (md < 10 && md >= 0)
        out.push("0" + md + "m " + (md == 1 ? "" : ""));
    else if (md >= 10)
        out.push(md + "m ");
    if (dd < 10 && dd >= 0)
        out.push("0" + dd + "d " + (dd == 1 ? "" : ""));
    else if (dd >= 10)
        out.push(dd + "d ");
    if (Math.abs(hd) < 10 && Math.abs(hd) >= 0)
        out.push("0" + hd + "h " + (hd == 1 ? "" : ""));
    else if (hd >= 10)
        out.push(hd + "h ");
    else console.log(hd)
    if (nd < 10 && nd >= 0)
        out.push("0" + nd + "' " + (nd == 1 ? "" : ""));
    else if (nd >= 10)
        out.push(nd + "' ");
    if (sd < 10 && sd >= 0)
        out.push("0" + sd + "'' " + (sd == 1 ? "" : ""));
    else if (sd >= 10)
        out.push(sd + "'' ");

    if ((target.getTime() - now.getTime()) > 0) {
        ms = 99 - now.getMilliseconds().toString().slice(0, 2);
    }
    else {
        ms = now.getMilliseconds().toString().slice(0, 2);
    }
    if (ms < 10 && ms >= 0)
        out.push("0" + ms + "" + (ms == 1 ? "" : ""));
    else if (ms >= 10)
        out.push(ms + "");

    return out.join("");
}

function getDaysInMonth(month, year) {
    if (typeof year == "undefined")
        year = 2015;
    // any non-leap-year works as default
    var currmon = new Date(year, month)
    var nextmon = new Date(year, month + 1);
    return Math.floor((nextmon.getTime() - currmon.getTime()) / (24 * 3600 * 1000));
}

function sPassed() {
    var now = new Date();
    var diff = [];
    diff = Math.floor((now.getTime() - startDate.getTime()) / 1000.);
    return diff;
}

function getCurrentEmissionsPerS() {
    res = initialAnnualEmissions / secondsPerYear * Math.pow(annualGrowthRate, sPassed(startDate) / secondsPerYear);
    return res;
}

function getBudgetLeft() {
    if (annualGrowthRate == 1) {
        budgetUsed = sPassed(startDate) / secondsPerYear * initialAnnualEmissions;
    }
    else {
        budgetUsed = (initialAnnualEmissions / Math.log(annualGrowthRate)) * (Math.pow(annualGrowthRate, sPassed(startDate) / secondsPerYear) - 1);
    }
    res = (totalBudget - budgetUsed);
    return res;
}

function getDoomTime() {
    if (annualGrowthRate == 1) {
        yearsRemaining = totalBudget / initialAnnualEmissions;
    }
    else {
        yearsRemaining = Math.log((totalBudget) / (initialAnnualEmissions) * Math.log(annualGrowthRate) + 1) / Math.log(annualGrowthRate);
    }
    d = new Date(startDate.getTime() + yearsRemaining * secondsPerYear * 1000);
    return d;
}
