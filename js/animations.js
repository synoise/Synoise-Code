function show(n) {
    if (document.getElementById("t" + n).style.display == "block") {
        document.getElementById("t" + n).style.display = "none";
        document.getElementById("i" + n).style.transform = "rotate(0deg)";
    }
    else {
        document.getElementById("t" + n).style.display = "block";
        document.getElementById("i" + n).style.transform = "rotate(90deg)";
    }
}


function setStep(n) {
    document.getElementById("progbar").style.width = n * 16.666 + "%";
    document.getElementById("steps").innerHTML = "Step " + n + "/6";
}

setStep(0)

function hide() {
    document.getElementById("t1").style.display = "none";
    document.getElementById("t2").style.display = "none";
    document.getElementById("t3").style.display = "none";
    document.getElementById("t4").style.display = "none";
    document.getElementById("im1").style.display = "none";
    document.getElementById("im2").style.display = "initial";
    document.getElementById("im3").style.display = "none";
    document.getElementById("im4").style.display = "none";
    activeted();
}

// hide();

function activeted() {

    //alert(document.getElementById("im"+1).style.display +","+document.getElementById("im"+2).style.display +","+document.getElementById("im"+3).style.display +","+document.getElementById("im"+4).style.display +",")

    if (document.getElementById("im" + 1).style.display == "initial" && document.getElementById("im" + 2).style.display == "initial" && document.getElementById("im" + 3).style.display == "initial" && document.getElementById("im" + 4).style.display == "initial") {
        document.getElementById("btnPO").disabled = false;
        document.getElementById("gdx").style.display = "none";
    }
    else {
        document.getElementById("btnPO").disabled = true;
        document.getElementById("gdx").style.display = "initial";
    }

}

function check_box(event, n) {
    //alert(event.checked+","+n);
    if (event.checked) {
        document.getElementById("im" + n).style.display = "initial";
        $("#i" + n).addClass("grayNow");
    }
    else {
        document.getElementById("im" + n).style.display = "none";
        $("#i" + n).removeClass("grayNow");
    }
    activeted()
}

$('.btnNext').click(function () {
    $('.nav3 > .active').next('li').find('a').trigger('click');
});

$('.btnPrev').click(function () {
    $('.nav3 > .active').prev('li').find('a').trigger('click');
});
