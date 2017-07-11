function shortcutPickRangePlugin(pluginConfig) {
  return function (fp) {
    var today = new Date(new Date().setHours(0,0,0,0));
    var add = function(num){
      _today = new Date(today)
      result = _today.setDate(_today.getDate() + num)
      return new Date(result)
    };
    var defaultRanges = [
      [add(-1),   today],
      [add(-3),   today],
      [add(-30),  today],
      [add(-60),  today],
      [add(-90),  today]
    ]

    var defaultConfig = {
      shortcut: [
        { activate: false, text: "Last 24 Hours", range: defaultRanges[0] },
        { activate: false, text: "Last 3 Days",   range: defaultRanges[1] },
        { activate: true,  text: "Last 30 Days",  range: defaultRanges[2] },
        { activate: false, text: "Last 60 Days",  range: defaultRanges[3] },
        { activate: false, text: "Last 90 Days",  range: defaultRanges[4] }
      ],
      onChange: function(fp){
        return
      }
    }

    var config = {};
    for (var key in defaultConfig) {
      config[key] = pluginConfig && pluginConfig[key] !== undefined ? pluginConfig[key] : defaultConfig[key];
    }

    config["shortcut"] = config["shortcut"].map(function(c){
      c.range = c.range.map(function(date){ return fp.formatDate(date,"Y-m-d") });
      return c;
    })

    var listContainer = undefined;
    var itemsContainer = [];

    var hooks = {
      onReady: function onReady(){
        // insert shortcutPickRangePanelContainer
        if (fp.calendarContainer === undefined) return;
        fp.shortcutPickRangePanelContainer = fp._createElement("div","flatpickr-shortcutPickRangePanel");
        fp.calendarContainer.prepend(fp.shortcutPickRangePanelContainer);
        fp.monthNav.remove();
        fp.rContainer.prepend(fp.monthNav);
        // insert list container
        listContainer = fp._createElement("ul","flatpickr-shortcut-list");
        config["shortcut"].forEach(function(i){
          itemContainer = fp._createElement("li","flatpickr-shortcut-list-item " + (i.activate ? "activated" : ""),i.text);
          itemContainer.addEventListener("click",function(e){
            fp.setDate(i.range,true);
            fp.close();
          })
          listContainer.appendChild(itemContainer);
          itemsContainer.push(itemContainer);
        })
        fp.shortcutPickRangePanelContainer.appendChild(listContainer);
      },
      onChange: function onChange(){
        if ( fp.selectedDates.length < 2 ) return;
        config.onChange(fp.selectedDates,fp);
      },
      onOpen: function onOpen(){
        // activate item
        if ( fp.selectedDates.length < 2 ) return;
        var selected = fp.selectedDates.map(
          function(date){return fp.formatDate(date,"Y-m-d")}
        );
        config["shortcut"].forEach(function(i,index){
          if (JSON.stringify(i.range) == JSON.stringify(selected)){
            itemsContainer[index].classList.add("activated")
          } else {
            itemsContainer[index].classList.remove("activated")
          };
        });
      }
    }
    return hooks;
  }
}

if (typeof module !== "undefined") module.exports = shortcutPickRangePlugin;
