"use strict";

$(document).ready(function () {
    if ($.fn.bootstrapTlp) {
        var bootstrapTooltip = $.fn.tooltip.noConflict();
        $.fn.bootstrapTlp = bootstrapTooltip;
    }
});

//#region class ExecutableTooltip extend from ExecutableBase

incodingExtend(ExecutableTooltip, ExecutableBase);

function ExecutableTooltip() {
}

ExecutableTooltip.prototype.internalExecute = function () {
    var options = {};
    $.extend(options, this.jsonData.options);
    options.content = this.tryGetVal(this.jsonData.options.content);

    var target = $(this.target);

    target.attr('title', options.content)
        .tooltip(options);

    target.on(options.eventOpen, function () {
        target.tooltip("open");
    });

    if (!options.hideByBodyClick) {
        target.on(options.eventClose, function () {
            target.tooltip("close");
        });
    }
    else {
        $('body').on('click', function() {
            target.tooltip("close");
        });
    }
};

//#endregion

//#region class ExecutableSlider extend from ExecutableBase

incodingExtend(ExecutableSlider, ExecutableBase);

function ExecutableSlider() {
}

ExecutableSlider.prototype.internalExecute = function () {
    var current = this;
    var options = {};
    var target = $(current.target);

    $.extend(options, this.jsonData.options);
    $(current.target).wrap('<div>').hide();

    options.change = function (event, ui) {
        $(target).val(ui.value);
        $(target).parent.change();
    };

    $(target.parent()).slider(options);
};

//#endregion

//#region class ExecutableDialog extend from ExecutableBase

incodingExtend(ExecutableDialog, ExecutableBase);

function ExecutableDialog() {
}

ExecutableDialog.Dialogs = [];

ExecutableDialog.prototype.internalExecute = function () {

    var current = this;

    var method = current.jsonData.method;
    switch (method) {
        case 'open':
            if (ExecutableHelper.IsNullOrEmpty($(this.target).attr('id'))) {
                $(current.target).attr('id', ExecutableHelper.Guid());
            }
            var targetId = $(current.target).attr('id');
            if (!ExecutableDialog.Dialogs.contains(targetId)) {
                ExecutableDialog.Dialogs.push(targetId);
            }

            var incActiveDialogClass = 'inc-dialog-active';
            var options = {};
            $.extend(options, current.jsonData.options);
            options.open = function () {
                $(this).addClass(incActiveDialogClass);
                $(this).maxZIndex({ inc: 5, group: '.' + options.dialogClass });
                for (var i = 0; i < ExecutableDialog.Dialogs.length; i++) {
                    if (ExecutableDialog.Dialogs[i] != $(this).attr('id')) {
                        $('#' + ExecutableDialog.Dialogs[i]).removeClass(incActiveDialogClass);
                    }
                }
            };
            options.close = function () {
                $(this).removeClass(incActiveDialogClass);
                if (!options.hideOnClose) {
                    $(this).empty();
                }

                if (ExecutableDialog.Dialogs.length > 0) {
                    var index = $.inArray($(this).attr('id'), ExecutableDialog.Dialogs);
                    ExecutableDialog.Dialogs.remove(index, index);
                    options.open.call($('#' + ExecutableDialog.Dialogs[ExecutableDialog.Dialogs.length - 1]));
                }
            };
            $(current.target).dialog(options);
            break;
        case 'close':
            $(current.target).dialog(method);
            break;
        default:
            throw 'Argument of range {0}'.F(method);
    }

};

//#endregion

//#region class ExecutablePipesNoty extend from ExecutableBase

incodingExtend(ExecutablePinesNoty, ExecutableBase);

function ExecutablePinesNoty() {
}

