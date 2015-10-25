$.ajax({
    url: "/menu.html",
    success: function (data) {
        document.getElementById('menu').innerHTML = data;
        var id = '#menu-home';
        if (!isLanding) {
            id = '#menu-' + menu;
        }
        $(id).addClass("pure-menu-selected");
    }
})