ExecutablePinesNoty.prototype.internalExecute = function () {

    switch (this.jsonData.method.toString().toLocaleLowerCase()) {
        case 'removeall':
            $.pnotify_remove_all();
            break;
        case 'show':
            var options = {};
            $.extend(options, this.jsonData.options);

            if (!ExecutableHelper.IsNullOrEmpty(options.text)) {
                options.text = this.tryGetVal(options.text);
            }
            if (!ExecutableHelper.IsNullOrEmpty(options.title)) {
                options.title = this.tryGetVal(options.title);
            }

            var stackStr = options.stack.toString();
            if (stackStr === 'bartop') {
                options.stack = { "dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0 };
                options.addclass = "stack-bar-top";
                options.cornerclass = "";
                options.width = '100%';
            } else if (stackStr === 'barbottom') {
                options.stack = { "dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0 };
                options.addclass = "stack-bar-bottom";
                options.width = '100%';
            } else if (stackStr === 'topleft') {
                options.stack = { "dir1": "down", "dir2": "right", "push": "top" };
                options.addclass = "stack-top-left";
            } else if (stackStr === 'topright') {
                options.stack = { "dir1": "down", "dir2": "left", "push": "top" };
                options.addclass = "stack-top-right";
            } else if (stackStr === 'bottomleft') {
                options.stack = { "dir1": "right", "dir2": "up", "push": "top" };
                options.addclass = "stack-bottom-left";
            } else if (stackStr === 'bottomright') {
                options.stack = { "dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25 };
                options.addclass = "stack-bottom-right";
            } else {
                options.stack = false;
            }

            $.pnotify(options);
            break;
        default:
            throw 'Argument of range {0}'.f(this.jsonData.method);
    }
};

//#endregion

//#region class ExecutableBlockUi extend from ExecutableBase

incodingExtend(ExecutableBlockUi, ExecutableBase);

function ExecutableBlockUi() {
}

ExecutableBlockUi.prototype.internalExecute = function () {

    if (!ExecutableHelper.ToBool(this.jsonData.block)) {
        $(this.target).unblock();
        return;
    }
    $(this.target).block(this.jsonData.options);
};

//#endregion

//#region class ExecutableSpinner extend from ExecutableBase

incodingExtend(ExecutableSpinner, ExecutableBase);

function ExecutableSpinner() {

}

ExecutableSpinner.prototype.internalExecute = function () {
    var options = {};
    var current = this;

    $.extend(options, this.jsonData.options);
    $(current.target).spinner(options);
    //$(current.target).hide();
};

//#endregion

//#region class ExecutableDatepicker extend from ExecutableBase

incodingExtend(ExecutableDatepicker, ExecutableBase);

function ExecutableDatepicker() {

}

ExecutableDatepicker.prototype.internalExecute = function () {
    var options = {};
    var current = this;

    $.extend(options, this.jsonData.options);
    $(current.target).datepicker(options);
};

//#endregion

//#region class ExecutableMap extend from ExecutableBase

incodingExtend(ExecutableMap, ExecutableBase);

function ExecutableMap() {
}

ExecutableMap.prototype.internalExecute = function () {
    var current = this;

    var options = {};
    $.extend(options, this.jsonData.options);

    var currentEngine = MapFactory.create(current.target, options);

    $(current.tryGetVal(options.markers)).each(function () {
        ExecutableMap.Markers.push(currentEngine.addMarker(this));
    });

};

ExecutableMap.Markers = [];

//#endregion

//#region class MapEngine 

function MapFactory() {
}

MapFactory.create = function (target, options) {
    var currentEngine = eval('new ' + options.type + 'MapEngine();');
    currentEngine.init(target, options);
    return currentEngine;
};

MapFactory.Instance = {
    gmap: new GoogleMapEngine(),
    bing: new BingMapEngine(),
    yandex: new YandexMapEngine()
};

function GoogleMapEngine() {

    this.map = null;

    this.init = function (target, options) {
        var current = this;

        var mapElement = $('<div>')
            .attr({ id: 'map_canvas', 'class': 'gmap' })
            .css({ width: options.width, height: options.height });
        $(target).html(mapElement);

        var settings = {
            center: new window.google.maps.LatLng(options.latitude, options.longitude),
            zoom: options.zoom,
            mapTypeId: eval('window.google.maps.MapTypeId.{0}'.f(options.displayType.toString().toUpperCase()))
        };

        current.map = new window.google.maps.Map(document.getElementById("map_canvas"), settings);
    };

    this.addMarker = function (dataMarker) {
        var myLatlng = new google.maps.LatLng(dataMarker.latitude, dataMarker.longitude);
        var marker = new google.maps.Marker({
            position: myLatlng,
            draggable: dataMarker.draggable,
            map: this.map
        });

        if (dataMarker.hasInfoWindow) {
            this.addInfoWindow(dataMarker, marker);
        }

        return marker;
    };

    this.addInfoWindow = function (data, marker) {
        var infowindow = new google.maps.InfoWindow({
            content: data.content
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    };
}

function BingMapEngine() {

    this.map = null;

    this.init = function (target, options) {
        var current = this;

        var mapElement = $('<div>')
            .attr({ id: 'bing_map' })
            .css({ width: options.width, height: options.height });
        $(target).html(mapElement);

        var settings = {
            credentials: "AqVhbQp2iYoi4TxnOvmlt4d_Qk65H7zO2uGhR5KSRAgQkN_qxEQsc3PHgQrG_I9J",
            center: new Microsoft.Maps.Location(options.longitude, options.latitude),//(долгота,широта)
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 8
        };

        current.map = new Microsoft.Maps.Map(document.getElementById("bing_map"), settings);
    };

    this.addMarker = function (dataMarker) {
        var center = this.map.getCenter();
        var marker = {
            height: 50,
            width: 50,
            anchor: new Microsoft.Maps.Point(dataMarker.longitude, dataMarker.latitude),
            draggable: dataMarker.draggable
        };

        var pin = new Microsoft.Maps.Pushpin(center, marker);
        this.map.entities.push(pin);

        return marker;
    };
}

function YandexMapEngine() {
    this.init = function (target, options) {
        var myMap;

        // Дождёмся загрузки API и готовности DOM.
        ymaps.ready(init);

        function init() {
            // Создание экземпляра карты и его привязка к контейнеру с
            // заданным id ("map").
            myMap = new ymaps.Map('map', {
                // При инициализации карты обязательно нужно указать
                // её центр и коэффициент масштабирования.
                center: [55.76, 37.64], // Москва
                zoom: 10
            });

        }

    };
}

//#endregion

//#region class ExecutableAutocomplete extend from ExecutableBase

incodingExtend(AutocompliteExecutable, ExecutableBase);

function AutocompliteExecutable() {
}

AutocompliteExecutable.prototype.internalExecute = function () {
    var current = this;
    var options = {};
    $.extend(options, this.jsonData.options);

    $(current.target).autocomplete({
        serviceUrl: options.url,
        minChars: options.minChars
    });
};

//#endregion
